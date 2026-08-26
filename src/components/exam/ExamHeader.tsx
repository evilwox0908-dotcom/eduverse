import React, { useEffect, useState } from 'react';
import {
  Clock,
  Maximize,
  Minimize,
  Calculator as CalcIcon,
  PenTool,
  CheckCircle2,
  AlertTriangle,
  Send,
  Shield,
} from 'lucide-react';
import { ExamSession } from '../../types';

interface ExamHeaderProps {
  session: ExamSession;
  competitionTitle: string;
  allowCalculator: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenCalculator: () => void;
  onOpenScratchpad: () => void;
  onSubmitClick: () => void;
  onTimeExpire: () => void;
}

export const ExamHeader: React.FC<ExamHeaderProps> = ({
  session,
  competitionTitle,
  allowCalculator,
  isSaving,
  lastSavedAt,
  isFullscreen,
  onToggleFullscreen,
  onOpenCalculator,
  onOpenScratchpad,
  onSubmitClick,
  onTimeExpire,
}) => {
  const [remainingMs, setRemainingMs] = useState<number>(() => {
    return Math.max(0, session.expiresAt - Date.now());
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = session.expiresAt - Date.now();
      if (diff <= 0) {
        setRemainingMs(0);
        clearInterval(interval);
        onTimeExpire();
      } else {
        setRemainingMs(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session.expiresAt, onTimeExpire]);

  // Format MM:SS or HH:MM:SS
  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const isLowTime = remainingMs < 5 * 60 * 1000 && remainingMs > 0;

  return (
    <header
      id="exam-header"
      className="sticky top-0 z-40 w-full bg-slate-900 text-white border-b border-slate-800 shadow-md select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: EduVerse Logo & Competition title */}
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md shrink-0">
            EV
          </div>
          <div className="truncate">
            <h1 className="text-sm font-bold text-slate-100 truncate">
              {competitionTitle}
            </h1>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center space-x-1 text-emerald-400">
                <Shield className="w-3 h-3" />
                <span>Live Exam Session</span>
              </span>
              <span>•</span>
              <span>Candidate: {session.studentName || 'Student'}</span>
            </div>
          </div>
        </div>

        {/* Center: Server-authoritative Countdown Timer */}
        <div className="flex items-center justify-center shrink-0">
          <div
            id="exam-timer-display"
            className={`flex items-center space-x-2 px-4 py-1.5 rounded-xl border font-mono text-sm sm:text-base font-bold tracking-wider transition-colors ${
              isLowTime
                ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse'
                : 'bg-slate-800/90 border-slate-700 text-amber-400'
            }`}
          >
            <Clock className={`w-4 h-4 ${isLowTime ? 'text-rose-400' : 'text-amber-400'}`} />
            <span>{formatTime(remainingMs)}</span>
          </div>
        </div>

        {/* Right: Autosave status, tools, full-screen, submit */}
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Autosave badge */}
          <div className="hidden md:flex items-center space-x-1.5 text-xs text-slate-400">
            {isSaving ? (
              <span className="text-amber-400 animate-pulse">Saving answer...</span>
            ) : (
              <span className="flex items-center space-x-1 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auto-saved</span>
              </span>
            )}
          </div>

          {/* Permitted Tools */}
          {allowCalculator && (
            <button
              id="header-calculator-btn"
              onClick={onOpenCalculator}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Open Permitted Calculator"
            >
              <CalcIcon className="w-4 h-4" />
            </button>
          )}

          <button
            id="header-scratchpad-btn"
            onClick={onOpenScratchpad}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Open Scratchpad"
          >
            <PenTool className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            id="header-fullscreen-btn"
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title={isFullscreen ? 'Exit Full-Screen' : 'Enter Full-Screen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Submit Action */}
          <button
            id="header-submit-btn"
            onClick={onSubmitClick}
            className="inline-flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-98"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Submit</span>
          </button>
        </div>
      </div>
    </header>
  );
};
