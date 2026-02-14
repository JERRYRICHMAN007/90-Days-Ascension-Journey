import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Info, X, Trophy, Target, BookOpen, FileText, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Gamification Info Component
 * Displays clear information about what earns each gamification score
 */
export function GamificationInfo({ className }) {
  const [isOpen, setIsOpen] = useState(false);

  const earningRules = [
    {
      category: 'XP (Experience Points)',
      icon: Zap,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      rules: [
        {
          action: 'Complete a Task',
          xp: '10-50 XP',
          description: 'Easy tasks: 10 XP | Medium tasks: 25 XP | Hard tasks: 50 XP',
          icon: Target,
        },
        {
          action: 'Complete Daily Quiz',
          xp: '30-50 XP',
          description: 'Base: 30 XP | Performance bonus: up to 20 XP | Passing bonus: +20 XP',
          icon: BookOpen,
        },
        {
          action: 'Submit Reflection',
          xp: '15 XP',
          description: 'Earned when you submit your daily reflection',
          icon: FileText,
        },
        {
          action: 'Complete Project',
          xp: '25 XP',
          description: 'Earned when you complete a project component',
          icon: Trophy,
        },
      ],
    },
    {
      category: 'Streaks',
      icon: Trophy,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      rules: [
        {
          action: 'Daily Activity Streak',
          xp: '1 day per task',
          description: 'Your streak increases when you complete at least one task per day. Streaks reset if you miss a day.',
          icon: Target,
        },
      ],
    },
    {
      category: 'Achievements',
      icon: Trophy,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      rules: [
        {
          action: '3-Day Start',
          xp: 'Achievement',
          description: 'Maintain a 3-day streak',
          icon: Trophy,
        },
        {
          action: 'Week Warrior',
          xp: 'Achievement',
          description: 'Maintain a 7-day streak',
          icon: Trophy,
        },
        {
          action: 'Month Master',
          xp: 'Achievement',
          description: 'Maintain a 30-day streak',
          icon: Trophy,
        },
        {
          action: 'First Thousand',
          xp: 'Achievement',
          description: 'Earn 1,000 total XP',
          icon: Zap,
        },
      ],
    },
  ];

  const importantNotes = [
    'Day 0 (Testing Week) does NOT earn any gamification scores',
    'Scores are EARNED through actions, not automatically assigned',
    'Marking a day as "Complete" is just a status indicator - it does NOT earn points',
    'You must actually complete tasks, quizzes, reflections, or projects to earn scores',
  ];

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className={cn('gap-2', className)}
      >
        <Info className="w-4 h-4" />
        <span>How to Earn Scores</span>
      </Button>
    );
  }

  return (
    <Card className={cn('p-4 sm:p-6 border-2 border-primary/20', className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-display mb-1">
            How to Earn Gamification Scores
          </h3>
          <p className="text-sm text-muted-foreground">
            Scores are earned through specific actions, not automatically assigned
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="shrink-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {earningRules.map((category, idx) => {
          const Icon = category.icon;
          return (
            <div
              key={idx}
              className={cn(
                'p-4 rounded-lg border',
                category.bgColor,
                category.borderColor
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className={cn('w-5 h-5', category.color)} />
                <h4 className={cn('font-semibold', category.color)}>
                  {category.category}
                </h4>
              </div>
              <div className="space-y-3">
                {category.rules.map((rule, ruleIdx) => {
                  const RuleIcon = rule.icon;
                  return (
                    <div key={ruleIdx} className="pl-7 space-y-1">
                      <div className="flex items-center gap-2">
                        <RuleIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {rule.action}
                        </span>
                        <span className="text-sm font-semibold text-primary">
                          {rule.xp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-6">
                        {rule.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Important Notes
          </h4>
          <ul className="space-y-1.5 text-sm text-blue-600 dark:text-blue-400">
            {importantNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}











