import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { figmaSidebarNavItems, figmaSidebarFooterItems } from './navItems';
import { getCurrentDayNumber, getCurrentPhaseStatus, getJourneyTotalDays } from '../../utils/dates';

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

  const currentDay = getCurrentDayNumber();
  const totalDays = getJourneyTotalDays();
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
        backgroundColor: '#080f11',
        borderColor: 'rgba(59, 73, 76, 0.2)',
      }}
    >
      <div className="px-8 pt-8 pb-6">
        <Link to="/dashboard" className="block hover:opacity-90 transition-opacity">
          <span className="text-[24px] font-extrabold text-[#00daf3] tracking-[-1.2px] leading-none">
            Aether
          </span>
        </Link>

        <div className="mt-6 flex items-center gap-3">
          <div className="size-10 shrink-0 overflow-hidden rounded-full border border-[rgba(59,73,76,0.3)] bg-[#242b2d]">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-[11px] font-bold text-[#00daf3]">
                {initials}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold uppercase tracking-[1.2px] text-[#dce4e5]">
              MASTER RANK
            </p>
            <p className="text-[10px] text-[#bac9cc]">
              {currentDay != null && currentDay > 0
                ? `Day ${currentDay} of ${totalDays}`
                : getCurrentPhaseStatus() === 'before'
                  ? 'Set start in Settings'
                  : 'Before ascent'}
            </p>
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

                  ? 'border-[#00e478] bg-[#242b2d] text-[#00daf3]'

                  : 'border-transparent text-[#bac9cc] hover:text-[#dce4e5]'

              )}

            >

              <Icon className="size-[18px] shrink-0" />

              <span>{item.label}</span>

            </Link>

          );

        })}

      </nav>



      <div className="px-6 py-6 border-t" style={{ borderColor: 'rgba(59,73,76,0.1)' }}>

        <button

          type="button"

          onClick={() => navigate('/dashboard')}

          className="flex w-full items-center justify-center gap-2 rounded-[8px] border border-[rgba(0,228,120,0.3)] bg-[#242b2d] px-4 py-4 text-[16px] font-bold text-[#00e478] transition-opacity hover:opacity-90"

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

              className="flex items-center gap-4 px-6 py-4 text-[12px] font-bold uppercase tracking-[1.2px] text-[#bac9cc] hover:text-[#dce4e5] transition-colors"

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


