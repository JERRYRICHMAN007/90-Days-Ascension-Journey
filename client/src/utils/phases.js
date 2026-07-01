/**
 * Phase System for Forge90
 * 
 * Day 0 = Tuesday, June 30, 2026 (Preparation)
 * Phase 1 (Days 1-90): Mobile Engineering + Frontend Engineering only
 * Phase 2 (Days 91-180): Backend Engineering + WordPress
 * 
 * Start Date: Wednesday, July 1, 2026
 */

// Use local date constructors to avoid timezone issues
// Month is 0-indexed: 0 = January, 1 = February, 2 = March, etc.
export const PHASE_CONSTANTS = {
  DAY_0_START: new Date(2026, 5, 30), // Day 0 - Tuesday, June 30, 2026
  START_DATE: new Date(2026, 6, 1), // Day 1 - Wednesday, July 1, 2026
  PHASE_1_DAYS: 90,
  PHASE_2_DAYS: 90,
  TOTAL_PHASES: 2,
};

/**
 * Get current phase number (1 or 2)
 * @param {number} dayNumber - Current day number (1-180)
 * @returns {number | null}
 */
export function getCurrentPhase(dayNumber) {
  if (!dayNumber || dayNumber < 1) {
    return null;
  }
  if (dayNumber <= PHASE_CONSTANTS.PHASE_1_DAYS) {
    return 1;
  }
  if (dayNumber <= PHASE_CONSTANTS.PHASE_1_DAYS + PHASE_CONSTANTS.PHASE_2_DAYS) {
    return 2;
  }
  return null;
}

/**
 * Get phase day number (1-90 within current phase)
 * @param {number} dayNumber - Current day number (1-180)
 * @returns {number | null}
 */
export function getPhaseDayNumber(dayNumber) {
  if (!dayNumber || dayNumber < 1) {
    return null;
  }
  const phase = getCurrentPhase(dayNumber);
  if (!phase) {
    return null;
  }
  if (phase === 1) {
    return dayNumber;
  }
  // Phase 2: dayNumber 91 = phase day 1, dayNumber 92 = phase day 2, etc.
  return dayNumber - PHASE_CONSTANTS.PHASE_1_DAYS;
}

/**
 * Check if a discipline is available in current phase
 * @param {string} discipline - Discipline name (Mobile, Frontend, Backend, WordPress)
 * @param {number} dayNumber - Current day number
 * @returns {boolean}
 */
export function isDisciplineAvailable(discipline, dayNumber) {
  const phase = getCurrentPhase(dayNumber);
  if (!phase) {
    return false;
  }
  
  // Phase 1: Only Mobile and Frontend
  if (phase === 1) {
    return discipline === 'Mobile' || discipline === 'Frontend';
  }
  
  // Phase 2: Only Backend and WordPress
  if (phase === 2) {
    return discipline === 'Backend' || discipline === 'WordPress';
  }
  
  return false;
}

/**
 * Get phase description
 * @param {number} phase - Phase number (1 or 2)
 * @returns {string}
 */
export function getPhaseDescription(phase) {
  if (phase === 1) {
    return 'Mobile Engineering + Frontend Engineering';
  }
  if (phase === 2) {
    return 'Backend Engineering + WordPress';
  }
  return 'Unknown Phase';
}

/**
 * Get days remaining in current phase
 * @param {number} dayNumber - Current day number
 * @returns {number | null}
 */
export function getPhaseDaysRemaining(dayNumber) {
  const phase = getCurrentPhase(dayNumber);
  if (!phase) {
    return null;
  }
  const phaseDay = getPhaseDayNumber(dayNumber);
  if (!phaseDay) {
    return null;
  }
  return PHASE_CONSTANTS.PHASE_1_DAYS - phaseDay;
}

/**
 * Format phase day number with "Day X of 90 (Phase Y)"
 * @param {number} dayNumber - Current day number
 * @returns {string}
 */
export function formatPhaseDayNumber(dayNumber) {
  const phase = getCurrentPhase(dayNumber);
  const phaseDay = getPhaseDayNumber(dayNumber);
  
  if (!phase || !phaseDay) {
    return 'Before Journey Start';
  }
  
  return `Day ${phaseDay} of 90 (Phase ${phase})`;
}

/**
 * Get date for a specific day number
 * @param {number} dayNumber - Day number (1-180)
 * @returns {Date | null}
 */
export function getDateForDay(dayNumber) {
  if (!dayNumber || dayNumber < 1 || dayNumber > 180) {
    return null;
  }
  
  // Use local date components to avoid timezone issues
  const startDate = new Date(PHASE_CONSTANTS.START_DATE);
  const startLocal = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  
  const targetDate = new Date(startLocal);
  targetDate.setDate(startLocal.getDate() + dayNumber - 1);
  
  return targetDate;
}

/**
 * Check if we're in Phase 1
 * @param {number} dayNumber - Current day number
 * @returns {boolean}
 */
export function isPhase1(dayNumber) {
  return getCurrentPhase(dayNumber) === 1;
}

/**
 * Check if we're in Phase 2
 * @param {number} dayNumber - Current day number
 * @returns {boolean}
 */
export function isPhase2(dayNumber) {
  return getCurrentPhase(dayNumber) === 2;
}


