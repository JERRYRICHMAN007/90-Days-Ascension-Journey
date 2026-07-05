import { Link, Navigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Dumbbell,
  Brain,
  BookOpen,
  PenTool,
  Code,
  Share2,
  Mail,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CTA_BG =
  'https://www.figma.com/api/mcp/asset/76848c42-8f67-43e8-bc47-71139d7231d1';

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
    title: 'Mindset',
    description: 'Develop the mental steel required for peak focus.',
    tag: 'FLOW STATE',
    color: '#00e5ff',
    rgb: '0,229,255',
    icon: Brain,
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
    description: 'Master the tools of digital creation and dominance.',
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
    description: 'Tangible output. Verified by the forge protocol.',
  },
];

function MasteryRing() {
  const size = 320;
  const stroke = 12;
  const r = (size - stroke) / 2 - 8;
  const c = 2 * Math.PI * r;
  const progress = 0.884;
  const offset = c * (1 - progress);

  return (
    <div className="relative size-[240px] sm:size-[280px] lg:size-[320px] shrink-0">
      <svg
        className="size-full -rotate-90"
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#3b494c"
          strokeWidth={stroke}
          opacity={0.4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#masteryGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ filter: 'drop-shadow(0 0 12px #00e5ff)' }}
        />
        <defs>
          <linearGradient id="masteryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#00ff87" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[12px] font-bold tracking-[1.2px] text-[#bac9cc] uppercase">
          MASTERY SCORE
        </p>
        <p className="text-[40px] sm:text-[48px] font-extrabold text-white tracking-[-0.96px] leading-none mt-1">
          88.4
        </p>
        <p className="mt-4 flex items-center gap-1 text-[12px] font-bold tracking-[1.2px] text-[#00ff87]">
          <ArrowUpRight className="w-3.5 h-3.5" />
          +12.2%
        </p>
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
            Forge90
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
            Launch App
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[70vh] sm:min-h-[80vh] items-center justify-center px-6 py-24 sm:py-32">
        <div className="mx-auto flex max-w-[896px] flex-col items-center gap-6 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-extrabold uppercase tracking-[-0.96px] leading-[1.1] text-white">
            FORGE YOUR LEGACY.
          </h1>
          <p className="max-w-[672px] text-base sm:text-lg text-[#bac9cc] leading-[1.6]">
            A 90-day mastery protocol for the driven. Five journeys. One outcome:
            Excellence.
          </p>
          <div className="pt-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#00ff87] bg-[#141414] px-8 sm:px-[42px] py-[18px] text-lg font-bold text-[#00ff87] shadow-[0_0_10px_rgba(0,255,135,0.2)] hover:bg-[rgba(0,255,135,0.08)] transition-colors"
            >
              Enter the Forge
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
        className="bg-[#080f11] py-16 sm:py-24"
      >
        <div className="mx-auto flex max-w-[1440px] flex-col lg:flex-row items-center gap-12 lg:gap-16 px-4 sm:px-6">
          <div className="flex-1 min-w-0 space-y-4">
            <p className="text-xs font-bold tracking-[1.2px] uppercase text-[#c3f5ff]">
              THE SYSTEM
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-[-0.96px] leading-[1.1] text-white">
              Discipline as a Service.
            </h2>
            <p className="max-w-xl text-base sm:text-lg leading-[1.6] text-[#bac9cc]">
              Our proprietary Mastery Score tracks your 90-day trajectory across
              three critical vectors. There is no guesswork—only data-driven
              evolution.
            </p>

            <div className="flex flex-col gap-8 pt-6">
              {systemPillars.map((p) => (
                <div key={p.num} className="flex gap-6 items-start">
                  <div className="flex size-12 shrink-0 items-center justify-center border border-[#3b494c] text-base font-bold text-[#c3f5ff]">
                    {p.num}
                  </div>
                  <div>
                    <h4 className="text-xl sm:text-2xl font-bold tracking-[-0.48px] text-white">
                      {p.title}
                    </h4>
                    <p className="mt-1 text-base text-[#bac9cc] leading-6">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <MasteryRing />
          </div>
        </div>
      </section>

      {/* Ready to Transmute */}
      <section
        id="legacy"
        className="relative overflow-hidden px-4 sm:px-6 py-24 sm:py-32"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src={CTA_BG}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0a0a0a]/60" />
        </div>

        <div className="relative mx-auto flex max-w-[896px] flex-col items-center gap-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold tracking-[-0.96px] leading-[1.1] text-white">
            Ready to Transmute?
          </h2>
          <p className="text-base sm:text-lg text-[#bac9cc] leading-[1.6]">
            The next 90 days will pass regardless. Who will you be at the end of
            them?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-2">
            <Link
              to="/signup"
              className="rounded-xl bg-[#c3f5ff] px-10 py-5 text-lg font-bold text-[#00363d] hover:opacity-90 transition-opacity"
            >
              Begin Journey
            </Link>
            <a
              href="#journeys"
              className="rounded-xl border border-[#849396] px-10 py-5 text-lg font-bold text-white hover:border-white transition-colors"
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
              Forge90
            </p>
            <p className="mt-2 text-xs font-bold tracking-[1.2px] text-[#bac9cc]">
              © {new Date().getFullYear()} Forge90. Discipline is Freedom.
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
              href="mailto:support@forge90.app"
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
