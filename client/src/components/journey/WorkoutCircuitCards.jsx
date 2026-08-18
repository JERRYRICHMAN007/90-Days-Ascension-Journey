import {
  ExternalLink,
  Play,
  Repeat,
  RotateCcw,
  Timer,
  Flame,
  Footprints,
  CircleDot,
} from 'lucide-react';
import { FlipCard3D } from '../ui/FlipCard3D';
import { FlowCircuit } from '../ui/FlowCircuit';

const GUIDE_ICONS = {
  plankSideRight: Timer,
  plankSideLeft: Timer,
  plankCenter: Timer,
  pushUps: Flame,
  crunches: CircleDot,
  burpees: Flame,
  lunges: Footprints,
  bicycles: CircleDot,
};

function parseExercise(name) {
  const secMatch = name.match(/^(\d+\s*sec)\s+(.+)$/i);
  if (secMatch) return { metric: secMatch[1], label: secMatch[2] };

  const repMatch = name.match(/^(\d+)\s+(.+)$/);
  if (repMatch) {
    const label = repMatch[2];
    const eachSide = /\beach side\b/i.test(label) || /—\s*Each Side/i.test(label);
    return {
      metric: eachSide ? `${repMatch[1]} each side` : `${repMatch[1]} reps`,
      label: label
        .replace(/\s*[—(]\s*each side\)?/i, '')
        .replace(/\s*—\s*Each Side/i, '')
        .trim(),
    };
  }

  return { metric: '', label: name };
}

function ExerciseFlipCard({ exercise, step, isActive, onHover }) {
  const { metric, label } = parseExercise(exercise.name);
  const guide = exercise.formGuide;

  return (
    <FlipCard3D
      size="fluid"
      isActive={isActive}
      ariaLabel={`${label}. Tap to view form guide.`}
      onMouseEnter={() => onHover?.(exercise.guideKey)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(exercise.guideKey)}
      onBlur={() => onHover?.(null)}
      onFlip={() => onHover?.(exercise.guideKey)}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary w-full max-w-none mx-0"
      front={
        <div
          className="w-full h-full rounded-xl p-4 flex flex-col items-center justify-center min-w-0 relative border transition-all duration-200 cursor-pointer text-center"
          style={{
            background: 'var(--bg-elevated)',
            borderColor: isActive ? 'var(--neon-green)' : 'var(--border-subtle)',
            boxShadow: isActive ? 'var(--neon-glow-green)' : 'none',
          }}
        >
          <span
            className="absolute top-3 left-3 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold tabular-nums"
            style={{
              color: 'var(--neon-green)',
              border: '1px solid var(--neon-green)',
              background: 'rgba(0,255,135,0.08)',
            }}
          >
            {step}
          </span>
          {metric && (
            <span className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] leading-none tabular-nums tracking-tight">
              {metric.split(' ')[0]}
            </span>
          )}
          {metric && metric.includes(' ') && (
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[1px] text-[var(--text-secondary)] mt-1.5">
              {metric.replace(/^\d+\s*/, '')}
            </span>
          )}
          <span className="text-sm font-semibold text-[var(--text-primary)] mt-2 leading-snug line-clamp-2 px-1">
            {label}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[1px] text-[var(--neon-green)] mt-auto pt-3 flex items-center gap-1">
            <RotateCcw className="w-3 h-3 shrink-0" />
            Tap for form
          </span>
        </div>
      }
      back={
        <div className="w-full h-full rounded-xl border p-4 flex flex-col items-center justify-center text-center gap-2 bg-[var(--bg-elevated)] border-[var(--neon-green)]">
          <p className="text-xs font-semibold text-white line-clamp-2">{label}</p>
          {guide?.url ? (
            <a
              href={guide.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-black transition-colors"
              style={{ background: 'var(--neon-green)' }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Form guide
              {guide.time && <span className="opacity-80">· {guide.time}</span>}
            </a>
          ) : (
            <p className="text-xs text-[var(--text-secondary)]">Focus on controlled reps</p>
          )}
          <p className="text-[10px] text-[var(--text-muted)]">Tap to flip back</p>
        </div>
      }
    />
  );
}

export function WorkoutCircuitCards({
  workout,
  workoutLink,
  activeGuideKey = null,
  onExerciseHover,
  compactHeader = false,
  hideHeader = false,
}) {
  if (!workout || typeof workout !== 'object') return null;

  const exercises = workout.exercises ?? [];
  const isRestDay = exercises.length === 0;

  if (isRestDay) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-border/60 bg-muted/20 p-6 text-center">
        <p className="text-sm font-medium text-foreground">{workout.name}</p>
        <p className="text-xs text-muted-foreground mt-1">Light stretching · hydrate · recover</p>
      </div>
    );
  }

  return (
    <div className={compactHeader ? 'space-y-4 min-w-0' : 'mt-4 space-y-4 min-w-0'}>
      {!hideHeader && (
      <div className="flex flex-wrap items-center justify-between gap-3">
        {!compactHeader && (
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">{workout.name}</p>
            {workout.focus && (
              <p className="text-xs text-muted-foreground mt-0.5">{workout.focus}</p>
            )}
          </div>
        )}
        {compactHeader && workout.name && (
          <p className="text-sm font-medium text-muted-foreground">{workout.name}</p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {workout.rounds > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/25 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wide">
              <Repeat className="w-3.5 h-3.5" />
              {workout.rounds} rounds
            </span>
          )}
          {workoutLink && (
            <a
              href={workoutLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              Guided video
            </a>
          )}
        </div>
      </div>
      )}

      <FlowCircuit
        label="Circuit flow · complete in order"
        accentColor="var(--neon-green)"
        fitInView
        footer={
          workout.rounds > 1 ? (
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Repeat className="w-3.5 h-3.5 text-primary" />
              <span>
                Loop back to step 1 after step {exercises.length} — repeat{' '}
                <strong className="text-foreground">{workout.rounds}×</strong> total
              </span>
            </div>
          ) : null
        }
      >
        {exercises.map((exercise, idx) => (
          <ExerciseFlipCard
            key={idx}
            exercise={exercise}
            step={idx + 1}
            isActive={activeGuideKey === exercise.guideKey}
            onHover={onExerciseHover}
          />
        ))}
      </FlowCircuit>
    </div>
  );
}
