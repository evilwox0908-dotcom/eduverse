import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Calendar,
  Clock,
  Globe,
  Sparkles,
  ArrowRight,
  BookmarkCheck,
  Search,
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Competition, CompetitionCategory, DashboardView, CompetitionRegistration } from '../types';
import { useCompetitions } from '../hooks/useCompetitions';
import { CompetitionCard } from '../components/competitions/CompetitionCard';
import { RegistrationModal } from '../components/competitions/RegistrationModal';
import { RegistrationSuccessModal } from '../components/competitions/RegistrationSuccessModal';
import { useAuth } from '../context/AuthContext';
import { evaluateStudentEligibility } from '../services/eligibilityService';
import {
  subscribeToAllStudentRegistrations,
  registerStudentForCompetition,
} from '../services/registrationService';

interface CompetePageProps {
  onSelectView: (view: DashboardView) => void;
}

export const CompetePage: React.FC<CompetePageProps> = ({ onSelectView }) => {
  const { user, userProfile } = useAuth();
  const {
    filteredCompetitions,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useCompetitions();

  const [userRegistrations, setUserRegistrations] = useState<CompetitionRegistration[]>([]);
  const [selectedCompForReg, setSelectedCompForReg] = useState<Competition | null>(null);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmedReg, setConfirmedReg] = useState<CompetitionRegistration | null>(null);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setUserRegistrations([]);
      return;
    }
    const unsub = subscribeToAllStudentRegistrations(user.uid, (regs) => {
      setUserRegistrations(regs);
    });
    return () => unsub();
  }, [user?.uid]);

  const registeredIds = new Set(
    userRegistrations
      .filter((r) => r.status === 'REGISTERED' || r.status === 'PAYMENT_CONFIRMED')
      .map((r) => r.competitionId)
  );

  const handleRegisterClick = (competition: Competition) => {
    setSelectedCompForReg(competition);
    setRegError(null);
    setIsRegModalOpen(true);
  };

  const handleConfirmRegistration = async () => {
    if (!selectedCompForReg || !userProfile) return;
    setRegLoading(true);
    setRegError(null);
    try {
      const reg = await registerStudentForCompetition(selectedCompForReg, userProfile);
      setConfirmedReg(reg);
      setIsRegModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      setRegError(err?.message || 'Failed to complete registration.');
    } finally {
      setRegLoading(false);
    }
  };

  const eligibility = evaluateStudentEligibility(selectedCompForReg, userProfile);

  const categories: CompetitionCategory[] = [
    'All',
    'Academic',
    'Mathematics',
    'Science',
    'English',
    'Programming',
    'General Knowledge',
    'School',
    'University',
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 bg-gradient-to-r from-white/90 via-blue-50/40 to-sky-50/50 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                70% Competition Focus
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Official Global Arenas
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Global Olympiads & Contests
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              Compete against verified scholars worldwide, represent your school and nation, and earn verified global rank.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/my-competitions';
              }}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4 text-blue-600" />
              <span>My Arenas ({userRegistrations.length})</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectView('ai')}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Olympiad Coach</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 flex-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white/80 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              {cat === 'All' ? 'All Arenas' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Competitions Grid */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400 glass-card rounded-3xl border border-white/80">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto mb-3" />
          <span>Loading official competition registry from Firestore...</span>
        </div>
      ) : filteredCompetitions.length === 0 ? (
        <GlassCard className="p-10 rounded-3xl text-center border border-white/80">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-3 border border-blue-200/60 shadow-sm">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            No published competitions available currently.
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
            The next cycle of international and regional qualifiers is being scheduled. Prepare with the EduVerse AI Teacher to maximize your standing.
          </p>
          <div className="mt-5">
            <button
              type="button"
              onClick={() => onSelectView('ai')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch AI Olympiad Practice</span>
            </button>
          </div>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitions.map((comp) => (
            <CompetitionCard
              key={comp.id}
              competition={comp}
              onViewDetails={(id) => {
                window.location.hash = `#/competitions/${id}`;
              }}
              onRegister={handleRegisterClick}
              onAIPrep={() => onSelectView('ai')}
              isRegistered={registeredIds.has(comp.id)}
            />
          ))}
        </div>
      )}

      {/* Registration Modals */}
      <RegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        competition={selectedCompForReg}
        userProfile={userProfile}
        eligibility={eligibility}
        onConfirmRegistration={handleConfirmRegistration}
        loading={regLoading}
        error={regError}
      />

      <RegistrationSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        competition={selectedCompForReg}
        registration={confirmedReg}
        onViewMyCompetitions={() => {
          setIsSuccessModalOpen(false);
          window.location.hash = '#/my-competitions';
        }}
      />
    </div>
  );
};
