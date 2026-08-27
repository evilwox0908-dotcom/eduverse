import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HelpCircle,
  Plus,
  Sparkles,
  PlayCircle,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Edit3,
  BookOpen,
  GraduationCap,
  Layers,
  Calculator,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Shield,
  Eye,
  Sliders,
  Award,
} from 'lucide-react';
import { QuestionBankItem, QuestionBankStatus, BankDifficulty } from '../../types';
import { ACADEMIC_SUBJECTS } from '../../data/subjects';
import { ACADEMIC_GRADES } from '../../data/grades';
import {
  fetchQuestionBank,
  saveQuestionBankItem,
  updateQuestionStatus,
  deleteQuestionBankItem,
  generateAIQuestionDraft,
  generateTestFromBank,
} from '../../services/questionBankService';

interface QuestionBankManagerProps {
  actorUid: string;
  actorEmail: string;
  onTestGenerated?: (testRecord: any) => void;
}

export const QuestionBankManager: React.FC<QuestionBankManagerProps> = ({
  actorUid,
  actorEmail,
  onTestGenerated,
}) => {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [showTestGenModal, setShowTestGenModal] = useState<boolean>(false);

  // Manual Question Form State
  const [formData, setFormData] = useState<Partial<QuestionBankItem>>({
    subjectId: 'subj_math',
    subjectName: 'Mathematics',
    grade: 'Grade 10',
    topic: 'Algebra & Functions',
    difficulty: 'Medium',
    questionText: '',
    options: [
      { id: 'A', label: 'A', text: '' },
      { id: 'B', label: 'B', text: '' },
      { id: 'C', label: 'C', text: '' },
      { id: 'D', label: 'D', text: '' },
    ],
    correctAnswer: 'A',
    explanation: '',
    points: 4,
    negativePoints: 0,
    allowCalculator: true,
    status: 'Draft',
    tags: [],
  });

  // AI Generator Form State
  const [aiSubject, setAiSubject] = useState<string>('Mathematics');
  const [aiGrade, setAiGrade] = useState<string>('Grade 10');
  const [aiTopic, setAiTopic] = useState<string>('Algebraic Inequalities & Polynomials');
  const [aiDifficulty, setAiDifficulty] = useState<BankDifficulty>('Medium');
  const [aiPromptGuidelines, setAiPromptGuidelines] = useState<string>('');
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [aiDraftResult, setAiDraftResult] = useState<QuestionBankItem | null>(null);

  // Test Generator Form State
  const [testGenSubject, setTestGenSubject] = useState<string>('Mathematics');
  const [testGenGrade, setTestGenGrade] = useState<string>('Grade 10');
  const [testGenTitle, setTestGenTitle] = useState<string>('');
  const [testGenCount, setTestGenCount] = useState<number>(10);
  const [testGenEasy, setTestGenEasy] = useState<number>(30);
  const [testGenMed, setTestGenMed] = useState<number>(50);
  const [testGenHard, setTestGenHard] = useState<number>(20);
  const [testGenTime, setTestGenTime] = useState<number>(60);
  const [testGenTier, setTestGenTier] = useState<string>('Championship');
  const [testGenerating, setTestGenerating] = useState<boolean>(false);
  const [testGenSuccessMsg, setTestGenSuccessMsg] = useState<string | null>(null);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const items = await fetchQuestionBank(
        {
          subjectId: selectedSubject,
          grade: selectedGrade,
          difficulty: selectedDifficulty,
          status: selectedStatus,
          q: searchQuery,
        },
        actorUid,
        actorEmail
      );
      setQuestions(items);
    } catch (err) {
      console.error('Error loading question bank:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [selectedSubject, selectedGrade, selectedDifficulty, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadQuestions();
  };

  const handleStatusChange = async (questionId: string, newStatus: QuestionBankStatus) => {
    try {
      await updateQuestionStatus(questionId, newStatus, actorUid, actorEmail);
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, status: newStatus } : q))
      );
    } catch (err) {
      console.error('Failed to change status:', err);
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!window.confirm('Are you sure you want to delete this question from the bank?')) return;
    try {
      await deleteQuestionBankItem(questionId, actorUid, actorEmail);
      setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    } catch (err) {
      console.error('Failed to delete question:', err);
    }
  };

  const handleManualSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.questionText || !formData.options || formData.options.some((o) => !o.text)) {
      alert('Please fill out question text and all 4 options.');
      return;
    }

    try {
      const subjectObj = ACADEMIC_SUBJECTS.find((s) => s.id === formData.subjectId) || ACADEMIC_SUBJECTS[0];
      const saved = await saveQuestionBankItem(
        {
          ...formData,
          subjectName: subjectObj.name,
          status: formData.status || 'Draft',
        } as any,
        actorUid,
        actorEmail
      );

      setQuestions((prev) => [saved, ...prev]);
      setShowAddModal(false);
      // Reset form
      setFormData({
        subjectId: 'subj_math',
        subjectName: 'Mathematics',
        grade: 'Grade 10',
        topic: 'Algebra & Functions',
        difficulty: 'Medium',
        questionText: '',
        options: [
          { id: 'A', label: 'A', text: '' },
          { id: 'B', label: 'B', text: '' },
          { id: 'C', label: 'C', text: '' },
          { id: 'D', label: 'D', text: '' },
        ],
        correctAnswer: 'A',
        explanation: '',
        points: 4,
        negativePoints: 0,
        allowCalculator: true,
        status: 'Draft',
      });
    } catch (err) {
      console.error('Failed to save question:', err);
      alert('Error saving question. Please check server logs.');
    }
  };

  const handleAiGenerate = async () => {
    setAiGenerating(true);
    setAiDraftResult(null);
    try {
      const subObj = ACADEMIC_SUBJECTS.find((s) => s.name === aiSubject) || ACADEMIC_SUBJECTS[0];
      const draft = await generateAIQuestionDraft(
        {
          subjectId: subObj.id,
          subjectName: aiSubject,
          grade: aiGrade,
          topic: aiTopic,
          difficulty: aiDifficulty,
          promptGuidelines: aiPromptGuidelines,
        },
        actorUid,
        actorEmail
      );
      setAiDraftResult(draft);
      setQuestions((prev) => [draft, ...prev]);
    } catch (err: any) {
      console.error('AI Question Draft Failed:', err);
      alert('AI Generation error: ' + (err?.message || 'Could not connect to Gemini engine.'));
    } finally {
      setAiGenerating(false);
    }
  };

  const handleTestGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestGenerating(true);
    setTestGenSuccessMsg(null);
    try {
      const subObj = ACADEMIC_SUBJECTS.find((s) => s.name === testGenSubject) || ACADEMIC_SUBJECTS[0];
      const res = await generateTestFromBank(
        {
          title: testGenTitle || `Official ${testGenSubject} ${testGenGrade} ${testGenTier}`,
          subjectId: subObj.id,
          subjectName: testGenSubject,
          grade: testGenGrade,
          numberOfQuestions: Number(testGenCount),
          difficultyDistribution: {
            easy: Number(testGenEasy),
            medium: Number(testGenMed),
            hard: Number(testGenHard),
          },
          timeLimitMinutes: Number(testGenTime),
          competitionType: testGenTier,
        },
        actorUid,
        actorEmail
      );

      setTestGenSuccessMsg(
        `Successfully generated "${res.test.title}" with ${res.sanitizedQuestionsCount} questions! Competition is now LIVE.`
      );
      if (onTestGenerated) {
        onTestGenerated(res.test);
      }
    } catch (err: any) {
      console.error('Test generation failed:', err);
      alert('Test generation failed: ' + (err?.message || 'Server error'));
    } finally {
      setTestGenerating(false);
    }
  };

  // Calculate subject counts
  const subjectCounts = ACADEMIC_SUBJECTS.map((sub) => {
    const count = questions.filter(
      (q) => q.subjectId === sub.id || q.subjectName?.toLowerCase() === sub.name.toLowerCase()
    ).length;
    return { ...sub, count };
  });

  return (
    <div className="space-y-6">
      {/* Header with Master Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Multi-Subject Question Bank & Test Engine
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Stage 10 Certified
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Scalable repository supporting 12 subjects, Grades 5–12, LaTeX rendering, and server-authoritative test generation.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAiModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            AI Question Drafter
          </button>

          <button
            onClick={() => setShowTestGenModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
          >
            <PlayCircle className="w-4 h-4 text-emerald-200" />
            Generate Live Test
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>

          <button
            onClick={loadQuestions}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Scalable Subject Carousel / Selector */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Academic Subjects (12 Scalable Disciplines)
          </span>
          <span className="text-slate-400 font-mono text-[11px]">Total: {questions.length} Questions</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
              selectedSubject === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            All Subjects
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-black/30 font-mono">
              {questions.length}
            </span>
          </button>

          {subjectCounts.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                selectedSubject === sub.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span>{sub.name}</span>
              {sub.count > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 font-mono border border-cyan-800/40">
                  {sub.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="lg:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, topics, solutions..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </form>

        {/* Grade */}
        <div>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Grades (5–12)</option>
            {ACADEMIC_GRADES.map((g) => (
              <option key={g.id} value={g.id}>
                {g.id} ({g.category})
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy (Foundational)</option>
            <option value="Medium">Medium (Intermediate)</option>
            <option value="Hard">Hard (Olympiad)</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Review">Review</option>
            <option value="Approved">Approved (Ready for Test)</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Questions Listing */}
      {loading ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
          <span className="text-xs">Loading Question Bank...</span>
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-300">No Questions Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No questions matched your current filters. Try resetting the filters or use the AI Question Drafter to generate new problems.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {questions.map((q, idx) => {
            const isExpanded = expandedQuestionId === q.id;
            return (
              <div
                key={q.id || idx}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">
                      {q.questionId || `#${idx + 1}`}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {q.subjectName || q.subjectId || 'Academic'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                      {q.grade || 'All Grades'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800/80 text-slate-400">
                      {q.topic}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        q.difficulty === 'Hard'
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : q.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Pill */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        q.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : q.status === 'Review'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                          : q.status === 'Archived'
                          ? 'bg-slate-700/40 text-slate-400 border-slate-600'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {q.status || 'Draft'}
                    </span>

                    {/* Points */}
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      +{q.points || 4} Pts
                    </span>

                    {q.allowCalculator && (
                      <span className="p-1 rounded bg-slate-800 text-cyan-400" title="Calculator Allowed">
                        <Calculator className="w-3.5 h-3.5" />
                      </span>
                    )}

                    <button
                      onClick={() => setExpandedQuestionId(isExpanded ? null : (q.id as string))}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Question Statement */}
                <div className="pt-3">
                  <p className="text-sm font-medium text-slate-100 leading-relaxed font-sans">
                    {q.questionText}
                  </p>
                </div>

                {/* Expanded Details: Options, Correct Key, Solution, Admin Actions */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4 space-y-3"
                  >
                    {/* Options Grid */}
                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const isCorrect = q.correctAnswer === opt.id || q.correctAnswer === opt.label;
                          return (
                            <div
                              key={opt.id}
                              className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                                isCorrect
                                  ? 'bg-emerald-950/60 border-emerald-600 text-emerald-100 shadow-sm'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-300'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className="font-bold font-mono px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400">
                                  {opt.id}
                                </span>
                                <span>{opt.text}</span>
                              </span>
                              {isCorrect && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                                  <Shield className="w-3 h-3" /> Authoritative Key
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Official Solution Rationale */}
                    {q.explanation && (
                      <div className="p-3.5 bg-slate-950/90 rounded-xl border border-cyan-900/30 text-xs text-slate-200">
                        <div className="flex items-center gap-1.5 font-bold text-cyan-400 mb-1.5 text-[11px] uppercase tracking-wider">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Official Mathematical & Conceptual Proof
                        </div>
                        <p className="leading-relaxed font-mono text-[11px] text-slate-300">
                          {q.explanation}
                        </p>
                      </div>
                    )}

                    {/* Admin Status Transitions & Deletion */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>Workflow Status:</span>
                        <button
                          onClick={() => handleStatusChange(q.id as string, 'Draft')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                            q.status === 'Draft'
                              ? 'bg-amber-500/30 text-amber-200 border-amber-500'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          Draft
                        </button>
                        <button
                          onClick={() => handleStatusChange(q.id as string, 'Review')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                            q.status === 'Review'
                              ? 'bg-purple-500/30 text-purple-200 border-purple-500'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          Review
                        </button>
                        <button
                          onClick={() => handleStatusChange(q.id as string, 'Approved')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                            q.status === 'Approved'
                              ? 'bg-emerald-500/30 text-emerald-200 border-emerald-500'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          Approve (Ready for Test)
                        </button>
                        <button
                          onClick={() => handleStatusChange(q.id as string, 'Archived')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                            q.status === 'Archived'
                              ? 'bg-slate-700 text-white border-slate-600'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          Archive
                        </button>
                      </div>

                      <div>
                        <button
                          onClick={() => handleDelete(q.id as string)}
                          className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800/80 text-rose-300 text-[11px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================== */}
      {/* 1. MANUAL QUESTION CREATION MODAL */}
      {/* ========================================== */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-cyan-400" />
                  Author Academic Question (Question Bank)
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleManualSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Subject *</label>
                    <select
                      value={formData.subjectId}
                      onChange={(e) => {
                        const sObj = ACADEMIC_SUBJECTS.find((s) => s.id === e.target.value);
                        setFormData({
                          ...formData,
                          subjectId: e.target.value,
                          subjectName: sObj?.name || 'Mathematics',
                        });
                      }}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    >
                      {ACADEMIC_SUBJECTS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Grade Level *</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    >
                      {ACADEMIC_GRADES.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.id} ({g.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Difficulty *</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Easy">Easy (Foundational)</option>
                      <option value="Medium">Medium (Intermediate)</option>
                      <option value="Hard">Hard (Olympiad)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Topic / Core Area *</label>
                  <input
                    type="text"
                    required
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g. Calculus: Derivatives & Tangents"
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Question Statement (Supports LaTeX notation) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.questionText}
                    onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                    placeholder="Enter full problem statement with rigorous context..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                {/* 4 Options with Correct Answer Selector */}
                <div>
                  <label className="block text-slate-400 mb-2 font-semibold">
                    Options & Authoritative Answer Key *
                  </label>
                  <div className="space-y-2">
                    {formData.options?.map((opt, idx) => (
                      <div key={opt.id} className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="correctAnswerKey"
                            checked={formData.correctAnswer === opt.id}
                            onChange={() => setFormData({ ...formData, correctAnswer: opt.id })}
                            className="text-cyan-500 focus:ring-cyan-500"
                          />
                          <span className="font-mono font-bold text-cyan-400 w-4">{opt.id}</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={opt.text}
                          onChange={(e) => {
                            const nextOpts = [...(formData.options || [])];
                            nextOpts[idx].text = e.target.value;
                            setFormData({ ...formData, options: nextOpts });
                          }}
                          placeholder={`Option ${opt.id} text`}
                          className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Select the radio button corresponding to the single verified correct option.
                  </p>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Official Solution & Proof Explanation *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    placeholder="Provide step-by-step mathematical rationale..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Points (+)</label>
                    <input
                      type="number"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Negative Marking (-)</label>
                    <input
                      type="number"
                      value={formData.negativePoints}
                      onChange={(e) => setFormData({ ...formData, negativePoints: Number(e.target.value) })}
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Initial Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Review">Review</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="allowCalc"
                    checked={formData.allowCalculator}
                    onChange={(e) => setFormData({ ...formData, allowCalculator: e.target.checked })}
                    className="rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <label htmlFor="allowCalc" className="text-slate-300 text-xs cursor-pointer">
                    Allow candidate scientific calculator in exam interface
                  </label>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl"
                  >
                    Save to Question Bank
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* 2. AI QUESTION DRAFTER MODAL (GEMINI 3.7) */}
      {/* ========================================== */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">AI Question Drafter (Gemini 3.7)</h3>
                </div>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Subject</label>
                    <select
                      value={aiSubject}
                      onChange={(e) => setAiSubject(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    >
                      {ACADEMIC_SUBJECTS.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Grade Target</label>
                    <select
                      value={aiGrade}
                      onChange={(e) => setAiGrade(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    >
                      {ACADEMIC_GRADES.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.id} ({g.category})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Topic Focus</label>
                    <input
                      type="text"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      placeholder="e.g. Kinematics, Photosynthesis"
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Difficulty</label>
                    <select
                      value={aiDifficulty}
                      onChange={(e) => setAiDifficulty(e.target.value as any)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard (Olympiad Challenge)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">
                    Special Authoring Directives (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={aiPromptGuidelines}
                    onChange={(e) => setAiPromptGuidelines(e.target.value)}
                    placeholder="e.g. Must require multi-step dimensional analysis; include trick distractors."
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={aiGenerating}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 cursor-pointer"
                >
                  {aiGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Generating Rigorous Olympiad Question...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Generate Draft Problem
                    </>
                  )}
                </button>

                {aiDraftResult && (
                  <div className="p-4 bg-purple-950/40 border border-purple-800/60 rounded-xl space-y-2 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Generated & Added to Drafts!
                      </span>
                      <span className="font-mono text-[10px] text-purple-200">
                        {aiDraftResult.questionId}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">{aiDraftResult.questionText}</p>
                    <div className="text-[11px] text-emerald-300 font-mono">
                      Answer Key: Option {aiDraftResult.correctAnswer}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================== */}
      {/* 3. TEST GENERATOR ENGINE MODAL */}
      {/* ========================================== */}
      <AnimatePresence>
        {showTestGenModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Multi-Subject Test Generator Engine</h3>
                </div>
                <button
                  onClick={() => setShowTestGenModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleTestGenerate} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Test Title</label>
                  <input
                    type="text"
                    value={testGenTitle}
                    onChange={(e) => setTestGenTitle(e.target.value)}
                    placeholder={`e.g. EduVerse ${testGenSubject} ${testGenGrade} Invitational 2026`}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Subject *</label>
                    <select
                      value={testGenSubject}
                      onChange={(e) => setTestGenSubject(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    >
                      {ACADEMIC_SUBJECTS.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Grade Level *</label>
                    <select
                      value={testGenGrade}
                      onChange={(e) => setTestGenGrade(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    >
                      {ACADEMIC_GRADES.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.id} ({g.category})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Total Questions</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={testGenCount}
                      onChange={(e) => setTestGenCount(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Time Limit (Mins)</label>
                    <input
                      type="number"
                      min={10}
                      max={180}
                      value={testGenTime}
                      onChange={(e) => setTestGenTime(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Tier</label>
                    <select
                      value={testGenTier}
                      onChange={(e) => setTestGenTier(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
                    >
                      <option value="Weekly Challenge">Weekly Challenge</option>
                      <option value="Invitational">Invitational</option>
                      <option value="Championship">Championship</option>
                    </select>
                  </div>
                </div>

                {/* Difficulty Distribution Sliders */}
                <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-300 font-semibold">
                    <span className="flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Difficulty Balance Target
                    </span>
                    <span className="font-mono text-cyan-400">
                      {testGenEasy}% Easy / {testGenMed}% Med / {testGenHard}% Hard
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-emerald-400 block mb-0.5">Easy ({testGenEasy}%)</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={testGenEasy}
                        onChange={(e) => setTestGenEasy(Number(e.target.value))}
                        className="w-full accent-emerald-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 block mb-0.5">Medium ({testGenMed}%)</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={testGenMed}
                        onChange={(e) => setTestGenMed(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-400 block mb-0.5">Hard ({testGenHard}%)</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={testGenHard}
                        onChange={(e) => setTestGenHard(Number(e.target.value))}
                        className="w-full accent-rose-500"
                      />
                    </div>
                  </div>
                </div>

                {testGenSuccessMsg && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-700 text-emerald-200 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{testGenSuccessMsg}</span>
                  </div>
                )}

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowTestGenModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={testGenerating}
                    className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/30 flex items-center gap-2 cursor-pointer"
                  >
                    {testGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Compiling Test Document...
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4" /> Generate & Publish Exam
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
