import { motion } from 'framer-motion';

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  gradient,
  delay = 0,
  benefits = []
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-card/80 backdrop-blur-xl rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-2xl transition-all overflow-hidden"
    >
      {/* Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>

      {/* Content */}
      <div className="relative">
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {description}
        </p>

        {/* Benefits List */}
        {benefits.length > 0 && (
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: delay + 0.2 + index * 0.1 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {benefit}
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      {/* Hover Effect Border */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />
    </motion.div>
  );
}
