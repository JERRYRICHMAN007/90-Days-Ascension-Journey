/**
 * Per-journey planning: start dates, mastery deadlines, availability, adaptive roadmap.
 */

import {
  addMonths,
  daysInclusive,
  formatYmd,
  getStoredJourneyStartDate as getGlobalStart,
  JOURNEY_DURATION_MONTHS,
  parseYmd,
  setJourneyStartDate as setGlobalStart,
  startOfLocalDay,
} from './dates.js';
import { STORAGE_KEYS } from './storageKeys.js';
import { getDateForDay as getGlobalDateForDay } from './dates.js';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function readJson(key, fallback) {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Per-journey start dates map */
export function getAllJourneyStartDates() {
  return readJson(STORAGE_KEYS.JOURNEY_STARTS, {});
}

export function getStoredJourneyStartDate(journeyId) {
  const map = getAllJourneyStartDates();
  if (journeyId && map[journeyId] && /^\d{4}-\d{2}-\d{2}$/.test(map[journeyId])) {
    return map[journeyId];
  }
  return null;
}

/** Default for the date picker only — not a started journey */
export function getDefaultPickerDate() {
  return formatYmd(new Date());
}

export function hasJourneyStartDate(journeyId) {
  const map = getAllJourneyStartDates();
  return Boolean(journeyId && map[journeyId] && /^\d{4}-\d{2}-\d{2}$/.test(map[journeyId]));
}

/**
 * Persist start date for a journey. Also updates global default for backward compat.
 */
export function setJourneyStartDateFor(journeyId, ymd) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
    throw new Error('Start date must be YYYY-MM-DD');
  }
  const map = getAllJourneyStartDates();
  map[journeyId] = ymd;
  writeJson(STORAGE_KEYS.JOURNEY_STARTS, map);
  setGlobalStart(ymd);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('journey-start-updated', { detail: { journeyId, startDate: ymd } })
    );
  }
  return ymd;
}

/**
 * Clear this journey's start date so the user can begin a new 6-month arc.
 * Does not delete task progress — only the schedule anchor.
 */
export function resetJourneySchedule(journeyId) {
  const map = getAllJourneyStartDates();
  if (journeyId && map[journeyId]) {
    delete map[journeyId];
    writeJson(STORAGE_KEYS.JOURNEY_STARTS, map);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('journey-start-updated', {
        detail: { journeyId, reset: true },
      })
    );
  }
}

export function getJourneyStartDate(journeyId) {
  const ymd = getStoredJourneyStartDate(journeyId);
  if (!ymd) return null;
  return parseYmd(ymd);
}

export function getJourneyEndDate(journeyId) {
  const start = getJourneyStartDate(journeyId);
  if (!start) return null;
  return addMonths(start, JOURNEY_DURATION_MONTHS);
}

export function getJourneyTotalDays(journeyId) {
  const start = getJourneyStartDate(journeyId);
  const end = getJourneyEndDate(journeyId);
  if (!start || !end) return null;
  return daysInclusive(start, end);
}

export function getDateForDay(journeyId, dayNumber) {
  if (!dayNumber || dayNumber < 1) return null;
  const total = getJourneyTotalDays(journeyId);
  if (dayNumber > total) return null;
  const start = getJourneyStartDate(journeyId);
  const target = new Date(start);
  target.setDate(start.getDate() + dayNumber - 1);
  return target;
}

export function getCurrentDayNumber(journeyId) {
  if (!hasJourneyStartDate(journeyId)) return null;
  const today = startOfLocalDay();
  const start = getJourneyStartDate(journeyId);
  const end = getJourneyEndDate(journeyId);
  if (!start || !end) return null;
  if (today < start) return null;
  if (today > end) return null;
  const dayNumber =
    Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const total = getJourneyTotalDays(journeyId);
  if (dayNumber < 1 || dayNumber > total) return null;
  return dayNumber;
}

export function getDaysRemaining(journeyId) {
  if (!hasJourneyStartDate(journeyId)) return null;
  const current = getCurrentDayNumber(journeyId);
  const total = getJourneyTotalDays(journeyId);
  if (total == null) return null;
  const today = startOfLocalDay();
  const start = getJourneyStartDate(journeyId);
  if (today < start) return total;
  if (current === null) return 0;
  return Math.max(0, total - current);
}

/** Time elapsed through the 6-month arc (0–100), not task completion */
export function getTimeElapsedPercent(journeyId) {
  if (!hasJourneyStartDate(journeyId)) return 0;
  const today = startOfLocalDay();
  const start = getJourneyStartDate(journeyId);
  const end = getJourneyEndDate(journeyId);
  const total = getJourneyTotalDays(journeyId);
  if (!start || !end || !total) return 0;
  if (today < start) return 0;
  if (today > end) return 100;
  const elapsed = daysInclusive(start, today);
  return Math.min(100, Math.round((elapsed / total) * 100));
}

export function getJourneyPhaseStatus(journeyId) {
  if (!hasJourneyStartDate(journeyId)) return 'unconfigured';
  const today = startOfLocalDay();
  const start = getJourneyStartDate(journeyId);
  const end = getJourneyEndDate(journeyId);
  const total = getJourneyTotalDays(journeyId);
  if (!start || !end || !total) return 'unconfigured';
  const p1 = Math.floor(total / 3);
  const p2 = Math.floor((total * 2) / 3);
  const phase1End = new Date(start);
  phase1End.setDate(start.getDate() + p1 - 1);
  const phase2End = new Date(start);
  phase2End.setDate(start.getDate() + p2 - 1);

  if (today < start) return 'before';
  if (today > end) return 'after';
  if (today <= phase1End) return 'phase1';
  if (today <= phase2End) return 'phase2';
  return 'phase3';
}

export function formatDisplayDate(ymdOrDate) {
  try {
    const date =
      typeof ymdOrDate === 'string' ? parseYmd(ymdOrDate) : ymdOrDate;
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return String(ymdOrDate);
  }
}

export function getJourneyTimeline(journeyId) {
  const configured = hasJourneyStartDate(journeyId);
  const pickerYmd = getDefaultPickerDate();
  const previewEnd = addMonths(parseYmd(pickerYmd), JOURNEY_DURATION_MONTHS);

  if (!configured) {
    return {
      journeyId,
      configured: false,
      startYmd: pickerYmd,
      startLabel: 'Not set',
      endYmd: formatYmd(previewEnd),
      endLabel: '—',
      masteryDeadlineLabel: '—',
      totalDays: daysInclusive(parseYmd(pickerYmd), previewEnd),
      currentDay: null,
      daysRemaining: null,
      timeElapsedPercent: 0,
      status: 'unconfigured',
      monthsDuration: JOURNEY_DURATION_MONTHS,
    };
  }

  const startYmd = getStoredJourneyStartDate(journeyId);
  const end = getJourneyEndDate(journeyId);
  const totalDays = getJourneyTotalDays(journeyId);
  const currentDay = getCurrentDayNumber(journeyId);
  const daysRemaining = getDaysRemaining(journeyId);
  const timeElapsedPercent = getTimeElapsedPercent(journeyId);
  const status = getJourneyPhaseStatus(journeyId);

  return {
    journeyId,
    configured,
    startYmd,
    startLabel: formatDisplayDate(startYmd),
    endYmd: formatYmd(end),
    endLabel: formatDisplayDate(end),
    masteryDeadlineLabel: formatDisplayDate(end),
    totalDays,
    currentDay,
    daysRemaining,
    timeElapsedPercent,
    status,
    monthsDuration: JOURNEY_DURATION_MONTHS,
  };
}

// ——— Weekly availability (optional) ———

const DEFAULT_AVAILABILITY = { enabled: false, availableDays: [1, 2, 3, 4, 5], hoursPerDay: null };

export function getAllAvailability() {
  return readJson(STORAGE_KEYS.JOURNEY_AVAILABILITY, {});
}

export function getJourneyAvailability(journeyId) {
  const all = getAllAvailability();
  return { ...DEFAULT_AVAILABILITY, ...(all[journeyId] || {}) };
}

export function setJourneyAvailability(journeyId, config) {
  const all = getAllAvailability();
  all[journeyId] = { ...DEFAULT_AVAILABILITY, ...config };
  writeJson(STORAGE_KEYS.JOURNEY_AVAILABILITY, all);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('journey-availability-updated', { detail: { journeyId } })
    );
  }
}

export function isDayAvailableForUser(journeyId, dayNumber) {
  const avail = getJourneyAvailability(journeyId);
  if (!avail.enabled) return true;
  const date = getDateForDay(journeyId, dayNumber);
  if (!date) return false;
  return avail.availableDays.includes(date.getDay());
}

export function getWeekdayLabels() {
  return WEEKDAY_LABELS;
}

export function getWeekdayFull() {
  return WEEKDAY_FULL;
}

// ——— Adaptive planning ———

/**
 * Compare task completion pace vs calendar pace; suggest focus day.
 */
export function getAdaptiveFocus(journeyId, completedDays, totalContentDays) {
  const currentDay = getCurrentDayNumber(journeyId);
  const timeline = getJourneyTimeline(journeyId);

  if (!timeline.configured) {
    return { type: 'setup', message: 'Set your journey start date to unlock your personalized roadmap.' };
  }

  if (timeline.status === 'before') {
    const daysUntil = daysInclusive(startOfLocalDay(), getJourneyStartDate(journeyId)) - 1;
    return {
      type: 'upcoming',
      message: `Your journey begins ${timeline.startLabel}. ${Math.max(0, daysUntil)} day${daysUntil === 1 ? '' : 's'} until Day 1.`,
      focusDay: 1,
    };
  }

  if (timeline.status === 'after') {
    return { type: 'complete', message: 'Mastery window complete. Review your progress and celebrate wins.', focusDay: totalContentDays };
  }

  const expectedCompletion = currentDay ?? 1;
  const paceDelta = completedDays - expectedCompletion;

  if (paceDelta < -7) {
    const catchUpDay = Math.max(1, (currentDay ?? 1) - Math.abs(paceDelta));
    return {
      type: 'catch-up',
      message: `You're ${Math.abs(paceDelta)} days behind schedule. Focus on Day ${catchUpDay} to catch up.`,
      focusDay: catchUpDay,
      behindBy: Math.abs(paceDelta),
    };
  }

  if (paceDelta > 3) {
    return {
      type: 'ahead',
      message: `You're ahead of schedule — great momentum. Preview Day ${(currentDay ?? 1) + 1} or deepen today's work.`,
      focusDay: currentDay ?? 1,
    };
  }

  const focusDay = currentDay ?? 1;
  if (!isDayAvailableForUser(journeyId, focusDay)) {
    const next = findNextAvailableDay(journeyId, focusDay, timeline.totalDays);
    return {
      type: 'rest',
      message: `Rest day on your schedule. Next session: Day ${next} (${formatDisplayDate(formatYmd(getDateForDay(journeyId, next)))}).`,
      focusDay: next,
    };
  }

  return {
    type: 'today',
    message: `Today's focus: Day ${focusDay}. Complete your sessions to stay on track for mastery by ${timeline.masteryDeadlineLabel}.`,
    focusDay,
  };
}

function findNextAvailableDay(journeyId, fromDay, maxDay) {
  for (let d = fromDay; d <= maxDay; d++) {
    if (isDayAvailableForUser(journeyId, d)) return d;
  }
  return fromDay;
}

/** Weekly workload recommendation when availability is set */
export function getWeeklyGoal(journeyId, weekDayNumbers) {
  const avail = getJourneyAvailability(journeyId);
  if (!avail.enabled) {
    return { targetDays: weekDayNumbers.length, availableDays: weekDayNumbers.length, message: null };
  }
  const availableInWeek = weekDayNumbers.filter((d) => isDayAvailableForUser(journeyId, d)).length;
  const targetDays = Math.max(1, availableInWeek);
  return {
    targetDays,
    availableDays: availableInWeek,
    message:
      availableInWeek < weekDayNumbers.length
        ? `This week: ${targetDays} session day${targetDays === 1 ? '' : 's'} based on your availability.`
        : null,
  };
}

export function getNextMilestone(journeyId, completedDays, totalDays) {
  const milestones = [
    { at: 7, label: 'First week complete', icon: '🎯' },
    { at: 30, label: '30-day consistency', icon: '🔥' },
    { at: Math.floor(totalDays / 3), label: 'Phase 1 mastery', icon: '⚡' },
    { at: Math.floor((totalDays * 2) / 3), label: 'Phase 2 mastery', icon: '🚀' },
    { at: totalDays, label: 'Journey mastery', icon: '🏆' },
  ];

  const next = milestones.find((m) => completedDays < m.at);
  if (!next) {
    return { label: 'Mastery achieved', icon: '🏆', daysUntil: 0, progress: 100 };
  }
  const prev = milestones.filter((m) => m.at <= completedDays).pop();
  const rangeStart = prev ? prev.at : 0;
  const progress = Math.round(((completedDays - rangeStart) / (next.at - rangeStart)) * 100);
  return {
    ...next,
    daysUntil: next.at - completedDays,
    progress: Math.min(100, Math.max(0, progress)),
  };
}

/** Re-export for components that need global fallback */
export { getGlobalDateForDay };