import { useEffect, useId, useRef, useState } from 'react';

const MasteryScoreRing = ({ score = 88.4, change = 12.2, size = 280 }) => {
  const strokeWidth = 14;
  const radius = size / 2 - strokeWidth * 2.5;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const DURATION = 1800;
  const clampedScore = Math.max(0, Math.min(100, Number(score) || 0));

  const [displayScore, setDisplayScore] = useState(0);
  const [dashOffset, setDashOffset] = useState(circumference);
  const [showChange, setShowChange] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const uid = useId().replace(/:/g, '');
  const glowId = `glow-${uid}`;
  const gradId = `ring-grad-${uid}`;

  useEffect(() => {
    setDisplayScore(0);
    setDashOffset(circumference);
    setShowChange(false);
    startRef.current = null;

    const delay = setTimeout(() => {
      const animate = (timestamp) => {
        if (!startRef.current) startRef.current = timestamp;
        const elapsed = timestamp - startRef.current;
        const raw = Math.min(elapsed / DURATION, 1);
        const eased = 1 - Math.pow(1 - raw, 3);
        const targetFill = (clampedScore / 100) * circumference;
        const currentOffset = circumference - eased * targetFill;

        setDashOffset(currentOffset);
        setDisplayScore(parseFloat((clampedScore * eased).toFixed(1)));

        if (raw < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayScore(clampedScore);
          setDashOffset(circumference - targetFill);
          setTimeout(() => setShowChange(true), 200);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }, 400);

    return () => {
      clearTimeout(delay);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [clampedScore, circumference]);

  return (
    <div
      className="mastery-ring-hover relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}
        aria-hidden="true"
      >
        <defs>
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00ff87" />
            <stop offset="100%" stopColor="#00e5ff" />
          </linearGradient>
        </defs>

        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#1c1c1c"
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

      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ inset: 0 }}
      >
        <p
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#666',
            margin: 0,
          }}
        >
          Mastery Score
        </p>
        <p
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            margin: '6px 0 4px',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {displayScore}
        </p>
        <p
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#00ff87',
            margin: 0,
            opacity: showChange ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          ↗ +{change}%
        </p>
      </div>
    </div>
  );
};

export default MasteryScoreRing;
