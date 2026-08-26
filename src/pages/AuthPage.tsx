import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, ArrowLeft } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import { OnboardingFlow } from '../components/onboarding/OnboardingFlow';
import { AuthScene } from '../components/3d/AuthScene';
import { OnboardingScene } from '../components/3d/OnboardingScene';
import { useAuth } from '../context/AuthContext';

interface AuthPageProps {
  initialView?: 'login' | 'signup' | 'forgot-password' | 'onboarding';
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialView = 'login',
  onNavigateHome,
  onNavigateDashboard,
}) => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot-password' | 'onboarding'>(initialView);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const { user, userProfile } = useAuth();

  const handleNavigate = (nextView: 'login' | 'signup' | 'forgot-password' | 'onboarding' | 'dashboard') => {
    if (nextView === 'dashboard') {
      onNavigateDashboard();
    } else {
      setView(nextView);
    }
  };

  const getHeroContextText = () => {
    switch (view) {
      case 'signup':
        return {
          title: 'Start your global academic journey',
          subtitle: 'Access AI-curated Olympiads, international masterclasses, and verified achievement credentials.',
        };
      case 'forgot-password':
        return {
          title: 'Secure Account Recovery',
          subtitle: 'Verified single-use recovery links dispatched directly to your registered address.',
        };
      case 'onboarding':
        return {
          title: 'Craft Your Academic Identity',
          subtitle: 'Connect your school and grade level to participate in global rankings.',
        };
      case 'login':
      default:
        return {
          title: 'Welcome to the Global Academic Arena',
          subtitle: 'Join thousands of students competing in mathematics, science, and computer science.',
        };
    }
  };

  const contextText = getHeroContextText();

  return (
    <div className="min-h-screen bg-ambient-light flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed top-0 right-0 w-[500px] h-[500px] bg-blue-300/20 rounded-full blur-[120px] -z-10" />
      <div className="pointer-events-none fixed bottom-0 left-0 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-[120px] -z-10" />

      {/* Top Header Bar with Brand & Back Link */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-20 mb-4 sm:mb-8">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1 text-left cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center shadow-md shadow-blue-600/20 text-white border border-white/40 group-hover:scale-105 transition-transform">
            <Globe className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Edu<span className="text-blue-600">Verse</span>
          </span>
        </button>

        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors focus:outline-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full my-auto">
          
          {/* Left Column (Desktop 3D Scene + Copy) */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left order-1 lg:order-1">
            <div className="w-full max-w-md mx-auto lg:max-w-none">
              {view === 'onboarding' ? (
                <OnboardingScene step={onboardingStep} />
              ) : (
                <AuthScene />
              )}
            </div>

            <motion.div
              key={view}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="hidden lg:block mt-2 max-w-md"
            >
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {contextText.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {contextText.subtitle}
              </p>
            </motion.div>
          </div>

          {/* Right Column (Glass Auth Card) */}
          <div className="lg:col-span-6 flex items-center justify-center order-2 lg:order-2 w-full">
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card w-full max-w-lg p-6 sm:p-8 lg:p-10 rounded-3xl border border-white shadow-xl shadow-blue-950/5"
            >
              {view === 'login' && <LoginForm onNavigate={handleNavigate} />}
              {view === 'signup' && <SignupForm onNavigate={handleNavigate} />}
              {view === 'forgot-password' && (
                <ForgotPasswordForm onNavigate={handleNavigate} />
              )}
              {view === 'onboarding' && (
                <OnboardingFlow
                  onComplete={() => onNavigateDashboard()}
                  onStepChange={(step) => setOnboardingStep(step)}
                />
              )}
            </motion.div>
          </div>

        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="max-w-7xl mx-auto w-full text-center text-xs text-slate-400 mt-6 pt-4 border-t border-slate-200/50">
        © {new Date().getFullYear()} EduVerse Inc. Standardized Security & Verified Credentials.
      </div>
    </div>
  );
};
