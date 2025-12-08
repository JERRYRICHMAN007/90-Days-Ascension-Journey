import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronDown, CheckCircle2, Lock, Circle } from "lucide-react";
import { cn } from "../../lib/utils";
import { useState, useEffect } from "react";

export function JourneySidebar({
  weeks,
  selectedWeek,
  selectedDay,
  onSelectDay,
  getDayProgress,
  getWeekProgress,
}) {
  // Initialize with Week 1 (index 0) open by default
  const [openWeeks, setOpenWeeks] = useState([0]);

  // Ensure the selected week is always open
  useEffect(() => {
    const selectedWeekIndex = weeks.findIndex(
      (w) => w.weekNumber === selectedWeek
    );
    if (selectedWeekIndex !== -1 && !openWeeks.includes(selectedWeekIndex)) {
      setOpenWeeks((prev) => [...prev, selectedWeekIndex]);
    }
  }, [selectedWeek, weeks]);

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const toggleWeek = (weekIndex) => {
    setOpenWeeks((prev) =>
      prev.includes(weekIndex)
        ? prev.filter((w) => w !== weekIndex)
        : [...prev, weekIndex]
    );
  };

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-lg font-bold mb-4 px-2">Course Content</h2>

      {weeks.map((week, weekIndex) => {
        const isOpen = openWeeks.includes(weekIndex);
        const weekProgress = getWeekProgress ? getWeekProgress(week) : 0;
        const completedDays = week.days
          ? week.days.filter((d) => getDayProgress && getDayProgress(d)).length
          : 0;

        return (
          <Collapsible
            key={week.weekNumber}
            open={isOpen}
            onOpenChange={() => toggleWeek(weekIndex)}
          >
            <CollapsibleTrigger className="w-full">
              <div
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors",
                  selectedWeek === week.weekNumber && "bg-muted"
                )}
              >
                <div className="flex items-center gap-3">
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isOpen && "transform rotate-180"
                    )}
                  />
                  <div className="text-left">
                    <div className="font-semibold text-sm">
                      Week {week.weekNumber}
                      {week.startDate && week.endDate && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                          ({formatDateForDisplay(week.startDate)} -{" "}
                          {formatDateForDisplay(week.endDate)})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {week.theme || week.title}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {completedDays}/{week.days?.length || 0}
                </div>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="space-y-1 mt-1 ml-4">
              {week.days?.map((day, dayIndex) => {
                const isSelected =
                  selectedWeek === week.weekNumber &&
                  selectedDay === day.dayNumber;
                const isCompleted = getDayProgress
                  ? getDayProgress(day)
                  : false;

                return (
                  <button
                    key={day.dayNumber}
                    onClick={() => onSelectDay(weekIndex, dayIndex)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all",
                      "hover:bg-muted/50",
                      isSelected && "bg-primary/10 border-l-2 border-primary"
                    )}
                  >
                    <div className="shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        Day {day.dayNumber}
                      </div>
                      {day.date && (
                        <div className="text-xs font-semibold text-primary truncate">
                          {formatDateForDisplay(day.date)}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground truncate">
                        {day.dayName || day.focus || day.theme || "Day Content"}
                      </div>
                    </div>
                  </button>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
