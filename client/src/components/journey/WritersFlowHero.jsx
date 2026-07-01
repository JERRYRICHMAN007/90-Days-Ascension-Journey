import { PenTool, BookOpen, RotateCcw, Target } from 'lucide-react';
import { Card } from '../ui/card';
import { FlipCard3D } from '../ui/FlipCard3D';
import { FlowCircuit } from '../ui/FlowCircuit';

export function WritersFlowHero({
  learning,
  execution,
  theme,
  focusLabel = "Today's Writing",
}) {
  const cards = [];

  if (learning) {
    cards.push({
      key: 'learning',
      front: (
        <div className="w-full h-full border border-border/60 bg-gradient-to-br from-muted/80 to-muted/40 p-3 sm:p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1">
            <BookOpen className="w-4 h-4 text-primary shrink-0" />
            <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary rounded font-medium">Learning</span>
          </div>
          <div className="flex-1 flex flex-col justify-center min-h-0 py-1">
            {theme && (
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Theme</p>
            )}
            <p className="text-xs sm:text-sm font-medium text-foreground leading-snug line-clamp-4">
              {learning}
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            Tap for theme
          </p>
        </div>
      ),
      back: (
        <div className="w-full h-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 p-3 sm:p-4 flex flex-col items-center justify-center text-center gap-2">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">Theme</p>
          <p className="text-xs text-foreground line-clamp-5">{theme || 'No theme set for today'}</p>
          <p className="text-[10px] text-muted-foreground">Tap to flip back</p>
        </div>
      ),
      ariaLabel: `Learning: ${learning}`,
    });
  }

  if (execution) {
    cards.push({
      key: 'execution',
      front: (
        <div className="w-full h-full border border-border/60 bg-gradient-to-br from-muted/80 to-muted/40 p-3 sm:p-4 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1">
            <Target className="w-4 h-4 text-primary shrink-0" />
            <span className="text-[10px] px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded font-medium">Execution</span>
          </div>
          <div className="flex-1 flex flex-col justify-center min-h-0 py-1">
            <p className="text-xs sm:text-sm font-medium text-foreground leading-snug line-clamp-4">
              {execution.length > 80 ? `${execution.slice(0, 80)}…` : execution}
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            Tap for full task
          </p>
        </div>
      ),
      back: (
        <div className="w-full h-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 p-3 sm:p-4 flex flex-col items-center justify-center text-center gap-2 overflow-y-auto">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">Today's Execution</p>
          <p className="text-xs text-foreground leading-relaxed">{execution}</p>
          <p className="text-[10px] text-muted-foreground shrink-0">Tap to flip back</p>
        </div>
      ),
      ariaLabel: `Execution task: ${execution}`,
      size: 'wide',
    });
  }

  if (!cards.length) return null;

  return (
    <Card className="p-4 sm:p-6 border border-border/50 glass-glow overflow-hidden min-w-0">
      <div className="flex items-center gap-2 mb-4">
        <PenTool className="w-5 h-5 text-primary shrink-0" />
        <h3 className="text-base sm:text-lg font-semibold">{focusLabel}</h3>
      </div>

      <FlowCircuit label="Writing flow · learn then execute">
        {cards.map((card, idx) => (
          <FlipCard3D
            key={card.key}
            size={card.size || 'md'}
            ariaLabel={card.ariaLabel}
            front={card.front}
            back={card.back}
          />
        ))}
      </FlowCircuit>
    </Card>
  );
}
