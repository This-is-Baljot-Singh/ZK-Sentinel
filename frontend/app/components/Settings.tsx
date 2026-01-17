'use client';
import { motion } from 'framer-motion';
import { AnimatedGrid } from './AnimatedGrid';
import { PrivacyStatus } from './PrivacyStatus';
import { FloatingNav } from './FloatingNav';
import { useState } from 'react';
import { HelpCircle, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

type NavItem = 'home' | 'documents' | 'activity' | 'settings' | 'voice';

interface SettingsProps {
  activeItem?: NavItem;
  onNavigate?: (item: NavItem) => void;
}

export const Settings = ({ activeItem = 'settings', onNavigate }: SettingsProps) => {
  const { logout } = useAppContext();
  const [enablePIIDetection, setEnablePIIDetection] = useState(true);
  const [autoEncrypt, setAutoEncrypt] = useState(true);
  const [riskThreshold, setRiskThreshold] = useState(70);
  const [redactionLevel, setRedactionLevel] = useState('Partial');

  // New states for Data Handling & Retention
  const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>(['PDF', 'CSV', 'JSON', 'TXT']);
  const [retentionDuration, setRetentionDuration] = useState<30 | 90 | 180>(90);
  const [autoDeleteExpired, setAutoDeleteExpired] = useState(true);

  // New states for Alerts & Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dashboardAlerts, setDashboardAlerts] = useState(true);
  const [minSeverity, setMinSeverity] = useState<'Info' | 'Warning' | 'Critical'>('Info');

  const fileTypeOptions = ['PDF', 'CSV', 'JSON', 'TXT', 'DOCX', 'XLSX'];
  const retentionOptions = [30, 90, 180] as const;


  const toggleFileType = (type: string) => {
    setAllowedFileTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <AnimatedGrid />
      <PrivacyStatus />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-display font-bold text-white mb-2">
            Privacy & Proof Controls
          </h1>
          <p className="text-white/60 font-body text-lg">
            Privacy / Proof Policies, security & system configuration
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Existing sections... */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-display font-semibold text-white mb-4">
              Security
            </h3>
            <p className="text-white/70 font-body">
              Configure security settings and authentication methods.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-display font-semibold text-white mb-4">
              Privacy
            </h3>
            <p className="text-white/70 font-body">
              Manage data sharing and privacy preferences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-display font-semibold text-white mb-4">
              System Configuration
            </h3>
            <p className="text-white/70 font-body">
              Adjust system settings and performance options.
            </p>
          </motion.div>

          {/* Privacy & Security Policies Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-display font-semibold text-white mb-6">
              Privacy / Proof Policies
            </h3>
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-body font-medium">
                      Enable PII Detection
                    </h4>
                    <div className="group relative">
                      <HelpCircle size={16} className="text-white/40" />
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <p className="text-white/80 text-sm font-body">
                          Automatically scan for Personally Identifiable Information like SSN, phone numbers, and email addresses
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/50 font-body text-sm">
                    Automatically detect and flag Personally Identifiable Information
                  </p>
                </div>
                <button
                  onClick={() => setEnablePIIDetection(!enablePIIDetection)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${enablePIIDetection ? 'bg-cyber' : 'bg-white/20'}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${enablePIIDetection ? 'translate-x-7' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-body font-medium">
                        Auto-encrypt Sensitive Financial Evidence
                      </h4>
                      <div className="group relative">
                        <HelpCircle size={16} className="text-white/40" />
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <p className="text-white/80 text-sm font-body">
                            Financial Evidence containing sensitive data will be encrypted at rest using AES-256 encryption
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/50 font-body text-sm">
                      Automatically encrypt Financial Evidence containing sensitive data
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoEncrypt(!autoEncrypt)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${autoEncrypt ? 'bg-cyber' : 'bg-white/20'}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${autoEncrypt ? 'translate-x-7' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-body font-medium">
                      Risk Threshold
                    </h4>
                    <div className="group relative">
                      <HelpCircle size={16} className="text-white/40" />
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <p className="text-white/80 text-sm font-body">
                          Sets the minimum risk score for automatic alerts and policy enforcement actions
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className="text-cyber font-body font-medium">
                    {riskThreshold}%
                  </span>
                </div>
                <p className="text-white/50 font-body text-sm mb-4">
                  Set the minimum risk score for automatic alerts and actions
                </p>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={riskThreshold}
                    onChange={(e) => setRiskThreshold(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyber"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-white/50 text-xs font-body">Low</span>
                    <span className="text-white/50 text-xs font-body">High</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-white font-body font-medium">
                    Redaction Level
                  </h4>
                  <div className="group relative">
                    <HelpCircle size={16} className="text-white/40" />
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <p className="text-white/80 text-sm font-body">
                        Controls how much sensitive information is removed when sharing Financial Evidence with third parties
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-white/50 font-body text-sm mb-4">
                  Control how much sensitive information is removed from shared Financial Evidence
                </p>
                <select
                  value={redactionLevel}
                  onChange={(e) => setRedactionLevel(e.target.value)}
                  className="w-full backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:ring-2 focus:ring-cyber/50"
                >
                  <option value="None">None</option>
                  <option value="Partial">Partial</option>
                  <option value="Full">Full</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Alerts & Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-display font-semibold text-white mb-6">
              Alerts & Notifications
            </h3>
            <div className="space-y-8">
              {/* Email Alerts */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-body font-medium">
                      Email Alerts
                    </h4>
                    <div className="group relative">
                      <HelpCircle size={16} className="text-white/40" />
                      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <p className="text-white/80 text-sm font-body">
                          Receive email notifications for important system events and alerts
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/50 font-body text-sm">
                    Enable email notifications for system alerts
                  </p>
                </div>
                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${emailAlerts ? 'bg-cyber' : 'bg-white/20'}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${emailAlerts ? 'translate-x-7' : 'translate-x-1'}`}
                  />
                </button>
              </div>

              {/* Divider */}
              <div className="pt-4 border-t border-white/10">
                {/* Dashboard Alerts */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-body font-medium">
                        Dashboard Alerts
                      </h4>
                      <div className="group relative">
                        <HelpCircle size={16} className="text-white/40" />
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <p className="text-white/80 text-sm font-body">
                            Show alert notifications directly in the dashboard interface
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/50 font-body text-sm">
                      Show alerts in the dashboard interface
                    </p>
                  </div>
                  <button
                    onClick={() => setDashboardAlerts(!dashboardAlerts)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${dashboardAlerts ? 'bg-cyber' : 'bg-white/20'}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${dashboardAlerts ? 'translate-x-7' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="pt-4 border-t border-white/10">
                {/* Minimum Severity */}
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-white font-body font-medium">
                    Minimum Severity
                  </h4>
                  <div className="group relative">
                    <HelpCircle size={16} className="text-white/40" />
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <p className="text-white/80 text-sm font-body">
                        Set the minimum severity level for notifications (Info, Warning, or Critical)
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-white/50 font-body text-sm mb-4">
                  Select the minimum severity level for notifications
                </p>
                <select
                  value={minSeverity}
                  onChange={(e) => setMinSeverity(e.target.value as 'Info' | 'Warning' | 'Critical')}
                  className="w-full backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-body focus:outline-none focus:ring-2 focus:ring-cyber/50"
                >
                  <option value="Info">Info</option>
                  <option value="Warning">Warning</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* New Data Handling & Retention Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-display font-semibold text-white mb-6">
              Data Handling & Retention
            </h3>
            <div className="space-y-8">
              {/* Allowed File Types */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-white font-body font-medium">
                    Allowed File Types
                  </h4>
                  <div className="group relative">
                    <HelpCircle size={16} className="text-white/40" />
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <p className="text-white/80 text-sm font-body">
                        Restrict uploads to specific file formats for security and compliance purposes
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-white/50 font-body text-sm mb-4">
                  Select file formats allowed for upload
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {fileTypeOptions.map((type) => (
                    <label
                      key={type}
                      className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${allowedFileTypes.includes(type)
                          ? 'bg-cyber/10 border-cyber/30 text-cyber'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={allowedFileTypes.includes(type)}
                        onChange={() => toggleFileType(type)}
                        className="hidden"
                      />
                      <span className="font-body text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>


              {/* Divider */}
              <div className="pt-4 border-t border-white/10">
                {/* Data Retention Duration */}
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-white font-body font-medium">
                    Data Retention Duration
                  </h4>
                  <div className="group relative">
                    <HelpCircle size={16} className="text-white/40" />
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                      <p className="text-white/80 text-sm font-body">
                        Compliance with data protection regulations (GDPR, CCPA) and storage optimization
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-white/50 font-body text-sm mb-4">
                  How long Financial Evidence is stored before automatic deletion
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {retentionOptions.map((days) => (
                    <label
                      key={days}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${!autoDeleteExpired ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${retentionDuration === days
                          ? 'bg-cyber/10 border-cyber/30'
                          : `bg-white/5 border-white/10 ${autoDeleteExpired ? 'hover:bg-white/10' : ''}`
                        }`}
                    >
                      <input
                        type="radio"
                        name="retention"
                        value={days}
                        checked={retentionDuration === days}
                        onChange={() => autoDeleteExpired && setRetentionDuration(days)}
                        disabled={!autoDeleteExpired}
                        className="hidden"
                      />
                      <span className={`text-2xl font-display font-bold ${retentionDuration === days ? 'text-cyber' : !autoDeleteExpired ? 'text-white/40' : 'text-white/70'}`}>
                        {days}
                      </span>
                      <span className={`font-body text-sm mt-1 ${!autoDeleteExpired ? 'text-white/40' : 'text-white/60'}`}>days</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="pt-4 border-t border-white/10">
                {/* Auto-delete Expired Documents */}
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-body font-medium">
                        Auto-delete Expired Financial Evidence
                      </h4>
                      <div className="group relative">
                        <HelpCircle size={16} className="text-white/40" />
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 p-3 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <p className="text-white/80 text-sm font-body">
                            Automatically removes documents that have exceeded the retention period to maintain compliance
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-white/50 font-body text-sm">
                      Automatically delete Financial Evidence after retention period expires
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoDeleteExpired(!autoDeleteExpired)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${autoDeleteExpired ? 'bg-cyber' : 'bg-white/20'}`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${autoDeleteExpired ? 'translate-x-7' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-display font-semibold text-white mb-6">
              Account
            </h3>
            <div className="space-y-4">
              <button
                onClick={logout}
                className="flex items-center gap-3 w-full backdrop-blur-sm bg-red-500/10 border border-red-500/20 rounded-lg px-6 py-4 text-red-400 hover:bg-red-500/20 transition-colors font-body"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <FloatingNav activeItem={activeItem} onNavigate={onNavigate} />
    </div>
  );
};