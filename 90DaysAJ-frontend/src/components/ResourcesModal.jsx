import { X, ExternalLink, Video, BookOpen, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

function ResourcesModal({ resources, onClose }) {
  const getResourceIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "documentation":
      case "docs":
        return <BookOpen className="w-4 h-4" />;
      case "code":
      case "github":
        return <Code className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  if (!resources || resources.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <Card className="max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Learning Resources</CardTitle>
              <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close resources modal">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">No resources available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resources-modal-title"
    >
      <Card
        className="max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="sticky top-0 bg-background border-b z-10">
          <div className="flex items-center justify-between">
            <CardTitle id="resources-modal-title">Learning Resources</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close resources modal"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 border border-border rounded-lg hover:border-primary hover:bg-muted/50 transition-all group"
              >
                <div className="mt-1 text-primary">
                  {getResourceIcon(resource.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold group-hover:text-primary transition-colors">
                    {resource.title}
                  </h4>
                  {resource.category && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {resource.category}
                    </p>
                  )}
                  {resource.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {resource.description}
                    </p>
                  )}
                  {resource.time && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Estimated time: {resource.time}
                    </p>
                  )}
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
              </a>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground text-center">
              These resources are from the official curriculum and recommended external sources.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResourcesModal;

