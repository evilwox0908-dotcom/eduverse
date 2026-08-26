import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentActivity } from '../types';
import { fetchStudentAcademicSummary } from '../services/profileService';

export function useActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<StudentActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function loadActivities() {
      try {
        const summary = await fetchStudentAcademicSummary(user!.uid);
        if (isMounted) {
          setActivities(summary.activities || []);
        }
      } catch (err) {
        console.error('Error loading student activity timeline:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadActivities();
    return () => {
      isMounted = false;
    };
  }, [user]);

  return {
    activities,
    loading,
  };
}
