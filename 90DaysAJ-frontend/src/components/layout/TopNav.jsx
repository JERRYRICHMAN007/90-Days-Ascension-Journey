import { Moon, Sun, Sparkles, Search, Bell, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useGamification } from '../../hooks/useGamification';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Dropdown } from '../ui/dropdown';
import { cn } from '../../lib/utils';
import { 
  getCurrentPhaseStatus, 
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
  const { user } = useAuth();
  const globalLevel = getLevel();
  
  const currentPhaseStatus = getCurrentPhaseStatus();
  const currentDay = getCurrentDayNumber();
  const progress = getJourneyProgress();

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/80">
      <div className="flex items-center justify-between h-14 px-4 md:px-6">
        {/* Left: Ascension Logo & Day Number */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
          {/* Ascension Logo - Clickable */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer shrink-0 touch-manipulation group"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <div className="text-xl md:text-2xl transition-transform group-hover:scale-110">🚀</div>
            <span className="text-sm md:text-base font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent hidden sm:inline">
              Ascension
            </span>
          </button>
          
          {/* Day Number - Show if in journey (preparation, phase1 or phase2) */}
          {(currentPhaseStatus === 'preparation' || currentPhaseStatus === 'phase1' || currentPhaseStatus === 'phase2') && currentDay !== null && (
            <>
              <div className="h-5 w-px bg-border/50 hidden sm:block"></div>
              <div className="flex items-center gap-2 shrink-0 min-w-0">
                <span className="text-sm md:text-base font-semibold text-primary truncate">
                  {formatDayNumber(currentDay)}
                </span>
                <span className="text-xs text-muted-foreground hidden md:inline whitespace-nowrap px-2 py-0.5 rounded bg-muted/50">
                  {progress}%
                </span>
              </div>
              {/* Mobile: Show streak and level in compact format */}
              <div className="flex items-center gap-1.5 text-xs hidden sm:flex md:hidden px-2 py-0.5 rounded bg-muted/30">
                <Flame className="w-3 h-3 text-orange-500" />
                <span className="font-medium">{streaks.current}</span>
                <span className="text-muted-foreground">•</span>
                <span className="font-medium">Lv.{globalLevel.level}</span>
              </div>
            </>
          )}
          {currentPhaseStatus === 'preparation' && currentDay !== 0 && (
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide truncate px-2 py-0.5 rounded bg-muted/30">
              Prep
            </div>
          )}
          {currentPhaseStatus === 'before' && (
            <div className="text-xs text-muted-foreground truncate hidden sm:inline px-2 py-0.5 rounded bg-muted/30">
              Day 0: Feb 1 • Starts Feb 2, 2026
            </div>
          )}
        </div>

        {/* Right: Search, Notifications, Theme */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* Search - Enhanced */}
          <div className="relative max-w-xs w-full hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full pl-9 pr-20 py-1.5 rounded-md border border-border/50 bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-sm transition-all"
            />
            <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none hidden xl:flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            className="relative h-8 w-8 p-0 touch-manipulation hover:bg-muted/50"
            style={{ minWidth: '32px', minHeight: '32px' }}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-destructive rounded-full ring-2 ring-background" />
          </Button>

          <Dropdown
            value={theme}
            onChange={toggleTheme}
            options={themeOptions}
            className="w-28 md:w-36 hidden sm:block"
            align="left"
          />

          {/* Profile Image/Icon */}
          <button
            onClick={() => navigate('/profile')}
            className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-border hover:border-primary transition-colors touch-manipulation shrink-0"
            style={{ minWidth: '32px', minHeight: '32px' }}
            aria-label="Profile"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || 'Profile'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

