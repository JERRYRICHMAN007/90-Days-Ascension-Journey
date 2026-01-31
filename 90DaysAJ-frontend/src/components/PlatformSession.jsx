import { useState } from "react";
import { Instagram, Twitter, Youtube, Facebook, Linkedin, MessageSquare, CheckCircle2, Github } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const platforms = {
  instagram: { name: "Instagram", icon: Instagram, color: "bg-gradient-to-r from-purple-500 to-pink-500", brandColors: { havenX: "from-blue-500 to-cyan-500", ryxen: "from-purple-500 to-pink-500" } },
  tiktok: { name: "TikTok", icon: MessageSquare, color: "bg-black", brandColors: { havenX: "from-blue-500 to-cyan-500", ryxen: "from-purple-500 to-pink-500" } },
  x: { name: "X (Twitter)", icon: Twitter, color: "bg-black", brandColors: { havenX: "from-blue-500 to-cyan-500", ryxen: "from-purple-500 to-pink-500" } },
  threads: { name: "Threads", icon: MessageSquare, color: "bg-gradient-to-r from-gray-800 to-gray-900", brandColors: { havenX: "from-blue-500 to-cyan-500", ryxen: "from-purple-500 to-pink-500" } },
  linkedin: { name: "LinkedIn", icon: Linkedin, color: "bg-blue-700", brandColors: { havenX: "from-blue-500 to-cyan-500", ryxen: "from-purple-500 to-pink-500" } },
  youtube: { name: "YouTube", icon: Youtube, color: "bg-red-600", brandColors: { havenX: "from-blue-500 to-cyan-500", ryxen: "from-purple-500 to-pink-500" } },
  github: { name: "GitHub", icon: Github, color: "bg-gray-800", brandColors: { havenX: "from-blue-500 to-cyan-500", ryxen: "from-purple-500 to-pink-500" } }
};

function PlatformSession({ platform, brand, dayNumber, weekNumber }) {
  const [completed, setCompleted] = useState(false);
  const [notes, setNotes] = useState("");

  const platformInfo = platforms[platform.toLowerCase()];
  if (!platformInfo) return null;

  const Icon = platformInfo.icon;

  // Content strategy based on brand and platform
  const getContentStrategy = () => {
    const strategies = {
      havenx: {
        instagram: {
          postTypes: ["Automation tips carousel", "Before/After system improvements", "Quick automation wins"],
          bestTimes: "8-9 AM, 12-1 PM, 5-6 PM",
          hashtags: "#automation #businesssystems #efficiency #productivity #businessautomation",
          captionStyle: "Educational, problem-solving focused, includes CTA to learn more"
        },
        tiktok: {
          postTypes: ["Quick automation tips (15-60s)", "Behind-the-scenes workflow", "Problem-solution format"],
          bestTimes: "6-10 AM, 7-9 PM",
          hashtags: "#automation #productivity #businesshacks #efficiency",
          captionStyle: "Hook in first 3 seconds, educational, trending sounds"
        },
        x: {
          postTypes: ["Threads on automation systems", "Quick tips", "Industry news commentary"],
          bestTimes: "7-9 AM, 12-1 PM, 5-7 PM",
          hashtags: "#automation #business #productivity",
          captionStyle: "Concise, actionable, thread format for longer content"
        },
        threads: {
          postTypes: ["Automation insights", "Quick wins", "Community engagement"],
          bestTimes: "8-9 AM, 12-1 PM, 5-6 PM",
          hashtags: "#automation #productivity #business",
          captionStyle: "Conversational, authentic, similar to Instagram but text-focused"
        },
        linkedin: {
          postTypes: ["Case studies", "Thought leadership articles", "Industry insights"],
          bestTimes: "8-9 AM, 12-1 PM, 5-6 PM",
          hashtags: "#businessautomation #operations #efficiency #B2B",
          captionStyle: "Professional, data-driven, includes value proposition"
        },
        youtube: {
          postTypes: ["Tutorial videos", "System walkthroughs", "Client success stories"],
          bestTimes: "Upload Tuesday-Thursday, 2-4 PM",
          hashtags: "#automation #businesssystems #tutorial",
          captionStyle: "Detailed descriptions, timestamps, clear CTAs"
        },
        github: {
          postTypes: ["Automation scripts & tools", "Open source contributions", "Technical documentation"],
          bestTimes: "Anytime (code-focused platform)",
          hashtags: "#automation #productivity #opensource #devtools",
          captionStyle: "Technical, well-documented README files, clear code comments"
        }
      },
      ryxen: {
        instagram: {
          postTypes: ["Wealth mindset quotes", "Financial freedom stories", "Personal growth content"],
          bestTimes: "8-9 AM, 12-1 PM, 7-9 PM",
          hashtags: "#wealthmindset #financialfreedom #personalgrowth #abundance",
          captionStyle: "Inspirational, personal, includes reflection questions"
        },
        tiktok: {
          postTypes: ["Wealth tips (15-60s)", "Day in the life", "Mindset shifts"],
          bestTimes: "6-10 AM, 7-9 PM",
          hashtags: "#wealthmindset #financialfreedom #moneytips #entrepreneurship",
          captionStyle: "Hook in first 3 seconds, relatable, trending sounds"
        },
        x: {
          postTypes: ["Wealth mindset threads", "Daily affirmations", "Financial tips"],
          bestTimes: "7-9 AM, 12-1 PM, 5-7 PM",
          hashtags: "#wealthmindset #financialfreedom #mindset",
          captionStyle: "Motivational, thread format, includes actionable insights"
        },
        threads: {
          postTypes: ["Wealth insights", "Daily motivation", "Community engagement"],
          bestTimes: "8-9 AM, 12-1 PM, 5-6 PM",
          hashtags: "#wealthmindset #financialfreedom #growth",
          captionStyle: "Conversational, authentic, text-focused inspiration"
        },
        linkedin: {
          postTypes: ["Financial insights", "Wealth building strategies", "Personal development"],
          bestTimes: "8-9 AM, 12-1 PM, 5-6 PM",
          hashtags: "#wealth #financialfreedom #mindset #entrepreneurship",
          captionStyle: "Professional yet personal, value-driven, includes engagement questions"
        },
        youtube: {
          postTypes: ["Mindset coaching videos", "Wealth building strategies", "Personal stories"],
          bestTimes: "Upload Tuesday-Thursday, 2-4 PM",
          hashtags: "#wealthmindset #financialfreedom #personalgrowth",
          captionStyle: "Engaging intros, personal stories, clear takeaways"
        },
        github: {
          postTypes: ["Financial tools & calculators", "Wealth tracking projects", "Educational code examples"],
          bestTimes: "Anytime (code-focused platform)",
          hashtags: "#fintech #personalfinance #wealthbuilding #opensource",
          captionStyle: "Technical, educational, well-documented financial tools"
        }
      }
    };

    return strategies[brand.toLowerCase()]?.[platform.toLowerCase()] || {
      postTypes: ["Content aligned with brand values"],
      bestTimes: "Check platform analytics",
      hashtags: "Research trending hashtags",
      captionStyle: "Match brand voice"
    };
  };

  const strategy = getContentStrategy();

  return (
    <Card className="border-2 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${platformInfo.color} p-3 rounded-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">{platformInfo.name} - {brand}</CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">Day {dayNumber} • Week {weekNumber}</p>
            </div>
          </div>
          <Button
            variant={completed ? "default" : "outline"}
            onClick={() => setCompleted(!completed)}
            className={completed ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {completed ? <CheckCircle2 className="w-4 h-4 mr-2" /> : null}
            {completed ? "Completed" : "Mark Complete"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2 dark:text-white">Content Types for {brand}:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {strategy.postTypes.map((type, idx) => (
              <li key={idx}>{type}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2 dark:text-white">Best Posting Times:</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{strategy.bestTimes}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2 dark:text-white">Hashtag Strategy:</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">{strategy.hashtags}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2 dark:text-white">Caption Style:</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{strategy.captionStyle}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-2 dark:text-white">Content Planning Notes:</h4>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={`What will you post on ${platformInfo.name} for ${brand} today?`}
            className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-700"
            rows={4}
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>💡 Tip:</strong> Ensure content aligns with {brand}'s brand voice and values. 
            Cross-promote between platforms when appropriate.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default PlatformSession;

