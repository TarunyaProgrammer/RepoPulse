"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
const mongoose_1 = require("mongoose");
const activitySchema = new mongoose_1.Schema({
    repository: { type: String, required: true, unique: true },
    last_push: { type: Date },
    commits_last_24h: { type: Number, default: 0 },
    pull_requests_open: { type: Number, default: 0 },
    releases: { type: Number, default: 0 },
    activity_score: { type: Number, default: 0 },
    updated_at: { type: Date, default: Date.now }
});
exports.Activity = (0, mongoose_1.model)('Activity', activitySchema);
