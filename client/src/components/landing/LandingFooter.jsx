import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, Twitter } from 'lucide-react';
import { NAV_ITEMS } from './landingData';

const FOOTER_LINKS = {
  protocol: [
    { to: '/journeys', label: 'The Journeys' },
    { to: '/mastery', label: 'Mastery System' },
    { to: '/legacy', label: 'Your Legacy' },
    { to: '/signup', label: 'Begin Journey' },
  ],
  legal: [
    { to: '#', label: 'Privacy' },
    { to: '#', label: 'Terms' },
    { to: '#', label: 'Community' },
    { to: 'mailto:support@aether.app', label: 'Support', external: true },
  ],
};

const SOCIAL = [
  { href: 'https://twitter.com', label: 'Twitter', icon: Twitter },
  { href: 'mailto:support@aether.app', label: 'Email', icon: Mail },
];

function FooterLink({ to, label, external }) {
  const className =
    'group inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--neon-purple)] transition-colors duration-300';

  if (external || to.startsWith('mailto:') || to.startsWith('http')) {
    return (
      <a
        href={to}
        className={className}
        target={to.startsWith('http') ? '_blank' : undefined}
        rel="noopener noreferrer"
      >
        {label}
        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
    );
  }

  if (to === '#') {
    return <span className="text-sm text-[var(--text-muted)] cursor-default">{label}</span>;
  }

  return (
    <Link to={to} className={className}>
      {label}
      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div className="min-w-0">
      <p className="aether-label mb-3 text-[var(--text-muted)]">{title}</p>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

export function LandingFooter() {
  return (
    <footer className="relative border-t border-[var(--border-subtle)] overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(196,181,253,0.5), rgba(147,197,253,0.5), rgba(110,231,183,0.4), transparent)',
        }}
        aria-hidden
      />

      <div className="relative bg-[var(--bg-secondary)]/95 backdrop-blur-sm">
        {/* CTA strip */}
        <div className="border-b border-[var(--border-subtle)]">
          <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8">
            <div className="flex flex-col items-stretch gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="text-center sm:text-left">
                <p className="aether-eyebrow mb-1.5 text-[var(--neon-purple)]">6-MONTH PROTOCOL</p>
                <p className="font-display text-lg sm:text-2xl font-bold text-[var(--text-primary)] tracking-[-0.03em]">
                  Ready to grow with intention?
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Link
                  to="/signup"
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-[#1a1724] transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(196,181,253,0.35)]"
                  style={{ background: 'var(--aether-brand-gradient)' }}
                >
                  Start Free
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Main content — compact on mobile */}
        <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12">
          {/* Brand row */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left border-b border-[var(--border-subtle)] pb-8 mb-8">
            <Link
              to="/"
              className="font-display text-2xl sm:text-3xl font-extrabold tracking-[-0.04em] bg-clip-text text-transparent"
              style={{ backgroundImage: 'var(--aether-brand-gradient)' }}
            >
              Aether
            </Link>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
              A 6-month mastery protocol for anyone ready to grow. Five journeys. One outcome:
              excellence.
            </p>
            <div className="mt-4 flex gap-2.5">
              {SOCIAL.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--neon-purple)]/40 hover:text-[var(--neon-purple)] transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link grid — 2 cols mobile, 3 cols tablet+ */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-8 lg:gap-x-12">
            <FooterColumn title="Explore">
              {NAV_ITEMS.map(({ to, label }) => (
                <li key={to}>
                  <FooterLink to={to} label={label} />
                </li>
              ))}
              <li>
                <FooterLink to="/signup" label="Create Account" />
              </li>
              <li>
                <FooterLink to="/signin" label="Sign In" />
              </li>
            </FooterColumn>

            <FooterColumn title="Protocol">
              {FOOTER_LINKS.protocol.map(({ to, label }) => (
                <li key={to}>
                  <FooterLink to={to} label={label} />
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title="Legal">
              {FOOTER_LINKS.legal.map(({ to, label, external }) => (
                <li key={label}>
                  <FooterLink to={to} label={label} external={external} />
                </li>
              ))}
            </FooterColumn>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--border-subtle)]">
          <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 sm:py-5">
            <p className="text-center text-[11px] sm:text-xs text-[var(--text-muted)] leading-relaxed">
              © {new Date().getFullYear()} Aether · Discipline is Freedom
              <span className="hidden sm:inline"> · </span>
              <span className="block sm:inline mt-1 sm:mt-0">
                Built for every person ready to become their best self.
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
