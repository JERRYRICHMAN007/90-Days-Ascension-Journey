import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { figmaSidebarNavItems, figmaSidebarFooterItems } from './navItems';
import { getSidebarDayLabel } from '../../utils/journeyPlanning.js';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => setTick((t) => t + 1);
    window.addEventListener('journey-start-updated', refresh);
    return () => window.removeEventListener('journey-start-updated', refresh);
  }, []);

  const dayLabel = getSidebarDayLabel();
  void tick;

  const initials = (user?.name || 'Aether Initiate')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      className="hidden md:flex flex-col fixed inset-y-0 left-0 z-20 w-[280px] border-r"
      style={{
        backgroundColor: 'var(--bg-sidebar)',
        borderColor: 'var(--border-muted)',
      }}
    >
      <div className="px-8 pt-8 pb-6">
        <Link to="/dashboard" className="block hover:opacity-90 transition-opacity">
          <span className="text-[24px] font-extrabold text-[var(--neon-cyan-alt)] tracking-[-1.2px] leading-none">
            Aether
          </span>
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <div className="size-10 shrink-0 overflow-hidden rounded-full border border-[var(--border-muted)] bg-[var(--bg-badge)]">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-[11px] font-bold text-[var(--neon-cyan-alt)]">
                {initials}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-[var(--text-primary)]">
              MASTER RANK
            </p>
            <p className="text-[10px] text-[var(--text-secondary)]">{dayLabel}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {figmaSidebarNavItems.map((item) => {
          const Icon = item.icon;

          const isActive =

            location.pathname === item.path ||

            (item.path === '/analytics' &&

              location.pathname.startsWith('/analytics'));



          return (

            <Link

              key={item.path}

              to={item.path}

              className={cn(

                'flex items-center gap-4 px-6 py-4 text-[12px] font-bold uppercase tracking-[1.2px] transition-colors border-l-4',

                isActive

                  ? 'border-[var(--neon-green)] bg-[var(--bg-badge)] text-[var(--neon-cyan-alt)]'

                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'

              )}

            >

              <Icon className="size-[18px] shrink-0" />

              <span>{item.label}</span>

            </Link>

          );

        })}

      </nav>



      <div className="px-6 py-6 border-t border-[var(--border-muted)]">

        <button

          type="button"

          onClick={() => navigate('/dashboard')}

          className="flex w-full items-center justify-center gap-2 rounded-[8px] border border-[var(--neon-green)]/30 bg-[var(--bg-badge)] px-4 py-4 text-[16px] font-bold text-[var(--neon-green)] transition-opacity hover:opacity-90"

        >

          <Zap className="size-4" />

          Start Daily Session

        </button>

      </div>



      <div className="px-3 pb-8 space-y-1">

        {figmaSidebarFooterItems.map((item) => {

          const Icon = item.icon;

          return (

            <Link

              key={item.label}

              to={item.path}

              className="flex items-center gap-4 px-6 py-4 text-[12px] font-bold uppercase tracking-[1.2px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"

            >

              <Icon className="size-5 shrink-0" />

              <span>{item.label}</span>

            </Link>

          );

        })}

      </div>

    </aside>

  );

}


