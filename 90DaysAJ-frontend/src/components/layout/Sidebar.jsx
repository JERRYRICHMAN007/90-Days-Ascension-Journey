import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Dumbbell, 
  Palette, 
  BookOpen, 
  PenTool, 
  Code, 
  Trophy, 
  User, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { icon: Dumbbell, label: 'Body Transformation', path: '/body-transformation' },
  { icon: Palette, label: 'Dual Brand', path: '/dual-brand' },
  { icon: BookOpen, label: 'Reading Journey', path: '/reading' },
  { icon: PenTool, label: "Writer's Journey", path: '/writers' },
  { icon: Code, label: 'Software Engineering', path: '/software-engineering' },
  { icon: Trophy, label: 'Achievements', path: '/achievements' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

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
      // Still navigate to landing page even if logout fails
      navigate('/');
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
      className="hidden md:flex flex-col border-r bg-card transition-all duration-300 relative z-10"
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="text-2xl">🚀</div>
            <span className="text-base sm:text-lg md:text-xl font-bold gradient-text">Ascension</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                "hover:bg-muted hover:text-blue-500",
                isActive && "bg-primary/10 text-primary font-semibold"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full",
            "hover:bg-green-500 hover:text-white",
            "text-muted-foreground"
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}

