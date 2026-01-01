import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  // Check if we're in offline mode
  const isOfflineMode = localStorage.getItem('ascension_offline_mode') === 'true';
  
  if (loading && !isOfflineMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-spin">🚀</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // In offline mode, allow access without authentication
  // The app will work with LocalStorage
  if (isOfflineMode) {
    return <>{children}</>;
  }
  
  // Normal mode: require authentication
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  return <>{children}</>;
}

