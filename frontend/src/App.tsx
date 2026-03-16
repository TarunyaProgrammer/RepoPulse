import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Activity, 
  GitCommit, 
  GitPullRequest, 
  Clock, 
  Github,
  Box,
  ExternalLink,
  ChevronRight
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
  payload: {
    sender?: {
      login: string;
    };
  };
  timestamp: string;
}

const App: React.FC = () => {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [events, setEvents] = useState<RepoEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [activityRes, eventsRes] = await Promise.all([
        axios.get('/api/repository/activity'),
        axios.get('/api/events')
      ]);
      setActivity(activityRes.data);
      setEvents(eventsRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return null;

  return (
    <div className="app-container">
      
      {/* Main Content Area */}
      <main className="flex flex-col gap-10">
        
        {/* Header Unit */}
        <header className="flex justify-between items-end border-b border-white/[0.05] pb-8">
          <div>
            <h1 className="dashboard-title">
              Repo<span className="text-blue-500">Pulse</span>
            </h1>
            <div className="status-indicator">
              <div className="dot-pulse" />
              <span>System Operational</span>
              <span className="mx-2 opacity-20">|</span>
              <Github size={14} className="opacity-50" />
              <span className="font-medium text-xs">{activity?.repository}</span>
            </div>
          </div>
          
          <div className="text-right">
            <span className="section-label">Pulse Score</span>
            <div className="text-4xl font-black text-white mt-1 leading-none">
              {activity?.activity_score}
            </div>
          </div>
        </header>

        {/* Primary Metrics */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Activity size={18} className="text-blue-500" />
            <h2 className="text-lg font-bold">Repository Health</h2>
          </div>
          
          <div className="metrics-grid">
            <MetricTile 
              title="Commits (24h)" 
              value={activity?.commits_last_24h || 0} 
              icon={<GitCommit size={20} />} 
              color="text-blue-400"
            />
            <MetricTile 
              title="Open PRs" 
              value={activity?.pull_requests_open || 0} 
              icon={<GitPullRequest size={20} />} 
              color="text-purple-400"
            />
            <MetricTile 
              title="Releases" 
              value={activity?.releases || 0} 
              icon={<Box size={20} />} 
              color="text-emerald-400"
            />
          </div>
        </section>

        {/* Secondary Info Area */}
        <div className="info-row">
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="section-label">Last Synchronization</span>
              <Clock size={16} className="text-slate-500" />
            </div>
            <div className="text-xl font-bold">
              {activity?.last_push ? new Date(activity.last_push).toLocaleTimeString() : '---'}
            </div>
            <div className="text-sm text-slate-500 mt-1">
              {activity?.last_push ? new Date(activity.last_push).toDateString() : 'No recent activity'}
            </div>
          </div>

          <div className="glass-panel p-6 flex flex-col justify-center items-center text-center group cursor-pointer hover:bg-white/[0.03]">
             <ExternalLink size={24} className="text-slate-600 mb-2 group-hover:text-blue-500 transition-colors" />
             <span className="text-sm font-semibold">View Repository</span>
          </div>
        </div>
      </main>

        <aside className="sidebar">
          <div className="glass-panel feed-container">
            <div className="feed-header flex justify-between items-center group">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                LIVE EVENT FEED
              </span>
              <span className="opacity-20 text-[9px] font-mono tracking-tighter">V1.2.0</span>
            </div>
            <div className="feed-scroll">
            <AnimatePresence mode="popLayout">
              {events.map((event) => (
                <FeedItem key={event._id} event={event} />
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center">
          Continuous Ingestion Active
        </div>
      </aside>

    </div>
  );
};

const MetricTile: React.FC<{title: string, value: number, icon: React.ReactNode, color: string}> = ({ title, value, icon, color }) => (
  <div className="glass-panel metric-card">
    <div className="flex justify-between items-start mb-2">
      <span className="section-label text-[10px]">{title}</span>
      <div className={`${color} opacity-80`}>{icon}</div>
    </div>
    <div className="metric-value py-2">{value}</div>
    <div className="w-12 h-1 bg-slate-800 rounded-full mt-4 overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        className={`h-full ${color.replace('text', 'bg')}`}
      />
    </div>
  </div>
);

const FeedItem: React.FC<{event: RepoEvent}> = ({ event }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="feed-item"
  >
    <div className="flex items-center justify-between mb-1">
      <span className={`badge badge-${event.event_type}`}>
        {event.event_type}
      </span>
      <span className="text-[10px] text-slate-500 font-mono">
        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
    <div className="text-sm font-medium flex items-center gap-1 mt-2">
      <span className="text-blue-500">@</span>
      {event.payload.sender?.login}
      <ChevronRight size={12} className="opacity-20" />
    </div>
  </motion.div>
);

export default App;
