import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

  // Clear all cache and storage
  const clearAllCache = () => {
    try {
      // Clear localStorage (except offline mode flag)
      const offlineMode = localStorage.getItem('ascension_offline_mode');
      localStorage.clear();
      if (offlineMode) {
        localStorage.setItem('ascension_offline_mode', offlineMode);
      }
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear IndexedDB if used
      if ('indexedDB' in window) {
        indexedDB.databases().then(databases => {
          databases.forEach(db => {
            if (db.name) {
              indexedDB.deleteDatabase(db.name);
            }
          });
        });
      }
      
      // Clear service worker cache if available
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  const signOut = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await api.logout(refreshToken);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    // Clear all cache and storage
    clearAllCache();
    
    api.setToken(null);
    setUser(null);
  };

  // Handle inactivity timeout
  useEffect(() => {
    if (!user) return;

    let inactivityTimer: NodeJS.Timeout;
    let lastActivityTime = Date.now();

    const resetTimer = () => {
      lastActivityTime = Date.now();
      clearTimeout(inactivityTimer);
      
      inactivityTimer = setTimeout(() => {
        const timeSinceLastActivity = Date.now() - lastActivityTime;
        if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
          // User has been inactive for 30 minutes
          console.log('User inactive for 30 minutes, logging out and clearing cache...');
          clearAllCache();
          signOut();
          // Redirect to login page
          window.location.href = '/login';
        }
      }, INACTIVITY_TIMEOUT);
    };

    // Track user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetTimer();
    };

    // Initialize timer
    resetTimer();

    // Add event listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup
    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [user]);

  useEffect(() => {
    // Check for stored tokens and restore session
    const initAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        try {
          api.setToken(accessToken);
          const userData = await api.getUser();
          // Handle both response formats: { data: {...} } or direct user object
          setUser(userData.data || userData);
        } catch (error: any) {
          // If connection refused, backend is down, or Supabase unavailable, keep tokens but don't fail
          const errorMessage = error.message || '';
          if (errorMessage.includes('ERR_CONNECTION_REFUSED') || 
              errorMessage.includes('Failed to fetch') ||
              errorMessage.includes('NetworkError') ||
              errorMessage.includes('SUPABASE_UNAVAILABLE') ||
              errorMessage.includes('503') ||
              errorMessage.includes('service unavailable')) {
            console.warn('Backend/Supabase not available, skipping auth initialization. App will work in offline mode.');
            // Set offline mode flag
            localStorage.setItem('ascension_offline_mode', 'true');
            // Dispatch event for OfflineModeBanner
            window.dispatchEvent(new CustomEvent('service-unavailable', { 
              detail: { code: 'SERVICE_UNAVAILABLE', message: errorMessage } 
            }));
            // Keep tokens for when backend comes back online
            // App will work with LocalStorage in offline mode
          } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
            try {
              await refreshToken();
              // Retry getting user after refresh
              try {
                const userData = await api.getUser();
                setUser(userData.data || userData);
              } catch {
                // If still fails, clear tokens
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                api.setToken(null);
              }
            } catch {
              // Refresh failed, clear invalid tokens
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              api.setToken(null);
            }
          } else {
            // For other errors, try to refresh once
            try {
              await refreshToken();
            } catch {
              // Clear invalid tokens
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              api.setToken(null);
            }
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await api.login(email, password);
    // Handle both response formats: { data: {...} } or direct response
    const responseData = response.data || response;
    const { user, tokens } = responseData;
    
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    api.setToken(tokens.accessToken);
    
    setUser(user);
  };

  const signUp = async (name: string, email: string, password: string) => {
    const response = await api.register(email, password, name);
    // Handle both response formats: { data: {...} } or direct response
    const responseData = response.data || response;
    const { user, tokens } = responseData;
    
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    api.setToken(tokens.accessToken);
    
    setUser(user);
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await api.refresh(refreshToken);
    // Handle both response formats: { data: {...} } or direct response
    const responseData = response.data || response;
    const { accessToken, refreshToken: newRefreshToken } = responseData;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    api.setToken(accessToken);
  };

  const refreshUser = async () => {
    try {
      const userData = await api.getUser();
      // Handle response format: { success: true, data: {...} } or direct user object
      const user = userData.data || userData;
      setUser(user);
    } catch (error: any) {
      console.error('Failed to refresh user data:', error);
      // If session expired, clear user
      if (error.message?.includes('Session expired') || error.message?.includes('401')) {
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        api.setToken(null);
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, refreshToken, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

