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

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/home';
    }
    if (path === '/analytics') {
      return location.pathname === '/analytics' || location.pathname.startsWith('/analytics/');
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t backdrop-blur-[6px] pb-[env(safe-area-inset-bottom)]"
      style={{
        backgroundColor: 'var(--bg-nav)',
        borderColor: 'var(--border-muted)',
      }}
      aria-label="Mobile navigation"
    >
      <div className="flex h-[72px] items-stretch justify-around px-2">
        {mobileBottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 min-h-[44px] px-1 touch-manipulation transition-colors',
                active ? 'text-[#00e478]' : 'text-[#bac9cc]'
              )}
              style={active ? { filter: 'drop-shadow(0 0 4px rgba(0,228,120,0.4))' } : undefined}
            >
              <Icon className="size-[18px] shrink-0" />
              <span className="text-[10px] uppercase leading-[15px] truncate max-w-full">
                {item.shortLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
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
            <SheetTitle>Aether</SheetTitle>
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
