import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LandingLayout } from '../components/landing/LandingLayout';
import { GrowthStatsBackground } from '../components/landing/GrowthStatsBackground';
import { journeys } from '../components/landing/landingData';
import { staggerContainer, staggerItem } from '../lib/motion';

export function JourneysPage() {
  return (
    <LandingLayout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[420px] sm:h-[480px]">
          <GrowthStatsBackground variant="section" className="growth-stats-layer opacity-70" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 sm:mb-16"
        >
          <p className="text-xs font-bold tracking-[1.2px] uppercase text-[var(--text-muted)] mb-3">
            THE PROTOCOL
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-[-0.96px] leading-[1.1] text-[var(--text-primary)]">
            The Journeys
          </h1>
          <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-green)] opacity-80" />
          <p className="mt-6 max-w-2xl text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            Five parallel paths. One 6-month arc. Each journey compounds into mastery.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {journeys.map((j) => {
            const Icon = j.icon;
            return (
              <motion.div
                key={j.title}
                variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="group flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 sm:p-8 shadow-[var(--shadow-card)] transition-all duration-300 hover:border-[var(--border-muted)] hover:shadow-[var(--shadow-md)]"
              >
                <div>
                  <motion.div
                    className="flex size-12 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: `rgba(${j.rgb}, 0.08)` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: j.color }} />
                  </motion.div>
                  <h3 className="mt-4 text-2xl font-bold tracking-[-0.48px] text-[var(--text-primary)]">
                    {j.title}
                  </h3>
                  <p className="mt-2 text-base leading-6 text-[var(--text-secondary)]">{j.description}</p>
                </div>
                <p
                  className="mt-6 text-xs font-bold tracking-[1.2px] uppercase opacity-90"
                  style={{ color: j.color }}
                >
                  {j.tag}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 sm:mt-16 flex flex-wrap gap-4 justify-center"
        >
          <Link
            to="/mastery"
            className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] px-8 py-4 text-base font-bold text-[var(--text-primary)] shadow-[var(--shadow-xs)] hover:border-[var(--border-active)] hover:bg-[var(--bg-card-hover)] transition-all duration-300"
          >
            Explore Mastery System
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-[var(--neon-green)] px-8 py-4 text-base font-bold text-white shadow-[var(--shadow-md)] hover:opacity-95 transition-all duration-300"
          >
            Begin Journey
          </Link>
        </motion.div>
        </div>
      </section>
    </LandingLayout>
  );
}
