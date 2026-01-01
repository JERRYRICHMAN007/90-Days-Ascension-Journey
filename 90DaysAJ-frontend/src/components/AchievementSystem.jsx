import { useState, useEffect, useMemo } from 'react'
import './AchievementSystem.css'

function AchievementSystem({ userProgress, journeyId, totalDays }) {
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    const saved = localStorage.getItem(`achievements_${journeyId}`)
    return saved ? JSON.parse(saved) : []
  })
  const [newAchievement, setNewAchievement] = useState(null)

  const journeyProgress = userProgress[journeyId] || {}
  const completedDays = Object.values(journeyProgress).filter(Boolean).length

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

  const allAchievements = [
    {
      id: 'first-day',
      name: 'First Steps',
      description: 'Complete your first day',
      icon: '🎯',
      threshold: 1,
      points: 50,
      coins: 10
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Complete 7 consecutive days',
      icon: '🔥',
      threshold: 7,
      points: 200,
      coins: 25
    },
    {
      id: 'two-weeks',
      name: 'Two Week Champion',
      description: 'Complete 14 days',
      icon: '⚡',
      threshold: 14,
      points: 400,
      coins: 50
    },
    {
      id: 'month-master',
      name: 'Month Master',
      description: 'Complete 30 days',
      icon: '👑',
      threshold: 30,
      points: 800,
      coins: 100
    },
    {
      id: 'halfway-hero',
      name: 'Halfway Hero',
      description: 'Reach 50% completion',
      icon: '🏆',
      threshold: Math.floor(totalDays * 0.5),
      points: 1000,
      coins: 150
    },
    {
      id: 'streak-king',
      name: 'Streak King',
      description: 'Maintain a 14-day streak',
      icon: '💎',
      threshold: 14,
      points: 500,
      coins: 75,
      condition: () => streakData.currentStreak >= 14
    },
    {
      id: 'streak-legend',
      name: 'Streak Legend',
      description: 'Maintain a 30-day streak',
      icon: '🌟',
      threshold: 30,
      points: 1500,
      coins: 200,
      condition: () => streakData.currentStreak >= 30
    },
    {
      id: 'completionist',
      name: 'Completionist',
      description: 'Complete all days',
      icon: '💫',
      threshold: totalDays,
      points: 5000,
      coins: 500
    },
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Complete 5 days before 6 AM',
      icon: '🌅',
      threshold: 5,
      points: 300,
      coins: 40
    },
    {
      id: 'weekend-warrior',
      name: 'Weekend Warrior',
      description: 'Complete all weekend days',
      icon: '🎪',
      threshold: 20,
      points: 600,
      coins: 80
    },
    {
      id: 'consistency-king',
      name: 'Consistency King',
      description: 'Complete 60 days',
      icon: '🎖️',
      threshold: 60,
      points: 2000,
      coins: 250
    },
    {
      id: 'ascension-master',
      name: 'Ascension Master',
      description: 'Complete 90 days with 80%+ completion',
      icon: '🚀',
      threshold: Math.floor(totalDays * 0.8),
      points: 10000,
      coins: 1000
    }
  ]

  useEffect(() => {
    const newlyUnlocked = []
    
    allAchievements.forEach(achievement => {
      const isUnlocked = unlockedAchievements.includes(achievement.id)
      let shouldUnlock = false

      if (achievement.condition) {
        shouldUnlock = achievement.condition()
      } else {
        shouldUnlock = completedDays >= achievement.threshold
      }

      if (shouldUnlock && !isUnlocked) {
        newlyUnlocked.push(achievement)
      }
    })

    if (newlyUnlocked.length > 0) {
      const newIds = newlyUnlocked.map(a => a.id)
      const updated = [...unlockedAchievements, ...newIds]
      setUnlockedAchievements(updated)
      localStorage.setItem(`achievements_${journeyId}`, JSON.stringify(updated))
      
      // Show celebration for first new achievement
      if (newlyUnlocked[0]) {
        setNewAchievement(newlyUnlocked[0])
        setTimeout(() => setNewAchievement(null), 4000)
      }
    }
  }, [completedDays, streakData.currentStreak])

  const getProgress = (achievement) => {
    if (achievement.condition) {
      return achievement.condition() ? 100 : 0
    }
    return Math.min(100, Math.round((completedDays / achievement.threshold) * 100))
  }

  return (
    <div className="achievement-system">
      <div className="achievement-header">
        <h3>🏅 Achievements & Badges</h3>
        <div className="achievement-stats">
          {unlockedAchievements.length} / {allAchievements.length} Unlocked
        </div>
      </div>

      {newAchievement && (
        <div className="new-achievement-banner">
          <div className="banner-icon">{newAchievement.icon}</div>
          <div className="banner-content">
            <h4>New Achievement Unlocked!</h4>
            <p>{newAchievement.name} - {newAchievement.description}</p>
            <div className="banner-rewards">
              <span>+{newAchievement.points} Points</span>
              <span>+{newAchievement.coins} Coins</span>
            </div>
          </div>
        </div>
      )}

      <div className="achievements-grid">
        {allAchievements.map(achievement => {
          const isUnlocked = unlockedAchievements.includes(achievement.id)
          const progress = getProgress(achievement)

          return (
            <div
              key={achievement.id}
              className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon-wrapper">
                <div className="achievement-icon">{achievement.icon}</div>
                {isUnlocked && <div className="unlock-badge">✓</div>}
              </div>
              <div className="achievement-info">
                <h4 className="achievement-name">{achievement.name}</h4>
                <p className="achievement-description">{achievement.description}</p>
                {!isUnlocked && (
                  <div className="achievement-progress">
                    <div className="progress-bar-small">
                      <div
                        className="progress-fill-small"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="progress-text">{progress}%</span>
                  </div>
                )}
                {isUnlocked && (
                  <div className="achievement-rewards">
                    <span className="reward-points">+{achievement.points} ⚡</span>
                    <span className="reward-coins">+{achievement.coins} 🪙</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AchievementSystem

