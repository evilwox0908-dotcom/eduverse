import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Award,
  CheckCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  AlertCircle,
  Check,
  Send,
  X,
  Volume2,
} from 'lucide-react';
import { Lesson, Course, ContentBlock } from '../../types';
import { GlassCard } from '../ui/GlassCard';

interface LessonViewProps {
  courseId: string;
  lessonId: string;
  studentId: string;
  onBackToCourse: () => void;
  onNavigateLesson: (lessonId: string) => void;
  onLaunchAIWithTopic: (topic: string) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  courseId,
  lessonId,
  studentId,
  onBackToCourse,
  onNavigateLesson,
  onLaunchAIWithTopic,
}) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [navigation, setNavigation] = useState<{
    currentIndex: number;
    totalLessons: number;
    previousLessonId: string | null;
    nextLessonId: string | null;
  }>({
    currentIndex: 1,
    totalLessons: 1,
    previousLessonId: null,
    nextLessonId: null,
  });
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionReward, setCompletionReward] = useState<any | null>(null);

  // Checkpoint user answers state: blockId -> selectedOption
  const [checkpointAnswers, setCheckpointAnswers] = useState<Record<string, string>>({});
  const [checkpointFeedback, setCheckpointFeedback] = useState<
    Record<string, { isCorrect: boolean; show: boolean }>
  >({});

  // In-lesson quick AI drawer
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      setIsLoading(true);
      setCompletionReward(null);
      try {
        const res = await fetch(
          `/api/learning/courses/${courseId}/lessons/${lessonId}?studentId=${encodeURIComponent(
            studentId
          )}`
        );
        if (res.ok) {
          const data = await res.json();
          setLesson(data.lesson);
          setCourse(data.course);
          setNavigation(data.navigation);
          setIsCompleted(data.isCompleted);
        }
      } catch (err) {
        console.error('Error fetching lesson:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [courseId, lessonId, studentId]);

  const handleCheckpointSelect = (blockId: string, option: string, correctOption?: string) => {
    setCheckpointAnswers((prev) => ({ ...prev, [blockId]: option }));
    if (correctOption) {
      const isCorrect = option === correctOption;
      setCheckpointFeedback((prev) => ({
        ...prev,
        [blockId]: { isCorrect, show: true },
      }));
    }
  };

  const handleCompleteLesson = async () => {
    if (isCompleting) return;
    setIsCompleting(true);
    try {
      const res = await fetch(
        `/api/learning/courses/${courseId}/lessons/${lessonId}/complete`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId,
            timeSpentMinutes: lesson?.durationMinutes || 15,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setIsCompleted(true);
        setCompletionReward(data);
      }
    } catch (err) {
      console.error('Error completing lesson:', err);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleAskAIAboutBlock = (blockTitle: string, blockContent: string) => {
    setAiQuestion(`Could you provide a deeper explanation and worked example for this concept: "${blockTitle}"?\n\nContext: ${blockContent.substring(0, 300)}...`);
    setIsAIDrawerOpen(true);
  };

  const handleSendAIQuestion = async () => {
    if (!aiQuestion.trim() || isAiLoading) return;
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: aiQuestion,
          studentContext: {
            grade: course?.grade || 'Grade 10',
            educationSystem: course?.curriculum || 'International',
          },
          quickAction: 'explain',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.text);
      } else {
        setAiResponse('Unable to connect to AI Teacher right now. Please try again.');
      }
    } catch (err) {
      console.error('AI chat error:', err);
      setAiResponse('Error contacting AI Teacher. Please ensure server is running.');
    } finally {
      setIsAiLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-semibold">Loading lesson content...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-600 font-bold">Lesson not found.</p>
        <button
          onClick={onBackToCourse}
          className="px-4 py-2 rounded-2xl bg-blue-600 text-white text-xs font-bold"
        >
          Return to Course
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToCourse}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {course?.title || 'Course'}</span>
        </button>

        <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
          <span>
            Lesson {navigation.currentIndex} of {navigation.totalLessons}
          </span>
          {isCompleted && (
            <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" /> Completed
            </span>
          )}
        </div>
      </div>

      {/* Lesson Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 bg-gradient-to-r from-white/95 via-blue-50/30 to-sky-50/40 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
            {course?.subjectName || 'Academics'}
          </span>
          <span className="text-[10px] font-bold uppercase text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
            {lesson.lessonType}
          </span>
          <span className="text-[10px] font-bold text-slate-400">
            {lesson.durationMinutes} mins • +{lesson.xpReward} XP
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {lesson.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          {lesson.description}
        </p>
      </div>

      {/* Content Blocks List */}
      <div className="space-y-6">
        {lesson.contentBlocks?.map((block, index) => {
          return (
            <div key={block.id || index} className="space-y-3">
              {/* Block Type: THEORY */}
              {block.type === 'THEORY' && (
                <div className="glass-card p-6 rounded-3xl border border-white/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">{block.title}</h3>
                    <button
                      type="button"
                      onClick={() => handleAskAIAboutBlock(block.title, block.content)}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-xl"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Explain with AI</span>
                    </button>
                  </div>

                  <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal space-y-2">
                    {block.content}
                  </div>
                </div>
              )}

              {/* Block Type: FORMULA */}
              {block.type === 'FORMULA' && (
                <div className="p-6 rounded-3xl border border-blue-200/80 bg-gradient-to-br from-blue-50/80 to-sky-50/50 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      Essential Formula
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleAskAIAboutBlock(
                          block.title,
                          `Formula: ${block.formula}\n${block.content}`
                        )
                      }
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Derivation</span>
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{block.title}</h3>

                  {block.formula && (
                    <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs text-center my-2">
                      <div className="font-mono text-base sm:text-lg font-bold text-blue-900">
                        {block.formula}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 leading-relaxed">{block.content}</p>
                </div>
              )}

              {/* Block Type: WORKED_EXAMPLE */}
              {block.type === 'WORKED_EXAMPLE' && (
                <div className="glass-card p-6 rounded-3xl border border-white/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                      Step-by-Step Worked Solution
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleAskAIAboutBlock(
                          block.title,
                          `Example: ${block.content}\nSolution: ${block.solution || ''}`
                        )
                      }
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analyze with AI</span>
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{block.title}</h3>

                  {/* Problem text */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm font-semibold text-slate-800">
                    {block.content}
                  </div>

                  {/* Solution steps */}
                  {block.solution && (
                    <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
                      <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Rigorous Mathematical Solution</span>
                      </h4>
                      <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                        {block.solution}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Block Type: CHECKPOINT */}
              {block.type === 'CHECKPOINT' && (
                <div className="p-6 rounded-3xl border-2 border-amber-200/80 bg-amber-50/30 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                      Diagnostic Checkpoint
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Test your understanding
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {block.content}
                  </h3>

                  {/* Options */}
                  {block.checkpointOptions && (
                    <div className="space-y-2">
                      {block.checkpointOptions.map((opt, optIdx) => {
                        const isSelected = checkpointAnswers[block.id] === opt;
                        const feedback = checkpointFeedback[block.id];
                        const isCorrectOption = opt === block.correctOption;

                        let optStyle =
                          'bg-white hover:bg-slate-50 border-slate-200 text-slate-800';
                        if (feedback?.show) {
                          if (isCorrectOption) {
                            optStyle =
                              'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                          } else if (isSelected && !isCorrectOption) {
                            optStyle =
                              'bg-rose-100 border-rose-300 text-rose-900 line-through';
                          }
                        } else if (isSelected) {
                          optStyle = 'bg-blue-50 border-blue-500 text-blue-900 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() =>
                              handleCheckpointSelect(block.id, opt, block.correctOption)
                            }
                            className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs sm:text-sm flex items-center justify-between ${optStyle}`}
                          >
                            <span>{opt}</span>
                            {feedback?.show && isCorrectOption && (
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Checkpoint Explanation */}
                  {checkpointFeedback[block.id]?.show && (
                    <div
                      className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                        checkpointFeedback[block.id].isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        {checkpointFeedback[block.id].isCorrect ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                            <span>Correct deduction!</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-4 h-4 text-rose-600" />
                            <span>Review the concept rationale below:</span>
                          </>
                        )}
                      </div>
                      <p className="leading-relaxed">{block.explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Block Type: NOTE */}
              {block.type === 'NOTE' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex items-start gap-3 text-xs text-sky-900">
                  <AlertCircle className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="font-bold text-sky-950">{block.title}:</strong>
                    <p className="leading-relaxed">{block.content}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Celebratory Reward Card */}
      {completionReward && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-300" />
              <h3 className="text-lg font-bold">Lesson Mastered!</h3>
            </div>
            <span className="text-xs font-black uppercase bg-white/20 px-3 py-1 rounded-full">
              +{completionReward.progression?.xpEarned || 50} XP Awarded
            </span>
          </div>
          <p className="text-xs text-emerald-100">
            Great work! Your academic progress has been authoritatively recorded on EduVerse.
          </p>

          {completionReward.progression?.newAchievements?.length > 0 && (
            <div className="pt-2 border-t border-white/20 flex items-center gap-2 text-xs font-bold text-amber-200">
              <Sparkles className="w-4 h-4" />
              <span>
                New Achievement Unlocked:{' '}
                {completionReward.progression.newAchievements[0].name}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Previous Lesson */}
        {navigation.previousLessonId ? (
          <button
            type="button"
            onClick={() => onNavigateLesson(navigation.previousLessonId!)}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors w-full sm:w-auto justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Lesson</span>
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Ask AI Teacher Button */}
          <button
            type="button"
            onClick={() => setIsAIDrawerOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Ask AI Teacher</span>
          </button>

          {/* Mark Complete / Next Lesson */}
          {!isCompleted ? (
            <button
              type="button"
              onClick={handleCompleteLesson}
              disabled={isCompleting}
              className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 flex-1 sm:flex-initial"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isCompleting ? 'Recording...' : 'Mark Complete (+50 XP)'}</span>
            </button>
          ) : navigation.nextLessonId ? (
            <button
              type="button"
              onClick={() => onNavigateLesson(navigation.nextLessonId!)}
              className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all flex-1 sm:flex-initial"
            >
              <span>Next Lesson</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onBackToCourse}
              className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all flex-1 sm:flex-initial"
            >
              <span>Course Completed — Return</span>
            </button>
          )}
        </div>
      </div>

      {/* Slide-over AI Teacher Quick Drawer */}
      {isAIDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white shadow-2xl h-full flex flex-col p-6 space-y-4 border-l border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">AI Teacher Coach</h3>
                  <p className="text-[10px] text-slate-500">Live Lesson Context Helper</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAIDrawerOpen(false);
                  setAiResponse(null);
                }}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {aiResponse ? (
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-slate-800 space-y-2 leading-relaxed whitespace-pre-line">
                  <div className="font-bold text-blue-900 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>AI Teacher Explanation:</span>
                  </div>
                  <p>{aiResponse}</p>
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">
                  Ask any question about this lesson or click &quot;Explain with AI&quot; on any section to receive step-by-step guidance.
                </p>
              )}
            </div>

            {/* Input area */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <textarea
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder="Ask about this concept, formula, or derivation..."
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:border-blue-500 focus:outline-none resize-none"
              />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    onLaunchAIWithTopic(`Lesson: ${lesson.title} (${course?.subjectName})`)
                  }
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
                >
                  Open Full Chat Room →
                </button>

                <button
                  type="button"
                  onClick={handleSendAIQuestion}
                  disabled={isAiLoading || !aiQuestion.trim()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAiLoading ? 'Analyzing...' : 'Ask AI'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
