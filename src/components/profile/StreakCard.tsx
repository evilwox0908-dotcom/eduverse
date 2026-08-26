import React from 'react';
import { Flame, CheckCircle2, Clock, ShieldAlert, Sparkles } from 'lucide-react';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  isActiveToday: boolean;
  streakFreezeCount: number;
  onTakeActionClick?: () => void;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak,
  longestStreak,
  isActiveToday,
  streakFreezeCount,
  onTakeActionClick,
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isActiveToday
                  ? 'bg-orange-500/10 border border-orange-500/30 text-orange-600'
                  : 'bg-slate-100 border border-slate-200 text-slate-400'
              }`}
            >
              <Flame
                className={`w-5 h-5 ${isActiveToday ? 'fill-orange-500 animate-pulse' : ''}`}
              />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Learning Streak</h3>
              <p className="text-xs text-slate-500">Daily Academic Momentum</p>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              isActiveToday
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {isActiveToday ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active Today</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5" />
                <span>Action Needed</span>
              </>
            )}
          </div>
        </div>

        {/* Streak Counter Display */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {currentStreak}
          </span>
          <span className="text-sm font-semibold text-slate-500">
            {currentStreak === 1 ? 'consecutive day' : 'consecutive days'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {isActiveToday
            ? "You've completed qualifying learning activity today. Your streak is verified and protected!"
            : 'Engage with the AI Teacher or participate in a competition today to extend your streak.'}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500">
          Best Record: <strong className="text-slate-800 font-bold">{longestStreak} days</strong>
        </span>

        {!isActiveToday && onTakeActionClick && (
          <button
            type="button"
            onClick={onTakeActionClick}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Study with AI Teacher</span>
          </button>
        )}
      </div>
    </div>
  );
};
