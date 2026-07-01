import { motion } from 'framer-motion';
import { TiltCard3D } from '../ui/TiltCard3D';

export function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  delay = 0,
  benefits = [],
}) {
  return (
    <TiltCard3D className="w-full h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        whileHover={{ y: -4 }}
        className="group relative bg-card/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 border border-border/50 shadow-md sm:shadow-lg hover:shadow-xl transition-all overflow-hidden w-full h-full"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-2.5 sm:mb-3 md:mb-4 shadow-md`}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
        </motion.div>

        <div className="relative">
          <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 group-hover:text-foreground transition-colors leading-snug">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-2.5 sm:mb-3 md:mb-4 line-clamp-3 sm:line-clamp-none">
            {description}
          </p>

          {benefits.length > 0 && (
            <ul className="space-y-1 sm:space-y-1.5">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: delay + 0.15 + index * 0.08 }}
                  className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm text-muted-foreground"
                >
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary shrink-0" />
                  <span className="leading-snug">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />
      </motion.div>
    </TiltCard3D>
  );
}
