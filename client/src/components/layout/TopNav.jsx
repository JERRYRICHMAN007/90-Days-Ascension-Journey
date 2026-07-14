import { useState } from 'react';
import { Moon, Sun, Calendar, Bell, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { MobileMenu } from './MobileNav';

export function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDashboard = location.pathname === '/dashboard';

  const initials = (user?.name || 'FM')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
    <header
      className="sticky top-0 z-40 pt-[env(safe-area-inset-top)] border-b backdrop-blur-[6px]"
      style={{ backgroundColor: 'var(--bg-header)', borderColor: 'var(--border-muted)' }}
    >
      <div className="flex items-center justify-between h-16 px-5 md:px-6 lg:px-12 gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {!isDashboard && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden shrink-0 h-11 w-11"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          {isDashboard ? (
            <>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="md:hidden text-[24px] font-extrabold text-[#00daf3] tracking-[-1.2px] leading-none hover:opacity-80"
              >
                Aether
              </button>
              <p className="hidden md:block text-[12px] font-bold uppercase tracking-[1.2px] text-[#bac9cc] truncate">
                SYSTEM STATUS: OPTIMAL
              </p>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="text-xl md:text-2xl font-extrabold text-[var(--neon-cyan-alt)] tracking-[-1.2px] hover:opacity-80"
            >
              Aether
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          {isDashboard ? (
            <>
              <button
                type="button"
                className="flex items-center justify-center text-[#bac9cc] hover:text-[#dce4e5] transition-colors"
                aria-label="Calendar"
              >
                <Calendar className="size-5" />
              </button>
              <button
                type="button"
                className="relative flex items-center justify-center text-[#bac9cc] hover:text-[#dce4e5] transition-colors"
                aria-label="Notifications"
              >
                <Bell className="size-5" />
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[#00e478] md:hidden" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex size-8 items-center justify-center overflow-hidden rounded-full border border-[rgba(59,73,76,0.3)]"
                aria-label="Profile"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name || 'Profile'}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center bg-[#00daf3] text-[12px] font-bold text-[#00363d]">
                    {initials}
                  </span>
                )}
              </button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {theme === 'dark' || theme === 'neon' || theme === 'vibrant' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-border hover:border-primary transition-colors"
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
                    {initials}
                  </div>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
    <MobileMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
    </>
  );
}
