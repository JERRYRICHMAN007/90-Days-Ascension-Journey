import { useState } from "react";
import { CheckCircle2, Circle, Code, GitBranch, FileText, Camera, ArrowRight, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

function PracticalAssessment({ assessment, onComplete }) {
  const [completedItems, setCompletedItems] = useState([]);
  const [submissionItems, setSubmissionItems] = useState([]);

  const toggleRequirement = (index) => {
    setCompletedItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const toggleSubmission = (index) => {
    setSubmissionItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  if (!assessment) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <p>No practical assessment available for today</p>
        </CardContent>
      </Card>
    );
  }

  const allRequirementsMet = completedItems.length === (assessment.requirements?.length || 0);
  const allSubmissionReady = submissionItems.length === (assessment.submission?.checklist?.length || 0);
  const canSubmit = allRequirementsMet && allSubmissionReady;

  return (
    <div className="practical-assessment space-y-6">
      {/* Header */}
      <Card className="border-4 border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{assessment.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-700 mb-4">{assessment.description}</p>
          {assessment.cumulative && assessment.buildingOn && (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-purple-600 bg-purple-100 p-3 rounded-lg">
                <GitBranch className="w-5 h-5" />
                <span className="font-semibold">{assessment.buildingOn.message}</span>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-800 mb-2">📈 Cumulative Learning Strategy:</p>
                <p className="text-sm text-blue-700">
                  Each day's project builds on the previous ones. This means you're not starting from scratch - 
                  you're enhancing and expanding what you've already built. This approach mirrors real-world 
                  software development where projects evolve and grow over time.
                </p>
              </div>
            </div>
          )}
          {!assessment.cumulative && (
            <div className="flex items-center justify-center gap-2 text-green-600 bg-green-100 p-3 rounded-lg">
              <span className="font-semibold">🎯 Foundation Project - This will be built upon in future days!</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Skills */}
      {assessment.todaySkills && assessment.todaySkills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Skills Learned Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {assessment.todaySkills.map((skill, idx) => (
                <div key={idx} className="p-3 bg-muted/30 rounded-lg border">
                  <div className="font-semibold text-sm text-primary">{skill.discipline}</div>
                  <div className="font-medium">{skill.skill}</div>
                  <div className="text-xs text-muted-foreground mt-1">{skill.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previous Projects Reference */}
      {assessment.previousProjects && assessment.previousProjects.length > 0 && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-blue-600" />
              Build On These Previous Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {assessment.previousProjects.map((project, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                    {project.day}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">Day {project.day}: {project.title}</div>
                    {project.skills && project.skills.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        Skills: {project.skills.join(", ")}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-500" />
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-600 italic">
              💡 Tip: Integrate features from these projects into today's build. Make sure previous functionality still works!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Project Requirements */}
      {assessment.todayProject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Today's Project: {assessment.todayProject.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assessment.todayProject.description && (
              <p className="text-gray-700 mb-4">{assessment.todayProject.description}</p>
            )}

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Requirements Checklist</h4>
                <div className="space-y-2">
                  {assessment.requirements?.map((req, idx) => {
                    const isCompleted = completedItems.includes(idx);
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                          isCompleted
                            ? "bg-green-50 border-green-300"
                            : "bg-white border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => toggleRequirement(idx)}
                      >
                        <div className="mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className={`flex-1 ${isCompleted ? "line-through text-gray-500" : ""}`}>
                          {req}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {assessment.mustHave && assessment.mustHave.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3 text-orange-600">Must Have (Non-Negotiable)</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {assessment.mustHave.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {assessment.stretchGoals && assessment.stretchGoals.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-3 text-purple-600">Stretch Goals (Bonus Points!)</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {assessment.stretchGoals.map((goal, idx) => (
                      <li key={idx}>{goal}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission Checklist */}
      {assessment.submission && (
        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Submission Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <h4 className="font-semibold">Before Submitting:</h4>
              {assessment.submission.checklist?.map((item, idx) => {
                const isCompleted = submissionItems.includes(idx);
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-2 rounded ${
                      isCompleted ? "bg-green-50" : "bg-gray-50"
                    }`}
                    onClick={() => toggleSubmission(idx)}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={isCompleted ? "line-through text-gray-500" : ""}>{item}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-semibold mb-3">Deliverables:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {assessment.submission.deliverables?.map((deliverable, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
                    {deliverable.includes("GitHub") && <GitBranch className="w-4 h-4 text-gray-600" />}
                    {deliverable.includes("Screenshot") && <Camera className="w-4 h-4 text-gray-600" />}
                    {deliverable.includes("README") && <FileText className="w-4 h-4 text-gray-600" />}
                    <span className="text-sm">{deliverable}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-semibold text-lg">
                {allRequirementsMet && allSubmissionReady
                  ? "Ready to Submit!"
                  : `Complete ${(assessment.requirements?.length || 0) - completedItems.length} more requirements`}
              </span>
            </div>
            <Button
              size="lg"
              onClick={() => {
                if (canSubmit && onComplete) {
                  onComplete({
                    dayNumber: assessment.dayNumber,
                    requirementsCompleted: completedItems.length,
                    submissionReady: submissionItems.length,
                    completedAt: new Date().toISOString()
                  });
                }
              }}
              disabled={!canSubmit}
              className={`w-full text-lg py-6 font-bold ${
                canSubmit
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              <Code className="w-5 h-5 mr-2" />
              {canSubmit ? "Mark Assessment Complete" : "Complete All Requirements First"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PracticalAssessment;

