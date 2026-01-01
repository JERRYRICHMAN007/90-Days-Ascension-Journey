import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowRight } from "lucide-react";

function DisciplineMap({ currentWeek, userProgress }) {
  const disciplines = [
    {
      name: "Frontend",
      color: "#667eea",
      path: [
        "HTML5",
        "CSS3",
        "TailwindCSS",
        "JavaScript ES6",
        "React",
        "Next.js"
      ],
      className: "frontend"
    },
    {
      name: "Backend",
      color: "#10b981",
      path: [
        "Node.js",
        "Express",
        "REST APIs",
        "Authentication",
        "Databases",
        "ORMs",
        "Deployment"
      ],
      className: "backend"
    },
    {
      name: "Mobile",
      color: "#f59e0b",
      path: [
        "Dart",
        "Flutter Widgets",
        "State Management",
        "API Integration",
        "Deployment",
        "React Native"
      ],
      className: "mobile"
    },
    {
      name: "WordPress",
      color: "#8b5cf6",
      path: [
        "WP Structure",
        "Custom Themes",
        "Gutenberg Blocks",
        "Plugin Development",
        "Security",
        "Monetization"
      ],
      className: "wordpress"
    }
  ];

  const getNodeStatus = (discipline, skill, weekNum) => {
    // Simple logic: mark as completed if we're past certain weeks
    // In a real app, this would check actual progress
    const skillIndex = discipline.path.indexOf(skill);
    const weekProgress = weekNum - 1;
    
    if (skillIndex < weekProgress / 2) {
      return "completed";
    } else if (skillIndex === Math.floor(weekProgress / 2)) {
      return "current";
    }
    return "upcoming";
  };

  return (
    <Card className="discipline-map-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🗺️</span>
          <span>Complete Learning Roadmap</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="discipline-map">
          {disciplines.map((discipline, discIdx) => (
            <div
              key={discIdx}
              className={`discipline-path ${discipline.className}`}
            >
              <div className="path-header">
                <div
                  className="path-indicator"
                  style={{
                    width: "4px",
                    height: "24px",
                    backgroundColor: discipline.color,
                    borderRadius: "2px"
                  }}
                />
                <h3 className="path-title">{discipline.name}</h3>
              </div>
              <div className="path-nodes">
                {discipline.path.map((skill, skillIdx) => {
                  const status = getNodeStatus(discipline, skill, currentWeek || 1);
                  return (
                    <div key={skillIdx} className="path-nodes-container">
                      <span className={`path-node ${status}`}>{skill}</span>
                      {skillIdx < discipline.path.length - 1 && (
                        <ArrowRight className="path-arrow w-4 h-4" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default DisciplineMap;

