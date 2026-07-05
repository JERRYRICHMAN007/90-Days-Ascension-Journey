import {
  Dumbbell,
  Palette,
  BookOpen,
  PenTool,
  Code,
} from 'lucide-react';

export const JOURNEY_THEME = {
  'body-transformation': {
    id: 'body-transformation',
    label: 'Body Transformation',
    shortLabel: 'Body',
    path: '/body-transformation',
    icon: Dumbbell,
    tailwindGradient: 'from-orange-500 to-red-500',
    gradientClass: 'journey-body-gradient',
    borderClass: 'border-l-[4px] border-journey-body',
    iconBgClass: 'bg-journey-body',
    chartColor: '#00ff87',
  },
  'dual-brand': {
    id: 'dual-brand',
    label: 'Dual Brand',
    shortLabel: 'Brand',
    path: '/dual-brand',
    icon: Palette,
    tailwindGradient: 'from-cyan-400 to-cyan-600',
    gradientClass: 'journey-brand-gradient',
    borderClass: 'border-l-[4px] border-journey-brand',
    iconBgClass: 'bg-journey-brand',
    chartColor: '#00e5ff',
  },
  reading: {
    id: 'reading',
    label: 'Reading Journey',
    shortLabel: 'Reading',
    path: '/reading',
    icon: BookOpen,
    tailwindGradient: 'from-violet-400 to-violet-600',
    gradientClass: 'journey-reading-gradient',
    borderClass: 'border-l-[4px] border-journey-reading',
    iconBgClass: 'bg-journey-reading',
    chartColor: '#a78bfa',
  },
  writers: {
    id: 'writers',
    label: "Writer's Journey",
    shortLabel: 'Writing',
    path: '/writers',
    icon: PenTool,
    tailwindGradient: 'from-amber-400 to-amber-600',
    gradientClass: 'journey-writing-gradient',
    borderClass: 'border-l-[4px] border-journey-writing',
    iconBgClass: 'bg-journey-writing',
    chartColor: '#f59e0b',
  },
  'software-engineering': {
    id: 'software-engineering',
    label: 'Software Engineering',
    shortLabel: 'Software',
    path: '/software-engineering',
    icon: Code,
    tailwindGradient: 'from-blue-400 to-blue-600',
    gradientClass: 'journey-software-gradient',
    borderClass: 'border-l-[4px] border-journey-software',
    iconBgClass: 'bg-journey-software',
    chartColor: '#3b82f6',
  },
};

export const JOURNEY_IDS = Object.keys(JOURNEY_THEME);

export function getJourneyTheme(journeyId) {
  return JOURNEY_THEME[journeyId] ?? JOURNEY_THEME['body-transformation'];
}

export function getJourneyCardsConfig() {
  return JOURNEY_IDS.map((id) => JOURNEY_THEME[id]);
}
