import { cn } from '../../lib/utils';

/**
 * Grouped settings section with icon header.
 */
export function SettingsSection({ icon: Icon, title, description, children, className }) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] overflow-hidden',
        className
      )}
    >
      <div className="px-4 sm:px-5 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/30">
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--neon-green)]/10 text-[var(--neon-green)]">
              <Icon className="size-4" />
            </div>
          )}
          <div>
            <h2 className="font-display text-base font-bold text-[var(--text-primary)]">{title}</h2>
            {description && (
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-5 space-y-3">{children}</div>
    </section>
  );
}

export function SettingsRow({ label, description, children, className }) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-primary)]/40',
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[var(--text-primary)]">{label}</p>
        {description && (
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export function SettingsDivider() {
  return <div className="h-px bg-[var(--border-subtle)] my-1" />;
}
