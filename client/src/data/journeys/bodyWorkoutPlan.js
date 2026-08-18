/**
 * Default Body Transformation weekly workout plan + progression scaling.
 * Baseline (Starter) matches the default Journey workout circuit.
 * Levels: starter → intermediate → professional
 */

export const WORKOUT_LEVELS = [
  { id: 'starter', label: 'Starter', order: 0 },
  { id: 'intermediate', label: 'Intermediate', order: 1 },
  { id: 'professional', label: 'Professional', order: 2 },
];

export const EXERCISE_FORM_GUIDES = {
  plankSideRight: {
    title: 'Side Plank (Right) — Form Guide',
    url: 'https://www.youtube.com/watch?v=wbL9205fAms',
    time: '3 min',
  },
  plankSideLeft: {
    title: 'Side Plank (Left) — Form Guide',
    url: 'https://www.youtube.com/watch?v=wbL9205fAms',
    time: '3 min',
  },
  plankCenter: {
    title: 'Front Plank — Form Guide',
    url: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
    time: '3 min',
  },
  pushUps: {
    title: 'Push-Ups — Form Guide',
    url: 'https://www.youtube.com/watch?v=rruHM_sB2Hc',
    time: '4 min',
  },
  crunches: {
    title: 'Crunches — Form Guide',
    url: 'https://www.youtube.com/watch?v=Xyd_fa5Tlk0',
    time: '3 min',
  },
  burpees: {
    title: 'Burpees — Form Guide',
    url: 'https://www.youtube.com/watch?v=dZgVxmx5RcA',
    time: '4 min',
  },
  lunges: {
    title: 'Lunges — Form Guide',
    url: 'https://www.youtube.com/watch?v=3XDriUnGQdI',
    time: '4 min',
  },
  bicycles: {
    title: 'Bicycle Crunches — Form Guide',
    url: 'https://www.youtube.com/watch?v=IUB14NlcWHc',
    time: '3 min',
  },
};

/** Muscles targeted per exercise (react-body-highlighter slugs) */
export const EXERCISE_MUSCLES = {
  plankSideRight: ['abs', 'obliques'],
  plankSideLeft: ['abs', 'obliques'],
  plankCenter: ['abs'],
  pushUps: ['chest', 'triceps', 'front-deltoids'],
  crunches: ['abs'],
  burpees: ['chest', 'quadriceps', 'abs', 'gluteal'],
  lunges: ['quadriceps', 'gluteal', 'hamstring'],
  bicycles: ['abs', 'obliques'],
};

/** Catalog for add-exercise UI */
export const EXERCISE_CATALOG = [
  { guideKey: 'plankSideRight', label: 'Plank — Right', defaultDurationSec: 30 },
  { guideKey: 'plankSideLeft', label: 'Plank — Left', defaultDurationSec: 30 },
  { guideKey: 'plankCenter', label: 'Plank — Center', defaultDurationSec: 30 },
  { guideKey: 'pushUps', label: 'Push-ups', defaultReps: 10 },
  { guideKey: 'crunches', label: 'Crunches', defaultReps: 30 },
  { guideKey: 'burpees', label: 'Burpees', defaultReps: 10 },
  { guideKey: 'lunges', label: 'Lunges', defaultReps: 10, eachSide: true },
  { guideKey: 'bicycles', label: 'Bicycles', defaultReps: 30 },
];

/**
 * Starter baseline weekly routines.
 * dayIndex: 0=Monday … 5=Saturday, 6=Sunday
 */
export const DEFAULT_WEEKLY_ROUTINES = {
  0: {
    focus: 'Plank & Core Circuit',
    name: 'Monday — Plank & Core Circuit',
    rounds: 3,
    isRest: false,
    link: 'https://www.youtube.com/watch?v=pSHjTR5xN4s',
    exercises: [
      { id: 'mon-plank-r', guideKey: 'plankSideRight', label: 'Plank — Right', durationSec: 30 },
      { id: 'mon-plank-l', guideKey: 'plankSideLeft', label: 'Plank — Left', durationSec: 30 },
      { id: 'mon-plank-c', guideKey: 'plankCenter', label: 'Plank — Center', durationSec: 30 },
      { id: 'mon-lunges', guideKey: 'lunges', label: 'Lunges', reps: 10, eachSide: true },
      { id: 'mon-burpees', guideKey: 'burpees', label: 'Burpees', reps: 10 },
    ],
  },
  1: {
    focus: 'Push & Core',
    name: 'Tuesday — Push & Core',
    rounds: 2,
    isRest: false,
    link: 'https://www.youtube.com/watch?v=ml6cT4AZdqI',
    exercises: [
      { id: 'tue-pushups', guideKey: 'pushUps', label: 'Push-ups', reps: 10 },
      { id: 'tue-crunches', guideKey: 'crunches', label: 'Crunches', reps: 30 },
      { id: 'tue-burpees', guideKey: 'burpees', label: 'Burpees', reps: 10 },
      { id: 'tue-plank', guideKey: 'plankCenter', label: 'Plank', durationSec: 30 },
      { id: 'tue-lunges', guideKey: 'lunges', label: 'Lunges', reps: 10, eachSide: true },
    ],
  },
  2: {
    focus: 'Legs & Core',
    name: 'Wednesday — Legs & Core',
    rounds: 2,
    isRest: false,
    link: 'https://www.youtube.com/watch?v=2pLT-olgUJs',
    exercises: [
      { id: 'wed-lunges', guideKey: 'lunges', label: 'Lunges', reps: 10, eachSide: true },
      { id: 'wed-plank', guideKey: 'plankCenter', label: 'Plank', durationSec: 60 },
      { id: 'wed-crunches', guideKey: 'crunches', label: 'Crunches', reps: 30 },
      { id: 'wed-pushups', guideKey: 'pushUps', label: 'Push-ups', reps: 10 },
      { id: 'wed-bicycles', guideKey: 'bicycles', label: 'Bicycles', reps: 30 },
    ],
  },
  3: {
    focus: 'Full Body Circuit',
    name: 'Thursday — Full Body Circuit',
    rounds: 3,
    isRest: false,
    link: 'https://www.youtube.com/watch?v=ml0Ho6Ybq58',
    exercises: [
      { id: 'thu-pushups', guideKey: 'pushUps', label: 'Push-ups', reps: 10 },
      { id: 'thu-bicycles', guideKey: 'bicycles', label: 'Bicycles', reps: 30 },
      { id: 'thu-burpees', guideKey: 'burpees', label: 'Burpees', reps: 10 },
      { id: 'thu-plank', guideKey: 'plankCenter', label: 'Plank', durationSec: 60 },
      { id: 'thu-lunges', guideKey: 'lunges', label: 'Lunges', reps: 10, eachSide: false },
    ],
  },
  4: {
    focus: 'HIIT Burn',
    name: 'Friday — HIIT Burn',
    rounds: 2,
    isRest: false,
    link: 'https://www.youtube.com/watch?v=cbKkBnfPwno',
    exercises: [
      { id: 'fri-burpees', guideKey: 'burpees', label: 'Burpees', reps: 20 },
      { id: 'fri-pushups', guideKey: 'pushUps', label: 'Push-ups', reps: 10 },
      { id: 'fri-lunges', guideKey: 'lunges', label: 'Lunges', reps: 10, eachSide: true },
      { id: 'fri-bicycles', guideKey: 'bicycles', label: 'Bicycles', reps: 30 },
      { id: 'fri-plank', guideKey: 'plankCenter', label: 'Plank', durationSec: 60 },
    ],
  },
  5: {
    focus: 'Rest & Recovery',
    name: 'Saturday — Rest Day',
    rounds: 0,
    isRest: true,
    link: null,
    exercises: [],
  },
  6: {
    focus: 'Rest & Recovery',
    name: 'Sunday — Rest Day',
    rounds: 0,
    isRest: true,
    link: null,
    exercises: [],
  },
};

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** Harder exercise label variants by level */
const DIFFICULTY_LABELS = {
  intermediate: {
    pushUps: 'Push-ups (controlled tempo)',
    burpees: 'Burpees (full extension)',
    plankCenter: 'Plank (strict form)',
    lunges: 'Walking Lunges',
    bicycles: 'Bicycles (slow & controlled)',
    crunches: 'Crunches (full range)',
  },
  professional: {
    pushUps: 'Diamond / Decline Push-ups',
    burpees: 'Burpee Jump-Tucks',
    plankCenter: 'Plank with Shoulder Taps',
    lunges: 'Jump Lunges',
    bicycles: 'Bicycle Crunches (weighted)',
    crunches: 'Hollow-Body Crunches',
    plankSideRight: 'Side Plank with Hip Dips — Right',
    plankSideLeft: 'Side Plank with Hip Dips — Left',
  },
};

const LEVEL_SCALE = {
  starter: { repMult: 1, durationMult: 1, roundBonus: 0 },
  intermediate: { repMult: 1.4, durationMult: 1.5, roundBonus: 1 },
  professional: { repMult: 1.8, durationMult: 2, roundBonus: 2 },
};

/**
 * Map setup / legacy fitness labels to a workout level id.
 */
export function normalizeWorkoutLevel(value) {
  if (!value) return null;
  const v = String(value).toLowerCase().trim();
  if (v.includes('professional') || v.includes('advanced')) return 'professional';
  if (v.includes('intermediate')) return 'intermediate';
  if (v.includes('starter') || v.includes('beginner') || v.includes('returning')) return 'starter';
  const match = WORKOUT_LEVELS.find((l) => l.id === v);
  return match?.id ?? null;
}

/**
 * Resolve progression level from journey week + optional floor from setup.
 * Weeks 1–8 Starter, 9–16 Intermediate, 17+ Professional (within ~184-day journey).
 */
export function resolveProgressionLevel(weekNum = 1, floorLevel = null) {
  const week = Math.max(1, Number(weekNum) || 1);
  let fromProgress = 'starter';
  if (week >= 17) fromProgress = 'professional';
  else if (week >= 9) fromProgress = 'intermediate';

  const floor = normalizeWorkoutLevel(floorLevel);
  if (!floor) return fromProgress;

  const order = (id) => WORKOUT_LEVELS.find((l) => l.id === id)?.order ?? 0;
  return order(floor) > order(fromProgress) ? floor : fromProgress;
}

export function getLevelMeta(levelId) {
  return WORKOUT_LEVELS.find((l) => l.id === levelId) || WORKOUT_LEVELS[0];
}

export function formatExerciseName(exercise) {
  if (!exercise) return '';
  if (exercise.name && !exercise.reps && !exercise.durationSec) return exercise.name;

  const label = exercise.label || exercise.name || 'Exercise';
  if (exercise.durationSec != null) {
    return `${exercise.durationSec} sec ${label}`;
  }
  if (exercise.reps != null) {
    return exercise.eachSide
      ? `${exercise.reps} ${label} — Each Side`
      : `${exercise.reps} ${label}`;
  }
  return label;
}

function scaleValue(value, mult) {
  if (value == null) return value;
  return Math.max(1, Math.round(value * mult));
}

function cloneRoutine(routine) {
  return {
    ...routine,
    exercises: (routine.exercises || []).map((ex) => ({ ...ex })),
  };
}

/**
 * Scale a baseline routine to a progression level.
 */
export function applyProgression(routine, levelId = 'starter') {
  const base = cloneRoutine(routine);
  if (!base || base.isRest) {
    return {
      ...base,
      level: 'starter',
      levelLabel: 'Starter',
      exercises: [],
      rounds: 0,
    };
  }

  const level = normalizeWorkoutLevel(levelId) || 'starter';
  const scale = LEVEL_SCALE[level] || LEVEL_SCALE.starter;
  const variants = DIFFICULTY_LABELS[level] || {};

  const exercises = base.exercises.map((ex) => {
    const next = { ...ex };
    if (next.reps != null) next.reps = scaleValue(next.reps, scale.repMult);
    if (next.durationSec != null) next.durationSec = scaleValue(next.durationSec, scale.durationMult);
    if (variants[next.guideKey]) next.label = variants[next.guideKey];
    next.name = formatExerciseName(next);
    return next;
  });

  const rounds =
    base.rounds > 0
      ? Math.min(6, base.rounds + scale.roundBonus)
      : 0;

  return {
    ...base,
    rounds,
    exercises,
    level,
    levelLabel: getLevelMeta(level).label,
  };
}

/**
 * Enrich exercises with form guides + muscles and ensure display names.
 */
export function enrichRoutine(routine) {
  if (!routine) {
    return { name: 'Workout Session', link: null, rounds: 0, exercises: [], isRest: true };
  }
  return {
    ...routine,
    exercises: (routine.exercises || []).map((ex) => {
      const withName = { ...ex, name: formatExerciseName(ex) };
      return {
        ...withName,
        formGuide: EXERCISE_FORM_GUIDES[ex.guideKey] ?? null,
        muscles: EXERCISE_MUSCLES[ex.guideKey] ?? [],
      };
    }),
  };
}

export function getDefaultRoutine(dayIndex) {
  const routine = DEFAULT_WEEKLY_ROUTINES[dayIndex];
  if (!routine) return null;
  return cloneRoutine(routine);
}

export function getDayName(dayIndex) {
  return DAY_NAMES[dayIndex] || `Day ${dayIndex}`;
}

/**
 * Build a display-ready workout for a day at a given progression level.
 * Optional `override` replaces the default baseline before scaling
 * (unless override.lockedAtLevel is set — then no auto-scale on that day).
 */
export function buildWorkoutForDay(dayIndex, levelId = 'starter', override = null) {
  const baseline = override
    ? {
        focus: override.focus ?? getDefaultRoutine(dayIndex)?.focus,
        name: override.name ?? getDefaultRoutine(dayIndex)?.name,
        rounds: override.rounds ?? 0,
        isRest: Boolean(override.isRest) || (override.exercises?.length === 0 && (override.rounds ?? 0) === 0),
        link: override.link !== undefined ? override.link : getDefaultRoutine(dayIndex)?.link,
        exercises: (override.exercises || []).map((ex) => ({ ...ex })),
        custom: true,
        lockedAtLevel: override.lockedAtLevel || false,
      }
    : getDefaultRoutine(dayIndex);

  if (!baseline) {
    return enrichRoutine({
      name: 'Workout Session',
      focus: 'Workout',
      rounds: 0,
      isRest: true,
      link: null,
      exercises: [],
      level: levelId,
      levelLabel: getLevelMeta(levelId).label,
    });
  }

  // User customizations: if locked, use as-is; otherwise still apply level scaling to custom base
  const scaled =
    baseline.custom && baseline.lockedAtLevel
      ? {
          ...baseline,
          level: levelId,
          levelLabel: getLevelMeta(levelId).label,
          exercises: (baseline.exercises || []).map((ex) => ({
            ...ex,
            name: formatExerciseName(ex),
          })),
        }
      : applyProgression(baseline, levelId);

  return enrichRoutine(scaled);
}
