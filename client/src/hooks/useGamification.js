import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/storageKeys.js';

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

const ACHIEVEMENT_RULES = [
  { id: '3-day-start', test: (ctx) => ctx.streaks.current >= 3 },
  { id: 'week-warrior', test: (ctx) => ctx.streaks.current >= 7 },
  { id: 'month-master', test: (ctx) => ctx.streaks.current >= 30 },
  { id: 'first-thousand', test: (ctx) => ctx.xp.global >= 1000 },
  {
    id: 'body-builder',
    test: (ctx) => (ctx.domainCompletions['body-transformation'] || 0) >= 30,
  },
];

function countDomainCompletions(domain) {
  try {
    const saved = localStorage.getItem('sessionCompletions') || '{}';
    const completions = JSON.parse(saved);
    return Object.keys(completions).filter(
      (k) => k.startsWith(`${domain}_`) && completions[k]
    ).length;
  } catch {
    return 0;
  }
}

function dispatchGamificationEvent(name, detail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }
}

export function useGamification() {
  const [xp, setXp] = useState(() => {
    const defaultDomains = {
      'body-transformation': 0,
      'reading': 0,
      'writers': 0,
      'dual-brand': 0,
      'software-engineering': 0,
    };
    
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.XP);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all journey domains exist and default to 0 if missing
        return {
          global: parsed.global || 0,
          domains: { ...defaultDomains, ...(parsed.domains || {}) }
        };
      }
      return { global: 0, domains: defaultDomains };
    } catch (error) {
      console.error('Error parsing XP from localStorage:', error);
      localStorage.removeItem(STORAGE_KEYS.XP);
      return { global: 0, domains: defaultDomains };
    }
  });

  const [streaks, setStreaks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STREAKS);
      return saved ? JSON.parse(saved) : { current: 0, longest: 0, lastDate: null };
    } catch (error) {
      console.error('Error parsing streaks from localStorage:', error);
      localStorage.removeItem(STORAGE_KEYS.STREAKS);
      return { current: 0, longest: 0, lastDate: null };
    }
  });

  const [achievements, setAchievements] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error parsing achievements from localStorage:', error);
      localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.XP, JSON.stringify(xp));
  }, [xp]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STREAKS, JSON.stringify(streaks));
  }, [streaks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }, [achievements]);

  // Reload from localStorage when App.jsx finishes backend hydration
  const reloadFromStorage = useCallback(() => {
    try {
      const savedXp = localStorage.getItem(STORAGE_KEYS.XP);
      if (savedXp) {
        const parsed = JSON.parse(savedXp);
        setXp({
          global: Number(parsed.global) || 0,
          domains: {
            'body-transformation': 0,
            reading: 0,
            writers: 0,
            'dual-brand': 0,
            'software-engineering': 0,
            ...(parsed.domains || {}),
          },
        });
      }
    } catch (error) {
      console.warn('Failed to reload XP from storage:', error);
    }

    try {
      const savedStreaks = localStorage.getItem(STORAGE_KEYS.STREAKS);
      if (savedStreaks) {
        const parsed = JSON.parse(savedStreaks);
        setStreaks({
          current: Number(parsed.current) || 0,
          longest: Number(parsed.longest) || 0,
          lastDate: parsed.lastDate ?? null,
        });
      }
    } catch (error) {
      console.warn('Failed to reload streaks from storage:', error);
    }

    try {
      const savedAchievements = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (savedAchievements) {
        const parsed = JSON.parse(savedAchievements);
        setAchievements(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.warn('Failed to reload achievements from storage:', error);
    }
  }, []);

  useEffect(() => {
    const onHydrated = () => reloadFromStorage();
    window.addEventListener('gamification-hydrated', onHydrated);
    return () => window.removeEventListener('gamification-hydrated', onHydrated);
  }, [reloadFromStorage]);

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

  // Sync streaks to backend
  const syncStreaksToBackend = async (streaksData) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) return;

      const { api } = await import('../services/api');
      try {
        await api.updateStreaks(streaksData);
      } catch (error) {
        await api.updateSettings({ streaks: streaksData });
      }
    } catch (error) {
      console.warn('Failed to sync streaks to backend:', error);
    }
  };

  const syncAchievementsToBackend = async (newlyUnlocked = []) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken || !newlyUnlocked.length) return;

      const { api } = await import('../services/api');
      for (const achievementId of newlyUnlocked) {
        try {
          await api.unlockAchievement(achievementId);
        } catch (err) {
          console.warn('Failed to unlock achievement on server:', achievementId, err);
        }
      }
    } catch (error) {
      console.warn('Failed to sync achievements to backend:', error);
    }
  };

  const evaluateAchievements = (xpState, streaksState, currentAchievements) => {
    const ctx = {
      xp: xpState,
      streaks: streaksState,
      domainCompletions: {
        'body-transformation': countDomainCompletions('body-transformation'),
      },
    };
    return ACHIEVEMENT_RULES.filter(
      (rule) => !currentAchievements.includes(rule.id) && rule.test(ctx)
    ).map((r) => r.id);
  };

  const completeTask = (difficulty = 'medium', domain = null, dayNumber = null) => {
    if (dayNumber === 0) {
      return 0;
    }

    const xpGained = XP_PER_TASK[difficulty] || XP_PER_TASK.medium;

    setXp((prevXp) => {
      const newXp = {
        ...prevXp,
        global: prevXp.global + xpGained,
        domains: domain
          ? { ...prevXp.domains, [domain]: (prevXp.domains[domain] || 0) + xpGained }
          : prevXp.domains,
      };
      syncXPToBackend(newXp).catch(() => {});

      setStreaks((prevStreaks) => {
        const today = new Date().toDateString();
        const lastDate = prevStreaks.lastDate;
        let newStreaks = prevStreaks;

        if (!lastDate) {
          newStreaks = { current: 1, longest: 1, lastDate: today };
        } else if (lastDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastDate === yesterday.toDateString()) {
            const newCurrent = prevStreaks.current + 1;
            newStreaks = {
              current: newCurrent,
              longest: Math.max(prevStreaks.longest, newCurrent),
              lastDate: today,
            };
          } else {
            newStreaks = { current: 1, longest: prevStreaks.longest, lastDate: today };
          }
        }

        syncStreaksToBackend(newStreaks).catch(() => {});

        setAchievements((achNow) => {
          const ids = evaluateAchievements(newXp, newStreaks, achNow);
          if (ids.length === 0) return achNow;
          syncAchievementsToBackend(ids).catch(() => {});
          ids.forEach((id) => {
            dispatchGamificationEvent('achievement-unlocked', { achievementId: id });
          });
          return [...achNow, ...ids];
        });

        return newStreaks;
      });

      return newXp;
    });

    dispatchGamificationEvent('xp-gained', { amount: xpGained, domain, dayNumber });
    return xpGained;
  };

  const checkAchievements = () => {
    setAchievements((achNow) => {
      setXp((xpNow) => {
        setStreaks((streaksNow) => {
          const ids = evaluateAchievements(xpNow, streaksNow, achNow);
          if (ids.length > 0) {
            syncAchievementsToBackend(ids).catch(() => {});
            ids.forEach((id) => {
              dispatchGamificationEvent('achievement-unlocked', { achievementId: id });
            });
            setAchievements([...achNow, ...ids]);
          }
          return streaksNow;
        });
        return xpNow;
      });
      return achNow;
    });
  };

  const getLevel = (domain = null) => {
    const totalXP = domain ? (xp.domains && xp.domains[domain] ? xp.domains[domain] : 0) : (xp.global || 0);
    
    // If XP is 0 or undefined, start at Level 0 (progressing to Level 1)
    if (!totalXP || totalXP === 0) {
      return {
        level: 0,
        currentXP: 0,
        xpToNext: XP_FOR_LEVEL(1), // Need 100 XP to reach Level 1
      };
    }
    
    // Start from Level 0 and calculate which level the XP corresponds to
    let level = 0;
    let xpForCurrentLevel = 0;
    
    // Calculate level: Level 0 -> Level 1 needs 100 XP, Level 1 -> Level 2 needs 150 XP, etc.
    while (xpForCurrentLevel + XP_FOR_LEVEL(level + 1) <= totalXP) {
      xpForCurrentLevel += XP_FOR_LEVEL(level + 1);
      level++;
    }
    
    return {
      level,
      currentXP: totalXP - xpForCurrentLevel,
      xpToNext: XP_FOR_LEVEL(level + 1), // XP needed to reach next level
    };
  };

  /**
   * Reset all gamification data (XP, streaks, achievements)
   * Use this when starting fresh on Day 0
   */
  const resetAllGamification = async () => {
    // Reset XP - explicitly set all journey domains to 0
    const resetXP = {
      global: 0,
      domains: {
        'body-transformation': 0,
        'reading': 0,
        'writers': 0,
        'dual-brand': 0,
        'software-engineering': 0,
      }
    };
    setXp(resetXP);
    localStorage.setItem(STORAGE_KEYS.XP, JSON.stringify(resetXP));
    
    // Reset streaks
    const resetStreaks = { current: 0, longest: 0, lastDate: null };
    setStreaks(resetStreaks);
    localStorage.setItem(STORAGE_KEYS.STREAKS, JSON.stringify(resetStreaks));
    
    // Reset achievements
    setAchievements([]);
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify([]));
    
    // Clear journey-specific gamification data
    const journeyIds = ['body-transformation', 'reading', 'writers', 'dual-brand', 'software-engineering'];
    journeyIds.forEach(id => {
      localStorage.removeItem(`points_${id}`);
      localStorage.removeItem(`coins_${id}`);
      localStorage.removeItem(`level_${id}`);
      localStorage.removeItem(`achievements_${id}`);
    });
    
    // Sync to backend if authenticated
    try {
      await syncXPToBackend(resetXP);
      await syncStreaksToBackend(resetStreaks);
      await syncAchievementsToBackend([]);
    } catch (error) {
      console.warn('Failed to sync reset to backend:', error);
    }
    
    console.log('✅ All gamification data reset!');
  };

  return {
    xp,
    streaks,
    achievements,
    completeTask,
    addXP,
    getLevel,
    resetAllGamification,
  };
}

