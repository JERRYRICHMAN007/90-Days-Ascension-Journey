import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Circle, Play, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

function SimpleRoadmap({ discipline, roadmap, currentDay, onStartLesson, userProgress, journeyId = "software-engineering" }) {
  const navigate = useNavigate();

  // Get actual lesson completion from localStorage
  const getLessonCompletion = () => {
    try {
      const saved = localStorage.getItem(`lessonProgress_${journeyId}_${discipline}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  const lessonProgress = getLessonCompletion();

  const getDisciplineColor = (discipline) => {
    switch (discipline) {
      case "Frontend":
        return { bg: "bg-blue-500", light: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" };
      case "Backend":
        return { bg: "bg-green-500", light: "bg-green-50", text: "text-green-600", border: "border-green-200" };
      case "Mobile":
        return { bg: "bg-orange-500", light: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" };
      case "WordPress":
        return { bg: "bg-purple-500", light: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" };
      default:
        return { bg: "bg-gray-500", light: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" };
    }
  };

  const colors = getDisciplineColor(discipline);

  if (!roadmap || roadmap.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <p className="text-xl">Roadmap data not available for {discipline}</p>
              <Button onClick={() => navigate(-1)} className="mt-4">
                <Home className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {discipline} Learning Path
          </h1>
          <p className="text-xl text-gray-600">
            Follow this path step by step to master {discipline}
          </p>
        </div>

        {/* Roadmap Steps */}
        <div className="space-y-4">
          {roadmap.map((node, idx) => {
            const lessonKey = node.skill.toLowerCase().replace(/\s+/g, "-");
            // Check if lesson is completed - handle both old format (true) and new format (object with completed flag)
            const lessonData = lessonProgress[lessonKey];
            const isCompleted = lessonData === true || (lessonData && lessonData.completed === true);
            
            // Find the first incomplete lesson in sequence
            // Always check from the beginning - lessons must be completed in order
            let firstIncompleteIndex = -1;
            for (let i = 0; i < roadmap.length; i++) {
              const key = roadmap[i].skill.toLowerCase().replace(/\s+/g, "-");
              if (!lessonProgress[key]) {
                firstIncompleteIndex = i;
                break;
              }
            }
            
            // Current lesson: the first incomplete lesson (must be HTML5 if not completed)
            // If HTML5 is not completed, it's always current regardless of other lessons
            const html5Key = roadmap[0]?.skill.toLowerCase().replace(/\s+/g, "-");
            const html5Completed = html5Key ? lessonProgress[html5Key] === true : false;
            
            const isCurrent = html5Completed
              ? (idx === firstIncompleteIndex && !isCompleted && firstIncompleteIndex !== -1)
              : (idx === 0); // HTML5 is always current if not completed
            
            const isUpcoming = html5Completed
              ? (firstIncompleteIndex !== -1 && idx > firstIncompleteIndex)
              : (idx > 0); // All others are upcoming if HTML5 is not completed

            return (
              <Card
                key={idx}
                className={`border-4 transition-all ${
                  isCurrent
                    ? `${colors.border} shadow-2xl scale-105 bg-gray-900 dark:bg-gray-800 hover:shadow-xl cursor-pointer`
                    : isCompleted
                    ? "border-blue-400 bg-blue-900/30 dark:bg-blue-900/20 hover:shadow-xl cursor-pointer"
                    : "border-gray-200 bg-gray-900 dark:bg-gray-800 opacity-60 cursor-not-allowed"
                }`}
                onClick={() => {
                  if (isCurrent || isCompleted) {
                    onStartLesson(node);
                  }
                }}
              >
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-6">
                    {/* Step Number Circle */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white ${
                          isCompleted
                            ? "bg-green-500"
                            : isCurrent
                            ? colors.bg
                            : "bg-gray-300"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-10 h-10" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {node.skill}
                          </h3>
                          <p className="text-lg text-gray-300 mb-3">
                            {node.description}
                          </p>
                          <span
                            className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                              isCompleted
                                ? "bg-green-100 text-green-700"
                                : isCurrent
                                ? `${colors.light} ${colors.text}`
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {node.status}
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      {isCurrent && (() => {
                        // Check if there's progress for this lesson
                        const hasProgress = lessonData && typeof lessonData === 'object' && lessonData.completedSteps && Array.isArray(lessonData.completedSteps) && lessonData.completedSteps.length > 0;
                        const buttonText = hasProgress ? "Continue Lesson" : "Start This Lesson Now";
                        
                        return (
                          <Button
                            size="lg"
                            onClick={() => onStartLesson(node)}
                            className={`${colors.bg} hover:opacity-90 text-white text-lg px-8 py-6 font-bold shadow-lg`}
                          >
                            <Play className="w-6 h-6 mr-3" />
                            {buttonText}
                          </Button>
                        );
                      })()}
                      {isCompleted && (
                        <Button
                          size="lg"
                          onClick={() => onStartLesson(node)}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-6 font-bold shadow-lg"
                        >
                          <Play className="w-6 h-6 mr-3" />
                          Retake This Lesson
                        </Button>
                      )}
                      {isUpcoming && (
                        <div className="flex items-center gap-2 text-gray-400 italic">
                          <p>Complete previous lessons to unlock</p>
                        </div>
                      )}
                    </div>

                    {/* Arrow (except last) */}
                    {idx < roadmap.length - 1 && (
                      <div className="hidden md:flex flex-shrink-0 items-center justify-center w-12">
                        <ArrowRight
                          className={`w-8 h-8 ${
                            isCompleted 
                              ? "text-green-500" 
                              : isCurrent
                              ? "text-blue-500"
                              : "text-gray-500 opacity-50"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Progress Summary */}
        <Card className={`${colors.light} border-2 ${colors.border}`}>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Your {discipline} Progress
              </h3>
              <div className="w-full bg-gray-200 rounded-full h-6">
                {(() => {
                  const completedCount = Object.values(lessonProgress).filter(Boolean).length;
                  const progressPercent = roadmap.length > 0 
                    ? Math.round((completedCount / roadmap.length) * 100) 
                    : 0;
                  return (
                    <div
                      className={`${colors.bg} h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${progressPercent}%` }}
                    >
                      <span className="text-white font-bold text-sm">{progressPercent}%</span>
                    </div>
                  );
                })()}
              </div>
              <p className="text-gray-600">
                {(() => {
                  const completedCount = Object.values(lessonProgress).filter(Boolean).length;
                  if (completedCount === 0) {
                    return `Start your learning journey! Complete lessons to see progress. 🚀`;
                  }
                  return `You've completed ${completedCount} of ${roadmap.length} lessons. Keep going! 🚀`;
                })()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Helpful Tip */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Learning Tip</h3>
                <p className="text-gray-700">
                  Complete each lesson in order. Don't skip ahead - each lesson builds on the previous one!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SimpleRoadmap;

