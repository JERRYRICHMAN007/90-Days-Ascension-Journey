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
import { scheduleJourneyStateSync } from './journeyPersist.js';
import { getDateForDay as getGlobalDateForDay } from './dates.js';
import { JOURNEY_IDS } from './journeyTheme.js';
import { wipeJourneyRuntimeData, dispatchJourneyWipeEvents } from './journeyReset.js';

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

/** @typedef {'not_started'|'active'|'completed'} JourneyState */

/** @returns {{ startYmd: string, startedAt: string|null, isStarted: boolean } | null} */
/** Calendar date only — never Date.parse, which shifts YYYY-MM-DD across timezones. */
export function normalizeStartYmd(value) {
  if (!value) return null;
  const match = String(value).trim().match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

export function parseStartEntry(raw) {
  if (!raw) return null;
  if (typeof raw === 'string') {
    const ymd = normalizeStartYmd(raw);
    if (!ymd) return null;
    return { startYmd: ymd, startedAt: ymd, isStarted: true };
  }
  const startYmd = normalizeStartYmd(raw?.startYmd);
  if (!startYmd) return null;
  const startedAt = raw.startedAt;
  if (startedAt === null || startedAt === false) {
    return { startYmd, startedAt: null, isStarted: false };
  }
  return { startYmd, startedAt, isStarted: true };
}

function entryIsExplicitlyStarted(entry) {
  if (!entry?.isStarted) return false;
  if (!entry.startedAt) return false;
  return true;
}

/** @returns {JourneyState} */
export function getJourneyState(journeyId) {
  const entry = parseStartEntry(getAllJourneyStartDates()[journeyId]);
  if (!entryIsExplicitlyStarted(entry)) return 'not_started';

  const today = startOfLocalDay();
  const start = parseYmd(entry.startYmd);
  const end = addMonths(start, JOURNEY_DURATION_MONTHS);

  if (today > end) return 'completed';
  return 'active';
}

export function hasPlannedSchedule(journeyId) {
  return !!parseStartEntry(getAllJourneyStartDates()[journeyId])?.startYmd;
}

export function isJourneyStarted(journeyId) {
  return getJourneyState(journeyId) !== 'not_started';
}

/** Per-journey start dates map */
export function getAllJourneyStartDates() {
  return readJson(STORAGE_KEYS.JOURNEY_STARTS, {});
}

/**
 * Copy legacy global start date into per-journey map when missing.
 * Only applies to journeys that already have progress — never bulk-starts all journeys.
 */
export function migratePerJourneyStartsFromGlobal() {
  if (typeof window === 'undefined') return;

  try {
    const globalYmd = localStorage.getItem(STORAGE_KEYS.JOURNEY_START);
    const map = { ...getAllJourneyStartDates() };
    let changed = false;

    const completions = JSON.parse(localStorage.getItem('sessionCompletions') || '{}');

    if (globalYmd && /^\d{4}-\d{2}-\d{2}$/.test(globalYmd)) {
      JOURNEY_IDS.forEach((id) => {
        if (map[id]) return;
        const hasProgress = Object.keys(completions).some((k) => k.startsWith(`${id}_`));
        if (hasProgress) {
          map[id] = { startYmd: globalYmd, startedAt: globalYmd };
          changed = true;
        }
      });
    }

    // Downgrade auto-started journeys (bulk migration) that have no progress
    Object.entries(map).forEach(([id, raw]) => {
      const entry = parseStartEntry(raw);
      if (!entry?.isStarted) return;
      const hasProgress = Object.keys(completions).some((k) => k.startsWith(`${id}_`));
      const isLegacyDateOnlyStart =
        typeof entry.startedAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(entry.startedAt);
      if (!hasProgress && isLegacyDateOnlyStart) {
        map[id] = { startYmd: entry.startYmd, startedAt: null };
        changed = true;
      }
    });

    if (changed) {
      writeJson(STORAGE_KEYS.JOURNEY_STARTS, map);
    }
  } catch {
    /* ignore */
  }
}

export function getStoredJourneyStartDate(journeyId) {
  const entry = parseStartEntry(getAllJourneyStartDates()[journeyId]);
  return entry?.startYmd ?? null;
}

/** Default for the date picker only — not a started journey */
export function getDefaultPickerDate() {
  return formatYmd(new Date());
}

/** When going live, never start in the past — that would skip straight to Day 5+. */
export function resolveLiveStartYmd(ymd) {
  const today = getDefaultPickerDate();
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return today;
  return ymd < today ? today : ymd;
}

export function isJourneyDayToday(journeyId, dayNumber) {
  if (!isJourneyStarted(journeyId) || !dayNumber || dayNumber < 1) return false;
  const dayDate = getDateForDay(journeyId, dayNumber);
  if (!dayDate) return false;
  return startOfLocalDay(dayDate).getTime() === startOfLocalDay().getTime();
}

/** Sunday-first display order (JS getDay: 0=Sun … 6=Sat) */
export const WEEKDAY_DISPLAY_ORDER = [0, 1, 2, 3, 4, 5, 6];

function sundayOnOrBefore(date) {
  const d = startOfLocalDay(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

/** Calendar week (Sun–Sat) containing this journey day, anchored to the user's start date. */
export function getJourneyWeekNumber(journeyId, dayNumber) {
  if (!dayNumber || dayNumber < 1) return 0;
  const dayDate = getDateForDay(journeyId, dayNumber);
  const start = getJourneyStartDate(journeyId);
  if (!dayDate || !start) return Math.max(1, Math.ceil(dayNumber / 7));
  const firstSunday = sundayOnOrBefore(start);
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return (
    Math.floor((startOfLocalDay(dayDate).getTime() - firstSunday.getTime()) / msPerWeek) + 1
  );
}

/** In the start week only, hide weekday slots before the journey's first day. */
export function shouldShowPlanWeekday(journeyId, weekdayIndex, isStartWeek) {
  const start = getJourneyStartDate(journeyId);
  if (!start || !isStartWeek) return true;
  return weekdayIndex >= start.getDay();
}

export function getLiveDayLabel(journeyId, dayNumber) {
  const date = getDateForDay(journeyId, dayNumber);
  if (!date) return null;
  return WEEKDAY_FULL[date.getDay()];
}

export function getLiveDayYmd(journeyId, dayNumber) {
  const date = getDateForDay(journeyId, dayNumber);
  return date ? formatYmd(date) : null;
}

export function isDayAccessibleFor(journeyId, dayNumber) {
  const total = getJourneyTotalDays(journeyId);
  if (!total) return dayNumber >= 1;
  return dayNumber >= 1 && dayNumber <= total;
}

export function canCompleteDayFor(journeyId, dayNumber) {
  if (!isJourneyStarted(journeyId)) return false;
  const current = getCurrentDayNumber(journeyId);
  if (current == null) return dayNumber === 1;
  return dayNumber >= 1 && dayNumber <= current;
}

export function isDayPastFor(journeyId, dayNumber) {
  const dayDate = getDateForDay(journeyId, dayNumber);
  if (!dayDate) return false;
  return startOfLocalDay(dayDate) < startOfLocalDay();
}

export function isTomorrowFor(journeyId, dayNumber) {
  const current = getCurrentDayNumber(journeyId);
  if (current == null) return false;
  return dayNumber === current + 1;
}

/** Which content-library week contains this journey day number */
export function getContentWeekForDay(weeks, dayNumber) {
  if (!weeks?.length || !dayNumber || dayNumber < 1) return 1;
  const match = weeks.find((w) => w?.days?.some((d) => d?.dayNumber === dayNumber));
  return match?.weekNumber ?? 1;
}

export function hasJourneyStartDate(journeyId) {
  return isJourneyStarted(journeyId);
}

/**
 * Save a planned start date without beginning progress tracking.
 */
export function setJourneyPlannedStartDate(journeyId, ymd) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
    throw new Error('Start date must be YYYY-MM-DD');
  }
  const map = getAllJourneyStartDates();
  const existing = parseStartEntry(map[journeyId]);
  if (existing?.isStarted) {
    map[journeyId] = { startYmd: ymd, startedAt: existing.startedAt };
  } else {
    map[journeyId] = { startYmd: ymd, startedAt: null };
  }
  writeJson(STORAGE_KEYS.JOURNEY_STARTS, map);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('journey-start-updated', { detail: { journeyId, startDate: ymd, planned: true } })
    );
  }
  scheduleJourneyStateSync();
  return ymd;
}

/**
 * Begin the journey — stores start date and marks it active.
 * Does NOT update the deprecated global start date.
 */
export function startJourney(journeyId, ymd) {
  const map = getAllJourneyStartDates();
  const existing = parseStartEntry(map[journeyId]);
  const useYmd = resolveLiveStartYmd(ymd || existing?.startYmd || getDefaultPickerDate());
  return setJourneyStartDateFor(journeyId, useYmd);
}

/**
 * @deprecated Use isJourneyStarted — kept for existing imports
 */
export function hasJourneySchedule(journeyId) {
  return isJourneyStarted(journeyId);
}

/**
 * Persist start date for a journey and mark it as started.
 */
export function setJourneyStartDateFor(journeyId, ymd) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) {
    throw new Error('Start date must be YYYY-MM-DD');
  }
  const map = getAllJourneyStartDates();
  map[journeyId] = { startYmd: ymd, startedAt: new Date().toISOString() };
  writeJson(STORAGE_KEYS.JOURNEY_STARTS, map);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('journey-start-updated', { detail: { journeyId, startDate: ymd } })
    );
  }
  scheduleJourneyStateSync();
  return ymd;
}

/**
 * Clear this journey's schedule and all progress. Other journeys are untouched.
 * After reset, pick a new start date — that date becomes Day 1 when you start again.
 */
export function resetJourneySchedule(journeyId) {
  const map = getAllJourneyStartDates();
  if (journeyId && map[journeyId]) {
    delete map[journeyId];
    writeJson(STORAGE_KEYS.JOURNEY_STARTS, map);
  }

  try {
    wipeJourneyRuntimeData(journeyId);
  } catch {
    /* ignore */
  }

  dispatchJourneyWipeEvents(journeyId);
  scheduleJourneyStateSync();
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
  const start = getJourneyStartDate(journeyId) || startOfLocalDay();
  const total = getJourneyTotalDays(journeyId);
  if (total != null && dayNumber > total) return null;
  const target = new Date(start);
  target.setDate(start.getDate() + dayNumber - 1);
  return target;
}

export function getCurrentDayNumber(journeyId) {
  if (!isJourneyStarted(journeyId)) return null;
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
  if (!isJourneyStarted(journeyId)) return null;
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
  if (getJourneyState(journeyId) === 'not_started') return 0;
  if (getJourneyState(journeyId) === 'completed') return 100;
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
  const state = getJourneyState(journeyId);
  if (state === 'not_started') return 'unconfigured';
  if (state === 'completed') return 'after';
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
  const entry = parseStartEntry(getAllJourneyStartDates()[journeyId]);
  const state = getJourneyState(journeyId);
  const pickerYmd = getDefaultPickerDate();
  const previewEnd = addMonths(parseYmd(pickerYmd), JOURNEY_DURATION_MONTHS);

  if (!entry?.startYmd) {
    return {
      journeyId,
      configured: false,
      state: 'not_started',
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

  const startYmd = entry.startYmd;
  const end = addMonths(parseYmd(startYmd), JOURNEY_DURATION_MONTHS);
  const totalDays = daysInclusive(parseYmd(startYmd), end);

  if (state === 'not_started') {
    return {
      journeyId,
      configured: true,
      state: 'not_started',
      startYmd,
      startLabel: formatDisplayDate(startYmd),
      endYmd: formatYmd(end),
      endLabel: formatDisplayDate(end),
      masteryDeadlineLabel: formatDisplayDate(end),
      totalDays,
      currentDay: null,
      daysRemaining: null,
      timeElapsedPercent: 0,
      status: 'planned',
      monthsDuration: JOURNEY_DURATION_MONTHS,
    };
  }

  const currentDay = getCurrentDayNumber(journeyId);
  const daysRemaining = getDaysRemaining(journeyId);
  const timeElapsedPercent = getTimeElapsedPercent(journeyId);
  const status = getJourneyPhaseStatus(journeyId);

  return {
    journeyId,
    configured: true,
    state,
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

// ——— Start all journeys (settings) ———

export function getStartAllJourneysEnabled() {
  return readJson(STORAGE_KEYS.START_ALL_JOURNEYS, false) === true;
}

export function setStartAllJourneysEnabled(enabled) {
  writeJson(STORAGE_KEYS.START_ALL_JOURNEYS, !!enabled);
  if (enabled) {
    startAllConfiguredJourneys();
  }
}

/** Start every journey that has a planned schedule but is not yet active */
export function startAllConfiguredJourneys() {
  const map = getAllJourneyStartDates();
  let started = 0;
  Object.entries(map).forEach(([journeyId, raw]) => {
    const entry = parseStartEntry(raw);
    if (entry?.startYmd && !entry.isStarted) {
      startJourney(journeyId, entry.startYmd);
      started += 1;
    }
  });
  return started;
}

/** Summary for sidebar / dashboard */
export function getActiveJourneySummaries() {
  const map = getAllJourneyStartDates();
  return Object.keys(map)
    .filter((id) => isJourneyStarted(id))
    .map((id) => ({
      journeyId: id,
      currentDay: getCurrentDayNumber(id),
      totalDays: getJourneyTotalDays(id),
      state: getJourneyState(id),
    }))
    .filter((s) => s.state === 'active');
}

export function getSidebarDayLabel() {
  const active = getActiveJourneySummaries();
  if (active.length === 0) {
    const planned = Object.keys(getAllJourneyStartDates()).filter(
      (id) => hasPlannedSchedule(id) && !isJourneyStarted(id)
    );
    if (planned.length > 0) return 'Journey ready — press Start';
    return 'Ready to begin';
  }
  if (active.length === 1) {
    const { currentDay, totalDays } = active[0];
    if (currentDay != null && totalDays) return `Day ${currentDay} of ${totalDays}`;
    return 'Journey active';
  }
  return `${active.length} journeys active`;
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
  if (getJourneyState(journeyId) === 'not_started') {
    return { label: 'Start your journey', icon: '🎯', daysUntil: 0, progress: 0 };
  }
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