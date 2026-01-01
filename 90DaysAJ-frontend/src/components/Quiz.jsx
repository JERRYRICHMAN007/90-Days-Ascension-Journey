import { useState } from 'react'
import './Quiz.css'

function Quiz({ questions, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answered, setAnswered] = useState(false)

  if (!questions || questions.length === 0) {
    return null
  }

  const handleAnswerSelect = (answerIndex) => {
    if (answered) return
    setSelectedAnswer(answerIndex)
    setAnswered(true)
    
    const question = questions[currentQuestion]
    const isCorrect = question.correctAnswer === answerIndex
    
    if (isCorrect) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setShowResult(true)
      if (onComplete) {
        onComplete(score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0), questions.length)
      }
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setAnswered(false)
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="quiz-result">
        <h3>Quiz Complete! 🎉</h3>
        <div className="score-display">
          <div className="score-circle">
            <span className="score-number">{score}</span>
            <span className="score-total">/{questions.length}</span>
          </div>
          <div className="score-percentage">{percentage}%</div>
        </div>
        <p className="score-message">
          {percentage >= 80 ? 'Excellent! You mastered this topic! 🌟' :
           percentage >= 60 ? 'Good job! Keep practicing! 💪' :
           'Review the material and try again! 📚'}
        </p>
        <button onClick={handleRestart} className="quiz-button restart-btn">
          Retake Quiz
        </button>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const isCorrect = selectedAnswer !== null && question.correctAnswer === selectedAnswer

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-progress">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="quiz-progress-bar">
          <div 
            className="quiz-progress-fill" 
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="quiz-question">
        <div className="question-category">{question.category}</div>
        <h3>{question.question}</h3>
      </div>

      <div className="quiz-answers">
        {question.options.map((option, index) => {
          let answerClass = 'answer-option'
          if (answered) {
            if (index === question.correctAnswer) {
              answerClass += ' correct'
            } else if (index === selectedAnswer && index !== question.correctAnswer) {
              answerClass += ' incorrect'
            }
          } else if (index === selectedAnswer) {
            answerClass += ' selected'
          }

          return (
            <button
              key={index}
              className={answerClass}
              onClick={() => handleAnswerSelect(index)}
              disabled={answered}
            >
              <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
              <span className="answer-text">{option}</span>
              {answered && index === question.correctAnswer && (
                <span className="answer-icon">✓</span>
              )}
              {answered && index === selectedAnswer && index !== question.correctAnswer && (
                <span className="answer-icon">✗</span>
              )}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="quiz-feedback">
          <div className={`feedback-message ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? (
              <>
                <span className="feedback-icon">✓</span>
                <span>Correct! Well done!</span>
              </>
            ) : (
              <>
                <span className="feedback-icon">✗</span>
                <span>The correct answer is: {question.options[question.correctAnswer]}</span>
              </>
            )}
          </div>
          {question.explanation && (
            <div className="feedback-explanation">
              <strong>Explanation:</strong> {question.explanation}
            </div>
          )}
          <button onClick={handleNext} className="quiz-button next-btn">
            {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  )
}

export default Quiz

