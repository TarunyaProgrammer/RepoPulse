import { Schema, model } from 'mongoose';

const activitySchema = new Schema({
  repository: { type: String, required: true, unique: true },
  last_push: { type: Date },
  commits_last_24h: { type: Number, default: 0 },
  pull_requests_open: { type: Number, default: 0 },
  releases: { type: Number, default: 0 },
  activity_score: { type: Number, default: 0 },
  updated_at: { type: Date, default: Date.now }
});

export const Activity = model('Activity', activitySchema);
