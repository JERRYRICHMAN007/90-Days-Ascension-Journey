/**
 * Per-journey custom content (reading queue, weekday tasks, SE disciplines).
 * Default journeys leave this empty and use curated sources.
 */

import { STORAGE_KEYS } from './storageKeys.js';
import { getContentTemplateId } from './journeyRegistry.js';
import {
  READING_LIBRARY_QUEUE,
  READING_BOOKS_BY_MONTH,
} from '../data/journeys/journeyCuratedResources.js';
import { DEFAULT_WEEKLY_ROUTINES } from '../data/journeys/bodyWorkoutPlan.js';
import { getDefaultWeeklyPlanForCategory, resolveJourneyAIContext } from './journeyAIContext.js';
import { saveWeeklyPlan } from './journeyWeeklyPlan.js';
import { saveWorkoutPlanState } from './workoutPlan.js';

const WEEKDAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SE_DISCIPLINES = ['Mobile', 'Frontend', 'Backend'];

function readAll() {
  try {
    if (typeof window === 'undefined') return {};
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNEY_CUSTOM_PLAN) || '{}');
  } catch {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEYS.JOURNEY_CUSTOM_PLAN, JSON.stringify(data));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('journey-custom-plan-updated'));
  }
}

export function getCustomPlan(journeyId) {
  if (!journeyId) return {};
  return readAll()[journeyId] || {};
}

export function saveCustomPlan(journeyId, patch) {
  const all = readAll();
  all[journeyId] = {
    ...(all[journeyId] || {}),
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  writeAll(all);
  return all[journeyId];
}

export function getDefaultReadingQueue() {
  return READING_LIBRARY_QUEUE.map((book, index) => ({
    title: book.title,
    author: book.author || '',
    url: book.url || '',
    purpose: book.purpose || book.description || '',
    description: book.description || book.purpose || book.title,
    queueOrder: index + 1,
  }));
}

export function getDefaultWorkoutDays() {
  const days = {};
  Object.entries(DEFAULT_WEEKLY_ROUTINES).forEach(([idx, routine]) => {
    days[String(idx)] = {
      focus: routine.focus,
      name: routine.name,
      rounds: routine.rounds ?? 0,
      isRest: Boolean(routine.isRest),
      link: routine.link ?? null,
      exercises: (routine.exercises || []).map((ex) => ({ ...ex })),
    };
  });
  return days;
}

function defaultWritersDays() {
  const days = {};
  WEEKDAY_FULL.forEach((_, d) => {
    const isFriday = d === 5;
    days[String(d)] = isFriday
      ? { rest: true, theme: 'Rest Day', execution: 'No writing tasks — rest day' }
      : {
          rest: false,
          theme: 'Learn then execute',
          execution: 'Write today’s piece and ship it',
        };
  });
  return days;
}

function defaultBrandDays() {
  const days = {};
  WEEKDAY_FULL.forEach((_, d) => {
    days[String(d)] = {
      rest: d === 0,
      personal: d === 0 ? '' : 'Personal brand task for today',
      company: d === 0 ? '' : 'Company brand task for today',
    };
  });
  return days;
}

function defaultSeDays() {
  const days = {};
  WEEKDAY_FULL.forEach((_, d) => {
    days[String(d)] =
      d === 6
        ? { rest: true, disciplines: [], time: '08:00' }
        : { rest: false, disciplines: [...SE_DISCIPLINES], time: '04:00' };
  });
  return days;
}

function defaultGenericDays() {
  const days = {};
  WEEKDAY_FULL.forEach((_, d) => {
    days[String(d)] = {
      rest: d === 0,
      task: d === 0 ? '' : "Today's session",
    };
  });
  return days;
}

export function getDefaultCustomPlanDraft(journeyId) {
  const templateId = getContentTemplateId(journeyId);
  const ctx = resolveJourneyAIContext(journeyId);
  const weeklyPlan = getDefaultWeeklyPlanForCategory(ctx.category, templateId);
  const draft = { weeklyPlan };

  if (templateId === 'custom-scratch') {
    draft.genericDays = defaultGenericDays();
  }

  if (templateId === 'reading') {
    draft.readingQueue = getDefaultReadingQueue();
  }
  if (templateId === 'body-transformation') {
    draft.workoutPlan = { level: 'starter', days: getDefaultWorkoutDays() };
  }
  if (templateId === 'writers') {
    draft.writersDays = defaultWritersDays();
  }
  if (templateId === 'dual-brand') {
    draft.brandDays = defaultBrandDays();
  }
  if (templateId === 'software-engineering') {
    draft.seDays = defaultSeDays();
  }
  return draft;
}

export const DEFAULT_PLAN_BLURBS = {
  reading:
    '6-month core: Successful Habits → System Building → Atomic Habits → Be Obsessed or Be Average → Meditations → Cash Flow Quadrant. Evenings 9:15–10:00 PM (Friday rest).',
  'body-transformation':
    'Mon–Fri circuit (Starter → Intermediate → Professional), Sat–Sun rest. Default session 6:00 AM.',
  writers: 'Learn then execute on writing days. Friday rest. Evening writing sessions.',
  'dual-brand': 'Personal + company brand streams on workdays. Weekly review on Sunday.',
  'software-engineering':
    'Mobile · Frontend · Backend every day except Saturday, 4:00–5:30 AM.',
};

export function getDefaultPlanBlurb(journeyId) {
  const templateId = getContentTemplateId(journeyId);
  return DEFAULT_PLAN_BLURBS[templateId] || 'Aether 6-month default plan for this journey.';
}

export function getDefaultPlanPreviewItems(journeyId) {
  const templateId = getContentTemplateId(journeyId);
  if (templateId === 'reading') {
    return READING_BOOKS_BY_MONTH.map((book) => `Month ${book.month}: ${book.title}`);
  }
  if (templateId === 'body-transformation') {
    return [
      'Mon — Plank & Core Circuit',
      'Tue — Push & Core',
      'Wed — Legs & Core',
      'Thu — Full Body Circuit',
      'Fri — HIIT Burn',
      'Sat–Sun — Rest',
    ];
  }
  if (templateId === 'writers') {
    return ['Learn then execute (weekday writing)', 'Friday rest', 'Evening sessions'];
  }
  if (templateId === 'dual-brand') {
    return ['Personal brand stream', 'Company brand stream', 'Sunday weekly review'];
  }
  if (templateId === 'software-engineering') {
    return [
      'Mobile · Frontend · Backend',
      '4:00–5:30 AM Sun–Fri',
      'Saturday rest',
    ];
  }
  if (templateId === 'custom-scratch') {
    return ['Your own name and schedule', 'Days and times you choose', 'Tasks you write for each weekday'];
  }
  return ['6-month independent schedule', 'Daily sessions + weekly rest'];
}

/**
 * Persist Default or Custom content into weekly plan / workout / custom-plan stores.
 * Does not start the journey.
 */
export function seedJourneyPlan(journeyId, { planSource = 'default', customPlan } = {}) {
  const templateId = getContentTemplateId(journeyId);
  const ctx = resolveJourneyAIContext(journeyId);
  const draft = customPlan || getDefaultCustomPlanDraft(journeyId);

  const weeklyPlan =
    planSource === 'custom' && draft.weeklyPlan && Object.keys(draft.weeklyPlan).length
      ? draft.weeklyPlan
      : getDefaultWeeklyPlanForCategory(ctx.category, templateId);
  saveWeeklyPlan(journeyId, weeklyPlan);

  const stored = {
    weeklyPlan,
  };

  if (templateId === 'reading') {
    const queue =
      planSource === 'custom' && draft.readingQueue?.length
        ? draft.readingQueue
        : getDefaultReadingQueue();
    stored.readingQueue = queue;
  }

  if (templateId === 'body-transformation') {
    const workout =
      planSource === 'custom' && draft.workoutPlan
        ? draft.workoutPlan
        : { level: 'starter', days: getDefaultWorkoutDays() };
    stored.workoutPlan = workout;
    saveWorkoutPlanState(journeyId, {
      levelOverride: workout.level || 'starter',
      days: workout.days || {},
    });
  }

  if (templateId === 'writers') {
    stored.writersDays =
      planSource === 'custom' && draft.writersDays ? draft.writersDays : defaultWritersDays();
  }
  if (templateId === 'dual-brand') {
    stored.brandDays =
      planSource === 'custom' && draft.brandDays ? draft.brandDays : defaultBrandDays();
  }
  if (templateId === 'software-engineering') {
    stored.seDays = planSource === 'custom' && draft.seDays ? draft.seDays : defaultSeDays();
  }
  if (templateId === 'custom-scratch') {
    stored.genericDays =
      planSource === 'custom' && draft.genericDays ? draft.genericDays : defaultGenericDays();
  }

  saveCustomPlan(journeyId, stored);
  return stored;
}

export function getReadingQueueForJourney(journeyId) {
  const stored = getCustomPlan(journeyId).readingQueue;
  if (Array.isArray(stored) && stored.length >= 1) return stored;
  return getDefaultReadingQueue();
}

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const BODY_SHORT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Short digest of Default or Custom plan content for review / start screens. */
export function getPlanDigest(journeyId, planSource = 'default') {
  if (planSource !== 'custom') return getDefaultPlanPreviewItems(journeyId);

  const stored = getCustomPlan(journeyId);
  const templateId = getContentTemplateId(journeyId);
  const lines = [];

  if (templateId === 'reading' && stored.readingQueue?.length) {
    stored.readingQueue.slice(0, 6).forEach((book, i) => {
      lines.push(`Month ${i + 1}: ${book.title}`);
    });
    if (stored.readingQueue.length > 6) {
      lines.push(`${stored.readingQueue.length - 6} stretch title(s)`);
    }
  } else if (templateId === 'body-transformation' && stored.workoutPlan) {
    lines.push(`Level: ${stored.workoutPlan.level || 'starter'}`);
    BODY_SHORT_DAYS.forEach((name, i) => {
      const day = stored.workoutPlan.days?.[String(i)] || stored.workoutPlan.days?.[i];
      if (!day) return;
      lines.push(day.isRest ? `${name} — Rest` : `${name} — ${day.focus || day.name || 'Circuit'}`);
    });
  } else if (templateId === 'writers' && stored.writersDays) {
    SHORT_DAYS.forEach((name, d) => {
      const row = stored.writersDays[String(d)];
      if (!row) return;
      lines.push(row.rest ? `${name} — Rest` : `${name} — ${row.theme || row.execution || 'Writing'}`);
    });
  } else if (templateId === 'dual-brand' && stored.brandDays) {
    SHORT_DAYS.forEach((name, d) => {
      const row = stored.brandDays[String(d)];
      if (!row) return;
      lines.push(row.rest ? `${name} — Rest` : `${name} — personal + company`);
    });
  } else if (templateId === 'software-engineering' && stored.seDays) {
    SHORT_DAYS.forEach((name, d) => {
      const row = stored.seDays[String(d)];
      if (!row) return;
      const discs = (row.disciplines || []).join(' · ');
      lines.push(row.rest ? `${name} — Rest` : `${name} — ${discs || 'Session'}${row.time ? ` · ${row.time}` : ''}`);
    });
  }

  if (!lines.length && stored.weeklyPlan) {
    SHORT_DAYS.forEach((name, d) => {
      const act = stored.weeklyPlan[d] || stored.weeklyPlan[String(d)];
      if (!act) return;
      lines.push(`${name} — ${act.label || act.type}${act.time ? ` · ${act.time}` : ''}`);
    });
  }

  return lines.length ? lines.slice(0, 8) : getDefaultPlanPreviewItems(journeyId);
}

export { SE_DISCIPLINES, WEEKDAY_FULL };
