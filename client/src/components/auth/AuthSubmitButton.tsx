import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type AuthSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children: ReactNode;
  variant?: 'primary' | 'outline';
};

export function AuthSubmitButton({
  loading = false,
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}: AuthSubmitButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={`w-full h-12 rounded-xl font-bold text-sm tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
      style={
        isPrimary
          ? {
              border: '2px solid var(--neon-green)',
              color: 'var(--neon-green)',
              background: 'rgba(0,255,135,0.06)',
              boxShadow: '0 0 10px rgba(0,255,135,0.15)',
            }
          : {
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              background: 'var(--bg-elevated)',
            }
      }
      onMouseEnter={(e) => {
        if (disabled || loading) return;
        if (isPrimary) {
          e.currentTarget.style.background = 'rgba(0,255,135,0.12)';
        } else {
          e.currentTarget.style.borderColor = 'var(--neon-cyan)';
          e.currentTarget.style.color = 'var(--neon-cyan)';
        }
      }}
      onMouseLeave={(e) => {
        if (isPrimary) {
          e.currentTarget.style.background = 'rgba(0,255,135,0.06)';
        } else {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }
      }}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Please wait…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
