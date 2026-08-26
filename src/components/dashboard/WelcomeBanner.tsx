import React from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  Building,
  GraduationCap,
  Sparkles,
  Trophy,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { DashboardScene } from '../3d/DashboardScene';
import { useAuth } from '../../context/AuthContext';
import { DashboardView } from '../../types';

interface WelcomeBannerProps {
  onSelectView: (view: DashboardView) => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onSelectView }) => {
  const { userProfile, user } = useAuth();

  // Dynamic time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = userProfile?.firstName || user?.displayName?.split(' ')[0] || 'Student';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 border border-white/90 relative overflow-hidden bg-gradient-to-br from-white/90 via-blue-50/40 to-sky-50/50 shadow-xl shadow-blue-900/5"
    >
      {/* Atmosphere Glows */}
      <div className="pointer-events-none absolute -right-16 -bottom-16 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -left-10 top-0 w-64 h-64 bg-sky-300/15 rounded-full blur-2xl" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Welcome Copy */}
        <div className="lg:col-span-7 space-y-4">
          {/* Identity & Status Tag */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-3 py-1 rounded-full border border-blue-200/80">
              {userProfile?.role ? userProfile.role.toUpperCase() : 'SCHOLAR'}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-white/90 px-2.5 py-1 rounded-full border border-slate-200/80">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Verified Profile
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              {getGreeting()},{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-sky-500">
                {firstName}.
              </span>
            </h1>
            <p className="text-base sm:text-lg font-medium text-slate-600 mt-2">
              Ready to learn and compete?
            </p>
          </div>

          {/* Real Academic Meta Info */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-600 pt-1">
            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200/60 font-medium">
              <Globe className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{userProfile?.country || 'International'}</span>
            </span>

            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200/60 font-medium truncate max-w-[220px]">
              <Building className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">{userProfile?.schoolName || 'Academic Institution'}</span>
            </span>

            <span className="flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200/60 font-semibold text-blue-700">
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>{userProfile?.grade || 'Grade 10'}</span>
            </span>
          </div>

          {/* Quick Action CTA Group */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Button
              id="welcome-ask-ai-btn"
              variant="primary"
              size="md"
              onClick={() => onSelectView('ai')}
              leftIcon={<Sparkles className="w-4 h-4" />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-lg shadow-blue-600/25"
            >
              Ask AI Teacher
            </Button>

            <Button
              id="welcome-compete-btn"
              variant="secondary"
              size="md"
              onClick={() => onSelectView('compete')}
              leftIcon={<Trophy className="w-4 h-4 text-amber-500" />}
              className="bg-white/90 hover:bg-slate-50 border-slate-200"
            >
              View Competitions
            </Button>
          </div>
        </div>

        {/* Right 3D Scene Container */}
        <div className="lg:col-span-5 w-full h-[280px] sm:h-[320px] lg:h-[340px] relative rounded-2xl overflow-hidden flex items-center justify-center">
          <DashboardScene />
        </div>
      </div>
    </motion.div>
  );
};
