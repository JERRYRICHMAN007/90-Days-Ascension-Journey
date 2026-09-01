/**
 * Per-journey custom content (reading queue, weekday tasks, SE disciplines).
 * Default journeys leave this empty and use curated sources.
 */

import { STORAGE_KEYS } from './storageKeys.js';
import { getContentTemplateId, getRegistryJourneys } from './journeyRegistry.js';
import {
  READING_LIBRARY_QUEUE,
  READING_BOOKS_BY_MONTH,
} from '../data/journeys/journeyCuratedResources.js';
import { DEFAULT_WEEKLY_ROUTINES } from '../data/journeys/bodyWorkoutPlan.js';
import {
  getDefaultWeeklyPlanForJourney,
  isSoftwareEngineeringLabel,
  resolveJourneyAIContext,
} from './journeyAIContext.js';
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

function defaultGenericDays(sessionLabel = "Today's session") {
  const days = {};
  WEEKDAY_FULL.forEach((_, d) => {
    days[String(d)] = d === 6
      ? { rest: true, task: '' }
      : { rest: false, task: sessionLabel };
  });
  return days;
}

export function getDefaultCustomPlanDraft(journeyId) {
  const templateId = getContentTemplateId(journeyId);
  const ctx = resolveJourneyAIContext(journeyId);
  const weeklyPlan = getDefaultWeeklyPlanForJourney(journeyId);
  const draft = { weeklyPlan };

  if (templateId === 'custom-scratch') {
    draft.genericDays = defaultGenericDays(ctx.journeyTitle || "Today's session");
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
  'custom-scratch':
    'Your own schedule. Session names match this journey — change days, times, and tasks anytime.',
};

export function getDefaultPlanBlurb(journeyId) {
  const templateId = getContentTemplateId(journeyId);
  if (DEFAULT_PLAN_BLURBS[templateId]) return DEFAULT_PLAN_BLURBS[templateId];
  const ctx = resolveJourneyAIContext(journeyId);
  return `${ctx.journeyTitle || 'This journey'} — set your own days and times. You can change them anytime.`;
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
    const ctx = resolveJourneyAIContext(journeyId);
    return [
      ctx.journeyTitle ? `Sessions named “${ctx.journeyTitle}”` : 'Your own name and schedule',
      'Days and times you choose',
      'Change anything later — even after you start',
    ];
  }
  return ['6-month independent schedule', 'Daily sessions + weekly rest'];
}

/**
 * Custom / learning journeys used to inherit Software Engineering labels.
 * Repair stored weekly plans in place.
 */
export function migrateLeakedEngineeringPlans() {
  if (typeof window === 'undefined') return;

  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNEY_WEEKLY_PLAN) || '{}');
    const customAll = readAll();
    let weeklyChanged = false;
    let customChanged = false;

    getRegistryJourneys().forEach((entry) => {
      const templateId = getContentTemplateId(entry.id);
      if (templateId === 'software-engineering') return;

      const plan = stored[entry.id];
      if (plan && typeof plan === 'object') {
        const leaked = Object.values(plan).some((act) => isSoftwareEngineeringLabel(act?.label));
        if (leaked) {
          const defaults = getDefaultWeeklyPlanForJourney(entry.id);
          const next = { ...plan };
          Object.keys(next).forEach((key) => {
            const act = next[key];
            if (!act || !isSoftwareEngineeringLabel(act.label)) return;
            const fallback = defaults[key] || defaults[Number(key)];
            const isRest = act.type === 'recovery' || act.type === 'rest';
            next[key] = {
              ...act,
              type: fallback?.type || (isRest ? 'recovery' : 'learning'),
              label: fallback?.label || (isRest ? 'Rest day' : entry.title || 'Session'),
              time: act.time === '04:00' ? fallback?.time || '19:00' : act.time,
            };
          });
          stored[entry.id] = next;
          weeklyChanged = true;
        }
      }

      const generic = customAll[entry.id]?.genericDays;
      if (generic && typeof generic === 'object' && templateId === 'custom-scratch') {
        let genericDirty = false;
        const nextGeneric = { ...generic };
        Object.keys(nextGeneric).forEach((key) => {
          const row = nextGeneric[key];
          if (row && isSoftwareEngineeringLabel(row.task)) {
            nextGeneric[key] = { ...row, task: entry.title || "Today's session" };
            genericDirty = true;
          }
        });
        if (genericDirty) {
          customAll[entry.id] = { ...customAll[entry.id], genericDays: nextGeneric };
          customChanged = true;
        }
      }
    });

    if (weeklyChanged) {
      localStorage.setItem(STORAGE_KEYS.JOURNEY_WEEKLY_PLAN, JSON.stringify(stored));
      window.dispatchEvent(new CustomEvent('journey-weekly-plan-updated'));
    }
    if (customChanged) writeAll(customAll);
  } catch {
    /* ignore */
  }
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
      : getDefaultWeeklyPlanForJourney(journeyId);
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
      planSource === 'custom' && draft.genericDays
        ? draft.genericDays
        : defaultGenericDays(ctx.journeyTitle || "Today's session");
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
