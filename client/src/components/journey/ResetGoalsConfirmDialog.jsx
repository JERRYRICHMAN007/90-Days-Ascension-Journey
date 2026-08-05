import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { ModalPortal } from '../ui/ModalPortal';

/**
 * Confirmation before restoring template default goals.
 */
export function ResetGoalsConfirmDialog({ open, onConfirm, onCancel, accentColor = '#6ee7b7', journeyTitle }) {
  if (!open) return null;

  return (
    <ModalPortal open={open} onClose={onCancel} ariaLabel="Reset goals confirmation">
      <div
        className="w-full max-w-md rounded-2xl border p-5 shadow-2xl space-y-4"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl shrink-0" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-[var(--text-primary)]">Reset to default goals?</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
              This restores the original template goals for{' '}
              <strong className="text-[var(--text-primary)]">{journeyTitle}</strong>. Your custom goal text will
              be replaced. Schedule and other settings stay unchanged.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" className="rounded-full" onClick={onCancel}>
            Keep my goals
          </Button>
          <Button className="rounded-full" style={{ background: accentColor, color: '#0a0a0a' }} onClick={onConfirm}>
            Reset goals
          </Button>
        </div>
      </div>
    </ModalPortal>
  );
}
