import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen, Code, Map, ExternalLink, FolderKanban, BarChart3, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import DisciplineRoadmap from "./DisciplineRoadmap";
import SessionScreen from "./SessionScreen";
import { SessionCompletionButton } from "./SessionCompletionButton";
import { isSessionComplete } from "../utils/progressTracking";

function DisciplineView({
  discipline,
  schedule,
  currentDay,
  onStartSession,
  activeSession,
}) {
  const [expandedSections, setExpandedSections] = useState({
    deepLearning: true,
    implementation: true,
    roadmap: false,
    resources: false,
    projects: false,
    progress: false,
    notes: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Filter content for this discipline
  const deepLearningSessions = schedule?.scheduledContent?.deepLearning?.filter(
    (block) => block.discipline === discipline
  ) || [];

  const implementationSessions = schedule?.scheduledContent?.focusedImplementation?.filter(
    (block) => block.discipline === discipline
  ) || [];

  // If no schedule data, show placeholder with basic content
  if (!schedule) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <p>Schedule data not available for {discipline}</p>
            <p className="text-sm mt-2">Content will appear here once schedule is loaded.</p>
          </CardContent>
        </Card>
        {/* Fallback: Show basic curriculum content if available */}
        {currentDay?.dailyLearning && (
          <Card className={`${getDisciplineColor(discipline)} border-l-4`}>
            <CardHeader>
              <CardTitle>Daily Learning</CardTitle>
            </CardHeader>
            <CardContent>
              {typeof currentDay.dailyLearning === "object" && currentDay.dailyLearning.title && (
                <div>
                  <h4 className="font-semibold mb-2">{currentDay.dailyLearning.title}</h4>
                  {currentDay.dailyLearning.topics && (
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {currentDay.dailyLearning.topics.slice(0, 5).map((topic, idx) => (
                        <li key={idx}>{topic}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  const roadmap = deepLearningSessions[0]?.content?.roadmap ||
    implementationSessions[0]?.content?.roadmap || [];

  const resources = deepLearningSessions[0]?.content?.resources ||
    implementationSessions[0]?.content?.resources || [];

  const getDisciplineColor = (discipline) => {
    switch (discipline) {
      case "Frontend":
        return "border-l-[#667eea]";
      case "Backend":
        return "border-l-[#10b981]";
      case "Mobile":
        return "border-l-[#f59e0b]";
      case "WordPress":
        return "border-l-[#8b5cf6]";
      default:
        return "border-l-gray-400";
    }
  };

  // Get time blocks for this discipline
  const getTimeBlocksForDiscipline = () => {
    const timeBlocks = {
      deepLearning: [],
      focusedImplementation: []
    };

    schedule?.timeBlocks?.deepLearning?.forEach(block => {
      if (block.discipline === discipline) {
        timeBlocks.deepLearning.push(block);
      }
    });

    schedule?.timeBlocks?.focusedImplementation?.forEach(block => {
      if (block.discipline === discipline) {
        timeBlocks.focusedImplementation.push(block);
      }
    });

    if (schedule?.timeBlocks?.additional) {
      schedule.timeBlocks.additional.deepLearning?.forEach(block => {
        if (block.discipline === discipline) {
          timeBlocks.deepLearning.push(block);
        }
      });
      schedule.timeBlocks.additional.focusedImplementation?.forEach(block => {
        if (block.discipline === discipline) {
          timeBlocks.focusedImplementation.push(block);
        }
      });
    }

    return timeBlocks;
  };

  const disciplineTimeBlocks = getTimeBlocksForDiscipline();

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Time Blocks Summary - Prominently Displayed */}
      {(disciplineTimeBlocks.deepLearning.length > 0 || disciplineTimeBlocks.focusedImplementation.length > 0) && (
        <Card className={`${getDisciplineColor(discipline)} border-l-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⏰</span>
              <span className="text-xl">{discipline} Schedule - {currentDay?.dayName}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {disciplineTimeBlocks.deepLearning.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
                    📚 Deep Learning (Study Time)
                  </h4>
                  {disciplineTimeBlocks.deepLearning.map((block, idx) => (
                    <div key={idx} className="mb-2 p-2 bg-white dark:bg-gray-800 rounded">
                      <div className="font-mono font-bold text-lg text-blue-600 dark:text-blue-400">
                        {block.time}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Duration: {block.duration}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {disciplineTimeBlocks.focusedImplementation.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-2 border-green-200 dark:border-green-800">
                  <h4 className="font-bold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                    🛠️ Focused Implementation (Build Time)
                  </h4>
                  {disciplineTimeBlocks.focusedImplementation.map((block, idx) => (
                    <div key={idx} className="mb-2 p-2 bg-white dark:bg-gray-800 rounded">
                      <div className="font-mono font-bold text-lg text-green-600 dark:text-green-400">
                        {block.time}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Duration: {block.duration}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      {/* Deep Learning Sessions */}
      <Collapsible
        open={expandedSections.deepLearning}
        onOpenChange={() => toggleSection("deepLearning")}
      >
        <Card className={`${getDisciplineColor(discipline)} border-l-4`}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedSections.deepLearning ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                  <BookOpen className="w-5 h-5" />
                  <span>Deep Learning Sessions</span>
                </div>
                <span className="text-sm font-normal text-muted-foreground">
                  {deepLearningSessions.length} session{deepLearningSessions.length !== 1 ? "s" : ""}
                </span>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {deepLearningSessions.length > 0 ? (
                deepLearningSessions.map((session, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm text-muted-foreground">
                            {session.time}
                          </span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {session.duration}
                          </span>
                        </div>
                        {session.content && (
                          <>
                            <h4 className="font-semibold mb-2">{session.content.title}</h4>
                            {session.content.topics && session.content.topics.length > 0 && (
                              <ul className="text-sm text-muted-foreground space-y-1 mb-3">
                                {session.content.topics.slice(0, 3).map((topic, topicIdx) => (
                                  <li key={topicIdx} className="flex items-start gap-2">
                                    <span className="text-primary">▸</span>
                                    <span>{topic}</span>
                                  </li>
                                ))}
                                {session.content.topics.length > 3 && (
                                  <li className="text-xs text-muted-foreground italic">
                                    +{session.content.topics.length - 3} more topics
                                  </li>
                                )}
                              </ul>
                            )}
                          </>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => onStartSession(session)}
                        className="shrink-0"
                      >
                        Start
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No deep learning sessions scheduled for {discipline} today
                </p>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Focused Implementation Sessions */}
      <Collapsible
        open={expandedSections.implementation}
        onOpenChange={() => toggleSection("implementation")}
      >
        <Card className={`${getDisciplineColor(discipline)} border-l-4`}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedSections.implementation ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                  <Code className="w-5 h-5" />
                  <span>Focused Implementation Sessions</span>
                </div>
                <span className="text-sm font-normal text-muted-foreground">
                  {implementationSessions.length} session{implementationSessions.length !== 1 ? "s" : ""}
                </span>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {implementationSessions.length > 0 ? (
                implementationSessions.map((session, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm text-muted-foreground">
                            {session.time}
                          </span>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                            {session.duration}
                          </span>
                        </div>
                        {session.content && (
                          <>
                            <h4 className="font-semibold mb-2">{session.content.title}</h4>
                            {session.content.description && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {session.content.description}
                              </p>
                            )}
                            {session.content.requirements &&
                              session.content.requirements.length > 0 && (
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {session.content.requirements.slice(0, 2).map((req, reqIdx) => (
                                    <li key={reqIdx} className="flex items-start gap-2">
                                      <span className="text-primary">▸</span>
                                      <span>{req}</span>
                                    </li>
                                  ))}
                                  {session.content.requirements.length > 2 && (
                                    <li className="text-xs text-muted-foreground italic">
                                      +{session.content.requirements.length - 2} more requirements
                                    </li>
                                  )}
                                </ul>
                              )}
                          </>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => onStartSession(session)}
                        className="shrink-0"
                      >
                        Start
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No implementation sessions scheduled for {discipline} today
                </p>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Roadmap Progress */}
      <Collapsible
        open={expandedSections.roadmap}
        onOpenChange={() => toggleSection("roadmap")}
      >
        <Card className={`${getDisciplineColor(discipline)} border-l-4`}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center gap-3">
                {expandedSections.roadmap ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
                <Map className="w-5 h-5" />
                <span>Roadmap Progress</span>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <DisciplineRoadmap
                discipline={discipline}
                roadmap={roadmap}
                resources={resources}
                isExpanded={true}
              />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Learning Resources */}
      {resources && resources.length > 0 && (
        <Collapsible
          open={expandedSections.resources}
          onOpenChange={() => toggleSection("resources")}
        >
          <Card className={`${getDisciplineColor(discipline)} border-l-4`}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center gap-3">
                  {expandedSections.resources ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                  <ExternalLink className="w-5 h-5" />
                  <span>Learning Resources</span>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-all"
                    >
                      <ExternalLink className="w-4 h-4 text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{resource.title}</div>
                        <div className="text-xs text-muted-foreground">{resource.category}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Projects */}
      {(currentDay?.miniProject || currentDay?.cursorWorkflow) && (
        <Collapsible
          open={expandedSections.projects}
          onOpenChange={() => toggleSection("projects")}
        >
          <Card className={`${getDisciplineColor(discipline)} border-l-4`}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardTitle className="flex items-center gap-3">
                  {expandedSections.projects ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                  <FolderKanban className="w-5 h-5" />
                  <span>Projects & Workflows</span>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="space-y-4">
                {/* Mini Project */}
                {currentDay?.miniProject && typeof currentDay.miniProject === "object" && currentDay.miniProject.title && (
                  <div className="space-y-3">
                    <h4 className="font-semibold mb-2">{currentDay.miniProject.title}</h4>
                    {currentDay.miniProject.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {currentDay.miniProject.description}
                      </p>
                    )}
                    {currentDay.miniProject.requirements && (
                      <div>
                        <h5 className="font-medium text-sm mb-2">Requirements:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {currentDay.miniProject.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Cursor Workflow */}
                {currentDay?.cursorWorkflow && typeof currentDay.cursorWorkflow === "object" && (
                  <div className="mt-4 pt-4 border-t">
                    <h5 className="font-semibold mb-2">Cursor IDE Workflow</h5>
                    {currentDay.cursorWorkflow.setupCommands && (
                      <div className="mb-3">
                        <h6 className="text-sm font-medium mb-1">Setup Commands:</h6>
                        <pre className="p-3 bg-muted rounded text-xs overflow-x-auto">
                          {currentDay.cursorWorkflow.setupCommands.join("\n")}
                        </pre>
                      </div>
                    )}
                    {currentDay.cursorWorkflow.prompts && (
                      <div>
                        <h6 className="text-sm font-medium mb-1">Cursor Prompts:</h6>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                          {currentDay.cursorWorkflow.prompts.map((prompt, idx) => (
                            <li key={idx}>{prompt}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Progress Tracking */}
      <Collapsible
        open={expandedSections.progress}
        onOpenChange={() => toggleSection("progress")}
      >
        <Card className={`${getDisciplineColor(discipline)} border-l-4`}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardTitle className="flex items-center gap-3">
                {expandedSections.progress ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
                <BarChart3 className="w-5 h-5" />
                <span>Progress Tracking</span>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Today's Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {deepLearningSessions.length + implementationSessions.length} sessions
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: "0%",
                        backgroundColor: getDisciplineColor(discipline).replace("border-l-", ""),
                      }}
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Track your progress through each discipline's learning path. Complete sessions
                  to unlock the next milestones.
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
}

export default DisciplineView;

