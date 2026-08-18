import { useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, Bell, CheckCircle2, CheckCheck, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRegistryJourneys } from '../../utils/journeyRegistry.js';
import { getJourneyState, getJourneyTimeline } from '../../utils/journeyPlanning.js';
import { cn } from '../../lib/utils';
import {
  buildDashboardNotifications,
  getReadNotificationIds,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../utils/journeyNotifications.js';

export function DashboardCalendarPanel({ open, onClose }) {
  const journeys = useMemo(() => {
    return getRegistryJourneys()
      .filter((j) => !j.isDemo)
      .map((j) => ({
        ...j,
        state: getJourneyState(j.id),
        timeline: getJourneyTimeline(j.id),
      }));
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close calendar"
          />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="fixed top-[4.5rem] right-4 md:right-12 z-50 w-[min(100vw-2rem,380px)] rounded-2xl border shadow-xl overflow-hidden"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-[var(--neon-cyan-alt)]" />
                <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">Journey calendar</h3>
              </div>
              <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-[var(--surface-hover)]">
                <X className="size-4" />
              </button>
            </div>
            <div className="max-h-[360px] overflow-y-auto p-3 space-y-2">
              {journeys.length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)] p-3 text-center">No journeys yet.</p>
              ) : (
                journeys.map((j) => (
                  <div key={j.id} className="rounded-xl border border-[var(--border-subtle)] p-3 bg-[var(--bg-primary)]">
                    <p className="font-medium text-sm text-[var(--text-primary)]">{j.icon} {j.title}</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      {j.state === 'active' && j.timeline.currentDay != null
                        ? `Day ${j.timeline.currentDay} · ${j.timeline.startLabel} → ${j.timeline.endLabel}`
                        : j.state === 'not_started' && j.timeline.configured
                          ? `Ready · starts ${j.timeline.startLabel}`
                          : 'Not scheduled'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function DashboardNotificationsPanel({ open, onClose }) {
  const navigate = useNavigate();
  const [readIds, setReadIds] = useState(() => getReadNotificationIds());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setReadIds(getReadNotificationIds());
      setTick((t) => t + 1);
    };
    window.addEventListener('notifications-updated', refresh);
    window.addEventListener('journey-start-updated', refresh);
    window.addEventListener('journey-registry-updated', refresh);
    window.addEventListener('session-completed', refresh);
    window.addEventListener('progress-updated', refresh);
    return () => {
      window.removeEventListener('notifications-updated', refresh);
      window.removeEventListener('journey-start-updated', refresh);
      window.removeEventListener('journey-registry-updated', refresh);
      window.removeEventListener('session-completed', refresh);
      window.removeEventListener('progress-updated', refresh);
    };
  }, []);

  useEffect(() => {
    if (open) setReadIds(getReadNotificationIds());
  }, [open]);

  const items = useMemo(() => buildDashboardNotifications(), [open, tick]);
  const readSet = useMemo(() => new Set(readIds), [readIds]);

  const unreadItems = items.filter((item) => item.type !== 'empty' && !readSet.has(item.id));
  const unreadCount = unreadItems.length;

  const handleMarkRead = useCallback((id) => {
    markNotificationRead(id);
    setReadIds(getReadNotificationIds());
  }, []);

  const handleMarkAllRead = useCallback(() => {
    markAllNotificationsRead(unreadItems.map((i) => i.id));
    setReadIds(getReadNotificationIds());
  }, [unreadItems]);

  const handleOpenItem = useCallback(
    (item) => {
      if (item.href) {
        onClose?.();
        navigate(item.href);
      }
    },
    [navigate, onClose]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close notifications"
          />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="fixed top-[4.5rem] right-4 md:right-12 z-50 w-[min(100vw-2rem,380px)] rounded-2xl border shadow-xl overflow-hidden"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 min-w-0">
                <Bell className="size-4 text-[var(--neon-green)] shrink-0" />
                <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--neon-green)]/15 text-[var(--neon-green)]">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full text-[var(--neon-green)] hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <CheckCheck className="size-3" />
                    Mark all read
                  </button>
                )}
                <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-[var(--surface-hover)]">
                  <X className="size-4" />
                </button>
              </div>
            </div>
            <div className="max-h-[360px] overflow-y-auto p-3 space-y-2">
              {items.map((item) => {
                const isAction = item.type === 'action';
                const isRead = (!isAction && readSet.has(item.id)) || item.type === 'empty';
                const canMarkRead = item.type !== 'empty' && !isAction;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      'rounded-xl border p-3 flex gap-3 transition-opacity',
                      isAction
                        ? 'border-amber-500/40 bg-amber-500/10'
                        : isRead
                          ? 'border-[var(--border-subtle)] bg-[var(--bg-primary)]/60 opacity-70'
                          : 'border-[var(--neon-green)]/25 bg-[var(--bg-primary)]'
                    )}
                  >
                    {isAction ? (
                      <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-400" />
                    ) : (
                      <CheckCircle2
                        className={cn(
                          'size-4 shrink-0 mt-0.5',
                          isRead ? 'text-[var(--text-muted)]' : 'text-[var(--neon-green)]'
                        )}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          isRead ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'
                        )}
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{item.body}</p>
                      {item.href && (
                        <button
                          type="button"
                          onClick={() => handleOpenItem(item)}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200"
                        >
                          Go complete it
                          <ArrowRight className="size-3" />
                        </button>
                      )}
                    </div>
                    {canMarkRead && !isRead && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(item.id)}
                        className="shrink-0 self-start text-[10px] font-semibold px-2 py-1 rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--neon-green)] hover:border-[var(--neon-green)]/40 transition-colors"
                        aria-label={`Mark "${item.title}" as read`}
                      >
                        Mark read
                      </button>
                    )}
                    {canMarkRead && isRead && (
                      <span className="shrink-0 self-start text-[9px] uppercase tracking-wider text-[var(--text-muted)] pt-1">
                        Read
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
