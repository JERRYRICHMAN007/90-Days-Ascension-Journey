import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Star, TrendingUp } from 'lucide-react';
import { TiltCard3D } from '../ui/TiltCard3D';
import { getJourneyTheme } from '../../utils/journeyTheme.js';
import { getJourneyAccent, masteryToRank } from '../../utils/journeyAccents.js';
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
  const accent = getJourneyAccent(journeyId);
  const Icon = theme.icon;
  const trace = getJourneyTrace(journeyId);
  const mastery = computeMasteryScore(trace);
  const rank = masteryToRank(mastery);

  return (
    <motion.div variants={staggerItem} className="h-full">
      <TiltCard3D className="h-full">
        <motion.div
          role="button"
          tabIndex={0}
          onClick={() => navigate(theme.path)}
          onKeyDown={(e) => e.key === 'Enter' && navigate(theme.path)}
          className="forge-card cursor-pointer relative overflow-hidden h-full flex flex-col group transition-all duration-300"
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = accent.color;
            e.currentTarget.style.boxShadow = accent.glow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div className="relative z-10 flex flex-col flex-1 gap-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className="w-11 h-11 rounded-[8px] flex items-center justify-center shrink-0 border"
                  style={{
                    background: `rgba(${accent.rgb}, 0.12)`,
                    borderColor: `rgba(${accent.rgb}, 0.3)`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: accent.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="forge-heading-lg text-[20px] line-clamp-1">{title}</h3>
                  <span
                    className="inline-block mt-1 forge-rank-badge"
                    style={{
                      color: accent.color,
                      border: `1px solid rgba(${accent.rgb}, 0.4)`,
                    }}
                  >
                    {accent.pathTag}
                  </span>
                  {description && (
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-2">{description}</p>
                  )}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="forge-label">LEVEL</p>
                <p className="text-lg font-extrabold text-[var(--text-primary)] tabular-nums leading-none mt-1">
                  {stats.level}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1">{mastery}/100</p>
              </div>
            </div>

            <div className="space-y-2 mt-auto">
              <div className="flex justify-between">
                <span className="forge-label">PROGRESS</span>
                <span className="forge-label">{progress.percentage}%</span>
              </div>
              <div className="forge-progress-track">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress.percentage}%`,
                    background: `linear-gradient(90deg, ${accent.color}, ${accent.light})`,
                    boxShadow: progress.percentage > 0 ? accent.glow : 'none',
                  }}
                />
              </div>

              <div className="flex items-center justify-between pt-2 text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" style={{ color: accent.color }} />
                  {stats.streak}d streak
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-[var(--neon-amber)]" />
                  Rank {rank}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" style={{ color: accent.color }} />
                  {stats.xp.toLocaleString()} XP
                </span>
              </div>
            </div>

            <div
              className="flex items-center justify-between mt-1 pt-3 border-t"
              style={{ borderColor: 'rgba(59,73,76,0.2)' }}
            >
              <Link
                to={`/analytics/${journeyId}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-bold uppercase tracking-[1.2px] relative z-20"
                style={{ color: accent.color }}
              >
                Analytics
              </Link>
              <span
                className="text-xs flex items-center gap-1 group-hover:opacity-100 opacity-80 transition-colors"
                style={{ color: accent.color }}
              >
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
