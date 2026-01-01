import { useState, useEffect } from "react";
import { AlertTriangle, Bell, CheckCircle2, X } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import UncompletedTasksView from "./UncompletedTasksView";

function ReminderSystem({ currentDay, journeyId, userProgress, onNavigate }) {
  const [reminders, setReminders] = useState([]);
  const [dismissedReminders, setDismissedReminders] = useState(() => {
    try {
      const saved = localStorage.getItem(`dismissedReminders_${journeyId}`) || "[]";
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });
  const [showUncompletedTasks, setShowUncompletedTasks] = useState(false);

  useEffect(() => {
    const generateReminders = () => {
      const newReminders = [];
      const journeyProgress = userProgress[journeyId] || {};
      const completedDays = Object.values(journeyProgress).filter(Boolean).length;
      const todayCompleted = journeyProgress[currentDay?.dayNumber] || false;

      // Urgent reminders
      if (!todayCompleted && currentDay) {
        // Check for daily quiz
        if (currentDay.dailyQuiz) {
          newReminders.push({
            id: `quiz_${currentDay.dayNumber}`,
            type: "urgent",
            title: "⚠️ Daily Quiz Pending",
            message: "Complete your daily cumulative quiz to test your understanding of today's concepts.",
            action: "Take Quiz",
            actionPath: `?day=${currentDay.dayNumber}&section=quiz`
          });
        }

        // Check for practical assessment
        if (currentDay.practicalAssessment) {
          newReminders.push({
            id: `assessment_${currentDay.dayNumber}`,
            type: "urgent",
            title: "🛠️ Practical Assessment Due",
            message: "Complete your end-of-day practical assessment to apply what you've learned.",
            action: "Start Assessment",
            actionPath: `?day=${currentDay.dayNumber}&section=assessment`
          });
        }

        // Check for incomplete disciplines
        if (currentDay.schedule?.disciplineRotation?.allDisciplines) {
          const disciplines = currentDay.schedule.disciplineRotation.allDisciplines;
          const incompleteDisciplines = disciplines.filter(discipline => {
            // Check if discipline has been started
            const saved = localStorage.getItem(`lessonProgress_${journeyId}_${discipline}`) || "{}";
            const progress = JSON.parse(saved);
            return Object.keys(progress).length === 0;
          });

          if (incompleteDisciplines.length > 0) {
            newReminders.push({
              id: `disciplines_${currentDay.dayNumber}`,
              type: "warning",
              title: "📚 Incomplete Disciplines",
              message: `You haven't started: ${incompleteDisciplines.join(", ")}. Make sure to cover all disciplines today.`,
              action: "View Schedule",
              actionPath: "",
              actionType: "view_schedule"
            });
          }
        }
      }

      // Caution messages
      if (completedDays > 0 && completedDays % 7 === 0) {
        newReminders.push({
          id: `week_review_${Math.floor(completedDays / 7)}`,
          type: "info",
          title: "📊 Week Review Recommended",
          message: "You've completed a full week! Take time to review your progress and plan for next week.",
          action: "Review Progress",
          actionPath: "/progress"
        });
      }

      // Streak warnings
      const lastCompletedDay = Math.max(...Object.keys(journeyProgress).map(Number).filter(d => journeyProgress[d]));
      const daysSinceLastCompletion = currentDay?.dayNumber - lastCompletedDay;
      if (daysSinceLastCompletion > 1 && lastCompletedDay > 0) {
        newReminders.push({
          id: `streak_warning_${currentDay.dayNumber}`,
          type: "warning",
          title: "🔥 Streak at Risk",
          message: `You haven't completed a day in ${daysSinceLastCompletion} days. Get back on track!`,
          action: "Continue Journey",
          actionPath: ""
        });
      }

      // Time-based reminders for software engineering (only for Deep Learning, not Focused Implementation)
      if (journeyId === "software-engineering" && currentDay?.schedule?.timeBlocks) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute;

        // Only include Deep Learning blocks (Focused Implementation is for freelancing/other work)
        const timeBlocks = currentDay.schedule.timeBlocks.deepLearning || [];

        timeBlocks.forEach(block => {
          const [startTime, endTime] = block.time.split("-");
          const [startHour, startMin] = startTime.split(":").map(Number);
          const [endHour, endMin] = endTime.split(":").map(Number);
          const blockStart = startHour * 60 + startMin;
          const blockEnd = endHour * 60 + endMin;

          // Remind 15 minutes before
          if (currentTime >= blockStart - 15 && currentTime < blockStart && !todayCompleted) {
            newReminders.push({
              id: `time_reminder_${block.discipline}_${block.time}`,
              type: "info",
              title: `⏰ ${block.discipline} Deep Learning Session Starting Soon`,
              message: `Your Deep Learning (Study) session for ${block.discipline} starts in 15 minutes at ${block.time}.`,
              action: "View Schedule",
              actionPath: ""
            });
          }
        });
      }

      return newReminders.filter(r => !dismissedReminders.includes(r.id));
    };

    const newReminders = generateReminders();
    setReminders(newReminders);
  }, [currentDay, journeyId, userProgress, dismissedReminders]);

  const dismissReminder = (id) => {
    const updated = [...dismissedReminders, id];
    setDismissedReminders(updated);
    localStorage.setItem(`dismissedReminders_${journeyId}`, JSON.stringify(updated));
    setReminders(reminders.filter(r => r.id !== id));
  };

  if (reminders.length === 0) return null;

  return (
    <>
      {showUncompletedTasks && (
        <UncompletedTasksView
          currentDay={currentDay}
          journeyId={journeyId}
          onClose={() => setShowUncompletedTasks(false)}
          onNavigateToTask={(path) => {
            if (onNavigate) {
              onNavigate(path);
            } else {
              window.location.href = path;
            }
          }}
        />
      )}
      <div className="space-y-3">
        {reminders.map((reminder) => (
        <Card
          key={reminder.id}
          className={`border-2 ${
            reminder.type === "urgent"
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : reminder.type === "warning"
              ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
              : "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {reminder.type === "urgent" ? (
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  ) : (
                    <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  )}
                  <h3 className="font-extrabold text-lg text-black dark:text-black">{reminder.title}</h3>
                </div>
                <p className="text-sm text-black dark:text-black mb-3 font-medium">
                  {reminder.message}
                </p>
                {reminder.action && (
                  <Button
                    size="sm"
                    onClick={() => {
                      if (reminder.actionType === "view_schedule") {
                        setShowUncompletedTasks(true);
                      } else if (reminder.actionPath) {
                        if (onNavigate) {
                          onNavigate(reminder.actionPath);
                        } else {
                          window.location.href = reminder.actionPath;
                        }
                      }
                    }}
                    className={
                      reminder.type === "urgent"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-500 hover:bg-blue-600"
                    }
                  >
                    {reminder.action}
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissReminder(reminder.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      </div>
    </>
  );
}

export default ReminderSystem;

