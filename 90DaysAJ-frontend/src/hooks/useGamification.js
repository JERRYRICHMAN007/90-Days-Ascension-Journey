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

  const addXP = (amount, domain = null) => {
    setXp((prev) => {
      const newXp = {
        ...prev,
        global: prev.global + amount,
      };
      
      if (domain) {
        newXp.domains[domain] = (newXp.domains[domain] || 0) + amount;
      }
      
      return newXp;
    });
  };

  const completeTask = (difficulty = 'medium', domain = null) => {
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
      if (!lastDate) {
        return { current: 1, longest: 1, lastDate: today };
      }

      if (lastDate === today) {
        return prev; // Already logged today
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (lastDate === yesterdayStr) {
        const newCurrent = prev.current + 1;
        return {
          current: newCurrent,
          longest: Math.max(prev.longest, newCurrent),
          lastDate: today,
        };
      } else {
        return { current: 1, longest: prev.longest, lastDate: today };
      }
    });
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
      setAchievements((prev) => [...prev, ...newAchievements]);
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

