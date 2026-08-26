import React from 'react';
import {
  Zap,
  Flame,
  Award,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { useAuth } from '../../context/AuthContext';
import { useXP } from '../../hooks/useXP';
import { useStreak } from '../../hooks/useStreak';
import { useAchievements } from '../../hooks/useAchievements';
import { DashboardView } from '../../types';

interface ProgressCardsProps {
  onSelectView: (view: DashboardView) => void;
}

export const ProgressCards: React.FC<ProgressCardsProps> = ({ onSelectView }) => {
  const { userProfile } = useAuth();
  const { totalXp, levelInfo } = useXP();
  const { currentStreak, isActiveToday } = useStreak();
  const { unlockedCount, totalCount } = useAchievements();

  return (
    <div className="space-y-6 mb-8">
      {/* 4-Card Performance Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total XP & Level */}
        <GlassCard className="p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-white/90 group hover:border-amber-300 transition-all">
          <div className="pointer-events-none absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total XP & Rank
              </span>
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/80">
                <Zap className="w-4 h-4 fill-amber-500" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {totalXp}
              </span>
              <span className="text-xs font-bold text-amber-600">XP</span>
            </div>

            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Level {levelInfo.level} • {levelInfo.title}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100/90 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">
              {levelInfo.xpToNextLevel} XP to Level {levelInfo.level + 1}
            </span>
            <button
              onClick={() => onSelectView('profile')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
            >
              Profile <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </GlassCard>

        {/* Card 2: Learning Streak */}
        <GlassCard className="p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-white/90 group hover:border-orange-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Learning Streak
              </span>
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center border ${
                  isActiveToday
                    ? 'bg-orange-50 text-orange-600 border-orange-200/80'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <Flame className={`w-4 h-4 ${isActiveToday ? 'fill-orange-500' : ''}`} />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {currentStreak}
              </span>
              <span className="text-xs font-bold text-orange-600">
                {currentStreak === 1 ? 'DAY' : 'DAYS'}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2 leading-relaxed flex items-center gap-1">
              {isActiveToday ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Active today</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-amber-700 font-medium">Activity needed today</span>
                </>
              )}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100/90 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">
              Momentum Tracker
            </span>
            <button
              onClick={() => onSelectView('ai')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
            >
              Study <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </GlassCard>

        {/* Card 3: Achievements */}
        <GlassCard className="p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-white/90 group hover:border-emerald-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
                Achievements
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200/80">
                <Award className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {unlockedCount}
              </span>
              <span className="text-xs font-bold text-emerald-600">/ {totalCount}</span>
            </div>

            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {unlockedCount === 0
                ? 'Complete your profile and enter competitions to unlock badges.'
                : `${Math.round((unlockedCount / totalCount) * 100)}% academic milestones unlocked.`}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100/90 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400">
              Verified Badges
            </span>
            <button
              onClick={() => onSelectView('profile')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
            >
              View <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </GlassCard>

        {/* Card 4: Academic Identity */}
        <GlassCard className="p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between border border-white/90 group hover:border-blue-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                EduVerse ID
              </span>
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/80">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-mono font-bold text-slate-900 tracking-tight">
                {userProfile?.eduVerseId || 'EV-SCHOLAR'}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2 leading-relaxed truncate">
              {userProfile?.schoolName || 'EduVerse Student Candidate'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100/90 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-400 truncate max-w-[120px]">
              {userProfile?.country || 'International'}
            </span>
            <button
              onClick={() => onSelectView('profile')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
            >
              Credentials <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
