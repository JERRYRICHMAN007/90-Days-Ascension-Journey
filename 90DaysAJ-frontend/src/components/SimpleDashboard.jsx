import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Code, Server, Smartphone, Globe, Play, BookOpen, Target, TrendingUp } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import GamificationSystem from "./GamificationSystem";
import AchievementSystem from "./AchievementSystem";
import DailyMotivation from "./DailyMotivation";
import TimeBlockDisplay from "./TimeBlockDisplay";
import ReminderSystem from "./ReminderSystem";
import FocusedImplementationTasks from "./FocusedImplementationTasks";

function SimpleDashboard({ currentDay, userProgress, journeyId = "software-engineering" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showFocusedTasks, setShowFocusedTasks] = useState(false);

  // Calculate actual progress from userProgress
  const journeyProgress = userProgress[journeyId] || {};
  const completedDays = Object.values(journeyProgress).filter(Boolean).length;
  
  // Calculate today's progress based on completed disciplines
  const todayDisciplines = currentDay?.schedule?.disciplineRotation?.allDisciplines || [];
  const todayProgress = todayDisciplines.length > 0 
    ? Math.round((completedDays / Math.max(todayDisciplines.length, 1)) * 100)
    : 0;

  // Calculate discipline-specific progress
  const getDisciplineProgress = (disciplineId) => {
    // Check if any lessons for this discipline have been completed
    // For now, we'll track by checking if the day is marked complete
    // In a full implementation, you'd track individual lesson completion
    const disciplineLessons = currentDay?.schedule?.scheduledContent?.deepLearning
      ?.filter(b => b.discipline === disciplineId) || [];
    
    // If no lessons exist, return 0
    if (disciplineLessons.length === 0) return 0;
    
    // For now, return 0 until lessons are actually completed
    // This will be updated when lesson completion is tracked
    return 0;
  };

  const disciplines = [
    { 
      id: "Frontend", 
      label: "Frontend", 
      icon: Code, 
      color: "bg-blue-500", 
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
      description: "Build beautiful websites"
    },
    { 
      id: "Backend", 
      label: "Backend", 
      icon: Server, 
      color: "bg-green-500",
      lightColor: "bg-green-50",
      textColor: "text-green-600",
      description: "Create powerful servers"
    },
    { 
      id: "Mobile", 
      label: "Mobile", 
      icon: Smartphone, 
      color: "bg-orange-500",
      lightColor: "bg-orange-50",
      textColor: "text-orange-600",
      description: "Build mobile apps"
    },
    { 
      id: "WordPress", 
      label: "WordPress", 
      icon: Globe, 
      color: "bg-purple-500",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
      description: "Create websites easily"
    },
  ];

  // Get total days for the journey (90 days for software engineering)
  const totalDays = 90;

  return (
    <div className="simple-dashboard min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Daily Motivation Quote - Software Engineering Tailored */}
        <Card className="border-2 border-indigo-200 shadow-lg bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <CardContent className="p-6">
            <DailyMotivation
              journeyId={journeyId}
              completedDays={completedDays}
            />
          </CardContent>
        </Card>

        {/* Gamification System - Points, Coins, Level, Streak */}
        <Card className="border-2 border-purple-200 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <GamificationSystem
              userProgress={userProgress}
              journeyId={journeyId}
              totalDays={totalDays}
              completedDays={completedDays}
            />
          </CardContent>
        </Card>

        {/* Achievements & Badges */}
        <Card className="border-2 border-yellow-200 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <AchievementSystem
              userProgress={userProgress}
              journeyId={journeyId}
              totalDays={totalDays}
            />
          </CardContent>
        </Card>

        {/* Reminders & Alerts */}
        {journeyId === "software-engineering" && (
          <ReminderSystem
            currentDay={currentDay}
            journeyId={journeyId}
            userProgress={userProgress}
            onNavigate={(path) => {
              if (path.startsWith("?")) {
                // Query parameter navigation
                navigate(`${location.pathname}${path}`);
              } else {
                // Full path navigation
                navigate(path);
              }
            }}
          />
        )}

        {/* Focused Implementation Tasks Quick Access */}
        {journeyId === "software-engineering" && currentDay?.schedule && (
          <Card className="border-2 border-green-200 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:border-green-800 dark:from-green-900/30 dark:to-emerald-900/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2 text-black dark:text-black">
                    🛠️ Focused Implementation Tasks
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-black">
                    Manage your freelancing and work tasks for today's implementation blocks. All tasks are saved to your local database.
                  </p>
                </div>
                <Button
                  onClick={() => setShowFocusedTasks(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Manage Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Blocks Display - Software Engineering */}
        {journeyId === "software-engineering" && currentDay?.schedule && (
          <>
            <TimeBlockDisplay
              schedule={currentDay.schedule}
              dayName={currentDay.dayName}
              currentDay={currentDay}
              journeyId={journeyId}
              onManageTasks={() => setShowFocusedTasks(true)}
            />
            {showFocusedTasks && (
              <FocusedImplementationTasks
                currentDay={currentDay}
                journeyId={journeyId}
                onClose={() => setShowFocusedTasks(false)}
              />
            )}
          </>
        )}

        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-black">
            Welcome Back! 👋
          </h1>
          <p className="text-xl text-gray-600 dark:text-black">
            Day {currentDay?.dayNumber || 1} of your learning journey
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-black">
            <Target className="w-5 h-5" />
            <span>Today's Goal: Learn all 4 disciplines</span>
          </div>
        </div>

        {/* Today's Progress Card */}
        <Card className="border-2 border-blue-200 shadow-lg dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Today's Progress</h2>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <TrendingUp className="w-6 h-6" />
                <span className="text-lg font-semibold">{todayProgress}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${todayProgress}%` }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {todayDisciplines.length > 0 ? (
                todayDisciplines.map((disc, idx) => {
                  const discipline = disciplines.find(d => d.id === disc);
                  if (!discipline) return null;
                  // Only show checkmark if discipline is actually completed
                  const isCompleted = false; // Will be updated when lesson completion is tracked
                  return (
                    <span
                      key={idx}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${discipline.lightColor} ${discipline.textColor}`}
                    >
                      {isCompleted ? "✓ " : ""}{disc}
                    </span>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">No disciplines scheduled for today</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Learning Cards - Large and Visual */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {disciplines.map((discipline) => {
            const Icon = discipline.icon;
            const isToday = todayDisciplines.includes(discipline.id);
            
            return (
              <Card
                key={discipline.id}
                className={`relative overflow-hidden border-4 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                  isToday ? "border-blue-500 shadow-xl" : "border-gray-200"
                }`}
                onClick={() => navigate(`/discipline/${discipline.id.toLowerCase()}`)}
              >
                {/* Decorative Background */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${discipline.color} opacity-10 rounded-bl-full`} />
                
                <CardContent className="p-8 relative">
                  <div className="space-y-6">
                    {/* Icon and Title */}
                    <div className="flex items-center gap-4">
                      <div className={`${discipline.color} p-4 rounded-2xl shadow-lg`}>
                        <Icon className="w-12 h-12 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {discipline.label}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          {discipline.description}
                        </p>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Your Progress</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {getDisciplineProgress(discipline.id)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`${discipline.color} h-3 rounded-full transition-all`}
                          style={{ width: `${getDisciplineProgress(discipline.id)}%` }}
                        />
                      </div>
                      {getDisciplineProgress(discipline.id) === 0 && (
                        <p className="text-xs text-gray-500 italic">
                          Start learning to see your progress!
                        </p>
                      )}
                    </div>

                    {/* Big Start Button */}
                    <Button
                      size="lg"
                      className={`w-full ${discipline.color} hover:opacity-90 text-white text-lg py-6 font-bold shadow-lg`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/discipline/${discipline.id.toLowerCase()}`);
                      }}
                    >
                      <Play className="w-6 h-6 mr-2" />
                      Start Learning {discipline.label}
                    </Button>

                    {/* Quick Info */}
                    {isToday && (
                      <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                        <Target className="w-4 h-4" />
                        <span className="font-medium">Scheduled for today</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-gray-200 hover:border-blue-300 transition-all cursor-pointer" onClick={() => navigate('/reflections')}>
            <CardContent className="p-6 text-center">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-blue-500 dark:text-blue-400" />
              <h3 className="font-bold text-lg mb-2 dark:text-white">Daily Reflection</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Review your day</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 hover:border-green-300 transition-all cursor-pointer" onClick={() => navigate('/progress')}>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-10 h-10 mx-auto mb-3 text-green-500 dark:text-green-400" />
              <h3 className="font-bold text-lg mb-2 dark:text-white">View Progress</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">See your journey</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 hover:border-purple-300 transition-all cursor-pointer" onClick={() => navigate('/achievements')}>
            <CardContent className="p-6 text-center">
              <Target className="w-10 h-10 mx-auto mb-3 text-purple-500 dark:text-purple-400" />
              <h3 className="font-bold text-lg mb-2 dark:text-white">Achievements</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Your badges</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Quiz & Assessment Cards */}
        {currentDay?.dailyQuiz && (
          <Card className="border-4 border-purple-500 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2 dark:text-white">🧠 Daily Cumulative Quiz</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Test your understanding of all concepts learned today
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{currentDay.dailyQuiz.totalQuestions} Questions</span>
                    <span>•</span>
                    <span>{currentDay.dailyQuiz.timeLimit} Minutes</span>
                    <span>•</span>
                    <span>Need {currentDay.dailyQuiz.passingScore} to Pass</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  onClick={() => {
                    const currentPath = window.location.pathname;
                    navigate(`${currentPath}?day=${currentDay.dayNumber}&section=quiz`);
                  }}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-6 text-lg font-bold"
                >
                  Take Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {currentDay?.practicalAssessment && (
          <Card className="border-4 border-orange-500 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2 dark:text-white">🛠️ End-of-Day Practical Assessment</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Build a project that combines today's learning with previous days' work
                  </p>
                  {currentDay.practicalAssessment.cumulative && (
                    <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-3 py-1 rounded-full w-fit">
                      <span>📈</span>
                      <span className="font-semibold">Cumulative - Builds on {currentDay.practicalAssessment.previousProjects?.length || 0} previous projects</span>
                    </div>
                  )}
                </div>
                <Button
                  size="lg"
                  onClick={() => {
                    const currentPath = window.location.pathname;
                    navigate(`${currentPath}?day=${currentDay.dayNumber}&section=assessment`);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg font-bold"
                >
                  Start Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Helpful Tip */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 dark:bg-gradient-to-r dark:from-blue-50 dark:to-purple-50 dark:border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <h3 className="font-bold text-lg mb-2 dark:text-black">Tip of the Day</h3>
                <p className="text-gray-700 dark:text-black">
                  Complete the daily quiz to test your knowledge, then build the practical assessment 
                  to put everything into practice. Each day builds on the previous one! 🚀
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SimpleDashboard;

