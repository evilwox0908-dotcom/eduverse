import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { ActiveModal } from '../../types';

interface PlaceholderModalProps {
  activeModal: ActiveModal;
  onClose: () => void;
}

export const PlaceholderModal: React.FC<PlaceholderModalProps> = ({
  activeModal,
  onClose,
}) => {
  if (!activeModal) return null;

  const getModalDetails = (type: ActiveModal) => {
    switch (type) {
      case 'signup':
        return {
          title: 'Student Registration',
          phase: 'Phase 2: Authentication & Profiles',
          description:
            'Registration and secure student profiles will be implemented in the next phase of EduVerse. Stay tuned for seamless onboarding.',
          tag: '/signup',
        };
      case 'login':
        return {
          title: 'Account Login',
          phase: 'Phase 2: Authentication',
          description:
            'Universal student & institutional login portal is scheduled for the upcoming phase.',
          tag: '/login',
        };
      case 'competitions':
      case 'compete':
        return {
          title: 'Global Academic Competitions',
          phase: 'Phase 3: Competition Engine',
          description:
            'Real-time academic challenges, live Olympiads, and bracket tournaments are scheduled for Phase 3.',
          tag: '/competitions',
        };
      case 'learn':
        return {
          title: 'Personalized AI Learning',
          phase: 'Phase 4: Adaptive AI Engine',
          description:
            'Interactive AI tutoring, curriculum maps, and mastery tracking will arrive in the dedicated learning phase.',
          tag: '/learn',
        };
      case 'leaderboard':
        return {
          title: 'Global Verified Leaderboard',
          phase: 'Phase 3: Rankings & Records',
          description:
            'Verified international rankings and institutional leaderboards will launch alongside the competition system.',
          tag: '/leaderboard',
        };
      case 'universities':
        return {
          title: 'University Partnerships',
          phase: 'Phase 5: Institutional Network',
          description:
            'Official university pathways, scholarship benchmarks, and recruitment scouts portal will open in Phase 5.',
          tag: '/universities',
        };
      default:
        return {
          title: 'EduVerse Module',
          phase: 'Next Phase',
          description: 'This feature is scheduled for implementation in upcoming phases.',
          tag: '/module',
        };
    }
  };

  const details = getModalDetails(activeModal);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-lg rounded-3xl bg-white/95 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl border border-white shadow-blue-900/10 z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{details.phase}</span>
            </span>
            <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              {details.tag}
            </span>
          </div>

          {/* Modal Title */}
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
            {details.title}
          </h3>

          {/* Modal Description */}
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
            {details.description}
          </p>

          {/* Visual Architecture Info Box */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 mb-6 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600">
              <p className="font-semibold text-blue-900 mb-0.5">
                Phase 2 Authentication &amp; Firestore Active
              </p>
              <p className="text-slate-600">
                User registration, worldwide country data, school onboarding, and cloud sessions are fully live.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end gap-3">
            <Button variant="primary" size="md" onClick={onClose} className="w-full sm:w-auto">
              Return to Home
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
