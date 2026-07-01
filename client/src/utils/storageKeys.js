/** Central localStorage keys for Forge90 */
export const STORAGE_KEYS = {
  PROGRESS: 'forge90Progress',
  XP: 'forge90XP',
  STREAKS: 'forge90Streaks',
  ACHIEVEMENTS: 'forge90Achievements',
  THEME: 'forge90Theme',
  OFFLINE_MODE: 'forge90_offline_mode',
  QUIZ_RESULTS: 'forge90QuizResults',
  MIGRATION_FLAG: 'forge90_storage_migrated_v1',
};

const LEGACY_TO_FORGE90 = {
  ascensionProgress: STORAGE_KEYS.PROGRESS,
  ascensionXP: STORAGE_KEYS.XP,
  ascensionStreaks: STORAGE_KEYS.STREAKS,
  ascensionAchievements: STORAGE_KEYS.ACHIEVEMENTS,
  ascensionTheme: STORAGE_KEYS.THEME,
  ascension_offline_mode: STORAGE_KEYS.OFFLINE_MODE,
};

/**
 * One-time migration: copy legacy ascension* keys to forge90* keys, then remove old keys.
 * Wrapped in try/catch — a corrupt key must not crash the app before React mounts.
 */
export function migrateLegacyStorage() {
  if (typeof window === 'undefined') return;

  try {
    if (localStorage.getItem(STORAGE_KEYS.MIGRATION_FLAG) === 'true') {
      return;
    }

    Object.entries(LEGACY_TO_FORGE90).forEach(([oldKey, newKey]) => {
      const val = localStorage.getItem(oldKey);
      if (val !== null) {
        if (localStorage.getItem(newKey) === null) {
          localStorage.setItem(newKey, val);
        }
        localStorage.removeItem(oldKey);
      }
    });

    localStorage.setItem(STORAGE_KEYS.MIGRATION_FLAG, 'true');
  } catch (e) {
    console.warn('Forge90: localStorage migration failed, clearing to recover', e);
    try {
      localStorage.clear();
    } catch {
      /* ignore */
    }
  }
}
