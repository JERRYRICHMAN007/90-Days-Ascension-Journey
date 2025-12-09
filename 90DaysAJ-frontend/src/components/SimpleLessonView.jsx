import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Circle, 
  Play, 
  Pause, 
  BookOpen,
  Clock,
  Lightbulb,
  ExternalLink,
  HelpCircle
} from "lucide-react";
import ResourcesModal from "./ResourcesModal";
import Quiz from "./Quiz";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

function SimpleLessonView({ lesson, lessonIndex, totalLessons, onNext, onPrevious, onComplete, journeyId = "software-engineering", discipline, currentDay, skillName, lessonKey, isCurrentLessonCompleted }) {
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showResources, setShowResources] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleStep = (index) => {
    setCompletedSteps(prev => {
      const newSteps = prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index].sort((a, b) => a - b); // Sort to maintain order
      
      // Save immediately when toggling
      if (lessonKey && discipline && journeyId) {
        try {
          const saved = localStorage.getItem(`lessonProgress_${journeyId}_${discipline}`) || "{}";
          const lessonProgress = JSON.parse(saved);
          lessonProgress[lessonKey] = {
            ...lessonProgress[lessonKey],
            completedSteps: newSteps,
            timeElapsed: timeElapsed,
            lastUpdated: new Date().toISOString()
          };
          localStorage.setItem(`lessonProgress_${journeyId}_${discipline}`, JSON.stringify(lessonProgress));
        } catch (error) {
          console.error("Error saving lesson progress:", error);
        }
      }
      
      return newSteps;
    });
  };

  const topics = lesson?.topics || [];
  const allStepsCompleted = completedSteps.length === topics.length;

  // Load saved progress when component mounts
  useEffect(() => {
    if (lessonKey && discipline && journeyId) {
      try {
        const saved = localStorage.getItem(`lessonProgress_${journeyId}_${discipline}`) || "{}";
        const lessonProgress = JSON.parse(saved);
        const savedProgress = lessonProgress[lessonKey];
        
        // Handle both object format (with progress data) and boolean format (just marked complete)
        if (savedProgress) {
          if (typeof savedProgress === 'object' && savedProgress.completedSteps) {
            // New format: object with detailed progress
            const savedSteps = Array.isArray(savedProgress.completedSteps) ? savedProgress.completedSteps : [];
            // Always set the saved steps, even if empty (to preserve state)
            setCompletedSteps(savedSteps);
            if (savedProgress.timeElapsed) {
              setTimeElapsed(savedProgress.timeElapsed);
            }
            // Auto-start lesson if there's progress
            if (savedSteps.length > 0) {
              setIsStarted(true);
            }
          } else if (savedProgress === true) {
            // Old format: just marked as complete, reset steps to allow re-learning
            setCompletedSteps([]);
          }
        }
      } catch (error) {
        console.error("Error loading lesson progress:", error);
      }
    }
  }, [lessonKey, discipline, journeyId]);

  // Track if we've loaded initial progress to avoid overwriting on mount
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Save progress whenever completedSteps or timeElapsed changes (skip initial load)
  useEffect(() => {
    // Skip saving on initial mount - progress is already saved in toggleStep
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }
    
    // Only save if we have valid data and it's not the initial load
    if (lessonKey && discipline && journeyId) {
      try {
        const saved = localStorage.getItem(`lessonProgress_${journeyId}_${discipline}`) || "{}";
        const lessonProgress = JSON.parse(saved);
        lessonProgress[lessonKey] = {
          ...(lessonProgress[lessonKey] || {}),
          completedSteps: completedSteps,
          timeElapsed: timeElapsed,
          lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(`lessonProgress_${journeyId}_${discipline}`, JSON.stringify(lessonProgress));
      } catch (error) {
        console.error("Error saving lesson progress:", error);
      }
    }
  }, [completedSteps, timeElapsed, lessonKey, discipline, journeyId, isInitialLoad]);

  // Scroll to last checked box when lesson loads with progress
  useEffect(() => {
    if (isStarted && completedSteps.length > 0) {
      // Wait for DOM to render, then scroll to the step after the last completed one
      setTimeout(() => {
        const lastCompletedIndex = Math.max(...completedSteps);
        const nextStepIndex = lastCompletedIndex + 1;
        const targetElement = document.getElementById(`lesson-step-${nextStepIndex}`);
        const fallbackElement = document.getElementById(`lesson-step-${lastCompletedIndex}`);
        const elementToScroll = targetElement || fallbackElement;
        
        if (elementToScroll) {
          elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight the target step briefly
          elementToScroll.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
          setTimeout(() => {
            elementToScroll.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2');
          }, 2000);
        }
      }, 500);
    }
  }, [isStarted, completedSteps]);

  return (
    <div className="simple-lesson-view min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="lg"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Navigate back to the roadmap page
              if (discipline) {
                const disciplineMap = {
                  "Frontend": "frontend",
                  "Backend": "backend",
                  "Mobile": "mobile",
                  "WordPress": "wordpress"
                };
                const disciplineSlug = disciplineMap[discipline] || discipline.toLowerCase();
                navigate(`/discipline/${disciplineSlug}`, { replace: true });
              } else {
                navigate(-1);
              }
            }}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden md:inline">Go Back</span>
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {lesson?.title || "Learning Lesson"}
            </h1>
            <p className="text-gray-600 mt-2">
              Lesson {lessonIndex + 1} of {totalLessons}
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="border-2 border-blue-200 shadow-lg bg-gray-900 dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-white">Your Progress</span>
              <span className="text-2xl font-bold text-blue-600">
                {Math.round((completedSteps.length / Math.max(topics.length, 1)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(completedSteps.length / Math.max(topics.length, 1)) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Timer Card */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Time Spent</p>
                  <p className="text-3xl font-bold text-gray-900">{formatTime(timeElapsed)}</p>
                </div>
              </div>
              <Button
                size="lg"
                onClick={() => setTimerRunning(!timerRunning)}
                className={timerRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Timer
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Start Learning Button */}
        {!isStarted && (
          <Card className="border-4 border-blue-500 shadow-2xl bg-gray-900 dark:bg-gray-800">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-20 h-20 mx-auto mb-6 text-blue-500" />
              <h2 className="text-3xl font-bold mb-4 text-white">Ready to Learn?</h2>
              <p className="text-lg text-gray-300 mb-6">
                Click the button below to start this lesson. Take your time and learn at your own pace!
              </p>
              <Button
                size="lg"
                onClick={() => setIsStarted(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-xl px-12 py-6 font-bold shadow-lg"
              >
                <Play className="w-6 h-6 mr-3" />
                Start Learning Now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Lesson Content */}
        {isStarted && (
          <div className="space-y-4">
            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">What You'll Learn</h3>
                    <p className="text-gray-700">
                      Follow these steps one by one. Check them off as you complete each one!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Steps */}
            {topics.map((topic, index) => {
              const isCompleted = completedSteps.includes(index);
              return (
                <Card
                  key={index}
                  id={`lesson-step-${index}`}
                  className={`border-2 transition-all cursor-pointer hover:shadow-lg ${
                    isCompleted 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-200 bg-white"
                  }`}
                  onClick={() => toggleStep(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {isCompleted ? (
                          <CheckCircle2 className="w-8 h-8 text-green-600" />
                        ) : (
                          <Circle className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-bold text-gray-400">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <h3 className={`text-xl font-semibold ${
                            isCompleted ? "text-green-700 line-through" : "text-gray-900"
                          }`}>
                            {topic}
                          </h3>
                        </div>
                        {isCompleted && (
                          <p className="text-green-600 font-medium">✓ Completed!</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

          {/* Resources and Quiz Section */}
          {isStarted && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {lesson?.resources && lesson.resources.length > 0 && (
                <Card className="border-2 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <ExternalLink className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-bold">Learning Resources</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Access videos, documentation, and tutorials for this lesson
                    </p>
                    <Button
                      onClick={() => setShowResources(true)}
                      className="w-full bg-blue-500 hover:bg-blue-600"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Resources ({lesson.resources.length})
                    </Button>
                  </CardContent>
                </Card>
              )}

              {lesson?.quiz && lesson.quiz.length > 0 && (
                <Card className="border-2 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <HelpCircle className="w-6 h-6 text-purple-600" />
                      <h3 className="text-xl font-bold">Test Your Knowledge</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Take a quiz to reinforce what you've learned
                    </p>
                    <Button
                      onClick={() => setShowQuiz(true)}
                      className="w-full bg-purple-500 hover:bg-purple-600"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Start Quiz ({lesson.quiz.length} questions)
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Completion Card */}
          {isStarted && allStepsCompleted && (
          <Card className="border-4 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-2xl">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="w-24 h-24 mx-auto mb-6 text-green-600" />
              <h2 className="text-4xl font-bold mb-4 text-gray-900">🎉 Congratulations!</h2>
              <p className="text-xl text-gray-700 mb-6">
                You've completed all the steps in this lesson!
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={onPrevious}
                  disabled={lessonIndex === 0}
                  className="text-lg px-8 py-6"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Previous Lesson
                </Button>
                <Button
                  size="lg"
                  onClick={() => {
                    // Save lesson completion to localStorage
                    if (lessonKey && discipline) {
                      try {
                        const saved = localStorage.getItem(`lessonProgress_${journeyId}_${discipline}`) || "{}";
                        const lessonProgress = JSON.parse(saved);
                        // Mark lesson as completed using the lessonKey (skill name)
                        // Preserve the progress data and add completion flag
                        lessonProgress[lessonKey] = {
                          ...lessonProgress[lessonKey],
                          completed: true,
                          completedAt: new Date().toISOString(),
                          completedSteps: completedSteps,
                          allStepsCompleted: true
                        };
                        lessonProgress[`lesson_${lessonIndex}`] = {
                          completed: true,
                          completedAt: new Date().toISOString(),
                          title: lesson?.title || skillName,
                          skillName: skillName,
                          completedSteps: completedSteps
                        };
                        localStorage.setItem(`lessonProgress_${journeyId}_${discipline}`, JSON.stringify(lessonProgress));
                      } catch (error) {
                        console.error("Error saving lesson progress:", error);
                      }
                    }
                    
                    // Mark day as complete if all lessons are done
                    if (onComplete) {
                      onComplete();
                    }
                    
                    // Navigate to next lesson
                    if (onNext && lessonIndex < totalLessons - 1) {
                      onNext();
                    }
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-6 font-bold"
                >
                  {lessonIndex < totalLessons - 1 ? (
                    <>
                      Mark Complete & Next Lesson
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    "Mark Complete & Finish"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Reminder - Show when not all steps completed */}
        {isStarted && !allStepsCompleted && (
          <Card className="border-2 border-cyan-400 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Circle className="w-6 h-6 text-cyan-600" />
                <p className="text-sm font-medium text-black">
                  Complete all {topics.length} steps before marking this lesson as done. 
                  Progress: {completedSteps.length} of {topics.length} completed.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Footer */}
        {isStarted && !allStepsCompleted && (
          <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200">
            <Button
              variant="outline"
              size="lg"
              onClick={onPrevious}
              disabled={lessonIndex === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden md:inline">Previous</span>
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: totalLessons }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full ${
                    idx === lessonIndex
                      ? "bg-blue-500 w-8"
                      : idx < lessonIndex
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <Button
              size="lg"
            onClick={() => {
              // Check if current lesson is completed
              const isCompleted = isCurrentLessonCompleted ? isCurrentLessonCompleted() : false;
              if (!isCompleted) {
                alert("Please complete all steps in this lesson before moving to the next one.");
                return;
              }
              onNext();
            }}
            disabled={lessonIndex >= totalLessons - 1 || !(isCurrentLessonCompleted ? isCurrentLessonCompleted() : false)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
              <span className="hidden md:inline">Next</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Resources Modal */}
        {showResources && lesson?.resources && (
          <ResourcesModal
            resources={lesson.resources}
            onClose={() => setShowResources(false)}
          />
        )}

        {/* Quiz Modal/Component */}
        {showQuiz && lesson?.quiz && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowQuiz(false)}>
            <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Quiz: {lesson.title}</CardTitle>
                  <Button variant="ghost" onClick={() => setShowQuiz(false)}>✕</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Quiz questions={lesson.quiz} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default SimpleLessonView;

