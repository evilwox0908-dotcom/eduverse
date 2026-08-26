import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

export function useStreak() {
  const { userProfile } = useAuth();

  const currentStreak = userProfile?.currentStreak ?? 0;
  const longestStreak = userProfile?.longestStreak ?? 0;
  const lastActivityDate = userProfile?.lastActivityDate ?? null;
  const streakFreezeCount = userProfile?.streakFreezeCount ?? 0;

  const isActiveToday = useMemo(() => {
    if (!lastActivityDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return lastActivityDate === today;
  }, [lastActivityDate]);

  return {
    currentStreak,
    longestStreak,
    lastActivityDate,
    streakFreezeCount,
    isActiveToday,
  };
}
