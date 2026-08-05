import { Dumbbell, Palette, BookOpen, PenTool, Code } from 'lucide-react';

/** Public-facing journey cards — written for a general audience */
export const journeys = [
  {
    title: 'Body',
    description: 'Build strength, energy, and daily discipline over 6 months.',
    tag: 'PHYSICAL MASTERY',
    color: '#00ff87',
    rgb: '0,255,135',
    icon: Dumbbell,
  },
  {
    title: 'Dual Brand',
    description: 'Grow a personal brand and a business brand — audience and revenue that compound.',
    tag: 'BRAND BUILDING',
    color: '#00e5ff',
    rgb: '0,229,255',
    icon: Palette,
  },
  {
    title: 'Reading',
    description: 'Read deeply, reflect often, and turn ideas into weekly action.',
    tag: 'KNOWLEDGE',
    color: '#a78bfa',
    rgb: '167,139,250',
    icon: BookOpen,
  },
  {
    title: 'Writing',
    description: 'Publish consistently and build a creative output habit that lasts.',
    tag: 'CREATIVE OUTPUT',
    color: '#f59e0b',
    rgb: '245,158,11',
    icon: PenTool,
  },
  {
    title: 'Software',
    description: 'Learn frontend and backend, then ship a full-stack capstone by month 6.',
    tag: 'FULL STACK',
    color: '#3b82f6',
    rgb: '59,130,246',
    icon: Code,
  },
];

export const systemPillars = [
  {
    num: '01',
    title: 'Consistency',
    description: 'Small daily actions compound into lasting change.',
  },
  {
    num: '02',
    title: 'Intensity',
    description: 'Show up fully. Push your edge without burning out.',
  },
  {
    num: '03',
    title: 'Results',
    description: 'Measure progress with real output, not just intention.',
  },
];

export const LANDING_MESH_BG = {
  backgroundColor: 'var(--bg-primary)',
  backgroundImage: 'var(--aether-mesh-bg)',
};

export const NAV_ITEMS = [
  { to: '/journeys', label: 'Journeys' },
  { to: '/mastery', label: 'Mastery' },
  { to: '/legacy', label: 'Legacy' },
];
