import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/ui/card';
import { Dropdown } from '../components/ui/dropdown';
import {
  DEFAULT_JOURNEY_START,
  formatYmd,
  getJourneyEndDate,
  getJourneyTotalDays,
  getStoredJourneyStartDate,
  JOURNEY_DURATION_MONTHS,
  setJourneyStartDate,
} from '../utils/dates';

const themeOptions = [
  { value: 'vibrant', label: 'Vibrant', icon: Sparkles },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

function formatDisplayDate(ymd) {
  try {
    const [y, m, d] = ymd.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return ymd;
  }
}

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [startDate, setStartDate] = useState(getStoredJourneyStartDate);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    const onUpdate = (e) => {
      const next = e?.detail?.startDate || getStoredJourneyStartDate();
      setStartDate(next);
    };
    window.addEventListener('journey-start-updated', onUpdate);
    return () => window.removeEventListener('journey-start-updated', onUpdate);
  }, []);

  const summary = useMemo(() => {
    const end = getJourneyEndDate();
    const total = getJourneyTotalDays();
    return {
      endYmd: formatYmd(end),
      endLabel: formatDisplayDate(formatYmd(end)),
      totalDays: total,
    };
  }, [startDate]);

  const handleStartChange = (e) => {
    const value = e.target.value;
    if (!value) return;
    setStartDate(value);
    setJourneyStartDate(value);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  };

  const useToday = () => {
    const today = formatYmd(new Date());
    setStartDate(today);
    setJourneyStartDate(today);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  };

  const useDefault = () => {
    setStartDate(DEFAULT_JOURNEY_START);
    setJourneyStartDate(DEFAULT_JOURNEY_START);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      <Card className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarDays className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Journey start date</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your {JOURNEY_DURATION_MONTHS}-month countdown begins on the day you choose
              (Day 1). End date updates automatically.
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <div>
            <label htmlFor="journey-start" className="text-sm font-medium mb-2 block">
              Day 1
            </label>
            <input
              id="journey-start"
              type="date"
              value={startDate}
              onChange={handleStartChange}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm space-y-1">
            <p>
              <span className="text-muted-foreground">Starts:</span>{' '}
              <span className="font-medium">{formatDisplayDate(startDate)}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Ends ({JOURNEY_DURATION_MONTHS} months later):</span>{' '}
              <span className="font-medium">{summary.endLabel}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Total days:</span>{' '}
              <span className="font-medium">{summary.totalDays}</span>
            </p>
            {savedFlash && (
              <p className="text-primary text-xs font-medium pt-1">Start date saved.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={useToday}
              className="px-3 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
            >
              Start today
            </button>
            <button
              type="button"
              onClick={useDefault}
              className="px-3 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
            >
              Use Jul 18, 2026
            </button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Theme</label>
            <Dropdown
              value={theme}
              onChange={setTheme}
              options={themeOptions}
              className="w-full max-w-xs"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Data</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Export Data</h3>
              <p className="text-sm text-muted-foreground">Download your progress data</p>
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
              Export
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Clear All Data</h3>
              <p className="text-sm text-muted-foreground">Reset your progress (cannot be undone)</p>
            </div>
            <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90">
              Clear
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
