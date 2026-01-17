'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const AnimatedGrid = () => {
  const [gridLines, setGridLines] = useState<number[]>([]);
  const [particles, setParticles] = useState<{ x: number; y: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate random values only on the client side
    const lines = Array.from({ length: 20 }, () => Math.random() * 100);
    const parts = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 2,
    }));

    setGridLines(lines);
    setParticles(parts);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(to right, rgba(0, 255, 148, 0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(0, 255, 148, 0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }}>
        {gridLines.map((topPos, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-cyber to-transparent"
            style={{
              top: `${topPos}%`,
              left: '-100%',
              width: '200%',
            }}
            animate={{
              left: ['100%', '-100%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2, // Animation duration randomization is fine in transition prop usually, but safer to move if strictly checking
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyber rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};