'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Shield, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AnalysisFlowProps {
  onComplete: () => void;
  onPhaseChange?: (phase: Phase) => void;
}

type Phase = 'upload' | 'scan' | 'shield' | 'verify' | 'complete';

export const AnalysisFlow = ({ onComplete, onPhaseChange }: AnalysisFlowProps) => {
  const [phase, setPhase] = useState<Phase>('upload');
  const [showStamp, setShowStamp] = useState(false);
  const [binaryDrops, setBinaryDrops] = useState<{ left: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate random binary drops on client only
    const drops = Array.from({ length: 40 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 1 + Math.random(),
    }));
    setBinaryDrops(drops);
  }, []);

  useEffect(() => {
    if (phase === 'upload') {
      const timer = setTimeout(() => {
        setPhase('scan');
        onPhaseChange?.('scan');
      }, 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'scan') {
      const timer = setTimeout(() => {
        setPhase('shield');
        onPhaseChange?.('shield');
      }, 2500);
      return () => clearTimeout(timer);
    } else if (phase === 'shield') {
      const timer = setTimeout(() => {
        setPhase('verify');
        onPhaseChange?.('verify');
      }, 2500);
      return () => clearTimeout(timer);
    } else if (phase === 'verify') {
      const timer = setTimeout(() => {
        setPhase('complete');
        onPhaseChange?.('complete');
        setShowStamp(true);
        setTimeout(onComplete, 2000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete, onPhaseChange]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-black/80">
      <div className="relative w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {phase === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center"
            >
              <FileText className="w-24 h-24 text-cyber mb-6" />
              <p className="text-white/80 font-body text-xl">
                Processing document...
              </p>
            </motion.div>
          )}

          {phase === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-64 h-64 mb-8">
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="relative w-32 h-32">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyber to-cyber-purple"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-midnight border-2 border-cyber" />
                    </div>
                  </div>
                </motion.div>

                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-1 h-20 bg-cyber origin-bottom"
                    style={{
                      rotate: i * 45,
                      transformOrigin: 'center bottom',
                    }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: [0, 1, 0] }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 0.8,
                    }}
                  />
                ))}

                <div className="absolute inset-0 overflow-hidden">
                  {binaryDrops.map((drop, i) => (
                    <motion.span
                      key={i}
                      className="absolute text-cyber/40 font-mono text-xs"
                      style={{
                        left: `${drop.left}%`,
                        top: '-10px',
                      }}
                      animate={{
                        top: ['0%', '120%'],
                      }}
                      transition={{
                        duration: drop.duration,
                        repeat: Infinity,
                        delay: drop.delay,
                        ease: 'linear',
                      }}
                    >
                      {Math.random() > 0.5 ? '1' : '0'}
                    </motion.span>
                  ))}
                </div>
              </div>

              <motion.p
                className="text-white/80 font-body text-xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Deconstructing Financial History...
              </motion.p>
            </motion.div>
          )}

          {/* ... Rest of the file (shield, verify, complete phases) stays exactly the same ... */}
          
          {phase === 'shield' && (
            <motion.div
              key="shield"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-64 h-64 mb-8">
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <motion.div
                    className="relative"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  >
                    <Shield className="w-32 h-32 text-cyber" strokeWidth={1.5} />
                  </motion.div>
                </motion.div>

                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border-2 border-cyber rounded-full"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [1, 1.5],
                      opacity: [0.8, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.6,
                    }}
                  />
                ))}

                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <motion.p
                className="text-white/80 font-body text-xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Generating Zero-Knowledge Proof...
              </motion.p>
            </motion.div>
          )}

          {phase === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-64 h-64 mb-8">
                <motion.div
                  className="absolute top-0 left-1/2 w-2 h-full bg-gradient-to-b from-cyber to-transparent origin-top"
                  style={{ x: '-50%' }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />

                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Shield className="w-24 h-24 text-cyber" />
                </motion.div>

                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 w-32 h-1 bg-cyber/30"
                    style={{
                      top: `${20 + i * 15}%`,
                      x: '-50%',
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                  />
                ))}
              </div>

              <motion.p
                className="text-white/80 font-body text-xl"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Broadcasting to Blockchain...
              </motion.p>
            </motion.div>
          )}

          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <motion.div
                className="relative mb-8"
                initial={{ rotate: -45, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-cyber/20"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0, 1],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <CheckCircle className="w-32 h-32 text-cyber relative z-10" />
              </motion.div>

              {showStamp && (
                <motion.div
                  className="relative"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <div className="text-6xl font-display font-black text-cyber border-4 border-cyber px-12 py-6 rounded-xl transform -rotate-6">
                    VERIFIED
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-cyber/20"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.1, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};