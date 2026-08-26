import React from 'react';
import { Activity, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { DashboardView } from '../../types';

interface TodayActivitySectionProps {
  onSelectView: (view: DashboardView) => void;
}

export const TodayActivitySection: React.FC<TodayActivitySectionProps> = ({
  onSelectView,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Today's Activity
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time daily learning, AI sessions, and competitive practice.
          </p>
        </div>
      </div>

      <GlassCard className="p-6 rounded-3xl border border-white/80 text-center">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-2">
          <Activity className="w-5 h-5" />
        </div>
        <p className="text-sm font-bold text-slate-700">No activity yet.</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Start an AI tutoring session or take a diagnostic quiz to log today's academic progress.
        </p>
        <div className="mt-4">
          <button
            onClick={() => onSelectView('ai')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch AI Teacher</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
