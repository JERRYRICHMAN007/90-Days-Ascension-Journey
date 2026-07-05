import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ExternalLink, RotateCcw } from 'lucide-react';
import { FlipCard3D } from '../ui/FlipCard3D';
import { SessionCompletionButton } from '../SessionCompletionButton';
import { ReadingTomorrowPreview } from './ReadingTomorrowPreview';
import { getBookForDayNumber } from '../../data/journeys/journeyCuratedResources';
import { getJourneyTrace } from '../../utils/tracing';
import { isTomorrow } from '../../utils/dates';

const READING_ACCENT = '#a78bfa';
const READING_GLOW = 'var(--neon-glow-purple)';

function parseSessionTime(timeStr) {
  if (!timeStr) return { start: '9:15 PM', end: '10:00 PM' };
  const parts = timeStr.split(' - ');
  return { start: parts[0]?.trim() || '9:15 PM', end: parts[1]?.trim() || null };
}

function BookCover({ title, author }) {
  const initial = (title || 'R').charAt(0).toUpperCase();

  return (
    <div
      className="shrink-0 w-[100px] sm:w-[120px] aspect-[3/4] rounded-lg border flex flex-col items-center justify-center p-3 text-center"
      style={{
        background: 'linear-gradient(145deg, rgba(167,139,250,0.25) 0%, rgba(124,58,237,0.15) 100%)',
        borderColor: 'rgba(167,139,250,0.35)',
        boxShadow: READING_GLOW,
      }}
    >
      <BookOpen className="w-8 h-8 mb-2 opacity-80" style={{ color: READING_ACCENT }} />
      <span className="text-2xl font-extrabold text-[var(--text-primary)] leading-none">{initial}</span>
      {author && (
        <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mt-2 line-clamp-2">
          {author.split(' ').pop()}
        </span>
      )}
    </div>
  );
}

function ExtraSessionCard({ session }) {
  const bibleData =
    session.type === 'Bible Reading' && typeof session.material === 'object'
      ? session.material
      : null;
  const materialText = bibleData ? bibleData.text : session.material;
  const { start } = parseSessionTime(session.time);

  return (
    <FlipCard3D
      size="wide"
      ariaLabel={`${session.type} at ${session.time}. ${materialText}`}
      front={
        <div
          className="w-full h-full rounded-xl p-4 flex flex-col justify-between min-h-[140px] border transition-all duration-200"
          style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="forge-label" style={{ color: READING_ACCENT }}>
              {session.type}
            </span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded"
              style={{
                color: READING_ACCENT,
                border: '1px solid rgba(167,139,250,0.4)',
                background: 'var(--bg-badge)',
              }}
            >
              {start}
            </span>
          </div>
          <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug line-clamp-3 flex-1">
            {materialText}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[1px] mt-3 flex items-center gap-1" style={{ color: READING_ACCENT }}>
            <RotateCcw className="w-3 h-3" />
            Tap for details
          </p>
        </div>
      }
      back={
        <div
          className="w-full h-full rounded-xl p-4 flex flex-col justify-center gap-2 overflow-y-auto border min-h-[140px]"
          style={{ background: 'var(--bg-elevated)', borderColor: READING_ACCENT, boxShadow: READING_GLOW }}
        >
          <p className="forge-label" style={{ color: READING_ACCENT }}>{session.type}</p>
          <p className="text-xs text-[var(--text-primary)] leading-relaxed text-left">{materialText}</p>
          {bibleData?.link && (
            <a
              href={bibleData.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-black mt-1 w-fit"
              style={{ background: READING_ACCENT }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Read Chapter
            </a>
          )}
          <p className="text-[10px] text-[var(--text-secondary)]">Tap to flip back</p>
        </div>
      }
    />
  );
}

export function ReadingFlowHero({
  dailyLearning,
  readingSessions = [],
  focusLabel = "Today's Reading",
  theme = null,
  journeyId = 'reading',
  dayNumber,
  nextDay = null,
  onPreviewDay = null,
}) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => setTick((t) => t + 1);
    window.addEventListener('session-completed', refresh);
    window.addEventListener('progress-updated', refresh);
    return () => {
      window.removeEventListener('session-completed', refresh);
      window.removeEventListener('progress-updated', refresh);
    };
  }, []);

  const progress = useMemo(() => {
    void tick;
    return getJourneyTrace(journeyId).completion;
  }, [journeyId, tick]);

  if (!readingSessions?.length) return null;

  const previewingTomorrow = dayNumber != null && isTomorrow(dayNumber);
  const showTomorrowPreview =
    nextDay && dayNumber != null && !previewingTomorrow && isTomorrow(nextDay.dayNumber);

  const primarySession =
    readingSessions.find((s) => s.type === 'Book') || readingSessions[0];
  const extraSessions = readingSessions.filter((s) => s !== primarySession);
  const book = dayNumber != null ? getBookForDayNumber(dayNumber) : null;
  const { start: sessionStart, end: sessionEnd } = parseSessionTime(primarySession?.time);

  const displayTitle = book?.title || primarySession?.material;
  const displayAuthor = book?.author || null;

  return (
    <div className="space-y-4 min-w-0">
      <div
        className="rounded-[12px] border overflow-hidden min-w-0"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        {/* Header — Figma Frame 5 */}
        <div className="p-5 sm:p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: READING_ACCENT, boxShadow: READING_GLOW }}
            />
            <p className="forge-label">{focusLabel}</p>
          </div>
          <h2 className="text-2xl sm:text-[32px] font-extrabold text-[var(--text-primary)] tracking-[-0.64px] leading-tight">
            {dailyLearning?.title || `Reading Focus${theme ? `: ${theme}` : ''}`}
          </h2>
          {dailyLearning?.description && (
            <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
              {dailyLearning.description}
            </p>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Book display */}
          <div
            className="rounded-xl border p-4 sm:p-5"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex gap-4 sm:gap-5">
              <BookCover title={displayTitle} author={displayAuthor} />
              <div className="min-w-0 flex-1 flex flex-col justify-center">
                <p className="forge-label mb-2" style={{ color: READING_ACCENT }}>
                  {primarySession?.type || 'Book'}
                </p>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] leading-snug tracking-tight">
                  {displayTitle}
                </h3>
                {displayAuthor && (
                  <p className="text-sm text-[var(--text-secondary)] mt-1">by {displayAuthor}</p>
                )}
                {(primarySession?.focus || book?.purpose) && (
                  <p className="text-xs text-[var(--text-secondary)] mt-3 leading-relaxed line-clamp-3">
                    {primarySession?.focus || book?.purpose}
                  </p>
                )}
                {book?.url && (
                  <a
                    href={book.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold mt-3 w-fit uppercase tracking-[1px]"
                    style={{ color: READING_ACCENT }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View on Goodreads
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Session time — 9:15 PM indicator */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3"
            style={{ background: 'var(--bg-elevated)', borderColor: 'rgba(167,139,250,0.25)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="size-10 rounded-lg flex items-center justify-center border shrink-0"
                style={{
                  background: 'rgba(167,139,250,0.12)',
                  borderColor: 'rgba(167,139,250,0.3)',
                }}
              >
                <Clock className="w-4 h-4" style={{ color: READING_ACCENT }} />
              </div>
              <div>
                <p className="forge-label">Evening Session</p>
                <p
                  className="text-xl sm:text-2xl font-extrabold tabular-nums tracking-tight leading-none mt-1"
                  style={{ color: READING_ACCENT }}
                >
                  {sessionStart}
                </p>
              </div>
            </div>
            {sessionEnd && (
              <span
                className="text-[10px] font-bold uppercase tracking-[1.2px] px-3 py-1.5 rounded-full"
                style={{
                  color: READING_ACCENT,
                  border: '1px solid rgba(167,139,250,0.35)',
                  background: 'rgba(167,139,250,0.08)',
                }}
              >
                Until {sessionEnd}
              </span>
            )}
          </div>

          {/* Reading progress tracker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="forge-label">Reading Progress</span>
              <span className="forge-label" style={{ color: READING_ACCENT }}>
                {progress.percentComplete ?? 0}%
              </span>
            </div>
            <div className="forge-progress-track">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(progress.percentComplete ?? 0, 0)}%`,
                  background: `linear-gradient(90deg, ${READING_ACCENT}, #7c3aed)`,
                  boxShadow: (progress.percentComplete ?? 0) > 0 ? READING_GLOW : 'none',
                }}
              />
            </div>
            <p className="text-[10px] uppercase tracking-wide text-[var(--text-secondary)] mt-2">
              Day {progress.currentDay ?? dayNumber ?? 0} of {progress.totalDays ?? 90}
            </p>
          </div>

          {/* Additional sessions (Bible, etc.) */}
          {extraSessions.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {extraSessions.map((session, idx) => (
                <ExtraSessionCard key={idx} session={session} />
              ))}
            </div>
          )}

          {dayNumber !== undefined && !previewingTomorrow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="pt-5 border-t"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <SessionCompletionButton
                journeyId={journeyId}
                dayNumber={dayNumber}
                sessionType="daily"
                sessionIndex={0}
                accentColor={READING_ACCENT}
                accentGlow={READING_GLOW}
                onComplete={() => {
                  window.dispatchEvent(
                    new CustomEvent('session-completed', {
                      detail: { journeyId, dayNumber },
                    })
                  );
                }}
              />
            </motion.div>
          )}
        </div>
      </div>

      {showTomorrowPreview && (
        <ReadingTomorrowPreview nextDay={nextDay} onPreview={onPreviewDay} />
      )}
    </div>
  );
}
