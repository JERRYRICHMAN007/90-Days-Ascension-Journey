import { parseYmd, formatYmd } from './dates.js';

/** Human-readable parts for premium date UI */
export function getDateParts(ymdOrDate) {
  try {
    const date =
      typeof ymdOrDate === 'string' ? parseYmd(ymdOrDate) : ymdOrDate;
    return {
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      weekdayShort: date.toLocaleDateString('en-US', { weekday: 'short' }),
      monthShort: date.toLocaleDateString('en-US', { month: 'short' }),
      monthLong: date.toLocaleDateString('en-US', { month: 'long' }),
      day: date.getDate(),
      year: date.getFullYear(),
      /** e.g. Aug 5, 2026 */
      compact: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      /** e.g. Wednesday, 5 August 2026 */
      long: date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };
  } catch {
    return {
      weekday: '',
      weekdayShort: '',
      monthShort: '',
      monthLong: '',
      day: '',
      year: '',
      compact: String(ymdOrDate),
      long: String(ymdOrDate),
    };
  }
}

export function isSameYmd(a, b) {
  if (!a || !b) return false;
  const ay = typeof a === 'string' ? a : formatYmd(a);
  const by = typeof b === 'string' ? b : formatYmd(b);
  return ay === by;
}

export function isToday(date) {
  return isSameYmd(date, new Date());
}

/** Build a 6-row calendar grid (Sun–Sat) for a month */
export function getMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

export const WEEKDAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
