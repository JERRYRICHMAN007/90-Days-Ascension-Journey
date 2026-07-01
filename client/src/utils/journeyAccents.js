export const JOURNEY_ACCENTS = {
  'body-transformation': {
    color: '#00ff87',
    rgb: '0,255,135',
    light: '#00ffaa',
    glow: '0 0 20px rgba(0,255,135,0.3)',
    label: 'Body',
    icon: '💪',
  },
  'dual-brand': {
    color: '#00e5ff',
    rgb: '0,229,255',
    light: '#00f0ff',
    glow: '0 0 20px rgba(0,229,255,0.3)',
    label: 'Dual Brand',
    icon: '🚀',
  },
  reading: {
    color: '#a78bfa',
    rgb: '167,139,250',
    light: '#c4b5fd',
    glow: '0 0 20px rgba(167,139,250,0.3)',
    label: 'Reading',
    icon: '📚',
  },
  writers: {
    color: '#f59e0b',
    rgb: '245,158,11',
    light: '#fbbf24',
    glow: '0 0 20px rgba(245,158,11,0.3)',
    label: 'Writing',
    icon: '✍️',
  },
  'software-engineering': {
    color: '#3b82f6',
    rgb: '59,130,246',
    light: '#60a5fa',
    glow: '0 0 20px rgba(59,130,246,0.3)',
    label: 'Software',
    icon: '💻',
  },
};

export function getJourneyAccent(journeyId) {
  return JOURNEY_ACCENTS[journeyId] || JOURNEY_ACCENTS['body-transformation'];
}
