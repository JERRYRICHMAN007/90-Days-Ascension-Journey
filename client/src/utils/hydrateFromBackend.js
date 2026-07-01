import { getJourneyData } from '../data/journeys/index.js';
import { mergeBackendCompletedDays } from './progressTracking.js';
import { STORAGE_KEYS } from './storageKeys.js';
import { JOURNEY_IDS } from './journeyTheme.js';
import { getCurrentDayNumber, getCurrentPhaseStatus } from './dates.js';

const DEFAULT_DOMAINS = {
  'body-transformation': 0,
  reading: 0,
  writers: 0,
  'dual-brand': 0,
  'software-engineering': 0,
};

function normalizeXp(data, fallback) {
  if (!data || typeof data !== 'object') return fallback;
  return {
    global: Number(data.global ?? fallback.global) || 0,
    domains: { ...DEFAULT_DOMAINS, ...(fallback.domains || {}), ...(data.domains || {}) },
  };
}

function normalizeStreaks(data, fallback) {
  if (!data || typeof data !== 'object') return fallback;
  return {
    current: Number(data.current ?? fallback.current) || 0,
    longest: Number(data.longest ?? fallback.longest) || 0,
    lastDate: data.lastDate ?? fallback.lastDate ?? null,
  };
}

function normalizeAchievements(data, fallback = []) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.unlocked)) return data.unlocked;
  if (data && Array.isArray(data.achievements)) return data.achievements;
  return fallback;
}

function readLocalJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Pull progress, XP, streaks, and achievements from the backend after sign-in.
 * Never throws — failures are logged and the app continues with local data.
 */
export async function hydrateFromBackend() {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return;

  const currentDay = getCurrentDayNumber();
  const phase = getCurrentPhaseStatus();
  if (currentDay === 0 || phase === 'preparation') {
    console.log('Forge90: skipping backend hydration on preparation day');
    return;
  }

  const { api } = await import('../services/api.js');

  // Progress per journey — each call isolated
  await Promise.all(
    JOURNEY_IDS.map(async (journeyId) => {
      try {
        const progress = await api.getProgress(journeyId);
        const completedDays = progress?.data?.completedDays;
        if (Array.isArray(completedDays) && completedDays.length) {
          const { weeks } = getJourneyData(journeyId);
          mergeBackendCompletedDays(journeyId, completedDays, weeks);
        }
      } catch (error) {
        console.warn(`Forge90: progress hydrate failed for ${journeyId}`, error);
      }
    })
  );

  const localXp = normalizeXp(readLocalJson(STORAGE_KEYS.XP, null), {
    global: 0,
    domains: { ...DEFAULT_DOMAINS },
  });

  try {
    const xpResponse = await api.getXP();
    const xp = normalizeXp(xpResponse?.data, localXp);
    localStorage.setItem(STORAGE_KEYS.XP, JSON.stringify(xp));
  } catch (error) {
    console.warn('Forge90: XP hydrate failed', error);
  }

  const localStreaks = normalizeStreaks(
    readLocalJson(STORAGE_KEYS.STREAKS, null),
    { current: 0, longest: 0, lastDate: null }
  );

  try {
    const streaksResponse = await api.getStreaks();
    const streaks = normalizeStreaks(streaksResponse?.data, localStreaks);
    localStorage.setItem(STORAGE_KEYS.STREAKS, JSON.stringify(streaks));
  } catch (error) {
    console.warn('Forge90: streaks hydrate failed', error);
  }

  const localAchievements = normalizeAchievements(
    readLocalJson(STORAGE_KEYS.ACHIEVEMENTS, []),
    []
  );

  try {
    const achievementsResponse = await api.getAchievements();
    const fromBackend = normalizeAchievements(achievementsResponse?.data, []);
    const merged = [...localAchievements];
    fromBackend.forEach((a) => {
      const id = typeof a === 'string' ? a : a?.id;
      if (id && !merged.includes(id)) merged.push(id);
      else if (typeof a === 'string' && !merged.includes(a)) merged.push(a);
    });
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(merged));
  } catch (error) {
    console.warn('Forge90: achievements hydrate failed', error);
  }

  window.dispatchEvent(new CustomEvent('gamification-hydrated'));
  window.dispatchEvent(new CustomEvent('progress-updated'));
}
