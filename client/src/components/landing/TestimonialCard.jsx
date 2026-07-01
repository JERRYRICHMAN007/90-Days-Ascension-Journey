import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { TiltCard3D } from '../ui/TiltCard3D';

export function TestimonialCard({
  name,
  role,
  content,
  rating,
  avatar,
  delay = 0,
  inCarousel = false,
}) {
  const card = (
    <motion.div
      initial={inCarousel ? false : { opacity: 0, y: 20 }}
      whileInView={inCarousel ? undefined : { opacity: 1, y: 0 }}
      viewport={inCarousel ? undefined : { once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -3 }}
      className="relative bg-card/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3.5 sm:p-5 md:p-6 border border-border/50 shadow-md sm:shadow-lg hover:shadow-xl transition-all w-full h-full min-h-[200px] flex flex-col"
    >
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 opacity-10">
        <Quote className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1 mb-2.5 sm:mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 sm:w-4 sm:h-4 ${
              i < rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>

      <p className="text-xs sm:text-sm md:text-base text-foreground mb-4 sm:mb-6 leading-relaxed relative z-10 flex-1 line-clamp-4 sm:line-clamp-none">
        &ldquo;{content}&rdquo;
      </p>

      <div className="flex items-center gap-2.5 sm:gap-3 mt-auto">
        <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shrink-0">
          {avatar || name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm sm:text-base text-foreground truncate">{name}</div>
          <div className="text-xs sm:text-sm text-muted-foreground truncate">{role}</div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <TiltCard3D className="w-full h-full">
      {card}
    </TiltCard3D>
  );
}
