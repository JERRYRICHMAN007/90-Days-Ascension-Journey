/**
 * Phase Advancement Logic
 * 
 * Phase advancement is based on completion thresholds, not just day count.
 * Users must complete a minimum number of sessions to advance to the next phase.
 */

import { calculateSessionBasedProgress } from './progressTracking';

// Phase constants (duplicated here to avoid circular dependency)
const PHASE_CONSTANTS = {
  PHASE_1_DAYS: 90,
  PHASE_2_DAYS: 90,
};

/**
 * Get completion threshold for phase advancement
 * @param {number} phase - Phase number (1 or 2)
 * @returns {object} Threshold requirements
 */
export function getPhaseCompletionThreshold(phase) {
  if (phase === 1) {
    return {
      phase: 1,
      requiredSessions: Math.floor(PHASE_CONSTANTS.PHASE_1_DAYS * 0.8), // 80% of sessions (72 out of 90 days worth)
      requiredDays: Math.floor(PHASE_CONSTANTS.PHASE_1_DAYS * 0.7), // 70% of days (63 days)
      description: 'Complete at least 80% of Phase 1 sessions to unlock Phase 2'
    };
  }
  
  if (phase === 2) {
    return {
      phase: 2,
      requiredSessions: Math.floor(PHASE_CONSTANTS.PHASE_2_DAYS * 0.8), // 80% of sessions
      requiredDays: Math.floor(PHASE_CONSTANTS.PHASE_2_DAYS * 0.7), // 70% of days
      description: 'Complete at least 80% of Phase 2 sessions to complete the journey'
    };
  }
  
  return null;
}

/**
 * Check if user can advance to next phase
 * @param {string} journeyId - Journey ID
 * @param {object} weeks - Journey weeks data
 * @param {number} currentPhase - Current phase number
 * @returns {object} Advancement status
 */
export function canAdvancePhase(journeyId, weeks, currentPhase) {
  if (journeyId !== 'software-engineering') {
    // Other journeys don't have phases
    return { canAdvance: false, reason: 'Not applicable' };
  }
  
  if (!currentPhase || currentPhase < 1 || currentPhase > 2) {
    return { canAdvance: false, reason: 'Invalid phase' };
  }
  
  const threshold = getPhaseCompletionThreshold(currentPhase);
  if (!threshold) {
    return { canAdvance: false, reason: 'Invalid threshold' };
  }
  
  // Filter weeks for current phase
  const phaseWeeks = currentPhase === 1
    ? weeks.slice(0, Math.ceil(PHASE_CONSTANTS.PHASE_1_DAYS / 7))
    : weeks.slice(Math.ceil(PHASE_CONSTANTS.PHASE_1_DAYS / 7));
  
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
    progress: canAdvance ? 100 : Math.round((phaseProgress.completedSessions / threshold.requiredSessions) * 100),
    reason: canAdvance 
      ? 'Phase completion threshold met'
      : `Need ${threshold.requiredSessions - phaseProgress.completedSessions} more sessions and ${threshold.requiredDays - phaseProgress.completedDays} more days`
  };
}

/**
 * Get phase unlock status
 * @param {string} journeyId - Journey ID
 * @param {object} weeks - Journey weeks data
 * @param {number} dayNumber - Current day number
 * @returns {object} Phase status
 */
export function getPhaseUnlockStatus(journeyId, weeks, dayNumber) {
  if (journeyId !== 'software-engineering') {
    return { phase1Unlocked: true, phase2Unlocked: true };
  }
  
  // Phase 1 is always unlocked from Day 1
  const phase1Unlocked = dayNumber >= 1;
  
  // Phase 2 requires Phase 1 completion threshold
  const phase1Advancement = canAdvancePhase(journeyId, weeks, 1);
  const phase2Unlocked = phase1Advancement.canAdvance || dayNumber > PHASE_CONSTANTS.PHASE_1_DAYS;
  
  return {
    phase1Unlocked,
    phase2Unlocked,
    phase1Advancement,
    phase2Advancement: phase2Unlocked ? canAdvancePhase(journeyId, weeks, 2) : null
  };
}

