import { Clock, Code, Server, Smartphone, Globe } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { focusedImplementationDB } from "../utils/focusedImplementationDb.js";

const disciplineIcons = {
  Frontend: Code,
  Backend: Server,
  Mobile: Smartphone,
  WordPress: Globe
};

const disciplineColors = {
  Frontend: "text-blue-600 dark:text-blue-400",
  Backend: "text-green-600 dark:text-green-400",
  Mobile: "text-orange-600 dark:text-orange-400",
  WordPress: "text-purple-600 dark:text-purple-400"
};

function TimeBlockDisplay({ schedule, dayName, currentDay, journeyId, onManageTasks }) {
  if (!schedule || !schedule.timeBlocks) return null;

  const { deepLearning, focusedImplementation, additional } = schedule.timeBlocks;
  
  // Get user-added tasks for this day
  const userTasks = currentDay && journeyId 
    ? focusedImplementationDB.getTasksByDay(currentDay.dayNumber, journeyId)
    : [];

  const getTimeBlocksByDiscipline = () => {
    const blocks = {
      Frontend: { deepLearning: [], focusedImplementation: [] },
      Backend: { deepLearning: [], focusedImplementation: [] },
      Mobile: { deepLearning: [], focusedImplementation: [] },
      WordPress: { deepLearning: [], focusedImplementation: [] }
    };

    deepLearning?.forEach(block => {
      if (block.discipline && blocks[block.discipline]) {
        blocks[block.discipline].deepLearning.push(block);
      }
    });

    // Note: Focused Implementation blocks are for freelancing/other work, not tracked in platform
    // Still show them but mark as optional/flexible
    focusedImplementation?.forEach(block => {
      if (block.discipline && blocks[block.discipline]) {
        blocks[block.discipline].focusedImplementation.push(block);
      }
    });

    if (additional) {
      additional.deepLearning?.forEach(block => {
        if (block.discipline && blocks[block.discipline]) {
          blocks[block.discipline].deepLearning.push(block);
        }
      });
      additional.focusedImplementation?.forEach(block => {
        if (block.discipline && blocks[block.discipline]) {
          blocks[block.discipline].focusedImplementation.push(block);
        }
      });
    }

    return blocks;
  };

  const disciplineBlocks = getTimeBlocksByDiscipline();

  return (
    <Card className="border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Daily Schedule - {dayName}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(disciplineBlocks).map(([discipline, blocks]) => {
            const Icon = disciplineIcons[discipline];
            const colorClass = disciplineColors[discipline];

            return (
              <div key={discipline} className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Icon className={`w-5 h-5 ${colorClass}`} />
                  <h3 className={`font-bold text-lg ${colorClass}`}>{discipline}</h3>
                </div>

                <div className="space-y-3">
                  {blocks.deepLearning.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        📚 Deep Learning (Study)
                      </h4>
                      {blocks.deepLearning.map((block, idx) => (
                        <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded mb-2">
                          <div className="text-xs font-mono font-bold text-blue-700 dark:text-blue-300">
                            {block.time}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {block.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {(blocks.focusedImplementation.length > 0 || userTasks.filter(t => t.discipline === discipline).length > 0) && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        🛠️ Focused Implementation (Build) <span className="text-xs text-gray-500 italic">- For Freelancing/Other Work</span>
                      </h4>
                      {blocks.focusedImplementation.map((block, idx) => (
                        <div key={idx} className="bg-green-50 dark:bg-green-900/20 p-2 rounded mb-2 border border-dashed border-green-300 dark:border-green-700">
                          <div className="text-xs font-mono font-bold text-green-700 dark:text-green-300">
                            {block.time}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {block.duration} <span className="text-gray-500 italic">(Optional/Flexible)</span>
                          </div>
                        </div>
                      ))}
                      {/* User-added tasks for this discipline */}
                      {userTasks
                        .filter(task => task.discipline === discipline && !task.completed)
                        .map((task) => (
                          <div key={task.id} className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded mb-2 border border-blue-300 dark:border-blue-700">
                            <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                              ✓ {task.title}
                            </div>
                            {task.timeBlock && (
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {task.timeBlock}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}

                  {blocks.deepLearning.length === 0 && blocks.focusedImplementation.length === 0 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      No scheduled time blocks
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default TimeBlockDisplay;

