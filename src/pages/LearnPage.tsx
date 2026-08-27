import React, { useState, useEffect } from 'react';
import {
  Subject,
  Course,
  StudentCourseProgress,
  DailyGoal,
  DashboardView,
} from '../types';
import { useAuth } from '../context/AuthContext';
import { LearningHero } from '../components/learn/LearningHero';
import { SubjectGrid } from '../components/learn/SubjectGrid';
import { CourseCard } from '../components/learn/CourseCard';
import { CourseDetailView } from '../components/learn/CourseDetailView';
import { LessonView } from '../components/learn/LessonView';
import { PracticeArena } from '../components/learn/PracticeArena';
import { AcademicLibrary } from '../components/learn/AcademicLibrary';
import { DailyGoalModal } from '../components/learn/DailyGoalModal';

interface LearnPageProps {
  onSelectView: (view: DashboardView) => void;
  onLaunchAIWithTopic: (topic: string, actionType?: string) => void;
  onImmersiveModeChange?: (isImmersive: boolean) => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({
  onSelectView,
  onLaunchAIWithTopic,
  onImmersiveModeChange,
}) => {
  const { userProfile, user } = useAuth();
  const studentId = user?.uid || userProfile?.id || 'demo_student';

  // Navigation / View modes
  const [activeTab, setActiveTab] = useState<'courses' | 'practice' | 'library'>('courses');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  useEffect(() => {
    if (onImmersiveModeChange) {
      onImmersiveModeChange(Boolean(selectedCourseId && selectedLessonId));
    }
  }, [selectedCourseId, selectedLessonId, onImmersiveModeChange]);

  // Filter & Search states
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgressMap, setUserProgressMap] = useState<Record<string, StudentCourseProgress>>({});
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch subjects, courses, user progress & daily goals
  useEffect(() => {
    fetchLearningData();
  }, [studentId, selectedSubjectId, selectedDifficulty]);

  const fetchLearningData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Subjects
      const subjRes = await fetch('/api/learning/subjects');
      if (subjRes.ok) {
        const data = await subjRes.json();
        setSubjects(data || []);
      }

      // 2. Fetch Courses
      const params = new URLSearchParams();
      if (selectedSubjectId !== 'all') params.append('subjectId', selectedSubjectId);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);

      const coursesRes = await fetch(`/api/learning/courses?${params.toString()}`);
      if (coursesRes.ok) {
        const data = await coursesRes.json();
        setCourses(data || []);
      }

      // 3. Fetch User Course Progress
      const progressRes = await fetch(`/api/learning/progress/${encodeURIComponent(studentId)}`);
      if (progressRes.ok) {
        const data: StudentCourseProgress[] = await progressRes.json();
        const map: Record<string, StudentCourseProgress> = {};
        data.forEach((p) => {
          map[p.courseId] = p;
        });
        setUserProgressMap(map);
      }

      // 4. Fetch Daily Goal
      const goalRes = await fetch(`/api/learning/daily-goal/${encodeURIComponent(studentId)}`);
      if (goalRes.ok) {
        const data = await goalRes.json();
        setDailyGoal(data);
      }
    } catch (err) {
      console.error('Error fetching learning ecosystem data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGoalTarget = async (targetMinutes: number) => {
    try {
      const res = await fetch(`/api/learning/daily-goal/${encodeURIComponent(studentId)}/target`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetMinutes }),
      });
      if (res.ok) {
        const updated = await res.json();
        setDailyGoal(updated);
      }
    } catch (err) {
      console.error('Failed to update goal target:', err);
    }
  };

  // Filtered courses based on search query
  const filteredCourses = courses.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.subjectName.toLowerCase().includes(q) ||
      (c.curriculum && c.curriculum.toLowerCase().includes(q))
    );
  });

  // -------------------------------------------------------------
  // RENDER 1: Specific Lesson Reader
  // -------------------------------------------------------------
  if (selectedCourseId && selectedLessonId) {
    return (
      <LessonView
        courseId={selectedCourseId}
        lessonId={selectedLessonId}
        studentId={studentId}
        onBackToCourse={() => setSelectedLessonId(null)}
        onNavigateLesson={(nextId) => setSelectedLessonId(nextId)}
        onLaunchAIWithTopic={(topic) => onLaunchAIWithTopic(topic, 'explain')}
      />
    );
  }

  // -------------------------------------------------------------
  // RENDER 2: Specific Course Detail & Syllabus
  // -------------------------------------------------------------
  if (selectedCourseId) {
    return (
      <CourseDetailView
        courseId={selectedCourseId}
        studentId={studentId}
        onBack={() => setSelectedCourseId(null)}
        onSelectLesson={(lessonId) => setSelectedLessonId(lessonId)}
        onLaunchAIWithTopic={(topic) => onLaunchAIWithTopic(topic, 'explain')}
      />
    );
  }

  // -------------------------------------------------------------
  // RENDER 3: Main Learning Hub View
  // -------------------------------------------------------------
  return (
    <div className="space-y-8">
      {/* Learning Hero with Daily Goal, Search, and Tabs */}
      <LearningHero
        subjects={subjects}
        selectedSubjectId={selectedSubjectId}
        onSelectSubject={setSelectedSubjectId}
        selectedDifficulty={selectedDifficulty}
        onSelectDifficulty={setSelectedDifficulty}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        dailyGoal={dailyGoal}
        onOpenDailyGoalModal={() => setIsGoalModalOpen(true)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenAITeacher={() => onSelectView('ai')}
        grade={userProfile?.grade || 'Grade 10'}
        educationSystem={userProfile?.educationSystem || 'International'}
      />

      {/* TAB 1: ACADEMIC COURSES */}
      {activeTab === 'courses' && (
        <div className="space-y-8">
          {/* Subject Disciplines Grid */}
          <SubjectGrid
            subjects={subjects}
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={setSelectedSubjectId}
          />

          {/* Courses List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {selectedSubjectId === 'all'
                    ? 'All Comprehensive Courses'
                    : `${subjects.find((s) => s.id === selectedSubjectId)?.name || 'Subject'} Courses`}
                </h2>
                <p className="text-xs text-slate-500">
                  {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} available
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500 font-semibold">Loading courses...</p>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white/70 border border-slate-200 text-center text-slate-500 text-xs space-y-3">
                <p className="font-bold text-slate-700">No courses match the active filter criteria.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSubjectId('all');
                    setSelectedDifficulty('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-xs"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    progress={userProgressMap[course.id] || null}
                    onSelectCourse={(c) => setSelectedCourseId(c.id)}
                    onLaunchAIWithTopic={(t) => onLaunchAIWithTopic(t, 'explain')}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRACTICE ARENA */}
      {activeTab === 'practice' && (
        <PracticeArena
          subjects={subjects}
          studentId={studentId}
          onLaunchAIWithTopic={(t) => onLaunchAIWithTopic(t, 'generate_quiz')}
          onOpenDailyGoalModal={() => setIsGoalModalOpen(true)}
        />
      )}

      {/* TAB 3: ACADEMIC LIBRARY */}
      {activeTab === 'library' && (
        <AcademicLibrary
          subjects={subjects}
          onLaunchAIWithTopic={(t) => onLaunchAIWithTopic(t, 'explain')}
        />
      )}

      {/* Daily Goal Target Setting Modal */}
      <DailyGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        currentGoal={dailyGoal}
        onSaveTarget={handleSaveGoalTarget}
      />
    </div>
  );
};
