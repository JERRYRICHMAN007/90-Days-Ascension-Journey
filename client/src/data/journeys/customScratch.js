import {
  JOURNEY_START_DATE,
  JOURNEY_TOTAL_DAYS,
  generateWeeks,
  getDateStringForDayNumber,
  getCalendarWeekDayNumbers,
  getCalendarWeekCount,
} from './shared.js';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const customScratchJourney = {
  id: 'custom-scratch',
  title: 'Custom Journey',
  icon: '✨',
  timeBlock: '',
  description: 'A journey you built from scratch',
  totalDays: JOURNEY_TOTAL_DAYS,
  color: '#6ee7b7',
};

export const customScratchWeeks = generateWeeks(
  JOURNEY_START_DATE,
  getCalendarWeekCount(JOURNEY_TOTAL_DAYS)
).map((week) => {
  const days = [];
  for (const dayNumber of getCalendarWeekDayNumbers(week.startDate, JOURNEY_TOTAL_DAYS)) {
    const dayDateString = getDateStringForDayNumber(dayNumber);
    const [year, month, day] = dayDateString.split('-').map(Number);
    const dayDate = new Date(year, month - 1, day);
    days.push({
      dayNumber,
      date: dayDateString,
      dayName: DAY_NAMES[dayDate.getDay()],
      focus: 'Session',
      title: `Day ${dayNumber}`,
      customSession: true,
    });
  }
  return { ...week, days };
});
