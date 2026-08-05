/**
 * Smart reminder helpers — uses weekly plan activity times.
 */

import { getWeeklyPlan } from './journeyWeeklyPlan.js';
import { getJourneySetup } from './journeySetup.js';
import { isSessionComplete } from './progressTracking.js';

const WEEKDAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function parseTimeToMinutes(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + (m || 0);
}

function minutesToLabel(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

/**
 * Reminder messages for today's activities.
 * @param {string} journeyId
 * @param {number} weekday 0-6
 * @returns {{ type: string, message: string, minutesUntil: number }[]}
 */
export function getTodayReminders(journeyId, weekday = new Date().getDay()) {
  const setup = getJourneySetup(journeyId);
  if (!setup.remindersEnabled) return [];

  const plan = getWeeklyPlan(journeyId);
  const activity = plan[weekday];
  if (!activity?.time) return [];

  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const actMins = parseTimeToMinutes(activity.time);
  if (actMins == null) return [];

  const reminders = [];
  const minsUntil = actMins - nowMins;

  if (minsUntil > 0 && minsUntil <= 30) {
    reminders.push({
      type: 'upcoming',
      message: `${activity.label} starts in ${minsUntil} min — you've got this!`,
      minutesUntil: minsUntil,
    });
  }

  if (minsUntil < -15 && minsUntil > -120) {
    reminders.push({
      type: 'missed',
      message: `Missed your ${activity.label.toLowerCase()}? No worries — jump in when you can.`,
      minutesUntil: minsUntil,
    });
  }

  return reminders;
}

export function formatActivitySchedule(journeyId) {
  const plan = getWeeklyPlan(journeyId);
  return Object.entries(plan)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([d, act]) => ({
      weekday: Number(d),
      dayName: WEEKDAY_FULL[Number(d)],
      label: act.label,
      time: act.time,
      timeLabel: act.time ? minutesToLabel(parseTimeToMinutes(act.time)) : null,
    }));
}

export function shouldSendCompletionFollowUp(journeyId, dayNumber, sessionType, sessionIndex) {
  const complete = isSessionComplete(journeyId, dayNumber, sessionType, sessionIndex);
  if (complete) return null;
  return {
    message: 'Still time to finish today\'s task — small steps add up.',
  };
}
