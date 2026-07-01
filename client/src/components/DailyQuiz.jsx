import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Trophy, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Quiz from "./Quiz";

function DailyQuiz({ dailyQuiz, onComplete }) {
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(dailyQuiz?.timeLimit * 60 || 900);

  // Timer countdown
  useEffect(() => {
    if (isStarted && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isStarted, timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleQuizComplete = (correct, total) => {
    const percentage = Math.round((correct / total) * 100);
    const passed = percentage >= (dailyQuiz.passingScore / dailyQuiz.totalQuestions * 100);
    
    setScore({
      correct,
      total,
      percentage,
      passed
    });
    
    if (onComplete) {
      onComplete({ correct, total, percentage, passed });
    }
  };

  if (!dailyQuiz || !dailyQuiz.questions || dailyQuiz.questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <p>No quiz available for today</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="daily-quiz space-y-6">
      {!isStarted && (
        <Card className="border-4 border-blue-500 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{dailyQuiz.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">{dailyQuiz.description}</p>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{dailyQuiz.totalQuestions}</div>
                <div className="text-sm text-gray-600 mt-1">Questions</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{dailyQuiz.timeLimit}</div>
                <div className="text-sm text-gray-600 mt-1">Minutes</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{dailyQuiz.passingScore}</div>
                <div className="text-sm text-gray-600 mt-1">To Pass</div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => setIsStarted(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white text-lg py-6 font-bold mt-6"
            >
              Start Daily Quiz
            </Button>
          </CardContent>
        </Card>
      )}

      {isStarted && !score && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{dailyQuiz.title}</CardTitle>
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg font-bold">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Quiz questions={dailyQuiz.questions} onComplete={handleQuizComplete} />
          </CardContent>
        </Card>
      )}

      {score && (
        <Card className={`border-4 ${score.passed ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'}`}>
          <CardContent className="p-8 text-center">
            {score.passed ? (
              <>
                <Trophy className="w-20 h-20 mx-auto mb-4 text-green-600" />
                <h2 className="text-3xl font-bold mb-4 text-green-700">🎉 Congratulations!</h2>
                <p className="text-xl text-gray-700 mb-4">
                  You passed with {score.percentage}% ({score.correct}/{score.total} correct)
                </p>
                <p className="text-gray-600 mb-6">
                  Great job! You've mastered today's concepts. Ready for the practical assessment?
                </p>
              </>
            ) : (
              <>
                <XCircle className="w-20 h-20 mx-auto mb-4 text-orange-600" />
                <h2 className="text-3xl font-bold mb-4 text-orange-700">Keep Learning!</h2>
                <p className="text-xl text-gray-700 mb-4">
                  You scored {score.percentage}% ({score.correct}/{score.total} correct)
                </p>
                <p className="text-gray-600 mb-6">
                  You need {dailyQuiz.passingScore} correct to pass. Review the material and try again!
                </p>
              </>
            )}
            <Button
              onClick={() => {
                setIsStarted(false);
                setScore(null);
                setTimeRemaining(dailyQuiz.timeLimit * 60);
              }}
              className={score.passed ? "bg-green-500 hover:bg-green-600" : "bg-orange-500 hover:bg-orange-600"}
            >
              {score.passed ? "Continue to Assessment" : "Retake Quiz"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default DailyQuiz;

