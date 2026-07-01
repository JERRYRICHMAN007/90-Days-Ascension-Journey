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
    chartColor: 'hsl(142, 76%, 46%)',
  },
  'dual-brand': {
    id: 'dual-brand',
    label: 'Dual Brand',
    shortLabel: 'Brand',
    path: '/dual-brand',
    icon: Palette,
    tailwindGradient: 'from-pink-500 to-purple-500',
    gradientClass: 'journey-brand-gradient',
    borderClass: 'border-l-[4px] border-journey-brand',
    iconBgClass: 'bg-journey-brand',
    chartColor: 'hsl(280, 87%, 60%)',
  },
  reading: {
    id: 'reading',
    label: 'Reading Journey',
    shortLabel: 'Reading',
    path: '/reading',
    icon: BookOpen,
    tailwindGradient: 'from-blue-500 to-cyan-500',
    gradientClass: 'journey-reading-gradient',
    borderClass: 'border-l-[4px] border-journey-reading',
    iconBgClass: 'bg-journey-reading',
    chartColor: 'hsl(199, 89%, 55%)',
  },
  writers: {
    id: 'writers',
    label: "Writer's Journey",
    shortLabel: 'Writing',
    path: '/writers',
    icon: PenTool,
    tailwindGradient: 'from-green-500 to-emerald-500',
    gradientClass: 'journey-writing-gradient',
    borderClass: 'border-l-[4px] border-journey-writing',
    iconBgClass: 'bg-journey-writing',
    chartColor: 'hsl(25, 95%, 58%)',
  },
  'software-engineering': {
    id: 'software-engineering',
    label: 'Software Engineering',
    shortLabel: 'Software',
    path: '/software-engineering',
    icon: Code,
    tailwindGradient: 'from-violet-500 to-purple-500',
    gradientClass: 'journey-software-gradient',
    borderClass: 'border-l-[4px] border-journey-software',
    iconBgClass: 'bg-journey-software',
    chartColor: 'hsl(217, 91%, 65%)',
  },
};

export const JOURNEY_IDS = Object.keys(JOURNEY_THEME);

export function getJourneyTheme(journeyId) {
  return JOURNEY_THEME[journeyId] ?? JOURNEY_THEME['body-transformation'];
}

export function getJourneyCardsConfig() {
  return JOURNEY_IDS.map((id) => JOURNEY_THEME[id]);
}
