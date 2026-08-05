import { STORAGE_KEYS } from './storageKeys.js';

/** @typedef {{ notes?: string, reflection?: string, mood?: string, lessons?: string, updatedAt?: string }} DayNote */

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.JOURNEY_DAILY_NOTES) || '{}');
  } catch {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(STORAGE_KEYS.JOURNEY_DAILY_NOTES, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent('journey-notes-updated', { detail: { journeyId: null } }));
}

export function getDayNote(journeyId, dayNumber) {
  const all = readAll();
  return all[journeyId]?.[dayNumber] || { notes: '', reflection: '', mood: '', lessons: '' };
}

export function saveDayNote(journeyId, dayNumber, patch) {
  const all = readAll();
  if (!all[journeyId]) all[journeyId] = {};
  all[journeyId][dayNumber] = {
    ...getDayNote(journeyId, dayNumber),
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  writeAll(all);
  window.dispatchEvent(new CustomEvent('journey-notes-updated', { detail: { journeyId, dayNumber } }));
  return all[journeyId][dayNumber];
}

export function getJourneyNoteDays(journeyId) {
  const all = readAll();
  const days = all[journeyId] || {};
  return Object.keys(days)
    .map(Number)
    .filter((n) => n >= 0)
    .sort((a, b) => b - a);
}

export function ensureDayNote(journeyId, dayNumber) {
  const existing = getDayNote(journeyId, dayNumber);
  if (existing.updatedAt) return existing;
  return saveDayNote(journeyId, dayNumber, {});
}
