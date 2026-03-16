import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Activity, 
  GitCommit, 
  GitPullRequest, 
  Tag, 
  Clock, 
  Zap,
  Github,
  Ship,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

interface ActivityData {
  repository: string;
  last_push: string;
  commits_last_24h: number;
  pull_requests_open: number;
  releases: number;
  activity_score: number;
  updated_at: string;
}

interface RepoEvent {
  _id: string;
  event_type: string;
  payload: any;
  timestamp: string;
}

const App: React.FC = () => {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [events, setEvents] = useState<RepoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      const [activityRes, eventsRes] = await Promise.all([
        axios.get('/api/repository/activity'),
        axios.get('/api/events')
      ]);
      setActivity(activityRes.data);
      setEvents(eventsRes.data);
      setError(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Faster polling for real-time feel
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#020205]">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[#00d2ff] font-black text-2xl tracking-widest uppercase italic"
        >
          Calibrating Pulse...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-overlay" />
      
      <main className="dashboard-root">
        
        {/* Left Side: Main Dash */}
        <div className="flex flex-col gap-12">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row justify-between items-start gap-8 mt-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="dashboard-title italic"
              >
                REPO<span className="text-[#00d2ff]">PULSE</span>
              </motion.h1>
              <div className="flex gap-4 items-center">
                <div className="status-check bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  Internal Node: Active
                </div>
                <p className="text-[#94a3b8] font-medium flex items-center gap-2">
                  <Github className="w-4 h-4" /> {activity?.repository || 'System Standby'}
                </p>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="score-badge flex items-center gap-6"
            >
              <div className="text-right">
                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/60 mb-1">Index Score</p>
                <div className="score-value tracking-tighter text-white">{activity?.activity_score || 0}</div>
              </div>
              <div className="p-3 bg-white/20 rounded-2xl">
                <Activity className="w-8 h-8 text-white" />
              </div>
            </motion.div>
          </header>

          {/* Metrics Grid */}
          <section className="metrics-grid">
            <MetricCard 
              label="Last Ingest" 
              value={activity?.last_push ? new Date(activity.last_push).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '---'} 
              sub={activity?.last_push ? new Date(activity.last_push).toLocaleDateString() : 'NO RECENT DATA'}
              icon={<Clock className="w-5 h-5 text-[#00d2ff]" />}
            />
            <MetricCard 
              label="Commit Vol (24h)" 
              value={activity?.commits_last_24h || 0} 
              icon={<GitCommit className="w-5 h-5 text-[#6366f1]" />}
            />
            <MetricCard 
              label="PR Frequency" 
              value={activity?.pull_requests_open || 0} 
              icon={<GitPullRequest className="w-5 h-5 text-[#22d3ee]" />}
            />
            <MetricCard 
              label="Production Cycles" 
              value={activity?.releases || 0} 
              icon={<Ship className="w-5 h-5 text-emerald-400" />}
            />
          </section>

          {/* Error State */}
          {error && (
            <div className="card-glass p-6 border-red-500/30 bg-red-500/5 flex items-center gap-4">
              <AlertCircle className="text-red-500" />
              <p className="text-sm font-semibold">Telemetry connection weak. Retrying automated fetch...</p>
            </div>
          )}

          {/* Large Hero Card (Space for Graph later) */}
          <div className="card-glass flex-1 min-h-[400px] p-8 flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#00d2ff]/10 border border-[#00d2ff]/30 flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-[#00d2ff]" />
            </div>
            <h3 className="text-2xl font-bold mb-2 tracking-tight">System Optimized</h3>
            <p className="text-[#94a3b8] max-w-md">Continuous monitoring active for {activity?.repository}. Dynamic score aggregation in progress.</p>
          </div>
        </div>

        {/* Right Side: Event Pulse */}
        <aside className="pulse-sidebar">
          <div className="card-glass flex-1 flex flex-col">
            <div className="feed-header">
              <span className="flex items-center gap-2">EVENT PULSE</span>
              <div className="live-indicator">
                <motion.div 
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="pulse-dot" 
                />
                Live
              </div>
            </div>
            
            <div className="feed-items custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {events.length > 0 ? (
                  events.map((event, idx) => (
                    <EventItem key={event._id} event={event} index={idx} />
                  ))
                ) : (
                  <div className="text-center py-20 opacity-30 italic font-medium">Listening for events...</div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 border-t border-white/5 text-[10px] text-center text-[#94a3b8] font-bold tracking-widest uppercase">
              RepoPulse Terminal v1.1
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
};

const MetricCard: React.FC<{label: string, value: any, sub?: string, icon: React.ReactNode}> = ({ label, value, sub, icon }) => (
  <motion.div 
    whileHover={{ scale: 1.02, y: -5 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="card-glass"
  >
    <div className="metric-card-inner">
      <div className="metric-header">
        <span className="metric-label">{label}</span>
        <div className="icon-box">{icon}</div>
      </div>
      <div className="metric-value-large">{value}</div>
      {sub && <div className="text-[#94a3b8] text-[10px] font-bold mt-2 tracking-widest">{sub}</div>}
      
      {/* Decorative Glow */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#00d2ff]/5 blur-3xl rounded-full" />
    </div>
  </motion.div>
);

const EventItem: React.FC<{event: RepoEvent, index: number}> = ({ event, index }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ delay: index * 0.05 }}
    className="mb-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group"
  >
    <div className="flex justify-between items-center mb-2">
      <span className={`text-[9px] font-black px-2 py-0.5 rounded tracking-widest uppercase ${
        event.event_type === 'push' ? 'bg-cyan-500/20 text-cyan-400' : 
        event.event_type === 'pull_request' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'
      }`}>
        {event.event_type}
      </span>
      <span className="text-[10px] font-mono opacity-30">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
    <div className="text-xs font-medium text-white/70">
      <span className="text-[#00d2ff] font-bold">@</span>{event.payload.sender?.login}
      <span className="opacity-50 ml-1">triggered atomic update</span>
    </div>
    
    {/* Micro interaction glow */}
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#00d2ff] opacity-0 group-hover:opacity-100 transition-opacity rounded-r" />
  </motion.div>
);

export default App;
