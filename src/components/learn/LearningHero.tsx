import React from 'react';
import {
  Sparkles,
  Search,
  BookOpen,
  Zap,
  Library,
  Flame,
  Clock,
  Target,
  SlidersHorizontal,
} from 'lucide-react';
import { Subject, CourseDifficulty, DailyGoal } from '../../types';

interface LearningHeroProps {
  subjects: Subject[];
  selectedSubjectId: string;
  onSelectSubject: (id: string) => void;
  selectedDifficulty: string;
  onSelectDifficulty: (diff: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dailyGoal: DailyGoal | null;
  onOpenDailyGoalModal: () => void;
  activeTab: 'courses' | 'practice' | 'library';
  onChangeTab: (tab: 'courses' | 'practice' | 'library') => void;
  onOpenAITeacher: () => void;
  grade?: string;
  educationSystem?: string;
}

export const LearningHero: React.FC<LearningHeroProps> = ({
  subjects,
  selectedSubjectId,
  onSelectSubject,
  selectedDifficulty,
  onSelectDifficulty,
  searchQuery,
  onSearchChange,
  dailyGoal,
  onOpenDailyGoalModal,
  activeTab,
  onChangeTab,
  onOpenAITeacher,
  grade = 'Grade 10',
  educationSystem = 'International',
}) => {
  const targetMinutes = dailyGoal?.targetMinutes || 30;
  const todayMinutes = dailyGoal?.todayLearnedMinutes || 0;
  const goalProgressPercent = Math.min(100, Math.round((todayMinutes / targetMinutes) * 100));

  const difficulties: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All Levels' },
    { id: CourseDifficulty.BEGINNER, label: 'Beginner' },
    { id: CourseDifficulty.INTERMEDIATE, label: 'Intermediate' },
    { id: CourseDifficulty.ADVANCED, label: 'Advanced' },
    { id: CourseDifficulty.OLYMPIAD, label: 'Olympiad' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 bg-gradient-to-r from-white/95 via-blue-50/50 to-sky-50/60 shadow-lg relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-48 h-48 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase text-sky-800 bg-sky-100/90 px-2.5 py-0.5 rounded-full border border-sky-200/60 shadow-xs">
                EduVerse Learning Hub
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {grade} • {educationSystem}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Master the Curriculum. Prepare for Olympiads.
            </h1>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              Explore rigorous multi-subject courses, interactive step-by-step theory, diagnostic problem sets, and curated academic reference libraries.
            </p>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 mt-5">
              <button
                type="button"
                onClick={() => onChangeTab('courses')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'courses'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Academic Courses</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeTab('practice')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'practice'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Practice Arena</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeTab('library')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'library'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/80'
                }`}
              >
                <Library className="w-4 h-4 text-indigo-500" />
                <span>Academic Library</span>
              </button>

              <button
                type="button"
                onClick={onOpenAITeacher}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-sky-200" />
                <span>AI Teacher</span>
              </button>
            </div>
          </div>

          {/* Daily Goal & Streak Card */}
          <div className="w-full lg:w-72 bg-white/90 backdrop-blur-md rounded-2xl border border-white/90 p-4 sm:p-5 shadow-sm space-y-3.5 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Daily Study Target</span>
              </div>
              <button
                type="button"
                onClick={onOpenDailyGoalModal}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline"
              >
                Edit
              </button>
            </div>

            <div>
              <div className="flex items-baseline justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-500">
                  <strong className="text-sm font-black text-slate-900">{todayMinutes}</strong> / {targetMinutes} mins
                </span>
                <span className="text-[11px] font-bold text-blue-600">{goalProgressPercent}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-500 transition-all duration-500"
                  style={{ width: `${goalProgressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
              <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                <span>{dailyGoal?.completedActivitiesToday || 0} Sessions Today</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3" />
                <span>Habit tracker</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-3 sm:p-4 border border-white/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search courses, topics, formulas, or concepts (e.g. Calculus, Kinematics, Dijkstra)..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 focus:bg-white focus:border-blue-500 focus:outline-none text-xs font-medium text-slate-800 placeholder-slate-400 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Level:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {difficulties.map((diff) => (
              <button
                key={diff.id}
                type="button"
                onClick={() => onSelectDifficulty(diff.id)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                  selectedDifficulty === diff.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Fast Selector Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => onSelectSubject('all')}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all border ${
            selectedSubjectId === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200/80'
          }`}
        >
          All Subjects
        </button>

        {subjects.map((sub) => {
          const isSelected = selectedSubjectId === sub.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => onSelectSubject(sub.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all border flex items-center gap-2 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                  : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200/80'
              }`}
            >
              <span>{sub.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isSelected ? 'bg-blue-700/80 text-blue-100' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {sub.courseCount ?? sub.coursesCount ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
