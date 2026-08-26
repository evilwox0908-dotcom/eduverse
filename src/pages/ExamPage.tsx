import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AlertTriangle,
  Loader2,
  Shield,
  Maximize2,
  AlertCircle,
  HelpCircle,
  Menu,
  X,
} from 'lucide-react';
import {
  Competition,
  ExamQuestion,
  ExamSession,
  StudentAnswersMap,
  UserProfile,
} from '../types';
import { getCompetitionById } from '../services/competitionService';
import { checkStudentRegistration } from '../services/registrationService';
import {
  startExamSession,
  saveExamAnswer,
  submitExam,
} from '../services/examService';
import { useExamIntegrity } from '../hooks/useExamIntegrity';
import { PreExamCheckView } from '../components/exam/PreExamCheckView';
import { ExamHeader } from '../components/exam/ExamHeader';
import { QuestionPanel } from '../components/exam/QuestionPanel';
import { QuestionNavigator } from '../components/exam/QuestionNavigator';
import { ExamCalculator } from '../components/exam/ExamCalculator';
import { ExamScratchpad } from '../components/exam/ExamScratchpad';
import { ExamSubmissionModal } from '../components/exam/ExamSubmissionModal';

interface ExamPageProps {
  competitionId: string;
  currentUser: any;
  userProfile: UserProfile | null;
  onNavigate: (path: string) => void;
}

export const ExamPage: React.FC<ExamPageProps> = ({
  competitionId,
  currentUser,
  userProfile,
  onNavigate,
}) => {
  // Page Lifecycle State
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isLoadingComp, setIsLoadingComp] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  // Exam Session State
  const [isExamActive, setIsExamActive] = useState<boolean>(false);
  const [session, setSession] = useState<ExamSession | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<StudentAnswersMap>({});
  const [isInitializingSession, setIsInitializingSession] = useState<boolean>(false);

  // Autosave & Tools State
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState<boolean>(false);
  const [showMobileNavigator, setShowMobileNavigator] = useState<boolean>(false);

  // Submission State
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isAutoSubmit, setIsAutoSubmit] = useState<boolean>(false);

  const debounceTimeoutRef = useRef<any>(null);
  const answersRef = useRef<StudentAnswersMap>(answers);
  answersRef.current = answers;

  // Integrity Hook
  const {
    isFullscreen,
    enterFullscreen,
    integrityWarningCount,
    lastWarningReason,
    showWarningModal,
    dismissWarningModal,
  } = useExamIntegrity({
    sessionId: session?.sessionId || '',
    studentId: currentUser?.uid || '',
    competitionId,
    isActive: isExamActive && Boolean(session),
  });

  // 1. Initial Load: Validate Competition and Student Registration
  useEffect(() => {
    async function loadCompetitionAndAuth() {
      try {
        setIsLoadingComp(true);
        setError(null);

        const comp = await getCompetitionById(competitionId);
        if (!comp) {
          setError('Competition not found or may have been unpublished.');
          return;
        }
        setCompetition(comp);

        // Check user
        if (!currentUser) {
          setError('You must be signed in with an active student account to enter this competition.');
          return;
        }

        // Check registration
        const registration = await checkStudentRegistration(competitionId, currentUser.uid);
        if (!registration || registration.status === 'CANCELLED') {
          setIsRegistered(false);
          setError('You are not registered for this competition. Please register on the overview page before attempting to enter the exam.');
          return;
        }
        setIsRegistered(true);
      } catch (err: any) {
        console.error('Error loading competition:', err);
        setError(err?.message || 'Failed to load competition details');
      } finally {
        setIsLoadingComp(false);
      }
    }

    loadCompetitionAndAuth();
  }, [competitionId, currentUser]);

  // 2. Start Exam Handler
  const handleStartExam = async () => {
    if (!competition || !currentUser) return;
    try {
      setIsInitializingSession(true);
      setError(null);

      // Attempt to enter fullscreen
      try {
        await enterFullscreen();
      } catch (fsErr) {
        console.warn('Fullscreen entry notice:', fsErr);
      }

      const studentName =
        userProfile?.displayName ||
        (userProfile ? `${userProfile.firstName} ${userProfile.lastName}`.trim() : currentUser.displayName || 'Candidate');

      const res = await startExamSession(competitionId, {
        studentId: currentUser.uid,
        studentName,
        competitionTitle: competition.title,
        durationMinutes: competition.durationMinutes || 60,
        allowCalculator: competition.allowCalculator || false,
      });

      setSession(res.session);
      setQuestions(res.questions);
      setAnswers(res.savedAnswers || {});
      setIsExamActive(true);
    } catch (err: any) {
      console.error('Failed to start exam:', err);
      setError(err?.message || 'Failed to initialize authoritative exam session');
    } finally {
      setIsInitializingSession(false);
    }
  };

  // 3. Auto-save answer with debounce
  const triggerAutoSave = useCallback(
    (questionId: string, studentAnswer: string | string[], isFlagged?: boolean) => {
      if (!session || !currentUser) return;

      setIsSaving(true);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await saveExamAnswer(competitionId, {
            sessionId: session.sessionId,
            studentId: currentUser.uid,
            questionId,
            studentAnswer,
            isFlagged,
          });
          setLastSavedAt(res.lastSavedAt);
        } catch (saveErr) {
          console.warn('Auto-save sync retry scheduled:', saveErr);
        } finally {
          setIsSaving(false);
        }
      }, 500);
    },
    [competitionId, session, currentUser]
  );

  // 4. Update Answer for current question
  const handleAnswerChange = (newAnswer: string | string[]) => {
    if (!questions[currentQuestionIndex]) return;
    const currentQ = questions[currentQuestionIndex];

    const currentFlag = answers[currentQ.id]?.isFlagged || false;
    const updatedMap: StudentAnswersMap = {
      ...answers,
      [currentQ.id]: {
        studentAnswer: newAnswer,
        isFlagged: currentFlag,
        lastSavedAt: new Date().toISOString(),
      },
    };

    setAnswers(updatedMap);
    triggerAutoSave(currentQ.id, newAnswer, currentFlag);
  };

  // 5. Toggle Flag for current question
  const handleToggleFlag = () => {
    if (!questions[currentQuestionIndex]) return;
    const currentQ = questions[currentQuestionIndex];
    const prev = answers[currentQ.id];
    const newFlag = !prev?.isFlagged;

    const updatedMap: StudentAnswersMap = {
      ...answers,
      [currentQ.id]: {
        studentAnswer: prev?.studentAnswer || '',
        isFlagged: newFlag,
        lastSavedAt: new Date().toISOString(),
      },
    };

    setAnswers(updatedMap);
    triggerAutoSave(currentQ.id, prev?.studentAnswer || '', newFlag);
  };

  // 6. Clear Answer
  const handleClearAnswer = () => {
    if (!questions[currentQuestionIndex]) return;
    const currentQ = questions[currentQuestionIndex];
    const currentFlag = answers[currentQ.id]?.isFlagged || false;

    const updatedMap: StudentAnswersMap = {
      ...answers,
      [currentQ.id]: {
        studentAnswer: '',
        isFlagged: currentFlag,
        lastSavedAt: new Date().toISOString(),
      },
    };

    setAnswers(updatedMap);
    triggerAutoSave(currentQ.id, '', currentFlag);
  };

  // 7. Navigation handlers
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowSubmitModal(true);
    }
  };

  // 8. Time Expired Auto-submission trigger
  const handleTimeExpire = () => {
    setIsAutoSubmit(true);
    setShowSubmitModal(true);
    // Automatically proceed to submit
    handleConfirmSubmit();
  };

  // 9. Authoritative Final Submission
  const handleConfirmSubmit = async () => {
    if (!session || !currentUser || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const res = await submitExam(competitionId, {
        sessionId: session.sessionId,
        studentId: currentUser.uid,
        answers: answersRef.current,
      });

      // Navigate directly to the verified results view
      onNavigate(`/competitions/${competitionId}/results/${res.resultId}`);
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err?.message || 'Failed to finalize exam submission. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoadingComp) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-sm font-semibold text-slate-300">
            Securing competition gateway & validating credentials...
          </p>
        </div>
      </div>
    );
  }

  // Error / Blocked state
  if (error && !isExamActive) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 border border-slate-800 text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-2">
              Exam Gateway Notice
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
          </div>
          <div className="pt-2">
            <button
              id="back-to-comp-btn"
              onClick={() => onNavigate(`/competitions/${competitionId}`)}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
            >
              Return to Competition Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!competition) return null;

  // Step 1: Pre-Exam Check Screen
  if (!isExamActive || !session) {
    return (
      <PreExamCheckView
        competition={competition}
        userProfile={userProfile}
        onStartExam={handleStartExam}
        isLoading={isInitializingSession}
        onBackToDetails={() => onNavigate(`/competitions/${competitionId}`)}
      />
    );
  }

  // Step 2: Live Active Full-screen Exam
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswerObj = currentQuestion ? answers[currentQuestion.id] : undefined;

  return (
    <div
      id="live-competition-exam-container"
      className="min-h-screen bg-slate-100 flex flex-col font-sans select-none text-slate-900"
    >
      {/* Top Header with Authoritative Timer */}
      <ExamHeader
        session={session}
        competitionTitle={competition.title}
        allowCalculator={Boolean(competition.allowCalculator)}
        isSaving={isSaving}
        lastSavedAt={lastSavedAt}
        isFullscreen={isFullscreen}
        onToggleFullscreen={isFullscreen ? () => {} : enterFullscreen}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenScratchpad={() => setIsScratchpadOpen(true)}
        onSubmitClick={() => setShowSubmitModal(true)}
        onTimeExpire={handleTimeExpire}
      />

      {/* Main Exam Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Mobile Question Palette Toggle */}
        <div className="lg:hidden flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-700">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <button
            id="mobile-toggle-palette"
            onClick={() => setShowMobileNavigator(!showMobileNavigator)}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors"
          >
            <Menu className="w-3.5 h-3.5" />
            <span>{showMobileNavigator ? 'Hide Palette' : 'Show Palette'}</span>
          </button>
        </div>

        {/* Question Interaction Area */}
        <div className="lg:col-span-8 space-y-6">
          {currentQuestion ? (
            <QuestionPanel
              question={currentQuestion}
              currentAnswer={currentAnswerObj?.studentAnswer}
              isFlagged={Boolean(currentAnswerObj?.isFlagged)}
              onAnswerChange={handleAnswerChange}
              onToggleFlag={handleToggleFlag}
              onClearAnswer={handleClearAnswer}
              onPrevQuestion={handlePrevQuestion}
              onNextQuestion={handleNextQuestion}
              hasPrev={currentQuestionIndex > 0}
              hasNext={currentQuestionIndex < questions.length - 1}
              totalQuestions={questions.length}
              onOpenCalculator={() => setIsCalculatorOpen(true)}
            />
          ) : (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
              <p className="text-sm text-slate-600">Loading question content...</p>
            </div>
          )}
        </div>

        {/* Right Sidebar Desktop Question Navigator */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24">
          <QuestionNavigator
            questions={questions}
            currentIndex={currentQuestionIndex}
            answers={answers}
            onSelectQuestion={(idx) => setCurrentQuestionIndex(idx)}
            onSubmitClick={() => setShowSubmitModal(true)}
          />
        </div>

        {/* Mobile Drawer Question Navigator */}
        {showMobileNavigator && (
          <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end p-4">
            <div className="w-full max-w-xs bg-white rounded-2xl p-5 h-fit shadow-2xl relative">
              <button
                id="close-mobile-palette-btn"
                onClick={() => setShowMobileNavigator(false)}
                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
              <QuestionNavigator
                questions={questions}
                currentIndex={currentQuestionIndex}
                answers={answers}
                onSelectQuestion={(idx) => {
                  setCurrentQuestionIndex(idx);
                  setShowMobileNavigator(false);
                }}
                onSubmitClick={() => {
                  setShowMobileNavigator(false);
                  setShowSubmitModal(true);
                }}
              />
            </div>
          </div>
        )}
      </main>

      {/* Permitted Scientific / Arithmetic Calculator */}
      <ExamCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* Candidate Scratchpad */}
      <ExamScratchpad
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />

      {/* Final Submission Modal */}
      <ExamSubmissionModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirmSubmit={handleConfirmSubmit}
        isSubmitting={isSubmitting}
        questions={questions}
        answers={answers}
        isAutoSubmit={isAutoSubmit}
      />

      {/* Integrity Warning Modal */}
      {showWarningModal && (
        <div
          id="integrity-warning-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in"
        >
          <div className="max-w-md w-full bg-slate-900 border-2 border-amber-500 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl text-white">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-amber-400">
                Exam Integrity Warning
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {lastWarningReason || 'An integrity event was detected.'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Warning Count: <span className="font-bold text-amber-400">{integrityWarningCount}</span>. All focus and fullscreen changes are stored in the server audit log.
              </p>
            </div>

            <div className="pt-2">
              <button
                id="dismiss-integrity-warning-btn"
                onClick={dismissWarningModal}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors shadow-lg"
              >
                Re-enter Full-Screen Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
