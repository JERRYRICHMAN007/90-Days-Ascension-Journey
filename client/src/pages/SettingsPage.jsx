import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../components/ui/card';
import { Dropdown } from '../components/ui/dropdown';
import { Sparkles, Sun, Moon } from 'lucide-react';

const themeOptions = [
  { value: 'vibrant', label: 'Vibrant', icon: Sparkles },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your experience</p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Theme</label>
            <Dropdown
              value={theme}
              onChange={toggleTheme}
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

