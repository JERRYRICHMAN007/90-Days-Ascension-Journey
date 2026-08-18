/**
 * Global journey bulk actions for Settings.
 */

import { getRegistryJourneys } from './journeyRegistry.js';
import {
  getJourneyTimeline,
  isJourneyStarted,
  startJourney,
  getAllJourneyStartDates,
  getDefaultPickerDate,
  resolveLiveStartYmd,
} from './journeyPlanning.js';
import { formatYmd } from './dates.js';
import { STORAGE_KEYS } from './storageKeys.js';
import { getJourneySetup } from './journeySetup.js';
import { wipeJourneyRuntimeData, dispatchJourneyWipeEvents } from './journeyReset.js';

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
      const ymd = resolveLiveStartYmd(
        getJourneySetup(j.id).startYmd ||
          j.startYmd ||
          getJourneyTimeline(j.id).startYmd ||
          getDefaultPickerDate()
      );
      startJourney(j.id, ymd);
      started += 1;
    });

  dispatchBulkEvents();
  return {
    started,
    alreadyActive,
    unconfigured: unconfigured.map((j) => ({ id: j.id, title: j.title })),
  };
}

/**
 * Reset all journey progress and move every journey back to planned (not active).
 * Start dates are set to today so the next start begins at Day 1.
 */
export function resetAllJourneysProgress() {
  const summary = getJourneyBulkSummary();
  const ids = summary.map((j) => j.id);
  const today = formatYmd(new Date());

  ids.forEach((id) => wipeJourneyRuntimeData(id));

  const map = { ...getAllJourneyStartDates() };
  ids.forEach((id) => {
    map[id] = { startYmd: today, startedAt: null };
  });
  writeJson(STORAGE_KEYS.JOURNEY_STARTS, map);

  writeJson(STORAGE_KEYS.STREAKS, { current: 0, longest: 0, lastDate: null });

  if (typeof window !== 'undefined') {
    ids.forEach((id) => dispatchJourneyWipeEvents(id));
    dispatchBulkEvents();
  }
  return ids.length;
}

export function getGlobalRemindersEnabled() {
  return readJson('aetherGlobalReminders', true) !== false;
}

export function setGlobalRemindersEnabled(enabled) {
  writeJson('aetherGlobalReminders', !!enabled);
}
