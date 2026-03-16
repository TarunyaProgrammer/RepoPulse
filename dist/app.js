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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const github_controller_1 = require("./webhook/github.controller");
const storage_service_1 = require("./services/storage.service");
const event_worker_1 = require("./workers/event.worker");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
// Middleware
app.use(body_parser_1.default.json());
// MongoDB Connection
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/repopulse')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
// Initialize BullMQ Worker
(0, event_worker_1.initWorker)();
// Routes
app.post('/webhook/github', github_controller_1.handleGithubWebhook);
// API Endpoints
app.get('/api/repository/activity', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repoName = req.query.repo || `${process.env.REPO_OWNER}/${process.env.REPO_NAME}`;
    try {
        const activity = yield storage_service_1.StorageService.getRepositoryActivity(repoName);
        if (!activity) {
            return res.status(404).json({ message: 'Repository activity not found' });
        }
        res.json(activity);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.get('/api/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield storage_service_1.StorageService.getRecentEvents();
        res.json(events);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
// Start Server
app.listen(port, () => {
    console.log(`RepoPulse server running at http://localhost:${port}`);
});
