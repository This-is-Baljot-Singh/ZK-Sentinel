'use client';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Activity as ActivityIcon, Pause, Play } from 'lucide-react';
import { AnimatedGrid } from './AnimatedGrid';
import { PrivacyStatus } from './PrivacyStatus';
import { FloatingNav } from './FloatingNav';

type NavItem = 'home' | 'documents' | 'activity' | 'settings' | 'voice';

interface ActivityProps {
  activeItem?: NavItem;
  onNavigate?: (item: NavItem) => void;
}

interface ActivityItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'Upload' | 'Analysis' | 'Alert' | 'Policy Action';
  severity: 'Info' | 'Warning' | 'Critical';
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    timestamp: '2024-01-16 11:30 AM',
    title: 'Financial Evidence Uploaded',
    description: 'Financial Statement Q1.pdf uploaded successfully',
    type: 'Upload',
    severity: 'Info',
  },
  {
    id: '2',
    timestamp: '2024-01-16 11:25 AM',
    title: 'Analysis Completed',
    description: 'Risk assessment finished for Transaction History.csv',
    type: 'Analysis',
    severity: 'Info',
  },
  {
    id: '3',
    timestamp: '2024-01-16 11:20 AM',
    title: 'Security Alert',
    description: 'Unusual access pattern detected',
    type: 'Alert',
    severity: 'Warning',
  },
  {
    id: '4',
    timestamp: '2024-01-16 11:15 AM',
    title: 'Policy Updated',
    description: 'Data retention policy automatically enforced',
    type: 'Policy Action',
    severity: 'Info',
  },
  {
    id: '5',
    timestamp: '2024-01-16 11:10 AM',
    title: 'Financial Evidence Analyzed',
    description: 'Credit Report.json analysis completed',
    type: 'Analysis',
    severity: 'Info',
  },
  {
    id: '6',
    timestamp: '2024-01-16 11:05 AM',
    title: 'Upload Failed',
    description: 'Tax Document.pdf upload failed due to file corruption',
    type: 'Upload',
    severity: 'Critical',
  },
  {
    id: '7',
    timestamp: '2024-01-16 11:00 AM',
    title: 'Alert Resolved',
    description: 'Previous security alert has been addressed',
    type: 'Alert',
    severity: 'Info',
  },
];

const activityPool: Omit<ActivityItem, 'id' | 'timestamp'>[] = [
  {
    title: 'Financial Evidence Uploaded',
    description: 'New file uploaded successfully',
    type: 'Upload',
    severity: 'Info',
  },
  {
    title: 'Analysis Started',
    description: 'Risk assessment initiated',
    type: 'Analysis',
    severity: 'Info',
  },
  {
    title: 'Security Alert',
    description: 'Suspicious activity detected',
    type: 'Alert',
    severity: 'Warning',
  },
  {
    title: 'Policy Enforced',
    description: 'Automatic policy action taken',
    type: 'Policy Action',
    severity: 'Info',
  },
  {
    title: 'Upload Error',
    description: 'File upload failed',
    type: 'Upload',
    severity: 'Critical',
  },
  {
    title: 'Analysis Complete',
    description: 'Financial Evidence analysis finished',
    type: 'Analysis',
    severity: 'Info',
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Upload':
      return 'text-cyber';
    case 'Analysis':
      return 'text-cyber-purple';
    case 'Alert':
      return 'text-red-400';
    case 'Policy Action':
      return 'text-green-400';
    default:
      return 'text-white/70';
  }
};

const getTypeAccent = (type: string) => {
  switch (type) {
    case 'Upload':
      return 'border-cyber/20';
    case 'Analysis':
      return 'border-cyber-purple/20';
    case 'Alert':
      return 'border-red-400/20';
    case 'Policy Action':
      return 'border-green-400/20';
    default:
      return 'border-white/10';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Info':
      return 'text-green-400';
    case 'Warning':
      return 'text-cyber-purple';
    case 'Critical':
      return 'text-red-400';
    default:
      return 'text-white/70';
  }
};

const getSeverityShadow = (severity: string) => {
  switch (severity) {
    case 'Info':
      return 'shadow-green-400/20';
    case 'Warning':
      return 'shadow-cyber-purple/20';
    case 'Critical':
      return 'shadow-red-400/20';
    default:
      return '';
  }
};

export const Activity = ({ activeItem = 'activity', onNavigate }: ActivityProps) => {
  const [activities, setActivities] = useState(mockActivities);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('All');
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        const randomActivity = activityPool[Math.floor(Math.random() * activityPool.length)];
        const newActivity: ActivityItem = {
          ...randomActivity,
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString(),
        };
        setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
      }, Math.random() * 2000 + 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  const filteredActivities = activities.filter(activity => {
    if (selectedType !== 'All' && activity.type !== selectedType) return false;
    if (selectedSeverity !== 'All' && activity.severity !== selectedSeverity) return false;
    if (selectedTimeRange !== 'All') {
      const now = new Date();
      const activityTime = new Date(activity.timestamp);
      const hoursDiff = (now.getTime() - activityTime.getTime()) / (1000 * 60 * 60);
      if (selectedTimeRange === 'Last 1h' && hoursDiff > 1) return false;
      if (selectedTimeRange === '24h' && hoursDiff > 24) return false;
      if (selectedTimeRange === '7d' && hoursDiff > 168) return false;
    }
    return true;
  });

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <AnimatedGrid />
      <PrivacyStatus />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-display font-bold text-white mb-2">
                Agent Activity & Verification Log
              </h1>
              <p className="text-white/60 font-body text-lg">
                Real-time Agent Actions & verification events
              </p>
            </div>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3 text-white hover:bg-white/10 transition-colors"
            >
              {isPaused ? <Play size={20} /> : <Pause size={20} />}
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
            {!isPaused && (
              <div className="flex flex-wrap gap-4 mb-6">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-body"
                >
                  <option value="All">All Types</option>
                  <option value="Upload">Upload</option>
                  <option value="Analysis">Analysis</option>
                  <option value="Alert">Alert</option>
                  <option value="Policy Action">Policy Action</option>
                </select>
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-body"
                >
                  <option value="All">All Severities</option>
                  <option value="Info">Info</option>
                  <option value="Warning">Warning</option>
                  <option value="Critical">Critical</option>
                </select>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-body"
                >
                  <option value="All">All Time</option>
                  <option value="Last 1h">Last 1h</option>
                  <option value="24h">Last 24h</option>
                  <option value="7d">Last 7d</option>
                </select>
              </div>
            )}
            {isPaused ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Pause size={64} className="text-white/50 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Updates Paused</h3>
                <p className="text-white/60 font-body text-center mb-6">
                  Real-time Agent Activity updates are currently disabled. Click the play button to resume.
                </p>
                <button
                  onClick={() => setIsPaused(false)}
                  className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-6 py-3 text-white hover:bg-white/20 transition-colors font-body flex items-center gap-2"
                >
                  <Play size={16} /> Resume Updates
                </button>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <ActivityIcon size={64} className="text-white/50 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Agent Actions Found</h3>
                <p className="text-white/60 font-body text-center">
                  No Agent Actions match your current filters. Try adjusting the filters or wait for new events.
                </p>
              </div>
            ) : (
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(activity.severity).replace('text-', 'bg-')} border-2 border-white/20`} />
                      {index < filteredActivities.length - 1 && (
                        <div className="w-px h-16 bg-white/10 mt-2" />
                      )}
                    </div>
                    <div className={`flex-1 backdrop-blur-sm bg-white/5 border ${getTypeAccent(activity.type)} rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer ${getSeverityShadow(activity.severity)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-white font-body font-semibold">{activity.title}</h3>
                          <span className={`text-xs font-body px-2 py-1 rounded-full bg-black/20 ${getSeverityColor(activity.severity)}`}>
                            {activity.severity}
                          </span>
                        </div>
                        <span className={`text-xs font-body ${getTypeColor(activity.type)}`}>
                          {activity.type}
                        </span>
                      </div>
                      <p className="text-white/70 font-body text-sm mb-2">{activity.description}</p>
                      <p className="text-white/50 font-body text-xs">{activity.timestamp}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <FloatingNav activeItem={activeItem} onNavigate={onNavigate} />
    </div>
  );
};