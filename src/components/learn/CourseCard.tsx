import React from 'react';
import { BookOpen, Clock, Award, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Course, CourseDifficulty, StudentCourseProgress } from '../../types';
import { GlassCard } from '../ui/GlassCard';

interface CourseCardProps {
  course: Course;
  progress?: StudentCourseProgress | null;
  onSelectCourse: (course: Course) => void;
  onLaunchAIWithTopic: (topic: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  progress,
  onSelectCourse,
  onLaunchAIWithTopic,
}) => {
  const getDifficultyBadge = (diff: CourseDifficulty) => {
    switch (diff) {
      case CourseDifficulty.BEGINNER:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case CourseDifficulty.INTERMEDIATE:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case CourseDifficulty.ADVANCED:
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case CourseDifficulty.OLYMPIAD:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const progressPercent = progress?.progressPercent || 0;
  const isCompleted = progressPercent === 100;
  const isStarted = progressPercent > 0;

  return (
    <GlassCard className="p-6 rounded-3xl border border-white/80 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
              {course.subjectName}
            </span>
            <span
              className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${getDifficultyBadge(
                course.difficulty
              )}`}
            >
              {course.difficulty}
            </span>
          </div>

          {course.curriculum && (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {course.curriculum}
            </span>
          )}
        </div>

        {/* Course Title */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
          {course.title}
        </h3>

        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
          {course.description}
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-2 my-4 pt-3 border-t border-slate-100/80 text-slate-600 text-xs">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate font-medium">
              {course.totalLessons || course.lessonCount || 0} Lessons
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-medium">
              {course.estimatedDurationHours || Math.max(1, Math.round((course.estimatedMinutes || 60) / 60))}h Est.
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600">
            <Award className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate font-bold">
              +{course.xpTotal || (course.totalLessons || course.lessonCount || 3) * 50} XP
            </span>
          </div>
        </div>

        {/* Progress Bar if started */}
        {isStarted && (
          <div className="space-y-1.5 mb-4 p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">
                {isCompleted ? (
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <CheckCircle className="w-3.5 h-3.5" /> Completed
                  </span>
                ) : (
                  <span>
                    {progress?.completedLessonIds.length || 0} /{' '}
                    {course.totalLessons || course.lessonCount || 0} completed
                  </span>
                )}
              </span>
              <span className="font-black text-blue-600">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-blue-600 to-sky-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onLaunchAIWithTopic(`${course.subjectName}: ${course.title}`)}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
          title="Discuss syllabus with AI Teacher"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>Ask AI</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectCourse(course)}
          className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all group-hover:gap-2"
        >
          <span>{isCompleted ? 'Review Course' : isStarted ? 'Continue' : 'Start Course'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </GlassCard>
  );
};
