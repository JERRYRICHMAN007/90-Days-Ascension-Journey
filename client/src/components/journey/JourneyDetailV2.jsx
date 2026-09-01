import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  Lock,
  Info,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useGamification } from '../../hooks/useGamification';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentPhase } from '../../utils/phases';
import { calculateSessionBasedProgress, isDayFullyComplete, markSessionComplete, isSessionComplete, cleanInvalidProgress, toggleDayComplete } from '../../utils/progressTracking';
import { hasScheduledActivities, getNoActivityMessage } from '../../utils/daySchedule';
import { SessionCompletionButton } from '../SessionCompletionButton';
import { WorkoutCircuitCards } from './WorkoutCircuitCards';
import { BodyWorkoutHero } from '../body/BodyWorkoutHero';
import { ReadingFlowHero } from './ReadingFlowHero';
import { WritersFlowHero } from './WritersFlowHero';
import { DualBrandFlowHero } from './DualBrandFlowHero';
import { SessionFlowCards } from './SessionFlowCards';
import { getQuoteOfTheDay, getEncouragingMessage } from '../../data/quotes';
import { cn } from '../../lib/utils';
import { getJourneyPreparation } from '../../data/preparationData';
import { getSoftwareEngineeringReflection, getProjectComponentForDay } from '../../data/journeys/index.js';
import DailyQuiz from '../DailyQuiz';
import PracticalAssessment from '../PracticalAssessment';
import { hasPassedQuiz } from '../../utils/quizResults.js';
import { DayResourcesPanel, collectDayRelevantResources } from './DayResourcesPanel';
import { getJourneyAccent } from '../../utils/journeyAccents.js';
import { JourneyDetailShell } from './JourneyDetailShell';
import { JourneyOverviewPage } from './JourneyOverviewPage';
import { JourneyStatsPage } from './JourneyStatsPage';
import { JourneyAchievementsPage } from './JourneyAchievementsPage';
import { JourneyNotesPage } from './JourneyNotesPage';
import { getContentTemplateId, getRegistryEntry } from '../../utils/journeyRegistry.js';
import { getCustomPlan } from '../../utils/journeyCustomPlan.js';
import { getDisplayWeeklyPlan } from '../../utils/journeyWeeklyPlan.js';
import { JourneyWeekNav } from './JourneyWeekNav';
import { GamificationToast } from './GamificationToast';
import { JourneyStartGate } from './JourneyStartGate';
import {
  isJourneyStarted,
  getCurrentDayNumber as getJourneyCurrentDay,
  getJourneyPhaseStatus,
  getDateForDay as getJourneyDateForDay,
  getContentWeekForDay,
  getLiveDayLabel,
  getLiveDayYmd,
  isDayAccessibleFor,
  canCompleteDayFor,
  isDayPastFor,
  isTomorrowFor,
} from '../../utils/journeyPlanning.js';
import { JourneyMotivationQuote } from './JourneyMotivationQuote';
import { JourneySetupWizard } from './JourneySetupWizard';
import { JourneyReviewModal } from './JourneyReviewModal';
import { DayCompletionPanel } from './DayCompletionPanel';
import { resolveLiveJourneyDay, getLiveTimeBlock } from '../../utils/liveJourneyDay.js';
import { getIncompletePastDays } from '../../utils/incompleteDays.js';
import { getJourneySetup } from '../../utils/journeySetup.js';

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
  journeyId,
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { xp, getLevel, completeTask, addXP, achievements, streaks } = useGamification();
  const { user } = useAuth();
  const [progressTick, setProgressTick] = useState(0);
  const [timelineTick, setTimelineTick] = useState(0);
  const [setupOpen, setSetupOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [quizPhase, setQuizPhase] = useState('quiz'); // 'quiz' | 'assessment'
  const journeyStarted = isJourneyStarted(journeyId);
  const contentTemplateId = getContentTemplateId(journeyId);
  const isTomorrow = (dayNumber) => isTomorrowFor(journeyId, dayNumber);
  const isDayPast = (dayNumber) => isDayPastFor(journeyId, dayNumber);
  const isDayAccessible = (dayNumber) => isDayAccessibleFor(journeyId, dayNumber);
  const canCompleteDay = (dayNumber) => canCompleteDayFor(journeyId, dayNumber);

  useEffect(() => {
    if (searchParams.get('setup') === '1') {
      setSetupOpen(true);
      searchParams.delete('setup');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const handleProgressUpdate = () => setProgressTick((t) => t + 1);
    window.addEventListener('progress-updated', handleProgressUpdate);
    return () => window.removeEventListener('progress-updated', handleProgressUpdate);
  }, []);

  // Reset quiz/assessment view when day changes
  useEffect(() => {
    if (!selectedDay || !journeyId) {
      setQuizPhase('quiz');
      return;
    }
    if (hasPassedQuiz(journeyId, selectedDay)) {
      setQuizPhase('assessment');
    } else {
      setQuizPhase('quiz');
    }
  }, [selectedDay, journeyId, progressTick]);
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };
  
  // Get what user is working on today
  const getTodayFocus = () => {
    if (!journeyStarted) {
      return 'Choose your start date below to begin this journey';
    }
    if (getJourneyPhaseStatus(journeyId) === 'before') {
      return 'Your journey is scheduled — preview Day 1 or wait for start date';
    }
    if (isPreparationPhase) {
      return 'Onboarding — soft start';
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
  const currentDayForLevelCheck = getJourneyCurrentDay(journeyId);
  const isDay0 = currentDayForLevelCheck === 0 || currentDayForLevelCheck === null;
  
  // If XP is 0 OR we're on Day 0/preparation, ALWAYS force Level 1
  // This prevents showing incorrect levels from old data
  const shouldForceLevel1 = journeyXP === 0 || isDay0;
  
  const journeyLevelData = getLevel ? getLevel(journeyId) : { level: 0, currentXP: 0, xpToNext: 100 };
  const journeyLevel = shouldForceLevel1 
    ? { level: 0, currentXP: 0, xpToNext: 100 } 
    : journeyLevelData;
  
  // progressTick triggers re-read of sessionCompletions from localStorage
  void progressTick;
  
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
  const currentDayNumber = journeyStarted ? getJourneyCurrentDay(journeyId) : null;
  
  const isPreparationPhase = false;
  
  // Always get preparation data so Day 0 is always available
  const preparationData = getJourneyPreparation(journeyId);
  
  // Find current week - handle case where selectedWeek might be out of bounds
  // Calculate which week the selected day belongs to
  // Calendar weeks: Sunday → Saturday
  let effectiveWeek = selectedWeek;
  if (selectedDay >= 1) {
    const calculatedWeek = getContentWeekForDay(weeks, selectedDay);
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

  // Remap baked content calendar → this journey's real weekday (fixes false Saturday rest, etc.)
  if (currentDay) {
    currentDay = resolveLiveJourneyDay(currentDay, journeyId, weeks);
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
  
  // Track if we've done initial sync to today - only set active day to today on first load.
  // After that, the active day ONLY moves when the user selects another day.
  const hasInitialSyncToToday = useRef(false);
  
  // Auto-select today's day and week on initial load only (never override user selection)
  useEffect(() => {
    if (!journeyStarted) return;
    if (hasInitialSyncToToday.current) return;
    if (currentDayNumber === null || currentDayNumber === undefined || weeks.length === 0) return;
    
    hasInitialSyncToToday.current = true;
    const effectiveDay = currentDayNumber > 0 ? currentDayNumber : 1;
    const currentWeekNumber = effectiveDay > 0 ? getContentWeekForDay(weeks, effectiveDay) : 1;
    const validWeekNumber = Math.max(1, Math.min(currentWeekNumber, weeks.length));
    
    if (selectedDay !== effectiveDay || selectedWeek !== validWeekNumber) {
      if (selectedWeek !== validWeekNumber && validWeekNumber >= 1 && validWeekNumber <= weeks.length) {
        onWeekChange(validWeekNumber);
      }
      if (selectedDay !== effectiveDay) {
        onDayChange(effectiveDay);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDayNumber, weeks.length]);
  
  // Auto-select first content day when week changes OR on initial load
  useEffect(() => {
    if (!journeyStarted) return;
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
  
  // Calendar weekday from THIS journey's start date (not the hardcoded content library date)
  const journeyCalendarDate = useMemo(() => {
    if (!currentDay?.dayNumber) return null;
    return getJourneyDateForDay(journeyId, currentDay.dayNumber);
  }, [journeyId, currentDay?.dayNumber]);

  // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = useMemo(() => {
    if (!journeyCalendarDate) return null;
    return journeyCalendarDate.getDay();
  }, [journeyCalendarDate]);

  // Get day name (Monday, Tuesday, etc.) — must match the user's real journey calendar
  const dayName = useMemo(() => {
    if (!currentDay?.dayNumber) return null;
    return getLiveDayLabel(journeyId, currentDay.dayNumber);
  }, [journeyId, currentDay?.dayNumber]);

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
    if (contentTemplateId !== 'software-engineering' || !currentDay?.schedule) {
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
  }, [contentTemplateId, currentDay?.schedule]);

  // Discipline tabs — only show disciplines scheduled for THIS day
  // SE schedule: Mobile + Frontend + Backend every day except Saturday (4:00–5:30 AM)
  const allDisciplines = [
    { id: 'Mobile', label: 'Mobile', icon: Smartphone, color: '#f59e0b' },
    { id: 'Frontend', label: 'Frontend', icon: Code, color: '#667eea' },
    { id: 'Backend', label: 'Backend', icon: Server, color: '#10b981' },
  ];

  const disciplines = useMemo(() => {
    if (contentTemplateId !== 'software-engineering') {
      return allDisciplines;
    }

    // Live weekday wins over baked library schedule (Day 1 may have been generated as Saturday)
    if (isSaturday) {
      return [];
    }

    if (scheduledDisciplines.length > 0) {
      return allDisciplines.filter((d) =>
        scheduledDisciplines.includes(d.id) ||
        (d.id === 'Backend' && scheduledDisciplines.includes('Systems Engineering'))
      );
    }

    // Non-Saturday with remapped empty schedule → still show the trio
    if (dayOfWeek != null) {
      return allDisciplines;
    }

    return [];
  }, [journeyId, scheduledDisciplines, isSaturday, dayOfWeek]);
  
  // Auto-select first available discipline if current one is not scheduled
  useEffect(() => {
    if (contentTemplateId === 'software-engineering' && disciplines.length > 0) {
      const isCurrentDisciplineScheduled = disciplines.some(d => d.id === activeDiscipline);
      if (!isCurrentDisciplineScheduled) {
        // Switch to first scheduled discipline
        setActiveDiscipline(disciplines[0].id);
      }
    }
  }, [journeyId, disciplines, activeDiscipline]);

  // Filter schedule content by active discipline for Software Engineering
  const getDisciplineContent = () => {
    if (contentTemplateId !== 'software-engineering' || !currentDay?.schedule) {
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
    return isDayFullyComplete(journeyId, day);
  };

  const incompletePastDays = useMemo(() => {
    void progressTick;
    return getIncompletePastDays(journeyId, weeks || []);
  }, [journeyId, weeks, progressTick]);

  const oldestIncompleteDay = incompletePastDays[0] || null;

  // Extract all tasks from current day (discipline-aware for Software Engineering)
  const extractTasks = (day) => {
    if (!day) return [];
    
    // Don't extract tasks for Week 1 (Testing & Trials Week)
    if (day.isTestRun) return [];
    
    const tasks = [];

    if (getContentTemplateId(journeyId) === 'custom-scratch') {
      const live = getJourneyDateForDay(journeyId, day.dayNumber);
      const weekday = live ? live.getDay() : new Date().getDay();
      const generic = getCustomPlan(journeyId).genericDays?.[String(weekday)];
      const weekly = getDisplayWeeklyPlan(journeyId)[weekday];
      if (generic?.rest || weekly?.type === 'recovery' || weekly?.type === 'rest') {
        return [];
      }
      const text = (generic?.task || '').trim() || weekly?.label || "Complete today's session";
      tasks.push({
        id: `scratch-${day.dayNumber}`,
        text,
        category: 'Session',
      });
      return tasks;
    }
    
    // Dual Brand tasks
    if (contentTemplateId === 'dual-brand') {
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
    if (contentTemplateId === 'body-transformation' && day.workout) {
      tasks.push({
        id: `workout-${day.dayNumber}`,
        text: `Complete ${day.focus || 'workout'} session`,
        category: 'Workout'
      });
    }
    
    // Reading tasks
    if (contentTemplateId === 'reading' && day.readingSessions) {
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
    if (contentTemplateId === 'writers' && day.execution && !day.isRestDay) {
      tasks.push({
        id: `writers-${day.dayNumber}`,
        text: day.execution,
        category: 'Writing'
      });
    }
    
    // Software Engineering tasks - discipline-specific
    if (contentTemplateId === 'software-engineering' && day.schedule?.scheduledContent) {
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
  const dayTasks = useMemo(() => extractTasks(currentDay), [currentDay, journeyId, contentTemplateId, activeDiscipline]);
  
  // Task completion state (discipline-aware for Software Engineering)
  const [taskCompletion, setTaskCompletion] = useState(() => {
    if (!currentDay?.dayNumber) return {};
    try {
      const key = contentTemplateId === 'software-engineering' && currentDay?.dayNumber
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
      const key = contentTemplateId === 'software-engineering' && currentDay?.dayNumber
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
      const key = contentTemplateId === 'software-engineering' && currentDay?.dayNumber
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
      return isDayFullyComplete(journeyId, d);
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
    
    // Don't show next day if we're already at the last day
    if (nextDayNumber > journey.totalDays) {
      return null;
    }

    // Search across all weeks for the next day
    for (const week of weeks) {
      if (week && week.days && Array.isArray(week.days)) {
        const nextDay = week.days.find((d) => d && d.dayNumber === nextDayNumber);
        if (nextDay) {
          const liveDate = getJourneyDateForDay(journeyId, nextDayNumber);
          if (liveDate) {
            const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return resolveLiveJourneyDay(
              {
                ...nextDay,
                dayName: names[liveDate.getDay()],
                date: `${liveDate.getFullYear()}-${String(liveDate.getMonth() + 1).padStart(2, '0')}-${String(liveDate.getDate()).padStart(2, '0')}`,
                weekNumber: week.weekNumber,
              },
              journeyId,
              weeks
            );
          }
          return resolveLiveJourneyDay(nextDay, journeyId, weeks);
        }
      }
    }
    
    // If not found in weeks, create a placeholder using journey calendar
    const nextDate = getJourneyDateForDay(journeyId, nextDayNumber);
    if (nextDate) {
      const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return {
        dayNumber: nextDayNumber,
        date: nextDate.toISOString().split('T')[0],
        dayName: names[nextDate.getDay()],
      };
    }
    
    return null;
  };

  const nextDay = findNextDay();

  const toDateString = (dayNumber) => getLiveDayYmd(journeyId, dayNumber) ?? '';

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
  const journeyAccent = getJourneyAccent(journeyId);
  // Handle icon - can be either a React component or a string (emoji)
  const IconComponent = typeof journey.icon === 'string' 
    ? null 
    : journey.icon;
  const iconEmoji = typeof journey.icon === 'string' 
    ? journey.icon 
    : null;

  const registryEntry = getRegistryEntry(journeyId);
  const displayTitle = registryEntry?.title || journey.title;

  return (
    <div className="min-h-screen flex flex-col text-white" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <GamificationToast />
      <JourneySetupWizard
        journeyId={journeyId}
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        onComplete={() => setTimelineTick((t) => t + 1)}
        onRequestReview={() => {
          setSetupOpen(false);
          setReviewOpen(true);
        }}
        accentColor={journeyAccent?.color}
        accentRgb={journeyAccent?.rgb}
      />
      <JourneyReviewModal
        journeyId={journeyId}
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onConfirm={() => {
          setTimelineTick((t) => t + 1);
          setProgressTick((t) => t + 1);
        }}
        onEdit={() => setSetupOpen(true)}
        accentColor={journeyAccent?.color}
        accentRgb={journeyAccent?.rgb}
      />

      <JourneyDetailShell
        className="flex-1 min-h-0"
        pages={[
          <JourneyOverviewPage
            key="overview"
            journey={journey}
            journeyId={journeyId}
            journeyTitle={displayTitle}
            completedDays={completedDays}
            progressPercentage={progressPercentage}
            accentColor={journeyAccent?.color}
            accentRgb={journeyAccent?.rgb}
            iconEmoji={iconEmoji}
            IconComponent={IconComponent}
            colors={colors}
            onBack={() => navigate('/dashboard')}
            onTimelineRefresh={() => setTimelineTick((t) => t + 1)}
            onEditSetup={() => setSetupOpen(true)}
          />,
          <>
      <JourneyWeekNav
        journeyId={journeyId}
        weeks={weeks}
        selectedWeek={selectedWeek}
        selectedDay={selectedDay}
        onWeekChange={(weekNum) => {
          onWeekChange(weekNum);
          const weekData = weeks.find((w) => w.weekNumber === weekNum);
          const firstDay = weekData?.days?.find((d) => d?.dayNumber > 0);
          if (firstDay) onDayChange(firstDay.dayNumber);
        }}
        onDayChange={onDayChange}
        colors={colors}
        isDayComplete={(day) => getDayProgress(day)}
        isPreparationPhase={isPreparationPhase}
        preparationData={preparationData}
        isConfigured={journeyStarted}
        currentDayNumber={currentDayNumber}
      />
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 px-6 py-8 overflow-x-hidden">
          {!journeyStarted && (
            <JourneyStartGate
              journeyTitle={displayTitle}
              accentColor={journeyAccent?.color}
              accentRgb={journeyAccent?.rgb}
              planSource={getJourneySetup(journeyId).planSource}
              onSetup={() => setSetupOpen(true)}
            />
          )}
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
                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-foreground mb-2 sm:mb-2.5 md:mb-3">Journey Schedule</h3>
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
                  {isPreparationPhase ? 'Onboarding' : `Week ${selectedWeek}`}
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
                        {formatDateShort(toDateString(0))} • Preparation ({formatDayName(toDateString(0))})
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
                          {formatDateShort(toDateString(day1.dayNumber))} • {formatDayName(toDateString(day1.dayNumber))}
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
                  const dayIsPast = isDayPast(day.dayNumber);
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
                          ? 'bg-emerald-500/15 hover:bg-emerald-500/20 border border-emerald-500/30'
                          : dayIsPast
                          ? 'bg-muted/40 hover:bg-muted/50 border border-border/40'
                          : dayIsTomorrow
                          ? 'hover:bg-primary/5 border border-primary/20 bg-primary/5'
                          : 'hover:bg-muted/50'
                      )}
                      style={{ minHeight: '52px' }}
                    >
                      <div className={cn(
                        'w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center shrink-0',
                        isActive ? 'bg-white/20' : isCompleted ? 'bg-emerald-500' : dayIsPast ? 'bg-muted border-2 border-border' : dayIsTomorrow ? 'bg-primary/20 border-2 border-primary/40' : 'bg-muted border-2 border-border'
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
                          {formatDateShort(toDateString(day.dayNumber))} • {formatDayName(toDateString(day.dayNumber))}
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
                          {formatDateShort(toDateString(nextDay.dayNumber))} • {formatDayName(toDateString(nextDay.dayNumber))}
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
                  {contentTemplateId === 'software-engineering' && (
                    <div className="flex items-center gap-1.5 sm:gap-2 border-b border-border/50 pb-2 sm:pb-3 overflow-x-auto scrollbar-hide -mx-1 sm:mx-0 px-1 sm:px-0">
                      {disciplines.length === 0 ? (
                        <p className="text-sm text-muted-foreground px-2 py-2">
                          {isSaturday
                            ? 'No coding sessions today — Saturday is a rest day for Software Engineering.'
                            : 'No coding sessions scheduled for this day.'}
                        </p>
                      ) : (
                        disciplines.map((discipline) => {
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
                      })
                      )}
                    </div>
                  )}

                  {!currentDay && !isPreparationPhase && (
                    <Card className="p-6 sm:p-12 text-center">
                      <p className="text-muted-foreground">No day data available. Please try refreshing the page.</p>
                    </Card>
                  )}
                  {(journeyStarted && (currentDay || isPreparationPhase)) && (
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

                {!currentDay?.isTestRun && selectedDay >= 1 && (
                  <JourneyMotivationQuote
                    journeyId={journeyId}
                    domain={journeyId}
                    dayNumber={selectedDay}
                    accentColor={journeyAccent?.color}
                    accentRgb={journeyAccent?.rgb}
                  />
                )}

                {/* Day Header or Preparation Header */}
                {isPreparationPhase && preparationData ? (
                  <div className="glass-card rounded-xl p-4 sm:p-5 md:p-6 border border-border/50">
                    <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="text-3xl sm:text-4xl md:text-5xl shrink-0">{preparationData.icon}</div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-display mb-2 break-words">{preparationData.title}</h2>
                        <p className="text-sm sm:text-base text-muted-foreground mb-2 break-words">{preparationData.subtitle}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {formatDayName(toDateString(0))}, {formatDateShort(toDateString(0))}, 2026
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
                  <div className="space-y-4">
                    {oldestIncompleteDay &&
                      currentDay.dayNumber !== oldestIncompleteDay.dayNumber && (
                        <div
                          className="rounded-xl border px-4 py-3 flex flex-wrap items-center gap-3"
                          style={{
                            background: 'color-mix(in srgb, #f59e0b 10%, var(--bg-card))',
                            borderColor: 'color-mix(in srgb, #f59e0b 40%, var(--border-subtle))',
                          }}
                        >
                          <AlertTriangle className="size-4 text-amber-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[var(--text-primary)]">
                              Day {oldestIncompleteDay.dayNumber} still needs completion
                            </p>
                            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                              {incompletePastDays.length} unfinished day
                              {incompletePastDays.length === 1 ? '' : 's'} behind you. Finish those
                              first so today stays honest.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              onDayChange?.(oldestIncompleteDay.dayNumber);
                              onWeekChange?.(getContentWeekForDay(weeks, oldestIncompleteDay.dayNumber));
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-black shrink-0"
                            style={{ background: '#f59e0b' }}
                          >
                            Go to Day {oldestIncompleteDay.dayNumber}
                            <ArrowRight className="size-3.5" />
                          </button>
                        </div>
                      )}
                    <DayCompletionPanel
                      dayNumber={currentDay.dayNumber}
                      dayName={dayName}
                      dateYmd={getLiveDayYmd(journeyId, currentDay.dayNumber) ?? ''}
                      timeBlock={getLiveTimeBlock(journeyId, currentDay.dayNumber, journey?.timeBlock)}
                      isTomorrow={isTomorrow(currentDay.dayNumber)}
                      isComplete={getDayProgress(currentDay)}
                      canComplete={canCompleteDay(currentDay.dayNumber)}
                      isWeekEnd={currentDay.dayNumber % 7 === 0}
                      tasks={currentDay.isTestRun ? [] : dayTasks}
                      taskCompletion={taskCompletion}
                      allTasksCompleted={allTasksCompleted}
                      accentColor={journeyAccent?.color || 'var(--neon-green)'}
                      onToggleTask={toggleTask}
                      onMarkComplete={() => {
                        if (
                          oldestIncompleteDay &&
                          currentDay.dayNumber > oldestIncompleteDay.dayNumber &&
                          !getDayProgress(currentDay)
                        ) {
                          const go = window.confirm(
                            `Day ${oldestIncompleteDay.dayNumber} ("${oldestIncompleteDay.label}") is still incomplete. Finish earlier days first.\n\nGo to Day ${oldestIncompleteDay.dayNumber} now?`
                          );
                          if (go) {
                            onDayChange?.(oldestIncompleteDay.dayNumber);
                            onWeekChange?.(getContentWeekForDay(weeks, oldestIncompleteDay.dayNumber));
                          }
                          return;
                        }
                        if (!getDayProgress(currentDay) && !allTasksCompleted && dayTasks.length > 0) {
                          alert(`Please complete all ${dayTasks.length} task(s) before marking the day as complete.`);
                          return;
                        }
                        const isWeekEnd = currentDay.dayNumber % 7 === 0;
                        const isCurrentlyComplete = getDayProgress(currentDay);
                        if (isWeekEnd && !isCurrentlyComplete) {
                          const weekNumber = getContentWeekForDay(weeks, currentDay.dayNumber);
                          const weekData = weeks.find((w) => w.weekNumber === weekNumber);
                          const weekDayNumbers = (weekData?.days || []).map((d) => d.dayNumber);
                          const allDays = weeks.flatMap((w) => w.days || []);
                          for (const dayNum of weekDayNumbers) {
                            if (dayNum > journey.totalDays) continue;
                            const day = allDays.find((d) => d.dayNumber === dayNum);
                            if (day) toggleDayComplete(journeyId, day, true);
                          }
                        } else {
                          toggleDayComplete(journeyId, currentDay, !isCurrentlyComplete);
                        }
                        setProgressTick((t) => t + 1);
                      }}
                    />

                    {currentDay.theme && (
                      <div className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}>
                        <p className="text-sm font-medium text-foreground">{currentDay.theme}</p>
                      </div>
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
                      {currentDay.focus && !currentDay.isTestRun && contentTemplateId !== 'body-transformation' && contentTemplateId !== 'dual-brand' && (
                        <Card className="p-4 sm:p-6 border border-border/50">
                          <div className="flex items-center gap-2 mb-4">
                            <Target className="w-5 h-5 text-primary" />
                            <h3 className="text-base sm:text-lg font-semibold">
                              {isTomorrow(currentDay.dayNumber) ? "Tomorrow's Focus" : "Today's Focus"}
                            </h3>
                          </div>
                          <p className="text-sm sm:text-base text-foreground">{currentDay.focus}</p>
                          {currentDay.workout && (
                            typeof currentDay.workout === 'object' &&
                            currentDay.workout.exercises?.length > 0 ? (
                              <WorkoutCircuitCards
                                workout={currentDay.workout}
                                workoutLink={currentDay.workoutLink}
                              />
                            ) : (
                              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                                <p className="text-sm font-medium mb-2">Workout Plan</p>
                                <p className="text-sm text-muted-foreground">
                                  {typeof currentDay.workout === 'object'
                                    ? currentDay.workout.name || 'Complete workout'
                                    : currentDay.workout}
                                </p>
                                {currentDay.workoutLink && (
                                  <a
                                    href={currentDay.workoutLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-3 text-sm text-primary hover:underline"
                                  >
                                    Watch guided workout →
                                  </a>
                                )}
                              </div>
                            )
                          )}
                        </Card>
                      )}

                      {/* Learning Content - Hide for Week 1 */}
                      {/* For Software Engineering: Show schedule-based discipline content */}
                      {!currentDay?.isTestRun && contentTemplateId === 'software-engineering' && currentDay?.schedule && disciplineContent ? (
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
                            <SessionFlowCards
                              sessions={disciplineContent.deepLearning}
                              journeyId={journeyId}
                              dayNumber={currentDay?.dayNumber}
                              sessionType="deepLearning"
                              activeDiscipline={activeDiscipline}
                              title="Deep Learning Sessions"
                              label="Sessions · complete in order"
                            />
                          )}

                          {/* Focused Implementation Sessions */}
                          {!disciplineContent.notScheduled && disciplineContent.implementation.length > 0 && (
                            <SessionFlowCards
                              sessions={disciplineContent.implementation}
                              journeyId={journeyId}
                              dayNumber={currentDay?.dayNumber}
                              sessionType="focusedImplementation"
                              activeDiscipline={activeDiscipline}
                              title="Focused Implementation"
                              label="Implementation · complete in order"
                            />
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
                      ) : contentTemplateId === 'body-transformation' ? (
                        <>
                          {hasScheduledActivities(currentDay, journeyId) && currentDay.focus ? (
                            <BodyWorkoutHero
                              focus={currentDay.focus}
                              workout={currentDay.workout}
                              workoutLink={currentDay.workoutLink}
                              nutrition={currentDay.nutrition}
                              mindset={currentDay.mindset}
                              journeyId={journeyId}
                              dayNumber={currentDay.dayNumber}
                              dayIndex={currentDay.dayIndex}
                              weekNum={currentWeek?.weekNumber || selectedWeek || 1}
                              dayName={dayName || currentDay.dayName}
                              dailyLearning={null}
                              nextDay={nextDay}
                              onPreviewDay={onDayChange}
                              focusLabel={
                                isTomorrow(currentDay.dayNumber)
                                  ? "Tomorrow's Focus"
                                  : "Today's Focus"
                              }
                            />
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
                      ) : contentTemplateId === 'reading' ? (
                        <>
                          {hasScheduledActivities(currentDay, journeyId) && currentDay.readingSessions ? (
                            <ReadingFlowHero
                              dailyLearning={currentDay.dailyLearning}
                              readingSessions={currentDay.readingSessions}
                              theme={currentDay.theme}
                              journeyId={journeyId}
                              dayNumber={currentDay.dayNumber}
                              nextDay={nextDay}
                              onPreviewDay={onDayChange}
                              focusLabel={
                                isTomorrow(currentDay.dayNumber)
                                  ? "Tomorrow's Reading"
                                  : "Today's Reading"
                              }
                            />
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
                      ) : contentTemplateId === 'writers' ? (
                        <>
                          {hasScheduledActivities(currentDay, journeyId) && (currentDay.learning || currentDay.execution) ? (
                            <WritersFlowHero
                              learning={currentDay.learning}
                              execution={currentDay.execution}
                              theme={currentDay.theme}
                              focusLabel={
                                isTomorrow(currentDay.dayNumber)
                                  ? "Tomorrow's Writing"
                                  : "Today's Writing"
                              }
                            />
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
                      ) : contentTemplateId === 'dual-brand' ? (
                        <>
                          {hasScheduledActivities(currentDay, journeyId) && currentDay.focus ? (
                            <DualBrandFlowHero
                              focus={currentDay.focus}
                              theme={currentDay.theme}
                              personalBrandTasks={currentDay.personalBrandTasks}
                              companyBrandTasks={currentDay.companyBrandTasks}
                              ryxenTasks={currentDay.ryxenTasks}
                              havenXTasks={currentDay.havenXTasks}
                              outcome={currentDay.outcome}
                              journeyId={journeyId}
                              dayNumber={currentDay.dayNumber}
                              nextDay={nextDay}
                              onPreviewDay={onDayChange}
                              focusLabel={
                                isTomorrow(currentDay.dayNumber)
                                  ? "Tomorrow's Focus"
                                  : "Today's Focus"
                              }
                            />
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
                      
                      {!currentDay.dailyLearning && !currentDay.focus && !currentDay.learning && !currentDay.readingSessions && contentTemplateId !== 'dual-brand' && contentTemplateId !== 'writers' && contentTemplateId !== 'reading' && contentTemplateId !== 'body-transformation' && (
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
                      {contentTemplateId === 'software-engineering' && disciplineContent && disciplineContent.implementation.length > 0 ? (
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
                      ) : currentDay.project && contentTemplateId === 'dual-brand' ? (
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
                      <DayResourcesPanel
                        title={
                          contentTemplateId === 'software-engineering' && activeDiscipline
                            ? activeDiscipline + ' resources'
                            : "Today's resources"
                        }
                        subtitle="Only materials for today's task"
                        accentColor={journeyAccent?.color || 'var(--neon-green)'}
                        resources={collectDayRelevantResources({
                          journeyId,
                          day: currentDay,
                          disciplineContent:
                            contentTemplateId === 'software-engineering' ? disciplineContent : null,
                          max: 4,
                        })}
                      />
                    </motion.div>
                  )}

                  {activeTab === 'quiz' && !currentDay?.isTestRun && (
                    <motion.div
                      key="quiz"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                    >
                      {(currentDay?.dailyQuiz || currentDay?.practicalAssessment) && (
                        <div
                          className="flex gap-1 p-1 rounded-xl border w-fit"
                          style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-card)' }}
                        >
                          <button
                            type="button"
                            onClick={() => setQuizPhase('quiz')}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                            style={{
                              background:
                                quizPhase === 'quiz'
                                  ? journeyAccent?.color || 'var(--neon-green)'
                                  : 'transparent',
                              color: quizPhase === 'quiz' ? '#000' : 'var(--text-secondary)',
                            }}
                          >
                            Quiz
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                hasPassedQuiz(journeyId, currentDay.dayNumber) ||
                                !currentDay?.dailyQuiz
                              ) {
                                setQuizPhase('assessment');
                              }
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                            style={{
                              background:
                                quizPhase === 'assessment'
                                  ? journeyAccent?.color || 'var(--neon-green)'
                                  : 'transparent',
                              color: quizPhase === 'assessment' ? '#000' : 'var(--text-secondary)',
                              opacity:
                                !currentDay?.dailyQuiz ||
                                hasPassedQuiz(journeyId, currentDay.dayNumber)
                                  ? 1
                                  : 0.45,
                            }}
                          >
                            Assessment
                          </button>
                        </div>
                      )}

                      {quizPhase === 'quiz' && currentDay?.dailyQuiz ? (
                        <DailyQuiz
                          dailyQuiz={currentDay.dailyQuiz}
                          journeyId={journeyId}
                          dayNumber={currentDay.dayNumber}
                          accentColor={journeyAccent?.color || 'var(--neon-green)'}
                          onContinueToAssessment={() => setQuizPhase('assessment')}
                          onComplete={(results) => {
                            if (addXP && currentDay?.dayNumber !== 0) {
                              const baseXP = 30;
                              const performanceBonus = Math.round((results.percentage / 100) * 20);
                              addXP(baseXP + performanceBonus, journeyId);
                              if (results.passed) addXP(20, journeyId);
                            }
                            if (results.passed) setQuizPhase('assessment');
                            setProgressTick((t) => t + 1);
                          }}
                        />
                      ) : quizPhase === 'quiz' && !currentDay?.dailyQuiz ? (
                        <div
                          className="rounded-xl border p-8 text-center text-sm text-[var(--text-muted)]"
                          style={{
                            background: 'var(--bg-card)',
                            borderColor: 'var(--border-subtle)',
                          }}
                        >
                          No quiz for this day.
                        </div>
                      ) : null}

                      {quizPhase === 'assessment' && currentDay?.practicalAssessment ? (
                        <PracticalAssessment
                          assessment={currentDay.practicalAssessment}
                          journeyId={journeyId}
                          dayNumber={currentDay.dayNumber}
                          accentColor={journeyAccent?.color || 'var(--neon-green)'}
                          onComplete={() => {
                            if (addXP && currentDay?.dayNumber !== 0) {
                              addXP(40, journeyId);
                            }
                            setProgressTick((t) => t + 1);
                          }}
                        />
                      ) : quizPhase === 'assessment' && !currentDay?.practicalAssessment ? (
                        <div
                          className="rounded-xl border p-6 text-center space-y-2"
                          style={{
                            background: 'var(--bg-card)',
                            borderColor: 'var(--border-subtle)',
                          }}
                        >
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {hasPassedQuiz(journeyId, currentDay?.dayNumber)
                              ? 'Quiz recorded'
                              : 'Assessment'}
                          </p>
                          <p className="text-xs text-[var(--text-secondary)]">
                            {hasPassedQuiz(journeyId, currentDay?.dayNumber)
                              ? 'No separate practical assessment for this day — your quiz result is saved and locked.'
                              : 'No practical assessment for this day.'}
                          </p>
                        </div>
                      ) : null}
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
                      {contentTemplateId === 'software-engineering' && disciplineContent ? (
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
          </>,
          <JourneyStatsPage key="stats" journeyId={journeyId} weeks={weeks} progressTick={progressTick} />,
          <JourneyAchievementsPage
            key="achievements"
            journeyId={journeyId}
            progressPercentage={progressPercentage}
            completedDays={completedDays}
          />,
          <JourneyNotesPage key="notes" journeyId={journeyId} />,
        ]}
      />
    </div>
  );
}