/**
 * Completion-Based Progress Tracking System
 * 
 * Core Principle: Progress is earned through execution, not time passing.
 * All progress must be explicitly marked as complete by the user.
 */

import { getCurrentDayNumber } from './dates';

/**
 * Get session completion key for storage
 * @param {string} journeyId - Journey ID
 * @param {number} dayNumber - Day number
 * @param {string} sessionType - 'deepLearning' | 'focusedImplementation'
 * @param {number} sessionIndex - Index of session in the day
 * @param {string} discipline - Optional discipline for software engineering
 * @returns {string}
 */
export function getSessionKey(journeyId, dayNumber, sessionType, sessionIndex, discipline = null) {
  if (discipline) {
    return `${journeyId}_${dayNumber}_${sessionType}_${sessionIndex}_${discipline}`;
  }
  return `${journeyId}_${dayNumber}_${sessionType}_${sessionIndex}`;
}

/**
 * Mark a session as complete
 * @param {string} journeyId - Journey ID
 * @param {number} dayNumber - Day number
 * @param {string} sessionType - 'deepLearning' | 'focusedImplementation'
 * @param {number} sessionIndex - Index of session
 * @param {string} discipline - Optional discipline
 * @param {object} completionData - Optional completion metadata
 */
export function markSessionComplete(journeyId, dayNumber, sessionType, sessionIndex, discipline = null, completionData = {}) {
  const key = getSessionKey(journeyId, dayNumber, sessionType, sessionIndex, discipline);
  const completion = {
    completed: true,
    completedAt: new Date().toISOString(),
    ...completionData
  };
  
  try {
    const saved = localStorage.getItem('sessionCompletions') || '{}';
    const completions = JSON.parse(saved);
    completions[key] = completion;
    localStorage.setItem('sessionCompletions', JSON.stringify(completions));
    return true;
  } catch (error) {
    console.error('Error marking session complete:', error);
    return false;
  }
}

/**
 * Check if a session is complete
 * @param {string} journeyId - Journey ID
 * @param {number} dayNumber - Day number
 * @param {string} sessionType - 'deepLearning' | 'focusedImplementation'
 * @param {number} sessionIndex - Index of session
 * @param {string} discipline - Optional discipline
 * @returns {boolean}
 */
export function isSessionComplete(journeyId, dayNumber, sessionType, sessionIndex, discipline = null) {
  const key = getSessionKey(journeyId, dayNumber, sessionType, sessionIndex, discipline);
  
  try {
    const saved = localStorage.getItem('sessionCompletions') || '{}';
    const completions = JSON.parse(saved);
    return completions[key]?.completed === true;
  } catch (error) {
    console.error('Error checking session completion:', error);
    return false;
  }
}

/**
 * Get all completed sessions for a journey
 * @param {string} journeyId - Journey ID
 * @returns {object}
 */
export function getJourneyCompletions(journeyId) {
  try {
    const saved = localStorage.getItem('sessionCompletions') || '{}';
    const completions = JSON.parse(saved);
    
    // Filter completions for this journey
    const journeyCompletions = {};
    Object.keys(completions).forEach(key => {
      if (key.startsWith(`${journeyId}_`)) {
        journeyCompletions[key] = completions[key];
      }
    });
    
    return journeyCompletions;
  } catch (error) {
    console.error('Error getting journey completions:', error);
    return {};
  }
}

/**
 * Calculate progress based on completed sessions
 * @param {string} journeyId - Journey ID
 * @param {object} weeks - Journey weeks data
 * @returns {object} Progress data
 */
export function calculateSessionBasedProgress(journeyId, weeks) {
  if (!weeks || !Array.isArray(weeks)) {
    return {
      completedSessions: 0,
      totalSessions: 0,
      percentage: 0,
      completedDays: 0,
      totalDays: 0
    };
  }
  
  // Check if we're on Day 0 or before the journey starts
  // If so, return 0% progress regardless of stored completions
  const currentDay = getCurrentDayNumber();
  
  // If currentDay is null (before journey) or 0 (Day 0 preparation), return 0%
  if (currentDay === null || currentDay === 0) {
    return {
      completedSessions: 0,
      totalSessions: 0,
      percentage: 0,
      completedDays: 0,
      totalDays: weeks.reduce((sum, week) => sum + (week.days?.filter(d => d && d.dayNumber > 0).length || 0), 0)
    };
  }
  
  const completions = getJourneyCompletions(journeyId);
  
  // Build a set of valid session keys that exist in the current journey structure
  const validSessionKeys = new Set();
  const validDayNumbers = new Set();
  
  // First, collect all valid session keys from the current journey structure
  weeks.forEach(week => {
    if (!week.days || !Array.isArray(week.days)) return;
    
    week.days.forEach(day => {
      if (!day || day.dayNumber === 0 || day.dayNumber === null || day.dayNumber === undefined) return; // Skip Day 0 and invalid days
      
      validDayNumbers.add(day.dayNumber);
      
      // Collect deep learning sessions
      if (day.schedule?.scheduledContent?.deepLearning && Array.isArray(day.schedule.scheduledContent.deepLearning)) {
        day.schedule.scheduledContent.deepLearning.forEach((session, idx) => {
          const discipline = session.discipline || null;
          const key = getSessionKey(journeyId, day.dayNumber, 'deepLearning', idx, discipline);
          validSessionKeys.add(key);
        });
      }
      
      // Collect focused implementation sessions
      if (day.schedule?.scheduledContent?.focusedImplementation && Array.isArray(day.schedule.scheduledContent.focusedImplementation)) {
        day.schedule.scheduledContent.focusedImplementation.forEach((session, idx) => {
          const discipline = session.discipline || null;
          const key = getSessionKey(journeyId, day.dayNumber, 'focusedImplementation', idx, discipline);
          validSessionKeys.add(key);
        });
      }
      
      // For journeys without scheduled content, check day-level completion
      if (!day.schedule?.scheduledContent && (day.workout || day.readingSessions || day.execution || day.personalBrandTasks)) {
        const key = getSessionKey(journeyId, day.dayNumber, 'daily', 0);
        validSessionKeys.add(key);
      }
    });
  });
  
  // Only count completions that are for valid sessions in the current structure
  const validCompletions = Object.keys(completions).filter(key => {
    // Check if completion is marked as complete
    if (!completions[key]?.completed) return false;
    
    // Check if this session key exists in the current journey structure
    if (!validSessionKeys.has(key)) return false;
    
    // Validate the key format and extract day number
    const parts = key.split('_');
    if (parts.length < 3) return false;
    
    const dayNum = parseInt(parts[1], 10);
    // Only count if day number is valid and exists in current structure
    return !isNaN(dayNum) && dayNum > 0 && validDayNumbers.has(dayNum);
  });
  
  const completedSessionKeys = new Set(validCompletions);
  
  let totalSessions = validSessionKeys.size;
  let completedSessions = completedSessionKeys.size;
  const completedDays = new Set();
  
  // Count completed days by checking which days have all their sessions completed
  weeks.forEach(week => {
    if (!week.days || !Array.isArray(week.days)) return;
    
    week.days.forEach(day => {
      if (!day || day.dayNumber === 0 || day.dayNumber === null || day.dayNumber === undefined) return;
      
      let dayTotalSessions = 0;
      let dayCompletedSessions = 0;
      
      // Count deep learning sessions
      if (day.schedule?.scheduledContent?.deepLearning && Array.isArray(day.schedule.scheduledContent.deepLearning)) {
        day.schedule.scheduledContent.deepLearning.forEach((session, idx) => {
          const discipline = session.discipline || null;
          const key = getSessionKey(journeyId, day.dayNumber, 'deepLearning', idx, discipline);
          dayTotalSessions++;
          if (completedSessionKeys.has(key)) {
            dayCompletedSessions++;
          }
        });
      }
      
      // Count focused implementation sessions
      if (day.schedule?.scheduledContent?.focusedImplementation && Array.isArray(day.schedule.scheduledContent.focusedImplementation)) {
        day.schedule.scheduledContent.focusedImplementation.forEach((session, idx) => {
          const discipline = session.discipline || null;
          const key = getSessionKey(journeyId, day.dayNumber, 'focusedImplementation', idx, discipline);
          dayTotalSessions++;
          if (completedSessionKeys.has(key)) {
            dayCompletedSessions++;
          }
        });
      }
      
      // For journeys without scheduled content
      if (!day.schedule?.scheduledContent && (day.workout || day.readingSessions || day.execution || day.personalBrandTasks)) {
        const key = getSessionKey(journeyId, day.dayNumber, 'daily', 0);
        dayTotalSessions++;
        if (completedSessionKeys.has(key)) {
          dayCompletedSessions++;
        }
      }
      
      // Day is complete only if all its sessions are completed
      if (dayTotalSessions > 0 && dayCompletedSessions === dayTotalSessions) {
        completedDays.add(day.dayNumber);
      }
    });
  });
  
  const percentage = totalSessions > 0 
    ? Math.round((completedSessions / totalSessions) * 100)
    : 0;
  
  return {
    completedSessions,
    totalSessions,
    percentage,
    completedDays: completedDays.size,
    totalDays: weeks.reduce((sum, week) => sum + (week.days?.filter(d => d && d.dayNumber > 0).length || 0), 0)
  };
}

/**
 * Get progress for a specific day
 * @param {string} journeyId - Journey ID
 * @param {number} dayNumber - Day number
 * @returns {object}
 */
export function getDayProgress(journeyId, dayNumber) {
  const completions = getJourneyCompletions(journeyId);
  const dayCompletions = {};
  
  Object.keys(completions).forEach(key => {
    if (key.includes(`_${dayNumber}_`)) {
      dayCompletions[key] = completions[key];
    }
  });
  
  return {
    completedSessions: Object.keys(dayCompletions).filter(key => dayCompletions[key].completed).length,
    totalSessions: 0, // Will be calculated from day data
    completions: dayCompletions
  };
}

/**
 * Check if a day is fully complete (all sessions completed)
 * @param {string} journeyId - Journey ID
 * @param {object} day - Day data
 * @returns {boolean}
 */
export function isDayFullyComplete(journeyId, day) {
  if (!day || day.dayNumber === 0) return false;
  
  const completions = getJourneyCompletions(journeyId);
  const completedSessionKeys = new Set(Object.keys(completions).filter(key => completions[key].completed));
  
  let totalSessions = 0;
  let completedSessions = 0;
  
  // Count deep learning sessions
  if (day.schedule?.scheduledContent?.deepLearning) {
    day.schedule.scheduledContent.deepLearning.forEach((session, idx) => {
      totalSessions++;
      const discipline = session.discipline || null;
      const key = getSessionKey(journeyId, day.dayNumber, 'deepLearning', idx, discipline);
      if (completedSessionKeys.has(key)) {
        completedSessions++;
      }
    });
  }
  
  // Count focused implementation sessions
  if (day.schedule?.scheduledContent?.focusedImplementation) {
    day.schedule.scheduledContent.focusedImplementation.forEach((session, idx) => {
      totalSessions++;
      const discipline = session.discipline || null;
      const key = getSessionKey(journeyId, day.dayNumber, 'focusedImplementation', idx, discipline);
      if (completedSessionKeys.has(key)) {
        completedSessions++;
      }
    });
  }
  
  // For journeys without scheduled content
  if (!day.schedule?.scheduledContent && (day.workout || day.readingSessions || day.execution || day.personalBrandTasks)) {
    totalSessions++;
    const key = getSessionKey(journeyId, day.dayNumber, 'daily', 0);
    if (completedSessionKeys.has(key)) {
      completedSessions++;
    }
  }
  
  return totalSessions > 0 && completedSessions === totalSessions;
}

/**
 * Reset all progress for a journey (for testing/debugging)
 * @param {string} journeyId - Journey ID
 */
export function resetJourneyProgress(journeyId) {
  try {
    const saved = localStorage.getItem('sessionCompletions') || '{}';
    const completions = JSON.parse(saved);
    
    Object.keys(completions).forEach(key => {
      if (key.startsWith(`${journeyId}_`)) {
        delete completions[key];
      }
    });
    
    localStorage.setItem('sessionCompletions', JSON.stringify(completions));
    return true;
  } catch (error) {
    console.error('Error resetting journey progress:', error);
    return false;
  }
}

/**
 * Reset ALL progress and gamification data
 * Use this when starting fresh on Day 0 (February 15, 2026)
 * Clears: session completions, XP, streaks, achievements, lesson progress
 */
export function resetAllProgress() {
  try {
    console.log('🧹 Starting complete reset of all progress and gamification data...');
    
    // Clear session completions
    localStorage.removeItem('sessionCompletions');
    console.log('  ✓ Cleared session completions');
    
    // Clear XP - explicitly set all journey domains to 0
    const resetXP = {
      global: 0,
      domains: {
        'body-transformation': 0,
        'reading': 0,
        'writers': 0,
        'dual-brand': 0,
        'software-engineering': 0,
      }
    };
    localStorage.setItem('ascensionXP', JSON.stringify(resetXP));
    console.log('  ✓ Cleared XP:', resetXP);
    
    // Clear streaks
    const resetStreaks = { current: 0, longest: 0, lastDate: null };
    localStorage.setItem('ascensionStreaks', JSON.stringify(resetStreaks));
    console.log('  ✓ Cleared streaks:', resetStreaks);
    
    // Clear achievements
    localStorage.setItem('ascensionAchievements', JSON.stringify([]));
    console.log('  ✓ Cleared achievements');
    
    // Clear journey-specific gamification
    const journeyIds = ['body-transformation', 'reading', 'writers', 'dual-brand', 'software-engineering'];
    journeyIds.forEach(id => {
      localStorage.removeItem(`points_${id}`);
      localStorage.removeItem(`coins_${id}`);
      localStorage.removeItem(`level_${id}`);
      localStorage.removeItem(`achievements_${id}`);
    });
    console.log('  ✓ Cleared journey-specific data for:', journeyIds);
    
    // Clear lesson progress
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('lessonProgress_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log('  ✓ Cleared lesson progress:', keysToRemove.length, 'entries');
    
    // Clear any reset flags
    localStorage.removeItem('day0_reset_completed');
    
    console.log('✅ All progress and gamification data cleared!');
    return true;
  } catch (error) {
    console.error('❌ Error resetting all progress:', error);
    return false;
  }
}

/**
 * Clear all invalid/stale progress data for a journey
 * Removes completions for days/sessions that don't exist in the current journey structure
 * @param {string} journeyId - Journey ID
 * @param {object} weeks - Current journey weeks data
 */
export function cleanInvalidProgress(journeyId, weeks) {
  if (!journeyId || !weeks || !Array.isArray(weeks)) return false;
  
  try {
    const saved = localStorage.getItem('sessionCompletions') || '{}';
    const completions = JSON.parse(saved);
    
    // If completions is not an object, reset it
    if (typeof completions !== 'object' || completions === null) {
      return false;
    }
    
    // Build set of valid session keys
    const validSessionKeys = new Set();
    const validDayNumbers = new Set();
    
    weeks.forEach(week => {
      if (!week.days || !Array.isArray(week.days)) return;
      
      week.days.forEach(day => {
        if (!day || day.dayNumber === 0 || day.dayNumber === null || day.dayNumber === undefined) return;
        
        validDayNumbers.add(day.dayNumber);
        
        if (day.schedule?.scheduledContent?.deepLearning && Array.isArray(day.schedule.scheduledContent.deepLearning)) {
          day.schedule.scheduledContent.deepLearning.forEach((session, idx) => {
            const discipline = session.discipline || null;
            const key = getSessionKey(journeyId, day.dayNumber, 'deepLearning', idx, discipline);
            validSessionKeys.add(key);
          });
        }
        
        if (day.schedule?.scheduledContent?.focusedImplementation && Array.isArray(day.schedule.scheduledContent.focusedImplementation)) {
          day.schedule.scheduledContent.focusedImplementation.forEach((session, idx) => {
            const discipline = session.discipline || null;
            const key = getSessionKey(journeyId, day.dayNumber, 'focusedImplementation', idx, discipline);
            validSessionKeys.add(key);
          });
        }
        
        if (!day.schedule?.scheduledContent && (day.workout || day.readingSessions || day.execution || day.personalBrandTasks)) {
          const key = getSessionKey(journeyId, day.dayNumber, 'daily', 0);
          validSessionKeys.add(key);
        }
      });
    });
    
    // Remove invalid completions
    let removedCount = 0;
    Object.keys(completions).forEach(key => {
      if (key.startsWith(`${journeyId}_`)) {
        // Check if this key is valid
        if (!validSessionKeys.has(key)) {
          delete completions[key];
          removedCount++;
        } else {
          // Validate day number
          const parts = key.split('_');
          if (parts.length >= 2) {
            const dayNum = parseInt(parts[1], 10);
            if (isNaN(dayNum) || dayNum <= 0 || !validDayNumbers.has(dayNum)) {
              delete completions[key];
              removedCount++;
            }
          }
        }
      }
    });
    
    localStorage.setItem('sessionCompletions', JSON.stringify(completions));
    
    if (removedCount > 0) {
      console.log(`Cleaned ${removedCount} invalid progress entries for journey: ${journeyId}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error cleaning invalid progress:', error);
    return false;
  }
}

