import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { HeroSection } from './components/hero/HeroSection';
import { InfoCardsSection } from './components/home/InfoCardsSection';
import { Footer } from './components/layout/Footer';
import { InitialLoader } from './components/loading/InitialLoader';
import { PlaceholderModal } from './components/placeholder/PlaceholderModal';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { AITeacherPage } from './pages/AITeacherPage';
import { CompetitionsHubPage } from './pages/CompetitionsHubPage';
import { CompetitionDetailPage } from './pages/CompetitionDetailPage';
import { MyCompetitionsPage } from './pages/MyCompetitionsPage';
import { ExamPage } from './pages/ExamPage';
import { CompetitionResultsPage } from './pages/CompetitionResultsPage';
import { ActiveModal, DashboardView } from './types';

type PageView =
  | 'home'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'onboarding'
  | 'dashboard'
  | 'ai'
  | 'learn'
  | 'compete'
  | 'competitions'
  | 'competition-detail'
  | 'competition-exam'
  | 'competition-results'
  | 'my-competitions'
  | 'leaderboard'
  | 'universities'
  | 'events'
  | 'profile'
  | 'settings'
  | 'admin';

function AppContent() {
  const { user, userProfile, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<PageView>('home');
  const [activeCompetitionId, setActiveCompetitionId] = useState<string | null>(null);
  const [activeResultId, setActiveResultId] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState('home');
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // Initial loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Sync with window location hash
  useEffect(() => {
    const handleHashChange = () => {
      // Check query params in window.location.search or hash for reset password mode
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '');
      const mode = urlParams.get('mode') || hashParams.get('mode');
      const oobCode = urlParams.get('oobCode') || hashParams.get('oobCode');

      if (mode === 'resetPassword' || oobCode) {
        setCurrentView('forgot-password');
        return;
      }

      const rawHash = window.location.hash.split('?')[0].replace('#/', '').replace('#', '');

      // Check for dynamic /competitions/:id/results/:resultId
      if (rawHash.startsWith('competitions/') && rawHash.includes('/results/')) {
        const parts = rawHash.split('/');
        const id = parts[1];
        const resId = parts[3];
        setActiveCompetitionId(id);
        setActiveResultId(resId);
        setCurrentView('competition-results');
        return;
      }

      // Check for dynamic /competitions/:id/exam
      if (rawHash.startsWith('competitions/') && rawHash.endsWith('/exam')) {
        const parts = rawHash.split('/');
        const id = parts[1];
        setActiveCompetitionId(id);
        setCurrentView('competition-exam');
        return;
      }

      // Check for dynamic /competitions/:id
      if (rawHash.startsWith('competitions/') && rawHash.split('/')[1]) {
        const id = rawHash.split('/')[1];
        setActiveCompetitionId(id);
        setCurrentView('competition-detail');
        setActiveNav('compete');
        return;
      }

      const validViews: PageView[] = [
        'login',
        'signup',
        'forgot-password',
        'onboarding',
        'dashboard',
        'ai',
        'learn',
        'compete',
        'competitions',
        'competition-detail',
        'competition-exam',
        'competition-results',
        'my-competitions',
        'leaderboard',
        'universities',
        'events',
        'profile',
        'settings',
        'admin',
      ];

      if (validViews.includes(rawHash as PageView)) {
        setCurrentView(rawHash as PageView);
        if (rawHash === 'competitions' || rawHash === 'compete' || rawHash === 'my-competitions') {
          setActiveNav('compete');
        } else {
          setActiveNav(rawHash);
        }
      } else {
        setCurrentView('home');
        setActiveNav('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Protected Route Logic
  useEffect(() => {
    if (!loading) {
      const protectedViews: PageView[] = [
        'dashboard',
        'my-competitions',
        'ai',
        'learn',
        'leaderboard',
        'universities',
        'events',
        'profile',
        'settings',
        'admin',
      ];

      if (protectedViews.includes(currentView)) {
        if (!user) {
          window.location.hash = '#/login';
          setCurrentView('login');
        } else if (userProfile && !userProfile.profileCompleted) {
          window.location.hash = '#/onboarding';
          setCurrentView('onboarding');
        }
      } else if (currentView === 'onboarding') {
        if (!user) {
          window.location.hash = '#/login';
          setCurrentView('login');
        }
      }
    }
  }, [user, userProfile, currentView, loading]);

  const navigateTo = (view: PageView, param?: string) => {
    setCurrentView(view);
    if (view === 'competition-detail' && param) {
      setActiveCompetitionId(param);
      window.location.hash = `#/competitions/${param}`;
    } else {
      window.location.hash = `#/${view === 'home' ? '' : view}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectNav = (navId: string) => {
    setActiveNav(navId);
    if (navId === 'home') {
      navigateTo('home');
    } else if (navId === 'compete') {
      navigateTo('competitions');
    } else if (navId === 'dashboard') {
      navigateTo('dashboard');
    } else if (navId === 'ai') {
      navigateTo('ai');
    } else if (['learn', 'leaderboard', 'universities'].includes(navId)) {
      if (user) {
        navigateTo(navId as PageView);
      } else {
        setActiveModal(navId as ActiveModal);
      }
    }
  };

  const handleOpenModal = (modal: ActiveModal) => {
    if (modal === 'login') {
      navigateTo('login');
    } else if (modal === 'signup') {
      navigateTo('signup');
    } else if (modal === 'competitions' || modal === 'compete') {
      navigateTo('competitions');
    } else if (modal === 'ai' || modal === 'learn' || modal === 'leaderboard') {
      if (user) {
        navigateTo(modal as PageView);
      } else {
        setActiveModal(modal);
      }
    } else {
      setActiveModal(modal);
    }
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="relative min-h-screen bg-ambient-light flex flex-col justify-between overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Initial Loading Screen */}
      <InitialLoader isLoading={isLoading} />

      {/* Atmospheric Ambient Glows */}
      <div className="pointer-events-none fixed top-0 right-0 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] -z-10" />
      <div className="pointer-events-none fixed top-1/3 left-0 w-[500px] h-[500px] bg-sky-200/25 rounded-full blur-[100px] -z-10" />
      <div className="pointer-events-none fixed bottom-0 right-1/4 w-[700px] h-[500px] bg-indigo-100/30 rounded-full blur-[140px] -z-10" />

      {/* 1. Home View */}
      {currentView === 'home' && (
        <>
          <Header
            activeNav={activeNav}
            onSelectNav={handleSelectNav}
            onOpenModal={handleOpenModal}
            onNavigateAuth={(v) => navigateTo(v)}
          />

          <main className="flex-1 w-full">
            <HeroSection onOpenModal={handleOpenModal} />
            <InfoCardsSection onOpenModal={handleOpenModal} />
          </main>

          <Footer onOpenModal={handleOpenModal} />
        </>
      )}

      {/* 2. Public Competitions Hub Route (#/competitions) */}
      {currentView === 'competitions' && (
        <CompetitionsHubPage
          onNavigateHome={() => navigateTo('home')}
          onNavigateDashboard={(view) => navigateTo(view === 'compete' ? 'competitions' : (view || 'dashboard') as PageView)}
          onNavigateAuth={(v) => navigateTo(v)}
          onViewCompetitionDetails={(id) => navigateTo('competition-detail', id)}
        />
      )}

      {/* 3. Competition Detail Page (#/competitions/:id) */}
      {currentView === 'competition-detail' && activeCompetitionId && (
        <CompetitionDetailPage
          competitionId={activeCompetitionId}
          onNavigateBack={() => navigateTo('competitions')}
          onNavigateDashboard={(view) => navigateTo((view || 'dashboard') as PageView)}
          onNavigateAuth={(v) => navigateTo(v)}
        />
      )}

      {/* 4. Student My Competitions Page (#/my-competitions) */}
      {currentView === 'my-competitions' && (
        <MyCompetitionsPage
          onNavigateHome={() => navigateTo('home')}
          onNavigateDashboard={(view) => navigateTo((view || 'dashboard') as PageView)}
          onNavigateAuth={(v) => navigateTo(v)}
          onViewCompetitionDetails={(id) => navigateTo('competition-detail', id)}
        />
      )}

      {/* 5. Full-Screen Competition Exam Engine (#/competitions/:id/exam) */}
      {currentView === 'competition-exam' && activeCompetitionId && (
        <ExamPage
          competitionId={activeCompetitionId}
          currentUser={user}
          userProfile={userProfile}
          onNavigate={(path) => {
            window.location.hash = `#${path.startsWith('/') ? path : '/' + path}`;
          }}
        />
      )}

      {/* 6. Official Competition Results (#/competitions/:id/results/:resultId) */}
      {currentView === 'competition-results' && activeCompetitionId && activeResultId && (
        <CompetitionResultsPage
          competitionId={activeCompetitionId}
          resultId={activeResultId}
          currentUser={user}
          onNavigate={(path) => {
            window.location.hash = `#${path.startsWith('/') ? path : '/' + path}`;
          }}
        />
      )}

      {/* 7. Auth Views: Login, Signup, Forgot Password, Onboarding */}
      {(currentView === 'login' ||
        currentView === 'signup' ||
        currentView === 'forgot-password' ||
        currentView === 'onboarding') && (
        <AuthPage
          initialView={currentView}
          onNavigateHome={() => navigateTo('home')}
          onNavigateDashboard={() => navigateTo('dashboard')}
        />
      )}

      {/* 8. Standalone AI Teacher Route */}
      {currentView === 'ai' && (
        <AITeacherPage onBackToDashboard={() => navigateTo('dashboard')} />
      )}

      {/* 9. Authenticated Dashboard and its sub-views */}
      {(currentView === 'dashboard' ||
        currentView === 'learn' ||
        currentView === 'compete' ||
        currentView === 'leaderboard' ||
        currentView === 'universities' ||
        currentView === 'events' ||
        currentView === 'profile' ||
        currentView === 'settings' ||
        currentView === 'admin') && (
        <Dashboard initialView={currentView === 'dashboard' ? 'home' : (currentView as DashboardView)} />
      )}

      {/* Modal Handler for guest users */}
      <PlaceholderModal activeModal={activeModal} onClose={handleCloseModal} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
