import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Trophy, BookmarkCheck, ArrowRight, Calendar, Clock, Globe } from 'lucide-react';
import { Competition, CompetitionRegistration } from '../../types';
import { Competition3DCanvas } from './Competition3DCanvas';

interface RegistrationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  competition: Competition | null;
  registration: CompetitionRegistration | null;
  onViewMyCompetitions: () => void;
}

export const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  isOpen,
  onClose,
  competition,
  registration,
  onViewMyCompetitions,
}) => {
  if (!isOpen || !competition) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md rounded-3xl bg-white/95 border border-white/90 p-6 sm:p-8 text-center shadow-2xl shadow-blue-900/20"
        >
          {/* 3D Trophy Visual */}
          <div className="h-44 -mt-4 mb-2">
            <Competition3DCanvas compact={true} />
          </div>

          {/* Success Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Official Entry Confirmed</span>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            You're registered.
          </h2>

          <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
            Your candidate seat has been successfully reserved in the global arena.
          </p>

          {/* Competition Card Snapshot */}
          <div className="mt-5 p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 text-left space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 text-sm">
              {competition.title}
            </h4>
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>
                {competition.startAt
                  ? new Date(competition.startAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : competition.startDate || 'Date TBA'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-3.5 h-3.5 text-sky-500" />
              <span>
                Duration: {competition.durationMinutes || 60} minutes ({competition.questionCount || 20} questions)
              </span>
            </div>
            {registration && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Ref: {registration.id.slice(0, 16)}</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {registration.status}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              onClick={onViewMyCompetitions}
              className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>View My Arenas</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              Back to Hub
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
