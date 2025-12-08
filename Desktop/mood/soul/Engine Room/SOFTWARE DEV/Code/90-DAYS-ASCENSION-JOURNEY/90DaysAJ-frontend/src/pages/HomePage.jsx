import { useMemo } from "react";
import { useGamification } from "../hooks/useGamification";
import { LevelBar } from "../components/ui/level-bar";
import { StreakIndicator } from "../components/ui/streak-indicator";
import { StatsWidget } from "../components/ui/stats-widget";
import { TaskCard } from "../components/ui/task-card";
import { Card } from "../components/ui/card";
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
  const { todayDate, todayTasks, journeyHasStarted, journeyHasEnded } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const todayDateStr = today.toISOString().split("T")[0];
    const journeyStartDate = new Date("2025-12-08");
    journeyStartDate.setHours(0, 0, 0, 0);
    const journeyEndDate = new Date("2026-03-08");
    journeyEndDate.setHours(0, 0, 0, 0);

    // Format today's date for display
    const formattedDate = today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Check if journey has started
    const hasStarted = today >= journeyStartDate;
    const hasEnded = today > journeyEndDate;
    const isBeforeStart = today < journeyStartDate;

    const tasks = [];
    
    // Only show tasks if journey has started and not ended
    if (hasStarted && !hasEnded) {
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
              const todayDay = week.days.find((day) => day.date === todayDateStr);
              if (todayDay) {
                // Check journey-specific schedules
                const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
                const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                // Skip if journey doesn't run on this day
                if (journeyId === "body-transformation" && !isWeekday && todayDay.focus === "Rest & Recovery") {
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
                    if (todayDay.focus && todayDay.focus !== "Rest & Recovery") {
                      const workoutText = typeof todayDay.workout === "object" 
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
                      const material = session.material || "Daily reading session";
                      taskTitle = `📚 Reading: ${material.substring(0, 50)}${material.length > 50 ? "..." : ""}`;
                      priority = "normal";
                      xpReward = 15;
                    } else if (todayDay.resources && todayDay.resources.length > 0) {
                      // Fallback to resources if no reading sessions
                      taskTitle = `📚 Reading: ${todayDay.resources[0].title?.substring(0, 50) || "Daily reading"}`;
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
                      }${learningTitle && learningTitle.length > 45 ? "..." : ""}`;
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
      journeyHasStarted: hasStarted,
      isBeforeStart: isBeforeStart,
      journeyHasEnded: hasEnded
    };
  }, []); // Empty dependency array - recalculate only on mount

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome Back! 👋</h1>
          <p className="text-muted-foreground mt-1">
            Continue your ascension journey
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Today's Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Today's Focus</h2>
          <p className="text-sm font-semibold text-primary">{todayDate}</p>
        </div>
        {journeyHasStarted && todayTasks.length > 0 && (
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                xpReward={task.xpReward}
                priority={task.priority}
              />
            ))}
          </div>
        )}
        {journeyHasStarted && todayTasks.length === 0 && (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">
              No tasks scheduled for today. Enjoy your rest day! 🧘
            </p>
          </Card>
        )}
        {!journeyHasStarted && (
          <Card className="p-6">
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">
                Journey starts on Monday, December 8, 2025
              </p>
              <p className="text-sm text-muted-foreground">
                Your daily focus tasks will appear here once the journey begins.
              </p>
            </div>
          </Card>
        )}
        {journeyHasEnded && (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">
              🎉 Congratulations! The 90-day journey has been completed!
            </p>
          </Card>
        )}
      </div>

      {/* Journey Cards */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Journeys</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {journeyCards.map((journey) => (
            <motion.div
              key={journey.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to={`/${journey.id}`}>
                <Card className="p-6 hover:border-primary transition-colors cursor-pointer">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${journey.color} flex items-center justify-center mb-4`}
                  >
                    <journey.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {journey.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {userProgress[journey.id]
                      ? `${
                          Object.keys(userProgress[journey.id]).length
                        } days completed`
                      : "Start your journey"}
                  </p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
