'use client';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useState } from 'react';

export const PrivacyStatus = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed top-6 right-6 z-50">
      <motion.div
        className="relative"
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        whileHover={{ scale: 1.05 }}
      >
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-full backdrop-blur-xl bg-white/5 border border-cyber/30 cursor-pointer">
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-cyber"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(0, 255, 148, 0.7)',
                '0 0 0 8px rgba(0, 255, 148, 0)',
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
          <span className="text-cyber text-sm font-medium font-body">
            Encrypted & Local
          </span>
          <Shield className="w-4 h-4 text-cyber" />
        </div>

        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full right-0 mt-2 w-72 p-4 rounded-xl backdrop-blur-xl bg-white/10 border border-cyber/20"
          >
            <p className="text-white/90 text-sm font-body leading-relaxed">
              Your data has not left this device. Only the proof is sent to the internet.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
