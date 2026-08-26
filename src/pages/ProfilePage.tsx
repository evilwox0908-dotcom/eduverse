import React, { useState, useEffect } from 'react';
import {
  Award,
  Calendar,
  Trophy,
  Zap,
  Flame,
  LayoutGrid,
  History,
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { DashboardView, UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import { useStudentProfile } from '../hooks/useStudentProfile';
import { useXP } from '../hooks/useXP';
import { useAchievements } from '../hooks/useAchievements';
import { useStreak } from '../hooks/useStreak';
import { useActivity } from '../hooks/useActivity';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileStats } from '../components/profile/ProfileStats';
import { XPProgressCard } from '../components/profile/XPProgressCard';
import { StreakCard } from '../components/profile/StreakCard';
import { AchievementGrid } from '../components/profile/AchievementGrid';
import { ActivityTimeline } from '../components/profile/ActivityTimeline';
import { CompetitionRecordSection } from '../components/profile/CompetitionRecordSection';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { LevelUpModal } from '../components/profile/LevelUpModal';
import { PublicProfileModal } from '../components/profile/PublicProfileModal';
import { fetchStudentAcademicSummary } from '../services/profileService';
import { hasSeenLevelCelebration, markLevelCelebrationSeen } from '../services/xpService';

interface ProfilePageProps {
  onSelectView: (view: DashboardView) => void;
}

type ProfileTab = 'OVERVIEW' | 'ACHIEVEMENTS' | 'ACTIVITY' | 'COMPETITIONS';

export const ProfilePage: React.FC<ProfilePageProps> = ({ onSelectView }) => {
  const { user } = useAuth();
  const { profile, completion, syncProfile, reload } = useStudentProfile();
  const { totalXp, levelInfo } = useXP();
  const { masterList, unlockedAchievements, unlockedMap } = useAchievements();
  const { currentStreak, longestStreak, isActiveToday, streakFreezeCount } = useStreak();
  const { activities } = useActivity();

  const [activeTab, setActiveTab] = useState<ProfileTab>('OVERVIEW');
  const [competitionResults, setCompetitionResults] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPublicModalOpen, setIsPublicModalOpen] = useState(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [previousLevel, setPreviousLevel] = useState<number>(1);

  // Fetch verified competition submissions
  useEffect(() => {
    if (!user) return;
    async function loadSummary() {
      try {
        const summary = await fetchStudentAcademicSummary(user!.uid);
        if (summary.competitionResults) {
          setCompetitionResults(summary.competitionResults);
        }
      } catch (e) {
        console.warn('Could not fetch competition results for profile:', e);
      }
    }
    loadSummary();
  }, [user]);

  // Check for level up celebration
  useEffect(() => {
    if (!user || levelInfo.level <= 1) return;
    if (!hasSeenLevelCelebration(user.uid, levelInfo.level)) {
      setPreviousLevel(levelInfo.level - 1);
      setIsLevelUpModalOpen(true);
    }
  }, [user, levelInfo.level]);

  const handleDismissLevelUp = () => {
    if (user) {
      markLevelCelebrationSeen(user.uid, levelInfo.level);
    }
    setIsLevelUpModalOpen(false);
  };

  const handleSaveProfile = async (updates: Partial<UserProfile>) => {
    await syncProfile(updates);
    await reload();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Primary Profile Header Card with 3D Canvas */}
      <ProfileHeader
        profile={profile}
        completion={completion}
        onEditClick={() => setIsEditModalOpen(true)}
        onPublicPreviewClick={() => setIsPublicModalOpen(true)}
      />

      {/* 2. Key Academic Stats Bar */}
      <ProfileStats
        totalXp={totalXp}
        levelInfo={levelInfo}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        completedCompetitionsCount={competitionResults.length}
        unlockedAchievementsCount={unlockedAchievements.length}
        totalAchievementsCount={masterList.length}
      />

      {/* 3. Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-px">
          <button
            type="button"
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'OVERVIEW'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Academic Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ACHIEVEMENTS')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'ACHIEVEMENTS'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Achievements ({unlockedAchievements.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ACTIVITY')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'ACTIVITY'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Activity Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('COMPETITIONS')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'COMPETITIONS'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Olympiad History ({competitionResults.length})</span>
          </button>
        </div>
      </div>

      {/* 4. Tab Content */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-8">
          {/* Progression Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <XPProgressCard totalXp={totalXp} levelInfo={levelInfo} />
            <StreakCard
              currentStreak={currentStreak}
              longestStreak={longestStreak}
              isActiveToday={isActiveToday}
              streakFreezeCount={streakFreezeCount}
              onTakeActionClick={() => onSelectView('ai')}
            />
          </div>

          {/* Unlocked Achievements Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Academic Milestones
                </h3>
                <p className="text-xs text-slate-500">
                  Verified achievements awarded across competitions and platform mastery
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('ACHIEVEMENTS')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({masterList.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <AchievementGrid
              masterList={masterList.slice(0, 6)}
              unlockedAchievements={unlockedAchievements}
              unlockedMap={unlockedMap}
            />
          </div>

          {/* Verified Competition Record Section */}
          <CompetitionRecordSection
            results={competitionResults}
            onViewResultClick={() => onSelectView('competitions')}
          />
        </div>
      )}

      {activeTab === 'ACHIEVEMENTS' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">All Achievements</h3>
            <p className="text-xs text-slate-500">
              Complete academic tasks, maintain learning streaks, and score high in Olympiads to unlock badges and earn XP.
            </p>
          </div>

          <AchievementGrid
            masterList={masterList}
            unlockedAchievements={unlockedAchievements}
            unlockedMap={unlockedMap}
          />
        </div>
      )}

      {activeTab === 'ACTIVITY' && (
        <div className="space-y-6">
          <ActivityTimeline activities={activities} />
        </div>
      )}

      {activeTab === 'COMPETITIONS' && (
        <div className="space-y-6">
          <CompetitionRecordSection
            results={competitionResults}
            onViewResultClick={() => onSelectView('competitions')}
          />
        </div>
      )}

      {/* 5. Modals */}
      <EditProfileModal
        profile={profile}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />

      <PublicProfileModal
        isOpen={isPublicModalOpen}
        onClose={() => setIsPublicModalOpen(false)}
        identifier={profile?.eduVerseId || profile?.uid || ''}
        currentProfile={profile}
      />

      <LevelUpModal
        isOpen={isLevelUpModalOpen}
        previousLevel={previousLevel}
        newLevelInfo={levelInfo}
        onClose={handleDismissLevelUp}
      />
    </div>
  );
};
