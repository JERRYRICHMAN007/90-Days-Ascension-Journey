import { useMemo } from "react";
import { useGamification } from "../hooks/useGamification";
import { LevelBar } from "../components/ui/level-bar";
import { StreakIndicator } from "../components/ui/streak-indicator";
import { StatsWidget } from "../components/ui/stats-widget";
import { TaskCard } from "../components/ui/task-card";
import { TaskCardV2 } from "../components/ui/task-card-v2";
import { Card } from "../components/ui/card";
import { JourneyCardV2 } from "../components/dashboard/JourneyCardV2";
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
  getCurrentPhase,
  getCurrentDayNumber,
  formatDayNumber,
  getJourneyProgress,
  getDaysRemaining,
} from "../utils/dates";

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
  const { xp, streaks, getLevel } = useGamification();
  const globalLevel = getLevel();

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
    const phase = getCurrentPhase();
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

    // Only show tasks if in ascension phase
    if (phase === "ascension" && dayNumber) {
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
              // Find day by date or by day number (for ascension phase)
              const todayDay = week.days.find((day) => {
                // Match by date if available
                if (day.date === todayDateStr) return true;
                // Match by day number if in ascension phase
                if (
                  phase === "ascension" &&
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
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Section - Day Number */}
      <div className="text-center space-y-2 py-4 sm:py-6 border-b px-4">
        {currentPhase === "preparation" && currentDay === 0 && (
          <>
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {formatDayNumber(currentDay)}
            </div>
            <div className="text-base sm:text-lg text-muted-foreground">
              {daysRemaining} days remaining • Journey starts tomorrow
            </div>
            <div className="text-xs sm:text-sm font-medium text-foreground mt-2">
              "Preparation is the foundation of success"
            </div>
          </>
        )}
        {currentPhase === "preparation" && currentDay !== 0 && (
          <>
            <div className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Preparation Phase
            </div>
            <div className="text-xl sm:text-2xl font-bold text-muted-foreground">
              Getting Ready for Your Ascension
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Your journey begins January 1, 2026
            </div>
          </>
        )}
        {currentPhase === "ascension" && currentDay && currentDay > 0 && (
          <>
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {formatDayNumber(currentDay)}
            </div>
            <div className="text-base sm:text-lg text-muted-foreground">
              {progress}% Complete • {daysRemaining} days remaining
            </div>
            <div className="text-xs sm:text-sm font-medium text-foreground mt-2">
              "Discipline compounds daily"
            </div>
          </>
        )}
        {currentPhase === "before" && (
          <>
            <div className="text-xl sm:text-2xl font-bold text-muted-foreground">
              Your Ascension Journey
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Official start: January 1, 2026
            </div>
          </>
        )}
        {currentPhase === "after" && (
          <>
            <div className="text-xl sm:text-2xl font-bold">🎉 Journey Complete</div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              You've completed the 90-day ascension journey
            </div>
          </>
        )}
      </div>

      {/* Header (PRD v2.0) */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-display">Good morning! 🌟</h1>
          <p className="text-muted-foreground mt-1 text-base sm:text-lg">
            {currentPhase === "ascension"
              ? "Continue your ascension journey"
              : currentPhase === "preparation"
              ? "Prepare for your transformation"
              : "Your transformation awaits"}
          </p>
          {(currentPhase === "ascension" || (currentPhase === "preparation" && currentDay === 0)) && currentDay !== null && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{todayDate}</p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4">
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

      {/* Today's Focus (PRD v2.0) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-display">Today's Focus</h2>
          {currentPhase === "ascension" && todayTasks.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {todayTasks.filter((t) => t.completed).length} /{" "}
              {todayTasks.length} complete
            </div>
          )}
        </div>

        {currentPhase === "ascension" && todayTasks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-6 space-y-3"
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
        {currentPhase === "ascension" && todayTasks.length === 0 && (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">
              No tasks scheduled for today. Enjoy your rest day! 🧘
            </p>
          </Card>
        )}
        {currentPhase === "preparation" && (
          <Card className="p-6">
            <div className="text-center space-y-3">
              <p className="text-lg font-semibold">Preparation Phase</p>
              <p className="text-sm text-muted-foreground">
                Use this time to familiarize yourself with the system, review
                your journey plans, and prepare for January 1st.
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Your ascension journey begins January 1, 2026
              </p>
            </div>
          </Card>
        )}
        {currentPhase === "before" && (
          <Card className="p-6">
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">
                Official start: January 1, 2026
              </p>
              <p className="text-sm text-muted-foreground">
                Your ascension journey will begin January 1, 2026
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

      {/* Your Journeys (PRD v2.0) */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-display">Your Journeys</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {journeyCards.map((journey, index) => {
            const journeyProgress = userProgress[journey.id] || {};
            const completedDays =
              Object.values(journeyProgress).filter(Boolean).length;
            const journeyData = getJourneyData(journey.id);
            const totalDays = journeyData?.journey?.totalDays || 90;
            const progressPercentage = Math.round(
              (completedDays / totalDays) * 100
            );

            // Get journey stats
            const journeyXP = xp.domains[journey.id] || 0;
            const journeyLevel = getLevel(journey.id);

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
          })}
        </div>
      </div>
    </div>
  );
}
