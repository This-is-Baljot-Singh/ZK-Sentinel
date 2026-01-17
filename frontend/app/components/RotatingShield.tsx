'use client';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export const RotatingShield = () => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 255, 148, 0.2) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-full border-2 border-cyber"
        style={{
          boxShadow: '0 0 40px rgba(0, 255, 148, 0.5)',
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="absolute top-0 left-1/2 w-3 h-3 bg-cyber rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-1/2 w-3 h-3 bg-cyber-purple rounded-full -translate-x-1/2 translate-y-1/2" />
      </motion.div>

      <motion.div
        className="relative z-10"
        animate={{
          rotateY: [0, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Shield className="w-32 h-32 text-cyber" strokeWidth={1.5} />
      </motion.div>

      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-cyber/30"
          style={{
            scale: 1 + i * 0.15,
          }}
          animate={{
            opacity: [0, 0.5, 0],
            scale: [1 + i * 0.15, 1.5 + i * 0.15],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
};
