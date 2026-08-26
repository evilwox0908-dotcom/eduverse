import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LevelInfo, XPTransaction } from '../types';
import { getLevelInfo } from '../services/xpService';
import { fetchStudentAcademicSummary } from '../services/profileService';

export function useXP() {
  const { user, userProfile } = useAuth();
  const [totalXp, setTotalXp] = useState<number>(userProfile?.xp ?? 0);
  const [transactions, setTransactions] = useState<XPTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (userProfile?.xp !== undefined) {
      setTotalXp(userProfile.xp);
    }
  }, [userProfile?.xp]);

  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function loadData() {
      try {
        const summary = await fetchStudentAcademicSummary(user!.uid);
        if (isMounted) {
          if (summary.profile?.xp !== undefined) {
            setTotalXp(summary.profile.xp);
          }
          setTransactions(summary.xpTransactions || []);
        }
      } catch (err) {
        console.error('Error fetching student XP transactions:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const levelInfo: LevelInfo = getLevelInfo(totalXp);

  return {
    totalXp,
    levelInfo,
    transactions,
    loading,
  };
}
