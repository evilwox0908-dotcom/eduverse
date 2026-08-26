import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  Clock,
  FileQuestion,
  Calculator as CalcIcon,
  AlertTriangle,
  CheckCircle,
  Wifi,
  Monitor,
  Maximize2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { Competition, UserProfile } from '../../types';

interface PreExamCheckViewProps {
  competition: Competition;
  userProfile: UserProfile | null;
  onStartExam: () => void;
  isLoading: boolean;
  onBackToDetails: () => void;
}

export const PreExamCheckView: React.FC<PreExamCheckViewProps> = ({
  competition,
  userProfile,
  onStartExam,
  isLoading,
  onBackToDetails,
}) => {
  const [agreedToHonorCode, setAgreedToHonorCode] = useState<boolean>(false);
  const [agreedToIntegrity, setAgreedToIntegrity] = useState<boolean>(false);

  const canStart = agreedToHonorCode && agreedToIntegrity && !isLoading;

  return (
    <div
      id="pre-exam-check-container"
      className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-8"
    >
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-base shadow-lg">
            EV
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Official Competition Gateway
            </span>
            <h1 className="text-lg font-bold text-white leading-tight">
              {competition.title}
            </h1>
          </div>
        </div>

        <button
          id="pre-exam-exit-btn"
          onClick={onBackToDetails}
          className="text-xs text-slate-400 hover:text-slate-200 underline"
        >
          Exit to Overview
        </button>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl w-full mx-auto my-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Candidate & Competition Specs */}
        <div className="md:col-span-7 space-y-6">
          {/* Candidate Card */}
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 shadow-md">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200">
                <User className="w-4 h-4 text-blue-400" />
                <span>Verified Candidate</span>
              </div>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                <span>Eligible</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <p className="text-slate-400 text-xs">Student Name</p>
                <p className="font-semibold text-white">
                  {userProfile?.displayName || (userProfile ? `${userProfile.firstName} ${userProfile.lastName}`.trim() : 'Registered Student')}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Academic Grade</p>
                <p className="font-semibold text-white">
                  {userProfile?.grade || 'Grade 11 / High School'}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Country / Region</p>
                <p className="font-semibold text-white">
                  {userProfile?.country || 'International'}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Institution / School</p>
                <p className="font-semibold text-white truncate">
                  {userProfile?.schoolName || 'EduVerse Scholar'}
                </p>
              </div>
            </div>
          </div>

          {/* Exam Specs */}
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 shadow-md space-y-4">
            <h3 className="text-sm font-semibold text-slate-200">
              Competition Rules & Parameters
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Duration</span>
                </div>
                <p className="text-base font-bold text-white">
                  {competition.durationMinutes} Minutes
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <FileQuestion className="w-3.5 h-3.5 text-blue-400" />
                  <span>Total Items</span>
                </div>
                <p className="text-base font-bold text-white">
                  {competition.totalQuestions || 4} Questions
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <CalcIcon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Calculator</span>
                </div>
                <p className="text-base font-bold text-emerald-400">
                  {competition.allowCalculator ? 'Permitted' : 'Forbidden'}
                </p>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-700">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Timer is server-authoritative and will not reset upon page refresh.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Your responses are auto-saved in real time across questions.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Official scores are evaluated server-side upon final submission.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: System Check & Agreements */}
        <div className="md:col-span-5 space-y-6">
          {/* Readiness Checks */}
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 shadow-md space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 mb-3">
              Environment Readiness
            </h3>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs">
              <div className="flex items-center space-x-2.5">
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span>Network Connection</span>
              </div>
              <span className="text-emerald-400 font-semibold">Active & Stable</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs">
              <div className="flex items-center space-x-2.5">
                <Maximize2 className="w-4 h-4 text-blue-400" />
                <span>Full-Screen Mode</span>
              </div>
              <span className="text-blue-300 font-semibold">Required</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/60 text-xs">
              <div className="flex items-center space-x-2.5">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Integrity Monitor</span>
              </div>
              <span className="text-amber-300 font-semibold">Armed</span>
            </div>
          </div>

          {/* Mandatory Checkboxes */}
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 shadow-md space-y-4">
            <label
              htmlFor="agree-honor-code-checkbox"
              className="flex items-start space-x-3 cursor-pointer select-none text-xs text-slate-200"
            >
              <input
                id="agree-honor-code-checkbox"
                type="checkbox"
                checked={agreedToHonorCode}
                onChange={(e) => setAgreedToHonorCode(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-700 shrink-0"
              />
              <span>
                I agree to uphold the <strong className="text-white">EduVerse Honor Code</strong> and solve all problems independently without unauthorized assistance.
              </span>
            </label>

            <label
              htmlFor="agree-integrity-checkbox"
              className="flex items-start space-x-3 cursor-pointer select-none text-xs text-slate-200"
            >
              <input
                id="agree-integrity-checkbox"
                type="checkbox"
                checked={agreedToIntegrity}
                onChange={(e) => setAgreedToIntegrity(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-700 shrink-0"
              />
              <span>
                I understand that entering will initiate full-screen mode, and tab switching or window defocus will be recorded in the official audit.
              </span>
            </label>

            {/* Launch Button */}
            <button
              id="start-competition-exam-btn"
              onClick={onStartExam}
              disabled={!canStart}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg ${
                canStart
                  ? 'bg-blue-600 hover:bg-blue-500 text-white active:scale-98 shadow-blue-500/20'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-70'
              }`}
            >
              {isLoading ? (
                <span>Initializing Server Session...</span>
              ) : (
                <>
                  <span>Enter Fullscreen & Start Exam</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-slate-500 pt-4 border-t border-slate-800">
        EduVerse Global Competition Platform • Server Authoritative Session • Phase 5 Exam Engine
      </div>
    </div>
  );
};
