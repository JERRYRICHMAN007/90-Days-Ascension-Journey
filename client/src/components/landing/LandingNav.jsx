import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from './landingData';

const navLinkClass = ({ isActive }) =>
  `relative text-base font-bold transition-colors duration-300 ${
    isActive
      ? 'text-[var(--neon-purple)]'
      : 'font-normal text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
  }`;

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] backdrop-blur-[12px] bg-[var(--bg-header)]">
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="font-display text-2xl font-extrabold tracking-[-0.04em] bg-clip-text text-transparent"
          style={{ backgroundImage: 'var(--aether-brand-gradient)' }}
        >
          Aether
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink key={to} to={to} className={navLinkClass}>
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-[var(--neon-purple)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/signup"
            className="rounded-lg px-3 sm:px-6 py-2 text-sm sm:text-base font-bold text-[#1a1724] hover:opacity-90 hover:shadow-[0_0_20px_rgba(196,181,253,0.35)] transition-all duration-300"
            style={{ background: 'var(--aether-brand-gradient)' }}
          >
            Begin Journey
          </Link>

          <button
            type="button"
            className="md:hidden flex size-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden overflow-hidden border-t border-[var(--border-subtle)] bg-[var(--bg-nav)]"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_ITEMS.map(({ to, label }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <NavLink
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-3 text-base font-bold transition-colors ${
                        isActive
                          ? 'bg-[var(--neon-purple)]/10 text-[var(--neon-purple)]'
                          : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
