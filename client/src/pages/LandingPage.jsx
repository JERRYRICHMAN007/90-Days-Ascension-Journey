import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { LandingLayout } from '../components/landing/LandingLayout';
import { GrowthStatsBackground } from '../components/landing/GrowthStatsBackground';
import { NAV_ITEMS } from '../components/landing/landingData';

export function LandingPage() {
  return (
    <LandingLayout>
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16 sm:py-24 overflow-hidden">
        <GrowthStatsBackground variant="cover" />

        <div className="relative z-10 mx-auto flex max-w-[896px] flex-col items-center gap-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl sm:text-5xl lg:text-[48px] font-extrabold uppercase tracking-[-0.04em] leading-[1.05] text-[var(--text-primary)]"
          >
            ASCEND WITH AETHER.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[672px] text-base sm:text-lg text-[var(--text-secondary)] leading-[1.6]"
          >
            A 6-month mastery protocol for anyone ready to grow.
            <br />
            Five journeys. One outcome: Excellence.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="pt-4"
          >
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-8 sm:px-[42px] py-[18px] text-lg font-bold text-[var(--neon-green)] shadow-[var(--shadow-card)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--neon-green)]/40 transition-all duration-300"
            >
              Enter Aether
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl"
          >
            {NAV_ITEMS.map(({ to, label }, i) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Link
                  to={to}
                  className="block rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-6 py-5 text-center font-display text-base font-bold text-[var(--text-primary)] shadow-[var(--shadow-xs)] hover:border-[var(--border-muted)] hover:bg-[var(--bg-card-hover)] hover:shadow-[var(--shadow-card)] transition-all duration-300"
                >
                  {label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </LandingLayout>
  );
}
