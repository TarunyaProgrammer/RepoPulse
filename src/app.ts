import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { handleGithubWebhook } from './webhook/github.controller';
import { StorageService } from './services/storage.service';
import { initWorker } from './workers/event.worker';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/repopulse')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize BullMQ Worker
initWorker();

// Routes
app.post('/webhook/github', handleGithubWebhook);

// API Endpoints
app.get('/api/repository/activity', async (req, res) => {
  const repoName = (req.query.repo as string) || `${process.env.REPO_OWNER}/${process.env.REPO_NAME}`;
  try {
    const activity = await StorageService.getRepositoryActivity(repoName);
    if (!activity) {
      return res.status(404).json({ message: 'Repository activity not found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await StorageService.getRecentEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start Server
app.listen(port, () => {
  console.log(`RepoPulse server running at http://localhost:${port}`);
});
