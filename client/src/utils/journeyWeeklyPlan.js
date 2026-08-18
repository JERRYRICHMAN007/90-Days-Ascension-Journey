/**
 * Per-journey weekly activity plan (weekday → activity + time).
 */

import { STORAGE_KEYS } from './storageKeys.js';
import { getDefaultWeeklyPlanForCategory, resolveJourneyAIContext } from './journeyAIContext.js';

/** @typedef {{ type: 'workout'|'recovery'|'learning'|'rest'|'custom', label: string, time?: string }} WeekdayActivity */

const WEEKDAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function formatHourLabel(time) {
  if (!time) return '';
  const [h, m] = String(time).split(':').map(Number);
  if (Number.isNaN(h)) return time;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m || 0).padStart(2, '0')} ${ampm}`;
}

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNEY_WEEKLY_PLAN) || '{}');
  } catch {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEYS.JOURNEY_WEEKLY_PLAN, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('journey-weekly-plan-updated'));
}

/** Default Mon–Fri workout, Sat–Sun recovery */
export function getDefaultWorkoutWeeklyPlan() {
  const plan = {};
  [1, 2, 3, 4, 5].forEach((d) => {
    plan[d] = { type: 'workout', label: 'Workout', time: '06:00' };
  });
  [6, 0].forEach((d) => {
    plan[d] = { type: 'recovery', label: 'Rest & Recovery', time: '08:00' };
  });
  return plan;
}

export function getWeeklyPlan(journeyId) {
  const all = readAll();
  if (all[journeyId]) return all[journeyId];
  const ctx = resolveJourneyAIContext(journeyId);
  return getDefaultWeeklyPlanForCategory(ctx.category, ctx.templateId);
}

function isFitnessJourney(ctx) {
  return ctx.category === 'fitness' || ctx.templateId === 'body-transformation';
}

/**
 * Weekly plan enriched for display — fitness journeys always show Sat/Sun recovery
 * when weekday workouts exist, even if not stored explicitly.
 */
export function getDisplayWeeklyPlan(journeyId) {
  const plan = { ...getWeeklyPlan(journeyId) };
  const ctx = resolveJourneyAIContext(journeyId);

  if (isFitnessJourney(ctx)) {
    const hasWeekdayWorkout = [1, 2, 3, 4, 5].some((d) => plan[d]?.type === 'workout');
    if (hasWeekdayWorkout) {
      if (!plan[6]) {
        plan[6] = { type: 'recovery', label: 'Recovery' };
      }
      if (!plan[0]) {
        plan[0] = { type: 'recovery', label: 'Recovery' };
      }
    }
  }

  return plan;
}

export function saveWeeklyPlan(journeyId, plan) {
  const all = readAll();
  all[journeyId] = plan;
  writeAll(all);
  window.dispatchEvent(new CustomEvent('journey-weekly-plan-updated', { detail: { journeyId } }));
  return plan;
}

export function getActiveWeekdays(journeyId) {
  const plan = getWeeklyPlan(journeyId);
  return Object.keys(plan)
    .map(Number)
    .sort((a, b) => a - b);
}

export function formatWeeklyPlanSummary(journeyId) {
  const plan = getWeeklyPlan(journeyId);
  const days = Object.entries(plan);
  if (!days.length) return 'No weekly plan';
  return days
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([d, act]) => `${WEEKDAY_FULL[Number(d)]}: ${act.label}${act.time ? ` @ ${act.time}` : ''}`)
    .join(' · ');
}

export function patchWeeklyPlanFromAvailableDays(journeyId, availableDays, existingPlan) {
  const plan = { ...existingPlan };
  const ctx = resolveJourneyAIContext(journeyId);
  let days = [...availableDays];

  if (isFitnessJourney(ctx) && days.some((d) => d >= 1 && d <= 5)) {
    if (!days.includes(6)) days.push(6);
    if (!days.includes(0)) days.push(0);
  }

  days.forEach((d) => {
    if (!plan[d]) {
      plan[d] =
        d === 0 || d === 6
          ? { type: 'recovery', label: 'Rest & Recovery', time: '08:00' }
          : { type: 'workout', label: 'Workout', time: '06:00' };
    }
  });
  Object.keys(plan).forEach((d) => {
    if (!days.includes(Number(d))) delete plan[Number(d)];
  });
  return plan;
}

export function setActivityTime(journeyId, weekday, time) {
  const plan = { ...getWeeklyPlan(journeyId) };
  if (plan[weekday]) {
    plan[weekday] = { ...plan[weekday], time };
    saveWeeklyPlan(journeyId, plan);
  }
}
