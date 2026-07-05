/** Journey accents — exact values from Figma Frames 1–7 */
export const JOURNEY_ACCENTS = {
  'body-transformation': {
    color: '#00ff87',
    rgb: '0,255,135',
    light: '#00ba62',
    glow: '0 0 12px #00ff87',
    label: 'Body',
    fullLabel: 'Body Transformation',
    subtitle: 'Physiological Baseline',
    icon: '💪',
    pathTag: 'ELITE PATH',
  },
  'dual-brand': {
    color: '#00e5ff',
    rgb: '0,229,255',
    light: '#009fb1',
    glow: '0 0 12px #00e5ff',
    label: 'Brand',
    fullLabel: 'Dual Brand',
    subtitle: 'Market Authority',
    icon: '🚀',
    pathTag: 'VANGUARD PATH',
  },
  reading: {
    color: '#a78bfa',
    rgb: '167,139,250',
    light: '#7c3aed',
    glow: '0 0 12px #a78bfa',
    label: 'Reading',
    fullLabel: 'Reading',
    subtitle: 'Knowledge Depth',
    icon: '📚',
    pathTag: 'SCHOLAR PATH',
  },
  writers: {
    color: '#f59e0b',
    rgb: '245,158,11',
    light: '#b45309',
    glow: '0 0 12px #f59e0b',
    label: 'Writing',
    fullLabel: 'Writing',
    subtitle: 'Creative Output',
    icon: '✍️',
    pathTag: 'CRAFT PATH',
  },
  'software-engineering': {
    color: '#3b82f6',
    rgb: '59,130,246',
    light: '#1d4ed8',
    glow: '0 0 12px #3b82f6',
    label: 'Engineering',
    fullLabel: 'Software Engineering',
    subtitle: 'Systems Mastery',
    icon: '💻',
    pathTag: 'TECHNICIAN PATH',
  },
};

const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

export function masteryToRank(score) {
  const n = Math.min(10, Math.max(0, Math.floor(Number(score) / 10)));
  return ROMAN[n] || 'I';
}

export function getJourneyAccent(journeyId) {
  return JOURNEY_ACCENTS[journeyId] || JOURNEY_ACCENTS['body-transformation'];
}
