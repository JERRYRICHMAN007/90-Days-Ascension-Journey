import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, Twitter } from 'lucide-react';
import { NAV_ITEMS } from './landingData';

const FOOTER_LINKS = {
  protocol: [
    { to: '/journeys', label: 'The Journeys' },
    { to: '/mastery', label: 'Mastery System' },
    { to: '/legacy', label: 'Your Legacy' },
    { to: '/signin', label: 'Begin Journey' },
  ],
  legal: [
    { to: '#', label: 'Privacy Policy' },
    { to: '#', label: 'Terms of Service' },
    { to: '#', label: 'Community' },
    { to: 'mailto:support@aether.app', label: 'Support', external: true },
  ],
};

const SOCIAL = [
  {
    href: 'https://twitter.com',
    label: 'Twitter',
    icon: Twitter,
  },
  {
    href: 'mailto:support@aether.app',
    label: 'Email',
    icon: Mail,
  },
];

function FooterLink({ to, label, external }) {
  const className =
    'group inline-flex items-center gap-1 text-sm text-[#bac9cc] hover:text-[#c3f5ff] transition-colors duration-300';

  if (external || to.startsWith('mailto:') || to.startsWith('http')) {
    return (
      <a href={to} className={className} target={to.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
        {label}
        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all duration-300" />
      </a>
    );
  }

  if (to === '#') {
    return <span className="text-sm text-[#7a8a8e] cursor-default">{label}</span>;
  }

  return (
    <Link to={to} className={className}>
      {label}
      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all duration-300" />
    </Link>
  );
}

export function LandingFooter() {
  return (
    <footer className="relative border-t overflow-hidden" style={{ borderColor: '#3b494c' }}>
      {/* Top glow line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(0,229,255,0.5), rgba(0,255,135,0.5), transparent)',
        }}
        aria-hidden
      />

      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(0,229,255,0.06), transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative bg-[#0d1516]/95 backdrop-blur-sm">
        {/* CTA strip */}
        <div className="border-b" style={{ borderColor: 'rgba(59,73,76,0.35)' }}>
          <div className="mx-auto flex max-w-[1440px] flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-8">
            <div>
              <p className="aether-eyebrow mb-2 text-[#00e5ff]">6-MONTH PROTOCOL</p>
              <p className="font-display text-xl sm:text-2xl font-bold text-white tracking-[-0.03em]">
                Ready to ascend?
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/signin"
                className="inline-flex items-center gap-2 rounded-xl bg-[#00e5ff] px-6 py-3.5 text-sm font-bold text-[#00363d] hover:shadow-[0_0_24px_rgba(0,229,255,0.3)] transition-shadow duration-300"
              >
                Start Free
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Main grid */}
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-4 py-12 sm:px-6 sm:py-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link
              to="/"
              className="font-display text-3xl font-extrabold tracking-[-0.04em] text-[#c3f5ff] hover:opacity-80 transition-opacity"
            >
              Aether
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#bac9cc]">
              A 6-month mastery protocol for the driven. Five journeys. One outcome: excellence.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIAL.map(({ href, label, icon: Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -2 }}
                  className="flex size-10 items-center justify-center rounded-xl border border-[#3b494c] bg-[#141414]/60 text-[#bac9cc] hover:border-[#00e5ff]/50 hover:text-[#c3f5ff] hover:shadow-[0_0_16px_rgba(0,229,255,0.15)] transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2 lg:col-start-6">
            <p className="aether-label mb-4 text-[#7a8a8e]">Explore</p>
            <ul className="space-y-3">
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
            </ul>
          </div>

          {/* Protocol */}
          <div className="lg:col-span-2">
            <p className="aether-label mb-4 text-[#7a8a8e]">Protocol</p>
            <ul className="space-y-3">
              {FOOTER_LINKS.protocol.map(({ to, label }) => (
                <li key={to}>
                  <FooterLink to={to} label={label} />
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <p className="aether-label mb-4 text-[#7a8a8e]">Legal</p>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map(({ to, label, external }) => (
                <li key={label}>
                  <FooterLink to={to} label={label} external={external} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t" style={{ borderColor: 'rgba(59,73,76,0.35)' }}>
          <div className="mx-auto flex max-w-[1440px] flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-5 sm:px-6">
            <p className="text-xs font-medium tracking-wide text-[#7a8a8e]">
              © {new Date().getFullYear()} Aether · Discipline is Freedom
            </p>
            <p className="text-xs text-[#5a6a6e]">
              Built for those who refuse to stay the same.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
