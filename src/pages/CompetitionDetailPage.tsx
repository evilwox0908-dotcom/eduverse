import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Clock,
  Globe,
  FileQuestion,
  Sparkles,
  ShieldCheck,
  Award,
  HelpCircle,
  BookmarkCheck,
  CreditCard,
  Users,
  CheckCircle2,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import { GlassCard } from '../components/ui/GlassCard';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PlaceholderModal } from '../components/placeholder/PlaceholderModal';
import { Competition3DCanvas } from '../components/competitions/Competition3DCanvas';
import { EligibilityPanel } from '../components/competitions/EligibilityPanel';
import { CountdownTimer } from '../components/competitions/CountdownTimer';
import { RegistrationModal } from '../components/competitions/RegistrationModal';
import { RegistrationSuccessModal } from '../components/competitions/RegistrationSuccessModal';
import { useAuth } from '../context/AuthContext';
import { useCompetition } from '../hooks/useCompetition';
import { useRegistration } from '../hooks/useRegistration';
import { evaluateStudentEligibility } from '../services/eligibilityService';
import { ActiveModal, DashboardView } from '../types';

interface CompetitionDetailPageProps {
  competitionId: string;
  onNavigateBack: () => void;
  onNavigateDashboard: (view?: DashboardView) => void;
  onNavigateAuth: (view: 'login' | 'signup' | 'onboarding' | 'dashboard') => void;
}

export const CompetitionDetailPage: React.FC<CompetitionDetailPageProps> = ({
  competitionId,
  onNavigateBack,
  onNavigateDashboard,
  onNavigateAuth,
}) => {
  const { user, userProfile } = useAuth();
  const { competition, loading, error } = useCompetition(competitionId);
  const {
    registration,
    isRegistered,
    loading: regCheckLoading,
    submitting,
    error: regError,
    register,
    cancel,
  } = useRegistration(competition, userProfile);

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const eligibility = evaluateStudentEligibility(competition, userProfile);

  const handleOpenRegistration = () => {
    if (!user) {
      onNavigateAuth('login');
      return;
    }
    if (userProfile && !userProfile.profileCompleted) {
      onNavigateAuth('onboarding');
      return;
    }
    setIsRegModalOpen(true);
  };

  const handleConfirmRegistration = async () => {
    const res = await register();
    if (res) {
      setIsRegModalOpen(false);
      setIsSuccessModalOpen(true);
    }
  };

  const isFree = !competition?.entryFee || competition.entryFee === 0;

  // Default FAQ if not present in doc
  const faqs = competition?.faq && competition.faq.length > 0
    ? competition.faq
    : [
        {
          question: 'How is the exam administered and proctored?',
          answer: 'All EduVerse Olympiads are conducted via our browser-based secure assessment environment with anti-cheat detection, tab lock, and timekeeping.',
        },
        {
          question: 'What materials and calculators are permitted?',
          answer: 'Specific Olympiad guidelines will indicate whether standard scientific calculators are allowed. Formula sheets and reference tables will be integrated into the test interface.',
        },
        {
          question: 'When will the global rankings and certificates be published?',
          answer: 'Preliminary results are verified within 48 hours of arena closure. Official certificates and world rankings will be posted to your student portfolio.',
        },
        {
          question: 'Can I cancel my registration if my schedule changes?',
          answer: 'Yes, you may withdraw your candidate registration up until 24 hours prior to the scheduled arena start time directly from your dashboard.',
        },
      ];

  const rules = competition?.rules && competition.rules.length > 0
    ? competition.rules
    : [
        'Single attempt strictly limited to the stated duration.',
        'Strict individual testing: No external assistance, generative AI tools, or unauthorized collaboration.',
        'Scores are calculated based on accuracy and timestamp tie-breakers.',
        'All candidates must adhere to the EduVerse Academic Integrity Code.',
      ];

  return (
    <div className="min-h-screen bg-ambient-light flex flex-col justify-between overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <Header
        activeNav="compete"
        onSelectNav={(id) => {
          if (id === 'home') onNavigateBack();
          else if (id === 'dashboard') onNavigateDashboard('home');
          else if (id === 'compete') onNavigateBack();
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
        {/* Back Link */}
        <button
          type="button"
          onClick={onNavigateBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 mb-6 group transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Competition Registry</span>
        </button>

        {loading ? (
          <div className="p-16 rounded-3xl glass-card text-center text-xs text-slate-400 border border-white/80">
            <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto mb-3" />
            <span>Loading competition specifications from Firestore...</span>
          </div>
        ) : error || !competition ? (
          <GlassCard className="p-12 rounded-3xl text-center border border-white/80">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-slate-900">Competition Not Found</h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              The requested competition is either not published or has been moved.
            </p>
            <button
              type="button"
              onClick={onNavigateBack}
              className="mt-6 px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Return to Registry
            </button>
          </GlassCard>
        ) : (
          <div className="space-y-8">
            {/* Top Detail Hero Card */}
            <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/80 bg-gradient-to-br from-white/90 via-blue-50/40 to-sky-50/60 shadow-lg shadow-blue-900/5 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left info column */}
                <div className="lg:col-span-7 flex flex-col items-start z-10">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200 shadow-2xs">
                      {competition.subject} ({competition.category})
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                      {competition.status}
                    </span>
                    {competition.educationLevel && (
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                        {competition.educationLevel}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                    {competition.title}
                  </h1>

                  <p className="text-sm text-slate-600 leading-relaxed max-w-xl mb-6">
                    {competition.description}
                  </p>

                  {/* Quick Countdown */}
                  {competition.startAt && (
                    <div className="mb-6">
                      <CountdownTimer targetDate={competition.startAt} label="Arena Countdown" />
                    </div>
                  )}

                  {/* Primary Action Button Bar */}
                  <div className="flex flex-wrap items-center gap-3">
                    {isRegistered ? (
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          id="enter-competition-exam-btn"
                          onClick={() => {
                            window.location.hash = `#/competitions/${competition.id}/exam`;
                          }}
                          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Enter Competition Arena</span>
                        </button>

                        <div className="px-4 py-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                          <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                          <span>Registered</span>
                        </div>

                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => cancel()}
                          className="px-3.5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-500 hover:text-red-600 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
                        >
                          Withdraw
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleOpenRegistration}
                        className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>
                          {isFree ? 'Register for Free' : `Register ($${competition.entryFee} ${competition.currency || 'USD'})`}
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onNavigateDashboard('ai')}
                      className="px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-blue-700 text-xs font-bold border border-blue-200/80 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Prepare with AI Teacher</span>
                    </button>
                  </div>
                </div>

                {/* Right 3D Visual */}
                <div className="lg:col-span-5 w-full flex items-center justify-center">
                  <Competition3DCanvas compact={true} />
                </div>
              </div>
            </div>

            {/* Specifications & Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <GlassCard className="p-4 rounded-3xl border border-white/80">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>Start Date</span>
                </div>
                <div className="text-sm font-black text-slate-900">
                  {competition.startAt
                    ? new Date(competition.startAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : competition.startDate || 'TBA'}
                </div>
              </GlassCard>

              <GlassCard className="p-4 rounded-3xl border border-white/80">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
                  <Clock className="w-4 h-4 text-sky-500" />
                  <span>Duration</span>
                </div>
                <div className="text-sm font-black text-slate-900">
                  {competition.durationMinutes
                    ? `${competition.durationMinutes} Minutes`
                    : competition.duration || '60 Minutes'}
                </div>
              </GlassCard>

              <GlassCard className="p-4 rounded-3xl border border-white/80">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
                  <FileQuestion className="w-4 h-4 text-purple-500" />
                  <span>Questions</span>
                </div>
                <div className="text-sm font-black text-slate-900">
                  {competition.questionCount ? `${competition.questionCount} Items` : 'Standard'}
                </div>
              </GlassCard>

              <GlassCard className="p-4 rounded-3xl border border-white/80">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span>Division</span>
                </div>
                <div className="text-sm font-black text-slate-900 truncate">
                  {competition.countryScope ||
                    (competition.eligibleCountries && competition.eligibleCountries.length > 0
                      ? competition.eligibleCountries.join(', ')
                      : 'Global Open')}
                </div>
              </GlassCard>
            </div>

            {/* Eligibility Section & Live Status */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Eligibility Panel Column */}
              <div className="lg:col-span-7">
                <GlassCard className="p-6 sm:p-8 rounded-3xl border border-white/80">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span>Candidate Eligibility Assessment</span>
                  </h3>
                  <EligibilityPanel
                    eligibility={eligibility}
                    isAuthenticated={Boolean(user)}
                    onLoginPrompt={() => onNavigateAuth('login')}
                    onCompleteProfile={() => onNavigateAuth('onboarding')}
                  />
                </GlassCard>
              </div>

              {/* Prize & Scoring System Column */}
              <div className="lg:col-span-5 space-y-6">
                <GlassCard className="p-6 rounded-3xl border border-white/80 bg-gradient-to-br from-amber-50/40 to-white/90">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Global Awards & Certificates
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {competition.prizeInfo ||
                      'Top 1% earn Gold Honor Medals, verified digital credentials, and admission recommendations to partner universities.'}
                  </p>
                </GlassCard>

                <GlassCard className="p-6 rounded-3xl border border-white/80">
                  <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <FileQuestion className="w-4 h-4 text-blue-600" />
                    <span>Scoring & Format</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-center justify-between">
                      <span className="font-semibold text-slate-500">Scoring Mode:</span>
                      <span className="font-bold text-slate-800">{competition.scoringMode || 'Standard Correct Weighting'}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-semibold text-slate-500">Academic Level:</span>
                      <span className="font-bold text-slate-800">{competition.level || competition.grade || 'All Grades'}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="font-semibold text-slate-500">Seat Capacity:</span>
                      <span className="font-bold text-slate-800">
                        {competition.participantLimit ? `${competition.participantLimit} Max` : 'Open'}
                      </span>
                    </li>
                  </ul>
                </GlassCard>
              </div>
            </div>

            {/* Rules and FAQ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Competition Rules */}
              <GlassCard className="p-6 sm:p-8 rounded-3xl border border-white/80">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Competition Rules & Honor Code</span>
                </h3>
                <div className="space-y-2.5">
                  {rules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{rule}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Frequently Asked Questions */}
              <GlassCard className="p-6 sm:p-8 rounded-3xl border border-white/80">
                <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-blue-600" />
                  <span>Frequently Asked Questions</span>
                </h3>
                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200/80 bg-white/70 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-2 text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                            openFaqIndex === idx ? 'rotate-180 text-blue-600' : ''
                          }`}
                        />
                      </button>
                      {openFaqIndex === idx && (
                        <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        )}
      </main>

      <Footer onOpenModal={(m) => setActiveModal(m)} />

      {/* Modals */}
      <RegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        competition={competition}
        userProfile={userProfile}
        eligibility={eligibility}
        onConfirmRegistration={handleConfirmRegistration}
        loading={submitting}
        error={regError}
      />

      <RegistrationSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        competition={competition}
        registration={registration}
        onViewMyCompetitions={() => {
          setIsSuccessModalOpen(false);
          window.location.hash = '#/my-competitions';
        }}
      />

      <PlaceholderModal activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
};
