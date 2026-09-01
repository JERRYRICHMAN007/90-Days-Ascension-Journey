import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Wand2,
  X,
} from 'lucide-react';
import { Button } from '../ui/button';
import { ModalPortal } from '../ui/ModalPortal';
import { SetupOptionPicker } from './SetupOptionPicker.jsx';
import { GoalChangeConfirmDialog } from './GoalChangeConfirmDialog.jsx';
import { cn } from '../../lib/utils';
import { JourneyDateRangePicker } from './JourneyDatePicker.jsx';
import {
  getSetupSteps,
  applyJourneySetup,
  applyJourneyPatches,
  getJourneySetup,
  wouldIncurGoalPenalty,
  GOAL_CHANGE_XP_PENALTY,
} from '../../utils/journeySetup.js';
import { getContentTemplateId } from '../../utils/journeyRegistry.js';
import { getDefaultPickerDate } from '../../utils/journeyPlanning.js';
import { addMonths, formatYmd, JOURNEY_DURATION_MONTHS, parseYmd } from '../../utils/dates.js';
import {
  GOAL_ACHIEVE_OPTIONS,
  GOAL_WHY_OPTIONS,
  SUCCESS_LOOKS_OPTIONS,
  MOTIVATION_OPTIONS,
  selectionsToText,
  textToSelections,
} from '../../data/journeySetupOptions.js';
import { useGamification } from '../../hooks/useGamification.js';
import {
  getCustomPlan,
  getDefaultCustomPlanDraft,
  getDefaultPlanBlurb,
  getDefaultPlanPreviewItems,
} from '../../utils/journeyCustomPlan.js';
import { CustomContentEditor, DefaultPlanPreview, WeeklyPlanEditor } from './CustomPlanEditors.jsx';
import { JourneyRhythmEditor } from './JourneyRhythmEditor.jsx';
import { getWeeklyPlan } from '../../utils/journeyWeeklyPlan.js';

function defaultAvailableDays() {
  return [0, 1, 2, 3, 4, 5, 6];
}

function initSelections(saved, field, options) {
  const { ids, other } = textToSelections(saved[field] || '', options);
  return { ids, other };
}

/**
 * Default vs Custom journey setup wizard.
 */
export function JourneySetupWizard({
  journeyId,
  open,
  onClose,
  onComplete,
  onRequestReview,
  accentColor,
  accentRgb,
}) {
  const saved = useMemo(() => getJourneySetup(journeyId), [journeyId, open]);
  const { addXP } = useGamification();
  const [step, setStep] = useState(0);
  const [goalConfirmOpen, setGoalConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const [planSource, setPlanSource] = useState(saved.planSource || '');
  const [customPlan, setCustomPlan] = useState(() => {
    const stored = getCustomPlan(journeyId);
    if (stored?.readingQueue || stored?.workoutPlan || stored?.weeklyPlan) return stored;
    return getDefaultCustomPlanDraft(journeyId);
  });

  const [profile, setProfile] = useState(() => ({
    startYmd: saved.startYmd || getDefaultPickerDate(),
    availableDays: saved.availableDays?.length ? saved.availableDays : defaultAvailableDays(),
    preferredTimes: saved.preferredTimes || ['morning'],
    remindersEnabled: saved.remindersEnabled ?? true,
    goal: saved.goal || '',
    whyImportant: saved.whyImportant || '',
    successLooksLike: saved.successLooksLike || '',
    motivation: saved.motivation || '',
    mode: saved.mode || 'manual',
    planSource: saved.planSource || '',
  }));

  const [goalAchieve, setGoalAchieve] = useState(() => initSelections(saved, 'goal', GOAL_ACHIEVE_OPTIONS));
  const [goalWhy, setGoalWhy] = useState(() => initSelections(saved, 'whyImportant', GOAL_WHY_OPTIONS));
  const [goalSuccess, setGoalSuccess] = useState(() =>
    initSelections(saved, 'successLooksLike', SUCCESS_LOOKS_OPTIONS)
  );
  const [goalMotivation, setGoalMotivation] = useState(() =>
    initSelections(saved, 'motivation', MOTIVATION_OPTIONS)
  );

  useEffect(() => {
    if (!open) return;
    const next = getJourneySetup(journeyId);
    const stored = getCustomPlan(journeyId);
    setPlanSource(next.planSource || '');
    setProfile({
      startYmd: next.startYmd || getDefaultPickerDate(),
      availableDays: next.availableDays?.length ? next.availableDays : defaultAvailableDays(),
      preferredTimes: next.preferredTimes || ['morning'],
      remindersEnabled: next.remindersEnabled ?? true,
      goal: next.goal || '',
      whyImportant: next.whyImportant || '',
      successLooksLike: next.successLooksLike || '',
      motivation: next.motivation || '',
      mode: next.mode || 'manual',
      planSource: next.planSource || '',
    });
    setCustomPlan(
      stored?.readingQueue || stored?.workoutPlan || stored?.weeklyPlan
        ? stored
        : getDefaultCustomPlanDraft(journeyId)
    );
    setGoalAchieve(initSelections(next, 'goal', GOAL_ACHIEVE_OPTIONS));
    setGoalWhy(initSelections(next, 'whyImportant', GOAL_WHY_OPTIONS));
    setGoalSuccess(initSelections(next, 'successLooksLike', SUCCESS_LOOKS_OPTIONS));
    setGoalMotivation(initSelections(next, 'motivation', MOTIVATION_OPTIONS));
    setStep(0);
  }, [open, journeyId]);

  const rgb = accentRgb || '110,231,183';
  const accent = accentColor || '#6ee7b7';
  const endYmd = formatYmd(addMonths(parseYmd(profile.startYmd), JOURNEY_DURATION_MONTHS));
  const isCustom = planSource === 'custom';
  const templateId = getContentTemplateId(journeyId);
  const steps = getSetupSteps(templateId, planSource);
  const stepMeta = steps[Math.min(step, steps.length - 1)] || steps[0];

  const patch = (p) => setProfile((prev) => ({ ...prev, ...p }));

  const buildProfileFromSelections = useCallback(() => {
    return {
      ...profile,
      planSource: planSource || 'default',
      goal: selectionsToText(goalAchieve.ids, GOAL_ACHIEVE_OPTIONS, goalAchieve.other),
      whyImportant: selectionsToText(goalWhy.ids, GOAL_WHY_OPTIONS, goalWhy.other),
      successLooksLike: selectionsToText(goalSuccess.ids, SUCCESS_LOOKS_OPTIONS, goalSuccess.other),
      motivation: selectionsToText(goalMotivation.ids, MOTIVATION_OPTIONS, goalMotivation.other),
      customPlan,
    };
  }, [profile, planSource, goalAchieve, goalWhy, goalSuccess, goalMotivation, customPlan]);

  const persistNow = useCallback(
    (extra = {}) => {
      const full = { ...buildProfileFromSelections(), ...extra };
      applyJourneyPatches(journeyId, {
        startYmd: full.startYmd,
        availableDays: full.availableDays,
        remindersEnabled: full.remindersEnabled,
        planSource: full.planSource,
        goal: full.goal,
        whyImportant: full.whyImportant,
        successLooksLike: full.successLooksLike,
        motivation: full.motivation,
      });
      setProfile(full);
      return full;
    },
    [buildProfileFromSelections, journeyId]
  );

  const runWithGoalCheck = (action) => {
    const full = buildProfileFromSelections();
    const goalPatch = {
      goal: full.goal,
      whyImportant: full.whyImportant,
      successLooksLike: full.successLooksLike,
      motivation: full.motivation,
    };
    if (wouldIncurGoalPenalty(journeyId, goalPatch)) {
      setPendingAction(() => action);
      setGoalConfirmOpen(true);
      return;
    }
    action();
  };

  const confirmGoalChange = () => {
    if (addXP) addXP(-GOAL_CHANGE_XP_PENALTY, journeyId);
    setGoalConfirmOpen(false);
    pendingAction?.();
    setPendingAction(null);
  };

  const chooseSource = (source) => {
    setPlanSource(source);
    patch({ planSource: source });
    if (source === 'custom' && !customPlan?.weeklyPlan) {
      setCustomPlan(getDefaultCustomPlanDraft(journeyId));
    }
    setStep(1);
  };

  const handleContinue = () => {
    persistNow();
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const finish = (goToReview) => {
    const doFinish = () => {
      const full = buildProfileFromSelections();
      applyJourneySetup(journeyId, full, { autoStart: false });
      onComplete?.();
      onClose?.();
      if (goToReview) onRequestReview?.();
    };
    if (isCustom) runWithGoalCheck(doFinish);
    else doFinish();
  };

  const customContentValid =
    !isCustom ||
    !customPlan.readingQueue ||
    customPlan.readingQueue.length >= 6;

  if (!open) return null;

  return (
    <>
      <GoalChangeConfirmDialog
        open={goalConfirmOpen}
        onConfirm={confirmGoalChange}
        onCancel={() => {
          setGoalConfirmOpen(false);
          setPendingAction(null);
        }}
        accentColor={accent}
      />
      <ModalPortal open={open} onClose={onClose} ariaLabel={`Journey setup — ${stepMeta.title}`}>
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-h-[min(85vh,calc(100dvh-2rem))] overflow-hidden rounded-2xl border flex flex-col shadow-2xl"
          style={{ background: 'var(--bg-card)', borderColor: `rgba(${rgb},0.25)` }}
        >
          <div
            className="px-5 py-4 border-b flex items-center justify-between shrink-0"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accent }}>
                {planSource === 'custom' ? 'Custom plan' : planSource === 'default' ? 'Default plan' : 'Journey setup'}
              </p>
              <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">{stepMeta.title}</h2>
              <p className="text-xs text-[var(--text-secondary)]">{stepMeta.subtitle}</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-[var(--surface-hover)]">
              <X className="size-5 text-[var(--text-secondary)]" />
            </button>
          </div>

          <div className="px-5 pt-3 flex gap-1.5">
            {steps.map((s, i) => (
              <div
                key={s.id}
                className="h-1 flex-1 rounded-full"
                style={{ background: i <= step ? accent : 'var(--border-subtle)' }}
              />
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {stepMeta.id === 'planStyle' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => chooseSource('default')}
                  className={cn(
                    'rounded-2xl border p-4 text-left transition-colors',
                    planSource === 'default'
                      ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/8'
                      : 'border-[var(--border-subtle)] hover:border-[var(--border-muted)]'
                  )}
                >
                  <Sparkles className="size-5 mb-2" style={{ color: accent }} />
                  <p className="font-bold text-[var(--text-primary)]">Use default plan</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    Start with the Aether 6-month plan for this journey.
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-2">{getDefaultPlanBlurb(journeyId)}</p>
                </button>
                <button
                  type="button"
                  onClick={() => chooseSource('custom')}
                  className={cn(
                    'rounded-2xl border p-4 text-left transition-colors',
                    planSource === 'custom'
                      ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/8'
                      : 'border-[var(--border-subtle)] hover:border-[var(--border-muted)]'
                  )}
                >
                  <Wand2 className="size-5 mb-2" style={{ color: accent }} />
                  <p className="font-bold text-[var(--text-primary)]">Build custom plan</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                    Choose your own books, workouts, days, and times. Prefills from default so you can edit.
                  </p>
                </button>
              </div>
            )}

            {stepMeta.id === 'schedule' && (
              <>
                <JourneyDateRangePicker
                  startYmd={profile.startYmd}
                  onChange={(ymd) => patch({ startYmd: ymd })}
                />
                <p className="text-xs text-[var(--text-muted)]">
                  Ends {endYmd} · {JOURNEY_DURATION_MONTHS} months
                </p>
                <JourneyRhythmEditor
                  journeyId={journeyId}
                  availableDays={profile.availableDays}
                  onDaysChange={(days) => patch({ availableDays: days })}
                  accentColor={accent}
                  accentRgb={rgb}
                  compact
                />
                <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <input
                    type="checkbox"
                    checked={profile.remindersEnabled !== false}
                    onChange={(e) => patch({ remindersEnabled: e.target.checked })}
                  />
                  Gentle reminders on active days
                </label>
              </>
            )}

            {stepMeta.id === 'preview' && (
              <DefaultPlanPreview
                items={getDefaultPlanPreviewItems(journeyId)}
                blurb={getDefaultPlanBlurb(journeyId)}
                accentColor={accent}
              />
            )}

            {stepMeta.id === 'content' && (
              <CustomContentEditor
                journeyId={journeyId}
                draft={customPlan}
                onChange={setCustomPlan}
                accentColor={accent}
              />
            )}

            {stepMeta.id === 'weekly' && (
              <WeeklyPlanEditor
                journeyId={journeyId}
                weeklyPlan={customPlan.weeklyPlan || getWeeklyPlan(journeyId)}
                availableDays={profile.availableDays}
                onChange={(weeklyPlan) => setCustomPlan((prev) => ({ ...prev, weeklyPlan }))}
              />
            )}

            {stepMeta.id === 'goals' && (
              <div className="space-y-4">
                <SetupOptionPicker
                  title="What do you want to achieve?"
                  options={GOAL_ACHIEVE_OPTIONS}
                  selectedIds={goalAchieve.ids}
                  otherValue={goalAchieve.other}
                  onChange={(ids, other) => setGoalAchieve({ ids, other })}
                />
                <SetupOptionPicker
                  title="Why does this matter?"
                  options={GOAL_WHY_OPTIONS}
                  selectedIds={goalWhy.ids}
                  otherValue={goalWhy.other}
                  onChange={(ids, other) => setGoalWhy({ ids, other })}
                />
                <SetupOptionPicker
                  title="Success looks like"
                  options={SUCCESS_LOOKS_OPTIONS}
                  selectedIds={goalSuccess.ids}
                  otherValue={goalSuccess.other}
                  onChange={(ids, other) => setGoalSuccess({ ids, other })}
                />
                <SetupOptionPicker
                  title="What keeps you going?"
                  options={MOTIVATION_OPTIONS}
                  selectedIds={goalMotivation.ids}
                  otherValue={goalMotivation.other}
                  onChange={(ids, other) => setGoalMotivation({ ids, other })}
                />
              </div>
            )}
          </div>

          <div
            className="px-5 py-3 border-t flex items-center gap-2 shrink-0"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            {step > 0 && (
              <Button variant="ghost" className="rounded-full" onClick={() => setStep((s) => s - 1)}>
                <ArrowLeft className="size-4 mr-1" /> Back
              </Button>
            )}
            <div className="flex-1" />
            {stepMeta.id === 'planStyle' && !planSource ? (
              <p className="text-xs text-[var(--text-muted)]">Choose a plan style to continue</p>
            ) : step < steps.length - 1 ? (
              <Button
                className="rounded-full font-bold"
                style={{ background: accent, color: '#0a0a0a' }}
                disabled={stepMeta.id === 'content' && !customContentValid}
                onClick={handleContinue}
              >
                Continue <ArrowRight className="size-4 ml-1" />
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-full" onClick={() => finish(false)}>
                  Save plan
                </Button>
                <Button
                  className="rounded-full font-bold"
                  style={{ background: accent, color: '#0a0a0a' }}
                  onClick={() => finish(true)}
                >
                  <Check className="size-4 mr-1" /> Review &amp; start
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </ModalPortal>
    </>
  );
}
