"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWorker = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
const storage_service_1 = require("../services/storage.service");
dotenv_1.default.config();
const connection = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});
const initWorker = () => {
    const worker = new bullmq_1.Worker('event-queue', (job) => __awaiter(void 0, void 0, void 0, function* () {
        const { type, payload } = job.data;
        console.log(`Processing job ${job.id} for event type: ${type}`);
        try {
            yield storage_service_1.StorageService.processEvent(type, payload);
            console.log(`Successfully processed event: ${type}`);
        }
        catch (error) {
            console.error(`Error processing event ${type}:`, error);
            throw error; // Let BullMQ handle retries
        }
    }), { connection: connection });
    worker.on('completed', (job) => {
        console.log(`Job ${job.id} completed!`);
    });
    worker.on('failed', (job, err) => {
        console.error(`Job ${job === null || job === void 0 ? void 0 : job.id} failed with error: ${err.message}`);
    });
    console.log('Event Worker initialized');
};
exports.initWorker = initWorker;
