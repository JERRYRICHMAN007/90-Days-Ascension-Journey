import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { ModalPortal } from '../ui/ModalPortal';

/**
 * Read-only before/after preview for AI-proposed journey changes.
 */
export function AIChangeReviewModal({ open, onClose, diffItems = [], summary, journeyTitle, accentColor = '#6ee7b7' }) {
  if (!open) return null;

  return (
    <ModalPortal open={open} onClose={onClose} ariaLabel="Review AI changes">
      <div
        className="w-full max-w-lg max-h-[min(80vh,calc(100dvh-2rem))] rounded-2xl border flex flex-col shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="px-4 py-3 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <h3 className="font-display font-bold text-[var(--text-primary)]">Review changes</h3>
            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{journeyTitle} only</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full hover:bg-[var(--surface-hover)]">
            <X className="size-4 text-[var(--text-secondary)]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {summary && (
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{summary}</p>
          )}
          {diffItems.length > 0 ? (
            <div className="space-y-2">
              {diffItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-[var(--border-subtle)] overflow-hidden text-xs"
                >
                  <div className="px-3 py-1.5 bg-[var(--bg-badge)] font-semibold text-[var(--text-primary)]">
                    {item.label}
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-[var(--border-subtle)]">
                    <div className="px-3 py-2">
                      <p className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Before</p>
                      <p className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">{item.before}</p>
                    </div>
                    <div className="px-3 py-2" style={{ background: `rgba(110,231,183,0.05)` }}>
                      <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: accentColor }}>
                        After
                      </p>
                      <p className="text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed">{item.after}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)] italic">No structured diff available for this preview.</p>
          )}
        </div>

        <div className="px-4 py-3 border-t flex gap-2 shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
          <Button variant="ghost" className="rounded-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </ModalPortal>
  );
}
