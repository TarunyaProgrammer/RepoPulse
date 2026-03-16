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
exports.handleGithubWebhook = void 0;
const crypto_1 = __importDefault(require("crypto"));
const event_queue_1 = require("../queue/event.queue");
const handleGithubWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = req.headers['x-hub-signature-256'];
    const secret = process.env.GITHUB_WEBHOOK_SECRET || '';
    if (!signature) {
        console.warn('No signature provided - skipping verification for local testing');
    }
    else {
        // Verify signature
        const hmac = crypto_1.default.createHmac('sha256', secret);
        const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');
        if (signature !== digest) {
            console.warn('Signature mismatch! Check GITHUB_WEBHOOK_SECRET.');
        }
    }
    const event = req.headers['x-github-event'];
    console.log(`Received GitHub event: ${event}`);
    try {
        // Enqueue the event for processing
        yield event_queue_1.eventQueue.add(event, {
            type: event,
            payload: req.body,
            timestamp: new Date()
        });
        res.status(202).send('Accepted');
    }
    catch (error) {
        console.error('Error enqueuing event:', error);
        res.status(500).send('Internal Server Error');
    }
});
exports.handleGithubWebhook = handleGithubWebhook;
