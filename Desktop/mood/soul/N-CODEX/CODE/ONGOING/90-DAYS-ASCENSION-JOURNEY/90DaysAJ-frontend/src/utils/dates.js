/**
 * Date utilities for the 90 Days Ascension Journey
 * 
 * Timeline:
 * - Preparation Phase: Dec 21-31, 2025
 * - Ascension Phase: Jan 1 - Mar 31, 2026 (90 days)
 * - Day 1 = January 1, 2026
 */

export const JOURNEY_CONSTANTS = {
  PREP_START: new Date('2025-12-21'),
  ASCENSION_START: new Date('2026-01-01'),
  ASCENSION_END: new Date('2026-03-31'),
  TOTAL_DAYS: 90,
};

/**
 * Get the current phase of the journey
 * @returns {'preparation' | 'ascension' | 'before' | 'after'}
 */
export function getCurrentPhase() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const prepStart = new Date(JOURNEY_CONSTANTS.PREP_START);
  prepStart.setHours(0, 0, 0, 0);
  
  const ascensionStart = new Date(JOURNEY_CONSTANTS.ASCENSION_START);
  ascensionStart.setHours(0, 0, 0, 0);
  
  const ascensionEnd = new Date(JOURNEY_CONSTANTS.ASCENSION_END);
  ascensionEnd.setHours(23, 59, 59, 999);
  
  if (today < prepStart) {
    return 'before';
  } else if (today >= prepStart && today < ascensionStart) {
    return 'preparation';
  } else if (today >= ascensionStart && today <= ascensionEnd) {
    return 'ascension';
  } else {
    return 'after';
  }
}

/**
 * Calculate the current day number (1-90)
 * Returns 0 if before ascension phase, null if after
 * @returns {number | null}
 */
export function getCurrentDayNumber() {
  const phase = getCurrentPhase();
  
  if (phase !== 'ascension') {
    return phase === 'before' ? 0 : null;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const ascensionStart = new Date(JOURNEY_CONSTANTS.ASCENSION_START);
  ascensionStart.setHours(0, 0, 0, 0);
  
  const diffTime = today - ascensionStart;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1; // Day 1 = Jan 1
}

/**
 * Get the date for a specific day number (1-90)
 * @param {number} dayNumber - Day number (1-90)
 * @returns {Date | null}
 */
export function getDateForDay(dayNumber) {
  if (dayNumber < 1 || dayNumber > JOURNEY_CONSTANTS.TOTAL_DAYS) {
    return null;
  }
  
  const ascensionStart = new Date(JOURNEY_CONSTANTS.ASCENSION_START);
  ascensionStart.setDate(ascensionStart.getDate() + (dayNumber - 1));
  
  return ascensionStart;
}

/**
 * Get preparation day number (1-11 for Dec 21-31)
 * Returns 0 if not in preparation phase
 * @returns {number}
 */
export function getPreparationDayNumber() {
  const phase = getCurrentPhase();
  
  if (phase !== 'preparation') {
    return 0;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const prepStart = new Date(JOURNEY_CONSTANTS.PREP_START);
  prepStart.setHours(0, 0, 0, 0);
  
  const diffTime = today - prepStart;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1; // Day 1 = Dec 21
}

/**
 * Format day number with "Day X of 90" format
 * @param {number} dayNumber - Day number (1-90)
 * @returns {string}
 */
export function formatDayNumber(dayNumber) {
  if (!dayNumber || dayNumber < 1) {
    return 'Preparation Phase';
  }
  return `Day ${dayNumber} of ${JOURNEY_CONSTANTS.TOTAL_DAYS}`;
}

/**
 * Get days remaining in the journey
 * @returns {number | null}
 */
export function getDaysRemaining() {
  const currentDay = getCurrentDayNumber();
  if (currentDay === null || currentDay === 0) {
    return null;
  }
  return JOURNEY_CONSTANTS.TOTAL_DAYS - currentDay;
}

/**
 * Get progress percentage (0-100)
 * @returns {number}
 */
export function getJourneyProgress() {
  const currentDay = getCurrentDayNumber();
  if (currentDay === null || currentDay === 0) {
    return 0;
  }
  return Math.round((currentDay / JOURNEY_CONSTANTS.TOTAL_DAYS) * 100);
}

/**
 * Check if a specific date is in the ascension phase
 * @param {Date | string} date - Date to check
 * @returns {boolean}
 */
export function isInAscensionPhase(date) {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  checkDate.setHours(0, 0, 0, 0);
  
  const ascensionStart = new Date(JOURNEY_CONSTANTS.ASCENSION_START);
  ascensionStart.setHours(0, 0, 0, 0);
  
  const ascensionEnd = new Date(JOURNEY_CONSTANTS.ASCENSION_END);
  ascensionEnd.setHours(23, 59, 59, 999);
  
  return checkDate >= ascensionStart && checkDate <= ascensionEnd;
}

/**
 * Get week number for a day number (1-13)
 * @param {number} dayNumber - Day number (1-90)
 * @returns {number}
 */
export function getWeekNumber(dayNumber) {
  if (!dayNumber || dayNumber < 1) {
    return 0;
  }
  return Math.ceil(dayNumber / 7);
}

