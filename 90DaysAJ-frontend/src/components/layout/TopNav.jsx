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
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 md:px-6">
        {/* Left: Ascension Logo & Day Number - Simplified for Mobile */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
          {/* Ascension Logo - Clickable */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity cursor-pointer shrink-0 touch-manipulation"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <div className="text-lg sm:text-xl md:text-2xl">🚀</div>
            <span className="text-xs sm:text-sm md:text-base font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent hidden sm:inline">
              Ascension
            </span>
          </button>
          
          {/* Day Number - Only show on mobile if in ascension/preparation */}
          {(currentPhase === 'ascension' || (currentPhase === 'preparation' && currentDay === 0)) && currentDay !== null && (
            <>
              <div className="h-5 sm:h-6 w-px bg-border hidden sm:block"></div>
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
                <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-primary truncate">
                  {formatDayNumber(currentDay)}
                </span>
                <span className="text-xs text-muted-foreground hidden md:inline whitespace-nowrap">
                  {progress}%
                </span>
              </div>
              {/* Mobile: Show streak and level in compact format */}
              <div className="flex items-center gap-2 text-xs hidden sm:flex md:hidden">
                <Flame className="w-3 h-3 text-orange-500" />
                <span className="font-semibold">{streaks.current}</span>
                <span className="text-muted-foreground">•</span>
                <span className="font-semibold">Lv.{globalLevel.level}</span>
              </div>
            </>
          )}
          {currentPhase === 'preparation' && currentDay !== 0 && (
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide truncate">
              Prep
            </div>
          )}
          {currentPhase === 'before' && (
            <div className="text-xs text-muted-foreground truncate hidden sm:inline">
              Starts Jan 5, 2026
            </div>
          )}
        </div>

        {/* Right: Notifications, Theme - Simplified for Mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
          <div className="relative max-w-md w-full hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            className="relative h-9 w-9 sm:h-10 sm:w-10 p-0 touch-manipulation"
            style={{ minWidth: '36px', minHeight: '36px' }}
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          <Dropdown
            value={theme}
            onChange={toggleTheme}
            options={themeOptions}
            className="w-28 sm:w-32 md:w-40 hidden sm:block"
            align="left"
          />
        </div>
      </div>
    </header>
  );
}

