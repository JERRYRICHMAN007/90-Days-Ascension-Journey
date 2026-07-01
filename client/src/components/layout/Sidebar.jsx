import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { desktopNavItems } from './navItems';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      className="hidden md:flex flex-col transition-all duration-300 relative z-10 border-r"
      style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-subtle)' }}
    >
      <div
        className="flex items-center justify-between h-16 px-4 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-90 transition-opacity min-w-0">
            <span className="text-[var(--neon-green)] text-sm" aria-hidden>●</span>
            <span
              className="text-lg font-bold text-white truncate"
              style={{ letterSpacing: '0.05em' }}
            >
              Forge90
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg transition-colors ml-auto text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-elevated)]"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {desktopNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium border-l-[3px]',
                isActive
                  ? 'text-[var(--neon-green)] border-[var(--neon-green)]'
                  : 'text-[var(--text-secondary)] border-transparent hover:text-white'
              )}
              style={isActive ? { background: 'rgba(0,255,135,0.08)' } : undefined}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full',
            'text-sm font-medium text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-elevated)]'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
