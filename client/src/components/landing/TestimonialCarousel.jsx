import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TestimonialCard } from './TestimonialCard';

const SLIDE_INTERVAL_MS = 5000;

export function TestimonialCarousel({ testimonials = [] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const goTo = useCallback((next, dir = 1) => {
    if (count === 0) return;
    setDirection(dir);
    setIndex(((next % count) + count) % count);
  }, [count]);

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const timer = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % count);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [count, paused]);

  if (count === 0) return null;

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div
      className="relative max-w-5xl mx-auto w-full min-w-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          onClick={prev}
          className="hidden md:flex shrink-0 p-2 rounded-full border border-border/50 bg-card/80 hover:bg-muted transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0 overflow-hidden relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 min-h-[220px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${index}-a`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: 'easeInOut' }}
                className="w-full min-w-0"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) next();
                  else if (info.offset.x > 60) prev();
                }}
              >
                <TestimonialCard {...testimonials[index]} inCarousel />
              </motion.div>
            </AnimatePresence>

            {count > 1 && (
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`${index}-b`}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: 'easeInOut', delay: 0.05 }}
                  className="hidden md:block w-full min-w-0"
                >
                  <TestimonialCard {...testimonials[(index + 1) % count]} inCarousel />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={next}
          className="hidden md:flex shrink-0 p-2 rounded-full border border-border/50 bg-card/80 hover:bg-muted transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            type="button"
            onClick={() => goTo(i, i > index ? 1 : -1)}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
