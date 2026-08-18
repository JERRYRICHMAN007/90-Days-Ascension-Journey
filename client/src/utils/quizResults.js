import { STORAGE_KEYS } from './storageKeys.js';

/**
 * @typedef {{ score: number, maxScore: number, takenAt: string, percentage?: number, passed?: boolean }} QuizResultEntry
 * @typedef {{ completedAt: string, requirementsCompleted?: number, submissionReady?: number, dayNumber?: number }} AssessmentResultEntry
 */

const ASSESSMENT_KEY = 'aetherAssessmentResults';

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

function readAssessments() {
  try {
    const raw = localStorage.getItem(ASSESSMENT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAssessments(data) {
  localStorage.setItem(ASSESSMENT_KEY, JSON.stringify(data));
}

/** Migrate legacy dailyQuizzes_${journeyId} arrays into AetherQuizResults */
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
          passed: entry.passed,
        };
      });
      changed = true;
    } catch {
      /* ignore */
    }
  });

  if (changed) writeAll(all);

  // Migrate practicalAssessments_*
  const assessments = readAssessments();
  let aChanged = false;
  journeyIds.forEach((journeyId) => {
    if (assessments[journeyId] && Object.keys(assessments[journeyId]).length > 0) return;
    try {
      const legacy = localStorage.getItem(`practicalAssessments_${journeyId}`);
      if (!legacy) return;
      const entries = JSON.parse(legacy);
      if (!Array.isArray(entries) || entries.length === 0) return;
      assessments[journeyId] = assessments[journeyId] || {};
      entries.forEach((entry) => {
        const day = entry.dayNumber ?? entry.day;
        if (!day) return;
        assessments[journeyId][String(day)] = {
          completedAt: entry.completedAt || new Date().toISOString(),
          requirementsCompleted: entry.requirementsCompleted,
          submissionReady: entry.submissionReady,
          dayNumber: day,
        };
      });
      aChanged = true;
    } catch {
      /* ignore */
    }
  });
  if (aChanged) writeAssessments(assessments);
}

/**
 * @param {string} journeyId
 * @param {number} dayNumber
 * @param {{ correct: number, total: number, percentage?: number, passed?: boolean }} results
 */
export function saveQuizResult(journeyId, dayNumber, results) {
  const existing = getQuizResult(journeyId, dayNumber);
  // Do not overwrite a passed attempt
  if (existing?.passed) return existing;

  const all = readAll();
  if (!all[journeyId]) all[journeyId] = {};
  const entry = {
    score: results.correct,
    maxScore: results.total,
    percentage: results.percentage,
    passed: Boolean(results.passed),
    takenAt: new Date().toISOString(),
  };
  all[journeyId][String(dayNumber)] = entry;
  writeAll(all);

  try {
    const legacyKey = `dailyQuizzes_${journeyId}`;
    const saved = localStorage.getItem(legacyKey) || '[]';
    const quizzes = JSON.parse(saved);
    const filtered = quizzes.filter((q) => (q.day ?? q.dayNumber) !== dayNumber);
    filtered.push({
      day: dayNumber,
      correct: results.correct,
      total: results.total,
      percentage: results.percentage,
      passed: results.passed,
      completedAt: entry.takenAt,
    });
    localStorage.setItem(legacyKey, JSON.stringify(filtered));
  } catch {
    /* ignore */
  }

  window.dispatchEvent(
    new CustomEvent('session-completed', { detail: { journeyId, dayNumber, type: 'quiz' } })
  );
  window.dispatchEvent(new CustomEvent('progress-updated', { detail: { journeyId, dayNumber } }));
  window.dispatchEvent(new CustomEvent('quiz-results-updated', { detail: { journeyId, dayNumber } }));
  return entry;
}

export function getQuizResult(journeyId, dayNumber) {
  const results = getQuizResultsForJourney(journeyId);
  return results[String(dayNumber)] || null;
}

export function hasPassedQuiz(journeyId, dayNumber) {
  return Boolean(getQuizResult(journeyId, dayNumber)?.passed);
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

export function saveAssessmentResult(journeyId, dayNumber, results = {}) {
  const existing = getAssessmentResult(journeyId, dayNumber);
  if (existing) return existing;

  const all = readAssessments();
  if (!all[journeyId]) all[journeyId] = {};
  const entry = {
    dayNumber,
    requirementsCompleted: results.requirementsCompleted,
    submissionReady: results.submissionReady,
    completedAt: results.completedAt || new Date().toISOString(),
  };
  all[journeyId][String(dayNumber)] = entry;
  writeAssessments(all);

  try {
    const legacyKey = `practicalAssessments_${journeyId}`;
    const saved = localStorage.getItem(legacyKey) || '[]';
    const list = JSON.parse(saved);
    const filtered = list.filter((a) => (a.dayNumber ?? a.day) !== dayNumber);
    filtered.push(entry);
    localStorage.setItem(legacyKey, JSON.stringify(filtered));
  } catch {
    /* ignore */
  }

  window.dispatchEvent(
    new CustomEvent('session-completed', { detail: { journeyId, dayNumber, type: 'assessment' } })
  );
  window.dispatchEvent(new CustomEvent('progress-updated', { detail: { journeyId, dayNumber } }));
  window.dispatchEvent(
    new CustomEvent('assessment-results-updated', { detail: { journeyId, dayNumber } })
  );
  return entry;
}

export function getAssessmentResult(journeyId, dayNumber) {
  const all = readAssessments();
  return all[journeyId]?.[String(dayNumber)] || null;
}

export function hasCompletedAssessment(journeyId, dayNumber) {
  return Boolean(getAssessmentResult(journeyId, dayNumber));
}

export function clearQuizResultsForJourney(journeyId) {
  if (!journeyId) return;
  const all = readAll();
  delete all[journeyId];
  writeAll(all);
  try {
    localStorage.removeItem(`dailyQuizzes_${journeyId}`);
  } catch {
    /* ignore */
  }
}

export function clearAssessmentResultsForJourney(journeyId) {
  if (!journeyId) return;
  const all = readAssessments();
  delete all[journeyId];
  writeAssessments(all);
  try {
    localStorage.removeItem(`practicalAssessments_${journeyId}`);
  } catch {
    /* ignore */
  }
}
