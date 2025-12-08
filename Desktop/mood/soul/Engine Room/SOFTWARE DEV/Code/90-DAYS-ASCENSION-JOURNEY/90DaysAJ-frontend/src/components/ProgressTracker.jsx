import { useMemo } from 'react'
import './ProgressTracker.css'

function ProgressTracker({ userProgress, journeyId, totalDays }) {
  const progressData = useMemo(() => {
    const journeyProgress = userProgress[journeyId] || {}
    const completedDays = Object.values(journeyProgress).filter(Boolean).length
    const percentage = Math.round((completedDays / totalDays) * 100)
    
    // Calculate streak
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    
    for (let i = 1; i <= totalDays; i++) {
      if (journeyProgress[i]) {
        tempStreak++
        currentStreak = tempStreak
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
        currentStreak = 0
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
      remaining: totalDays - completedDays
    }
  }, [userProgress, journeyId, totalDays])

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

