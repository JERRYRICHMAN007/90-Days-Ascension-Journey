/**
 * Resolve the user's real calendar day for a journey day number.
 * Static week libraries are anchored to JOURNEY_START_DATE (often a Saturday),
 * which can disagree with the per-journey start the user actually chose.
 */

import { getContentWeekForDay, getDateForDay as getJourneyDateForDay } from './journeyPlanning.js';
import { getDisplayWeeklyPlan, formatHourLabel } from './journeyWeeklyPlan.js';
import { getContentTemplateId } from './journeyRegistry.js';

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

function weekdayFromYmd(ymd) {
  if (!ymd) return null;
  const [y, m, d] = String(ymd).split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d).getDay();
}

/**
 * Find a library day whose baked weekday matches the live calendar.
 * Prefers a full week over the partial first week (Saturday-only rest when
 * the content calendar starts on Saturday).
 */
export function findLibraryDayForWeekday(weeks, weekday, preferredDayNumber = 1) {
  if (weekday == null || !weeks?.length) return null;
  const preferredWeek = getContentWeekForDay(weeks, preferredDayNumber);
  const ordered = [...weeks].sort((a, b) => {
    const ad = Math.abs((a.weekNumber || 0) - preferredWeek);
    const bd = Math.abs((b.weekNumber || 0) - preferredWeek);
    return ad - bd;
  });

  let restFallback = null;
  for (const week of ordered) {
    for (const day of week.days || []) {
      if (weekdayFromYmd(day.date) !== weekday) continue;
      const looksRest = day.isRestDay || /rest/i.test(day.focus || '');
      if (looksRest && (day.dayNumber || 0) <= 1) {
        restFallback = restFallback || { ...day, weekNumber: week.weekNumber };
        continue;
      }
      return { ...day, weekNumber: week.weekNumber };
    }
  }
  return restFallback;
}

function applyWeeklyPlanFocus(day, journeyId, weekday) {
  const act = getDisplayWeeklyPlan(journeyId)?.[weekday];
  if (!act) return day;
  const planIsRest = act.type === 'recovery' || act.type === 'rest';
  const focusLooksRest = /rest/i.test(day.focus || '') || day.isRestDay;
  if (!planIsRest && focusLooksRest) {
    return { ...day, isRestDay: false, focus: act.label || day.focus };
  }
  if (!day.focus || day.focus === 'Session') {
    return { ...day, focus: act.label || day.focus };
  }
  if (planIsRest && focusLooksRest) {
    return { ...day, focus: act.label || day.focus };
  }
  return day;
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
 * Patch any journey day with the live calendar weekday/date and weekday-matched content.
 * Body/reading/writing templates repeat weekly — Day 1 must not stay Saturday rest
 * when the user's Day 1 is a Tuesday.
 */
export function resolveLiveJourneyDay(day, journeyId, weeks) {
  if (!day?.dayNumber || !journeyId) return day;

  const templateId = getContentTemplateId(journeyId);
  if (templateId === 'software-engineering') {
    return resolveLiveSoftwareEngineeringDay(day, journeyId);
  }

  const liveDate = getLiveCalendarDate(journeyId, day.dayNumber);
  if (!liveDate) return day;

  const weekday = liveDate.getDay();
  const template = findLibraryDayForWeekday(weeks, weekday, day.dayNumber);
  const merged = template
    ? {
        ...template,
        dayNumber: day.dayNumber,
        weekNumber: day.weekNumber || template.weekNumber,
      }
    : { ...day };

  const withPlan = applyWeeklyPlanFocus(merged, journeyId, weekday);

  return {
    ...withPlan,
    dayNumber: day.dayNumber,
    dayName: DAY_NAMES[weekday],
    date: formatLiveYmd(liveDate),
    dayIndex: jsDayToScheduleIndex(weekday),
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
  const label = act.label || '';
  if (time && label) return `Session ${time} · ${label}`;
  if (time) return `Session ${time}`;
  return label || fallback || null;
}
