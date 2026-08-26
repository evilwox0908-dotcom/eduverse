import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Calendar,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
  Globe,
  AlertCircle,
  Inbox,
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PlaceholderModal } from '../components/placeholder/PlaceholderModal';
import { MyCompetitionCard } from '../components/competitions/MyCompetitionCard';
import { Competition3DCanvas } from '../components/competitions/Competition3DCanvas';
import { useAuth } from '../context/AuthContext';
import {
  subscribeToAllStudentRegistrations,
  cancelStudentRegistration,
} from '../services/registrationService';
import { getPublishedCompetitions } from '../services/competitionService';
import { Competition, CompetitionRegistration, DashboardView, ActiveModal } from '../types';

interface MyCompetitionsPageProps {
  onNavigateHome: () => void;
  onNavigateDashboard: (view?: DashboardView) => void;
  onNavigateAuth: (view: 'login' | 'signup' | 'onboarding' | 'dashboard') => void;
  onViewCompetitionDetails: (competitionId: string) => void;
}

type FilterTab = 'all' | 'upcoming' | 'live' | 'completed';

export const MyCompetitionsPage: React.FC<MyCompetitionsPageProps> = ({
  onNavigateHome,
  onNavigateDashboard,
  onNavigateAuth,
  onViewCompetitionDetails,
}) => {
  const { user, userProfile } = useAuth();
  const [registrations, setRegistrations] = useState<CompetitionRegistration[]>([]);
  const [competitionsMap, setCompetitionsMap] = useState<Record<string, Competition>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  useEffect(() => {
    // Load competitions map
    getPublishedCompetitions().then((comps) => {
      const map: Record<string, Competition> = {};
      comps.forEach((c) => {
        map[c.id] = c;
      });
      setCompetitionsMap(map);
    });

    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToAllStudentRegistrations(user.uid, (regs) => {
      setRegistrations(regs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleCancelRegistration = async (competitionId: string) => {
    if (!user?.uid) return;
    try {
      await cancelStudentRegistration(competitionId, user.uid);
    } catch (err) {
      console.error('Failed to cancel registration:', err);
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    if (reg.status === 'CANCELLED') return false;

    const comp = competitionsMap[reg.competitionId];
    const isLive = comp?.status === 'LIVE';
    const isFinished = comp?.status === 'FINISHED' || comp?.status === 'RESULTS_PUBLISHED';

    if (activeTab === 'live') return isLive;
    if (activeTab === 'completed') return isFinished;
    if (activeTab === 'upcoming') return !isLive && !isFinished;
    return true;
  });

  return (
    <div className="min-h-screen bg-ambient-light flex flex-col justify-between overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <Header
        activeNav="compete"
        onSelectNav={(id) => {
          if (id === 'home') onNavigateHome();
          else if (id === 'dashboard') onNavigateDashboard('home');
          else if (id === 'compete') window.location.hash = '#/competitions';
          else if (id === 'learn') onNavigateDashboard('learn');
          else if (id === 'leaderboard') onNavigateDashboard('leaderboard');
          else if (id === 'universities') onNavigateDashboard('universities');
        }}
        onOpenModal={(modal) => {
          if (modal === 'login') onNavigateAuth('login');
          else if (modal === 'signup') onNavigateAuth('signup');
          else setActiveModal(modal);
        }}
        onNavigateAuth={(v) => onNavigateAuth(v)}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
        {/* Banner */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 bg-gradient-to-r from-white/90 via-blue-50/40 to-sky-50/50 shadow-md mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                  Candidate Arena
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {userProfile?.firstName ? `${userProfile.firstName}'s Registrations` : 'My Academic Schedule'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                My Registered Competitions
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Track your active entries, countdowns to live exam windows, and review your Olympiad preparation status.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/competitions';
              }}
              className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-2 shrink-0 self-start sm:self-auto cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              <span>Browse All Competitions</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 mb-6">
          {(
            [
              { id: 'all', label: 'All Registered' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'live', label: 'Live Now' },
              { id: 'completed', label: 'Concluded' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white/80 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List Content */}
        {loading ? (
          <div className="p-16 rounded-3xl glass-card text-center text-xs text-slate-400 border border-white/80">
            <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto mb-3" />
            <span>Loading registered competitions from Firestore...</span>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <GlassCard className="p-10 sm:p-14 rounded-3xl text-center border border-white/80">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4 border border-blue-200/60 shadow-sm">
              <BookmarkCheck className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              No registered competitions yet.
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
              Explore the global academic registry, select an Olympiad matching your grade, and verify your eligibility to claim your arena seat.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  window.location.hash = '#/competitions';
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>Explore Competitions</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateDashboard('ai')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-blue-700 text-xs font-bold border border-blue-200 shadow-2xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Practice with AI Teacher</span>
              </button>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRegistrations.map((reg) => (
              <MyCompetitionCard
                key={reg.id}
                registration={reg}
                competition={competitionsMap[reg.competitionId]}
                onViewDetails={(id) => onViewCompetitionDetails(id)}
                onAIPrep={() => onNavigateDashboard('ai')}
                onCancel={handleCancelRegistration}
              />
            ))}
          </div>
        )}
      </main>

      <Footer onOpenModal={(m) => setActiveModal(m)} />
      <PlaceholderModal activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
};
