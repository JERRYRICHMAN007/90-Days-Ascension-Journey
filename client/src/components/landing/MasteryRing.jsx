import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const WEEKLY_BARS = [32, 45, 38, 58, 62, 71, 88];

export function MasteryRing() {
  const score = 88.4;
  const change = 12.2;
  const viewSize = 240;
  const strokeWidth = 11;
  const radius = viewSize / 2 - strokeWidth * 2.2;
  const circumference = 2 * Math.PI * radius;
  const center = viewSize / 2;
  const DURATION = 1800;

  const [displayScore, setDisplayScore] = useState(0);
  const [dashOffset, setDashOffset] = useState(circumference);
  const [showExtras, setShowExtras] = useState(false);
  const [barHeights, setBarHeights] = useState(() => WEEKLY_BARS.map(() => 0));
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const uid = useId().replace(/:/g, '');
  const glowId = `land-glow-${uid}`;
  const gradId = `land-grad-${uid}`;

  useEffect(() => {
    setDisplayScore(0);
    setDashOffset(circumference);
    setShowExtras(false);
    setBarHeights(WEEKLY_BARS.map(() => 0));
    startRef.current = null;

    const delay = setTimeout(() => {
      const animate = (ts) => {
        if (!startRef.current) startRef.current = ts;
        const raw = Math.min((ts - startRef.current) / DURATION, 1);
        const eased = 1 - Math.pow(1 - raw, 3);
        const fill = (score / 100) * circumference;

        setDashOffset(circumference - eased * fill);
        setDisplayScore(parseFloat((score * eased).toFixed(1)));
        setBarHeights(WEEKLY_BARS.map((h) => Math.round(h * eased)));

        if (raw < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayScore(score);
          setDashOffset(circumference - fill);
          setBarHeights([...WEEKLY_BARS]);
          setShowExtras(true);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }, 300);

    return () => {
      clearTimeout(delay);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [circumference]);

  return (
    <div className="w-full max-w-full sm:max-w-[380px] mx-auto min-w-0">
      <div
        className="rounded-2xl border border-[#222] p-4 sm:p-6 overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 50% 20%, rgba(0,229,255,0.12), transparent 55%), #0a0f12',
        }}
      >
        <div className="relative mx-auto w-[min(100%,200px)] xs:w-[min(100%,220px)] sm:w-[240px]">
          <svg
            viewBox={`0 0 ${viewSize} ${viewSize}`}
            className="block h-auto w-full"
            style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
            aria-hidden
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
                <stop offset="100%" stopColor="#00ff87" />
              </linearGradient>
            </defs>
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={strokeWidth}
            />
            <circle
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
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#bac9cc]">
              Mastery Score
            </p>
            <p className="mt-1 text-4xl sm:text-5xl font-black tabular-nums text-white tracking-tight">
              {displayScore}
            </p>
            <p
              className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#00ff87] transition-opacity duration-500"
              style={{ opacity: showExtras ? 1 : 0 }}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{change}%
            </p>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 min-w-0">
          <div className="mb-3 flex items-end justify-between gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7a8a8e]">
              7-day trajectory
            </p>
            <p
              className="shrink-0 text-xs font-semibold text-[#00e5ff] transition-opacity duration-500"
              style={{ opacity: showExtras ? 1 : 0 }}
            >
              Compounding ↑
            </p>
          </div>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2" style={{ height: 96 }} aria-hidden>
            {barHeights.map((h, i) => (
              <div key={i} className="flex h-full min-w-0 flex-col items-center gap-1.5">
                <div className="relative w-full flex-1 overflow-hidden rounded-t-md bg-white/[0.06]">
                  <div
                    className="absolute inset-x-0 bottom-0 rounded-t-md"
                    style={{
                      height: `${Math.max(h, 0)}%`,
                      background:
                        i === WEEKLY_BARS.length - 1
                          ? 'linear-gradient(180deg, #00ff87, #00e5ff)'
                          : 'linear-gradient(180deg, rgba(0,229,255,0.9), rgba(0,229,255,0.28))',
                      boxShadow:
                        i === WEEKLY_BARS.length - 1
                          ? '0 0 12px rgba(0,255,135,0.35)'
                          : 'none',
                    }}
                  />
                </div>
                <span className="text-[9px] font-medium leading-none text-[#5a6a6e]">
                  D{i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
