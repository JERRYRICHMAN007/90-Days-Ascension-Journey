import { useEffect, useId, useRef, useState } from 'react';

/**
 * Responsive mastery hero — fluid SVG ring + context stats.
 * Animates on mount; scales from mobile → desktop without a fixed dead center.
 */
export default function MasteryScoreRing({
  score = 0,
  change = null,
  journeyPercent = 0,
  rank = '—',
  dayLabel = '',
  accentColor = '#00e5ff',
}) {
  const strokeWidth = 11;
  const viewSize = 240;
  const radius = viewSize / 2 - strokeWidth * 2.2;
  const circumference = 2 * Math.PI * radius;
  const center = viewSize / 2;
  const DURATION = 1600;
  const clampedScore = Math.max(0, Math.min(100, Number(score) || 0));
  const clampedJourney = Math.max(0, Math.min(100, Number(journeyPercent) || 0));

  const [displayScore, setDisplayScore] = useState(0);
  const [dashOffset, setDashOffset] = useState(circumference);
  const [showChange, setShowChange] = useState(false);
  const [idle, setIdle] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const uid = useId().replace(/:/g, '');
  const glowId = `glow-${uid}`;
  const gradId = `ring-grad-${uid}`;

  useEffect(() => {
    setDisplayScore(0);
    setDashOffset(circumference);
    setShowChange(false);
    setIdle(false);
    startRef.current = null;

    const delay = setTimeout(() => {
      const animate = (timestamp) => {
        if (!startRef.current) startRef.current = timestamp;
        const elapsed = timestamp - startRef.current;
        const raw = Math.min(elapsed / DURATION, 1);
        const eased = 1 - Math.pow(1 - raw, 3);
        const targetFill = (clampedScore / 100) * circumference;

        setDashOffset(circumference - eased * targetFill);
        setDisplayScore(parseFloat((clampedScore * eased).toFixed(1)));

        if (raw < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayScore(clampedScore);
          setDashOffset(circumference - targetFill);
          setShowChange(true);
          setIdle(true);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }, 200);

    return () => {
      clearTimeout(delay);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [clampedScore, circumference]);

  return (
    <section
      className="mastery-hero relative overflow-hidden rounded-2xl border"
      style={{
        borderColor: 'rgba(59, 73, 76, 0.45)',
        background:
          'radial-gradient(ellipse 80% 70% at 20% 40%, rgba(0,229,255,0.10), transparent 55%), radial-gradient(ellipse 70% 60% at 90% 80%, rgba(0,255,135,0.08), transparent 50%), #080f11',
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        <div
          className="absolute -left-16 top-1/4 h-40 w-40 rounded-full blur-3xl"
          style={{ background: accentColor, opacity: 0.15 }}
        />
      </div>

      <div className="relative grid gap-6 p-5 sm:gap-8 sm:p-7 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-10 lg:p-8">
        {/* Ring — fluid, never fixed dead center on mobile */}
        <div className="flex flex-col items-center justify-center">
          <div
            className={`mastery-ring-shell relative mx-auto w-[min(100%,220px)] sm:w-[min(100%,260px)] ${idle ? 'mastery-ring-idle' : ''}`}
          >
            <svg
              viewBox={`0 0 ${viewSize} ${viewSize}`}
              className="block h-auto w-full"
              style={{ overflow: 'visible', transform: 'rotate(-90deg)' }}
              role="img"
              aria-label={`Mastery score ${clampedScore}`}
            >
              <defs>
                <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00e5ff" />
                  <stop offset="55%" stopColor="#00ffc8" />
                  <stop offset="100%" stopColor="#00ff87" />
                </linearGradient>
              </defs>

              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={strokeWidth}
              />

              <circle
                className="mastery-ring-arc"
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={`url(#${gradId})`}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                filter={`url(#${glowId})`}
              />
            </svg>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#7a8a8e]">
                Mastery
              </p>
              <p className="mt-1 text-4xl font-black tabular-nums tracking-tight text-white sm:text-5xl">
                {displayScore}
              </p>
              {change !== null && change !== undefined && (
                <span
                  className="mt-2 inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                  style={{
                    color: '#00ff87',
                    borderColor: 'rgba(0,255,135,0.35)',
                    background: 'rgba(0,255,135,0.08)',
                    opacity: showChange ? 1 : 0,
                    transition: 'opacity 0.45s ease',
                  }}
                >
                  ↗ +{change}%
                </span>
              )}
            </div>
          </div>

          {dayLabel && (
            <p className="mt-4 text-center text-xs text-[var(--text-secondary)] sm:text-sm">
              {dayLabel}
            </p>
          )}
        </div>

        {/* Context — makes the block useful, not decorative */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:gap-4">
          <MetricTile
            label="Journey progress"
            value={`${clampedJourney}%`}
            hint="Of this path completed"
          >
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-[1.6s] ease-out"
                style={{
                  width: showChange ? `${clampedJourney}%` : '0%',
                  background: `linear-gradient(90deg, #00e5ff, ${accentColor})`,
                }}
              />
            </div>
          </MetricTile>

          <MetricTile
            label="Current rank"
            value={String(rank)}
            hint="Based on mastery score"
            valueStyle={{ color: accentColor }}
          />

          <MetricTile
            label="Score scale"
            value={`${Math.round(clampedScore)} / 100`}
            hint="Mastery toward peak form"
            className="sm:col-span-2 lg:col-span-1"
          >
            <div className="mt-3 flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => {
                const filled = clampedScore > i * 20;
                return (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full transition-colors duration-500"
                    style={{
                      background: filled
                        ? i < 2
                          ? '#00e5ff'
                          : i < 4
                            ? '#00ffc8'
                            : '#00ff87'
                        : 'rgba(255,255,255,0.08)',
                      opacity: showChange || filled ? 1 : 0.4,
                    }}
                  />
                );
              })}
            </div>
          </MetricTile>
        </div>
      </div>
    </section>
  );
}

function MetricTile({ label, value, hint, children, valueStyle, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5 backdrop-blur-sm ${className}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7a8a8e]">
        {label}
      </p>
      <p
        className="mt-1.5 text-2xl font-extrabold tracking-tight text-white tabular-nums"
        style={valueStyle}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-[var(--text-secondary)]">{hint}</p>}
      {children}
    </div>
  );
}
