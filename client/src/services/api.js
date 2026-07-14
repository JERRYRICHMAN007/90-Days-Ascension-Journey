/**
 * API Service Layer
 * 
 * This module provides a centralized API client for making HTTP requests.
 */

import { STORAGE_KEYS } from '../utils/storageKeys.js';

// Environment-aware API Base URL
// Priority: VITE_API_BASE_URL > same-origin /v1 (unified deploy) > localhost fallback
const getApiBaseUrl = () => {
  // Prefer correct name; also accept misnamed VITEBASEURL if already set on Vercel
  const fromEnv =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITEBASEURL;
  if (fromEnv) {
    return String(fromEnv).replace(/\/$/, '');
  }

  // Unified production: API served from same host at /v1
  if (import.meta.env.PROD) {
    return '/v1';
  }
  if (typeof window !== 'undefined' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1' &&
      window.location.hostname.match(/^192\.168\./)) {
    return `http://${window.location.hostname}:5001/v1`;
  }

  // Local dev: Vite proxies /v1 → API
  return '/v1';
};

const API_BASE_URL = getApiBaseUrl();

// Log API URL on initialization to help debug (development only)
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
  console.log('🌍 Environment:', import.meta.env.PROD ? 'production' : 'development');
  console.log('🌐 Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'N/A');
  console.log('🔐 VITE_API_BASE_URL set:', !!import.meta.env.VITE_API_BASE_URL);
}

// Warn if production build still points at localhost (separate deploy needs VITE_API_BASE_URL)
if (import.meta.env.PROD && API_BASE_URL.includes('localhost')) {
  console.warn('⚠️ API URL uses localhost in production. Set VITE_API_BASE_URL if API is on another host.');
}

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  async request(endpoint, options = {}) {
    // Check if API URL is configured
    if (this.baseURL === 'PRODUCTION_API_URL_NOT_CONFIGURED') {
      // In production, show user-friendly error (not technical details)
      const isProduction = import.meta.env.PROD || 
                           (typeof window !== 'undefined' && 
                            window.location.protocol === 'https:' &&
                            !window.location.hostname.includes('localhost'));
      
      // Always show helpful error with instructions
      const errorMessage = isProduction
        ? 'Backend server is not configured. The administrator needs to set up the backend connection.'
        : 'Production API URL not configured. Please set VITE_API_BASE_URL in Vercel environment variables.';
      
      const error = new Error(errorMessage);
      error.code = 'API_URL_NOT_CONFIGURED';
      
      // Log detailed error for developers/debugging
      console.error('❌ Backend Configuration Error:');
      console.error('   API URL:', this.baseURL);
      console.error('   Environment:', isProduction ? 'production' : 'development');
      console.error('   Fix: Set VITE_API_BASE_URL in Vercel environment variables');
      console.error('   Steps:');
      console.error('   1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables');
      console.error('   2. Add: VITE_API_BASE_URL');
      console.error('   3. Value: https://your-backend-url.com/v1');
      console.error('   4. Set for: Production environment');
      console.error('   5. Redeploy frontend');
      
      throw error;
    }
    
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    // Log request details for debugging (development only)
    if (import.meta.env.DEV) {
      console.log('API Request:', {
        url,
        method: options.method || 'GET',
        hasToken: !!this.token,
        endpoint,
      });
    }

    try {
      const response = await fetch(url, config);
      
      // Log response details for debugging (development only)
      if (import.meta.env.DEV) {
        console.log('API Response:', {
          url,
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        });
      }
      
      // Get response text first (can only read once)
      const responseText = await response.text();
      
      // Try to parse as JSON, but handle plain text errors gracefully
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        // If parsing fails, it's likely a plain text error message (e.g., rate limiting)
        if (!response.ok) {
          throw new Error(responseText || 'Request failed');
        }
        // If successful but not JSON, return the text as a message
        return { success: true, message: responseText };
      }

      if (!response.ok) {
        // Handle 429 - Rate limit exceeded
        if (response.status === 429) {
          const rateLimitMessage = data.message || responseText || 'Too many requests. Please wait a few minutes before trying again.';
          throw new Error(rateLimitMessage);
        }
        
        // Handle 401 - try to refresh token
        if (response.status === 401 && this.token) {
          try {
            await this.refresh(this.token);
            // Retry request with new token
            config.headers.Authorization = `Bearer ${this.token}`;
            const retryResponse = await fetch(url, config);
            const retryText = await retryResponse.text();
            
            let retryData;
            try {
              retryData = JSON.parse(retryText);
            } catch (parseError) {
              // If parsing fails, it's a plain text error
              if (!retryResponse.ok) {
                throw new Error(retryText || 'Request failed');
              }
              retryData = { success: true, message: retryText };
            }
            
            if (!retryResponse.ok) {
              throw new Error(retryData.error?.message || retryData.message || 'Request failed');
            }
            return retryData;
          } catch (refreshError) {
            // Refresh failed, clear tokens
            this.setToken(null);
            throw new Error('Session expired. Please login again.');
          }
        }
        
        // Handle 404 - Not found (often Vercel when API backend is not configured)
        if (response.status === 404) {
          const isVercelNotFound =
            responseText.includes('NOT_FOUND') ||
            responseText.toLowerCase().includes('could not be found');
          if (
            isVercelNotFound &&
            (this.baseURL === '/v1' || this.baseURL.startsWith('/'))
          ) {
            throw new Error(
              'Backend API is not connected. Deploy the server folder (Railway/Render) and set VITE_API_BASE_URL in Vercel to your API URL, e.g. https://your-api.railway.app/v1'
            );
          }
          throw new Error(data.error?.message || 'Resource not found. Please check if the server is running.');
        }
        
        throw new Error(data.error?.message || data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      // Handle network errors and Supabase unavailability gracefully
      if (error.message?.includes('Failed to fetch') || 
          error.message?.includes('NetworkError') ||
          error.message?.includes('ERR_CONNECTION_REFUSED') ||
          error.message?.includes('ERR_NETWORK') ||
          error.message?.includes('Network request failed') ||
          error.message?.includes('SUPABASE_UNAVAILABLE') ||
          error.message?.includes('503')) {
        
        // Check if this is a registration or login attempt (critical operations that require backend)
        const isAuthOperation = endpoint.includes('/auth/register') || endpoint.includes('/auth/login');
        const hasValidTokens = localStorage.getItem('accessToken') && localStorage.getItem('refreshToken');
        
        // Only set offline mode for authenticated users with existing tokens
        // Do NOT set offline mode for registration/login attempts - they require backend
        if (!isAuthOperation && hasValidTokens) {
          // Set offline mode flag only for authenticated users
          localStorage.setItem(STORAGE_KEYS.OFFLINE_MODE, 'true');
          // Dispatch event for OfflineModeBanner
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('service-unavailable', { 
              detail: { code: 'SERVICE_UNAVAILABLE', message: error.message } 
            }));
          }
        }
        
        // Provide appropriate error message based on operation type and environment
        let errorMessage;
        // Detect production more reliably
        const isProduction = import.meta.env.PROD || 
                             (typeof window !== 'undefined' && 
                              window.location.hostname !== 'localhost' && 
                              window.location.hostname !== '127.0.0.1' &&
                              !window.location.hostname.includes('localhost') &&
                              window.location.protocol === 'https:');
        
        if (isAuthOperation) {
          if (isProduction) {
            // In production, provide helpful debugging info
            console.error('❌ Authentication failed - Backend connection issue');
            console.error('   API URL:', this.baseURL);
            console.error('   Endpoint:', endpoint);
            console.error('   Error:', error.message);
            
            // Check if API URL is configured
            if (this.baseURL === 'PRODUCTION_API_URL_NOT_CONFIGURED' || 
                this.baseURL.includes('localhost') || 
                this.baseURL.includes('127.0.0.1')) {
              // More helpful error message with instructions
              console.error('❌ Backend Configuration Error:');
              console.error('   API URL:', this.baseURL);
              console.error('   Fix: Set VITE_API_BASE_URL in Vercel environment variables');
              console.error('   Go to: Vercel Dashboard → Settings → Environment Variables');
              console.error('   Add: VITE_API_BASE_URL = https://your-backend-url.com/v1');
              errorMessage = 'Backend server is not configured. The administrator needs to set up the backend connection.';
            } else {
              errorMessage = 'Cannot connect to authentication server. Please check your internet connection and try again.';
            }
          } else {
            errorMessage = 'Cannot connect to server. Start the app from the project root: npm run dev';
          }
        } else if (hasValidTokens) {
          // Authenticated users can work offline
          errorMessage = 'Backend service unavailable. The app will work in offline mode using LocalStorage.';
        } else {
          if (isProduction) {
            errorMessage = 'Cannot connect to server. Please check your internet connection and try again.';
          } else {
            errorMessage = 'Cannot connect to server. Please ensure the backend server is running on http://localhost:5001.';
          }
        }
        
        const serviceError = new Error(errorMessage);
        serviceError.code = 'SERVICE_UNAVAILABLE';
        throw serviceError;
      }
      
      // If error is already an Error object, throw it as is
      if (error instanceof Error) {
        throw error;
      }
      // Otherwise, wrap it in an Error
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }

  // Auth endpoints
  async register(email, password, name) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(refreshToken) {
    await this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    this.setToken(null);
  }

  async refresh(refreshToken) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // Health check endpoints
  async healthCheck() {
    return this.request('/health');
  }

  async supabaseHealthCheck() {
    return this.request('/health/supabase');
  }

  // User endpoints
  async getUser() {
    return this.request('/users/me');
  }

  async updateUser(data) {
    return this.request('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Progress endpoints
  async getProgress(domain) {
    return this.request(`/progress/${domain}`);
  }

  async completeTask(domain, dayNumber, completed = true) {
    return this.request('/tasks/complete', {
      method: 'POST',
      body: JSON.stringify({ domain, dayNumber, completed }),
    });
  }

  // XP endpoints
  async getXP() {
    return this.request('/xp');
  }

  async updateXP(xpData) {
    return this.request('/xp', {
      method: 'PATCH',
      body: JSON.stringify(xpData),
    });
  }

  // Streak endpoints
  async getStreaks() {
    return this.request('/streaks');
  }

  async updateStreaks(streaksData) {
    return this.request('/streaks', {
      method: 'PATCH',
      body: JSON.stringify(streaksData),
    });
  }

  // Journey endpoints
  async getJourney(domain) {
    return this.request(`/journey/${domain}`);
  }

  async logJourneyActivity(domain, dayNumber, notes, data = {}) {
    return this.request(`/journey/${domain}/log`, {
      method: 'POST',
      body: JSON.stringify({ dayNumber, notes, data }),
    });
  }

  async getJourneyResources(domain) {
    return this.request(`/journey/${domain}/resources`);
  }

  // Achievement endpoints
  async getAchievements() {
    return this.request('/achievements');
  }

  async unlockAchievement(achievementId) {
    return this.request('/achievements/unlock', {
      method: 'POST',
      body: JSON.stringify({ achievementId }),
    });
  }

  // Settings endpoints
  async getSettings() {
    return this.request('/settings');
  }

  async updateSettings(data) {
    return this.request('/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /** Generic HTTP helpers for sync / extension code */
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }
}

export const api = new ApiClient();

