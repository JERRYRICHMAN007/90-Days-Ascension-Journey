import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, Circle, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

function DisciplineRoadmapPage({ discipline, roadmap, currentDay, onStartLesson }) {
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState(null);

  const getDisciplineColor = (discipline) => {
    switch (discipline) {
      case "Frontend":
        return "#667eea";
      case "Backend":
        return "#10b981";
      case "Mobile":
        return "#f59e0b";
      case "WordPress":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  const color = getDisciplineColor(discipline);

  // Determine node status (mock - replace with actual progress tracking)
  const getNodeStatus = (nodeIndex) => {
    // Simple logic: mark as completed if we're past certain nodes
    return "upcoming"; // or "current" or "completed"
  };

  if (!roadmap || roadmap.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <p>Roadmap data not available for {discipline}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="discipline-roadmap-page space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{discipline} Learning Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Roadmap Visualization */}
          <div className="roadmap-visualization space-y-4">
            {roadmap.map((node, idx) => {
              const status = getNodeStatus(idx);
              const isCompleted = status === "completed";
              const isCurrent = status === "current";

              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 roadmap-node"
                  style={{
                    opacity: idx > roadmap.length - 1 ? 0.5 : 1,
                  }}
                >
                  {/* Node Circle */}
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                      isCompleted
                        ? "bg-green-100 border-green-500"
                        : isCurrent
                        ? "bg-blue-100 border-blue-500"
                        : "bg-gray-100 border-gray-300"
                    }`}
                    style={
                      isCurrent
                        ? {
                            borderColor: color,
                            backgroundColor: `${color}20`,
                          }
                        : {}
                    }
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* Node Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{node.skill}</h3>
                        <p className="text-sm text-muted-foreground">{node.description}</p>
                        <span
                          className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded"
                          style={{
                            backgroundColor: `${color}20`,
                            color: color,
                          }}
                        >
                          {node.status}
                        </span>
                      </div>
                      {isCurrent && (
                        <Button
                          size="sm"
                          onClick={() => onStartLesson(node)}
                          style={{ backgroundColor: color }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Lesson
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Arrow (except last) */}
                  {idx < roadmap.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold mb-2">Current Progress</h4>
                <p className="text-sm text-muted-foreground">
                  Continue your learning journey through the {discipline} roadmap
                </p>
              </div>
              <Button
                onClick={() => {
                  // Find current lesson or first lesson
                  const currentLesson = roadmap.find((n) => getNodeStatus(roadmap.indexOf(n)) === "current") || roadmap[0];
                  if (currentLesson && onStartLesson) {
                    onStartLesson(currentLesson);
                  }
                }}
                style={{ backgroundColor: color }}
              >
                Open Current Lesson
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DisciplineRoadmapPage;

