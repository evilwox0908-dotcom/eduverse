import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AchievementDefinition, StudentAchievement } from '../types';
import { MASTER_ACHIEVEMENTS } from '../services/achievementService';
import { fetchStudentAcademicSummary } from '../services/profileService';

export function useAchievements() {
  const { user } = useAuth();
  const [unlockedAchievements, setUnlockedAchievements] = useState<StudentAchievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      setUnlockedAchievements([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function loadAchievements() {
      try {
        const summary = await fetchStudentAcademicSummary(user!.uid);
        if (isMounted) {
          setUnlockedAchievements(summary.achievements || []);
        }
      } catch (err) {
        console.error('Error loading achievements:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAchievements();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const unlockedMap = new Map(unlockedAchievements.map((a) => [a.achievementId, a]));

  return {
    masterList: MASTER_ACHIEVEMENTS,
    unlockedAchievements,
    unlockedMap,
    unlockedCount: unlockedAchievements.length,
    totalCount: MASTER_ACHIEVEMENTS.length,
    loading,
  };
}
