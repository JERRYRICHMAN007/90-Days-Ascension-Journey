/**
 * API Service Layer
 * 
 * This module provides a centralized API client for making HTTP requests.
 */

// Environment-aware API Base URL
// Priority: VITE_API_BASE_URL env var > production detection > localhost fallback
const getApiBaseUrl = () => {
  // 1. Check for explicit environment variable (highest priority)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // 2. Detect production environment more reliably
  // Production = built with Vite PROD mode OR deployed on Vercel/other hosting
  const isVercelDeployment = typeof window !== 'undefined' && 
                            (window.location.hostname.includes('vercel.app') ||
                             window.location.hostname.includes('vercel.com'));
  
  const isProductionBuild = import.meta.env.PROD;
  
  // Only treat as production if:
  // - Built in production mode AND
  // - (Deployed on Vercel OR using HTTPS with non-localhost hostname)
  const isProduction = isProductionBuild && 
                       (isVercelDeployment || 
                        (typeof window !== 'undefined' && 
                         window.location.protocol === 'https:' &&
                         window.location.hostname !== 'localhost' && 
                         window.location.hostname !== '127.0.0.1' &&
                         !window.location.hostname.match(/^192\.168\./))); // Exclude local network IPs
  
  if (isProduction) {
    // In production, VITE_API_BASE_URL MUST be set
    console.error('⚠️ PRODUCTION WARNING: API URL not configured!');
    console.error('   Current API URL: http://localhost:5001/v1');
    console.error('   Set VITE_API_BASE_URL in Vercel environment variables');
    console.error('   Example: https://your-backend.railway.app/v1');
    
    // Return a placeholder that will fail gracefully with helpful error
    return 'PRODUCTION_API_URL_NOT_CONFIGURED';
  }
  
  // 3. Development fallback (local network access)
  // If accessed from another device on local network, try to use the host machine's IP
  if (typeof window !== 'undefined' && 
      window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1' &&
      window.location.hostname.match(/^192\.168\./)) {
    // On local network - use the same hostname but port 5001
    return `http://${window.location.hostname}:5001/v1`;
  }
  
  // 4. Default localhost for development
  return 'http://localhost:5001/v1';
};

const API_BASE_URL = getApiBaseUrl();

// Log API URL on initialization to help debug (development only)
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
  console.log('🌍 Environment:', import.meta.env.PROD ? 'production' : 'development');
  console.log('🌐 Hostname:', typeof window !== 'undefined' ? window.location.hostname : 'N/A');
  console.log('🔐 VITE_API_BASE_URL set:', !!import.meta.env.VITE_API_BASE_URL);
}

// Warn if production but API URL not configured
if ((import.meta.env.PROD || (typeof window !== 'undefined' && window.location.protocol === 'https:')) && 
    (API_BASE_URL === 'PRODUCTION_API_URL_NOT_CONFIGURED' || API_BASE_URL.includes('localhost'))) {
  console.error('⚠️ PRODUCTION WARNING: API URL not configured!');
  console.error('   Current API URL:', API_BASE_URL);
  console.error('   Set VITE_API_BASE_URL in Vercel environment variables');
      console.error('   Example: https://your-backend-url.com/v1');
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
        
        // Handle 404 - Not found
        if (response.status === 404) {
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
          localStorage.setItem('ascension_offline_mode', 'true');
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
            errorMessage = 'Cannot connect to server. Please ensure the backend server is running on http://localhost:5001. Start it with: cd 90DaysAJ-backend && npm run dev';
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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/48ce46b9-d20f-4e97-80d4-1d14be26a309',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:137',message:'API register called',data:{email,name,hasPassword:!!password},timestamp:Date.now(),sessionId:'debug-session',runId:'run1'})}).catch(()=>{});
    // #endregion
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/48ce46b9-d20f-4e97-80d4-1d14be26a309',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:143',message:'API register succeeded',data:{email,hasResponse:!!response,hasUser:!!(response?.data?.user || response?.user),hasTokens:!!(response?.data?.tokens || response?.tokens)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1'})}).catch(()=>{});
      // #endregion
      return response;
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/48ce46b9-d20f-4e97-80d4-1d14be26a309',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:148',message:'API register failed',data:{email,errorMessage:error.message,errorType:error.constructor.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1'})}).catch(()=>{});
      // #endregion
      throw error;
    }
  }

  async login(email, password) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/48ce46b9-d20f-4e97-80d4-1d14be26a309',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:144',message:'API login called',data:{email,hasPassword:!!password},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/48ce46b9-d20f-4e97-80d4-1d14be26a309',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:149',message:'API login succeeded',data:{email,hasResponse:!!response,hasUser:!!(response?.data?.user || response?.user),hasTokens:!!(response?.data?.tokens || response?.tokens)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      return response;
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/48ce46b9-d20f-4e97-80d4-1d14be26a309',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api.js:153',message:'API login failed',data:{email,errorMessage:error.message,errorType:error.constructor.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      throw error;
    }
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
}

export const api = new ApiClient();

