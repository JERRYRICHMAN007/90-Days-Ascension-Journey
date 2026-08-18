import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, Bell, X } from 'lucide-react';
import { ModalPortal } from '../ui/ModalPortal.jsx';
import {
  getIncompletePastAcrossJourneys,
  getOldestIncompleteCatchUp,
  isIncompleteCatchUpSnoozed,
  snoozeIncompleteCatchUp,
} from '../../utils/incompleteDays.js';

function useIncompleteCatchUp() {
  const [rows, setRows] = useState(() => getIncompletePastAcrossJourneys());
  const [modalOpen, setModalOpen] = useState(false);

  const refresh = useCallback(() => {
    const next = getIncompletePastAcrossJourneys();
    setRows(next);
    if (next.length > 0 && !isIncompleteCatchUpSnoozed()) {
      setModalOpen(true);
    }
    if (next.length === 0) setModalOpen(false);
    window.dispatchEvent(new CustomEvent('notifications-updated'));
  }, []);

  useEffect(() => {
    refresh();
    const onProgress = () => refresh();
    window.addEventListener('session-completed', onProgress);
    window.addEventListener('progress-updated', onProgress);
    window.addEventListener('journey-start-updated', onProgress);
    window.addEventListener('journey-registry-updated', onProgress);
    const interval = window.setInterval(refresh, 60_000);
    return () => {
      window.removeEventListener('session-completed', onProgress);
      window.removeEventListener('progress-updated', onProgress);
      window.removeEventListener('journey-start-updated', onProgress);
      window.removeEventListener('journey-registry-updated', onProgress);
      window.clearInterval(interval);
    };
  }, [refresh]);

  const total = rows.reduce((sum, r) => sum + r.incomplete.length, 0);
  const catchUp = getOldestIncompleteCatchUp();

  return { rows, total, catchUp, modalOpen, setModalOpen, refresh };
}

export function IncompleteDaysGuard() {
  const navigate = useNavigate();
  const { rows, total, catchUp, modalOpen, setModalOpen } = useIncompleteCatchUp();

  if (!total || !catchUp) return null;

  const goCatchUp = () => {
    setModalOpen(false);
    snoozeIncompleteCatchUp(30 * 60 * 1000);
    navigate(catchUp.href);
  };

  const remindLater = () => {
    snoozeIncompleteCatchUp();
    setModalOpen(false);
  };

  return (
    <>
      {/* Persistent banner */}
      <div className="sticky top-0 z-40 px-3 pt-2 md:px-6 lg:px-12">
        <div
          className="mx-auto max-w-5xl flex flex-wrap items-center gap-3 rounded-xl border px-3 py-2.5 shadow-lg"
          style={{
            background: 'color-mix(in srgb, #f59e0b 12%, var(--bg-card))',
            borderColor: 'color-mix(in srgb, #f59e0b 45%, var(--border-subtle))',
          }}
        >
          <Bell className="size-4 shrink-0 text-amber-400" />
          <p className="text-sm text-[var(--text-primary)] flex-1 min-w-0">
            <span className="font-semibold text-amber-300">
              {total} incomplete day{total === 1 ? '' : 's'}
            </span>
            {' — '}
            finish Day {catchUp.dayNumber} ({catchUp.title}) before today drifts.
          </p>
          <button
            type="button"
            onClick={goCatchUp}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-black shrink-0"
            style={{ background: '#f59e0b' }}
          >
            Complete now
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Blocking attention modal — portaled to body for true viewport centering */}
      <ModalPortal
        open={modalOpen}
        onClose={remindLater}
        contentClassName="sm:max-w-[420px]"
        ariaLabel="Catch up required"
      >
        <motion.div
          role="document"
          aria-labelledby="incomplete-days-title"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          className="w-full rounded-2xl border p-5 shadow-2xl"
          style={{
            background: 'var(--bg-card)',
            borderColor: 'color-mix(in srgb, #f59e0b 40%, var(--border-subtle))',
          }}
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                <AlertTriangle className="size-5" />
              </span>
              <div>
                <h2
                  id="incomplete-days-title"
                  className="text-base font-bold text-[var(--text-primary)]"
                >
                  Catch up required
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Earlier days still need to be marked complete
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={remindLater}
              className="p-1.5 rounded-full hover:bg-[var(--surface-hover)] text-[var(--text-muted)]"
              aria-label="Remind me later"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-2 mb-5 max-h-[200px] overflow-y-auto">
            {rows.map((row) =>
              row.incomplete.slice(0, 4).map((item) => (
                <div
                  key={`${row.journeyId}-${item.dayNumber}`}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-2.5"
                >
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {row.icon ? `${row.icon} ` : ''}
                    Day {item.dayNumber} · {row.title}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-1">
                    {item.label}
                  </p>
                </div>
              ))
            )}
            {total > 4 && (
              <p className="text-xs text-[var(--text-muted)] text-center pt-1">
                +{total - 4} more incomplete day{total - 4 === 1 ? '' : 's'}
              </p>
            )}
          </div>

          <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
            Mark each unfinished day complete after you finish its work. This keeps your
            progress honest and unlocks a clean streak.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={goCatchUp}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-black"
              style={{ background: '#f59e0b' }}
            >
              Go finish Day {catchUp.dayNumber}
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={remindLater}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            >
              Remind me later
            </button>
          </div>
        </motion.div>
      </ModalPortal>
    </>
  );
}
