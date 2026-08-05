/**
 * Journey-specific AI assistant context — personas, examples, and scoped defaults.
 * Every journey instance is isolated by its unique journeyId.
 */

import { getRegistryEntry, getContentTemplateId } from './journeyRegistry.js';
import { getCustomTemplate } from './journeyTemplates.js';
import { STORAGE_KEYS } from './storageKeys.js';

/** @typedef {'fitness'|'reading'|'faith'|'learning'|'business'|'meditation'|'writing'} JourneyAICategory */

/** @typedef {{
 *   journeyId: string,
 *   journeyTitle: string,
 *   templateId: string,
 *   category: JourneyAICategory,
 *   coachLabel: string,
 *   description: string,
 *   placeholder: string,
 *   examplePrompts: string[],
 *   fallbackHints: string[],
 *   sessionTerm: string,
 *   restTerm: string,
 * }} JourneyAIContext */

const TEMPLATE_CATEGORY = {
  'body-transformation': 'fitness',
  reading: 'reading',
  writers: 'writing',
  'software-engineering': 'learning',
  'dual-brand': 'business',
};

/** @type {Record<JourneyAICategory, Omit<JourneyAIContext, 'journeyId'|'journeyTitle'|'templateId'|'category'>>} */
export const AI_PERSONAS = {
  fitness: {
    coachLabel: 'Fitness coach',
    description:
      'Describe schedule, workout days, recovery, session times, or goals in plain language. I\'ll tell you if something is outside what I can change here.',
    placeholder: 'e.g. "Move my workouts to Monday, Wednesday, and Friday"',
    examplePrompts: [
      'Move recovery to weekends',
      'Reduce workouts to 3 days a week',
      'Remove times on Saturday and Sunday',
      'Move workouts to 6 AM',
    ],
    fallbackHints: ['Move recovery to weekends', '3 workout days a week', 'Move workouts to 6 AM'],
    sessionTerm: 'workout',
    restTerm: 'recovery',
  },
  reading: {
    coachLabel: 'Reading coach',
    description:
      'Describe changes to reading goals, sessions, schedule, or pace. Updates apply only to this journey.',
    placeholder: 'e.g. "Increase my reading target to 30 pages per day"',
    examplePrompts: [
      'Read 30 pages every weekday',
      'Move reading sessions to evenings',
      'Add a Sunday reflection session',
      'Reduce to 20 minutes daily',
    ],
    fallbackHints: ['30 pages per day', 'Read on weekday evenings', 'Add Sunday reflection'],
    sessionTerm: 'reading session',
    restTerm: 'rest day',
  },
  faith: {
    coachLabel: 'Bible study guide',
    description:
      'Describe changes to devotionals, scripture plans, prayer, or reflection. Updates apply only to this journey.',
    placeholder: 'e.g. "Add daily scripture reading at 7 AM"',
    examplePrompts: [
      'Daily devotional every morning',
      'Sunday prayer and reflection',
      'Memorize one verse per week',
      'Move study sessions to evenings',
    ],
    fallbackHints: ['Daily devotional at 7 AM', 'Sunday prayer time', 'Scripture on weekdays'],
    sessionTerm: 'devotional',
    restTerm: 'rest day',
  },
  learning: {
    coachLabel: 'Learning mentor',
    description:
      'Describe changes to lessons, practice, projects, or study schedule. Updates apply only to this journey.',
    placeholder: 'e.g. "Study on weekdays and project work on Saturdays"',
    examplePrompts: [
      'Study 1 hour on weekday evenings',
      'Saturday project sessions',
      'Add weekly revision on Sunday',
      'Reduce to 30 minutes daily',
    ],
    fallbackHints: ['Weekday evening study', 'Saturday project time', 'Weekly revision'],
    sessionTerm: 'study session',
    restTerm: 'rest day',
  },
  business: {
    coachLabel: 'Business strategist',
    description:
      'Describe changes to milestones, planning, deliverables, or execution schedule. Updates apply only to this journey.',
    placeholder: 'e.g. "Monday planning and Friday deliverable reviews"',
    examplePrompts: [
      'Monday planning sessions',
      'Execution blocks Tue–Fri mornings',
      'Weekly review every Sunday',
      'Move meetings to afternoons',
    ],
    fallbackHints: ['Monday planning', 'Weekday execution blocks', 'Sunday weekly review'],
    sessionTerm: 'work session',
    restTerm: 'rest day',
  },
  meditation: {
    coachLabel: 'Mindfulness guide',
    description:
      'Describe changes to meditation, breathing, mindfulness, or reflection schedule. Updates apply only to this journey.',
    placeholder: 'e.g. "Meditate every morning at 7 AM for 15 minutes"',
    examplePrompts: [
      'Daily morning meditation',
      'Add evening breathing exercises',
      'Sunday reflection session',
      'Reduce to 10 minutes daily',
    ],
    fallbackHints: ['Morning meditation at 7 AM', 'Evening breathing practice', 'Sunday reflection'],
    sessionTerm: 'meditation',
    restTerm: 'rest day',
  },
  writing: {
    coachLabel: 'Writing coach',
    description:
      'Describe changes to writing sessions, editing, goals, or creative schedule. Updates apply only to this journey.',
    placeholder: 'e.g. "Write on Mon, Wed, Fri evenings and edit on weekends"',
    examplePrompts: [
      'Writing sessions on weekday evenings',
      'Weekend editing blocks',
      'Increase daily word target',
      'Add Sunday journaling',
    ],
    fallbackHints: ['Weekday evening writing', 'Weekend editing', 'Daily word target'],
    sessionTerm: 'writing session',
    restTerm: 'rest day',
  },
};

/** Shared capability boundaries shown in the AI assistant UI */
export const AI_ASSISTANT_LIMITS = {
  can: [
    'Weekly schedule — workout/session days and recovery days',
    'Session times, or clear times for flexible days',
    'Goals, motivation, and success criteria',
    'Reminders for this journey',
  ],
  cannot: [
    'Edit individual program days or exercise lists',
    'Change other journeys from this screen',
    'Medical, meal, or nutrition planning',
    'Delete journeys or export data',
  ],
  evolving:
    'I\'m early and improving — if a change isn\'t right, use Undo and try rephrasing. More phrases are supported over time.',
};

function readWeeklyPlanStorage(journeyId) {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNEY_WEEKLY_PLAN) || '{}');
    return all[journeyId] || null;
  } catch {
    return null;
  }
}

/** Default weekly activity plans per category */
export function getDefaultWeeklyPlanForCategory(category, templateId = '') {
  const evening = '19:00';
  const morning = '07:00';
  const early = '06:00';

  if (category === 'fitness' || templateId === 'body-transformation') {
    const plan = {};
    [1, 2, 3, 4, 5].forEach((d) => {
      plan[d] = { type: 'workout', label: 'Workout', time: early };
    });
    [6, 0].forEach((d) => {
      plan[d] = { type: 'recovery', label: 'Rest & Recovery', time: '08:00' };
    });
    return plan;
  }

  if (category === 'reading') {
    const plan = {};
    [1, 2, 3, 4, 5, 6, 0].forEach((d) => {
      plan[d] = { type: 'learning', label: 'Reading session', time: evening };
    });
    return plan;
  }

  if (category === 'faith') {
    return {
      1: { type: 'learning', label: 'Scripture & Devotional', time: morning },
      2: { type: 'learning', label: 'Scripture & Devotional', time: morning },
      3: { type: 'learning', label: 'Scripture & Devotional', time: morning },
      4: { type: 'learning', label: 'Scripture & Devotional', time: morning },
      5: { type: 'learning', label: 'Scripture & Devotional', time: morning },
      6: { type: 'learning', label: 'Scripture & Devotional', time: morning },
      0: { type: 'recovery', label: 'Prayer & Reflection', time: '09:00' },
    };
  }

  if (category === 'learning') {
    return {
      1: { type: 'learning', label: 'Learning session', time: evening },
      2: { type: 'learning', label: 'Learning session', time: evening },
      3: { type: 'learning', label: 'Learning session', time: evening },
      4: { type: 'learning', label: 'Learning session', time: evening },
      5: { type: 'learning', label: 'Learning session', time: evening },
      6: { type: 'learning', label: 'Project work', time: '10:00' },
      0: { type: 'recovery', label: 'Weekly revision', time: '11:00' },
    };
  }

  if (category === 'business') {
    return {
      1: { type: 'custom', label: 'Planning', time: '09:00' },
      2: { type: 'custom', label: 'Execution', time: '09:00' },
      3: { type: 'custom', label: 'Execution', time: '09:00' },
      4: { type: 'custom', label: 'Execution', time: '09:00' },
      5: { type: 'custom', label: 'Execution', time: '09:00' },
      0: { type: 'recovery', label: 'Weekly review', time: evening },
    };
  }

  if (category === 'meditation') {
    const plan = {};
    [0, 1, 2, 3, 4, 5, 6].forEach((d) => {
      plan[d] = { type: 'recovery', label: 'Meditation', time: morning };
    });
    return plan;
  }

  if (category === 'writing') {
    return {
      1: { type: 'custom', label: 'Writing session', time: evening },
      3: { type: 'custom', label: 'Writing session', time: evening },
      5: { type: 'custom', label: 'Writing session', time: evening },
      2: { type: 'custom', label: 'Editing', time: evening },
      4: { type: 'custom', label: 'Editing', time: evening },
      6: { type: 'recovery', label: 'Creative rest', time: '10:00' },
      0: { type: 'recovery', label: 'Journaling', time: '10:00' },
    };
  }

  return {};
}

/**
 * Resolve full AI context for a specific journey instance (scoped by journeyId).
 * @param {string} journeyId
 * @returns {JourneyAIContext}
 */
export function resolveJourneyAIContext(journeyId) {
  const entry = getRegistryEntry(journeyId);
  const templateId = getContentTemplateId(journeyId);
  let category = TEMPLATE_CATEGORY[templateId] || TEMPLATE_CATEGORY[journeyId] || 'learning';

  if (entry?.templateId?.startsWith('custom-')) {
    const custom = getCustomTemplate(entry.templateId);
    if (custom?.category && AI_PERSONAS[custom.category]) {
      category = custom.category;
    }
  }

  if (!AI_PERSONAS[category]) {
    category = 'learning';
  }

  const persona = AI_PERSONAS[category];
  const journeyTitle = entry?.title || persona.coachLabel;

  return {
    journeyId,
    journeyTitle,
    templateId,
    category,
    ...persona,
  };
}

/** Load journey-scoped profile + weekly plan for AI processing */
export function loadJourneyAIScope(journeyId) {
  const context = resolveJourneyAIContext(journeyId);
  return {
    context,
    weeklyPlan:
      readWeeklyPlanStorage(journeyId) ||
      getDefaultWeeklyPlanForCategory(context.category, context.templateId),
  };
}

/**
 * Detect if prompt mentions another journey type (cross-journey confusion guard).
 */
export function detectCrossJourneyIntent(text, currentCategory) {
  const lower = text.toLowerCase();
  const foreignTerms = {
    fitness: /\b(workout|gym|cardio|muscle|lifting|recovery day)\b/i,
    reading: /\b(read \d+ pages|book|reading session|novel|chapter)\b/i,
    faith: /\b(bible|scripture|devotional|prayer|memorize verse)\b/i,
    business: /\b(meeting|deliverable|milestone|networking|business plan)\b/i,
    meditation: /\b(meditat|mindfulness|breathing exercise)\b/i,
    writing: /\b(write \d+ words|draft|editing session|manuscript)\b/i,
    learning: /\b(lesson|study session|project work|revision|practice problem)\b/i,
  };

  for (const [cat, pattern] of Object.entries(foreignTerms)) {
    if (cat !== currentCategory && pattern.test(lower)) {
      return cat;
    }
  }
  return null;
}
