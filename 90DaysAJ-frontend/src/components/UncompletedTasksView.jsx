import { useState, useEffect } from "react";
import { X, BookOpen, Code, CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";

function UncompletedTasksView({ currentDay, journeyId, onClose, onNavigateToTask }) {
  const [uncompletedTasks, setUncompletedTasks] = useState([]);

  useEffect(() => {
    if (!currentDay || !journeyId) return;

    const tasks = [];

    // Get Deep Learning tasks
    if (currentDay.schedule?.scheduledContent?.deepLearning) {
      currentDay.schedule.scheduledContent.deepLearning.forEach((block) => {
        if (block.content) {
          const lessonKey = block.content.title?.toLowerCase().replace(/\s+/g, "-");
          // Check discipline-specific progress
          const disciplineProgress = JSON.parse(
            localStorage.getItem(`lessonProgress_${journeyId}_${block.discipline}`) || "{}"
          );
          const isCompleted = lessonKey && disciplineProgress[lessonKey];
          
          if (!isCompleted) {
            tasks.push({
              id: `deep_${block.discipline}_${block.content.title}`,
              type: "deep-learning",
              discipline: block.discipline,
              title: block.content.title || "Untitled Lesson",
              time: block.time,
              duration: block.duration,
              content: block.content,
              completed: false
            });
          }
        }
      });
    }

    // Get Daily Quiz
    if (currentDay.dailyQuiz) {
      const quizKey = `quiz_${currentDay.dayNumber}`;
      const savedQuizzes = JSON.parse(
        localStorage.getItem(`dailyQuizzes_${journeyId}`) || "[]"
      );
      const isQuizCompleted = savedQuizzes.some(q => q.day === currentDay.dayNumber);
      
      if (!isQuizCompleted) {
        tasks.push({
          id: `quiz_${currentDay.dayNumber}`,
          type: "quiz",
          discipline: "All Disciplines",
          title: "Daily Cumulative Quiz",
          time: "End of Day",
          duration: "15 minutes",
          description: "Test your understanding of today's concepts",
          completed: false
        });
      }
    }

    // Get Practical Assessment
    if (currentDay.practicalAssessment) {
      const assessmentKey = `assessment_${currentDay.dayNumber}`;
      const savedAssessments = JSON.parse(
        localStorage.getItem(`practicalAssessments_${journeyId}`) || "[]"
      );
      const isAssessmentCompleted = savedAssessments.some(a => a.dayNumber === currentDay.dayNumber);
      
      if (!isAssessmentCompleted) {
        tasks.push({
          id: `assessment_${currentDay.dayNumber}`,
          type: "assessment",
          discipline: "All Disciplines",
          title: "End-of-Day Practical Assessment",
          time: "End of Day",
          duration: "Variable",
          description: "Build a project applying today's learning",
          completed: false
        });
      }
    }

    setUncompletedTasks(tasks);
  }, [currentDay, journeyId]);

  const getDisciplineColor = (discipline) => {
    const colors = {
      Frontend: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      Backend: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      Mobile: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      WordPress: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      "All Disciplines": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
    };
    return colors[discipline] || "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "deep-learning":
        return <BookOpen className="w-5 h-5" />;
      case "quiz":
        return <CheckCircle2 className="w-5 h-5" />;
      case "assessment":
        return <Code className="w-5 h-5" />;
      default:
        return <Circle className="w-5 h-5" />;
    }
  };

  const handleTaskClick = (task) => {
    if (task.type === "quiz") {
      onNavigateToTask(`?day=${currentDay.dayNumber}&section=quiz`);
    } else if (task.type === "assessment") {
      onNavigateToTask(`?day=${currentDay.dayNumber}&section=assessment`);
    } else if (task.type === "deep-learning") {
      // Navigate to the lesson
      onNavigateToTask(`/discipline/${task.discipline.toLowerCase()}`);
    }
    if (onClose) onClose();
  };

  if (uncompletedTasks.length === 0) {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && onClose && onClose()}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black dark:text-black">
              All Tasks Completed! 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg text-gray-700 dark:text-black">
              Great job! You've completed all tasks for today.
            </p>
          </div>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black dark:text-black">
            Uncompleted Tasks - Day {currentDay?.dayNumber || 1}
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-black mt-2">
            {uncompletedTasks.length} task{uncompletedTasks.length !== 1 ? "s" : ""} remaining
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {uncompletedTasks.map((task) => (
            <Card
              key={task.id}
              className="border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => handleTaskClick(task)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-gray-600 dark:text-gray-400">
                        {getTypeIcon(task.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-black dark:text-black mb-1">
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getDisciplineColor(task.discipline)}>
                            {task.discipline}
                          </Badge>
                          {task.time && (
                            <Badge variant="outline" className="gap-1">
                              <Clock className="w-3 h-3" />
                              {task.time}
                            </Badge>
                          )}
                          {task.duration && (
                            <Badge variant="outline">
                              {task.duration}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    {task.description && (
                      <p className="text-sm text-gray-600 dark:text-black mt-2">
                        {task.description}
                      </p>
                    )}
                    {task.content?.topics && (
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                          Topics to cover:
                        </p>
                        <ul className="text-xs text-gray-600 dark:text-black space-y-1">
                          {task.content.topics.slice(0, 3).map((topic, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              <span>{topic}</span>
                            </li>
                          ))}
                          {task.content.topics.length > 3 && (
                            <li className="text-gray-500 italic">
                              +{task.content.topics.length - 3} more topics
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskClick(task);
                    }}
                    className="flex-shrink-0"
                  >
                    <ArrowRight className="w-4 h-4 mr-1" />
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UncompletedTasksView;

