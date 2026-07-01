import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Menu } from "lucide-react";
import {
  getJourneyData,
  getSkillResources,
  getSkillQuiz,
  getSkillTopics,
} from "../data/journeys/index.js";
import DisciplineRoadmapPage from "./DisciplineRoadmapPage";
import SimpleRoadmap from "./SimpleRoadmap";
import LessonSlide from "./LessonSlide";
import SimpleLessonView from "./SimpleLessonView";
import ProjectPage from "./ProjectPage";
import ReflectionPage from "./ReflectionPage";
import DailyQuiz from "./DailyQuiz";
import PracticalAssessment from "./PracticalAssessment";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { JourneyDetailV2 } from "./journey/JourneyDetailV2";
import { getCurrentPhaseStatus, getCurrentDayNumber, getWeekNumber } from "../utils/dates";
import { calculateSessionBasedProgress, isDayFullyComplete, toggleDayComplete } from "../utils/progressTracking";
import "./JourneyDetail.css";

function JourneyDetail({ journeyId: propJourneyId }) {
  const {
    journeyId: paramJourneyId,
    discipline,
    lessonId,
    projectId,
    dayNumber,
  } = useParams();
  const location = useLocation();
  const journeyId = propJourneyId || paramJourneyId;
  const navigate = useNavigate();
  const { weeks, journey } = getJourneyData(journeyId);
  // Initialize with first available week/day, or default to 1
  const firstWeek = weeks && weeks.length > 0 ? weeks[0] : null;
  const firstDay = firstWeek?.days && firstWeek.days.length > 0 ? firstWeek.days.find(d => d && d.dayNumber === 1) || firstWeek.days[0] : null;
  const currentPhaseStatus = getCurrentPhaseStatus();
  // Get current day number - defaults to present day
  const currentDayNumber = getCurrentDayNumber();
  // Default to current day number, but skip Day 0 - always start from Day 1
  // If currentDayNumber is 0 or null, default to Day 1
  const defaultDay = (currentDayNumber !== null && currentDayNumber > 0) ? currentDayNumber : 1;
  // Calculate default week: Day 1-7 = Week 1, Day 8-14 = Week 2, etc.
  const defaultWeek = defaultDay === 0 ? 1 : getWeekNumber(defaultDay);
  const [selectedWeek, setSelectedWeek] = useState(defaultWeek);
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [activeSection, setActiveSection] = useState(null); // 'quiz' or 'assessment'

  if (!journey) {
    return <div>Journey not found</div>;
  }

  // Use session-based progress calculation ONLY - no legacy fallback
  const sessionProgress = calculateSessionBasedProgress(journeyId, weeks || []);
  const completedDays = sessionProgress.completedDays || 0;
  const progressPercentage = sessionProgress.percentage || 0;

  const getDayProgress = (day) => {
    // Use session-based completion check
    return isDayFullyComplete(journeyId, day) || false;
  };

  const getWeekProgress = (week) => {
    const weekDays = week.days || [];
    const completed = weekDays.filter(
      (d) => d && d.dayNumber > 0 && isDayFullyComplete(journeyId, d)
    ).length;
    return Math.round((completed / weekDays.length) * 100);
  };

  const handleSelectDay = (weekIdx, dayIdx) => {
    const week = weeks[weekIdx];
    if (week && week.days && week.days[dayIdx]) {
      setSelectedWeek(week.weekNumber);
      setSelectedDay(week.days[dayIdx].dayNumber);
      setIsSidebarOpen(false);
    }
  };

  const currentWeek =
    weeks.find((w) => w.weekNumber === selectedWeek) || weeks[0];
  const currentDay =
    currentWeek?.days?.find((d) => d.dayNumber === selectedDay) ||
    currentWeek?.days?.[0];

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

  // Handle URL parameters for section navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");
    const dayParam = params.get("day");

    if (section === "quiz" || section === "assessment") {
      setActiveSection(section);
      if (dayParam) {
        const dayNum = parseInt(dayParam);
        setSelectedDay(dayNum);
        // Calculate week correctly: Day 1-7 = Week 1, Day 8-14 = Week 2, etc.
        const weekNum = dayNum === 0 ? 1 : getWeekNumber(dayNum);
        setSelectedWeek(weekNum);
      }
    } else {
      setActiveSection(null);
    }
  }, [location.search, location.pathname]);

  // Handle lessonId from URL to set correct lesson index
  useEffect(() => {
    if (lessonId && discipline && journeyId === "software-engineering") {
      const disciplineMap = {
        frontend: "Frontend",
        backend: "Backend",
        mobile: "Mobile",
        wordpress: "WordPress",
      };
      const disciplineName = disciplineMap[discipline?.toLowerCase()] || "Frontend";
      
      // Get roadmap to find the skill
      const roadmap =
        currentDay?.schedule?.scheduledContent?.deepLearning?.find(
          (b) => b.discipline === disciplineName
        )?.content?.roadmap || [];

      // Find the index of the lesson that matches the lessonId
      const lessonIndex = roadmap.findIndex((node) => {
        const lessonKey = node.skill.toLowerCase().replace(/\s+/g, "-");
        return lessonKey === lessonId.toLowerCase();
      });

      if (lessonIndex !== -1) {
        setCurrentLessonIndex(lessonIndex);
      }
    }
  }, [lessonId, discipline, journeyId, currentDay]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Arrow keys for lesson navigation
      if (location.pathname.includes("/lesson/")) {
        if (e.key === "ArrowLeft") {
          // Navigate to previous lesson
        } else if (e.key === "ArrowRight") {
          // Navigate to next lesson
        }
      }
      // Tab navigation for discipline tabs
      if (
        location.pathname.includes("/discipline/") &&
        !location.pathname.includes("/lesson/")
      ) {
        if (e.key === "Tab" && !e.shiftKey) {
          // Tab through discipline tabs
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [location.pathname]);

  // Route-based rendering
  const renderContent = () => {
    // Handle quiz/assessment sections
    if (activeSection === "quiz" && currentDay?.dailyQuiz) {
      return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button
            variant="outline"
            onClick={() => {
              setActiveSection(null);
              navigate(location.pathname);
            }}
            className="mb-6"
          >
            ← Back to Dashboard
          </Button>
          <DailyQuiz
            dailyQuiz={currentDay.dailyQuiz}
            onComplete={(results) => {
              console.log("Daily quiz completed:", results);
              try {
                const saved =
                  localStorage.getItem(`dailyQuizzes_${journeyId}`) || "[]";
                const quizzes = JSON.parse(saved);
                quizzes.push({
                  day: currentDay.dayNumber,
                  ...results,
                  completedAt: new Date().toISOString(),
                });
                localStorage.setItem(
                  `dailyQuizzes_${journeyId}`,
                  JSON.stringify(quizzes)
                );
              } catch (error) {
                console.error("Error saving quiz results:", error);
              }
            }}
          />
        </div>
      );
    }

    if (activeSection === "assessment" && currentDay?.practicalAssessment) {
      return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button
            variant="outline"
            onClick={() => {
              setActiveSection(null);
              navigate(location.pathname);
            }}
            className="mb-6"
          >
            ← Back to Dashboard
          </Button>
          <PracticalAssessment
            assessment={currentDay.practicalAssessment}
            onComplete={(results) => {
              console.log("Practical assessment completed:", results);
              try {
                const saved =
                  localStorage.getItem(`practicalAssessments_${journeyId}`) ||
                  "[]";
                const assessments = JSON.parse(saved);
                assessments.push({
                  ...results,
                  completedAt: new Date().toISOString(),
                });
                localStorage.setItem(
                  `practicalAssessments_${journeyId}`,
                  JSON.stringify(assessments)
                );
                toggleDayComplete(journeyId, currentDay, true);
              } catch (error) {
                console.error("Error saving assessment:", error);
              }
            }}
          />
        </div>
      );
    }

    // Discipline Roadmap Page
    if (discipline && !lessonId && !projectId) {
      const disciplineMap = {
        frontend: "Frontend",
        backend: "Backend",
        mobile: "Mobile",
        wordpress: "WordPress",
      };
      const disciplineName =
        disciplineMap[discipline.toLowerCase()] || discipline;
      const roadmap =
        currentDay?.schedule?.scheduledContent?.deepLearning?.find(
          (b) => b.discipline === disciplineName
        )?.content?.roadmap || [];

      // Use SimpleRoadmap for software-engineering, DisciplineRoadmapPage for others
      if (journeyId === "software-engineering") {
        return (
          <SimpleRoadmap
            discipline={disciplineName}
            roadmap={roadmap}
            currentDay={currentDay}
            journeyId={journeyId}
            onStartLesson={(node) => {
              navigate(
                `/discipline/${discipline}/lesson/${node.skill
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`
              );
            }}
          />
        );
      }

      return (
        <DisciplineRoadmapPage
          discipline={disciplineName}
          roadmap={roadmap}
          currentDay={currentDay}
          onStartLesson={(node) => {
            navigate(
              `/discipline/${discipline}/lesson/${node.skill
                .toLowerCase()
                .replace(/\s+/g, "-")}`
            );
          }}
        />
      );
    }

    // Lesson Page
    if (lessonId) {
      // Get lessons for the discipline
      const disciplineMap = {
        frontend: "Frontend",
        backend: "Backend",
        mobile: "Mobile",
        wordpress: "WordPress",
      };
      const disciplineName =
        disciplineMap[discipline?.toLowerCase()] || "Frontend";
      
      // Get roadmap to find skill name (for software-engineering)
      const roadmap =
        currentDay?.schedule?.scheduledContent?.deepLearning?.find(
          (b) => b.discipline === disciplineName
        )?.content?.roadmap || [];

      // Find the skill that matches the lessonId
      const matchedSkill = roadmap.find((node) => {
        const lessonKey = node.skill.toLowerCase().replace(/\s+/g, "-");
        return lessonKey === lessonId.toLowerCase();
      });

      // Get lessons for the discipline
      const lessons =
        currentDay?.schedule?.scheduledContent?.deepLearning?.filter(
          (b) => b.discipline === disciplineName
        ) || [];

      // For software-engineering, use roadmap index; otherwise use lessons array
      let lessonIndexToUse = currentLessonIndex;
      if (journeyId === "software-engineering" && matchedSkill) {
        lessonIndexToUse = roadmap.findIndex((node) => {
          const lessonKey = node.skill.toLowerCase().replace(/\s+/g, "-");
          return lessonKey === lessonId.toLowerCase();
        });
        if (lessonIndexToUse === -1) lessonIndexToUse = 0;
      }

      const currentLesson = lessons[lessonIndexToUse] || lessons[0];
      const resources = currentLesson?.content?.resources || [];

      // Use SimpleLessonView for software-engineering, LessonSlide for others
      if (journeyId === "software-engineering") {
        // Use the matched skill name
        const skillName = matchedSkill?.skill;
        const skillResources = skillName
          ? getSkillResources(skillName)
          : currentLesson?.content?.resources || [];
        const skillQuiz = skillName ? getSkillQuiz(skillName) : [];
        const skillTopics = skillName ? getSkillTopics(skillName) : [];
        const deepLearningTime = skillName
          ? roadmap.find((r) => r.skill === skillName)?.deepLearningTime
          : currentLesson?.duration || "30 min";

        return (
          <SimpleLessonView
            lesson={{
              title: skillName || currentLesson?.content?.title || "Lesson",
              topics: skillTopics.length > 0 ? skillTopics : (currentLesson?.content?.topics || []),
              content: currentLesson?.content,
              estimatedTime: deepLearningTime,
              resources: skillResources,
              quiz: skillQuiz,
            }}
            lessonIndex={lessonIndexToUse}
            totalLessons={roadmap.length || lessons.length}
            journeyId={journeyId}
            discipline={disciplineName}
            currentDay={currentDay}
            skillName={skillName}
            lessonKey={lessonId}
            onPrevious={() => {
              if (lessonIndexToUse > 0) {
                const prevSkill = roadmap[lessonIndexToUse - 1];
                if (prevSkill) {
                  const prevKey = prevSkill.skill.toLowerCase().replace(/\s+/g, "-");
                  navigate(`/discipline/${discipline}/lesson/${prevKey}`);
                }
              }
            }}
            onNext={() => {
              // Check if current lesson is completed before allowing next
              const currentLessonKey = lessonId?.toLowerCase();
              try {
                const saved = localStorage.getItem(`lessonProgress_${journeyId}_${disciplineName}`) || "{}";
                const lessonProgress = JSON.parse(saved);
                const isCurrentCompleted = lessonProgress[currentLessonKey] === true;
                
                if (!isCurrentCompleted) {
                  alert("Please complete all steps in this lesson before moving to the next one.");
                  return;
                }
              } catch (error) {
                console.error("Error checking lesson progress:", error);
              }
              
              if (lessonIndexToUse < roadmap.length - 1) {
                const nextSkill = roadmap[lessonIndexToUse + 1];
                if (nextSkill) {
                  const nextKey = nextSkill.skill.toLowerCase().replace(/\s+/g, "-");
                  navigate(`/discipline/${discipline}/lesson/${nextKey}`);
                }
              }
            }}
            isCurrentLessonCompleted={() => {
              // Check if current lesson is completed
              const currentLessonKey = lessonId?.toLowerCase();
              try {
                const saved = localStorage.getItem(`lessonProgress_${journeyId}_${disciplineName}`) || "{}";
                const lessonProgress = JSON.parse(saved);
                return lessonProgress[currentLessonKey] === true;
              } catch {
                return false;
              }
            }}
            onComplete={() => {
              // Only mark day complete if all lessons are done
              // For now, we'll track lesson completion separately
              // updateProgress(journeyId, currentDay?.dayNumber, true);
            }}
          />
        );
      }

      return (
        <LessonSlide
          lesson={{
            title: currentLesson?.content?.title || "Lesson",
            summary: currentLesson?.content?.topics || [],
            topics: currentLesson?.content?.topics || [],
            content: currentLesson?.content,
            estimatedTime: currentLesson?.duration || "30 min",
          }}
          lessonIndex={currentLessonIndex}
          totalLessons={lessons.length}
          onPrevious={() => {
            if (currentLessonIndex > 0) {
              setCurrentLessonIndex(currentLessonIndex - 1);
            }
          }}
          onNext={() => {
            if (currentLessonIndex < lessons.length - 1) {
              setCurrentLessonIndex(currentLessonIndex + 1);
            }
          }}
          onStartProject={(project) => {
            navigate(
              `/project/${
                project.id || project.title.toLowerCase().replace(/\s+/g, "-")
              }`
            );
          }}
          onOpenQuiz={(quiz) => {
            // Handle quiz opening
          }}
          resources={resources}
        />
      );
    }

    // Project Page
    if (projectId) {
      const project = currentDay?.miniProject || {};
      return (
        <ProjectPage
          project={project}
          onComplete={(project) => {
            toggleDayComplete(journeyId, currentDay, true);
            navigate(-1);
          }}
          onBack={() => navigate(-1)}
        />
      );
    }

    // Reflection Page
    if (location.pathname.includes("/reflections")) {
      const reflectionDay = dayNumber
        ? weeks
            .flatMap((w) => w.days || [])
            .find((d) => d.dayNumber === parseInt(dayNumber))
        : currentDay;

      return (
        <ReflectionPage
          currentDay={reflectionDay || currentDay}
          onSave={(reflectionData) => {
            console.log("Reflection saved:", reflectionData);
          }}
        />
      );
    }

    // Default: JourneyDetailV2 (new PRD v2.0 design)
    return (
      <JourneyDetailV2
        journey={journey}
        weeks={weeks}
        selectedWeek={selectedWeek}
        selectedDay={selectedDay}
        onWeekChange={setSelectedWeek}
        onDayChange={setSelectedDay}
        journeyId={journeyId}
      />
    );
  };

  // For default journey view, let JourneyDetailV2 handle everything
  // This removes duplicate sidebars and ensures consistent layout
  if (!discipline && !lessonId && !projectId && !activeSection && !location.pathname.includes("/reflections")) {
    return (
      <JourneyDetailV2
        journey={journey}
        weeks={weeks}
        selectedWeek={selectedWeek}
        selectedDay={selectedDay}
        onWeekChange={setSelectedWeek}
        onDayChange={setSelectedDay}
        journeyId={journeyId}
      />
    );
  }

  // For special routes (lessons, projects, etc.), use minimal wrapper
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Minimal Header for Special Routes */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/${journeyId}`)}
              className="shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">{journey.icon}</span>
                <h1 className="text-lg font-bold truncate">{journey.title}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Single Scroll Container */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
        </main>
    </div>
  );
}

export default JourneyDetail;
