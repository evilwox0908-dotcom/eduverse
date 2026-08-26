import { useState, useEffect, useMemo } from 'react';
import { Competition, CompetitionCategory } from '../types';
import { subscribeToPublishedCompetitions } from '../services/competitionService';

export function useCompetitions() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CompetitionCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPublishedCompetitions((data) => {
      setCompetitions(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredCompetitions = useMemo(() => {
    return competitions.filter((comp) => {
      // Category filter
      if (selectedCategory !== 'All') {
        const matchesCategory =
          comp.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          comp.subject?.toLowerCase() === selectedCategory.toLowerCase() ||
          (selectedCategory === 'School' && comp.educationLevel === 'SCHOOL') ||
          (selectedCategory === 'University' && comp.educationLevel === 'UNIVERSITY');

        if (!matchesCategory) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = comp.title?.toLowerCase().includes(query);
        const matchesSubject = comp.subject?.toLowerCase().includes(query);
        const matchesDesc = comp.description?.toLowerCase().includes(query);
        const matchesGrade = comp.grade?.toLowerCase().includes(query);

        if (!matchesTitle && !matchesSubject && !matchesDesc && !matchesGrade) {
          return false;
        }
      }

      return true;
    });
  }, [competitions, selectedCategory, searchQuery]);

  return {
    competitions,
    filteredCompetitions,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    count: filteredCompetitions.length,
  };
}
