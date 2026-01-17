'use client';
import { motion } from 'framer-motion';
import { Fingerprint, TrendingUp, Shield, CheckCircle } from 'lucide-react';

interface DigitalPassportProps {
  isVerified: boolean;
  creditScore?: number;
  riskLevel?: string;
  maxLoanEligibility?: string;
}

export const DigitalPassport = ({
  isVerified,
  creditScore,
  riskLevel,
  maxLoanEligibility,
}: DigitalPassportProps) => {
  return (
    <motion.div
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isVerified ? 360 : 0 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
      className="relative w-full max-w-2xl mx-auto"
      style={{ perspective: '1000px' }}
    >
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            background:
              'linear-gradient(135deg, rgba(0, 255, 148, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
            filter: 'blur(40px)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
          <div className="flex items-start justify-between mb-8">
            <div>
              <motion.h2
                className="text-3xl font-display font-bold text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Financial Passport
              </motion.h2>
              <p className="text-white/60 font-body">
                Powered by Zero-Knowledge Technology
              </p>
            </div>
            <motion.div
              animate={{
                rotate: isVerified ? 360 : 0,
                scale: isVerified ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.6 }}
            >
              <Shield
                className={`w-10 h-10 ${isVerified ? 'text-cyber' : 'text-white/30'}`}
              />
            </motion.div>
          </div>

          {!isVerified ? (
            <div className="space-y-6">
              {['Credit Score', 'Risk Level', 'Max Loan Eligibility'].map((field, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-center justify-between py-4 px-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <span className="text-white/70 font-body">{field}</span>
                    <motion.div
                      className="h-6 w-32 rounded-lg bg-gradient-to-r from-white/10 to-white/5"
                      animate={{
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between py-5 px-6 rounded-xl bg-gradient-to-r from-cyber/10 to-cyber-purple/10 backdrop-blur-sm border border-cyber/30">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-cyber" />
                  <span className="text-white/90 font-body font-medium">
                    Credit Score
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <motion.span
                    className="text-4xl font-display font-bold text-cyber"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  >
                    {creditScore}
                  </motion.span>
                  <span className="text-cyber/80 font-body text-sm">Excellent</span>
                </div>
              </div>

              <div className="flex items-center justify-between py-5 px-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-white/70" />
                  <span className="text-white/90 font-body font-medium">
                    Risk Level
                  </span>
                </div>
                <span className="text-white/80 font-display font-semibold">
                  {riskLevel}
                </span>
              </div>

              <div className="flex items-center justify-between py-5 px-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-white/70" />
                  <span className="text-white/90 font-body font-medium">
                    Max Loan Eligibility
                  </span>
                </div>
                <span className="text-white/80 font-display font-semibold text-xl">
                  {maxLoanEligibility}
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 pt-6 border-t border-white/10 flex items-center justify-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-cyber" />
                <span className="text-cyber font-body font-medium">
                  Verified & Ready to Use
                </span>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
