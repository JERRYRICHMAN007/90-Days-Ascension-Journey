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
          // If connection refused or backend is down, keep tokens but don't fail
          if (error.message?.includes('ERR_CONNECTION_REFUSED') || 
              error.message?.includes('Failed to fetch') ||
              error.message?.includes('NetworkError')) {
            console.warn('Backend not available, skipping auth initialization');
            // Keep tokens for when backend comes back online
          } else if (error.message?.includes('404') || error.message?.includes('not found')) {
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

  const signOut = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await api.logout(refreshToken);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    api.setToken(null);
    setUser(null);
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

