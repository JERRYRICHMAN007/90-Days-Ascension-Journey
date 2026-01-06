import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  // Check if we're in offline mode
  const isOfflineMode = localStorage.getItem('ascension_offline_mode') === 'true';
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/48ce46b9-d20f-4e97-80d4-1d14be26a309',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProtectedRoute.tsx:4',message:'ProtectedRoute checking authentication',data:{hasUser:!!user,loading,isOfflineMode},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  
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
  
  // SECURITY FIX: In offline mode, still require valid tokens
  // Offline mode should only work for previously authenticated users
  if (isOfflineMode) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/48ce46b9-d20f-4e97-80d4-1d14be26a309',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProtectedRoute.tsx:27',message:'Offline mode detected - validating tokens',data:{hasUser:!!user,isOfflineMode:true,hasAccessToken:!!localStorage.getItem('accessToken'),hasRefreshToken:!!localStorage.getItem('refreshToken')},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    // Check for valid tokens - offline mode should only work with existing authenticated session
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!accessToken || !refreshToken) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/48ce46b9-d20f-4e97-80d4-1d14be26a309',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProtectedRoute.tsx:35',message:'BLOCKED: Offline mode without valid tokens',data:{isOfflineMode:true,hasAccessToken:false,hasRefreshToken:false},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      // Clear invalid offline mode flag and require authentication
      localStorage.removeItem('ascension_offline_mode');
      return <Navigate to="/signin" replace />;
    }
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/48ce46b9-d20f-4e97-80d4-1d14be26a309',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProtectedRoute.tsx:41',message:'Offline mode access granted - valid tokens present',data:{hasUser:!!user,hasAccessToken:true,hasRefreshToken:true},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    // Valid tokens exist - allow offline mode access
    return <>{children}</>;
  }
  
  // Normal mode: require authentication
  if (!user) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/48ce46b9-d20f-4e97-80d4-1d14be26a309',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProtectedRoute.tsx:29',message:'No user found, redirecting to signin',data:{hasUser:false},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    return <Navigate to="/signin" replace />;
  }
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/48ce46b9-d20f-4e97-80d4-1d14be26a309',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProtectedRoute.tsx:32',message:'User authenticated, allowing access',data:{hasUser:true,userId:user?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  return <>{children}</>;
}

