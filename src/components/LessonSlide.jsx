import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, BookOpen, ExternalLink, FolderKanban, HelpCircle, Play, Pause } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import ResourcesModal from "./ResourcesModal";

function LessonSlide({
  lesson,
  lessonIndex,
  totalLessons,
  onPrevious,
  onNext,
  onStartProject,
  onOpenQuiz,
  resources = [],
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleTimer = () => {
    if (timerRunning) {
      setTimerRunning(false);
    } else {
      setTimerRunning(true);
      const interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  };

  const canGoPrevious = lessonIndex > 0;
  const canGoNext = lessonIndex < totalLessons - 1;

  return (
    <div className="lesson-slide-container">
      <Card className="lesson-card">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {lesson.estimatedTime || "30 min"}
              </span>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              {lessonIndex + 1} / {totalLessons}
            </div>
          </div>
          <CardTitle className="text-2xl">{lesson.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Short Summary */}
          {lesson.summary && (
            <div className="lesson-summary">
              <h3 className="font-semibold mb-2">Summary</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {lesson.summary.slice(0, 6).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Topics (if available) */}
          {lesson.topics && lesson.topics.length > 0 && (
            <div className="lesson-topics">
              <h3 className="font-semibold mb-2">Topics Covered</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {lesson.topics.slice(0, 6).map((topic, idx) => (
                  <li key={idx}>{topic}</li>
                ))}
                {lesson.topics.length > 6 && (
                  <li className="text-xs text-muted-foreground italic">
                    +{lesson.topics.length - 6} more topics
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Expandable Full Content */}
          {lesson.content && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full">
                  {isExpanded ? "Hide Full Content" : "Show Full Content"}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  {typeof lesson.content === "string" ? (
                    <p className="text-sm whitespace-pre-wrap">{lesson.content}</p>
                  ) : (
                    <div className="space-y-2 text-sm">
                      {lesson.content.map((section, idx) => (
                        <div key={idx}>
                          {section.title && <h4 className="font-semibold mb-1">{section.title}</h4>}
                          {section.text && <p className="text-muted-foreground">{section.text}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="default"
              className="w-full"
              onClick={() => setIsExpanded(true)}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Start Learning
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowResources(true)}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Resources
            </Button>

            {lesson.miniProject && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onStartProject(lesson.miniProject)}
              >
                <FolderKanban className="w-4 h-4 mr-2" />
                Mini Project
              </Button>
            )}

            {lesson.quiz && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onOpenQuiz(lesson.quiz)}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Quiz
              </Button>
            )}
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold">{formatTime(timeElapsed)}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleTimer}
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalLessons }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx === lessonIndex
                      ? "bg-primary"
                      : idx < lessonIndex
                      ? "bg-primary/50"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="default"
              onClick={onNext}
              disabled={!canGoNext}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resources Modal */}
      {showResources && (
        <ResourcesModal
          resources={resources}
          onClose={() => setShowResources(false)}
        />
      )}
    </div>
  );
}

export default LessonSlide;

