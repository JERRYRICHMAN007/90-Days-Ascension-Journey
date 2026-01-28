import { useState, useEffect } from 'react';

const XP_PER_TASK = {
  easy: 10,
  medium: 25,
  hard: 50,
  daily: 15,
  weekly: 100,
};

const XP_FOR_LEVEL = (level) => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export function useGamification() {
  const [xp, setXp] = useState(() => {
    try {
      const saved = localStorage.getItem('ascensionXP');
      return saved ? JSON.parse(saved) : { global: 0, domains: {} };
    } catch (error) {
      console.error('Error parsing XP from localStorage:', error);
      localStorage.removeItem('ascensionXP');
      return { global: 0, domains: {} };
    }
  });

  const [streaks, setStreaks] = useState(() => {
    try {
      const saved = localStorage.getItem('ascensionStreaks');
      return saved ? JSON.parse(saved) : { current: 0, longest: 0, lastDate: null };
    } catch (error) {
      console.error('Error parsing streaks from localStorage:', error);
      localStorage.removeItem('ascensionStreaks');
      return { current: 0, longest: 0, lastDate: null };
    }
  });

  const [achievements, setAchievements] = useState(() => {
    try {
      const saved = localStorage.getItem('ascensionAchievements');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error parsing achievements from localStorage:', error);
      localStorage.removeItem('ascensionAchievements');
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ascensionXP', JSON.stringify(xp));
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('ascensionStreaks', JSON.stringify(streaks));
  }, [streaks]);

  useEffect(() => {
    localStorage.setItem('ascensionAchievements', JSON.stringify(achievements));
  }, [achievements]);

  // Load gamification data from backend on mount and when user authenticates
  useEffect(() => {
    const loadGamificationFromBackend = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return; // User not logged in

        const { api } = await import('../services/api');
        
        // Try to load XP, streaks, and achievements from backend
        try {
          const xpResponse = await api.getXP();
          if (xpResponse?.data) {
            const backendXP = xpResponse.data;
            setXp((prev) => ({
              global: backendXP.global || prev.global,
              domains: { ...prev.domains, ...(backendXP.domains || {}) },
            }));
          }
        } catch (error) {
          console.warn('Failed to load XP from backend:', error);
        }

        try {
          const streaksResponse = await api.getStreaks();
          if (streaksResponse?.data) {
            setStreaks((prev) => ({
              ...prev,
              ...streaksResponse.data,
            }));
          }
        } catch (error) {
          console.warn('Failed to load streaks from backend:', error);
        }

        try {
          const achievementsResponse = await api.getAchievements();
          if (achievementsResponse?.data) {
            setAchievements((prev) => {
              const backendAchievements = achievementsResponse.data || [];
              // Merge backend achievements with local (avoid duplicates)
              const merged = [...prev];
              backendAchievements.forEach(achievement => {
                if (!merged.includes(achievement)) {
                  merged.push(achievement);
                }
              });
              return merged;
            });
          }
        } catch (error) {
          console.warn('Failed to load achievements from backend:', error);
        }
      } catch (error) {
        console.warn('Failed to load gamification from backend:', error);
        // Continue with local data if backend fails
      }
    };

    // Load when component mounts if user is authenticated
    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        loadGamificationFromBackend();
      }
    };

    checkAuth();

    // Listen for authentication events
    const handleUserAuthenticated = () => {
      setTimeout(() => {
        loadGamificationFromBackend();
      }, 500);
    };

    window.addEventListener('user-authenticated', handleUserAuthenticated);
    
    return () => {
      window.removeEventListener('user-authenticated', handleUserAuthenticated);
    };
  }, []);

  const addXP = async (amount, domain = null) => {
    setXp((prev) => {
      const newXp = {
        ...prev,
        global: prev.global + amount,
      };
      
      if (domain) {
        newXp.domains[domain] = (newXp.domains[domain] || 0) + amount;
      }
      
      // Sync to backend if authenticated
      syncXPToBackend(newXp).catch(err => {
        console.warn('Failed to sync XP to backend:', err);
      });
      
      return newXp;
    });
  };

  // Sync XP to backend
  const syncXPToBackend = async (xpData) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return; // User not logged in

      const { api } = await import('../services/api');
      // Try dedicated endpoint first, fallback to settings
      try {
        await api.updateXP(xpData);
      } catch (error) {
        // Fallback to settings if dedicated endpoint doesn't exist
        await api.updateSettings({ xp: xpData });
      }
    } catch (error) {
      // Silently fail - progress is still saved locally
      console.warn('Failed to sync XP to backend:', error);
    }
  };

  const completeTask = (difficulty = 'medium', domain = null, dayNumber = null) => {
    // IMPORTANT: Day 0 (testing week) does NOT earn any gamification scores
    if (dayNumber === 0) {
      return 0;
    }
    
    const xpGained = XP_PER_TASK[difficulty] || XP_PER_TASK.medium;
    addXP(xpGained, domain);
    updateStreak();
    checkAchievements();
    return xpGained;
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastDate = streaks.lastDate;

    setStreaks((prev) => {
      let newStreaks;
      
      if (!lastDate) {
        newStreaks = { current: 1, longest: 1, lastDate: today };
      } else if (lastDate === today) {
        return prev; // Already logged today
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        if (lastDate === yesterdayStr) {
          const newCurrent = prev.current + 1;
          newStreaks = {
            current: newCurrent,
            longest: Math.max(prev.longest, newCurrent),
            lastDate: today,
          };
        } else {
          newStreaks = { current: 1, longest: prev.longest, lastDate: today };
        }
      }

      // Sync to backend if authenticated
      syncStreaksToBackend(newStreaks).catch(err => {
        console.warn('Failed to sync streaks to backend:', err);
      });

      return newStreaks;
    });
  };

  // Sync streaks to backend
  const syncStreaksToBackend = async (streaksData) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return; // User not logged in

      const { api } = await import('../services/api');
      // Try dedicated endpoint first, fallback to settings
      try {
        await api.updateStreaks(streaksData);
      } catch (error) {
        // Fallback to settings if dedicated endpoint doesn't exist
        await api.updateSettings({ streaks: streaksData });
      }
    } catch (error) {
      // Silently fail - progress is still saved locally
      console.warn('Failed to sync streaks to backend:', error);
    }
  };

  const checkAchievements = () => {
    const newAchievements = [];
    
    // Streak achievements
    if (streaks.current === 3 && !achievements.includes('3-day-start')) {
      newAchievements.push('3-day-start');
    }
    if (streaks.current === 7 && !achievements.includes('week-warrior')) {
      newAchievements.push('week-warrior');
    }
    if (streaks.current === 30 && !achievements.includes('month-master')) {
      newAchievements.push('month-master');
    }

    // XP achievements
    if (xp.global >= 1000 && !achievements.includes('first-thousand')) {
      newAchievements.push('first-thousand');
    }

    if (newAchievements.length > 0) {
      setAchievements((prev) => {
        const updated = [...prev, ...newAchievements];
        
        // Sync to backend if authenticated
        syncAchievementsToBackend(updated).catch(err => {
          console.warn('Failed to sync achievements to backend:', err);
        });
        
        return updated;
      });
    }
  };

  // Sync achievements to backend
  const syncAchievementsToBackend = async (achievementsData) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return; // User not logged in

      const { api } = await import('../services/api');
      await api.updateSettings({ achievements: achievementsData });
    } catch (error) {
      // Silently fail - progress is still saved locally
      console.warn('Failed to sync achievements to backend:', error);
    }
  };

  const getLevel = (domain = null) => {
    const totalXP = domain ? (xp.domains[domain] || 0) : xp.global;
    let level = 1;
    let xpForCurrentLevel = 0;
    
    while (xpForCurrentLevel + XP_FOR_LEVEL(level) <= totalXP) {
      xpForCurrentLevel += XP_FOR_LEVEL(level);
      level++;
    }
    
    return {
      level,
      currentXP: totalXP - xpForCurrentLevel,
      xpToNext: XP_FOR_LEVEL(level),
    };
  };

  return {
    xp,
    streaks,
    achievements,
    completeTask,
    addXP,
    getLevel,
  };
}

