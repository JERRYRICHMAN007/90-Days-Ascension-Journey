import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Coins, Flame, TrendingUp } from "lucide-react";
import { journeys } from "../data/journeyData";
import { calculateProgress } from "../utils/progress";
import DailyMotivation from "./DailyMotivation";
import GamificationSystem from "./GamificationSystem";
import AchievementSystem from "./AchievementSystem";
import { StatsCard } from "./dashboard/StatsCard";
import { JourneyCard } from "./dashboard/JourneyCard";

function Dashboard({ userProgress }) {
  const navigate = useNavigate();
  const startDate = new Date("2026-01-01");
  const endDate = new Date("2026-03-31");
  const today = new Date();

  const { progress, daysElapsed, totalDays } = calculateProgress(
    startDate,
    endDate,
    today
  );

  const getJourneyProgress = (journeyId) => {
    const journeyProgress = userProgress[journeyId] || {};
    const completedDays = Object.values(journeyProgress).filter(Boolean).length;
    const journey = journeys.find((j) => j.id === journeyId);
    const totalJourneyDays = journey?.totalDays || totalDays;
    return {
      completed: completedDays,
      total: totalJourneyDays,
      percentage: Math.round((completedDays / totalJourneyDays) * 100),
    };
  };

  const totalCompleted = journeys.reduce((sum, journey) => {
    const progress = getJourneyProgress(journey.id);
    return sum + progress.completed;
  }, 0);

  // Get gamification stats
  const getGamificationStats = () => {
    try {
      const saved = localStorage.getItem("gamification");
      if (!saved)
        return {
          points: 0,
          coins: 0,
          level: 1,
          streak: 0,
          currentXP: 0,
          xpToNextLevel: 100,
        };
      return JSON.parse(saved);
    } catch (error) {
      console.error(
        "Error parsing gamification stats from localStorage:",
        error
      );
      localStorage.removeItem("gamification");
      return {
        points: 0,
        coins: 0,
        level: 1,
        streak: 0,
        currentXP: 0,
        xpToNextLevel: 100,
      };
    }
  };

  const stats = getGamificationStats();

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            Your Ascension Journey
          </h1>
          <p className="text-muted-foreground text-lg">
            Transform yourself in 90 days across 5 life dimensions
          </p>
          <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">
              Start Date: Sunday, January 4, 2026
            </p>
            <p className="text-base font-semibold text-foreground">
              End Date: Saturday, April 4, 2026
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            icon={Trophy}
            label="Total Points"
            value={stats.points || 0}
            color="from-purple-500 to-pink-500"
            delay={0.1}
          />
          <StatsCard
            icon={Coins}
            label="Gold Coins"
            value={stats.coins || 0}
            color="from-yellow-500 to-orange-500"
            delay={0.2}
          />
          <StatsCard
            icon={TrendingUp}
            label="Current Level"
            value={stats.level || 1}
            color="from-blue-500 to-cyan-500"
            delay={0.3}
            showProgress
            progress={stats.currentXP || 0}
            maxProgress={stats.xpToNextLevel || 100}
          />
          <StatsCard
            icon={Flame}
            label="Day Streak"
            value={stats.streak || 0}
            suffix="days"
            color="from-red-500 to-orange-500"
            delay={0.4}
          />
        </div>

        {/* Daily Motivation */}
        <DailyMotivation journeyId="all" completedDays={totalCompleted} />

        {/* Overall Achievements */}
        <AchievementSystem
          userProgress={userProgress}
          journeyId="all"
          totalDays={90}
        />

        {/* Journeys Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Journeys</h2>
            <span className="text-sm text-muted-foreground">
              {
                journeys.filter((j) => getJourneyProgress(j.id).completed > 0)
                  .length
              }{" "}
              / {journeys.length} Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeys.map((journey, index) => {
              const journeyProgress = getJourneyProgress(journey.id);
              return (
                <JourneyCard
                  key={journey.id}
                  journey={journey}
                  journeyProgress={journeyProgress}
                  index={index}
                />
              );
            })}
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h2 className="text-2xl font-bold">📅 Current Week Overview</h2>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Week {Math.ceil(daysElapsed / 7)}:{" "}
              {getWeekDateRange(Math.ceil(daysElapsed / 7))}
            </h3>
            <p className="text-muted-foreground">
              Foundation Week - Establishing routines and systems
            </p>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }, (_, i) => {
              const dayNumber = (Math.ceil(daysElapsed / 7) - 1) * 7 + i + 1;
              const dayOfWeek = [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun",
              ][i];
              return (
                <div key={i} className="glass-card rounded-lg p-3 text-center">
                  <div className="text-lg font-bold mb-1">{dayNumber}</div>
                  <div className="text-xs text-muted-foreground">
                    {dayOfWeek}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function getWeekDateRange(weekNumber) {
  const startDate = new Date("2026-01-01");
  const weekStart = new Date(startDate);
  weekStart.setDate(startDate.getDate() + (weekNumber - 1) * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateShort = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return `${formatDateShort(weekStart)} - ${formatDateShort(weekEnd)}`;
}

export default Dashboard;
