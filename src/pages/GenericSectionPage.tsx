import React from 'react';
import { GraduationCap, Calendar, Settings, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { DashboardView } from '../types';
import { useAuth } from '../context/AuthContext';

interface GenericSectionPageProps {
  view: 'universities' | 'events' | 'settings';
  onSelectView: (view: DashboardView) => void;
}

export const GenericSectionPage: React.FC<GenericSectionPageProps> = ({
  view,
  onSelectView,
}) => {
  const { userProfile, logout } = useAuth();

  if (view === 'universities') {
    return (
      <div className="space-y-6">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 bg-gradient-to-r from-white/90 via-blue-50/40 to-sky-50/50 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
              Higher Education Pathways
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Global University Portals
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Direct recruitment and verified Olympiad portfolios for world-leading institutions (MIT, Cambridge, Stanford, Oxford, NUS).
          </p>
        </div>

        <GlassCard className="p-8 text-center border border-white/80">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3 border border-blue-200/60">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Admissions Portals Launching in Phase 4
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
            Your verified EduVerse competition transcripts and AI learning achievements will be exportable directly to admissions committees.
          </p>
        </GlassCard>
      </div>
    );
  }

  if (view === 'events') {
    return (
      <div className="space-y-6">
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 bg-gradient-to-r from-white/90 via-blue-50/40 to-sky-50/50 shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
              Live & Scheduled
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Academic Events & Masterclasses
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Live symposiums, Olympiad breakdown seminars, and masterclasses by international professors.
          </p>
        </div>

        <GlassCard className="p-8 text-center border border-white/80">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3 border border-blue-200/60">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No live events scheduled for today.
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
            Upcoming masterclasses and live Olympiad workshops will be announced here.
          </p>
        </GlassCard>
      </div>
    );
  }

  // Settings
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 bg-gradient-to-r from-white/90 via-blue-50/40 to-sky-50/50 shadow-md">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Account Settings & Preferences
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage your student profile preferences and platform configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6 rounded-3xl border border-white/80 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Profile Preferences
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="font-semibold text-slate-700">Display Grade:</span>
              <span className="text-blue-700 font-bold">{userProfile?.grade || 'Grade 10'}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="font-semibold text-slate-700">Country of Representation:</span>
              <span className="text-slate-800 font-bold">{userProfile?.country || 'International'}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
              <span className="font-semibold text-slate-700">Curriculum System:</span>
              <span className="text-slate-800 font-bold">{userProfile?.educationSystem || 'International'}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 rounded-3xl border border-white/80 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Session Security
          </h3>
          <p className="text-xs text-slate-500">
            Authentication is secured via Firebase Identity and Firestore encrypted data protocols.
          </p>
          <button
            onClick={logout}
            className="w-full py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold border border-red-200 transition-colors"
          >
            Log Out of Account
          </button>
        </GlassCard>
      </div>
    </div>
  );
};
