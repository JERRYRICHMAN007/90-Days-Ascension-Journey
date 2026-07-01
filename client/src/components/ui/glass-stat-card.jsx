import { motion } from 'framer-motion';
import { staggerItem } from '../../lib/motion.js';
import { cn } from '../../lib/utils';
import { TiltCard3D } from './TiltCard3D';

export function GlassStatCard({ children, className, index = 0, ...props }) {
  return (
    <motion.div variants={staggerItem} custom={index} className="h-full min-w-0">
      <TiltCard3D className="h-full">
        <motion.div
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className={cn(
            'glass-panel rounded-xl p-2.5 sm:p-3 md:p-4 card-lift h-full min-w-0',
            className
          )}
          {...props}
        >
          {children}
        </motion.div>
      </TiltCard3D>
    </motion.div>
  );
}
