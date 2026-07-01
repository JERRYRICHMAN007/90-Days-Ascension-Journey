import { BookOpen, RotateCcw, ExternalLink } from 'lucide-react';
import { Card } from '../ui/card';
import { FlipCard3D } from '../ui/FlipCard3D';
import { FlowCircuit } from '../ui/FlowCircuit';

function ReadingSessionCard({ session, step }) {
  const bibleData = session.type === 'Bible Reading' && typeof session.material === 'object'
    ? session.material
    : null;
  const materialText = bibleData ? bibleData.text : session.material;
  const chapterCount = session.type === 'Bible Reading' ? 1 : null;

  return (
    <FlipCard3D
      size="wide"
      ariaLabel={`${session.type} at ${session.time}. ${materialText}`}
      front={
        <div className="w-full h-full border border-border/60 bg-gradient-to-br from-muted/80 to-muted/40 p-3 sm:p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary tabular-nums">
              {step}
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary rounded font-medium truncate max-w-[90px]">
              {session.type}
            </span>
          </div>
          <div className="flex-1 flex flex-col justify-center min-h-0 py-1">
            <p className="text-xs font-mono font-semibold text-primary">{session.time}</p>
            <p className="text-xs sm:text-sm font-medium text-foreground leading-snug line-clamp-3 mt-1">
              {materialText}
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            Tap for details
          </p>
        </div>
      }
      back={
        <div className="w-full h-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 p-3 sm:p-4 flex flex-col items-center justify-center text-center gap-2">
          <p className="text-xs font-semibold text-foreground line-clamp-2">{materialText}</p>
          {bibleData?.link && (
            <a
              href={bibleData.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Read Chapter
            </a>
          )}
          {chapterCount && (
            <p className="text-[10px] text-primary font-medium">
              {chapterCount} chapter · 15 min
            </p>
          )}
          {session.focus && (
            <p className="text-[10px] text-muted-foreground line-clamp-2">Focus: {session.focus}</p>
          )}
          <p className="text-[10px] text-muted-foreground">Tap to flip back</p>
        </div>
      }
    />
  );
}

export function ReadingFlowHero({
  dailyLearning,
  readingSessions = [],
  focusLabel = "Today's Reading",
}) {
  if (!readingSessions?.length) return null;

  return (
    <Card className="p-4 sm:p-6 border border-border/50 glass-glow overflow-hidden min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="w-5 h-5 text-primary shrink-0" />
        <h3 className="text-base sm:text-lg font-semibold">{focusLabel}</h3>
      </div>

      {dailyLearning?.title && (
        <div className="mb-4">
          <p className="text-lg sm:text-xl font-bold text-foreground">{dailyLearning.title}</p>
          {dailyLearning.description && (
            <p className="text-sm text-muted-foreground mt-1">{dailyLearning.description}</p>
          )}
        </div>
      )}

      <FlowCircuit label="Reading sessions · complete in order">
        {readingSessions.map((session, idx) => (
          <ReadingSessionCard key={idx} session={session} step={idx + 1} />
        ))}
      </FlowCircuit>
    </Card>
  );
}
