import { useMemo } from 'react'
import { getQuoteOfTheDay, getEncouragingMessage } from '../data/quotes'
import './DailyMotivation.css'

function DailyMotivation({ journeyId, completedDays }) {
  // Get domain-specific quote that changes daily
  const motivations = useMemo(() => {
    // Default to body-transformation if journeyId is not recognized
    const domain = journeyId || 'body-transformation'
    return getQuoteOfTheDay(domain, completedDays)
  }, [journeyId, completedDays])

  // Get encouraging message based on progress
  const encouragingMessages = useMemo(() => {
    return getEncouragingMessage(completedDays)
  }, [completedDays])

  return (
    <div className="daily-motivation">
      <div className="motivation-header">
        <div className="motivation-icon">{motivations.icon}</div>
        <div className="encouragement-badge">
          <span className="encouragement-emoji">{encouragingMessages.emoji}</span>
          <span className="encouragement-text">{encouragingMessages.message}</span>
        </div>
      </div>
      
      <div className="motivation-content">
        <blockquote className="motivation-quote">
          "{motivations.quote}"
        </blockquote>
        <cite className="motivation-author">— {motivations.author}</cite>
      </div>

      <div className="motivation-stats">
        <div className="stat-item">
          <span className="stat-number">{completedDays}</span>
          <span className="stat-label">Days Completed</span>
        </div>
        <div className="stat-divider">•</div>
        <div className="stat-item">
          <span className="stat-number">{90 - completedDays}</span>
          <span className="stat-label">Days Remaining</span>
        </div>
      </div>
    </div>
  )
}

export default DailyMotivation

