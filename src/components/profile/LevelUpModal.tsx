import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Zap, Sparkles, Award, ArrowRight, X } from 'lucide-react';
import { LevelInfo } from '../../types';

interface LevelUpModalProps {
  isOpen: boolean;
  previousLevel: number;
  newLevelInfo: LevelInfo;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  previousLevel,
  newLevelInfo,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative z-10 bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border border-indigo-200 overflow-hidden"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Celebration Icon */}
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-blue-600 mx-auto p-[3px] shadow-xl shadow-indigo-500/25 mb-5">
              <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center text-indigo-600">
                <ShieldCheck className="w-10 h-10" />
              </div>
            </div>

            {/* Title */}
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2 border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Academic Advancement</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Level Up!
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Congratulations! Your continuous academic excellence and competition participation have elevated your rank.
            </p>

            {/* Level Transition Pill */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                  Previous
                </span>
                <span className="text-lg font-bold text-slate-600">
                  Level {previousLevel}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </div>

              <div className="text-center">
                <span className="text-[10px] font-semibold text-indigo-600 block uppercase font-bold">
                  New Rank
                </span>
                <span className="text-xl font-extrabold text-indigo-600">
                  Level {newLevelInfo.level}
                </span>
              </div>
            </div>

            {/* Unlocked Title */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-800 font-medium mb-6 flex items-center justify-center gap-2">
              <Award className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                New Academic Title Unlocked: <strong>{newLevelInfo.title}</strong>
              </span>
            </div>

            {/* Action CTA */}
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Continue Academic Journey
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
