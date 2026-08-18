import { useMemo } from 'react';
import Model from 'react-body-highlighter';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';

const BODY_ACCENT = '#00ff87';

/**
 * When hovering an exercise card, highlight ONLY that exercise's muscles.
 * When idle, show all muscles worked in today's circuit (softer).
 */
function buildMuscleData(exercises, activeGuideKey) {
  if (!exercises?.length) return [];

  if (activeGuideKey) {
    const active = exercises.find((e) => e.guideKey === activeGuideKey);
    if (!active?.muscles?.length) return [];
    return [
      {
        name: active.name || active.label || 'Exercise',
        muscles: active.muscles,
        frequency: 2,
      },
    ];
  }

  // Idle: union of today's muscles at base intensity
  return exercises
    .filter((ex) => ex.muscles?.length)
    .map((ex) => ({
      name: ex.name || ex.label || 'Exercise',
      muscles: ex.muscles,
      frequency: 1,
    }));
}

export function MuscleMapPanel({ exercises = [], activeGuideKey = null, className = '' }) {
  const data = useMemo(
    () => buildMuscleData(exercises, activeGuideKey),
    [exercises, activeGuideKey]
  );

  const activeExercise = useMemo(() => {
    if (!activeGuideKey) return null;
    return exercises.find((e) => e.guideKey === activeGuideKey) || null;
  }, [exercises, activeGuideKey]);

  const tagMuscles = useMemo(() => {
    if (activeExercise?.muscles?.length) {
      return activeExercise.muscles;
    }
    const set = new Set();
    exercises.forEach((ex) => {
      (ex.muscles ?? []).forEach((m) => set.add(m));
    });
    return [...set];
  }, [exercises, activeExercise]);

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
        <p className="aether-label">
          {activeExercise ? 'Muscles for this move' : 'Muscles worked today'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeGuideKey || 'all'}
          initial={{ opacity: 0.55, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.55, scale: 0.97 }}
          transition={{ duration: 0.22 }}
          className="w-full flex justify-center overflow-hidden"
        >
          <Model
            data={data}
            type="anterior"
            bodyColor="#242b2d"
            highlightedColors={
              activeGuideKey
                ? [BODY_ACCENT, '#5dffb0']
                : ['#00ba62', BODY_ACCENT]
            }
            style={{ width: '100%', maxWidth: '220px', padding: '0.5rem' }}
            svgStyle={{ width: '100%', height: 'auto' }}
          />
        </motion.div>
      </AnimatePresence>

      {activeExercise && (
        <p className="text-[11px] font-semibold text-center mt-2" style={{ color: BODY_ACCENT }}>
          {activeExercise.name || activeExercise.label}
        </p>
      )}

      {tagMuscles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center mt-3 w-full">
          {tagMuscles.slice(0, 8).map((m) => (
            <span
              key={m}
              className="text-[10px] px-2 py-0.5 rounded-full capitalize font-semibold transition-colors"
              style={{
                color: BODY_ACCENT,
                background: activeGuideKey ? 'rgba(0,255,135,0.16)' : 'rgba(0,255,135,0.1)',
                border: `1px solid ${activeGuideKey ? 'rgba(0,255,135,0.45)' : 'rgba(0,255,135,0.25)'}`,
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
