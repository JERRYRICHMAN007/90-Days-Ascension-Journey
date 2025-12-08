import { useState, useEffect } from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { Button } from './button';
import { cn } from '../../lib/utils';

export function TimerWidget({ initialMinutes = 25, onComplete, className }) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (onComplete) onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setTimeLeft(initialMinutes * 60);
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
  };

  return (
    <div className={cn("p-6 rounded-lg border bg-card", className)}>
      <div className="text-center mb-4">
        <div className="text-5xl font-bold text-primary mb-2">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="text-sm text-muted-foreground">
          {isRunning && !isPaused ? 'Running...' : isPaused ? 'Paused' : 'Ready'}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {!isRunning ? (
          <Button onClick={handleStart} size="sm" className="gap-2">
            <Play className="w-4 h-4" />
            Start
          </Button>
        ) : isPaused ? (
          <Button onClick={handleResume} size="sm" className="gap-2">
            <Play className="w-4 h-4" />
            Resume
          </Button>
        ) : (
          <Button onClick={handlePause} size="sm" variant="secondary" className="gap-2">
            <Pause className="w-4 h-4" />
            Pause
          </Button>
        )}
        
        {isRunning && (
          <Button onClick={handleStop} size="sm" variant="destructive" className="gap-2">
            <Square className="w-4 h-4" />
            Stop
          </Button>
        )}
        
        <Button onClick={handleReset} size="sm" variant="ghost" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}

