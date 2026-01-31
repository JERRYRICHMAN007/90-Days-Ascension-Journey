import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Star, TrendingUp } from 'lucide-react';
import { Progress } from '../ui/progress';

/**
 * Journey Card v2.0 - PRD Design
 * Features:
 * - Gradient left border (journey color)
 * - Glass morphism background
 * - Hover lift effect
 * - Animated progress bar
 * - Mini stats (streak, XP, level)
 */
export function JourneyCardV2({ journey, progress, stats, index }) {
  const journeyColors = {
    'body-transformation': {
      gradient: 'journey-body-gradient',
      border: 'border-l-[4px] border-journey-body',
      iconBg: 'bg-journey-body',
    },
    'dual-brand': {
      gradient: 'journey-brand-gradient',
      border: 'border-l-[4px] border-journey-brand',
      iconBg: 'bg-journey-brand',
    },
    'reading': {
      gradient: 'journey-reading-gradient',
      border: 'border-l-[4px] border-journey-reading',
      iconBg: 'bg-journey-reading',
    },
    'writers': {
      gradient: 'journey-writing-gradient',
      border: 'border-l-[4px] border-journey-writing',
      iconBg: 'bg-journey-writing',
    },
    'software-engineering': {
      gradient: 'journey-software-gradient',
      border: 'border-l-[4px] border-journey-software',
      iconBg: 'bg-journey-software',
    },
  };

  const colors = journeyColors[journey.id] || journeyColors['body-transformation'];
  const Icon = journey.icon || (() => <span>{journey.icon}</span>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <Link to={`/${journey.id}`} className="h-full block">
        <motion.div
          className={`
            glass-card rounded-lg sm:rounded-xl p-3.5 sm:p-4 md:p-5 lg:p-6 cursor-pointer
            ${colors.border}
            card-lift
            relative overflow-hidden
            w-full h-full flex flex-col
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Gradient overlay on hover */}
          <div className={`absolute inset-0 ${colors.gradient} opacity-0 hover:opacity-5 transition-opacity duration-300`} />
          
          <div className="relative z-10 flex flex-col flex-1">
            {/* Header */}
            <div className="flex items-start justify-between mb-2.5 sm:mb-3 md:mb-4 gap-2">
              <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3 flex-1 min-w-0">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg ${colors.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-foreground mb-0.5 sm:mb-1 line-clamp-1 break-words">{journey.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 break-words">{journey.description}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0 ml-1" />
            </div>

            {/* Progress Bar */}
            <div className="mb-2.5 sm:mb-3 md:mb-4 flex-shrink-0">
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <span className="text-xs sm:text-sm font-semibold text-foreground">
                  {progress.percentage}%
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  Day {progress.completed} of {progress.total}
                </span>
              </div>
              <div className="relative h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${colors.gradient} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <div className="shimmer absolute inset-0" />
                </motion.div>
              </div>
            </div>

            {/* Mini Stats - Push to bottom */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 mt-auto">
              <div className="flex flex-col items-center p-1.5 sm:p-2 rounded-lg bg-muted/30">
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-streak mb-0.5 sm:mb-1" />
                <span className="text-sm sm:text-base md:text-lg font-bold text-foreground tabular-nums">
                  {stats.streak || 0}
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">Streak</span>
              </div>
              <div className="flex flex-col items-center p-1.5 sm:p-2 rounded-lg bg-muted/30">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-xp mb-0.5 sm:mb-1" />
                <span className="text-sm sm:text-base md:text-lg font-bold text-foreground tabular-nums">
                  {stats.xp?.toLocaleString() || 0}
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">XP</span>
              </div>
              <div className="flex flex-col items-center p-1.5 sm:p-2 rounded-lg bg-muted/30">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-levelup mb-0.5 sm:mb-1" />
                <span className="text-sm sm:text-base md:text-lg font-bold text-foreground tabular-nums">
                  Lv.{stats.level !== undefined ? stats.level : 0}
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">Level</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

