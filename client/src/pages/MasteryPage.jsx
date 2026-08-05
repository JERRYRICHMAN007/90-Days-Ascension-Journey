import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LandingLayout } from '../components/landing/LandingLayout';
import { GrowthStatsBackground } from '../components/landing/GrowthStatsBackground';
import { MasteryRing } from '../components/landing/MasteryRing';
import { systemPillars } from '../components/landing/landingData';
import { staggerContainer, staggerItem } from '../lib/motion';

export function MasteryPage() {
  return (
    <LandingLayout>
      <section className="relative overflow-hidden py-12 sm:py-16 lg:py-24 min-h-[calc(100vh-4rem)]">
        <GrowthStatsBackground variant="section" className="growth-stats-layer opacity-70" />

        <div className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0 space-y-4 order-2 lg:order-1"
          >
            <p className="text-xs font-bold tracking-[1.2px] uppercase text-[var(--text-muted)]">
              THE SYSTEM
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-[-0.96px] leading-[1.1] text-[var(--text-primary)]">
              Discipline as a Service.
            </h1>
            <p className="max-w-xl text-base sm:text-lg leading-[1.6] text-[var(--text-secondary)]">
              Our proprietary Mastery Score tracks your 6-month trajectory across three critical
              vectors. There is no guesswork—only data-driven evolution.
            </p>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="flex flex-col gap-6 sm:gap-8 pt-4 sm:pt-6"
            >
              {systemPillars.map((p) => (
                <motion.div
                  key={p.num}
                  variants={staggerItem}
                  whileHover={{ x: 4 }}
                  className="flex gap-4 sm:gap-6 items-start rounded-xl border border-transparent hover:border-[var(--border-subtle)] hover:bg-[var(--surface-subtle)] p-3 -m-3 transition-colors duration-300"
                >
                  <div className="flex size-10 sm:size-12 shrink-0 items-center justify-center border border-[var(--border-muted)] text-sm sm:text-base font-bold text-[var(--neon-cyan)] transition-colors duration-300 hover:border-[var(--neon-cyan)]/50">
                    {p.num}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xl sm:text-2xl font-bold tracking-[-0.48px] text-[var(--text-primary)]">
                      {p.title}
                    </h4>
                    <p className="mt-1 text-sm sm:text-base text-[var(--text-secondary)] leading-6">
                      {p.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-6"
            >
              <Link
                to="/legacy"
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--neon-cyan)] hover:text-[var(--neon-green)] transition-colors"
              >
                Ready to commit? See what&apos;s next →
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 w-full min-w-0 lg:order-2 lg:flex lg:justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-[var(--neon-cyan)]/5 blur-2xl pointer-events-none" />
              <MasteryRing />
            </div>
          </motion.div>
        </div>
      </section>
    </LandingLayout>
  );
}
