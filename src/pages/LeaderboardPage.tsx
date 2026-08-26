import React, { useState } from 'react';
import {
  Trophy,
  Globe,
  Flag,
  Building,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { DashboardView } from '../types';

interface LeaderboardPageProps {
  onSelectView: (view: DashboardView) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({
  onSelectView,
}) => {
  const { userProfile } = useAuth();
  const [tab, setTab] = useState<'global' | 'country' | 'school'>('global');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 bg-gradient-to-r from-white/90 via-blue-50/40 to-sky-50/50 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                Global Academic Rankings
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Verified Leaderboards
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Rankings are calculated strictly from verified proctored Olympiads and platform competitions.
            </p>
          </div>

          <button
            onClick={() => onSelectView('compete')}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Trophy className="w-4 h-4" />
            <span>Join Next Contest</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setTab('global')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            tab === 'global'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white/80 text-slate-600 border border-slate-200/80 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Global Leaderboard</span>
        </button>

        <button
          onClick={() => setTab('country')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            tab === 'country'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white/80 text-slate-600 border border-slate-200/80 hover:bg-slate-100'
          }`}
        >
          <Flag className="w-3.5 h-3.5" />
          <span>{userProfile?.country || 'National'} Ranking</span>
        </button>

        <button
          onClick={() => setTab('school')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            tab === 'school'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white/80 text-slate-600 border border-slate-200/80 hover:bg-slate-100'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>School Ranking</span>
        </button>
      </div>

      {/* Real Standing Status */}
      <GlassCard className="p-8 sm:p-10 rounded-3xl text-center border border-white/80">
        <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 mx-auto flex items-center justify-center mb-3 border border-sky-200/60 shadow-sm">
          <Trophy className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Not ranked yet — Complete your first competition.
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
          Leaderboard positions are calculated based on official Olympiad scores and validated time trials.
        </p>

        {/* Student Profile Standing Preview */}
        <div className="max-w-sm mx-auto mt-6 p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 text-left space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Student Profile:</span>
            <span className="font-bold text-slate-800">
              {userProfile?.firstName} {userProfile?.lastName || ''}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">EduVerse Score:</span>
            <span className="font-bold text-blue-600">
              {userProfile?.eduverseScore ?? 0} PTS
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">XP Accumulated:</span>
            <span className="font-bold text-amber-600">
              {userProfile?.xp ?? 0} XP
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => onSelectView('compete')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-colors"
          >
            <span>Explore Competitions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
