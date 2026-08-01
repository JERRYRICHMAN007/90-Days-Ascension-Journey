import { Dumbbell, Palette, BookOpen, PenTool, Code } from 'lucide-react';

export const journeys = [
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

export const systemPillars = [
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

export const LANDING_MESH_BG = {
  backgroundColor: '#0a0a0a',
  backgroundImage:
    'radial-gradient(ellipse 40% 30% at 0% 0%, rgba(0,153,102,0.15), transparent 50%), radial-gradient(ellipse 40% 30% at 100% 100%, rgba(0,127,153,0.15), transparent 50%)',
};

export const NAV_ITEMS = [
  { to: '/journeys', label: 'Journeys' },
  { to: '/mastery', label: 'Mastery' },
  { to: '/legacy', label: 'Legacy' },
];
