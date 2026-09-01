/**
 * Date utilities for Aether
 *
 * Journey length = 6 calendar months from the user’s start date (Day 1).
 * Start date is stored in localStorage and can be changed in Settings.
 */

import { getCalendarWeekNumber } from '../data/journeys/shared.js';
import { STORAGE_KEYS } from './storageKeys.js';

/** Default Day 1 if the user has not chosen a start date yet */
export const DEFAULT_JOURNEY_START = '2026-07-18';
export const JOURNEY_DURATION_MONTHS = 6;

/** Content library still spans this many day templates (UI length is dynamic). */
export const CONTENT_TOTAL_DAYS = 184;

function pad2(n) {
  return String(n).padStart(2, '0');
}

export function formatYmd(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function parseYmd(ymd) {
  const match = String(ymd).trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return new Date(NaN);
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  return new Date(y, m - 1, d);
}

export function startOfLocalDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addMonths(date, months) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setMonth(d.getMonth() + months);
  return d;
}

/** Inclusive day count between two local dates */
export function daysInclusive(start, end) {
  const a = startOfLocalDay(start);
  const b = startOfLocalDay(end);
  const ms = b.getTime() - a.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
}

export function getStoredJourneyStartDate() {
  try {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem(STORAGE_KEYS.JOURNEY_START);
      if (v && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
        return v;
      }
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_JOURNEY_START;
}

/**
 * Persist Day 1 (YYYY-MM-DD). Dispatches `journey-start-updated`.
 */
export function setJourneyStartDate(ymd) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
    throw new Error('Start date must be YYYY-MM-DD');
  }
  localStorage.setItem(STORAGE_KEYS.JOURNEY_START, ymd);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('journey-start-updated', { detail: { startDate: ymd } })
    );
  }
  return ymd;
}

export function getJourneyStartDate() {
  return parseYmd(getStoredJourneyStartDate());
}

/** End of the 6-month arc (same calendar day + 6 months) */
export function getJourneyEndDate() {
  return addMonths(getJourneyStartDate(), JOURNEY_DURATION_MONTHS);
}

export function getJourneyTotalDays() {
  return daysInclusive(getJourneyStartDate(), getJourneyEndDate());
}

function phaseBoundaries() {
  const start = getJourneyStartDate();
  const total = getJourneyTotalDays();
  const p1 = Math.floor(total / 3);
  const p2 = Math.floor((total * 2) / 3);
  const phase1End = new Date(start);
  phase1End.setDate(start.getDate() + p1 - 1);
  const phase2End = new Date(start);
  phase2End.setDate(start.getDate() + p2 - 1);
  const phase3End = getJourneyEndDate();
  return { start, phase1End, phase2End, phase3End, total, p1, p2 };
}

/**
 * Live constants — getters so TOTAL_DAYS / dates follow the user’s start.
 */
export const JOURNEY_CONSTANTS = {
  DURATION_MONTHS: JOURNEY_DURATION_MONTHS,
  ONBOARDING_DAYS: 0,
  get ONBOARDING_START() {
    return getJourneyStartDate();
  },
  get ONBOARDING_END() {
    const d = getJourneyStartDate();
    d.setDate(d.getDate() - 1);
    return d;
  },
  get ASCENSION_START() {
    return getJourneyStartDate();
  },
  get PHASE_1_END() {
    return phaseBoundaries().phase1End;
  },
  get PHASE_2_END() {
    return phaseBoundaries().phase2End;
  },
  get PHASE_3_END() {
    return getJourneyEndDate();
  },
  get TOTAL_DAYS() {
    return getJourneyTotalDays();
  },
  get PHASE_1_DAYS() {
    return phaseBoundaries().p1;
  },
  get PHASE_2_DAYS() {
    return phaseBoundaries().p2 - phaseBoundaries().p1;
  },
  get PHASE_3_DAYS() {
    const { total, p2 } = phaseBoundaries();
    return total - p2;
  },
};

/**
 * @returns {'before' | 'onboarding' | 'phase1' | 'phase2' | 'phase3' | 'after'}
 */
export function getCurrentPhaseStatus() {
  const today = startOfLocalDay();
  const { start, phase1End, phase2End, phase3End } = phaseBoundaries();

  if (today < start) return 'before';
  if (today > phase3End) return 'after';
  if (today <= phase1End) return 'phase1';
  if (today <= phase2End) return 'phase2';
  return 'phase3';
}

/** @deprecated — custom start dates have no separate onboarding window */
export function isPreparationPhase() {
  return false;
}

export function getOnboardingDayNumber() {
  return null;
}

/**
 * Current journey day (1 … TOTAL_DAYS), or null if before/after the arc.
 */
export function getCurrentDayNumber() {
  const phaseStatus = getCurrentPhaseStatus();
  if (phaseStatus === 'before' || phaseStatus === 'after') {
    return null;
  }

  const today = startOfLocalDay();
  const start = getJourneyStartDate();
  const total = getJourneyTotalDays();
  const dayNumber =
    Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  if (dayNumber < 1 || dayNumber > total) {
    return null;
  }
  return dayNumber;
}

export function getDateForDay(dayNumber) {
  if (!dayNumber || dayNumber < 1 || dayNumber > getJourneyTotalDays()) {
    return null;
  }
  const start = getJourneyStartDate();
  const target = new Date(start);
  target.setDate(start.getDate() + dayNumber - 1);
  return target;
}

export function getArcMonth(dayNumber) {
  if (!dayNumber || dayNumber < 1) return 0;
  const total = getJourneyTotalDays();
  const bucket = Math.ceil((dayNumber / total) * 6);
  return Math.min(6, Math.max(1, bucket));
}

export function isTestingWeek() {
  return false;
}

export function isActualContentDay(dayNumber) {
  return dayNumber >= 1;
}

export function formatDayNumber(dayNumber) {
  if (!dayNumber || dayNumber < 1) {
    return 'Before Journey Start';
  }
  return `Day ${dayNumber} of ${getJourneyTotalDays()}`;
}

export function getDaysRemaining() {
  const currentDay = getCurrentDayNumber();
  if (currentDay === null) {
    const today = startOfLocalDay();
    if (today < getJourneyStartDate()) {
      return getJourneyTotalDays();
    }
    return null;
  }
  return getJourneyTotalDays() - currentDay;
}

/** Whole months roughly remaining (for UI copy). */
export function getMonthsRemainingLabel() {
  const end = getJourneyEndDate();
  const today = startOfLocalDay();
  if (today > end) return 'Complete';
  if (today < getJourneyStartDate()) return `${JOURNEY_DURATION_MONTHS} months`;
  const ms = end.getTime() - today.getTime();
  const days = Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  const months = Math.max(0, Math.round(days / 30.44));
  if (months <= 0) return `${days} day${days === 1 ? '' : 's'} left`;
  return `~${months} month${months === 1 ? '' : 's'} left`;
}

export function getJourneyProgress() {
  const day = getCurrentDayNumber();
  if (!day) return 0;
  return Math.round((day / getJourneyTotalDays()) * 100);
}

export function isInJourney(date) {
  const checkLocal = startOfLocalDay(typeof date === 'string' ? parseYmd(date) : date);
  const start = getJourneyStartDate();
  const end = getJourneyEndDate();
  return checkLocal >= start && checkLocal <= end;
}

export function getWeekNumber(dayNumber) {
  return getCalendarWeekNumber(dayNumber);
}

export function isDayAccessible(dayNumber) {
  return dayNumber >= 1 && dayNumber <= getJourneyTotalDays();
}

export function canCompleteDay(dayNumber) {
  return dayNumber >= 1 && dayNumber <= getJourneyTotalDays();
}

export function isDayPast(dayNumber) {
  const today = startOfLocalDay();
  const dayDate = getDateForDay(dayNumber);
  if (!dayDate) return false;
  return startOfLocalDay(dayDate) < today;
}

export function isTomorrow(dayNumber) {
  const currentDayNumber = getCurrentDayNumber();
  if (getCurrentPhaseStatus() === 'before') {
    return dayNumber === 1;
  }
  if (!currentDayNumber || dayNumber < 1) return false;
  return dayNumber === currentDayNumber + 1;
}
