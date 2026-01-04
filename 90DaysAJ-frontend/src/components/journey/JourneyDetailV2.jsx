import { useState } from 'react';
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
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useGamification } from '../../hooks/useGamification';
import { useAuth } from '../../contexts/AuthContext';
import { getCurrentDayNumber, getCurrentPhase, getDateForDay, isDayAccessible, canCompleteDay, isTomorrow } from '../../utils/dates';
import { getQuoteOfTheDay } from '../../data/quotes';
import { cn } from '../../lib/utils';
import { getJourneyPreparation } from '../../data/preparationData';

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
  const { xp, getLevel } = useGamification();
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
  const journeyXP = (xp?.domains?.[journeyId]) || 0;
  const journeyLevel = getLevel ? getLevel(journeyId) : { level: 1 };
  const journeyProgress = userProgress?.[journeyId] || {};
  const completedDays = Object.values(journeyProgress).filter(Boolean).length;
  const progressPercentage = Math.round((completedDays / (journey?.totalDays || 1)) * 100);

  // Check if we're in preparation phase (Day 0)
  const currentPhase = getCurrentPhase();
  const currentDayNumber = getCurrentDayNumber();
  
  // Day 0 is January 4, 2026 - accessible on that date or when explicitly selected
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const day0Date = new Date('2026-01-04');
  day0Date.setHours(0, 0, 0, 0);
  const isDay0Date = today.getTime() === day0Date.getTime();
  
  // Show preparation ONLY if Day 0 is explicitly selected
  // Day 1 and other days should show their content even if it's January 4, 2026 (preview mode)
  const isPreparationPhase = selectedDay === 0;
  
  // Always get preparation data so Day 0 is always available
  const preparationData = getJourneyPreparation(journeyId);
  
  // Find current week - handle case where selectedWeek might be out of bounds
  // When on Day 0 or Day 1, default to Week 1 to ensure Day 1 is accessible
  // Also ensure we use the correct week for the selected day
  let effectiveWeek = selectedWeek;
  if (selectedDay === 0 || selectedDay === 1) {
    effectiveWeek = 1;
  } else if (selectedDay > 0) {
    // Calculate which week the selected day belongs to
    const calculatedWeek = Math.ceil(selectedDay / 7);
    if (calculatedWeek >= 1 && calculatedWeek <= weeks.length) {
      effectiveWeek = calculatedWeek;
    }
  }
  const currentWeek = weeks.find((w) => w && w.weekNumber === effectiveWeek) || weeks[0] || null;
  
  // Find current day - search across all weeks if needed
  let currentDay = null;
  if (!isPreparationPhase && selectedDay > 0) {
    // First, try to find the day in the effective week
    if (currentWeek?.days && Array.isArray(currentWeek.days) && currentWeek.days.length > 0) {
      currentDay = currentWeek.days.find((d) => d && d.dayNumber === selectedDay) || null;
    }
    
    // If not found in current week, search across all weeks for the selected day
    if (!currentDay && weeks.length > 0) {
      for (const week of weeks) {
        if (week && week.days && Array.isArray(week.days) && week.days.length > 0) {
          const foundDay = week.days.find((d) => d && d.dayNumber === selectedDay);
          if (foundDay) {
            currentDay = foundDay;
            // Update selectedWeek to match the week where the day was found
            if (selectedWeek !== week.weekNumber) {
              onWeekChange(week.weekNumber);
            }
            break;
          }
        }
      }
    }
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
  const [activeDiscipline, setActiveDiscipline] = useState('Frontend');
  
  const disciplines = [
    { id: 'Frontend', label: 'Frontend', icon: Code, color: '#667eea' },
    { id: 'Backend', label: 'Backend', icon: Server, color: '#10b981' },
    { id: 'Mobile', label: 'Mobile', icon: Smartphone, color: '#f59e0b' },
    { id: 'WordPress', label: 'WordPress', icon: Globe, color: '#8b5cf6' },
  ];

  // Filter schedule content by active discipline for Software Engineering
  const getDisciplineContent = () => {
    if (journeyId !== 'software-engineering' || !currentDay?.schedule) {
      return null;
    }

    const schedule = currentDay.schedule;
    const deepLearningSessions = schedule?.scheduledContent?.deepLearning?.filter(
      (block) => block.discipline === activeDiscipline
    ) || [];
    
    const implementationSessions = schedule?.scheduledContent?.focusedImplementation?.filter(
      (block) => block.discipline === activeDiscipline
    ) || [];

    // Get resources and reflection filtered by discipline
    const disciplineResources = currentDay.resources || [];
    const disciplineReflection = currentDay.reflection;

    return {
      deepLearning: deepLearningSessions,
      implementation: implementationSessions,
      resources: disciplineResources,
      reflection: disciplineReflection
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
  
  const getWeekProgress = (week) => {
    if (!week || !week.days) return 0;
    const weekDays = week.days || [];
    if (weekDays.length === 0) return 0;
    const completed = weekDays.filter((d) => d && d.dayNumber && journeyProgress[d.dayNumber]).length;
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
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const formatDayName = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 lg:py-8">
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 lg:py-6">
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

      {/* Section C - Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="lg:hidden fixed top-16 sm:top-20 left-3 sm:left-4 z-50 p-2.5 sm:p-3 rounded-lg bg-card border border-border shadow-lg touch-manipulation"
          aria-label="Toggle navigation"
          style={{ minWidth: '44px', minHeight: '44px' }}
        >
          {isMobileSidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
        
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6 px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 lg:py-6 overflow-x-hidden">
          {/* Left Column - Navigation (Sticky, Non-scrolling) */}
          <aside className={cn(
            "w-full lg:w-64 shrink-0 lg:block",
            isMobileSidebarOpen ? "block fixed left-0 top-0 h-full z-50 bg-card border-r overflow-y-auto" : "hidden"
          )}>
            <div className="lg:sticky lg:top-6 space-y-3 sm:space-y-4 lg:h-[calc(100vh-200px)] overflow-y-auto p-3 sm:p-4 lg:p-0">
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
                    const isActive = week.weekNumber === selectedWeek;
                    
                    return (
                      <button
                        key={week.weekNumber}
                        onClick={() => {
                          onWeekChange(week.weekNumber);
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
                        Jan 4, 2026 • Setup & Environment
                      </div>
                    </div>
                  </button>
                )}

                {/* When on Day 0, always show Day 1 from Week 1 as preview */}
                {selectedDay === 0 && (() => {
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
                          {!day1IsAccessible && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-normal">
                              Locked
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
                  const isLocked = !dayIsAccessible;
                  
                  return (
                    <button
                      key={day.dayNumber}
                      onClick={() => {
                        if (dayIsAccessible) {
                          onDayChange(day.dayNumber);
                          setIsMobileSidebarOpen(false);
                        }
                      }}
                      disabled={isLocked}
                      className={cn(
                        'w-full flex items-center gap-2 sm:gap-2.5 md:gap-3 p-2.5 sm:p-3 md:p-3.5 rounded-lg text-left transition-all group touch-manipulation',
                        isLocked 
                          ? 'opacity-50 cursor-not-allowed' 
                          : isActive 
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
                          {isLocked && (
                            <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-normal whitespace-nowrap shrink-0">
                              Locked
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
                {/* Daily Quote/Motivation Card */}
                {(() => {
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
                          Sunday, January 4, 2026
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
                          {currentDay.date && new Date(currentDay.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      {canCompleteDay(currentDay.dayNumber) ? (
                        <Button
                          onClick={() => updateProgress(journeyId, currentDay.dayNumber, !getDayProgress(currentDay))}
                          className={cn(
                            'touch-manipulation',
                            getDayProgress(currentDay) ? 'bg-muted' : ''
                          )}
                          style={{ minHeight: '44px' }}
                        >
                          {getDayProgress(currentDay) ? (
                            <>
                              <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              <span className="text-sm sm:text-base">Completed</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              <span className="text-sm sm:text-base">Mark Complete</span>
                            </>
                          )}
                        </Button>
                      ) : isTomorrow(currentDay.dayNumber) ? (
                        <div className="text-sm sm:text-base text-muted-foreground flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-muted/50 border border-border/50">
                          <span>Preview Only</span>
                          <span className="text-xs sm:text-sm hidden sm:inline">• Complete tomorrow</span>
                        </div>
                      ) : (
                        <div className="text-sm sm:text-base text-muted-foreground flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md bg-muted/50 border border-border/50">
                          <span>Locked</span>
                        </div>
                      )}
                    </div>

                    {/* Day Theme */}
                    {currentDay.theme && (
                      <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
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
                      ['learning', 'project', 'resources', 'reflection'].map((tab) => (
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
                      ))
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
                      {/* Focus Section (for other journeys) */}
                      {currentDay.focus && (
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

                      {/* Learning Content */}
                      {/* For Software Engineering: Show schedule-based discipline content */}
                      {journeyId === 'software-engineering' && currentDay?.schedule && disciplineContent ? (
                        <>
                          {/* Deep Learning Sessions */}
                          {disciplineContent.deepLearning.length > 0 && (
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
                                  </div>
                                </Card>
                              ))}
                            </div>
                          )}

                          {/* Focused Implementation Sessions */}
                          {disciplineContent.implementation.length > 0 && (
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
                                  </div>
                                </Card>
                              ))}
                            </div>
                          )}

                          {/* Systems Section - Always visible */}
                          {currentDay.dailyLearning?.systems && (
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

                          {/* Fallback: Show dailyLearning if no schedule content */}
                          {disciplineContent.deepLearning.length === 0 && disciplineContent.implementation.length === 0 && currentDay.dailyLearning && (
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

                              {/* Systems Thinking Section - Collapsible */}
                              {currentDay.dailyLearning.systems && (
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
                      
                      {!currentDay.dailyLearning && !currentDay.focus && (
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
                      ) : currentDay.miniProject ? (
                        <Card className="p-4 sm:p-6 border border-border/50">
                          {/* Project Information Header */}
                          {currentDay.project && (
                            <div className="mb-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                              <div className="flex items-center gap-2 mb-2">
                                <Target className="w-5 h-5 text-primary" />
                                <h4 className="text-sm font-semibold text-primary">Building: {currentDay.project.name}</h4>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{currentDay.project.description}</p>
                              <div className="text-xs text-muted-foreground">
                                <span className="font-semibold">Phase:</span> {currentDay.project.buildPhase}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 mb-4">
                            <Code className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
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
                          {/* Get resources from schedule sessions */}
                          {(() => {
                            const allResources = [];
                            disciplineContent.deepLearning.forEach(session => {
                              if (session.content?.resources && Array.isArray(session.content.resources)) {
                                allResources.push(...session.content.resources);
                              }
                            });
                            disciplineContent.implementation.forEach(session => {
                              if (session.content?.resources && Array.isArray(session.content.resources)) {
                                allResources.push(...session.content.resources);
                              }
                            });
                            
                            // Also include general resources if available
                            if (Array.isArray(currentDay.resources)) {
                              allResources.push(...currentDay.resources);
                            }
                            
                            return allResources.length > 0 ? (
                              <ul className="space-y-3">
                                {allResources.map((resource, idx) => (
                                  <li key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                    <div>
                                      <a
                                        href={resource.url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-foreground hover:text-primary transition-colors font-medium"
                                      >
                                        {resource.title || resource}
                                      </a>
                                      {resource.time && (
                                        <span className="text-xs text-muted-foreground ml-2">({resource.time})</span>
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
                      ) : currentDay.resources ? (
                        <Card className="p-4 sm:p-6 border border-border/50">
                          <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">Resources</h3>
                          </div>
                          {Array.isArray(currentDay.resources) && currentDay.resources.length > 0 ? (
                            <ul className="space-y-3">
                              {currentDay.resources.map((resource, idx) => (
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
                          ) : (
                            <p className="text-muted-foreground">No resources for this day.</p>
                          )}
                        </Card>
                      ) : (
                        <Card className="p-12 text-center border border-border/50">
                          <p className="text-muted-foreground">No resources for this day.</p>
                        </Card>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'reflection' && (
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
                          {currentDay.reflection ? (
                            typeof currentDay.reflection === 'string' ? (
                              <p className="text-foreground">{currentDay.reflection}</p>
                            ) : currentDay.reflection.questions && Array.isArray(currentDay.reflection.questions) ? (
                              <ul className="space-y-3">
                                {currentDay.reflection.questions.map((question, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-foreground">
                                    <span className="text-primary mt-1">•</span>
                                    <span>{question}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-foreground">{String(currentDay.reflection)}</p>
                            )
                          ) : (
                            <p className="text-muted-foreground">
                              {isTomorrow(currentDay.dayNumber) 
                                ? `Preview tomorrow's ${activeDiscipline.toLowerCase()} learning and implementation.` 
                                : `Reflect on today's ${activeDiscipline.toLowerCase()} learning and implementation.`}
                            </p>
                          )}
                        </Card>
                      ) : currentDay.reflection ? (
                        <Card className="p-4 sm:p-6 border border-border/50">
                          <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">Reflection</h3>
                          </div>
                          {typeof currentDay.reflection === 'string' ? (
                            <p className="text-foreground">{currentDay.reflection}</p>
                          ) : currentDay.reflection.questions && Array.isArray(currentDay.reflection.questions) ? (
                            <ul className="space-y-3">
                              {currentDay.reflection.questions.map((question, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-foreground">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{question}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-foreground">{String(currentDay.reflection)}</p>
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

