import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Globe, Award, ArrowUpRight } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { InfoCardData, ActiveModal } from '../../types';

interface InfoCardsSectionProps {
  onOpenModal: (modal: ActiveModal) => void;
}

const CARDS_DATA: InfoCardData[] = [
  {
    id: 'learn',
    title: 'AI Learning',
    description: 'Learn with a personalized AI teacher.',
    iconName: 'Sparkles',
    tag: 'Adaptive Engine',
  },
  {
    id: 'compete',
    title: 'Global Competition',
    description: 'Compete with students around the world.',
    iconName: 'Globe',
    tag: 'Real-time Arena',
  },
  {
    id: 'leaderboard',
    title: 'Real Rankings',
    description: 'Build your verified academic record.',
    iconName: 'Award',
    tag: 'Verified Portfolio',
  },
];

export const InfoCardsSection: React.FC<InfoCardsSectionProps> = ({ onOpenModal }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-blue-600 stroke-[2]" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-sky-600 stroke-[2]" />;
      case 'Award':
        return <Award className="w-5 h-5 text-indigo-600 stroke-[2]" />;
      default:
        return <Sparkles className="w-5 h-5 text-blue-600" />;
    }
  };

  const getIconBackground = (name: string) => {
    switch (name) {
      case 'Sparkles':
        return 'bg-blue-50 border-blue-200/80 text-blue-600 shadow-blue-500/10';
      case 'Globe':
        return 'bg-sky-50 border-sky-200/80 text-sky-600 shadow-sky-500/10';
      case 'Award':
        return 'bg-indigo-50 border-indigo-200/80 text-indigo-600 shadow-indigo-500/10';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-600';
    }
  };

  return (
    <section className="relative py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              The Ecosystem
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Architected for Academic Excellence
            </h2>
          </div>
          <p className="text-sm text-slate-500 mt-2 md:mt-0 max-w-md">
            Three core pillars designed to elevate intellectual potential into measurable mastery.
          </p>
        </div>

        {/* 3 Information Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CARDS_DATA.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <GlassCard
                onClick={() => onOpenModal(card.id as ActiveModal)}
                className="p-6 sm:p-8 h-full flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Top Row: Icon and Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm transition-transform duration-300 group-hover:scale-105 ${getIconBackground(
                        card.iconName
                      )}`}
                    >
                      {getIcon(card.iconName)}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/60 tracking-tight">
                      {card.tag}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                {/* Subtle Card Action Link */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform duration-200">
                  <span>Learn more</span>
                  <ArrowUpRight className="w-4 h-4 text-blue-600" />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
