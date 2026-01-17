'use client';
import { motion } from 'framer-motion';
import { AnimatedGrid } from './AnimatedGrid';
import { RotatingShield } from './RotatingShield';

interface LandingPageProps {
  onLaunch: () => void;
}

export const LandingPage = ({ onLaunch }: LandingPageProps) => {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      <AnimatedGrid />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <RotatingShield />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-7xl font-bold font-display text-white mb-6 tracking-tight"
        >
          Get Credit.{' '}
          <span className="bg-gradient-to-r from-cyber to-cyber-purple bg-clip-text text-transparent">
            Keep Privacy.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-2xl text-white/70 font-body mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          The world's first Zero-Knowledge Financial Passport for the next billion users.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLaunch}
          className="relative group px-12 py-5 rounded-full bg-gradient-to-r from-cyber to-cyber-purple font-display font-semibold text-lg text-black overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 0.3 }}
          />
          <span className="relative z-10">Launch Sentinel</span>
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow: '0 0 40px rgba(0, 255, 148, 0.6)',
            }}
            animate={{
              boxShadow: [
                '0 0 40px rgba(0, 255, 148, 0.6)',
                '0 0 60px rgba(0, 255, 148, 0.8)',
                '0 0 40px rgba(0, 255, 148, 0.6)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-24 grid grid-cols-3 gap-12 max-w-4xl mx-auto"
        >
          {[
            { title: 'Zero-Knowledge', desc: 'Your data never leaves your device' },
            { title: 'Instant Verification', desc: 'Get approved in seconds, not days' },
            { title: 'Universal Access', desc: 'One passport for the entire web3 economy' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + i * 0.2 }}
              className="p-6 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10"
            >
              <h3 className="text-white font-display font-semibold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-white/60 font-body text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
