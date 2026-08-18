import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Check,
  Clock,
  Edit3,
  Flag,
  Sparkles,
  Target,
  X,
  Bell,
  Trophy,
} from 'lucide-react';
import { Button } from '../ui/button';
import { ModalPortal } from '../ui/ModalPortal';
import { cn } from '../../lib/utils';
import {
  getJourneySetup,
  formatAvailableDays,
  parseGoalsFromSetup,
} from '../../utils/journeySetup.js';
import {
  getJourneyTimeline,
  getJourneyAvailability,
  startJourney,
  setJourneyPlannedStartDate,
  resolveLiveStartYmd,
} from '../../utils/journeyPlanning.js';
import { getRegistryEntry } from '../../utils/journeyRegistry.js';
import { useJourneyTimeline } from '../../hooks/useJourneyTimeline';
import { JourneyAIAssistant } from './JourneyAIAssistant.jsx';
import { getDefaultPlanBlurb, getPlanDigest } from '../../utils/journeyCustomPlan.js';

/**
 * Final review & confirmation before a journey officially starts.
 */
export function JourneyReviewModal({
  journeyId,
  open,
  startYmd,
  onClose,
  onConfirm,
  onEdit,
  accentColor = '#6ee7b7',
  accentRgb = '110,231,183',
  totalDays = 184,
}) {
  const [confirming, setConfirming] = useState(false);
  const [profileTick, setProfileTick] = useState(0);
  const profile = useMemo(() => getJourneySetup(journeyId), [journeyId, open, profileTick]);
  const timeline = useMemo(() => getJourneyTimeline(journeyId), [journeyId, open, startYmd]);
  const avail = getJourneyAvailability(journeyId);
  const entry = getRegistryEntry(journeyId);
  const { milestone } = useJourneyTimeline(journeyId, 0, totalDays);
  const goals = parseGoalsFromSetup(profile);
  const planSource = profile.planSource === 'custom' ? 'custom' : 'default';
  const planDigest = getPlanDigest(journeyId, planSource);

  const effectiveStart = startYmd || timeline.startYmd || profile.startYmd;
  const effectiveEnd = timeline.endLabel;
  const duration = timeline.totalDays || totalDays;
  const activeDays = profile.availableDays?.length
    ? profile.availableDays
    : avail.availableDays;

  const handleConfirm = () => {
    setConfirming(true);
    const liveStart = resolveLiveStartYmd(effectiveStart);
    if (liveStart) setJourneyPlannedStartDate(journeyId, liveStart);
    startJourney(journeyId, liveStart);
    setConfirming(false);
    onConfirm?.();
    onClose?.();
  };

  if (!open) return null;

  return (
    <ModalPortal open={open} onClose={onClose} contentClassName="sm:max-w-2xl" ariaLabel="Journey review">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-h-[min(85vh,calc(100dvh-2rem))] overflow-hidden rounded-2xl border flex flex-col shadow-2xl"
        style={{ background: 'var(--bg-card)', borderColor: `rgba(${accentRgb},0.25)` }}
      >
        <div className="px-5 py-4 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>
              Final review
            </p>
            <h2 className="font-display text-xl font-bold text-[var(--text-primary)]">Ready to begin?</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">Review everything before your journey goes live.</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-[var(--surface-hover)]">
            <X className="size-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          <ReviewSection title="Plan" icon={Sparkles} accent={accentColor} onEdit={() => onEdit?.('setup')}>
            <p className="text-sm font-semibold text-[var(--text-primary)] capitalize">
              {planSource} plan
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
              {planSource === 'default' ? getDefaultPlanBlurb(journeyId) : 'Your customized 6-month plan.'}
            </p>
            <ul className="mt-2 space-y-1">
              {planDigest.slice(0, 8).map((line) => (
                <li key={line} className="text-xs text-[var(--text-primary)]">
                  • {line}
                </li>
              ))}
            </ul>
          </ReviewSection>

          <ReviewSection title="Journey" icon={Flag} accent={accentColor} onEdit={() => onEdit?.('overview')}>
            <p className="font-semibold text-[var(--text-primary)]">{entry?.title || 'Your journey'}</p>
            {profile.whyImportant && (
              <p className="text-sm text-[var(--text-secondary)] mt-1">{profile.whyImportant}</p>
            )}
          </ReviewSection>

          <ReviewSection title="Goals" icon={Target} accent={accentColor} onEdit={() => onEdit?.('goals')}>
            {goals.length ? (
              <ul className="space-y-1.5">
                {goals.map((g) => (
                  <li key={g} className="flex items-start gap-2 text-sm text-[var(--text-primary)]">
                    <Check className="size-4 shrink-0 mt-0.5" style={{ color: accentColor }} />
                    {g}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[var(--text-muted)]">No goals set yet — add them in setup.</p>
            )}
          </ReviewSection>

          <div className="grid grid-cols-2 gap-3">
            <ReviewSection title="Duration" icon={Clock} accent={accentColor} compact>
              <p className="text-sm font-medium">{duration} days</p>
            </ReviewSection>
            <ReviewSection title="Style" icon={Sparkles} accent={accentColor} compact>
              <p className="text-sm font-medium capitalize">{planSource} plan</p>
            </ReviewSection>
          </div>

          <ReviewSection title="Schedule" icon={CalendarDays} accent={accentColor} onEdit={() => onEdit?.('schedule')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-[var(--text-muted)]">Starts</span>
                <p className="font-medium text-[var(--text-primary)]">{timeline.startLabel || effectiveStart}</p>
              </div>
              <div>
                <span className="text-[var(--text-muted)]">Ends</span>
                <p className="font-medium text-[var(--text-primary)]">{effectiveEnd || '—'}</p>
              </div>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-2">
              Active days: {formatAvailableDays(activeDays)}
            </p>
            {profile.preferredTimes?.length > 0 && (
              <p className="text-xs text-[var(--text-secondary)]">
                Preferred time: {profile.preferredTimes.join(', ')}
              </p>
            )}
          </ReviewSection>

          <ReviewSection title="Reminders" icon={Bell} accent={accentColor} onEdit={() => onEdit?.('schedule')}>
            <p className="text-sm text-[var(--text-primary)]">
              {profile.remindersEnabled !== false ? 'Gentle reminders on active days' : 'Reminders off'}
            </p>
          </ReviewSection>

          <ReviewSection title="Next milestone" icon={Trophy} accent={accentColor}>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {milestone?.icon} {milestone?.label || 'First week complete'}
            </p>
          </ReviewSection>

          <JourneyAIAssistant
            journeyId={journeyId}
            profile={profile}
            accentColor={accentColor}
            onApplied={() => setProfileTick((t) => t + 1)}
          />
        </div>

        <div className="px-5 py-4 border-t flex flex-wrap gap-2 shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
          <Button variant="ghost" className="rounded-full" onClick={onClose}>
            Not yet
          </Button>
          <div className="flex-1" />
          <Button variant="outline" className="rounded-full" onClick={() => onEdit?.('setup')}>
            <Edit3 className="size-4 mr-1" /> Edit plan
          </Button>
          <Button
            className="rounded-full font-bold"
            style={{ background: accentColor, color: '#0a0a0a' }}
            disabled={confirming || !effectiveStart}
            onClick={handleConfirm}
          >
            <Check className="size-4 mr-1" /> Confirm &amp; start
          </Button>
        </div>
      </motion.div>
    </ModalPortal>
  );
}

function ReviewSection({ title, icon: Icon, accent, children, onEdit, compact }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]',
        compact ? 'p-3' : 'p-4'
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Icon className="size-4" style={{ color: accent }} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">{title}</h3>
        </div>
        {onEdit && (
          <button type="button" onClick={onEdit} className="text-[10px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Edit
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
