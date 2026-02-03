import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Calendar,
  Flame,
  Star,
  TrendingUp,
  Play,
  BookOpen,
  Target,
  Code,
  FileText,
  ChevronDown,
  ChevronUp,
  Server,
  Smartphone,
  Globe,
  Clock,
  CheckCircle2,
  Menu,
  X,
  Circle,
  Info
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useGamification } from '../../hooks/useGamification';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentDayNumber, getCurrentPhaseStatus, getDateForDay, isDayAccessible, canCompleteDay, isTomorrow } from '../../utils/dates';
import { getCurrentPhase, getPhaseDayNumber, getPhaseDescription, formatPhaseDayNumber, isDisciplineAvailable } from '../../utils/phases';
import { calculateSessionBasedProgress, isDayFullyComplete, markSessionComplete, isSessionComplete, cleanInvalidProgress } from '../../utils/progressTracking';
import { hasScheduledActivities, getNoActivityMessage } from '../../utils/daySchedule';
import { SessionCompletionButton } from '../SessionCompletionButton';
import { getQuoteOfTheDay } from '../../data/quotes';
import { cn } from '../../lib/utils';
import { getJourneyPreparation } from '../../data/preparationData';
import { getSoftwareEngineeringReflection, getProjectComponentForDay, getDisciplineResources } from '../../data/journeyData';
import DailyQuiz from '../DailyQuiz';

/**
 * Journey Detail Page v2.0 - PRD Redesign
 * Clean, modern, intuitive layout with better navigation and content focus
 */
export function JourneyDetailV2({
  journey,
  weeks,
  selectedWeek,
  selectedDay,
  onWeekChange,
  onDayChange,
  userProgress,
  updateProgress,
  journeyId,
}) {
  const navigate = useNavigate();
  const { xp, getLevel, completeTask, addXP, achievements, streaks } = useGamification();
  const { user } = useAuth();
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };
  
  // Get what user is working on today
  const getTodayFocus = () => {
    if (isPreparationPhase) {
      return 'Preparing for your journey';
    }
    if (currentDay) {
      if (isTomorrow(currentDay.dayNumber)) {
        return `Previewing tomorrow's content`;
      }
      return `Working on Day ${currentDay.dayNumber}`;
    }
    return 'Starting your journey';
  };
  
  // Safety checks - early returns
  if (!journey) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center">
          <p className="text-destructive">Journey not found. Please go back and try again.</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">Go to Dashboard</Button>
        </Card>
      </div>
    );
  }
  
  if (!weeks || !Array.isArray(weeks) || weeks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No weeks data available for this journey.</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">Go to Dashboard</Button>
        </Card>
      </div>
    );
  }
  
  // Safe access with defaults (xp and getLevel already declared above)
  // Ensure all journeys start at 0 XP and Level 1
  const journeyXP = (xp?.domains?.[journeyId]) || 0;
  
  // FORCE Level 0 if XP is 0 or if we're on Day 0 (preparation phase)
  // This ensures all journeys show "Progress to Level 1" when starting
  const currentDayForLevelCheck = getCurrentDayNumber();
  const phaseForLevelCheck = getCurrentPhaseStatus();
  const isDay0 = currentDayForLevelCheck === 0 || currentDayForLevelCheck === null || phaseForLevelCheck === 'preparation';
  
  // If XP is 0 OR we're on Day 0/preparation, ALWAYS force Level 1
  // This prevents showing incorrect levels from old data
  const shouldForceLevel1 = journeyXP === 0 || isDay0;
  
  const journeyLevelData = getLevel ? getLevel(journeyId) : { level: 0, currentXP: 0, xpToNext: 100 };
  const journeyLevel = shouldForceLevel1 
    ? { level: 0, currentXP: 0, xpToNext: 100 } 
    : journeyLevelData;
  const journeyProgress = userProgress?.[journeyId] || {};
  
  // Clean invalid progress data first (removes stale completions from old structure)
  // This runs once when component mounts or when journey/weeks change
  useEffect(() => {
    if (weeks && weeks.length > 0) {
      cleanInvalidProgress(journeyId, weeks);
    }
  }, [journeyId, weeks]);
  
  // Use session-based progress calculation ONLY (completion-based, not time-based)
  // No fallback to legacy progress - all progress must be earned
  const sessionProgress = calculateSessionBasedProgress(journeyId, weeks);
  const completedDays = sessionProgress.completedDays || 0;
  const progressPercentage = sessionProgress.percentage || 0;

  // Check if we're in preparation phase (Day 0)
  const currentPhase = getCurrentPhase();
  const currentDayNumber = getCurrentDayNumber();
  
  // Day 1 starts on January 18, 2026 - no Day 0 preparation phase
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // No preparation phase - journey starts directly on Day 1
  const isPreparationPhase = false;
  
  // Always get preparation data so Day 0 is always available
  const preparationData = getJourneyPreparation(journeyId);
  
  // Find current week - handle case where selectedWeek might be out of bounds
  // Calculate which week the selected day belongs to
  // Day 1 = Week 1, Days 1-7 = Week 1, Days 8-14 = Week 2, etc.
  let effectiveWeek = selectedWeek;
  if (selectedDay >= 1) {
    // Calculate which week the selected day belongs to (Day 1 starts Week 1)
    const calculatedWeek = Math.floor((selectedDay - 1) / 7) + 1;
    if (calculatedWeek >= 1 && calculatedWeek <= weeks.length) {
      effectiveWeek = calculatedWeek;
    }
  }
  // Find current week - prioritize selected week, but fallback to effective week if day not found
  let currentWeek = weeks.find((w) => w && w.weekNumber === selectedWeek) || weeks.find((w) => w && w.weekNumber === effectiveWeek) || weeks[0] || null;
  
  // Find current day - search across all weeks to ensure we find it regardless of selected week
  // This ensures the mark complete button works for all weeks, not just week 1
  let currentDay = null;
  if (!isPreparationPhase && selectedDay > 0) {
    // First, try to find the day in the selected week (optimization)
    if (currentWeek?.days && Array.isArray(currentWeek.days) && currentWeek.days.length > 0) {
      currentDay = currentWeek.days.find((d) => d && d.dayNumber === selectedDay) || null;
    }
    
    // If not found in selected week, try effective week
    if (!currentDay && effectiveWeek !== selectedWeek) {
      const effectiveWeekData = weeks.find((w) => w && w.weekNumber === effectiveWeek);
      if (effectiveWeekData?.days && Array.isArray(effectiveWeekData.days) && effectiveWeekData.days.length > 0) {
        currentDay = effectiveWeekData.days.find((d) => d && d.dayNumber === selectedDay) || null;
        if (currentDay) {
          currentWeek = effectiveWeekData;
        }
      }
    }
    
    // If still not found, search across ALL weeks for the selected day
    // This ensures we can find and mark complete days in any week
    if (!currentDay && weeks.length > 0) {
      for (const week of weeks) {
        if (week && week.days && Array.isArray(week.days) && week.days.length > 0) {
          const foundDay = week.days.find((d) => d && d.dayNumber === selectedDay);
          if (foundDay) {
            currentDay = foundDay;
            currentWeek = week;
            // Update selectedWeek to match the week where the day was found (only if different)
            // This ensures the UI shows the correct week when viewing days from other weeks
            if (selectedWeek !== week.weekNumber) {
              onWeekChange(week.weekNumber);
            }
            break;
          }
        }
      }
    }
  }
  
  // Debug: Log if currentDay is not found (only in development)
  if (import.meta.env.DEV && selectedDay > 0 && !currentDay && !isPreparationPhase) {
    console.warn(`[JourneyDetailV2] Day ${selectedDay} not found in any week for journey ${journeyId}`);
    console.warn('Available weeks:', weeks.map(w => ({ week: w?.weekNumber, days: w?.days?.map(d => d?.dayNumber) })));
  }

  // Tab state for content sections
  const [activeTab, setActiveTab] = useState('learning');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    frontend: true,
    backend: true,
    systems: true,
    project: true,
    resources: false,
    reflection: false
  });

  // Discipline state for Software Engineering
  const [activeDiscipline, setActiveDiscipline] = useState('Mobile');
  
  // Auto-select current day and week based on today's date (only on mount or when currentDayNumber changes)
  useEffect(() => {
    // Only auto-select if we have a valid current day number
    if (currentDayNumber !== null && currentDayNumber !== undefined && weeks.length > 0) {
      // Skip Day 0 - always start from Day 1
      const effectiveDay = currentDayNumber > 0 ? currentDayNumber : 1;
      
      // Calculate which week contains the current day
      // Day 1 = Week 1, Days 1-7 = Week 1, Days 8-14 = Week 2, etc.
      // Formula: Math.ceil((day - 1) / 7) + 1 ensures Day 1 = Week 1
      const currentWeekNumber = effectiveDay > 0 ? Math.ceil((effectiveDay - 1) / 7) + 1 : 1;
      
      // Ensure week number is within valid range
      const validWeekNumber = Math.max(1, Math.min(currentWeekNumber, weeks.length));
      
      // Only update if the selected day/week doesn't match the current day
      // This prevents infinite loops by checking if we need to update
      if (selectedDay !== effectiveDay || selectedWeek !== validWeekNumber) {
        // Update week first if needed
        if (selectedWeek !== validWeekNumber && validWeekNumber >= 1 && validWeekNumber <= weeks.length) {
          onWeekChange(validWeekNumber);
        }
        // Then update day (skip Day 0, always use Day 1 or higher)
        if (selectedDay !== effectiveDay) {
          onDayChange(effectiveDay);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDayNumber, weeks.length]); // Only run when currentDayNumber or weeks data changes
  
  // Auto-select first content day when week changes OR on initial load
  useEffect(() => {
    if (selectedWeek && weeks.length > 0) {
      const week = weeks.find(w => w && w.weekNumber === selectedWeek);
      if (week && week.days && week.days.length > 0) {
        // Find the first day with actual content (Day 1 or higher, skip Day 0)
        const firstContentDay = week.days.find(d => d && d.dayNumber > 0);
        if (firstContentDay) {
          // Auto-select if:
          // 1. No day is selected (null/undefined)
          // 2. Day 0 is selected (preparation day)
          // 3. Selected day is not in the current week
          const selectedDayInWeek = week.days.find(d => d && d.dayNumber === selectedDay);
          if (selectedDay === 0 || selectedDay === null || selectedDay === undefined || !selectedDayInWeek) {
            if (selectedDay !== firstContentDay.dayNumber) {
              onDayChange(firstContentDay.dayNumber);
            }
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeek, weeks]); // Run when selectedWeek changes or weeks load
  
  // Auto-scroll to selected week and day in horizontal navigation
  useEffect(() => {
    // Scroll to selected week
    setTimeout(() => {
      const weekButton = document.querySelector(`[data-week="${selectedWeek}"]`);
      if (weekButton) {
        weekButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 100);
  }, [selectedWeek]);
  
  useEffect(() => {
    // Scroll to selected day
    setTimeout(() => {
      const dayButton = document.querySelector(`[data-day="${selectedDay}"]`);
      if (dayButton) {
        dayButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 150);
  }, [selectedDay]);
  
  // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = useMemo(() => {
    if (!currentDay?.dayNumber) return null;
    const date = getDateForDay(currentDay.dayNumber);
    if (!date) return null;
    return date.getDay(); // 0 = Sunday, 6 = Saturday
  }, [currentDay?.dayNumber]);

  // Get day name (Monday, Tuesday, etc.)
  const dayName = useMemo(() => {
    if (!currentDay?.dayNumber) return null;
    const date = getDateForDay(currentDay.dayNumber);
    if (!date) return null;
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[date.getDay()];
  }, [currentDay?.dayNumber]);

  const isSunday = dayOfWeek === 0;
  const isMonday = dayOfWeek === 1;
  const isTuesday = dayOfWeek === 2;
  const isWednesday = dayOfWeek === 3;
  const isThursday = dayOfWeek === 4;
  const isFriday = dayOfWeek === 5;
  const isSaturday = dayOfWeek === 6;
  const isMondayToWednesday = isMonday || isTuesday || isWednesday;
  const isThursdayToFriday = isThursday || isFriday;

  // Get scheduled disciplines for the current day based on schedule
  const scheduledDisciplines = useMemo(() => {
    if (journeyId !== 'software-engineering' || !currentDay?.schedule) {
      return [];
    }
    
    const schedule = currentDay.schedule;
    const disciplinesSet = new Set();
    
    // Check deepLearning sessions
    if (schedule.scheduledContent?.deepLearning) {
      schedule.scheduledContent.deepLearning.forEach(block => {
        if (block.discipline) {
          disciplinesSet.add(block.discipline);
        }
      });
    }
    
    // Check focusedImplementation sessions
    if (schedule.scheduledContent?.focusedImplementation) {
      schedule.scheduledContent.focusedImplementation.forEach(block => {
        if (block.discipline) {
          disciplinesSet.add(block.discipline);
        }
      });
    }
    
    return Array.from(disciplinesSet);
  }, [journeyId, currentDay?.schedule]);

  // Discipline order based on time schedule - only show disciplines scheduled for this day
  // Schedule: Mon-Wed: Mobile | Thu-Fri: Frontend | Fri: Backend | Sat: Mobile, Frontend, Backend (Revisions) | Sun: WordPress
  const allDisciplines = [
    { id: 'Mobile', label: 'Mobile', icon: Smartphone, color: '#f59e0b' },
    { id: 'Frontend', label: 'Frontend', icon: Code, color: '#667eea' },
    { id: 'Backend', label: 'Backend', icon: Server, color: '#10b981' },
    { id: 'WordPress', label: 'WordPress', icon: Globe, color: '#8b5cf6' },
  ];

  // Filter to only show disciplines that are available in current phase
  const disciplines = useMemo(() => {
    if (journeyId !== 'software-engineering') {
      return allDisciplines;
    }
    
    // Use phase-based filtering
    const dayNumber = currentDay?.dayNumber || selectedDay;
    if (dayNumber) {
      return allDisciplines.filter(d => isDisciplineAvailable(d.id, dayNumber));
    }
    
    // Fallback: if no day number, show Phase 1 disciplines
    return allDisciplines.filter(d => d.id === 'Mobile' || d.id === 'Frontend');
  }, [journeyId, currentDay?.dayNumber, selectedDay]);
  
  // Auto-select first available discipline if current one is not scheduled
  useEffect(() => {
    if (journeyId === 'software-engineering' && disciplines.length > 0) {
      const isCurrentDisciplineScheduled = disciplines.some(d => d.id === activeDiscipline);
      if (!isCurrentDisciplineScheduled) {
        // Switch to first scheduled discipline
        setActiveDiscipline(disciplines[0].id);
      }
    }
  }, [journeyId, disciplines, activeDiscipline]);

  // Filter schedule content by active discipline for Software Engineering
  const getDisciplineContent = () => {
    if (journeyId !== 'software-engineering' || !currentDay?.schedule) {
      return null;
    }

    // Check if this discipline is scheduled for today
    const isDisciplineScheduled = scheduledDisciplines.includes(activeDiscipline) || 
      (activeDiscipline === 'WordPress' && scheduledDisciplines.includes('Systems Engineering'));

    if (!isDisciplineScheduled) {
      // Return empty content with a flag to show "not scheduled" message
      return {
        deepLearning: [],
        implementation: [],
        resources: [],
        reflection: null,
        notScheduled: true
      };
    }

    const schedule = currentDay.schedule;
    const deepLearningSessions = schedule?.scheduledContent?.deepLearning?.filter(
      (block) => block.discipline === activeDiscipline || (block.discipline === 'Systems Engineering' && activeDiscipline === 'WordPress')
    ) || [];
    
    const implementationSessions = schedule?.scheduledContent?.focusedImplementation?.filter(
      (block) => block.discipline === activeDiscipline || (block.discipline === 'Systems Engineering' && activeDiscipline === 'WordPress')
    ) || [];

    // Get resources and reflection filtered by discipline
    const disciplineResources = currentDay.resources || [];
    const disciplineReflection = currentDay.reflection;

    return {
      deepLearning: deepLearningSessions,
      implementation: implementationSessions,
      resources: disciplineResources,
      reflection: disciplineReflection,
      notScheduled: false
    };
  };

  const disciplineContent = getDisciplineContent();

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getDayProgress = (day) => {
    if (!day || !day.dayNumber) return false;
    return journeyProgress[day.dayNumber] || false;
  };

  // Extract all tasks from current day (discipline-aware for Software Engineering)
  const extractTasks = (day) => {
    if (!day) return [];
    
    // Don't extract tasks for Week 1 (Testing & Trials Week)
    if (day.isTestRun) return [];
    
    const tasks = [];
    
    // Dual Brand tasks
    if (journeyId === 'dual-brand') {
      if (day.personalBrandTasks) {
        tasks.push({
          id: `personal-brand-${day.dayNumber}`,
          text: day.personalBrandTasks,
          category: 'Personal Brand'
        });
      }
      if (day.companyBrandTasks) {
        tasks.push({
          id: `company-brand-${day.dayNumber}`,
          text: day.companyBrandTasks,
          category: 'Company Brand'
        });
      }
      // Legacy support
      if (day.ryxenTasks && !day.personalBrandTasks) {
        tasks.push({
          id: `ryxen-${day.dayNumber}`,
          text: day.ryxenTasks,
          category: 'Personal Brand'
        });
      }
      if (day.havenXTasks && !day.companyBrandTasks) {
        tasks.push({
          id: `havenx-${day.dayNumber}`,
          text: day.havenXTasks,
          category: 'Company Brand'
        });
      }
    }
    
    // Body Transformation tasks
    if (journeyId === 'body-transformation' && day.workout) {
      tasks.push({
        id: `workout-${day.dayNumber}`,
        text: `Complete ${day.focus || 'workout'} session`,
        category: 'Workout'
      });
    }
    
    // Reading tasks
    if (journeyId === 'reading' && day.readingSessions) {
      day.readingSessions.forEach((session, idx) => {
        const materialText = typeof session.material === 'object' 
          ? session.material.text 
          : session.material;
        tasks.push({
          id: `reading-${day.dayNumber}-${idx}`,
          text: `${session.type}: ${materialText}`,
          category: 'Reading'
        });
      });
    }
    
    // Writer's Journey tasks (skip rest days)
    if (journeyId === 'writers' && day.execution && !day.isRestDay) {
      tasks.push({
        id: `writers-${day.dayNumber}`,
        text: day.execution,
        category: 'Writing'
      });
    }
    
    // Software Engineering tasks - discipline-specific
    if (journeyId === 'software-engineering' && day.schedule?.scheduledContent) {
      const schedule = day.schedule.scheduledContent;
      
      // Get tasks for the active discipline
      const disciplineTasks = [];
      
      // Deep Learning sessions for active discipline
      if (schedule.deepLearning && Array.isArray(schedule.deepLearning)) {
        schedule.deepLearning.forEach((session, idx) => {
          if (session.discipline === activeDiscipline && session.content) {
            const learningTitle = session.content.title || 'Learning Session';
            const duration = session.duration || '';
            disciplineTasks.push({
              id: `se-${activeDiscipline.toLowerCase()}-learning-${day.dayNumber}-${idx}`,
              text: `${activeDiscipline}: ${learningTitle}${duration ? ` (${duration})` : ''}`,
              category: `${activeDiscipline} Learning`,
              discipline: activeDiscipline
            });
          }
        });
      }
      
      // Focused Implementation sessions for active discipline
      if (schedule.focusedImplementation && Array.isArray(schedule.focusedImplementation)) {
        schedule.focusedImplementation.forEach((session, idx) => {
          if (session.discipline === activeDiscipline && session.content) {
            const projectTitle = session.content.title || 'Implementation Session';
            const duration = session.duration || '';
            disciplineTasks.push({
              id: `se-${activeDiscipline.toLowerCase()}-implementation-${day.dayNumber}-${idx}`,
              text: `${activeDiscipline}: ${projectTitle}${duration ? ` (${duration})` : ''}`,
              category: `${activeDiscipline} Implementation`,
              discipline: activeDiscipline
            });
          }
        });
      }
      
      // If no discipline-specific tasks found, check for general project
      if (disciplineTasks.length === 0 && day.project) {
        const projectTitle = typeof day.project === 'object'
          ? day.project.title
          : day.project;
        tasks.push({
          id: `se-project-${day.dayNumber}`,
          text: `Complete project: ${projectTitle}`,
          category: 'Project'
        });
      } else {
        // Add discipline-specific tasks
        tasks.push(...disciplineTasks);
      }
    }
    
    return tasks;
  };

  // Get tasks for current day (include activeDiscipline for Software Engineering)
  const dayTasks = useMemo(() => extractTasks(currentDay), [currentDay, journeyId, activeDiscipline]);
  
  // Task completion state (discipline-aware for Software Engineering)
  const [taskCompletion, setTaskCompletion] = useState(() => {
    if (!currentDay?.dayNumber) return {};
    try {
      const key = journeyId === 'software-engineering' && currentDay?.dayNumber
        ? `tasks_${journeyId}_${currentDay.dayNumber}_${activeDiscipline}`
        : `tasks_${journeyId}_${currentDay.dayNumber}`;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Update task completion when day or discipline changes
  useEffect(() => {
    if (!currentDay?.dayNumber) {
      setTaskCompletion({});
      return;
    }
    try {
      const key = journeyId === 'software-engineering' && currentDay?.dayNumber
        ? `tasks_${journeyId}_${currentDay.dayNumber}_${activeDiscipline}`
        : `tasks_${journeyId}_${currentDay.dayNumber}`;
      const saved = localStorage.getItem(key);
      setTaskCompletion(saved ? JSON.parse(saved) : {});
    } catch {
      setTaskCompletion({});
    }
  }, [currentDay?.dayNumber, journeyId, activeDiscipline]);

  // Toggle task completion
  const toggleTask = (taskId) => {
    const wasCompleted = taskCompletion[taskId] === true;
    const newCompletion = {
      ...taskCompletion,
      [taskId]: !wasCompleted
    };
    setTaskCompletion(newCompletion);
    
    // Award XP when task is completed (not when uncompleting)
    // IMPORTANT: Day 0 (testing week) does NOT earn any gamification scores
    if (!wasCompleted && completeTask && currentDay?.dayNumber !== 0) {
      completeTask('medium', journeyId, currentDay?.dayNumber);
    }
    
    if (currentDay?.dayNumber) {
      const key = journeyId === 'software-engineering' && currentDay?.dayNumber
        ? `tasks_${journeyId}_${currentDay.dayNumber}_${activeDiscipline}`
        : `tasks_${journeyId}_${currentDay.dayNumber}`;
      localStorage.setItem(key, JSON.stringify(newCompletion));
    }
  };

  // Check if all tasks are completed
  const allTasksCompleted = useMemo(() => {
    if (dayTasks.length === 0) return true; // No tasks means "completed"
    return dayTasks.every(task => taskCompletion[task.id] === true);
  }, [dayTasks, taskCompletion]);

  // REMOVED: Auto-completion logic
  // Progress must be explicitly earned through session completion.
  // Days are only marked complete when user explicitly confirms all sessions are done.
  // No automatic progress advancement based on task completion.
  
  const getWeekProgress = (week) => {
    if (!week || !week.days) return 0;
    const weekDays = week.days || [];
    if (weekDays.length === 0) return 0;
    
    // Count days with completed sessions
    const completed = weekDays.filter((d) => {
      if (!d || d.dayNumber === null || d.dayNumber === undefined) return false;
      return isDayFullyComplete(journeyId, d) || journeyProgress[d.dayNumber];
    }).length;
    
    return Math.round((completed / weekDays.length) * 100);
  };

  // Find the next day for preview/preparation (only if it's tomorrow)
  const findNextDay = () => {
    // Calculate next day number
    const nextDayNumber = selectedDay === 0 ? 1 : selectedDay + 1;
    
    // Only show next day if it's accessible (today or tomorrow)
    if (!isDayAccessible(nextDayNumber)) {
      return null;
    }
    
    // Don't show next day if we're already at the last day (90)
    if (nextDayNumber > journey.totalDays) {
      return null;
    }

    // Search across all weeks for the next day
    for (const week of weeks) {
      if (week && week.days && Array.isArray(week.days)) {
        const nextDay = week.days.find((d) => d && d.dayNumber === nextDayNumber);
        if (nextDay) {
          return nextDay;
        }
      }
    }
    
    // If not found in weeks, create a placeholder using getDateForDay
    const nextDate = getDateForDay(nextDayNumber);
    if (nextDate) {
      return {
        dayNumber: nextDayNumber,
        date: nextDate.toISOString().split('T')[0]
      };
    }
    
    return null;
  };

  const nextDay = findNextDay();

  const formatDateShort = (dateString) => {
    if (!dateString) return '';
    try {
      // Parse date string properly to avoid timezone issues
      // dateString is in format "YYYY-MM-DD"
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const formatDayName = (dateString) => {
    if (!dateString) return '';
    try {
      // Parse date string properly to avoid timezone issues
      // dateString is in format "YYYY-MM-DD"
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day); // month is 0-indexed
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } catch {
      return '';
    }
  };

  // Journey color mapping
  const journeyColors = {
    'body-transformation': {
      gradient: 'from-journey-body to-journey-body/80',
      border: 'border-journey-body',
      bg: 'bg-journey-body/10',
    },
    'dual-brand': {
      gradient: 'from-journey-brand to-journey-brand/80',
      border: 'border-journey-brand',
      bg: 'bg-journey-brand/10',
    },
    'reading': {
      gradient: 'from-journey-reading to-journey-reading/80',
      border: 'border-journey-reading',
      bg: 'bg-journey-reading/10',
    },
    'writers': {
      gradient: 'from-journey-writing to-journey-writing/80',
      border: 'border-journey-writing',
      bg: 'bg-journey-writing/10',
    },
    'software-engineering': {
      gradient: 'from-journey-software to-journey-software/80',
      border: 'border-journey-software',
      bg: 'bg-journey-software/10',
    },
  };

  const colors = journeyColors[journeyId] || journeyColors['body-transformation'];
  // Handle icon - can be either a React component or a string (emoji)
  const IconComponent = typeof journey.icon === 'string' 
    ? null 
    : journey.icon;
  const iconEmoji = typeof journey.icon === 'string' 
    ? journey.icon 
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Section A - Personalized Header - Better Mobile Layout */}
      <div className="bg-background border-b border-border/50 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard')}
                className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 touch-manipulation"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <div className="min-w-0 flex-1 overflow-hidden">
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-foreground mb-1 break-words leading-tight">
                  {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground break-words leading-relaxed">
                  {getTodayFocus()}
                </p>
              </div>
            </div>
          </div>
          
          {/* Gamification Display */}
          {currentDay && !isPreparationPhase && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-3.5 md:p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">XP</p>
                      <p className="text-sm sm:text-base font-bold text-foreground">{journeyXP}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Level</p>
                      <p className="text-sm sm:text-base font-bold text-foreground">{journeyLevel?.level || 1}</p>
                    </div>
                  </div>
                  {streaks && (
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">Streak</p>
                        <p className="text-sm sm:text-base font-bold text-foreground">{streaks.current || 0}</p>
                      </div>
                    </div>
                  )}
                  {achievements && achievements.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🏆</span>
                      <div>
                        <p className="text-xs text-muted-foreground">Badges</p>
                        <p className="text-sm sm:text-base font-bold text-foreground">{achievements.length}</p>
                      </div>
                    </div>
                  )}
                </div>
                {journeyLevel && journeyLevel.xpToNext > 0 && (
                  <div className="flex-1 min-w-[150px] max-w-[300px]">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Progress to Level {journeyLevel.level + 1}</span>
                      <span>{journeyLevel.currentXP} / {journeyLevel.xpToNext}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(journeyLevel.currentXP / journeyLevel.xpToNext) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lightweight Helper Banner */}
          {currentDay && !isPreparationPhase && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-3.5 md:p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm md:text-base text-foreground leading-relaxed break-words">
                    {isTomorrow(currentDay.dayNumber) 
                      ? "You're previewing tomorrow's content. Complete today's tasks first to maintain your streak."
                      : "Focus on today's tasks. You can preview tomorrow's content to plan ahead."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section B - Learning / Journey Overview - Better Mobile Layout */}
      <div className="bg-muted/30 border-b border-border/50 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 min-w-0 flex-1">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center shrink-0`}>
                {IconComponent ? (
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                ) : (
                  <span className="text-base sm:text-lg md:text-xl text-white">{iconEmoji}</span>
                )}
              </div>
              <div className="min-w-0 flex-1 overflow-hidden">
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-foreground truncate">{journey.title}</h2>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{journey.description}</p>
              </div>
            </div>
            
            {/* Status Pills */}
            <div className="flex items-center gap-2 shrink-0">
              {progressPercentage === 100 ? (
                <span className="px-2.5 sm:px-3 py-1.5 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="hidden sm:inline">Completed</span>
                  <span className="sm:hidden">Done</span>
                </span>
              ) : (
                <span className="px-2.5 sm:px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium whitespace-nowrap">
                  In Progress
                </span>
              )}
            </div>
          </div>

          {/* Progress Indicator - Better Mobile Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-foreground">{progressPercentage}%</span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Week </span>
                <span className="font-semibold text-foreground">{selectedWeek} of {weeks.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Day </span>
                <span className="font-semibold text-foreground">{completedDays} of {journey.totalDays}</span>
              </div>
            </div>

            {/* Phase Information - Software Engineering */}
            {journeyId === 'software-engineering' && currentDay?.dayNumber && (
              <div className="text-sm space-y-1">
                {(() => {
                  const phase = getCurrentPhase(currentDay.dayNumber);
                  const phaseDay = getPhaseDayNumber(currentDay.dayNumber);
                  const phaseDesc = getPhaseDescription(phase);
                  const phaseDaysRemaining = phase === 1 ? (90 - phaseDay) : phase === 2 ? (180 - phaseDay) : null;
                  
                  if (!phase) return null;
                  
                  return (
                    <>
                      <div>
                        <span className="text-muted-foreground">Phase {phase}: </span>
                        <span className="font-medium text-foreground">{phaseDesc}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phase Day: </span>
                        <span className="font-medium text-foreground">{formatPhaseDayNumber(currentDay.dayNumber)}</span>
                        {phaseDaysRemaining !== null && (
                          <span className="text-muted-foreground ml-2">({phaseDaysRemaining} days remaining)</span>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
            
            {/* Learning Plan Summary - Software Engineering */}
            {journeyId === 'software-engineering' && currentDay?.schedule && (
              <div className="text-sm">
                <span className="text-muted-foreground">Today: </span>
                <span className="font-medium text-foreground">
                  {currentDay.schedule.scheduledContent?.deepLearning?.map(b => b.discipline).filter((v, i, a) => a.indexOf(v) === i).join(', ') || 'No sessions'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Horizontal Navigation Bar - Weeks and Days */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm shrink-0">
        <div className="w-full">
          {/* Weeks Navigation - Horizontal */}
          <div className="py-3 sm:py-4 px-4 sm:px-6">
            <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-2 sm:mb-3 uppercase tracking-wide">Learning Plan</h3>
            <div 
              id="weeks-nav"
              className="flex gap-2 sm:gap-3 overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide -mx-4 sm:-mx-6 px-4 sm:px-6"
              style={{ 
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-x'
              }}
            >
              {weeks.map((week) => {
                const weekProgress = getWeekProgress(week);
                // Active week: use selectedWeek (which defaults to current week, but changes when user clicks)
                const isActive = week.weekNumber === selectedWeek;
                
                return (
                  <button
                    key={week.weekNumber}
                    onClick={() => {
                      onWeekChange(week.weekNumber);
                      // Automatically select the first CONTENT day (Day 1 or higher, skip Day 0)
                      const selectedWeekData = weeks.find(w => w.weekNumber === week.weekNumber);
                      if (selectedWeekData?.days && selectedWeekData.days.length > 0) {
                        // Find the first day with actual content (Day 1 or higher)
                        const firstContentDay = selectedWeekData.days.find(d => d && d.dayNumber > 0);
                        if (firstContentDay && firstContentDay.dayNumber !== selectedDay) {
                          onDayChange(firstContentDay.dayNumber);
                        }
                      }
                      // Auto-scroll to selected week
                      setTimeout(() => {
                        const button = document.querySelector(`[data-week="${week.weekNumber}"]`);
                        button?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                      }, 100);
                    }}
                    data-week={week.weekNumber}
                    className={cn(
                      'shrink-0 flex flex-col items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 touch-manipulation min-w-[80px] sm:min-w-[100px]',
                      isActive 
                        ? `bg-gradient-to-br ${colors.gradient} text-white shadow-lg scale-105` 
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-border/50'
                    )}
                  >
                    <span>Week {week.weekNumber}</span>
                    {weekProgress > 0 && (
                      <span className={cn(
                        'text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold',
                        isActive ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                      )}>
                        {weekProgress}%
                      </span>
                    )}
                  </button>
                );
              })}
              </div>
            </div>

          {/* Days Navigation - Horizontal (for selected week) */}
          {currentWeek?.days && currentWeek.days.length > 0 && (
            <div className="py-3 sm:py-4 border-t border-border/30 px-4 sm:px-6">
              <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground mb-2 sm:mb-3 uppercase tracking-wide">
                Week {selectedWeek} - Days
              </h3>
              <div 
                id="days-nav"
                className="flex gap-2 sm:gap-3 overflow-x-auto overflow-y-hidden pb-2 scrollbar-hide -mx-4 sm:-mx-6 px-4 sm:px-6"
                style={{ 
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch',
                  touchAction: 'pan-x'
                }}
              >
                {/* Day 0 - Preparation (only show in Week 1) */}
                {preparationData && selectedWeek === 0 && (
                  <button
                    onClick={() => {
                      onDayChange(0);
                      setTimeout(() => {
                        const button = document.querySelector('[data-day="0"]');
                        button?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                      }, 100);
                    }}
                    data-day="0"
                    className={cn(
                      'shrink-0 flex flex-col items-center justify-center gap-1 sm:gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation min-w-[85px] sm:min-w-[95px] max-w-[95px] sm:max-w-[105px]',
                      selectedDay === 0
                        ? `bg-gradient-to-br ${colors.gradient} text-white shadow-lg scale-105` 
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-border/50'
                    )}
                  >
                    <span className="text-base sm:text-lg font-bold">0</span>
                    <span className="text-[10px] sm:text-xs">Prep</span>
                  </button>
                )}
                
                {/* Days for current week */}
                {currentWeek.days.map((day) => {
                  if (!day || !day.dayNumber) return null;
                  
                  const isCompleted = getDayProgress(day);
                  const isActive = day.dayNumber === selectedDay;
                  const dayIsTomorrow = isTomorrow(day.dayNumber);
                  
                  // Get date for day name
                  const dateForDay = day.date || (getDateForDay(day.dayNumber)?.toISOString());
                  const dayName = dateForDay ? formatDayName(dateForDay) : '';
                  
                  return (
                    <button
                      key={day.dayNumber}
                      onClick={() => {
                        onDayChange(day.dayNumber);
                        setTimeout(() => {
                          const button = document.querySelector(`[data-day="${day.dayNumber}"]`);
                          button?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                        }, 100);
                      }}
                      data-day={day.dayNumber}
                      className={cn(
                        'shrink-0 flex flex-col items-center justify-center gap-1 sm:gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation min-w-[85px] sm:min-w-[95px] max-w-[95px] sm:max-w-[105px] relative',
                        isActive 
                          ? `bg-gradient-to-br ${colors.gradient} text-white shadow-lg scale-105` 
                          : isCompleted
                          ? 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20'
                          : dayIsTomorrow
                          ? 'bg-primary/5 text-primary border-2 border-primary/30 hover:bg-primary/10'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground border border-border/50'
                      )}
                    >
                      {isCompleted && (
                        <Check className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 text-primary bg-background rounded-full p-0.5" />
                      )}
                      <span className="text-base sm:text-lg font-bold">{day.dayNumber}</span>
                      {dayName && (
                        <span className="text-[10px] sm:text-xs font-medium">
                          {dayName}
                        </span>
                      )}
                      <span className="text-[10px] sm:text-xs truncate max-w-full">
                        {day.date ? formatDateShort(day.date) : `Day ${day.dayNumber}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section C - Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-4 sm:gap-6 px-4 sm:px-6 py-4 sm:py-6 overflow-x-hidden">
          {/* Left Column - Navigation (Hidden - replaced by horizontal nav) */}
          <aside className={cn(
            "hidden"
          )}>
            <div className="lg:sticky lg:top-6 space-y-3 lg:h-[calc(100vh-200px)] overflow-y-auto">
              {/* Mobile Sidebar Header */}
              <div className="lg:hidden flex items-center justify-between mb-3 sm:mb-4 pb-3 sm:pb-4 border-b">
                <h2 className="text-base sm:text-lg font-semibold">Navigation</h2>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-muted touch-manipulation"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Week Navigation */}
              <Card className="p-2.5 sm:p-3 md:p-4">
                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-foreground mb-2 sm:mb-2.5 md:mb-3">Learning Plan</h3>
                <div className="space-y-1.5 sm:space-y-2">
                  {weeks.map((week) => {
                    const weekProgress = getWeekProgress(week);
                    // Active week: use selectedWeek (which defaults to current week, but changes when user clicks)
                    const isActive = week.weekNumber === selectedWeek;
                    
                    return (
                      <button
                        key={week.weekNumber}
                        onClick={() => {
                          onWeekChange(week.weekNumber);
                          // Automatically select the first CONTENT day (Day 1 or higher, skip Day 0)
                          const selectedWeekData = weeks.find(w => w.weekNumber === week.weekNumber);
                          if (selectedWeekData?.days && selectedWeekData.days.length > 0) {
                            const firstContentDay = selectedWeekData.days.find(d => d && d.dayNumber > 0);
                            if (firstContentDay) {
                              onDayChange(firstContentDay.dayNumber);
                            }
                          }
                          setIsMobileSidebarOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-3 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base transition-all touch-manipulation',
                          isActive 
                            ? `bg-gradient-to-r ${colors.gradient} text-white` 
                            : 'text-muted-foreground hover:bg-muted/50'
                        )}
                        style={{ minHeight: '44px' }}
                      >
                        <span className="font-medium">Week {week.weekNumber}</span>
                        {weekProgress > 0 && (
                          <span className={cn(
                            'text-xs sm:text-sm px-2 py-0.5 rounded font-medium',
                            isActive ? 'bg-white/20' : 'bg-muted'
                          )}>
                            {weekProgress}%
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Card>

              {/* Days List */}
              <Card className="p-2.5 sm:p-3 md:p-4">
                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-foreground mb-2 sm:mb-2.5 md:mb-3">
                  {isPreparationPhase ? 'Preparation' : `Week ${selectedWeek}`}
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                {/* Day 0 - Preparation Button - Always Available */}
                {preparationData && (
                  <button
                    onClick={() => {
                      onDayChange(0);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-2 sm:gap-2.5 md:gap-3 p-2.5 sm:p-3 md:p-3.5 rounded-lg text-left transition-all group touch-manipulation',
                      selectedDay === 0
                        ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg` 
                        : 'hover:bg-muted/50 border border-border/50'
                    )}
                    style={{ minHeight: '52px' }}
                  >
                    <div className={cn(
                      'w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center shrink-0',
                      selectedDay === 0 ? 'bg-white/20' : 'bg-muted border-2 border-border'
                    )}>
                      <span className="text-[10px] sm:text-xs md:text-sm font-semibold">0</span>
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className={cn('text-xs sm:text-sm md:text-base font-medium truncate', selectedDay === 0 ? 'text-white' : 'text-foreground')}>
                        Day 0 - Preparation
                      </div>
                      <div className={cn('text-[10px] sm:text-xs md:text-sm truncate', selectedDay === 0 ? 'text-white/80' : 'text-muted-foreground')}>
                        Jan 18, 2026 • Journey Start
                      </div>
                    </div>
                  </button>
                )}

                {/* Show Day 1 from Week 1 as preview if needed */}
                {selectedDay === 1 && (() => {
                  const week1 = weeks.find(w => w && w.weekNumber === 1);
                  const day1 = week1?.days?.find(d => d && d.dayNumber === 1);
                  if (!day1) return null;
                  
                  // Verify Day 1 is accessible
                  const day1IsAccessible = isDayAccessible(1);
                  const day1IsTomorrow = isTomorrow(1);
                  
                  return (
                    <button
                        onClick={() => {
                          if (day1IsAccessible) {
                            onWeekChange(1);
                            onDayChange(1);
                            setIsMobileSidebarOpen(false);
                          }
                        }}
                      disabled={!day1IsAccessible}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-lg text-left
                        transition-all group
                        ${day1IsAccessible 
                          ? 'border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/5 bg-primary/5 cursor-pointer' 
                          : 'opacity-50 cursor-not-allowed border-2 border-dashed border-muted bg-muted/20'
                        }
                      `}
                    >
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center shrink-0
                        ${day1IsAccessible 
                          ? 'bg-primary/20 border-2 border-primary/40' 
                          : 'bg-muted border-2 border-border'
                        }
                      `}>
                        <span className={`text-xs font-semibold ${day1IsAccessible ? 'text-primary' : 'text-muted-foreground'}`}>1</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground flex items-center gap-2">
                          Day 1
                          {day1IsTomorrow && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary font-normal">
                              Tomorrow
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDateShort(day1.date)} • {formatDayName(day1.date)}
                        </div>
                      </div>
                    </button>
                  );
                })()}
                
                {currentWeek?.days?.map((day, idx) => {
                  if (!day || !day.dayNumber) return null;
                  // Skip Day 1 if we're on Day 0 and already showing it above
                  if (selectedDay === 0 && day.dayNumber === 1) return null;
                  
                  const isCompleted = getDayProgress(day);
                  const isActive = day.dayNumber === selectedDay;
                  const dayIsAccessible = isDayAccessible(day.dayNumber);
                  const dayIsTomorrow = isTomorrow(day.dayNumber);
                  // All days are now unlocked
                  const isLocked = false;
                  
                  return (
                    <button
                      key={day.dayNumber}
                      onClick={() => {
                        onDayChange(day.dayNumber);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center gap-2 sm:gap-2.5 md:gap-3 p-2.5 sm:p-3 md:p-3.5 rounded-lg text-left transition-all group touch-manipulation',
                        isActive 
                          ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg` 
                          : isCompleted
                          ? 'bg-muted/50 hover:bg-muted'
                          : dayIsTomorrow
                          ? 'hover:bg-primary/5 border border-primary/20 bg-primary/5'
                          : 'hover:bg-muted/50'
                      )}
                      style={{ minHeight: '52px' }}
                    >
                      <div className={cn(
                        'w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center shrink-0',
                        isActive ? 'bg-white/20' : isCompleted ? 'bg-primary' : dayIsTomorrow ? 'bg-primary/20 border-2 border-primary/40' : 'bg-muted border-2 border-border'
                      )}>
                        {isCompleted && (
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                        )}
                        {!isCompleted && !isActive && (
                          <span className={cn('text-[10px] sm:text-xs md:text-sm font-semibold', dayIsTomorrow ? 'text-primary' : '')}>{day.dayNumber}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className={cn('text-xs sm:text-sm md:text-base font-medium flex items-center gap-1.5 sm:gap-2 flex-wrap', isActive ? 'text-white' : 'text-foreground')}>
                          <span className="truncate">Day {day.dayNumber}</span>
                          {dayIsTomorrow && (
                            <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-primary/20 text-primary font-normal whitespace-nowrap shrink-0">
                              Tomorrow
                            </span>
                          )}
                        </div>
                        <div className={cn('text-[10px] sm:text-xs md:text-sm truncate', isActive ? 'text-white/80' : 'text-muted-foreground')}>
                          {formatDateShort(day.date)} • {formatDayName(day.date)}
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Next Day - Always Visible for Preview (only if not already in current week and not Day 1 when on Day 0) */}
                {nextDay && 
                 nextDay.dayNumber !== selectedDay && 
                 !(selectedDay === 0 && nextDay.dayNumber === 1) && // Don't show if we already show Day 1 above
                 !currentWeek?.days?.some(d => d && d.dayNumber === nextDay.dayNumber) && (
                  <>
                    <div className="my-3 border-t border-border/50"></div>
                    <div className="text-xs font-semibold text-muted-foreground mb-2 px-1">
                      Next Day
                    </div>
                    <button
                      onClick={() => {
                        // If next day is in a different week, switch to that week first
                        for (const week of weeks) {
                          if (week && week.days && week.days.some(d => d && d.dayNumber === nextDay.dayNumber)) {
                            onWeekChange(week.weekNumber);
                            break;
                          }
                        }
                        // Then change to the next day
                        onDayChange(nextDay.dayNumber);
                        setIsMobileSidebarOpen(false);
                      }}
                      className="
                        w-full flex items-center gap-3 p-3 rounded-lg text-left
                        transition-all group
                        border-2 border-dashed border-primary/30
                        hover:border-primary/50 hover:bg-primary/5
                        bg-primary/5
                      "
                    >
                      <div className="
                        w-6 h-6 rounded-full flex items-center justify-center shrink-0
                        bg-primary/20 border-2 border-primary/40
                      ">
                        <span className="text-xs font-semibold text-primary">{nextDay.dayNumber}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground flex items-center gap-2">
                          Day {nextDay.dayNumber}
                          <span className="text-xs text-primary font-normal">Preview</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDateShort(nextDay.date)} • {formatDayName(nextDay.date)}
                        </div>
                      </div>
                    </button>
                  </>
                )}
                </div>
              </Card>
            </div>
          </aside>

          {/* Right Column - Content (Scrollable) */}
          <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
            <div className="max-w-4xl space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 pb-4 sm:pb-6 md:pb-8 px-0">
                  {/* Discipline Tabs - Only for Software Engineering (Inside Content Area) */}
                  {journeyId === 'software-engineering' && (
                    <div className="flex items-center gap-1.5 sm:gap-2 border-b border-border/50 pb-2 sm:pb-3 overflow-x-auto scrollbar-hide -mx-1 sm:mx-0 px-1 sm:px-0">
                      {disciplines.map((discipline) => {
                        const Icon = discipline.icon;
                        const isActive = activeDiscipline === discipline.id;
                        
                        return (
                          <button
                            key={discipline.id}
                            onClick={() => setActiveDiscipline(discipline.id)}
                            className={cn(
                              'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all shrink-0 touch-manipulation',
                              isActive
                                ? 'text-foreground bg-muted/50'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                            )}
                            style={{
                              minHeight: '44px',
                              ...(isActive
                                ? {
                                    borderBottom: `2px solid ${discipline.color}`,
                                    color: discipline.color,
                                  }
                                : {})
                            }}
                          >
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                            <span className="whitespace-nowrap">{discipline.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {!currentDay && !isPreparationPhase && (
                    <Card className="p-6 sm:p-12 text-center">
                      <p className="text-muted-foreground">No day data available. Please try refreshing the page.</p>
                    </Card>
                  )}
                  {(currentDay || isPreparationPhase) && (
                    <div className="space-y-6">
                {/* Week 1 Testing & Trials Message */}
                {currentDay?.isTestRun && currentDay?.testRunNote && (
                  <Card className="p-6 sm:p-8 border-2 border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-amber-500/10">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl sm:text-4xl shrink-0">🧪</div>
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2">
                          Testing & Trials Week
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground mb-4">
                          {currentDay.testRunNote}
                        </p>
                        {currentDay.testRunTasks && currentDay.testRunTasks.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-foreground mb-2">This Week's Focus:</p>
                            <ul className="space-y-1.5">
                              {currentDay.testRunTasks.map((task, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="text-orange-500 mt-1">•</span>
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )}

                {/* Daily Quote/Motivation Card - Only show if not Week 1 */}
                {!currentDay?.isTestRun && (() => {
                  const dailyQuote = getQuoteOfTheDay(journeyId, completedDays);
                  return (
                    <Card className={`p-4 sm:p-5 md:p-6 lg:p-8 bg-gradient-to-br ${colors.gradient} border-0 text-white`}>
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="text-2xl sm:text-3xl md:text-4xl shrink-0">{dailyQuote.icon}</div>
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <blockquote className="text-sm sm:text-base md:text-lg lg:text-xl font-medium mb-2 sm:mb-3 leading-relaxed break-words">
                            "{dailyQuote.quote}"
                          </blockquote>
                          <cite className="text-xs sm:text-sm text-white/80 italic break-words">— {dailyQuote.author}</cite>
                        </div>
                      </div>
                    </Card>
                  );
                })()}

                {/* Day Header or Preparation Header */}
                {isPreparationPhase && preparationData ? (
                  <div className="glass-card rounded-xl p-4 sm:p-5 md:p-6 border border-border/50">
                    <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="text-3xl sm:text-4xl md:text-5xl shrink-0">{preparationData.icon}</div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-display mb-2 break-words">{preparationData.title}</h2>
                        <p className="text-sm sm:text-base text-muted-foreground mb-2 break-words">{preparationData.subtitle}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Sunday, January 18, 2026
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-primary/10 rounded-lg border border-primary/20">
                      <p className="text-sm sm:text-base text-foreground leading-relaxed break-words">
                        <strong>Today's Focus:</strong> Use this day to structure the application, prepare your environment, and set up everything you need for a successful journey. Tomorrow (Day 1), the real journey begins!
                      </p>
                    </div>
                  </div>
                ) : currentDay ? (
                  <div className="glass-card rounded-xl p-4 sm:p-5 md:p-6 border border-border/50">
                    <div className="flex items-start justify-between mb-3 sm:mb-4 gap-3 sm:gap-4">
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-display flex items-center gap-2 break-words">
                            Day {currentDay.dayNumber}
                            {isTomorrow(currentDay.dayNumber) && (
                              <span className="text-xs sm:text-sm px-2 py-1 rounded bg-primary/20 text-primary font-normal whitespace-nowrap shrink-0">
                                Tomorrow
                              </span>
                            )}
                          </h2>
                          {getDayProgress(currentDay) && (
                            <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs sm:text-sm font-semibold shrink-0 whitespace-nowrap">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-sm sm:text-base text-muted-foreground break-words">
                          {dayName && (
                            <span className="font-semibold text-foreground mr-2">{dayName},</span>
                          )}
                          {currentDay.date && (() => {
                            // Parse date string properly to avoid timezone issues
                            const [year, month, day] = currentDay.date.split('-').map(Number);
                            const date = new Date(year, month - 1, day); // month is 0-indexed
                            return date.toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            });
                          })()}
                        </p>
                        {/* Time Allocation */}
                        {journey && journey.timeBlock && (
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{journey.timeBlock}</span>
                          </p>
                        )}
                      </div>
                      {/* Mark Complete Button - Available for all days (1-90) in all weeks */}
                      {currentDay && canCompleteDay(currentDay.dayNumber) ? (
                        <Button
                          onClick={() => {
                            // Only require tasks to be completed if there are tasks
                            if (!getDayProgress(currentDay) && !allTasksCompleted && dayTasks.length > 0) {
                              // Show message that all tasks must be completed
                              alert(`Please complete all ${dayTasks.length} task(s) before marking the day as complete.`);
                              return;
                            }
                            
                            // Check if this is the end of a week (Day 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 90)
                            // Week 1: Days 1-7 (Day 7 is end), Week 2: Days 8-14 (Day 14 is end), etc.
                            // Day 7 % 7 = 0, Day 14 % 7 = 0, Day 21 % 7 = 0, etc.
                            const isWeekEnd = currentDay.dayNumber % 7 === 0;
                            const isCurrentlyComplete = getDayProgress(currentDay);
                            
                            // IMPORTANT: No automatic XP/streak awards here!
                            // Gamification scores are ONLY earned through:
                            // 1. Completing individual tasks (via toggleTask)
                            // 2. Completing daily quizzes (via quiz submission)
                            // 3. Submitting reflections (via reflection form)
                            // 4. Completing projects (via project completion)
                            // Marking a day complete is just a status indicator, not an action that earns points
                            
                            if (isWeekEnd && !isCurrentlyComplete) {
                              // Mark entire week as complete (only when marking as complete, not when unmarking)
                              // Calculate week start: Day 7 -> Week 1 (Days 1-7), Day 14 -> Week 2 (Days 8-14), etc.
                              const weekNumber = Math.floor((currentDay.dayNumber - 1) / 7) + 1;
                              const weekStart = (weekNumber - 1) * 7 + 1;
                              const weekEndDay = weekStart + 6;
                              
                              // Mark all days in the week as complete
                              for (let dayNum = weekStart; dayNum <= weekEndDay && dayNum <= journey.totalDays; dayNum++) {
                                updateProgress(journeyId, dayNum, true);
                              }
                            } else {
                              // Mark/unmark only this specific day
                              const wasComplete = isCurrentlyComplete;
                              updateProgress(journeyId, currentDay.dayNumber, !wasComplete);
                            }
                          }}
                          className={cn(
                            'touch-manipulation',
                            getDayProgress(currentDay) 
                              ? '!bg-green-600 hover:!bg-green-700 !text-white border-green-700 shadow-md' 
                              : (!allTasksCompleted && dayTasks.length > 0)
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          )}
                          style={{ 
                            minHeight: '44px',
                            ...(getDayProgress(currentDay) ? {
                              backgroundColor: '#16a34a',
                              color: '#ffffff'
                            } : {})
                          }}
                          // Only disable if: day is not completed AND there are tasks AND not all tasks are completed
                          // If there are no tasks, the button should always be enabled
                          disabled={!getDayProgress(currentDay) && dayTasks.length > 0 && !allTasksCompleted}
                        >
                          {getDayProgress(currentDay) ? (
                            <>
                              <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-white" />
                              <span className="text-sm sm:text-base text-white">Completed</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              <span className="text-sm sm:text-base">
                                {currentDay.dayNumber % 7 === 0 
                                  ? 'Mark Week Complete' 
                                  : 'Mark Complete'}
                              </span>
                            </>
                          )}
                        </Button>
                      ) : currentDay && currentDay.dayNumber === 0 ? (
                        <div className="text-sm sm:text-base text-muted-foreground flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-muted/50 border border-border/50">
                          <span>Day 0 - Cannot Complete</span>
                        </div>
                      ) : null}
                    </div>

                    {/* Day Theme */}
                    {currentDay.theme && (
                      <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
                        <p className="text-sm font-medium text-foreground">{currentDay.theme}</p>
                      </div>
                    )}

                    {/* Task Checklist - Hide for Week 1 (Testing & Trials) */}
                    {!currentDay?.isTestRun && dayTasks.length > 0 && (
                      <Card className="p-4 sm:p-6 border border-border/50">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            Today's Tasks
                          </h3>
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            {dayTasks.filter(t => taskCompletion[t.id]).length} / {dayTasks.length} completed
                          </span>
                        </div>
                        <div className="space-y-2">
                          {dayTasks.map((task) => {
                            const isCompleted = taskCompletion[task.id] === true;
                            return (
                              <div
                                key={task.id}
                                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                                onClick={() => toggleTask(task.id)}
                              >
                                <button
                                  className="mt-0.5 flex-shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleTask(task.id);
                                  }}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <p className={cn(
                                    "text-sm sm:text-base",
                                    isCompleted 
                                      ? "line-through text-muted-foreground" 
                                      : "text-foreground"
                                  )}>
                                    {task.text}
                                  </p>
                                  {task.category && (
                                    <span className="text-xs text-muted-foreground mt-1 inline-block">
                                      {task.category}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {!allTasksCompleted && dayTasks.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-3 italic">
                            Complete all tasks to mark this day as done
                          </p>
                        )}
                      </Card>
                    )}
                  </div>
                ) : null}

                {/* Content Tabs */}
                <div className="border-b border-border/50">
                  <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide -mx-1 sm:mx-0 px-1 sm:px-0">
                    {isPreparationPhase ? (
                      <button
                        className="px-4 py-3 text-sm sm:text-base font-medium border-b-2 border-primary text-primary whitespace-nowrap shrink-0 touch-manipulation"
                        style={{ minHeight: '44px' }}
                      >
                        Preparation
                      </button>
                    ) : (
                      (() => {
                        const baseTabs = ['learning', 'project', 'resources', 'reflection'];
                        // Add quiz tab if dailyQuiz exists
                        const tabs = currentDay?.dailyQuiz ? [...baseTabs, 'quiz'] : baseTabs;
                        return tabs.map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                              'px-4 py-3 text-sm sm:text-base font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 touch-manipulation',
                              activeTab === tab
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                            )}
                            style={{ minHeight: '44px' }}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </button>
                        ));
                      })()
                    )}
                  </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {/* Preparation Phase Content */}
                  {isPreparationPhase && preparationData ? (
                    <motion.div
                      key="preparation"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6 mt-6"
                    >
                      {preparationData.sections.map((section, idx) => (
                        <Card key={idx} className="p-4 sm:p-6 border border-border/50">
                          <div className="flex items-center gap-2 sm:gap-3 mb-4">
                            <span className="text-xl sm:text-2xl">{section.icon}</span>
                            <h3 className="text-base sm:text-lg font-semibold text-foreground">{section.title}</h3>
                          </div>
                          <ul className="space-y-2">
                            {section.tasks.map((task, taskIdx) => (
                              <li key={taskIdx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
                                <span className="text-primary mt-1">•</span>
                                <span>{task}</span>
                              </li>
                            ))}
                          </ul>
                        </Card>
                      ))}
                      
                      {/* Resources Section */}
                      {preparationData.resources && preparationData.resources.length > 0 && (
                        <Card className="p-4 sm:p-6 border border-border/50">
                          <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            <h3 className="text-base sm:text-lg font-semibold">Preparation Resources</h3>
                          </div>
                          <ul className="space-y-3">
                            {preparationData.resources.map((resource, idx) => (
                              <li key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                <div>
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-foreground hover:text-primary transition-colors font-medium"
                                  >
                                    {resource.title}
                                  </a>
                                  {resource.time && (
                                    <span className="text-xs text-muted-foreground ml-2">({resource.time})</span>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </Card>
                      )}
                    </motion.div>
                  ) : activeTab === 'learning' && (
                    <motion.div
                      key="learning"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {/* Focus Section (for other journeys) - Hide for Week 1 */}
                      {currentDay.focus && !currentDay.isTestRun && (
                        <Card className="p-4 sm:p-6 border border-border/50">
                          <div className="flex items-center gap-2 mb-4">
                            <Target className="w-5 h-5 text-primary" />
                            <h3 className="text-base sm:text-lg font-semibold">
                              {isTomorrow(currentDay.dayNumber) ? "Tomorrow's Focus" : "Today's Focus"}
                            </h3>
                          </div>
                          <p className="text-sm sm:text-base text-foreground">{currentDay.focus}</p>
                          {currentDay.workout && (
                            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                              <p className="text-sm font-medium mb-2">Workout Plan</p>
                              <p className="text-sm text-muted-foreground">
                                {typeof currentDay.workout === 'object' 
                                  ? currentDay.workout.name || 'Complete workout'
                                  : currentDay.workout}
                              </p>
                            </div>
                          )}
                        </Card>
                      )}

                      {/* Learning Content - Hide for Week 1 */}
                      {/* For Software Engineering: Show schedule-based discipline content */}
                      {!currentDay?.isTestRun && journeyId === 'software-engineering' && currentDay?.schedule && disciplineContent ? (
                        <>
                          {/* Not Scheduled Message */}
                          {disciplineContent.notScheduled && (
                            <Card className="p-4 sm:p-6 border border-border/50 bg-muted/30">
                              <div className="flex items-center gap-3">
                                <Info className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
                                    {activeDiscipline} Not Scheduled
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {activeDiscipline} is not scheduled for {dayName || 'this day'}. Please select a discipline that is scheduled for today.
                                  </p>
                                </div>
                              </div>
                            </Card>
                          )}
                          
                          {/* Deep Learning Sessions */}
                          {!disciplineContent.notScheduled && disciplineContent.deepLearning.length > 0 && (
                            <div className="space-y-4">
                              <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-primary" />
                                Deep Learning Sessions ({disciplineContent.deepLearning.length})
                              </h3>
                              {disciplineContent.deepLearning.map((session, idx) => (
                                <Card key={idx} className="p-4 sm:p-5 md:p-6 border border-border/50">
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                      {session.isRevision && (
                                        <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded font-semibold">
                                          🔄 Revision
                                        </span>
                                      )}
                                      {session.time && (
                                        <span className="text-sm font-mono font-semibold text-primary">
                                          {session.time}
                                        </span>
                                      )}
                                      {session.duration && (
                                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                          {session.duration}
                                        </span>
                                      )}
                                      {session.discipline && (
                                        <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                                          {session.discipline}
                                        </span>
                                      )}
                                    </div>
                                    {session.content?.title && (
                                      <h4 className="text-sm sm:text-base font-semibold text-foreground">
                                        {session.isRevision ? '🔄 ' : ''}{session.content.title}
                                      </h4>
                                    )}
                                    {session.content?.topics && Array.isArray(session.content.topics) && session.content.topics.length > 0 && (
                                      <ul className="space-y-2">
                                        {session.content.topics.map((topic, topicIdx) => (
                                          <li key={topicIdx} className="flex items-start gap-2 text-sm text-foreground">
                                            <span className="text-primary mt-1">•</span>
                                            <span>{topic}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                    {session.content?.description && (
                                      <p className="text-sm text-muted-foreground">{session.content.description}</p>
                                    )}
                                    {/* Session Completion Button */}
                                    {currentDay?.dayNumber !== undefined && (
                                      <div className="mt-3 pt-3 border-t border-border/50">
                                        <SessionCompletionButton
                                          journeyId={journeyId}
                                          dayNumber={currentDay.dayNumber}
                                          sessionType="deepLearning"
                                          sessionIndex={idx}
                                          discipline={session.discipline || activeDiscipline}
                                          onComplete={() => {
                                            // Refresh UI after completion
                                            window.dispatchEvent(new CustomEvent('session-completed', {
                                              detail: { journeyId, dayNumber: currentDay.dayNumber }
                                            }));
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              ))}
                            </div>
                          )}

                          {/* Focused Implementation Sessions */}
                          {!disciplineContent.notScheduled && disciplineContent.implementation.length > 0 && (
                            <div className="space-y-4 mt-6">
                              <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                                <Code className="w-5 h-5 text-primary" />
                                Focused Implementation ({disciplineContent.implementation.length})
                              </h3>
                              {disciplineContent.implementation.map((session, idx) => (
                                <Card key={idx} className="p-4 sm:p-5 md:p-6 border border-border/50">
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                      {session.isRevision && (
                                        <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded font-semibold">
                                          🔄 Revision
                                        </span>
                                      )}
                                      {session.time && (
                                        <span className="text-sm font-mono font-semibold text-primary">
                                          {session.time}
                                        </span>
                                      )}
                                      {session.duration && (
                                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                          {session.duration}
                                        </span>
                                      )}
                                      {session.discipline && (
                                        <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                                          {session.discipline}
                                        </span>
                                      )}
                                    </div>
                                    {session.content?.title && (
                                      <h4 className="text-sm sm:text-base font-semibold text-foreground">
                                        {session.isRevision ? '🔄 ' : ''}{session.content.title}
                                        {session.isRevision && session.revisionType && (
                                          <span className="text-xs text-muted-foreground ml-2">({session.revisionType})</span>
                                        )}
                                      </h4>
                                    )}
                                    {session.content?.description && (
                                      <p className="text-sm text-muted-foreground mb-2">{session.content.description}</p>
                                    )}
                                    {session.content?.requirements && Array.isArray(session.content.requirements) && session.content.requirements.length > 0 && (
                                      <div>
                                        <p className="text-sm font-semibold text-foreground mb-2">Requirements:</p>
                                        <ul className="space-y-2">
                                          {session.content.requirements.map((req, reqIdx) => (
                                            <li key={reqIdx} className="flex items-start gap-2 text-sm text-foreground">
                                              <span className="text-primary mt-1">•</span>
                                              <span>{req}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {session.content?.topics && Array.isArray(session.content.topics) && session.content.topics.length > 0 && (
                                      <ul className="space-y-2">
                                        {session.content.topics.map((topic, topicIdx) => (
                                          <li key={topicIdx} className="flex items-start gap-2 text-sm text-foreground">
                                            <span className="text-primary mt-1">•</span>
                                            <span>{topic}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                    {/* Session Completion Button */}
                                    {currentDay?.dayNumber !== undefined && (
                                      <div className="mt-3 pt-3 border-t border-border/50">
                                        <SessionCompletionButton
                                          journeyId={journeyId}
                                          dayNumber={currentDay.dayNumber}
                                          sessionType="focusedImplementation"
                                          sessionIndex={idx}
                                          discipline={session.discipline || activeDiscipline}
                                          onComplete={() => {
                                            // Refresh UI after completion
                                            window.dispatchEvent(new CustomEvent('session-completed', {
                                              detail: { journeyId, dayNumber: currentDay.dayNumber }
                                            }));
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              ))}
                            </div>
                          )}

                          {/* Systems Section - Only visible on Sundays */}
                          {isSunday && currentDay.dailyLearning?.systems && (
                            <Card className="p-0 border border-border/50 overflow-hidden mt-6">
                              <button
                                onClick={() => toggleSection('systems')}
                                className="w-full flex items-center justify-between p-6 hover:bg-muted/30 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <Target className="w-5 h-5 text-primary" />
                                  <h3 className="text-lg font-semibold text-foreground">
                                    {currentDay.dailyLearning.systems.title || 'Systems & Engineering Mindset'}
                                  </h3>
                                </div>
                                {expandedSections.systems ? (
                                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                )}
                              </button>
                              {expandedSections.systems && currentDay.dailyLearning.systems.topics && Array.isArray(currentDay.dailyLearning.systems.topics) && (
                                <div className="px-6 pb-6">
                                  <ul className="space-y-2">
                                    {currentDay.dailyLearning.systems.topics.map((topic, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                                        <span className="text-primary mt-1">•</span>
                                        <span>{topic}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </Card>
                          )}

                          {/* Show informative message if no scheduled activities */}
                          {disciplineContent.deepLearning.length === 0 && disciplineContent.implementation.length === 0 && !hasScheduledActivities(currentDay, journeyId) && (
                            <Card className="p-6 border border-border/50 bg-muted/30">
                              <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                                <div>
                                  {(() => {
                                    const message = getNoActivityMessage(currentDay, weeks, journeyId);
                                    return (
                                      <>
                                        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
                                          {message.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                          {message.description}
                                        </p>
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            </Card>
                          )}

                          {/* Fallback: Show dailyLearning if no schedule content but has learning content */}
                          {disciplineContent.deepLearning.length === 0 && disciplineContent.implementation.length === 0 && hasScheduledActivities(currentDay, journeyId) && currentDay.dailyLearning && (
                            <>
                              {typeof currentDay.dailyLearning === 'object' && (
                                <>
                                  {currentDay.dailyLearning.title && (
                                    <Card className="p-4 sm:p-6 border border-border/50">
                                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">{currentDay.dailyLearning.title}</h3>
                                    </Card>
                                  )}
                                  
                                  {/* Show discipline-specific content from dailyLearning */}
                                  {activeDiscipline === 'Frontend' && currentDay.dailyLearning.frontend && (
                                    <Card className="p-0 border border-border/50 overflow-hidden">
                                      <div className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                          <Code className="w-5 h-5 text-primary" />
                                          <h3 className="text-lg font-semibold text-foreground">
                                            {currentDay.dailyLearning.frontend.title || 'Frontend Engineering'}
                                          </h3>
                                        </div>
                                        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                          <p className="text-sm text-blue-800 dark:text-blue-200">
                                            <strong>🎯 Component-Based Learning:</strong> Today's focus is on building a practical component. 
                                            Learn by doing - build, experiment, and understand why it works, not just how.
                                          </p>
                                        </div>
                                        {currentDay.dailyLearning.frontend.topics && Array.isArray(currentDay.dailyLearning.frontend.topics) && (
                                          <ul className="space-y-2">
                                            {currentDay.dailyLearning.frontend.topics.map((topic, idx) => (
                                              <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                                                <span className="text-primary mt-1">•</span>
                                                <span>{topic}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                      </div>
                                    </Card>
                                  )}

                                  {activeDiscipline === 'Backend' && currentDay.dailyLearning.backend && (
                                    <Card className="p-0 border border-border/50 overflow-hidden">
                                      <div className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                          <Server className="w-5 h-5 text-primary" />
                                          <h3 className="text-lg font-semibold text-foreground">
                                            {currentDay.dailyLearning.backend.title || 'Backend Engineering'}
                                          </h3>
                                        </div>
                                        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                          <p className="text-sm text-green-800 dark:text-green-200">
                                            <strong>🎯 Component-Based Learning:</strong> Today's focus is on building a practical component (API handler, auth flow, state manager, etc.). 
                                            Learn by doing - build, experiment, and understand why it works, not just how.
                                          </p>
                                        </div>
                                        {currentDay.dailyLearning.backend.topics && Array.isArray(currentDay.dailyLearning.backend.topics) && (
                                          <ul className="space-y-2">
                                            {currentDay.dailyLearning.backend.topics.map((topic, idx) => (
                                              <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                                                <span className="text-primary mt-1">•</span>
                                                <span>{topic}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                      </div>
                                    </Card>
                                  )}

                                  {activeDiscipline === 'Mobile' && currentDay.dailyLearning.mobile && (
                                    <Card className="p-0 border border-border/50 overflow-hidden">
                                      <div className="p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                          <Smartphone className="w-5 h-5 text-primary" />
                                          <h3 className="text-lg font-semibold text-foreground">
                                            {currentDay.dailyLearning.mobile.title || 'Mobile Engineering'}
                                          </h3>
                                        </div>
                                        <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                          <p className="text-sm text-orange-800 dark:text-orange-200">
                                            <strong>🎯 Component-Based Learning:</strong> Today's focus is on building a practical component (button, form, navigation, etc.). 
                                            Learn by doing - build, experiment, and understand why it works, not just how.
                                          </p>
                                        </div>
                                        {currentDay.dailyLearning.mobile.topics && Array.isArray(currentDay.dailyLearning.mobile.topics) && (
                                          <ul className="space-y-2">
                                            {currentDay.dailyLearning.mobile.topics.map((topic, idx) => (
                                              <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                                                <span className="text-primary mt-1">•</span>
                                                <span>{topic}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                      </div>
                                    </Card>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </>
                      ) : journeyId === 'body-transformation' ? (
                        <>
                          {hasScheduledActivities(currentDay, journeyId) && currentDay.focus ? (
                            <>
                              {currentDay.dailyLearning && (
                                <Card className="p-4 sm:p-6 border border-border/50">
                                  <div className="flex items-center gap-2 mb-4">
                                    <Target className="w-5 h-5 text-primary" />
                                    <h3 className="text-base sm:text-lg font-semibold text-foreground">{currentDay.dailyLearning.title}</h3>
                                  </div>
                                  {currentDay.dailyLearning.description && (
                                    <p className="text-sm text-muted-foreground mb-4">{currentDay.dailyLearning.description}</p>
                                  )}
                                  {currentDay.dailyLearning.topics && Array.isArray(currentDay.dailyLearning.topics) && currentDay.dailyLearning.topics.length > 0 && (
                                    <ul className="space-y-2">
                                      {currentDay.dailyLearning.topics.map((topic, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                                          <span className="text-primary mt-1">•</span>
                                          <span>{topic}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </Card>
                              )}
                              <Card className="p-4 sm:p-6 border border-border/50">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-2xl">💪</span>
                                  <h4 className="text-sm font-semibold text-foreground">Today's Focus: {currentDay.focus}</h4>
                                </div>
                                {currentDay.workout && (
                                  <div className="mb-2">
                                    <p className="text-sm text-foreground mb-2">
                                      Workout: {typeof currentDay.workout === 'object' 
                                        ? currentDay.workout.name || 'Complete workout'
                                        : currentDay.workout}
                                    </p>
                                    {/* Workout Completion Button */}
                                    {currentDay?.dayNumber !== undefined && (
                                      <div className="mt-3 pt-3 border-t border-border/50">
                                        <SessionCompletionButton
                                          journeyId={journeyId}
                                          dayNumber={currentDay.dayNumber}
                                          sessionType="daily"
                                          sessionIndex={0}
                                          onComplete={() => {
                                            // Refresh UI after completion
                                            window.dispatchEvent(new CustomEvent('session-completed', {
                                              detail: { journeyId, dayNumber: currentDay.dayNumber }
                                            }));
                                          }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                                {currentDay.nutrition && (
                                  <p className="text-sm text-foreground mb-2">Nutrition: {currentDay.nutrition}</p>
                                )}
                                {currentDay.mindset && (
                                  <p className="text-sm text-muted-foreground">Mindset: {currentDay.mindset}</p>
                                )}
                              </Card>
                            </>
                          ) : (
                            <Card className="p-6 border border-border/50 bg-muted/30">
                              <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                                <div>
                                  {(() => {
                                    const message = getNoActivityMessage(currentDay, weeks, journeyId);
                                    return (
                                      <>
                                        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
                                          {message.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                          {message.description}
                                        </p>
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            </Card>
                          )}
                        </>
                      ) : journeyId === 'reading' ? (
                        <>
                          {hasScheduledActivities(currentDay, journeyId) && currentDay.readingSessions ? (
                            <>
                              {currentDay.dailyLearning && (
                                <Card className="p-4 sm:p-6 border border-border/50">
                                  <div className="flex items-center gap-2 mb-4">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    <h3 className="text-base sm:text-lg font-semibold text-foreground">{currentDay.dailyLearning.title}</h3>
                                  </div>
                                  {currentDay.dailyLearning.description && (
                                    <p className="text-sm text-muted-foreground mb-4">{currentDay.dailyLearning.description}</p>
                                  )}
                                  {currentDay.dailyLearning.topics && Array.isArray(currentDay.dailyLearning.topics) && currentDay.dailyLearning.topics.length > 0 && (
                                    <ul className="space-y-2">
                                      {currentDay.dailyLearning.topics.map((topic, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                                          <span className="text-primary mt-1">•</span>
                                          <span>{topic}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </Card>
                              )}
                              {currentDay.readingSessions && Array.isArray(currentDay.readingSessions) && currentDay.readingSessions.length > 0 && (
                            <Card className="p-4 sm:p-6 border border-border/50">
                              <h4 className="text-sm font-semibold text-foreground mb-3">Today's Reading Sessions:</h4>
                              <div className="space-y-3">
                                {currentDay.readingSessions.map((session, idx) => {
                                  const bibleData = session.type === "Bible Reading" && typeof session.material === 'object' 
                                    ? session.material 
                                    : null;
                                  const materialText = bibleData ? bibleData.text : session.material;
                                  const chapterCount = session.type === "Bible Reading" ? 1 : null; // Bible reading is 1 chapter per 15-minute session
                                  
                                  return (
                                    <div key={idx} className="p-3 bg-muted/30 rounded-lg border-l-4 border-primary">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold text-primary">{session.time}</span>
                                        <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded font-medium">
                                          {session.type}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-medium text-foreground">{materialText}</p>
                                        {bibleData && bibleData.link && (
                                          <a
                                            href={bibleData.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                                          >
                                            <BookOpen className="w-3 h-3" />
                                            Read Chapter
                                          </a>
                                        )}
                                      </div>
                                      {chapterCount && (
                                        <p className="text-xs text-primary font-medium mt-1">
                                          📖 {chapterCount} chapter{chapterCount > 1 ? 's' : ''} to read (15 minutes allocated)
                                        </p>
                                      )}
                                      {session.focus && (
                                        <p className="text-xs text-muted-foreground mt-1">Focus: {session.focus}</p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </Card>
                          )}
                            </>
                          ) : (
                            <Card className="p-6 border border-border/50 bg-muted/30">
                              <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                                <div>
                                  {(() => {
                                    const message = getNoActivityMessage(currentDay, weeks, journeyId);
                                    return (
                                      <>
                                        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
                                          {message.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                          {message.description}
                                        </p>
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            </Card>
                          )}
                        </>
                      ) : journeyId === 'writers' ? (
                        <>
                          {hasScheduledActivities(currentDay, journeyId) && currentDay.learning ? (
                            <>
                              <Card className="p-4 sm:p-6 border border-border/50">
                                <div className="flex items-center gap-2 mb-4">
                                  <BookOpen className="w-5 h-5 text-primary" />
                                  <h3 className="text-base sm:text-lg font-semibold text-foreground">Learning: {currentDay.learning}</h3>
                                </div>
                                {currentDay.theme && (
                                  <p className="text-sm text-muted-foreground mb-4">Theme: {currentDay.theme}</p>
                                )}
                              </Card>
                            </>
                          ) : (
                            <Card className="p-6 border border-border/50 bg-muted/30">
                              <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                                <div>
                                  {(() => {
                                    const message = getNoActivityMessage(currentDay, weeks, journeyId);
                                    return (
                                      <>
                                        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
                                          {message.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                          {message.description}
                                        </p>
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                            </Card>
                          )}
                        </>
                      ) : journeyId === 'dual-brand' ? (
                        <>
                          {hasScheduledActivities(currentDay, journeyId) && currentDay.focus ? (
                            <>
                              <Card className="p-4 sm:p-6 border border-border/50">
                                <div className="flex items-center gap-2 mb-4">
                                  <Target className="w-5 h-5 text-primary" />
                                  <h3 className="text-base sm:text-lg font-semibold text-foreground">{currentDay.focus}</h3>
                                </div>
                                {currentDay.theme && (
                                  <p className="text-sm text-muted-foreground mb-4">Theme: {currentDay.theme}</p>
                                )}
                              </Card>
                              
                              {currentDay.personalBrandTasks && (
                            <Card className="p-4 sm:p-6 border border-border/50">
                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">👤</span>
                                <h3 className="text-base sm:text-lg font-semibold text-foreground">Personal Brand (_jerryrichman007)</h3>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">Focus: Personal journey, growth, thoughts, and general content</p>
                              <p className="text-sm sm:text-base text-foreground">{currentDay.personalBrandTasks}</p>
                            </Card>
                          )}
                          
                          {currentDay.companyBrandTasks && (
                            <Card className="p-4 sm:p-6 border border-border/50">
                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">🏢</span>
                                <h3 className="text-base sm:text-lg font-semibold text-foreground">Company Brand (_ryxen007)</h3>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">Focus: Company-building journey, products, systems, and business updates</p>
                              <p className="text-sm sm:text-base text-foreground">{currentDay.companyBrandTasks}</p>
                            </Card>
                          )}
                          
                          {/* Legacy support for ryxenTasks and havenXTasks */}
                          {!currentDay.personalBrandTasks && currentDay.ryxenTasks && (
                            <Card className="p-4 sm:p-6 border border-border/50">
                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">👤</span>
                                <h3 className="text-base sm:text-lg font-semibold text-foreground">Personal Brand (_jerryrichman007)</h3>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">Focus: Personal journey, growth, thoughts, and general content</p>
                              <p className="text-sm sm:text-base text-foreground">{currentDay.ryxenTasks}</p>
                            </Card>
                          )}
                          
                          {!currentDay.companyBrandTasks && currentDay.havenXTasks && (
                            <Card className="p-4 sm:p-6 border border-border/50">
                              <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">🏢</span>
                                <h3 className="text-base sm:text-lg font-semibold text-foreground">Company Brand (_ryxen007)</h3>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">Focus: Company-building journey, products, systems, and business updates</p>
                              <p className="text-sm sm:text-base text-foreground">{currentDay.havenXTasks}</p>
                            </Card>
                          )}
                          
                          {currentDay.outcome && (
                            <Card className="p-4 sm:p-6 border border-border/50 bg-primary/5">
                              <div className="flex items-center gap-2 mb-2">
                                <Target className="w-5 h-5 text-primary" />
                                <h4 className="text-sm font-semibold text-primary">Expected Outcome</h4>
                              </div>
                              <p className="text-sm text-foreground">{currentDay.outcome}</p>
                            </Card>
                          )}
                        </>
                      ) : (
                        <Card className="p-6 border border-border/50 bg-muted/30">
                          <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              {(() => {
                                const message = getNoActivityMessage(currentDay, weeks, journeyId);
                                return (
                                  <>
                                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
                                      {message.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {message.description}
                                    </p>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </Card>
                      )}
                    </>
                  ) : currentDay.dailyLearning ? (
                        <>
                          {typeof currentDay.dailyLearning === 'object' && (
                            <>
                              {currentDay.dailyLearning.title && (
                                <Card className="p-4 sm:p-6 border border-border/50">
                                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">{currentDay.dailyLearning.title}</h3>
                                </Card>
                              )}
                              
                              {/* For other journeys: Show all sections as collapsible */}
                              {/* Frontend Section - Collapsible */}
                              {currentDay.dailyLearning.frontend && (
                                <Card className="p-0 border border-border/50 overflow-hidden">
                                  <button
                                    onClick={() => toggleSection('frontend')}
                                    className="w-full flex items-center justify-between p-6 hover:bg-muted/30 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Code className="w-5 h-5 text-primary" />
                                      <h3 className="text-lg font-semibold text-foreground">
                                        {currentDay.dailyLearning.frontend.title || 'Frontend Engineering'}
                                      </h3>
                                    </div>
                                    {expandedSections.frontend ? (
                                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                    ) : (
                                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                    )}
                                  </button>
                                  {expandedSections.frontend && currentDay.dailyLearning.frontend.topics && Array.isArray(currentDay.dailyLearning.frontend.topics) && (
                                    <div className="px-6 pb-6">
                                      <ul className="space-y-2">
                                        {currentDay.dailyLearning.frontend.topics.map((topic, idx) => (
                                          <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                                            <span className="text-primary mt-1">•</span>
                                            <span>{topic}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </Card>
                              )}

                              {/* Backend Section - Collapsible */}
                              {currentDay.dailyLearning.backend && (
                                <Card className="p-0 border border-border/50 overflow-hidden">
                                  <button
                                    onClick={() => toggleSection('backend')}
                                    className="w-full flex items-center justify-between p-6 hover:bg-muted/30 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Code className="w-5 h-5 text-primary" />
                                      <h3 className="text-lg font-semibold text-foreground">
                                        {currentDay.dailyLearning.backend.title || 'Backend Engineering'}
                                      </h3>
                                    </div>
                                    {expandedSections.backend ? (
                                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                    ) : (
                                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                    )}
                                  </button>
                                  {expandedSections.backend && currentDay.dailyLearning.backend.topics && Array.isArray(currentDay.dailyLearning.backend.topics) && (
                                    <div className="px-6 pb-6">
                                      <ul className="space-y-2">
                                        {currentDay.dailyLearning.backend.topics.map((topic, idx) => (
                                          <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                                            <span className="text-primary mt-1">•</span>
                                            <span>{topic}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </Card>
                              )}

                              {/* Systems Thinking Section - Collapsible (Only on Sundays) */}
                              {isSunday && currentDay.dailyLearning.systems && (
                                <Card className="p-0 border border-border/50 overflow-hidden">
                                  <button
                                    onClick={() => toggleSection('systems')}
                                    className="w-full flex items-center justify-between p-6 hover:bg-muted/30 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Target className="w-5 h-5 text-primary" />
                                      <h3 className="text-lg font-semibold text-foreground">
                                        {currentDay.dailyLearning.systems.title || 'Systems & Engineering Mindset'}
                                      </h3>
                                    </div>
                                    {expandedSections.systems ? (
                                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                    ) : (
                                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                    )}
                                  </button>
                                  {expandedSections.systems && currentDay.dailyLearning.systems.topics && Array.isArray(currentDay.dailyLearning.systems.topics) && (
                                    <div className="px-6 pb-6">
                                      <ul className="space-y-2">
                                        {currentDay.dailyLearning.systems.topics.map((topic, idx) => (
                                          <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                                            <span className="text-primary mt-1">•</span>
                                            <span>{topic}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </Card>
                              )}
                            </>
                          )}
                        </>
                      ) : null}
                      
                      {!currentDay.dailyLearning && !currentDay.focus && !currentDay.learning && !currentDay.readingSessions && journeyId !== 'dual-brand' && journeyId !== 'writers' && journeyId !== 'reading' && journeyId !== 'body-transformation' && (
                        <Card className="p-12 text-center border border-border/50">
                          <p className="text-muted-foreground">No learning content for this day.</p>
                        </Card>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'project' && (
                    <motion.div
                      key="project"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {/* For Software Engineering: Show discipline-specific project from schedule */}
                      {journeyId === 'software-engineering' && disciplineContent && disciplineContent.implementation.length > 0 ? (
                        <div className="space-y-4">
                          <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
                            <Code className="w-5 h-5 text-primary" />
                            {activeDiscipline} Project
                          </h3>
                          {disciplineContent.implementation.map((session, idx) => (
                            <Card key={idx} className="p-4 sm:p-6 border border-border/50">
                              {session.content?.title && (
                                <h4 className="text-sm sm:text-base font-semibold text-foreground mb-3">{session.content.title}</h4>
                              )}
                              {session.content?.description && (
                                <p className="text-sm sm:text-base text-foreground mb-4">{session.content.description}</p>
                              )}
                              {session.content?.requirements && Array.isArray(session.content.requirements) && session.content.requirements.length > 0 && (
                                <div>
                                  <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2">Requirements:</h4>
                                  <ul className="space-y-2">
                                    {session.content.requirements.map((req, reqIdx) => (
                                      <li key={reqIdx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
                                        <span className="text-primary mt-1">•</span>
                                        <span>{req}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {session.content?.topics && Array.isArray(session.content.topics) && session.content.topics.length > 0 && (
                                <div className="mt-4">
                                  <h4 className="text-sm font-semibold text-foreground mb-2">Topics:</h4>
                                  <ul className="space-y-2">
                                    {session.content.topics.map((topic, topicIdx) => (
                                      <li key={topicIdx} className="flex items-start gap-2 text-sm text-foreground">
                                        <span className="text-primary mt-1">•</span>
                                        <span>{topic}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </Card>
                          ))}
                        </div>
                      ) : currentDay.project && journeyId === 'dual-brand' ? (
                        <Card className="p-4 sm:p-6 border border-border/50">
                          <div className="flex items-center gap-2 mb-4">
                            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                            <h3 className="text-base sm:text-lg font-semibold">{currentDay.project.title}</h3>
                          </div>
                          
                          <p className="text-sm sm:text-base text-foreground mb-4">{currentDay.project.description}</p>
                          
                          {currentDay.project.requirements && Array.isArray(currentDay.project.requirements) && currentDay.project.requirements.length > 0 && (
                            <div>
                              <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2">Requirements:</h4>
                              <ul className="space-y-2">
                                {currentDay.project.requirements.map((req, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
                                    <span className="text-primary mt-1">•</span>
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </Card>
                      ) : currentDay.miniProject ? (
                        <Card className="p-4 sm:p-6 border border-border/50">
                          {/* Project Information Header - Discipline-specific */}
                          {(() => {
                            // Get discipline-specific project if available, otherwise use default
                            const projectInfo = currentDay.disciplineProjects?.[activeDiscipline] || currentDay.project;
                            // Get discipline-specific clues and key things
                            const DISCIPLINE_PROJECTS_DATA = {
                              Frontend: {
                                clues: [
                                  "Focus on component reusability and composition patterns",
                                  "Implement responsive design with mobile-first approach",
                                  "Use state management for complex data flows",
                                  "Optimize for performance with code splitting and lazy loading",
                                  "Ensure accessibility (a11y) standards throughout"
                                ],
                                keyThings: [
                                  "Component architecture and folder structure",
                                  "State management (Context API, Redux, or Zustand)",
                                  "Form handling and validation libraries",
                                  "API integration and data fetching patterns",
                                  "Responsive breakpoints and media queries"
                                ]
                              },
                              Mobile: {
                                clues: [
                                  "Design for both iOS and Android platform differences",
                                  "Implement native navigation patterns (Stack, Tab, Drawer)",
                                  "Handle device-specific features (camera, location, push notifications)",
                                  "Optimize for different screen sizes and orientations",
                                  "Implement offline-first architecture with local storage"
                                ],
                                keyThings: [
                                  "React Native navigation (React Navigation)",
                                  "Platform-specific code (Platform.OS checks)",
                                  "Native modules and bridge communication",
                                  "State persistence (AsyncStorage, Redux Persist)",
                                  "Offline data synchronization"
                                ]
                              },
                              Backend: {
                                clues: [
                                  "Design RESTful endpoints following REST principles",
                                  "Implement proper authentication and authorization",
                                  "Use middleware for request validation and error handling",
                                  "Design database schemas with relationships",
                                  "Implement rate limiting and security measures"
                                ],
                                keyThings: [
                                  "REST API design patterns and conventions",
                                  "Authentication (JWT, OAuth, session-based)",
                                  "Database design (SQL/NoSQL, relationships, migrations)",
                                  "Middleware architecture (auth, validation, error handling)",
                                  "API security (CORS, rate limiting, input sanitization)"
                                ]
                              },
                              "Systems Engineering": {
                                clues: [
                                  "Create custom post types and taxonomies",
                                  "Build reusable theme templates and components",
                                  "Develop custom plugins for specific functionality",
                                  "Implement user role management and permissions",
                                  "Design admin interfaces and custom dashboards"
                                ],
                                keyThings: [
                                  "WordPress theme development (PHP, HTML, CSS)",
                                  "Custom post types and taxonomies",
                                  "Plugin development and hooks system",
                                  "User roles and capabilities",
                                  "Database queries (WP_Query, get_posts)"
                                ]
                              }
                            };
                            
                            const disciplineData = DISCIPLINE_PROJECTS_DATA[activeDiscipline] || {};
                            
                            return projectInfo ? (
                              <div className="mb-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                                <div className="flex items-center gap-2 mb-2">
                                  <Target className="w-5 h-5 text-primary" />
                                  <h4 className="text-sm font-semibold text-primary">Building: {projectInfo.name}</h4>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{projectInfo.description}</p>
                                <div className="text-xs text-muted-foreground mb-3">
                                  <span className="font-semibold">Phase:</span> {projectInfo.buildPhase}
                                </div>
                                
                                {/* Discipline-specific clues */}
                                {disciplineData.clues && disciplineData.clues.length > 0 && (
                                  <div className="mb-3">
                                    <h5 className="text-xs font-semibold text-primary mb-2">💡 Key Clues for {activeDiscipline}:</h5>
                                    <ul className="space-y-1">
                                      {disciplineData.clues.map((clue, idx) => (
                                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                          <span className="text-primary mt-0.5">•</span>
                                          <span>{clue}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {/* Discipline-specific key things */}
                                {disciplineData.keyThings && disciplineData.keyThings.length > 0 && (
                                  <div>
                                    <h5 className="text-xs font-semibold text-primary mb-2">🔑 Key Things to Focus On:</h5>
                                    <ul className="space-y-1">
                                      {disciplineData.keyThings.map((thing, idx) => (
                                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                                          <span className="text-primary mt-0.5">•</span>
                                          <span>{thing}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ) : null;
                          })()}
                          
                          <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-base sm:text-lg font-semibold">{currentDay.miniProject.title}</h3>
                          </div>
                          
                          {/* What You're Building Today */}
                          {currentDay.miniProject.buildingToday && (
                            <div className="mb-4 p-3 sm:p-4 bg-muted/50 rounded-lg border border-border/50">
                              <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                <span className="text-primary">📦</span> What You're Building Today
                              </h4>
                              <p className="text-xs sm:text-sm text-foreground mb-1">
                                <span className="font-semibold">Component:</span> {currentDay.miniProject.buildingToday.component}
                              </p>
                              <p className="text-xs sm:text-sm text-foreground mb-1">
                                <span className="font-semibold">Part of:</span> {currentDay.miniProject.buildingToday.part}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {currentDay.miniProject.buildingToday.connectsTo}
                              </p>
                              <p className="text-xs text-primary font-semibold mt-2">
                                Expected Output: {currentDay.miniProject.buildingToday.expectedOutput}
                              </p>
                            </div>
                          )}
                          
                          <p className="text-sm sm:text-base text-foreground mb-4">{currentDay.miniProject.description}</p>
                          {currentDay.miniProject.requirements && Array.isArray(currentDay.miniProject.requirements) && (
                            <div>
                              <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2">Requirements:</h4>
                              <ul className="space-y-2">
                                {currentDay.miniProject.requirements.map((req, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground">
                                    <span className="text-primary mt-1">•</span>
                                    <span>{req}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </Card>
                      ) : (
                        <Card className="p-12 text-center border border-border/50">
                          <p className="text-muted-foreground">No project content for this day.</p>
                        </Card>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'resources' && (
                    <motion.div
                      key="resources"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {/* For Software Engineering: Show discipline-specific resources */}
                      {journeyId === 'software-engineering' && disciplineContent ? (
                        <Card className="p-4 sm:p-6 border border-border/50">
                          <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">{activeDiscipline} Resources</h3>
                          </div>
                          {/* Get resources from schedule sessions, with fallback to day-specific resources */}
                          {(() => {
                            const allResources = [];
                            const seenResources = new Set(); // Track seen resources to prevent duplicates
                            
                            // Collect resources from scheduled sessions
                            disciplineContent.deepLearning.forEach(session => {
                              if (session.content?.resources && Array.isArray(session.content.resources)) {
                                session.content.resources.forEach(resource => {
                                  // Create unique key from title and URL to detect duplicates
                                  const resourceKey = `${resource.title || ''}_${resource.url || ''}`;
                                  if (!seenResources.has(resourceKey)) {
                                    seenResources.add(resourceKey);
                                    allResources.push(resource);
                                  }
                                });
                              }
                            });
                            disciplineContent.implementation.forEach(session => {
                              if (session.content?.resources && Array.isArray(session.content.resources)) {
                                session.content.resources.forEach(resource => {
                                  // Create unique key from title and URL to detect duplicates
                                  const resourceKey = `${resource.title || ''}_${resource.url || ''}`;
                                  if (!seenResources.has(resourceKey)) {
                                    seenResources.add(resourceKey);
                                    allResources.push(resource);
                                  }
                                });
                              }
                            });
                            
                            // Fallback: If no resources from sessions (e.g., WordPress not scheduled today), get day-specific resources
                            if (allResources.length === 0 && currentDay?.dayNumber) {
                              const dayIndex = (currentDay.dayNumber - 1) % 7;
                              const weekNum = Math.ceil(currentDay.dayNumber / 7);
                              // Map discipline name to match getDisciplineResources format
                              const disciplineName = activeDiscipline === 'WordPress' ? 'Systems Engineering' : activeDiscipline;
                              const fallbackResources = getDisciplineResources(
                                disciplineName,
                                weekNum,
                                null,
                                currentDay.dayNumber,
                                dayIndex
                              );
                              if (fallbackResources && Array.isArray(fallbackResources) && fallbackResources.length > 0) {
                                fallbackResources.forEach(resource => {
                                  const resourceKey = `${resource.title || ''}_${resource.url || ''}`;
                                  if (!seenResources.has(resourceKey)) {
                                    seenResources.add(resourceKey);
                                    allResources.push(resource);
                                  }
                                });
                              }
                            }
                            
                            return allResources.length > 0 ? (
                              <ul className="space-y-3">
                                {allResources.map((resource, idx) => (
                                  <li key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                    <div className="flex-1">
                                      <a
                                        href={resource.url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-foreground hover:text-primary transition-colors font-medium"
                                      >
                                        {resource.title || resource}
                                      </a>
                                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        {resource.time && (
                                          <span className="text-xs text-muted-foreground">({resource.time})</span>
                                        )}
                                        {resource.category && (
                                          <span className="text-xs text-muted-foreground">• {resource.category}</span>
                                        )}
                                      </div>
                                      {resource.description && (
                                        <p className="text-xs text-muted-foreground mt-1">{resource.description}</p>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted-foreground">No resources available for {activeDiscipline}.</p>
                            );
                          })()}
                        </Card>
                      ) : (currentDay.resources || (journeyId === 'dual-brand' && currentDay.learningResources)) ? (
                        <Card className="p-4 sm:p-6 border border-border/50">
                          <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">Resources</h3>
                          </div>
                          {(() => {
                            // For dual brand, use learningResources; otherwise use resources
                            const resources = journeyId === 'dual-brand' 
                              ? (currentDay.learningResources || [])
                              : (Array.isArray(currentDay.resources) ? currentDay.resources : []);
                            
                            // Handle nested array structure for dual brand resources
                            const flattenedResources = [];
                            resources.forEach(resource => {
                              if (Array.isArray(resource)) {
                                flattenedResources.push(...resource);
                              } else {
                                flattenedResources.push(resource);
                              }
                            });
                            
                            return flattenedResources.length > 0 ? (
                              <ul className="space-y-3">
                                {flattenedResources.map((resource, idx) => {
                                  // Check if this is a Bible reading resource
                                  const isBibleResource = resource.category === 'Bible' || 
                                                         (resource.title && resource.title.includes('Bible Reading'));
                                  
                                  return (
                                    <li key={idx} className="flex items-start justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <a
                                            href={resource.url || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-foreground hover:text-primary transition-colors font-medium"
                                          >
                                            {resource.title}
                                          </a>
                                          {(resource.time || resource.category) && (
                                            <span className="text-xs text-muted-foreground">
                                              ({resource.time || resource.category})
                                            </span>
                                          )}
                                        </div>
                                        {isBibleResource && resource.description && (
                                          <p className="text-xs text-muted-foreground mt-1">
                                            📖 {resource.description}
                                          </p>
                                        )}
                                        {isBibleResource && resource.chapterCount !== undefined && (
                                          <p className="text-xs text-primary font-medium mt-1">
                                            Chapters to read: {resource.chapterCount} chapter{resource.chapterCount > 1 ? 's' : ''} (15 minutes allocated)
                                          </p>
                                        )}
                                      </div>
                                      {isBibleResource && resource.url && (
                                        <a
                                          href={resource.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="ml-2 text-primary hover:text-primary/80 transition-colors shrink-0"
                                          title="Read Bible Chapter"
                                        >
                                          <BookOpen className="w-4 h-4" />
                                        </a>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <p className="text-muted-foreground">No resources for this day.</p>
                            );
                          })()}
                        </Card>
                      ) : (
                        <Card className="p-12 text-center border border-border/50">
                          <p className="text-muted-foreground">No resources for this day.</p>
                        </Card>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'quiz' && currentDay?.dailyQuiz && !currentDay?.isTestRun && (
                    <motion.div
                      key="quiz"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Card className="p-4 sm:p-6 border border-border/50">
                        <DailyQuiz
                          dailyQuiz={currentDay.dailyQuiz}
                          onComplete={(results) => {
                            console.log("Daily quiz completed:", results);
                            // Award XP based on quiz performance
                            // IMPORTANT: Day 0 (testing week) does NOT earn any gamification scores
                            if (addXP && currentDay?.dayNumber !== 0) {
                              const baseXP = 30; // Base XP for completing quiz
                              const performanceBonus = Math.round((results.percentage / 100) * 20); // Up to 20 bonus XP
                              const totalXP = baseXP + performanceBonus;
                              addXP(totalXP, journeyId);
                              
                              // Award bonus for passing
                              if (results.passed) {
                                addXP(20, journeyId); // 20 bonus XP for passing
                              }
                            }
                            
                            // Save quiz results
                            try {
                              const saved = localStorage.getItem(`dailyQuizzes_${journeyId}`) || "[]";
                              const quizzes = JSON.parse(saved);
                              quizzes.push({
                                day: currentDay.dayNumber,
                                ...results,
                                completedAt: new Date().toISOString(),
                              });
                              localStorage.setItem(`dailyQuizzes_${journeyId}`, JSON.stringify(quizzes));
                            } catch (error) {
                              console.error("Error saving quiz results:", error);
                            }
                          }}
                        />
                      </Card>
                    </motion.div>
                  )}

                  {activeTab === 'reflection' && !currentDay?.isTestRun && (
                    <motion.div
                      key="reflection"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {/* For Software Engineering: Show discipline-specific reflection */}
                      {journeyId === 'software-engineering' && disciplineContent ? (
                        <Card className="p-4 sm:p-6 border border-border/50">
                          <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">{activeDiscipline} Reflection</h3>
                          </div>
                          {(() => {
                            // Get discipline-specific reflection based on day and component being built
                            const component = getProjectComponentForDay(currentDay.dayNumber, activeDiscipline);
                            // Calculate dayIndex (0-6) from dayNumber
                            const dayIndex = (currentDay.dayNumber - 1) % 7;
                            const reflection = getSoftwareEngineeringReflection(
                              selectedWeek,
                              dayIndex,
                              currentDay.dayNumber,
                              activeDiscipline
                            );
                            
                            return reflection && reflection.questions && Array.isArray(reflection.questions) ? (
                              <div className="space-y-4">
                                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                                    <span className="font-semibold text-primary">Today's Focus:</span> {component.component || 'Building components'}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Reflect on your {activeDiscipline.toLowerCase()} work and how it connects to real-world development.
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-foreground mb-3">Reflection Questions:</h4>
                                  <ul className="space-y-3">
                                    {reflection.questions.map((question, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm sm:text-base text-foreground">
                                        <span className="text-primary mt-1.5 shrink-0">•</span>
                                        <span>{question}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                {reflection.documentation && Array.isArray(reflection.documentation) && reflection.documentation.length > 0 && (
                                  <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border/50">
                                    <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-2">📝 Documentation:</h4>
                                    <ul className="space-y-1.5">
                                      {reflection.documentation.map((doc, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                                          <span className="text-primary mt-1">•</span>
                                          <span>{doc}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-muted-foreground">
                                {isTomorrow(currentDay.dayNumber) 
                                  ? `Preview tomorrow's ${activeDiscipline.toLowerCase()} learning and implementation.` 
                                  : `Reflect on today's ${activeDiscipline.toLowerCase()} learning and implementation.`}
                              </p>
                            );
                          })()}
                        </Card>
                      ) : currentDay.reflection ? (
                        <Card className="p-4 sm:p-6 border border-border/50">
                          <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">Reflection</h3>
                          </div>
                          {typeof currentDay.reflection === 'string' ? (
                            <p className="text-foreground">{currentDay.reflection}</p>
                          ) : (
                            <>
                              {currentDay.reflection.prompt && (
                                <div className="mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                                  <p className="text-sm font-semibold text-primary mb-1">Reflection Prompt:</p>
                                  <p className="text-foreground">{currentDay.reflection.prompt}</p>
                                </div>
                              )}
                              {currentDay.reflection.questions && Array.isArray(currentDay.reflection.questions) && currentDay.reflection.questions.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-semibold text-foreground mb-2">Reflection Questions:</h4>
                                  <ul className="space-y-3">
                                    {currentDay.reflection.questions.map((question, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-foreground">
                                        <span className="text-primary mt-1">•</span>
                                        <span>{question}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {!currentDay.reflection.prompt && !currentDay.reflection.questions && (
                                <p className="text-foreground">{String(currentDay.reflection)}</p>
                              )}
                            </>
                          )}
                        </Card>
                      ) : (
                        <Card className="p-12 text-center border border-border/50">
                          <p className="text-muted-foreground">No reflection content for this day.</p>
                        </Card>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                    </div>
                  )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}