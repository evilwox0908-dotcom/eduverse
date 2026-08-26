import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardView } from '../types';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { MobileBottomNav } from '../components/dashboard/MobileBottomNav';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { ProgressCards } from '../components/dashboard/ProgressCards';
import { AITeacherCard } from '../components/dashboard/AITeacherCard';
import { UpcomingCompetitionsSection } from '../components/dashboard/UpcomingCompetitionsSection';
import { ContinueLearningSection } from '../components/dashboard/ContinueLearningSection';
import { TodayActivitySection } from '../components/dashboard/TodayActivitySection';
import { LearnPage } from './LearnPage';
import { CompetePage } from './CompetePage';
import { LeaderboardPage } from './LeaderboardPage';
import { ProfilePage } from './ProfilePage';
import { GenericSectionPage } from './GenericSectionPage';
import { AITeacherPage } from './AITeacherPage';

interface DashboardProps {
  initialView?: DashboardView;
}

export const Dashboard: React.FC<DashboardProps> = ({ initialView = 'home' }) => {
  const { userProfile, user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<DashboardView>(initialView);
  const [initialAIPrompt, setInitialAIPrompt] = useState<string>('');
  const [initialActionType, setInitialActionType] = useState<string | undefined>();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleLaunchAIWithTopic = (topic: string, actionType?: string) => {
    setInitialAIPrompt(`Can you explain the key concepts, formulas, and competition strategies for "${topic}"?`);
    setInitialActionType(actionType || 'explain');
    setCurrentView('ai');
  };

  const handleTriggerQuickPrompt = (prompt: string, actionType?: string) => {
    setInitialAIPrompt(prompt);
    setInitialActionType(actionType);
    setCurrentView('ai');
  };

  // If user selected 'ai', render the full immersive AI Teacher page
  if (currentView === 'ai') {
    return (
      <AITeacherPage
        onBackToDashboard={() => setCurrentView('home')}
        initialPrompt={initialAIPrompt}
        initialActionType={initialActionType}
      />
    );
  }

  return (
    <div className="min-h-screen bg-ambient-light text-slate-900 flex flex-col justify-between">
      <div className="max-w-[1600px] mx-auto w-full p-3 sm:p-6 lg:p-8 flex gap-8">
        {/* Desktop Fixed Glass Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={(view) => {
            if (view === 'ai') {
              setInitialAIPrompt('');
              setInitialActionType(undefined);
            }
            setCurrentView(view);
          }}
          onLogout={handleLogout}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-8">
          {/* Top Floating Glass Header */}
          <DashboardHeader
            onSelectView={(view) => {
              if (view === 'ai') {
                setInitialAIPrompt('');
                setInitialActionType(undefined);
              }
              setCurrentView(view);
            }}
          />

          {/* Sub-view Content Switcher */}
          {currentView === 'home' && (
            <div>
              {/* Dynamic Welcome Banner with 3D Scene */}
              <WelcomeBanner onSelectView={setCurrentView} />

              {/* Real Performance & Ranking Metrics */}
              <ProgressCards onSelectView={setCurrentView} />

              {/* EduVerse AI Teacher Main Card with 3D Orb */}
              <AITeacherCard
                onSelectView={setCurrentView}
                onTriggerQuickPrompt={handleTriggerQuickPrompt}
              />

              {/* Upcoming Competitions (70% Focus) */}
              <UpcomingCompetitionsSection onSelectView={setCurrentView} />

              {/* Continue Learning (30% Focus) */}
              <ContinueLearningSection onSelectView={setCurrentView} />

              {/* Real Daily Activity */}
              <TodayActivitySection onSelectView={setCurrentView} />
            </div>
          )}

          {currentView === 'learn' && (
            <LearnPage
              onSelectView={setCurrentView}
              onLaunchAIWithTopic={handleLaunchAIWithTopic}
            />
          )}

          {currentView === 'compete' && (
            <CompetePage onSelectView={setCurrentView} />
          )}

          {currentView === 'leaderboard' && (
            <LeaderboardPage onSelectView={setCurrentView} />
          )}

          {currentView === 'profile' && (
            <ProfilePage onSelectView={setCurrentView} />
          )}

          {(currentView === 'universities' ||
            currentView === 'events' ||
            currentView === 'settings') && (
            <GenericSectionPage
              view={currentView}
              onSelectView={setCurrentView}
            />
          )}
        </main>
      </div>

      {/* Mobile Touch Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        onSelectView={(view) => {
          if (view === 'ai') {
            setInitialAIPrompt('');
            setInitialActionType(undefined);
          }
          setCurrentView(view);
        }}
      />
    </div>
  );
};
