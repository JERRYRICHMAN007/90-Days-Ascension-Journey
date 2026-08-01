import { InputHTMLAttributes, ReactNode } from 'react';

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  error?: string;
  compact?: boolean;
};

export function AuthField({
  label,
  icon,
  trailing,
  error,
  compact = false,
  className = '',
  ...props
}: AuthFieldProps) {
  return (
    <div className={`aether-auth-field ${compact ? 'space-y-1' : 'space-y-2'}`}>
      <label className={`aether-label block ${compact ? 'text-[10px]' : ''}`}>{label}</label>
      <div className="relative">
        {icon && (
          <span className="aether-auth-field-icon absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none [&_svg]:stroke-[2.5]">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`w-full rounded-lg border bg-[var(--bg-elevated)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-secondary)] transition-colors focus:outline-none focus:border-[var(--neon-green)] ${
            compact ? 'h-10' : 'h-12'
          } ${icon ? 'pl-10' : 'px-4'} ${trailing ? 'pr-10' : 'pr-4'} ${className}`}
          style={{ borderColor: error ? '#ef4444' : 'var(--border-subtle)' }}
        />
        {trailing && (
          <span className="aether-auth-field-trailing absolute right-2.5 top-1/2 -translate-y-1/2 [&_svg]:stroke-[2.5]">
            {trailing}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
