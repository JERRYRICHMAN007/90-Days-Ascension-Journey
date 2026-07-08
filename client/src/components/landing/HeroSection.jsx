import { lazy, Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { LandingCtaButtons } from './LandingCtaButtons';
import { TiltCard3D } from '../ui/TiltCard3D';

const HeroGlobe3D = lazy(() => import('./HeroGlobe3D'));

const PREVIEW_DOMAINS = [
  { name: 'Body', progress: 75, icon: '💪' },
  { name: 'Brand', progress: 60, icon: '🎨' },
  { name: 'Reading', progress: 80, icon: '📚' },
  { name: 'Writing', progress: 55, icon: '✍️' },
  { name: 'Software', progress: 70, icon: '💻' },
];

function HeroGlobeLayer() {
  const [showGlobe, setShowGlobe] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) setShowGlobe(true);
    } catch {
      /* fallback to mesh gradient only */
    }
  }, []);

  if (!showGlobe) return null;

  return (
    <Suspense fallback={null}>
      <HeroGlobe3D />
    </Suspense>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100dvh-4rem)] sm:min-h-screen flex items-center justify-center overflow-hidden mesh-gradient-bg">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <HeroGlobeLayer />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-20 right-10 w-56 sm:w-96 h-56 sm:h-96 bg-accent/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-3 sm:px-6 py-10 sm:py-16 md:py-20 relative z-10 w-full max-w-[100vw] overflow-x-hidden">
        <div className="max-w-6xl mx-auto w-full min-w-0">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center w-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center lg:items-start text-center lg:text-left w-full min-w-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6 max-w-full"
              >
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-primary truncate">
                  <span className="sm:hidden">Join 10,000+ transforming</span>
                  <span className="hidden sm:inline">Join 10,000+ users transforming their lives</span>
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight w-full"
              >
                <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Transform Your Life
                </span>
                <br />
                <span className="text-foreground">in 184 Days</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-xl leading-relaxed mx-auto lg:mx-0"
              >
                Your all-in-one platform for body transformation, brand building, reading, writing, and software engineering growth. Start your Forge184 journey today.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="w-full mb-8 sm:mb-10"
              >
                <LandingCtaButtons align="start" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-5 text-xs sm:text-sm text-muted-foreground w-full"
              >
                {['No credit card required', 'Free forever plan', 'Cancel anytime'].map((label) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-success animate-pulse shrink-0" />
                    <span>{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative w-full min-w-0 mt-6 sm:mt-8 lg:mt-0"
            >
              <TiltCard3D className="w-full">
                <div className="relative w-full bg-card/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-border/50 shadow-2xl">
                  <div className="space-y-4 sm:space-y-5 w-full">
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground">Overall Progress</span>
                        <span className="text-xs sm:text-sm font-bold text-primary tabular-nums">68%</span>
                      </div>
                      <div className="h-2.5 sm:h-3 bg-muted rounded-full overflow-hidden w-full">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '68%' }}
                          transition={{ delay: 1, duration: 1.5, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full">
                      {PREVIEW_DOMAINS.map((domain, index) => {
                        const isLastOdd =
                          index === PREVIEW_DOMAINS.length - 1 &&
                          PREVIEW_DOMAINS.length % 2 !== 0;

                        return (
                          <motion.div
                            key={domain.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2 + index * 0.08 }}
                            className={`w-full min-w-0 p-3 sm:p-3.5 rounded-xl bg-muted/50 border border-border/50 ${
                              isLastOdd ? 'sm:col-span-2' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3 w-full min-w-0">
                              <span
                                className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-lg bg-background/80 text-xl sm:text-2xl"
                                aria-hidden
                              >
                                {domain.icon}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <span className="text-sm sm:text-base font-semibold text-foreground truncate">
                                    {domain.name}
                                  </span>
                                  <span className="text-xs font-bold text-primary tabular-nums shrink-0">
                                    {domain.progress}%
                                  </span>
                                </div>
                                <div className="h-2 sm:h-2.5 bg-background rounded-full overflow-hidden w-full">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${domain.progress}%` }}
                                    transition={{ delay: 1.5 + index * 0.08, duration: 1 }}
                                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 w-full">
                      <div className="min-w-0">
                        <div className="text-lg sm:text-2xl font-bold text-primary tabular-nums">2,450 XP</div>
                        <div className="text-[11px] sm:text-xs text-muted-foreground">Level 12 · 550 XP to next</div>
                      </div>
                      <div className="w-11 h-11 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-base sm:text-xl shrink-0">
                        12
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard3D>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
