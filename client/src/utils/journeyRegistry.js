/**
 * User journey registry — each entry is an independent journey instance.
 */

import { STORAGE_KEYS } from './storageKeys.js';
import { JOURNEY_THEME, JOURNEY_IDS } from './journeyTheme.js';
import { getCustomTemplate } from './journeyTemplates.js';
import {
  getAllJourneyStartDates,
  migratePerJourneyStartsFromGlobal,
} from './journeyPlanning.js';
import { wipeJourneyRuntimeData, dispatchJourneyWipeEvents } from './journeyReset.js';

/** @typedef {{ id: string, title: string, templateId: string, icon?: string, color?: string, createdAt: string, isDemo?: boolean }} JourneyRegistryEntry */

export const DEMO_JOURNEY_ID = 'demo-intro-journey';

const TEMPLATE_META = {
  'body-transformation': {
    title: 'Body Transformation',
    icon: '💪',
    color: '#00ff87',
    description: 'Strength, energy, and a daily training rhythm.',
  },
  'dual-brand': {
    title: 'Dual Brand',
    icon: '🚀',
    color: '#00e5ff',
    description: 'Grow your personal brand and your business together.',
  },
  reading: {
    title: 'Reading Journey',
    icon: '📚',
    color: '#a78bfa',
    description: 'Read with a plan — books that change how you think.',
  },
  writers: {
    title: "Writer's Journey",
    icon: '✍️',
    color: '#f59e0b',
    description: 'Write, publish, and build a consistent voice.',
  },
  'software-engineering': {
    title: 'Software Engineering',
    icon: '💻',
    color: '#3b82f6',
    description: 'Mobile, frontend, and backend — ship real skills.',
  },
};

function readRegistry() {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNEY_REGISTRY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRegistry(entries) {
  localStorage.setItem(STORAGE_KEYS.JOURNEY_REGISTRY, JSON.stringify(entries));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('journey-registry-updated'));
  }
}

function legacyEntry(templateId) {
  const meta = TEMPLATE_META[templateId] || {};
  const theme = JOURNEY_THEME[templateId];
  return {
    id: templateId,
    title: theme?.label || meta.title || templateId,
    templateId,
    icon: meta.icon,
    color: meta.color,
    createdAt: new Date().toISOString(),
    isDemo: false,
  };
}

function starterEntries() {
  return JOURNEY_IDS.map((templateId) => legacyEntry(templateId));
}

function stripJourneyKeyedStore(storageKey, journeyId) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    const all = JSON.parse(raw);
    if (!all || typeof all !== 'object' || !(journeyId in all)) return;
    delete all[journeyId];
    localStorage.setItem(storageKey, JSON.stringify(all));
  } catch {
    /* ignore */
  }
}

/** Journeys with saved completions, schedules, or availability */
function detectLegacyJourneyIds() {
  const active = new Set();

  try {
    const starts = getAllJourneyStartDates();
    JOURNEY_IDS.forEach((id) => {
      if (starts[id]) active.add(id);
    });
  } catch {
    /* ignore */
  }

  try {
    const availRaw = localStorage.getItem(STORAGE_KEYS.JOURNEY_AVAILABILITY);
    if (availRaw) {
      const avail = JSON.parse(availRaw);
      JOURNEY_IDS.forEach((id) => {
        if (avail[id]) active.add(id);
      });
    }
  } catch {
    /* ignore */
  }

  try {
    const completions = JSON.parse(localStorage.getItem('sessionCompletions') || '{}');
    JOURNEY_IDS.forEach((id) => {
      if (Object.keys(completions).some((k) => k.startsWith(`${id}_`))) {
        active.add(id);
      }
    });
  } catch {
    /* ignore */
  }

  return active;
}

export function hasCreatedJourney() {
  if (localStorage.getItem(STORAGE_KEYS.HAS_CREATED_JOURNEY) === 'true') return true;
  return readRegistry().some((e) => !e.isDemo && e.id !== DEMO_JOURNEY_ID);
}

function markHasCreatedJourney() {
  localStorage.setItem(STORAGE_KEYS.HAS_CREATED_JOURNEY, 'true');
}

function removeDemoEntries(entries) {
  return entries.filter((e) => !e.isDemo && e.id !== DEMO_JOURNEY_ID);
}

/**
 * New users get the five starter journeys once. Removals stick.
 * Journeys with existing local progress are restored if missing from the list.
 */
export function migrateJourneyRegistry() {
  if (typeof window === 'undefined') return [];

  migratePerJourneyStartsFromGlobal();

  let entries = removeDemoEntries(readRegistry());
  const byId = new Map(entries.map((e) => [e.id, e]));

  detectLegacyJourneyIds().forEach((templateId) => {
    const hasEntry = [...byId.values()].some(
      (e) => e.id === templateId || e.templateId === templateId
    );
    if (!hasEntry) byId.set(templateId, legacyEntry(templateId));
  });

  entries = [...byId.values()];

  const startersSeeded = localStorage.getItem(STORAGE_KEYS.JOURNEY_STARTERS_SEEDED) === 'true';
  if (entries.length === 0 && !startersSeeded) {
    entries = starterEntries();
  }

  if (entries.length > 0) {
    localStorage.setItem(STORAGE_KEYS.JOURNEY_STARTERS_SEEDED, 'true');
    markHasCreatedJourney();
  }

  const serialized = JSON.stringify(entries);
  if (localStorage.getItem(STORAGE_KEYS.JOURNEY_REGISTRY) !== serialized) {
    writeRegistry(entries);
  }

  localStorage.setItem(STORAGE_KEYS.JOURNEY_REGISTRY_MIGRATED_V2, 'true');
  return entries;
}

/** @deprecated Use migrateJourneyRegistry */
export function ensureJourneyRegistry() {
  return migrateJourneyRegistry();
}

export function getRegistryJourneys() {
  return migrateJourneyRegistry();
}

export function getRegistryEntry(journeyId) {
  return getRegistryJourneys().find((e) => e.id === journeyId) || null;
}

/** Resolve content template for curriculum loading */
export function getContentTemplateId(journeyId) {
  const entry = getRegistryEntry(journeyId);
  if (entry?.isDemo) return entry.templateId;
  if (entry?.templateId?.startsWith('custom-')) {
    const custom = getCustomTemplate(entry.templateId);
    if (custom?.baseTemplateId && JOURNEY_IDS.includes(custom.baseTemplateId)) {
      return custom.baseTemplateId;
    }
    if (custom?.fromScratch) return 'custom-scratch';
    return 'body-transformation';
  }
  if (entry?.templateId && JOURNEY_IDS.includes(entry.templateId)) return entry.templateId;
  return entry?.templateId || journeyId;
}

export function getJourneyTemplates() {
  return JOURNEY_IDS.map((id) => ({
    templateId: id,
    ...TEMPLATE_META[id],
    label: JOURNEY_THEME[id]?.label || TEMPLATE_META[id]?.title,
  }));
}

export function createJourney({ title, templateId, icon, color }) {
  markHasCreatedJourney();
  localStorage.setItem(STORAGE_KEYS.JOURNEY_STARTERS_SEEDED, 'true');

  const id = `journey-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const meta = TEMPLATE_META[templateId] || {};
  const entry = {
    id,
    title: title.trim(),
    templateId,
    icon: icon || meta.icon || '✨',
    color: color || meta.color || '#6ee7b7',
    createdAt: new Date().toISOString(),
    isDemo: false,
  };

  const withoutDemo = removeDemoEntries(readRegistry());
  writeRegistry([...withoutDemo, entry]);
  return entry;
}

export function removeJourney(journeyId) {
  if (!journeyId) return;
  wipeJourneyRuntimeData(journeyId);
  [
    STORAGE_KEYS.JOURNEY_STARTS,
    STORAGE_KEYS.JOURNEY_AVAILABILITY,
    STORAGE_KEYS.JOURNEY_SETUP,
    STORAGE_KEYS.JOURNEY_WEEKLY_PLAN,
    STORAGE_KEYS.JOURNEY_CUSTOM_PLAN,
    STORAGE_KEYS.JOURNEY_DAILY_NOTES,
    STORAGE_KEYS.WORKOUT_PLAN,
  ].forEach((key) => stripJourneyKeyedStore(key, journeyId));

  localStorage.setItem(STORAGE_KEYS.JOURNEY_STARTERS_SEEDED, 'true');
  writeRegistry(readRegistry().filter((e) => e.id !== journeyId));
  dispatchJourneyWipeEvents(journeyId);
}
