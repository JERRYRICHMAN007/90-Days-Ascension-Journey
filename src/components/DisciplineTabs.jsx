import { useState, useEffect, useRef } from "react";
import { Code, Server, Smartphone, Globe } from "lucide-react";
import { cn } from "../lib/utils";

const disciplines = [
  { id: "Frontend", label: "Frontend", icon: Code, color: "#667eea" },
  { id: "Backend", label: "Backend", icon: Server, color: "#10b981" },
  { id: "Mobile", label: "Mobile", icon: Smartphone, color: "#f59e0b" },
  { id: "WordPress", label: "WordPress", icon: Globe, color: "#8b5cf6" },
];

function DisciplineTabs({ activeDiscipline, onDisciplineChange }) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const tabRefs = useRef([]);
  const containerRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const currentIndex = disciplines.findIndex((d) => d.id === activeDiscipline);
      
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        e.preventDefault();
        const newIndex = currentIndex - 1;
        onDisciplineChange(disciplines[newIndex].id);
        tabRefs.current[newIndex]?.focus();
      } else if (e.key === "ArrowRight" && currentIndex < disciplines.length - 1) {
        e.preventDefault();
        const newIndex = currentIndex + 1;
        onDisciplineChange(disciplines[newIndex].id);
        tabRefs.current[newIndex]?.focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        onDisciplineChange(disciplines[0].id);
        tabRefs.current[0]?.focus();
      } else if (e.key === "End") {
        e.preventDefault();
        onDisciplineChange(disciplines[disciplines.length - 1].id);
        tabRefs.current[disciplines.length - 1]?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeDiscipline, onDisciplineChange]);

  // Touch swipe for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = disciplines.findIndex((d) => d.id === activeDiscipline);
      if (isLeftSwipe && currentIndex < disciplines.length - 1) {
        onDisciplineChange(disciplines[currentIndex + 1].id);
      } else if (isRightSwipe && currentIndex > 0) {
        onDisciplineChange(disciplines[currentIndex - 1].id);
      }
    }
  };
  return (
    <div
      className="discipline-tabs-container"
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="tablist"
      aria-label="Discipline navigation"
    >
      <div className="container mx-auto px-4">
        <div className="discipline-tabs-wrapper">
          {disciplines.map((discipline, index) => {
            const Icon = discipline.icon;
            const isActive = activeDiscipline === discipline.id;
            
            return (
              <button
                key={discipline.id}
                ref={(el) => (tabRefs.current[index] = el)}
                onClick={() => onDisciplineChange(discipline.id)}
                onFocus={() => setFocusedIndex(index)}
                className={cn(
                  "discipline-tab-button",
                  isActive && "active"
                )}
                role="tab"
                aria-selected={isActive}
                aria-controls={`${discipline.id.toLowerCase()}-panel`}
                id={`${discipline.id.toLowerCase()}-tab`}
                tabIndex={isActive ? 0 : -1}
                style={
                  isActive
                    ? {
                        borderBottomColor: discipline.color,
                        color: discipline.color,
                      }
                    : {}
                }
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{discipline.label}</span>
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: discipline.color }}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DisciplineTabs;

