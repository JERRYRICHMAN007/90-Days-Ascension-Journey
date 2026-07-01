import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Star, TrendingUp } from 'lucide-react';
import { Progress } from '../ui/progress';
import { TiltCard3D } from '../ui/TiltCard3D';
import { getJourneyTheme } from '../../utils/journeyTheme.js';
import { computeMasteryScore, getJourneyTrace } from '../../utils/tracing.js';
import { staggerItem } from '../../lib/motion.js';

export function UnifiedJourneyCard({
  journeyId,
  title,
  description,
  progress,
  stats,
}) {
  const navigate = useNavigate();
  const theme = getJourneyTheme(journeyId);
  const Icon = theme.icon;
  const trace = getJourneyTrace(journeyId);
  const mastery = computeMasteryScore(trace);

  return (
    <motion.div variants={staggerItem} className="h-full">
      <TiltCard3D className="h-full">
      <motion.div
        role="button"
        tabIndex={0}
        onClick={() => navigate(theme.path)}
        onKeyDown={(e) => e.key === 'Enter' && navigate(theme.path)}
        className={`glass-panel rounded-xl p-4 sm:p-5 cursor-pointer ${theme.borderClass} card-lift relative overflow-hidden h-full flex flex-col group`}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
          <div className={`absolute inset-0 ${theme.gradientClass} opacity-0 group-hover:opacity-[0.06] transition-opacity`} />

          <div className="relative z-10 flex flex-col flex-1">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`w-11 h-11 rounded-lg ${theme.iconBgClass} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-foreground line-clamp-1">{title}</h3>
                  {description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{description}</p>
                  )}
                </div>
              </div>
              <div className="text-center shrink-0 px-2 py-1 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-[10px] uppercase text-muted-foreground">Mastery</p>
                <p className="text-lg font-bold text-primary tabular-nums leading-none">{mastery}</p>
              </div>
            </div>

            <div className="space-y-2 mt-auto">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{progress.completed} / {progress.total} days</span>
                <span className="font-semibold text-foreground">{progress.percentage}%</span>
              </div>
              <Progress value={progress.percentage} className="h-2" />

              <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  {stats.streak}d streak
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-500" />
                  Lvl {stats.level}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                  {stats.xp.toLocaleString()} XP
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
              <Link
                to={`/analytics/${journeyId}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-primary hover:underline relative z-20"
              >
                Analytics
              </Link>
              <span className="text-xs text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors">
                Open journey
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </motion.div>
      </TiltCard3D>
    </motion.div>
  );
}
