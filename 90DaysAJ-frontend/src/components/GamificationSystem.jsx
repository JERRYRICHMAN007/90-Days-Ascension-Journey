import { useState, useEffect, useRef } from 'react'
import { useMemo } from 'react'
import './GamificationSystem.css'

function GamificationSystem({ userProgress, journeyId, totalDays, onPointsUpdate, completedDays: externalCompletedDays }) {
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem(`points_${journeyId}`)
    return saved ? parseInt(saved) : 0
  })
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem(`coins_${journeyId}`)
    return saved ? parseInt(saved) : 0
  })
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem(`level_${journeyId}`)
    return saved ? parseInt(saved) : 1
  })
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationMessage, setCelebrationMessage] = useState('')
  const [celebrationIcon, setCelebrationIcon] = useState('🎉')
  const lastAwardedDayRef = useRef(0)

  const journeyProgress = journeyId === 'all' 
    ? {} 
    : (userProgress[journeyId] || {})
  
  const completedDays = externalCompletedDays !== undefined 
    ? externalCompletedDays 
    : (journeyId === 'all' 
      ? 0 
      : Object.values(journeyProgress).filter(Boolean).length)

  // Calculate streak
  const streakData = useMemo(() => {
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
    
    return { currentStreak, longestStreak }
  }, [journeyProgress, totalDays])

  // Calculate XP needed for next level
  const xpForNextLevel = level * 100
  const currentXP = points % xpForNextLevel || points

  // Award points and coins when days are completed (only for specific journeys, not "all")
  useEffect(() => {
    if (journeyId === 'all') return
    
    const lastCompleted = Object.keys(journeyProgress)
      .filter(key => journeyProgress[key])
      .map(Number)
      .sort((a, b) => b - a)[0]

    // Only award if this is a new completion
    if (lastCompleted && lastCompleted > lastAwardedDayRef.current) {
      lastAwardedDayRef.current = lastCompleted
      
      const pointsAwarded = 50 + (streakData.currentStreak * 10)
      const coinsAwarded = 10 + Math.floor(streakData.currentStreak / 3)

      setPoints(prev => {
        const newPoints = prev + pointsAwarded
        localStorage.setItem(`points_${journeyId}`, newPoints.toString())
        
        // Level up check
        const currentLevel = Math.floor(newPoints / (level * 100)) + 1
        if (currentLevel > level) {
          setLevel(currentLevel)
          localStorage.setItem(`level_${journeyId}`, currentLevel.toString())
          triggerCelebration(`Level Up! You're now Level ${currentLevel}!`, '⭐')
        }
        
        return newPoints
      })

      setCoins(prev => {
        const newCoins = prev + coinsAwarded
        localStorage.setItem(`coins_${journeyId}`, newCoins.toString())
        return newCoins
      })
    }
  }, [completedDays, journeyId, streakData.currentStreak, level, journeyProgress])

  const triggerCelebration = (message, icon) => {
    setCelebrationMessage(message)
    setCelebrationIcon(icon)
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 3000)
  }

  return (
    <>
      <div className="gamification-header">
        <div className="points-display">
          <div className="points-icon">⚡</div>
          <div className="points-info">
            <div className="points-label">Points</div>
            <div className="points-value">{points.toLocaleString()}</div>
          </div>
        </div>

        <div className="coins-display">
          <div className="coins-icon">🪙</div>
          <div className="coins-info">
            <div className="coins-label">Gold Coins</div>
            <div className="coins-value">{coins.toLocaleString()}</div>
          </div>
        </div>

        <div className="level-display">
          <div className="level-badge">Level {level}</div>
          <div className="xp-bar">
            <div 
              className="xp-fill" 
              style={{ width: `${(currentXP / xpForNextLevel) * 100}%` }}
            />
            <span className="xp-text">{currentXP}/{xpForNextLevel} XP</span>
          </div>
        </div>

        <div className="streak-display">
          <div className="streak-icon">🔥</div>
          <div className="streak-info">
            <div className="streak-label">Current Streak</div>
            <div className="streak-value">{streakData.currentStreak} days</div>
          </div>
        </div>
      </div>

      {showCelebration && (
        <Celebration message={celebrationMessage} icon={celebrationIcon} />
      )}
    </>
  )
}

function Celebration({ message, icon }) {
  return (
    <div className="celebration-overlay">
      <div className="celebration-content">
        <div className="celebration-icon-large">{icon}</div>
        <h2 className="celebration-message">{message}</h2>
        <div className="confetti">
          <span>🎉</span>
          <span>🎊</span>
          <span>✨</span>
          <span>🌟</span>
          <span>💎</span>
          <span>⭐</span>
        </div>
      </div>
    </div>
  )
}

export default GamificationSystem

