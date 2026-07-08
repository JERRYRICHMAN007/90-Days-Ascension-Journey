import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGamification } from '../hooks/useGamification';
import { LevelBar } from '../components/ui/level-bar';
import { StreakIndicator } from '../components/ui/streak-indicator';
import { StatsWidget } from '../components/ui/stats-widget';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AchievementTile } from '../components/ui/achievement-tile';
import { ProfilePhotoModal } from '../components/profile/ProfilePhotoModal';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Award, 
  Calendar, 
  Target, 
  Link2, 
  Edit, 
  Upload,
  Trophy,
  Flame,
  Star,
  Zap,
  Info,
  Lock
} from 'lucide-react';

// Achievement definitions matching AchievementsPage
const allAchievements = [
  {
    id: '3-day-start',
    title: '3-Day Start',
    description: 'Maintain a 3-day streak',
    icon: Flame,
    category: 'streak',
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Complete 7 days in a row',
    icon: Trophy,
    category: 'streak',
  },
  {
    id: 'month-master',
    title: 'Month Master',
    description: 'Achieve a 30-day streak',
    icon: Star,
    category: 'streak',
  },
  {
    id: 'first-thousand',
    title: 'First Thousand',
    description: 'Earn 1,000 XP',
    icon: Target,
    category: 'xp',
  },
  {
    id: 'body-builder',
    title: 'Body Builder',
    description: 'Complete 30 body transformation tasks',
    icon: Zap,
    category: 'domain',
  },
];

export function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { xp, streaks, achievements, getLevel } = useGamification();
  const globalLevel = getLevel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const domainLevels = Object.keys(xp.domains || {}).map(domain => ({
    domain,
    level: getLevel(domain),
  }));

  const getProgress = (achievementId) => {
    switch (achievementId) {
      case '3-day-start':
        return Math.min((streaks.current / 3) * 100, 100);
      case 'week-warrior':
        return Math.min((streaks.current / 7) * 100, 100);
      case 'month-master':
        return Math.min((streaks.current / 30) * 100, 100);
      case 'first-thousand':
        return Math.min((xp.global / 1000) * 100, 100);
      default:
        return 0;
    }
  };

  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${user?.id || 'user'}`;
    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const unlockedAchievements = allAchievements.filter(ach => achievements.includes(ach.id));
  const lockedAchievements = allAchievements.filter(ach => !achievements.includes(ach.id));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Your Forge184 identity and stats</p>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Details */}
          <div className="lg:col-span-1">
            <Card className="p-6 glass-panel border-border/50">
              {/* Header with Edit button */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-foreground">Personal details</h2>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  aria-label="Edit profile picture"
                >
                  <Edit className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Profile Picture - Clickable for Upload */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group cursor-pointer" onClick={() => setIsModalOpen(true)}>
                  {user?.avatarUrl ? (
                    <div className="relative">
                      <img
                        src={user.avatarUrl}
                        alt={user.name || 'Profile'}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md mb-4"
                      />
                      <div className="absolute bottom-2 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
                        <Upload className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center text-4xl font-bold text-white shadow-md mb-4">
                        {user?.name?.charAt(0).toUpperCase() || 'J'}
                      </div>
                      <div className="absolute bottom-2 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
                        <Upload className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-foreground text-center">
                  {user?.name || 'Jerry'}
                </h3>
              </div>

              {/* Profile Photo Modal */}
              <ProfilePhotoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />

              {/* Share Profile Link Button */}
              {copied && (
                <p className="text-xs text-primary text-center mb-2">Link copied!</p>
              )}
              <Button
                variant="outline"
                className="w-full mb-3"
                onClick={handleShareProfile}
              >
                <Link2 className="w-4 h-4 mr-2" />
                Share profile link
              </Button>

              {/* Update Profile Visibility Link */}
              <button
                className="w-full text-left text-blue-600 dark:text-blue-400 hover:underline text-sm py-2 mb-6"
                onClick={() => alert('Profile visibility settings coming soon!')}
              >
                Update profile visibility
              </button>

              {/* Level Information */}
              <div className="pt-6 border-t border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-semibold text-foreground">
                    Level {globalLevel.level}
                  </span>
                </div>
                <div className="mb-2">
                  <LevelBar
                    level={globalLevel.level}
                    currentXP={globalLevel.currentXP}
                    xpToNext={globalLevel.xpToNext}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {globalLevel.currentXP} / {globalLevel.xpToNext} XP
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column - Achievements */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements Section */}
            <Card className="p-6 glass-panel border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xl font-bold text-foreground">Achievements</h2>
                <Info className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground">
                  Showcase your achievements and badges to demonstrate your progress and accomplishments in your Forge184 journey.
                </p>
              </div>

              {/* Unlocked Achievements */}
              {unlockedAchievements.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-foreground mb-4">
                    Unlocked ({unlockedAchievements.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {unlockedAchievements.map((achievement) => {
                      const Icon = achievement.icon;
                      return (
                        <AchievementTile
                          key={achievement.id}
                          title={achievement.title}
                          description={achievement.description}
                          icon={Icon}
                          unlocked={true}
                          progress={100}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* In Progress Achievements */}
              {lockedAchievements.length > 0 && (
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-4">
                    In Progress ({lockedAchievements.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {lockedAchievements.map((achievement) => {
                      const Icon = achievement.icon;
                      const progress = getProgress(achievement.id);
                      return (
                        <AchievementTile
                          key={achievement.id}
                          title={achievement.title}
                          description={achievement.description}
                          icon={Icon}
                          unlocked={false}
                          progress={progress}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No achievements message */}
              {allAchievements.length === 0 && (
                <div className="text-center py-12">
                  <Award className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-muted-foreground">
                    No achievements available yet. Start completing tasks to unlock achievements!
                  </p>
                </div>
              )}
            </Card>

            {/* Statistics Section */}
            <Card className="p-6 glass-panel border-border/50">
              <h2 className="text-xl font-bold text-foreground mb-6">Statistics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                  label="Achievements"
                  value={unlockedAchievements.length}
                  icon={Trophy}
                />
              </div>
            </Card>

            {/* Domain Levels Section */}
            {domainLevels.length > 0 && (
              <Card className="p-6 glass-panel border-border/50">
                <h2 className="text-xl font-bold text-foreground mb-6">Domain Levels</h2>
                <div className="space-y-4">
                  {domainLevels.map(({ domain, level }) => (
                    <div key={domain} className="pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground capitalize">
                          {domain.replace('-', ' ')}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Level {level.level}
                        </span>
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
        </div>
    </div>
  );
}
