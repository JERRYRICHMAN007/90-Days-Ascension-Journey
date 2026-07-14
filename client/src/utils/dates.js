/**
 * Date utilities for Aether
 *
 * Timeline:
 * - Onboarding: July 9–17, 2026 (9 days) — soft start, habit building
 * - Day 1: July 18, 2026 — The Real Deal begins
 * - Day 184: January 18, 2027 — Arc completion
 * - Phase 1 (Days 1–60), Phase 2 (Days 61–120), Phase 3 (Days 121–184)
 */

import { getCalendarWeekNumber } from '../data/journeys/shared.js';

const onboardingStartDate = new Date(2026, 6, 9); // July 9, 2026
const day1Date = new Date(2026, 6, 18); // July 18, 2026 — Day 1

export const JOURNEY_CONSTANTS = {
  ONBOARDING_START: onboardingStartDate,
  ONBOARDING_END: new Date(2026, 6, 17), // July 17, 2026
  ONBOARDING_DAYS: 9,
  ASCENSION_START: day1Date,
  PHASE_1_END: new Date(2026, day1Date.getMonth(), day1Date.getDate() + 59), // Day 60
  PHASE_2_END: new Date(2026, day1Date.getMonth(), day1Date.getDate() + 119), // Day 120
  PHASE_3_END: new Date(2027, 0, 18), // January 18, 2027 — Day 184
  TOTAL_DAYS: 184,
  PHASE_1_DAYS: 60,
  PHASE_2_DAYS: 60,
  PHASE_3_DAYS: 64,
};

/**
 * Get the current phase status of the journey
 * @returns {'before' | 'onboarding' | 'phase1' | 'phase2' | 'phase3' | 'after'}
 */
export function getCurrentPhaseStatus() {
  const today = new Date();
  const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const onboardingStart = new Date(JOURNEY_CONSTANTS.ONBOARDING_START);
  const onboardingStartLocal = new Date(
    onboardingStart.getFullYear(),
    onboardingStart.getMonth(),
    onboardingStart.getDate()
  );

  const onboardingEnd = new Date(JOURNEY_CONSTANTS.ONBOARDING_END);
  const onboardingEndLocal = new Date(
    onboardingEnd.getFullYear(),
    onboardingEnd.getMonth(),
    onboardingEnd.getDate(),
    23,
    59,
    59,
    999
  );

  const ascensionStart = new Date(JOURNEY_CONSTANTS.ASCENSION_START);
  const ascensionLocal = new Date(
    ascensionStart.getFullYear(),
    ascensionStart.getMonth(),
    ascensionStart.getDate()
  );

  const phase1End = new Date(JOURNEY_CONSTANTS.PHASE_1_END);
  const phase1EndLocal = new Date(
    phase1End.getFullYear(),
    phase1End.getMonth(),
    phase1End.getDate(),
    23,
    59,
    59,
    999
  );

  const phase2End = new Date(JOURNEY_CONSTANTS.PHASE_2_END);
  const phase2EndLocal = new Date(
    phase2End.getFullYear(),
    phase2End.getMonth(),
    phase2End.getDate(),
    23,
    59,
    59,
    999
  );

  const phase3End = new Date(JOURNEY_CONSTANTS.PHASE_3_END);
  const phase3EndLocal = new Date(
    phase3End.getFullYear(),
    phase3End.getMonth(),
    phase3End.getDate(),
    23,
    59,
    59,
    999
  );

  if (todayLocal < onboardingStartLocal) {
    return 'before';
  }
  if (todayLocal >= onboardingStartLocal && todayLocal <= onboardingEndLocal) {
    return 'onboarding';
  }
  if (todayLocal >= ascensionLocal && todayLocal <= phase1EndLocal) {
    return 'phase1';
  }
  if (todayLocal > phase1EndLocal && todayLocal <= phase2EndLocal) {
    return 'phase2';
  }
  if (todayLocal > phase2EndLocal && todayLocal <= phase3EndLocal) {
    return 'phase3';
  }
  return 'after';
}

/** @deprecated Use 'onboarding' — kept for compatibility */
export function isPreparationPhase() {
  return getCurrentPhaseStatus() === 'onboarding';
}

/**
 * Onboarding day number (1–9) during Jul 9–17, otherwise null
 * @returns {number | null}
 */
export function getOnboardingDayNumber() {
  if (getCurrentPhaseStatus() !== 'onboarding') {
    return null;
  }

  const today = new Date();
  const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const onboardingStart = new Date(JOURNEY_CONSTANTS.ONBOARDING_START);
  const startLocal = new Date(
    onboardingStart.getFullYear(),
    onboardingStart.getMonth(),
    onboardingStart.getDate()
  );

  const diffDays = Math.floor((todayLocal - startLocal) / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

/**
 * Calculate the current day number (0–184)
 * Day 0 = onboarding period (Jul 9–17)
 * Day 1 = July 18, 2026
 * @returns {number | null}
 */
export function getCurrentDayNumber() {
  const phaseStatus = getCurrentPhaseStatus();

  if (phaseStatus === 'before') {
    return null;
  }

  if (phaseStatus === 'onboarding') {
    return 0;
  }

  if (phaseStatus === 'after') {
    return null;
  }

  const today = new Date();
  const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const ascensionStart = new Date(JOURNEY_CONSTANTS.ASCENSION_START);
  const startLocal = new Date(
    ascensionStart.getFullYear(),
    ascensionStart.getMonth(),
    ascensionStart.getDate()
  );

  const diffTime = todayLocal - startLocal;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const dayNumber = diffDays + 1;

  if (dayNumber < 1 || dayNumber > JOURNEY_CONSTANTS.TOTAL_DAYS) {
    return null;
  }

  return dayNumber;
}

/**
 * Get the date for a specific day number (0–184)
 * Day 0 = onboarding period anchor (July 9, 2026)
 * Day 1 = July 18, 2026
 * @param {number} dayNumber
 * @returns {Date | null}
 */
export function getDateForDay(dayNumber) {
  if (dayNumber === 0) {
    const onboarding = new Date(JOURNEY_CONSTANTS.ONBOARDING_START);
    return new Date(onboarding.getFullYear(), onboarding.getMonth(), onboarding.getDate());
  }

  if (dayNumber < 1 || dayNumber > JOURNEY_CONSTANTS.TOTAL_DAYS) {
    return null;
  }

  const ascensionStart = new Date(JOURNEY_CONSTANTS.ASCENSION_START);
  const startLocal = new Date(
    ascensionStart.getFullYear(),
    ascensionStart.getMonth(),
    ascensionStart.getDate()
  );

  const targetDate = new Date(startLocal);
  targetDate.setDate(startLocal.getDate() + dayNumber - 1);

  return targetDate;
}

/**
 * Get arc month (1–6) for a journey day
 * @param {number} dayNumber - Day number (1–184)
 * @returns {number}
 */
export function getArcMonth(dayNumber) {
  if (!dayNumber || dayNumber < 1) return 0;
  if (dayNumber <= 31) return 1;
  if (dayNumber <= 62) return 2;
  if (dayNumber <= 92) return 3;
  if (dayNumber <= 123) return 4;
  if (dayNumber <= 154) return 5;
  return 6;
}

/**
 * @param {number} dayNumber
 * @returns {boolean}
 */
export function isTestingWeek(dayNumber) {
  return false;
}

/**
 * @param {number} dayNumber
 * @returns {boolean}
 */
export function isActualContentDay(dayNumber) {
  return dayNumber >= 1;
}

/**
 * @param {number} dayNumber
 * @returns {string}
 */
export function formatDayNumber(dayNumber) {
  if (dayNumber === 0) {
    const onboardingDay = getOnboardingDayNumber();
    if (onboardingDay) {
      return `Onboarding Day ${onboardingDay} of ${JOURNEY_CONSTANTS.ONBOARDING_DAYS}`;
    }
    return 'Onboarding — Soft Start';
  }
  if (!dayNumber || dayNumber < 1) {
    return 'Before Journey Start';
  }
  return `Day ${dayNumber} of ${JOURNEY_CONSTANTS.TOTAL_DAYS}`;
}

/**
 * @returns {number | null}
 */
export function getDaysRemaining() {
  const currentDay = getCurrentDayNumber();
  if (currentDay === null) {
    return null;
  }
  if (currentDay === 0) {
    return JOURNEY_CONSTANTS.TOTAL_DAYS;
  }
  return JOURNEY_CONSTANTS.TOTAL_DAYS - currentDay;
}

/**
 * @returns {number}
 */
export function getJourneyProgress() {
  return 0;
}

/**
 * @param {Date | string} date
 * @returns {boolean}
 */
export function isInJourney(date) {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  const checkLocal = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());

  const onboardingStart = new Date(JOURNEY_CONSTANTS.ONBOARDING_START);
  const startLocal = new Date(
    onboardingStart.getFullYear(),
    onboardingStart.getMonth(),
    onboardingStart.getDate()
  );

  const phase3End = new Date(JOURNEY_CONSTANTS.PHASE_3_END);
  const endLocal = new Date(
    phase3End.getFullYear(),
    phase3End.getMonth(),
    phase3End.getDate(),
    23,
    59,
    59,
    999
  );

  return checkLocal >= startLocal && checkLocal <= endLocal;
}

/**
 * @param {number} dayNumber
 * @returns {number}
 */
export function getWeekNumber(dayNumber) {
  return getCalendarWeekNumber(dayNumber);
}

/**
 * @param {number} dayNumber
 * @returns {boolean}
 */
export function isDayAccessible(dayNumber) {
  if (dayNumber === 0) {
    return true;
  }
  return dayNumber >= 1 && dayNumber <= JOURNEY_CONSTANTS.TOTAL_DAYS;
}

/**
 * @param {number} dayNumber
 * @returns {boolean}
 */
export function canCompleteDay(dayNumber) {
  if (dayNumber === 0) {
    return false;
  }
  return dayNumber >= 1 && dayNumber <= JOURNEY_CONSTANTS.TOTAL_DAYS;
}

/**
 * @param {number} dayNumber
 * @returns {boolean}
 */
export function isDayPast(dayNumber) {
  const today = new Date();
  const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dayDate = getDateForDay(dayNumber);
  if (!dayDate) return false;
  const dayLocal = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());
  return dayLocal < todayLocal;
}

/**
 * @param {number} dayNumber
 * @returns {boolean}
 */
export function isTomorrow(dayNumber) {
  const phaseStatus = getCurrentPhaseStatus();
  const currentDayNumber = getCurrentDayNumber();

  if (phaseStatus === 'before') {
    return dayNumber === 0;
  }

  if (phaseStatus === 'onboarding') {
    return dayNumber === 1;
  }

  if (dayNumber < 1) {
    return false;
  }

  if (
    (phaseStatus === 'phase1' || phaseStatus === 'phase2' || phaseStatus === 'phase3') &&
    currentDayNumber
  ) {
    return dayNumber === currentDayNumber + 1;
  }

  return false;
}
