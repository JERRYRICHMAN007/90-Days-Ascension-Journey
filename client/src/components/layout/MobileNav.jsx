import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import {
  mobileBottomNavItems,
  mobileJourneyItems,
  secondaryNavItems,
  primaryNavItems,
} from './navItems';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';

export function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [journeysOpen, setJourneysOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/home';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const isJourneyActive = mobileJourneyItems.some((item) => isActive(item.path));

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    navigate('/');
  };

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-border/50 bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/80 pb-[env(safe-area-inset-bottom)]"
        aria-label="Mobile navigation"
      >
        <div className="flex items-stretch justify-around h-16 px-1">
          {mobileBottomNavItems.map((item) => {
            const Icon = item.icon;
            const isJourneysTab = item.path === '__journeys__';
            const active = isJourneysTab ? isJourneyActive : isActive(item.path);

            if (isJourneysTab) {
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => setJourneysOpen(true)}
                  className={cn(
                    'flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[44px] min-w-[44px] px-1 touch-manipulation transition-colors',
                    active ? 'text-primary' : 'text-muted-foreground'
                  )}
                  aria-label="Open journeys menu"
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="text-[10px] font-medium truncate max-w-full">{item.shortLabel}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-1 flex-col items-center justify-center gap-0.5 min-h-[44px] min-w-[44px] px-1 touch-manipulation transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-[10px] font-medium truncate max-w-full">{item.shortLabel}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <Sheet open={journeysOpen} onOpenChange={setJourneysOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto pb-[env(safe-area-inset-bottom)]">
          <SheetHeader className="text-left mb-4">
            <SheetTitle>Your Journeys</SheetTitle>
          </SheetHeader>
          <div className="space-y-1">
            {mobileJourneyItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setJourneysOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium touch-manipulation min-h-[44px]',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted/50'
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-border/50 space-y-1">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setJourneysOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 touch-manipulation min-h-[44px]"
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setJourneysOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 w-full touch-manipulation min-h-[44px]"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function MobileMenu({ open, onOpenChange }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/home';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = async () => {
    onOpenChange(false);
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    navigate('/');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[min(100vw-3rem,320px)] p-0 flex flex-col">
        <SheetHeader className="px-4 py-4 border-b border-border/50 text-left">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <SheetTitle>Forge90</SheetTitle>
          </div>
        </SheetHeader>
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          <Link
            to="/dashboard"
            onClick={() => onOpenChange(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium touch-manipulation min-h-[44px]',
              isActive('/dashboard')
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            )}
          >
            {(() => {
              const Icon = primaryNavItems[0].icon;
              return <Icon className="w-4 h-4 shrink-0" />;
            })()}
            <span className="truncate">Dashboard</span>
          </Link>
          {mobileJourneyItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium touch-manipulation min-h-[44px]',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium touch-manipulation min-h-[44px]',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-2 border-t border-border/50">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 w-full touch-manipulation min-h-[44px]"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
