import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

const DOMAIN_ACHIEVEMENTS = [
  { id: 'first-week', title: 'First Week', desc: 'Complete 7 days of tasks' },
  { id: 'consistency-30', title: '30-Day Streak', desc: 'Stay consistent for 30 days' },
  { id: 'halfway', title: 'Halfway There', desc: 'Reach 50% completion' },
  { id: 'mastery', title: 'Journey Mastery', desc: 'Complete the full arc' },
];

export function JourneyAchievementsPage({ journeyId, progressPercentage, completedDays }) {
  const unlocked = [
    completedDays >= 7,
    completedDays >= 30,
    progressPercentage >= 50,
    progressPercentage >= 100,
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      <h2 className="font-display text-lg font-bold text-[var(--text-primary)]">Achievements</h2>
      <div className="space-y-3">
        {DOMAIN_ACHIEVEMENTS.map((a, i) => (
          <div
            key={a.id}
            className={`flex items-center gap-4 rounded-xl border p-4 ${
              unlocked[i]
                ? 'border-[var(--neon-green)]/30 bg-[var(--neon-green)]/5'
                : 'border-[var(--border-subtle)] bg-[var(--bg-card)] opacity-60'
            }`}
          >
            <Trophy className={`size-8 ${unlocked[i] ? 'text-[var(--neon-green)]' : 'text-[var(--text-muted)]'}`} />
            <div>
              <p className="font-semibold text-[var(--text-primary)]">{a.title}</p>
              <p className="text-xs text-[var(--text-secondary)]">{a.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <Link to="/achievements" className="text-sm text-[var(--neon-cyan-alt)] hover:underline">
        View all achievements →
      </Link>
    </div>
  );
}
