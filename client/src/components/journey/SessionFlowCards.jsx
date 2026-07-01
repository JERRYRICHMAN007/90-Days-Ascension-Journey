import { BookOpen, RotateCcw } from 'lucide-react';
import { FlipCard3D } from '../ui/FlipCard3D';
import { FlowCircuit } from '../ui/FlowCircuit';
import { SessionCompletionButton } from '../SessionCompletionButton';

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
    : (session.content?.requirements || []);

  return (
    <FlipCard3D
      size="wide"
      ariaLabel={`${title} at ${session.time || ''}`}
      front={
        <div className="w-full h-full border border-border/60 bg-gradient-to-br from-muted/80 to-muted/40 p-3 sm:p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1 flex-wrap">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary tabular-nums">
              {step}
            </span>
            <div className="flex flex-wrap gap-1 justify-end">
              {session.isRevision && (
                <span className="text-[9px] px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded font-semibold">
                  Revision
                </span>
              )}
              {session.time && (
                <span className="text-[10px] font-mono font-semibold text-primary">{session.time}</span>
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center min-h-0 py-1">
            {session.discipline && (
              <p className="text-[10px] text-muted-foreground truncate">{session.discipline}</p>
            )}
            <p className="text-xs sm:text-sm font-medium text-foreground leading-snug line-clamp-3">
              {session.isRevision ? '🔄 ' : ''}{title}
            </p>
            {session.duration && (
              <p className="text-[10px] text-primary mt-1">{session.duration}</p>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            Tap for topics
          </p>
        </div>
      }
      back={
        <div className="w-full h-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 p-3 sm:p-4 flex flex-col gap-2 overflow-y-auto">
          <p className="text-xs font-semibold text-foreground line-clamp-2">{title}</p>
          {session.content?.description && (
            <p className="text-[10px] text-muted-foreground line-clamp-2">{session.content.description}</p>
          )}
          {topics.length > 0 && (
            <ul className="text-[10px] text-foreground space-y-0.5 flex-1 overflow-y-auto">
              {topics.slice(0, 5).map((topic, i) => (
                <li key={i} className="flex gap-1">
                  <span className="text-primary shrink-0">•</span>
                  <span className="line-clamp-2">{topic}</span>
                </li>
              ))}
              {topics.length > 5 && (
                <li className="text-muted-foreground">+{topics.length - 5} more</li>
              )}
            </ul>
          )}
          {dayNumber !== undefined && (
            <div className="mt-auto pt-2 border-t border-border/40" onClick={(e) => e.stopPropagation()}>
              <SessionCompletionButton
                journeyId={journeyId}
                dayNumber={dayNumber}
                sessionType={sessionType}
                sessionIndex={sessionIndex}
                discipline={session.discipline || activeDiscipline}
                onComplete={() => {
                  window.dispatchEvent(new CustomEvent('session-completed', {
                    detail: { journeyId, dayNumber },
                  }));
                }}
              />
            </div>
          )}
          <p className="text-[10px] text-muted-foreground shrink-0">Tap to flip back</p>
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

  return (
    <div className="space-y-4 min-w-0">
      <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary shrink-0" />
        {title} ({sessions.length})
      </h3>
      <FlowCircuit label={label}>
        {sessions.map((session, idx) => (
          <SessionFlipCard
            key={idx}
            session={session}
            step={idx + 1}
            journeyId={journeyId}
            dayNumber={dayNumber}
            sessionType={sessionType}
            sessionIndex={idx}
            activeDiscipline={activeDiscipline}
          />
        ))}
      </FlowCircuit>
    </div>
  );
}
