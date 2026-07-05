import { InputHTMLAttributes, ReactNode } from 'react';

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: ReactNode;
  trailing?: ReactNode;
  error?: string;
};

export function AuthField({
  label,
  icon,
  trailing,
  error,
  className = '',
  ...props
}: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <label className="forge-label block">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`w-full h-12 rounded-lg border bg-[var(--bg-elevated)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-secondary)] transition-colors focus:outline-none focus:border-[var(--neon-green)] ${
            icon ? 'pl-11' : 'px-4'
          } ${trailing ? 'pr-11' : 'pr-4'} ${className}`}
          style={{ borderColor: error ? '#ef4444' : 'var(--border-subtle)' }}
        />
        {trailing && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{trailing}</span>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
