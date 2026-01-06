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
      animate={{ width: collapsed ? 72 : 256 }}
      className="hidden md:flex flex-col border-r border-border/50 bg-card/30 backdrop-blur-md transition-all duration-300 relative z-10"
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border/50">
        {!collapsed && (
          <Link 
            to="/dashboard"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="text-2xl">🚀</div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
              Ascension
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground ml-auto"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "text-sm font-medium",
                "hover:bg-muted/40 hover:text-foreground",
                isActive 
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-muted-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn(
                "w-4 h-4 flex-shrink-0 transition-colors",
                isActive && "text-primary"
              )} />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-2 border-t border-border/50">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full",
            "text-sm font-medium text-muted-foreground",
            "hover:bg-destructive/10 hover:text-destructive",
            "border border-transparent"
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

