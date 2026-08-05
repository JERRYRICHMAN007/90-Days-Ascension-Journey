/**
 * Global journey bulk actions for Settings.
 */

import { getRegistryJourneys } from './journeyRegistry.js';
import {
  getJourneyTimeline,
  isJourneyStarted,
  startJourney,
  getAllJourneyStartDates,
  parseStartEntry,
} from './journeyPlanning.js';
import { resetJourneyProgress } from './progressTracking.js';
import { STORAGE_KEYS } from './storageKeys.js';
import { getJourneySetup } from './journeySetup.js';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function dispatchBulkEvents() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('journey-start-updated'));
  window.dispatchEvent(new CustomEvent('progress-updated'));
  window.dispatchEvent(new CustomEvent('gamification-hydrated'));
  window.dispatchEvent(new CustomEvent('journey-registry-updated'));
}

/** Summarize registry journeys for bulk UI */
export function getJourneyBulkSummary() {
  return getRegistryJourneys()
    .filter((j) => !j.isDemo)
    .map((j) => {
      const timeline = getJourneyTimeline(j.id);
      const setup = getJourneySetup(j.id);
      const configured = timeline.configured || setup.completed;
      return {
        id: j.id,
        title: j.title,
        icon: j.icon,
        configured,
        started: isJourneyStarted(j.id),
        startYmd: timeline.startYmd,
      };
    });
}

/**
 * Start every configured journey that isn't active yet.
 */
export function enableAllConfiguredJourneys() {
  const summary = getJourneyBulkSummary();
  const unconfigured = summary.filter((j) => !j.configured);
  const alreadyActive = summary.filter((j) => j.started).length;
  let started = 0;

  summary
    .filter((j) => j.configured && !j.started)
    .forEach((j) => {
      const ymd = j.startYmd || getJourneyTimeline(j.id).startYmd;
      if (ymd) {
        startJourney(j.id, ymd);
        started += 1;
      }
    });

  dispatchBulkEvents();
  return {
    started,
    alreadyActive,
    unconfigured: unconfigured.map((j) => ({ id: j.id, title: j.title })),
  };
}

/**
 * Reset progress, streaks, and stats for all journeys while preserving schedules & setup.
 */
export function resetAllJourneysProgress() {
  const summary = getJourneyBulkSummary();
  const ids = summary.map((j) => j.id);

  ids.forEach((id) => resetJourneyProgress(id));

  const map = { ...getAllJourneyStartDates() };
  ids.forEach((id) => {
    const entry = parseStartEntry(map[id]);
    if (entry?.startYmd) {
      map[id] = { startYmd: entry.startYmd, startedAt: null };
    }
  });
  writeJson(STORAGE_KEYS.JOURNEY_STARTS, map);

  const xp = readJson(STORAGE_KEYS.XP, { global: 0, domains: {} });
  let globalRemoved = 0;
  ids.forEach((id) => {
    if (xp.domains?.[id]) {
      globalRemoved += xp.domains[id];
      xp.domains[id] = 0;
    }
  });
  xp.global = Math.max(0, (xp.global || 0) - globalRemoved);
  writeJson(STORAGE_KEYS.XP, xp);

  writeJson(STORAGE_KEYS.STREAKS, { current: 0, longest: 0, lastDate: null });

  dispatchBulkEvents();
  return ids.length;
}

export function getGlobalRemindersEnabled() {
  return readJson('aetherGlobalReminders', true) !== false;
}

export function setGlobalRemindersEnabled(enabled) {
  writeJson('aetherGlobalReminders', !!enabled);
}
