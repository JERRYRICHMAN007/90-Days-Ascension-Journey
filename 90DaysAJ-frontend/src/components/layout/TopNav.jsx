import { Moon, Sun, Sparkles, Search, Bell, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useGamification } from '../../hooks/useGamification';
import { Button } from '../ui/button';
import { Dropdown } from '../ui/dropdown';
import { cn } from '../../lib/utils';
import { 
  getCurrentPhase, 
  getCurrentDayNumber, 
  formatDayNumber,
  getJourneyProgress 
} from '../../utils/dates';

const themeOptions = [
  { value: 'vibrant', label: 'Vibrant', icon: Sparkles },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

export function TopNav() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { streaks, getLevel } = useGamification();
  const globalLevel = getLevel();
  
  const currentPhase = getCurrentPhase();
  const currentDay = getCurrentDayNumber();
  const progress = getJourneyProgress();

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 overflow-visible">
      <div className="flex items-center justify-between h-16 px-6 overflow-visible">
        {/* Left: Ascension Logo & Day Number & Status */}
        <div className="flex items-center gap-6 flex-1">
          {/* Ascension Logo - Clickable */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="text-2xl">🚀</div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
              Ascension
            </span>
          </button>
          
          <div className="h-6 w-px bg-border"></div>
          {(currentPhase === 'ascension' || (currentPhase === 'preparation' && currentDay === 0)) && currentDay !== null && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  {formatDayNumber(currentDay)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {progress}%
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold">{streaks.current}</span>
                  <span className="text-muted-foreground">streak</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-semibold">{globalLevel.level}</span>
                </div>
              </div>
            </>
          )}
          {currentPhase === 'preparation' && currentDay !== 0 && (
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Preparation Phase
            </div>
          )}
          {currentPhase === 'before' && (
            <div className="text-sm text-muted-foreground">
              Journey begins January 1, 2026
            </div>
          )}
        </div>

        {/* Right: Search, Notifications, Theme */}
        <div className="flex items-center gap-4">
          <div className="relative max-w-md w-full hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          <Dropdown
            value={theme}
            onChange={toggleTheme}
            options={themeOptions}
            className="w-40"
            align="left"
          />
        </div>
      </div>
    </header>
  );
}

