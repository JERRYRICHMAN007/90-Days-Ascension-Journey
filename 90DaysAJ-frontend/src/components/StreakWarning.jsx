import { useMemo } from 'react'
import './StreakWarning.css'

function StreakWarning({ userProgress, journeyId, totalDays }) {
  const streakData = useMemo(() => {
    const journeyProgress = userProgress[journeyId] || {}
    let currentStreak = 0
    let lastCompletedDay = 0
    
    for (let i = totalDays; i >= 1; i--) {
      if (journeyProgress[i]) {
        currentStreak++
        if (lastCompletedDay === 0) {
          lastCompletedDay = i
        }
      } else if (lastCompletedDay > 0) {
        break
      }
    }
    
    const today = new Date()
    const startDate = new Date('2025-12-08')
    const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24))
    const daysSinceLastCompletion = lastCompletedDay > 0 ? daysSinceStart - lastCompletedDay + 1 : daysSinceStart + 1
    
    return { currentStreak, daysSinceLastCompletion, lastCompletedDay }
  }, [userProgress, journeyId, totalDays])

  if (streakData.currentStreak === 0 || streakData.daysSinceLastCompletion <= 1) {
    return null
  }

  if (streakData.daysSinceLastCompletion >= 2) {
    return (
      <div className="streak-warning critical">
        <div className="warning-icon">⚠️</div>
        <div className="warning-content">
          <h4>Your Streak is in Danger!</h4>
          <p>You have a {streakData.currentStreak}-day streak. Complete today to keep it going!</p>
          <div className="streak-countdown">
            <span className="countdown-text">Streak will break if you miss today!</span>
          </div>
          <div className="streak-reward">
            <span>🔥 Keep your streak and earn bonus rewards!</span>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default StreakWarning

