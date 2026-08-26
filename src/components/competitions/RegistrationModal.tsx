import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trophy,
  ShieldCheck,
  Calendar,
  Clock,
  Globe,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { Competition, UserProfile, EligibilityResult } from '../../types';
import { EligibilityPanel } from './EligibilityPanel';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  competition: Competition | null;
  userProfile: UserProfile | null;
  eligibility: EligibilityResult;
  onConfirmRegistration: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  competition,
  userProfile,
  eligibility,
  onConfirmRegistration,
  loading,
  error,
}) => {
  const [agreedToRules, setAgreedToRules] = useState(false);

  if (!isOpen || !competition) return null;

  const isFree = !competition.entryFee || competition.entryFee === 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-xl rounded-3xl bg-white/95 border border-white/80 p-6 sm:p-8 shadow-2xl shadow-slate-900/20 max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80 shadow-2xs">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Official Registration
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
                {competition.title}
              </h2>
            </div>
          </div>

          {/* Summary Box */}
          <div className="mb-5 p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">Subject / Category:</span>
              <span className="font-bold text-slate-800">{competition.subject} ({competition.category})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">Division Level:</span>
              <span className="font-bold text-slate-800">{competition.level || competition.grade || 'All Grades'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">Duration & Questions:</span>
              <span className="font-bold text-slate-800">
                {competition.durationMinutes || 60} mins • {competition.questionCount || 'Timed'} Questions
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-500">Registration Fee:</span>
              <span className={`font-black text-sm ${isFree ? 'text-emerald-700' : 'text-blue-700'}`}>
                {isFree ? 'FREE' : `$${competition.entryFee} ${competition.currency || 'USD'}`}
              </span>
            </div>
          </div>

          {/* Candidate Profile Details */}
          {userProfile && (
            <div className="mb-5 p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-600">Candidate</span>
                <p className="font-bold text-slate-900">
                  {userProfile.firstName} {userProfile.lastName}
                </p>
                <p className="text-slate-500">{userProfile.schoolName || userProfile.country} • {userProfile.grade}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">UID</span>
                <p className="font-mono text-[11px] text-slate-600">{userProfile.uid.slice(0, 8)}...</p>
              </div>
            </div>
          )}

          {/* Eligibility Panel */}
          <div className="mb-5">
            <EligibilityPanel
              eligibility={eligibility}
              isAuthenticated={Boolean(userProfile)}
            />
          </div>

          {/* Error notice */}
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {/* Academic Integrity Checkbox */}
          {eligibility.isEligible && (
            <div className="mb-6">
              <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-100/80 transition-colors">
                <input
                  type="checkbox"
                  checked={agreedToRules}
                  onChange={(e) => setAgreedToRules(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-0.5 cursor-pointer"
                />
                <span className="text-xs text-slate-600 leading-snug">
                  I agree to the EduVerse Academic Code of Conduct and certify that all submissions will be my own authentic work without unauthorized assistance.
                </span>
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!eligibility.isEligible || !agreedToRules || loading}
              onClick={onConfirmRegistration}
              className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Registration</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
