import { getExecutionTasks } from '../dualBrandExecutionPlan.js';
import {
  JOURNEY_START_DATE,
  JOURNEY_TOTAL_DAYS,
  generateWeeks,
  getDateStringForDayNumber,
  getCalendarWeekDayNumbers,
  getCalendarWeekCount,
} from './shared.js';
import {
  getDualBrandTimeBlocks,
  organizeDualBrandSchedule,
  getDualBrandQuiz,
  getPlatformSessions,
} from './softwareEngineering.js';
import { DUAL_BRAND_CURATED_RESOURCES, normalizeResource } from './journeyCuratedResources.js';

// Helper function for Dual Brand reflection
function getDualBrandReflection(weekNum, dayIndex) {
  const focus = getDualBrandFocus(weekNum, dayIndex);
  const personalBrandTasks = getPersonalBrandTasks(weekNum, dayIndex);
  const companyBrandTasks = getCompanyBrandTasks(weekNum, dayIndex);
  const outcome = getDualBrandOutcome(weekNum, dayIndex);

  // Format tasks for reflection - handle both arrays and strings
  const formatTasks = (tasks) => {
    if (!tasks || tasks.length === 0) return "No tasks completed";
    if (Array.isArray(tasks)) {
      if (tasks.length === 1) return tasks[0];
      return tasks.slice(0, 3).join(", ") + (tasks.length > 3 ? ` and ${tasks.length - 3} more` : "");
    }
    return tasks;
  };

  const personalTasksText = formatTasks(personalBrandTasks);
  const companyTasksText = formatTasks(companyBrandTasks);

  return {
    prompt: `Reflect on today's ${focus} work for both Personal Brand and Company Brand`,
    questions: [
      `What progress did I make on ${focus}?`,
      `Personal Brand (_richman.oo7): How did today's tasks go? ${personalTasksText}`,
      `Company Brand (_ryxen.oo7): How did today's tasks go? ${companyTasksText}`,
      `Did I achieve the expected outcome: ${outcome}?`,
      "What challenges did I face?",
      "What will I focus on improving tomorrow?",
      "How are both brands progressing toward their goals?",
    ],
  };
}

// Dual Brand Journey - Complete 13 weeks
export const dualBrandWeeks = generateWeeks(
  JOURNEY_START_DATE,
  getCalendarWeekCount(JOURNEY_TOTAL_DAYS)
).map((week, idx) => {
    const days = [];

    for (const dayNumber of getCalendarWeekDayNumbers(week.startDate, JOURNEY_TOTAL_DAYS)) {
      const dayDateString = getDateStringForDayNumber(dayNumber);
      const [year, month, day] = dayDateString.split("-").map(Number);
      const dayDate = new Date(year, month - 1, day);

      // Get actual day name from the date
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const actualDayName = dayNames[dayDate.getDay()];
      
      // Convert JavaScript getDay() (0=Sunday, 1=Monday, ..., 6=Saturday) 
      // to dayIndex format used by getTimeBlocks (0=Monday, 1=Tuesday, ..., 5=Saturday, 6=Sunday)
      const jsDayOfWeek = dayDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
      const dayIndex = jsDayOfWeek === 0 ? 6 : jsDayOfWeek - 1; // Convert to: 0=Monday, 1=Tuesday, ..., 5=Saturday, 6=Sunday

      // Week 1 starts from Day 1 (Wednesday, July 1, 2026) - actual content execution begins
      // Content week numbering: Day 1 = Week 1 content, Days 1-7 = Week 1 content, Days 8-14 = Week 2 content, etc.
      // Week numbering: idx 0 = Week 1, idx 1 = Week 2, etc.
      const contentWeekNum = idx + 1; // Week 1, 2, 3, etc.

      const contentSlot = (dayNumber - 1) % 7;

      // Use actual content for all days (no test run)
      const focus = getDualBrandFocus(contentWeekNum, contentSlot);
      
      // Get time blocks and organize schedule (same format as software engineering)
      const timeBlocks = getDualBrandTimeBlocks(dayIndex);
      const learningData = {
        title: focus,
        description: `Today's focus: ${focus}`,
      };
      const projectData = getDualBrandProject(contentWeekNum, contentSlot);
      const scheduledContent = organizeDualBrandSchedule(learningData, projectData, dayIndex, timeBlocks, dayNumber);

      days.push({
        dayNumber: dayNumber,
        date: dayDateString,
        dayName: actualDayName,
        focus: focus,
        personalBrandTasks: getPersonalBrandTasks(contentWeekNum, contentSlot),
        companyBrandTasks: getCompanyBrandTasks(contentWeekNum, contentSlot),
        // Keep legacy fields for backward compatibility
        ryxenTasks: getPersonalBrandTasks(contentWeekNum, contentSlot),
        havenXTasks: getCompanyBrandTasks(contentWeekNum, contentSlot),
        theme: getDualBrandTheme(contentWeekNum),
        learningResources: getDualBrandLearningResources(contentWeekNum, contentSlot),
        outcome: getDualBrandOutcome(contentWeekNum, contentSlot),
        // Platform-specific sessions for content planning
        platformSessions: getPlatformSessions(contentWeekNum, contentSlot),
        // Project content for dual brand
        project: getDualBrandProject(contentWeekNum, contentSlot),
        // Add missing fields for Learning, Reflection tabs
        dailyLearning: learningData,
        reflection: getDualBrandReflection(contentWeekNum, contentSlot),
        dailyQuiz: getDualBrandQuiz(contentWeekNum, contentSlot, dayNumber),
        isTestRun: false,
        testRunNote: null,
        testRunTasks: null,
        // Schedule format (same as software engineering)
        schedule: {
          timeBlocks: timeBlocks,
          scheduledContent: scheduledContent,
        },
      });
    }

    return { ...week, days };
  })
  .filter((week) => week.days.length > 0);

function getDualBrandFocus(weekNum, dayIndex) {
  const focuses = [
    [
      "Brand Identity Basics",
      "Quick Visual Identity",
      "Platform Setup - All 7 Platforms",
      "Automation Tool Setup - Buffer/Hootsuite",
      "Content Pillars (Quick)",
      "Bios & About Sections",
      "Week Reflection",
    ],
    [
      "Create & Schedule Instagram Posts",
      "Create & Schedule X/Twitter Threads",
      "Create & Schedule TikTok Videos",
      "Create & Schedule Threads Posts",
      "Create & Schedule LinkedIn Posts",
      "Schedule YouTube Content",
      "Week Reflection - Automation Working",
    ],
    [
      "Engagement Strategy",
      "Analytics Setup",
      "Growth Loops",
      "Community Building",
      "Collaboration Prep",
      "Engagement Execution",
      "Week Reflection",
    ],
    [
      "Value Proposition",
      "Authority Content",
      "Lead Magnets",
      "Email List Setup",
      "Monetization Research",
      "Website Planning",
      "Week Reflection",
    ],
    [
      "Content Performance",
      "Content Iteration",
      "Audience Research",
      "Content Calendar",
      "Platform Optimization",
      "Hashtag Strategy",
      "Week Reflection",
    ],
    [
      "Product Ideation",
      "Product Validation",
      "Product Planning",
      "MVP Development",
      "Pricing Strategy",
      "Launch Planning",
      "Week Reflection",
    ],
    [
      "Service Packages",
      "Pricing Models",
      "Sales Materials",
      "Client Onboarding",
      "Service Delivery",
      "Testimonials",
      "Week Reflection",
    ],
    [
      "Digital Product Types",
      "Product Creation",
      "E-commerce Setup",
      "Marketing Strategy",
      "Distribution Channels",
      "Product Completion",
      "Week Reflection",
    ],
    [
      "Automation Tools",
      "Workflow Setup",
      "Content Automation",
      "Lead Automation",
      "System Documentation",
      "Team Planning",
      "Week Reflection",
    ],
    [
      "Platform Expansion",
      "Collaboration Outreach",
      "Cross-Promotion",
      "Guest Content",
      "Partnership Development",
      "Network Building",
      "Week Reflection",
    ],
    [
      "Revenue Streams",
      "Authority Content",
      "Speaking/Media",
      "Premium Offerings",
      "Upsell Systems",
      "Client Retention",
      "Week Reflection",
    ],
    [
      "Advanced Products",
      "Scaling Revenue",
      "Brand Evolution",
      "Market Positioning",
      "Strategic Planning",
      "Systems Optimization",
      "Week Reflection",
    ],
    [
      "Performance Review",
      "Metrics Analysis",
      "Optimization Plan",
      "Next Phase Strategy",
      "System Refinement",
      "Journey Complete",
      "Celebration",
    ],
  ];
  return focuses[weekNum - 1]?.[dayIndex] || "Brand Building";
}

function getDualBrandLearningResources(weekNum, dayIndex) {
  const allResources = [
    // Week 1 - Brand Foundation
    [
      [
        {
          title: "Personal Branding — Alex Hormozi",
          url: "https://www.youtube.com/@AlexHormozi",
          category: "Video",
          platform: "YouTube",
          type: "youtube",
          description: "Business growth and personal brand building",
        },
        {
          title: "Brand Identity Design Guide - Canva",
          url: "https://www.canva.com/design-school/courses/branding-design",
          category: "Tutorial",
          platform: "Canva",
        },
        {
          title: "Brand Strategy Framework - HubSpot",
          url: "https://offers.hubspot.com/how-to-build-a-brand",
          category: "Article",
          platform: "HubSpot",
        },
      ],
      [
        {
          title: "Logo Design Principles - Essential Guidelines",
          url: "https://www.canva.com/learn/logo-design-basics/",
          category: "Guide",
          platform: "Canva",
        },
        {
          title: "Color Psychology in Branding",
          url: "https://www.oberlo.com/blog/color-psychology-color-meanings",
          category: "Article",
          platform: "Oberlo",
        },
        {
          title: "Typography for Brands - Adobe",
          url: "https://www.adobe.com/creativecloud/design/discover/typography.html",
          category: "Tutorial",
          platform: "Adobe",
        },
      ],
      [
        {
          title: "Instagram Profile Optimization 2024",
          url: "https://blog.hootsuite.com/instagram-profile-optimization/",
          category: "Guide",
          platform: "Instagram",
        },
        {
          title: "X (Twitter) Profile Setup Guide",
          url: "https://help.x.com/en/managing-your-account/customizing-your-profile",
          category: "Official",
          platform: "X/Twitter",
        },
        {
          title: "TikTok Profile Best Practices",
          url: "https://www.tiktok.com/creators/creator-portal/en-us/getting-started-on-tiktok/optimize-your-profile/",
          category: "Official",
          platform: "TikTok",
        },
        {
          title: "LinkedIn Profile Optimization",
          url: "https://www.linkedin.com/help/linkedin/answer/a1339363",
          category: "Official",
          platform: "LinkedIn",
        },
        {
          title: "Facebook Page Setup Guide",
          url: "https://www.facebook.com/business/help/1746416099945119",
          category: "Official",
          platform: "Facebook",
        },
        {
          title: "Threads Profile Setup",
          url: "https://help.instagram.com/1631821640426723",
          category: "Official",
          platform: "Threads",
        },
        {
          title: "GitHub Profile README Guide",
          url: "https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme",
          category: "Official",
          platform: "GitHub",
        },
        {
          title: "GitHub Profile Best Practices",
          url: "https://github.com/abhisheknaiidu/awesome-github-profile-readme",
          category: "Examples",
          platform: "GitHub",
        },
      ],
      [
        {
          title: "Buffer Setup Guide - Connect All Platforms",
          url: "https://buffer.com/help/articles/connect-social-accounts",
          category: "Tutorial",
          platform: "Buffer",
        },
        {
          title: "Hootsuite Setup Guide - Connect Social Accounts",
          url: "https://help.hootsuite.com/hc/en-us/articles/360040314234-Connect-your-social-networks",
          category: "Tutorial",
          platform: "Hootsuite",
        },
        {
          title: "How to Schedule Posts on Buffer",
          url: "https://buffer.com/help/articles/how-to-schedule-posts",
          category: "Tutorial",
          platform: "Buffer",
        },
        {
          title: "Buffer Best Times to Post",
          url: "https://buffer.com/library/best-time-to-post",
          category: "Guide",
          platform: "Buffer",
        },
        {
          title: "Automate Social Media Posts - Complete Guide",
          url: "https://blog.hootsuite.com/how-to-schedule-social-media-posts/",
          category: "Guide",
          platform: "All",
        },
      ],
      [
        {
          title: "YouTube Channel Setup 2024",
          url: "https://creatoracademy.youtube.com/page/course/getting-started",
          category: "Official",
          platform: "YouTube",
        },
        {
          title: "YouTube Channel Art Guide",
          url: "https://support.google.com/youtube/answer/2972003",
          category: "Official",
          platform: "YouTube",
        },
        {
          title: "YouTube SEO Optimization",
          url: "https://blog.hootsuite.com/youtube-seo/",
          category: "Guide",
          platform: "YouTube",
        },
      ],
      [
        {
          title: "Content Pillars Strategy - Later",
          url: "https://later.com/blog/content-pillars/",
          category: "Guide",
          platform: "All",
        },
        {
          title: "Content Pillar Framework - Buffer",
          url: "https://buffer.com/library/content-pillars/",
          category: "Framework",
          platform: "All",
        },
        {
          title:
            "_ryxen.oo7 Content Pillars: Automation, Business Systems, Efficiency",
          category: "Strategy",
          platform: "_ryxen.oo7",
        },
        {
          title:
            "_richman.oo7 Content Pillars: Wealth Mindset, Financial Freedom, Personal Growth",
          category: "Strategy",
          platform: "_richman.oo7",
        },
      ],
      [
        {
          title: "Bio Writing Guide - Copyblogger",
          url: "https://copyblogger.com/how-to-write-a-bio/",
          category: "Guide",
          platform: "All",
        },
        {
          title: "LinkedIn Bio Examples",
          url: "https://www.linkedin.com/help/linkedin/answer/a1339363",
          category: "Examples",
          platform: "LinkedIn",
        },
        {
          title: "Instagram Bio Ideas",
          url: "https://blog.hootsuite.com/instagram-bio-ideas/",
          category: "Ideas",
          platform: "Instagram",
        },
      ],
      [
        {
          title: "Content Calendar Template - Notion",
          url: "https://www.notion.so/templates/content-calendar",
          category: "Template",
          platform: "All",
        },
        {
          title: "Social Media Calendar - Google Sheets",
          url: "https://www.smartsheet.com/content/social-media-calendar-template",
          category: "Template",
          platform: "All",
        },
        {
          title: "Content Planning Framework",
          url: "https://buffer.com/library/content-calendar/",
          category: "Framework",
          platform: "All",
        },
      ],
    ],
    // Week 2
    [
      [
        {
          title: "Content Batching Guide",
          url: "https://www.youtube.com/watch?v=KbZTPcNrFUk",
        },
      ],
      [
        {
          title: "How to Write Viral Threads",
          url: "https://www.youtube.com/watch?v=wvI8vn7gS3s",
        },
      ],
      [
        {
          title: "YouTube Shorts Guide",
          url: "https://www.youtube.com/watch?v=xPm5wtSxXLk",
        },
      ],
      [
        {
          title: "TikTok Content Strategy",
          url: "https://www.youtube.com/watch?v=7_lRV7gVHSs",
        },
      ],
      [
        {
          title: "Social Media Scheduling",
          url: "https://buffer.com/library/social-media-scheduling-tools/",
        },
      ],
      [
        {
          title: "Content Audit Checklist",
          url: "https://blog.hootsuite.com/content-audit/",
        },
      ],
      [
        {
          title: "Content Performance Analysis",
          url: "https://sproutsocial.com/insights/analyze-social-media/",
        },
      ],
    ],
    // Week 3
    [
      [
        {
          title: "Engagement Strategies",
          url: "https://www.youtube.com/watch?v=3nHh_0p4cBM",
        },
      ],
      [
        {
          title: "Social Media Analytics Guide",
          url: "https://blog.hootsuite.com/how-to-use-social-media-analytics/",
        },
      ],
      [
        {
          title: "Growth Loop Strategy",
          url: "https://www.youtube.com/watch?v=W1S8YOL2-GU",
        },
      ],
      [
        {
          title: "Community Building Guide",
          url: "https://www.youtube.com/watch?v=LrXrTLC8iRg",
        },
      ],
      [
        {
          title: "Influencer Collaboration Guide",
          url: "https://blog.hootsuite.com/how-to-reach-out-to-influencers/",
        },
      ],
      [
        {
          title: "Engagement Best Practices",
          url: "https://blog.hootsuite.com/instagram-engagement-tips/",
        },
      ],
      [{ title: "Metrics Dashboard Template", url: "https://www.notion.so/" }],
    ],
    // Week 4
    [
      [
        {
          title: "Value Proposition Framework",
          url: "https://www.youtube.com/watch?v=K3yQMg0FzLE",
        },
      ],
      [
        {
          title: "Thought Leadership Guide",
          url: "https://www.youtube.com/watch?v=G_HXjw9v1_M",
        },
      ],
      [
        {
          title: "Lead Magnet Ideas",
          url: "https://www.youtube.com/watch?v=3Z6gMqjNP2c",
        },
      ],
      [
        {
          title: "Email Marketing Setup",
          url: "https://www.youtube.com/watch?v=5-yEfXh1m8Y",
        },
      ],
      [
        {
          title: "Monetization Strategies",
          url: "https://www.youtube.com/watch?v=6hVjmrqPB2E",
        },
      ],
      [
        {
          title: "Landing Page Guide",
          url: "https://www.youtube.com/watch?v=YzpE7wz0Xqs",
        },
      ],
      [{ title: "Business Planning Template", url: "https://www.notion.so/" }],
    ],
    // Week 5
    [
      [
        {
          title: "Content Performance Analysis",
          url: "https://sproutsocial.com/insights/analyze-social-media/",
        },
      ],
      [
        {
          title: "A/B Testing Content",
          url: "https://www.youtube.com/watch?v=4NXp2Y8o1U0",
        },
      ],
      [
        {
          title: "Audience Research Tools",
          url: "https://blog.hootsuite.com/social-media-audience-research/",
        },
      ],
      [
        {
          title: "Content Calendar Tools",
          url: "https://coschedule.com/content-calendar-template",
        },
      ],
      [
        {
          title: "Profile Optimization Guide",
          url: "https://blog.hootsuite.com/how-to-optimize-social-media-profiles/",
        },
      ],
      [
        {
          title: "Hashtag Research Guide",
          url: "https://www.youtube.com/watch?v=7hHXO0a5JIU",
        },
      ],
      [{ title: "Optimization Checklist", url: "https://www.notion.so/" }],
    ],
    // Week 6
    [
      [
        {
          title: "Digital Product Ideas",
          url: "https://www.youtube.com/watch?v=zqG1xJ8v6L0",
        },
      ],
      [
        {
          title: "Product Validation Guide",
          url: "https://www.youtube.com/watch?v=1vzQ8VG5rRs",
        },
      ],
      [
        {
          title: "Product Planning Framework",
          url: "https://www.youtube.com/watch?v=Y5YjOHkq8bI",
        },
      ],
      [
        {
          title: "MVP Development Guide",
          url: "https://www.youtube.com/watch?v=QyQN0s8mWYU",
        },
      ],
      [
        {
          title: "Pricing Strategy Guide",
          url: "https://www.youtube.com/watch?v=4yNgv3DZ3c8",
        },
      ],
      [
        {
          title: "Product Launch Checklist",
          url: "https://www.youtube.com/watch?v=Xv7-VEL-0Fk",
        },
      ],
      [
        {
          title: "Product Development Template",
          url: "https://www.notion.so/",
        },
      ],
    ],
    // Week 7
    [
      [
        {
          title: "Service Package Design",
          url: "https://www.youtube.com/watch?v=3zQ4VY8R7Cc",
        },
      ],
      [
        {
          title: "Service Pricing Guide",
          url: "https://www.youtube.com/watch?v=6qR5XZ_j9G8",
        },
      ],
      [
        {
          title: "Sales Deck Guide",
          url: "https://www.youtube.com/watch?v=5NvQ9bY9gHI",
        },
      ],
      [
        {
          title: "Client Onboarding Guide",
          url: "https://www.youtube.com/watch?v=8JQl3X1bG1Y",
        },
      ],
      [
        {
          title: "Service Delivery Framework",
          url: "https://www.youtube.com/watch?v=KxVxZP7VHMc",
        },
      ],
      [
        {
          title: "Testimonial Guide",
          url: "https://www.youtube.com/watch?v=2qV5xX8Qh4Q",
        },
      ],
      [{ title: "Service Review Template", url: "https://www.notion.so/" }],
    ],
    // Week 8
    [
      [
        {
          title: "Digital Product Types",
          url: "https://www.youtube.com/watch?v=zqG1xJ8v6L0",
        },
      ],
      [
        {
          title: "Digital Product Creation",
          url: "https://www.youtube.com/watch?v=QyQN0s8mWYU",
        },
      ],
      [
        {
          title: "E-commerce Setup Guide",
          url: "https://www.youtube.com/watch?v=YzpE7wz0Xqs",
        },
      ],
      [
        {
          title: "Product Marketing Guide",
          url: "https://www.youtube.com/watch?v=Xv7-VEL-0Fk",
        },
      ],
      [
        {
          title: "Distribution Strategy",
          url: "https://www.youtube.com/watch?v=4NXp2Y8o1U0",
        },
      ],
      [
        {
          title: "Product Finalization Checklist",
          url: "https://www.notion.so/",
        },
      ],
      [{ title: "Monetization Review", url: "https://www.notion.so/" }],
    ],
    // Week 9
    [
      [
        {
          title: "Automation Tools Guide",
          url: "https://www.youtube.com/watch?v=3Z6gMqjNP2c",
        },
      ],
      [
        {
          title: "Workflow Automation",
          url: "https://www.youtube.com/watch?v=5-yEfXh1m8Y",
        },
      ],
      [
        {
          title: "Content Automation Guide",
          url: "https://buffer.com/library/social-media-scheduling-tools/",
        },
      ],
      [
        {
          title: "Lead Automation Guide",
          url: "https://www.youtube.com/watch?v=6hVjmrqPB2E",
        },
      ],
      [{ title: "System Documentation Guide", url: "https://www.notion.so/" }],
      [
        {
          title: "Team Building Guide",
          url: "https://www.youtube.com/watch?v=Y5YjOHkq8bI",
        },
      ],
      [{ title: "Scaling Review Template", url: "https://www.notion.so/" }],
    ],
    // Week 10
    [
      [
        {
          title: "Platform Expansion Guide",
          url: "https://blog.hootsuite.com/social-media-strategy/",
        },
      ],
      [
        {
          title: "Collaboration Outreach",
          url: "https://blog.hootsuite.com/how-to-reach-out-to-influencers/",
        },
      ],
      [
        {
          title: "Cross-Promotion Guide",
          url: "https://www.youtube.com/watch?v=7_lRV7gVHSs",
        },
      ],
      [
        {
          title: "Guest Content Guide",
          url: "https://www.youtube.com/watch?v=3nHh_0p4cBM",
        },
      ],
      [
        {
          title: "Partnership Strategy",
          url: "https://www.youtube.com/watch?v=LrXrTLC8iRg",
        },
      ],
      [
        {
          title: "Networking Guide",
          url: "https://www.youtube.com/watch?v=W1S8YOL2-GU",
        },
      ],
      [{ title: "Growth Review Template", url: "https://www.notion.so/" }],
    ],
    // Week 11
    [
      [
        {
          title: "Revenue Diversification",
          url: "https://www.youtube.com/watch?v=4yNgv3DZ3c8",
        },
      ],
      [
        {
          title: "Authority Content Guide",
          url: "https://www.youtube.com/watch?v=G_HXjw9v1_M",
        },
      ],
      [
        {
          title: "Speaking Pitch Guide",
          url: "https://www.youtube.com/watch?v=3zQ4VY8R7Cc",
        },
      ],
      [
        {
          title: "Premium Offerings Guide",
          url: "https://www.youtube.com/watch?v=6qR5XZ_j9G8",
        },
      ],
      [
        {
          title: "Upsell Strategy",
          url: "https://www.youtube.com/watch?v=5NvQ9bY9gHI",
        },
      ],
      [
        {
          title: "Retention Strategy",
          url: "https://www.youtube.com/watch?v=8JQl3X1bG1Y",
        },
      ],
      [{ title: "Revenue Review Template", url: "https://www.notion.so/" }],
    ],
    // Week 12
    [
      [
        {
          title: "Product Launch Guide",
          url: "https://www.youtube.com/watch?v=Xv7-VEL-0Fk",
        },
      ],
      [
        {
          title: "Revenue Scaling Guide",
          url: "https://www.youtube.com/watch?v=KxVxZP7VHMc",
        },
      ],
      [
        {
          title: "Brand Evolution Guide",
          url: "https://www.youtube.com/watch?v=K3yQMg0FzLE",
        },
      ],
      [
        {
          title: "Market Positioning",
          url: "https://www.youtube.com/watch?v=1vzQ8VG5rRs",
        },
      ],
      [{ title: "Strategic Planning Guide", url: "https://www.notion.so/" }],
      [{ title: "System Optimization", url: "https://www.notion.so/" }],
      [{ title: "Evolution Review Template", url: "https://www.notion.so/" }],
    ],
    // Week 13
    [
      [{ title: "Performance Review Template", url: "https://www.notion.so/" }],
      [
        {
          title: "Metrics Analysis Guide",
          url: "https://sproutsocial.com/insights/analyze-social-media/",
        },
      ],
      [{ title: "Optimization Framework", url: "https://www.notion.so/" }],
      [{ title: "Strategic Planning Template", url: "https://www.notion.so/" }],
      [{ title: "System Refinement Guide", url: "https://www.notion.so/" }],
      [{ title: "90-Day Completion Review", url: "https://buffer.com/analyze" }],
      [{ title: "DUAL BRAND ASCENSION COMPLETE", url: "https://www.youtube.com/@NickBare" }],
    ],
  ];
  const dayResources = allResources[weekNum - 1]?.[dayIndex] || [];
  const normalizedDay = dayResources.map((r) =>
    normalizeResource({
      ...r,
      type: r.type || (r.platform === 'YouTube' ? 'youtube' : r.category === 'Tutorial' ? 'article' : 'tool'),
      description: r.description || r.title,
    })
  );
  return [...DUAL_BRAND_CURATED_RESOURCES, ...normalizedDay];
}

function getPersonalBrandTasks(weekNum, dayIndex) {
  // Use execution plan for Week 2+ (Week 1 is testing)
  // Note: Import handled dynamically to avoid circular dependencies
  try {
    if (weekNum >= 2) {
      const { getExecutionTasks } = require('./dualBrandExecutionPlan.js');
      const executionTasks = getExecutionTasks(weekNum, dayIndex, 'personal');
      if (executionTasks && executionTasks.personal && executionTasks.personal.length > 0) {
        return executionTasks.personal;
      }
    }
  } catch (e) {
    // Fallback if execution plan not available
  }

  // Fallback for Week 1 or if execution plan not available
  const tasks = [
    [
      "Define Personal Brand (_richman.oo7) mission in 1 sentence",
      "Choose Personal Brand colors (use Canva palette)",
      "Create/optimize Personal Brand Instagram, TikTok, X, Threads, LinkedIn, YouTube, GitHub profiles",
      "Set up Buffer/Hootsuite account & connect all 7 platforms",
      "Define 3 Personal Brand content pillars (keep it simple)",
      "Write bios for all Personal Brand platforms (use templates)",
      "Test automation: Schedule 1 test post to all platforms",
    ],
    [
      "Create 3 Personal Brand Instagram posts → Schedule in Buffer for next 3 days",
      "Create 5 Personal Brand X/Twitter threads → Schedule in Buffer for next 5 days",
      "Create 3 Personal Brand Threads posts → Schedule in Buffer for next 3 days",
      "Create 2 Personal Brand TikTok videos → Schedule in Buffer for next 2 days",
      "Create 3 Personal Brand LinkedIn posts → Schedule in Buffer for next 3 days",
      "Update Personal Brand GitHub profile & README",
      "Verify all Week 2 content is scheduled & auto-posting",
      "Check Buffer dashboard - ensure all posts are queued",
    ],
    [
      "Define _richman.oo7 engagement tactics",
      "Set up _richman.oo7 analytics tracking",
      "Design _richman.oo7 growth loop",
      "Create _richman.oo7 Discord server",
      "Identify 5 _richman.oo7 collaboration targets",
      "Engage with 20 target accounts",
      "Review growth metrics",
    ],
    [
      "Refine _richman.oo7 unique value proposition",
      "Plan _richman.oo7 thought leadership content",
      "Create _richman.oo7 freebie (wealth mindset PDF)",
      "Set up _richman.oo7 email list",
      "Research _richman.oo7 monetization paths",
      "Plan _richman.oo7 landing page structure",
      "Review monetization foundation",
    ],
    [
      "Analyze top-performing _richman.oo7 content",
      "Create improved versions of top formats",
      "Deep dive into _richman.oo7 audience insights",
      "Build detailed _richman.oo7 content calendar",
      "Optimize _richman.oo7 profiles for search",
      "Research and test _richman.oo7 hashtag sets",
      "Review optimization results",
    ],
    [
      "Brainstorm _richman.oo7 digital product ideas",
      "Validate _richman.oo7 product with audience survey",
      "Create _richman.oo7 product outline/curriculum",
      "Start building _richman.oo7 MVP",
      "Research _richman.oo7 product pricing models",
      "Plan _richman.oo7 product launch sequence",
      "Review product development progress",
    ],
    [
      "Design _richman.oo7 service packages",
      "Set _richman.oo7 service pricing",
      "Create _richman.oo7 service sales deck",
      "Design _richman.oo7 client onboarding process",
      "Outline _richman.oo7 service delivery framework",
      "Collect/request _richman.oo7 testimonials",
      "Review service offerings",
    ],
    [
      "Research _richman.oo7 digital product options",
      "Begin creating _richman.oo7 first digital product",
      "Set up _richman.oo7 product sales page/shop",
      "Create _richman.oo7 product launch marketing plan",
      "Identify _richman.oo7 product distribution channels",
      "Finalize _richman.oo7 digital product",
      "Review all monetization pathways",
    ],
    [
      "Identify _richman.oo7 automation needs",
      "Set up _richman.oo7 automated workflows",
      "Automate _richman.oo7 content posting schedule",
      "Set up _richman.oo7 lead capture automation",
      "Document _richman.oo7 brand systems & processes",
      "Plan _richman.oo7 team expansion",
      "Review automation & scaling progress",
    ],
    [
      "Expand _richman.oo7 to additional platforms",
      "Reach out to 5 _richman.oo7 collaboration targets",
      "Plan _richman.oo7 cross-promotion campaigns",
      "Create _richman.oo7 guest content for partners",
      "Develop _richman.oo7 strategic partnerships",
      "Build _richman.oo7 professional network",
      "Review growth & collaboration results",
    ],
    [
      "Diversify _richman.oo7 revenue streams",
      "Create _richman.oo7 high-authority content piece",
      "Pitch _richman.oo7 for speaking/media opportunities",
      "Develop _richman.oo7 premium tier offerings",
      "Create _richman.oo7 upsell/cross-sell systems",
      "Design _richman.oo7 client retention strategy",
      "Review revenue expansion progress",
    ],
    [
      "Launch _richman.oo7 advanced product/service",
      "Scale _richman.oo7 revenue-generating activities",
      "Evolve _richman.oo7 brand positioning",
      "Strengthen _richman.oo7 market position",
      "Plan _richman.oo7 next 90 days",
      "Optimize _richman.oo7 all systems",
      "Review brand evolution & monetization",
    ],
    [
      "Comprehensive _richman.oo7 90-day review",
      "Analyze all _richman.oo7 key metrics",
      "Create _richman.oo7 optimization action plan",
      "Develop _richman.oo7 next 90-day strategy",
      "Refine _richman.oo7 all operational systems",
      "Celebrate _richman.oo7 achievements",
      "DUAL BRAND ASCENSION COMPLETE",
    ],
  ];
  return tasks[weekNum - 1]?.[dayIndex] || "Personal brand task";
}

function getCompanyBrandTasks(weekNum, dayIndex) {
  // Use execution plan for Week 2+ (Week 1 is testing)
  try {
    if (weekNum >= 2) {
      const executionTasks = getExecutionTasks(weekNum, dayIndex, 'company');
      if (executionTasks && executionTasks.company && executionTasks.company.length > 0) {
        return executionTasks.company;
      }
    }
  } catch (e) {
    // Fallback if execution plan not available
  }

  // Fallback for Week 1 or if execution plan not available
  const tasks = [
    [
      "Define Company Brand (_ryxen.oo7) mission in 1 sentence",
      "Choose Company Brand colors (use Canva palette)",
      "Create/optimize Company Brand Instagram, TikTok, X, Threads, LinkedIn, YouTube, GitHub profiles",
      "Set up Buffer/Hootsuite account & connect all 7 platforms for _ryxen.oo7",
      "Define 3 Company Brand content pillars (keep it simple)",
      "Write bios for all Company Brand platforms (use templates)",
      "Test automation: Schedule 1 test post to all platforms",
    ],
    [
      "Create 3 _ryxen.oo7 Instagram posts → Schedule in Buffer for next 3 days",
      "Create 3 _ryxen.oo7 LinkedIn posts → Schedule in Buffer for next 3 days",
      "Create 5 _ryxen.oo7 X/Twitter threads → Schedule in Buffer for next 5 days",
      "Create 3 _ryxen.oo7 Threads posts → Schedule in Buffer for next 3 days",
      "Create 2 _ryxen.oo7 TikTok videos → Schedule in Buffer for next 2 days",
      "Create 2 _ryxen.oo7 YouTube Shorts scripts → Schedule in Buffer",
      "Update _ryxen.oo7 GitHub profile & README",
      "Verify all Week 2 content is scheduled & auto-posting",
      "Check Buffer dashboard - ensure all posts are queued",
    ],
    [
      "Define _ryxen.oo7 engagement tactics",
      "Set up _ryxen.oo7 analytics tracking",
      "Design _ryxen.oo7 growth loop",
      "Create _ryxen.oo7 Telegram group",
      "Identify 5 _ryxen.oo7 collaboration targets",
      "Engage with 20 target accounts",
      "Review growth metrics",
    ],
    [
      "Refine _ryxen.oo7 service packages",
      "Plan _ryxen.oo7 case study content series",
      "Create _ryxen.oo7 freebie (automation checklist)",
      "Set up _ryxen.oo7 email list",
      "Research _ryxen.oo7 monetization paths",
      "Plan _ryxen.oo7 service page structure",
      "Review monetization foundation",
    ],
    [
      "Analyze top-performing _ryxen.oo7 content",
      "Create improved versions of top formats",
      "Deep dive into _ryxen.oo7 audience insights",
      "Build detailed _ryxen.oo7 content calendar",
      "Optimize _ryxen.oo7 profiles for search",
      "Research and test _ryxen.oo7 hashtag sets",
      "Review optimization results",
    ],
    [
      "Brainstorm _ryxen.oo7 SaaS/software product ideas",
      "Validate _ryxen.oo7 product with potential clients",
      "Create _ryxen.oo7 product feature roadmap",
      "Start building _ryxen.oo7 MVP",
      "Research _ryxen.oo7 product pricing models",
      "Plan _ryxen.oo7 product launch sequence",
      "Review product development progress",
    ],
    [
      "Design _ryxen.oo7 service packages",
      "Set _ryxen.oo7 service pricing",
      "Create _ryxen.oo7 service proposal template",
      "Design _ryxen.oo7 client onboarding process",
      "Outline _ryxen.oo7 service delivery framework",
      "Collect/request _ryxen.oo7 testimonials",
      "Review service offerings",
    ],
    [
      "Research _ryxen.oo7 digital product options",
      "Begin creating _ryxen.oo7 first digital product",
      "Set up _ryxen.oo7 product sales page/shop",
      "Create _ryxen.oo7 product launch marketing plan",
      "Identify _ryxen.oo7 product distribution channels",
      "Finalize _ryxen.oo7 digital product",
      "Review all monetization pathways",
    ],
    [
      "Identify _ryxen.oo7 automation needs",
      "Set up _ryxen.oo7 automated workflows",
      "Automate _ryxen.oo7 content posting schedule",
      "Set up _ryxen.oo7 lead capture automation",
      "Document _ryxen.oo7 brand systems & processes",
      "Plan _ryxen.oo7 team expansion",
      "Review automation & scaling progress",
    ],
    [
      "Expand _ryxen.oo7 to additional platforms",
      "Reach out to 5 _ryxen.oo7 collaboration targets",
      "Plan _ryxen.oo7 cross-promotion campaigns",
      "Create _ryxen.oo7 guest content for partners",
      "Develop _ryxen.oo7 strategic partnerships",
      "Build _ryxen.oo7 professional network",
      "Review growth & collaboration results",
    ],
    [
      "Diversify _ryxen.oo7 revenue streams",
      "Create _ryxen.oo7 high-authority content piece",
      "Pitch _ryxen.oo7 for speaking/media opportunities",
      "Develop _ryxen.oo7 premium tier offerings",
      "Create _ryxen.oo7 upsell/cross-sell systems",
      "Design _ryxen.oo7 client retention strategy",
      "Review revenue expansion progress",
    ],
    [
      "Launch _ryxen.oo7 advanced product/service",
      "Scale _ryxen.oo7 revenue-generating activities",
      "Evolve _ryxen.oo7 brand positioning",
      "Strengthen _ryxen.oo7 market position",
      "Plan _ryxen.oo7 next 90 days",
      "Optimize _ryxen.oo7 all systems",
      "Review brand evolution & monetization",
    ],
    [
      "Comprehensive _ryxen.oo7 90-day review",
      "Analyze all _ryxen.oo7 key metrics",
      "Create _ryxen.oo7 optimization action plan",
      "Develop _ryxen.oo7 next 90-day strategy",
      "Refine _ryxen.oo7 all operational systems",
      "Celebrate _ryxen.oo7 achievements",
      "DUAL BRAND ASCENSION COMPLETE",
    ],
  ];
  return tasks[weekNum - 1]?.[dayIndex] || "Company brand task";
}

function getDualBrandTheme(weekNum) {
  const themes = [
    "Brand Foundation, Voice, Visual Identity, Platform Setup",
    "Content Pillars, Batch Creation, Soft Posting",
    "Engagement, Growth, Analytics Setup",
    "Monetization Foundation, Authority Building",
    "Content Optimization, Audience Deep Dive",
    "Monetization Pathway 1: Product Development",
    "Monetization Pathway 2: Service Offerings",
    "Monetization Pathway 3: Digital Products",
    "Scaling Systems, Automation",
    "Cross-Platform Growth, Collaboration",
    "Revenue Expansion, Authority Positioning",
    "Advanced Monetization, Brand Evolution",
    "Optimization, Review, Next Phase Planning",
  ];
  return themes[weekNum - 1] || "Brand Building Theme";
}

function getDualBrandOutcome(weekNum, dayIndex) {
  const outcomes = [
    [
      "Mission statements for both brands (1 sentence each)",
      "Color palettes chosen (Canva)",
      "7 platforms set up per brand (Instagram, TikTok, X, Threads, LinkedIn, YouTube, GitHub)",
      "Buffer/Hootsuite accounts created & all 14 platforms connected",
      "3 content pillars defined per brand",
      "Bios written for all platforms",
      "Automation tested - 1 post scheduled to all platforms",
    ],
    [
      "3 Instagram posts created & scheduled",
      "5 X/Twitter threads created & scheduled",
      "3 Threads posts created & scheduled",
      "3 TikTok videos created & scheduled",
      "3 LinkedIn posts created & scheduled",
      "All content auto-posting via Buffer/Hootsuite",
      "Week 2: Automation working - no manual posting needed",
    ],
    [
      "Engagement plan per brand",
      "Analytics dashboards configured",
      "Growth loop systems designed",
      "Community spaces launched",
      "Collaboration list prepared",
      "Daily engagement habit started",
      "Week 3 growth strategy active",
    ],
    [
      "Clear value props defined",
      "Authority content calendar",
      "Lead magnets designed",
      "Email systems configured",
      "Monetization roadmap draft",
      "Website structure planned",
      "Week 4 foundation complete",
    ],
    [
      "Top content patterns identified",
      "Iterated content created",
      "Audience personas refined",
      "30-day calendars complete",
      "Profiles fully optimized",
      "Hashtag strategies implemented",
      "Week 5 optimization complete",
    ],
    [
      "Product ideas list created",
      "Product validation complete",
      "Product plans detailed",
      "MVP development started",
      "Pricing strategies defined",
      "Launch plans drafted",
      "Week 6 product foundation set",
    ],
    [
      "Service packages defined",
      "Pricing models established",
      "Sales materials ready",
      "Onboarding systems created",
      "Delivery frameworks ready",
      "Testimonial strategy in place",
      "Week 7 service packages ready",
    ],
    [
      "Product types selected",
      "Products in development",
      "Sales pages configured",
      "Marketing plans ready",
      "Distribution channels mapped",
      "Products ready for launch",
      "Week 8 digital products ready",
    ],
    [
      "Automation tools selected",
      "Workflows configured",
      "Posting automated",
      "Lead systems automated",
      "Systems documented",
      "Team plans prepared",
      "Week 9 systems optimized",
    ],
    [
      "New platforms active",
      "Collaboration conversations started",
      "Cross-promo plans ready",
      "Guest content prepared",
      "Partnerships initiated",
      "Networks expanded",
      "Week 10 growth accelerated",
    ],
    [
      "Revenue streams mapped",
      "Authority pieces published",
      "Media pitches sent",
      "Premium tiers designed",
      "Upsell systems ready",
      "Retention plans in place",
      "Week 11 revenue expanded",
    ],
    [
      "Advanced offerings live",
      "Revenue scaling active",
      "Brands evolved",
      "Market positions solidified",
      "Next phase planned",
      "Systems optimized",
      "Week 12 evolution complete",
    ],
    [
      "Reviews completed",
      "Metrics analyzed",
      "Optimization plans ready",
      "Next phase strategies set",
      "Systems refined",
      "DUAL BRAND ASCENSION COMPLETE",
      "Celebration",
    ],
  ];
  return outcomes[weekNum - 1]?.[dayIndex] || "Task outcome";
}

function getDualBrandProject(weekNum, dayIndex) {
  const projects = [
    // Week 1: Brand Foundation
    [
      {
        title: "Brand Identity Project",
        description:
          "Create mission statements, values, and target personas for both _richman.oo7 and _ryxen.oo7 brands",
        requirements: [
          "Define _richman.oo7 mission & values",
          "Define _ryxen.oo7 mission & positioning",
          "Create target persona documents",
          "Document brand voice guidelines",
        ],
      },
      {
        title: "Visual Identity Project",
        description:
          "Design logo concepts and brand guidelines for both brands",
        requirements: [
          "Create _richman.oo7 logo concepts",
          "Create _ryxen.oo7 logo concepts",
          "Develop color palettes",
          "Create brand guideline documents",
        ],
      },
      {
        title: "Social Platform Setup Project",
        description:
          "Set up and optimize social media profiles for both brands",
        requirements: [
          "Create/optimize Instagram profiles",
          "Create/optimize TikTok profiles",
          "Create/optimize X (Twitter) profiles",
          "Create/optimize Threads profiles",
          "Create/optimize LinkedIn profiles",
          "Create/optimize YouTube channels",
          "Create/optimize GitHub profiles",
        ],
      },
      {
        title: "Video Platform Setup Project",
        description: "Create and optimize YouTube channels for both brands",
        requirements: [
          "Create _richman.oo7 YouTube channel",
          "Create _ryxen.oo7 YouTube channel",
          "Optimize channel descriptions",
          "Design channel art",
        ],
      },
      {
        title: "Content Pillars Project",
        description: "Define content pillars and strategy for both brands",
        requirements: [
          "Define 5 _richman.oo7 content pillars",
          "Define 5 _ryxen.oo7 content pillars",
          "Create content strategy documents",
          "Plan content calendar structure",
        ],
      },
      {
        title: "Bio Writing Project",
        description: "Write compelling bios for all platforms for both brands",
        requirements: [
          "Write _richman.oo7 bios for all platforms",
          "Write _ryxen.oo7 bios for all platforms",
          "Optimize for each platform",
          "Ensure brand consistency",
        ],
      },
      {
        title: "Week 1 Reflection Project",
        description: "Review foundation work and plan content calendar",
        requirements: [
          "Review all foundation work",
          "Plan Week 2 content calendar",
          "Document lessons learned",
          "Set Week 2 goals",
        ],
      },
    ],
    // Week 2: Content Creation
    [
      {
        title: "Content Batch Creation Project",
        description: "Create Instagram posts for both brands",
        requirements: [
          "Create 3 _richman.oo7 Instagram posts",
          "Create 3 _ryxen.oo7 Instagram posts",
          "Design graphics/captions",
          "Schedule posts",
        ],
      },
      {
        title: "Thread Writing Project",
        description: "Create X/Twitter threads for both brands",
        requirements: [
          "Write 5 _richman.oo7 threads",
          "Write 5 _ryxen.oo7 threads",
          "Optimize for engagement",
          "Schedule threads",
        ],
      },
      {
        title: "Video Script Project",
        description: "Script YouTube Shorts for both brands",
        requirements: [
          "Script 2 _richman.oo7 YouTube Shorts",
          "Script 2 _ryxen.oo7 YouTube Shorts",
          "Plan visuals",
          "Prepare shooting schedule",
        ],
      },
      {
        title: "TikTok Content Project",
        description: "Create TikTok videos for both brands",
        requirements: [
          "Create 3 _richman.oo7 TikTok videos",
          "Create 3 _ryxen.oo7 TikTok videos",
          "Edit and optimize",
        ],
      },
      {
        title: "Threads Content Project",
        description: "Create Threads posts for both brands",
        requirements: [
          "Create 3 _richman.oo7 Threads posts",
          "Create 3 _ryxen.oo7 Threads posts",
          "Engage with community",
        ],
      },
      {
        title: "GitHub Profile Project",
        description: "Optimize GitHub profiles for both brands",
        requirements: [
          "Update _richman.oo7 GitHub profile & README",
          "Update _ryxen.oo7 GitHub profile & README",
          "Create pinned repositories",
          "Add project showcases",
          "Schedule uploads",
        ],
      },
      {
        title: "Content Scheduling Project",
        description: "Set up content scheduling system for Week 3",
        requirements: [
          "Set up scheduling tool",
          "Schedule Week 3 content",
          "Create posting calendar",
          "Set reminders",
        ],
      },
      {
        title: "Content Audit Project",
        description: "Review all created content for quality and consistency",
        requirements: [
          "Review all _richman.oo7 content",
          "Review all _ryxen.oo7 content",
          "Check brand voice consistency",
          "Identify improvements",
        ],
      },
      {
        title: "Content Performance Analysis Project",
        description: "Analyze what content resonated and plan improvements",
        requirements: [
          "Analyze engagement metrics",
          "Identify top performers",
          "Plan content improvements",
          "Document insights",
        ],
      },
    ],
    // Week 3: Engagement & Growth
    [
      {
        title: "Engagement Strategy Project",
        description: "Define engagement tactics for both brands",
        requirements: [
          "Define _richman.oo7 engagement tactics",
          "Define _ryxen.oo7 engagement tactics",
          "Create engagement schedule",
          "Set engagement goals",
        ],
      },
      {
        title: "Analytics Setup Project",
        description: "Set up analytics tracking for both brands",
        requirements: [
          "Set up _richman.oo7 analytics dashboards",
          "Set up _ryxen.oo7 analytics dashboards",
          "Configure tracking tools",
          "Create reporting system",
        ],
      },
      {
        title: "Growth Loop Design Project",
        description: "Design growth loop systems for both brands",
        requirements: [
          "Design _richman.oo7 growth loop",
          "Design _ryxen.oo7 growth loop",
          "Map user journey",
          "Plan automation",
        ],
      },
      {
        title: "Community Building Project",
        description: "Launch community spaces for both brands",
        requirements: [
          "Create _richman.oo7 Discord server",
          "Create _ryxen.oo7 Telegram group",
          "Set up community guidelines",
          "Plan engagement activities",
        ],
      },
      {
        title: "Collaboration Prep Project",
        description: "Identify and prepare collaboration targets",
        requirements: [
          "Identify 5 _richman.oo7 collaboration targets",
          "Identify 5 _ryxen.oo7 collaboration targets",
          "Research potential partners",
          "Prepare outreach templates",
        ],
      },
      {
        title: "Engagement Execution Project",
        description: "Execute daily engagement with target accounts",
        requirements: [
          "Engage with 20 _richman.oo7 target accounts",
          "Engage with 20 _ryxen.oo7 target accounts",
          "Build relationships",
          "Track engagement",
        ],
      },
      {
        title: "Growth Metrics Review Project",
        description: "Review growth metrics and adjust strategy",
        requirements: [
          "Review growth metrics",
          "Analyze what worked",
          "Adjust strategy",
          "Plan Week 4",
        ],
      },
    ],
    // Week 4: Monetization Foundation
    [
      {
        title: "Value Proposition Project",
        description: "Refine unique value propositions for both brands",
        requirements: [
          "Refine _richman.oo7 value proposition",
          "Refine _ryxen.oo7 value proposition",
          "Create value prop statements",
          "Test messaging",
        ],
      },
      {
        title: "Authority Content Planning Project",
        description: "Plan thought leadership content for both brands",
        requirements: [
          "Plan _richman.oo7 thought leadership content",
          "Plan _ryxen.oo7 case study series",
          "Create content calendar",
          "Set publishing schedule",
        ],
      },
      {
        title: "Lead Magnet Creation Project",
        description: "Create lead magnets for both brands",
        requirements: [
          "Create _richman.oo7 freebie (wealth mindset PDF)",
          "Create _ryxen.oo7 freebie (automation checklist)",
          "Design landing pages",
          "Set up email capture",
        ],
      },
      {
        title: "Email List Setup Project",
        description: "Set up email marketing systems for both brands",
        requirements: [
          "Set up _richman.oo7 email list",
          "Set up _ryxen.oo7 email list",
          "Configure email platform",
          "Create welcome sequences",
        ],
      },
      {
        title: "Monetization Research Project",
        description: "Research monetization paths for both brands",
        requirements: [
          "Research _richman.oo7 monetization paths",
          "Research _ryxen.oo7 monetization paths",
          "Analyze competitors",
          "Create monetization roadmap",
        ],
      },
      {
        title: "Website Planning Project",
        description: "Plan website structure for both brands",
        requirements: [
          "Plan _richman.oo7 landing page structure",
          "Plan _ryxen.oo7 service page structure",
          "Create site maps",
          "Plan content strategy",
        ],
      },
      {
        title: "Monetization Foundation Review Project",
        description: "Review monetization foundation and plan next steps",
        requirements: [
          "Review monetization foundation",
          "Document strategies",
          "Plan implementation",
          "Set Week 5 goals",
        ],
      },
    ],
    // Week 5: Content Optimization
    [
      {
        title: "Content Performance Analysis Project",
        description: "Analyze top-performing content for both brands",
        requirements: [
          "Analyze top _richman.oo7 content",
          "Analyze top _ryxen.oo7 content",
          "Identify patterns",
          "Document insights",
        ],
      },
      {
        title: "Content Iteration Project",
        description: "Create improved versions of top content formats",
        requirements: [
          "Create improved _richman.oo7 content",
          "Create improved _ryxen.oo7 content",
          "Test new formats",
          "Schedule content",
        ],
      },
      {
        title: "Audience Research Project",
        description: "Deep dive into audience insights for both brands",
        requirements: [
          "Research _richman.oo7 audience insights",
          "Research _ryxen.oo7 audience insights",
          "Create audience personas",
          "Refine targeting",
        ],
      },
      {
        title: "Content Calendar Project",
        description: "Build detailed content calendars for both brands",
        requirements: [
          "Build 30-day _richman.oo7 calendar",
          "Build 30-day _ryxen.oo7 calendar",
          "Plan content themes",
          "Schedule posts",
        ],
      },
      {
        title: "Profile Optimization Project",
        description: "Optimize all profiles for search and discovery",
        requirements: [
          "Optimize _richman.oo7 profiles",
          "Optimize _ryxen.oo7 profiles",
          "Improve SEO",
          "Update keywords",
        ],
      },
      {
        title: "Hashtag Strategy Project",
        description: "Research and test hashtag sets for both brands",
        requirements: [
          "Research _richman.oo7 hashtag sets",
          "Research _ryxen.oo7 hashtag sets",
          "Test hashtags",
          "Document results",
        ],
      },
      {
        title: "Optimization Review Project",
        description: "Review optimization results and plan improvements",
        requirements: [
          "Review optimization results",
          "Analyze improvements",
          "Plan next optimizations",
          "Set Week 6 goals",
        ],
      },
    ],
    // Week 6: Product Development
    [
      {
        title: "Product Ideation Project",
        description: "Brainstorm digital product ideas for both brands",
        requirements: [
          "Brainstorm _richman.oo7 product ideas",
          "Brainstorm _ryxen.oo7 product ideas",
          "Research market demand",
          "Create idea list",
        ],
      },
      {
        title: "Product Validation Project",
        description: "Validate products with audience surveys",
        requirements: [
          "Validate _richman.oo7 product with survey",
          "Validate _ryxen.oo7 product with clients",
          "Analyze feedback",
          "Refine ideas",
        ],
      },
      {
        title: "Product Planning Project",
        description: "Create detailed product plans for both brands",
        requirements: [
          "Create _richman.oo7 product outline",
          "Create _ryxen.oo7 product roadmap",
          "Plan features",
          "Set timelines",
        ],
      },
      {
        title: "MVP Development Project",
        description: "Start building MVPs for both brands",
        requirements: [
          "Start building _richman.oo7 MVP",
          "Start building _ryxen.oo7 MVP",
          "Set up development environment",
          "Create prototypes",
        ],
      },
      {
        title: "Pricing Strategy Project",
        description: "Research and set pricing models for both brands",
        requirements: [
          "Research _richman.oo7 pricing models",
          "Research _ryxen.oo7 pricing models",
          "Set pricing structure",
          "Test pricing",
        ],
      },
      {
        title: "Launch Planning Project",
        description: "Plan product launch sequences for both brands",
        requirements: [
          "Plan _richman.oo7 launch sequence",
          "Plan _ryxen.oo7 launch sequence",
          "Create launch calendar",
          "Prepare marketing",
        ],
      },
      {
        title: "Product Development Review Project",
        description: "Review product development progress and plan next steps",
        requirements: [
          "Review development progress",
          "Assess MVP status",
          "Plan completion",
          "Set Week 7 goals",
        ],
      },
    ],
    // Week 7: Service Offerings
    [
      {
        title: "Service Package Design Project",
        description: "Design service packages for both brands",
        requirements: [
          "Design _richman.oo7 service packages",
          "Design _ryxen.oo7 service packages",
          "Define deliverables",
          "Create packages",
        ],
      },
      {
        title: "Service Pricing Project",
        description: "Set service pricing for both brands",
        requirements: [
          "Set _richman.oo7 service pricing",
          "Set _ryxen.oo7 service pricing",
          "Create pricing tiers",
          "Document pricing",
        ],
      },
      {
        title: "Sales Materials Project",
        description: "Create sales materials for both brands",
        requirements: [
          "Create _richman.oo7 sales deck",
          "Create _ryxen.oo7 proposal template",
          "Design materials",
          "Prepare presentations",
        ],
      },
      {
        title: "Client Onboarding Project",
        description: "Design client onboarding processes for both brands",
        requirements: [
          "Design _richman.oo7 onboarding process",
          "Design _ryxen.oo7 onboarding process",
          "Create workflows",
          "Document processes",
        ],
      },
      {
        title: "Service Delivery Project",
        description: "Outline service delivery frameworks for both brands",
        requirements: [
          "Outline _richman.oo7 delivery framework",
          "Outline _ryxen.oo7 delivery framework",
          "Create templates",
          "Set standards",
        ],
      },
      {
        title: "Testimonial Strategy Project",
        description: "Create testimonial collection strategy for both brands",
        requirements: [
          "Create _richman.oo7 testimonial strategy",
          "Create _ryxen.oo7 testimonial strategy",
          "Design collection process",
          "Plan showcase",
        ],
      },
      {
        title: "Service Review Project",
        description: "Review service offerings and plan improvements",
        requirements: [
          "Review service offerings",
          "Assess readiness",
          "Plan improvements",
          "Set Week 8 goals",
        ],
      },
    ],
    // Week 8: Digital Products
    [
      {
        title: "Digital Product Research Project",
        description: "Research digital product options for both brands",
        requirements: [
          "Research _richman.oo7 product options",
          "Research _ryxen.oo7 product options",
          "Analyze market",
          "Select products",
        ],
      },
      {
        title: "Digital Product Creation Project",
        description: "Begin creating first digital products for both brands",
        requirements: [
          "Begin _richman.oo7 product creation",
          "Begin _ryxen.oo7 product creation",
          "Set up workspace",
          "Start development",
        ],
      },
      {
        title: "E-commerce Setup Project",
        description: "Set up product sales pages and shops for both brands",
        requirements: [
          "Set up _richman.oo7 sales page",
          "Set up _ryxen.oo7 product shop",
          "Configure payment",
          "Design pages",
        ],
      },
      {
        title: "Product Marketing Project",
        description: "Create product launch marketing plans for both brands",
        requirements: [
          "Create _richman.oo7 marketing plan",
          "Create _ryxen.oo7 marketing plan",
          "Plan campaigns",
          "Schedule launches",
        ],
      },
      {
        title: "Distribution Strategy Project",
        description: "Identify product distribution channels for both brands",
        requirements: [
          "Identify _richman.oo7 distribution channels",
          "Identify _ryxen.oo7 distribution channels",
          "Plan distribution",
          "Set up channels",
        ],
      },
      {
        title: "Product Completion Project",
        description: "Finalize digital products for both brands",
        requirements: [
          "Finalize _richman.oo7 product",
          "Finalize _ryxen.oo7 product",
          "Quality check",
          "Prepare launch",
        ],
      },
      {
        title: "Monetization Review Project",
        description: "Review all monetization pathways and plan next steps",
        requirements: [
          "Review all pathways",
          "Assess progress",
          "Plan expansion",
          "Set Week 9 goals",
        ],
      },
    ],
    // Week 9: Automation & Scaling
    [
      {
        title: "Automation Tools Project",
        description:
          "Identify automation needs and select tools for both brands",
        requirements: [
          "Identify _richman.oo7 automation needs",
          "Identify _ryxen.oo7 automation needs",
          "Research tools",
          "Select solutions",
        ],
      },
      {
        title: "Workflow Automation Project",
        description: "Set up automated workflows for both brands",
        requirements: [
          "Set up _richman.oo7 workflows",
          "Set up _ryxen.oo7 workflows",
          "Configure automation",
          "Test systems",
        ],
      },
      {
        title: "Content Automation Project",
        description: "Automate content posting schedules for both brands",
        requirements: [
          "Automate _richman.oo7 posting",
          "Automate _ryxen.oo7 posting",
          "Set schedules",
          "Monitor automation",
        ],
      },
      {
        title: "Lead Automation Project",
        description: "Set up lead capture automation for both brands",
        requirements: [
          "Set up _richman.oo7 lead automation",
          "Set up _ryxen.oo7 lead automation",
          "Configure funnels",
          "Test systems",
        ],
      },
      {
        title: "System Documentation Project",
        description: "Document brand systems and processes for both brands",
        requirements: [
          "Document _richman.oo7 systems",
          "Document _ryxen.oo7 systems",
          "Create manuals",
          "Organize documentation",
        ],
      },
      {
        title: "Team Planning Project",
        description: "Plan team expansion for both brands",
        requirements: [
          "Plan _richman.oo7 team expansion",
          "Plan _ryxen.oo7 team expansion",
          "Define roles",
          "Create job descriptions",
        ],
      },
      {
        title: "Scaling Review Project",
        description: "Review automation and scaling progress",
        requirements: [
          "Review automation progress",
          "Assess scaling readiness",
          "Plan improvements",
          "Set Week 10 goals",
        ],
      },
    ],
    // Week 10: Growth & Collaboration
    [
      {
        title: "Platform Expansion Project",
        description: "Expand to additional platforms for both brands",
        requirements: [
          "Expand _richman.oo7 to new platforms",
          "Expand _ryxen.oo7 to new platforms",
          "Set up accounts",
          "Optimize profiles",
        ],
      },
      {
        title: "Collaboration Outreach Project",
        description: "Reach out to collaboration targets for both brands",
        requirements: [
          "Reach out to 5 _richman.oo7 targets",
          "Reach out to 5 _ryxen.oo7 targets",
          "Send pitches",
          "Follow up",
        ],
      },
      {
        title: "Cross-Promotion Project",
        description: "Plan cross-promotion campaigns for both brands",
        requirements: [
          "Plan _richman.oo7 cross-promo",
          "Plan _ryxen.oo7 cross-promo",
          "Create campaigns",
          "Schedule promotions",
        ],
      },
      {
        title: "Guest Content Project",
        description: "Create guest content for partners for both brands",
        requirements: [
          "Create _richman.oo7 guest content",
          "Create _ryxen.oo7 guest content",
          "Prepare submissions",
          "Pitch partners",
        ],
      },
      {
        title: "Partnership Development Project",
        description: "Develop strategic partnerships for both brands",
        requirements: [
          "Develop _richman.oo7 partnerships",
          "Develop _ryxen.oo7 partnerships",
          "Negotiate terms",
          "Formalize agreements",
        ],
      },
      {
        title: "Network Building Project",
        description: "Build professional networks for both brands",
        requirements: [
          "Build _richman.oo7 network",
          "Build _ryxen.oo7 network",
          "Attend events",
          "Connect with industry",
        ],
      },
      {
        title: "Growth Review Project",
        description: "Review growth and collaboration results",
        requirements: [
          "Review growth results",
          "Assess collaborations",
          "Plan next steps",
          "Set Week 11 goals",
        ],
      },
    ],
    // Week 11: Revenue Expansion
    [
      {
        title: "Revenue Diversification Project",
        description: "Map revenue streams for both brands",
        requirements: [
          "Map _richman.oo7 revenue streams",
          "Map _ryxen.oo7 revenue streams",
          "Analyze opportunities",
          "Plan diversification",
        ],
      },
      {
        title: "Authority Content Project",
        description: "Create high-authority content pieces for both brands",
        requirements: [
          "Create _richman.oo7 authority piece",
          "Create _ryxen.oo7 authority piece",
          "Publish content",
          "Promote pieces",
        ],
      },
      {
        title: "Media Pitching Project",
        description:
          "Pitch for speaking and media opportunities for both brands",
        requirements: [
          "Pitch _richman.oo7 for speaking",
          "Pitch _ryxen.oo7 for media",
          "Prepare pitches",
          "Follow up",
        ],
      },
      {
        title: "Premium Offerings Project",
        description: "Develop premium tier offerings for both brands",
        requirements: [
          "Develop _richman.oo7 premium tiers",
          "Develop _ryxen.oo7 premium tiers",
          "Design offerings",
          "Set pricing",
        ],
      },
      {
        title: "Upsell Systems Project",
        description: "Create upsell and cross-sell systems for both brands",
        requirements: [
          "Create _richman.oo7 upsell systems",
          "Create _ryxen.oo7 upsell systems",
          "Design funnels",
          "Test systems",
        ],
      },
      {
        title: "Retention Strategy Project",
        description: "Design client retention strategies for both brands",
        requirements: [
          "Design _richman.oo7 retention strategy",
          "Design _ryxen.oo7 retention strategy",
          "Create programs",
          "Implement systems",
        ],
      },
      {
        title: "Revenue Review Project",
        description: "Review revenue expansion progress",
        requirements: [
          "Review revenue progress",
          "Assess expansion",
          "Plan improvements",
          "Set Week 12 goals",
        ],
      },
    ],
    // Week 12: Advanced Monetization
    [
      {
        title: "Advanced Offerings Project",
        description: "Launch advanced products/services for both brands",
        requirements: [
          "Launch _richman.oo7 advanced offering",
          "Launch _ryxen.oo7 advanced offering",
          "Market launches",
          "Monitor performance",
        ],
      },
      {
        title: "Revenue Scaling Project",
        description: "Scale revenue-generating activities for both brands",
        requirements: [
          "Scale _richman.oo7 revenue activities",
          "Scale _ryxen.oo7 revenue activities",
          "Optimize processes",
          "Increase output",
        ],
      },
      {
        title: "Brand Evolution Project",
        description: "Evolve brand positioning for both brands",
        requirements: [
          "Evolve _richman.oo7 positioning",
          "Evolve _ryxen.oo7 positioning",
          "Update messaging",
          "Refresh brand",
        ],
      },
      {
        title: "Market Positioning Project",
        description: "Strengthen market positions for both brands",
        requirements: [
          "Strengthen _richman.oo7 position",
          "Strengthen _ryxen.oo7 position",
          "Analyze competition",
          "Differentiate brands",
        ],
      },
      {
        title: "Strategic Planning Project",
        description: "Plan next 90 days for both brands",
        requirements: [
          "Plan _richman.oo7 next 90 days",
          "Plan _ryxen.oo7 next 90 days",
          "Set goals",
          "Create roadmap",
        ],
      },
      {
        title: "System Optimization Project",
        description: "Optimize all systems for both brands",
        requirements: [
          "Optimize _richman.oo7 systems",
          "Optimize _ryxen.oo7 systems",
          "Improve efficiency",
          "Document improvements",
        ],
      },
      {
        title: "Evolution Review Project",
        description: "Review brand evolution and monetization",
        requirements: [
          "Review brand evolution",
          "Assess monetization",
          "Document achievements",
          "Plan celebration",
        ],
      },
    ],
    // Week 13: Review & Optimization
    [
      {
        title: "Performance Review Project",
        description: "Complete comprehensive 90-day review for both brands",
        requirements: [
          "Review _richman.oo7 90-day performance",
          "Review _ryxen.oo7 90-day performance",
          "Analyze metrics",
          "Document results",
        ],
      },
      {
        title: "Metrics Analysis Project",
        description: "Analyze all key metrics for both brands",
        requirements: [
          "Analyze _richman.oo7 metrics",
          "Analyze _ryxen.oo7 metrics",
          "Create reports",
          "Identify insights",
        ],
      },
      {
        title: "Optimization Planning Project",
        description: "Create optimization action plans for both brands",
        requirements: [
          "Create _richman.oo7 optimization plan",
          "Create _ryxen.oo7 optimization plan",
          "Set priorities",
          "Plan implementation",
        ],
      },
      {
        title: "Next Phase Strategy Project",
        description: "Develop next 90-day strategies for both brands",
        requirements: [
          "Develop _richman.oo7 next strategy",
          "Develop _ryxen.oo7 next strategy",
          "Set goals",
          "Create roadmap",
        ],
      },
      {
        title: "System Refinement Project",
        description: "Refine all operational systems for both brands",
        requirements: [
          "Refine _richman.oo7 systems",
          "Refine _ryxen.oo7 systems",
          "Improve processes",
          "Update documentation",
        ],
      },
      {
        title: "Journey Completion Project",
        description: "Celebrate achievements and complete dual brand ascension",
        requirements: [
          "Celebrate _richman.oo7 achievements",
          "Celebrate _ryxen.oo7 achievements",
          "Document success",
          "Plan next phase",
        ],
      },
      {
        title: "DUAL BRAND ASCENSION COMPLETE",
        description:
          "Congratulations! You have completed the 184-day Dual Brand Aether Journey",
        requirements: [
          "Reflect on journey",
          "Celebrate success",
          "Plan future growth",
          "Continue building",
        ],
      },
    ],
  ];

  return (
    projects[weekNum - 1]?.[dayIndex] || {
      title: "Dual Brand Project",
      description: "Continue building both _richman.oo7 and _ryxen.oo7 brands",
      requirements: [
        "Work on _richman.oo7 tasks",
        "Work on _ryxen.oo7 tasks",
        "Track progress",
        "Document results",
      ],
    }
  );
}

