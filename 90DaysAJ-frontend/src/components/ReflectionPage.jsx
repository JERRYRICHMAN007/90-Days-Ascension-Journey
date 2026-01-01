import { useState } from "react";
import { Save, ArrowLeft, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

function ReflectionPage({ currentDay, onSave }) {
  const navigate = useNavigate();
  const [reflections, setReflections] = useState({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const questions = currentDay?.reflection?.questions || [
    "What did I learn today?",
    "What challenges did I face?",
    "How did I overcome them?",
    "What would I do differently?",
    "What am I grateful for?",
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage or API
      const reflectionData = {
        day: currentDay?.dayNumber || new Date().getDate(),
        date: new Date().toISOString(),
        reflections: Object.values(reflections),
        questions: questions,
      };

      // Save to localStorage
      const existingReflections = JSON.parse(
        localStorage.getItem("reflections") || "[]"
      );
      existingReflections.push(reflectionData);
      localStorage.setItem("reflections", JSON.stringify(existingReflections));

      if (onSave) {
        onSave(reflectionData);
      }

      // Show success message
      alert("Reflection saved successfully!");
    } catch (error) {
      console.error("Error saving reflection:", error);
      alert("Error saving reflection. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="reflection-page space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          End-of-Day Reflection - Day {currentDay?.dayNumber || "?"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reflection Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.map((question, idx) => (
            <div key={idx} className="space-y-2">
              <label
                htmlFor={`reflection-${idx}`}
                className="text-sm font-medium"
              >
                {idx + 1}. {question}
              </label>
              <Textarea
                id={`reflection-${idx}`}
                placeholder="Type your reflection here..."
                value={reflections[`question${idx + 1}`] || ""}
                onChange={(e) =>
                  setReflections({
                    ...reflections,
                    [`question${idx + 1}`]: e.target.value,
                  })
                }
                rows={4}
                className="resize-none"
              />
            </div>
          ))}

          {/* Documentation Section */}
          {currentDay?.reflection?.documentation && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-4">Documentation Checklist</h3>
              <ul className="space-y-2">
                {currentDay.reflection.documentation.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id={`doc-${idx}`}
                      className="mt-1"
                    />
                    <label htmlFor={`doc-${idx}`} className="text-sm">
                      {item}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Audio Note (Optional) */}
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Mic className="w-4 h-4" />
              <span className="text-sm font-medium">Audio Note (Optional)</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Record a quick voice note about your day
            </p>
            <Button variant="outline" size="sm" disabled>
              <Mic className="w-4 h-4 mr-2" />
              Record Audio Note (Coming Soon)
            </Button>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Save Reflection"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ReflectionPage;

