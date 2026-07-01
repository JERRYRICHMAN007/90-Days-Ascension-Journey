import { useState } from "react";
import { CheckCircle2, Circle, Download, ExternalLink, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

function ProjectPage({ project, onComplete, onBack }) {
  const navigate = useNavigate();
  const [completedItems, setCompletedItems] = useState([]);

  const toggleItem = (itemIndex) => {
    setCompletedItems((prev) =>
      prev.includes(itemIndex)
        ? prev.filter((i) => i !== itemIndex)
        : [...prev, itemIndex]
    );
  };

  const allCompleted =
    project.requirements &&
    project.requirements.length > 0 &&
    completedItems.length === project.requirements.length;

  return (
    <div className="project-page space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack || (() => navigate(-1))}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Project: {project.title}</h1>
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Project Overview & Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {project.description && (
            <p className="text-muted-foreground">{project.description}</p>
          )}

          {project.goals && project.goals.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Goals</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {project.goals.map((goal, idx) => (
                  <li key={idx}>{goal}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acceptance Criteria */}
      {project.requirements && project.requirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Acceptance Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {project.requirements.map((requirement, idx) => {
                const isCompleted = completedItems.includes(idx);
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                      isCompleted
                        ? "bg-green-50 border-green-200"
                        : "bg-muted/30 border-border"
                    }`}
                  >
                    <button
                      onClick={() => toggleItem(idx)}
                      className="mt-0.5"
                      aria-label={`Mark requirement ${idx + 1} as ${isCompleted ? "incomplete" : "complete"}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={isCompleted ? "line-through text-muted-foreground" : ""}>
                        {requirement}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Starter Files / Resources */}
      {(project.starterFiles || project.githubRepo) && (
        <Card>
          <CardHeader>
            <CardTitle>Starter Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {project.starterFiles && (
              <div>
                <h4 className="font-semibold mb-2">Download Starter Files</h4>
                <div className="space-y-2">
                  {project.starterFiles.map((file, idx) => (
                    <a
                      key={idx}
                      href={file.url}
                      download
                      className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>{file.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {project.githubRepo && (
              <a
                href={project.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View GitHub Repository</span>
              </a>
            )}
          </CardContent>
        </Card>
      )}

      {/* Live Example */}
      {project.liveExample && (
        <Card>
          <CardHeader>
            <CardTitle>Live Example</CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={project.liveExample}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Live Demo</span>
            </a>
          </CardContent>
        </Card>
      )}

      {/* Related Lessons */}
      {project.relatedLessons && project.relatedLessons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Related Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {project.relatedLessons.map((lesson, idx) => (
                <a
                  key={idx}
                  href={lesson.url}
                  className="flex items-center gap-2 p-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  {lesson.title}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={() => {
            if (allCompleted && onComplete) {
              onComplete(project);
            }
          }}
          disabled={!allCompleted}
          className="flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          {allCompleted ? "Mark Project Complete" : "Complete All Requirements First"}
        </Button>
      </div>
    </div>
  );
}

export default ProjectPage;

