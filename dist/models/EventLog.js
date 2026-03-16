"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventLog = void 0;
const mongoose_1 = require("mongoose");
const eventLogSchema = new mongoose_1.Schema({
    repository: { type: String, required: true },
    event_type: { type: String, required: true },
    payload: { type: mongoose_1.Schema.Types.Mixed },
    timestamp: { type: Date, default: Date.now }
});
exports.EventLog = (0, mongoose_1.model)('EventLog', eventLogSchema);
