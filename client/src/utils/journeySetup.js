/**
 * Per-journey setup wizard profile (schedule, goals, personalization).
 */

import { STORAGE_KEYS } from './storageKeys.js';
import {
  getStartAllJourneysEnabled,
  setJourneyPlannedStartDate,
  startJourney,
  setJourneyAvailability,
  isJourneyStarted,
} from './journeyPlanning.js';
import {
  getWeeklyPlan,
  saveWeeklyPlan,
  patchWeeklyPlanFromAvailableDays,
} from './journeyWeeklyPlan.js';
import { resolveJourneyAIContext, getDefaultWeeklyPlanForCategory } from './journeyAIContext.js';

export const GOAL_CHANGE_XP_PENALTY = 15;
const GOAL_FIELDS = ['goal', 'whyImportant', 'successLooksLike', 'motivation'];

function readJson(key, fallback) {
  try {
    if (typeof window === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** @typedef {'manual'|'smart'} SetupMode */

/**
 * @typedef {Object} JourneySetupProfile
 * @property {string} [startYmd]
 * @property {string} [endYmd]
 * @property {number[]} [availableDays]
 * @property {string[]} [preferredTimes]
 * @property {boolean} [remindersEnabled]
 * @property {string} [goal]
 * @property {string} [whyImportant]
 * @property {string} [successLooksLike]
 * @property {string} [motivation]
 * @property {string} [selfDescription]
 * @property {string} [currentActivity]
 * @property {string} [challenges]
 * @property {string} [experienceLevel]
 * @property {string} [habitsToChange]
 * @property {string} [timeAvailable]
 * @property {SetupMode} [mode]
 * @property {Record<string, unknown>} [smartInputs]
 * @property {boolean} [completed]
 */

export function getJourneySetup(journeyId) {
  const all = readJson(STORAGE_KEYS.JOURNEY_SETUP, {});
  return all[journeyId] || {};
}

export function saveJourneySetup(journeyId, patch) {
  const all = readJson(STORAGE_KEYS.JOURNEY_SETUP, {});
  all[journeyId] = { ...all[journeyId], ...patch, updatedAt: new Date().toISOString() };
  writeJson(STORAGE_KEYS.JOURNEY_SETUP, all);
  return all[journeyId];
}

function syncWeeklyPlanFromProfile(journeyId, profile) {
  const days = profile.availableDays;
  if (!days?.length) return;
  const existing = getWeeklyPlan(journeyId);
  const hasPlan = Object.keys(readWeeklyPlanRaw(journeyId) || {}).length > 0;
  const ctx = resolveJourneyAIContext(journeyId);
  const plan = !hasPlan
    ? getDefaultWeeklyPlanForCategory(ctx.category, ctx.templateId)
    : patchWeeklyPlanFromAvailableDays(journeyId, days, existing);
  saveWeeklyPlan(journeyId, plan);
}

function readWeeklyPlanRaw(journeyId) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNEY_WEEKLY_PLAN) || '{}');
    return all[journeyId] || null;
  } catch {
    return null;
  }
}

function dispatchJourneyUpdates(journeyId) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('journey-setup-updated', { detail: { journeyId } }));
  window.dispatchEvent(new CustomEvent('journey-availability-updated', { detail: { journeyId } }));
  window.dispatchEvent(new CustomEvent('journey-weekly-plan-updated', { detail: { journeyId } }));
}

/** Detect if patch modifies goal-related fields */
export function wouldIncurGoalPenalty(journeyId, patches) {
  if (!isJourneyStarted(journeyId)) return false;
  const prev = getJourneySetup(journeyId);
  return GOAL_FIELDS.some((f) => patches[f] !== undefined && patches[f] !== prev[f]);
}

/**
 * Apply setup patches immediately — saves, syncs availability & weekly plan, broadcasts updates.
 */
export function applyJourneyPatches(journeyId, patches) {
  if (!journeyId || typeof journeyId !== 'string') {
    throw new Error('applyJourneyPatches requires a journeyId — changes are scoped to one journey only');
  }

  const scoped = { ...patches };
  delete scoped.journeyId;

  const prev = getJourneySetup(journeyId);
  const merged = { ...prev, ...scoped };
  saveJourneySetup(journeyId, merged);

  if (scoped.startYmd) {
    setJourneyPlannedStartDate(journeyId, scoped.startYmd);
  }

  if (scoped.weeklyPlan) {
    saveWeeklyPlan(journeyId, scoped.weeklyPlan);
    const days = Object.keys(scoped.weeklyPlan).map(Number).sort((a, b) => a - b);
    setJourneyAvailability(journeyId, { enabled: true, availableDays: days });
    saveJourneySetup(journeyId, { availableDays: days });
  } else if (scoped.availableDays?.length) {
    setJourneyAvailability(journeyId, {
      enabled: true,
      availableDays: scoped.availableDays,
    });
    syncWeeklyPlanFromProfile(journeyId, { ...merged, availableDays: scoped.availableDays });
  } else if (merged.availableDays?.length) {
    syncWeeklyPlanFromProfile(journeyId, merged);
  }

  if (scoped.activityTimes && typeof scoped.activityTimes === 'object') {
    const plan = { ...getWeeklyPlan(journeyId) };
    Object.entries(scoped.activityTimes).forEach(([d, time]) => {
      if (plan[d]) plan[d] = { ...plan[d], time };
    });
    saveWeeklyPlan(journeyId, plan);
  }

  dispatchJourneyUpdates(journeyId);
  return getJourneySetup(journeyId);
}

/** Snapshot journey setup + weekly plan for one-step undo after AI apply. */
export function captureJourneyStateForUndo(journeyId) {
  return {
    setup: { ...getJourneySetup(journeyId) },
    weeklyPlan: { ...getWeeklyPlan(journeyId) },
  };
}

/** Restore a prior snapshot from captureJourneyStateForUndo. */
export function restoreJourneyStateFromUndo(journeyId, snapshot) {
  if (!snapshot?.setup) return false;

  const all = readJson(STORAGE_KEYS.JOURNEY_SETUP, {});
  all[journeyId] = { ...snapshot.setup, updatedAt: new Date().toISOString() };
  writeJson(STORAGE_KEYS.JOURNEY_SETUP, all);

  if (snapshot.weeklyPlan) {
    saveWeeklyPlan(journeyId, snapshot.weeklyPlan);
  }

  const days = snapshot.setup.availableDays;
  if (days?.length) {
    setJourneyAvailability(journeyId, { enabled: true, availableDays: days });
  }

  dispatchJourneyUpdates(journeyId);
  return true;
}

export function applyJourneySetup(journeyId, profile, { autoStart } = {}) {
  applyJourneyPatches(journeyId, { ...profile, completed: true });

  const shouldStart = autoStart ?? getStartAllJourneysEnabled();
  if (shouldStart && profile.startYmd) {
    startJourney(journeyId, profile.startYmd);
  }
}

export const SETUP_STEPS = [
  { id: 'schedule', title: 'Schedule', subtitle: 'When will you show up?' },
  { id: 'goals', title: 'Goals', subtitle: 'What are you building toward?' },
  { id: 'current', title: 'Current state', subtitle: 'Where are you today?' },
  { id: 'personalize', title: 'Personalize', subtitle: 'Manual or AI-assisted' },
];

const WEEKDAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function splitGoalField(text) {
  if (!text?.trim()) return [];
  return text
    .split(/[\n,;]+/)
    .map((line) => line.trim().replace(/^[-•*]\s*/, ''))
    .filter((line) => line.length > 2);
}

/** Parse setup profile into displayable goal bullets */
export function parseGoalsFromSetup(profile) {
  if (!profile) return [];
  const goals = [];
  splitGoalField(profile.goal).forEach((line) => goals.push(line));
  splitGoalField(profile.successLooksLike).forEach((line) => goals.push(line));
  splitGoalField(profile.whyImportant).forEach((line) => goals.push(line));
  return [...new Set(goals)].slice(0, 8);
}

/** Compact structured goals for overview UI */
export function getStructuredGoalsFromSetup(profile) {
  if (!profile) {
    return { focus: [], highlights: [], motivation: '' };
  }
  const focus = splitGoalField(profile.goal).slice(0, 2);
  const highlights = [...new Set([...splitGoalField(profile.whyImportant), ...splitGoalField(profile.successLooksLike)])].slice(
    0,
    4
  );
  const motivationParts = splitGoalField(profile.motivation);
  const motivation = motivationParts.length ? motivationParts.join(' · ') : profile.motivation?.trim() || '';
  return { focus, highlights, motivation };
}

export function formatAvailableDays(days = []) {
  if (!days.length) return 'Every day';
  if (days.length === 7) return 'Every day';
  if (days.join(',') === '1,2,3,4,5') return 'Weekdays';
  return days.map((d) => WEEKDAY_FULL[d]).join(', ');
}

/** Template default goals by journey category — goals fields only */
const DEFAULT_GOALS_BY_CATEGORY = {
  fitness: {
    goal: 'Build muscle & strength\nBuild consistency',
    whyImportant: 'Better long-term health\nMore confidence',
    successLooksLike: 'Visible physical progress\nComplete the full program',
    motivation: 'Accountability\nPersonal growth',
  },
  reading: {
    goal: 'Read more books\nBuild consistency',
    whyImportant: 'Personal growth\nCareer advancement',
    successLooksLike: 'Finish the full program\nHit a measurable target',
    motivation: 'Personal growth\nRewards & milestones',
  },
  faith: {
    goal: 'Consistent daily scripture reading\nMemorize one verse per week',
    whyImportant: 'Spiritual growth\nFor my family',
    successLooksLike: '30+ day habit streak\nComplete the full program',
    motivation: 'Accountability\nCommunity support',
  },
  learning: {
    goal: 'Master a new skill\nBuild consistency',
    whyImportant: 'Career advancement\nPersonal growth',
    successLooksLike: 'Complete the full program\nHit a measurable target',
    motivation: 'Personal growth\nHealthy competition',
  },
  business: {
    goal: 'Grow my personal brand\nBuild consistency',
    whyImportant: 'Career advancement\nFinancial freedom',
    successLooksLike: 'Hit a measurable target\nComplete the full program',
    motivation: 'Accountability\nPersonal growth',
  },
  meditation: {
    goal: 'Build consistency\nImprove energy & health',
    whyImportant: 'Better long-term health\nPersonal growth',
    successLooksLike: '30+ day habit streak\nFeel stronger & energized',
    motivation: 'Personal growth\nAccountability',
  },
  writing: {
    goal: 'Master a new skill\nBuild consistency',
    whyImportant: 'Leave a legacy\nPersonal growth',
    successLooksLike: 'Complete the full program\nHit a measurable target',
    motivation: 'Personal growth\nRewards & milestones',
  },
};

export function getDefaultGoalsForJourney(journeyId) {
  const ctx = resolveJourneyAIContext(journeyId);
  return DEFAULT_GOALS_BY_CATEGORY[ctx.category] || DEFAULT_GOALS_BY_CATEGORY.learning;
}

/** Restore template default goals only — does not touch schedule or weekly plan */
export function resetJourneyGoalsToDefault(journeyId) {
  const defaults = getDefaultGoalsForJourney(journeyId);
  return applyJourneyPatches(journeyId, defaults);
}
