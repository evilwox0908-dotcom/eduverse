import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Globe } from 'lucide-react';

interface InitialLoaderProps {
  isLoading: boolean;
}

export const InitialLoader: React.FC<InitialLoaderProps> = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(10px)',
            transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#F8FAFC] overflow-hidden"
        >
          {/* Subtle ambient lighting gradients */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-300/25 blur-[100px] -translate-y-10" />
          <div className="absolute w-[300px] h-[300px] rounded-full bg-sky-200/40 blur-[80px] translate-y-12" />

          <div className="relative flex flex-col items-center justify-center">
            {/* Animated Orbiting Ring & Core */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-6">
              {/* Outer soft pulse */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 rounded-full bg-blue-400/20 blur-md"
              />

              {/* Rotating outer dash ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0 rounded-full border border-dashed border-blue-400/60"
              />

              {/* Counter-rotating elliptical orbit */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute w-32 h-16 rounded-[100%] border border-blue-300/40 -rotate-12"
              />

              {/* Inner glowing globe badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-700 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-600/30 border border-white/40"
              >
                <Globe className="w-8 h-8 text-white stroke-[1.75]" />
              </motion.div>
            </div>

            {/* Brand Logo and Title */}
            <motion.div
              initial={{ y: 15, opacity: 0, filter: 'blur(4px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5 justify-center">
                <span>Edu</span>
                <span className="text-blue-600">Verse</span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-2"
              >
                Global Academic Ecosystem
              </motion.p>
            </motion.div>

            {/* Minimal Progress Line */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 140, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.9, ease: 'easeInOut' }}
              className="h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent mt-8 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
