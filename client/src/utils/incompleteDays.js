/**
 * Detect past journey days that still need to be marked complete,
 * and helpers for catch-up notifications / navigation.
 */

import { getJourneyData } from '../data/journeys/index.js';
import { getRegistryJourneys, getContentTemplateId } from './journeyRegistry.js';
import {
  getCurrentDayNumber,
  getJourneyState,
  isDayAvailableForUser,
} from './journeyPlanning.js';
import { isDayFullyComplete, collectDaySessionKeys } from './progressTracking.js';
import { getJourneyTheme } from './journeyTheme.js';

const SNOOZE_KEY = 'aetherIncompleteDaysSnoozeUntil';

function flattenDays(weeks) {
  if (!Array.isArray(weeks)) return [];
  return weeks.flatMap((w) => (Array.isArray(w?.days) ? w.days : [])).filter(Boolean);
}

/** True when the day has at least one completable session / activity */
export function dayRequiresCompletion(day) {
  if (!day || !day.dayNumber || day.dayNumber < 1) return false;
  if (day.isTestRun || day.isRest || day.restDay) return false;
  if (day.workout?.isRest) return false;
  const focus = String(day.focus || day.title || day.theme || '').toLowerCase();
  if (focus.includes('rest') && !day.schedule?.scheduledContent) {
    // Body / generic rest days with no learning schedule
    if (!day.readingSessions && !day.execution && !day.personalBrandTasks) return false;
  }
  return collectDaySessionKeys('_probe_', day).length > 0;
}

/**
 * Past calendar days (before today in the journey) that still need completion.
 * @returns {{ dayNumber: number, day: object, label: string }[]}
 */
export function getIncompletePastDays(journeyId, weeks) {
  if (getJourneyState(journeyId) !== 'active') return [];
  const currentDay = getCurrentDayNumber(journeyId);
  if (!currentDay || currentDay < 2) return [];

  const days = flattenDays(weeks);
  const incomplete = [];

  for (let n = 1; n < currentDay; n++) {
    if (!isDayAvailableForUser(journeyId, n)) continue;
    const day = days.find((d) => d.dayNumber === n);
    if (!day || !dayRequiresCompletion(day)) continue;
    if (!isDayFullyComplete(journeyId, day)) {
      incomplete.push({
        dayNumber: n,
        day,
        label: day.focus || day.title || day.theme || `Day ${n}`,
      });
    }
  }

  return incomplete;
}

export function getJourneyRoute(journeyId, dayNumber) {
  const entry = getRegistryJourneys().find((j) => j.id === journeyId);
  const templateId = getContentTemplateId(journeyId);
  const theme = getJourneyTheme(templateId);
  const base =
    entry && entry.id !== templateId
      ? `/journey/${journeyId}`
      : theme?.path || `/${templateId}`;
  if (dayNumber) return `${base}?day=${dayNumber}`;
  return base;
}

/**
 * Incomplete past work across all active non-demo journeys.
 * @returns {{ journeyId: string, title: string, icon?: string, incomplete: ReturnType<typeof getIncompletePastDays> }[]}
 */
export function getIncompletePastAcrossJourneys() {
  return getRegistryJourneys()
    .filter((j) => !j.isDemo && getJourneyState(j.id) === 'active')
    .map((j) => {
      const templateId = getContentTemplateId(j.id);
      const { weeks } = getJourneyData(templateId);
      const incomplete = getIncompletePastDays(j.id, weeks);
      return {
        journeyId: j.id,
        title: j.title,
        icon: j.icon,
        incomplete,
      };
    })
    .filter((row) => row.incomplete.length > 0);
}

export function getOldestIncompleteCatchUp() {
  const rows = getIncompletePastAcrossJourneys();
  if (!rows.length) return null;
  const first = rows[0];
  const day = first.incomplete[0];
  return {
    journeyId: first.journeyId,
    title: first.title,
    icon: first.icon,
    dayNumber: day.dayNumber,
    label: day.label,
    totalIncomplete: rows.reduce((sum, r) => sum + r.incomplete.length, 0),
    href: getJourneyRoute(first.journeyId, day.dayNumber),
  };
}

export function isIncompleteCatchUpSnoozed() {
  try {
    const until = Number(localStorage.getItem(SNOOZE_KEY) || 0);
    return until > Date.now();
  } catch {
    return false;
  }
}

/** Snooze the modal (banner still shows). Default 4 hours. */
export function snoozeIncompleteCatchUp(ms = 4 * 60 * 60 * 1000) {
  localStorage.setItem(SNOOZE_KEY, String(Date.now() + ms));
}

export function clearIncompleteCatchUpSnooze() {
  localStorage.removeItem(SNOOZE_KEY);
}
