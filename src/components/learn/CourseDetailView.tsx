import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Award,
  CheckCircle,
  Play,
  Sparkles,
  Lock,
  ChevronRight,
  GraduationCap,
  Globe,
} from 'lucide-react';
import { Course, Lesson, StudentCourseProgress } from '../../types';
import { GlassCard } from '../ui/GlassCard';

interface CourseDetailViewProps {
  courseId: string;
  studentId: string;
  onBack: () => void;
  onSelectLesson: (lessonId: string) => void;
  onLaunchAIWithTopic: (topic: string) => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  courseId,
  studentId,
  onBack,
  onSelectLesson,
  onLaunchAIWithTopic,
}) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [progress, setProgress] = useState<StudentCourseProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/learning/courses/${courseId}?studentId=${encodeURIComponent(studentId)}`
        );
        if (res.ok) {
          const data = await res.json();
          setCourse(data.course);
          setLessons(data.lessons || []);
          setProgress(data.progress || null);
        }
      } catch (err) {
        console.error('Error fetching course detail:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, studentId]);

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-semibold">Loading course syllabus...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-600 font-bold">Course not found.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-2xl bg-blue-600 text-white text-xs font-bold"
        >
          Return to Courses
        </button>
      </div>
    );
  }

  const completedLessonIds = progress?.completedLessonIds || [];
  const progressPercent = progress?.progressPercent || 0;
  const isCompleted = progressPercent === 100;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Courses</span>
      </button>

      {/* Course Overview Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 bg-gradient-to-r from-white/95 via-blue-50/40 to-sky-50/50 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100/90 px-2.5 py-0.5 rounded-full">
                {course.subjectName}
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                {course.difficulty}
              </span>
              {course.curriculum && (
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  {course.curriculum} • {course.grade}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {course.title}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-medium">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>{course.totalLessons || course.lessonCount || lessons.length} Structured Lessons</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{course.estimatedDurationHours || Math.max(1, Math.round((course.estimatedMinutes || 60) / 60))} Hours Study Time</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-amber-600">
                <Award className="w-4 h-4" />
                <span>+{course.xpTotal || (course.totalLessons || course.lessonCount || lessons.length || 3) * 50} Course XP</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-slate-500">
                <Globe className="w-4 h-4" />
                <span>Global Curriculum Standard</span>
              </div>
            </div>
          </div>

          {/* Quick AI & Start actions */}
          <div className="flex flex-col gap-3 shrink-0 lg:w-64">
            <button
              type="button"
              onClick={() => onLaunchAIWithTopic(`Course: ${course.title} (${course.subjectName})`)}
              className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Ask AI About Course</span>
            </button>

            {lessons.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  // If has uncompleted lessons, start the first uncompleted one
                  const firstUnfinished = lessons.find(
                    (l) => !completedLessonIds.includes(l.id)
                  );
                  onSelectLesson(firstUnfinished ? firstUnfinished.id : lessons[0].id);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  {isCompleted
                    ? 'Review from Beginning'
                    : progressPercent > 0
                    ? 'Resume Learning'
                    : 'Start First Lesson'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar in header */}
        <div className="mt-6 pt-4 border-t border-slate-200/60">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-600">
              Curriculum Progress: {completedLessonIds.length} of {course.totalLessons || course.lessonCount || lessons.length} lessons completed
            </span>
            <span className="font-black text-blue-600">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
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
      </div>

      {/* Lessons Syllabus */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Course Syllabus</h2>
          <span className="text-xs font-semibold text-slate-500">
            {lessons.length} Modules
          </span>
        </div>

        <div className="space-y-3">
          {lessons.map((lesson, index) => {
            const isLessonDone = completedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isLessonDone
                    ? 'bg-white/80 border-emerald-200/80 hover:border-emerald-300 shadow-xs'
                    : 'bg-white/90 border-slate-200/80 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                      isLessonDone
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {isLessonDone ? <CheckCircle className="w-5 h-5" /> : index + 1}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                        {lesson.title}
                      </h3>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {lesson.lessonType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{lesson.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {lesson.durationMinutes}m
                    </span>
                    <span className="font-bold text-amber-600">+{lesson.xpReward} XP</span>
                  </div>

                  <button
                    type="button"
                    className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isLessonDone
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                    }`}
                  >
                    <span>{isLessonDone ? 'Review' : 'Start'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
