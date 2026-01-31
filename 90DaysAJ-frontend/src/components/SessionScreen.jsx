import { useState, useEffect } from "react";
import { Play, Pause, Square, Clock, CheckCircle2, BookOpen, Code } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { markSessionComplete, isSessionComplete } from "../utils/progressTracking";

function SessionScreen({ session, onComplete, onNext, journeyId, dayNumber, sessionType, sessionIndex, discipline }) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  
  // Check if session is already marked as complete
  const [isCompleted, setIsCompleted] = useState(() => {
    if (journeyId && dayNumber !== undefined && sessionType && sessionIndex !== undefined) {
      return isSessionComplete(journeyId, dayNumber, sessionType, sessionIndex, discipline);
    }
    return false;
  });

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning && timeElapsed !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeElapsed]);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeElapsed(0);
  };

  const handleComplete = () => {
    setIsRunning(false);
    
    // Mark session as complete in progress tracking system
    if (journeyId && dayNumber !== undefined && sessionType && sessionIndex !== undefined) {
      const success = markSessionComplete(
        journeyId,
        dayNumber,
        sessionType,
        sessionIndex,
        discipline,
        {
          timeElapsed,
          completedAt: new Date().toISOString()
        }
      );
      
      if (success) {
        setIsCompleted(true);
      }
    } else {
      // Fallback for sessions without tracking data
      setIsCompleted(true);
    }
    
    // Trigger completion callback
    if (onComplete) {
      onComplete({
        ...session,
        timeElapsed,
        completed: true,
      });
    }
  };

  if (!session) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          No session selected
        </CardContent>
      </Card>
    );
  }

  const isStudy = session.type === "study";
  const Icon = isStudy ? BookOpen : Code;

  return (
    <Card className="session-screen">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="w-6 h-6 text-blue-600" />
            <div>
              <div className="text-lg font-bold">{session.discipline}</div>
              <div className="text-sm text-gray-600">{session.time}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-xl font-mono font-bold">{formatTime(timeElapsed)}</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Session Type Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isStudy
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {isStudy ? "📖 Deep Learning" : "🛠️ Focused Implementation"}
          </span>
          {session.duration && (
            <span className="text-sm text-gray-500">Duration: {session.duration}</span>
          )}
        </div>

        {/* Content */}
        {session.content && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{session.content.title}</h3>
            
            {session.content.description && (
              <p className="text-gray-700">{session.content.description}</p>
            )}

            {session.content.topics && session.content.topics.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Topics:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {session.content.topics.slice(0, 5).map((topic, idx) => (
                    <li key={idx}>{topic}</li>
                  ))}
                  {session.content.topics.length > 5 && (
                    <li className="text-gray-500 italic">
                      +{session.content.topics.length - 5} more topics
                    </li>
                  )}
                </ul>
              </div>
            )}

            {session.content.requirements && session.content.requirements.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Requirements:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {session.content.requirements.slice(0, 5).map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                  {session.content.requirements.length > 5 && (
                    <li className="text-gray-500 italic">
                      +{session.content.requirements.length - 5} more requirements
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Sync Information */}
            {session.content.sync && session.content.sync.relatedContent.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">🔗 Synced with:</h4>
                <ul className="space-y-1">
                  {session.content.sync.relatedContent.map((rel, idx) => (
                    <li key={idx} className="text-sm text-yellow-700">
                      • {rel.discipline}: {rel.connection}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Resources */}
            {session.content.resources && session.content.resources.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Resources:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {session.content.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all text-sm"
                    >
                      <span>🔗</span>
                      <span className="font-medium">{resource.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t">
          {!isRunning && timeElapsed === 0 && (
            <Button onClick={handleStart} className="gap-2">
              <Play className="w-4 h-4" />
              Start Session
            </Button>
          )}
          {isRunning && (
            <>
              <Button onClick={handlePause} variant="outline" className="gap-2">
                <Pause className="w-4 h-4" />
                Pause
              </Button>
              <Button onClick={handleStop} variant="outline" className="gap-2">
                <Square className="w-4 h-4" />
                Stop
              </Button>
            </>
          )}
          {!isRunning && timeElapsed > 0 && (
            <>
              <Button onClick={handleStart} variant="outline" className="gap-2">
                <Play className="w-4 h-4" />
                Resume
              </Button>
              <Button onClick={handleComplete} className="gap-2 bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="w-4 h-4" />
                Mark Complete
              </Button>
            </>
          )}
        </div>

        {/* Completion Status */}
        {isCompleted && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-800">Session Completed!</p>
            <p className="text-sm text-green-700">Time spent: {formatTime(timeElapsed)}</p>
            {onNext && (
              <Button onClick={onNext} className="mt-3">
                Next Session
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SessionScreen;

