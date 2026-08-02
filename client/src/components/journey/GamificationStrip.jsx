import { motion } from 'framer-motion';
import { Flame, Star, TrendingUp, Trophy } from 'lucide-react';
import { LevelBar } from '../ui/level-bar';
import { cn } from '../../lib/utils';

/**
 * Compact gamification strip — always reflects live XP, level, streak, badges.
 */
export function GamificationStrip({
  journeyXP,
  journeyLevel,
  streaks,
  achievements,
  accentColor,
  className,
}) {
  const level = journeyLevel?.level ?? 0;
  const currentXP = journeyLevel?.currentXP ?? 0;
  const xpToNext = journeyLevel?.xpToNext ?? 100;
  const badgeCount = achievements?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-xl border p-4 sm:p-5',
        'bg-[var(--bg-card)] border-[var(--border-subtle)]',
        className
      )}
      style={{
        boxShadow: accentColor ? `0 0 24px ${accentColor}12` : undefined,
      }}
    >
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
        <StatPill icon={Star} label="XP" value={journeyXP} iconClass="text-yellow-400" />
        <StatPill icon={TrendingUp} label="Level" value={(journeyLevel?.level ?? 0) + 1} iconClass="text-[var(--neon-green)]" />
        <StatPill
          icon={Flame}
          label="Streak"
          value={streaks?.current ?? 0}
          iconClass="text-orange-400"
        />
        <StatPill
          icon={Trophy}
          label="Badges"
          value={badgeCount}
          iconClass="text-[var(--neon-purple)]"
        />
      </div>
      <LevelBar
        level={level + 1}
        currentXP={currentXP}
        xpToNext={xpToNext}
        className="[&_span]:text-[var(--text-secondary)]"
      />
    </motion.div>
  );
}

function StatPill({ icon: Icon, label, value, iconClass }) {
  return (
    <div className="flex items-center gap-2 min-w-[72px]">
      <div className="flex size-9 items-center justify-center rounded-lg bg-white/5">
        <Icon className={cn('size-4', iconClass)} />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
        <p className="text-base font-semibold tabular-nums text-[var(--text-primary)]">{value}</p>
      </div>
    </div>
  );
}
