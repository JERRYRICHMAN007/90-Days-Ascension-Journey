/**
 * API Service Layer
 * 
 * This module provides a centralized API client for making HTTP requests.
 */

// Default to backend on port 5001 (direct run) or 4000 (Docker)
// Set VITE_API_BASE_URL in .env.local to override
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/v1';

// Log API URL on initialization to help debug
console.log('🔗 API Base URL:', API_BASE_URL);

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
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    // Log request details for debugging
    console.log('API Request:', {
      url,
      method: options.method || 'GET',
      hasToken: !!this.token,
      endpoint,
    });

    try {
      const response = await fetch(url, config);
      
      // Log response details for debugging
      console.log('API Response:', {
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });
      
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
        
        // Provide appropriate error message based on operation type
        let errorMessage;
        if (isAuthOperation) {
          // Registration/login requires backend - be clear about this
          errorMessage = 'Unable to connect to authentication service. Please check your connection and try again.';
        } else if (hasValidTokens) {
          // Authenticated users can work offline
          errorMessage = 'Backend service unavailable. The app will work in offline mode using LocalStorage.';
        } else {
          // Unauthenticated users need backend
          errorMessage = 'Unable to connect to server. Please check your connection and try again.';
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

  // Streak endpoints
  async getStreaks() {
    return this.request('/streaks');
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

