'use client';

import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

import { useRouter, usePathname } from 'next/navigation';

import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedGrid } from './AnimatedGrid';
import { DigitalPassport } from './DigitalPassport';
import { AnalysisFlow } from './AnalysisFlow';
import { FloatingNav } from './FloatingNav';
import { PrivacyStatus } from './PrivacyStatus';
import { ProfileDropdown } from './ProfileDropdown';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';


export const Dashboard = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  // 🟢 Use Next.js hooks
  const router = useRouter();
  const pathname = usePathname();

  const { updateAgent, addActivity, updateZKProof, state } = useAppContext();

  const displayName = state.user?.email || state.user?.phone || 'User';

  const getActiveItem = () => {
    // 🟢 Use pathname instead of location.pathname
    switch (pathname) {
      case '/documents':
        return 'documents';
      case '/activity':
        return 'activity';
      case '/voice':
        return 'voice';
      case '/settings':
        return 'settings';
      default:
        return 'home';
    }
  };

  const handleNavigate = (item: 'home' | 'documents' | 'activity' | 'settings' | 'voice') => {
    // 🟢 Use router.push instead of navigate
    switch (item) {
      case 'home':
        router.push('/');
        break;
      case 'documents':
        router.push('/documents');
        break;
      case 'activity':
        router.push('/activity');
        break;
      case 'voice':
        router.push('/voice');
        break;
      case 'settings':
        router.push('/settings');
        break;
    }
  };

  const handleFileUpload = () => {
    toast.success('Financial Evidence uploaded successfully', {
      description: 'Starting analysis...',
      duration: 2000,
    });
    setIsAnalyzing(true);
    // Start Document Auditor
    updateAgent('2', { status: 'Running', lastUpdated: Date.now() });
    addActivity({
      timestamp: Date.now(),
      title: 'Document Auditor Started',
      description: 'Initiating document audit process',
      type: 'Analysis',
      severity: 'Info',
    });
  };

  const handlePhaseChange = (phase: 'upload' | 'scan' | 'shield' | 'verify' | 'complete') => {
    const now = Date.now();
    if (phase === 'scan') {
      // Document Auditor completes
      updateAgent('2', { status: 'Completed', lastUpdated: now });
      addActivity({
        timestamp: now,
        title: 'Document Auditor Completed',
        description: 'Document audit process finished successfully',
        type: 'Analysis',
        severity: 'Info',
      });
      // PII Detection if enabled
      if (state.settings.enablePIIDetection) {
        addActivity({
          timestamp: now,
          title: 'PII Detection Completed',
          description: 'Personally Identifiable Information scanned and flagged',
          type: 'Analysis',
          severity: 'Info',
        });
      }
    } else if (phase === 'shield') {
      // Cross-Verifier starts
      updateAgent('3', { status: 'Running', lastUpdated: now });
      addActivity({
        timestamp: now,
        title: 'Cross-Verifier Started',
        description: 'Initiating cross-reference verification',
        type: 'Analysis',
        severity: 'Info',
      });
    } else if (phase === 'verify') {
      // Cross-Verifier completes, Financial Analyst starts
      updateAgent('3', { status: 'Completed', lastUpdated: now });
      addActivity({
        timestamp: now,
        title: 'Cross-Verifier Completed',
        description: 'Cross-reference verification finished',
        type: 'Analysis',
        severity: 'Info',
      });
      updateAgent('4', { status: 'Running', lastUpdated: now });
      addActivity({
        timestamp: now,
        title: 'Financial Analyst Started',
        description: 'Beginning financial data analysis',
        type: 'Analysis',
        severity: 'Info',
      });
    } else if (phase === 'complete') {
      // Financial Analyst completes
      updateAgent('4', { status: 'Completed', lastUpdated: now });
      addActivity({
        timestamp: now,
        title: 'Financial Analyst Completed',
        description: 'Financial analysis and risk assessment complete',
        type: 'Analysis',
        severity: 'Info',
      });
      // Start ZK-Cryptographer
      updateAgent('5', { status: 'Running', lastUpdated: now });
      addActivity({
        timestamp: now,
        title: 'ZK-Cryptographer Started',
        description: 'Initiating zero-knowledge proof generation',
        type: 'Analysis',
        severity: 'Info',
      });
    }
  };

  const generateProof = () => {
    const now = Date.now();
    updateZKProof({ status: 'Generating' });
    addActivity({
      timestamp: now,
      title: 'ZK Proof Generation Started',
      description: 'Generating zero-knowledge proof for verification',
      type: 'Analysis',
      severity: 'Info',
    });
    // Simulate generation
    setTimeout(() => {
      const proofId = 'zk_' + Math.random().toString(36).substr(2, 9);
      updateZKProof({ status: 'Generated', proofId, generatedAt: now });
      updateAgent('5', { status: 'Completed', lastUpdated: now });
      addActivity({
        timestamp: now,
        title: 'ZK Proof Generated',
        description: `Zero-knowledge proof ${proofId} generated successfully`,
        type: 'Analysis',
        severity: 'Info',
      });
    }, 3000);
  };

  const submitOnChain = () => {
    const now = Date.now();
    updateZKProof({ status: 'Submitting' });
    updateAgent('6', { status: 'Running', lastUpdated: now });
    addActivity({
      timestamp: now,
      title: 'On-Chain Submission Started',
      description: 'Submitting credential to blockchain network',
      type: 'Analysis',
      severity: 'Info',
    });
    // Simulate submission
    setTimeout(() => {
      updateZKProof({ status: 'Submitted', submittedAt: now, network: 'Polygon Amoy' });
      updateAgent('6', { status: 'Completed', lastUpdated: now });
      addActivity({
        timestamp: now,
        title: 'Credential Issued',
        description: 'Credential successfully issued on Polygon Amoy network',
        type: 'Analysis',
        severity: 'Info',
      });
    }, 4000);
  };

  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);
    setIsVerified(true);
    toast.success('Verification complete!', {
      description: 'Your Financial Passport is ready.',
      duration: 3000,
    });
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <AnimatedGrid />
      <PrivacyStatus />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start mb-12"
        >
          <div>
            <h1 className="text-5xl font-display font-bold text-white mb-2">
              Hello, {displayName}
            </h1>
            <p className="text-white/60 font-body text-lg">
              Your secure gateway to decentralized finance
            </p>
          </div>
          <ProfileDropdown />
        </motion.div>

        <div className="mb-12">
          <DigitalPassport
            isVerified={isVerified}
            creditScore={isVerified ? 780 : undefined}
            riskLevel={isVerified ? 'Low' : undefined}
            maxLoanEligibility={isVerified ? '$50,000' : undefined}
          />
        </div>

        {!isVerified && (
          <div className="max-w-2xl mx-auto">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-display font-semibold text-white mb-4">
                Get Started
              </h3>
              <p className="text-white/70 font-body mb-6 leading-relaxed">
                Start with voice identity verification, then upload your Financial Evidence to generate your Zero-Knowledge proof
                and unlock instant credit verification.
              </p>

              <div className="flex gap-4 mb-6">
                <button
                  // 🟢 Use router.push
                  onClick={() => router.push('/voice')}
                  className="backdrop-blur-sm bg-cyber/20 border border-cyber/30 rounded-lg px-6 py-3 text-cyber hover:bg-cyber/30 transition-colors font-body flex items-center gap-2"
                >
                  Start Voice Interview
                </button>
              </div>

              <motion.label
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative block w-full cursor-pointer group"
              >
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.json"
                  onChange={handleFileUpload}
                />
                <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-white/20 group-hover:border-cyber/50 transition-colors p-12 text-center">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyber/5 to-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <Upload className="w-12 h-12 text-white/40 group-hover:text-cyber transition-colors mx-auto mb-4" />
                  <p className="text-white/80 font-body mb-2">
                    Drop your Financial Evidence here
                  </p>
                  <p className="text-white/50 text-sm font-body">
                    Supports PDF and JSON formats
                  </p>
                </div>
              </motion.label>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 rounded-xl bg-cyber/5 border border-cyber/20"
              >
                <p className="text-cyber/90 text-sm font-body text-center">
                  Sentinel is paying the gas fees for you...
                </p>
              </motion.div>
            </div>
          </div>
        )}

        {isVerified && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto space-y-8"
          >
            {/* ... Rest of stats section ... */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: 'Active Loans', value: '0', color: 'text-cyber' },
                { label: 'Total Borrowed', value: '$0', color: 'text-cyber-purple' },
                { label: 'Reputation Score', value: '100%', color: 'text-cyber' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-6 text-center"
                >
                  <p className="text-white/60 font-body text-sm mb-2">{stat.label}</p>
                  <p className={`text-3xl font-display font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-display font-semibold text-white mb-6">
                Agent Pipeline
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {state.agents.map((agent, i) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 text-center"
                  >
                    <div className="text-white font-body font-medium mb-2">{agent.name}</div>
                    <div className="text-white/60 font-body text-sm mb-2">{agent.role}</div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-body ${
                      agent.status === 'Idle' ? 'bg-gray-500/20 text-gray-400' :
                      agent.status === 'Running' ? 'bg-cyber/20 text-cyber animate-pulse' :
                      agent.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {agent.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {state.zkProof.status === 'NotGenerated' && (
              <div className="text-center">
                <button
                  onClick={generateProof}
                  className="backdrop-blur-sm bg-cyber/20 border border-cyber/30 rounded-lg px-8 py-4 text-cyber hover:bg-cyber/30 transition-colors font-body flex items-center gap-2 mx-auto"
                >
                  Generate ZK Proof
                </button>
              </div>
            )}

            {state.zkProof.status === 'Generating' && (
              <div className="text-center">
                <p className="text-cyber font-body">Generating ZK Proof...</p>
              </div>
            )}

            {state.zkProof.status === 'Generated' && (
              <div className="text-center space-y-4">
                <p className="text-cyber font-body">ZK Proof Generated: {state.zkProof.proofId}</p>
                <button
                  onClick={submitOnChain}
                  className="backdrop-blur-sm bg-green-500/20 border border-green-500/30 rounded-lg px-8 py-4 text-green-400 hover:bg-green-500/30 transition-colors font-body flex items-center gap-2 mx-auto"
                >
                  Submit On-Chain
                </button>
              </div>
            )}

            {state.zkProof.status === 'Submitting' && (
              <div className="text-center">
                <p className="text-green-400 font-body">Submitting to {state.zkProof.network}...</p>
              </div>
            )}

            {state.zkProof.status === 'Submitted' && (
              <div className="text-center">
                <p className="text-green-400 font-body">Credential Issued on {state.zkProof.network}</p>
                <p className="text-white/60 font-body text-sm">Proof ID: {state.zkProof.proofId}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <FloatingNav activeItem={getActiveItem()} onNavigate={handleNavigate} />

      {isAnalyzing && <AnalysisFlow onComplete={handleAnalysisComplete} onPhaseChange={handlePhaseChange} />}
    </div>
  );
};