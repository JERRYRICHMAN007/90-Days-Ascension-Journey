/**
 * Date utilities for the 90 Days Ascension Journey
 * 
 * Timeline:
 * - Preparation Phase: Dec 21-31, 2025
 * - Day 0 (Preparation): January 1, 2026
 * - Ascension Phase: Jan 2 - Mar 31, 2026 (90 days)
 * - Day 1 = January 2, 2026
 */

export const JOURNEY_CONSTANTS = {
  PREP_START: new Date('2025-12-21'),
  ASCENSION_START: new Date('2026-01-01'),
  ASCENSION_END: new Date('2026-03-31'),
  TOTAL_DAYS: 90,
};

/**
 * Get the current phase of the journey
 * January 1, 2026 is preparation phase (Day 0)
 * January 2, 2026 onwards is ascension phase (Day 1-90)
 * @returns {'preparation' | 'ascension' | 'before' | 'after'}
 */
export function getCurrentPhase() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const prepStart = new Date(JOURNEY_CONSTANTS.PREP_START);
  prepStart.setHours(0, 0, 0, 0);
  
  const ascensionStart = new Date(JOURNEY_CONSTANTS.ASCENSION_START);
  ascensionStart.setHours(0, 0, 0, 0);
  
  // January 2, 2026 is when ascension actually starts (Day 1)
  const ascensionActualStart = new Date('2026-01-02');
  ascensionActualStart.setHours(0, 0, 0, 0);
  
  const ascensionEnd = new Date(JOURNEY_CONSTANTS.ASCENSION_END);
  ascensionEnd.setHours(23, 59, 59, 999);
  
  if (today < prepStart) {
    return 'before';
  } else if (today >= prepStart && today < ascensionActualStart) {
    // Preparation phase includes January 1, 2026 (Day 0)
    return 'preparation';
  } else if (today >= ascensionActualStart && today <= ascensionEnd) {
    return 'ascension';
  } else {
    return 'after';
  }
}

/**
 * Calculate the current day number (0-90)
 * Returns 0 for preparation phase (January 1, 2026), 1-90 for ascension phase, null if after
 * @returns {number | null}
 */
export function getCurrentDayNumber() {
  const phase = getCurrentPhase();
  
  // If before preparation phase, return 0
  if (phase === 'before') {
    return 0;
  }
  
  // If in preparation phase (includes January 1, 2026), return 0
  if (phase === 'preparation') {
    return 0;
  }
  
  // If after ascension phase, return null
  if (phase === 'after') {
    return null;
  }
  
  // In ascension phase - calculate day number
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const ascensionStart = new Date(JOURNEY_CONSTANTS.ASCENSION_START);
  ascensionStart.setHours(0, 0, 0, 0);
  
  const diffTime = today - ascensionStart;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Day 1 = Jan 2, 2026 (ASCENSION_START + 1 day)
  // So if today is Jan 1, we're in preparation (handled above)
  // If today is Jan 2, diffDays = 1, so return 1
  return diffDays + 1;
}

/**
 * Get the date for a specific day number (1-90)
 * Day 0 = January 1, 2026 (preparation)
 * Day 1 = January 2, 2026 (first actual day)
 * @param {number} dayNumber - Day number (1-90)
 * @returns {Date | null}
 */
export function getDateForDay(dayNumber) {
  if (dayNumber < 1 || dayNumber > JOURNEY_CONSTANTS.TOTAL_DAYS) {
    return null;
  }
  
  const ascensionStart = new Date(JOURNEY_CONSTANTS.ASCENSION_START);
  // Day 1 = Jan 2, 2026 (ASCENSION_START + 1 day)
  // Day 2 = Jan 3, 2026 (ASCENSION_START + 2 days)
  ascensionStart.setDate(ascensionStart.getDate() + dayNumber);
  
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
 * @param {number} dayNumber - Day number (0-90)
 * @returns {string}
 */
export function formatDayNumber(dayNumber) {
  if (dayNumber === 0) {
    return 'Day 0 - Preparation';
  }
  if (!dayNumber || dayNumber < 1) {
    return 'Preparation Phase';
  }
  return `Day ${dayNumber} of ${JOURNEY_CONSTANTS.TOTAL_DAYS}`;
}

/**
 * Get days remaining in the journey
 * Day 0 (preparation) doesn't count towards the 90 days
 * @returns {number | null}
 */
export function getDaysRemaining() {
  const currentDay = getCurrentDayNumber();
  if (currentDay === null) {
    return null;
  }
  // Day 0 is preparation, so if we're on Day 0, all 90 days are remaining
  if (currentDay === 0) {
    return JOURNEY_CONSTANTS.TOTAL_DAYS;
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

/**
 * Check if a day is accessible (today or tomorrow only)
 * Day 0 is always accessible
 * @param {number} dayNumber - Day number to check (0-90)
 * @returns {boolean}
 */
export function isDayAccessible(dayNumber) {
  // Day 0 (preparation) is always accessible
  if (dayNumber === 0) {
    return true;
  }
  
  const phase = getCurrentPhase();
  const currentDayNumber = getCurrentDayNumber();
  
  // If we're in preparation phase or before, Day 1 (tomorrow from Day 0) is accessible
  // This handles the case when today is January 1, 2026 (Day 0) and tomorrow is January 2, 2026 (Day 1)
  if (phase === 'preparation' || phase === 'before') {
    // Day 1 is accessible when we're in preparation phase (Day 0)
    // This allows users to preview Day 1 when on Day 0
    return dayNumber === 1;
  }
  
  // If we're in ascension phase, allow today and tomorrow
  if (phase === 'ascension' && currentDayNumber) {
    // Day is accessible if it's today or tomorrow
    return dayNumber <= currentDayNumber + 1;
  }
  
  // Otherwise, only Day 0 is accessible
  return false;
}

/**
 * Check if a day can be marked as complete (today only)
 * @param {number} dayNumber - Day number to check (0-90)
 * @returns {boolean}
 */
export function canCompleteDay(dayNumber) {
  // Day 0 cannot be completed
  if (dayNumber === 0) {
    return false;
  }
  
  const phase = getCurrentPhase();
  const currentDayNumber = getCurrentDayNumber();
  
  // Can only complete if in ascension phase and it's today
  if (phase !== 'ascension' || !currentDayNumber) {
    return false;
  }
  
  return dayNumber === currentDayNumber;
}

/**
 * Check if a day is tomorrow
 * @param {number} dayNumber - Day number to check (0-90)
 * @returns {boolean}
 */
export function isTomorrow(dayNumber) {
  if (dayNumber === 0) {
    return false;
  }
  
  const phase = getCurrentPhase();
  const currentDayNumber = getCurrentDayNumber();
  
  // If we're in preparation phase or before, and viewing Day 0, tomorrow is Day 1 (January 2, 2026)
  if (phase === 'preparation' || phase === 'before') {
    return dayNumber === 1;
  }
  
  // If we're in ascension phase, check if it's the next day
  if (phase === 'ascension' && currentDayNumber) {
    return dayNumber === currentDayNumber + 1;
  }
  
  return false;
}

