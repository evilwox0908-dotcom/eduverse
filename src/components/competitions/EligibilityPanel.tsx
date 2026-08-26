import React from 'react';
import { CheckCircle2, AlertCircle, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { EligibilityResult } from '../../types';

interface EligibilityPanelProps {
  eligibility: EligibilityResult;
  onCompleteProfile?: () => void;
  onLoginPrompt?: () => void;
  isAuthenticated: boolean;
  className?: string;
}

export const EligibilityPanel: React.FC<EligibilityPanelProps> = ({
  eligibility,
  onCompleteProfile,
  onLoginPrompt,
  isAuthenticated,
  className = '',
}) => {
  const { isEligible, reason, checks } = eligibility;

  return (
    <div className={`rounded-3xl p-5 sm:p-6 border transition-all ${
      isEligible
        ? 'bg-emerald-50/50 border-emerald-200/80'
        : 'bg-amber-50/40 border-amber-200/80'
    } ${className}`}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isEligible
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-amber-500 text-white shadow-sm'
          }`}>
            {isEligible ? (
              <ShieldCheck className="w-5 h-5" />
            ) : (
              <ShieldAlert className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {isEligible ? 'Verified Eligible to Compete' : 'Eligibility Check Required'}
            </h4>
            <p className="text-xs text-slate-500">
              {reason}
            </p>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
          isEligible
            ? 'bg-emerald-100 text-emerald-800'
            : 'bg-amber-100 text-amber-900'
        }`}>
          {isEligible ? 'ELIGIBLE' : 'ACTION REQUIRED'}
        </span>
      </div>

      {/* Checklist items */}
      <div className="space-y-2 pt-2 border-t border-slate-200/60">
        {checks.map((check) => (
          <div
            key={check.id}
            className="flex items-start gap-2.5 p-2 rounded-xl bg-white/70 border border-slate-100"
          >
            {check.passed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-800">
                  {check.title}
                </span>
                <span className={`text-[10px] font-extrabold ${
                  check.passed ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {check.passed ? 'PASS' : 'FAIL'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {check.details}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons if not authenticated or profile incomplete */}
      {!isAuthenticated && onLoginPrompt && (
        <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between">
          <span className="text-xs text-amber-900 font-medium">
            Sign in with your EduVerse account to verify eligibility.
          </span>
          <button
            type="button"
            onClick={onLoginPrompt}
            className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Sign In Now
          </button>
        </div>
      )}

      {isAuthenticated && !checks.find((c) => c.id === 'profile')?.passed && onCompleteProfile && (
        <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between">
          <span className="text-xs text-amber-900 font-medium">
            Complete onboarding to verify your grade and country.
          </span>
          <button
            type="button"
            onClick={onCompleteProfile}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Complete Onboarding
          </button>
        </div>
      )}
    </div>
  );
};
