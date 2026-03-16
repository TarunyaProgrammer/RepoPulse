# RepoPulse — GitHub Event Monitoring Pipeline

RepoPulse is a backend system that processes GitHub activity in real-time using webhooks and asynchronous workers.

## Features
- Real-time GitHub event ingestion.
- Asynchronous processing with BullMQ & Redis.
- Repository activity scoring.
- API endpoints for insights.

## Prerequisites
- Node.js & npm
- Docker (for Redis and MongoDB)

## Setup
1. Clone the repository.
2. Install dependencies: `npm install`
3. Setup environment: `cp .env.example .env` (edit if needed)
4. Start infrastructure: `docker-compose up -d`
5. Run the app: `npm run dev`

## API Endpoints
- `POST /webhook/github`: Receives GitHub webhooks.
- `GET /api/repository/activity`: Returns activity metrics.
- `GET /api/events`: Returns recent event logs.

## Testing with CURL
```bash
# Simulate a Push Event
curl -X POST http://localhost:4000/webhook/github \
  -H "X-GitHub-Event: push" \
  -H "Content-Type: application/json" \
  -d '{
    "repository": { "full_name": "username/example-repo" },
    "commits": [{}, {}],
    "sender": { "login": "octocat" }
  }'
```
