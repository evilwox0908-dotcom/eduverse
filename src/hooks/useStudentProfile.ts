import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserProfile, ProfileCompletionInfo } from '../types';
import {
  calculateProfileCompletion,
  syncStudentProfileBackend,
  fetchStudentAcademicSummary,
} from '../services/profileService';

export function useStudentProfile() {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(userProfile);
  const [completion, setCompletion] = useState<ProfileCompletionInfo>(() =>
    calculateProfileCompletion(userProfile)
  );
  const [loading, setLoading] = useState<boolean>(true);

  const reload = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setCompletion(calculateProfileCompletion(null));
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const summary = await fetchStudentAcademicSummary(user.uid);
      const activeProfile = summary.profile || userProfile;
      setProfile(activeProfile);
      setCompletion(calculateProfileCompletion(activeProfile));
    } catch (err) {
      console.error('Error reloading profile state:', err);
      setProfile(userProfile);
      setCompletion(calculateProfileCompletion(userProfile));
    } finally {
      setLoading(false);
    }
  }, [user, userProfile]);

  useEffect(() => {
    if (userProfile) {
      setProfile(userProfile);
      setCompletion(calculateProfileCompletion(userProfile));
      setLoading(false);
    } else if (user) {
      reload();
    } else {
      setProfile(null);
      setCompletion(calculateProfileCompletion(null));
      setLoading(false);
    }
  }, [userProfile, user, reload]);

  const syncProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return null;
    const result = await syncStudentProfileBackend(user.uid, updates);
    setProfile(result.profile);
    setCompletion(result.completion);
    await refreshUserProfile();
    return result;
  };

  return {
    profile,
    completion,
    loading,
    reload,
    syncProfile,
  };
}
