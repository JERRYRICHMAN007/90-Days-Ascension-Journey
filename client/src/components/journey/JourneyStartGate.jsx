import { useRef } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, ArrowDown, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '../ui/button';

/**
 * Shown when the user has not started this journey yet.
 */
export function JourneyStartGate({ journeyTitle, accentColor, accentRgb, onSetup }) {
  const rgb = accentRgb || '110,231,183';
  const accent = accentColor || '#6ee7b7';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, rgba(${rgb},0.14) 0%, var(--bg-card) 45%, rgba(196,181,253,0.1) 100%)`,
        boxShadow: `0 0 0 1px rgba(${rgb},0.3), 0 20px 50px rgba(0,0,0,0.12)`,
      }}
    >
      <div
        className="pointer-events-none absolute -top-20 -right-20 size-48 rounded-full blur-3xl opacity-30"
        style={{ background: accent }}
        aria-hidden
      />

      <div
        className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl shadow-lg"
        style={{
          background: `linear-gradient(135deg, rgba(${rgb},0.35), rgba(${rgb},0.1))`,
          boxShadow: `0 0 24px rgba(${rgb},0.35)`,
        }}
      >
        <CalendarDays className="size-8" style={{ color: accent }} />
      </div>
      <h3 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-2">
        Press Start When You&apos;re Ready
      </h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6 max-w-sm mx-auto">
        {journeyTitle} is configured and waiting. Complete setup or press{' '}
        <strong className="text-[var(--text-primary)]">Start Journey</strong> in Overview when you&apos;re ready.
      </p>
      {onSetup && (
        <Button
          onClick={onSetup}
          className="rounded-full mb-4"
          style={{ background: accent, color: '#0a0a0a' }}
        >
          <Wand2 className="size-4 mr-2" />
          Personalize journey
        </Button>
      )}
      <div
        className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full border"
        style={{
          color: accent,
          borderColor: `rgba(${rgb},0.35)`,
          background: `rgba(${rgb},0.1)`,
        }}
      >
        <ArrowDown className="size-4 animate-bounce" />
        <Sparkles className="size-3.5" />
        <span>Progress begins only after you start</span>
      </div>
    </motion.div>
  );
}
