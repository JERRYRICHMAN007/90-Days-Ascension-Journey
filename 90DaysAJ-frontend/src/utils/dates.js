/**
 * Date utilities for the 90 Days Ascension Journey
 * 
 * Updated Timeline:
 * - Day 0 = Saturday, February 7, 2026 - Preparation Day
 * - Day 1 = Sunday, February 8, 2026 - First day of journey (Week 1 starts)
 * - Phase 1 (Days 1-90): Mobile Engineering + Frontend Engineering only
 * - Phase 2 (Days 91-180): Backend Engineering + WordPress
 * - Total Journey: 180 days (90 days per phase)
 */

// Use local date constructors to avoid timezone issues
// Month is 0-indexed: 0 = January, 1 = February, etc.
// All journeys start from February 8, 2026
const day0Date = new Date(2026, 1, 7); // Day 0 - Saturday, February 7, 2026 - Preparation Day
const day1Date = new Date(2026, 1, 8); // Day 1 - Sunday, February 8, 2026 - First day of journey

export const JOURNEY_CONSTANTS = {
  DAY_0_START: day0Date, // Day 0 - Saturday, February 7, 2026 - Preparation Day
  ASCENSION_START: day1Date, // Day 1 - Sunday, February 8, 2026 - First day of journey
  PHASE_1_END: new Date(2026, day1Date.getMonth(), day1Date.getDate() + 89), // Day 90
  PHASE_2_END: new Date(2026, day1Date.getMonth(), day1Date.getDate() + 179), // Day 180
  TOTAL_DAYS: 180, // 90 days per phase, 2 phases total
  PHASE_1_DAYS: 90,
  PHASE_2_DAYS: 90,
};

/**
 * Get the current phase status of the journey
 * @returns {'before' | 'preparation' | 'phase1' | 'phase2' | 'after'}
 */
export function getCurrentPhaseStatus() {
  // Use local date components to avoid timezone issues
  const today = new Date();
  const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const day0Start = new Date(JOURNEY_CONSTANTS.DAY_0_START);
  const day0Local = new Date(day0Start.getFullYear(), day0Start.getMonth(), day0Start.getDate());
  
  const ascensionStart = new Date(JOURNEY_CONSTANTS.ASCENSION_START);
  const ascensionLocal = new Date(ascensionStart.getFullYear(), ascensionStart.getMonth(), ascensionStart.getDate());
  
  const phase1End = new Date(JOURNEY_CONSTANTS.PHASE_1_END);
  const phase1EndLocal = new Date(phase1End.getFullYear(), phase1End.getMonth(), phase1End.getDate(), 23, 59, 59, 999);
  
  const phase2End = new Date(JOURNEY_CONSTANTS.PHASE_2_END);
  const phase2EndLocal = new Date(phase2End.getFullYear(), phase2End.getMonth(), phase2End.getDate(), 23, 59, 59, 999);
  
  if (todayLocal < day0Local) {
    return 'before';
  } else if (todayLocal.getTime() === day0Local.getTime()) {
    return 'preparation'; // Day 0
  } else if (todayLocal >= ascensionLocal && todayLocal <= phase1EndLocal) {
    return 'phase1';
  } else if (todayLocal > phase1EndLocal && todayLocal <= phase2EndLocal) {
    return 'phase2';
  } else {
    return 'after';
  }
}

/**
 * Calculate the current day number (0-180)
 * Day 0 = Saturday, February 7, 2026 (Preparation)
 * Day 1 = Sunday, February 8, 2026
 * Days 1-90 = Phase 1, Days 91-180 = Phase 2
 * @returns {number | null}
 */
export function getCurrentDayNumber() {
  const phaseStatus = getCurrentPhaseStatus();
  
  // If before journey, return null
  if (phaseStatus === 'before') {
    return null;
  }
  
  // If on Day 0 (preparation), return 0
  if (phaseStatus === 'preparation') {
    return 0;
  }
  
  // If after journey, return null
  if (phaseStatus === 'after') {
    return null;
  }
  
  // Use local date components to avoid timezone issues
  const today = new Date();
  const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  
  const ascensionStart = new Date(JOURNEY_CONSTANTS.ASCENSION_START);
  const startLocal = new Date(ascensionStart.getFullYear(), ascensionStart.getMonth(), ascensionStart.getDate());
  
  const diffTime = todayLocal - startLocal;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Day 1 = Feb 2, 2026 (ascensionStart)
  // If today is Feb 2, diffDays = 0, so return 1
  // If today is Feb 3, diffDays = 1, so return 2
  const dayNumber = diffDays + 1;
  
  // Ensure day number is within valid range (1-180)
  if (dayNumber < 1 || dayNumber > JOURNEY_CONSTANTS.TOTAL_DAYS) {
    return null;
  }
  
  return dayNumber;
}

/**
 * Get the date for a specific day number (0-180)
 * Day 0 = Saturday, February 7, 2026 (Preparation)
 * Day 1 = Sunday, February 8, 2026
 * @param {number} dayNumber - Day number (0-180)
 * @returns {Date | null}
 */
export function getDateForDay(dayNumber) {
  if (dayNumber === 0) {
    const day0 = new Date(JOURNEY_CONSTANTS.DAY_0_START);
    // Ensure local date components
    return new Date(day0.getFullYear(), day0.getMonth(), day0.getDate());
  }
  
  if (dayNumber < 1 || dayNumber > JOURNEY_CONSTANTS.TOTAL_DAYS) {
    return null;
  }
  
  // Day 1 starts on February 2, 2026 (Monday)
  const ascensionStart = new Date(JOURNEY_CONSTANTS.ASCENSION_START);
  // Use local date components to avoid timezone issues
  const startLocal = new Date(ascensionStart.getFullYear(), ascensionStart.getMonth(), ascensionStart.getDate());
  
  // Day 1 = Feb 2, 2026 (ascensionStart)
  // Day 2 = Feb 3, 2026 (ascensionStart + 1 day)
  const targetDate = new Date(startLocal);
  targetDate.setDate(startLocal.getDate() + dayNumber - 1);
  
  return targetDate;
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
 * Format day number with "Day X of 180" format
 * @param {number} dayNumber - Day number (0-180)
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
 * Day 0 doesn't count towards the 180 days
 * @returns {number | null}
 */
export function getDaysRemaining() {
  const currentDay = getCurrentDayNumber();
  if (currentDay === null) {
    return null;
  }
  // Day 0 is preparation, so if we're on Day 0, all 180 days are remaining
  if (currentDay === 0) {
    return JOURNEY_CONSTANTS.TOTAL_DAYS;
  }
  return JOURNEY_CONSTANTS.TOTAL_DAYS - currentDay;
}

/**
 * Get progress percentage (0-100)
 * DEPRECATED: This function is time-based and should not be used.
 * Use calculateSessionBasedProgress from progressTracking.js instead.
 * 
 * This function now always returns 0 to prevent time-based progress.
 * Progress must be earned through session completion.
 * @returns {number}
 */
export function getJourneyProgress() {
  // Always return 0 - progress must be earned through completion, not time
  return 0;
}

/**
 * Check if a specific date is in the journey
 * @param {Date | string} date - Date to check
 * @returns {boolean}
 */
export function isInJourney(date) {
  const checkDate = typeof date === 'string' ? new Date(date) : date;
  // Use local date components to avoid timezone issues
  const checkLocal = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
  
  const ascensionStart = new Date(JOURNEY_CONSTANTS.ASCENSION_START);
  const startLocal = new Date(ascensionStart.getFullYear(), ascensionStart.getMonth(), ascensionStart.getDate());
  
  const phase2End = new Date(JOURNEY_CONSTANTS.PHASE_2_END);
  const endLocal = new Date(phase2End.getFullYear(), phase2End.getMonth(), phase2End.getDate(), 23, 59, 59, 999);
  
  return checkLocal >= startLocal && checkLocal <= endLocal;
}

/**
 * Get week number for a day number (1-26 for 180 days)
 * @param {number} dayNumber - Day number (1-180)
 * @returns {number}
 */
export function getWeekNumber(dayNumber) {
  if (!dayNumber || dayNumber < 1) {
    return 0;
  }
  return Math.ceil(dayNumber / 7);
}

/**
 * Check if a day is accessible
 * @param {number} dayNumber - Day number to check (0-180)
 * @returns {boolean}
 */
export function isDayAccessible(dayNumber) {
  // Day 0 (preparation) is always accessible
  if (dayNumber === 0) {
    return true;
  }
  
  // All days from 1-180 are accessible
  if (dayNumber >= 1 && dayNumber <= JOURNEY_CONSTANTS.TOTAL_DAYS) {
    return true;
  }
  
  return false;
}

/**
 * Check if a day can be marked as complete
 * Day 0 (preparation) cannot be completed
 * @param {number} dayNumber - Day number to check (0-180)
 * @returns {boolean}
 */
export function canCompleteDay(dayNumber) {
  // Day 0 (preparation) cannot be completed
  if (dayNumber === 0) {
    return false;
  }
  
  // All days from 1-180 can be completed
  if (dayNumber >= 1 && dayNumber <= JOURNEY_CONSTANTS.TOTAL_DAYS) {
    return true;
  }
  
  return false;
}

/**
 * Check if a day is tomorrow
 * @param {number} dayNumber - Day number to check (0-180)
 * @returns {boolean}
 */
export function isTomorrow(dayNumber) {
  const phaseStatus = getCurrentPhaseStatus();
  const currentDayNumber = getCurrentDayNumber();
  
  // If we're before the journey, Day 0 is tomorrow
  if (phaseStatus === 'before') {
    return dayNumber === 0;
  }
  
  // If we're on Day 0 (preparation), Day 1 is tomorrow
  if (phaseStatus === 'preparation') {
    return dayNumber === 1;
  }
  
  if (dayNumber < 1) {
    return false;
  }
  
  // If we're in journey, check if it's the next day
  if ((phaseStatus === 'phase1' || phaseStatus === 'phase2') && currentDayNumber) {
    return dayNumber === currentDayNumber + 1;
  }
  
  return false;
}

