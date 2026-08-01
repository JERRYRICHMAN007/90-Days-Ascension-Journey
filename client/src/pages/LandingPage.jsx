import { Link, Navigate } from 'react-router-dom';
import { useEffect, useId, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Dumbbell,
  Palette,
  BookOpen,
  PenTool,
  Code,
  Share2,
  Mail,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const journeys = [
  {
    title: 'Body',
    description: 'Rebuild your machine from the cellular level up.',
    tag: 'INTENSITY: 100',
    color: '#00ff87',
    rgb: '0,255,135',
    icon: Dumbbell,
  },
  {
    title: 'Dual Brand',
    description: 'Build _richman.oo7 + _ryxen.oo7 — revenue that compounds over 6 months.',
    tag: 'REVENUE ENGINE',
    color: '#00e5ff',
    rgb: '0,229,255',
    icon: Palette,
  },
  {
    title: 'Reading',
    description: 'Synthesize centuries of wisdom into active power.',
    tag: 'WISDOM GAIN',
    color: '#a78bfa',
    rgb: '167,139,250',
    icon: BookOpen,
  },
  {
    title: 'Writing',
    description: 'Clarify your vision and architect your future.',
    tag: 'SYSTEM DESIGN',
    color: '#f59e0b',
    rgb: '245,158,11',
    icon: PenTool,
  },
  {
    title: 'Software',
    description: 'Ship Comfort by month 6 — frontend, backend, then production.',
    tag: 'EXECUTION',
    color: '#3b82f6',
    rgb: '59,130,246',
    icon: Code,
  },
];

const systemPillars = [
  {
    num: '01',
    title: 'Consistency',
    description: 'The compound interest of the soul. Never miss twice.',
  },
  {
    num: '02',
    title: 'Intensity',
    description: 'Work at your absolute capacity. Threshold pushing.',
  },
  {
    num: '03',
    title: 'Results',
    description: 'Tangible output. Verified by the Aether protocol.',
  },
];

/** Demo weekly velocity (demo data for landing animation) */
const WEEKLY_BARS = [32, 45, 38, 58, 62, 71, 88];

function MasteryRing() {
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
        {/* Animated ring */}
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

        {/* Animated weekly graph — fixed track height so bars actually paint */}
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
          <div
            className="grid grid-cols-7 gap-1.5 sm:gap-2"
            style={{ height: 96 }}
            aria-hidden
          >
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

export function LandingPage() {
  const { user, loading } = useAuth();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden text-white"
      style={{
        backgroundColor: '#0a0a0a',
        backgroundImage:
          'radial-gradient(ellipse 40% 30% at 0% 0%, rgba(0,153,102,0.15), transparent 50%), radial-gradient(ellipse 40% 30% at 100% 100%, rgba(0,127,153,0.15), transparent 50%)',
      }}
    >
      {/* Nav — Figma TopNavBar */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-[12px]"
        style={{
          backgroundColor: 'rgba(13,21,22,0.8)',
          borderColor: '#3b494c',
        }}
      >
        <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="text-2xl font-black tracking-[-1.2px] text-[#c3f5ff]"
          >
            Aether
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#journeys"
              className="border-b-2 border-[#c3f5ff] pb-1.5 text-base font-bold text-[#c3f5ff]"
            >
              Journeys
            </a>
            <a
              href="#mastery"
              className="text-base font-normal text-[#bac9cc] hover:text-white transition-colors"
            >
              Mastery
            </a>
            <a
              href="#legacy"
              className="text-base font-normal text-[#bac9cc] hover:text-white transition-colors"
            >
              Legacy
            </a>
          </div>

          <Link
            to="/signup"
            className="rounded-lg bg-[#00e5ff] px-4 sm:px-6 py-2 text-sm sm:text-base font-bold text-[#00363d] hover:opacity-90 transition-opacity"
          >
            Begin Journey
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[52vh] sm:min-h-[58vh] items-center justify-center px-6 py-16 sm:py-20">
        <div className="mx-auto flex max-w-[896px] flex-col items-center gap-6 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-extrabold uppercase tracking-[-0.96px] leading-[1.1] text-white">
            ASCEND WITH AETHER.
          </h1>
          <p className="max-w-[672px] text-base sm:text-lg text-[#bac9cc] leading-[1.6]">
            A 6-month mastery protocol for the driven. Five journeys. One outcome:
            Excellence.
          </p>
          <div className="pt-4">
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#00ff87] bg-[#141414] px-8 sm:px-[42px] py-[18px] text-lg font-bold text-[#00ff87] shadow-[0_0_10px_rgba(0,255,135,0.2)] hover:bg-[rgba(0,255,135,0.08)] transition-colors"
            >
              Enter Aether
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* The Journeys */}
      <section
        id="journeys"
        className="mx-auto max-w-[1440px] px-4 sm:px-6 pb-16 sm:pb-24"
      >
        <div className="mb-8 sm:mb-16">
          <h2 className="text-2xl font-bold tracking-[-0.48px] text-white">
            The Journeys
          </h2>
          <div className="mt-2 h-1 w-24 rounded-full bg-[#c3f5ff]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {journeys.map((j) => {
            const Icon = j.icon;
            return (
              <div
                key={j.title}
                className="flex min-h-[280px] lg:min-h-[320px] flex-col justify-between rounded-2xl border border-[#222] bg-[#141414] p-8"
              >
                <div>
                  <div
                    className="flex size-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `rgba(${j.rgb}, 0.1)` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: j.color }} />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold tracking-[-0.48px] text-white">
                    {j.title}
                  </h3>
                  <p className="mt-2 text-base leading-6 text-[#bac9cc]">
                    {j.description}
                  </p>
                </div>
                <p
                  className="mt-6 text-xs font-bold tracking-[1.2px] uppercase"
                  style={{ color: j.color }}
                >
                  {j.tag}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Discipline as a Service */}
      <section
        id="mastery"
        className="bg-[#080f11] py-12 sm:py-16 lg:py-24"
      >
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-start gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="min-w-0 space-y-4 order-2 lg:order-1">
            <p className="text-xs font-bold tracking-[1.2px] uppercase text-[#c3f5ff]">
              THE SYSTEM
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-[-0.96px] leading-[1.1] text-white">
              Discipline as a Service.
            </h2>
            <p className="max-w-xl text-base sm:text-lg leading-[1.6] text-[#bac9cc]">
              Our proprietary Mastery Score tracks your 6-month trajectory across
              three critical vectors. There is no guesswork—only data-driven
              evolution.
            </p>

            <div className="flex flex-col gap-6 sm:gap-8 pt-4 sm:pt-6">
              {systemPillars.map((p) => (
                <div key={p.num} className="flex gap-4 sm:gap-6 items-start">
                  <div className="flex size-10 sm:size-12 shrink-0 items-center justify-center border border-[#3b494c] text-sm sm:text-base font-bold text-[#c3f5ff]">
                    {p.num}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xl sm:text-2xl font-bold tracking-[-0.48px] text-white">
                      {p.title}
                    </h4>
                    <p className="mt-1 text-sm sm:text-base text-[#bac9cc] leading-6">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 w-full min-w-0 lg:order-2 lg:flex lg:justify-center">
            <MasteryRing />
          </div>
        </div>
      </section>

      {/* Ready to Transmute */}
      <section
        id="legacy"
        className="relative overflow-hidden px-4 sm:px-6 py-20 sm:py-24 lg:py-32"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(0,255,135,0.18), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(0,229,255,0.12), transparent 55%), #0a0a0a',
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/45 pointer-events-none" />

        <div className="relative mx-auto flex max-w-[896px] flex-col items-center gap-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-[-0.96px] leading-[1.1] text-white">
            Ready to Transmute?
          </h2>
          <p className="text-base sm:text-lg text-[#bac9cc] leading-[1.6]">
            The next 6 months will pass regardless. Who will you be at the end of
            them?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2 w-full sm:w-auto">
            <Link
              to="/signup"
              className="rounded-xl bg-[#c3f5ff] px-10 py-5 text-lg font-bold text-[#00363d] hover:opacity-90 transition-opacity text-center"
            >
              Begin Journey
            </Link>
            <a
              href="#journeys"
              className="rounded-xl border border-[#849396] px-10 py-5 text-lg font-bold text-white hover:border-white transition-colors text-center"
            >
              View Protocol
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t bg-[#0d1516] py-10 sm:py-12"
        style={{ borderColor: '#3b494c' }}
      >
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-2xl font-black tracking-[-0.48px] text-[#c3f5ff]">
              Aether
            </p>
            <p className="mt-2 text-xs font-bold tracking-[1.2px] text-[#bac9cc]">
              © {new Date().getFullYear()} Aether. Discipline is Freedom.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 sm:gap-8">
            {['Privacy Policy', 'Terms of Service', 'Community', 'Support'].map(
              (label) => (
                <span
                  key={label}
                  className="text-xs font-bold tracking-[1.2px] text-[#bac9cc] cursor-default"
                >
                  {label}
                </span>
              )
            )}
          </div>

          <div className="flex gap-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-10 items-center justify-center rounded-full border border-[#3b494c] text-[#bac9cc] hover:text-white hover:border-[#bac9cc] transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </a>
            <a
              href="mailto:support@aether.app"
              className="flex size-10 items-center justify-center rounded-full border border-[#3b494c] text-[#bac9cc] hover:text-white hover:border-[#bac9cc] transition-colors"
              aria-label="Contact"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
