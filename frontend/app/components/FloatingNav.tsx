'use client';
import { motion } from 'framer-motion';
import { Home, FileText, Activity, Settings, Mic } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type NavItem = 'home' | 'documents' | 'voice' | 'activity' | 'settings';

interface FloatingNavProps {
  activeItem?: NavItem;
  onNavigate?: (item: NavItem) => void;
}

export const FloatingNav = ({ activeItem = 'home', onNavigate }: FloatingNavProps) => {
  const [hoveredItem, setHoveredItem] = useState<NavItem | null>(null);
  const router = useRouter();

  const items: Array<{ id: NavItem; icon: typeof Home; label: string }> = [
    { id: 'home', icon: Home, label: 'Financial Identity Overview' },
    { id: 'documents', icon: FileText, label: 'Financial Evidence Vault' },
    { id: 'voice', icon: Mic, label: 'Voice Interview' },
    { id: 'activity', icon: Activity, label: 'Agent Activity & Verification Log' },
    { id: 'settings', icon: Settings, label: 'Privacy & Proof Controls' },
  ];

  const handleClick = useCallback(
    (id: NavItem) => {
      if (onNavigate) {
        onNavigate(id);
        return;
      }
      switch (id) {
        case 'home': router.push('/'); break;
        case 'documents': router.push('/documents'); break;
        case 'voice': router.push('/voice'); break;
        case 'activity': router.push('/activity'); break;
        case 'settings': router.push('/settings'); break;
      }
    },
    [onNavigate, router]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40"
    >
      <div className="relative">
        {/* Glow */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 148, 0.12) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative backdrop-blur-2xl bg-white/5 border border-white/10 rounded-full px-6 py-4 shadow-2xl">
          <div className="flex flex-col items-center gap-2">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              const isHovered = hoveredItem === item.id;

              return (
                <div key={item.id} className="relative flex items-center">
                  <motion.button
                    type="button"
                    onClick={() => handleClick(item.id)}
                    onPointerDown={(e) => e.stopPropagation()}
                    onHoverStart={() => setHoveredItem(item.id)}
                    onHoverEnd={() => setHoveredItem(null)}
                    className={`relative p-4 rounded-full transition-colors select-none ${
                      isActive ? 'text-black' : 'text-white/60 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-cyber to-cyber-purple rounded-full"
                        transition={{ duration: 0.2 }}
                      />
                    )}
                    <Icon className="w-5 h-5 relative z-10" />
                  </motion.button>

                  {/* Tooltip — moved OUTSIDE button & click-safe */}
                  {isHovered && !isActive && (
                    <motion.div
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-full mr-3 whitespace-nowrap pointer-events-none"
                    >
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-1.5">
                        <span className="text-white text-xs font-body font-medium">
                          {item.label}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
