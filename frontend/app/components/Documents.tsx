'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Archive, Trash2 } from 'lucide-react';
import { useState } from 'react';
// 🔴 Remove react-router-dom
// import { useNavigate, useLocation } from 'react-router-dom';
// 🟢 Add Next.js navigation
import { useRouter, usePathname } from 'next/navigation';

import { AnimatedGrid } from './AnimatedGrid';
import { PrivacyStatus } from './PrivacyStatus';
import { FloatingNav } from './FloatingNav';
import { useAppContext } from '../context/AppContext';

type NavItem = 'home' | 'documents' | 'activity' | 'settings' | 'voice';

// ... (Interface DocumentItem and mockDocuments array stay the same) ...
interface DocumentItem {
  id: string;
  name: string;
  type: string;
  uploadTime: string;
  status: 'Analyzed' | 'Pending' | 'Failed';
  riskLevel: 'Low' | 'Medium' | 'High';
  fileSize: string;
  sha256: string;
  sensitiveData: string[];
  riskScore: number;
}

const mockDocuments: DocumentItem[] = [
  // ... (Mock data same as before)
  {
    id: '1',
    name: 'Financial Statement Q1.pdf',
    type: 'PDF',
    uploadTime: '2024-01-15 10:30 AM',
    status: 'Analyzed',
    riskLevel: 'Low',
    fileSize: '1.2 MB',
    sha256: 'a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef',
    sensitiveData: ['Email'],
    riskScore: 15,
  },
  {
    id: '2',
    name: 'Transaction History.csv',
    type: 'CSV',
    uploadTime: '2024-01-14 2:15 PM',
    status: 'Pending',
    riskLevel: 'Medium',
    fileSize: '3.5 MB',
    sha256: 'b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef12',
    sensitiveData: ['Phone Number', 'Address'],
    riskScore: 45,
  },
  {
    id: '3',
    name: 'Credit Report.json',
    type: 'JSON',
    uploadTime: '2024-01-13 9:45 AM',
    status: 'Analyzed',
    riskLevel: 'High',
    fileSize: '0.8 MB',
    sha256: 'c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef1234',
    sensitiveData: ['SSN', 'Credit Card'],
    riskScore: 85,
  },
  {
    id: '4',
    name: 'Tax Document.pdf',
    type: 'PDF',
    uploadTime: '2024-01-12 4:20 PM',
    status: 'Failed',
    riskLevel: 'Medium',
    fileSize: '2.1 MB',
    sha256: 'd4e5f678901234567890abcdef1234567890abcdef1234567890abcdef123456',
    sensitiveData: ['Tax ID'],
    riskScore: 60,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Analyzed':
      return 'text-cyber';
    case 'Pending':
      return 'text-cyber-purple';
    case 'Failed':
      return 'text-red-400';
    default:
      return 'text-white/70';
  }
};

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'Low':
      return 'text-cyber';
    case 'Medium':
      return 'text-cyber-purple';
    case 'High':
      return 'text-red-400';
    default:
      return 'text-white/70';
  }
};

export const Documents = () => {
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // 🟢 Use Next.js hooks
  const router = useRouter();
  const pathname = usePathname();
  
  const { state } = useAppContext();

  const getActiveItem = () => {
    switch (pathname) {
      case '/documents':
        return 'documents';
      case '/activity':
        return 'activity';
      case '/settings':
        return 'settings';
      case '/voice':
        return 'voice';
      default:
        return 'home';
    }
  };

  const handleNavigate = (item: NavItem) => {
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

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <AnimatedGrid />
      <PrivacyStatus />
        {/* ... Rest of the JSX remains exactly the same ... */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-display font-bold text-white mb-2">
            Financial Evidence Vault
          </h1>
          <p className="text-white/60 font-body text-lg">
            Uploaded Financial Evidence & analysis history
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
            {mockDocuments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <FileText size={64} className="text-white/50 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Financial Evidence uploaded yet</h3>
                <p className="text-white/60 font-body text-center mb-6">Upload Financial Evidence to begin secure analysis</p>
                <button className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-6 py-3 text-white hover:bg-white/20 transition-colors font-body">
                  Upload Financial Evidence
                </button>
              </motion.div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Table Header */}
                  <div className="grid grid-cols-5 gap-4 mb-4 pb-4 border-b border-white/10">
                    <div className="text-white/70 font-body text-sm font-semibold">Financial Evidence Name</div>
                    <div className="text-white/70 font-body text-sm font-semibold">Type</div>
                    <div className="text-white/70 font-body text-sm font-semibold">Upload Time</div>
                    <div className="text-white/70 font-body text-sm font-semibold">Status</div>
                    <div className="text-white/70 font-body text-sm font-semibold">Risk Level</div>
                  </div>
                  {/* Table Rows */}
                  {mockDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="grid grid-cols-5 gap-4 p-4 mb-2 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedDocument(doc);
                        setIsDrawerOpen(true);
                      }}
                    >
                      <div className="text-white font-body truncate">{doc.name}</div>
                      <div className="text-white/70 font-body">{doc.type}</div>
                      <div className="text-white/70 font-body text-sm">{doc.uploadTime}</div>
                      <div className={`font-body text-sm font-semibold ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </div>
                      <div className={`font-body text-sm font-semibold ${getRiskColor(doc.riskLevel)}`}>
                        {doc.riskLevel}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-96 backdrop-blur-xl bg-white/5 border-l border-white/10 z-50 p-4"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>
              {selectedDocument && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-white mb-2">{selectedDocument.name}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 font-body text-xs mb-0.5">Upload Timestamp</label>
                      <p className="text-white font-body text-sm">{selectedDocument.uploadTime}</p>
                    </div>
                    <div>
                      <label className="block text-white/70 font-body text-xs mb-0.5">File Size</label>
                      <p className="text-white font-body text-sm">{selectedDocument.fileSize}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-white/70 font-body text-xs mb-0.5">SHA-256 Hash</label>
                      <p className="text-white font-body text-xs break-all">{selectedDocument.sha256}</p>
                    </div>
                    <div>
                      <label className="block text-white/70 font-body text-xs mb-0.5">Analysis Status</label>
                      <p className={`font-body text-sm font-semibold ${getStatusColor(selectedDocument.status)}`}>
                        {selectedDocument.status}
                      </p>
                    </div>
                    <div>
                      <label className="block text-white/70 font-body text-xs mb-0.5">Risk Score</label>
                      <p className="text-white font-body text-sm">
                        {selectedDocument.riskScore} ({selectedDocument.riskLevel})
                      </p>
                    </div>
                    {state.settings.enablePIIDetection ? (
                      <div className="col-span-2">
                        <label className="block text-white/70 font-body text-xs mb-0.5">Detected Sensitive Data (PII Types)</label>
                        <ul className="text-white/90 font-body text-sm list-disc list-inside space-y-0.5">
                          {selectedDocument.sensitiveData.length > 0 ? (
                            selectedDocument.sensitiveData.map((data, idx) => <li key={idx}>{data}</li>)
                          ) : (
                            <li>None detected</li>
                          )}
                        </ul>
                      </div>
                    ) : (
                      <div className="col-span-2">
                        <label className="block text-white/70 font-body text-xs mb-0.5">PII Detection</label>
                        <p className="text-white/60 font-body text-sm">PII detection is disabled in settings</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h3 className="text-base font-bold text-white mb-2">Actions</h3>
                    <div className="flex flex-wrap gap-2">
                      <button className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white hover:bg-white/20 transition-colors font-body text-sm">
                        <Download size={16} /> Download Report
                      </button>
                      <button className="flex items-center gap-2 backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white hover:bg-white/20 transition-colors font-body text-sm">
                        <Archive size={16} /> Archive Financial Evidence
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="flex items-center gap-2 backdrop-blur-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-1.5 text-red-400 hover:bg-red-500/20 transition-colors font-body text-sm"
                      >
                        <Trash2 size={16} /> Delete Financial Evidence
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-60 p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
                <p className="text-white/70 font-body mb-6">
                  Are you sure you want to delete "{selectedDocument?.name}"? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-white/70 hover:text-white font-body"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      // Mock delete - no real action
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-body"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <FloatingNav activeItem={getActiveItem()} onNavigate={handleNavigate} />
    </div>
  );
};