import { useMemo, useEffect, useState } from "react";
import { useGamification } from "../hooks/useGamification";
import { useAuth } from "../contexts/AuthContext";
import { LevelBar } from "../components/ui/level-bar";
import { StreakIndicator } from "../components/ui/streak-indicator";
import { StatsWidget } from "../components/ui/stats-widget";
import { TaskCardV2 } from "../components/ui/task-card-v2";
import { Card } from "../components/ui/card";
import { GamificationInfo } from "../components/GamificationInfo";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { getJourneyData } from "../data/journeys/index.js";
import {
  getCurrentPhaseStatus,
  getCurrentDayNumber,
  formatDayNumber,
  getDaysRemaining,
} from "../utils/dates";
import { calculateSessionBasedProgress, cleanInvalidProgress, resetAllProgress } from "../utils/progressTracking";
import { STORAGE_KEYS } from "../utils/storageKeys.js";
import { UnifiedJourneyCard } from "../components/dashboard/UnifiedJourneyCard";
import { JourneyTraceCard } from "../components/dashboard/JourneyTraceCard";
import { getJourneyCardsConfig } from "../utils/journeyTheme.js";
import { GlassStatCard } from "../components/ui/glass-stat-card";
import { CelebrationOverlay, showXpFloat } from "../components/ui/celebration";
import { staggerContainer } from "../lib/motion.js";
import { getJourneyTrace } from "../utils/tracing";

const journeyCards = getJourneyCardsConfig();

function hasMeaningfulXp(storedXp) {
  if (!storedXp) return false;
  try {
    const xpData = JSON.parse(storedXp);
    if ((xpData.global || 0) > 0) return true;
    return Object.values(xpData.domains || {}).some((v) => Number(v) > 0);
  } catch {
    return true;
  }
}

function hasMeaningfulCompletions(stored) {
  if (!stored || stored === '{}' || stored === 'null') return false;
  try {
    const parsed = JSON.parse(stored);
    return Object.values(parsed).some((entry) => entry?.completed === true);
  } catch {
    return true;
  }
}

export function HomePage() {
  const { user } = useAuth();
  const { xp, streaks, getLevel } = useGamification();
  const globalLevel = getLevel();
  const [progressTick, setProgressTick] = useState(0);
  const [celebrateTick, setCelebrateTick] = useState(0);

  useEffect(() => {
    const handleProgressUpdate = () => setProgressTick((t) => t + 1);
    window.addEventListener('progress-updated', handleProgressUpdate);
    window.addEventListener('session-completed', handleProgressUpdate);
    return () => {
      window.removeEventListener('progress-updated', handleProgressUpdate);
      window.removeEventListener('session-completed', handleProgressUpdate);
    };
  }, []);

  const activeJourneyCount = useMemo(() => {
    void progressTick;
    return journeyCards.filter(({ id }) => {
      const { weeks } = getJourneyData(id);
      const progress = calculateSessionBasedProgress(id, weeks);
      return progress.completedDays > 0;
    }).length;
  }, [progressTick]);
  
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
  
  // Clean invalid progress once on mount; optional Day 0 reset (once only, no reload loop)
  useEffect(() => {
    const currentDay = getCurrentDayNumber();
    const phase = getCurrentPhaseStatus();
    const forceReset = localStorage.getItem('force_reset_all') === 'true';
    const alreadyReset = localStorage.getItem('day0_reset_completed') === 'true';

    if ((currentDay === 0 || phase === 'preparation' || forceReset) && (!alreadyReset || forceReset)) {
      const storedXp = localStorage.getItem(STORAGE_KEYS.XP);
      const storedCompletions = localStorage.getItem('sessionCompletions');
      const shouldReset =
        forceReset ||
        hasMeaningfulXp(storedXp) ||
        hasMeaningfulCompletions(storedCompletions);

      if (shouldReset) {
        console.log('🔄 Resetting progress for preparation day (one-time)');
        resetAllProgress();
        localStorage.setItem('day0_reset_completed', 'true');
        localStorage.removeItem('force_reset_all');
      }
    } else if (phase !== 'preparation' && currentDay !== 0) {
      localStorage.removeItem('day0_reset_completed');
      localStorage.removeItem('force_reset_all');
    }

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
  }, []);

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
    const journeyProgress = Math.round(
      journeyCards.reduce(
        (sum, j) => sum + (getJourneyTrace(j.id).completion?.percentComplete || 0),
        0
      ) / Math.max(journeyCards.length, 1)
    );
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
                const dayOfWeek = today.getDay();
                const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
                if (journeyId === "reading" && dayOfWeek === 5) {
                  continue;
                }
                if (journeyId === "writers" && dayOfWeek === 5) {
                  continue;
                }

                // Extract task based on journey type
                let taskTitle = "";
                let priority = "normal";
                let xpReward = 20;

                switch (journeyId) {
                  case "body-transformation":
                    if (todayDay.focus) {
                      const workoutText =
                        typeof todayDay.workout === "object"
                          ? todayDay.workout.name || "Complete workout"
                          : todayDay.workout || "Complete workout";
                      if (todayDay.focus === "Rest & Recovery") {
                        taskTitle = `💪 ${todayDay.focus} — ${workoutText}`;
                        priority = "normal";
                        xpReward = 10;
                      } else {
                        taskTitle = `💪 ${todayDay.focus} — ${workoutText}`;
                        priority = "high";
                        xpReward = 25;
                      }
                    }
                    break;
                  case "reading":
                    if (
                      todayDay.readingSessions &&
                      todayDay.readingSessions.length > 0
                    ) {
                      const session = todayDay.readingSessions[0];
                      const rawMaterial = session.material;
                      const material =
                        typeof rawMaterial === "object" && rawMaterial !== null
                          ? rawMaterial.text || "Daily reading session"
                          : rawMaterial || "Daily reading session";
                      const materialStr = String(material);
                      taskTitle = `📚 Reading: ${materialStr.substring(0, 50)}${
                        materialStr.length > 50 ? "..." : ""
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
      <CelebrationOverlay trigger={celebrateTick} />
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
              Your Forge90 Journey
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground px-2">
              Day 0: June 30, 2026 • Start: July 1, 2026
            </div>
          </>
        )}
        {currentPhase === "after" && (
          <>
            <div className="text-lg sm:text-xl md:text-2xl font-bold px-2">🎉 Journey Complete</div>
            <div className="text-xs sm:text-sm text-muted-foreground px-2">
              You've completed the 180-day Forge90 journey
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
              ? "Continue your Forge90 journey"
              : "Your transformation awaits"}
          </p>
          {((currentPhase === "phase1" || currentPhase === "phase2") || (currentPhase === "preparation" && currentDay === 0)) && currentDay !== null && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 break-words">{todayDate}</p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4"
      >
        <GlassStatCard>
          <LevelBar
            level={globalLevel.level}
            currentXP={globalLevel.currentXP}
            xpToNext={globalLevel.xpToNext}
          />
        </GlassStatCard>
        <GlassStatCard>
          <StreakIndicator
            currentStreak={Number(streaks.current) || 0}
            longestStreak={Number(streaks.longest) || 0}
          />
        </GlassStatCard>
        <GlassStatCard className="col-span-2 lg:col-span-1">
          <StatsWidget
            label="Total XP"
            value={(Number(xp.global) || 0).toLocaleString()}
            icon={TrendingUp}
          />
        </GlassStatCard>
        <GlassStatCard className="col-span-2 lg:col-span-1">
          <StatsWidget
            label="Active Journeys"
            value={activeJourneyCount}
          />
        </GlassStatCard>
      </motion.div>

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
                onComplete={(e) => {
                  setCelebrateTick((t) => t + 1);
                  showXpFloat(e?.currentTarget, `+${task.xpReward} XP`);
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
                your journey plans, and prepare for July 1st.
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Day 0: June 30, 2026 • Journey begins July 1, 2026
              </p>
            </div>
          </Card>
        )}
        {currentPhase === "before" && (
          <Card className="p-6">
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">
                Your Forge90 Journey
              </p>
              <p className="text-sm text-muted-foreground">
                Day 0: June 30, 2026 • Journey begins July 1, 2026
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

      {/* Journey progress trace cards */}
      <div>
        <h2 className="text-xs font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-4">
          Your Progress
        </h2>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full min-w-0"
        >
          {journeyCards.map((journey, index) => (
            <JourneyTraceCard key={journey.id} journeyId={journey.id} index={index} />
          ))}
        </motion.div>
      </div>

      {/* Unified journey grid */}
      <div>
        <h2 className="text-xs font-bold tracking-widest uppercase text-[var(--text-secondary)] mb-4 mt-8">
          Your Journeys
        </h2>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 items-stretch min-w-0"
        >
          {journeyCards.map((journey) => {
            try {
              const journeyData = getJourneyData(journey.id);
              const totalDays = journeyData?.journey?.totalDays || 90;
              const sessionProgress = calculateSessionBasedProgress(journey.id, journeyData?.weeks || []);
              const completedDays = sessionProgress.completedDays || 0;
              const progressPercentage = sessionProgress.percentage || 0;
              const journeyXP = (xp.domains && xp.domains[journey.id]) ? xp.domains[journey.id] : 0;
              const currentDay = getCurrentDayNumber();
              const phase = getCurrentPhaseStatus();
              const isDay0 = currentDay === 0 || currentDay === null || phase === 'preparation';
              const shouldForceLevel1 = journeyXP === 0 || isDay0;
              const journeyLevelData = getLevel(journey.id);
              const journeyLevel = shouldForceLevel1
                ? { level: 0, currentXP: 0, xpToNext: 100 }
                : journeyLevelData;

              return (
                <UnifiedJourneyCard
                  key={journey.id}
                  journeyId={journey.id}
                  title={journey.label}
                  description={journeyData?.journey?.description || ""}
                  progress={{
                    completed: completedDays,
                    total: totalDays,
                    percentage: progressPercentage,
                  }}
                  stats={{
                    streak: Number(streaks.current) || 0,
                    xp: journeyXP,
                    level: journeyLevel.level,
                  }}
                />
              );
            } catch (error) {
              console.error(`Error loading journey ${journey.id}:`, error);
              return null;
            }
          })}
        </motion.div>
      </div>
    </div>
  );
}
