import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
import { StorageService } from '../services/storage.service';

dotenv.config();

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const initWorker = () => {
  const worker = new Worker(
    'event-queue',
    async (job: Job) => {
      const { type, payload } = job.data;
      console.log(`Processing job ${job.id} for event type: ${type}`);

      try {
        await StorageService.processEvent(type, payload);
        console.log(`Successfully processed event: ${type}`);
      } catch (error) {
        console.error(`Error processing event ${type}:`, error);
        throw error; // Let BullMQ handle retries
      }
    },
    { connection: connection as any }
  );

  worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed!`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job?.id} failed with error: ${err.message}`);
  });

  console.log('Event Worker initialized');
};
