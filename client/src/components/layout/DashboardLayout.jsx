import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { MobileNav } from './MobileNav';
import { cn } from '../../lib/utils';
import { pageTransition } from '../../lib/motion.js';
import { AchievementUnlockToast } from '../gamification/AchievementUnlockToast';
import { IncompleteDaysGuard } from '../journey/IncompleteDaysGuard';

const JOURNEY_PATHS = [
  '/body-transformation',
  '/dual-brand',
  '/reading',
  '/writers',
  '/software-engineering',
];

export function DashboardLayout({ children, className }) {
  const location = useLocation();
  const isJourneyPage =
    JOURNEY_PATHS.some((p) => location.pathname === p || location.pathname.startsWith(`${p}/`)) ||
    location.pathname.startsWith('/journey/') ||
    location.pathname.startsWith('/discipline/');
  const isDashboard = location.pathname === '/dashboard';
  const isCreateJourney = location.pathname === '/dashboard/create-journey';
  const isSettings = location.pathname === '/settings';
  const useWideLayout = isDashboard || isCreateJourney || isSettings;

  return (
    <div className="flex min-h-screen overflow-x-hidden text-[var(--text-primary)]" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-0 min-w-0 overflow-x-hidden md:pl-[280px]">
        <TopNav />
        <IncompleteDaysGuard />
        <main
          className={cn(
            'flex-1 relative z-0 overflow-x-hidden w-full',
            isJourneyPage ? 'px-0 py-0 pb-20 md:pb-0' : 'px-5 py-8 pb-28 md:px-6 md:pb-10 lg:px-12',
            className
          )}
        >
          <div
            className={cn(
              isJourneyPage ? 'w-full' : 'w-full mx-auto',
              useWideLayout ? 'max-w-[1440px]' : 'max-w-5xl space-y-6'
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={pageTransition.initial}
                animate={pageTransition.animate}
                exit={pageTransition.exit}
                transition={pageTransition.transition}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        <MobileNav />
      </div>
      <AchievementUnlockToast />
    </div>
  );
}
