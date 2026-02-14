import { useMemo, useEffect } from "react";
import { useGamification } from "../hooks/useGamification";
import { useAuth } from "../contexts/AuthContext";
import { LevelBar } from "../components/ui/level-bar";
import { StreakIndicator } from "../components/ui/streak-indicator";
import { StatsWidget } from "../components/ui/stats-widget";
import { TaskCard } from "../components/ui/task-card";
import { TaskCardV2 } from "../components/ui/task-card-v2";
import { Card } from "../components/ui/card";
import { JourneyCardV2 } from "../components/dashboard/JourneyCardV2";
import { GamificationInfo } from "../components/GamificationInfo";
import {
  Dumbbell,
  Palette,
  BookOpen,
  PenTool,
  Code,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getJourneyData } from "../data/journeyData";
import {
  getCurrentPhaseStatus,
  getCurrentDayNumber,
  formatDayNumber,
  getJourneyProgress,
  getDaysRemaining,
} from "../utils/dates";
import { calculateSessionBasedProgress, cleanInvalidProgress, resetAllProgress } from "../utils/progressTracking";

const journeyCards = [
  {
    id: "body-transformation",
    icon: Dumbbell,
    label: "Body Transformation",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "dual-brand",
    icon: Palette,
    label: "Dual Brand",
    color: "from-pink-500 to-purple-500",
  },
  {
    id: "reading",
    icon: BookOpen,
    label: "Reading Journey",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "writers",
    icon: PenTool,
    label: "Writer's Journey",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "software-engineering",
    icon: Code,
    label: "Software Engineering",
    color: "from-violet-500 to-purple-500",
  },
];

export function HomePage({ userProgress }) {
  const { user } = useAuth();
  const { xp, streaks, getLevel } = useGamification();
  const globalLevel = getLevel();
  
  // Expose reset function globally for manual reset via console
  useEffect(() => {
    window.resetAllProgress = () => {
      console.log('🔄 Manual reset requested...');
      localStorage.setItem('force_reset_all', 'true');
      resetAllProgress();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    };
    
    return () => {
      delete window.resetAllProgress;
    };
  }, []);
  
  // Clean invalid progress for all journeys once on mount
  // Also reset all gamification data if we're on Day 0 (fresh start)
  useEffect(() => {
    const currentDay = getCurrentDayNumber();
    const phase = getCurrentPhaseStatus();
    
    // FORCE RESET: If we're on Day 0 (preparation day), ALWAYS reset all progress and gamification
    // This ensures a fresh start on February 15, 2026 (Day 0)
    // Also check for manual reset flag
    const forceReset = localStorage.getItem('force_reset_all') === 'true';
    
    if (currentDay === 0 || phase === 'preparation' || forceReset) {
      const hasExistingXP = localStorage.getItem('ascensionXP');
      const hasExistingCompletions = localStorage.getItem('sessionCompletions');
      
      // Check if there's any data to reset OR if force reset is requested
      const hasData = hasExistingXP || hasExistingCompletions;
      
      if (hasData || forceReset) {
        let shouldReset = forceReset; // Force reset takes priority
        
        if (!shouldReset && hasExistingXP) {
          try {
            const xpData = JSON.parse(hasExistingXP);
            shouldReset = xpData && (xpData.global > 0 || Object.keys(xpData.domains || {}).length > 0);
          } catch (e) {
            shouldReset = true;
          }
        }
        
        if (!shouldReset && hasExistingCompletions) {
          shouldReset = hasExistingCompletions !== '{}' && hasExistingCompletions !== 'null';
        }
        
        // Always reset on Day 0 if there's any data OR if force reset is requested
        if (shouldReset) {
          console.log('🔄 FORCING reset of all progress and gamification data...');
          console.log('  Reason:', forceReset ? 'Manual force reset' : 'Day 0 detected');
          resetAllProgress();
          // Clear reset flags
          localStorage.removeItem('day0_reset_completed');
          localStorage.removeItem('force_reset_all');
          // Reload page to reflect changes
          setTimeout(() => {
            window.location.reload();
          }, 500);
          return; // Exit early to prevent further processing
        }
      }
    } else if (phase !== 'preparation' && currentDay !== 0) {
      // Clear the reset flag when we move past Day 0
      localStorage.removeItem('day0_reset_completed');
      localStorage.removeItem('force_reset_all');
    }
    
    // Clean invalid progress for all journeys
    const journeyIds = [
      "body-transformation",
      "reading",
      "writers",
      "dual-brand",
      "software-engineering",
    ];
    
    journeyIds.forEach((journeyId) => {
      try {
        const journeyData = getJourneyData(journeyId);
        if (journeyData?.weeks) {
          cleanInvalidProgress(journeyId, journeyData.weeks);
        }
      } catch (error) {
        console.error(`Error cleaning progress for ${journeyId}:`, error);
      }
    });
  }, []); // Run once on mount
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };
  
  // Get user's first name or fallback
  const getUserName = () => {
    if (user?.name) {
      // Extract first name if full name is provided
      const firstName = user.name.split(' ')[0];
      return firstName;
    }
    return null;
  };

  // Calculate today's date and get real objectives
  const {
    todayDate,
    todayTasks,
    currentPhase,
    currentDay,
    progress,
    daysRemaining,
  } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const todayDateStr = today.toISOString().split("T")[0];

    // Use new date utilities
    const phase = getCurrentPhaseStatus();
    const dayNumber = getCurrentDayNumber();
    const journeyProgress = getJourneyProgress();
    const remaining = getDaysRemaining();

    // Format today's date for display
    const formattedDate = today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const tasks = [];
    
    // Only show tasks if in phase1 or phase2
    if ((phase === "phase1" || phase === "phase2") && dayNumber) {
      const journeyIds = [
        "body-transformation",
        "reading",
        "writers",
        "dual-brand",
        "software-engineering",
      ];

      journeyIds.forEach((journeyId) => {
        try {
          const { weeks } = getJourneyData(journeyId);

          // Find today's day in the journey
          for (const week of weeks) {
            if (week.days) {
              // Find day by date or by day number (for phase1 or phase2)
              const todayDay = week.days.find((day) => {
                // Match by date if available
                if (day.date === todayDateStr) return true;
                // Match by day number if in phase1 or phase2
                if (
                  (phase === "phase1" || phase === "phase2") &&
                  dayNumber &&
                  day.dayNumber === dayNumber
                )
                  return true;
                return false;
              });
              if (todayDay) {
                // Check journey-specific schedules
                const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
                const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                // Skip if journey doesn't run on this day
                if (
                  journeyId === "body-transformation" &&
                  !isWeekday &&
                  todayDay.focus === "Rest & Recovery"
                ) {
                  // Skip rest days
                  continue;
                }
                if (journeyId === "writers" && !isWeekday) {
                  // Writer's journey only runs Mon-Fri
                  continue;
                }

                // Extract task based on journey type
                let taskTitle = "";
                let priority = "normal";
                let xpReward = 20;

                switch (journeyId) {
                  case "body-transformation":
                    if (
                      todayDay.focus &&
                      todayDay.focus !== "Rest & Recovery"
                    ) {
                      const workoutText =
                        typeof todayDay.workout === "object"
                        ? todayDay.workout.name || "Complete workout"
                        : todayDay.workout || "Complete workout";
                      taskTitle = `💪 ${todayDay.focus} - ${workoutText}`;
                      priority = "high";
                      xpReward = 25;
                    }
                    break;
                  case "reading":
                    if (
                      todayDay.readingSessions &&
                      todayDay.readingSessions.length > 0
                    ) {
                      const session = todayDay.readingSessions[0];
                      const material =
                        session.material || "Daily reading session";
                      taskTitle = `📚 Reading: ${material.substring(0, 50)}${
                        material.length > 50 ? "..." : ""
                      }`;
                      priority = "normal";
                      xpReward = 15;
                    } else if (
                      todayDay.resources &&
                      todayDay.resources.length > 0
                    ) {
                      // Fallback to resources if no reading sessions
                      taskTitle = `📚 Reading: ${
                        todayDay.resources[0].title?.substring(0, 50) ||
                        "Daily reading"
                      }`;
                      priority = "normal";
                      xpReward = 15;
                    }
                    break;
                  case "writers":
                    if (todayDay.execution) {
                      taskTitle = `✍️ Writer's Journey: ${todayDay.execution.substring(
                        0,
                        55
                      )}${todayDay.execution.length > 55 ? "..." : ""}`;
                      priority = "medium";
                      xpReward = 25;
                    }
                    break;
                  case "dual-brand":
                    if (todayDay.ryxenTasks || todayDay.havenXTasks) {
                      taskTitle = `🎨 Dual Brand: Complete Ryxen & HavenX tasks`;
                      priority = "medium";
                      xpReward = 20;
                    }
                    break;
                  case "software-engineering":
                    if (todayDay.dailyLearning) {
                      const learningTitle =
                        typeof todayDay.dailyLearning === "object"
                          ? todayDay.dailyLearning.title
                          : todayDay.dailyLearning;
                      taskTitle = `💻 Software Engineering: ${
                        learningTitle?.substring(0, 45) || "Daily learning"
                      }${
                        learningTitle && learningTitle.length > 45 ? "..." : ""
                      }`;
                      priority = "high";
                      xpReward = 30;
                    }
                    break;
                }

                if (taskTitle) {
                  tasks.push({
                    id: `${journeyId}-${todayDay.dayNumber}`,
                    title: taskTitle,
                    domain: journeyId,
                    xpReward,
                    priority,
                  });
                }
                break;
              }
            }
          }
        } catch (error) {
          console.error(`Error getting tasks for ${journeyId}:`, error);
        }
      });
    }

    return { 
      todayDate: formattedDate, 
      todayTasks: tasks,
      currentPhase: phase,
      currentDay: dayNumber,
      progress: journeyProgress,
      daysRemaining: remaining,
    };
  }, []); // Empty dependency array - recalculate only on mount

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section - Day Number - Better Mobile Layout */}
      <div className="text-center space-y-3 py-6 sm:py-8 border-b border-border/50">
        {currentPhase === "preparation" && currentDay === 0 && (
          <>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {formatDayNumber(currentDay)}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
              {daysRemaining} days remaining • Journey starts tomorrow
            </div>
            <div className="text-xs sm:text-sm font-medium text-foreground mt-2 px-2">
              "Preparation is the foundation of success"
            </div>
          </>
        )}
        {(currentPhase === "phase1" || currentPhase === "phase2") && currentDay && currentDay > 0 && (
          <>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {formatDayNumber(currentDay)}
            </div>
            <div className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
              {progress}% Complete • {daysRemaining} days remaining
            </div>
            <div className="text-xs sm:text-sm font-medium text-foreground mt-2 px-2">
              "Discipline compounds daily"
            </div>
          </>
        )}
        {currentPhase === "before" && (
          <>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-muted-foreground px-2">
              Your Ascension Journey
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground px-2">
              Day 0: February 15, 2026 • Start: February 16, 2026
            </div>
          </>
        )}
        {currentPhase === "after" && (
          <>
            <div className="text-lg sm:text-xl md:text-2xl font-bold px-2">🎉 Journey Complete</div>
            <div className="text-xs sm:text-sm text-muted-foreground px-2">
              You've completed the 180-day ascension journey
            </div>
          </>
        )}
      </div>

      {/* Header (PRD v2.0) - Better Mobile Spacing */}
      <div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-display break-words mb-2">
            {getUserName() ? `${getGreeting()}, ${getUserName()}! 👋` : `${getGreeting()}! 🌟`}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base break-words">
            {currentPhase === "preparation"
              ? "Prepare for your transformation"
              : (currentPhase === "phase1" || currentPhase === "phase2")
              ? "Continue your ascension journey"
              : "Your transformation awaits"}
          </p>
          {((currentPhase === "phase1" || currentPhase === "phase2") || (currentPhase === "preparation" && currentDay === 0)) && currentDay !== null && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 break-words">{todayDate}</p>
          )}
        </div>
      </div>

      {/* Stats Grid - Better Mobile Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4">
          <LevelBar
            level={globalLevel.level}
            currentXP={globalLevel.currentXP}
            xpToNext={globalLevel.xpToNext}
          />
        </Card>
        <Card className="p-4">
          <StreakIndicator
            currentStreak={streaks.current}
            longestStreak={streaks.longest}
          />
        </Card>
        <StatsWidget
          label="Total XP"
          value={xp.global.toLocaleString()}
          icon={TrendingUp}
        />
        <StatsWidget
          label="Active Journeys"
          value={Object.keys(userProgress).length}
        />
      </div>

      {/* Gamification Info - How to Earn Scores */}
      <GamificationInfo className="w-full" />

      {/* Today's Focus (PRD v2.0) - Better Mobile Layout */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-display break-words">Today's Focus</h2>
          {(currentPhase === "phase1" || currentPhase === "phase2") && todayTasks.length > 0 && (
            <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap shrink-0 px-2.5 py-1 bg-muted/50 rounded-md">
              {todayTasks.filter((t) => t.completed).length} /{" "}
              {todayTasks.length}
            </div>
          )}
        </div>

        {(currentPhase === "phase1" || currentPhase === "phase2") && todayTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-4 sm:p-5 md:p-6 space-y-2.5 sm:space-y-3"
          >
            {todayTasks.map((task, index) => (
              <TaskCardV2
                key={task.id}
                title={task.title}
                xpReward={task.xpReward}
                priority={task.priority}
                journeyId={task.domain}
                completed={task.completed || false}
                onComplete={() => {
                  // Handle task completion
                  console.log("Task completed:", task.id);
                }}
              />
            ))}

            {/* Progress Summary */}
            <div className="pt-4 border-t border-border/50 mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Today's Progress</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 max-w-[200px] bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (todayTasks.filter((t) => t.completed).length /
                            todayTasks.length) *
                          100
                        }%`,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="font-semibold text-foreground tabular-nums">
                    +
                    {todayTasks.reduce(
                      (sum, t) => sum + (t.completed ? t.xpReward : 0),
                      0
                    )}{" "}
                    XP today
                  </span>
                </div>
              </div>
          </div>
          </motion.div>
        )}
        {(currentPhase === "phase1" || currentPhase === "phase2") && todayTasks.length === 0 && (
          <Card className="p-6 text-center bg-muted/30">
            <div className="space-y-2">
              <p className="text-foreground font-medium">
                No session scheduled for today.
              </p>
              <p className="text-sm text-muted-foreground">
                Take this time to rest and recharge. Your next session will be available soon.
              </p>
            </div>
          </Card>
        )}
        {currentPhase === "preparation" && (
          <Card className="p-6">
            <div className="text-center space-y-3">
              <p className="text-lg font-semibold">Preparation Day</p>
              <p className="text-sm text-muted-foreground">
                Use this time to familiarize yourself with the system, review
                your journey plans, and prepare for February 16th.
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Day 0: February 15, 2026 • Journey begins February 16, 2026
              </p>
            </div>
          </Card>
        )}
        {currentPhase === "before" && (
          <Card className="p-6">
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">
                Your Ascension Journey
              </p>
              <p className="text-sm text-muted-foreground">
                Day 0: February 15, 2026 • Journey begins February 16, 2026
              </p>
            </div>
          </Card>
        )}
        {currentPhase === "after" && (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">
              🎉 Congratulations! The 90-day journey has been completed!
            </p>
          </Card>
        )}
      </div>

      {/* Your Journeys (PRD v2.0) - Better Mobile Layout */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-display break-words">Your Journeys</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
          {journeyCards.map((journey, index) => {
            try {
              const journeyData = getJourneyData(journey.id);
              const totalDays = journeyData?.journey?.totalDays || 90;
              
              // Use session-based progress calculation ONLY - no legacy fallback
              // Note: cleanInvalidProgress is called in useEffect to avoid render issues
              const sessionProgress = calculateSessionBasedProgress(journey.id, journeyData?.weeks || []);
              const completedDays = sessionProgress.completedDays || 0;
              const progressPercentage = sessionProgress.percentage || 0;

              // Get journey stats - ensure all start at 0 XP and Level 1
              const journeyXP = (xp.domains && xp.domains[journey.id]) ? xp.domains[journey.id] : 0;
              
              // FORCE Level 1 if XP is 0 or if we're on Day 0 (preparation phase)
              // This ensures all journeys show Level 1 when starting
              const currentDay = getCurrentDayNumber();
              const phase = getCurrentPhaseStatus();
              const isDay0 = currentDay === 0 || currentDay === null || phase === 'preparation';
              const shouldForceLevel1 = journeyXP === 0 || isDay0;
              
              const journeyLevelData = getLevel(journey.id);
              // Force Level 0 if conditions are met (prevents showing incorrect levels from old data)
              const journeyLevel = shouldForceLevel1 
                ? { level: 0, currentXP: 0, xpToNext: 100 } 
                : journeyLevelData;

              return (
                <JourneyCardV2
              key={journey.id}
                  journey={{
                    id: journey.id,
                    title: journey.label,
                    description: journeyData?.journey?.description || "",
                    icon: journey.icon,
                  }}
                  progress={{
                    completed: completedDays,
                    total: totalDays,
                    percentage: progressPercentage,
                  }}
                  stats={{
                    streak: streaks.current,
                    xp: journeyXP,
                    level: journeyLevel.level,
                  }}
                  index={index}
                />
              );
            } catch (error) {
              console.error(`Error loading journey ${journey.id}:`, error);
              return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}
