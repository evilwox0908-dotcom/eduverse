import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  Menu,
  X,
  BookOpen,
  Trophy,
  BarChart3,
  GraduationCap,
  Sparkles,
  ArrowRight,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { NavItem, ActiveModal } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  activeNav: string;
  onSelectNav: (id: string) => void;
  onOpenModal: (modal: ActiveModal) => void;
  onNavigateAuth?: (view: 'login' | 'signup' | 'dashboard') => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'learn', label: 'Learn', href: '/learn' },
  { id: 'compete', label: 'Compete', href: '/compete' },
  { id: 'leaderboard', label: 'Leaderboard', href: '/leaderboard' },
  { id: 'universities', label: 'Universities', href: '/universities' },
];

export const Header: React.FC<HeaderProps> = ({
  activeNav,
  onSelectNav,
  onOpenModal,
  onNavigateAuth,
}) => {
  const { user, userProfile, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavIcon = (id: string) => {
    switch (id) {
      case 'learn':
        return <BookOpen className="w-4 h-4" />;
      case 'compete':
        return <Trophy className="w-4 h-4" />;
      case 'leaderboard':
        return <BarChart3 className="w-4 h-4" />;
      case 'universities':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const displayName = userProfile?.firstName
    ? `${userProfile.firstName} ${userProfile.lastName}`
    : user?.displayName || 'Student';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 ${
          isScrolled ? 'pt-2.5 sm:pt-3' : 'pt-4 sm:pt-5'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <nav
            className={`flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl transition-all duration-300 ${
              isScrolled
                ? 'bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-lg shadow-slate-900/5'
                : 'bg-white/70 backdrop-blur-lg border border-white/80 shadow-md shadow-slate-900/5'
            }`}
          >
            {/* Logo */}
            <button
              onClick={() => onSelectNav('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-700 to-sky-500 flex items-center justify-center shadow-md shadow-blue-600/25 border border-white/40 group-hover:scale-105 transition-transform duration-200">
                <Globe className="w-5 h-5 text-white stroke-[2]" />
              </div>
              <div className="flex flex-col">
                <div className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                  Edu<span className="text-blue-600">Verse</span>
                </div>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'home') {
                        onSelectNav('home');
                      } else {
                        onOpenModal(item.id as ActiveModal);
                      }
                    }}
                    className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-blue-600 bg-blue-50/80 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-1 left-3.5 right-3.5 h-[2px] bg-blue-600 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Side CTAs */}
            <div className="hidden sm:flex items-center gap-2.5">
              {user ? (
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateAuth) onNavigateAuth('dashboard');
                      else onSelectNav('dashboard');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/80 text-blue-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center overflow-hidden">
                      {userProfile?.photoURL || user.photoURL ? (
                        <img
                          src={userProfile?.photoURL || user.photoURL || ''}
                          alt={displayName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <UserIcon className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className="truncate max-w-[120px]">
                      {userProfile?.firstName || displayName.split(' ')[0]}
                    </span>
                    <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => logout()}
                    className="text-slate-600 hover:text-red-600 text-xs px-2.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (onNavigateAuth) onNavigateAuth('login');
                      else onOpenModal('login');
                    }}
                    className="text-slate-700 hover:text-blue-600"
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (onNavigateAuth) onNavigateAuth('signup');
                      else onOpenModal('signup');
                    }}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="shadow-md shadow-blue-600/20"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex sm:hidden items-center gap-2">
              {!user && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (onNavigateAuth) onNavigateAuth('signup');
                    else onOpenModal('signup');
                  }}
                  className="text-xs px-3 py-1.5"
                >
                  Get Started
                </Button>
              )}
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateAuth) onNavigateAuth('dashboard');
                    else onSelectNav('dashboard');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </button>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                className="p-2 rounded-xl text-slate-700 hover:bg-slate-100/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 sm:hidden rounded-2xl glass-nav p-5 border border-slate-200/80 shadow-2xl shadow-slate-900/10"
          >
            <div className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (item.id === 'home') {
                        onSelectNav('home');
                      } else {
                        onOpenModal(item.id as ActiveModal);
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left cursor-pointer ${
                      isActive
                        ? 'text-blue-600 bg-blue-50/90'
                        : 'text-slate-700 hover:bg-slate-100/80'
                    }`}
                  >
                    <span className="text-blue-500">{getNavIcon(item.id)}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200/60 flex flex-col gap-2">
              {user ? (
                <>
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onNavigateAuth) onNavigateAuth('dashboard');
                    }}
                    leftIcon={<LayoutDashboard className="w-4 h-4" />}
                  >
                    View Dashboard
                  </Button>
                  <Button
                    variant="secondary"
                    size="md"
                    fullWidth
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    leftIcon={<LogOut className="w-4 h-4" />}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    size="md"
                    fullWidth
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onNavigateAuth) onNavigateAuth('login');
                      else onOpenModal('login');
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onNavigateAuth) onNavigateAuth('signup');
                      else onOpenModal('signup');
                    }}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

