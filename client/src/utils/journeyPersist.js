/**
 * Persist journey progress across logout/login.
 * - Keep local journey keys on the device
 * - Optionally sync starts/setup/plans to user.preferences on the backend
 */

import { STORAGE_KEYS } from './storageKeys.js';

/** Keys that must survive logout (progress + journey state) */
export const PERSISTENT_STORAGE_KEYS = [
  STORAGE_KEYS.OFFLINE_MODE,
  STORAGE_KEYS.PROGRESS,
  STORAGE_KEYS.XP,
  STORAGE_KEYS.STREAKS,
  STORAGE_KEYS.ACHIEVEMENTS,
  STORAGE_KEYS.THEME,
  STORAGE_KEYS.QUIZ_RESULTS,
  STORAGE_KEYS.MIGRATION_FLAG,
  STORAGE_KEYS.JOURNEY_START,
  STORAGE_KEYS.JOURNEY_STARTS,
  STORAGE_KEYS.JOURNEY_REGISTRY,
  STORAGE_KEYS.HAS_CREATED_JOURNEY,
  STORAGE_KEYS.JOURNEY_REGISTRY_MIGRATED_V2,
  STORAGE_KEYS.JOURNEY_AVAILABILITY,
  STORAGE_KEYS.START_ALL_JOURNEYS,
  STORAGE_KEYS.JOURNEY_SETUP,
  STORAGE_KEYS.FAVORITE_QUOTES,
  STORAGE_KEYS.CUSTOM_TEMPLATES,
  STORAGE_KEYS.JOURNEY_DAILY_NOTES,
  STORAGE_KEYS.JOURNEY_WEEKLY_PLAN,
  STORAGE_KEYS.WORKOUT_PLAN,
  STORAGE_KEYS.JOURNEY_CUSTOM_PLAN,
  'sessionCompletions',
  'aetherAssessmentResults',
];

const AUTH_KEYS = ['accessToken', 'refreshToken', 'authToken'];

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

function collectPersistentSnapshot() {
  const snapshot = {};
  PERSISTENT_STORAGE_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value != null) snapshot[key] = value;
  });

  // Dynamic keys (lesson progress, quizzes, etc.)
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (
      key.startsWith('lessonProgress_') ||
      key.startsWith('dailyQuizzes_') ||
      key.startsWith('practicalAssessments_') ||
      key.startsWith('points_') ||
      key.startsWith('coins_') ||
      key.startsWith('level_') ||
      key.startsWith('achievements_')
    ) {
      const value = localStorage.getItem(key);
      if (value != null) snapshot[key] = value;
    }
  }

  return snapshot;
}

/**
 * Clear auth session without wiping journey progress.
 * Prefer selective auth-key removal; fall back to clear+restore if needed.
 */
export function clearAuthSessionPreserveProgress() {
  try {
    const snapshot = collectPersistentSnapshot();

    // Prefer: only remove auth tokens (keeps everything else intact)
    AUTH_KEYS.forEach((key) => localStorage.removeItem(key));

    // Ensure snapshot keys still present (in case something else cleared them)
    Object.entries(snapshot).forEach(([key, value]) => {
      if (localStorage.getItem(key) == null) {
        localStorage.setItem(key, value);
      }
    });

    // Clear session-only UI state, not journey data
    try {
      sessionStorage.clear();
    } catch {
      /* ignore */
    }
  } catch (error) {
    console.error('Aether: failed to clear auth session safely', error);
    // Last resort: wipe auth keys only
    AUTH_KEYS.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    });
  }
}

export function getLocalJourneyCloudPayload() {
  return {
    journeyStarts: readJson(STORAGE_KEYS.JOURNEY_STARTS, {}),
    journeyRegistry: readJson(STORAGE_KEYS.JOURNEY_REGISTRY, []),
    hasCreatedJourney: localStorage.getItem(STORAGE_KEYS.HAS_CREATED_JOURNEY) === 'true',
    journeySetup: readJson(STORAGE_KEYS.JOURNEY_SETUP, {}),
    journeyWeeklyPlan: readJson(STORAGE_KEYS.JOURNEY_WEEKLY_PLAN, {}),
    journeyAvailability: readJson(STORAGE_KEYS.JOURNEY_AVAILABILITY, {}),
    workoutPlan: readJson(STORAGE_KEYS.WORKOUT_PLAN, {}),
    startAllJourneys: localStorage.getItem(STORAGE_KEYS.START_ALL_JOURNEYS) === 'true',
    updatedAt: new Date().toISOString(),
  };
}

function mergeStarts(localStarts, remoteStarts) {
  const out = { ...(localStarts || {}) };
  Object.entries(remoteStarts || {}).forEach(([id, remote]) => {
    const local = out[id];
    if (!local) {
      out[id] = remote;
      return;
    }
    // Prefer whichever is actually started
    const localStarted = typeof local === 'object' && local?.startedAt;
    const remoteStarted = typeof remote === 'object' && remote?.startedAt;
    if (!localStarted && remoteStarted) {
      out[id] = remote;
      return;
    }
    if (localStarted && remoteStarted) {
      // Keep earliest start date / keep local if both started
      const localYmd = local.startYmd || local;
      const remoteYmd = remote.startYmd || remote;
      out[id] = {
        ...remote,
        ...local,
        startYmd: localYmd || remoteYmd,
        startedAt: local.startedAt || remote.startedAt,
      };
    }
  });
  return out;
}

/**
 * Push local journey state into user.preferences.journeyState
 */
export async function syncJourneyStateToBackend() {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return false;

  try {
    const { api } = await import('../services/api.js');
    const me = await api.getUser();
    const currentPrefs = me?.data?.preferences || {};
    const payload = getLocalJourneyCloudPayload();
    await api.updateUser({
      preferences: {
        ...currentPrefs,
        journeyState: payload,
      },
    });
    return true;
  } catch (error) {
    console.warn('Aether: journey state sync failed', error);
    return false;
  }
}

/**
 * Pull journey state from preferences and merge into localStorage.
 */
export async function hydrateJourneyStateFromBackend() {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return false;

  try {
    const { api } = await import('../services/api.js');
    const me = await api.getUser();
    const remote = me?.data?.preferences?.journeyState;
    if (!remote || typeof remote !== 'object') return false;

    const localStarts = readJson(STORAGE_KEYS.JOURNEY_STARTS, {});
    const mergedStarts = mergeStarts(localStarts, remote.journeyStarts || {});
    writeJson(STORAGE_KEYS.JOURNEY_STARTS, mergedStarts);

    if (Array.isArray(remote.journeyRegistry) && remote.journeyRegistry.length) {
      const localReg = readJson(STORAGE_KEYS.JOURNEY_REGISTRY, []);
      if (!localReg.length) {
        writeJson(STORAGE_KEYS.JOURNEY_REGISTRY, remote.journeyRegistry);
      }
    }

    if (remote.hasCreatedJourney) {
      localStorage.setItem(STORAGE_KEYS.HAS_CREATED_JOURNEY, 'true');
    }

    if (remote.journeySetup && typeof remote.journeySetup === 'object') {
      const localSetup = readJson(STORAGE_KEYS.JOURNEY_SETUP, {});
      writeJson(STORAGE_KEYS.JOURNEY_SETUP, { ...remote.journeySetup, ...localSetup });
    }

    if (remote.journeyWeeklyPlan && typeof remote.journeyWeeklyPlan === 'object') {
      const localPlan = readJson(STORAGE_KEYS.JOURNEY_WEEKLY_PLAN, {});
      writeJson(STORAGE_KEYS.JOURNEY_WEEKLY_PLAN, { ...remote.journeyWeeklyPlan, ...localPlan });
    }

    if (remote.journeyAvailability && typeof remote.journeyAvailability === 'object') {
      const localAvail = readJson(STORAGE_KEYS.JOURNEY_AVAILABILITY, {});
      writeJson(STORAGE_KEYS.JOURNEY_AVAILABILITY, { ...remote.journeyAvailability, ...localAvail });
    }

    if (remote.workoutPlan && typeof remote.workoutPlan === 'object') {
      const localWorkout = readJson(STORAGE_KEYS.WORKOUT_PLAN, {});
      writeJson(STORAGE_KEYS.WORKOUT_PLAN, { ...remote.workoutPlan, ...localWorkout });
    }

    if (remote.startAllJourneys) {
      localStorage.setItem(STORAGE_KEYS.START_ALL_JOURNEYS, 'true');
    }

    window.dispatchEvent(new CustomEvent('journey-start-updated', { detail: { hydrated: true } }));
    window.dispatchEvent(new CustomEvent('journey-setup-updated', { detail: { hydrated: true } }));
    window.dispatchEvent(new CustomEvent('journey-weekly-plan-updated', { detail: { hydrated: true } }));
    return true;
  } catch (error) {
    console.warn('Aether: journey state hydrate failed', error);
    return false;
  }
}

/** Debounced cloud sync after local journey changes */
let syncTimer = null;
export function scheduleJourneyStateSync(delayMs = 800) {
  if (typeof window === 'undefined') return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncJourneyStateToBackend();
  }, delayMs);
}
