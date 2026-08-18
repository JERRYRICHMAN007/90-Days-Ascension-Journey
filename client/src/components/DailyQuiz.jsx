import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Trophy,
  Clock,
  Lock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Quiz from './Quiz';
import {
  getQuizResult,
  saveQuizResult,
  hasCompletedAssessment,
} from '../utils/quizResults.js';

function resolvePassThreshold(dailyQuiz) {
  const total = dailyQuiz.totalQuestions || dailyQuiz.questions?.length || 1;
  const pass = dailyQuiz.passingScore ?? Math.ceil(total * 0.7);
  // passingScore is count of correct answers when <= total, else treat as percent
  if (pass <= total) {
    return Math.round((pass / total) * 100);
  }
  return pass;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function ResultPanel({
  score,
  dailyQuiz,
  locked,
  onContinue,
  onRetake,
  showAssessmentCta,
}) {
  const accent = score.passed ? 'var(--neon-green)' : '#f59e0b';

  return (
    <div
      className="rounded-xl border p-5 sm:p-6 text-center"
      style={{
        background: 'var(--bg-card)',
        borderColor: `color-mix(in srgb, ${accent} 45%, var(--border-subtle))`,
      }}
    >
      {score.passed ? (
        <Trophy className="size-12 mx-auto mb-3" style={{ color: accent }} />
      ) : (
        <XCircle className="size-12 mx-auto mb-3" style={{ color: accent }} />
      )}

      <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: accent }}>
        {score.passed ? 'Quiz passed' : 'Keep learning'}
      </h2>

      <p className="text-sm text-[var(--text-primary)] mb-1">
        Score{' '}
        <span className="font-bold tabular-nums" style={{ color: accent }}>
          {score.percentage}%
        </span>{' '}
        ({score.correct}/{score.total} correct)
      </p>

      <p className="text-xs text-[var(--text-secondary)] mb-5 max-w-md mx-auto leading-relaxed">
        {score.passed
          ? locked
            ? 'Result recorded. This quiz is locked for today.'
            : "Great work — today's concepts are locked in. Continue to the practical assessment."
          : `You need about ${resolvePassThreshold(dailyQuiz)}% to pass. Review today's resources, then try again.`}
      </p>

      {locked && score.passed && (
        <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] mb-4">
          <Lock className="size-3" />
          Recorded · no retake
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        {score.passed && showAssessmentCta && onContinue && (
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-black"
            style={{ background: accent }}
          >
            Continue to Assessment
            <ArrowRight className="size-4" />
          </button>
        )}
        {!score.passed && !locked && onRetake && (
          <button
            type="button"
            onClick={onRetake}
            className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-black"
            style={{ background: accent }}
          >
            Retake Quiz
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Daily quiz for all journeys — auto-saves, locks after a pass.
 */
export default function DailyQuiz({
  dailyQuiz,
  journeyId,
  dayNumber,
  onComplete,
  onContinueToAssessment,
  accentColor = 'var(--neon-green)',
}) {
  const saved = useMemo(() => {
    if (journeyId == null || dayNumber == null) return null;
    return getQuizResult(journeyId, dayNumber);
  }, [journeyId, dayNumber]);

  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(() =>
    saved
      ? {
          correct: saved.score,
          total: saved.maxScore,
          percentage:
            saved.percentage ??
            Math.round((saved.score / Math.max(saved.maxScore, 1)) * 100),
          passed: Boolean(saved.passed),
        }
      : null
  );
  const [tick, setTick] = useState(0);
  const timeLimitSec = (dailyQuiz?.timeLimit || 15) * 60;
  const [timeRemaining, setTimeRemaining] = useState(timeLimitSec);
  const savedOnce = useRef(Boolean(saved?.passed));

  useEffect(() => {
    const refresh = () => setTick((t) => t + 1);
    window.addEventListener('quiz-results-updated', refresh);
    return () => window.removeEventListener('quiz-results-updated', refresh);
  }, []);

  useEffect(() => {
    void tick;
    if (journeyId == null || dayNumber == null) return;
    const latest = getQuizResult(journeyId, dayNumber);
    if (!latest) return;
    setScore({
      correct: latest.score,
      total: latest.maxScore,
      percentage:
        latest.percentage ??
        Math.round((latest.score / Math.max(latest.maxScore, 1)) * 100),
      passed: Boolean(latest.passed),
    });
    if (latest.passed) {
      savedOnce.current = true;
      setIsStarted(false);
    }
  }, [journeyId, dayNumber, tick]);

  useEffect(() => {
    if (!isStarted || score || timeRemaining <= 0) return undefined;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isStarted, score, timeRemaining]);

  if (!dailyQuiz || !dailyQuiz.questions || dailyQuiz.questions.length === 0) {
    return (
      <div
        className="rounded-xl border p-8 text-center text-sm text-[var(--text-muted)]"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        No quiz available for today
      </div>
    );
  }

  const locked = Boolean(score?.passed);
  const assessmentDone =
    journeyId != null && dayNumber != null
      ? hasCompletedAssessment(journeyId, dayNumber)
      : false;
  const passNeeded = resolvePassThreshold(dailyQuiz);
  const totalQ = dailyQuiz.totalQuestions || dailyQuiz.questions.length;

  const handleQuizComplete = (correct, total) => {
    const safeTotal = Math.max(total, 1);
    const safeCorrect = Math.min(Math.max(0, correct), safeTotal);
    const percentage = Math.round((safeCorrect / safeTotal) * 100);
    const passed = percentage >= passNeeded;
    const next = { correct: safeCorrect, total: safeTotal, percentage, passed };
    setScore(next);

    if (journeyId != null && dayNumber != null && !(savedOnce.current && saved?.passed)) {
      saveQuizResult(journeyId, dayNumber, next);
      if (passed) savedOnce.current = true;
    }
    onComplete?.(next);
  };

  const retake = () => {
    if (locked) return;
    setIsStarted(true);
    setScore(null);
    setTimeRemaining(timeLimitSec);
  };

  if (score) {
    return (
      <div className="space-y-3">
        <ResultPanel
          score={score}
          dailyQuiz={dailyQuiz}
          locked={locked}
          showAssessmentCta={!assessmentDone}
          onContinue={onContinueToAssessment}
          onRetake={retake}
        />
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
          <Sparkles className="size-4 shrink-0" style={{ color: accentColor }} />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[var(--text-primary)] truncate">{dailyQuiz.title}</h3>
            {dailyQuiz.description && (
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 line-clamp-2">
                {dailyQuiz.description}
              </p>
            )}
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Questions', value: totalQ },
              { label: 'Minutes', value: dailyQuiz.timeLimit || 15 },
              { label: 'Pass at', value: `${passNeeded}%` },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border px-2 py-3 text-center"
                style={{
                  background: 'var(--bg-elevated)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                <div className="text-lg font-bold tabular-nums" style={{ color: accentColor }}>
                  {stat.value}
                </div>
                <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setIsStarted(true);
              setTimeRemaining(timeLimitSec);
            }}
            className="w-full rounded-xl py-3 text-sm font-bold text-black"
            style={{ background: accentColor }}
          >
            Start Daily Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <div
        className="px-4 py-3 border-b flex items-center justify-between gap-3"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <h3 className="text-sm font-bold text-[var(--text-primary)] truncate">{dailyQuiz.title}</h3>
        <span
          className="inline-flex items-center gap-1.5 text-xs font-bold tabular-nums shrink-0"
          style={{ color: timeRemaining < 60 ? '#f59e0b' : accentColor }}
        >
          <Clock className="size-3.5" />
          {formatTime(timeRemaining)}
        </span>
      </div>
      <div className="p-3 sm:p-4">
        <Quiz
          questions={dailyQuiz.questions}
          onComplete={handleQuizComplete}
          lockRetake
          accentColor={accentColor}
        />
      </div>
    </div>
  );
}
