import { STORAGE_KEYS } from './storageKeys.js';
import { JOURNEY_DURATION_MONTHS } from './dates.js';

/** @typedef {Object} CustomTemplate
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {string} [icon]
 * @property {string} [color]
 * @property {string[]} [goals]
 * @property {number} [durationMonths]
 * @property {number[]} [availableDays]
 * @property {string} [category]
 * @property {boolean} isCustom
 * @property {string} createdAt
 */

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_TEMPLATES) || '[]');
  } catch {
    return [];
  }
}

function writeAll(templates) {
  localStorage.setItem(STORAGE_KEYS.CUSTOM_TEMPLATES, JSON.stringify(templates));
  window.dispatchEvent(new CustomEvent('journey-templates-updated'));
}

export function getCustomTemplates() {
  return readAll();
}

export function saveCustomTemplate(template) {
  const id = template.id || `custom-${Date.now()}`;
  const entry = {
    durationMonths: JOURNEY_DURATION_MONTHS,
    icon: '✨',
    color: '#6ee7b7',
    goals: [],
    availableDays: [1, 2, 3, 4, 5],
    isCustom: true,
    createdAt: new Date().toISOString(),
    ...template,
    id,
  };
  const list = readAll().filter((t) => t.id !== id);
  writeAll([entry, ...list]);
  return entry;
}

export function deleteCustomTemplate(id) {
  writeAll(readAll().filter((t) => t.id !== id));
}

export function getCustomTemplate(id) {
  return readAll().find((t) => t.id === id) || null;
}

export const BUILTIN_TEMPLATE_CATEGORIES = [
  { id: 'fitness', label: 'Fitness', icon: '💪' },
  { id: 'reading', label: 'Reading', icon: '📚' },
  { id: 'writing', label: 'Writing', icon: '✍️' },
  { id: 'faith', label: 'Bible Study', icon: '📖' },
  { id: 'learning', label: 'Learning', icon: '🎓' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'meditation', label: 'Meditation', icon: '🧘' },
];
