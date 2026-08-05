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

/** @typedef {{ id: string, title: string, templateId: string, icon?: string, color?: string, createdAt: string, isDemo?: boolean }} JourneyRegistryEntry */

export const DEMO_JOURNEY_ID = 'demo-intro-journey';

const TEMPLATE_META = {
  'body-transformation': { title: 'Body Transformation', icon: '💪', color: '#00ff87' },
  'dual-brand': { title: 'Dual Brand', icon: '🚀', color: '#00e5ff' },
  reading: { title: 'Reading Journey', icon: '📚', color: '#a78bfa' },
  writers: { title: "Writer's Journey", icon: '✍️', color: '#f59e0b' },
  'software-engineering': { title: 'Software Engineering', icon: '💻', color: '#3b82f6' },
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

function demoEntry() {
  const meta = TEMPLATE_META['body-transformation'];
  const theme = JOURNEY_THEME['body-transformation'];
  return {
    id: DEMO_JOURNEY_ID,
    title: theme?.label || meta.title,
    templateId: 'body-transformation',
    icon: meta.icon,
    color: meta.color,
    createdAt: new Date().toISOString(),
    isDemo: true,
  };
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

function hasMeaningfulAppUsage() {
  try {
    const xpRaw = localStorage.getItem(STORAGE_KEYS.XP);
    if (xpRaw) {
      const xp = JSON.parse(xpRaw);
      if ((xp.global || 0) > 0) return true;
      if (Object.values(xp.domains || {}).some((v) => Number(v) > 0)) return true;
    }
  } catch {
    return true;
  }

  try {
    const stored = localStorage.getItem('sessionCompletions');
    if (stored && stored !== '{}' && stored !== 'null') {
      const parsed = JSON.parse(stored);
      if (Object.keys(parsed).length > 0) return true;
    }
  } catch {
    return true;
  }

  if (localStorage.getItem(STORAGE_KEYS.HAS_CREATED_JOURNEY) === 'true') return true;

  const globalStart = localStorage.getItem(STORAGE_KEYS.JOURNEY_START);
  if (globalStart) return true;

  return detectLegacyJourneyIds().size > 0;
}

export function hasCreatedJourney() {
  if (localStorage.getItem(STORAGE_KEYS.HAS_CREATED_JOURNEY) === 'true') return true;
  return readRegistry().some((e) => !e.isDemo);
}

function markHasCreatedJourney() {
  localStorage.setItem(STORAGE_KEYS.HAS_CREATED_JOURNEY, 'true');
}

function removeDemoEntries(entries) {
  return entries.filter((e) => !e.isDemo && e.id !== DEMO_JOURNEY_ID);
}

/**
 * Idempotent migration: restore legacy journeys, inject demo only for brand-new users.
 * User data always wins over placeholders.
 */
export function migrateJourneyRegistry() {
  if (typeof window === 'undefined') return [];

  migratePerJourneyStartsFromGlobal();

  let entries = readRegistry();
  const returningUser = hasMeaningfulAppUsage();
  const realEntries = removeDemoEntries(entries);
  const byId = new Map(entries.map((e) => [e.id, e]));

  if (returningUser) {
    markHasCreatedJourney();

    JOURNEY_IDS.forEach((templateId) => {
      const hasNonDemo = [...byId.values()].some(
        (e) => !e.isDemo && (e.id === templateId || e.templateId === templateId)
      );
      if (!hasNonDemo) {
        byId.set(templateId, legacyEntry(templateId));
      }
    });

    entries = removeDemoEntries([...byId.values()]);
  } else if (realEntries.length === 0) {
    if (!byId.has(DEMO_JOURNEY_ID)) {
      entries = [demoEntry()];
    }
  } else {
    entries = removeDemoEntries([...byId.values()]);
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
  writeRegistry(readRegistry().filter((e) => e.id !== journeyId));
}
