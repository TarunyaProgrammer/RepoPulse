import { Activity } from '../models/Activity';
import { EventLog } from '../models/EventLog';

export class StorageService {
  static async processEvent(type: string, payload: any) {
    const repoName = payload.repository.full_name;

    // 1. Log the event
    await EventLog.create({
      repository: repoName,
      event_type: type,
      payload: payload,
      timestamp: new Date()
    });

    // 2. Update stats
    let activity = await Activity.findOne({ repository: repoName });
    if (!activity) {
      activity = new Activity({ repository: repoName });
    }

    if (type === 'push') {
      activity.last_push = new Date();
      activity.commits_last_24h += payload.commits?.length || 0;
    } else if (type === 'pull_request') {
      if (payload.action === 'opened') {
        activity.pull_requests_open += 1;
      } else if (payload.action === 'closed') {
        activity.pull_requests_open = Math.max(0, activity.pull_requests_open - 1);
      }
    } else if (type === 'release') {
      activity.releases += 1;
    }

    // Simple activity score calculation
    activity.activity_score = this.calculateScore(activity);
    activity.updated_at = new Date();

    await activity.save();
  }

  private static calculateScore(activity: any): number {
    // Arbitrary score calculation for demo
    const pushScore = (activity.commits_last_24h * 10);
    const prScore = (activity.pull_requests_open * 5);
    const releaseScore = (activity.releases * 20);
    return Math.min(100, pushScore + prScore + releaseScore);
  }

  static async getRepositoryActivity(repoName: string) {
    return await Activity.findOne({ repository: repoName });
  }

  static async getRecentEvents(limit: number = 10) {
    return await EventLog.find().sort({ timestamp: -1 }).limit(limit);
  }
}
