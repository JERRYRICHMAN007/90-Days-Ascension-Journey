import { useMemo } from 'react';
import Model from 'react-body-highlighter';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

function buildMuscleData(exercises, activeGuideKey) {
  const muscleFreq = new Map();

  exercises.forEach((ex) => {
    const muscles = ex.muscles ?? [];
    const boost = ex.guideKey === activeGuideKey ? 2 : 1;
    muscles.forEach((m) => {
      muscleFreq.set(m, (muscleFreq.get(m) ?? 0) + boost);
    });
  });

  return exercises.map((ex) => ({
    name: ex.name,
    muscles: ex.muscles ?? [],
    frequency: ex.guideKey === activeGuideKey ? 2 : 1,
  }));
}

export function MuscleMapPanel({ exercises = [], activeGuideKey = null, className = '' }) {
  const data = useMemo(
    () => buildMuscleData(exercises, activeGuideKey),
    [exercises, activeGuideKey]
  );

  const activeMuscles = useMemo(() => {
    const set = new Set();
    exercises.forEach((ex) => {
      (ex.muscles ?? []).forEach((m) => set.add(m));
    });
    if (activeGuideKey) {
      const active = exercises.find((e) => e.guideKey === activeGuideKey);
      return active?.muscles ?? [];
    }
    return [...set];
  }, [exercises, activeGuideKey]);

  if (!exercises.length) {
    return (
      <div className={`glass-panel rounded-xl p-6 text-center ${className}`}>
        <p className="text-sm text-muted-foreground">Rest day — recovery mode</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`glass-panel rounded-xl p-3 sm:p-4 flex flex-col items-center ${className}`}
    >
      <div className="flex items-center gap-2 w-full mb-2">
        <Activity className="w-4 h-4 text-primary shrink-0" />
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Muscles worked today
        </p>
      </div>

      <div className="w-full flex justify-center overflow-hidden">
        <Model
          data={data}
          type="anterior"
          bodyColor="hsl(var(--muted))"
          highlightedColors={['hsl(142, 76%, 45%)', 'hsl(142, 76%, 58%)']}
          style={{ width: '100%', maxWidth: '220px', padding: '0.5rem' }}
          svgStyle={{ width: '100%', height: 'auto' }}
        />
      </div>

      {activeMuscles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center mt-3 w-full">
          {activeMuscles.slice(0, 8).map((m) => (
            <span
              key={m}
              className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25 capitalize"
            >
              {m.replace(/-/g, ' ')}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
