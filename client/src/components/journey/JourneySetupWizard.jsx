import { useMemo, useState, useCallback } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import {

  ArrowLeft,

  ArrowRight,

  Brain,

  CalendarDays,

  Check,

  Sparkles,

  Target,

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

  SETUP_STEPS,

  applyJourneySetup,

  applyJourneyPatches,

  getJourneySetup,

  wouldIncurGoalPenalty,

  GOAL_CHANGE_XP_PENALTY,

} from '../../utils/journeySetup.js';

import { getDefaultPickerDate, getWeekdayLabels } from '../../utils/journeyPlanning.js';

import { addMonths, formatYmd, JOURNEY_DURATION_MONTHS, parseYmd } from '../../utils/dates.js';

import {

  GOAL_ACHIEVE_OPTIONS,

  GOAL_WHY_OPTIONS,

  SUCCESS_LOOKS_OPTIONS,

  MOTIVATION_OPTIONS,

  FITNESS_LEVEL_OPTIONS,

  CURRENT_ACTIVITY_OPTIONS,

  CHALLENGE_OPTIONS,

  TIME_AVAILABLE_OPTIONS,

  SELF_DESCRIPTION_OPTIONS,

  selectionsToText,

  textToSelections,

} from '../../data/journeySetupOptions.js';

import { WeeklyActivityTimeEditor } from './WeeklyActivityTimeEditor.jsx';

import { useGamification } from '../../hooks/useGamification.js';



const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];



function defaultAvailableDays(journeyId) {

  return journeyId === 'body-transformation' ? [0, 1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 0];

}



function initSelections(saved, field, options) {

  const { ids, other } = textToSelections(saved[field] || '', options);

  return { ids, other };

}



/**

 * Multi-step journey setup wizard — schedule, goals, current state, manual/smart mode.

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



  const [profile, setProfile] = useState(() => ({

    startYmd: saved.startYmd || getDefaultPickerDate(),

    availableDays: saved.availableDays?.length ? saved.availableDays : defaultAvailableDays(journeyId),

    preferredTimes: saved.preferredTimes || ['morning'],

    remindersEnabled: saved.remindersEnabled ?? true,

    goal: saved.goal || '',

    whyImportant: saved.whyImportant || '',

    successLooksLike: saved.successLooksLike || '',

    motivation: saved.motivation || '',

    selfDescription: saved.selfDescription || '',

    currentActivity: saved.currentActivity || '',

    challenges: saved.challenges || '',

    experienceLevel: saved.experienceLevel || '',

    habitsToChange: saved.habitsToChange || '',

    timeAvailable: saved.timeAvailable || '',

    mode: saved.mode || 'smart',

  }));



  const [goalAchieve, setGoalAchieve] = useState(() => initSelections(saved, 'goal', GOAL_ACHIEVE_OPTIONS));

  const [goalWhy, setGoalWhy] = useState(() => initSelections(saved, 'whyImportant', GOAL_WHY_OPTIONS));

  const [goalSuccess, setGoalSuccess] = useState(() => initSelections(saved, 'successLooksLike', SUCCESS_LOOKS_OPTIONS));

  const [goalMotivation, setGoalMotivation] = useState(() => initSelections(saved, 'motivation', MOTIVATION_OPTIONS));

  const [selfDesc, setSelfDesc] = useState(() => initSelections(saved, 'selfDescription', SELF_DESCRIPTION_OPTIONS));

  const [currentAct, setCurrentAct] = useState(() => initSelections(saved, 'currentActivity', CURRENT_ACTIVITY_OPTIONS));

  const [challengesSel, setChallengesSel] = useState(() => initSelections(saved, 'challenges', CHALLENGE_OPTIONS));

  const [timeSel, setTimeSel] = useState(() => initSelections(saved, 'timeAvailable', TIME_AVAILABLE_OPTIONS));

  const [fitnessLevel, setFitnessLevel] = useState(() => {

    const { ids } = textToSelections(saved.experienceLevel || '', FITNESS_LEVEL_OPTIONS);

    return ids[0] || '';

  });

  const [fitnessOther, setFitnessOther] = useState(() => {

    const { other } = textToSelections(saved.experienceLevel || '', FITNESS_LEVEL_OPTIONS);

    return other;

  });



  const rgb = accentRgb || '110,231,183';

  const accent = accentColor || '#6ee7b7';

  const weekdayLabels = getWeekdayLabels();

  const endYmd = formatYmd(addMonths(parseYmd(profile.startYmd), JOURNEY_DURATION_MONTHS));

  const totalDays =

    Math.round((parseYmd(endYmd) - parseYmd(profile.startYmd)) / (1000 * 60 * 60 * 24)) + 1;



  const patch = (p) => setProfile((prev) => ({ ...prev, ...p }));



  const buildProfileFromSelections = useCallback(() => {

    const fitnessLabel =

      fitnessLevel === 'other'

        ? fitnessOther

        : FITNESS_LEVEL_OPTIONS.find((o) => o.id === fitnessLevel)?.label || fitnessLevel;

    return {

      ...profile,

      goal: selectionsToText(goalAchieve.ids, GOAL_ACHIEVE_OPTIONS, goalAchieve.other),

      whyImportant: selectionsToText(goalWhy.ids, GOAL_WHY_OPTIONS, goalWhy.other),

      successLooksLike: selectionsToText(goalSuccess.ids, SUCCESS_LOOKS_OPTIONS, goalSuccess.other),

      motivation: selectionsToText(goalMotivation.ids, MOTIVATION_OPTIONS, goalMotivation.other),

      selfDescription: selectionsToText(selfDesc.ids, SELF_DESCRIPTION_OPTIONS, selfDesc.other),

      currentActivity: selectionsToText(currentAct.ids, CURRENT_ACTIVITY_OPTIONS, currentAct.other),

      challenges: selectionsToText(challengesSel.ids, CHALLENGE_OPTIONS, challengesSel.other),

      timeAvailable: selectionsToText(timeSel.ids, TIME_AVAILABLE_OPTIONS, timeSel.other),

      experienceLevel: fitnessLabel,

    };

  }, [profile, goalAchieve, goalWhy, goalSuccess, goalMotivation, selfDesc, currentAct, challengesSel, timeSel, fitnessLevel, fitnessOther]);



  const persistNow = useCallback(

    (extra = {}) => {

      const full = { ...buildProfileFromSelections(), ...extra };

      applyJourneyPatches(journeyId, full);

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



  const toggleDay = (d) => {

    const next = profile.availableDays.includes(d)

      ? profile.availableDays.filter((x) => x !== d)

      : [...profile.availableDays, d].sort((a, b) => a - b);

    patch({ availableDays: next.length ? next : [d] });

  };



  const handleContinue = () => {

    const persist = () => {

      persistNow();

      setStep((s) => s + 1);

    };

    if (step === 1) runWithGoalCheck(persist);

    else {

      persistNow();

      setStep((s) => s + 1);

    }

  };



  const finish = (goToReview) => {

    const doFinish = () => {

      const full = buildProfileFromSelections();

      applyJourneySetup(journeyId, full, { autoStart: false });

      onComplete?.();

      onClose?.();

      if (goToReview) onRequestReview?.();

    };

    runWithGoalCheck(doFinish);

  };



  if (!open) return null;



  const stepMeta = SETUP_STEPS[step];



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

          style={{

            background: 'var(--bg-card)',

            borderColor: `rgba(${rgb},0.25)`,

          }}

        >

          <div

            className="px-5 py-4 border-b flex items-center justify-between shrink-0"

            style={{ borderColor: 'var(--border-subtle)' }}

          >

            <div>

              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accent }}>

                Step {step + 1} of {SETUP_STEPS.length}

              </p>

              <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">{stepMeta.title}</h2>

              <p className="text-xs text-[var(--text-secondary)]">{stepMeta.subtitle}</p>

            </div>

            <button

              type="button"

              onClick={onClose}

              className="p-2 rounded-full hover:bg-[var(--surface-hover)] text-[var(--text-secondary)]"

            >

              <X className="size-5" />

            </button>

          </div>



          <div className="flex gap-1 px-5 pt-3">

            {SETUP_STEPS.map((s, i) => (

              <div

                key={s.id}

                className={cn('h-1 flex-1 rounded-full transition-colors', i <= step ? '' : 'opacity-30')}

                style={{ background: i <= step ? accent : 'var(--border-subtle)' }}

              />

            ))}

          </div>



          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

            <AnimatePresence mode="wait">

              <motion.div

                key={step}

                initial={{ opacity: 0, x: 12 }}

                animate={{ opacity: 1, x: 0 }}

                exit={{ opacity: 0, x: -12 }}

                transition={{ duration: 0.2 }}

                className="space-y-4"

              >

                {step === 0 && (

                  <>

                    <JourneyDateRangePicker

                      startYmd={profile.startYmd}

                      onStartChange={(v) => patch({ startYmd: v })}

                      endYmd={endYmd}

                      totalDays={totalDays}

                      accentColor={accent}

                      accentRgb={rgb}

                    />

                    <div>

                      <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">

                        Days you&apos;ll participate

                      </p>

                      <div className="flex flex-wrap gap-2">

                        {WEEKDAYS.map((d) => (

                          <button

                            key={d}

                            type="button"

                            onClick={() => toggleDay(d)}

                            className={cn(

                              'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',

                              profile.availableDays.includes(d)

                                ? 'text-white border-transparent'

                                : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'

                            )}

                            style={profile.availableDays.includes(d) ? { background: accent } : undefined}

                          >

                            {weekdayLabels[d]}

                          </button>

                        ))}

                      </div>

                    </div>



                    {profile.availableDays.length > 0 && (
                      <WeeklyActivityTimeEditor
                        journeyId={journeyId}
                        availableDays={profile.availableDays}
                        accentColor={accent}
                      />
                    )}



                    <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">

                      <input

                        type="checkbox"

                        checked={profile.remindersEnabled}

                        onChange={(e) => patch({ remindersEnabled: e.target.checked })}

                        className="rounded"

                      />

                      Send gentle reminders before each activity

                    </label>

                  </>

                )}



                {step === 1 && (

                  <>

                    <SetupOptionPicker

                      label="What do you want to achieve?"

                      options={GOAL_ACHIEVE_OPTIONS}

                      selectedIds={goalAchieve.ids}

                      onChange={(ids) => setGoalAchieve((p) => ({ ...p, ids }))}

                      otherText={goalAchieve.other}

                      onOtherChange={(v) => setGoalAchieve((p) => ({ ...p, other: v }))}

                      accentColor={accent}

                      accentRgb={rgb}

                    />

                    <SetupOptionPicker

                      label="Why is this important to you?"

                      options={GOAL_WHY_OPTIONS}

                      selectedIds={goalWhy.ids}

                      onChange={(ids) => setGoalWhy((p) => ({ ...p, ids }))}

                      otherText={goalWhy.other}

                      onOtherChange={(v) => setGoalWhy((p) => ({ ...p, other: v }))}

                      accentColor={accent}

                      accentRgb={rgb}

                    />

                    <SetupOptionPicker

                      label="How will success look?"

                      options={SUCCESS_LOOKS_OPTIONS}

                      selectedIds={goalSuccess.ids}

                      onChange={(ids) => setGoalSuccess((p) => ({ ...p, ids }))}

                      otherText={goalSuccess.other}

                      onOtherChange={(v) => setGoalSuccess((p) => ({ ...p, other: v }))}

                      accentColor={accent}

                      accentRgb={rgb}

                    />

                    <SetupOptionPicker

                      label="What motivates you?"

                      options={MOTIVATION_OPTIONS}

                      selectedIds={goalMotivation.ids}

                      onChange={(ids) => setGoalMotivation((p) => ({ ...p, ids }))}

                      otherText={goalMotivation.other}

                      onOtherChange={(v) => setGoalMotivation((p) => ({ ...p, other: v }))}

                      accentColor={accent}

                      accentRgb={rgb}

                    />

                  </>

                )}



                {step === 2 && (

                  <>

                    <SetupOptionPicker

                      label="Describe yourself (optional)"

                      options={SELF_DESCRIPTION_OPTIONS}

                      selectedIds={selfDesc.ids}

                      onChange={(ids) => setSelfDesc((p) => ({ ...p, ids }))}

                      otherText={selfDesc.other}

                      onOtherChange={(v) => setSelfDesc((p) => ({ ...p, other: v }))}

                      accentColor={accent}

                      accentRgb={rgb}

                    />

                    <SetupOptionPicker

                      label="What is your current fitness level?"

                      options={FITNESS_LEVEL_OPTIONS}

                      selectedIds={fitnessLevel ? [fitnessLevel] : []}

                      onChange={(ids) => setFitnessLevel(ids[0] || '')}

                      otherText={fitnessOther}

                      onOtherChange={setFitnessOther}

                      multiple={false}

                      accentColor={accent}

                      accentRgb={rgb}

                    />

                    <SetupOptionPicker

                      label="What do you currently do?"

                      options={CURRENT_ACTIVITY_OPTIONS}

                      selectedIds={currentAct.ids}

                      onChange={(ids) => setCurrentAct((p) => ({ ...p, ids }))}

                      otherText={currentAct.other}

                      onOtherChange={(v) => setCurrentAct((p) => ({ ...p, other: v }))}

                      accentColor={accent}

                      accentRgb={rgb}

                    />

                    <SetupOptionPicker

                      label="Challenges you're facing"

                      options={CHALLENGE_OPTIONS}

                      selectedIds={challengesSel.ids}

                      onChange={(ids) => setChallengesSel((p) => ({ ...p, ids }))}

                      otherText={challengesSel.other}

                      onOtherChange={(v) => setChallengesSel((p) => ({ ...p, other: v }))}

                      accentColor={accent}

                      accentRgb={rgb}

                    />

                    <SetupOptionPicker

                      label="Time you can dedicate daily"

                      options={TIME_AVAILABLE_OPTIONS}

                      selectedIds={timeSel.ids}

                      onChange={(ids) => setTimeSel((p) => ({ ...p, ids }))}

                      otherText={timeSel.other}

                      onOtherChange={(v) => setTimeSel((p) => ({ ...p, other: v }))}

                      accentColor={accent}

                      accentRgb={rgb}

                    />

                  </>

                )}



                {step === 3 && (

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    <ModeCard

                      icon={Target}

                      title="Manual mode"

                      description="Build exercises, tasks, milestones, and notes yourself."

                      selected={profile.mode === 'manual'}

                      onClick={() => patch({ mode: 'manual' })}

                      accent={accent}

                      rgb={rgb}

                    />

                    <ModeCard

                      icon={Wand2}

                      title="Smart mode"

                      description="AI generates a tailored plan from your answers. Always editable."

                      selected={profile.mode === 'smart'}

                      onClick={() => patch({ mode: 'smart' })}

                      accent={accent}

                      rgb={rgb}

                    />

                    {profile.mode === 'smart' && (

                      <p className="sm:col-span-2 text-xs text-[var(--text-secondary)] flex items-start gap-2 p-3 rounded-xl bg-[var(--bg-badge)]">

                        <Brain className="size-4 shrink-0 mt-0.5" style={{ color: accent }} />

                        Smart generation uses your goals and schedule to draft weekly plans. You can switch to manual anytime.

                      </p>

                    )}

                  </div>

                )}

              </motion.div>

            </AnimatePresence>

          </div>



          <div className="px-5 py-4 border-t flex flex-wrap gap-2 shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>

            {step > 0 && (

              <Button variant="ghost" className="rounded-full" onClick={() => setStep((s) => s - 1)}>

                <ArrowLeft className="size-4 mr-1" /> Back

              </Button>

            )}

            <div className="flex-1" />

            {step < SETUP_STEPS.length - 1 ? (

              <Button className="rounded-full" style={{ background: accent }} onClick={handleContinue}>

                Continue <ArrowRight className="size-4 ml-1" />

              </Button>

            ) : (

              <>

                <Button variant="outline" className="rounded-full" onClick={() => finish(false)}>

                  <CalendarDays className="size-4 mr-1" /> Save plan

                </Button>

                <Button className="rounded-full" style={{ background: accent }} onClick={() => finish(true)}>

                  <Sparkles className="size-4 mr-1" /> Review &amp; start

                </Button>

              </>

            )}

          </div>

        </motion.div>

      </ModalPortal>

    </>

  );

}



function ModeCard({ icon: Icon, title, description, selected, onClick, accent, rgb }) {

  return (

    <button

      type="button"

      onClick={onClick}

      className={cn(

        'text-left p-4 rounded-xl border transition-all',

        selected ? 'ring-2' : 'hover:border-[var(--border-muted)]'

      )}

      style={{

        borderColor: selected ? `rgba(${rgb},0.4)` : 'var(--border-subtle)',

        background: selected ? `rgba(${rgb},0.08)` : 'var(--bg-primary)',

        ringColor: accent,

      }}

    >

      <div className="flex items-center justify-between mb-2">

        <Icon className="size-5" style={{ color: accent }} />

        {selected && <Check className="size-4" style={{ color: accent }} />}

      </div>

      <p className="font-semibold text-sm text-[var(--text-primary)]">{title}</p>

      <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{description}</p>

    </button>

  );

}

