/**
 * Phase System for Aether — Software Engineering
 *
 * Onboarding: July 9–17, 2026
 * Phase 1 (Days 1–60): Frontend foundations
 * Phase 2 (Days 61–120): Backend + APIs
 * Phase 3 (Days 121–184): Build and ship capstone app
 *
 * Start Date: Saturday, July 18, 2026
 */

export const PHASE_CONSTANTS = {
  ONBOARDING_START: new Date(2026, 6, 9),
  START_DATE: new Date(2026, 6, 18),
  PHASE_1_DAYS: 60,
  PHASE_2_DAYS: 60,
  PHASE_3_DAYS: 64,
  TOTAL_DAYS: 184,
  TOTAL_PHASES: 3,
};

/**
 * @param {number} dayNumber - Current day number (1–184)
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
  if (dayNumber <= PHASE_CONSTANTS.TOTAL_DAYS) {
    return 3;
  }
  return null;
}

/**
 * @param {number} dayNumber - Current day number (1–184)
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
  if (phase === 2) {
    return dayNumber - PHASE_CONSTANTS.PHASE_1_DAYS;
  }
  return dayNumber - PHASE_CONSTANTS.PHASE_1_DAYS - PHASE_CONSTANTS.PHASE_2_DAYS;
}

/**
 * @param {string} discipline
 * @param {number} dayNumber
 * @returns {boolean}
 */
export function isDisciplineAvailable(discipline, dayNumber) {
  const phase = getCurrentPhase(dayNumber);
  if (!phase) {
    return false;
  }

  if (phase === 1) {
    return discipline === 'Frontend' || discipline === 'Mobile';
  }

  if (phase === 2) {
    return discipline === 'Backend' || discipline === 'APIs';
  }

  if (phase === 3) {
    return discipline === 'Comfort' || discipline === 'Backend' || discipline === 'Frontend';
  }

  return false;
}

/**
 * @param {number} phase - Phase number (1, 2, or 3)
 * @returns {string}
 */
export function getPhaseDescription(phase) {
  if (phase === 1) {
    return 'Frontend Foundations';
  }
  if (phase === 2) {
    return 'Backend + APIs';
  }
  if (phase === 3) {
    return 'Build & Ship Capstone';
  }
  return 'Unknown Phase';
}

/**
 * @param {number} dayNumber
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
  const phaseLength =
    phase === 1
      ? PHASE_CONSTANTS.PHASE_1_DAYS
      : phase === 2
        ? PHASE_CONSTANTS.PHASE_2_DAYS
        : PHASE_CONSTANTS.PHASE_3_DAYS;
  return phaseLength - phaseDay;
}

/**
 * @param {number} dayNumber
 * @returns {string}
 */
export function formatPhaseDayNumber(dayNumber) {
  const phase = getCurrentPhase(dayNumber);
  const phaseDay = getPhaseDayNumber(dayNumber);

  if (!phase || !phaseDay) {
    return 'Before Journey Start';
  }

  const phaseLength =
    phase === 1
      ? PHASE_CONSTANTS.PHASE_1_DAYS
      : phase === 2
        ? PHASE_CONSTANTS.PHASE_2_DAYS
        : PHASE_CONSTANTS.PHASE_3_DAYS;

  return `Day ${phaseDay} of ${phaseLength} (Phase ${phase})`;
}

/**
 * @param {number} dayNumber - Day number (1–184)
 * @returns {Date | null}
 */
export function getDateForDay(dayNumber) {
  if (!dayNumber || dayNumber < 1 || dayNumber > PHASE_CONSTANTS.TOTAL_DAYS) {
    return null;
  }

  const startDate = new Date(PHASE_CONSTANTS.START_DATE);
  const startLocal = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

  const targetDate = new Date(startLocal);
  targetDate.setDate(startLocal.getDate() + dayNumber - 1);

  return targetDate;
}

/**
 * @param {number} dayNumber
 * @returns {boolean}
 */
export function isPhase1(dayNumber) {
  return getCurrentPhase(dayNumber) === 1;
}

/**
 * @param {number} dayNumber
 * @returns {boolean}
 */
export function isPhase2(dayNumber) {
  return getCurrentPhase(dayNumber) === 2;
}

/**
 * @param {number} dayNumber
 * @returns {boolean}
 */
export function isPhase3(dayNumber) {
  return getCurrentPhase(dayNumber) === 3;
}
