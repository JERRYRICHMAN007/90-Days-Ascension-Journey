/**
 * Utility functions for checking day schedules and finding next sessions
 */

/**
 * Check if a day has any scheduled activities
 * @param {Object} day - Day object from journey data
 * @param {string} journeyId - Journey identifier
 * @returns {boolean} - True if day has scheduled activities
 */
export function hasScheduledActivities(day, journeyId) {
  if (!day) return false;

  // Check for time blocks in schedule
  if (day.schedule?.timeBlocks) {
    const { deepLearning, focusedImplementation, additional } = day.schedule.timeBlocks;
    
    // Check deep learning blocks
    if (deepLearning && deepLearning.length > 0) return true;
    
    // Check focused implementation blocks
    if (focusedImplementation && focusedImplementation.length > 0) return true;
    
    // Check additional blocks
    if (additional) {
      if (additional.deepLearning && additional.deepLearning.length > 0) return true;
      if (additional.focusedImplementation && additional.focusedImplementation.length > 0) return true;
    }
  }

  // Check for scheduled content
  if (day.schedule?.scheduledContent) {
    const { deepLearning, focusedImplementation } = day.schedule.scheduledContent;
    if (deepLearning && deepLearning.length > 0) return true;
    if (focusedImplementation && focusedImplementation.length > 0) return true;
  }

  // Journey-specific checks
  if (journeyId === 'body-transformation') {
    // Body transformation has workouts scheduled on specific days
    if (day.workout) return true;
  }

  if (journeyId === 'reading') {
    // Reading has time blocks for e-reading, physical reading, bible reading
    if (day.schedule?.timeBlocks) {
      const blocks = day.schedule.timeBlocks;
      if (blocks.eReading || blocks.physicalReading || blocks.bibleReading) return true;
    }
  }

  if (journeyId === 'writers') {
    // Writers journey has writing sessions
    if (day.writingSession || day.writingPrompt) return true;
  }

  if (journeyId === 'dual-brand') {
    // Dual brand has tasks
    if (day.personalBrandTasks || day.companyBrandTasks || day.ryxenTasks || day.havenXTasks) return true;
  }

  if (journeyId === 'software-engineering') {
    // Software engineering always has content (learning, projects, etc.)
    if (day.dailyLearning || day.miniProject || day.cursorWorkflow) return true;
  }

  return false;
}

/**
 * Find the next scheduled session for a journey
 * @param {Array} weeks - Array of week objects
 * @param {number} currentDayNumber - Current day number
 * @param {string} journeyId - Journey identifier
 * @returns {Object|null} - Next session info or null
 */
export function findNextSession(weeks, currentDayNumber, journeyId) {
  if (!weeks || !Array.isArray(weeks)) return null;

  // Flatten all days from all weeks
  const allDays = [];
  weeks.forEach(week => {
    if (week.days && Array.isArray(week.days)) {
      week.days.forEach(day => {
        if (day && day.dayNumber && day.dayNumber > currentDayNumber) {
          allDays.push(day);
        }
      });
    }
  });

  // Sort by day number
  allDays.sort((a, b) => a.dayNumber - b.dayNumber);

  // Find first day with scheduled activities
  for (const day of allDays) {
    if (hasScheduledActivities(day, journeyId)) {
      // Get the first time block from the day
      let nextTime = null;
      let nextDayName = null;

      if (day.schedule?.timeBlocks) {
        const { deepLearning, focusedImplementation } = day.schedule.timeBlocks;
        if (deepLearning && deepLearning.length > 0) {
          nextTime = deepLearning[0].time;
        } else if (focusedImplementation && focusedImplementation.length > 0) {
          nextTime = focusedImplementation[0].time;
        }
      }

      if (day.schedule?.scheduledContent) {
        const { deepLearning, focusedImplementation } = day.schedule.scheduledContent;
        if (deepLearning && deepLearning.length > 0) {
          nextTime = deepLearning[0].time || nextTime;
        } else if (focusedImplementation && focusedImplementation.length > 0) {
          nextTime = focusedImplementation[0].time || nextTime;
        }
      }

      // Get day name
      if (day.date) {
        const date = new Date(day.date);
        nextDayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      }

      return {
        dayNumber: day.dayNumber,
        date: day.date,
        dayName: nextDayName || day.dayName,
        time: nextTime,
        formattedDate: day.date ? new Date(day.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }) : null
      };
    }
  }

  return null;
}

/**
 * Get schedule pattern for a journey (e.g., "Monday–Wednesday")
 * @param {Array} weeks - Array of week objects
 * @param {string} journeyId - Journey identifier
 * @returns {string|null} - Schedule pattern description
 */
export function getSchedulePattern(weeks, journeyId) {
  if (!weeks || !Array.isArray(weeks)) return null;

  // Sample first few weeks to determine pattern
  const scheduledDays = new Set();
  
  weeks.slice(0, 4).forEach(week => {
    if (week.days && Array.isArray(week.days)) {
      week.days.forEach(day => {
        if (day && hasScheduledActivities(day, journeyId)) {
          if (day.date) {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            scheduledDays.add(dayName);
          }
        }
      });
    }
  });

  if (scheduledDays.size === 0) return null;

  const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const sortedDays = Array.from(scheduledDays).sort((a, b) => 
    dayOrder.indexOf(a) - dayOrder.indexOf(b)
  );

  if (sortedDays.length === 1) {
    return sortedDays[0];
  } else if (sortedDays.length === 2) {
    return `${sortedDays[0]} and ${sortedDays[1]}`;
  } else if (sortedDays.length <= 4) {
    return sortedDays.join(', ');
  } else {
    return `${sortedDays[0]}–${sortedDays[sortedDays.length - 1]}`;
  }
}

/**
 * Generate informative message for a day with no scheduled activities
 * @param {Object} day - Day object
 * @param {Array} weeks - Array of week objects
 * @param {string} journeyId - Journey identifier
 * @returns {Object} - Message object with title and description
 */
export function getNoActivityMessage(day, weeks, journeyId) {
  const nextSession = findNextSession(weeks, day?.dayNumber || 0, journeyId);
  const schedulePattern = getSchedulePattern(weeks, journeyId);

  if (nextSession) {
    if (nextSession.time) {
      return {
        title: "No session scheduled for today.",
        description: `Next session: ${nextSession.dayName} at ${nextSession.time}.`
      };
    } else {
      return {
        title: "No session scheduled for today.",
        description: `Next session: ${nextSession.dayName}${nextSession.formattedDate ? ` (${nextSession.formattedDate})` : ''}.`
      };
    }
  } else if (schedulePattern) {
    return {
      title: "No session scheduled for today.",
      description: `This journey runs on: ${schedulePattern}.`
    };
  } else {
    return {
      title: "No session scheduled for today.",
      description: "Take this time to rest and recharge."
    };
  }
}

