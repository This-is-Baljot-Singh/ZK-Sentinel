"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function ZKAnimation({ active }) {
  return (
    <div className="h-20 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {active ? (
          <motion.div
            key="shield"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl"
          >
            🛡️
          </motion.div>
        ) : (
          <motion.div
            key="lock"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-4xl"
          >
            🔒
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
