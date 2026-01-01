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
  ChevronUp
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { useGamification } from '../../hooks/useGamification';
import { getCurrentDayNumber } from '../../utils/dates';
import { getQuoteOfTheDay } from '../../data/quotes';

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

  // Find current week - handle case where selectedWeek might be out of bounds
  const currentWeek = weeks.find((w) => w && w.weekNumber === selectedWeek) || weeks[0] || null;
  
  // Find current day - handle software engineering crash course structure
  let currentDay = null;
  if (currentWeek?.days && Array.isArray(currentWeek.days) && currentWeek.days.length > 0) {
    currentDay = currentWeek.days.find((d) => d && d.dayNumber === selectedDay) || currentWeek.days[0] || null;
  }
  
  // If no current day found, try to find any day in any week
  if (!currentDay && weeks.length > 0) {
    for (const week of weeks) {
      if (week && week.days && Array.isArray(week.days) && week.days.length > 0) {
        currentDay = week.days[0];
        break;
      }
    }
  }

  // Tab state for content sections
  const [activeTab, setActiveTab] = useState('learning');
  const [expandedSections, setExpandedSections] = useState({
    frontend: true,
    backend: true,
    systems: true,
    project: true,
    resources: false,
    reflection: false
  });

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
  const Icon = journey.icon || (() => <span>{journey.icon}</span>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Back Button & Title */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-3xl font-bold text-display truncate">{journey.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">{journey.description}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">
                {progressPercentage}% Complete
              </span>
              <span className="text-xs text-muted-foreground">
                Day {completedDays} of {journey.totalDays}
              </span>
            </div>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <div className="shimmer absolute inset-0" />
              </motion.div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Flame className="w-5 h-5 text-streak shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Streak</div>
                <div className="text-lg font-bold text-foreground tabular-nums">0</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Star className="w-5 h-5 text-xp shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">XP</div>
                <div className="text-lg font-bold text-foreground tabular-nums">
                  {journeyXP.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <TrendingUp className="w-5 h-5 text-levelup shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Level</div>
                <div className="text-lg font-bold text-foreground tabular-nums">
                  Lv.{journeyLevel.level}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <Calendar className="w-5 h-5 text-primary shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Week</div>
                <div className="text-lg font-bold text-foreground tabular-nums">
                  {selectedWeek}/{weeks.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Week Navigation Tabs */}
      <div className="border-b border-border/50 bg-card/30 sticky top-[180px] z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-4">
            {weeks.map((week) => {
              const weekProgress = getWeekProgress(week);
              const isActive = week.weekNumber === selectedWeek;
              
              return (
                <button
                  key={week.weekNumber}
                  onClick={() => onWeekChange(week.weekNumber)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                    whitespace-nowrap shrink-0 transition-all
                    ${isActive 
                      ? `bg-gradient-to-r ${colors.gradient} text-white` 
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }
                  `}
                >
                  <span>Week {week.weekNumber}</span>
                  {weekProgress > 0 && (
                    <span className={`
                      text-xs px-1.5 py-0.5 rounded
                      ${isActive ? 'bg-white/20' : 'bg-muted'}
                    `}>
                      {weekProgress}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Single Scroll Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Days Sidebar - No Sticky, Part of Main Scroll */}
          <aside className="lg:col-span-1">
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Week {selectedWeek}
              </h3>
              <div className="space-y-2">
                {currentWeek?.days?.map((day, idx) => {
                  if (!day || !day.dayNumber) return null;
                  const isCompleted = getDayProgress(day);
                  const isActive = day.dayNumber === selectedDay;
                  
                  return (
                    <button
                      key={day.dayNumber}
                      onClick={() => onDayChange(day.dayNumber)}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-lg text-left
                        transition-all group
                        ${isActive 
                          ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg` 
                          : isCompleted
                          ? 'bg-muted/50 hover:bg-muted'
                          : 'hover:bg-muted/50'
                        }
                      `}
                    >
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center shrink-0
                        ${isActive ? 'bg-white/20' : isCompleted ? 'bg-primary' : 'bg-muted border-2 border-border'}
                      `}>
                        {isCompleted && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                        {!isCompleted && !isActive && (
                          <span className="text-xs font-semibold">{day.dayNumber}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-foreground'}`}>
                          Day {day.dayNumber}
                        </div>
                        <div className={`text-xs ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                          {formatDateShort(day.date)} • {formatDayName(day.date)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main Content Area - Single Scroll Container */}
          <main className="lg:col-span-3">
            {!currentDay && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No day data available. Please try refreshing the page.</p>
              </Card>
            )}
            {currentDay && (
              <div className="space-y-6">
                {/* Daily Quote/Motivation Card */}
                {(() => {
                  const dailyQuote = getQuoteOfTheDay(journeyId, completedDays);
                  return (
                    <Card className={`p-8 bg-gradient-to-br ${colors.gradient} border-0 text-white`}>
                      <div className="flex items-start gap-4">
                        <div className="text-4xl shrink-0">{dailyQuote.icon}</div>
                        <div className="flex-1">
                          <blockquote className="text-xl font-medium mb-3 leading-relaxed">
                            "{dailyQuote.quote}"
                          </blockquote>
                          <cite className="text-sm text-white/80 italic">— {dailyQuote.author}</cite>
                        </div>
                      </div>
                    </Card>
                  );
                })()}

                {/* Day Header */}
                <div className="glass-card rounded-xl p-6 border border-border/50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-bold text-display">Day {currentDay.dayNumber}</h2>
                        {getDayProgress(currentDay) && (
                          <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-semibold">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        {currentDay.date && new Date(currentDay.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <Button
                      onClick={() => updateProgress(journeyId, currentDay.dayNumber, !getDayProgress(currentDay))}
                      className={getDayProgress(currentDay) ? 'bg-muted' : ''}
                    >
                      {getDayProgress(currentDay) ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Mark Complete
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Day Theme */}
                  {currentDay.theme && (
                    <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border}`}>
                      <p className="text-sm font-medium text-foreground">{currentDay.theme}</p>
                    </div>
                  )}
                </div>

                {/* Content Tabs */}
                <div className="border-b border-border/50">
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    {['learning', 'project', 'resources', 'reflection'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                          px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                          ${activeTab === tab
                            ? `border-primary text-primary`
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                          }
                        `}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === 'learning' && (
                    <motion.div
                      key="learning"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {/* Focus Section (for other journeys) */}
                      {currentDay.focus && (
                        <Card className="p-6 border border-border/50">
                          <div className="flex items-center gap-2 mb-4">
                            <Target className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">Today's Focus</h3>
                          </div>
                          <p className="text-foreground">{currentDay.focus}</p>
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
                      {currentDay.dailyLearning && (
                        <>
                          {typeof currentDay.dailyLearning === 'object' && (
                        <>
                          {currentDay.dailyLearning.title && (
                            <Card className="p-6 border border-border/50">
                              <h3 className="text-lg font-semibold text-foreground mb-4">{currentDay.dailyLearning.title}</h3>
                            </Card>
                          )}
                          
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
                          {!currentDay.dailyLearning && !currentDay.focus && (
                            <Card className="p-12 text-center border border-border/50">
                              <p className="text-muted-foreground">No learning content for this day.</p>
                            </Card>
                          )}
                        </>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'project' && currentDay.miniProject && (
                    <motion.div
                      key="project"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Card className="p-6 border border-border/50">
                        <div className="flex items-center gap-2 mb-4">
                          <Code className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-semibold">{currentDay.miniProject.title}</h3>
                        </div>
                        <p className="text-foreground mb-4">{currentDay.miniProject.description}</p>
                        {currentDay.miniProject.requirements && Array.isArray(currentDay.miniProject.requirements) && (
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-2">Requirements:</h4>
                            <ul className="space-y-2">
                              {currentDay.miniProject.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  )}

                  {activeTab === 'resources' && currentDay.resources && (
                    <motion.div
                      key="resources"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Card className="p-6 border border-border/50">
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
                    </motion.div>
                  )}

                  {activeTab === 'reflection' && currentDay.reflection && (
                    <motion.div
                      key="reflection"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Card className="p-6 border border-border/50">
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </main>
        </div>
        </div>
      </div>
    </div>
  );
}

