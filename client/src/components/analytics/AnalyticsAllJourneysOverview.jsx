import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AnalyticsOverviewCard } from './AnalyticsOverviewCard.jsx';
import { getAllJourneyTraces, JOURNEY_IDS } from '../../utils/tracing.js';

export function AnalyticsAllJourneysOverview() {
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

  void tick;
  const traces = getAllJourneyTraces();
  const journeyIds = traces.map((t) => t.journeyId).filter((id) => JOURNEY_IDS.includes(id));

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto min-w-0 w-full">
      {/* Header — Figma Frame 7 */}
      <div className="flex flex-col gap-[7px]">
        <p className="aether-eyebrow">FLOW STATE PERFORMANCE</p>
        <h1 className="text-[36px] sm:text-[48px] font-extrabold text-[var(--text-primary)] tracking-[-0.96px] leading-[1.1] pb-2">
          Mission Critical Stats
        </h1>
        <div className="w-24 h-1 rounded-full bg-[var(--neon-green-alt)]" />
      </div>

      {/* 5-card bento grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 pt-6"
      >
        {journeyIds.map((id, i) => (
          <AnalyticsOverviewCard key={id} journeyId={id} index={i} />
        ))}
      </motion.div>
    </div>
  );
}
