# RepoPulse 🚀

**RepoPulse** is a production-grade, event-driven monitoring pipeline that provides real-time visibility into GitHub repository activity. It transforms raw webhook events into a strategic "Mission Control" dashboard, featuring high-density metrics and a live activity pulse.

![Dashboard Preview](https://via.placeholder.com/1200x600.png?text=RepoPulse+Mission+Control+Dashboard)

## 🌟 Key Features

### 📡 Event-Driven Pipeline
- **Real-time Ingestion**: Securely receives GitHub webhooks (`push`, `pull_request`, `release`).
- **Signature Verification**: Implements HMAC-SHA256 verification to ensure data integrity.
- **Asynchronous Architecture**: Leverages **BullMQ** and **Redis** for non-blocking background processing.
- **Deduplication**: Ensures every event is processed exactly once.

### 📊 Strategic Dashboard
- **Mission Control UI**: A professional, handcrafted 2-column layout built with **React** and **Vite**.
- **Blueprint Aesthetic**: A clean, technical design featuring a custom dot-grid system and high-end glassmorphism.
- **Micro-Animations**: Fluid interactions and entrance animations powered by **Framer Motion**.
- **Real-Time Feed**: A live-updating sidebar showing the "Pulse" of your repository.

### 🛠️ Production Stack
- **Frontend**: React 19, Vite, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, TypeScript.
- **Data & Queue**: MongoDB, Redis, BullMQ.
- **Infrastructure**: Docker & Docker Compose.

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [ngrok](https://ngrok.com/) (to receive real-time webhooks locally)

### 2. Infrastructure Setup
Spin up the MongoDB and Redis containers:
```bash
docker-compose up -d
```

### 3. Backend Setup
1. From the root directory:
   ```bash
   npm install
   cp .env.example .env
   ```
2. Configure your `.env`:
   - `PORT=4100`
   - `GITHUB_WEBHOOK_SECRET=your_secret_here`
3. Start the server:
   ```bash
   npm run dev
   ```

### 4. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open [http://localhost:7180](http://localhost:7180) in your browser.

---

## 🔗 Connecting to GitHub (Real-World)

To see real events on your dashboard, you must expose your local server to GitHub.

1.  **Start ngrok**:
    ```bash
    ngrok http 4100
    ```
2.  **Configure GitHub Webhook**:
    - **Payload URL**: `[Your-ngrok-URL]/webhook/github`
    - **Content type**: `application/json`
    - **Secret**: Must match your `.env`'s `GITHUB_WEBHOOK_SECRET`.
    - **Events**: Select `Pushes`, `Pull requests`, and `Releases`.

---

## 📂 Project Structure

```text
├── src/
│   ├── app.ts            # Entry point & API Routes
│   ├── webhook/          # Webhook controllers & Signature logic
│   ├── workers/          # BullMQ event processors
│   ├── services/         # Storage & Business logic
│   └── models/           # Mongoose schemas
├── frontend/             # Vite + React Dashboard
│   ├── src/App.tsx       # Main UI component
│   └── src/index.css     # Custom "Blueprint" Design System
└── docker-compose.yml    # Infrastructure orchestration
```

## 📜 License
ISC License. Built for the **Webiu 2026 Pre-GSoC Pipeline**.
