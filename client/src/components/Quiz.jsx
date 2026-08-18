import { useRef, useState } from 'react';
import { Check, X } from 'lucide-react';

function Quiz({ questions, onComplete, lockRetake = false, accentColor = 'var(--neon-green)' }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const scoreRef = useRef(0);

  if (!questions || questions.length === 0) return null;

  const handleAnswerSelect = (answerIndex) => {
    if (answered || finished) return;
    setSelectedAnswer(answerIndex);
    setAnswered(true);

    const question = questions[currentQuestion];
    if (question.correctAnswer === answerIndex) {
      scoreRef.current += 1;
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      return;
    }

    const correct = scoreRef.current;
    setFinalScore(correct);
    setFinished(true);
    onComplete?.(correct, questions.length);
  };

  if (finished && !lockRetake) {
    const percentage = Math.round((finalScore / questions.length) * 100);
    return (
      <div className="text-center py-4 space-y-3">
        <p className="text-sm font-bold text-[var(--text-primary)]">Quiz complete</p>
        <p className="text-2xl font-extrabold tabular-nums" style={{ color: accentColor }}>
          {finalScore}/{questions.length} · {percentage}%
        </p>
      </div>
    );
  }

  if (finished && lockRetake) {
    // Parent DailyQuiz shows the result panel
    return (
      <div className="text-center py-6 text-sm text-[var(--text-secondary)]">
        Saving your result…
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer !== null && question.correctAnswer === selectedAnswer;
  const progressPct = ((currentQuestion + (answered ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-[10px] font-bold tabular-nums" style={{ color: accentColor }}>
            {Math.round(progressPct)}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%`, background: accentColor }}
          />
        </div>
      </div>

      <div>
        {question.category && (
          <span
            className="inline-block text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded mb-2"
            style={{
              color: accentColor,
              background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
            }}
          >
            {question.category}
          </span>
        )}
        <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] leading-snug">
          {question.question}
        </h3>
      </div>

      <div className="space-y-2">
        {question.options.map((option, index) => {
          let border = 'var(--border-subtle)';
          let bg = 'var(--bg-elevated)';
          if (answered) {
            if (index === question.correctAnswer) {
              border = 'var(--neon-green)';
              bg = 'color-mix(in srgb, var(--neon-green) 12%, transparent)';
            } else if (index === selectedAnswer) {
              border = '#f87171';
              bg = 'color-mix(in srgb, #f87171 12%, transparent)';
            }
          } else if (index === selectedAnswer) {
            border = accentColor;
            bg = `color-mix(in srgb, ${accentColor} 10%, transparent)`;
          }

          return (
            <button
              key={index}
              type="button"
              disabled={answered}
              onClick={() => handleAnswerSelect(index)}
              className="w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors disabled:cursor-default"
              style={{ borderColor: border, background: bg }}
            >
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
                style={{
                  color: accentColor,
                  background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
                }}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1 text-sm text-[var(--text-primary)]">{option}</span>
              {answered && index === question.correctAnswer && (
                <Check className="size-4 text-[var(--neon-green)] shrink-0" />
              )}
              {answered && index === selectedAnswer && index !== question.correctAnswer && (
                <X className="size-4 text-red-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className="rounded-xl border p-3 space-y-2"
          style={{
            borderColor: isCorrect
              ? 'color-mix(in srgb, var(--neon-green) 40%, var(--border-subtle))'
              : 'color-mix(in srgb, #f87171 35%, var(--border-subtle))',
            background: 'var(--bg-elevated)',
          }}
        >
          <p
            className="text-xs font-semibold"
            style={{ color: isCorrect ? 'var(--neon-green)' : '#f87171' }}
          >
            {isCorrect ? 'Correct' : `Answer: ${question.options[question.correctAnswer]}`}
          </p>
          {question.explanation && (
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              {question.explanation}
            </p>
          )}
          <button
            type="button"
            onClick={handleNext}
            className="w-full rounded-lg py-2.5 text-sm font-bold text-black mt-1"
            style={{ background: accentColor }}
          >
            {currentQuestion < questions.length - 1 ? 'Next question' : 'See results'}
          </button>
        </div>
      )}
    </div>
  );
}

export default Quiz;
