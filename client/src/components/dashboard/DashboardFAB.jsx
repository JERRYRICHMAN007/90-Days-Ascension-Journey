import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getJourneyCardsConfig } from '../../utils/journeyTheme.js';
import { getCurrentDayNumber, getCurrentPhaseStatus } from '../../utils/dates.js';
import { getJourneyData } from '../../data/journeys/index.js';
import {
  collectDaySessionKeys,
  getJourneyCompletions,
} from '../../utils/progressTracking.js';

function findNextJourneyPath() {
  const phase = getCurrentPhaseStatus();
  const currentDay = getCurrentDayNumber();
  if (phase !== 'phase1' && phase !== 'phase2' || !currentDay) {
    return '/dashboard';
  }

  for (const { id, path } of getJourneyCardsConfig()) {
    try {
      const { weeks } = getJourneyData(id);
      const day = weeks
        .flatMap((w) => w.days || [])
        .find((d) => d.dayNumber === currentDay);
      if (!day) continue;
      const keys = collectDaySessionKeys(id, day);
      if (keys.length === 0) continue;
      const completions = getJourneyCompletions(id);
      const incomplete = keys.some((k) => !completions[k]?.completed);
      if (incomplete) return path;
    } catch {
      continue;
    }
  }

  return getJourneyCardsConfig()[0]?.path || '/dashboard';
}

export function DashboardFAB() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(findNextJourneyPath())}
      className="fixed bottom-24 right-6 z-30 hidden md:flex size-14 items-center justify-center rounded-full bg-[#00e478] text-[#003d1f] shadow-[0_0_10px_rgba(0,228,120,0.4)] transition-transform hover:scale-105 active:scale-95 md:bottom-10"
      aria-label="Start next session"
    >
      <Plus className="size-6 stroke-[2.5]" />
    </button>
  );
}
