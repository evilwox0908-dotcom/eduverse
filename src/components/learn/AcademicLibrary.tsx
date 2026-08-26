import React, { useState, useEffect } from 'react';
import {
  Library,
  FileText,
  Download,
  Eye,
  Sparkles,
  Search,
  BookOpen,
  CheckCircle,
  ExternalLink,
  X,
} from 'lucide-react';
import { Subject, LearningResource } from '../../types';
import { GlassCard } from '../ui/GlassCard';

interface AcademicLibraryProps {
  subjects: Subject[];
  onLaunchAIWithTopic: (topic: string) => void;
}

export const AcademicLibrary: React.FC<AcademicLibraryProps> = ({
  subjects,
  onLaunchAIWithTopic,
}) => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Preview document modal
  const [previewDoc, setPreviewDoc] = useState<LearningResource | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedSubjectId !== 'all') params.append('subjectId', selectedSubjectId);
        if (selectedType !== 'all') params.append('type', selectedType);

        const res = await fetch(`/api/learning/resources?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setResources(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch resources:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [selectedSubjectId, selectedType]);

  const filteredResources = resources.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.subjectName.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q)
    );
  });

  const resourceTypes = [
    { id: 'all', label: 'All Formats' },
    { id: 'FORMULA_SHEET', label: 'Formula Sheets' },
    { id: 'CHEATSHEET', label: 'Cheatsheets' },
    { id: 'WORKED_SOLUTIONS', label: 'Worked Solutions' },
    { id: 'PAST_PAPER', label: 'Past Papers' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 bg-gradient-to-r from-white/95 via-indigo-50/40 to-blue-50/50 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Academic Library & Reference
              </span>
              <span className="text-xs font-semibold text-slate-500">Verified Study Guides</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Formula Sheets & Olympiad Solutions
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Curated mathematical compendiums, derivation reference cards, algorithmic complexity cheatsheets, and verified past Olympiad solutions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/80 border border-indigo-100 shadow-xs flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
              {resources.length}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900">Verified Reference Sheets</span>
              <p className="text-[10px] text-slate-500">Free open academic access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="glass-card rounded-2xl p-4 border border-white/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search formula sheets, past papers, or topics..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:bg-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Type pills */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {resourceTypes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedType(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedType === t.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-semibold">Loading library resources...</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white/70 border border-slate-200 text-center text-slate-500 text-xs space-y-2">
          <p className="font-bold">No academic resources found matching criteria.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedSubjectId('all');
              setSelectedType('all');
              setSearchQuery('');
            }}
            className="text-blue-600 underline font-bold"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res) => (
            <GlassCard
              key={res.id}
              className="p-5 rounded-3xl border border-white/80 flex flex-col justify-between hover:shadow-md transition-all duration-200 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    {res.subjectName}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {res.format}
                  </span>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {res.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {res.gradeLevel || 'Secondary / Olympiad Level'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onLaunchAIWithTopic(`Academic Guide: ${res.title}`)}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Explain</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(res)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      alert(`Downloading official reference copy for: ${res.title}`);
                    }}
                    className="p-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold transition-colors"
                    title="Download Resource"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-white/80 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-5 relative">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-5 right-5 p-2 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                  {previewDoc.subjectName}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{previewDoc.title}</h3>
                <p className="text-xs text-slate-500">
                  EduVerse Verified Academic Library Document
                </p>
              </div>
            </div>

            {/* Document preview box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-3 font-mono">
              <div className="font-bold text-slate-900 uppercase text-[11px] pb-2 border-b border-slate-200">
                Document Summary & Core Formulations
              </div>
              <p>
                This reference document contains official EduVerse formulas, key derivation steps, and worked examples calibrated for {previewDoc.gradeLevel || 'Olympiad & High School'} competition excellence.
              </p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                <p className="font-bold text-indigo-900">High-Yield Takeaways:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Formal definition and theorem boundary conditions</li>
                  <li>Common algebraic and kinematic trap cases</li>
                  <li>Speed deduction shortcuts verified for timed competition exams</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setPreviewDoc(null);
                  onLaunchAIWithTopic(`Explain the key formulas in ${previewDoc.title}`);
                }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Sparkles className="w-4 h-4" />
                <span>Discuss with AI Teacher</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  alert(`Downloading: ${previewDoc.title}`);
                  setPreviewDoc(null);
                }}
                className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Full Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
