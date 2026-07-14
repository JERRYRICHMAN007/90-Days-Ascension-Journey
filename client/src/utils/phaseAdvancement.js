/**
 * Phase Advancement Logic — Aether
 *
 * Phase advancement is based on completion thresholds, not just day count.
 * Software Engineering: 3 phases (60 + 60 + 64 days).
 */

import { calculateSessionBasedProgress } from './progressTracking';

const PHASE_CONSTANTS = {
  PHASE_1_DAYS: 60,
  PHASE_2_DAYS: 60,
  PHASE_3_DAYS: 64,
};

const PHASE_DAY_RANGES = [
  { phase: 1, start: 1, days: PHASE_CONSTANTS.PHASE_1_DAYS },
  { phase: 2, start: 61, days: PHASE_CONSTANTS.PHASE_2_DAYS },
  { phase: 3, start: 121, days: PHASE_CONSTANTS.PHASE_3_DAYS },
];

function getPhaseWeekSlice(weeks, phase) {
  const range = PHASE_DAY_RANGES.find((entry) => entry.phase === phase);
  if (!range) return [];

  const startWeek = Math.floor((range.start - 1) / 7);
  const endWeek = Math.ceil((range.start + range.days - 1) / 7);
  return weeks.slice(startWeek, endWeek);
}

/**
 * @param {number} phase - Phase number (1, 2, or 3)
 * @returns {object | null}
 */
export function getPhaseCompletionThreshold(phase) {
  const days =
    phase === 1
      ? PHASE_CONSTANTS.PHASE_1_DAYS
      : phase === 2
        ? PHASE_CONSTANTS.PHASE_2_DAYS
        : phase === 3
          ? PHASE_CONSTANTS.PHASE_3_DAYS
          : null;

  if (!days) return null;

  return {
    phase,
    requiredSessions: Math.floor(days * 0.8),
    requiredDays: Math.floor(days * 0.7),
    description: `Complete at least 80% of Phase ${phase} sessions to unlock the next phase`,
  };
}

/**
 * @param {string} journeyId
 * @param {object} weeks
 * @param {number} currentPhase
 * @returns {object}
 */
export function canAdvancePhase(journeyId, weeks, currentPhase) {
  if (journeyId !== 'software-engineering') {
    return { canAdvance: false, reason: 'Not applicable' };
  }

  if (!currentPhase || currentPhase < 1 || currentPhase > 3) {
    return { canAdvance: false, reason: 'Invalid phase' };
  }

  const threshold = getPhaseCompletionThreshold(currentPhase);
  if (!threshold) {
    return { canAdvance: false, reason: 'Invalid threshold' };
  }

  const phaseWeeks = getPhaseWeekSlice(weeks, currentPhase);
  const phaseProgress = calculateSessionBasedProgress(journeyId, phaseWeeks);

  const canAdvance =
    phaseProgress.completedSessions >= threshold.requiredSessions &&
    phaseProgress.completedDays >= threshold.requiredDays;

  return {
    canAdvance,
    currentSessions: phaseProgress.completedSessions,
    requiredSessions: threshold.requiredSessions,
    currentDays: phaseProgress.completedDays,
    requiredDays: threshold.requiredDays,
    progress: canAdvance
      ? 100
      : Math.round((phaseProgress.completedSessions / threshold.requiredSessions) * 100),
    reason: canAdvance
      ? 'Phase completion threshold met'
      : `Need ${threshold.requiredSessions - phaseProgress.completedSessions} more sessions and ${threshold.requiredDays - phaseProgress.completedDays} more days`,
  };
}

/**
 * @param {string} journeyId
 * @param {object} weeks
 * @param {number} dayNumber
 * @returns {object}
 */
export function getPhaseUnlockStatus(journeyId, weeks, dayNumber) {
  if (journeyId !== 'software-engineering') {
    return { phase1Unlocked: true, phase2Unlocked: true, phase3Unlocked: true };
  }

  const phase1Unlocked = dayNumber >= 1;
  const phase1Advancement = canAdvancePhase(journeyId, weeks, 1);
  const phase2Unlocked = phase1Advancement.canAdvance || dayNumber > PHASE_CONSTANTS.PHASE_1_DAYS;

  const phase2Advancement = phase2Unlocked ? canAdvancePhase(journeyId, weeks, 2) : null;
  const phase3Unlocked =
    (phase2Advancement?.canAdvance ?? false) ||
    dayNumber > PHASE_CONSTANTS.PHASE_1_DAYS + PHASE_CONSTANTS.PHASE_2_DAYS;

  return {
    phase1Unlocked,
    phase2Unlocked,
    phase3Unlocked,
    phase1Advancement,
    phase2Advancement,
    phase3Advancement: phase3Unlocked ? canAdvancePhase(journeyId, weeks, 3) : null,
  };
}
