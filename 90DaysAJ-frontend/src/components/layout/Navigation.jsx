import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Trophy, User } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: Trophy, label: 'Achievements', path: '/achievements' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function Navigation() {
  const location = useLocation();

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="text-2xl">🚀</div>
              <span className="text-base sm:text-lg md:text-xl font-bold gradient-text">Ascension</span>
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                      "hover:bg-muted",
                      isActive && "bg-primary/10 text-primary font-semibold"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="grid grid-cols-4 h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-all",
                  isActive && "text-primary"
                )}
              >
                <Icon className={cn(
                  "w-6 h-6",
                  isActive && "scale-110"
                )} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16 hidden md:block" />
      <div className="h-16 md:hidden" />
    </>
  );
}
