import React, { useState, useEffect } from 'react';
import {
  Zap,
  Sparkles,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Clock,
  Award,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  BookOpen,
  Filter,
  Check,
  X,
  Target,
} from 'lucide-react';
import { Subject, PracticeQuestion, PracticeAttempt } from '../../types';
import { GlassCard } from '../ui/GlassCard';

interface PracticeArenaProps {
  subjects: Subject[];
  studentId: string;
  onLaunchAIWithTopic: (topic: string) => void;
  onOpenDailyGoalModal: () => void;
}

export const PracticeArena: React.FC<PracticeArenaProps> = ({
  subjects,
  studentId,
  onLaunchAIWithTopic,
  onOpenDailyGoalModal,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Quiz state
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [isGeneratingAiQuiz, setIsGeneratingAiQuiz] = useState(false);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerInterval, setTimerInterval] = useState<any>(null);

  // Result state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    attempt: PracticeAttempt;
    progression: any;
    dailyCap: { earnedToday: number; dailyLimit: number };
  } | null>(null);

  // Practice history state
  const [history, setHistory] = useState<PracticeAttempt[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // AI custom prompt state
  const [customAiTopic, setCustomAiTopic] = useState('');

  // Fetch practice history on mount
  useEffect(() => {
    fetchHistory();
  }, [studentId]);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isQuizActive && !quizResult) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } else if (timerInterval) {
      clearInterval(timerInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isQuizActive, quizResult]);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`/api/learning/practice/history/${encodeURIComponent(studentId)}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data || []);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const startStandardPractice = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedSubjectId !== 'all') params.append('subjectId', selectedSubjectId);
      if (selectedTopic !== 'all') params.append('topic', selectedTopic);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
      params.append('count', '5');

      const res = await fetch(`/api/learning/practice/questions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
          setCurrentQuestionIndex(0);
          setSelectedAnswers({});
          setShowHint({});
          setElapsedSeconds(0);
          setQuizResult(null);
          setIsQuizActive(true);
        } else {
          alert('No practice questions found matching your filter criteria.');
        }
      }
    } catch (err) {
      console.error('Error starting practice set:', err);
    }
  };

  const startAiCustomPractice = async () => {
    if (!customAiTopic.trim()) return;
    setIsGeneratingAiQuiz(true);
    try {
      const activeSubject = subjects.find((s) => s.id === selectedSubjectId);
      const res = await fetch('/api/ai/generate-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: customAiTopic.trim(),
          subjectName: activeSubject?.name || 'Mathematics',
          grade: 'Grade 10',
          count: 3,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && Array.isArray(data.questions)) {
          // Format questions
          const formattedQuestions: PracticeQuestion[] = data.questions.map((q: any, idx: number) => ({
            id: q.id || `ai_q_${idx}_${Date.now()}`,
            subjectId: selectedSubjectId !== 'all' ? selectedSubjectId : 'math',
            subjectName: activeSubject?.name || 'Mathematics',
            topic: customAiTopic,
            difficulty: 'INTERMEDIATE' as any,
            grade: 'Grade 10',
            type: 'SINGLE_CHOICE' as any,
            questionText: q.questionText,
            options: q.options || [],
            points: 10,
            hint: q.hint || 'Carefully check intermediate derivations.',
          }));

          setQuestions(formattedQuestions);
          setCurrentQuestionIndex(0);
          setSelectedAnswers({});
          setShowHint({});
          setElapsedSeconds(0);
          setQuizResult(null);
          setIsQuizActive(true);
        }
      } else {
        alert('Could not generate custom AI practice set right now. Please try again.');
      }
    } catch (err) {
      console.error('Error generating AI practice:', err);
    } finally {
      setIsGeneratingAiQuiz(false);
    }
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleToggleHint = (questionId: string) => {
    setShowHint((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleSubmitPractice = async () => {
    setIsSubmitting(true);
    try {
      const qIds = questions.map((q) => q.id);
      const res = await fetch('/api/learning/practice/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          questionIds: qIds,
          answers: selectedAnswers,
          timeSpentSeconds: elapsedSeconds,
          subjectId: selectedSubjectId !== 'all' ? selectedSubjectId : 'math',
          topic: selectedTopic !== 'all' ? selectedTopic : customAiTopic || 'Academic Practice',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuizResult(data);
        fetchHistory();
      }
    } catch (err) {
      console.error('Error submitting practice:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // -------------------------------------------------------------
  // VIEW: Active Quiz Engine
  // -------------------------------------------------------------
  if (isQuizActive && questions.length > 0 && !quizResult) {
    const currentQ = questions[currentQuestionIndex];
    const isAnswered = Boolean(selectedAnswers[currentQ.id]);
    const totalAnswered = Object.keys(selectedAnswers).length;

    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
        {/* Quiz Header */}
        <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/80 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shrink-0 font-black">
              {currentQuestionIndex + 1}/{questions.length}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400">
                {currentQ.subjectName} • {currentQ.topic}
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Question {currentQuestionIndex + 1}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 font-mono text-xs font-bold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to exit this practice set?')) {
                  setIsQuizActive(false);
                }
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              title="Exit Practice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Card */}
        <GlassCard className="p-6 sm:p-8 rounded-3xl border border-white/80 shadow-md space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                +{currentQ.points} Points
              </span>
              {currentQ.hint && (
                <button
                  type="button"
                  onClick={() => handleToggleHint(currentQ.id)}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint[currentQ.id] ? 'Hide Hint' : 'Show Hint'}</span>
                </button>
              )}
            </div>

            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
              {currentQ.questionText}
            </h2>

            {/* Hint Box */}
            {showHint[currentQ.id] && currentQ.hint && (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2 animate-fade-in">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Hint:</strong> {currentQ.hint}
                </span>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt) => {
              const isSelected = selectedAnswers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(currentQ.id, opt.id)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-xs sm:text-sm ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-xs'
                      : 'border-slate-200/80 hover:border-slate-300 bg-white/70 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Question Navigation Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold disabled:opacity-30 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-semibold text-slate-500">
              {totalAnswered} of {questions.length} answered
            </span>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitPractice}
                disabled={isSubmitting || totalAnswered === 0}
                className="px-6 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isSubmitting ? 'Evaluating...' : 'Submit Set'}</span>
              </button>
            )}
          </div>
        </GlassCard>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: Quiz Result & Solution Review
  // -------------------------------------------------------------
  if (quizResult) {
    const { attempt, progression, dailyCap } = quizResult;
    const isPassing = attempt.percentage >= 60;

    return (
      <div className="space-y-6 max-w-3xl mx-auto animate-fade-in pb-12">
        {/* Results Banner */}
        <div
          className={`p-6 sm:p-8 rounded-3xl text-white shadow-xl space-y-4 ${
            isPassing
              ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600'
              : 'bg-gradient-to-r from-slate-700 to-slate-900'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
                Practice Performance
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-1">
                {attempt.percentage}% Accuracy
              </h2>
              <p className="text-xs text-sky-100 mt-0.5">
                {attempt.correctCount} of {attempt.totalQuestions} questions solved correctly in{' '}
                {formatTime(attempt.timeSpentSeconds)}.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
              <span className="text-[10px] uppercase font-bold text-sky-200">XP Earned</span>
              <div className="text-2xl font-black text-amber-300">+{attempt.xpEarned} XP</div>
              <span className="text-[10px] text-slate-200">
                Daily Cap: {dailyCap.earnedToday}/{dailyCap.dailyLimit} XP
              </span>
            </div>
          </div>

          {/* New achievements if unlocked */}
          {progression?.newAchievements?.length > 0 && (
            <div className="pt-3 border-t border-white/20 flex items-center gap-2 text-xs font-bold text-amber-200">
              <Sparkles className="w-4 h-4" />
              <span>Achievement Unlocked: {progression.newAchievements[0].name}</span>
            </div>
          )}
        </div>

        {/* Detailed Solutions Review */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Step-by-Step Rationale Review</h3>

          <div className="space-y-3">
            {attempt.breakdown?.map((item: any, idx: number) => {
              return (
                <GlassCard
                  key={idx}
                  className={`p-5 rounded-3xl border ${
                    item.isCorrect ? 'border-emerald-200' : 'border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-xl flex items-center justify-center text-xs font-black ${
                          item.isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        {item.questionText}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 ${
                        item.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>

                  <div className="text-xs space-y-1.5 mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-slate-600">
                      <span>
                        Your Answer:{' '}
                        <strong className={item.isCorrect ? 'text-emerald-700' : 'text-rose-700'}>
                          {item.studentAnswer || 'Skipped'}
                        </strong>
                      </span>
                      <span>
                        Correct Answer:{' '}
                        <strong className="text-emerald-700">{item.correctAnswer}</strong>
                      </span>
                    </div>

                    {item.explanation && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 text-xs mt-2">
                        <strong className="font-bold text-slate-900">Concept Explanation: </strong>
                        {item.explanation}
                      </div>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => {
              setQuizResult(null);
              setIsQuizActive(false);
            }}
            className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Hub</span>
          </button>

          <button
            type="button"
            onClick={() => startStandardPractice()}
            className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center gap-1.5"
          >
            <span>Try Another Set</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW: Default Practice Arena Landing Hub
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 bg-gradient-to-r from-white/95 via-amber-50/30 to-blue-50/40 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                Diagnostic & Mastery Arena
              </span>
              <span className="text-xs font-semibold text-slate-500">Max 150 Practice XP/Day</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sharpen Your Problem-Solving Instincts
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Target specific mathematical and scientific topics, generate on-demand custom Olympiad problem sets, and review step-by-step rigorous solutions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={startStandardPractice}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Start Standard 5-Question Set</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Mode Cards: Official Question Bank & Custom AI Generator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mode 1: Curated Question Bank */}
        <GlassCard className="p-6 rounded-3xl border border-white/80 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Curated Olympiad Question Bank</h3>
              <p className="text-xs text-slate-500">
                Official diagnostic problems with verified solutions.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Select Discipline</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
              >
                <option value="all">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">Difficulty Tier</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
              >
                <option value="all">All Difficulties</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="OLYMPIAD">Olympiad</option>
              </select>
            </div>

            <button
              type="button"
              onClick={startStandardPractice}
              className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 mt-4"
            >
              <span>Launch Practice Set</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </GlassCard>

        {/* Mode 2: AI On-Demand Custom Problem Set */}
        <GlassCard className="p-6 rounded-3xl border border-blue-200/80 bg-gradient-to-br from-blue-50/50 via-white to-sky-50/40 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                On-Demand AI Practice Generator
              </h3>
              <p className="text-xs text-slate-500">
                Generate 3 tailored problems on any specific topic you wish to master.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase">
                Specific Topic or Concept
              </label>
              <input
                type="text"
                value={customAiTopic}
                onChange={(e) => setCustomAiTopic(e.target.value)}
                placeholder="e.g. Logarithmic Derivatives, Stoichiometry, Dynamic Programming..."
                className="w-full mt-1 p-2.5 rounded-xl bg-white border border-blue-200 focus:border-blue-500 text-xs font-semibold text-slate-800 placeholder-slate-400"
              />
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Powered by EduVerse Gemini AI Teacher with step-by-step mathematical explanations.
            </p>

            <button
              type="button"
              onClick={startAiCustomPractice}
              disabled={isGeneratingAiQuiz || !customAiTopic.trim()}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>{isGeneratingAiQuiz ? 'Generating Questions...' : 'Generate AI Set'}</span>
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Practice History Table */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900">Recent Practice Sets</h3>

        {isLoadingHistory ? (
          <p className="text-xs text-slate-400">Loading history...</p>
        ) : history.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white/70 border border-slate-200/80 text-center text-xs text-slate-500">
            No practice sets completed yet. Launch your first diagnostic quiz above!
          </div>
        ) : (
          <div className="space-y-2">
            {history.slice(0, 5).map((att) => (
              <div
                key={att.id}
                className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black ${
                      att.percentage >= 80
                        ? 'bg-emerald-100 text-emerald-800'
                        : att.percentage >= 50
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {att.percentage}%
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{att.topic || 'Practice Arena'}</h4>
                    <p className="text-[10px] text-slate-400">
                      {att.correctCount}/{att.totalQuestions} correct • {formatTime(att.timeSpentSeconds)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-600">+{att.xpEarned} XP</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(att.completedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
