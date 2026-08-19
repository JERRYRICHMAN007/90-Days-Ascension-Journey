import { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { cleanInvalidProgress, resetAllProgress } from "../utils/progressTracking";
import { STORAGE_KEYS } from "../utils/storageKeys.js";
import { getJourneyData } from "../data/journeys/index.js";
import { getContentTemplateId, getRegistryJourneys } from "../utils/journeyRegistry.js";
import { getJourneyState, getJourneyTimeline } from "../utils/journeyPlanning.js";
import { DashboardMasteryCard } from "../components/dashboard/DashboardMasteryCard";
import { DashboardFAB } from "../components/dashboard/DashboardFAB";

function hasMeaningfulXp(storedXp) {
  if (!storedXp) return false;
  try {
    const xpData = JSON.parse(storedXp);
    if ((xpData.global || 0) > 0) return true;
    return Object.values(xpData.domains || {}).some((v) => Number(v) > 0);
  } catch {
    return true;
  }
}

function hasMeaningfulCompletions(stored) {
  if (!stored || stored === '{}' || stored === 'null') return false;
  try {
    const parsed = JSON.parse(stored);
    return Object.values(parsed).some((entry) => entry?.completed === true);
  } catch {
    return true;
  }
}

export function HomePage() {
  const { user } = useAuth();
  const [progressTick, setProgressTick] = useState(0);
  const [journeys, setJourneys] = useState(() => getRegistryJourneys());

  useEffect(() => {
    const refresh = () => {
      setProgressTick((t) => t + 1);
      setJourneys(getRegistryJourneys());
    };
    window.addEventListener('progress-updated', refresh);
    window.addEventListener('session-completed', refresh);
    window.addEventListener('journey-start-updated', refresh);
    window.addEventListener('journey-registry-updated', refresh);
    return () => {
      window.removeEventListener('progress-updated', refresh);
      window.removeEventListener('session-completed', refresh);
      window.removeEventListener('journey-start-updated', refresh);
      window.removeEventListener('journey-registry-updated', refresh);
    };
  }, []);

  useEffect(() => {
    window.resetAllProgress = () => {
      localStorage.setItem('force_reset_all', 'true');
      resetAllProgress();
      setTimeout(() => window.location.reload(), 500);
    };
    return () => {
      delete window.resetAllProgress;
    };
  }, []);

  useEffect(() => {
    journeys.forEach((entry) => {
      try {
        const templateId = getContentTemplateId(entry.id);
        const journeyData = getJourneyData(templateId);
        if (journeyData?.weeks) {
          cleanInvalidProgress(entry.id, journeyData.weeks);
        }
      } catch (error) {
        console.error(`Error cleaning progress for ${entry.id}:`, error);
      }
    });
  }, [journeys]);

  const getUserName = () => {
    if (user?.name) return user.name.split(' ')[0];
    return null;
  };

  const subtitle = useMemo(() => {
    void progressTick;
    const active = journeys.filter((j) => getJourneyState(j.id) === 'active');
    if (active.length === 0) {
      return 'Create a journey or open one to begin your arc.';
    }
    if (active.length === 1) {
      const t = getJourneyTimeline(active[0].id);
      if (t.currentDay) return `${active[0].title} · Day ${t.currentDay} of ${t.totalDays}`;
    }
    return `${active.length} active journey${active.length === 1 ? '' : 's'} in progress`;
  }, [journeys, progressTick]);

  const name = getUserName();

  if (journeys.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 px-6 max-w-md mx-auto">
          <div className="text-5xl mb-6" aria-hidden>✨</div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3">
            Your transformation begins with a single journey.
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed">
            Pick a path, set your days and times, and start when you&apos;re ready.
          </p>
          <Link
            to="/dashboard/create-journey"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--neon-green)] px-8 py-4 text-base font-bold text-[#003d1f] hover:opacity-90 transition-opacity"
          >
            <Plus className="size-5" />
            Create a journey
          </Link>
        </div>
        <DashboardFAB />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {name ? `Welcome back, ${name}.` : 'Welcome back.'}
            </h1>
            <p className="text-base text-[var(--text-secondary)]">{subtitle}</p>
          </div>
          <Link
            to="/dashboard/create-journey"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[var(--neon-green)] px-4 py-2.5 text-sm font-bold text-[#003d1f] hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus className="size-4" />
            New journey
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full">
          {journeys.map((entry, index) => (
            <DashboardMasteryCard key={entry.id} entry={entry} index={index} tick={progressTick} />
          ))}
        </div>
      </div>

      <DashboardFAB />
    </>
  );
}