import React from 'react';
import {
  Binary,
  Atom,
  Layers,
  FlaskConical,
  Dna,
  Telescope,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { Subject } from '../../types';
import { GlassCard } from '../ui/GlassCard';

interface SubjectGridProps {
  subjects: Subject[];
  selectedSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
}

export const SubjectGrid: React.FC<SubjectGridProps> = ({
  subjects,
  selectedSubjectId,
  onSelectSubject,
}) => {
  const getSubjectIcon = (slug: string) => {
    switch (slug) {
      case 'mathematics':
        return Binary;
      case 'physics':
        return Atom;
      case 'computer-science':
        return Layers;
      case 'chemistry':
        return FlaskConical;
      case 'biology':
        return Dna;
      case 'astronomy':
        return Telescope;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Academic Disciplines</h2>
          <p className="text-xs text-slate-500">
            Structured subject pathways built with university professors and Olympiad laureates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {subjects.map((sub) => {
          const Icon = getSubjectIcon(sub.slug);
          const isSelected = selectedSubjectId === sub.id;

          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => onSelectSubject(isSelected ? 'all' : sub.id)}
              className={`p-4 rounded-3xl text-left border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/80 shadow-md shadow-blue-600/10 ring-2 ring-blue-600/20'
                  : 'border-white/80 bg-white/70 hover:bg-white hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="space-y-2.5">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{sub.name}</h3>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {sub.courseCount ?? sub.coursesCount ?? 0}{' '}
                    {(sub.courseCount ?? sub.coursesCount ?? 0) === 1 ? 'Course' : 'Courses'}
                  </p>
                </div>
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px] font-bold text-blue-600">
                <span>{isSelected ? 'Selected' : 'Explore'}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
