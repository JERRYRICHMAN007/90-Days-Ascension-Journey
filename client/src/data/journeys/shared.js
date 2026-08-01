export const AETHER_BRAND = "Aether";
/** @deprecated use AETHER_BRAND */
export const FORGE_BRAND = AETHER_BRAND;

/** Day templates in content files (UI length is 6 months from user start). */
export const JOURNEY_TOTAL_DAYS = 184;
export const JOURNEY_DURATION_MONTHS = 6;

export const journeys = [
  {
    id: "body-transformation",
    title: "Body Transformation",
    icon: "💪",
    timeBlock: "Time: 5:00-5:45 AM (Monday-Friday)",
    description: "6-month physical discipline — the foundation that never stops",
    totalDays: JOURNEY_TOTAL_DAYS,
    color: "#667eea",
  },
  {
    id: "dual-brand",
    title: "Dual Brand",
    icon: "🎨",
    timeBlock: "Time: 4:00-5:00 AM (Daily except Saturday)",
    description: "_richman.oo7 + _ryxen.oo7 — revenue and audience compound over 6 months",
    totalDays: JOURNEY_TOTAL_DAYS,
    color: "#f093fb",
  },
  {
    id: "reading",
    title: "Reading",
    icon: "📚",
    timeBlock: "Time: 9:15-10:00 PM (Daily except Friday)",
    description: "6 books over 6 months — knowledge that feeds every other journey",
    totalDays: JOURNEY_TOTAL_DAYS,
    color: "#4facfe",
  },
  {
    id: "writers",
    title: "Writing",
    icon: "✍️",
    timeBlock: "Time: 10:00-10:30 PM (Daily except Friday)",
    description: "6-month distribution engine — content and audience that compound",
    totalDays: JOURNEY_TOTAL_DAYS,
    color: "#43e97b",
  },
  {
    id: "software-engineering",
    title: "Software Engineering",
    icon: "💻",
    timeBlock: "Time: 4:00-5:00 PM (Daily except Sunday)",
    description: "Phase 1: Frontend · Phase 2: Backend + APIs · Phase 3: Ship Comfort",
    totalDays: JOURNEY_TOTAL_DAYS,
    color: "#fa709a",
  },
];

// Default content calendar anchor (overridden in the app by the user's start date)
export const ONBOARDING_START_DATE = "2026-07-09";
export const ONBOARDING_END_DATE = "2026-07-17";
export const JOURNEY_START_DATE = "2026-07-18";
export const JOURNEY_END_DATE = "2027-01-18";

export function formatLocalDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Sunday on or before the given date */
export function getSundayOnOrBefore(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - d.getDay());
  return d;
}

/** Journey day number from a calendar date (null if before Day 1) */
export function getDayNumberFromDateString(dateString) {
  const [sy, sm, sd] = JOURNEY_START_DATE.split("-").map(Number);
  const [dy, dm, dd] = dateString.split("-").map(Number);
  const start = new Date(sy, sm - 1, sd);
  const target = new Date(dy, dm - 1, dd);
  const diffDays = Math.round((target - start) / 86400000);
  if (diffDays < 0) return null;
  return diffDays + 1;
}

/** Calendar date for journey day N (Day 1 = JOURNEY_START_DATE) */
export function getDateStringForDayNumber(dayNumber) {
  const [year, month, day] = JOURNEY_START_DATE.split("-").map(Number);
  const dayDate = new Date(year, month - 1, day + dayNumber - 1);
  return formatLocalDateString(dayDate);
}

/** Day numbers (Sun→Sat order) that fall within a calendar week */
export function getCalendarWeekDayNumbers(weekStartDate, maxDayNumber = 9999) {
  const [y, m, d] = weekStartDate.split("-").map(Number);
  const sunday = new Date(y, m - 1, d);
  const dayNumbers = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    const dayNum = getDayNumberFromDateString(formatLocalDateString(date));
    if (dayNum !== null && dayNum >= 1 && dayNum <= maxDayNumber) {
      dayNumbers.push(dayNum);
    }
  }
  return dayNumbers;
}

/** How many Sun–Sat calendar weeks cover totalDays of the journey */
export function getCalendarWeekCount(totalDays) {
  const lastDayDateStr = getDateStringForDayNumber(totalDays);
  const [ly, lm, ld] = lastDayDateStr.split("-").map(Number);
  const lastDay = new Date(ly, lm - 1, ld);
  const [sy, sm, sd] = JOURNEY_START_DATE.split("-").map(Number);
  const firstSunday = getSundayOnOrBefore(new Date(sy, sm - 1, sd));
  const lastSunday = getSundayOnOrBefore(lastDay);
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor((lastSunday - firstSunday) / msPerWeek) + 1;
}

/** Calendar week number (1-based) for a journey day */
export function getCalendarWeekNumber(dayNumber) {
  if (!dayNumber || dayNumber < 1) return 0;
  const dateStr = getDateStringForDayNumber(dayNumber);
  const [dy, dm, dd] = dateStr.split("-").map(Number);
  const dayDate = new Date(dy, dm - 1, dd);
  const [sy, sm, sd] = JOURNEY_START_DATE.split("-").map(Number);
  const firstSunday = getSundayOnOrBefore(new Date(sy, sm - 1, sd));
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor((dayDate - firstSunday) / msPerWeek) + 1;
}

// Calendar weeks: Sunday → Saturday, aligned to the week containing Day 1
export function generateWeeks(startDate, numWeeks) {
  const weeks = [];
  const [year, month, day] = startDate.split("-").map(Number);
  const firstSunday = getSundayOnOrBefore(new Date(year, month - 1, day));

  for (let i = 0; i < numWeeks; i++) {
    const weekStart = new Date(firstSunday);
    weekStart.setDate(firstSunday.getDate() + i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    weeks.push({
      weekNumber: i + 1,
      startDate: formatLocalDateString(weekStart),
      endDate: formatLocalDateString(weekEnd),
      theme: getWeekTheme(i + 1),
    });
  }

  return weeks;
}

export function getWeekTheme(weekNum) {
  const themes = {
    1: "Foundation Week - Building the foundation for your journey",
    2: "Building Momentum - Consistency and habit formation",
    3: "Deepening Practice - Advanced techniques and refinement",
    4: "Integration Phase - Combining all elements",
    5: "Acceleration - Pushing boundaries and growth",
    6: "Mastery Development - Refining skills and systems",
    7: "Peak Performance - Maximum output and optimization",
    8: "Scaling Phase - Expanding reach and impact",
    9: "Innovation - New approaches and strategies",
    10: "Excellence - Pursuing perfection in execution",
    11: "Leadership - Guiding and inspiring others",
    12: "Transformation - Complete evolution and change",
    14: "Leverage Phase - Systematize income and ship Comfort",
    15: "Scale Phase - Brand at full execution, MVP in progress",
    16: "Completion Phase - Ship Comfort, transform body, publish writing",
    17: "Legacy Phase - Income systemized, arc complete",
  };
  return themes[weekNum] || "Week Theme";
}
