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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const Activity_1 = require("../models/Activity");
const EventLog_1 = require("../models/EventLog");
class StorageService {
    static processEvent(type, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const repoName = payload.repository.full_name;
            // 1. Log the event
            yield EventLog_1.EventLog.create({
                repository: repoName,
                event_type: type,
                payload: payload,
                timestamp: new Date()
            });
            // 2. Update stats
            let activity = yield Activity_1.Activity.findOne({ repository: repoName });
            if (!activity) {
                activity = new Activity_1.Activity({ repository: repoName });
            }
            if (type === 'push') {
                activity.last_push = new Date();
                activity.commits_last_24h += ((_a = payload.commits) === null || _a === void 0 ? void 0 : _a.length) || 0;
            }
            else if (type === 'pull_request') {
                if (payload.action === 'opened') {
                    activity.pull_requests_open += 1;
                }
                else if (payload.action === 'closed') {
                    activity.pull_requests_open = Math.max(0, activity.pull_requests_open - 1);
                }
            }
            else if (type === 'release') {
                activity.releases += 1;
            }
            // Simple activity score calculation
            activity.activity_score = this.calculateScore(activity);
            activity.updated_at = new Date();
            yield activity.save();
        });
    }
    static calculateScore(activity) {
        // Arbitrary score calculation for demo
        const pushScore = (activity.commits_last_24h * 10);
        const prScore = (activity.pull_requests_open * 5);
        const releaseScore = (activity.releases * 20);
        return Math.min(100, pushScore + prScore + releaseScore);
    }
    static getRepositoryActivity(repoName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Activity_1.Activity.findOne({ repository: repoName });
        });
    }
    static getRecentEvents() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            return yield EventLog_1.EventLog.find().sort({ timestamp: -1 }).limit(limit);
        });
    }
}
exports.StorageService = StorageService;
