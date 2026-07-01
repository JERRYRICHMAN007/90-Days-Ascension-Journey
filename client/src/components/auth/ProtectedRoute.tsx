import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { STORAGE_KEYS } from '../../utils/storageKeys.js';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  const isOfflineMode = localStorage.getItem(STORAGE_KEYS.OFFLINE_MODE) === 'true';

  if (loading && !isOfflineMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isOfflineMode) {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      localStorage.removeItem(STORAGE_KEYS.OFFLINE_MODE);
      return <Navigate to="/signin" replace />;
    }

    return <>{children}</>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
