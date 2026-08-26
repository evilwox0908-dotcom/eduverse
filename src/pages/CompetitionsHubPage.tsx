import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PlaceholderModal } from '../components/placeholder/PlaceholderModal';
import { ActiveModal, Competition, CompetitionRegistration, DashboardView } from '../types';
import { CompetitionHero } from '../components/competitions/CompetitionHero';
import { CompetitionGrid } from '../components/competitions/CompetitionGrid';
import { RegistrationModal } from '../components/competitions/RegistrationModal';
import { RegistrationSuccessModal } from '../components/competitions/RegistrationSuccessModal';
import { useCompetitions } from '../hooks/useCompetitions';
import { evaluateStudentEligibility } from '../services/eligibilityService';
import {
  subscribeToAllStudentRegistrations,
  registerStudentForCompetition,
} from '../services/registrationService';

interface CompetitionsHubPageProps {
  onNavigateHome: () => void;
  onNavigateDashboard: (view?: DashboardView) => void;
  onNavigateAuth: (view: 'login' | 'signup' | 'onboarding' | 'dashboard') => void;
  onViewCompetitionDetails: (competitionId: string) => void;
}

export const CompetitionsHubPage: React.FC<CompetitionsHubPageProps> = ({
  onNavigateHome,
  onNavigateDashboard,
  onNavigateAuth,
  onViewCompetitionDetails,
}) => {
  const { user, userProfile } = useAuth();
  const {
    filteredCompetitions,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useCompetitions();

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [userRegistrations, setUserRegistrations] = useState<CompetitionRegistration[]>([]);
  const [selectedCompForReg, setSelectedCompForReg] = useState<Competition | null>(null);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [confirmedReg, setConfirmedReg] = useState<CompetitionRegistration | null>(null);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Subscribe to student registrations if logged in
  useEffect(() => {
    if (!user?.uid) {
      setUserRegistrations([]);
      return;
    }

    const unsubscribe = subscribeToAllStudentRegistrations(user.uid, (regs) => {
      setUserRegistrations(regs);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleRegisterClick = (competition: Competition) => {
    if (!user) {
      onNavigateAuth('login');
      return;
    }
    if (userProfile && !userProfile.profileCompleted) {
      onNavigateAuth('onboarding');
      return;
    }

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

  return (
    <div className="min-h-screen bg-ambient-light flex flex-col justify-between overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
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

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16">
        {/* 3D Competition Hero */}
        <CompetitionHero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onNavigateMyCompetitions={() => {
            window.location.hash = '#/my-competitions';
          }}
        />

        {/* Competitions Grid & Category Filters */}
        <CompetitionGrid
          competitions={filteredCompetitions}
          loading={loading}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onViewDetails={(id) => onViewCompetitionDetails(id)}
          onRegister={handleRegisterClick}
          onAIPrep={() => onNavigateDashboard('ai')}
          userRegistrations={userRegistrations}
        />
      </main>

      {/* Footer */}
      <Footer onOpenModal={(m) => setActiveModal(m)} />

      {/* Registration Modal */}
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

      {/* Registration Success Modal */}
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

      {/* Placeholder modal for guests */}
      <PlaceholderModal activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
};
