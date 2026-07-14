import { getJourneyData } from '../data/journeys/index.js';
import { getDateStringForDayNumber } from '../data/journeys/shared.js';
import { getCurrentDayNumber } from './dates.js';
import {
  calculateSessionBasedProgress,
  getJourneyCompletions,
  isDayFullyComplete,
  collectDaySessionKeys,
} from './progressTracking.js';
import { STORAGE_KEYS } from './storageKeys.js';
import {
  countQuizzesTaken,
  getQuizAveragePercent,
  migrateLegacyQuizResults,
} from './quizResults.js';
import { isDisciplineAvailable } from './phases.js';

const JOURNEY_IDS = [
  'body-transformation',
  'dual-brand',
  'reading',
  'writers',
  'software-engineering',
];

function getXpState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.XP);
    if (!raw) return { global: 0, domains: {} };
    return JSON.parse(raw);
  } catch {
    return { global: 0, domains: {} };
  }
}

function getStreakState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STREAKS);
    return raw ? JSON.parse(raw) : { current: 0, longest: 0, lastDate: null };
  } catch {
    return { current: 0, longest: 0, lastDate: null };
  }
}

function getAllDays(weeks) {
  return weeks.flatMap((w) => w.days || []).filter((d) => d && d.dayNumber > 0);
}

function countScheduledSessionsForDay(journeyId, day) {
  if (!day) return 0;
  return collectDaySessionKeys(journeyId, day).length;
}

function countCompletedSessionsForDay(journeyId, day, completions) {
  if (!day) return 0;
  const keys = collectDaySessionKeys(journeyId, day);
  return keys.filter((k) => completions[k]?.completed).length;
}

function computeJourneyStreaks(weeks, journeyId, currentDay) {
  const days = getAllDays(weeks)
    .filter((d) => d.dayNumber <= currentDay)
    .sort((a, b) => a.dayNumber - b.dayNumber);

  const completeDays = days
    .filter((d) => isDayFullyComplete(journeyId, d))
    .map((d) => d.dayNumber);

  if (completeDays.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const set = new Set(completeDays);
  let longest = 0;
  let run = 0;
  let prev = null;
  completeDays.forEach((dn) => {
    if (prev !== null && dn === prev + 1) run += 1;
    else run = 1;
    longest = Math.max(longest, run);
    prev = dn;
  });

  let current = 0;
  for (let d = currentDay; d >= 1; d -= 1) {
    if (set.has(d)) current += 1;
    else break;
  }

  return { currentStreak: current, longestStreak: longest };
}

function completionRateForWindow(weeks, journeyId, currentDay, windowDays) {
  const completions = getJourneyCompletions(journeyId);
  const days = getAllDays(weeks).filter(
    (d) => d.dayNumber <= currentDay && d.dayNumber > currentDay - windowDays
  );
  if (days.length === 0) return 0;

  let scheduled = 0;
  let completed = 0;
  days.forEach((day) => {
    scheduled += countScheduledSessionsForDay(journeyId, day);
    completed += countCompletedSessionsForDay(journeyId, day, completions);
  });
  return scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0;
}

function countQuizzesAvailable(weeks, currentDay) {
  return getAllDays(weeks).filter(
    (d) => d.dailyQuiz?.questions?.length > 0 && d.dayNumber <= currentDay
  ).length;
}

function countTotalQuizzesInJourney(weeks) {
  return getAllDays(weeks).filter((d) => d.dailyQuiz?.questions?.length > 0).length;
}

function buildTrend(weeks, journeyId, currentDay) {
  const completions = getJourneyCompletions(journeyId);
  const last14Days = [];

  for (let offset = 13; offset >= 0; offset -= 1) {
    const dayNumber = currentDay - offset;
    if (dayNumber < 1) {
      last14Days.push({
        date: '',
        sessionsCompleted: 0,
        sessionsScheduled: 0,
        dayNumber: null,
      });
      continue;
    }
    const day = getAllDays(weeks).find((d) => d.dayNumber === dayNumber);
    const scheduled = countScheduledSessionsForDay(journeyId, day);
    const sessionsCompleted = countCompletedSessionsForDay(journeyId, day, completions);
    last14Days.push({
      date: getDateStringForDayNumber(dayNumber),
      sessionsCompleted,
      sessionsScheduled: scheduled,
      dayNumber,
    });
  }
  return last14Days.filter((e) => e.dayNumber !== null);
}

function getDisciplinesUnlocked(journeyId, currentDay) {
  if (journeyId !== 'software-engineering') return null;
  const disciplines = ['Mobile', 'Frontend', 'Backend', 'WordPress'];
  return disciplines.filter((d) => isDisciplineAvailable(d, currentDay));
}

/** Composite mastery score 0–100 */
export function computeMasteryScore(trace) {
  if (!trace?.completion || !trace?.consistency || !trace?.mastery) return 0;
  const percentComplete = Number(trace.completion.percentComplete) || 0;
  const consistencyScore = Number(trace.consistency.completionRateLast7Days) || 0;
  const quiz = trace.mastery.quizAverageScore ?? 0;
  const score =
    percentComplete * 0.4 + consistencyScore * 0.3 + (quiz || 0) * 0.3;
  return Number.isFinite(score) ? Math.round(score) : 0;
}

function emptyTrace(journeyId) {
  return {
    journeyId,
    journeyTitle: journeyId,
    completion: {
      totalSessions: 0,
      completedSessions: 0,
      percentComplete: 0,
      daysFullyComplete: 0,
      totalDays: 90,
      currentDay: 0,
    },
    consistency: {
      currentStreak: 0,
      longestStreak: 0,
      completionRateLast7Days: 0,
      completionRateLast30Days: 0,
      missedDays: [],
    },
    mastery: {
      quizAverageScore: null,
      quizzesTaken: 0,
      quizzesAvailable: 0,
      xpEarnedInJourney: 0,
      disciplinesUnlocked: null,
    },
    trend: { last14Days: [] },
  };
}

/**
 * Full journey analytics snapshot (recomputed on every call).
 * @param {string} journeyId
 */
export function getJourneyTrace(journeyId) {
  try {
    migrateLegacyQuizResults(JOURNEY_IDS);

    const { journey, weeks } = getJourneyData(journeyId);
    const totalDays = journey?.totalDays ?? 90;
    const calendarDay = getCurrentDayNumber();
    const currentDay =
      calendarDay === null || calendarDay === 0
        ? 0
        : Math.min(calendarDay, totalDays);

    const progress = calculateSessionBasedProgress(journeyId, weeks);
    const { currentStreak, longestStreak } = computeJourneyStreaks(
      weeks,
      journeyId,
      currentDay || 1
    );

    const globalStreaks = getStreakState();
    const xpState = getXpState();
    const quizAvg = getQuizAveragePercent(journeyId);

    const missedDays = getAllDays(weeks)
      .filter((d) => d.dayNumber <= currentDay && currentDay > 0)
      .filter((d) => {
        const sched = countScheduledSessionsForDay(journeyId, d);
        if (sched === 0) return false;
        const completions = getJourneyCompletions(journeyId);
        return countCompletedSessionsForDay(journeyId, d, completions) === 0;
      })
      .map((d) => d.dayNumber);

    const trend = currentDay > 0 ? buildTrend(weeks, journeyId, currentDay) : [];

    return {
      journeyId,
      journeyTitle: journey?.title ?? journeyId,
      completion: {
        totalSessions: progress.totalSessions,
        completedSessions: progress.completedSessions,
        percentComplete: progress.percentage,
        daysFullyComplete: progress.completedDays,
        totalDays,
        currentDay,
      },
      consistency: {
        currentStreak: currentStreak || globalStreaks.current,
        longestStreak: Math.max(longestStreak, globalStreaks.longest),
        completionRateLast7Days: completionRateForWindow(
          weeks,
          journeyId,
          currentDay || 1,
          7
        ),
        completionRateLast30Days: completionRateForWindow(
          weeks,
          journeyId,
          currentDay || 1,
          30
        ),
        missedDays,
      },
      mastery: {
        quizAverageScore: quizAvg,
        quizzesTaken: countQuizzesTaken(journeyId),
        quizzesAvailable: countTotalQuizzesInJourney(weeks),
        xpEarnedInJourney: xpState.domains?.[journeyId] ?? 0,
        disciplinesUnlocked: getDisciplinesUnlocked(journeyId, currentDay || 1),
      },
      trend: {
        last14Days: trend,
      },
    };
  } catch (error) {
    console.warn(`Aether: getJourneyTrace failed for ${journeyId}`, error);
    return emptyTrace(journeyId);
  }
}

export function getAllJourneyTraces() {
  return JOURNEY_IDS.map((id) => getJourneyTrace(id));
}

export { JOURNEY_IDS };
