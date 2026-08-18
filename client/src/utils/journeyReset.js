/**
 * Wipe all runtime progress for one journey so a reset truly starts fresh.
 */

import { formatYmd } from './dates.js';
import { STORAGE_KEYS } from './storageKeys.js';
import { resetJourneyProgress } from './progressTracking.js';
import { clearAllOverrides } from './workoutPlan.js';
import { saveJourneySetup } from './journeySetup.js';
import {
  clearAssessmentResultsForJourney,
  clearQuizResultsForJourney,
} from './quizResults.js';
import { clearJourneyNotes } from './journeyDailyNotes.js';

function todayYmd() {
  return formatYmd(new Date());
}

function clearJourneyXp(journeyId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.XP);
    if (!raw) return;
    const xp = JSON.parse(raw);
    const removed = xp.domains?.[journeyId] || 0;
    if (xp.domains) xp.domains[journeyId] = 0;
    xp.global = Math.max(0, (xp.global || 0) - removed);
    localStorage.setItem(STORAGE_KEYS.XP, JSON.stringify(xp));
  } catch {
    /* ignore */
  }
  try {
    localStorage.removeItem(`points_${journeyId}`);
  } catch {
    /* ignore */
  }
}

/**
 * Remove session completions, quizzes, notes, workout edits, XP, and reset the planned start to today.
 * Setup choices (goals, default/custom plan) are kept; progress is not.
 */
export function wipeJourneyRuntimeData(journeyId) {
  if (!journeyId) return false;

  resetJourneyProgress(journeyId);
  clearQuizResultsForJourney(journeyId);
  clearAssessmentResultsForJourney(journeyId);
  clearJourneyNotes(journeyId);
  clearAllOverrides(journeyId);
  clearJourneyXp(journeyId);

  try {
    localStorage.removeItem(`dailyQuizzes_${journeyId}`);
    localStorage.removeItem(`practicalAssessments_${journeyId}`);
  } catch {
    /* ignore */
  }

  saveJourneySetup(journeyId, { startYmd: todayYmd() });

  return true;
}

export function dispatchJourneyWipeEvents(journeyId) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('journey-start-updated', { detail: { journeyId, reset: true } })
  );
  window.dispatchEvent(new CustomEvent('progress-updated', { detail: { journeyId } }));
  window.dispatchEvent(new CustomEvent('quiz-results-updated', { detail: { journeyId } }));
  window.dispatchEvent(new CustomEvent('journey-notes-updated', { detail: { journeyId } }));
  window.dispatchEvent(new CustomEvent('workout-plan-updated', { detail: { journeyId } }));
  window.dispatchEvent(new CustomEvent('journey-setup-updated', { detail: { journeyId } }));
  window.dispatchEvent(new CustomEvent('gamification-hydrated'));
  window.dispatchEvent(new CustomEvent('notifications-updated'));
}
