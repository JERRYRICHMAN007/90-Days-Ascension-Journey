/** Central localStorage keys for Aether */
export const STORAGE_KEYS = {
  PROGRESS: 'aetherProgress',
  XP: 'aetherXP',
  STREAKS: 'aetherStreaks',
  ACHIEVEMENTS: 'aetherAchievements',
  THEME: 'aetherTheme',
  OFFLINE_MODE: 'aether_offline_mode',
  QUIZ_RESULTS: 'aetherQuizResults',
  MIGRATION_FLAG: 'aether_storage_migrated_v1',
  JOURNEY_START: 'aetherJourneyStartDate',
  /** Per-journey schedules: { [journeyId]: { startYmd, startedAt } | 'YYYY-MM-DD' (legacy) } */
  JOURNEY_STARTS: 'aetherJourneyStarts',
  /** User-created journey list: JourneyRegistryEntry[] */
  JOURNEY_REGISTRY: 'aetherJourneyRegistry',
  /** True after the user creates their first real journey */
  HAS_CREATED_JOURNEY: 'aetherHasCreatedJourney',
  /** Registry migration marker */
  JOURNEY_REGISTRY_MIGRATED_V2: 'aetherJourneyRegistryMigratedV2',
  /** Per-journey availability: { [journeyId]: { enabled, availableDays, hoursPerDay } } */
  JOURNEY_AVAILABILITY: 'aetherJourneyAvailability',
  /** When true, all configured journeys start together */
  START_ALL_JOURNEYS: 'aetherStartAllJourneys',
  /** Per-journey setup wizard answers: { [journeyId]: JourneySetupProfile } */
  JOURNEY_SETUP: 'aetherJourneySetup',
  /** Saved favorite quote ids */
  FAVORITE_QUOTES: 'aetherFavoriteQuotes',
  /** User-created journey templates */
  CUSTOM_TEMPLATES: 'aetherCustomTemplates',
  /** Per-journey daily journal: { [journeyId]: { [dayNumber]: DayNote } } */
  JOURNEY_DAILY_NOTES: 'aetherJourneyDailyNotes',
  /** Per-journey weekly plan: { [journeyId]: { [0-6]: WeekdayActivity } } */
  JOURNEY_WEEKLY_PLAN: 'aetherJourneyWeeklyPlan',
};

/** Older key names → current Aether keys (run once on load). */
const LEGACY_TO_AETHER = {
  ascensionProgress: STORAGE_KEYS.PROGRESS,
  ascensionXP: STORAGE_KEYS.XP,
  ascensionStreaks: STORAGE_KEYS.STREAKS,
  ascensionAchievements: STORAGE_KEYS.ACHIEVEMENTS,
  ascensionTheme: STORAGE_KEYS.THEME,
  ascension_offline_mode: STORAGE_KEYS.OFFLINE_MODE,
  forge90Progress: STORAGE_KEYS.PROGRESS,
  forge90XP: STORAGE_KEYS.XP,
  forge90Streaks: STORAGE_KEYS.STREAKS,
  forge90Achievements: STORAGE_KEYS.ACHIEVEMENTS,
  forge90Theme: STORAGE_KEYS.THEME,
  forge90_offline_mode: STORAGE_KEYS.OFFLINE_MODE,
  forge90QuizResults: STORAGE_KEYS.QUIZ_RESULTS,
  forge184Progress: STORAGE_KEYS.PROGRESS,
  forge184XP: STORAGE_KEYS.XP,
  forge184Streaks: STORAGE_KEYS.STREAKS,
  forge184Achievements: STORAGE_KEYS.ACHIEVEMENTS,
  forge184Theme: STORAGE_KEYS.THEME,
  forge184_offline_mode: STORAGE_KEYS.OFFLINE_MODE,
  forge184QuizResults: STORAGE_KEYS.QUIZ_RESULTS,
};

/**
 * One-time migration: copy legacy keys to aether* keys, then remove old keys.
 * Wrapped in try/catch — a corrupt key must not crash the app before React mounts.
 */
export function migrateLegacyStorage() {
  if (typeof window === 'undefined') return;

  try {
    if (localStorage.getItem(STORAGE_KEYS.MIGRATION_FLAG) === 'true') {
      return;
    }

    Object.entries(LEGACY_TO_AETHER).forEach(([oldKey, newKey]) => {
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
    console.warn('Aether: localStorage migration failed, clearing to recover', e);
    try {
      localStorage.clear();
    } catch {
      /* ignore */
    }
  }
}
