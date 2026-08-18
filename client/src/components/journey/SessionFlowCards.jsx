import { BookOpen, Clock, RotateCcw } from 'lucide-react';
import { FlipCard3D } from '../ui/FlipCard3D';
import { SessionCompletionButton } from '../SessionCompletionButton';
import { JourneyDailyFlow } from './JourneyDailyFlow';

const DISCIPLINE_COLORS = {
  Mobile: '#f59e0b',
  Frontend: '#667eea',
  Backend: '#10b981',
  'Systems Engineering': '#8b5cf6',
  WordPress: '#8b5cf6',
};

function SessionFlipCard({
  session,
  step,
  journeyId,
  dayNumber,
  sessionType,
  sessionIndex,
  activeDiscipline,
}) {
  const title = session.content?.title || session.title || 'Session';
  const topics = session.content?.topics?.length
    ? session.content.topics
    : session.content?.requirements || [];
  const discipline = session.discipline || activeDiscipline;
  const accent = DISCIPLINE_COLORS[discipline] || 'var(--neon-green)';

  return (
    <FlipCard3D
      size="session"
      ariaLabel={`${title} at ${session.time || ''}`}
      className="w-full max-w-none mx-0"
      front={
        <div
          className="w-full h-full rounded-xl border p-3 flex flex-col gap-2 text-left"
          style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-start justify-between gap-2">
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold tabular-nums"
              style={{
                color: accent,
                background: `color-mix(in srgb, ${accent} 14%, transparent)`,
                border: `1px solid color-mix(in srgb, ${accent} 35%, transparent)`,
              }}
            >
              {step}
            </span>
            <div className="flex flex-wrap gap-1 justify-end">
              {session.isRevision && (
                <span className="text-[9px] px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded font-semibold">
                  Revision
                </span>
              )}
              {session.time && (
                <span
                  className="inline-flex items-center gap-1 text-[9px] font-semibold tabular-nums px-1.5 py-0.5 rounded"
                  style={{
                    color: accent,
                    background: `color-mix(in srgb, ${accent} 10%, transparent)`,
                  }}
                >
                  <Clock className="size-2.5 shrink-0" />
                  {session.time}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col gap-1">
            {discipline && (
              <span
                className="self-start text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded"
                style={{
                  color: accent,
                  background: `color-mix(in srgb, ${accent} 12%, transparent)`,
                }}
              >
                {discipline}
              </span>
            )}
            <p className="text-[13px] sm:text-sm font-semibold text-[var(--text-primary)] leading-snug line-clamp-3">
              {session.isRevision ? '🔄 ' : ''}
              {title}
            </p>
            {session.duration && (
              <p className="text-[10px] text-[var(--text-secondary)] mt-auto">{session.duration}</p>
            )}
          </div>

          <p
            className="text-[9px] font-bold uppercase tracking-[0.1em] flex items-center gap-1 pt-1 border-t"
            style={{ color: accent, borderColor: 'var(--border-subtle)' }}
          >
            <RotateCcw className="size-2.5" />
            Tap for topics
          </p>
        </div>
      }
      back={
        <div
          className="w-full h-full rounded-xl border p-3 flex flex-col gap-1.5 overflow-hidden text-left"
          style={{
            background: 'var(--bg-elevated)',
            borderColor: `color-mix(in srgb, ${accent} 40%, var(--border-subtle))`,
          }}
        >
          <p className="text-[13px] font-semibold text-[var(--text-primary)] line-clamp-2">{title}</p>
          {session.content?.description && (
            <p className="text-[10px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
              {session.content.description}
            </p>
          )}
          {topics.length > 0 ? (
            <ul className="text-[10px] text-[var(--text-primary)] space-y-1 flex-1 overflow-y-auto pr-1">
              {topics.slice(0, 5).map((topic, i) => (
                <li key={i} className="flex gap-1.5">
                  <span className="shrink-0" style={{ color: accent }}>
                    •
                  </span>
                  <span className="leading-snug line-clamp-2">{topic}</span>
                </li>
              ))}
              {topics.length > 5 && (
                <li className="text-[var(--text-muted)] pl-2.5">+{topics.length - 5} more</li>
              )}
            </ul>
          ) : (
            <p className="text-[10px] text-[var(--text-muted)] flex-1">
              Focus on today&apos;s learning outcomes for this block.
            </p>
          )}
          {dayNumber !== undefined && (
            <div
              className="mt-auto pt-1.5 border-t border-[var(--border-subtle)]"
              onClick={(e) => e.stopPropagation()}
            >
              <SessionCompletionButton
                journeyId={journeyId}
                dayNumber={dayNumber}
                sessionType={sessionType}
                sessionIndex={sessionIndex}
                discipline={discipline}
                accentColor={accent}
                onComplete={() => {
                  window.dispatchEvent(
                    new CustomEvent('session-completed', {
                      detail: { journeyId, dayNumber },
                    })
                  );
                }}
              />
            </div>
          )}
          <p className="text-[9px] text-[var(--text-muted)] shrink-0 text-center">Tap to flip back</p>
        </div>
      }
    />
  );
}

export function SessionFlowCards({
  sessions = [],
  journeyId,
  dayNumber,
  sessionType = 'deepLearning',
  activeDiscipline,
  title = 'Deep Learning Sessions',
  label = 'Sessions · complete in order',
}) {
  if (!sessions?.length) return null;

  const count = sessions.length;

  return (
    <JourneyDailyFlow
      icon={BookOpen}
      title={`${title} (${count})`}
      label={label}
      accentColor="var(--neon-green)"
      columns={count === 1 ? 1 : count === 2 ? 2 : 3}
    >
      {sessions.map((session, idx) => (
        <SessionFlipCard
          key={`${session.discipline || 'session'}-${idx}`}
          session={session}
          step={idx + 1}
          journeyId={journeyId}
          dayNumber={dayNumber}
          sessionType={sessionType}
          sessionIndex={idx}
          activeDiscipline={activeDiscipline}
        />
      ))}
    </JourneyDailyFlow>
  );
}
