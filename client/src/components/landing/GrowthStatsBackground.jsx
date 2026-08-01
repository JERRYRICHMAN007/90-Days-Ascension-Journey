import { useEffect, useId, useRef, useState } from 'react';
import { motion, animate } from 'framer-motion';

const FLOATING_STATS = [
  { label: 'Mastery Score', value: 88.4, suffix: '%', x: '8%', y: '18%', delay: 0 },
  { label: 'Day Streak', value: 142, suffix: '', x: '72%', y: '14%', delay: 0.15 },
  { label: 'Sessions', value: 847, suffix: '', x: '78%', y: '62%', delay: 0.3 },
  { label: 'Growth Rate', value: 12.2, suffix: '%', x: '12%', y: '68%', delay: 0.45 },
];

const BAR_SERIES = [
  [18, 24, 22, 32, 28, 38, 35, 48, 44, 58, 54, 68, 72, 82, 88],
  [12, 20, 28, 26, 36, 42, 40, 52, 60, 58, 70, 75, 80, 86, 92],
  [22, 18, 30, 34, 32, 44, 50, 48, 62, 66, 64, 78, 84, 90, 96],
];

const RISING_BARS = [28, 42, 36, 55, 48, 62, 58, 74, 68, 85, 78, 92, 88, 96];

function AnimatedCounter({ target, suffix = '', decimals = 0, delay = 0 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let controls;
    const timeout = setTimeout(() => {
      controls = animate(0, target, {
        duration: 2.2,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) => setDisplay(v),
      });
    }, 400 + delay * 1000);

    return () => {
      clearTimeout(timeout);
      controls?.stop();
    };
  }, [target, delay]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString();

  return (
    <span className="tabular-nums">
      {formatted}
      {suffix}
    </span>
  );
}

function GrowthChart({ className, opacity = 0.35 }) {
  const uid = useId().replace(/:/g, '');
  const gradId = `growth-grad-${uid}`;
  const glowId = `growth-glow-${uid}`;
  const width = 800;
  const height = 320;
  const pad = 24;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  const toPoints = (series) =>
    series
      .map((v, i) => {
        const x = pad + (i / (series.length - 1)) * innerW;
        const y = pad + innerH - (v / 100) * innerH;
        return `${x},${y}`;
      })
      .join(' ');

  const areaPath = (series) => {
    const pts = series.map((v, i) => {
      const x = pad + (i / (series.length - 1)) * innerW;
      const y = pad + innerH - (v / 100) * innerH;
      return { x, y };
    });
    const line = pts.map((p) => `${p.x},${p.y}`).join(' L ');
    const last = pts[pts.length - 1];
    const first = pts[0];
    return `M ${first.x},${pad + innerH} L ${line} L ${last.x},${pad + innerH} Z`;
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      aria-hidden
      style={{ opacity }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#00e5ff" stopOpacity="0" />
          <stop offset="50%" stopColor="#00e5ff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#00ff87" stopOpacity="0.45" />
        </linearGradient>
        <filter id={glowId}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={pad}
          y1={pad + innerH * (1 - t)}
          x2={width - pad}
          y2={pad + innerH * (1 - t)}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
      ))}

      {BAR_SERIES.map((series, si) => (
        <motion.path
          key={`area-${si}`}
          d={areaPath(series)}
          fill={`url(#${gradId})`}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: si === 0 ? 0.6 : 0.25, scaleY: 1 }}
          transition={{ duration: 1.8, delay: si * 0.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: 'bottom' }}
        />
      ))}

      {BAR_SERIES.map((series, si) => (
        <motion.polyline
          key={`line-${si}`}
          points={toPoints(series)}
          fill="none"
          stroke={si === 0 ? '#00ff87' : si === 1 ? '#00e5ff' : 'rgba(195,245,255,0.4)'}
          strokeWidth={si === 0 ? 2.5 : 1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={si === 0 ? `url(#${glowId})` : undefined}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.4, delay: 0.3 + si * 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </svg>
  );
}

function RisingBar({ target, index, total }) {
  const [height, setHeight] = useState(0);
  const isPeak = index >= total - 3;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const controls = animate(0, target, {
        duration: 2,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) => setHeight(v),
      });
      return () => controls.stop();
    }, 500);
    return () => clearTimeout(timeout);
  }, [target, index]);

  return (
    <div className="relative flex-1 min-w-0 h-full flex items-end">
      <motion.div
        className="w-full rounded-t-sm"
        style={{
          height: `${height}%`,
          background: isPeak
            ? 'linear-gradient(180deg, #00ff87, #00e5ff)'
            : 'linear-gradient(180deg, rgba(0,229,255,0.7), rgba(0,229,255,0.15))',
          boxShadow: isPeak ? '0 0 10px rgba(0,255,135,0.3)' : 'none',
        }}
      />
    </div>
  );
}

function RisingBarsPanel() {
  return (
    <div className="flex h-full items-end gap-[3px] sm:gap-1 px-2">
      {RISING_BARS.map((target, i) => (
        <RisingBar key={i} target={target} index={i} total={RISING_BARS.length} />
      ))}
    </div>
  );
}

export function GrowthStatsBackground({ variant = 'cover', className = '' }) {
  const isCover = variant === 'cover';

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,255,135,0.08), transparent 55%), radial-gradient(ellipse 60% 50% at 20% 20%, rgba(0,229,255,0.06), transparent 50%), #0a0a0a',
        }}
      />

      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00ff87]/30 to-transparent"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      <div className="absolute inset-x-0 bottom-0 h-[45%] sm:h-[50%]">
        <GrowthChart className="h-full w-full" opacity={isCover ? 0.4 : 0.55} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="absolute right-[4%] bottom-[8%] hidden h-28 w-40 rounded-xl border border-white/[0.06] bg-[#0a0f12]/60 backdrop-blur-sm sm:block lg:h-32 lg:w-48"
      >
        <p className="px-3 pt-2 text-[8px] font-bold uppercase tracking-[0.16em] text-[#7a8a8e]">
          6-mo trajectory
        </p>
        <div className="h-[calc(100%-1.25rem)] pb-2">
          <RisingBarsPanel />
        </div>
      </motion.div>

      {FLOATING_STATS.map((stat) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 + stat.delay, ease: [0.22, 1, 0.36, 1] }}
          className="absolute hidden sm:block"
          style={{ left: stat.x, top: stat.y }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4 + stat.delay * 2, repeat: Infinity, ease: 'easeInOut' }}
            className="rounded-lg border border-white/[0.08] bg-[#0d1516]/70 px-3 py-2 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#7a8a8e]">
              {stat.label}
            </p>
            <p className="mt-0.5 text-lg font-black text-white">
              <AnimatedCounter
                target={stat.value}
                suffix={stat.suffix}
                decimals={stat.suffix === '%' && stat.value < 100 ? 1 : 0}
                delay={stat.delay}
              />
            </p>
          </motion.div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute inset-x-4 bottom-4 flex gap-2 sm:hidden"
      >
        {FLOATING_STATS.slice(0, 3).map((stat) => (
          <div
            key={stat.label}
            className="flex-1 rounded-lg border border-white/[0.06] bg-[#0d1516]/80 px-2 py-1.5 backdrop-blur-sm text-center"
          >
            <p className="text-[8px] font-bold uppercase tracking-wide text-[#7a8a8e] truncate">
              {stat.label}
            </p>
            <p className="text-sm font-black text-[#c3f5ff]">
              <AnimatedCounter
                target={stat.value}
                suffix={stat.suffix}
                decimals={stat.suffix === '%' ? 1 : 0}
                delay={stat.delay}
              />
            </p>
          </div>
        ))}
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.4) 35%, rgba(10,10,10,0.55) 70%, rgba(10,10,10,0.92) 100%)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,229,255,0.5) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}
