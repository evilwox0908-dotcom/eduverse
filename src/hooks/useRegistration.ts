import { useState, useEffect, useCallback } from 'react';
import { Competition, CompetitionRegistration, UserProfile } from '../types';
import {
  subscribeToStudentRegistration,
  registerStudentForCompetition,
  cancelStudentRegistration,
} from '../services/registrationService';

export function useRegistration(
  competition: Competition | null | undefined,
  userProfile: UserProfile | null | undefined
) {
  const [registration, setRegistration] = useState<CompetitionRegistration | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const competitionId = competition?.id;
  const studentId = userProfile?.uid;

  useEffect(() => {
    if (!competitionId || !studentId) {
      setRegistration(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToStudentRegistration(
      competitionId,
      studentId,
      (reg) => {
        setRegistration(reg);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [competitionId, studentId]);

  const register = useCallback(async (): Promise<CompetitionRegistration | null> => {
    if (!competition || !userProfile) {
      setError('You must be logged in with a complete profile to register.');
      return null;
    }

    setSubmitting(true);
    setError(null);

    try {
      const newReg = await registerStudentForCompetition(competition, userProfile);
      setRegistration(newReg);
      return newReg;
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError(err?.message || 'Failed to complete competition registration.');
      return null;
    } finally {
      setSubmitting(false);
    }
  }, [competition, userProfile]);

  const cancel = useCallback(async (): Promise<boolean> => {
    if (!competitionId || !studentId) return false;

    setSubmitting(true);
    setError(null);

    try {
      await cancelStudentRegistration(competitionId, studentId);
      return true;
    } catch (err: any) {
      console.error('Cancellation failed:', err);
      setError(err?.message || 'Failed to cancel registration.');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [competitionId, studentId]);

  const isRegistered =
    registration?.status === 'REGISTERED' ||
    registration?.status === 'PAYMENT_CONFIRMED' ||
    registration?.status === 'PAYMENT_PENDING';

  return {
    registration,
    isRegistered,
    loading,
    submitting,
    error,
    register,
    cancel,
    clearError: () => setError(null),
  };
}
