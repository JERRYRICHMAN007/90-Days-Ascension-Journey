import { ModalPortal } from '../ui/ModalPortal';
import { Button } from '../ui/button';
import { AlertTriangle } from 'lucide-react';

/**
 * Confirmation dialog for destructive or bulk settings actions.
 */
export function SettingsConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  const isDanger = variant === 'danger';

  return (
    <ModalPortal open={open} onClose={onCancel} ariaLabel={title}>
      <div
        className="w-full max-w-md rounded-2xl border p-5 shadow-2xl space-y-4"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-start gap-3">
          {isDanger && (
            <div className="p-2 rounded-xl shrink-0 bg-red-500/10 text-red-400">
              <AlertTriangle className="size-5" />
            </div>
          )}
          <div>
            <h3 className="font-display font-bold text-[var(--text-primary)]">{title}</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" className="rounded-full" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            className="rounded-full"
            variant={isDanger ? 'destructive' : 'default'}
            style={!isDanger ? { background: 'var(--neon-green)', color: '#0a0a0a' } : undefined}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </ModalPortal>
  );
}
