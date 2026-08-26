import { useState, useEffect } from 'react';
import { Competition } from '../types';
import { subscribeToCompetition } from '../services/competitionService';

export function useCompetition(competitionId: string | undefined | null) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!competitionId) {
      setCompetition(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToCompetition(competitionId, (data) => {
      setCompetition(data);
      setLoading(false);
      if (!data) {
        setError('Competition not found or is no longer published.');
      }
    });

    return () => unsubscribe();
  }, [competitionId]);

  return { competition, loading, error };
}
