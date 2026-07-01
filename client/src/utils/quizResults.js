import { STORAGE_KEYS } from './storageKeys.js';

/**
 * @typedef {{ score: number, maxScore: number, takenAt: string, percentage?: number }} QuizResultEntry
 */

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(data));
}

/** Migrate legacy dailyQuizzes_${journeyId} arrays into forge90QuizResults */
export function migrateLegacyQuizResults(journeyIds = []) {
  const all = readAll();
  let changed = false;

  journeyIds.forEach((journeyId) => {
    if (all[journeyId] && Object.keys(all[journeyId]).length > 0) return;
    try {
      const legacy = localStorage.getItem(`dailyQuizzes_${journeyId}`);
      if (!legacy) return;
      const entries = JSON.parse(legacy);
      if (!Array.isArray(entries) || entries.length === 0) return;
      all[journeyId] = all[journeyId] || {};
      entries.forEach((entry) => {
        const day = entry.day ?? entry.dayNumber;
        if (!day) return;
        all[journeyId][String(day)] = {
          score: entry.correct ?? entry.score ?? 0,
          maxScore: entry.total ?? entry.maxScore ?? 1,
          takenAt: entry.completedAt ?? entry.takenAt ?? new Date().toISOString(),
          percentage: entry.percentage,
        };
      });
      changed = true;
    } catch {
      /* ignore corrupt legacy data */
    }
  });

  if (changed) writeAll(all);
}

/**
 * @param {string} journeyId
 * @param {number} dayNumber
 * @param {{ correct: number, total: number, percentage?: number }} results
 */
export function saveQuizResult(journeyId, dayNumber, results) {
  const all = readAll();
  if (!all[journeyId]) all[journeyId] = {};
  all[journeyId][String(dayNumber)] = {
    score: results.correct,
    maxScore: results.total,
    percentage: results.percentage,
    takenAt: new Date().toISOString(),
  };
  writeAll(all);
  window.dispatchEvent(
    new CustomEvent('session-completed', { detail: { journeyId, dayNumber, type: 'quiz' } })
  );
  window.dispatchEvent(new CustomEvent('progress-updated', { detail: { journeyId, dayNumber } }));
}

/** @returns {Record<string, QuizResultEntry>} */
export function getQuizResultsForJourney(journeyId) {
  const all = readAll();
  return all[journeyId] || {};
}

export function countQuizzesTaken(journeyId) {
  return Object.keys(getQuizResultsForJourney(journeyId)).length;
}

export function getQuizAveragePercent(journeyId) {
  const results = Object.values(getQuizResultsForJourney(journeyId));
  if (results.length === 0) return null;
  const sum = results.reduce((acc, r) => {
    const pct =
      r.percentage ??
      (r.maxScore > 0 ? Math.round((r.score / r.maxScore) * 100) : 0);
    return acc + pct;
  }, 0);
  return Math.round(sum / results.length);
}
