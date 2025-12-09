/**
 * API Service Layer
 * 
 * This module provides a centralized API client for making HTTP requests.
 */

// Default to backend on port 4000 (Docker) or 5001 (direct run)
// Set VITE_API_BASE_URL in .env.local to override
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/v1';

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

    try {
      const response = await fetch(url, config);
      
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

