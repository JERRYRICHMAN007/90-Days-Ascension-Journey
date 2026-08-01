import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from './landingData';

const navLinkClass = ({ isActive }) =>
  `relative text-base font-bold transition-colors duration-300 ${
    isActive ? 'text-[#c3f5ff]' : 'font-normal text-[#bac9cc] hover:text-white'
  }`;

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-[12px]"
      style={{
        backgroundColor: 'rgba(13,21,22,0.8)',
        borderColor: '#3b494c',
      }}
    >
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="font-display text-2xl font-extrabold tracking-[-0.04em] text-[#c3f5ff] transition-opacity hover:opacity-80"
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
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-[#c3f5ff]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/signin"
            className="rounded-lg bg-[#00e5ff] px-4 sm:px-6 py-2 text-sm sm:text-base font-bold text-[#00363d] hover:opacity-90 hover:shadow-[0_0_20px_rgba(0,229,255,0.35)] transition-all duration-300"
          >
            Begin Journey
          </Link>

          <button
            type="button"
            className="md:hidden flex size-10 items-center justify-center rounded-lg border border-[#3b494c] text-[#bac9cc] hover:text-white transition-colors"
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
            className="md:hidden overflow-hidden border-t"
            style={{ borderColor: '#3b494c', backgroundColor: 'rgba(13,21,22,0.95)' }}
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
                          ? 'bg-[#c3f5ff]/10 text-[#c3f5ff]'
                          : 'text-[#bac9cc] hover:bg-white/5 hover:text-white'
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
