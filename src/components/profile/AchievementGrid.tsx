import React, { useState, useMemo } from 'react';
import { Award, Search, Filter, CheckCircle2, Lock } from 'lucide-react';
import { AchievementDefinition, StudentAchievement, AchievementCategory } from '../../types';
import { AchievementCard } from './AchievementCard';
import { CATEGORY_LABELS } from '../../services/achievementService';

interface AchievementGridProps {
  masterList: AchievementDefinition[];
  unlockedAchievements: StudentAchievement[];
  unlockedMap: Map<string, StudentAchievement>;
}

type StatusFilter = 'ALL' | 'UNLOCKED' | 'LOCKED';

export const AchievementGrid: React.FC<AchievementGridProps> = ({
  masterList,
  unlockedAchievements,
  unlockedMap,
}) => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAchievements = useMemo(() => {
    return masterList.filter((ach) => {
      const isUnlocked = unlockedMap.has(ach.id);

      // Status filter
      if (statusFilter === 'UNLOCKED' && !isUnlocked) return false;
      if (statusFilter === 'LOCKED' && isUnlocked) return false;

      // Category filter
      if (categoryFilter !== 'ALL' && ach.category !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = ach.name.toLowerCase().includes(query);
        const matchDesc = ach.description.toLowerCase().includes(query);
        if (!matchName && !matchDesc) return false;
      }

      return true;
    });
  }, [masterList, unlockedMap, statusFilter, categoryFilter, searchQuery]);

  const categories: AchievementCategory[] = [
    'LEARNING',
    'COMPETITION',
    'CONSISTENCY',
    'ACADEMIC',
    'GLOBAL',
    'SPECIAL',
  ];

  return (
    <div className="space-y-5">
      {/* Controls Bar: Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        {/* Status Pill Filters */}
        <div className="flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/70">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({masterList.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('UNLOCKED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              statusFilter === 'UNLOCKED'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Unlocked ({unlockedAchievements.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('LOCKED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              statusFilter === 'LOCKED'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Locked ({masterList.length - unlockedAchievements.length})</span>
          </button>
        </div>

        {/* Category & Search Input */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>

          {/* Search Input */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredAchievements.length === 0 ? (
        <div className="text-center py-12 bg-white/60 rounded-3xl border border-slate-200/80 p-8">
          <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-700">No achievements found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try adjusting your search or category filter to view other EduVerse achievements.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((definition) => (
            <AchievementCard
              key={definition.id}
              definition={definition}
              unlockedRecord={unlockedMap.get(definition.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
