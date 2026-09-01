import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ExternalLink, RotateCcw } from 'lucide-react';
import { FlipCard3D } from '../ui/FlipCard3D';
import { SessionCompletionButton } from '../SessionCompletionButton';
import { ReadingTomorrowPreview } from './ReadingTomorrowPreview';
import { JourneyDailyFlow, FlowCardFace, FlowCardBack } from './JourneyDailyFlow';
import { getBookForDayNumber } from '../../utils/readingPlan.js';
import { getJourneyTrace } from '../../utils/tracing';
import { isTomorrowFor } from '../../utils/journeyPlanning.js';

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
      className="shrink-0 w-[72px] sm:w-[84px] aspect-[3/4] rounded-lg border flex flex-col items-center justify-center p-2 text-center"
      style={{
        background: 'linear-gradient(145deg, rgba(167,139,250,0.25) 0%, rgba(124,58,237,0.15) 100%)',
        borderColor: 'rgba(167,139,250,0.35)',
      }}
    >
      <BookOpen className="w-5 h-5 mb-1 opacity-80" style={{ color: READING_ACCENT }} />
      <span className="text-lg font-extrabold text-[var(--text-primary)] leading-none">{initial}</span>
      {author && (
        <span className="text-[8px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mt-1 line-clamp-1">
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
      size="flow"
      className="w-full max-w-none"
      ariaLabel={`${session.type} at ${session.time}. ${materialText}`}
      front={
        <FlowCardFace
          accentColor={READING_ACCENT}
          badge={start}
          eyebrow={session.type}
          title={materialText}
          hint={
            <>
              <RotateCcw className="size-2.5" /> Tap for details
            </>
          }
        />
      }
      back={
        <FlowCardBack eyebrow={session.type} accentColor={READING_ACCENT}>
          <p>{materialText}</p>
          {bibleData?.link && (
            <a
              href={bibleData.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold text-black mt-2 w-fit"
              style={{ background: READING_ACCENT }}
            >
              <ExternalLink className="w-3 h-3" />
              Read Chapter
            </a>
          )}
        </FlowCardBack>
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

  const previewingTomorrow = dayNumber != null && isTomorrowFor(journeyId, dayNumber);
  const showTomorrowPreview =
    nextDay && dayNumber != null && !previewingTomorrow && isTomorrowFor(journeyId, nextDay.dayNumber);

  const primarySession =
    readingSessions.find((s) => s.type === 'Book') || readingSessions[0];
  const extraSessions = readingSessions.filter((s) => s !== primarySession);
  const book = dayNumber != null ? getBookForDayNumber(dayNumber, journeyId) : null;
  const { start: sessionStart, end: sessionEnd } = parseSessionTime(primarySession?.time);

  const displayTitle = book?.title || primarySession?.material;
  const displayAuthor = book?.author || null;
  const heading = dailyLearning?.title || `Reading Focus${theme ? `: ${theme}` : ''}`;

  return (
    <div className="space-y-3 min-w-0">
      <JourneyDailyFlow
        icon={BookOpen}
        title={heading}
        label={focusLabel}
        accentColor={READING_ACCENT}
        columns={1}
        footer={
          dayNumber !== undefined && !previewingTomorrow ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
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
          ) : null
        }
      >
        <div
          className="rounded-xl border p-3 flex gap-3"
          style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
        >
          <BookCover title={displayTitle} author={displayAuthor} />
          <div className="min-w-0 flex-1 flex flex-col justify-center gap-1">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: READING_ACCENT }}>
              {primarySession?.type || 'Book'}
            </p>
            <h3 className="text-sm sm:text-[15px] font-bold text-[var(--text-primary)] leading-snug line-clamp-2">
              {displayTitle}
            </h3>
            {displayAuthor && (
              <p className="text-[11px] text-[var(--text-secondary)]">by {displayAuthor}</p>
            )}
            {(primarySession?.focus || book?.purpose) && (
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed line-clamp-2 mt-0.5">
                {primarySession?.focus || book?.purpose}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span
                className="inline-flex items-center gap-1 text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded"
                style={{
                  color: READING_ACCENT,
                  background: 'rgba(167,139,250,0.12)',
                }}
              >
                <Clock className="size-2.5" />
                {sessionStart}
                {sessionEnd ? ` – ${sessionEnd}` : ''}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] tabular-nums">
                {progress.percentComplete ?? 0}% · Day {progress.currentDay ?? dayNumber ?? 0}/
                {progress.totalDays ?? 90}
              </span>
              {book?.url && (
                <a
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.08em]"
                  style={{ color: READING_ACCENT }}
                >
                  <ExternalLink className="size-2.5" />
                  Goodreads
                </a>
              )}
            </div>
            <div className="aether-progress-track mt-2 h-1">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(progress.percentComplete ?? 0, 0)}%`,
                  background: `linear-gradient(90deg, ${READING_ACCENT}, #7c3aed)`,
                }}
              />
            </div>
          </div>
        </div>
      </JourneyDailyFlow>

      {extraSessions.length > 0 && (
        <JourneyDailyFlow
          title="More sessions"
          label="Additional reading blocks"
          accentColor={READING_ACCENT}
          columns={extraSessions.length === 1 ? 1 : 2}
        >
          {extraSessions.map((session, idx) => (
            <ExtraSessionCard key={idx} session={session} />
          ))}
        </JourneyDailyFlow>
      )}

      {showTomorrowPreview && (
        <ReadingTomorrowPreview nextDay={nextDay} onPreview={onPreviewDay} journeyId={journeyId} />
      )}
    </div>
  );
}
