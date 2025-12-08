import { useGamification } from '../hooks/useGamification';
import { LevelBar } from '../components/ui/level-bar';
import { StreakIndicator } from '../components/ui/streak-indicator';
import { StatsWidget } from '../components/ui/stats-widget';
import { Card } from '../components/ui/card';
import { ProfileUpload } from '../components/auth/ProfileUpload';
import { User, Award, Calendar, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();
  const { xp, streaks, getLevel } = useGamification();
  const globalLevel = getLevel();

  const domainLevels = Object.keys(xp.domains || {}).map(domain => ({
    domain,
    level: getLevel(domain),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">Your progress and statistics</p>
      </div>

      <ProfileUpload />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.name || 'User'}</h2>
              <p className="text-muted-foreground">Ascension Journey</p>
            </div>
          </div>

          <div className="space-y-4">
            <LevelBar
              level={globalLevel.level}
              currentXP={globalLevel.currentXP}
              xpToNext={globalLevel.xpToNext}
            />
            <StreakIndicator
              currentStreak={streaks.current}
              longestStreak={streaks.longest}
            />
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <StatsWidget
            label="Total XP"
            value={xp.global.toLocaleString()}
            icon={Award}
          />
          <StatsWidget
            label="Current Streak"
            value={streaks.current}
            icon={Calendar}
          />
          <StatsWidget
            label="Longest Streak"
            value={streaks.longest}
            icon={Target}
          />
          <StatsWidget
            label="Active Domains"
            value={domainLevels.length}
          />
        </div>
      </div>

      {domainLevels.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Domain Levels</h3>
          <div className="space-y-4">
            {domainLevels.map(({ domain, level }) => (
              <div key={domain}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium capitalize">{domain.replace('-', ' ')}</span>
                  <span className="text-sm text-muted-foreground">Level {level.level}</span>
                </div>
                <LevelBar
                  level={level.level}
                  currentXP={level.currentXP}
                  xpToNext={level.xpToNext}
                  domain={domain}
                />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

