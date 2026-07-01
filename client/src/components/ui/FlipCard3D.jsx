import { useState } from 'react';
import { motion } from 'framer-motion';
import { flipTransition } from '../../lib/motion.js';

const SIZE_CLASSES = {
  sm: 'w-[120px] h-[132px] sm:w-[130px] sm:h-[140px]',
  md: 'w-[140px] h-[148px] sm:w-[160px] sm:h-[160px]',
  lg: 'w-[160px] h-[168px] sm:w-[180px] sm:h-[180px]',
  wide: 'w-[200px] h-[148px] sm:w-[220px] sm:h-[160px]',
};

export function FlipCard3D({
  front,
  back,
  size = 'md',
  isActive = false,
  className = '',
  ariaLabel,
  onFlip,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  as = 'button',
}) {
  const [flipped, setFlipped] = useState(false);

  const toggle = () => {
    setFlipped((f) => {
      const next = !f;
      onFlip?.(next);
      return next;
    });
  };

  const sharedProps = {
    className: `group relative perspective-1000 ${SIZE_CLASSES[size] || SIZE_CLASSES.md} shrink-0 transition-shadow rounded-xl ${
      isActive ? 'ring-2 ring-primary/60 shadow-lg shadow-primary/20' : ''
    } ${className}`,
    'aria-label': ariaLabel,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    whileHover: { y: -2 },
    whileTap: { scale: 0.98 },
  };

  const inner = (
    <motion.div
      className="relative w-full h-full preserve-3d"
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={flipTransition}
    >
      <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden">{front}</div>
      <div
        className="absolute inset-0 backface-hidden rounded-xl overflow-hidden"
        style={{ transform: 'rotateY(180deg)' }}
      >
        {back}
      </div>
    </motion.div>
  );

  if (as === 'div') {
    return (
      <motion.div {...sharedProps} onClick={toggle} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && toggle()}>
        {inner}
      </motion.div>
    );
  }

  return (
    <motion.button type="button" onClick={toggle} {...sharedProps}>
      {inner}
    </motion.button>
  );
}
