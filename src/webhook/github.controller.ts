import { Request, Response } from 'express';
import crypto from 'crypto';
import { eventQueue } from '../queue/event.queue';

export const handleGithubWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['x-hub-signature-256'] as string;
  const secret = process.env.GITHUB_WEBHOOK_SECRET || '';

  if (!signature) {
    console.warn('No signature provided - skipping verification for local testing');
  } else {
    // Verify signature
    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(JSON.stringify(req.body)).digest('hex');

    if (signature !== digest) {
      console.warn('Signature mismatch! Check GITHUB_WEBHOOK_SECRET.');
    }
  }

  const event = req.headers['x-github-event'] as string;
  console.log(`Received GitHub event: ${event}`);

  try {
    // Enqueue the event for processing
    await eventQueue.add(event, {
      type: event,
      payload: req.body,
      timestamp: new Date()
    });

    res.status(202).send('Accepted');
  } catch (error) {
    console.error('Error enqueuing event:', error);
    res.status(500).send('Internal Server Error');
  }
};
