import { useMemo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getJourneyCardsConfig } from "../utils/journeyTheme.js";
import {
  getCurrentPhaseStatus,
  getCurrentDayNumber,
} from "../utils/dates";
import { cleanInvalidProgress, resetAllProgress } from "../utils/progressTracking";
import { STORAGE_KEYS } from "../utils/storageKeys.js";
import { getJourneyData } from "../data/journeys/index.js";
import { DashboardMasteryCard } from "../components/dashboard/DashboardMasteryCard";
import { DashboardMobileCard } from "../components/dashboard/DashboardMobileCard";
import { DashboardJourneyRow } from "../components/dashboard/DashboardJourneyRow";
import { DashboardFAB } from "../components/dashboard/DashboardFAB";

const journeyCards = getJourneyCardsConfig();

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

  useEffect(() => {
    const handleProgressUpdate = () => setProgressTick((t) => t + 1);
    window.addEventListener('progress-updated', handleProgressUpdate);
    window.addEventListener('session-completed', handleProgressUpdate);
    return () => {
      window.removeEventListener('progress-updated', handleProgressUpdate);
      window.removeEventListener('session-completed', handleProgressUpdate);
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
    const currentDay = getCurrentDayNumber();
    const phase = getCurrentPhaseStatus();
    const forceReset = localStorage.getItem('force_reset_all') === 'true';
    const alreadyReset = localStorage.getItem('day0_reset_completed') === 'true';

    if ((currentDay === 0 || phase === 'preparation' || forceReset) && (!alreadyReset || forceReset)) {
      const storedXp = localStorage.getItem(STORAGE_KEYS.XP);
      const storedCompletions = localStorage.getItem('sessionCompletions');
      const shouldReset =
        forceReset ||
        hasMeaningfulXp(storedXp) ||
        hasMeaningfulCompletions(storedCompletions);

      if (shouldReset) {
        resetAllProgress();
        localStorage.setItem('day0_reset_completed', 'true');
        localStorage.removeItem('force_reset_all');
      }
    } else if (phase !== 'preparation' && currentDay !== 0) {
      localStorage.removeItem('day0_reset_completed');
      localStorage.removeItem('force_reset_all');
    }

    journeyCards.forEach(({ id }) => {
      try {
        const journeyData = getJourneyData(id);
        if (journeyData?.weeks) {
          cleanInvalidProgress(id, journeyData.weeks);
        }
      } catch (error) {
        console.error(`Error cleaning progress for ${id}:`, error);
      }
    });
  }, []);

  const getUserName = () => {
    if (user?.name) return user.name.split(' ')[0];
    return 'Forge Master';
  };

  const { todayDate, currentPhase, currentDay, subtitle } = useMemo(() => {
    const today = new Date();
    const formattedDate = today
      .toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
      .toUpperCase();

    const phase = getCurrentPhaseStatus();
    const dayNumber = getCurrentDayNumber();

    let sub = 'Your transformation awaits';
    if ((phase === 'phase1' || phase === 'phase2') && dayNumber) {
      sub = `Day ${dayNumber} of 90 — Keep forging.`;
    } else if (phase === 'preparation') {
      sub = 'Prepare for your transformation';
    } else if (phase === 'after') {
      sub = 'Journey complete — you forged it.';
    }

    return {
      todayDate: formattedDate,
      currentPhase: phase,
      currentDay: dayNumber,
      subtitle: sub,
    };
  }, [progressTick]);

  const showLiveSession =
    (currentPhase === 'phase1' || currentPhase === 'phase2') && currentDay != null;

  return (
    <>
      {/* ── Mobile dashboard — Figma Frame 1:323 ── */}
      <div className="flex flex-col gap-8 w-full md:hidden">
        <div className="flex flex-col gap-1">
          <h1 className="text-[36px] font-extrabold leading-[39.6px] tracking-[-0.72px] text-[#dce4e5]">
            Welcome back.
          </h1>
          <p className="text-[18px] leading-[28.8px] text-[#00daf3] opacity-90">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {journeyCards.map((journey, index) => (
            <DashboardMobileCard
              key={journey.id}
              journeyId={journey.id}
              index={index}
              tick={progressTick}
            />
          ))}
        </div>
      </div>

      {/* ── Desktop dashboard — Figma Frame 1:2 ── */}
      <div className="hidden md:flex flex-col gap-12 w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-[32px] sm:text-[48px] font-extrabold leading-tight tracking-[-0.96px] text-[#dce4e5]">
              Welcome back, {getUserName()}.
            </h1>
            <p className="mt-1 text-[16px] sm:text-[18px] font-medium leading-[28.8px] text-[#00e478]">
              {subtitle}
            </p>
          </div>

          {showLiveSession && (
            <div className="shrink-0 text-left sm:text-right">
              <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-[#bac9cc]">
                {todayDate}
              </p>
              <p className="mt-1 flex items-center gap-2 text-[12px] font-mono uppercase tracking-[-0.6px] text-[#bac9cc] sm:justify-end">
                <span className="size-2 rounded-full bg-[#00e478]" />
                LIVE SESSION READY
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full">
          {journeyCards.map((journey, index) => (
            <DashboardMasteryCard
              key={journey.id}
              journeyId={journey.id}
              index={index}
              tick={progressTick}
            />
          ))}
        </div>

        <section className="flex flex-col gap-8 pt-4">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[24px] font-bold tracking-[-0.48px] text-[#dce4e5]">
              Your Journeys
            </h2>
            <Link
              to="/analytics"
              className="text-[12px] font-bold uppercase tracking-[1.2px] text-[#00daf3] hover:opacity-80 transition-opacity shrink-0"
            >
              View Roadmap
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {journeyCards.map((journey, index) => (
              <DashboardJourneyRow
                key={journey.id}
                journeyId={journey.id}
                index={index}
                tick={progressTick}
              />
            ))}
          </div>
        </section>
      </div>

      <DashboardFAB />
    </>
  );
}
