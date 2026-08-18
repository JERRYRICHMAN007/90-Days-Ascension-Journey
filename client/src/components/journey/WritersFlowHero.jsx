import { PenTool, BookOpen, Target, RotateCcw } from 'lucide-react';
import { FlipCard3D } from '../ui/FlipCard3D';
import { JourneyDailyFlow, FlowCardFace, FlowCardBack } from './JourneyDailyFlow';

const WRITERS_ACCENT = '#f59e0b';

export function WritersFlowHero({
  learning,
  execution,
  theme,
  focusLabel = "Today's Writing",
}) {
  const cards = [];

  if (learning) {
    cards.push(
      <FlipCard3D
        key="learning"
        size="flow"
        className="w-full max-w-none"
        ariaLabel={`Learning: ${learning}`}
        front={
          <FlowCardFace
            icon={BookOpen}
            badge="Learning"
            accentColor={WRITERS_ACCENT}
            eyebrow={theme ? 'Theme' : undefined}
            title={learning}
            hint={
              <>
                <RotateCcw className="size-2.5" /> Tap for theme
              </>
            }
          />
        }
        back={
          <FlowCardBack eyebrow="Theme" accentColor={WRITERS_ACCENT}>
            <p className="line-clamp-6">{theme || 'No theme set for today'}</p>
          </FlowCardBack>
        }
      />
    );
  }

  if (execution) {
    cards.push(
      <FlipCard3D
        key="execution"
        size="flow"
        className="w-full max-w-none"
        ariaLabel={`Execution task: ${execution}`}
        front={
          <FlowCardFace
            icon={Target}
            badge="Execution"
            badgeColor="#ea580c"
            accentColor={WRITERS_ACCENT}
            title={execution.length > 90 ? `${execution.slice(0, 90)}…` : execution}
            hint={
              <>
                <RotateCcw className="size-2.5" /> Tap for full task
              </>
            }
          />
        }
        back={
          <FlowCardBack eyebrow="Today's Execution" accentColor={WRITERS_ACCENT}>
            <p>{execution}</p>
          </FlowCardBack>
        }
      />
    );
  }

  if (!cards.length) return null;

  return (
    <JourneyDailyFlow
      icon={PenTool}
      title={focusLabel}
      label="Writing flow · learn then execute"
      accentColor={WRITERS_ACCENT}
    >
      {cards}
    </JourneyDailyFlow>
  );
}
