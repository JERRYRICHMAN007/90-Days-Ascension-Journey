import { Link } from 'react-router-dom';
import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

const MESH_BG = {
  backgroundColor: '#0a0a0a',
  backgroundImage:
    'radial-gradient(ellipse 50% 40% at 20% 30%, rgba(0,255,135,0.12), transparent 55%), radial-gradient(ellipse 45% 35% at 80% 70%, rgba(0,229,255,0.1), transparent 55%)',
};

type AuthLayoutProps = {
  mode: 'signin' | 'signup';
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

const PANEL_COPY = {
  signin: {
    eyebrow: 'ACCESS PROTOCOL',
    headline: 'Resume Your\nForge.',
    body: 'Pick up where you left off. Your streaks, mastery scores, and daily sessions are waiting.',
    bullets: ['Sync across devices', 'Track all five journeys', 'Secure session'],
  },
  signup: {
    eyebrow: 'INITIATION',
    headline: 'Enter the\nForge.',
    body: 'Join the 184-day mastery protocol. Five journeys. One standard: excellence.',
    bullets: ['Free to start', 'Five mastery paths', 'Daily forge sessions'],
  },
};

export function AuthLayout({ mode, title, subtitle, children, footer }: AuthLayoutProps) {
  const panel = PANEL_COPY[mode];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={MESH_BG}>
      {/* Desktop brand panel */}
      <aside
        className="hidden lg:flex lg:w-[48%] xl:w-[52%] flex-col justify-between p-12 xl:p-16 border-r"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-16"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <p className="forge-eyebrow mb-4">{panel.eyebrow}</p>
          <h1 className="text-[48px] xl:text-[56px] font-extrabold text-[var(--text-primary)] tracking-[-0.96px] leading-[1.05] whitespace-pre-line">
            {panel.headline}
          </h1>
          <p className="mt-6 text-base text-[var(--text-secondary)] leading-relaxed max-w-md">
            {panel.body}
          </p>
          <ul className="mt-8 space-y-3">
            {panel.bullets.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <span
                  className="size-1.5 rounded-full shrink-0"
                  style={{ background: 'var(--neon-green)', boxShadow: 'var(--neon-glow-green)' }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[10px] uppercase tracking-[1.2px] text-[var(--text-secondary)]">
          © {new Date().getFullYear()} Aether · Discipline is Freedom
        </p>
      </aside>

      {/* Form column — mobile + desktop */}
      <main className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile header */}
        <header
          className="lg:hidden sticky top-0 z-10 flex items-center justify-between h-16 px-5 border-b backdrop-blur-[12px]"
          style={{
            backgroundColor: 'rgba(13,21,22,0.85)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <Link
            to="/"
            className="text-xl font-extrabold tracking-[-1px] text-[var(--neon-cyan-alt)]"
          >
            Aether
          </Link>
          <Link
            to="/"
            className="text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]"
          >
            Home
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center px-5 py-10 sm:px-8 sm:py-12">
          <div className="w-full max-w-[440px]">
            {/* Desktop form header (logo above card on lg when no side panel duplicate) */}
            <div className="hidden lg:block mb-8">
              <Link
                to="/"
                className="text-2xl font-extrabold tracking-[-1.2px] text-[var(--neon-cyan-alt)]"
              >
                Aether
              </Link>
            </div>

            <div
              className="rounded-[12px] border p-6 sm:p-8"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="mb-6 sm:mb-8">
                <p className="forge-eyebrow mb-2 lg:hidden">
                  {mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
                </p>
                <h2 className="text-2xl sm:text-[32px] font-extrabold text-[var(--text-primary)] tracking-[-0.64px] leading-tight">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{subtitle}</p>
              </div>

              {children}
            </div>

            {footer && <div className="mt-6">{footer}</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
