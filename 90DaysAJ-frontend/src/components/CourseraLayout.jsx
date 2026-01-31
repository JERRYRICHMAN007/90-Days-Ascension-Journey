import { useState } from "react";
import { CheckCircle2, Play } from "lucide-react";
import Quiz from "./Quiz";
import GamificationSystem from "./GamificationSystem";
import AchievementSystem from "./AchievementSystem";
import DailyMotivation from "./DailyMotivation";
import StreakWarning from "./StreakWarning";
import DisciplineRoadmap from "./DisciplineRoadmap";
import SessionScreen from "./SessionScreen";
import DisciplineMap from "./DisciplineMap";
import DisciplineTabs from "./DisciplineTabs";
import DisciplineView from "./DisciplineView";
import PlatformSession from "./PlatformSession";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import "./CourseraLayout.css";

function CourseraLayout({
  journey,
  weeks,
  selectedWeek,
  selectedDay,
  onWeekChange,
  onDayChange,
  userProgress,
  updateProgress,
  journeyId,
}) {
  const [currentSection, setCurrentSection] = useState("overview");
  const [activeSession, setActiveSession] = useState(null);
  const [activeDiscipline, setActiveDiscipline] = useState("Frontend"); // Default to Frontend

  const currentWeek =
    weeks.find((w) => w.weekNumber === selectedWeek) || weeks[0];
  const currentDay =
    currentWeek?.days?.find((d) => d.dayNumber === selectedDay) ||
    currentWeek?.days?.[0];
  const journeyProgress = userProgress[journeyId] || {};
  const completedDays = Object.values(journeyProgress).filter(Boolean).length;

  const handleDayComplete = (dayNumber, completed) => {
    updateProgress(journeyId, dayNumber, completed);
    if (!completed) {
      // Show reward notification
      setTimeout(() => {
        const event = new CustomEvent("dayCompleted", {
          detail: {
            dayNumber: dayNumber,
            points: 50,
            coins: 10,
          },
        });
        window.dispatchEvent(event);
      }, 100);
    }
  };

  const getDayProgress = (day) => {
    const isCompleted = journeyProgress[day.dayNumber] || false;
    return isCompleted;
  };

  if (!currentDay) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No day selected
      </div>
    );
  }

  const isDayCompleted = getDayProgress(currentDay);

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Gamification System */}
      <GamificationSystem
        userProgress={userProgress}
        journeyId={journeyId}
        totalDays={journey.totalDays}
        completedDays={completedDays}
      />

      {/* Streak Warning */}
      <StreakWarning
        userProgress={userProgress}
        journeyId={journeyId}
        totalDays={journey.totalDays}
      />

      {/* Daily Motivation */}
      <DailyMotivation journeyId={journeyId} completedDays={completedDays} />

      {/* Achievement System */}
      <AchievementSystem
        userProgress={userProgress}
        journeyId={journeyId}
        totalDays={journey.totalDays}
      />

      {/* Day Header */}
      <Card className={`glass-card ${currentDay.isTestRun ? 'border-2 border-yellow-400 dark:border-yellow-500' : ''}`}>
        <CardHeader>
          {currentDay.isTestRun && (
            <div className="mb-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🧪</span>
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Test Run Day</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    {currentDay.testRunNote || 'Explore the app, test features, and get familiar with the journey structure. This day is for learning and experimentation.'}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-3xl mb-2">
                {currentDay.dayName && `${currentDay.dayName}, `}
                Day {currentDay.dayNumber}
                {currentDay.isTestRun && (
                  <span className="ml-2 px-2 py-1 rounded-md bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-sm font-normal">
                    🧪 Test Run
                  </span>
                )}
                {currentDay.date && (
                  <span className="block text-lg font-normal text-muted-foreground mt-1">
                    {formatDateForDisplay(currentDay.date)}
                  </span>
                )}
              </CardTitle>
              <div className="flex gap-2 mt-2">
                {currentDay.focus && (
                  <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                    {currentDay.focus}
                  </span>
                )}
                {currentDay.theme && (
                  <span className="px-3 py-1 rounded-full bg-secondary text-sm">
                    {currentDay.theme}
                  </span>
                )}
              </div>
            </div>

            {!isDayCompleted && (
              <Button
                onClick={() => {
                  handleDayComplete(currentDay.dayNumber, true);
                }}
                className="gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark Complete
              </Button>
            )}

            {isDayCompleted && (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Completed</span>
                <span className="text-xs bg-primary/20 px-2 py-1 rounded">
                  +50⚡ +10🪙
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Content Sections */}
          <div className="space-y-6">
            {/* Dual Brand Journey */}
            {journeyId === "dual-brand" && (
              <>
                {/* Platform Sessions for Content Planning */}
                {currentDay.platformSessions && (
                  <section className="content-section mt-6">
                    <h3 className="section-header">
                      <span className="section-icon">📱</span>
                      Platform Content Sessions - {currentDay.platformSessions.focus}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {currentDay.platformSessions.platforms.map((platform, idx) => (
                        <div key={idx} className="space-y-3">
                          {currentDay.platformSessions.brands.map((brand, brandIdx) => (
                            <PlatformSession
                              key={`${platform}_${brand}`}
                              platform={platform}
                              brand={brand}
                              dayNumber={currentDay.dayNumber}
                              weekNumber={selectedWeek}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>💡 Strategy Note:</strong> {currentDay.platformSessions.notes}
                      </p>
                    </div>
                  </section>
                )}

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Learning Objectives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="dual-brand-objectives">
                      <div className="objective-card ryxen">
                        <div className="objective-header">
                          <span className="brand-icon">⚡</span>
                          <h4>Ryxen Tasks</h4>
                        </div>
                        <p>{currentDay.ryxenTasks}</p>
                      </div>
                      <div className="objective-card havenx">
                        <div className="objective-header">
                          <span className="brand-icon">🚀</span>
                          <h4>HavenX Tasks</h4>
                        </div>
                        <p>{currentDay.havenXTasks}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {currentDay.learningResources &&
                  currentDay.learningResources.length > 0 && (
                    <Card className="glass-card">
                      <CardHeader>
                        <CardTitle>Learning Resources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="resources-grid">
                          {currentDay.learningResources.flat().map((resource, idx) => {
                            // Handle both old format (array with url) and new format (object with url, category, platform)
                            const resourceObj = Array.isArray(resource) ? resource[0] : resource;
                            if (!resourceObj || !resourceObj.url) return null;
                            
                            return (
                              <a
                                key={idx}
                                href={resourceObj.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="resource-card"
                              >
                                <div className="resource-icon">
                                  {resourceObj.platform ? `📱` : `🔗`}
                                </div>
                                <div className="resource-content">
                                  <h4>{resourceObj.title}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    {resourceObj.category && (
                                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                        {resourceObj.category}
                                      </span>
                                    )}
                                    {resourceObj.platform && (
                                      <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded">
                                        {resourceObj.platform}
                                      </span>
                                    )}
                                  </div>
                                  <span className="resource-link-text">
                                    Open resource →
                                  </span>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {currentDay.outcome && (
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Expected Outcome</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="outcome-box">
                        <p>{currentDay.outcome}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Software Engineering Journey */}
            {journeyId === "software-engineering" && (
              <>
                {/* Session Screen (if active) */}
                {activeSession && (
                  <section className="content-section session-screen-section">
                    <SessionScreen
                      session={activeSession}
                      onComplete={(completedSession) => {
                        console.log("Session completed:", completedSession);
                        setActiveSession(null);
                      }}
                      onNext={() => {
                        // Find next session for current discipline
                        const allSessions = [
                          ...(currentDay.schedule?.scheduledContent?.deepLearning || []),
                          ...(currentDay.schedule?.scheduledContent?.focusedImplementation || [])
                        ].filter(s => s.discipline === activeDiscipline);
                        const currentIndex = allSessions.findIndex(s => s === activeSession);
                        if (currentIndex < allSessions.length - 1) {
                          setActiveSession(allSessions[currentIndex + 1]);
                        } else {
                          setActiveSession(null);
                        }
                      }}
                    />
                  </section>
                )}

                {/* Complete Discipline Map (Roadmap.sh style) - Always visible */}
                <section className="content-section">
                  <DisciplineMap currentWeek={selectedWeek} userProgress={journeyProgress} />
                </section>

                {/* Horizontal Discipline Tabs */}
                <DisciplineTabs
                  activeDiscipline={activeDiscipline}
                  onDisciplineChange={setActiveDiscipline}
                  currentDayNumber={selectedDay}
                />

                {/* Discipline View - Only show active discipline */}
                {currentDay.schedule ? (
                  <div className="mt-6 discipline-view-container">
                    <DisciplineView
                      discipline={activeDiscipline}
                      schedule={currentDay.schedule}
                      currentDay={currentDay}
                      onStartSession={setActiveSession}
                      activeSession={activeSession}
                      journeyId={journeyId}
                    />
                  </div>
                ) : (
                  <div className="mt-6">
                    <Card>
                      <CardContent className="p-8 text-center text-muted-foreground">
                        <p>Schedule data loading...</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Daily Cumulative Quiz */}
                {currentDay.dailyQuiz && journeyId === "software-engineering" && (
                  <section className="content-section mt-6">
                    <h3 className="section-header">
                      <span className="section-icon">🧠</span>
                      Daily Cumulative Quiz
                    </h3>
                    <DailyQuiz
                      dailyQuiz={currentDay.dailyQuiz}
                      onComplete={(results) => {
                        console.log("Daily quiz completed:", results);
                        // Save quiz results to localStorage
                        try {
                          const saved = localStorage.getItem(`dailyQuizzes_${journeyId}`) || "[]";
                          const quizzes = JSON.parse(saved);
                          quizzes.push({
                            day: currentDay.dayNumber,
                            ...results,
                            completedAt: new Date().toISOString()
                          });
                          localStorage.setItem(`dailyQuizzes_${journeyId}`, JSON.stringify(quizzes));
                        } catch (error) {
                          console.error("Error saving quiz results:", error);
                        }
                      }}
                    />
                  </section>
                )}

                {/* Additional Curriculum Content (Quiz, Monetization, Reflection) - Show for all disciplines */}
                {currentDay.quiz && currentDay.quiz.length > 0 && journeyId !== "software-engineering" && (
                  <section className="content-section quiz-section-horizontal mt-6">
                    <h3 className="section-header">
                      <span className="section-icon">🧠</span>
                      Progressive Quiz
                    </h3>
                    <Quiz questions={currentDay.quiz} />
                  </section>
                )}

                {/* End-of-Day Practical Assessment */}
                {currentDay.practicalAssessment && journeyId === "software-engineering" && (
                  <section className="content-section mt-6">
                    <h3 className="section-header">
                      <span className="section-icon">🛠️</span>
                      End-of-Day Practical Assessment
                    </h3>
                    <PracticalAssessment
                      assessment={currentDay.practicalAssessment}
                      onComplete={(results) => {
                        console.log("Practical assessment completed:", results);
                        // Save assessment completion
                        try {
                          const saved = localStorage.getItem(`practicalAssessments_${journeyId}`) || "[]";
                          const assessments = JSON.parse(saved);
                          assessments.push({
                            ...results,
                            completedAt: new Date().toISOString()
                          });
                          localStorage.setItem(`practicalAssessments_${journeyId}`, JSON.stringify(assessments));
                          // Mark day as complete
                          updateProgress(journeyId, currentDay.dayNumber, true);
                        } catch (error) {
                          console.error("Error saving assessment:", error);
                        }
                      }}
                    />
                  </section>
                )}

                {currentDay.monetization &&
                  typeof currentDay.monetization === "object" && (
                    <section className="content-section mt-6">
                      <h3 className="section-header">
                        <span className="section-icon">💰</span>
                        Monetization Integration
                      </h3>
                      <div className="monetization-card">
                        <p className="monetization-task">
                          {currentDay.monetization.task}
                        </p>
                        {currentDay.monetization.actionItems && (
                          <div className="action-items-horizontal">
                            <h5>Action Items:</h5>
                            <ul>
                              {currentDay.monetization.actionItems.map(
                                (item, idx) => (
                                  <li key={idx}>{item}</li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                {currentDay.socialPosting &&
                  typeof currentDay.socialPosting === "object" && (
                    <section className="content-section mt-6">
                      <h3 className="section-header">
                        <span className="section-icon">📱</span>
                        Social Posting
                      </h3>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="mb-2">{currentDay.socialPosting.text}</p>
                        {currentDay.socialPosting.platforms && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {currentDay.socialPosting.platforms.map((platform, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                              >
                                {platform}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                {currentDay.reflection &&
                  typeof currentDay.reflection === "object" && (
                    <section className="content-section mt-6">
                      <h3 className="section-header">
                        <span className="section-icon">💭</span>
                        End-of-Day Reflection
                      </h3>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        {currentDay.reflection.questions && (
                          <div>
                            <h4 className="font-semibold mb-2">Questions to Answer:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {currentDay.reflection.questions.map((question, idx) => (
                                <li key={idx}>{question}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {currentDay.reflection.documentation && (
                          <div className="mt-4">
                            <h4 className="font-semibold mb-2">Documentation:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                              {currentDay.reflection.documentation.map((doc, idx) => (
                                <li key={idx}>{doc}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </section>
                  )}
              </>
            )}

            {/* Body Transformation Journey */}
            {journeyId === "body-transformation" && (
              <>
                <section className="content-section">
                  <h3 className="section-header">
                    <span className="section-icon">💪</span>
                    Daily Plan
                  </h3>
                  <div className="daily-plan-content">
                    {currentDay.focus && (
                      <div className="focus-badge-large">
                        {currentDay.focus}
                      </div>
                    )}
                    {currentDay.workout && (
                      <div className="workout-section">
                        <h4>Workout</h4>
                        <p>{currentDay.workout}</p>
                        {currentDay.workoutLink && (
                          <a
                            href={currentDay.workoutLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="workout-link-btn"
                          >
                            🎥 Watch Workout Video →
                          </a>
                        )}
                      </div>
                    )}
                    {currentDay.nutrition && (
                      <div className="nutrition-section">
                        <h4>Nutrition Guidelines</h4>
                        <p>{currentDay.nutrition}</p>
                      </div>
                    )}
                    {currentDay.mindset && (
                      <div className="mindset-section">
                        <h4>Mindset Affirmation</h4>
                        <p className="mindset-text">"{currentDay.mindset}"</p>
                      </div>
                    )}
                  </div>
                </section>

                {currentDay.resources && currentDay.resources.length > 0 && (
                  <section className="content-section">
                    <h3 className="section-header">
                      <span className="section-icon">📚</span>
                      Learning Resources
                    </h3>
                    <div className="resources-grid">
                      {currentDay.resources.map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resource-card"
                        >
                          <div className="resource-icon">💪</div>
                          <div className="resource-content">
                            <h4>{resource.title}</h4>
                            {resource.time && (
                              <span className="resource-time">
                                {resource.time}
                              </span>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* Reading Journey */}
            {journeyId === "reading" && (
              <>
                <section className="content-section">
                  <h3 className="section-header">
                    <span className="section-icon">📚</span>
                    Daily Reading Plan
                  </h3>
                  <div className="daily-plan-content">
                    {currentDay.theme && (
                      <div className="theme-badge-large">
                        {currentDay.theme}
                      </div>
                    )}
                    {currentDay.readingSessions && (
                      <div className="reading-sessions">
                        {currentDay.readingSessions.map((session, idx) => (
                          <div key={idx} className="reading-session-card">
                            <div className="session-header">
                              <span className="session-time">
                                {session.time}
                              </span>
                              <span className="session-type">
                                {session.type}
                              </span>
                            </div>
                            <div className="session-details">
                              <div>
                                <strong>Material:</strong> {session.material}
                              </div>
                              <div>
                                <strong>Focus:</strong> {session.focus}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>

                {currentDay.resources && currentDay.resources.length > 0 && (
                  <section className="content-section">
                    <h3 className="section-header">
                      <span className="section-icon">📖</span>
                      Reading Resources
                    </h3>
                    <div className="resources-grid">
                      {currentDay.resources.map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resource-card"
                        >
                          <div className="resource-icon">📚</div>
                          <div className="resource-content">
                            <h4>{resource.title}</h4>
                            {resource.time && (
                              <span className="resource-time">
                                {resource.time}
                              </span>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* Writer's Journey */}
            {journeyId === "writers" && (
              <>
                <section className="content-section">
                  <h3 className="section-header">
                    <span className="section-icon">✍️</span>
                    Daily Writing Plan
                  </h3>
                  <div className="daily-plan-content">
                    {currentDay.theme && (
                      <div className="theme-badge-large">
                        {currentDay.theme}
                      </div>
                    )}
                    <div className="writer-phases-horizontal">
                      <div className="phase-card">
                        <h4>📚 Learning (3:30-3:45 PM)</h4>
                        <p>{currentDay.learning}</p>
                      </div>
                      <div className="phase-card">
                        <h4>✍️ Execution (3:45-4:25 PM)</h4>
                        <p>{currentDay.execution}</p>
                      </div>
                      <div className="phase-card">
                        <h4>💭 Reflection (4:25-4:30 PM)</h4>
                        <p>{currentDay.reflection}</p>
                      </div>
                    </div>
                  </div>
                </section>

                {currentDay.resources && currentDay.resources.length > 0 && (
                  <section className="content-section">
                    <h3 className="section-header">
                      <span className="section-icon">📝</span>
                      Writing Resources
                    </h3>
                    <div className="resources-grid">
                      {currentDay.resources.map((resource, idx) => (
                        <a
                          key={idx}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="resource-card"
                        >
                          <div className="resource-icon">✍️</div>
                          <div className="resource-content">
                            <h4>{resource.title}</h4>
                            {resource.time && (
                              <span className="resource-time">
                                {resource.time}
                              </span>
                            )}
                          </div>
                        </a>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseraLayout;
