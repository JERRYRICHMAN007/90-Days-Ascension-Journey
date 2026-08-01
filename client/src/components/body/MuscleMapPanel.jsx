import { useMemo } from 'react';
import Model from 'react-body-highlighter';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const BODY_ACCENT = '#00ff87';

function buildMuscleData(exercises, activeGuideKey) {
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
      <div
        className={`rounded-xl border p-5 text-center ${className}`}
        style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
      >
        <p className="text-sm text-[var(--text-secondary)]">Rest day — recovery mode</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl border p-4 flex flex-col items-center ${className}`}
      style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center gap-2 w-full mb-3">
        <Activity className="w-4 h-4 shrink-0" style={{ color: BODY_ACCENT }} />
        <p className="aether-label">Muscles worked today</p>
      </div>

      <div className="w-full flex justify-center overflow-hidden">
        <Model
          data={data}
          type="anterior"
          bodyColor="#242b2d"
          highlightedColors={[BODY_ACCENT, '#00ba62']}
          style={{ width: '100%', maxWidth: '220px', padding: '0.5rem' }}
          svgStyle={{ width: '100%', height: 'auto' }}
        />
      </div>

      {activeMuscles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center mt-3 w-full">
          {activeMuscles.slice(0, 8).map((m) => (
            <span
              key={m}
              className="text-[10px] px-2 py-0.5 rounded-full capitalize font-semibold"
              style={{
                color: BODY_ACCENT,
                background: 'rgba(0,255,135,0.1)',
                border: '1px solid rgba(0,255,135,0.25)',
              }}
            >
              {m.replace(/-/g, ' ')}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
