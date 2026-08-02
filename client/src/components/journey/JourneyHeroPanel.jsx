import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Clock,
  Calendar,
  Flag,
  CheckCircle2,
  Target,
} from 'lucide-react';
import { Button } from '../ui/button';
import { JourneySetupPanel } from './JourneySetupPanel';
import { useJourneyTimeline } from '../../hooks/useJourneyTimeline';
import { cn } from '../../lib/utils';

/**
 * Premium journey header: greeting, timeline, progress, next milestone.
 */
export function JourneyHeroPanel({
  journey,
  journeyId,
  user,
  greeting,
  todayFocus,
  completedDays,
  progressPercentage,
  selectedWeek,
  weeksCount,
  colors,
  accentColor,
  accentRgb,
  iconEmoji,
  IconComponent,
  onBack,
  onTimelineRefresh,
}) {
  const totalDays = journey?.totalDays ?? 184;
  const { timeline, milestone, refresh } = useJourneyTimeline(
    journeyId,
    completedDays,
    totalDays
  );

  const rgb = accentRgb || '110,231,183';
  const accent = accentColor || '#6ee7b7';

  const handleSaved = () => {
    refresh();
    onTimelineRefresh?.();
  };

  return (
    <div
      className="shrink-0 border-b border-white/10"
      style={{
        background: `linear-gradient(180deg, rgba(${rgb},0.06) 0%, var(--bg-primary) 55%)`,
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
        {/* Greeting row */}
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0 size-10 touch-manipulation hover:bg-white/10"
            aria-label="Back to dashboard"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p
              className="aether-eyebrow text-[10px] font-bold uppercase tracking-widest mb-1"
              style={{ color: accent }}
            >
              Your journey
            </p>
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-primary)] leading-tight">
              {greeting}, {user?.name?.split(' ')[0] || 'there'} 👋
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{todayFocus}</p>
          </div>
        </div>

        {/* Journey identity card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: `linear-gradient(145deg, rgba(${rgb},0.12) 0%, var(--bg-card) 50%, rgba(196,181,253,0.08) 100%)`,
            boxShadow: `0 0 0 1px rgba(${rgb},0.3), 0 16px 48px rgba(0,0,0,0.4), 0 0 60px rgba(${rgb},0.08)`,
          }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
            aria-hidden
          />

          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div
              className={cn(
                'flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg',
                colors?.gradient || 'from-primary to-primary/80'
              )}
              style={{ boxShadow: `0 8px 24px rgba(${rgb},0.35)` }}
            >
              {IconComponent ? (
                <IconComponent className="size-7 text-white" />
              ) : (
                <span className="text-2xl">{iconEmoji}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="font-display text-lg sm:text-xl font-semibold text-[var(--text-primary)]">
                  {journey.title}
                </h2>
                {progressPercentage === 100 ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_12px_rgba(52,211,153,0.25)]">
                    <CheckCircle2 className="size-3.5" /> Mastery
                  </span>
                ) : !timeline.configured ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-white/20 text-[var(--text-muted)] bg-white/5">
                    Not started
                  </span>
                ) : (
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                    style={{
                      borderColor: `rgba(${rgb},0.5)`,
                      color: accent,
                      backgroundColor: `rgba(${rgb},0.15)`,
                      boxShadow: `0 0 12px rgba(${rgb},0.2)`,
                    }}
                  >
                    In progress
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{journey.description}</p>
            </div>
          </div>

          {/* Timeline + completion metrics — only after start date saved */}
          {timeline.configured && (
          <>
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-px border-t border-white/10"
            style={{ background: `rgba(${rgb},0.15)` }}
          >
            <MetricCell icon={Calendar} label="Start" value={timeline.startLabel} accent={accent} rgb={rgb} />
            <MetricCell icon={Flag} label="Mastery deadline" value={timeline.masteryDeadlineLabel} accent={accent} rgb={rgb} />
            <MetricCell
              icon={Clock}
              label="Days remaining"
              value={timeline.status === 'before' ? timeline.totalDays : timeline.daysRemaining}
              accent={accent}
              rgb={rgb}
            />
            <MetricCell icon={Target} label="Time elapsed" value={`${timeline.timeElapsedPercent}%`} accent={accent} rgb={rgb} />
          </div>

          {/* Dual progress bars */}
          <div className="p-4 sm:p-5 space-y-4 border-t border-white/10">
            <ProgressRow
              label="Task completion"
              value={progressPercentage}
              sub={`${completedDays} days completed · Week ${selectedWeek} of ${weeksCount}`}
              gradient={colors?.gradient}
              accentColor={accent}
              rgb={rgb}
            />
            <ProgressRow
              label="Journey timeline"
              value={timeline.timeElapsedPercent}
              sub={`${timeline.totalDays} total days in your ${timeline.monthsDuration}-month arc`}
              gradient="from-[var(--neon-cyan)] to-[var(--neon-purple)]"
              rgb={rgb}
            />
          </div>
          </>
          )}
        </motion.div>

        {timeline.configured && (
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, rgba(${rgb},0.12), rgba(196,181,253,0.08))`,
            border: `1px solid rgba(${rgb},0.25)`,
            boxShadow: `0 4px 20px rgba(${rgb},0.1)`,
          }}
        >
          <span className="text-2xl shrink-0" role="img" aria-hidden>
            {milestone.icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: accent }}>
              Next milestone
            </p>
            <p className="text-sm font-semibold text-[var(--text-primary)]">{milestone.label}</p>
            {milestone.daysUntil > 0 && (
              <div className="mt-2 h-2 rounded-full bg-black/30 overflow-hidden max-w-xs">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${accent}, var(--neon-purple))`,
                    boxShadow: `0 0 8px rgba(${rgb},0.5)`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${milestone.progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
        )}

        <JourneySetupPanel
          journeyId={journeyId}
          accentColor={accent}
          accentRgb={rgb}
          onSaved={handleSaved}
        />
      </div>
    </div>
  );
}

function MetricCell({ icon: Icon, label, value, accent, rgb }) {
  return (
    <div
      className="px-4 py-3"
      style={{ background: 'var(--bg-card)' }}
    >
      <div className="flex items-center gap-1.5 mb-1" style={{ color: accent }}>
        <Icon className="size-3.5" />
        <span className="text-[10px] uppercase tracking-wider font-bold">{label}</span>
      </div>
      <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{value}</p>
    </div>
  );
}

function ProgressRow({ label, value, sub, gradient, accentColor, rgb }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-[var(--text-secondary)]">{label}</span>
        <span className="font-bold tabular-nums text-[var(--text-primary)]">{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-black/30 overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full bg-gradient-to-r', gradient || 'from-primary to-purple-500')}
          style={
            accentColor && !gradient
              ? {
                  background: `linear-gradient(90deg, ${accentColor}, rgba(${rgb || '110,231,183'},0.7))`,
                  boxShadow: `0 0 10px rgba(${rgb || '110,231,183'},0.4)`,
                }
              : { boxShadow: '0 0 10px rgba(147,197,253,0.3)' }
          }
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, value)}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
      {sub && <p className="text-xs text-[var(--text-secondary)] mt-1">{sub}</p>}
    </div>
  );
}
