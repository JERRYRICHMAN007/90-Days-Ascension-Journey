import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { ModalPortal } from '../ui/ModalPortal';
import { GOAL_CHANGE_XP_PENALTY } from '../../utils/journeySetup.js';

/**
 * Confirmation before changing goals on an active journey (modest XP deduction).
 */
export function GoalChangeConfirmDialog({ open, onConfirm, onCancel, accentColor = '#6ee7b7' }) {
  if (!open) return null;

  return (
    <ModalPortal open={open} onClose={onCancel} ariaLabel="Confirm goal change">
      <div
        className="w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-start gap-3">
          <div
            className="p-2 rounded-xl shrink-0"
            style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}
          >
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-[var(--text-primary)]">Adjust your goals?</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
              Your journey is already in progress. Changing goals helps you stay honest about your direction,
              so we apply a small commitment adjustment of{' '}
              <strong className="text-[var(--text-primary)]">{GOAL_CHANGE_XP_PENALTY} XP</strong>.
              This isn&apos;t a punishment — it encourages thoughtful updates.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" className="rounded-full" onClick={onCancel}>
            Keep current goals
          </Button>
          <Button className="rounded-full" style={{ background: accentColor, color: '#0a0a0a' }} onClick={onConfirm}>
            Update goals
          </Button>
        </div>
      </div>
    </ModalPortal>
  );
}
