/**
 * Per-journey reading queue — uses custom plan when present, else curated defaults.
 */

import {
  getBookDisplayTitle as displayTitle,
  getBookForDayNumber as getBookForDayNumberFromQueue,
  getBookMonthMeta as getBookMonthMetaFromQueue,
} from '../data/journeys/journeyCuratedResources.js';
import { getReadingQueueForJourney } from './journeyCustomPlan.js';

/** Map day number (1–184) to the active book for this journey. */
export function getBookForDayNumber(dayNumber, journeyId) {
  const queue = journeyId ? getReadingQueueForJourney(journeyId) : null;
  return getBookForDayNumberFromQueue(dayNumber, queue);
}

export function getBookForJourneyDay(journeyId, dayNumber) {
  return getBookForDayNumber(dayNumber, journeyId);
}

export function getBookMonthMeta(dayNumber, journeyId) {
  const queue = journeyId ? getReadingQueueForJourney(journeyId) : null;
  return getBookMonthMetaFromQueue(dayNumber, queue);
}

export function getBookMonthMetaForJourney(journeyId, dayNumber) {
  return getBookMonthMeta(dayNumber, journeyId);
}

export function getBookDisplayTitle(book) {
  return displayTitle(book);
}
