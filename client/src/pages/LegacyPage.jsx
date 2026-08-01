import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LandingLayout } from '../components/landing/LandingLayout';
import { GrowthStatsBackground } from '../components/landing/GrowthStatsBackground';

export function LegacyPage() {
  return (
    <LandingLayout>
      <section className="relative overflow-hidden px-4 sm:px-6 py-20 sm:py-24 lg:py-32 min-h-[calc(100vh-4rem)] flex items-center">
        <GrowthStatsBackground variant="cover" />

        <div className="relative z-10 mx-auto flex max-w-[896px] flex-col items-center gap-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs font-bold tracking-[1.2px] uppercase text-[#00ff87]"
          >
            YOUR LEGACY
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-[-0.96px] leading-[1.1] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]"
          >
            Ready to Transmute?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-base sm:text-lg text-[#bac9cc] leading-[1.6]"
          >
            The next 6 months will pass regardless. Who will you be at the end of them?
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2 w-full sm:w-auto"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/signin"
                className="block rounded-xl bg-[#c3f5ff] px-10 py-5 text-lg font-bold text-[#00363d] hover:opacity-90 hover:shadow-[0_0_32px_rgba(195,245,255,0.25)] transition-all duration-300 text-center"
              >
                Begin Journey
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/journeys"
                className="block rounded-xl border border-[#849396] bg-[#141414]/60 backdrop-blur-sm px-10 py-5 text-lg font-bold text-white hover:border-[#c3f5ff] hover:text-[#c3f5ff] transition-all duration-300 text-center"
              >
                View Protocol
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </LandingLayout>
  );
}
