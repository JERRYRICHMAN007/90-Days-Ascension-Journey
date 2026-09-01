import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Rocket,
  User,
  Bell,
  Palette,
  Wand2,
  Shield,
  Database,
  Info,
  PlayCircle,
  RotateCcw,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { ThemeToggleButton } from '../components/layout/ThemeToggleButton';
import { SettingsSection, SettingsRow } from '../components/settings/SettingsSection.jsx';
import { SettingsConfirmDialog } from '../components/settings/SettingsConfirmDialog.jsx';
import { SettingsToast } from '../components/settings/SettingsToast.jsx';
import {
  getJourneyBulkSummary,
  enableAllConfiguredJourneys,
  resetAllJourneysProgress,
  getGlobalRemindersEnabled,
  setGlobalRemindersEnabled,
} from '../utils/journeyBulkActions.js';
import { restartProductTour } from '../utils/productTour.js';
import { APP_RELEASE } from '../utils/appRelease.js';

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reminders, setReminders] = useState(getGlobalRemindersEnabled);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState('success');
  const [enableConfirmOpen, setEnableConfirmOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [tick, setTick] = useState(0);

  const summary = useMemo(() => getJourneyBulkSummary(), [tick]);
  const configuredCount = summary.filter((j) => j.configured).length;
  const activeCount = summary.filter((j) => j.started).length;
  const readyToStart = summary.filter((j) => j.configured && !j.started).length;
  const unconfigured = summary.filter((j) => !j.configured);

  useEffect(() => {
    setReminders(getGlobalRemindersEnabled());
  }, []);

  const showToast = (message, type = 'success') => {
    setToastType(type);
    setToast(message);
  };

  const handleEnableAll = () => {
    if (configuredCount === 0) {
      showToast('No set-up journeys yet — complete setup on each journey first.', 'error');
      return;
    }
    setEnableConfirmOpen(true);
  };

  const confirmEnableAll = () => {
    setEnableConfirmOpen(false);
    const result = enableAllConfiguredJourneys();
    setTick((t) => t + 1);

    if (result.started > 0) {
      showToast(
        `All configured journeys have been enabled successfully (${result.started} started${result.alreadyActive ? `, ${result.alreadyActive} already active` : ''}).`
      );
    } else if (result.alreadyActive > 0) {
      showToast(`All configured journeys are already active (${result.alreadyActive}).`);
    } else {
      showToast('No journeys were ready to start.', 'error');
    }

    if (result.unconfigured.length > 0) {
      window.setTimeout(() => {
        showToast(
          `${result.unconfigured.length} journey(s) still need setup: ${result.unconfigured.map((j) => j.title).join(', ')}.`,
          'error'
        );
      }, 3800);
    }
  };

  const confirmResetAll = () => {
    setResetConfirmOpen(false);
    const count = resetAllJourneysProgress();
    setTick((t) => t + 1);
    showToast(
      `Progress reset for ${count} journeys. Start dates set to today — enable or start each journey to begin at Day 1.`
    );
  };

  const enableConfirmDescription =
    readyToStart > 0
      ? `This will start ${readyToStart} journey${readyToStart === 1 ? '' : 's'} that are set up but not active yet. Each keeps its own schedule and reminders.${
          unconfigured.length
            ? ` ${unconfigured.length} journey(s) still need setup and will be skipped.`
            : ''
        }`
      : activeCount === configuredCount && configuredCount > 0
        ? `All ${configuredCount} set-up journey${configuredCount === 1 ? ' is' : 's are'} already active.`
        : `No journeys are waiting to start right now.`;

  const journeyStats = [
    { label: 'Set up', hint: 'Schedule & goals saved', value: configuredCount },
    { label: 'Active', hint: 'Progress tracking on', value: activeCount },
    { label: 'Ready', hint: 'Set up, not started', value: readyToStart },
  ];

  return (
    <div className="w-full space-y-5 pb-8">
      <SettingsToast message={toast} type={toastType} />

      <SettingsConfirmDialog
        open={enableConfirmOpen}
        title="Enable all set-up journeys?"
        description={enableConfirmDescription}
        confirmLabel="Enable all"
        onConfirm={confirmEnableAll}
        onCancel={() => setEnableConfirmOpen(false)}
      />

      <SettingsConfirmDialog
        open={resetConfirmOpen}
        title="Reset all journey progress?"
        description="This cannot be undone. Clears all progress, quizzes, notes, streaks, and XP for every journey. Start dates reset to today — when you enable or start again, that date becomes Day 1. Goals and plan setup are kept."
        confirmLabel="Reset all progress"
        variant="danger"
        onConfirm={confirmResetAll}
        onCancel={() => setResetConfirmOpen(false)}
      />

      <header>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Your control center for Aether</p>
      </header>

      {/* Account */}
      <SettingsSection
        icon={User}
        title="Account"
        description="Profile and sign-in details"
      >
        <SettingsRow
          label={user?.name || 'Guest'}
          description={user?.email || 'Sign in to sync across devices'}
        >
          <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={() => navigate('/profile')}>
            Edit profile <ChevronRight className="size-3 ml-0.5" />
          </Button>
        </SettingsRow>
      </SettingsSection>

      {/* Journey Management */}
      <SettingsSection
        icon={Rocket}
        title="Journey management"
        description="Global controls for all your journeys — enable or reset progress without losing your setup"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-1">
          {journeyStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-[var(--border-subtle)] px-3 py-2.5 text-center bg-[var(--bg-primary)]/50"
            >
              <p className="text-lg font-bold text-[var(--text-primary)]">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{stat.label}</p>
              <p className="text-[9px] text-[var(--text-muted)] mt-0.5 leading-snug">{stat.hint}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <Button
            className="rounded-full flex-1 gap-2"
            style={{ background: 'var(--neon-green)', color: '#0a0a0a' }}
            onClick={handleEnableAll}
          >
            <PlayCircle className="size-4" />
            Enable all journeys
          </Button>
          <Button
            variant="outline"
            className="rounded-full flex-1 gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={() => setResetConfirmOpen(true)}
          >
            <RotateCcw className="size-4" />
            Reset all journeys
          </Button>
        </div>

        {unconfigured.length > 0 && (
          <p className="text-[11px] text-[var(--text-muted)] px-1">
            Needs setup: {unconfigured.map((j) => j.title).join(', ')}
          </p>
        )}
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection
        icon={Bell}
        title="Notifications"
        description="Reminders and alerts across your journeys"
      >
        <SettingsRow
          label="Journey reminders"
          description="Gentle nudges before scheduled activities. Per-journey times are set in each journey's setup."
        >
          <input
            type="checkbox"
            checked={reminders}
            onChange={() => {
              const next = !reminders;
              setReminders(next);
              setGlobalRemindersEnabled(next);
              showToast(next ? 'Reminders enabled globally.' : 'Reminders paused globally.');
            }}
            className="size-4 rounded accent-[var(--neon-green)]"
            aria-label="Journey reminders"
          />
        </SettingsRow>
      </SettingsSection>

      {/* Appearance */}
      <SettingsSection icon={Palette} title="Appearance" description="Theme and visual style">
        <SettingsRow label="Quick toggle" description="Switch light and dark mode">
          <ThemeToggleButton />
        </SettingsRow>
        <div>
          <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">Color palette</p>
          <div className="flex flex-wrap gap-2">
            {themeOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTheme(opt.value)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                    theme === opt.value
                      ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/10 text-[var(--neon-green)]'
                      : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <Icon className="size-3.5" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </SettingsSection>

      {/* AI Assistant */}
      <SettingsSection
        icon={Wand2}
        title="AI assistant"
        description="Journey-scoped planning coach on each journey overview"
      >
        <SettingsRow
          label="Per-journey AI coach"
          description="Each journey has its own scoped assistant. Open any journey and use the overview tab to customize with natural language."
        >
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
            onClick={() => navigate('/dashboard')}
          >
            Go to journeys
          </Button>
        </SettingsRow>
      </SettingsSection>

      {/* Privacy */}
      <SettingsSection icon={Shield} title="Privacy & security" description="Data and account safety">
        <SettingsRow label="Session timeout" description="Automatic sign-out after 30 minutes of inactivity">
          <span className="text-xs text-[var(--text-muted)]">Enabled</span>
        </SettingsRow>
        <SettingsRow label="Local-first data" description="Progress is stored on this device. Sign in to sync when available.">
          <span className="text-xs text-[var(--text-muted)]">Active</span>
        </SettingsRow>
      </SettingsSection>

      {/* Data & Backup */}
      <SettingsSection icon={Database} title="Data & backup" description="Export and manage your data">
        <SettingsRow label="Export progress" description="Download your journey data as JSON">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
            onClick={() => {
              try {
                const data = {
                  exportedAt: new Date().toISOString(),
                  sessionCompletions: JSON.parse(localStorage.getItem('sessionCompletions') || '{}'),
                  xp: JSON.parse(localStorage.getItem('aetherXP') || '{}'),
                  streaks: JSON.parse(localStorage.getItem('aetherStreaks') || '{}'),
                  journeyStarts: JSON.parse(localStorage.getItem('aetherJourneyStarts') || '{}'),
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `aether-export-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                showToast('Progress exported successfully.');
              } catch {
                showToast('Export failed. Please try again.', 'error');
              }
            }}
          >
            Export
          </Button>
        </SettingsRow>
      </SettingsSection>

      {/* About */}
      <SettingsSection icon={Info} title="About" description="Application information">
        <SettingsRow label="Aether" description="Personal journey operating system">
          <span className="text-xs font-mono text-[var(--text-muted)]">v{APP_RELEASE}</span>
        </SettingsRow>
        <SettingsRow
          label="New user guide"
          description="Replay the walkthrough for creating and customizing a journey"
        >
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
            onClick={() => {
              restartProductTour();
              navigate('/dashboard');
            }}
          >
            <Sparkles className="size-3.5 mr-1" /> Replay guide
          </Button>
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
