/**
 * Persist + resolve Body Journey workout plans (defaults + user edits + progression).
 */

import { STORAGE_KEYS } from './storageKeys.js';
import { getJourneySetup } from './journeySetup.js';
import {
  buildWorkoutForDay,
  getDefaultRoutine,
  normalizeWorkoutLevel,
  resolveProgressionLevel,
  getLevelMeta,
  WORKOUT_LEVELS,
  formatExerciseName,
} from '../data/journeys/bodyWorkoutPlan.js';

const BODY_JOURNEY_ID = 'body-transformation';

function readAll() {
  try {
    if (typeof window === 'undefined') return {};
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKOUT_PLAN) || '{}');
  } catch {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEYS.WORKOUT_PLAN, JSON.stringify(data));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('workout-plan-updated', { detail: { data } }));
  }
}

/**
 * @typedef {Object} WorkoutDayOverride
 * @property {string} [focus]
 * @property {string} [name]
 * @property {number} [rounds]
 * @property {boolean} [isRest]
 * @property {string|null} [link]
 * @property {boolean} [lockedAtLevel] - when true, do not auto-scale this day
 * @property {Array} [exercises]
 */

/**
 * @typedef {Object} WorkoutPlanState
 * @property {string} [levelOverride] - force starter|intermediate|professional
 * @property {Record<string, WorkoutDayOverride>} [days] - keyed by dayIndex 0-6
 */

export function getWorkoutPlanState(journeyId = BODY_JOURNEY_ID) {
  const all = readAll();
  return all[journeyId] || { days: {} };
}

export function saveWorkoutPlanState(journeyId, patch) {
  const all = readAll();
  const prev = all[journeyId] || { days: {} };
  all[journeyId] = {
    ...prev,
    ...patch,
    days: patch.days !== undefined ? patch.days : prev.days || {},
    updatedAt: new Date().toISOString(),
  };
  writeAll(all);
  return all[journeyId];
}

export function getDayOverride(journeyId, dayIndex) {
  const state = getWorkoutPlanState(journeyId);
  return state.days?.[String(dayIndex)] || state.days?.[dayIndex] || null;
}

export function saveDayOverride(journeyId, dayIndex, dayPlan) {
  const state = getWorkoutPlanState(journeyId);
  const days = { ...(state.days || {}) };
  days[String(dayIndex)] = {
    focus: dayPlan.focus,
    name: dayPlan.name,
    rounds: dayPlan.rounds ?? 0,
    isRest: Boolean(dayPlan.isRest),
    link: dayPlan.link ?? null,
    lockedAtLevel: Boolean(dayPlan.lockedAtLevel),
    exercises: (dayPlan.exercises || []).map((ex) => ({
      id: ex.id || `ex-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      guideKey: ex.guideKey || 'plankCenter',
      label: ex.label || 'Exercise',
      reps: ex.reps != null ? Number(ex.reps) : undefined,
      durationSec: ex.durationSec != null ? Number(ex.durationSec) : undefined,
      eachSide: Boolean(ex.eachSide),
    })),
  };
  return saveWorkoutPlanState(journeyId, { days });
}

export function clearDayOverride(journeyId, dayIndex) {
  const state = getWorkoutPlanState(journeyId);
  const days = { ...(state.days || {}) };
  delete days[String(dayIndex)];
  delete days[dayIndex];
  return saveWorkoutPlanState(journeyId, { days });
}

export function clearAllOverrides(journeyId = BODY_JOURNEY_ID) {
  return saveWorkoutPlanState(journeyId, { days: {}, levelOverride: undefined });
}

export function setLevelOverride(journeyId, levelId) {
  const normalized = levelId ? normalizeWorkoutLevel(levelId) : null;
  return saveWorkoutPlanState(journeyId, {
    levelOverride: normalized || undefined,
  });
}

/**
 * Active progression level for this journey at a given week.
 */
export function getActiveWorkoutLevel(journeyId = BODY_JOURNEY_ID, weekNum = 1) {
  const state = getWorkoutPlanState(journeyId);
  if (state.levelOverride) {
    return normalizeWorkoutLevel(state.levelOverride) || 'starter';
  }
  const setup = getJourneySetup(journeyId);
  const floor = normalizeWorkoutLevel(setup.experienceLevel);
  return resolveProgressionLevel(weekNum, floor);
}

/**
 * Resolve the live workout the user should see for a calendar day.
 */
export function resolveBodyWorkout({
  journeyId = BODY_JOURNEY_ID,
  weekNum = 1,
  dayIndex = 0,
} = {}) {
  const level = getActiveWorkoutLevel(journeyId, weekNum);
  const override = getDayOverride(journeyId, dayIndex);
  const workout = buildWorkoutForDay(dayIndex, level, override);
  return {
    ...workout,
    dayIndex,
    weekNum,
    level,
    levelLabel: getLevelMeta(level).label,
    isCustom: Boolean(override),
    hasLevelOverride: Boolean(getWorkoutPlanState(journeyId).levelOverride),
  };
}

/** JS Date → body dayIndex (0=Mon … 6=Sun) */
export function dateToBodyDayIndex(date) {
  const js = date instanceof Date ? date.getDay() : new Date(date).getDay();
  return js === 0 ? 6 : js - 1;
}

export function dayNameToBodyDayIndex(dayName) {
  const map = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
    saturday: 5,
    sunday: 6,
  };
  return map[String(dayName || '').toLowerCase()] ?? 0;
}

export function createExerciseFromCatalog(item) {
  return {
    id: `ex-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    guideKey: item.guideKey,
    label: item.label,
    reps: item.defaultReps,
    durationSec: item.defaultDurationSec,
    eachSide: Boolean(item.eachSide),
    name: formatExerciseName({
      label: item.label,
      reps: item.defaultReps,
      durationSec: item.defaultDurationSec,
      eachSide: item.eachSide,
    }),
  };
}

export function getEditableDayDraft(journeyId, dayIndex, weekNum = 1) {
  const resolved = resolveBodyWorkout({ journeyId, weekNum, dayIndex });
  const override = getDayOverride(journeyId, dayIndex);

  // Prefer saved override; otherwise seed the editor from the live scaled workout
  // so "what you see is what you edit".
  const source = override
    ? {
        focus: override.focus,
        name: override.name,
        rounds: override.rounds ?? 0,
        isRest: Boolean(override.isRest),
        link: override.link ?? null,
        lockedAtLevel: Boolean(override.lockedAtLevel),
        exercises: override.exercises || [],
      }
    : {
        focus: resolved.focus,
        name: resolved.name,
        rounds: resolved.rounds ?? 0,
        isRest: Boolean(resolved.isRest) || (resolved.exercises?.length ?? 0) === 0,
        link: resolved.link ?? null,
        lockedAtLevel: false,
        exercises: (resolved.exercises || []).map((ex) => ({
          id: ex.id,
          guideKey: ex.guideKey,
          label: ex.label,
          reps: ex.reps,
          durationSec: ex.durationSec,
          eachSide: ex.eachSide,
        })),
      };

  return {
    ...source,
    exercises: (source.exercises || []).map((ex) => ({
      ...ex,
      name: formatExerciseName(ex),
    })),
    level: resolved.level,
    levelLabel: resolved.levelLabel,
  };
}

export { WORKOUT_LEVELS, getDefaultRoutine, formatExerciseName };
