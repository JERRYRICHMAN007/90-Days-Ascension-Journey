/**
 * Date utilities for the 90 Days Ascension Journey
 * 
 * Timeline:
 * - Week 0 (Jan 18-24): All days are Day 0 - Testing & Trials Week (No actual content)
 * - Day 1 = January 25, 2026 (Sunday) - First day of actual content
 * - Day 2 = January 26, 2026 (Monday) - Second day of actual content
 * - Week 1 (Days 1-7): January 25-31, 2026 - First week of actual content
 * - Week 2 (Days 8-14): February 1-7, 2026 - Second week of actual content
 * - Ascension Phase: Jan 18 - Apr 18, 2026 (90 days total)
 */

export const JOURNEY_CONSTANTS = {
  DAY_0_START: new Date('2026-01-18'), // Day 0 - Sunday, January 18, 2026
  ASCENSION_START: new Date('2026-01-19'), // Day 1 - Monday, January 19, 2026
  ASCENSION_END: new Date('2026-04-18'), // Day 90 - April 18, 2026
  TESTING_WEEK_START: new Date('2026-01-19'), // Start of testing week - Monday, January 19, 2026
  TESTING_WEEK_END: new Date('2026-01-24'), // End of testing week - Saturday, January 24, 2026
  ACTUAL_CONTENT_START: new Date('2026-01-25'), // Actual content starts - Sunday, January 25, 2026 (Day 1)
  TOTAL_DAYS: 90,
};

/**
 * Get the current phase of the journey
 * January 18, 2026 is Day 0 (preparation)
 * January 19, 2026 onwards is ascension phase (Day 1-90 - Monday)
 * @returns {'preparation' | 'ascension' | 'before' | 'after'}
 */
export function getCurrentPhase() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const day0Start = new Date(JOURNEY_CONSTANTS.DAY_0_START);
  day0Start.setHours(0, 0, 0, 0);
  
  const ascensionStart = new Date(JOURNEY_CONSTANTS.ASCENSION_START);
  ascensionStart.setHours(0, 0, 0, 0);
  
  const ascensionEnd = new Date(JOURNEY_CONSTANTS.ASCENSION_END);
  ascensionEnd.setHours(23, 59, 59, 999);
  
  if (today < day0Start) {
    return 'before';
  } else if (today.getTime() === day0Start.getTime()) {
    return 'preparation'; // Day 0
  } else if (today >= ascensionStart && today <= ascensionEnd) {
    return 'ascension';
  } else {
    return 'after';
  }
}

/**
 * Calculate the current day number (0-90)
 * Returns 0 for Day 0 (preparation), 1-90 for ascension phase, null if before or after
 * @returns {number | null}
 */
export function getCurrentDayNumber() {
  const phase = getCurrentPhase();
  
  // If before journey, return null
  if (phase === 'before') {
    return null;
  }
  
  // If on Day 0 (preparation), return 0
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
  
  // Week 0 (Jan 18-24): All days are Day 0 (testing week)
  // Day 1 starts on January 25, 2026 (Sunday - first day of actual content)
  const actualContentStart = new Date(JOURNEY_CONSTANTS.ACTUAL_CONTENT_START);
  actualContentStart.setHours(0, 0, 0, 0);
  
  // If before actual content start (Jan 25), return 0 (testing week)
  if (today < actualContentStart) {
    return 0;
  }
  
  // Day 1 = Jan 25, 2026 (actualContentStart)
  const diffTime = today - actualContentStart;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // If today is Jan 25, diffDays = 0, so return 1
  // If today is Jan 26, diffDays = 1, so return 2
  return diffDays + 1;
}

/**
 * Get the date for a specific day number (0-90)
 * Day 0 = January 18, 2026 (Sunday - preparation)
 * Day 1 = January 19, 2026 (Monday - first day)
 * @param {number} dayNumber - Day number (0-90)
 * @returns {Date | null}
 */
export function getDateForDay(dayNumber) {
  if (dayNumber === 0) {
    return new Date(JOURNEY_CONSTANTS.DAY_0_START);
  }
  
  if (dayNumber < 1 || dayNumber > JOURNEY_CONSTANTS.TOTAL_DAYS) {
    return null;
  }
  
  // Day 1 starts on January 19, 2026 (Monday)
  const ascensionStart = new Date(JOURNEY_CONSTANTS.ASCENSION_START);
  // Day 1 = Jan 19, 2026 (ascensionStart)
  // Day 2 = Jan 20, 2026 (ascensionStart + 1 day)
  ascensionStart.setDate(ascensionStart.getDate() + dayNumber - 1);
  
  return ascensionStart;
}

/**
 * Check if a day is in the testing/trials week (Days 1-6, Jan 19-24, 2026)
 * Week 1 is for testing only - no actual content
 * Actual content starts from Day 7 (Jan 25, 2026) onwards
 * @param {number} dayNumber - Day number (0-90)
 * @returns {boolean}
 */
export function isTestingWeek(dayNumber) {
  return dayNumber >= 1 && dayNumber <= 6;
}

/**
 * Check if actual content should be shown (Day 7+, Jan 25, 2026 onwards)
 * @param {number} dayNumber - Day number (0-90)
 * @returns {boolean}
 */
export function isActualContentDay(dayNumber) {
  return dayNumber >= 7;
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
    return 'Before Journey Start';
  }
  return `Day ${dayNumber} of ${JOURNEY_CONSTANTS.TOTAL_DAYS}`;
}

/**
 * Get days remaining in the journey
 * Day 0 doesn't count towards the 90 days
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
 * Day 0 doesn't count towards progress
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
 * Check if a day is accessible (all days are now unlocked)
 * Day 0 (Week 0 testing) is always accessible
 * @param {number} dayNumber - Day number to check (0-90)
 * @returns {boolean}
 */
export function isDayAccessible(dayNumber) {
  // All days are now unlocked and accessible
  // Day 0 (Week 0 testing week) is always accessible
  if (dayNumber === 0) {
    return true;
  }
  
  // All days from 1-90 are accessible (Day 1 starts from Jan 25)
  if (dayNumber >= 1 && dayNumber <= 90) {
    return true;
  }
  
  return false;
}

/**
 * Check if a day can be marked as complete
 * Day 0 (Week 0 testing) cannot be completed
 * Day 1+ (starting Jan 25) can be completed
 * @param {number} dayNumber - Day number to check (0-90)
 * @returns {boolean}
 */
export function canCompleteDay(dayNumber) {
  // Day 0 (Week 0 testing week) cannot be completed
  if (dayNumber === 0) {
    return false;
  }
  
  // All days from 1-90 can be completed (Day 1 starts from Jan 25)
  if (dayNumber >= 1 && dayNumber <= 90) {
    return true;
  }
  
  return false;
}

/**
 * Check if a day is tomorrow
 * @param {number} dayNumber - Day number to check (0-90)
 * @returns {boolean}
 */
export function isTomorrow(dayNumber) {
  const phase = getCurrentPhase();
  const currentDayNumber = getCurrentDayNumber();
  
  // If we're before the journey, Day 0 is tomorrow
  if (phase === 'before') {
    return dayNumber === 0;
  }
  
  // If we're on Day 0 (preparation), Day 1 is tomorrow
  if (phase === 'preparation') {
    return dayNumber === 1;
  }
  
  if (dayNumber < 1) {
    return false;
  }
  
  // If we're in ascension phase, check if it's the next day
  if (phase === 'ascension' && currentDayNumber) {
    return dayNumber === currentDayNumber + 1;
  }
  
  return false;
}

