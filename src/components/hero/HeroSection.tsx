import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { HeroScene } from '../3d/HeroScene';
import { ActiveModal } from '../../types';

interface HeroSectionProps {
  onOpenModal: (modal: ActiveModal) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenModal }) => {
  return (
    <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Subtitle, CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            
            {/* Top Atmospheric Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold text-blue-800 shadow-xs mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Next-Gen Academic Arena</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]"
            >
              Learn. Compete.{' '}
              <span className="block mt-1 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 bg-clip-text text-transparent">
                Become the Best.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal"
            >
              EduVerse is a global platform where students learn with AI, compete in real academic challenges, and prove themselves worldwide.
            </motion.p>

            {/* Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => onOpenModal('signup')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto glow-blue-subtle text-base"
              >
                Get Started
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => onOpenModal('competitions')}
                leftIcon={<Compass className="w-4 h-4 text-blue-600" />}
                className="w-full sm:w-auto text-base border-blue-200 hover:border-blue-400"
              >
                Explore Competitions
              </Button>
            </motion.div>

            {/* Global Trust Anchor Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-8 sm:mt-10 flex items-center gap-2 text-xs font-medium text-slate-500"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Standardized international curriculum & AI-proctored global benchmarks</span>
            </motion.div>
          </div>

          {/* Right Column: 3D Visual Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 w-full flex items-center justify-center relative mt-4 lg:mt-0"
          >
            <HeroScene />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
