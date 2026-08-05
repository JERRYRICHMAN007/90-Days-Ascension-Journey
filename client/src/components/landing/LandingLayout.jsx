import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { LandingNav } from './LandingNav';
import { LandingFooter } from './LandingFooter';
import { LANDING_MESH_BG } from './landingData';

export function LandingLayout({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden text-[var(--text-primary)] flex flex-col" style={LANDING_MESH_BG}>
      <LandingNav />
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1"
      >
        {children}
      </motion.main>
      <LandingFooter />
    </div>
  );
}
