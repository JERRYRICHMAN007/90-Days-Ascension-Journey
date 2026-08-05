/** Curated onboarding options — chips + optional "Other" text */

export const GOAL_ACHIEVE_OPTIONS = [
  { id: 'lose-weight', label: 'Lose weight / body fat' },
  { id: 'build-muscle', label: 'Build muscle & strength' },
  { id: 'consistency', label: 'Build consistency' },
  { id: 'energy', label: 'Improve energy & health' },
  { id: 'skill', label: 'Master a new skill' },
  { id: 'reading', label: 'Read more books' },
  { id: 'brand', label: 'Grow my personal brand' },
  { id: 'mindset', label: 'Develop discipline & mindset' },
];

export const GOAL_WHY_OPTIONS = [
  { id: 'health', label: 'Better long-term health' },
  { id: 'confidence', label: 'More confidence' },
  { id: 'family', label: 'For my family' },
  { id: 'career', label: 'Career advancement' },
  { id: 'legacy', label: 'Leave a legacy' },
  { id: 'freedom', label: 'Financial freedom' },
];

export const SUCCESS_LOOKS_OPTIONS = [
  { id: 'visible-progress', label: 'Visible physical progress' },
  { id: 'habit-streak', label: '30+ day habit streak' },
  { id: 'finish-program', label: 'Complete the full program' },
  { id: 'measurable', label: 'Hit a measurable target' },
  { id: 'feel-strong', label: 'Feel stronger & energized' },
];

export const MOTIVATION_OPTIONS = [
  { id: 'accountability', label: 'Accountability' },
  { id: 'competition', label: 'Healthy competition' },
  { id: 'growth', label: 'Personal growth' },
  { id: 'community', label: 'Community support' },
  { id: 'reward', label: 'Rewards & milestones' },
];

export const FITNESS_LEVEL_OPTIONS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'returning', label: 'Returning after a break' },
];

export const CURRENT_ACTIVITY_OPTIONS = [
  { id: 'sedentary', label: 'Mostly sedentary' },
  { id: 'light', label: 'Light activity' },
  { id: 'moderate', label: 'Moderate exercise' },
  { id: 'active', label: 'Very active' },
  { id: 'athlete', label: 'Training regularly' },
];

export const CHALLENGE_OPTIONS = [
  { id: 'time', label: 'Limited time' },
  { id: 'motivation', label: 'Staying motivated' },
  { id: 'consistency', label: 'Inconsistent schedule' },
  { id: 'injury', label: 'Past injury / recovery' },
  { id: 'stress', label: 'Stress & fatigue' },
  { id: 'knowledge', label: 'Not sure where to start' },
];

export const TIME_AVAILABLE_OPTIONS = [
  { id: '15', label: '15 minutes' },
  { id: '30', label: '30 minutes' },
  { id: '45', label: '45 minutes' },
  { id: '60', label: '1 hour' },
  { id: '90', label: '90+ minutes' },
];

export const SELF_DESCRIPTION_OPTIONS = [
  { id: 'starter', label: 'Just getting started' },
  { id: 'busy-professional', label: 'Busy professional' },
  { id: 'parent', label: 'Parent / caregiver' },
  { id: 'student', label: 'Student' },
  { id: 'creator', label: 'Creator / entrepreneur' },
];

/** Merge chip selections + other text into a stored string field */
export function selectionsToText(selectedIds, options, otherText) {
  const labels = (selectedIds || [])
    .map((id) => options.find((o) => o.id === id)?.label)
    .filter(Boolean);
  if (otherText?.trim()) labels.push(otherText.trim());
  return labels.join('\n');
}

/** Parse stored text back to ids where possible */
export function textToSelections(text, options) {
  if (!text?.trim()) return { ids: [], other: '' };
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const ids = [];
  const otherParts = [];
  lines.forEach((line) => {
    const match = options.find((o) => o.label.toLowerCase() === line.toLowerCase());
    if (match) ids.push(match.id);
    else otherParts.push(line);
  });
  return { ids, other: otherParts.join('\n') };
}
