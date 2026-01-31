import { useMemo } from 'react'
import { calculateSessionBasedProgress, isDayFullyComplete } from '../utils/progressTracking'
import './ProgressTracker.css'

function ProgressTracker({ userProgress, journeyId, totalDays, weeks }) {
  const progressData = useMemo(() => {
    // Use session-based progress calculation ONLY
    // No fallback to legacy progress - all progress must be earned through completion
    const sessionProgress = weeks 
      ? calculateSessionBasedProgress(journeyId, weeks)
      : { completedSessions: 0, totalSessions: 0, percentage: 0, completedDays: 0, totalDays: 0 };
    
    // Always use session-based data - no legacy fallback
    const completedDays = sessionProgress.completedDays || 0
    const percentage = sessionProgress.percentage || 0
    
    // Calculate streak based on consecutive completed days
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    
    // Get all completed day numbers from session progress ONLY
    const completedDayNumbers = new Set()
    if (weeks) {
      weeks.forEach(week => {
        if (week.days) {
          week.days.forEach(day => {
            if (day && day.dayNumber > 0) {
              // Check if day is fully complete using session tracking
              if (isDayFullyComplete(journeyId, day)) {
                completedDayNumbers.add(day.dayNumber);
              }
            }
          })
        }
      })
    }
    
    // Calculate streak from day 1 onwards - based ONLY on completed sessions
    for (let i = 1; i <= totalDays; i++) {
      if (completedDayNumbers.has(i)) {
        tempStreak++
        currentStreak = tempStreak
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
        // Only reset current streak if we've started tracking
        if (completedDayNumbers.size > 0) {
          currentStreak = 0
        }
      }
    }
    
    // Calculate by week
    const weeksCompleted = Math.floor(completedDays / 7)
    const daysInCurrentWeek = completedDays % 7
    
    return {
      completed: completedDays,
      total: totalDays,
      percentage,
      currentStreak,
      longestStreak,
      weeksCompleted,
      daysInCurrentWeek,
      remaining: totalDays - completedDays,
      completedSessions: sessionProgress.completedSessions,
      totalSessions: sessionProgress.totalSessions
    }
  }, [userProgress, journeyId, totalDays, weeks])

  return (
    <div className="progress-tracker">
      <h3>📊 Progress Statistics</h3>
      <div className="progress-grid">
        <div className="stat-card">
          <div className="stat-value">{progressData.completed}</div>
          <div className="stat-label">Days Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{progressData.percentage}%</div>
          <div className="stat-label">Overall Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{progressData.currentStreak}</div>
          <div className="stat-label">Current Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{progressData.longestStreak}</div>
          <div className="stat-label">Longest Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{progressData.weeksCompleted}</div>
          <div className="stat-label">Weeks Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{progressData.remaining}</div>
          <div className="stat-label">Days Remaining</div>
        </div>
      </div>
      
      <div className="progress-bar-tracker">
        <div 
          className="progress-fill-tracker" 
          style={{ width: `${progressData.percentage}%` }}
        >
          {progressData.percentage}%
        </div>
      </div>
    </div>
  )
}

export default ProgressTracker

