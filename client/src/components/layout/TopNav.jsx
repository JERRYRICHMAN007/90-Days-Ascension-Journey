import { useState, useEffect } from 'react';
import { Calendar, Bell, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { MobileMenu } from './MobileNav';
import { ThemeToggleButton } from './ThemeToggleButton';
import { DashboardCalendarPanel, DashboardNotificationsPanel } from '../dashboard/DashboardNavPanels';
import { getUnreadNotificationCount } from '../../utils/journeyNotifications.js';

export function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(() => getUnreadNotificationCount());
  const isDashboard = location.pathname === '/dashboard';

  useEffect(() => {
    const refresh = () => setUnreadCount(getUnreadNotificationCount());
    window.addEventListener('notifications-updated', refresh);
    window.addEventListener('journey-start-updated', refresh);
    window.addEventListener('journey-registry-updated', refresh);
    return () => {
      window.removeEventListener('notifications-updated', refresh);
      window.removeEventListener('journey-start-updated', refresh);
      window.removeEventListener('journey-registry-updated', refresh);
    };
  }, []);

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
                className="md:hidden text-[24px] font-extrabold text-[var(--neon-cyan-alt)] tracking-[-1.2px] leading-none hover:opacity-80"
              >
                Aether
              </button>
              <p className="hidden md:block text-[12px] font-bold uppercase tracking-[1.2px] text-[var(--text-secondary)] truncate">
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

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {isDashboard && (
            <>
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(false);
                  setCalendarOpen((v) => !v);
                }}
                className="flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2 rounded-lg hover:bg-[var(--surface-hover)]"
                aria-label="Calendar"
                aria-expanded={calendarOpen}
              >
                <Calendar className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setCalendarOpen(false);
                  setNotificationsOpen((v) => !v);
                }}
                className="relative flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2 rounded-lg hover:bg-[var(--surface-hover)]"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell className="size-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[var(--neon-green)]" />
                )}
              </button>
            </>
          )}

          <ThemeToggleButton />

          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-[var(--border-muted)] hover:border-[var(--border-active)] transition-colors"
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
        </div>
      </div>
    </header>
    <MobileMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
    <DashboardCalendarPanel open={calendarOpen} onClose={() => setCalendarOpen(false)} />
    <DashboardNotificationsPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </>
  );
}
