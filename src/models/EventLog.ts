import { Schema, model } from 'mongoose';

const eventLogSchema = new Schema({
  repository: { type: String, required: true },
  event_type: { type: String, required: true },
  payload: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

export const EventLog = model('EventLog', eventLogSchema);
