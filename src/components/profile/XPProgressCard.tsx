import React, { useState } from 'react';
import { Zap, Shield, Info, CheckCircle2, ChevronRight } from 'lucide-react';
import { LevelInfo } from '../../types';
import { XP_RULES } from '../../services/xpService';

interface XPProgressCardProps {
  totalXp: number;
  levelInfo: LevelInfo;
}

export const XPProgressCard: React.FC<XPProgressCardProps> = ({ totalXp, levelInfo }) => {
  const [showRulesModal, setShowRulesModal] = useState(false);

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
              <Zap className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Academic Progression</h3>
              <p className="text-xs text-slate-500">{levelInfo.title}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowRulesModal(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="How to earn XP"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Level Progression Indicator */}
        <div className="space-y-2 mb-4">
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-bold text-slate-700">Level {levelInfo.level}</span>
            <span className="font-semibold text-slate-500">
              Level {levelInfo.level + 1}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{levelInfo.xpInCurrentLevel} / {levelInfo.xpRequiredForNextLevel} XP in Level</span>
            <span className="font-semibold text-amber-600">
              {levelInfo.xpToNextLevel} XP needed
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-600">
          Total Career XP: <strong className="text-slate-900 font-bold">{totalXp.toLocaleString()}</strong>
        </span>
        <button
          type="button"
          onClick={() => setShowRulesModal(true)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-0.5"
        >
          <span>XP Rules</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Rules Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <h4 className="text-lg font-bold text-slate-900">EduVerse XP System</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowRulesModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              XP is calculated with strict server-authoritative integrity. Every point represents genuine learning, competition participation, and academic consistency.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-700 font-medium">100% Profile Verification</span>
                <span className="font-bold text-amber-600">+{XP_RULES.PROFILE_COMPLETED} XP</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Competition Exam Submitted</span>
                <span className="font-bold text-blue-600">+{XP_RULES.COMPETITION_COMPLETED} XP</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-700 font-medium">AI Teacher Dialogue Session</span>
                <span className="font-bold text-purple-600">+{XP_RULES.AI_SESSION} XP</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Study Lesson Completed</span>
                <span className="font-bold text-emerald-600">+{XP_RULES.LESSON_COMPLETED} XP</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Practice Quiz Completed</span>
                <span className="font-bold text-sky-600">+{XP_RULES.PRACTICE_COMPLETED} XP</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Achievement Milestones</span>
                <span className="font-bold text-indigo-600">+25 to +100 XP</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowRulesModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
