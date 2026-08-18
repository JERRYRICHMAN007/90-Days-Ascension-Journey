/**
 * Dashboard notification items + read/unread persistence.
 */

import { getRegistryJourneys } from './journeyRegistry.js';
import { getJourneyState, getJourneyTimeline } from './journeyPlanning.js';
import {
  getIncompletePastAcrossJourneys,
  getJourneyRoute,
} from './incompleteDays.js';

const READ_KEY = 'aetherReadNotifications';

function readReadIds() {
  try {
    const raw = localStorage.getItem(READ_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeReadIds(ids) {
  localStorage.setItem(READ_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent('notifications-updated'));
}

export function getReadNotificationIds() {
  return readReadIds();
}

export function markNotificationRead(id) {
  if (!id) return;
  // Incomplete-day action items stay until the day is completed
  if (String(id).startsWith('incomplete-')) return;
  const ids = readReadIds();
  if (!ids.includes(id)) {
    writeReadIds([...ids, id]);
  }
}

export function markAllNotificationsRead(notificationIds) {
  const ids = readReadIds();
  const filtered = notificationIds.filter((id) => !String(id).startsWith('incomplete-'));
  const merged = [...new Set([...ids, ...filtered])];
  writeReadIds(merged);
}

/** Build live notification list from journey registry state */
export function buildDashboardNotifications() {
  const list = [];

  getIncompletePastAcrossJourneys().forEach((row) => {
    row.incomplete.slice(0, 5).forEach((item) => {
      list.push({
        id: `incomplete-${row.journeyId}-day-${item.dayNumber}`,
        title: `Day ${item.dayNumber} still open — ${row.title}`,
        body: `"${item.label}" wasn't marked complete. Finish that day before moving on.`,
        type: 'action',
        href: getJourneyRoute(row.journeyId, item.dayNumber),
        journeyId: row.journeyId,
        dayNumber: item.dayNumber,
      });
    });
    if (row.incomplete.length > 5) {
      list.push({
        id: `incomplete-${row.journeyId}-more`,
        title: `${row.incomplete.length - 5} more incomplete days`,
        body: `Catch up on ${row.title} so your streak and schedule stay honest.`,
        type: 'action',
        href: getJourneyRoute(row.journeyId, row.incomplete[5].dayNumber),
        journeyId: row.journeyId,
        dayNumber: row.incomplete[5].dayNumber,
      });
    }
  });

  getRegistryJourneys()
    .filter((j) => !j.isDemo)
    .forEach((j) => {
      const state = getJourneyState(j.id);
      if (state === 'not_started') {
        list.push({
          id: `${j.id}-ready`,
          title: `${j.title} is ready`,
          body: "Review your plan and press Start when you're ready.",
          type: 'info',
        });
      } else if (state === 'active') {
        const tl = getJourneyTimeline(j.id);
        list.push({
          id: `${j.id}-active`,
          title: `Day ${tl.currentDay || 1} — ${j.title}`,
          body: `${tl.daysRemaining ?? '—'} days remaining in your arc.`,
          type: 'progress',
        });
      }
    });

  if (list.length === 0) {
    list.push({
      id: 'welcome',
      title: 'All caught up',
      body: 'No new notifications. Keep building momentum.',
      type: 'empty',
    });
  }

  return list;
}

export function getUnreadNotificationCount() {
  const read = new Set(readReadIds());
  return buildDashboardNotifications().filter((n) => n.type !== 'empty' && !read.has(n.id)).length;
}

export function isNotificationRead(id) {
  return readReadIds().includes(id);
}
