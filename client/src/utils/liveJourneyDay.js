/**
 * Resolve the user's real calendar day for a journey day number.
 * Static week libraries are anchored to JOURNEY_START_DATE (often a Saturday),
 * which can disagree with the per-journey start the user actually chose.
 */

import { getDateForDay as getJourneyDateForDay } from './journeyPlanning.js';
import { getDisplayWeeklyPlan, formatHourLabel } from './journeyWeeklyPlan.js';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** JS getDay() → body/SE dayIndex (0=Mon … 5=Sat, 6=Sun) */
export function jsDayToScheduleIndex(jsDay) {
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function getLiveCalendarDate(journeyId, dayNumber) {
  if (!journeyId || !dayNumber || dayNumber < 1) return null;
  return getJourneyDateForDay(journeyId, dayNumber);
}

export function getLiveDayIndex(journeyId, dayNumber) {
  const date = getLiveCalendarDate(journeyId, dayNumber);
  if (!date) return null;
  return jsDayToScheduleIndex(date.getDay());
}

export function getLiveDayName(journeyId, dayNumber) {
  const date = getLiveCalendarDate(journeyId, dayNumber);
  if (!date) return null;
  return DAY_NAMES[date.getDay()];
}

export function formatLiveYmd(date) {
  if (!date) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** SE: Mobile / Frontend / Backend every day except Saturday */
export function getSoftwareEngineeringLiveTimeBlocks(dayIndex) {
  if (dayIndex === 5) {
    return { deepLearning: [], focusedImplementation: [] };
  }

  return {
    deepLearning: [
      {
        time: '4:00 AM - 4:30 AM',
        discipline: 'Mobile',
        type: 'study',
        duration: '30 min',
        isRevision: false,
      },
      {
        time: '4:30 AM - 5:00 AM',
        discipline: 'Frontend',
        type: 'study',
        duration: '30 min',
        isRevision: false,
      },
      {
        time: '5:00 AM - 5:30 AM',
        discipline: 'Backend',
        type: 'study',
        duration: '30 min',
        isRevision: false,
      },
    ],
    focusedImplementation: [],
  };
}

/**
 * Rebuild SE schedule for the LIVE weekday while keeping the day's learning content.
 */
export function resolveLiveSoftwareEngineeringDay(day, journeyId) {
  if (!day?.dayNumber) return day;

  const liveDate = getLiveCalendarDate(journeyId, day.dayNumber);
  const liveDayIndex = liveDate ? jsDayToScheduleIndex(liveDate.getDay()) : null;
  if (liveDayIndex == null) return day;

  const timeBlocks = getSoftwareEngineeringLiveTimeBlocks(liveDayIndex);
  const learning = day.dailyLearning || {};
  const project = day.miniProject || day.project || {};

  const scheduledContent = {
    deepLearning: (timeBlocks.deepLearning || []).map((block) => ({
      ...block,
      content: {
        title:
          learning.title ||
          `${block.discipline} session`,
        description:
          learning.description ||
          `Deep learning for ${block.discipline} (${block.time})`,
        topics: learning.topics || [],
        isRevision: false,
      },
    })),
    focusedImplementation: (timeBlocks.focusedImplementation || []).map((block) => ({
      ...block,
      content: {
        title: project.title || `${block.discipline} build`,
        description: project.description || `Implementation for ${block.discipline}`,
        requirements: project.requirements || [],
        isRevision: false,
      },
    })),
  };

  return {
    ...day,
    dayName: DAY_NAMES[liveDate.getDay()],
    date: formatLiveYmd(liveDate),
    dayIndex: liveDayIndex,
    schedule: {
      ...(day.schedule || {}),
      timeBlocks,
      scheduledContent,
      disciplineRotation: {
        primary: 'Mobile',
        secondary: 'Frontend',
        tertiary: 'Backend',
        allDisciplines: liveDayIndex === 5 ? [] : ['Mobile', 'Frontend', 'Backend'],
        priorityOrder: liveDayIndex === 5 ? [] : ['Mobile', 'Frontend', 'Backend'],
      },
    },
  };
}

/**
 * Patch any journey day with the live calendar weekday/date.
 * Body workouts already resolve live via BodyWorkoutHero; this keeps dayName/date honest everywhere.
 */
export function resolveLiveJourneyDay(day, journeyId) {
  if (!day?.dayNumber || !journeyId) return day;

  if (journeyId === 'software-engineering') {
    return resolveLiveSoftwareEngineeringDay(day, journeyId);
  }

  const liveDate = getLiveCalendarDate(journeyId, day.dayNumber);
  if (!liveDate) return day;

  return {
    ...day,
    dayName: DAY_NAMES[liveDate.getDay()],
    date: formatLiveYmd(liveDate),
    dayIndex: jsDayToScheduleIndex(liveDate.getDay()),
  };
}

/** Session time for this journey day from the user's weekly plan (not the static library). */
export function getLiveTimeBlock(journeyId, dayNumber, fallback = '') {
  const plan = getDisplayWeeklyPlan(journeyId);
  if (!plan || !Object.keys(plan).length) return fallback || null;
  const date = getLiveCalendarDate(journeyId, dayNumber);
  const weekday = date ? date.getDay() : new Date().getDay();
  const act = plan[weekday];
  if (!act) return fallback || null;
  const time = act.time ? formatHourLabel(act.time) : null;
  if (time && act.label) return `${time} · ${act.label}`;
  if (time) return time;
  return act.label || fallback || null;
}
