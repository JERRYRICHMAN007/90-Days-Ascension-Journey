import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

function DisciplineRoadmap({ discipline, roadmap, resources, isExpanded: initialExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  // Update state when prop changes
  useEffect(() => {
    setIsExpanded(initialExpanded);
  }, [initialExpanded]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'foundation':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'intermediate':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'advanced':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'optional':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getDisciplineColor = (discipline) => {
    switch (discipline) {
      case 'Frontend':
        return 'border-l-[#667eea] bg-gradient-to-r from-blue-50 to-purple-50';
      case 'Backend':
        return 'border-l-[#10b981] bg-gradient-to-r from-green-50 to-emerald-50';
      case 'Mobile':
        return 'border-l-[#f59e0b] bg-gradient-to-r from-amber-50 to-orange-50';
      case 'WordPress':
        return 'border-l-[#8b5cf6] bg-gradient-to-r from-purple-50 to-violet-50';
      default:
        return 'border-l-gray-400 bg-gray-50';
    }
  };

  if (!roadmap || roadmap.length === 0) return null;

  return (
    <Card className={`${getDisciplineColor(discipline)} border-l-4 transition-all`}>
      <CardHeader
        className="cursor-pointer hover:bg-white/50 transition-colors select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
            <span className="text-xl font-bold">{discipline}</span>
            <span className="text-sm font-normal text-gray-600">
              ({roadmap.length} skills)
            </span>
          </div>
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Roadmap Progression */}
          <div className="roadmap-progression">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-gray-700">Learning Path:</span>
            </div>
            <div className="space-y-3">
              {roadmap.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 mt-1">
                    {idx < roadmap.length - 1 ? (
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{skill.skill}</h4>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(
                          skill.status
                        )}`}
                      >
                        {skill.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{skill.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          {resources && resources.length > 0 && (
            <div className="resources-section mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-3">Learning Resources:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all"
                  >
                    <span className="text-blue-600">🔗</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {resource.title}
                      </div>
                      <div className="text-xs text-gray-500">{resource.category}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default DisciplineRoadmap;

