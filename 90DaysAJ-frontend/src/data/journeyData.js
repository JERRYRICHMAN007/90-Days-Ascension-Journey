// Complete journey data with all 13 weeks
import { getExecutionTasks } from './dualBrandExecutionPlan.js';

export const journeys = [
  {
    id: "body-transformation",
    title: "Body Transformation",
    icon: "💪",
    timeBlock: "Time: 5:30-6:30 AM (Monday-Friday)",
    description: "Upper Body → Lower Body → Core → Functional → Mobility",
    totalDays: 90,
    color: "#667eea",
  },
  {
    id: "dual-brand",
    title: "Dual Brand",
    icon: "🎨",
    timeBlock: "Time: 5:00-6:00 PM (Mon-Fri), 3:00-4:00 AM (Sunday)",
    description: "_richman.oo7 (Personal) + _ryxen.oo7 (Company) Brand Building",
    totalDays: 90,
    color: "#f093fb",
  },
  {
    id: "reading",
    title: "Reading",
    icon: "📚",
    timeBlock: "Bible: 6:00-6:30 AM (Mon-Fri), 7:30-8:00 AM (Sat), 6:00-6:30 AM (Sun) | E-Book: 5:00-6:00 PM (Sat) | Physical: 7:00-8:00 PM (Sun)",
    description: "Bible → E-books → Physical Books",
    totalDays: 90,
    color: "#4facfe",
  },
  {
    id: "writers",
    title: "Writer's Journey",
    icon: "✍️",
    timeBlock: "Time: 12:30-1:00 PM (Weekdays)",
    description: "Learning → Execution → Reflection",
    totalDays: 84, // 12 weeks * 7 days
    color: "#43e97b",
  },
  {
    id: "software-engineering",
    title: "Software Engineering",
    icon: "💻",
    timeBlock: "Mobile: 6:45-8:00 AM (Mon-Wed), 1:30-3:00 PM Rev (Sat) | Frontend: 6:45-8:00 AM (Thu-Fri), 3:00-4:00 PM Rev (Sat) | Backend: 7:30-9:00 PM (Fri), 4:00-5:00 PM Rev (Sat) | WordPress: 5:00-6:00 AM (Sun)",
    description: "Mobile → Frontend → Backend → WordPress",
    totalDays: 90,
    color: "#fa709a",
  },
];

// OFFICIAL START DATE: All journeys start from February 8, 2026
// All weeks start on Sunday
// Week 1 starts on Sunday, February 8, 2026
// Day 0 = February 7, 2026 (Saturday) - Preparation/Setup Day (before Week 1)
// Day 1 = February 8, 2026 (Sunday) - First day of journey (Week 1, Day 1)
// Phase 1 (Days 1-90): Mobile Engineering + Frontend Engineering only
// Phase 2 (Days 91-180): Backend Engineering + WordPress
// All journeys: Weeks always start on Sunday, beginning from February 8, 2026

// All journeys start from February 8, 2026
const JOURNEY_START_DATE = "2026-02-08";

// Helper function to generate all weeks
// Starts from Week 1 (no Week 0)
// Ensures all weeks start on Sunday
// Journey begins February 1, 2026 - Week 1 starts on the Sunday that includes or follows Feb 1
function generateWeeks(startDate, numWeeks) {
  const weeks = [];
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  // Find the Sunday of the week containing the start date
  // If startDate is not a Sunday, find the next Sunday (or current if it's already Sunday)
  const dayOfWeek = start.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  // If it's Sunday, use it. Otherwise, go forward to the next Sunday
  const daysToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek; // Go forward to next Sunday
  const weekStartDate = new Date(start);
  weekStartDate.setDate(start.getDate() + daysToSunday);
  weekStartDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < numWeeks; i++) {
    const weekStart = new Date(weekStartDate);
    weekStart.setDate(weekStartDate.getDate() + i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Verify week starts on Sunday
    if (weekStart.getDay() !== 0) {
      console.warn(`Warning: Week ${i + 1} does not start on Sunday. Date: ${weekStart.toISOString().split("T")[0]}`);
    }

    weeks.push({
      weekNumber: i + 1, // Week 1, Week 2, etc. (no Week 0)
      startDate: weekStart.toISOString().split("T")[0],
      endDate: weekEnd.toISOString().split("T")[0],
      theme: getWeekTheme(i + 1), // Use i+1 for week numbering (Week 1, 2, 3...)
    });
  }

  return weeks;
}

function getWeekTheme(weekNum) {
  const themes = {
    1: "Foundation Week - Building the foundation for your journey",
    2: "Building Momentum - Consistency and habit formation",
    3: "Deepening Practice - Advanced techniques and refinement",
    4: "Integration Phase - Combining all elements",
    5: "Acceleration - Pushing boundaries and growth",
    6: "Mastery Development - Refining skills and systems",
    7: "Peak Performance - Maximum output and optimization",
    8: "Scaling Phase - Expanding reach and impact",
    9: "Innovation - New approaches and strategies",
    10: "Excellence - Pursuing perfection in execution",
    11: "Leadership - Guiding and inspiring others",
    12: "Transformation - Complete evolution and change",
    13: "Celebration - Reflecting on achievements and next steps",
  };
  return themes[weekNum] || "Week Theme";
}

// Helper functions for Body Transformation content
function getBodyTransformationLearning(weekNum, dayIndex) {
  const workoutTypes = [
    "Rest & Recovery",
    "Upper Body Strength",
    "Lower Body Strength",
    "Core + Cardio",
    "Functional Full-Body",
    "Mobility & Flexibility",
    "Active Recovery & Basketball",
  ];
  const focus = workoutTypes[dayIndex] || "Workout Session";

  const learningTopics = {
    0: [
      "Rest and recovery principles",
      "Active recovery techniques",
      "Sleep optimization for muscle growth",
      "Recovery nutrition strategies",
    ],
    1: [
      "Upper body anatomy basics",
      "Push-pull movement patterns",
      "Progressive overload principles",
      "Form and technique for upper body exercises",
    ],
    2: [
      "Lower body muscle groups",
      "Squat and deadlift fundamentals",
      "Leg day programming",
      "Lower body mobility",
    ],
    3: [
      "Core strength fundamentals",
      "Cardiovascular training principles",
      "HIIT vs steady-state cardio",
      "Core stability exercises",
    ],
    4: [
      "Functional movement patterns",
      "Full-body compound exercises",
      "Movement quality over quantity",
      "Functional strength applications",
    ],
    5: [
      "Flexibility and mobility basics",
      "Yoga principles for athletes",
      "Stretching techniques",
      "Mobility for injury prevention",
    ],
    6: [
      "Active recovery strategies",
      "Basketball as conditioning",
      "Recovery between games",
      "Weekend activity planning",
    ],
  };

  return {
    title: `${focus} - Learning Focus`,
    description: `Today's learning focus: Understanding ${focus.toLowerCase()} principles and techniques`,
    topics: learningTopics[dayIndex] || [
      "Workout fundamentals",
      "Form and technique",
      "Progressive overload",
      "Recovery principles",
    ],
  };
}

function getBodyTransformationProject(weekNum, dayIndex) {
  const workoutTypes = [
    "Rest & Recovery",
    "Upper Body Strength",
    "Lower Body Strength",
    "Core + Cardio",
    "Functional Full-Body",
    "Mobility & Flexibility",
    "Active Recovery & Basketball",
  ];
  const focus = workoutTypes[dayIndex] || "Workout Session";
  const workoutData = getWorkoutForDay(weekNum, dayIndex);

  return {
    title: `${focus} Workout Session`,
    description: `Complete today's ${focus.toLowerCase()} workout following the program`,
    requirements: [
      `Perform ${focus} workout`,
      workoutData.link
        ? `Follow workout video: ${workoutData.name}`
        : `Complete ${workoutData.name}`,
      "Track sets, reps, and weights",
      "Focus on proper form and technique",
      "Complete cooldown and stretching",
    ],
  };
}

function getBodyTransformationReflection(weekNum, dayIndex) {
  const reflections = [
    "How did my body feel during rest? What recovery strategies worked best?",
    "What upper body exercises felt strongest? Where can I improve form?",
    "How did my lower body respond? What progress did I notice?",
    "What was my energy level during cardio? How can I optimize intensity?",
    "Which functional movements felt natural? What needs more practice?",
    "How did flexibility work feel? What areas need more attention?",
    "What did I learn from this week? How will I apply it next week?",
  ];

  return {
    prompt: reflections[dayIndex] || "Reflect on today's workout and progress",
    questions: [
      "What went well today?",
      "What challenges did I face?",
      "How did I feel physically and mentally?",
      "What will I focus on improving tomorrow?",
    ],
  };
}

// Helper functions for Reading content
function getReadingLearning(weekNum, dayIndex) {
  const isWeekend = dayIndex >= 5;
  const readingSessions = isWeekend
    ? getWeekendReading(weekNum, dayIndex)
    : getWeekdayReading(weekNum, dayIndex);
  const theme = getReadingTheme(weekNum);

  const topics = [];
  readingSessions.forEach((session) => {
    if (session.type === "Bible Reading") {
      const bibleData = typeof session.material === 'object' ? session.material : { text: session.material };
      topics.push(
        `Bible Study: ${bibleData.text}`,
        "Spiritual wisdom and principles",
        "Applying biblical principles to daily life"
      );
    } else if (session.type === "E-Reading") {
      topics.push(
        `E-Book Reading: ${session.material}`,
        "Key concepts and takeaways",
        "Applying lessons to personal growth"
      );
    } else if (session.type === "Physical Book") {
      topics.push(
        `Physical Book: ${session.material}`,
        "Deep reading and comprehension",
        "Note-taking and reflection"
      );
    } else if (session.type === "Reflection") {
      topics.push(
        "Weekly reflection and journaling",
        "Consolidating insights",
        "Planning ahead"
      );
    }
  });

  return {
    title: `Reading Focus: ${theme}`,
    description: `Today's reading sessions focus on ${theme.toLowerCase()}`,
    topics:
      topics.length > 0
        ? topics
        : [
            "Reading comprehension",
            "Note-taking strategies",
            "Applying insights",
          ],
  };
}

function getReadingProject(weekNum, dayIndex) {
  // dayIndex is now the actual day of week (0-6, where 0=Sunday, 1=Monday, etc.)
  const isWeekend = dayIndex === 0 || dayIndex === 6; // Sunday or Saturday
  const readingSessions = isWeekend
    ? getWeekendReading(weekNum, dayIndex)
    : getWeekdayReading(weekNum, dayIndex);

  const requirements = [];
  readingSessions.forEach((session) => {
    if (session.type === "Bible Reading") {
      const bibleData = typeof session.material === 'object' ? session.material : { text: session.material };
      requirements.push(`Read: ${bibleData.text}`);
      requirements.push("Take notes on key verses and insights");
    } else if (session.type === "E-Reading") {
      requirements.push(`Read: ${session.material}`);
      requirements.push("Take notes on key concepts");
      requirements.push("Apply insights to personal growth");
    } else if (session.type === "Physical Book") {
      requirements.push(`Read: ${session.material}`);
      requirements.push("Take detailed notes");
      requirements.push("Reflect on how concepts apply to your journey");
    } else if (session.type === "Reflection") {
      requirements.push("Journal insights from the week");
      requirements.push("Plan reading for next week");
    }
  });

  return {
    title: "Daily Reading Project",
    description: "Complete today's reading sessions and apply insights",
    requirements:
      requirements.length > 0
        ? requirements
        : ["Complete reading sessions", "Take notes", "Reflect on insights"],
  };
}

function getReadingReflection(weekNum, dayIndex) {
  // dayIndex is now the actual day of week (0-6, where 0=Sunday, 1=Monday, etc.)
  const isWeekend = dayIndex === 0 || dayIndex === 6; // Sunday or Saturday
  const readingSessions = isWeekend
    ? getWeekendReading(weekNum, dayIndex)
    : getWeekdayReading(weekNum, dayIndex);

  const prompts = [];
  readingSessions.forEach((session) => {
    if (session.type === "Bible Reading") {
      const bibleData = typeof session.material === 'object' ? session.material : { text: session.material };
      prompts.push(`What wisdom did I gain from ${bibleData.text}?`);
      prompts.push("How can I apply these principles today?");
    } else if (session.type === "E-Reading") {
      prompts.push(`What key insights did I learn from ${session.material}?`);
      prompts.push("How will I apply these concepts to my journey?");
    } else if (session.type === "Physical Book") {
      prompts.push(`What deep insights did I gain from ${session.material}?`);
      prompts.push("How does this connect to my overall growth?");
    } else if (session.type === "Reflection") {
      prompts.push("What were the most impactful insights this week?");
      prompts.push("How has my thinking evolved?");
    }
  });

  return {
    prompt:
      prompts.length > 0
        ? prompts[0]
        : "Reflect on today's reading and insights",
    questions:
      prompts.length > 1
        ? prompts.slice(1)
        : [
            "What key insights did I gain?",
            "How will I apply these insights?",
            "What questions do I still have?",
            "How does this connect to my overall journey?",
          ],
  };
}

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

// Body Transformation Journey - Complete 13 weeks
export const bodyTransformationWeeks = generateWeeks(JOURNEY_START_DATE, 13).map(
  (week, idx) => {
    const days = [];
    const workoutTypes = [
      "Rest & Recovery",
      "Upper Body Strength",
      "Lower Body Strength",
      "Core + Cardio",
      "Functional Full-Body",
      "Mobility & Flexibility",
      "Active Recovery & Basketball",
    ];

    for (let i = 0; i < 7; i++) {
      // Parse startDate string properly to avoid timezone issues
      // week.startDate is in format "YYYY-MM-DD"
      const [year, month, day] = week.startDate.split('-').map(Number);
      const dayDate = new Date(year, month - 1, day + i); // month is 0-indexed in JavaScript

      const dayDateString = dayDate.toISOString().split("T")[0];
      // Day 0 = Saturday, February 7, 2026 (Preparation, before Week 1)
      // Day 1 = Sunday, February 8, 2026 (Week 1, i=0) - First day of journey
      // Calculate: Week 1 (idx=0) starts at Day 1, so dayNumber = idx * 7 + i + 1
      // Week 1: i=0 -> Day 1, i=1 -> Day 2, ..., i=6 -> Day 7
      // Week 2: i=0 -> Day 8, i=1 -> Day 9, ..., i=6 -> Day 14
      const dayNumber = idx * 7 + i + 1; // Day 1, 2, 3, ... up to 180 (Day 0 is separate)

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

      // Week 1 starts from Day 1 (Sunday, February 8, 2026) - actual content execution begins
      // Content week numbering: Day 1 = Week 1 content, Days 1-7 = Week 1 content, Days 8-14 = Week 2 content, etc.
      // Week numbering: idx 0 = Week 1, idx 1 = Week 2, etc.
      const contentWeekNum = idx + 1; // Week 1, 2, 3, etc.

      // Use actual content for all days (no test run)
      const workoutData = getWorkoutForDay(contentWeekNum, i);
      const workoutResources = getWorkoutResources(contentWeekNum, i);
      
      // Get time blocks and organize schedule (same format as software engineering)
      const timeBlocks = getBodyTransformationTimeBlocks(dayIndex);
      const learningData = getBodyTransformationLearning(contentWeekNum, i);
      const projectData = getBodyTransformationProject(contentWeekNum, i);
      const scheduledContent = organizeBodyTransformationSchedule(learningData, projectData, dayIndex, timeBlocks, dayNumber);

      days.push({
        dayNumber: dayNumber,
        date: dayDateString,
        dayName: actualDayName,
        focus: workoutTypes[i],
        workout: workoutData.name || workoutData,
        workoutLink: workoutData.link || null,
        nutrition: getNutritionForWeek(contentWeekNum, i),
        mindset: getMindsetAffirmation(i),
        resources: workoutResources,
        // Add missing fields for Learning, Project, Reflection tabs
        dailyLearning: learningData,
        project: projectData,
        reflection: getBodyTransformationReflection(contentWeekNum, i),
        dailyQuiz: getBodyTransformationQuiz(contentWeekNum, i, dayNumber),
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

    // Override theme for week 0 to reflect testing & trials week
    const weekTheme =
      idx === 0
        ? "Testing & Trials Week - System familiarization and experimentation (No iterations)"
        : week.theme;

    return { ...week, theme: weekTheme, days };
  }
);

function getWorkoutForDay(weekNum, dayIndex) {
  if (dayIndex === 0)
    return { name: "Rest Day (Recovery from Sunday basketball)", link: null };
  if (dayIndex === 5)
    return {
      name: "Yoga Flow for Flexibility",
      link: "https://www.youtube.com/watch?v=v7AYKMP6rOE",
    };
  if (dayIndex === 6)
    return {
      name: "Basketball + Gentle Stretching Routine",
      link: "https://www.youtube.com/watch?v=4pKly2JojMw",
    };

  const workouts = {
    1: {
      name: "Upper Body Push Pull Workout",
      link: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    },
    2: {
      name: "Legs & Glutes Workout",
      link: "https://www.youtube.com/watch?v=wPtyYp2VIYA",
    },
    3: {
      name: "HIIT Core & Cardio",
      link: "https://www.youtube.com/watch?v=ml0Ho6Ybq58",
    },
    4: {
      name: "Full Body Functional Strength",
      link: "https://www.youtube.com/watch?v=UBMk30rjy0o",
    },
  };
  return workouts[dayIndex] || { name: "Workout Session", link: null };
}

function getNutritionForWeek(weekNum, dayIndex) {
  if (weekNum <= 4) {
    return "No refined sugar, soda, or fried foods. Eat until 80% full.";
  } else if (weekNum <= 8) {
    return "Increased protein. Extra healthy carbs post-workout. Hand-portion method.";
  } else {
    return "Reduce carbs 20-25%. Lighter dinners. Green tea at night.";
  }
}

function getMindsetAffirmation(dayIndex) {
  const affirmations = [
    "Rest is part of the process.",
    "I am evolving into a higher version of myself.",
    "I honor my word.",
    "My body and mind are unified systems.",
    "I am progressing daily.",
    "I rise to my highest potential.",
    "Deep reflection and planning ahead.",
  ];
  return affirmations[dayIndex] || "I am committed to my transformation.";
}

function getWorkoutResources(weekNum, dayIndex) {
  if (dayIndex === 0) {
    return [
      {
        title: "Recovery & Rest Guide",
        url: "https://www.youtube.com/watch?v=4pKly2JojMw",
        time: "10 min",
      },
      {
        title: "Stretching for Recovery",
        url: "https://www.youtube.com/watch?v=v7AYKMP6rOE",
        time: "15 min",
      },
    ];
  }
  if (dayIndex === 1) {
    return [
      {
        title: "Upper Body Push Pull Workout",
        url: "https://www.youtube.com/watch?v=IODxDxX7oi4",
        time: "45 min",
      },
      {
        title: "Upper Body Form Guide",
        url: "https://www.youtube.com/watch?v=IODxDxX7oi4",
        time: "10 min",
      },
      {
        title: "Progressive Overload Principles",
        url: "https://www.bodybuilding.com/content/progressive-overload.html",
        time: "5 min",
      },
    ];
  }
  if (dayIndex === 2) {
    return [
      {
        title: "Legs & Glutes Workout",
        url: "https://www.youtube.com/watch?v=wPtyYp2VIYA",
        time: "45 min",
      },
      {
        title: "Leg Day Form Tips",
        url: "https://www.youtube.com/watch?v=wPtyYp2VIYA",
        time: "10 min",
      },
      {
        title: "Lower Body Mobility",
        url: "https://www.youtube.com/watch?v=v7AYKMP6rOE",
        time: "15 min",
      },
    ];
  }
  if (dayIndex === 3) {
    return [
      {
        title: "HIIT Core & Cardio",
        url: "https://www.youtube.com/watch?v=ml0Ho6Ybq58",
        time: "30 min",
      },
      {
        title: "Core Strength Basics",
        url: "https://www.youtube.com/watch?v=ml0Ho6Ybq58",
        time: "15 min",
      },
      {
        title: "Cardio Training Guide",
        url: "https://www.healthline.com/health/fitness-exercise/cardio-workouts",
        time: "10 min",
      },
    ];
  }
  if (dayIndex === 4) {
    return [
      {
        title: "Full Body Functional Strength",
        url: "https://www.youtube.com/watch?v=UBMk30rjy0o",
        time: "45 min",
      },
      {
        title: "Functional Movement Patterns",
        url: "https://www.youtube.com/watch?v=UBMk30rjy0o",
        time: "15 min",
      },
    ];
  }
  if (dayIndex === 5) {
    return [
      {
        title: "Yoga Flow for Flexibility",
        url: "https://www.youtube.com/watch?v=v7AYKMP6rOE",
        time: "30 min",
      },
      {
        title: "Mobility Routine",
        url: "https://www.youtube.com/watch?v=4pKly2JojMw",
        time: "20 min",
      },
      {
        title: "Flexibility Training Guide",
        url: "https://www.verywellfit.com/flexibility-exercises-4158624",
        time: "10 min",
      },
    ];
  }
  if (dayIndex === 6) {
    return [
      {
        title: "Basketball Warm-up",
        url: "https://www.youtube.com/watch?v=4pKly2JojMw",
        time: "10 min",
      },
      {
        title: "Post-Game Recovery",
        url: "https://www.youtube.com/watch?v=v7AYKMP6rOE",
        time: "15 min",
      },
    ];
  }
  return [];
}

// Reading Journey - Complete 13 weeks
export const readingWeeks = generateWeeks(JOURNEY_START_DATE, 13).map((week, idx) => {
  const days = [];

  for (let i = 0; i < 7; i++) {
    // Parse startDate string properly to avoid timezone issues
    const [year, month, day] = week.startDate.split('-').map(Number);
    const dayDate = new Date(year, month - 1, day + i); // month is 0-indexed in JavaScript
    const dayDateString = dayDate.toISOString().split("T")[0];
    // Day 0 = Saturday, February 7, 2026 (Preparation, before Week 1)
    // Day 1 = Sunday, February 8, 2026 (Week 1, i=0) - First day of journey
    // Calculate: Week 1 (idx=0) starts at Day 1, so dayNumber = idx * 7 + i + 1
    const dayNumber = idx * 7 + i + 1; // Day 1, 2, 3, ... up to 90 (Day 0 is separate)

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
    const dayOfWeek = dayDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    
    // Convert JavaScript getDay() (0=Sunday, 1=Monday, ..., 6=Saturday) 
    // to dayIndex format used by getTimeBlocks (0=Monday, 1=Tuesday, ..., 5=Saturday, 6=Sunday)
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to: 0=Monday, 1=Tuesday, ..., 5=Saturday, 6=Sunday

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
    
    // Week 1 starts from Day 1 (Monday, February 2, 2026) - actual content execution begins
    // Content week numbering: Day 1 = Week 1 content, Days 1-7 = Week 1 content, Days 8-14 = Week 2 content, etc.
    // Week numbering: idx 0 = Week 1, idx 1 = Week 2, etc.
    const contentWeekNum = idx + 1; // Week 1, 2, 3, etc.

    // Use actual content for all days (no test run)
    // Pass dayOfWeek to getReadingResources so it can determine what resources to show
    const readingResources = getReadingResources(contentWeekNum, dayOfWeek);

    // Map dayOfWeek to the correct index for reading functions
    // For weekdays: Monday(1)->0, Tuesday(2)->1, Wednesday(3)->2, Thursday(4)->3, Friday(5)->4
    // For weekends: Saturday(6)->5, Sunday(0)->0
    const readingDayIndex = isWeekend ? dayOfWeek : dayOfWeek - 1;
    
    // Get time blocks and organize schedule (same format as software engineering)
    const timeBlocks = getReadingTimeBlocks(dayIndex);
    const readingSessionsData = isWeekend 
      ? getWeekendReading(contentWeekNum, readingDayIndex) 
      : getWeekdayReading(contentWeekNum, readingDayIndex);
    const scheduledContent = organizeReadingSchedule(readingSessionsData, dayIndex, timeBlocks, dayNumber);

    days.push({
      dayNumber: dayNumber,
      date: dayDateString,
      dayName: actualDayName,
      readingSessions: readingSessionsData,
      theme: getReadingTheme(contentWeekNum),
      resources: readingResources,
      // Add missing fields for Learning, Project, Reflection tabs
      dailyLearning: getReadingLearning(contentWeekNum, i),
      project: getReadingProject(contentWeekNum, i),
      reflection: getReadingReflection(contentWeekNum, i),
      dailyQuiz: getReadingQuiz(contentWeekNum, i, dayNumber),
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
});

function getWeekdayReading(weekNum, dayIndex) {
  // dayIndex: 0=Monday, 1=Tuesday, 2=Wednesday, 3=Thursday, 4=Friday
  const sessions = [];
  const isMondayToWednesday = dayIndex >= 0 && dayIndex <= 2; // Monday-Wednesday
  const isThursdayToFriday = dayIndex >= 3 && dayIndex <= 4; // Thursday-Friday
  
  // Bible Reading: ALL weekdays (Monday-Friday), 6:00-6:30 AM
  sessions.push({
    time: "6:00-6:30 AM",
    type: "Bible Reading",
    material: getBibleReading(weekNum, dayIndex),
    focus: "Spiritual, financial, wisdom grounding",
  });

  // E-Book Reading: Monday to Wednesday, 5:00-6:00 PM
  if (isMondayToWednesday) {
    const ebook = getEBookForWeek(weekNum);
    let material = ebook;
    let chapters = "";

    // Add chapter numbers for Atomic Habits
    if (ebook === "Atomic Habits") {
      if (weekNum === 1) {
        chapters = "Chapters 1-7";
      } else if (weekNum === 2) {
        chapters = "Chapters 8-14";
      }
      material = `Atomic Habits - James Clear (${chapters})`;
    } else if (ebook === "Atomic Habits (Advanced)") {
      if (weekNum === 6) {
        chapters = "Chapters 15-20";
        material = `Atomic Habits - James Clear (${chapters})`;
      }
    }

    sessions.push({
      time: "5:00-6:00 PM",
      type: "E-Reading",
      material: material,
      focus: "Mindset, success, wealth, strategy",
      chapters: chapters || null,
    });
  }

  // Physical Book Reading: Thursday and Friday, 5:00-6:00 PM
  if (isThursdayToFriday) {
    sessions.push({
      time: "5:00-6:00 PM",
      type: "Physical Book",
      material: getPhysicalBookForWeek(weekNum),
      focus: "Deep reading and comprehension",
    });
  }

  return sessions;
}

function getWeekendReading(weekNum, dayIndex) {
  // dayIndex: 0=Sunday (getDay()=0), 6=Saturday (getDay()=6)
  const sessions = [];
  
  if (dayIndex === 0) {
    // Sunday: Bible Reading (6:00-6:30 AM) + Physical Book Reading (3:00-4:00 PM)
    sessions.push({
      time: "6:00-6:30 AM",
      type: "Bible Reading",
      material: getBibleReading(weekNum, 0), // Sunday is day 0
      focus: "Spiritual, financial, wisdom grounding",
    });
    sessions.push({
      time: "3:00-4:00 PM",
      type: "Physical Book",
      material: getPhysicalBookForWeek(weekNum),
      focus: "Deep reading and comprehension",
    });
  } else if (dayIndex === 6) {
    // Saturday: Bible Reading (7:30-8:00 AM) + E-Reading (5:00-6:00 PM)
    sessions.push({
      time: "7:30-8:00 AM",
      type: "Bible Reading",
      material: getBibleReading(weekNum, 6), // Saturday is day 6
      focus: "Spiritual, financial, wisdom grounding",
    });
    
    // E-Book Reading: Saturday, 5:00-6:00 PM
    const ebook = getEBookForWeek(weekNum);
    let material = ebook;
    let chapters = "";

    // Add chapter numbers for Atomic Habits
    if (ebook === "Atomic Habits") {
      if (weekNum === 1) {
        chapters = "Chapters 1-7";
      } else if (weekNum === 2) {
        chapters = "Chapters 8-14";
      }
      material = `Atomic Habits - James Clear (${chapters})`;
    } else if (ebook === "Atomic Habits (Advanced)") {
      if (weekNum === 6) {
        chapters = "Chapters 15-20";
        material = `Atomic Habits - James Clear (${chapters})`;
      }
    }

    sessions.push({
      time: "5:00-6:00 PM",
      type: "E-Reading",
      material: material,
      focus: "Mindset, success, wealth, strategy",
      chapters: chapters || null,
    });
  }
  
  return sessions;
}

function getEBookForWeek(weekNum) {
  const books = [
    "Atomic Habits - Part 1", // Week 1
    "Atomic Habits - Part 2", // Week 2 (different from Week 1)
    "Be Obsessed or Be Average",
    "Be Obsessed or Be Average",
    "Meditations",
    "Atomic Habits (Advanced)",
    "Be Obsessed or Be Average (Advanced)",
    "Meditations (Deep Dive)",
    "Integration - All books",
    "Successful Habits",
    "Advanced Strategies",
    "Wisdom Synthesis",
    "Final Review",
  ];
  return books[weekNum - 1] || "Reading Material";
}

function getPhysicalBookForWeek(weekNum) {
  const books = [
    "System Building - Foundations", // Week 1
    "System Building - Implementation", // Week 2 (different from Week 1)
    "Successful Habits",
    "Successful Habits",
    "System Building (Advanced)",
    "System Building (Advanced)",
    "Successful Habits (Advanced)",
    "Mistakes That Made Me a Millionaire",
    "Synthesis - All books",
    "System Building (Mastery)",
    "Advanced Concepts",
    "Comprehensive Review",
    "Final Review",
  ];
  return books[weekNum - 1] || "Physical Book";
}

function getBibleReading(weekNum, dayIndex) {
  const readings = [
    "Proverbs - Chapters 1-10", // Week 1
    "Proverbs - Chapters 11-20", // Week 2 (different from Week 1)
    "Proverbs - Chapters 21-31",
    "Proverbs - Review & Reflection",
    "Proverbs - Application",
    "Ecclesiastes",
    "Ecclesiastes",
    "Isaiah",
    "Isaiah",
    "Isaiah",
    "Isaiah",
    "Isaiah",
    "Isaiah",
  ];
  const book = readings[weekNum - 1] || "Proverbs";
  const chapter = Math.min(dayIndex + 1, 31);
  const chapterName = `${book} ${chapter}`;
  
  // Generate Bible.com link for the specific chapter
  // Using YouVersion Bible.com format: book abbreviation and chapter
  const bookAbbrev = {
    "Proverbs": "PRO",
    "Ecclesiastes": "ECC",
    "Isaiah": "ISA"
  }[book] || "PRO";
  
  // YouVersion Bible.com link format
  const bibleLink = `https://www.bible.com/bible/1/${bookAbbrev}.${chapter}.NLT`;
  
  return {
    text: chapterName,
    link: bibleLink,
    book: book,
    chapter: chapter
  };
}

function getReadingTheme(weekNum) {
  const themes = [
    "Foundations of Habit & System Thinking",
    "Identity-Based Change & Structure",
    "Obsession & Ambition",
    "Systems for Wealth & Success",
    "Stoic Wisdom & Millionaire Mindset",
    "Advanced Habit Systems",
    "Peak Performance & Systems",
    "Philosophical Wealth Building",
    "Integration & Application",
    "Mastery & Implementation",
    "Advanced Strategies",
    "Wisdom Synthesis",
    "Reflection & Next Steps",
  ];
  return themes[weekNum - 1] || "Reading Theme";
}

function getReadingResources(weekNum, dayOfWeek) {
  // dayOfWeek: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
  const resources = [];
  
  // Determine what reading sessions are scheduled for this day
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  const isMondayToWednesday = dayOfWeek >= 1 && dayOfWeek <= 3; // Mon-Wed
  const isThursdayToFriday = dayOfWeek >= 4 && dayOfWeek <= 5; // Thu-Fri
  const isSaturday = dayOfWeek === 6;
  const isSunday = dayOfWeek === 0;
  
  // Map dayOfWeek to dayIndex for Bible reading (weekdays: 0-4, Sunday: 0)
  const bibleDayIndex = isWeekend ? (isSunday ? 0 : 6) : dayOfWeek - 1;
  
  // Bible Reading: Weekdays (Mon-Fri) AND Sunday
  if (!isSaturday) {
    const bibleData = getBibleReading(weekNum, bibleDayIndex);
    const bibleChapterCount = 1; // Each day reads 1 chapter (15 minutes allocated)
    
    resources.push({
      title: `Bible Reading: ${bibleData.text}`,
      url: bibleData.link,
      time: "15 min",
      category: "Bible",
      description: `${bibleChapterCount} chapter${bibleChapterCount > 1 ? 's' : ''} (${bibleData.book} ${bibleData.chapter})`,
      chapterCount: bibleChapterCount,
      type: "Bible Reading"
    });
  }
  
  // E-Book Reading: Saturday ONLY (5:00-6:00 PM)
  if (isSaturday) {
    const ebook = getEBookForWeek(weekNum);
    let ebookTitle = ebook;
    let ebookUrl = "";
    
    // Map E-books to their resources
    if (ebook === "Atomic Habits" || ebook === "Atomic Habits (Advanced)") {
      ebookTitle = "Atomic Habits - James Clear";
      ebookUrl = "https://jamesclear.com/atomic-habits";
    } else if (ebook === "Be Obsessed or Be Average" || ebook === "Be Obsessed or Be Average (Advanced)") {
      ebookTitle = "Be Obsessed or Be Average - Grant Cardone";
      ebookUrl = "https://grantcardone.com/books/be-obsessed-or-be-average/";
    } else if (ebook === "Meditations" || ebook === "Meditations (Deep Dive)") {
      ebookTitle = "Meditations - Marcus Aurelius";
      ebookUrl = "https://www.gutenberg.org/files/2680/2680-h/2680-h.htm";
    } else {
      ebookTitle = ebook;
      ebookUrl = "https://www.gutenberg.org/";
    }
    
    resources.push({
      title: ebookTitle,
      url: ebookUrl,
      time: "60 min",
      category: "E-Book",
      type: "E-Reading"
    });
  }
  
  // Physical Book Reading: Sunday ONLY (7:00-8:00 PM)
  if (isSunday) {
    const physicalBook = getPhysicalBookForWeek(weekNum);
    let physicalBookTitle = physicalBook;
    let physicalBookUrl = "";
    
    // Map physical books to their resources
    if (physicalBook.includes("System Building")) {
      physicalBookTitle = "System Building";
      physicalBookUrl = "https://www.amazon.com/s?k=system+building+books";
    } else if (physicalBook.includes("Successful Habits")) {
      physicalBookTitle = "Successful Habits";
      physicalBookUrl = "https://www.amazon.com/s?k=successful+habits+books";
    } else if (physicalBook.includes("Mistakes That Made Me a Millionaire")) {
      physicalBookTitle = "Mistakes That Made Me a Millionaire";
      physicalBookUrl = "https://www.amazon.com/s?k=mistakes+that+made+me+a+millionaire";
    } else {
      physicalBookTitle = physicalBook;
      physicalBookUrl = "https://www.amazon.com/s?k=" + encodeURIComponent(physicalBook);
    }
    
    resources.push({
      title: physicalBookTitle,
      url: physicalBookUrl,
      time: "60 min",
      category: "Physical Book",
      type: "Physical Book"
    });
  }
  
  // Always include reading guides
  resources.push(
    {
      title: "Reading Comprehension Tips",
      url: "https://www.oxfordlearning.com/improve-reading-comprehension/",
      time: "Guide",
      category: "Reading Guide",
      type: "Guide"
    },
    {
      title: "Note-Taking Strategies",
      url: "https://www.cornell.edu/academics/study-skills/note-taking.cfm",
      time: "Guide",
      category: "Study Guide",
      type: "Guide"
    }
  );
  
  return resources;
}

// Dual Brand Journey - Complete 13 weeks
export const dualBrandWeeks = generateWeeks(JOURNEY_START_DATE, 13).map(
  (week, idx) => {
    const days = [];

    for (let i = 0; i < 7; i++) {
      // Parse startDate string properly to avoid timezone issues
      // week.startDate is in format "YYYY-MM-DD"
      const [year, month, day] = week.startDate.split('-').map(Number);
      const dayDate = new Date(year, month - 1, day + i); // month is 0-indexed in JavaScript

      const dayDateString = dayDate.toISOString().split("T")[0];
      // Day 0 = Saturday, February 7, 2026 (Preparation, before Week 1)
      // Day 1 = Sunday, February 8, 2026 (Week 1, i=0) - First day of journey
      // Calculate: Week 1 (idx=0) starts at Day 1, so dayNumber = idx * 7 + i + 1
      // Week 1: i=0 -> Day 1, i=1 -> Day 2, ..., i=6 -> Day 7
      // Week 2: i=0 -> Day 8, i=1 -> Day 9, ..., i=6 -> Day 14
      const dayNumber = idx * 7 + i + 1; // Day 1, 2, 3, ... up to 180 (Day 0 is separate)

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

      // Week 1 starts from Day 1 (Sunday, February 8, 2026) - actual content execution begins
      // Content week numbering: Day 1 = Week 1 content, Days 1-7 = Week 1 content, Days 8-14 = Week 2 content, etc.
      // Week numbering: idx 0 = Week 1, idx 1 = Week 2, etc.
      const contentWeekNum = idx + 1; // Week 1, 2, 3, etc.

      // Use actual content for all days (no test run)
      const focus = getDualBrandFocus(contentWeekNum, i);
      
      // Get time blocks and organize schedule (same format as software engineering)
      const timeBlocks = getDualBrandTimeBlocks(dayIndex);
      const learningData = {
        title: focus,
        description: `Today's focus: ${focus}`,
      };
      const projectData = getDualBrandProject(contentWeekNum, i);
      const scheduledContent = organizeDualBrandSchedule(learningData, projectData, dayIndex, timeBlocks, dayNumber);

      days.push({
        dayNumber: dayNumber,
        date: dayDateString,
        dayName: actualDayName,
        focus: focus,
        personalBrandTasks: getPersonalBrandTasks(contentWeekNum, i),
        companyBrandTasks: getCompanyBrandTasks(contentWeekNum, i),
        // Keep legacy fields for backward compatibility
        ryxenTasks: getPersonalBrandTasks(contentWeekNum, i),
        havenXTasks: getCompanyBrandTasks(contentWeekNum, i),
        theme: getDualBrandTheme(contentWeekNum),
        learningResources: getDualBrandLearningResources(contentWeekNum, i),
        outcome: getDualBrandOutcome(contentWeekNum, i),
        // Platform-specific sessions for content planning
        platformSessions: getPlatformSessions(contentWeekNum, i),
        // Project content for dual brand
        project: getDualBrandProject(contentWeekNum, i),
        // Add missing fields for Learning, Reflection tabs
        dailyLearning: learningData,
        reflection: getDualBrandReflection(contentWeekNum, i),
        dailyQuiz: getDualBrandQuiz(contentWeekNum, i, dayNumber),
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
  }
);

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
          title: "Personal Branding Masterclass - Alex Hormozi",
          url: "https://www.youtube.com/results?search_query=alex+hormozi+personal+branding",
          category: "Video",
          platform: "YouTube",
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
      [{ title: "90-Day Completion Review", url: "" }],
      [{ title: "DUAL BRAND ASCENSION COMPLETE", url: "" }],
    ],
  ];
  return allResources[weekNum - 1]?.[dayIndex] || [];
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
          "Congratulations! You have completed the 90-day Dual Brand Ascension Journey",
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

// Writer's Journey - Complete 12 weeks (84 days, 7 days per week)
export const writersWeeks = generateWeeks(JOURNEY_START_DATE, 12).map((week, idx) => {
  const days = [];

  for (let i = 0; i < 7; i++) {
    // Parse startDate string properly to avoid timezone issues
    const [year, month, day] = week.startDate.split('-').map(Number);
    const dayDate = new Date(year, month - 1, day + i); // month is 0-indexed in JavaScript
    const dayDateString = dayDate.toISOString().split("T")[0];
    // Day 0 = Saturday, February 7, 2026 (Preparation, before Week 1)
    // Day 1 = Sunday, February 8, 2026 (Week 1, i=0) - First day of journey
    // Calculate: Week 1 (idx=0) starts at Day 1, so dayNumber = idx * 7 + i + 1
    const dayNumber = idx * 7 + i + 1; // Day 1, 2, 3, ... up to 84 (Day 0 is separate)

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
    const dayOfWeek = dayDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    
    // Convert JavaScript getDay() (0=Sunday, 1=Monday, ..., 6=Saturday) 
    // to dayIndex format used by getTimeBlocks (0=Monday, 1=Tuesday, ..., 5=Saturday, 6=Sunday)
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to: 0=Monday, 1=Tuesday, ..., 5=Saturday, 6=Sunday
    
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday

    // Week 1 starts from Day 1 (Monday, February 2, 2026) - actual content execution begins
    // Content week numbering: Day 1 = Week 1 content, Days 1-7 = Week 1 content, Days 8-14 = Week 2 content, etc.
    // Week numbering: idx 0 = Week 1, idx 1 = Week 2, etc.
    const contentWeekNum = idx + 1; // Week 1, 2, 3, etc.

    // For weekends (Saturday/Sunday), no content - rest days
    const isRestDay = isWeekend;
    // Only get content for weekdays (Monday-Friday, i < 5)
    const weekdayIndex = i < 5 ? i : null;
    const writerResources = isRestDay ? [] : (weekdayIndex !== null ? getWriterResources(contentWeekNum, weekdayIndex) : []);
    const learning = isRestDay ? "Rest Day" : (weekdayIndex !== null ? getWriterLearning(contentWeekNum, weekdayIndex) : "Rest Day");
    const execution = isRestDay ? "No writing tasks - Rest day" : (weekdayIndex !== null ? getWriterExecution(contentWeekNum, weekdayIndex) : "No writing tasks - Rest day");
    
    // Get time blocks and organize schedule (same format as software engineering)
    const timeBlocks = getWritersTimeBlocks(dayIndex);
    const learningData = {
      title: learning,
      description: isRestDay ? "Take a break and rest. Writing happens on weekdays." : `Learn about ${learning}`,
    };
    const projectData = {
      title: execution,
      description: isRestDay ? "No writing tasks today - enjoy your rest!" : `Execute: ${execution}`,
      requirements: isRestDay ? [] : [execution],
    };
    const scheduledContent = organizeWritersSchedule(learningData, projectData, dayIndex, timeBlocks, dayNumber);

    days.push({
      dayNumber: dayNumber,
      date: dayDateString,
      dayName: actualDayName,
      learning: learning,
      execution: execution,
      reflection: isRestDay ? { questions: ["How did the week go?", "What will you focus on next week?"] } : (weekdayIndex !== null ? getWriterReflection(contentWeekNum, weekdayIndex) : { questions: ["How did the week go?", "What will you focus on next week?"] }),
      theme: isRestDay ? "Rest Day" : (weekdayIndex !== null ? getWriterTheme(contentWeekNum) : "Rest Day"),
      resources: writerResources,
      // Add missing fields for Learning, Project tabs (map from existing fields)
      dailyLearning: learningData,
      project: projectData,
      dailyQuiz: isRestDay ? null : getWriterQuiz(contentWeekNum, weekdayIndex !== null ? weekdayIndex : 0, dayNumber),
      isTestRun: false,
      isRestDay: isRestDay,
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
});

function getWriterLearning(weekNum, dayIndex) {
  const learnings = [
    [
      "Discover your niche",
      "Market research for niches",
      "Monetization paths overview",
      "Competitive analysis",
      "Niche positioning",
    ],
    [
      "Writing voice development",
      "Personal brand for writers",
      "Mission statement creation",
      "Bio writing for writers",
      "Brand consistency",
    ],
    [
      "Writing process development",
      "Research & planning systems",
      "Drafting & editing systems",
      "Productivity systems for writers",
      "Quality assurance systems",
    ],
    [
      "Portfolio development",
      "Article writing fundamentals",
      "Blog post writing",
      "Social media content writing",
      "Portfolio presentation",
    ],
    [
      "Freelance platform setup",
      "Client research & targeting",
      "Pitch writing fundamentals",
      "Pricing strategies",
      "Contract & negotiation",
    ],
    [
      "Content writing fundamentals",
      "Copywriting principles",
      "Storytelling for brands",
      "Case study writing",
      "Content portfolio",
    ],
    [
      "Ghostwriting basics",
      "Ghostwriting contracts",
      "Maintaining client voice",
      "Ghostwriting projects",
      "Ghostwriting portfolio",
    ],
    [
      "Platform strategy",
      "Substack for writers",
      "LinkedIn for writers",
      "Portfolio website",
      "Platform optimization",
    ],
    [
      "Pitching systems",
      "Outreach strategies",
      "Cold pitch mastery",
      "Warm pitch strategies",
      "Pitch follow-up systems",
    ],
    [
      "Brand content strategy",
      "Newsletter writing",
      "_ryxen.oo7 content strategy",
      "Social media content",
      "Content calendar",
    ],
    [
      "Digital product types",
      "E-book writing",
      "Guide creation",
      "Course content",
      "Product packaging",
    ],
    [
      "Rate improvement",
      "Scaling freelance work",
      "Publishing optimization",
      "Passive income streams",
      "Revenue diversification",
    ],
  ];
  return learnings[weekNum - 1]?.[dayIndex] || "Writer learning topic";
}

function getWriterExecution(weekNum, dayIndex) {
  const executions = [
    [
      "Build Writer Income Map",
      "Niche validation research",
      "Monetization path selection",
      "Analyze top 3 writers in niche",
      "Finalize niche & positioning",
    ],
    [
      "Define your writing voice",
      "Build writer brand identity",
      "Write writer mission statement",
      "Write multiple bio versions",
      "Create brand guidelines doc",
    ],
    [
      "Map your current writing process",
      "Create research system",
      "Create drafting system",
      "Build productivity system",
      "Create complete writing system",
    ],
    [
      "Plan portfolio structure",
      "Write first portfolio article",
      "Write second portfolio piece",
      "Create social media samples",
      "Compile & organize portfolio",
    ],
    [
      "Set up freelance accounts",
      "Build client prospect list",
      "Create pitch templates",
      "Set pricing structure",
      "Prepare freelance toolkit",
    ],
    [
      "Write brand content piece",
      "Write sales copy",
      "Write brand story",
      "Write case study",
      "Update portfolio with content samples",
    ],
    [
      "Practice ghostwriting",
      "Create ghostwriting contract template",
      "Voice matching practice",
      "Prepare ghostwriting service package",
      "Build ghostwriting portfolio",
    ],
    [
      "Choose & set up Medium account",
      "Set up Substack newsletter",
      "Optimize LinkedIn profile",
      "Plan portfolio website",
      "Optimize all platforms",
    ],
    [
      "Create pitch templates library",
      "Build outreach system",
      "Write & send 5 cold pitches",
      "Build warm pitch system",
      "Create follow-up system",
    ],
    [
      "Write R•ICH brand content",
      "Write R•ICH newsletter",
      "Write _ryxen.oo7 brand content",
      "Create social content for both brands",
      "Create content calendar for brands",
    ],
    [
      "Plan first digital product",
      "Start writing e-book",
      "Create quick-start guide",
      "Plan mini-course outline",
      "Package digital products",
    ],
    [
      "Analyze & improve rates",
      "Create scaling plan",
      "Optimize publishing workflow",
      "Develop passive income plan",
      "Create revenue roadmap",
    ],
  ];
  return executions[weekNum - 1]?.[dayIndex] || "Writer execution task";
}

function getWriterReflection(weekNum, dayIndex) {
  const reflections = [
    [
      "Which topics excite me most and who pays for this writing?",
      "What market signals validate my niche choice?",
      "Which monetization paths align with my goals?",
      "How can I differentiate while learning from the best?",
      "Week 1 complete: What's my clear niche direction?",
    ],
    [
      "What makes my writing voice unique?",
      "How does my brand represent my writing?",
      "What's my mission as a writer?",
      "Which bio version best represents me?",
      "Week 2 complete: Is my brand identity clear?",
    ],
    [
      "What's my optimal writing workflow?",
      "How can I research efficiently?",
      "How do I draft most effectively?",
      "What helps me write consistently?",
      "Week 3 complete: Is my writing system repeatable?",
    ],
    [
      "What samples showcase my skills best?",
      "What makes this article strong?",
      "How does this showcase my versatility?",
      "How does social content demonstrate skill?",
      "Week 4 complete: Is my portfolio compelling?",
    ],
    [
      "How do I position myself competitively?",
      "Which clients align with my niche?",
      "What makes my pitch stand out?",
      "What's my value-based pricing?",
      "Week 5 complete: Am I ready to pitch?",
    ],
    [
      "How did I capture the brand voice?",
      "What makes copy persuasive?",
      "How does storytelling connect with audiences?",
      "What makes a compelling case study?",
      "Week 6 complete: Is my content portfolio strong?",
    ],
    [
      "How do I capture another's voice?",
      "What protects me as a ghostwriter?",
      "How do I maintain voice consistency?",
      "What ghostwriting services can I offer?",
      "Week 7 complete: Am I ready for ghostwriting projects?",
    ],
    [
      "Why Medium for my platform?",
      "What value does my newsletter provide?",
      "How does LinkedIn support my writing career?",
      "What pages does my portfolio site need?",
      "Week 8 complete: Are my platforms optimized?",
    ],
    [
      "What makes each pitch type effective?",
      "How do I systematize outreach?",
      "What did I learn from these pitches?",
      "How do I warm up cold contacts?",
      "Week 9 complete: Is my pitching system complete?",
    ],
    [
      "How does this serve the R•ICH brand?",
      "What value does this newsletter provide?",
      "How does this serve the _ryxen.oo7 brand?",
      "How does this content engage audiences?",
      "Week 10 complete: Is my brand content strategy clear?",
    ],
    [
      "What value will this product provide?",
      "What's my e-book completion plan?",
      "Is this guide valuable and actionable?",
      "What's my course creation timeline?",
      "Week 11 complete: Are my digital products ready?",
    ],
    [
      "What's my value-based rate?",
      "How can I scale without burning out?",
      "How can I publish more efficiently?",
      "What passive income can I create?",
      "Week 12 complete: Is my revenue strategy diversified?",
    ],
  ];
  return reflections[weekNum - 1]?.[dayIndex] || "Writer reflection prompt";
}

function getWriterTheme(weekNum) {
  const themes = [
    "Discover Your Niche & Market",
    "Build Brand Voice & Identity",
    "Signature Writing System",
    "Build Writing Samples & Portfolio",
    "Freelance Writing Foundations",
    "Content & Copywriting",
    "Ghostwriting",
    "Personal Platforms",
    "Pitching & Client Acquisition Systems",
    "Writing for R•ICH & _ryxen.oo7",
    "Writing Digital Products",
    "Revenue Expansion & Scaling Systems",
  ];
  return themes[weekNum - 1] || "Writer theme";
}

function getWriterResources(weekNum, dayIndex) {
  const baseResources = [
    {
      title: "Writing Tips & Techniques",
      url: "https://www.writersdigest.com/write-better-fiction",
      time: "Guide",
    },
    {
      title: "Freelance Writing Guide",
      url: "https://www.makealivingwriting.com/",
      time: "Resource",
    },
    {
      title: "Copywriting Fundamentals",
      url: "https://copyblogger.com/copywriting-101/",
      time: "Course",
    },
    {
      title: "Ghostwriting Guide",
      url: "https://www.writersdigest.com/write-better-fiction/ghostwriting",
      time: "Guide",
    },
    {
      title: "Pitching Templates",
      url: "https://www.makealivingwriting.com/pitch-templates/",
      time: "Templates",
    },
    {
      title: "Writer's Market",
      url: "https://www.writersmarket.com/",
      time: "Resource",
    },
  ];

  if (weekNum <= 2) {
    return [baseResources[0], baseResources[1]];
  } else if (weekNum <= 4) {
    return [baseResources[0], baseResources[2], baseResources[1]];
  } else if (weekNum <= 6) {
    return [baseResources[2], baseResources[3], baseResources[5]];
  } else if (weekNum <= 8) {
    return [baseResources[3], baseResources[4], baseResources[5]];
  } else {
    return baseResources;
  }
}

// CRASH COURSE FUNCTIONS (Legacy - Now used for first 11 days of full journey)
// These functions are kept for backward compatibility but the journey now runs full 13 weeks
function getCrashCourseTheme(dayNum) {
  const themes = [
    "Foundation: Language Fundamentals & Systems Thinking",
    "Async Patterns: Concurrency, Data Flow & Error Boundaries",
    "Component Architecture: Composition, Reusability & Separation of Concerns",
    "State Management: Data Flow, Side Effects & Performance",
    "Mobile Engineering: Cross-Platform Architecture & Native Considerations",
    "Navigation & Routing: Information Architecture & User Flow",
    "Location Services: Real-time Data, Permissions & Performance",
    "Route Engineering: Algorithmic Thinking & Data Structures",
    "API Design: Contracts, Authentication & Error Handling",
    "Form Architecture: Validation, State Machines & UX Patterns",
    "System Integration: Architecture Review, Refactoring & Production Readiness",
  ];
  return themes[dayNum - 1] || "Developer Ascension Day";
}

function getCrashCourseLearning(dayNum) {
  const crashCourseData = {
    1: {
      title: "Language Fundamentals & Systems Thinking (3 hours)",
      frontend: {
        title: "JavaScript: Language Design & Patterns",
        topics: [
          "Language fundamentals: primitives, references, immutability",
          "Function design: pure functions, side effects, composition",
          "Data structures: arrays, objects, maps, sets - when to use what",
          "Scope and closure: understanding execution context",
          "Code organization: modules, namespaces, avoiding global pollution",
          "Review: Analyze code patterns in production codebases",
          "Refactor: Improve code clarity and maintainability",
        ],
      },
      backend: {
        title: "Node.js: Runtime & Module System (Synced)",
        topics: [
          "Node.js runtime: event loop, non-blocking I/O",
          "Module system: CommonJS vs ES modules, when to use each",
          "Project structure: organizing Node.js applications",
          "Package management: dependency management, versioning",
          "Environment configuration: env vars, config files",
          "Review: How do production Node.js apps structure code?",
          "Refactor: Improve module organization",
        ],
      },
      systems: {
        title: "Systems Thinking",
        topics: [
          "Code review mindset: what makes code maintainable?",
          "Tradeoffs: performance vs readability, flexibility vs simplicity",
          "Naming conventions: clarity over cleverness",
          "Documentation: when and how to document decisions",
        ],
      },
      topics: [],
    },
    2: {
      title: "Async Patterns & Data Flow (3 hours)",
      frontend: {
        title: "Concurrency & Async Architecture",
        topics: [
          "Async patterns: promises, async/await, generators",
          "Error boundaries: handling async errors at appropriate levels",
          "Data fetching: strategies, caching, invalidation",
          "Race conditions: identifying and preventing",
          "Loading states: UX patterns for async operations",
          "Review: How do production apps handle async complexity?",
          "Refactor: Improve error handling and loading states",
        ],
      },
      backend: {
        title: "API Design & Request Handling (Synced)",
        topics: [
          "REST principles: resources, HTTP methods, status codes",
          "API design: endpoint structure, versioning strategy",
          "Request validation: input validation, sanitization",
          "Response formatting: consistent error responses",
          "Middleware patterns: authentication, logging, error handling",
          "Review: Analyze API design in production systems",
          "Refactor: Improve API structure and error handling",
        ],
      },
      systems: {
        title: "Data Flow Architecture",
        topics: [
          "Unidirectional data flow: why it matters",
          "State synchronization: keeping frontend and backend in sync",
          "Error propagation: where errors should be handled",
          "Caching strategies: when to cache, when to refetch",
        ],
      },
      topics: [],
    },
    3: {
      title: "Component Architecture & Composition (3 hours)",
      frontend: {
        title: "React: Component Design & Patterns",
        topics: [
          "Component design: single responsibility, composition over inheritance",
          "Props interface: designing component APIs",
          "Component patterns: presentational vs container, compound components",
          "Reusability: when to abstract, when to duplicate",
          "Performance: memo, useMemo, useCallback - when to use",
          "Review: Analyze component architecture in production apps",
          "Refactor: Improve component structure and reusability",
        ],
      },
      backend: {
        title: "Route Architecture & Organization (Synced)",
        topics: [
          "Route organization: grouping by feature vs by type",
          "Route handlers: separation of concerns, business logic extraction",
          "Middleware composition: authentication, validation, error handling",
          "Route parameters: validation, type safety",
          "API versioning: strategies and tradeoffs",
          "Review: How do production APIs organize routes?",
          "Refactor: Improve route structure and handler organization",
        ],
      },
      systems: {
        title: "Separation of Concerns",
        topics: [
          "UI vs business logic: where does logic belong?",
          "Data layer: separating data fetching from presentation",
          "Component boundaries: what should components know?",
          "Testing: how architecture affects testability",
        ],
      },
      topics: [],
    },
    4: {
      title: "State Management & Side Effects (3 hours)",
      frontend: {
        title: "State Architecture & Effect Management",
        topics: [
          "State management: local vs global, when to lift state",
          "useEffect patterns: cleanup, dependencies, avoiding infinite loops",
          "Data fetching: custom hooks, error boundaries, retry logic",
          "State machines: managing complex state transitions",
          "Performance: avoiding unnecessary re-renders, optimizing effects",
          "Review: How do production apps manage complex state?",
          "Refactor: Improve state management and effect organization",
        ],
      },
      backend: {
        title: "Data Retrieval & Query Design (Synced)",
        topics: [
          "Query design: filtering, pagination, sorting",
          "Data transformation: shaping responses for frontend needs",
          "Caching strategies: when to cache, cache invalidation",
          "Error responses: consistent error format, status codes",
          "Performance: database query optimization, response time",
          "Review: Analyze query patterns in production APIs",
          "Refactor: Improve query design and response structure",
        ],
      },
      systems: {
        title: "Data Flow & Performance",
        topics: [
          "State synchronization: keeping UI in sync with server",
          "Optimistic updates: when and how to implement",
          "Loading strategies: skeleton screens, progressive loading",
          "Performance budgets: what is acceptable load time?",
        ],
      },
      topics: [],
    },
    5: {
      title: "Mobile Engineering: Cross-Platform Architecture (3 hours)",
      frontend: {
        title: "React Native: Architecture & Platform Considerations",
        topics: [
          "Project structure: organizing mobile apps for scale",
          "Platform differences: iOS vs Android, when to use Platform.select",
          "Native modules: when to use native code, bridge considerations",
          "Performance: list optimization, image handling, bundle size",
          "Navigation architecture: choosing navigation library, deep linking",
          "Review: Analyze architecture of production React Native apps",
          "Refactor: Improve project structure and platform handling",
        ],
      },
      backend: {
        title: "Mobile API Design (Synced)",
        topics: [
          "Mobile API considerations: payload size, request frequency",
          "Authentication: token refresh, secure storage",
          "Offline support: caching strategies, sync mechanisms",
          "Push notifications: architecture and implementation",
          "Environment configuration: dev, staging, production",
          "Review: How do production mobile apps structure APIs?",
          "Refactor: Optimize API design for mobile clients",
        ],
      },
      systems: {
        title: "Mobile Engineering Mindset",
        topics: [
          "Cross-platform tradeoffs: code reuse vs platform optimization",
          "Performance: battery, memory, network considerations",
          "User experience: platform conventions, accessibility",
          "Release process: app store requirements, versioning",
        ],
      },
      topics: [],
    },
    6: {
      title: "Navigation & Information Architecture (3 hours)",
      frontend: {
        title: "Navigation: User Flow & State Management",
        topics: [
          "Navigation architecture: stack, tab, drawer - when to use each",
          "Deep linking: URL structure, handling deep links",
          "Navigation state: persistence, restoration",
          "Screen transitions: animations, performance",
          "Navigation guards: authentication, permissions",
          "Review: Analyze navigation patterns in production mobile apps",
          "Refactor: Improve navigation structure and user flow",
        ],
      },
      backend: {
        title: "API Route Architecture (Synced)",
        topics: [
          "Route organization: feature-based vs resource-based",
          "Route versioning: strategies, backward compatibility",
          "Middleware composition: authentication, validation, logging",
          "Error handling: consistent error responses across routes",
          "API documentation: OpenAPI, Swagger",
          "Review: How do production APIs organize and document routes?",
          "Refactor: Improve route organization and documentation",
        ],
      },
      systems: {
        title: "Information Architecture",
        topics: [
          "User flow design: how users navigate complex apps",
          "State management: navigation state vs app state",
          "Deep linking strategy: what should be linkable?",
          "Analytics: tracking user navigation patterns",
        ],
      },
      topics: [],
    },
    7: {
      title: "Location Services: Real-time Data & Performance (3 hours)",
      frontend: {
        title: "Location: Architecture & Optimization",
        topics: [
          "Location service architecture: permission flow, error handling",
          "Battery optimization: update frequency, accuracy tradeoffs",
          "Location accuracy: GPS vs network, handling poor signals",
          "Background location: when and how to use",
          "Map performance: rendering optimization, clustering",
          "Review: How do production apps handle location services?",
          "Refactor: Optimize location service and map rendering",
        ],
      },
      backend: {
        title: "Location Data Architecture (Synced)",
        topics: [
          "Location data model: storing coordinates, timestamps, accuracy",
          "Location endpoints: real-time updates, historical data",
          "Geospatial queries: finding nearby locations, route calculation",
          "Privacy: GDPR considerations, data retention policies",
          "Scalability: handling high-frequency location updates",
          "Review: Analyze location data architecture in production systems",
          "Refactor: Improve location data model and API design",
        ],
      },
      systems: {
        title: "Real-time Systems",
        topics: [
          "Real-time data: WebSockets vs polling, tradeoffs",
          "Data synchronization: conflict resolution, eventual consistency",
          "Performance: battery, network, server load",
          "Privacy: location data handling, user consent",
        ],
      },
      topics: [],
    },
    8: {
      title: "Route Engineering: Algorithms & Data Structures (3 hours)",
      frontend: {
        title: "Route Display: Performance & UX",
        topics: [
          "Route rendering: polyline optimization, simplification",
          "Map camera: smooth following, zoom levels, bounds",
          "Route selection: UI patterns, multiple route display",
          "Real-time updates: animating route changes",
          "Performance: rendering many routes, memory management",
          "Review: How do mapping apps optimize route rendering?",
          "Refactor: Improve route display performance and UX",
        ],
      },
      backend: {
        title: "Route Calculation & Storage (Synced)",
        topics: [
          "Route algorithms: shortest path, time-based routing",
          "Route data structure: waypoints, segments, metadata",
          "Route storage: database schema, indexing strategies",
          "Route optimization: caching, pre-computation",
          "Edge cases: no route found, multiple routes, route updates",
          "Review: Analyze route calculation in production systems",
          "Refactor: Improve route calculation and storage design",
        ],
      },
      systems: {
        title: "Algorithmic Thinking",
        topics: [
          "Algorithm selection: when to use what algorithm",
          "Data structures: choosing the right structure for the problem",
          "Performance: time complexity, space complexity",
          "Tradeoffs: accuracy vs speed, simplicity vs optimization",
        ],
      },
      topics: [],
    },
    9: {
      title: "API Design: Contracts, Auth & Error Handling (3 hours)",
      frontend: {
        title: "API Client Architecture",
        topics: [
          "API client design: request/response interceptors, retry logic",
          "Authentication flow: token refresh, expiration handling",
          "Error handling: network errors, API errors, user feedback",
          "Request optimization: batching, debouncing, caching",
          "Type safety: TypeScript interfaces, runtime validation",
          "Review: Analyze API client architecture in production apps",
          "Refactor: Improve API client design and error handling",
        ],
      },
      backend: {
        title: "API Architecture & Security (Synced)",
        topics: [
          "Authentication: JWT design, refresh tokens, security best practices",
          "Authorization: role-based access, permissions",
          "API contracts: request/response schemas, versioning",
          "Error handling: consistent error format, status codes",
          "Rate limiting: preventing abuse, fair usage",
          "Review: How do production APIs handle auth and errors?",
          "Refactor: Improve API security and error handling",
        ],
      },
      systems: {
        title: "API Design Principles",
        topics: [
          "API contracts: clear interfaces, backward compatibility",
          "Security: authentication, authorization, data validation",
          "Error handling: user-friendly errors, debugging information",
          "Performance: response time, payload size, caching",
        ],
      },
      topics: [],
    },
    10: {
      title: "Form Architecture: Validation, State Machines & UX (3 hours)",
      frontend: {
        title: "Form Design: State Management & Validation",
        topics: [
          "Form state machines: idle, validating, submitting, success, error",
          "Validation strategy: when to validate, error display patterns",
          "Form composition: reusable form components, field components",
          "UX patterns: inline validation, progressive disclosure, error recovery",
          "Accessibility: labels, error announcements, keyboard navigation",
          "Review: Analyze form patterns in production apps",
          "Refactor: Improve form architecture and validation",
        ],
      },
      backend: {
        title: "Form Processing & Validation (Synced)",
        topics: [
          "Input validation: server-side validation, sanitization",
          "Validation libraries: schema validation, custom validators",
          "Error responses: field-level errors, validation messages",
          "File uploads: handling, validation, storage",
          "CSRF protection: preventing cross-site request forgery",
          "Review: How do production APIs handle form submissions?",
          "Refactor: Improve form processing and validation",
        ],
      },
      systems: {
        title: "Form Design Principles",
        topics: [
          "State management: form state vs submission state",
          "Validation: client vs server, when to validate",
          "UX: error messages, loading states, success feedback",
          "Security: input sanitization, CSRF protection",
        ],
      },
      topics: [],
    },
    11: {
      title:
        "System Integration: Architecture Review & Production Readiness (3 hours)",
      frontend: {
        title: "System Integration & Architecture Review",
        topics: [
          "System integration: connecting all features, data flow",
          "Architecture review: identify bottlenecks, technical debt",
          "Refactoring: improve based on learnings, extract patterns",
          "Performance audit: identify slow areas, optimize",
          "Code review: review your own code, identify improvements",
          "Documentation: document architecture decisions, tradeoffs",
          "Review: What makes a system production-ready?",
        ],
      },
      backend: {
        title: "Backend Integration & Production Considerations (Synced)",
        topics: [
          "API integration: complete data flow, error handling",
          "Database optimization: query performance, indexing",
          "Security audit: authentication, authorization, data validation",
          "Error handling: comprehensive error coverage",
          "Monitoring: logging, error tracking, performance metrics",
          "Documentation: API documentation, deployment guides",
          "Review: Production readiness checklist",
        ],
      },
      systems: {
        title: "Production Readiness & Long-term Thinking",
        topics: [
          "Architecture review: what worked, what didn't?",
          "Technical debt: identifying and prioritizing",
          "Scalability: how would this scale?",
          "Maintainability: is this easy to maintain and extend?",
          "Documentation: what needs to be documented?",
          "Tradeoffs: what decisions were made and why?",
        ],
      },
      topics: [],
    },
  };

  // Return data for the day if it exists, otherwise return default
  if (crashCourseData[dayNum]) {
    return crashCourseData[dayNum];
  }

  // Return default if day not found
  return {
    title: `Day ${dayNum} Learning`,
    frontend: {
      title: "Frontend Learning",
      topics: [`Day ${dayNum} frontend content`],
    },
    backend: {
      title: "Backend Learning",
      topics: [`Day ${dayNum} backend content`],
    },
    topics: [`Day ${dayNum} learning content`],
  };
}

// REMOVED: All duplicate crash course functions - they are defined above before softwareEngineeringWeeks
// The duplicate functions starting here have been removed to fix syntax errors
// getSoftwareEngineeringTheme is defined later in the file (around line 2538)

function getCrashCourseWorkflow(dayNum) {
  const workflows = {
    1: {
      setupCommands: [
        "mkdir code-review-day-01",
        "cd code-review-day-01",
        "git init",
        "Create architecture-notes.md",
      ],
      prompts: [
        "Review existing codebase: identify patterns and anti-patterns",
        "Analyze code structure: what makes code maintainable?",
        "Document architectural decisions: why this approach?",
        "Refactor for clarity: improve naming, structure, separation",
      ],
      refactoringTasks: [
        "Code review: identify 3-5 areas for improvement",
        "Refactor: extract functions, improve naming, add documentation",
        "Architecture: document decisions and tradeoffs",
        "Review: What patterns did you identify? What would you change?",
      ],
    },
    2: {
      setupCommands: [
        "mkdir async-js-day-02",
        "cd async-js-day-02",
        "touch api-fetcher.js",
        "npm init -y",
      ],
      prompts: [
        "Create a Promise example with .then() and .catch()",
        "Convert Promise chains to async/await syntax",
        "Build a fetch API example to get data from a public API",
        "Add error handling with try-catch for async operations",
      ],
      refactoringTasks: [
        "Convert Promise chains to async/await",
        "Add proper error handling to all async functions",
        "Extract API calls into reusable functions",
        "Add loading states and error messages",
      ],
    },
    3: {
      setupCommands: [
        "npx create-react-app react-basics-day-03",
        "cd react-basics-day-03",
        "npm start",
      ],
      prompts: [
        "Create a functional React component with props",
        "Build a component using useState hook",
        "Generate a component with event handlers (onClick, onChange)",
        "Create conditional rendering examples",
      ],
      refactoringTasks: [
        "Convert class components to functional components",
        "Extract reusable components from large components",
        "Move inline styles to CSS modules or styled-components",
        "Add PropTypes or TypeScript for type checking",
      ],
    },
    4: {
      setupCommands: [
        "cd react-basics-day-03",
        "mkdir hooks-practice",
        "touch hooks-practice/useEffectExample.js",
      ],
      prompts: [
        "Create a useEffect hook that fetches data on component mount",
        "Build a custom hook for API data fetching",
        "Generate a useEffect with dependency array examples",
        "Create a component that uses multiple hooks together",
      ],
      refactoringTasks: [
        "Extract useEffect logic into custom hooks",
        "Optimize useEffect dependencies to prevent unnecessary re-renders",
        "Add cleanup functions to useEffect hooks",
        "Separate data fetching logic from component logic",
      ],
    },
    5: {
      setupCommands: [
        "npx create-expo-app react-native-day-05",
        "cd react-native-day-05",
        "npm install",
      ],
      prompts: [
        "Create a React Native screen with View, Text, and Button components",
        "Build a styled component using StyleSheet",
        "Generate a layout using Flexbox",
        "Create platform-specific code for iOS and Android",
      ],
      refactoringTasks: [
        "Extract styles into StyleSheet.create()",
        "Create reusable styled components",
        "Organize components into separate files",
        "Add responsive design using Flexbox",
      ],
    },
    6: {
      setupCommands: [
        "cd react-native-day-05",
        "npm install @react-navigation/native @react-navigation/stack",
        "npm install react-native-screens react-native-safe-area-context",
      ],
      prompts: [
        "Set up React Navigation with Stack Navigator",
        "Create multiple screens and navigation between them",
        "Build a Tab Navigator with bottom tabs",
        "Add navigation parameters and route handling",
      ],
      refactoringTasks: [
        "Organize navigation structure into separate files",
        "Create a navigation configuration file",
        "Add TypeScript types for navigation",
        "Implement deep linking support",
      ],
    },
    7: {
      setupCommands: [
        "cd react-native-day-05",
        "npm install react-native-maps",
        "npx expo install expo-location",
      ],
      prompts: [
        "Create a MapView component displaying a map",
        "Get user location using expo-location",
        "Add markers to the map at specific coordinates",
        "Handle map interactions (onPress, region changes)",
      ],
      refactoringTasks: [
        "Extract map logic into a custom hook",
        "Create reusable map components",
        "Add location permission handling",
        "Optimize map rendering performance",
      ],
    },
    8: {
      setupCommands: [
        "cd react-native-day-05",
        "mkdir map-features",
        "touch map-features/RouteDisplay.js",
      ],
      prompts: [
        "Draw a polyline on the map connecting multiple points",
        "Create a route display component with coordinates",
        "Implement real-time location updates on the map",
        "Add map camera that follows user location",
      ],
      refactoringTasks: [
        "Extract route calculation logic",
        "Create reusable route display components",
        "Optimize polyline rendering for performance",
        "Add route selection UI components",
      ],
    },
    9: {
      setupCommands: [
        "cd react-native-day-05",
        "npm install @react-native-async-storage/async-storage",
        "mkdir api-integration",
        "touch api-integration/apiService.js",
      ],
      prompts: [
        "Create an API service using fetch",
        "Implement JWT token storage with AsyncStorage",
        "Build authentication flow with login/logout",
        "Add error handling for network requests",
      ],
      refactoringTasks: [
        "Create a centralized API service",
        "Add request/response interceptors",
        "Implement token refresh logic",
        "Add loading and error states",
      ],
    },
    10: {
      setupCommands: [
        "cd react-native-day-05",
        "mkdir forms",
        "touch forms/LoginForm.js forms/BookingForm.js",
      ],
      prompts: [
        "Create a TextInput form component",
        "Build form validation logic",
        "Implement form submission with API call",
        "Add form state management",
      ],
      refactoringTasks: [
        "Extract form validation into utilities",
        "Create reusable form components",
        "Add form error handling and display",
        "Implement form reset functionality",
      ],
    },
    11: {
      setupCommands: [
        "cd react-native-day-05",
        "mkdir transport-app",
        "touch transport-app/App.js transport-app/components/",
      ],
      prompts: [
        "Combine map, location, and booking features",
        "Create a complete transport app flow",
        "Implement user location tracking",
        "Build booking confirmation screen",
      ],
      refactoringTasks: [
        "Organize app into feature-based folders",
        "Create a navigation structure for the app",
        "Add state management (Context API or Redux)",
        "Optimize app performance and bundle size",
      ],
    },
  };

  return (
    workflows[dayNum] || {
      setupCommands: [`Setup for Day ${dayNum}`],
      prompts: [`Cursor prompts for Day ${dayNum}`],
      refactoringTasks: [`Refactoring tasks for Day ${dayNum}`],
    }
  );
}

function getCrashCourseProject(dayNum) {
  const projects = {
    1: {
      title: "Code Review & Refactoring Exercise",
      description:
        "Review existing codebase, identify patterns, refactor for maintainability. Focus on naming, structure, and separation of concerns.",
      requirements: [
        "Analyze code structure and identify anti-patterns",
        "Refactor functions for clarity and reusability",
        "Document architectural decisions",
        "Review: What makes code maintainable?",
      ],
    },
    2: {
      title: "Error Boundary System",
      description:
        "Build a robust error handling system with proper error boundaries, retry logic, and user feedback. Think about failure modes.",
      requirements: [
        "Implement error boundaries at appropriate levels",
        "Design retry strategies for network failures",
        "Create user-friendly error messages",
        "Review: How do production apps handle failures?",
      ],
    },
    3: {
      title: "Component Architecture Review",
      description:
        "Design and build a component system with clear boundaries, prop interfaces, and composition patterns. Review existing component libraries.",
      requirements: [
        "Design component API (props, composition)",
        "Separate presentational from container components",
        "Review React component patterns (Compound, Render Props)",
        "Review: What makes components reusable?",
      ],
    },
    4: {
      title: "State Management Architecture",
      description:
        "Design state management strategy: when to use local state, context, or external state. Build a data fetching layer with proper caching.",
      requirements: [
        "Design state architecture for a feature",
        "Implement data fetching with caching strategy",
        "Handle loading, error, and success states",
        "Review: When is state management over-engineered?",
      ],
    },
    5: {
      title: "Mobile Architecture Decision",
      description:
        "Set up React Native project with proper structure, navigation strategy, and platform-specific considerations. Review native module integration.",
      requirements: [
        "Design folder structure for scalability",
        "Plan navigation architecture",
        "Consider iOS vs Android differences",
        "Review: How do production mobile apps organize code?",
      ],
    },
    6: {
      title: "Navigation Architecture",
      description:
        "Design navigation flow, deep linking strategy, and state persistence. Review navigation patterns in production apps.",
      requirements: [
        "Design navigation structure and user flows",
        "Implement deep linking",
        "Handle navigation state persistence",
        "Review: How do users navigate complex apps?",
      ],
    },
    7: {
      title: "Location Service Architecture",
      description:
        "Build location service with proper permission handling, battery optimization, and accuracy tradeoffs. Review production location patterns.",
      requirements: [
        "Design location service architecture",
        "Implement permission flow and error handling",
        "Consider battery and performance implications",
        "Review: How do production apps handle location?",
      ],
    },
    8: {
      title: "Route Algorithm Implementation",
      description:
        "Implement route calculation, optimization, and display. Review routing algorithms and data structures. Consider edge cases.",
      requirements: [
        "Design route data structure",
        "Implement route calculation logic",
        "Handle edge cases (no route, multiple routes)",
        "Review: How do mapping services calculate routes?",
      ],
    },
    9: {
      title: "API Layer Architecture",
      description:
        "Design API client with authentication, request/response interceptors, error handling, and retry logic. Review API design patterns.",
      requirements: [
        "Design API client architecture",
        "Implement authentication flow",
        "Handle network errors and retries",
        "Review: How do production apps structure API calls?",
      ],
    },
    10: {
      title: "Form State Machine",
      description:
        "Build form system with validation, state management, and submission flow. Review form patterns and accessibility.",
      requirements: [
        "Design form state machine",
        "Implement validation strategy",
        "Handle submission and error states",
        "Review: How do production forms handle complexity?",
      ],
    },
    11: {
      title: "System Integration & Architecture Review",
      description:
        "Integrate all components, review architecture, identify bottlenecks, refactor for production readiness. Document decisions and tradeoffs.",
      requirements: [
        "Integrate all features into cohesive system",
        "Review architecture and identify improvements",
        "Refactor based on learnings",
        "Document architectural decisions and tradeoffs",
        "Review: What makes a system production-ready?",
      ],
    },
  };

  return (
    projects[dayNum] || {
      title: `Day ${dayNum}: Architecture & Systems Thinking`,
      description:
        "Focus on building systems, not just features. Review, refactor, improve.",
      requirements: [
        "Think about architecture",
        "Build with intention",
        "Review and improve",
      ],
    }
  );
}

function getCrashCourseResources(dayNum) {
  const resources = {
    1: [
      {
        title: "JavaScript.info",
        url: "https://javascript.info/",
        time: "60 min",
      },
      {
        title: "MDN JavaScript Guide",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        time: "30 min",
      },
    ],
    2: [
      {
        title: "MDN Fetch API",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
        time: "30 min",
      },
      {
        title: "JavaScript.info Async",
        url: "https://javascript.info/async",
        time: "60 min",
      },
    ],
    3: [
      {
        title: "React.dev Learn",
        url: "https://react.dev/learn",
        time: "90 min",
      },
      {
        title: "React Components",
        url: "https://react.dev/learn/your-first-component",
        time: "30 min",
      },
    ],
    4: [
      {
        title: "React Hooks",
        url: "https://react.dev/reference/react",
        time: "60 min",
      },
      {
        title: "useEffect Guide",
        url: "https://react.dev/reference/react/useEffect",
        time: "30 min",
      },
    ],
    5: [
      { title: "Expo Docs", url: "https://docs.expo.dev/", time: "60 min" },
      {
        title: "React Native Core Components",
        url: "https://reactnative.dev/docs/components-and-apis",
        time: "30 min",
      },
    ],
    6: [
      {
        title: "React Navigation",
        url: "https://reactnavigation.org/docs/getting-started",
        time: "60 min",
      },
      {
        title: "Navigation Guide",
        url: "https://reactnavigation.org/docs/navigating",
        time: "30 min",
      },
    ],
    7: [
      {
        title: "react-native-maps",
        url: "https://github.com/react-native-maps/react-native-maps",
        time: "30 min",
      },
      {
        title: "expo-location",
        url: "https://docs.expo.dev/versions/latest/sdk/location/",
        time: "30 min",
      },
    ],
    8: [
      {
        title: "Maps Polylines",
        url: "https://github.com/react-native-maps/react-native-maps#polyline",
        time: "30 min",
      },
      {
        title: "Location Updates",
        url: "https://docs.expo.dev/versions/latest/sdk/location/#locationwatchpositionasync",
        time: "30 min",
      },
    ],
    9: [
      {
        title: "React Native Networking",
        url: "https://reactnative.dev/docs/network",
        time: "30 min",
      },
      {
        title: "AsyncStorage",
        url: "https://react-native-async-storage.github.io/async-storage/",
        time: "30 min",
      },
    ],
    10: [
      {
        title: "TextInput",
        url: "https://reactnative.dev/docs/textinput",
        time: "30 min",
      },
      {
        title: "Forms Guide",
        url: "https://reactnative.dev/docs/handling-text-input",
        time: "30 min",
      },
    ],
    11: [
      {
        title: "Transport App Examples",
        url: "https://github.com/topics/transport-app",
        time: "30 min",
      },
      { title: "Final Review", url: "#", time: "30 min" },
    ],
  };

  return resources[dayNum] || [];
}

function getCrashCourseSocialPosting(dayNum) {
  return {
    text: `Day ${dayNum} of my 11-day React Native crash course complete! 🚀 Building towards my transport app project. #ReactNative #MobileDev #CrashCourse #CodeNewbie`,
    platforms: ["Twitter/X", "LinkedIn"],
    include: ["Screenshot of progress", "Code snippet", "What you learned"],
  };
}

function getCrashCourseReflection(dayNum) {
  const reflections = [
    "What architectural patterns did you identify today? What makes code maintainable?",
    "How did you handle async complexity? What error boundaries did you design?",
    "What component patterns did you use? How did you balance reusability vs simplicity?",
    "How did you organize state? What tradeoffs did you make?",
    "What mobile architecture decisions did you make? How did you handle platform differences?",
    "How did you design navigation? What user flows did you consider?",
    "What performance considerations did you make for location services? What tradeoffs?",
    "What algorithms or data structures did you use? Why did you choose them?",
    "How did you design your API client? What error handling patterns did you implement?",
    "How did you structure form validation? What UX patterns did you use?",
    "Architecture review: What worked well? What would you change? What technical debt exists? What makes this production-ready?",
  ];
  return (
    reflections[dayNum - 1] ||
    "Reflect on today's architectural decisions and tradeoffs"
  );
}

function getCrashCourseTimeBlocks() {
  return {
    deepLearning: [
      {
        time: "Hour 1",
        discipline: "Learning",
        type: "study",
        duration: "60 min",
      },
    ],
    focusedImplementation: [
      {
        time: "Hour 2",
        discipline: "Practice",
        type: "build",
        duration: "60 min",
      },
      {
        time: "Hour 3",
        discipline: "Build",
        type: "build",
        duration: "60 min",
      },
    ],
  };
}

function getCrashCourseDisciplineRotation(dayNum) {
  // Focus shifts: Days 1-2 (JS), Days 3-4 (React), Days 5-11 (React Native)
  if (dayNum <= 2) {
    return {
      primary: "Frontend",
      secondary: "Backend",
      tertiary: "Mobile",
      quaternary: "Systems Engineering",
      allDisciplines: ["Frontend", "Backend", "Mobile", "Systems Engineering"],
      rotationOrder: ["Frontend", "Backend"],
      earlyMorningDiscipline: "Frontend",
    };
  } else if (dayNum <= 4) {
    return {
      primary: "Frontend",
      secondary: "Backend",
      tertiary: "Mobile",
      quaternary: "Systems Engineering",
      allDisciplines: ["Frontend", "Backend", "Mobile", "Systems Engineering"],
      rotationOrder: ["Frontend", "Backend"],
      earlyMorningDiscipline: "Frontend",
    };
  } else {
    return {
      primary: "Mobile",
      secondary: "Backend",
      tertiary: "Frontend",
      quaternary: "Systems Engineering",
      allDisciplines: ["Mobile", "Backend", "Frontend", "Systems Engineering"],
      rotationOrder: ["Mobile", "Backend"],
      earlyMorningDiscipline: "Mobile",
    };
  }
}

// ============================================================================
// PROJECT-DRIVEN SOFTWARE ENGINEERING JOURNEY
// ============================================================================
// Flagship Project: Transport/Service App
// A production-ready application with:
// - Web Frontend (React): Customer-facing dashboard
// - Mobile App (React Native): iOS/Android app
// - Backend API (Node.js): REST API serving web and mobile
// - Admin/CMS (Systems Engineering): Content and resource management
//
// Each day builds toward this project with clear:
// - What you're building (component/feature/endpoint)
// - Which part of the project it affects
// - Key technical concepts used
// - Expected output
// ============================================================================

// Project Structure Definition
// Discipline-specific project definitions
const DISCIPLINE_PROJECTS = {
  Frontend: {
    name: "Customer Web Dashboard",
    description: "A production-ready responsive web application with modern UI/UX, built with React and modern frontend technologies",
    clues: [
      "Focus on component reusability and composition patterns",
      "Implement responsive design with mobile-first approach",
      "Use state management for complex data flows",
      "Optimize for performance with code splitting and lazy loading",
      "Ensure accessibility (a11y) standards throughout",
      "Implement proper error boundaries and loading states",
      "Use modern CSS-in-JS or utility-first CSS frameworks",
      "Build reusable form components with validation",
      "Implement client-side routing with React Router",
      "Focus on user experience and smooth interactions"
    ],
    keyThings: [
      "Component architecture and folder structure",
      "State management (Context API, Redux, or Zustand)",
      "Form handling and validation libraries",
      "API integration and data fetching patterns",
      "Responsive breakpoints and media queries",
      "Performance optimization (memoization, virtualization)",
      "Accessibility features (ARIA labels, keyboard navigation)",
      "Error handling and user feedback",
      "Testing strategies (unit, integration, E2E)",
      "Build tools and bundling (Vite, Webpack)"
    ]
  },
  Mobile: {
    name: "Mobile App",
    description: "A production-ready cross-platform mobile application built with React Native, featuring native performance and offline capabilities",
    clues: [
      "Design for both iOS and Android platform differences",
      "Implement native navigation patterns (Stack, Tab, Drawer)",
      "Handle device-specific features (camera, location, push notifications)",
      "Optimize for different screen sizes and orientations",
      "Implement offline-first architecture with local storage",
      "Use native modules for platform-specific functionality",
      "Focus on touch interactions and gesture handling",
      "Optimize app performance and bundle size",
      "Handle app state persistence across sessions",
      "Test on both iOS and Android devices/emulators"
    ],
    keyThings: [
      "React Native navigation (React Navigation)",
      "Platform-specific code (Platform.OS checks)",
      "Native modules and bridge communication",
      "State persistence (AsyncStorage, Redux Persist)",
      "Offline data synchronization",
      "Push notification setup",
      "App icons and splash screens",
      "Deep linking and universal links",
      "Performance monitoring and crash reporting",
      "App store deployment process"
    ]
  },
  Backend: {
    name: "REST API Server",
    description: "A production-ready RESTful API backend built with Node.js and Express, featuring authentication, data management, and secure endpoints",
    clues: [
      "Design RESTful endpoints following REST principles",
      "Implement proper authentication and authorization",
      "Use middleware for request validation and error handling",
      "Design database schemas with relationships",
      "Implement rate limiting and security measures",
      "Handle file uploads and storage",
      "Use environment variables for configuration",
      "Implement logging and monitoring",
      "Write comprehensive API documentation",
      "Focus on scalability and performance optimization"
    ],
    keyThings: [
      "REST API design patterns and conventions",
      "Authentication (JWT, OAuth, session-based)",
      "Database design (SQL/NoSQL, relationships, migrations)",
      "Middleware architecture (auth, validation, error handling)",
      "API security (CORS, rate limiting, input sanitization)",
      "Error handling and status codes",
      "File upload and storage (local, cloud)",
      "API documentation (Swagger/OpenAPI)",
      "Testing (unit, integration, API testing)",
      "Deployment and environment management"
    ]
  },
  "Systems Engineering": {
    name: "WordPress CMS Platform",
    description: "A production-ready WordPress content management system with custom themes, plugins, and administrative capabilities",
    clues: [
      "Create custom post types and taxonomies",
      "Build reusable theme templates and components",
      "Develop custom plugins for specific functionality",
      "Implement user role management and permissions",
      "Design admin interfaces and custom dashboards",
      "Optimize for performance and SEO",
      "Ensure security best practices",
      "Create custom widgets and shortcodes",
      "Implement proper data migration strategies",
      "Focus on client-friendly admin experience"
    ],
    keyThings: [
      "WordPress theme development (PHP, HTML, CSS)",
      "Custom post types and taxonomies",
      "Plugin development and hooks system",
      "User roles and capabilities",
      "Database queries (WP_Query, get_posts)",
      "REST API and AJAX requests",
      "Security (nonces, sanitization, validation)",
      "Performance (caching, optimization)",
      "SEO optimization (meta tags, schema markup)",
      "Client onboarding and documentation"
    ]
  },
};

const TRANSPORT_APP_PROJECT = {
  name: "Transport/Service App",
  description: "A production-ready transport and service booking platform",
  components: {
    frontend: {
      name: "Customer Web Dashboard",
      parts: [
        "Layout (Header, Sidebar, Footer)",
        "Auth Pages (Login, Register)",
        "Dashboard Home",
        "Booking Interface",
        "Service List Views",
        "Service Detail Pages",
        "User Profile",
        "Booking History",
        "Payment UI (ready)",
        "Forms (controlled inputs)",
        "Modals & Alerts",
        "Loading & Error States",
      ],
    },
    mobile: {
      name: "Mobile App",
      parts: [
        "Splash & Onboarding",
        "Login/Register Screens",
        "Home Dashboard",
        "Booking Flow",
        "Service History",
        "Profile Screen",
        "Navigation (Stack/Tabs)",
        "Offline Support",
      ],
    },
    backend: {
      name: "REST API",
      parts: [
        "Authentication Endpoints",
        "User Management",
        "Service CRUD Operations",
        "Booking Management",
        "Payment Processing (ready)",
        "File Upload Handling",
        "API Security",
        "Error Handling",
      ],
    },
    "systems-engineering": {
      name: "Admin/CMS Layer",
      parts: [
        "Content Management",
        "Resource Upload",
        "Admin Dashboards",
        "Client Updates",
        "Custom Post Types",
        "User Roles & Permissions",
      ],
    },
  },
  buildPhases: {
    weeks1_2: "Foundation: Setup, Auth, Basic Layouts",
    weeks3_4: "Core Features: Booking, Lists, Navigation",
    weeks5_6: "Integration: API Connections, State Management",
    weeks7_8: "Enhancement: Advanced Features, Performance",
    weeks9_10: "Polish: UX Improvements, Error Handling",
    weeks11_12: "Production: Security, Testing, Deployment",
    week13: "Finalization: Documentation, Optimization",
  },
};

// Get build phase for week
function getBuildPhaseForWeek(weekNum) {
  if (weekNum <= 2) return TRANSPORT_APP_PROJECT.buildPhases.weeks1_2;
  if (weekNum <= 4) return TRANSPORT_APP_PROJECT.buildPhases.weeks3_4;
  if (weekNum <= 6) return TRANSPORT_APP_PROJECT.buildPhases.weeks5_6;
  if (weekNum <= 8) return TRANSPORT_APP_PROJECT.buildPhases.weeks7_8;
  if (weekNum <= 10) return TRANSPORT_APP_PROJECT.buildPhases.weeks9_10;
  if (weekNum <= 12) return TRANSPORT_APP_PROJECT.buildPhases.weeks11_12;
  return TRANSPORT_APP_PROJECT.buildPhases.week13;
}

// Map day number to project component being built
function getProjectComponentForDay(dayNumber, discipline) {
  const dayIndex = dayNumber - 1;

  // Frontend components progression
  if (discipline === "Frontend") {
    if (dayNumber <= 3)
      return {
        component: "Project Setup & HTML Structure",
        part: "Foundation",
      };
    if (dayNumber <= 7)
      return {
        component: "Layout Components",
        part: "Layout (Header, Sidebar, Footer)",
      };
    if (dayNumber <= 14)
      return { component: "Auth Pages", part: "Auth Pages (Login, Register)" };
    if (dayNumber <= 21)
      return { component: "Dashboard", part: "Dashboard Home" };
    if (dayNumber <= 28)
      return { component: "List Views", part: "Service List Views" };
    if (dayNumber <= 35)
      return { component: "Detail Pages", part: "Service Detail Pages" };
    if (dayNumber <= 42)
      return { component: "Forms", part: "Forms (controlled inputs)" };
    if (dayNumber <= 49)
      return { component: "Modals & Alerts", part: "Modals & Alerts" };
    if (dayNumber <= 56)
      return { component: "Booking Interface", part: "Booking Interface" };
    if (dayNumber <= 63)
      return {
        component: "Profile & History",
        part: "User Profile, Booking History",
      };
    if (dayNumber <= 70)
      return {
        component: "Loading & Error States",
        part: "Loading & Error States",
      };
    if (dayNumber <= 77)
      return { component: "Payment UI", part: "Payment UI (ready)" };
    if (dayNumber <= 84)
      return { component: "Performance Optimization", part: "All Components" };
    return { component: "Final Polish", part: "All Components" };
  }

  // Mobile screens progression
  if (discipline === "Mobile") {
    if (dayNumber <= 3)
      return { component: "Project Setup", part: "Foundation" };
    if (dayNumber <= 7)
      return { component: "Splash & Onboarding", part: "Splash & Onboarding" };
    if (dayNumber <= 14)
      return { component: "Auth Screens", part: "Login/Register Screens" };
    if (dayNumber <= 21)
      return { component: "Home Dashboard", part: "Home Dashboard" };
    if (dayNumber <= 28)
      return { component: "Navigation", part: "Navigation (Stack/Tabs)" };
    if (dayNumber <= 35)
      return { component: "Booking Flow", part: "Booking Flow" };
    if (dayNumber <= 42)
      return { component: "Service History", part: "Service History" };
    if (dayNumber <= 49)
      return { component: "Profile Screen", part: "Profile Screen" };
    if (dayNumber <= 56)
      return { component: "Offline Support", part: "Offline Support" };
    if (dayNumber <= 63)
      return { component: "API Integration", part: "All Screens" };
    if (dayNumber <= 70)
      return { component: "Performance", part: "All Screens" };
    if (dayNumber <= 77)
      return { component: "Platform Optimization", part: "All Screens" };
    return { component: "Final Polish", part: "All Screens" };
  }

  // Backend endpoints progression
  if (discipline === "Backend") {
    if (dayNumber <= 3)
      return { component: "Project Setup", part: "Foundation" };
    if (dayNumber <= 7)
      return { component: "Express Setup", part: "Foundation" };
    if (dayNumber <= 14)
      return { component: "Auth Endpoints", part: "Authentication Endpoints" };
    if (dayNumber <= 21)
      return { component: "User Management", part: "User Management" };
    if (dayNumber <= 28)
      return { component: "Service CRUD", part: "Service CRUD Operations" };
    if (dayNumber <= 35)
      return { component: "Booking Endpoints", part: "Booking Management" };
    if (dayNumber <= 42)
      return { component: "File Upload", part: "File Upload Handling" };
    if (dayNumber <= 49)
      return { component: "API Security", part: "API Security" };
    if (dayNumber <= 56)
      return { component: "Error Handling", part: "Error Handling" };
    if (dayNumber <= 63)
      return {
        component: "Payment Endpoints",
        part: "Payment Processing (ready)",
      };
    if (dayNumber <= 70)
      return { component: "Performance", part: "All Endpoints" };
    if (dayNumber <= 77) return { component: "Testing", part: "All Endpoints" };
    return { component: "Documentation", part: "All Endpoints" };
  }

  // Systems Engineering features progression
  if (discipline === "Systems Engineering") {
    if (dayNumber <= 7)
      return { component: "Systems Engineering Setup", part: "Foundation" };
    if (dayNumber <= 14)
      return { component: "Custom Post Types", part: "Custom Post Types" };
    if (dayNumber <= 21)
      return { component: "Content Management", part: "Content Management" };
    if (dayNumber <= 28)
      return { component: "User Roles", part: "User Roles & Permissions" };
    if (dayNumber <= 35)
      return { component: "Resource Upload", part: "Resource Upload" };
    if (dayNumber <= 42)
      return { component: "Admin Dashboards", part: "Admin Dashboards" };
    if (dayNumber <= 49)
      return { component: "Client Updates", part: "Client Updates" };
    if (dayNumber <= 56)
      return { component: "Theme Customization", part: "All Features" };
    if (dayNumber <= 63)
      return { component: "Plugin Development", part: "All Features" };
    if (dayNumber <= 70) return { component: "Security", part: "All Features" };
    return { component: "Final Polish", part: "All Features" };
  }

  return { component: "Project Work", part: "General" };
}

// Software Engineering Journey - Full 13-Week Journey
// January 19, 2026 - April 18, 2026 (90 days)
// Official Ascension Phase - Day 1 = January 19, 2026 (Monday)
export const softwareEngineeringWeeks = generateWeeks(JOURNEY_START_DATE, 26).map(
  (week, idx) => {
    const days = [];
    const weekNum = idx + 1;

    for (let i = 0; i < 7; i++) {
      // Parse startDate string properly to avoid timezone issues
      // week.startDate is in format "YYYY-MM-DD"
      const [year, month, day] = week.startDate.split('-').map(Number);
      const dayDate = new Date(year, month - 1, day + i); // month is 0-indexed in JavaScript

      const dayDateString = dayDate.toISOString().split("T")[0];
      // Day 0 = Saturday, February 7, 2026 (Preparation, before Week 1)
      // Day 1 = Sunday, February 8, 2026 (Week 1, i=0) - First day of journey
      // Calculate: Week 1 (idx=0) starts at Day 1, so dayNumber = idx * 7 + i + 1
      // Week 1: i=0 -> Day 1, i=1 -> Day 2, ..., i=6 -> Day 7
      // Week 2: i=0 -> Day 8, i=1 -> Day 9, ..., i=6 -> Day 14
      const dayNumber = idx * 7 + i + 1; // Day 1, 2, 3, ... up to 180 (Day 0 is separate)

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

      // Week 1 starts from Day 1 (Sunday, February 8, 2026) - actual content execution begins
      // Content week numbering: Day 1 = Week 1 content, Days 1-7 = Week 1 content, Days 8-14 = Week 2 content, etc.
      // Week numbering: idx 0 = Week 1, idx 1 = Week 2, etc.
      const contentWeekNum = idx + 1; // Week 1, 2, 3, etc.

      // Use actual content for all days (no test run)
      // Pass dayNumber to ensure content is unique per day (1-182) and progressive
      const learningData = getSoftwareEngineeringLearning(contentWeekNum, i, dayNumber);
      const workflowData = getSoftwareEngineeringCursorWorkflow(contentWeekNum, i);
      let projectData = getSoftwareEngineeringProject(contentWeekNum, i, dayNumber);
      const disciplineRotation = getDisciplineRotation(contentWeekNum, dayIndex);
      const timeBlocks = getTimeBlocks(dayIndex); // Use actual day of week

      // Enrich project data with project-driven information for each discipline
      if (projectData && typeof projectData === "object") {
        // If projectData has discipline-specific data, enrich each
        if (
          projectData.frontend ||
          projectData.mobile ||
          projectData.backend ||
          projectData["systems-engineering"]
        ) {
          ["frontend", "mobile", "backend", "systems-engineering"].forEach(
            (discipline) => {
              if (projectData[discipline]) {
                const capitalized =
                  discipline.charAt(0).toUpperCase() + discipline.slice(1);
                projectData[discipline] = enrichProjectWithProjectInfo(
                  projectData[discipline],
                  dayNumber,
                  capitalized
                );
              }
            }
          );
        } else {
          // Single project data - enrich based on primary discipline for the day
          const primaryDiscipline =
            disciplineRotation.primary || "Frontend";
          projectData = enrichProjectWithProjectInfo(
            projectData,
            dayNumber,
            primaryDiscipline
          );
        }
      }

      // Map content to time blocks
      const scheduledContent = organizeContentBySchedule(
        learningData,
        projectData,
        workflowData,
        contentWeekNum,
        dayIndex,
        disciplineRotation,
        timeBlocks,
        dayNumber
      );

      // Get project component information for each discipline
      const projectInfo = {
        frontend: getProjectComponentForDay(dayNumber, "Frontend"),
        mobile: getProjectComponentForDay(dayNumber, "Mobile"),
        backend: getProjectComponentForDay(dayNumber, "Backend"),
        "systems-engineering": getProjectComponentForDay(
          dayNumber,
          "Systems Engineering"
        ),
      };

      // Create discipline-specific project information
      const disciplineProjects = {
        Frontend: {
          name: DISCIPLINE_PROJECTS.Frontend.name,
          description: DISCIPLINE_PROJECTS.Frontend.description,
          components: projectInfo,
          buildPhase: getBuildPhaseForWeek(contentWeekNum),
        },
        Mobile: {
          name: DISCIPLINE_PROJECTS.Mobile.name,
          description: DISCIPLINE_PROJECTS.Mobile.description,
          components: projectInfo,
          buildPhase: getBuildPhaseForWeek(contentWeekNum),
        },
        Backend: {
          name: DISCIPLINE_PROJECTS.Backend.name,
          description: DISCIPLINE_PROJECTS.Backend.description,
          components: projectInfo,
          buildPhase: getBuildPhaseForWeek(contentWeekNum),
        },
        "Systems Engineering": {
          name: DISCIPLINE_PROJECTS["Systems Engineering"].name,
          description: DISCIPLINE_PROJECTS["Systems Engineering"].description,
          components: projectInfo,
          buildPhase: getBuildPhaseForWeek(contentWeekNum),
        },
      };

      // Get primary discipline for backward compatibility
      const primaryDiscipline = disciplineRotation.primary || "Frontend";
      const defaultProject = disciplineProjects[primaryDiscipline] || disciplineProjects.Frontend;

      days.push({
        dayNumber: dayNumber,
        date: dayDateString,
        dayName: actualDayName,
        theme: getSoftwareEngineeringTheme(contentWeekNum),
        dailyLearning: learningData,
        cursorWorkflow: workflowData,
        miniProject: projectData,
        // Resources are discipline-specific and come from schedule sessions, not day-level
        // Each discipline (Mobile, Frontend, Backend, WordPress) has its own resources in their schedule sessions
        resources: [], // Empty - resources come from discipline-specific schedule sessions
        monetization: getSoftwareEngineeringMonetization(contentWeekNum, i),
        quiz: getSoftwareEngineeringQuizzes(contentWeekNum, i),
        socialPosting: getSoftwareEngineeringSocialPosting(contentWeekNum, i),
        reflection: getSoftwareEngineeringReflection(contentWeekNum, i, dayNumber),
        dailyQuiz: getDailyCumulativeQuiz(contentWeekNum, i, dayNumber),
        practicalAssessment: getDailyPracticalAssessment(contentWeekNum, i, dayNumber),
        isTestRun: false,
        testRunNote: null,
        testRunTasks: null,
        schedule: {
          timeBlocks: timeBlocks,
          disciplineRotation: disciplineRotation,
          scheduledContent: scheduledContent,
        },
        // Project-driven information - discipline-specific (for backward compatibility, use primary)
        project: defaultProject,
        // Discipline-specific projects (for UI to switch between)
        disciplineProjects: disciplineProjects,
        isTestRun: false,
        testRunNote: null,
        testRunTasks: null,
      });
    }

    return { ...week, theme: getSoftwareEngineeringTheme(weekNum), days };
  }
);

// Syncing logic: Connect Frontend → Backend → Mobile → Systems Engineering
function getSyncedContent(
  discipline,
  weekNum,
  dayIndex,
  allDisciplinesContent
) {
  // Ensure backend tasks relate to frontend material
  // Mobile tasks integrate APIs built in backend
  // Systems Engineering tasks align with real-world patterns

  const syncMap = {
    Frontend: {
      connectsTo: ["Backend"], // Frontend prepares for backend integration
      prepares: "API consumption, data fetching patterns",
    },
    Backend: {
      connectsTo: ["Frontend", "Mobile"], // Backend serves frontend and mobile
      prepares: "REST APIs, authentication, database queries",
    },
    Mobile: {
      connectsTo: ["Backend"], // Mobile consumes backend APIs
      prepares: "API integration, state management with backend data",
    },
    "Systems Engineering": {
      connectsTo: ["Frontend"], // Systems Engineering uses frontend skills
      prepares: "Theme development, plugin UI, block development",
    },
  };

  const sync = syncMap[discipline] || {};
  const relatedDisciplines = sync.connectsTo || [];

  // Find content from related disciplines to ensure coherence
  const relatedContent = relatedDisciplines
    .map((relDisc) => {
      const relContent = allDisciplinesContent[relDisc];
      return relContent
        ? {
            discipline: relDisc,
            connection: sync.prepares,
            content: relContent,
          }
        : null;
    })
    .filter(Boolean);

  return {
    sync: sync,
    relatedContent: relatedContent,
    coherence:
      relatedContent.length > 0
        ? "Synced with related disciplines"
        : "Standalone",
  };
}

// Organize existing content into scheduled time blocks by discipline
function organizeContentBySchedule(
  learningData,
  projectData,
  workflowData,
  weekNum,
  dayIndex,
  disciplineRotation,
  timeBlocks,
  dayNumber = null
) {
  const scheduled = {
    deepLearning: [],
    focusedImplementation: [],
  };

  const isSaturday = dayIndex === 5;
  const isSunday = dayIndex === 6;
  
  // Calculate dayNumber if not provided
  const calculatedDayNumber = dayNumber || ((weekNum - 1) * 7 + dayIndex + 1);

  if (isSaturday) {
    // Saturday: Mobile Revision, Frontend, Backend
    // Mobile Revision Learning
    if (timeBlocks.deepLearning && timeBlocks.deepLearning.length > 0) {
      timeBlocks.deepLearning.forEach((block) => {
        const disciplineContent = getDisciplineContent(
          learningData,
          block.discipline,
          weekNum,
          "study",
          dayIndex,
          calculatedDayNumber
        );
        scheduled.deepLearning.push({
          ...block,
          content: {
            ...disciplineContent,
            isRevision: block.isRevision || false,
          },
        });
      });
    }

    // Mobile Revision (Focused Implementation)
    if (
      timeBlocks.focusedImplementation &&
      timeBlocks.focusedImplementation.length > 0
    ) {
      timeBlocks.focusedImplementation.forEach((block) => {
        // For revision sessions, use revision content instead of regular project content
        const revisionContent = block.isRevision
          ? getRevisionContent(block.discipline, weekNum, dayIndex)
          : getDisciplineContent(
              projectData,
              block.discipline,
              weekNum,
              "build",
              dayIndex,
              calculatedDayNumber
            );
        scheduled.focusedImplementation.push({
          ...block,
          content: {
            ...revisionContent,
            isRevision: block.isRevision || false,
            revisionType: "practice",
          },
        });
      });
    }

    return scheduled;
  }

  if (isSunday) {
    // Sunday: WordPress only
    // WordPress Learning
    if (timeBlocks.deepLearning && timeBlocks.deepLearning.length > 0) {
      timeBlocks.deepLearning.forEach((block) => {
        const learningDataWithDayIndex = {
          ...learningData,
          dayIndex: dayIndex,
        };
        const disciplineContent = getDisciplineContent(
          learningDataWithDayIndex,
          block.discipline,
          weekNum,
          "study",
          dayIndex,
          calculatedDayNumber
        );
        scheduled.deepLearning.push({
          ...block,
          content: {
            ...disciplineContent,
            isRevision: block.isRevision || false,
          },
        });
      });
    }

    // WordPress Implementation (if any)
    if (
      timeBlocks.focusedImplementation &&
      timeBlocks.focusedImplementation.length > 0
    ) {
      timeBlocks.focusedImplementation.forEach((block) => {
        // For revision sessions, use revision content instead of regular project content
        const revisionContent = block.isRevision
          ? getRevisionContent(block.discipline, weekNum, dayIndex)
          : getDisciplineContent(
              { ...projectData, dayIndex: dayIndex },
              block.discipline,
              weekNum,
              "build",
              dayIndex,
              calculatedDayNumber
            );
        scheduled.focusedImplementation.push({
          ...block,
          content: {
            ...revisionContent,
            isRevision: block.isRevision || false,
            revisionType: "practice",
          },
        });
      });
    }

    return scheduled;
  }

  // Monday-Friday: Mobile (Mon-Wed), Frontend (Thu-Fri), Backend (Fri evening)
  const allDisciplines = disciplineRotation.allDisciplines; // ['Mobile'] or ['Frontend', 'Backend'] or ['Frontend']

  // Collect all discipline content for syncing
  const allDisciplinesContent = {};
  const learningDataWithDayIndex = { ...learningData, dayIndex: dayIndex };
  const projectDataWithDayIndex = { ...projectData, dayIndex: dayIndex };
  allDisciplines.forEach((disc) => {
    allDisciplinesContent[disc] = {
      learning: getDisciplineContent(
        learningDataWithDayIndex,
        disc,
        weekNum,
        "study",
        dayIndex,
        calculatedDayNumber
      ),
      project: getDisciplineContent(
        projectDataWithDayIndex,
        disc,
        weekNum,
        "build",
        dayIndex,
        calculatedDayNumber
      ),
    };
  });

  // Map learning content to Deep Learning blocks with syncing
  timeBlocks.deepLearning.forEach((block) => {
    const discipline = block.discipline;
    // Pass dayIndex for mobile content generation
    const learningDataWithDayIndex = { ...learningData, dayIndex: dayIndex };
    const disciplineContent = getDisciplineContent(
      learningDataWithDayIndex,
      discipline,
      weekNum,
      "study",
      dayIndex,
      calculatedDayNumber
    );
    const syncInfo = getSyncedContent(
      discipline,
      weekNum,
      dayIndex,
      allDisciplinesContent
    );

    scheduled.deepLearning.push({
      ...block,
      content: {
        ...disciplineContent,
        sync: syncInfo,
        isRevision: block.isRevision || false,
      },
    });
  });

  // Map project content to Focused Implementation blocks with syncing
  timeBlocks.focusedImplementation.forEach((block) => {
    const discipline = block.discipline;
    // Pass dayIndex for mobile content generation
    const projectDataWithDayIndex = { ...projectData, dayIndex: dayIndex };
    const disciplineContent = getDisciplineContent(
      projectDataWithDayIndex,
      discipline,
      weekNum,
      "build",
      dayIndex,
      calculatedDayNumber
    );
    const syncInfo = getSyncedContent(
      discipline,
      weekNum,
      dayIndex,
      allDisciplinesContent
    );

    scheduled.focusedImplementation.push({
      ...block,
      content: {
        ...disciplineContent,
        sync: syncInfo,
        isRevision: block.isRevision || false,
        revisionType: block.isRevision ? "practice" : undefined,
      },
    });
  });

  // Ensure all required disciplines for this day are covered
  const coveredDisciplines = new Set([
    ...scheduled.deepLearning.map((b) => b.discipline),
    ...scheduled.focusedImplementation.map((b) => b.discipline),
  ]);

  // Only add missing disciplines that are in the rotation for this day
  allDisciplines.forEach((discipline) => {
    if (!coveredDisciplines.has(discipline)) {
      // Add missing discipline to appropriate time blocks
      if (timeBlocks.additional) {
        const studyBlock = timeBlocks.additional.deepLearning.find(
          (b) => b.discipline === discipline
        );
        const buildBlock = timeBlocks.additional.focusedImplementation.find(
          (b) => b.discipline === discipline
        );

        if (studyBlock) {
          scheduled.deepLearning.push({
            ...studyBlock,
            content: getDisciplineContent(
              { ...learningData, dayIndex: dayIndex },
              discipline,
              weekNum,
              "study",
              dayIndex,
              calculatedDayNumber
            ),
          });
        }

        if (buildBlock) {
          scheduled.focusedImplementation.push({
            ...buildBlock,
            content: getDisciplineContent(
              { ...projectData, dayIndex: dayIndex },
              discipline,
              weekNum,
              "build",
              dayIndex,
              calculatedDayNumber
            ),
          });
        }
      } else {
        // Fallback: add to flexible time (only if discipline is in rotation)
        scheduled.deepLearning.push({
          time: "Flexible",
          discipline: discipline,
          type: "study",
          duration: "30-60 min",
          content: getDisciplineContent(
            { ...learningData, dayIndex: dayIndex },
            discipline,
            weekNum,
            "study",
            dayIndex,
            calculatedDayNumber
          ),
        });

        scheduled.focusedImplementation.push({
          time: "Flexible",
          discipline: discipline,
          type: "build",
          duration: "30-60 min",
          content: getDisciplineContent(
            { ...projectData, dayIndex: dayIndex },
            discipline,
            weekNum,
            "build",
            dayIndex,
            calculatedDayNumber
          ),
        });
      }
    }
  });

  return scheduled;
}

// Generate revision content for weekend sessions
function getRevisionContent(discipline, weekNum, dayIndex) {
  const revisionTemplates = {
    Mobile: {
      title: `${discipline} Revision - Week ${weekNum}`,
      description:
        "Review, practice, and fix gaps from this week's Mobile Engineering learning",
      topics: [
        "Review all Mobile concepts learned this week",
        "Practice building mobile components",
        "Fix any gaps or unclear concepts",
        "Revisit challenging topics",
        "Build a small practice project",
        "Review code from earlier in the week",
        "Identify areas for improvement",
      ],
      requirements: [
        "Review all Mobile Engineering notes from this week",
        "Complete any unfinished Mobile tasks",
        "Practice key concepts through coding exercises",
        "Fix any bugs or issues in Mobile projects",
        "Reflect on what you learned and what needs more practice",
      ],
    },
    Frontend: {
      title: `${discipline} Revision - Week ${weekNum}`,
      description:
        "Review, practice, and fix gaps from this week's Frontend Engineering learning",
      topics: [
        "Review all Frontend concepts learned this week",
        "Practice building React components",
        "Fix any gaps or unclear concepts",
        "Revisit challenging topics",
        "Build a small practice project",
        "Review code from earlier in the week",
        "Identify areas for improvement",
      ],
      requirements: [
        "Review all Frontend Engineering notes from this week",
        "Complete any unfinished Frontend tasks",
        "Practice key concepts through coding exercises",
        "Fix any bugs or issues in Frontend projects",
        "Reflect on what you learned and what needs more practice",
      ],
    },
    Backend: {
      title: `${discipline} Revision - Week ${weekNum}`,
      description:
        "Review, practice, and fix gaps from this week's Backend Engineering learning",
      topics: [
        "Review all Backend concepts learned this week",
        "Practice building APIs and endpoints",
        "Fix any gaps or unclear concepts",
        "Revisit challenging topics",
        "Build a small practice project",
        "Review code from earlier in the week",
        "Identify areas for improvement",
      ],
      requirements: [
        "Review all Backend Engineering notes from this week",
        "Complete any unfinished Backend tasks",
        "Practice key concepts through coding exercises",
        "Fix any bugs or issues in Backend projects",
        "Reflect on what you learned and what needs more practice",
      ],
    },
  };

  return (
    revisionTemplates[discipline] || {
      title: `${discipline} Revision - Week ${weekNum}`,
      description: "Review, practice, and fix gaps from this week's learning",
      topics: [
        "Review all concepts learned this week",
        "Practice key skills",
        "Fix any gaps or unclear concepts",
        "Revisit challenging topics",
      ],
      requirements: [
        "Review all notes from this week",
        "Complete any unfinished tasks",
        "Practice key concepts",
        "Reflect on what you learned",
      ],
    }
  );
}

// Get discipline-specific content from existing curriculum
// Skill-specific resource mapping with videos, docs, and course materials
function getSkillResources(skillName) {
  const skillResources = {
    // Frontend Skills
    HTML5: [
      {
        title: "MDN HTML5 Elements Guide",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element",
        category: "Documentation",
        time: "30 min",
        type: "deep-learning",
      },
      {
        title: "HTML5 Crash Course - Traversy Media",
        url: "https://www.youtube.com/watch?v=UB1O30fR-EE",
        category: "Video",
        time: "60 min",
        type: "deep-learning",
      },
      {
        title: "HTML5 Semantic Elements",
        url: "https://www.w3schools.com/html/html5_semantic_elements.asp",
        category: "Tutorial",
        time: "20 min",
        type: "deep-learning",
      },
      {
        title: "HTML5 Accessibility Guide",
        url: "https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML",
        category: "Documentation",
        time: "25 min",
        type: "deep-learning",
      },
    ],
    CSS3: [
      {
        title: "MDN CSS Basics",
        url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics",
        category: "Documentation",
        time: "30 min",
        type: "deep-learning",
      },
      {
        title: "CSS Crash Course - Traversy Media",
        url: "https://www.youtube.com/watch?v=yfoY53QXEnI",
        category: "Video",
        time: "90 min",
        type: "deep-learning",
      },
      {
        title: "CSS Flexbox Guide",
        url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
        category: "Tutorial",
        time: "20 min",
        type: "deep-learning",
      },
      {
        title: "CSS Grid Guide",
        url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
        category: "Tutorial",
        time: "25 min",
        type: "deep-learning",
      },
      {
        title: "Responsive Design Tutorial",
        url: "https://web.dev/learn/design/",
        category: "Course",
        time: "45 min",
        type: "deep-learning",
      },
    ],
    TailwindCSS: [
      {
        title: "Tailwind CSS Official Docs",
        url: "https://tailwindcss.com/docs",
        category: "Documentation",
        time: "Reference",
        type: "deep-learning",
      },
      {
        title: "Tailwind CSS Crash Course",
        url: "https://www.youtube.com/watch?v=UB1O30fR-EE",
        category: "Video",
        time: "60 min",
        type: "deep-learning",
      },
      {
        title: "Tailwind CSS Components",
        url: "https://tailwindui.com/components",
        category: "Examples",
        time: "30 min",
        type: "deep-learning",
      },
      {
        title: "Tailwind Play",
        url: "https://play.tailwindcss.com/",
        category: "Practice",
        time: "Interactive",
        type: "deep-learning",
      },
    ],
    "JavaScript ES6": [
      {
        title: "MDN JavaScript Guide",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        category: "Documentation",
        time: "Reference",
        type: "deep-learning",
      },
      {
        title: "JavaScript Crash Course - Traversy",
        url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
        category: "Video",
        time: "120 min",
        type: "deep-learning",
      },
      {
        title: "ES6+ Features Guide",
        url: "https://www.freecodecamp.org/news/es6-features/",
        category: "Tutorial",
        time: "40 min",
        type: "deep-learning",
      },
      {
        title: "JavaScript.info",
        url: "https://javascript.info/",
        category: "Course",
        time: "Reference",
        type: "deep-learning",
      },
      {
        title: "DOM Manipulation Guide",
        url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents",
        category: "Documentation",
        time: "30 min",
        type: "deep-learning",
      },
    ],
    React: [
      {
        title: "React Official Tutorial",
        url: "https://react.dev/learn",
        category: "Course",
        time: "90 min",
        type: "deep-learning",
      },
      {
        title: "React Crash Course - Traversy",
        url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
        category: "Video",
        time: "120 min",
        type: "deep-learning",
      },
      {
        title: "React Hooks Guide",
        url: "https://react.dev/reference/react",
        category: "Documentation",
        time: "45 min",
        type: "deep-learning",
      },
      {
        title: "React Router Tutorial",
        url: "https://reactrouter.com/en/main/start/tutorial",
        category: "Tutorial",
        time: "30 min",
        type: "deep-learning",
      },
    ],
    "Next.js": [
      {
        title: "Next.js Official Docs",
        url: "https://nextjs.org/docs",
        category: "Documentation",
        time: "Reference",
        type: "deep-learning",
      },
      {
        title: "Next.js Crash Course",
        url: "https://www.youtube.com/watch?v=mTz0GXj8NN0",
        category: "Video",
        time: "90 min",
        type: "deep-learning",
      },
      {
        title: "Next.js Learn Course",
        url: "https://nextjs.org/learn",
        category: "Course",
        time: "120 min",
        type: "deep-learning",
      },
    ],
    // Backend Skills
    "Node.js": [
      {
        title: "Node.js Official Docs",
        url: "https://nodejs.org/en/docs",
        category: "Documentation",
        time: "Reference",
        type: "deep-learning",
      },
      {
        title: "Node.js Crash Course",
        url: "https://www.youtube.com/watch?v=fBNz5xFKGxE",
        category: "Video",
        time: "90 min",
        type: "deep-learning",
      },
      {
        title: "Node.js Tutorial - W3Schools",
        url: "https://www.w3schools.com/nodejs/",
        category: "Tutorial",
        time: "60 min",
        type: "deep-learning",
      },
    ],
    Express: [
      {
        title: "Express.js Official Docs",
        url: "https://expressjs.com",
        category: "Documentation",
        time: "Reference",
        type: "deep-learning",
      },
      {
        title: "Express.js Crash Course",
        url: "https://www.youtube.com/watch?v=L72fhGm1tfE",
        category: "Video",
        time: "60 min",
        type: "deep-learning",
      },
      {
        title: "Express Middleware Guide",
        url: "https://expressjs.com/en/guide/using-middleware.html",
        category: "Documentation",
        time: "25 min",
        type: "deep-learning",
      },
    ],
    "REST APIs": [
      {
        title: "REST API Tutorial",
        url: "https://restfulapi.net/",
        category: "Tutorial",
        time: "45 min",
        type: "deep-learning",
      },
      {
        title: "Building REST APIs - Traversy",
        url: "https://www.youtube.com/watch?v=pKd0Rpw7Y48",
        category: "Video",
        time: "90 min",
        type: "deep-learning",
      },
      {
        title: "API Design Best Practices",
        url: "https://restfulapi.net/",
        category: "Guide",
        time: "30 min",
        type: "deep-learning",
      },
    ],
    Authentication: [
      {
        title: "JWT Authentication Guide",
        url: "https://jwt.io/introduction",
        category: "Documentation",
        time: "30 min",
        type: "deep-learning",
      },
      {
        title: "Node.js Auth Tutorial",
        url: "https://www.youtube.com/watch?v=2jqok-WgelI",
        category: "Video",
        time: "90 min",
        type: "deep-learning",
      },
      {
        title: "OAuth 2.0 Guide",
        url: "https://oauth.net/2/",
        category: "Documentation",
        time: "40 min",
        type: "deep-learning",
      },
    ],
    Databases: [
      {
        title: "MongoDB University",
        url: "https://university.mongodb.com/",
        category: "Course",
        time: "120 min",
        type: "deep-learning",
      },
      {
        title: "PostgreSQL Tutorial",
        url: "https://www.postgresqltutorial.com/",
        category: "Tutorial",
        time: "90 min",
        type: "deep-learning",
      },
      {
        title: "SQL vs NoSQL Explained",
        url: "https://www.youtube.com/watch?v=ZS_kXvOeQ5Y",
        category: "Video",
        time: "20 min",
        type: "deep-learning",
      },
    ],
    ORMs: [
      {
        title: "Prisma Documentation",
        url: "https://www.prisma.io/docs",
        category: "Documentation",
        time: "Reference",
        type: "deep-learning",
      },
      {
        title: "Mongoose Guide",
        url: "https://mongoosejs.com/docs/guide.html",
        category: "Documentation",
        time: "45 min",
        type: "deep-learning",
      },
      {
        title: "Prisma Crash Course",
        url: "https://www.youtube.com/watch?v=RebA5J-rlwg",
        category: "Video",
        time: "60 min",
        type: "deep-learning",
      },
    ],
    // Mobile Skills
    TypeScript: [
      {
        title: "TypeScript Handbook",
        url: "https://www.typescriptlang.org/docs/handbook/intro.html",
        category: "Documentation",
        time: "Reference",
        type: "deep-learning",
      },
      {
        title: "TypeScript Crash Course",
        url: "https://www.youtube.com/watch?v=BCg4U1FzODs",
        category: "Video",
        time: "90 min",
        type: "deep-learning",
      },
      {
        title: "React Native with TypeScript",
        url: "https://reactnative.dev/docs/typescript",
        category: "Documentation",
        time: "30 min",
        type: "deep-learning",
      },
      {
        title: "TypeScript for React Developers",
        url: "https://react-typescript-cheatsheet.netlify.app/",
        category: "Cheatsheet",
        time: "Reference",
        type: "deep-learning",
      },
    ],
    "React Native Components": [
      {
        title: "React Native Core Components",
        url: "https://reactnative.dev/docs/components-and-apis",
        category: "Documentation",
        time: "Reference",
        type: "deep-learning",
      },
      {
        title: "React Native Crash Course",
        url: "https://www.youtube.com/watch?v=0-S5a0eXPoc",
        category: "Video",
        time: "120 min",
        type: "deep-learning",
      },
      {
        title: "React Native Tutorial",
        url: "https://reactnative.dev/docs/getting-started",
        category: "Tutorial",
        time: "90 min",
        type: "deep-learning",
      },
    ],
    "State Management": [
      {
        title: "React Native State Management",
        url: "https://reactnative.dev/docs/state",
        category: "Documentation",
        time: "45 min",
        type: "deep-learning",
      },
      {
        title: "Redux for React Native",
        url: "https://redux.js.org/tutorials/essentials/part-1-overview-concepts",
        category: "Documentation",
        time: "60 min",
        type: "deep-learning",
      },
      {
        title: "Context API Guide",
        url: "https://react.dev/reference/react/useContext",
        category: "Documentation",
        time: "30 min",
        type: "deep-learning",
      },
    ],
    "React Native": [
      {
        title: "React Native Docs",
        url: "https://reactnative.dev/docs/getting-started",
        category: "Documentation",
        time: "Reference",
        type: "deep-learning",
      },
      {
        title: "React Native Tutorial",
        url: "https://www.youtube.com/watch?v=0-S5a0eXPoc",
        category: "Video",
        time: "120 min",
        type: "deep-learning",
      },
    ],
    // Systems Engineering Skills
    "WP Structure": [
      {
        title: "WordPress File Structure",
        url: "https://developer.wordpress.org/themes/basics/template-files/",
        category: "Documentation",
        time: "30 min",
        type: "deep-learning",
      },
      {
        title: "WordPress Basics Course",
        url: "https://wordpress.org/support/article/first-steps-with-wordpress/",
        category: "Tutorial",
        time: "45 min",
        type: "deep-learning",
      },
    ],
    "Custom Themes": [
      {
        title: "Theme Development Handbook",
        url: "https://developer.wordpress.org/themes/",
        category: "Documentation",
        time: "Reference",
        type: "deep-learning",
      },
      {
        title: "WordPress Theme Development",
        url: "https://www.youtube.com/watch?v=8OBfr46Y0gc",
        category: "Video",
        time: "120 min",
        type: "deep-learning",
      },
    ],
    "Gutenberg Blocks": [
      {
        title: "Gutenberg Handbook",
        url: "https://developer.wordpress.org/block-editor/",
        category: "Documentation",
        time: "Reference",
        type: "deep-learning",
      },
      {
        title: "Block Development Tutorial",
        url: "https://developer.wordpress.org/block-editor/getting-started/",
        category: "Tutorial",
        time: "60 min",
        type: "deep-learning",
      },
    ],
    "Plugin Development": [
      {
        title: "Plugin Handbook",
        url: "https://developer.wordpress.org/plugins/",
        category: "Documentation",
        time: "Reference",
        type: "deep-learning",
      },
      {
        title: "WordPress Plugin Development",
        url: "https://www.youtube.com/watch?v=0g0rhjgz3KE",
        category: "Video",
        time: "90 min",
        type: "deep-learning",
      },
    ],
  };

  return skillResources[skillName] || [];
}

// Get quiz data for each skill
function getSkillQuiz(skillName) {
  const quizzes = {
    HTML5: [
      {
        question: "What is the purpose of the <!DOCTYPE html> declaration?",
        options: [
          "It tells the browser which version of HTML to use",
          "It's required for HTML5 validation",
          "It enables modern browser features",
          "All of the above",
        ],
        correctAnswer: 3,
        explanation:
          "The DOCTYPE declaration tells browsers which HTML version to use, is required for validation, and enables modern features.",
      },
      {
        question:
          "Which HTML5 element should be used for the main content of a page?",
        options: ['<div class="main">', "<main>", "<section>", "<article>"],
        correctAnswer: 1,
        explanation:
          "The <main> element is the semantic HTML5 element specifically designed for the main content of a page.",
      },
      {
        question: "What is the difference between <article> and <section>?",
        options: [
          "<article> is for standalone content, <section> is for thematic grouping",
          "They are interchangeable",
          "<section> must always contain <article>",
          "<article> is only for blog posts",
        ],
        correctAnswer: 0,
        explanation:
          "<article> represents standalone, independently distributable content, while <section> is for thematic grouping of content.",
      },
    ],
    CSS3: [
      {
        question: "What does CSS stand for?",
        options: [
          "Computer Style Sheets",
          "Cascading Style Sheets",
          "Creative Style Sheets",
          "Colorful Style Sheets",
        ],
        correctAnswer: 1,
        explanation:
          "CSS stands for Cascading Style Sheets, which is used to style HTML elements.",
      },
      {
        question: "Which property is used to change the background color?",
        options: ["color", "bgcolor", "background-color", "background"],
        correctAnswer: 2,
        explanation:
          "The background-color property is used to set the background color of an element.",
      },
      {
        question: "What is Flexbox used for?",
        options: [
          "Text formatting",
          "Layout and alignment",
          "Color schemes",
          "Animations",
        ],
        correctAnswer: 1,
        explanation:
          "Flexbox is a layout method designed for one-dimensional layouts and alignment of items.",
      },
    ],
    "JavaScript ES6": [
      {
        question: "What is the difference between let and var?",
        options: [
          "let has block scope, var has function scope",
          "They are identical",
          "var is newer than let",
          "let cannot be reassigned",
        ],
        correctAnswer: 0,
        explanation:
          "let has block scope (limited to the block it is declared in), while var has function scope.",
      },
      {
        question: "What does the arrow function syntax (=>) provide?",
        options: [
          "Shorter syntax",
          "Lexical this binding",
          "Both A and B",
          "Neither",
        ],
        correctAnswer: 2,
        explanation:
          "Arrow functions provide shorter syntax and automatically bind this from the enclosing context.",
      },
    ],
    React: [
      {
        question: "What is a React component?",
        options: [
          "A JavaScript function that returns JSX",
          "A CSS class",
          "An HTML element",
          "A database table",
        ],
        correctAnswer: 0,
        explanation:
          "A React component is a JavaScript function that returns JSX to describe what should appear on screen.",
      },
      {
        question: "What is the purpose of useState hook?",
        options: [
          "To fetch data from an API",
          "To manage component state",
          "To style components",
          "To handle events",
        ],
        correctAnswer: 1,
        explanation:
          "useState is a React hook used to add state management to functional components.",
      },
    ],
    "Node.js": [
      {
        question: "What is Node.js?",
        options: [
          "A JavaScript framework",
          "A JavaScript runtime built on Chrome's V8 engine",
          "A database",
          "A text editor",
        ],
        correctAnswer: 1,
        explanation:
          "Node.js is a JavaScript runtime that allows you to run JavaScript on the server side.",
      },
    ],
  };

  return quizzes[skillName] || [];
}

// Discipline-specific resource mapping (enhanced with skill-based resources)
// Get day-specific, discipline-specific resources that connect to the day's project
// Progressive daily resources that build on each other
function getProgressiveDailyResources(dayNumber, discipline, weekNum, dayIndex) {
  // Calculate which phase we're in (1-90 days, grouped by learning phases)
  const phase = Math.ceil(dayNumber / 15); // 15-day phases: 1-15, 16-30, 31-45, 46-60, 61-75, 76-90
  const dayInPhase = ((dayNumber - 1) % 15) + 1; // Day within current phase (1-15)
  
  // Helper function to enhance resource with day-specific context
  const enhanceResource = (resource, dayNum) => {
    return {
      ...resource,
      title: `Day ${dayNum}: ${resource.title}`,
      description: resource.description || `Essential resource for Day ${dayNum} - ${resource.category}. Building on Day ${Math.max(1, dayNum - 1)}'s foundation.`,
      dayNumber: dayNum,
      phase: phase,
      dayInPhase: dayInPhase,
    };
  };
  
  // Frontend progressive resources
  if (discipline === "Frontend") {
    const resources = [];
    
    // Phase 1 (Days 1-15): Fundamentals - Each day is unique
    if (phase === 1) {
      if (dayInPhase === 1) {
        resources.push(
          enhanceResource({ title: "React Official Docs - Getting Started", url: "https://react.dev/learn", time: "20 min", category: "Fundamentals" }, dayNumber),
          enhanceResource({ title: "Modern JavaScript ES6+ Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", time: "25 min", category: "Fundamentals" }, dayNumber)
        );
      } else if (dayInPhase === 2) {
        resources.push(
          enhanceResource({ title: "React Components and Props", url: "https://react.dev/learn/passing-props-to-a-component", time: "20 min", category: "Components" }, dayNumber),
          enhanceResource({ title: "Component Composition", url: "https://react.dev/learn/passing-props-to-a-component#passing-props", time: "25 min", category: "Components" }, dayNumber)
        );
        if (dayNumber > 1) {
          resources.push(
            enhanceResource({ title: "Review: Day 1 Concepts", url: "https://react.dev/learn", time: "10 min", category: "Review" }, dayNumber)
          );
        }
      } else if (dayInPhase === 3) {
        resources.push(
          enhanceResource({ title: "React State Management", url: "https://react.dev/learn/managing-state", time: "25 min", category: "State" }, dayNumber),
          enhanceResource({ title: "useState Hook", url: "https://react.dev/reference/react/useState", time: "20 min", category: "State" }, dayNumber)
        );
      } else if (dayInPhase === 4) {
        resources.push(
          enhanceResource({ title: "CSS Layout Patterns", url: "https://css-tricks.com/guides/layout/", time: "20 min", category: "Layout" }, dayNumber),
          enhanceResource({ title: "Flexbox Guide", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", time: "25 min", category: "Layout" }, dayNumber)
        );
      } else if (dayInPhase === 5) {
        resources.push(
          enhanceResource({ title: "React Hooks Deep Dive", url: "https://react.dev/reference/react", time: "30 min", category: "Hooks" }, dayNumber),
          enhanceResource({ title: "Built-in Hooks", url: "https://react.dev/reference/react#hooks", time: "25 min", category: "Hooks" }, dayNumber)
        );
      } else if (dayInPhase === 6) {
        resources.push(
          enhanceResource({ title: "React Effects and Side Effects", url: "https://react.dev/learn/synchronizing-with-effects", time: "25 min", category: "Effects" }, dayNumber),
          enhanceResource({ title: "useEffect Hook", url: "https://react.dev/reference/react/useEffect", time: "30 min", category: "Effects" }, dayNumber)
        );
      } else if (dayInPhase === 7) {
        resources.push(
          enhanceResource({ title: "Data Fetching in React", url: "https://react.dev/learn/synchronizing-with-effects#fetching-data", time: "20 min", category: "Data Fetching" }, dayNumber),
          enhanceResource({ title: "Fetch API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API", time: "25 min", category: "Data Fetching" }, dayNumber)
        );
        if (dayNumber > 7) {
          resources.push(
            enhanceResource({ title: "Week 1 Review", url: "https://react.dev/learn", time: "20 min", category: "Week Review" }, dayNumber)
          );
        }
      } else if (dayInPhase === 8) {
        resources.push(
          enhanceResource({ title: "React Form Handling", url: "https://react.dev/reference/react-dom/components/form", time: "20 min", category: "Forms" }, dayNumber),
          enhanceResource({ title: "Controlled Components", url: "https://react.dev/reference/react-dom/components/input#controlled-input", time: "25 min", category: "Forms" }, dayNumber)
        );
      } else if (dayInPhase === 9) {
        resources.push(
          enhanceResource({ title: "React Router Guide", url: "https://reactrouter.com/en/main/start/overview", time: "25 min", category: "Routing" }, dayNumber),
          enhanceResource({ title: "React Router Setup", url: "https://reactrouter.com/en/main/start/installation", time: "20 min", category: "Routing" }, dayNumber)
        );
      } else if (dayInPhase === 10) {
        resources.push(
          enhanceResource({ title: "Context API for State", url: "https://react.dev/learn/passing-data-deeply-with-context", time: "20 min", category: "State Management" }, dayNumber),
          enhanceResource({ title: "useContext Hook", url: "https://react.dev/reference/react/useContext", time: "25 min", category: "State Management" }, dayNumber)
        );
      } else if (dayInPhase === 11) {
        resources.push(
          enhanceResource({ title: "React Performance Optimization", url: "https://react.dev/learn/render-and-commit", time: "25 min", category: "Performance" }, dayNumber),
          enhanceResource({ title: "React.memo", url: "https://react.dev/reference/react/memo", time: "20 min", category: "Performance" }, dayNumber)
        );
      } else if (dayInPhase === 12) {
        resources.push(
          enhanceResource({ title: "React Testing Library", url: "https://testing-library.com/docs/react-testing-library/intro/", time: "30 min", category: "Testing" }, dayNumber),
          enhanceResource({ title: "Testing Components", url: "https://react.dev/learn/testing", time: "25 min", category: "Testing" }, dayNumber)
        );
      } else if (dayInPhase === 13) {
        resources.push(
          enhanceResource({ title: "TypeScript with React", url: "https://react-typescript-cheatsheet.netlify.app/", time: "30 min", category: "TypeScript" }, dayNumber),
          enhanceResource({ title: "TypeScript Setup", url: "https://react-typescript-cheatsheet.netlify.app/docs/basic/setup", time: "25 min", category: "TypeScript" }, dayNumber)
        );
      } else if (dayInPhase === 14) {
        resources.push(
          enhanceResource({ title: "Advanced React Patterns", url: "https://react.dev/learn/escape-hatches", time: "30 min", category: "Patterns" }, dayNumber),
          enhanceResource({ title: "Custom Hooks", url: "https://react.dev/learn/reusing-logic-with-custom-hooks", time: "25 min", category: "Patterns" }, dayNumber)
        );
      } else if (dayInPhase === 15) {
        resources.push(
          enhanceResource({ title: "Phase 1 Complete - Review All Fundamentals", url: "https://react.dev/learn", time: "30 min", category: "Phase Review" }, dayNumber),
          enhanceResource({ title: "Comprehensive Review", url: "https://react.dev/learn/thinking-in-react", time: "30 min", category: "Phase Review" }, dayNumber)
        );
      }
    }
    // Phase 2 (Days 16-30): Intermediate - Each day is unique
    else if (phase === 2) {
      if (dayInPhase === 1) {
        resources.push(
          enhanceResource({ title: "Next.js Fundamentals", url: "https://nextjs.org/docs", time: "30 min", category: "Framework" }, dayNumber),
          enhanceResource({ title: "Next.js Getting Started", url: "https://nextjs.org/docs/getting-started", time: "25 min", category: "Framework" }, dayNumber)
        );
        if (dayNumber > 16) {
          resources.push(
            enhanceResource({ title: "Building on Phase 1 (Days 1-15)", url: "https://nextjs.org/docs", time: "15 min", category: "Progressive Learning" }, dayNumber)
          );
        }
      } else if (dayInPhase === 2) {
        resources.push(
          enhanceResource({ title: "Server Components in Next.js", url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components", time: "25 min", category: "Server Components" }, dayNumber),
          enhanceResource({ title: "Client Components", url: "https://nextjs.org/docs/app/building-your-application/rendering/client-components", time: "25 min", category: "Server Components" }, dayNumber)
        );
      } else if (dayInPhase === 3) {
        resources.push(
          enhanceResource({ title: "Next.js Routing", url: "https://nextjs.org/docs/app/building-your-application/routing", time: "25 min", category: "Routing" }, dayNumber),
          enhanceResource({ title: "App Router", url: "https://nextjs.org/docs/app", time: "30 min", category: "Routing" }, dayNumber)
        );
      } else if (dayInPhase === 4) {
        resources.push(
          enhanceResource({ title: "Data Fetching in Next.js", url: "https://nextjs.org/docs/app/building-your-application/data-fetching", time: "30 min", category: "Data Fetching" }, dayNumber),
          enhanceResource({ title: "Server Actions", url: "https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions", time: "25 min", category: "Data Fetching" }, dayNumber)
        );
      } else if (dayInPhase === 5) {
        resources.push(
          enhanceResource({ title: "Next.js API Routes", url: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers", time: "25 min", category: "API" }, dayNumber),
          enhanceResource({ title: "Route Handlers", url: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers#route-handlers", time: "30 min", category: "API" }, dayNumber)
        );
      } else if (dayInPhase === 6) {
        resources.push(
          enhanceResource({ title: "State Management Libraries", url: "https://zustand-demo.pmnd.rs/", time: "25 min", category: "State Management" }, dayNumber),
          enhanceResource({ title: "Zustand Guide", url: "https://github.com/pmndrs/zustand", time: "30 min", category: "State Management" }, dayNumber)
        );
      } else if (dayInPhase === 7) {
        resources.push(
          enhanceResource({ title: "React Query/TanStack Query", url: "https://tanstack.com/query/latest", time: "30 min", category: "Data Fetching" }, dayNumber),
          enhanceResource({ title: "TanStack Query Setup", url: "https://tanstack.com/query/latest/docs/react/overview", time: "25 min", category: "Data Fetching" }, dayNumber)
        );
        if (dayNumber > 22) {
          resources.push(
            enhanceResource({ title: "Week 3 Review", url: "https://react.dev/learn", time: "20 min", category: "Week Review" }, dayNumber)
          );
        }
      } else if (dayInPhase === 8) {
        resources.push(
          enhanceResource({ title: "Form Libraries - React Hook Form", url: "https://react-hook-form.com/", time: "25 min", category: "Forms" }, dayNumber),
          enhanceResource({ title: "React Hook Form Guide", url: "https://react-hook-form.com/get-started", time: "30 min", category: "Forms" }, dayNumber)
        );
      } else if (dayInPhase === 9) {
        resources.push(
          enhanceResource({ title: "CSS-in-JS Solutions", url: "https://styled-components.com/", time: "25 min", category: "Styling" }, dayNumber),
          enhanceResource({ title: "Styled Components", url: "https://styled-components.com/docs", time: "30 min", category: "Styling" }, dayNumber)
        );
      } else if (dayInPhase === 10) {
        resources.push(
          enhanceResource({ title: "Tailwind CSS Advanced", url: "https://tailwindcss.com/docs", time: "20 min", category: "Styling" }, dayNumber),
          enhanceResource({ title: "Tailwind Configuration", url: "https://tailwindcss.com/docs/configuration", time: "25 min", category: "Styling" }, dayNumber)
        );
      } else if (dayInPhase === 11) {
        resources.push(
          enhanceResource({ title: "Component Libraries", url: "https://ui.shadcn.com/", time: "30 min", category: "UI Components" }, dayNumber),
          enhanceResource({ title: "shadcn/ui Setup", url: "https://ui.shadcn.com/docs/installation", time: "25 min", category: "UI Components" }, dayNumber)
        );
      } else if (dayInPhase === 12) {
        resources.push(
          enhanceResource({ title: "Advanced React Patterns", url: "https://react.dev/learn/escape-hatches", time: "30 min", category: "Patterns" }, dayNumber),
          enhanceResource({ title: "Render Props Pattern", url: "https://react.dev/learn/passing-props-to-a-component#render-props", time: "25 min", category: "Patterns" }, dayNumber)
        );
      } else if (dayInPhase === 13) {
        resources.push(
          enhanceResource({ title: "React Performance Best Practices", url: "https://react.dev/learn/render-and-commit", time: "25 min", category: "Performance" }, dayNumber),
          enhanceResource({ title: "useMemo and useCallback", url: "https://react.dev/reference/react/useMemo", time: "30 min", category: "Performance" }, dayNumber)
        );
      } else if (dayInPhase === 14) {
        resources.push(
          enhanceResource({ title: "Accessibility in React", url: "https://react.dev/learn/accessibility", time: "25 min", category: "Accessibility" }, dayNumber),
          enhanceResource({ title: "ARIA Attributes", url: "https://react.dev/learn/accessibility#aria-attributes", time: "30 min", category: "Accessibility" }, dayNumber)
        );
      } else if (dayInPhase === 15) {
        resources.push(
          enhanceResource({ title: "Phase 2 Complete - Review Intermediate Concepts", url: "https://react.dev/learn", time: "30 min", category: "Phase Review" }, dayNumber),
          enhanceResource({ title: "Comprehensive Review", url: "https://nextjs.org/docs", time: "30 min", category: "Phase Review" }, dayNumber)
        );
      }
    }
    // Phase 3+ (Days 31+): Advanced
    else {
      const advancedTopics = [
        { title: "Advanced React Patterns", url: "https://react.dev/learn/escape-hatches", time: "30 min", category: "Advanced Patterns" },
        { title: "Micro-frontends Architecture", url: "https://micro-frontends.org/", time: "35 min", category: "Architecture" },
        { title: "Web Performance Optimization", url: "https://web.dev/performance/", time: "30 min", category: "Performance" },
        { title: "Progressive Web Apps", url: "https://web.dev/progressive-web-apps/", time: "30 min", category: "PWA" },
        { title: "Advanced State Management", url: "https://redux.js.org/", time: "35 min", category: "State Management" },
        { title: "React Server Components Deep Dive", url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components", time: "30 min", category: "Server Components" }
      ];
      // Cycle through advanced topics based on day, but make each day unique
      const topicIndex = (dayNumber - 31) % advancedTopics.length;
      resources.push(enhanceResource(advancedTopics[topicIndex], dayNumber));
      if (dayInPhase > 6) {
        resources.push(enhanceResource(advancedTopics[(topicIndex + 1) % advancedTopics.length], dayNumber));
      }
      // Add day-specific progressive learning note
      if (dayNumber > 31) {
        resources.push(
          enhanceResource({ title: `Building on Days 1-${dayNumber - 1}`, url: "https://react.dev/learn", time: "15 min", category: "Progressive Learning" }, dayNumber)
        );
      }
      // Add milestone reviews
      if (dayNumber % 15 === 0) {
        resources.push(
          enhanceResource({ title: `Milestone: Day ${dayNumber} Review`, url: "https://react.dev/learn", time: "30 min", category: "Milestone Review" }, dayNumber)
        );
      }
    }
    
    return resources;
  }
  
  // Mobile progressive resources
  if (discipline === "Mobile") {
    const resources = [];
    
    // Phase 1 (Days 1-15): Fundamentals - Each day is unique
    if (phase === 1) {
      if (dayInPhase === 1) {
        resources.push(
          enhanceResource({ title: "React Native Getting Started", url: "https://reactnative.dev/docs/getting-started", time: "25 min", category: "Fundamentals" }, dayNumber),
          enhanceResource({ title: "Expo Quick Start", url: "https://docs.expo.dev/get-started/installation/", time: "20 min", category: "Setup" }, dayNumber)
        );
      } else if (dayInPhase === 2) {
        resources.push(
          enhanceResource({ title: "React Native Components", url: "https://reactnative.dev/docs/components-and-apis", time: "25 min", category: "Components" }, dayNumber),
          enhanceResource({ title: "React Native Core Components", url: "https://reactnative.dev/docs/components-and-apis/core-components", time: "20 min", category: "Components" }, dayNumber)
        );
        if (dayNumber > 1) {
          resources.push(
            enhanceResource({ title: "Review: Day 1 Concepts", url: "https://reactnative.dev/docs/getting-started", time: "10 min", category: "Review" }, dayNumber)
          );
        }
      } else if (dayInPhase === 3) {
        resources.push(
          enhanceResource({ title: "React Navigation Basics", url: "https://reactnavigation.org/docs/getting-started", time: "30 min", category: "Navigation" }, dayNumber),
          enhanceResource({ title: "Navigation Setup", url: "https://reactnavigation.org/docs/navigation-container", time: "25 min", category: "Navigation" }, dayNumber)
        );
        if (dayNumber > 2) {
          resources.push(
            enhanceResource({ title: "Building on Days 1-2", url: "https://reactnative.dev/docs", time: "15 min", category: "Progressive Learning" }, dayNumber)
          );
        }
      } else if (dayInPhase === 4) {
        resources.push(
          enhanceResource({ title: "Styling in React Native", url: "https://reactnative.dev/docs/style", time: "20 min", category: "Styling" }, dayNumber),
          enhanceResource({ title: "Flexbox in React Native", url: "https://reactnative.dev/docs/flexbox", time: "25 min", category: "Styling" }, dayNumber)
        );
      } else if (dayInPhase === 5) {
        resources.push(
          enhanceResource({ title: "State Management in React Native", url: "https://zustand-demo.pmnd.rs/", time: "25 min", category: "State Management" }, dayNumber),
          enhanceResource({ title: "React Native Hooks", url: "https://reactnative.dev/docs/hooks", time: "20 min", category: "Hooks" }, dayNumber)
        );
      } else if (dayInPhase === 6) {
        resources.push(
          enhanceResource({ title: "AsyncStorage Guide", url: "https://react-native-async-storage.github.io/async-storage/", time: "20 min", category: "Storage" }, dayNumber),
          enhanceResource({ title: "Local Data Persistence", url: "https://reactnative.dev/docs/asyncstorage", time: "25 min", category: "Storage" }, dayNumber)
        );
      } else if (dayInPhase === 7) {
        resources.push(
          enhanceResource({ title: "API Integration in React Native", url: "https://reactnative.dev/docs/network", time: "25 min", category: "Networking" }, dayNumber),
          enhanceResource({ title: "Fetch API in React Native", url: "https://reactnative.dev/docs/network#using-fetch", time: "20 min", category: "Networking" }, dayNumber)
        );
        if (dayNumber > 7) {
          resources.push(
            enhanceResource({ title: "Week 1 Review", url: "https://reactnative.dev/docs", time: "20 min", category: "Week Review" }, dayNumber)
          );
        }
      } else if (dayInPhase === 8) {
        resources.push(
          enhanceResource({ title: "React Native Forms", url: "https://reactnative.dev/docs/textinput", time: "20 min", category: "Forms" }, dayNumber),
          enhanceResource({ title: "Form Handling", url: "https://reactnative.dev/docs/textinput#handling-text-input", time: "25 min", category: "Forms" }, dayNumber)
        );
      } else if (dayInPhase === 9) {
        resources.push(
          enhanceResource({ title: "Error Handling", url: "https://reactnative.dev/docs/error-handling", time: "20 min", category: "Error Handling" }, dayNumber),
          enhanceResource({ title: "Error Boundaries", url: "https://reactnative.dev/docs/error-boundaries", time: "25 min", category: "Error Handling" }, dayNumber)
        );
      } else if (dayInPhase === 10) {
        resources.push(
          enhanceResource({ title: "React Native Performance", url: "https://reactnative.dev/docs/performance", time: "25 min", category: "Performance" }, dayNumber),
          enhanceResource({ title: "Performance Optimization", url: "https://reactnative.dev/docs/performance#performance-tips", time: "20 min", category: "Performance" }, dayNumber)
        );
      } else if (dayInPhase === 11) {
        resources.push(
          enhanceResource({ title: "Testing React Native Apps", url: "https://reactnative.dev/docs/testing-overview", time: "30 min", category: "Testing" }, dayNumber),
          enhanceResource({ title: "Jest Testing", url: "https://reactnative.dev/docs/testing#jest", time: "25 min", category: "Testing" }, dayNumber)
        );
      } else if (dayInPhase === 12) {
        resources.push(
          enhanceResource({ title: "TypeScript with React Native", url: "https://reactnative.dev/docs/typescript", time: "25 min", category: "TypeScript" }, dayNumber),
          enhanceResource({ title: "TypeScript Setup", url: "https://reactnative.dev/docs/typescript#getting-started", time: "20 min", category: "TypeScript" }, dayNumber)
        );
      } else if (dayInPhase === 13) {
        resources.push(
          enhanceResource({ title: "Advanced Components", url: "https://reactnative.dev/docs/components-and-apis", time: "30 min", category: "Advanced" }, dayNumber),
          enhanceResource({ title: "Custom Components", url: "https://reactnative.dev/docs/components-and-apis#custom-components", time: "25 min", category: "Advanced" }, dayNumber)
        );
      } else if (dayInPhase === 14) {
        resources.push(
          enhanceResource({ title: "React Native Best Practices", url: "https://reactnative.dev/docs/performance", time: "30 min", category: "Best Practices" }, dayNumber),
          enhanceResource({ title: "Code Organization", url: "https://reactnative.dev/docs/performance#code-organization", time: "25 min", category: "Best Practices" }, dayNumber)
        );
      } else if (dayInPhase === 15) {
        resources.push(
          enhanceResource({ title: "Phase 1 Complete - Review Fundamentals", url: "https://reactnative.dev/docs", time: "30 min", category: "Phase Review" }, dayNumber),
          enhanceResource({ title: "Comprehensive Review", url: "https://reactnative.dev/docs/getting-started", time: "30 min", category: "Phase Review" }, dayNumber)
        );
      }
    }
    // Phase 2 (Days 16-30): Intermediate - Each day is unique
    else if (phase === 2) {
      if (dayInPhase === 1) {
        resources.push(
          enhanceResource({ title: "Advanced Navigation Patterns", url: "https://reactnavigation.org/docs/navigation-container", time: "30 min", category: "Navigation" }, dayNumber),
          enhanceResource({ title: "Navigation Stacks", url: "https://reactnavigation.org/docs/stack-navigator", time: "25 min", category: "Navigation" }, dayNumber)
        );
        if (dayNumber > 16) {
          resources.push(
            enhanceResource({ title: "Building on Phase 1 (Days 1-15)", url: "https://reactnative.dev/docs", time: "15 min", category: "Progressive Learning" }, dayNumber)
          );
        }
      } else if (dayInPhase === 2) {
        resources.push(
          enhanceResource({ title: "Deep Linking", url: "https://reactnavigation.org/docs/deep-linking", time: "25 min", category: "Deep Linking" }, dayNumber),
          enhanceResource({ title: "Universal Links", url: "https://reactnavigation.org/docs/deep-linking#universal-links", time: "30 min", category: "Deep Linking" }, dayNumber)
        );
      } else if (dayInPhase === 3) {
        resources.push(
          enhanceResource({ title: "Offline-First Architecture", url: "https://reactnative.dev/docs/network", time: "30 min", category: "Architecture" }, dayNumber),
          enhanceResource({ title: "Network State Detection", url: "https://github.com/react-native-netinfo/react-native-netinfo", time: "25 min", category: "Architecture" }, dayNumber)
        );
      } else if (dayInPhase === 4) {
        resources.push(
          enhanceResource({ title: "Caching Strategies", url: "https://react-native-async-storage.github.io/async-storage/", time: "25 min", category: "Caching" }, dayNumber),
          enhanceResource({ title: "Data Caching Patterns", url: "https://reactnative.dev/docs/network#caching", time: "30 min", category: "Caching" }, dayNumber)
        );
      } else if (dayInPhase === 5) {
        resources.push(
          enhanceResource({ title: "Background Tasks", url: "https://github.com/jamesisaac/react-native-background-job", time: "25 min", category: "Background Tasks" }, dayNumber),
          enhanceResource({ title: "Background Fetch", url: "https://github.com/transistorsoft/react-native-background-fetch", time: "30 min", category: "Background Tasks" }, dayNumber)
        );
      } else if (dayInPhase === 6) {
        resources.push(
          enhanceResource({ title: "Push Notifications Setup", url: "https://github.com/zo0r/react-native-push-notification", time: "30 min", category: "Notifications" }, dayNumber),
          enhanceResource({ title: "Notification Configuration", url: "https://reactnative.dev/docs/pushnotificationios", time: "25 min", category: "Notifications" }, dayNumber)
        );
      } else if (dayInPhase === 7) {
        resources.push(
          enhanceResource({ title: "Push Notification Handling", url: "https://github.com/zo0r/react-native-push-notification#handling-notifications", time: "30 min", category: "Notifications" }, dayNumber),
          enhanceResource({ title: "Local Notifications", url: "https://reactnative.dev/docs/pushnotificationios#local-notifications", time: "25 min", category: "Notifications" }, dayNumber)
        );
        if (dayNumber > 22) {
          resources.push(
            enhanceResource({ title: "Week 3 Review", url: "https://reactnative.dev/docs", time: "20 min", category: "Week Review" }, dayNumber)
          );
        }
      } else if (dayInPhase === 8) {
        resources.push(
          enhanceResource({ title: "Biometric Authentication", url: "https://github.com/oblador/react-native-keychain", time: "25 min", category: "Security" }, dayNumber),
          enhanceResource({ title: "Touch ID & Face ID", url: "https://github.com/oblador/react-native-keychain#touch-id--face-id", time: "30 min", category: "Security" }, dayNumber)
        );
      } else if (dayInPhase === 9) {
        resources.push(
          enhanceResource({ title: "Image Optimization", url: "https://reactnative.dev/docs/image", time: "20 min", category: "Performance" }, dayNumber),
          enhanceResource({ title: "Image Caching", url: "https://github.com/DylanVann/react-native-fast-image", time: "25 min", category: "Performance" }, dayNumber)
        );
      } else if (dayInPhase === 10) {
        resources.push(
          enhanceResource({ title: "Animations in React Native", url: "https://reactnative.dev/docs/animated", time: "30 min", category: "Animations" }, dayNumber),
          enhanceResource({ title: "Animated API", url: "https://reactnative.dev/docs/animated#animated-api", time: "25 min", category: "Animations" }, dayNumber)
        );
      } else if (dayInPhase === 11) {
        resources.push(
          enhanceResource({ title: "Gesture Handling", url: "https://docs.swmansion.com/react-native-gesture-handler/", time: "25 min", category: "Gestures" }, dayNumber),
          enhanceResource({ title: "Gesture Responder System", url: "https://reactnative.dev/docs/gesture-responder-system", time: "30 min", category: "Gestures" }, dayNumber)
        );
      } else if (dayInPhase === 12) {
        resources.push(
          enhanceResource({ title: "Native Modules Intro", url: "https://reactnative.dev/docs/native-modules-intro", time: "30 min", category: "Native Modules" }, dayNumber),
          enhanceResource({ title: "Native Modules Android", url: "https://reactnative.dev/docs/native-modules-android", time: "30 min", category: "Native Modules" }, dayNumber)
        );
      } else if (dayInPhase === 13) {
        resources.push(
          enhanceResource({ title: "Advanced State Management", url: "https://redux.js.org/", time: "30 min", category: "State Management" }, dayNumber),
          enhanceResource({ title: "Redux Toolkit", url: "https://redux-toolkit.js.org/", time: "25 min", category: "State Management" }, dayNumber)
        );
      } else if (dayInPhase === 14) {
        resources.push(
          enhanceResource({ title: "Testing Strategies", url: "https://reactnative.dev/docs/testing-overview", time: "30 min", category: "Testing" }, dayNumber),
          enhanceResource({ title: "E2E Testing", url: "https://github.com/wix/Detox", time: "30 min", category: "Testing" }, dayNumber)
        );
      } else if (dayInPhase === 15) {
        resources.push(
          enhanceResource({ title: "Code Splitting", url: "https://reactnative.dev/docs/performance#code-splitting", time: "25 min", category: "Performance" }, dayNumber),
          enhanceResource({ title: "Phase 2 Complete - Review Intermediate", url: "https://reactnative.dev/docs", time: "30 min", category: "Phase Review" }, dayNumber)
        );
      }
    }
    // Phase 3+ (Days 31+): Advanced
    else {
      const advancedTopics = [
        { title: "Advanced React Native Patterns", url: "https://reactnative.dev/docs/performance", time: "30 min", category: "Advanced Patterns" },
        { title: "E2E Testing with Detox", url: "https://github.com/wix/Detox", time: "35 min", category: "Testing" },
        { title: "Performance Optimization", url: "https://reactnative.dev/docs/performance", time: "30 min", category: "Performance" },
        { title: "Native Module Development", url: "https://reactnative.dev/docs/native-modules-android", time: "35 min", category: "Native Development" },
        { title: "App Store Optimization", url: "https://developer.apple.com/app-store/optimization/", time: "25 min", category: "Deployment" },
        { title: "CI/CD for Mobile Apps", url: "https://docs.expo.dev/build/introduction/", time: "30 min", category: "CI/CD" }
      ];
      const topicIndex = (dayNumber - 31) % advancedTopics.length;
      resources.push(enhanceResource(advancedTopics[topicIndex], dayNumber));
      if (dayInPhase > 6) {
        resources.push(enhanceResource(advancedTopics[(topicIndex + 1) % advancedTopics.length], dayNumber));
      }
      if (dayNumber > 31) {
        resources.push(
          enhanceResource({ title: `Building on Days 1-${dayNumber - 1} Mobile`, url: "https://reactnative.dev/docs", time: "15 min", category: "Progressive Learning" }, dayNumber)
        );
      }
      if (dayNumber % 15 === 0) {
        resources.push(
          enhanceResource({ title: `Milestone: Day ${dayNumber} Mobile Review`, url: "https://reactnative.dev/docs", time: "30 min", category: "Milestone Review" }, dayNumber)
        );
      }
    }
    
    return resources;
  }
  
  // Backend progressive resources
  if (discipline === "Backend") {
    const resources = [];
    
    // Phase 1 (Days 1-15): Fundamentals - Each day is unique
    if (phase === 1) {
      if (dayInPhase === 1) {
        resources.push(
          enhanceResource({ title: "Node.js Getting Started", url: "https://nodejs.org/en/docs/guides/getting-started-guide", time: "25 min", category: "Fundamentals" }, dayNumber),
          enhanceResource({ title: "Node.js Basics", url: "https://nodejs.org/en/docs/guides/getting-started-guide#nodejs-basics", time: "20 min", category: "Fundamentals" }, dayNumber)
        );
      } else if (dayInPhase === 2) {
        resources.push(
          enhanceResource({ title: "Express.js Hello World", url: "https://expressjs.com/en/starter/hello-world.html", time: "20 min", category: "Framework" }, dayNumber),
          enhanceResource({ title: "Express Installation", url: "https://expressjs.com/en/starter/installing.html", time: "25 min", category: "Framework" }, dayNumber)
        );
        if (dayNumber > 1) {
          resources.push(
            enhanceResource({ title: "Review: Day 1 Concepts", url: "https://nodejs.org/en/docs", time: "10 min", category: "Review" }, dayNumber)
          );
        }
      } else if (dayInPhase === 3) {
        resources.push(
          enhanceResource({ title: "Express Routing", url: "https://expressjs.com/en/guide/routing.html", time: "25 min", category: "Routing" }, dayNumber),
          enhanceResource({ title: "Route Methods", url: "https://expressjs.com/en/guide/routing.html#route-methods", time: "25 min", category: "Routing" }, dayNumber)
        );
      } else if (dayInPhase === 4) {
        resources.push(
          enhanceResource({ title: "Express Middleware", url: "https://expressjs.com/en/guide/using-middleware.html", time: "25 min", category: "Middleware" }, dayNumber),
          enhanceResource({ title: "Writing Middleware", url: "https://expressjs.com/en/guide/writing-middleware.html", time: "30 min", category: "Middleware" }, dayNumber)
        );
      } else if (dayInPhase === 5) {
        resources.push(
          enhanceResource({ title: "REST API Design", url: "https://restfulapi.net/", time: "30 min", category: "API Design" }, dayNumber),
          enhanceResource({ title: "REST Principles", url: "https://restfulapi.net/rest-architectural-constraints/", time: "25 min", category: "API Design" }, dayNumber)
        );
      } else if (dayInPhase === 6) {
        resources.push(
          enhanceResource({ title: "MongoDB CRUD Operations", url: "https://www.mongodb.com/docs/manual/crud/", time: "30 min", category: "Database" }, dayNumber),
          enhanceResource({ title: "MongoDB Basics", url: "https://www.mongodb.com/docs/manual/core/databases-and-collections/", time: "25 min", category: "Database" }, dayNumber)
        );
      } else if (dayInPhase === 7) {
        resources.push(
          enhanceResource({ title: "Mongoose Guide", url: "https://mongoosejs.com/docs/guide.html", time: "25 min", category: "ORM" }, dayNumber),
          enhanceResource({ title: "Mongoose Schemas", url: "https://mongoosejs.com/docs/guide.html#schemas", time: "30 min", category: "ORM" }, dayNumber)
        );
        if (dayNumber > 7) {
          resources.push(
            enhanceResource({ title: "Week 1 Review", url: "https://nodejs.org/en/docs", time: "20 min", category: "Week Review" }, dayNumber)
          );
        }
      } else if (dayInPhase === 8) {
        resources.push(
          enhanceResource({ title: "Database Schema Design", url: "https://www.mongodb.com/docs/manual/core/data-modeling-introduction/", time: "25 min", category: "Database Design" }, dayNumber),
          enhanceResource({ title: "Data Modeling", url: "https://www.mongodb.com/docs/manual/core/data-models/", time: "30 min", category: "Database Design" }, dayNumber)
        );
      } else if (dayInPhase === 9) {
        resources.push(
          enhanceResource({ title: "JWT Authentication Guide", url: "https://jwt.io/introduction", time: "25 min", category: "Security" }, dayNumber),
          enhanceResource({ title: "JWT Implementation", url: "https://jwt.io/introduction#how-it-works", time: "30 min", category: "Security" }, dayNumber)
        );
      } else if (dayInPhase === 10) {
        resources.push(
          enhanceResource({ title: "Password Hashing", url: "https://www.npmjs.com/package/bcrypt", time: "20 min", category: "Security" }, dayNumber),
          enhanceResource({ title: "bcrypt Guide", url: "https://github.com/kelektiv/node.bcrypt.js", time: "25 min", category: "Security" }, dayNumber)
        );
      } else if (dayInPhase === 11) {
        resources.push(
          enhanceResource({ title: "Express Error Handling", url: "https://expressjs.com/en/guide/error-handling.html", time: "20 min", category: "Error Handling" }, dayNumber),
          enhanceResource({ title: "Error Middleware", url: "https://expressjs.com/en/guide/error-handling.html#error-handling-middleware", time: "25 min", category: "Error Handling" }, dayNumber)
        );
      } else if (dayInPhase === 12) {
        resources.push(
          enhanceResource({ title: "API Security Best Practices", url: "https://owasp.org/www-project-api-security/", time: "30 min", category: "Security" }, dayNumber),
          enhanceResource({ title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten/", time: "25 min", category: "Security" }, dayNumber)
        );
      } else if (dayInPhase === 13) {
        resources.push(
          enhanceResource({ title: "Input Validation", url: "https://express-validator.github.io/docs/", time: "25 min", category: "Validation" }, dayNumber),
          enhanceResource({ title: "express-validator Guide", url: "https://express-validator.github.io/docs/guides/getting-started", time: "30 min", category: "Validation" }, dayNumber)
        );
      } else if (dayInPhase === 14) {
        resources.push(
          enhanceResource({ title: "Testing Node.js Applications", url: "https://jestjs.io/docs/getting-started", time: "30 min", category: "Testing" }, dayNumber),
          enhanceResource({ title: "Jest Testing", url: "https://jestjs.io/docs/getting-started#using-matchers", time: "25 min", category: "Testing" }, dayNumber)
        );
      } else if (dayInPhase === 15) {
        resources.push(
          enhanceResource({ title: "Phase 1 Complete - Review Fundamentals", url: "https://nodejs.org/en/docs", time: "30 min", category: "Phase Review" }, dayNumber),
          enhanceResource({ title: "Comprehensive Review", url: "https://expressjs.com/en/guide", time: "30 min", category: "Phase Review" }, dayNumber)
        );
      }
    }
    // Phase 2 (Days 16-30): Intermediate - Each day is unique
    else if (phase === 2) {
      if (dayInPhase === 1) {
        resources.push(
          enhanceResource({ title: "Advanced Express Patterns", url: "https://expressjs.com/en/advanced/best-practice-performance.html", time: "30 min", category: "Best Practices" }, dayNumber),
          enhanceResource({ title: "Express Best Practices", url: "https://expressjs.com/en/advanced/best-practice-performance.html#best-practices", time: "25 min", category: "Best Practices" }, dayNumber)
        );
        if (dayNumber > 16) {
          resources.push(
            enhanceResource({ title: "Building on Phase 1 (Days 1-15)", url: "https://expressjs.com/en/guide", time: "15 min", category: "Progressive Learning" }, dayNumber)
          );
        }
      } else if (dayInPhase === 2) {
        resources.push(
          enhanceResource({ title: "API Versioning", url: "https://restfulapi.net/versioning/", time: "25 min", category: "API Design" }, dayNumber),
          enhanceResource({ title: "Versioning Strategies", url: "https://restfulapi.net/versioning/#versioning-strategies", time: "30 min", category: "API Design" }, dayNumber)
        );
      } else if (dayInPhase === 3) {
        resources.push(
          enhanceResource({ title: "Database Indexing", url: "https://www.mongodb.com/docs/manual/indexes/", time: "25 min", category: "Database" }, dayNumber),
          enhanceResource({ title: "Index Types", url: "https://www.mongodb.com/docs/manual/indexes/#index-types", time: "30 min", category: "Database" }, dayNumber)
        );
      } else if (dayInPhase === 4) {
        resources.push(
          enhanceResource({ title: "Query Optimization", url: "https://www.mongodb.com/docs/manual/core/query-optimization/", time: "30 min", category: "Performance" }, dayNumber),
          enhanceResource({ title: "Explain Plans", url: "https://www.mongodb.com/docs/manual/reference/explain-results/", time: "25 min", category: "Performance" }, dayNumber)
        );
      } else if (dayInPhase === 5) {
        resources.push(
          enhanceResource({ title: "Aggregation Pipeline", url: "https://www.mongodb.com/docs/manual/core/aggregation-pipeline/", time: "30 min", category: "Database" }, dayNumber),
          enhanceResource({ title: "Aggregation Stages", url: "https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/", time: "30 min", category: "Database" }, dayNumber)
        );
      } else if (dayInPhase === 6) {
        resources.push(
          enhanceResource({ title: "WebSocket with Socket.io", url: "https://socket.io/docs/v4/", time: "30 min", category: "Real-time" }, dayNumber),
          enhanceResource({ title: "Socket.io Setup", url: "https://socket.io/docs/v4/server-initialization/", time: "25 min", category: "Real-time" }, dayNumber)
        );
      } else if (dayInPhase === 7) {
        resources.push(
          enhanceResource({ title: "File Upload Handling", url: "https://www.npmjs.com/package/multer", time: "25 min", category: "File Handling" }, dayNumber),
          enhanceResource({ title: "Multer Configuration", url: "https://github.com/expressjs/multer#usage", time: "30 min", category: "File Handling" }, dayNumber)
        );
        if (dayNumber > 22) {
          resources.push(
            enhanceResource({ title: "Week 3 Review", url: "https://nodejs.org/en/docs", time: "20 min", category: "Week Review" }, dayNumber)
          );
        }
      } else if (dayInPhase === 8) {
        resources.push(
          enhanceResource({ title: "Caching with Redis", url: "https://redis.io/docs/", time: "30 min", category: "Caching" }, dayNumber),
          enhanceResource({ title: "Redis Setup", url: "https://redis.io/docs/getting-started/", time: "25 min", category: "Caching" }, dayNumber)
        );
      } else if (dayInPhase === 9) {
        resources.push(
          enhanceResource({ title: "Rate Limiting", url: "https://www.npmjs.com/package/express-rate-limit", time: "25 min", category: "Security" }, dayNumber),
          enhanceResource({ title: "Rate Limiting Strategies", url: "https://www.npmjs.com/package/express-rate-limit#configuration", time: "30 min", category: "Security" }, dayNumber)
        );
      } else if (dayInPhase === 10) {
        resources.push(
          enhanceResource({ title: "API Documentation with Swagger", url: "https://swagger.io/specification/", time: "30 min", category: "Documentation" }, dayNumber),
          enhanceResource({ title: "Swagger Setup", url: "https://swagger.io/specification/#swagger-object", time: "25 min", category: "Documentation" }, dayNumber)
        );
      } else if (dayInPhase === 11) {
        resources.push(
          enhanceResource({ title: "Microservices Architecture", url: "https://microservices.io/patterns/microservices.html", time: "35 min", category: "Architecture" }, dayNumber),
          enhanceResource({ title: "Microservices Patterns", url: "https://microservices.io/patterns/", time: "30 min", category: "Architecture" }, dayNumber)
        );
      } else if (dayInPhase === 12) {
        resources.push(
          enhanceResource({ title: "Advanced Authentication", url: "https://oauth.net/2/", time: "30 min", category: "Security" }, dayNumber),
          enhanceResource({ title: "OAuth 2.0", url: "https://oauth.net/2/", time: "30 min", category: "Security" }, dayNumber)
        );
      } else if (dayInPhase === 13) {
        resources.push(
          enhanceResource({ title: "Background Jobs", url: "https://github.com/OptimalBits/bull", time: "30 min", category: "Background Jobs" }, dayNumber),
          enhanceResource({ title: "Bull Queue", url: "https://github.com/OptimalBits/bull#basic-usage", time: "30 min", category: "Background Jobs" }, dayNumber)
        );
      } else if (dayInPhase === 14) {
        resources.push(
          enhanceResource({ title: "GraphQL Basics", url: "https://graphql.org/learn/", time: "35 min", category: "API" }, dayNumber),
          enhanceResource({ title: "GraphQL Schema", url: "https://graphql.org/learn/schema/", time: "30 min", category: "API" }, dayNumber)
        );
      } else if (dayInPhase === 15) {
        resources.push(
          enhanceResource({ title: "Phase 2 Complete - Review Intermediate", url: "https://nodejs.org/en/docs", time: "30 min", category: "Phase Review" }, dayNumber),
          enhanceResource({ title: "Comprehensive Review", url: "https://expressjs.com/en/guide", time: "30 min", category: "Phase Review" }, dayNumber)
        );
      }
    }
    // Phase 3+ (Days 31+): Advanced
    else {
      const advancedTopics = [
        { title: "Advanced Database Patterns", url: "https://www.mongodb.com/docs/manual/core/data-modeling-introduction/", time: "30 min", category: "Database" },
        { title: "Microservices Communication", url: "https://microservices.io/patterns/communication-style/messaging.html", time: "35 min", category: "Architecture" },
        { title: "API Gateway Patterns", url: "https://microservices.io/patterns/apigateway.html", time: "30 min", category: "Architecture" },
        { title: "Distributed Systems", url: "https://en.wikipedia.org/wiki/Distributed_computing", time: "35 min", category: "Architecture" },
        { title: "Advanced Security", url: "https://owasp.org/www-project-top-ten/", time: "30 min", category: "Security" },
        { title: "Performance Monitoring", url: "https://www.datadoghq.com/", time: "30 min", category: "Monitoring" }
      ];
      const topicIndex = (dayNumber - 31) % advancedTopics.length;
      resources.push(enhanceResource(advancedTopics[topicIndex], dayNumber));
      if (dayInPhase > 6) {
        resources.push(enhanceResource(advancedTopics[(topicIndex + 1) % advancedTopics.length], dayNumber));
      }
      if (dayNumber > 31) {
        resources.push(
          enhanceResource({ title: `Building on Days 1-${dayNumber - 1} Backend`, url: "https://nodejs.org/en/docs", time: "15 min", category: "Progressive Learning" }, dayNumber)
        );
      }
      if (dayNumber % 15 === 0) {
        resources.push(
          enhanceResource({ title: `Milestone: Day ${dayNumber} Backend Review`, url: "https://nodejs.org/en/docs", time: "30 min", category: "Milestone Review" }, dayNumber)
        );
      }
    }
    
    return resources;
  }
  
  // WordPress/Systems Engineering progressive resources
  if (discipline === "Systems Engineering") {
    const resources = [];
    
    // Phase 1 (Days 1-15): Fundamentals - Each day is unique
    if (phase === 1) {
      if (dayInPhase === 1) {
        resources.push(
          enhanceResource({ title: "WordPress Development Environment", url: "https://developer.wordpress.org/getting-started/", time: "25 min", category: "Setup" }, dayNumber),
          enhanceResource({ title: "WordPress Installation", url: "https://wordpress.org/support/article/how-to-install-wordpress/", time: "30 min", category: "Setup" }, dayNumber)
        );
      } else if (dayInPhase === 2) {
        resources.push(
          enhanceResource({ title: "WordPress Basics", url: "https://wordpress.org/support/article/first-steps-with-wordpress/", time: "30 min", category: "Fundamentals" }, dayNumber),
          enhanceResource({ title: "WordPress Dashboard", url: "https://wordpress.org/support/article/dashboard-screen/", time: "25 min", category: "Fundamentals" }, dayNumber)
        );
        if (dayNumber > 1) {
          resources.push(
            enhanceResource({ title: "Review: Day 1 Concepts", url: "https://developer.wordpress.org/getting-started/", time: "10 min", category: "Review" }, dayNumber)
          );
        }
      } else if (dayInPhase === 3) {
        resources.push(
          enhanceResource({ title: "WordPress File Structure", url: "https://developer.wordpress.org/themes/basics/template-files/", time: "25 min", category: "Structure" }, dayNumber),
          enhanceResource({ title: "Theme File Organization", url: "https://developer.wordpress.org/themes/basics/organizing-theme-files/", time: "30 min", category: "Structure" }, dayNumber)
        );
      } else if (dayInPhase === 4) {
        resources.push(
          enhanceResource({ title: "Template Hierarchy", url: "https://developer.wordpress.org/themes/basics/template-hierarchy/", time: "30 min", category: "Themes" }, dayNumber),
          enhanceResource({ title: "Template Files", url: "https://developer.wordpress.org/themes/basics/template-files/", time: "25 min", category: "Themes" }, dayNumber)
        );
      } else if (dayInPhase === 5) {
        resources.push(
          enhanceResource({ title: "WordPress Hooks", url: "https://developer.wordpress.org/plugins/hooks/", time: "25 min", category: "Hooks" }, dayNumber),
          enhanceResource({ title: "Actions and Filters", url: "https://developer.wordpress.org/plugins/hooks/actions-and-filters/", time: "30 min", category: "Hooks" }, dayNumber)
        );
      } else if (dayInPhase === 6) {
        resources.push(
          enhanceResource({ title: "Theme Development", url: "https://developer.wordpress.org/themes/getting-started/", time: "30 min", category: "Themes" }, dayNumber),
          enhanceResource({ title: "Creating a Theme", url: "https://developer.wordpress.org/themes/getting-started/creating-your-first-theme/", time: "30 min", category: "Themes" }, dayNumber)
        );
      } else if (dayInPhase === 7) {
        resources.push(
          enhanceResource({ title: "Custom Post Types", url: "https://developer.wordpress.org/reference/functions/register_post_type/", time: "30 min", category: "Development" }, dayNumber),
          enhanceResource({ title: "Post Type Registration", url: "https://developer.wordpress.org/reference/functions/register_post_type/#parameters", time: "30 min", category: "Development" }, dayNumber)
        );
        if (dayNumber > 7) {
          resources.push(
            enhanceResource({ title: "Week 1 Review", url: "https://developer.wordpress.org/getting-started/", time: "20 min", category: "Week Review" }, dayNumber)
          );
        }
      } else if (dayInPhase === 8) {
        resources.push(
          enhanceResource({ title: "Custom Fields", url: "https://developer.wordpress.org/plugins/metadata/custom-meta-boxes/", time: "25 min", category: "Development" }, dayNumber),
          enhanceResource({ title: "Meta Boxes", url: "https://developer.wordpress.org/plugins/metadata/custom-meta-boxes/#creating-custom-meta-boxes", time: "30 min", category: "Development" }, dayNumber)
        );
      } else if (dayInPhase === 9) {
        resources.push(
          enhanceResource({ title: "Plugin Development", url: "https://developer.wordpress.org/plugins/plugin-basics/", time: "30 min", category: "Plugins" }, dayNumber),
          enhanceResource({ title: "Creating a Plugin", url: "https://developer.wordpress.org/plugins/plugin-basics/header-requirements/", time: "30 min", category: "Plugins" }, dayNumber)
        );
      } else if (dayInPhase === 10) {
        resources.push(
          enhanceResource({ title: "WordPress REST API", url: "https://developer.wordpress.org/rest-api/", time: "30 min", category: "API" }, dayNumber),
          enhanceResource({ title: "REST API Endpoints", url: "https://developer.wordpress.org/rest-api/reference/", time: "30 min", category: "API" }, dayNumber)
        );
      } else if (dayInPhase === 11) {
        resources.push(
          enhanceResource({ title: "User Roles and Capabilities", url: "https://developer.wordpress.org/plugins/users/roles-and-capabilities/", time: "25 min", category: "Security" }, dayNumber),
          enhanceResource({ title: "Managing Capabilities", url: "https://developer.wordpress.org/plugins/users/roles-and-capabilities/#checking-capabilities", time: "30 min", category: "Security" }, dayNumber)
        );
      } else if (dayInPhase === 12) {
        resources.push(
          enhanceResource({ title: "WordPress Security", url: "https://wordpress.org/support/article/hardening-wordpress/", time: "30 min", category: "Security" }, dayNumber),
          enhanceResource({ title: "Security Best Practices", url: "https://wordpress.org/support/article/hardening-wordpress/#keep-wordpress-updated", time: "25 min", category: "Security" }, dayNumber)
        );
      } else if (dayInPhase === 13) {
        resources.push(
          enhanceResource({ title: "Database Queries", url: "https://developer.wordpress.org/reference/classes/wp_query/", time: "30 min", category: "Database" }, dayNumber),
          enhanceResource({ title: "WP_Query Class", url: "https://developer.wordpress.org/reference/classes/wp_query/#parameters", time: "30 min", category: "Database" }, dayNumber)
        );
      } else if (dayInPhase === 14) {
        resources.push(
          enhanceResource({ title: "WordPress Best Practices", url: "https://developer.wordpress.org/coding-standards/", time: "25 min", category: "Best Practices" }, dayNumber),
          enhanceResource({ title: "Coding Standards", url: "https://developer.wordpress.org/coding-standards/wordpress-coding-standards/", time: "30 min", category: "Best Practices" }, dayNumber)
        );
      } else if (dayInPhase === 15) {
        resources.push(
          enhanceResource({ title: "Phase 1 Complete - Review Fundamentals", url: "https://developer.wordpress.org/getting-started/", time: "30 min", category: "Phase Review" }, dayNumber),
          enhanceResource({ title: "Comprehensive Review", url: "https://developer.wordpress.org/themes/getting-started/", time: "30 min", category: "Phase Review" }, dayNumber)
        );
      }
    }
    // Phase 2 (Days 16-30): Intermediate - Each day is unique
    else if (phase === 2) {
      if (dayInPhase === 1) {
        resources.push(
          enhanceResource({ title: "Advanced Theme Development", url: "https://developer.wordpress.org/themes/advanced-topics/", time: "35 min", category: "Themes" }, dayNumber),
          enhanceResource({ title: "Theme Architecture", url: "https://developer.wordpress.org/themes/advanced-topics/theme-architecture/", time: "30 min", category: "Themes" }, dayNumber)
        );
        if (dayNumber > 16) {
          resources.push(
            enhanceResource({ title: "Building on Phase 1 (Days 1-15)", url: "https://developer.wordpress.org/getting-started/", time: "15 min", category: "Progressive Learning" }, dayNumber)
          );
        }
      } else if (dayInPhase === 2) {
        resources.push(
          enhanceResource({ title: "Gutenberg Block Development", url: "https://developer.wordpress.org/block-editor/getting-started/", time: "35 min", category: "Blocks" }, dayNumber),
          enhanceResource({ title: "Creating Blocks", url: "https://developer.wordpress.org/block-editor/getting-started/create-a-block/", time: "35 min", category: "Blocks" }, dayNumber)
        );
      } else if (dayInPhase === 3) {
        resources.push(
          enhanceResource({ title: "Advanced Plugin Development", url: "https://developer.wordpress.org/plugins/plugin-basics/", time: "35 min", category: "Plugins" }, dayNumber),
          enhanceResource({ title: "Plugin Architecture", url: "https://developer.wordpress.org/plugins/plugin-basics/plugin-file-structure/", time: "30 min", category: "Plugins" }, dayNumber)
        );
      } else if (dayInPhase === 4) {
        resources.push(
          enhanceResource({ title: "WordPress Cron Jobs", url: "https://developer.wordpress.org/plugins/cron/", time: "25 min", category: "Scheduling" }, dayNumber),
          enhanceResource({ title: "WP-Cron System", url: "https://developer.wordpress.org/plugins/cron/scheduling-wp-cron-events/", time: "30 min", category: "Scheduling" }, dayNumber)
        );
      } else if (dayInPhase === 5) {
        resources.push(
          enhanceResource({ title: "Settings API", url: "https://developer.wordpress.org/plugins/settings/settings-api/", time: "30 min", category: "Settings" }, dayNumber),
          enhanceResource({ title: "Creating Settings Pages", url: "https://developer.wordpress.org/plugins/settings/settings-api/#creating-settings-pages", time: "30 min", category: "Settings" }, dayNumber)
        );
      } else if (dayInPhase === 6) {
        resources.push(
          enhanceResource({ title: "WordPress Performance", url: "https://developer.wordpress.org/advanced-administration/performance/optimization/", time: "30 min", category: "Performance" }, dayNumber),
          enhanceResource({ title: "Performance Optimization", url: "https://developer.wordpress.org/advanced-administration/performance/optimization/#optimization-techniques", time: "30 min", category: "Performance" }, dayNumber)
        );
      } else if (dayInPhase === 7) {
        resources.push(
          enhanceResource({ title: "Caching Strategies", url: "https://developer.wordpress.org/advanced-administration/performance/caching/", time: "30 min", category: "Caching" }, dayNumber),
          enhanceResource({ title: "Object Caching", url: "https://developer.wordpress.org/advanced-administration/performance/caching/#object-caching", time: "30 min", category: "Caching" }, dayNumber)
        );
        if (dayNumber > 22) {
          resources.push(
            enhanceResource({ title: "Week 3 Review", url: "https://developer.wordpress.org/getting-started/", time: "20 min", category: "Week Review" }, dayNumber)
          );
        }
      } else if (dayInPhase === 8) {
        resources.push(
          enhanceResource({ title: "Database Optimization", url: "https://developer.wordpress.org/advanced-administration/performance/database-optimization/", time: "30 min", category: "Database" }, dayNumber),
          enhanceResource({ title: "Query Optimization", url: "https://developer.wordpress.org/advanced-administration/performance/database-optimization/#query-optimization", time: "30 min", category: "Database" }, dayNumber)
        );
      } else if (dayInPhase === 9) {
        resources.push(
          enhanceResource({ title: "WordPress Multisite", url: "https://developer.wordpress.org/advanced-administration/multisite/", time: "35 min", category: "Multisite" }, dayNumber),
          enhanceResource({ title: "Multisite Setup", url: "https://developer.wordpress.org/advanced-administration/multisite/create-a-network/", time: "35 min", category: "Multisite" }, dayNumber)
        );
      } else if (dayInPhase === 10) {
        resources.push(
          enhanceResource({ title: "Custom Taxonomies", url: "https://developer.wordpress.org/reference/functions/register_taxonomy/", time: "30 min", category: "Development" }, dayNumber),
          enhanceResource({ title: "Taxonomy Registration", url: "https://developer.wordpress.org/reference/functions/register_taxonomy/#parameters", time: "30 min", category: "Development" }, dayNumber)
        );
      } else if (dayInPhase === 11) {
        resources.push(
          enhanceResource({ title: "WordPress CLI", url: "https://wp-cli.org/", time: "30 min", category: "CLI" }, dayNumber),
          enhanceResource({ title: "WP-CLI Commands", url: "https://wp-cli.org/commands/", time: "30 min", category: "CLI" }, dayNumber)
        );
      } else if (dayInPhase === 12) {
        resources.push(
          enhanceResource({ title: "E-commerce with WooCommerce", url: "https://woocommerce.com/documentation/", time: "35 min", category: "E-commerce" }, dayNumber),
          enhanceResource({ title: "WooCommerce Setup", url: "https://woocommerce.com/documentation/woocommerce-getting-started/", time: "35 min", category: "E-commerce" }, dayNumber)
        );
      } else if (dayInPhase === 13) {
        resources.push(
          enhanceResource({ title: "WordPress Deployment", url: "https://developer.wordpress.org/advanced-administration/deployment/", time: "30 min", category: "Deployment" }, dayNumber),
          enhanceResource({ title: "Deployment Best Practices", url: "https://developer.wordpress.org/advanced-administration/deployment/#deployment-best-practices", time: "30 min", category: "Deployment" }, dayNumber)
        );
      } else if (dayInPhase === 14) {
        resources.push(
          enhanceResource({ title: "WordPress Security Hardening", url: "https://wordpress.org/support/article/hardening-wordpress/", time: "30 min", category: "Security" }, dayNumber),
          enhanceResource({ title: "Security Measures", url: "https://wordpress.org/support/article/hardening-wordpress/#security-measures", time: "30 min", category: "Security" }, dayNumber)
        );
      } else if (dayInPhase === 15) {
        resources.push(
          enhanceResource({ title: "Phase 2 Complete - Review Intermediate", url: "https://developer.wordpress.org/getting-started/", time: "30 min", category: "Phase Review" }, dayNumber),
          enhanceResource({ title: "Comprehensive Review", url: "https://developer.wordpress.org/themes/advanced-topics/", time: "30 min", category: "Phase Review" }, dayNumber)
        );
      }
    }
    // Phase 3+ (Days 31+): Advanced
    else {
      const advancedTopics = [
        { title: "Advanced WordPress Architecture", url: "https://developer.wordpress.org/advanced-administration/", time: "35 min", category: "Architecture" },
        { title: "Headless WordPress", url: "https://developer.wordpress.org/rest-api/", time: "35 min", category: "Headless" },
        { title: "WordPress as a CMS", url: "https://developer.wordpress.org/rest-api/", time: "30 min", category: "CMS" },
        { title: "Custom Database Tables", url: "https://developer.wordpress.org/reference/functions/wpdb/", time: "30 min", category: "Database" },
        { title: "WordPress Performance Optimization", url: "https://developer.wordpress.org/advanced-administration/performance/optimization/", time: "30 min", category: "Performance" },
        { title: "WordPress Freelancing", url: "https://wordpress.org/support/article/", time: "30 min", category: "Business" }
      ];
      const topicIndex = (dayNumber - 31) % advancedTopics.length;
      resources.push(enhanceResource(advancedTopics[topicIndex], dayNumber));
      if (dayInPhase > 6) {
        resources.push(enhanceResource(advancedTopics[(topicIndex + 1) % advancedTopics.length], dayNumber));
      }
      if (dayNumber > 31) {
        resources.push(
          enhanceResource({ title: `Building on Days 1-${dayNumber - 1} WordPress`, url: "https://developer.wordpress.org/getting-started/", time: "15 min", category: "Progressive Learning" }, dayNumber)
        );
      }
      if (dayNumber % 15 === 0) {
        resources.push(
          enhanceResource({ title: `Milestone: Day ${dayNumber} WordPress Review`, url: "https://developer.wordpress.org/getting-started/", time: "30 min", category: "Milestone Review" }, dayNumber)
        );
      }
    }
    
    return resources;
  }
  
  return [];
}

function getDaySpecificResources(dayNumber, discipline, weekNum, dayIndex) {
  // Use progressive daily resources that build on each other
  const progressiveResources = getProgressiveDailyResources(dayNumber, discipline, weekNum, dayIndex);
  
  // Also include component-specific resources as supplementary
  const component = getProjectComponentForDay(dayNumber, discipline);
  const componentName = component.component || "";
  const partName = component.part || "";
  const phase = Math.ceil(dayNumber / 15);
  const dayInPhase = ((dayNumber - 1) % 15) + 1;
  
  // Helper to enhance component resources with day-specific context
  const enhanceComponentResource = (resource) => {
    return {
      ...resource,
      title: `Day ${dayNumber}: ${resource.title}`,
      description: resource.description || `Component-specific resource for Day ${dayNumber} - ${componentName}. Part of Phase ${phase}, Day ${dayInPhase}.`,
      dayNumber: dayNumber,
      phase: phase,
      dayInPhase: dayInPhase,
      component: componentName,
    };
  };
  
  // Combine progressive resources with component-specific ones (if any)
  let componentResources = [];
  
  // Frontend component-specific resources (supplementary)
  if (discipline === "Frontend") {
    if (componentName.includes("Layout") || partName.includes("Layout")) {
      componentResources.push(enhanceComponentResource({
        title: "CSS Layout Patterns",
        url: "https://css-tricks.com/guides/layout/",
        time: "25 min",
        category: "Layout"
      }));
    }
    if (componentName.includes("Form") || componentName.includes("Modal")) {
      componentResources.push(enhanceComponentResource({
        title: "React Portal for Modals",
        url: "https://react.dev/reference/react-dom/createPortal",
        time: "15 min",
        category: "UI Patterns"
      }));
    }
    if (componentName.includes("Dashboard")) {
      componentResources.push(enhanceComponentResource({
        title: "Dashboard Design Patterns",
        url: "https://react.dev/learn",
        time: "20 min",
        category: "Design Patterns"
      }));
    }
  }
  
  // Mobile component-specific resources (supplementary)
  if (discipline === "Mobile") {
    if (componentName.includes("Offline")) {
      componentResources.push(enhanceComponentResource({
        title: "Offline-First Architecture",
        url: "https://reactnative.dev/docs/network",
        time: "20 min",
        category: "Architecture"
      }));
    }
    if (componentName.includes("Navigation")) {
      componentResources.push(enhanceComponentResource({
        title: "React Navigation Advanced",
        url: "https://reactnavigation.org/docs/getting-started",
        time: "25 min",
        category: "Navigation"
      }));
    }
  }
  
  // Backend component-specific resources (supplementary)
  if (discipline === "Backend") {
    if (componentName.includes("Auth")) {
      componentResources.push(enhanceComponentResource({
        title: "Authentication Best Practices",
        url: "https://jwt.io/introduction",
        time: "25 min",
        category: "Security"
      }));
    }
    if (componentName.includes("API")) {
      componentResources.push(enhanceComponentResource({
        title: "REST API Design Patterns",
        url: "https://restfulapi.net/",
        time: "30 min",
        category: "API Design"
      }));
    }
  }
  
  // Systems Engineering (WordPress) component-specific resources (supplementary)
  if (discipline === "Systems Engineering") {
    if (componentName.includes("Post Types") || componentName.includes("Custom")) {
      componentResources.push(enhanceComponentResource({
        title: "Custom Post Types",
        url: "https://developer.wordpress.org/reference/functions/register_post_type/",
        time: "25 min",
        category: "Development"
      }));
    }
    if (componentName.includes("Theme")) {
      componentResources.push(enhanceComponentResource({
        title: "WordPress Theme Development",
        url: "https://developer.wordpress.org/themes/getting-started/",
        time: "30 min",
        category: "Themes"
      }));
    }
  }
  
  // Add day-specific learning milestone note (only if we have resources)
  // Don't add milestone if no resources exist
  if (progressiveResources.length > 0 || componentResources.length > 0) {
    const milestoneNote = {
      title: `Day ${dayNumber} Learning Milestone`,
      description: `You're ${((dayNumber / 90) * 100).toFixed(1)}% through your journey. Today's focus: ${componentName || 'building skills'}.`,
      url: "#",
      time: "2 min",
      category: "Milestone",
      dayNumber: dayNumber,
      phase: phase,
      dayInPhase: dayInPhase,
    };
    return [...progressiveResources, ...componentResources, milestoneNote];
  }
  
  // Return progressive resources (primary) + component-specific resources (supplementary)
  // Progressive resources change daily and build on each other
  // Component resources are supplementary and related to what's being built
  return [...progressiveResources, ...componentResources];
}

function getDisciplineResources(discipline, weekNum, skillName = null, dayNumber = null, dayIndex = null) {
  // If skillName is provided, return skill-specific resources
  if (skillName) {
    return getSkillResources(skillName);
  }

  // For Software Engineering, use day-specific resources
  if (dayNumber && dayIndex !== null) {
    return getDaySpecificResources(dayNumber, discipline, weekNum, dayIndex);
  }

  // Otherwise return general discipline resources (fallback)
  const resources = {
    Frontend: [
      {
        title: "MDN Web Docs",
        url: "https://developer.mozilla.org",
        category: "Documentation",
        time: "Reference",
        type: "deep-learning",
      },
      {
        title: "React Official Docs",
        url: "https://react.dev/learn",
        category: "Library",
        time: "Reference",
        type: "deep-learning",
      },
    ],
    Backend: [
      {
        title: "Node.js Documentation",
        url: "https://nodejs.org/en/docs",
        category: "Runtime",
        time: "Reference",
        type: "deep-learning",
      },
      {
        title: "Express.js Docs",
        url: "https://expressjs.com",
        category: "Framework",
        time: "Reference",
        type: "deep-learning",
      },
    ],
    Mobile: [
      {
        title: "React Native Documentation",
        url: "https://reactnative.dev",
        category: "Framework",
        time: "Reference",
        type: "deep-learning",
      },
      {
        title: "Expo Documentation",
        url: "https://docs.expo.dev",
        category: "Framework",
        time: "Reference",
        type: "deep-learning",
      },
    ],
    "Systems Engineering": [
      {
        title: "WordPress Developer Docs",
        url: "https://developer.wordpress.org",
        category: "CMS",
        time: "Reference",
        type: "deep-learning",
      },
    ],
  };

  return resources[discipline] || [];
}

// Export functions for use in components
// Get topics for each skill
function getSkillTopics(skillName) {
  const skillTopics = {
    HTML5: [
      "HTML document structure: <!DOCTYPE html>, <html>, <head>, <body>",
      "Semantic HTML5 elements: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>",
      "Text elements: headings (<h1>-<h6>), paragraphs (<p>), lists (<ul>, <ol>, <dl>)",
      "Links and navigation: <a>, href attributes, relative vs absolute paths",
      "Images: <img>, alt attributes, srcset for responsive images",
      "Forms: <form>, <input> types, <label>, <button>, <textarea>, <select>",
      "Metadata: <meta> tags, Open Graph, SEO basics",
      "Accessibility: ARIA labels, semantic structure, keyboard navigation",
    ],
    CSS3: [
      "CSS syntax: selectors, properties, values",
      "Three ways to add CSS: inline, <style>, external stylesheet",
      "Basic selectors: element, class (.), ID (#)",
      "Box model: content, padding, border, margin",
      "Display types: block, inline, inline-block, none",
      "Positioning: static, relative, absolute, fixed, sticky",
      "Flexbox: container and item properties",
      "CSS Grid: grid-template-columns, grid-template-rows, gap",
      "Responsive Design: media queries, mobile-first approach",
    ],
    TailwindCSS: [
      "Utility-first CSS philosophy",
      "Installation: CDN, npm, CLI",
      "Configuration: tailwind.config.js",
      "Core concepts: utility classes vs component classes",
      "Responsive prefixes: sm:, md:, lg:, xl:, 2xl:",
      "State variants: hover:, focus:, active:, disabled:",
      "Dark mode: dark:",
      "Spacing, typography, colors, layout utilities",
      "Custom configuration: colors, fonts, spacing",
    ],
    "JavaScript ES6": [
      "Variables: let, const, var",
      "Data types: string, number, boolean, object, array",
      "Functions: arrow functions, function declarations",
      "DOM manipulation: querySelector, addEventListener",
      "ES6 features: destructuring, spread operator, template literals",
      "Async JavaScript: promises, async/await",
      "Fetch API: making HTTP requests",
      "Event handling and callbacks",
    ],
    React: [
      "React basics: components, JSX, props",
      "State management: useState hook",
      "Effects: useEffect hook",
      "Event handling in React",
      "Conditional rendering",
      "Lists and keys",
      "Component lifecycle",
      "React Router for navigation",
    ],
    "Next.js": [
      "File-based routing",
      "Pages and layouts",
      "API routes",
      "Server-side rendering (SSR)",
      "Static site generation (SSG)",
      "Data fetching: getServerSideProps, getStaticProps",
      "Image optimization",
      "Deployment",
    ],
    "Node.js": [
      "Node.js basics and runtime",
      "NPM and package management",
      "File system operations",
      "HTTP server creation",
      "Modules: require, module.exports",
      "Event loop and asynchronous programming",
      "Streams and buffers",
    ],
    Express: [
      "Express setup and routing",
      "Middleware: built-in and custom",
      "Request and response objects",
      "Route parameters and query strings",
      "Error handling",
      "Template engines",
      "Static files serving",
    ],
    "REST APIs": [
      "REST principles",
      "HTTP methods: GET, POST, PUT, DELETE",
      "Request/response cycle",
      "API endpoints design",
      "Status codes",
      "JSON data format",
      "API documentation",
    ],
    Authentication: [
      "Authentication vs authorization",
      "JWT tokens",
      "Password hashing",
      "Session management",
      "OAuth 2.0",
      "Security best practices",
      "Protected routes",
    ],
    Databases: [
      "SQL vs NoSQL",
      "MongoDB basics",
      "PostgreSQL basics",
      "CRUD operations",
      "Database relationships",
      "Indexes and optimization",
      "Query optimization",
    ],
    ORMs: [
      "ORM concepts",
      "Prisma setup and schema",
      "Mongoose for MongoDB",
      "Migrations",
      "Relationships in ORMs",
      "Query building",
      "Data validation",
    ],
    TypeScript: [
      "TypeScript basics and setup",
      "Type annotations and inference",
      "Interfaces and types",
      "Generics",
      "Type guards and narrowing",
      "React Native with TypeScript",
    ],
    "React Native Components": [
      "Core components: View, Text, Image, ScrollView",
      "StyleSheet and Flexbox",
      "Platform-specific code (iOS vs Android)",
      "Custom components",
      "Component composition",
      "Performance optimization",
    ],
    "State Management": [
      "React Native state management concepts",
      "useState and useEffect hooks",
      "Context API for global state",
      "Redux for complex state management",
      "AsyncStorage for persistent state",
      "State management patterns and best practices",
    ],
    "React Native": [
      "React Native basics",
      "Components and styling",
      "Navigation",
      "Platform-specific code",
      "Native modules",
      "Performance optimization",
    ],
    "WP Structure": [
      "WordPress file structure",
      "Theme hierarchy",
      "Template files",
      "The Loop",
      "Hooks and filters",
      "WordPress database",
    ],
    "Custom Themes": [
      "Theme development basics",
      "Creating a theme",
      "Template hierarchy",
      "Custom post types",
      "Widgets and menus",
      "Theme customization",
    ],
    "Gutenberg Blocks": [
      "Block editor basics",
      "Creating custom blocks",
      "Block attributes",
      "Block editor API",
      "Block patterns",
      "Reusable blocks",
    ],
    "Plugin Development": [
      "Plugin structure",
      "Creating a plugin",
      "Hooks and filters",
      "Database operations",
      "Admin pages",
      "Plugin security",
    ],
  };

  return skillTopics[skillName] || [];
}

export { getSkillResources, getSkillQuiz, getSkillTopics };

// Roadmap progression for each discipline (enhanced with resources and quizzes)
function getDisciplineRoadmap(discipline) {
  const roadmaps = {
    Frontend: [
      {
        skill: "HTML5",
        status: "foundation",
        description: "Semantic Structure → Accessibility",
        resources: getSkillResources("HTML5"),
        quiz: getSkillQuiz("HTML5"),
        deepLearningTime: "60 min",
      },
      {
        skill: "CSS3",
        status: "foundation",
        description: "Flexbox → Grid → Responsive Design",
        resources: getSkillResources("CSS3"),
        quiz: getSkillQuiz("CSS3"),
        deepLearningTime: "90 min",
      },
      {
        skill: "TailwindCSS",
        status: "intermediate",
        description: "Utilities → Components → Layouts",
        resources: getSkillResources("TailwindCSS"),
        quiz: [],
        deepLearningTime: "60 min",
      },
      {
        skill: "JavaScript ES6",
        status: "intermediate",
        description: "DOM → Async → Fetch → APIs",
        resources: getSkillResources("JavaScript ES6"),
        quiz: getSkillQuiz("JavaScript ES6"),
        deepLearningTime: "120 min",
      },
      {
        skill: "React",
        status: "advanced",
        description: "Basics → Hooks → State → Routing",
        resources: getSkillResources("React"),
        quiz: getSkillQuiz("React"),
        deepLearningTime: "120 min",
      },
      {
        skill: "Next.js",
        status: "advanced",
        description: "File-based routing → API routes → SSR/SSG",
        resources: getSkillResources("Next.js"),
        quiz: [],
        deepLearningTime: "90 min",
      },
    ],
    Backend: [
      {
        skill: "Node.js",
        status: "foundation",
        description: "Runtime basics",
        resources: getSkillResources("Node.js"),
        quiz: getSkillQuiz("Node.js"),
        deepLearningTime: "90 min",
      },
      {
        skill: "Express",
        status: "intermediate",
        description: "Routing & middleware",
        resources: getSkillResources("Express"),
        quiz: [],
        deepLearningTime: "60 min",
      },
      {
        skill: "REST APIs",
        status: "intermediate",
        description: "API design",
        resources: getSkillResources("REST APIs"),
        quiz: [],
        deepLearningTime: "90 min",
      },
      {
        skill: "Authentication",
        status: "advanced",
        description: "JWT, sessions",
        resources: getSkillResources("Authentication"),
        quiz: [],
        deepLearningTime: "90 min",
      },
      {
        skill: "Databases",
        status: "advanced",
        description: "MongoDB or PostgreSQL",
        resources: getSkillResources("Databases"),
        quiz: [],
        deepLearningTime: "120 min",
      },
      {
        skill: "ORMs",
        status: "advanced",
        description: "Prisma or Mongoose",
        resources: getSkillResources("ORMs"),
        quiz: [],
        deepLearningTime: "60 min",
      },
      {
        skill: "Deployment",
        status: "advanced",
        description: "Production fundamentals",
        resources: [],
        quiz: [],
        deepLearningTime: "90 min",
      },
    ],
    Mobile: [
      {
        skill: "React Native Core",
        status: "foundation",
        description: "Components, styling, navigation",
        resources: getSkillResources("React Native"),
        quiz: [],
        deepLearningTime: "120 min",
      },
      {
        skill: "React Native Components",
        status: "intermediate",
        description: "UI components & patterns",
        resources: getSkillResources("React Native Components"),
        quiz: [],
        deepLearningTime: "120 min",
      },
      {
        skill: "State Management",
        status: "intermediate",
        description: "Context API, Redux, AsyncStorage",
        resources: getSkillResources("State Management"),
        quiz: [],
        deepLearningTime: "90 min",
      },
      {
        skill: "TypeScript",
        status: "intermediate",
        description: "React Native with TypeScript",
        resources: getSkillResources("TypeScript"),
        quiz: [],
        deepLearningTime: "90 min",
      },
      {
        skill: "API Integration",
        status: "advanced",
        description: "RESTful APIs, JWT, WebSockets",
        resources: [],
        quiz: [],
        deepLearningTime: "90 min",
      },
      {
        skill: "Maps & Location",
        status: "advanced",
        description: "React Native Maps, GPS tracking",
        resources: [],
        quiz: [],
        deepLearningTime: "120 min",
      },
      {
        skill: "Deployment",
        status: "advanced",
        description: "App Store, Play Store, CI/CD",
        resources: [],
        quiz: [],
        deepLearningTime: "90 min",
      },
    ],
    "Systems Engineering": [
      {
        skill: "WP Structure",
        status: "foundation",
        description: "File structure",
        resources: getSkillResources("WP Structure"),
        quiz: [],
        deepLearningTime: "45 min",
      },
      {
        skill: "Custom Themes",
        status: "intermediate",
        description: "Theme development",
        resources: getSkillResources("Custom Themes"),
        quiz: [],
        deepLearningTime: "120 min",
      },
      {
        skill: "Gutenberg Blocks",
        status: "intermediate",
        description: "Custom blocks",
        resources: getSkillResources("Gutenberg Blocks"),
        quiz: [],
        deepLearningTime: "60 min",
      },
      {
        skill: "Plugin Development",
        status: "advanced",
        description: "Plugin creation",
        resources: getSkillResources("Plugin Development"),
        quiz: [],
        deepLearningTime: "90 min",
      },
      {
        skill: "Security",
        status: "advanced",
        description: "Best practices",
        resources: [],
        quiz: [],
        deepLearningTime: "60 min",
      },
      {
        skill: "Monetization",
        status: "advanced",
        description: "Marketplace preparation",
        resources: [],
        quiz: [],
        deepLearningTime: "45 min",
      },
    ],
  };

  return roadmaps[discipline] || [];
}

// ============================================================================
// HELPER FUNCTIONS FOR DISCIPLINE-SPECIFIC LEARNING CONTENT
// ============================================================================
// These functions generate comprehensive, ground-up learning content for each
// discipline, properly sized for their time allocations and covering all key
// concepts progressively across 13 weeks (90 days)
// ============================================================================

// Helper function to generate Frontend learning content based on week and day
// Covers HTML, CSS, React, Next.js progressively, sized for 90 minutes per day
function getFrontendLearningContent(weekNum, dayIndex) {
  const dayNumber = (weekNum - 1) * 7 + dayIndex + 1;

  // Week 1: HTML & CSS Fundamentals (Ground Up)
  if (weekNum === 1) {
    const week1Content = {
      0: {
        title: "Frontend: JavaScript Fundamentals (90 min)",
        topics: [
          "JavaScript basics: history, role in modern development",
          "Variables: var, let, const (ES6+) - differences and best practices",
          "Data Types: Primitives (number, string, boolean, undefined, null, symbol, bigint) and Objects",
          "Type checking: typeof, instanceof",
          "Type coercion and conversion",
          "Operators: Arithmetic, Assignment, Comparison, Logical, Ternary",
          "Template literals (ES6): backticks, interpolation, multi-line strings",
          "Destructuring: arrays and objects",
          "Spread and Rest operators",
          "Arrow functions vs regular functions",
        ],
      },
      1: {
        title: "Frontend: CSS Core Concepts & Selectors (90 min)",
        topics: [
          "Box Model Deep Dive: content-box vs border-box, calculating total dimensions",
          "Display types: block, inline, inline-block, none",
          "Positioning: static, relative, absolute, fixed, sticky",
          "Z-index and stacking context",
          "CSS Units: px, em, rem, %, vh, vw, fr",
          "Typography: font-family, font-size, font-weight, line-height, text-transform",
          "Colors: hex, rgb, rgba, hsl, hsla, named colors",
          "Backgrounds: background-color, background-image, background-size, background-position",
          "Borders and shadows: border, border-radius, box-shadow",
          "Spacing: margin, padding (shorthand and longhand)",
          "Advanced selectors: descendant, child (>), adjacent sibling (+), general sibling (~)",
          'Attribute selectors: [attr], [attr="value"], [attr^="value"], [attr$="value"], [attr*="value"]',
          "Pseudo-classes: :hover, :focus, :active, :first-child, :last-child, :nth-child()",
          "Pseudo-elements: ::before, ::after, ::first-line, ::first-letter",
          "Specificity calculation: inline styles (1000), IDs (100), classes (10), elements (1)",
        ],
      },
      2: {
        title: "Frontend: Flexbox Fundamentals & Patterns (90 min)",
        topics: [
          "Flex container properties: display: flex, flex-direction, flex-wrap, justify-content, align-items, align-content, gap",
          "Flex item properties: flex-grow, flex-shrink, flex-basis, flex (shorthand), align-self, order",
          "Centering content (horizontal and vertical)",
          "Navigation bars",
          "Card grids",
          "Holy Grail layout",
          "Sticky footer",
          "Equal height columns",
          "Responsive image galleries",
        ],
      },
      3: {
        title: "Frontend: CSS Grid Fundamentals & Patterns (90 min)",
        topics: [
          "Grid container properties: display: grid, grid-template-columns, grid-template-rows, grid-template-areas, gap",
          "Grid item properties: grid-column, grid-row, grid-area, justify-self, align-self",
          "Grid lines and tracks",
          "Implicit vs explicit grid",
          "Auto-placement",
          "Responsive grid without media queries (auto-fit, auto-fill)",
          "Magazine-style layouts",
          "Overlapping grid items",
          "Grid + Flexbox combination",
        ],
      },
      4: {
        title: "Frontend: Responsive Design Principles (90 min)",
        topics: [
          "Mobile-first vs desktop-first approaches",
          "Breakpoints: common sizes (320px, 768px, 1024px, 1440px)",
          "Viewport meta tag",
          "Media queries syntax",
          "Responsive typography: fluid typography with clamp()",
          "Responsive images: srcset, sizes, <picture> element",
          "Container queries (modern approach)",
          "CSS clamp() for fluid typography",
          "Aspect ratio: aspect-ratio property",
          "Touch-friendly targets (min 44x44px)",
        ],
      },
      5: {
        title: "Frontend: Tailwind CSS Fundamentals (90 min)",
        topics: [
          "Utility-first CSS philosophy",
          "Installation: CDN, npm, CLI",
          "Configuration: tailwind.config.js",
          "Core concepts: utility classes vs component classes",
          "Responsive prefixes: sm:, md:, lg:, xl:, 2xl:",
          "State variants: hover:, focus:, active:, disabled:",
          "Dark mode: dark:",
          "Spacing, typography, colors, layout utilities",
          "Flexbox and Grid utilities",
          "Custom configuration: colors, fonts, spacing",
          "Extending default theme",
          "Custom utilities with @apply",
          "JIT (Just-In-Time) mode",
        ],
      },
      6: {
        title: "Frontend: Week 1 Review & Consolidation (90 min)",
        topics: [
          "Review all Week 1 concepts",
          "Identify knowledge gaps",
          "Deep dive into any unclear topics",
          "Practice with interactive resources",
          "CSS animations and keyframes",
          "CSS transforms and transitions",
          "Advanced Tailwind patterns",
          "Performance optimization",
          "Accessibility best practices",
        ],
      },
    };
    return week1Content[dayIndex] || week1Content[0];
  }

  // Week 2: React Fundamentals
  if (weekNum === 2) {
    const week2Content = {
      0: {
        title: "Frontend: React Components Fundamentals (90 min)",
        topics: [
          "React Components: functional vs class components",
          "JSX syntax: writing HTML-like code in JavaScript",
          "Component structure: import, component function, export",
          "Props: passing data to components",
          "Props destructuring and default props",
          "Component composition: building complex UIs from simple components",
          "Rendering lists: map() function, keys",
          "Conditional rendering: ternary operators, && operator",
          "Event handling: onClick, onChange, onSubmit",
          "Component state: useState hook basics",
        ],
      },
      1: {
        title: "Frontend: React State Management & Forms (90 min)",
        topics: [
          "useState hook: managing component state",
          "State updates: setState patterns, functional updates",
          "Controlled components: form inputs with state",
          "Form handling: onSubmit, preventDefault",
          "Input types: text, email, password, number, date",
          "Form validation: client-side validation basics",
          "Multiple inputs: managing multiple form fields",
          "Form submission: handling form data",
          "Loading states: showing loading indicators",
          "Error handling in forms: displaying errors",
        ],
      },
      2: {
        title: "Frontend: React Hooks & Fetching Data (90 min)",
        topics: [
          "useEffect hook: side effects in React",
          "Dependency array: when effects run",
          "Fetch API: making HTTP requests",
          "async/await: handling asynchronous operations",
          "Loading states: useState for loading",
          "Error states: handling API errors",
          "Displaying data: rendering API responses",
          "useEffect cleanup: preventing memory leaks",
          "Custom hooks: extracting reusable logic",
          "Data fetching patterns: best practices",
        ],
      },
      3: {
        title: "Frontend: Context API for Global State (90 min)",
        topics: [
          "Context API: sharing state across components",
          "createContext: creating a context",
          "Provider component: wrapping components",
          "useContext hook: consuming context",
          "Context patterns: authentication context, theme context",
          "Combining contexts: multiple contexts",
          "Context vs Props: when to use each",
          "Context performance: optimization tips",
          "Custom context hooks: cleaner API",
          "Context with TypeScript: type safety",
        ],
      },
      4: {
        title: "Frontend: React Router Navigation (90 min)",
        topics: [
          "React Router: client-side routing",
          "BrowserRouter: setting up router",
          "Routes and Route: defining routes",
          "Link component: navigation links",
          "useNavigate hook: programmatic navigation",
          "URL parameters: useParams hook",
          "Nested routes: organizing route structure",
          "Protected routes: authentication guards",
          "404 pages: handling unknown routes",
          "Route transitions: smooth navigation",
        ],
      },
      5: {
        title: "Frontend: Advanced Form Handling (90 min)",
        topics: [
          "Form libraries: React Hook Form basics",
          "Form validation: client-side validation rules",
          "Error messages: displaying validation errors",
          "Form submission: handling async submissions",
          "File uploads: handling file inputs",
          "Multi-step forms: wizard patterns",
          "Form state management: complex form state",
          "Form reset: clearing form after submission",
          "Form accessibility: ARIA labels, error announcements",
          "Form testing: testing form interactions",
        ],
      },
      6: {
        title: "Frontend: Week 2 Review - Full-Stack Integration (90 min)",
        topics: [
          "Review React components, hooks, and state",
          "Review form handling and API calls",
          "Practice building components that consume APIs",
          "Review Context API patterns",
          "Review React Router navigation",
          "Build a complete feature: component + API integration",
        ],
      },
    };
    return week2Content[dayIndex] || week2Content[0];
  }

  // Week 3-4: Advanced React & Next.js
  if (weekNum >= 3 && weekNum <= 4) {
    const advancedContent = {
      0: {
        title: `Frontend: Advanced React Patterns - Week ${weekNum} (90 min)`,
        topics: [
          "Custom hooks: creating reusable hooks",
          "useMemo and useCallback: performance optimization",
          "React.memo: preventing unnecessary re-renders",
          "Higher-order components (HOCs): component composition",
          "Render props pattern: sharing code between components",
          "Compound components: building complex components",
          "Error boundaries: catching component errors",
          "Portal: rendering outside component tree",
          "Refs: accessing DOM elements and component instances",
        ],
      },
      1: {
        title: `Frontend: Next.js Fundamentals - Week ${weekNum} (90 min)`,
        topics: [
          "Next.js: React framework for production",
          "Next.js vs Create React App: when to use each",
          "File-based routing: pages directory",
          "Server-side rendering (SSR): benefits and use cases",
          "Static site generation (SSG): pre-rendering pages",
          "API routes: creating backend endpoints in Next.js",
          "Image optimization: next/image component",
          "Link component: client-side navigation",
          "Metadata: SEO optimization with Head component",
        ],
      },
      2: {
        title: `Frontend: Next.js Data Fetching - Week ${weekNum} (90 min)`,
        topics: [
          "getServerSideProps: server-side data fetching",
          "getStaticProps: static data fetching",
          "getStaticPaths: dynamic routes with SSG",
          "Incremental Static Regeneration (ISR): updating static pages",
          "API routes: creating REST endpoints",
          "Middleware: request interception and modification",
          "Environment variables: managing secrets",
          "Data fetching patterns: when to use each method",
        ],
      },
      3: {
        title: `Frontend: State Management Libraries - Week ${weekNum} (90 min)`,
        topics: [
          "Redux: global state management",
          "Redux Toolkit: modern Redux development",
          "Zustand: lightweight state management",
          "Jotai: atomic state management",
          "When to use global state: state management decisions",
          "State normalization: organizing complex state",
          "State persistence: saving state to localStorage",
          "State debugging: Redux DevTools",
        ],
      },
      4: {
        title: `Frontend: Performance Optimization - Week ${weekNum} (90 min)`,
        topics: [
          "Code splitting: lazy loading components",
          "Bundle analysis: analyzing bundle size",
          "Image optimization: WebP, lazy loading, responsive images",
          "Memoization: useMemo, useCallback, React.memo",
          "Virtual scrolling: rendering large lists efficiently",
          "Debouncing and throttling: optimizing user interactions",
          "Web Vitals: Core Web Vitals metrics",
          "Performance monitoring: measuring and improving performance",
        ],
      },
      5: {
        title: `Frontend: Testing React Applications - Week ${weekNum} (90 min)`,
        topics: [
          "Testing: unit tests, integration tests, E2E tests",
          "Jest: JavaScript testing framework",
          "React Testing Library: testing React components",
          "Component testing: testing component behavior",
          "Mocking: mocking API calls, modules",
          "Snapshot testing: testing component output",
          "E2E testing: Cypress, Playwright",
          "Test coverage: achieving good test coverage",
        ],
      },
      6: {
        title: `Frontend: Week ${weekNum} Review & Transport App Integration (90 min)`,
        topics: [
          `Review Week ${weekNum} concepts`,
          "Transport App integration: integrating all features",
          "Performance optimization: final performance tuning",
          "Code review: comprehensive code review",
          "Documentation: documenting architecture and decisions",
          "Real-life practice: Complete Transport App frontend with all features",
        ],
      },
    };
    return advancedContent[dayIndex] || advancedContent[0];
  }

  // Week 5-13: Production Ready Frontend
  if (weekNum >= 5) {
    const productionContent = {
      0: {
        title: `Frontend: Production Architecture - Week ${weekNum} (90 min)`,
        topics: [
          "Component architecture: organizing components for scale",
          "Feature-based structure: organizing by features",
          "Design systems: building reusable component libraries",
          "TypeScript: type safety in React",
          "Storybook: component development and documentation",
          "Accessibility: WCAG guidelines, ARIA attributes",
          "SEO optimization: meta tags, structured data",
        ],
      },
      1: {
        title: `Frontend: Advanced Next.js - Week ${weekNum} (90 min)`,
        topics: [
          "App Router: Next.js 13+ routing system",
          "Server Components: React Server Components",
          "Streaming: streaming SSR and SSG",
          "Middleware: advanced middleware patterns",
          "Edge Functions: running code at the edge",
          "Internationalization: multi-language support",
          "Authentication: NextAuth.js, authentication patterns",
        ],
      },
      2: {
        title: `Frontend: Advanced State Management - Week ${weekNum} (90 min)`,
        topics: [
          "State management patterns: choosing the right solution",
          "Server state: React Query, SWR for server data",
          "Form state: React Hook Form, Formik",
          "URL state: managing state in URL",
          "State synchronization: syncing state across components",
          "State persistence: persisting state across sessions",
        ],
      },
      3: {
        title: `Frontend: Advanced Performance - Week ${weekNum} (90 min)`,
        topics: [
          "Bundle optimization: code splitting strategies",
          "Image optimization: advanced image techniques",
          "Caching strategies: browser caching, CDN caching",
          "Prefetching: prefetching routes and data",
          "Service Workers: offline support, PWA",
          "Performance budgets: setting and maintaining performance targets",
        ],
      },
      4: {
        title: `Frontend: Advanced Testing - Week ${weekNum} (90 min)`,
        topics: [
          "Integration testing: testing feature integration",
          "E2E testing: complete user flows",
          "Visual regression testing: detecting UI changes",
          "Accessibility testing: automated a11y testing",
          "Performance testing: testing app performance",
          "CI/CD integration: automated testing in CI/CD",
        ],
      },
      5: {
        title: `Frontend: Deployment & DevOps - Week ${weekNum} (90 min)`,
        topics: [
          "Deployment: Vercel, Netlify, AWS",
          "Environment configuration: managing environments",
          "CI/CD: automated deployment pipelines",
          "Monitoring: error tracking, performance monitoring",
          "Analytics: user analytics, performance analytics",
          "Security: security best practices, vulnerability scanning",
        ],
      },
      6: {
        title: `Frontend: Week ${weekNum} Review & Transport App Polish (90 min)`,
        topics: [
          `Review Week ${weekNum} concepts`,
          "Transport App polish: final UI/UX improvements",
          "Performance audit: comprehensive performance review",
          "Accessibility audit: ensuring WCAG compliance",
          "Code review: final code review",
          "Documentation: complete project documentation",
          "Real-life practice: Production-ready Transport App frontend",
        ],
      },
    };
    return productionContent[dayIndex] || productionContent[0];
  }

  // Fallback
  return {
    title: `Frontend: React/Next.js Learning - Week ${weekNum}, Day ${
      dayIndex + 1
    } (90 min)`,
    topics: [
      `Continue Frontend learning for Week ${weekNum}`,
      "Review previous concepts",
      "Practice building React/Next.js features",
      "Work on Transport App project",
    ],
  };
}

// Helper function to generate Backend learning content based on week and day
// Covers Node.js, Express, Databases, APIs progressively, sized for 90 minutes per day
function getBackendLearningContent(weekNum, dayIndex) {
  const dayNumber = (weekNum - 1) * 7 + dayIndex + 1;

  // Week 1: Node.js Fundamentals
  if (weekNum === 1) {
    const week1Content = {
      0: {
        title: "Backend: Node.js Fundamentals (90 min)",
        topics: [
          "Node.js basics: JavaScript runtime environment",
          "Node.js vs Browser JavaScript: differences and similarities",
          "Node.js modules: CommonJS (require/module.exports) vs ES6 modules",
          "Global objects in Node.js: process, global, __dirname, __filename",
          "File system operations: fs module basics",
          "Path operations: path module for file paths",
          "Environment variables: process.env",
          "NPM basics: package.json, installing packages",
          "Running Node.js scripts: node command",
          "Node.js REPL: interactive JavaScript environment",
        ],
      },
      1: {
        title: "Backend: Asynchronous JavaScript in Node.js (90 min)",
        topics: [
          "Callbacks: callback pattern, callback hell",
          "Promises: creating and consuming promises",
          "async/await: modern async syntax",
          "Error handling: try-catch with async/await",
          "Promise.all: running promises in parallel",
          "Promise.race: first promise to resolve",
          "Event Loop: understanding Node.js event loop",
          "setTimeout, setInterval: timers in Node.js",
          "Streams: readable, writable, transform streams",
        ],
      },
      2: {
        title: "Backend: HTTP & Web Servers (90 min)",
        topics: [
          "HTTP basics: requests, responses, methods (GET, POST, PUT, DELETE)",
          "HTTP status codes: 200, 201, 400, 404, 500, etc.",
          "HTTP headers: Content-Type, Authorization, etc.",
          "Creating HTTP server: http module",
          "Request and Response objects: handling requests",
          "URL parsing: parsing URLs and query strings",
          "REST API concepts: RESTful principles",
          "API design: designing RESTful APIs",
        ],
      },
      3: {
        title: "Backend: Express.js Fundamentals (90 min)",
        topics: [
          "Express.js: Node.js web framework",
          "Express setup: npm init, installing express",
          "Creating Express server: app.listen(), basic server setup",
          "API Routes: app.get(), app.post(), app.put(), app.delete()",
          "Route parameters: req.params",
          "Query parameters: req.query",
          "Request body: req.body, body-parser middleware",
          "Response methods: res.json(), res.send(), res.status()",
          "Creating RESTful endpoints: GET, POST, PUT, DELETE",
          "API endpoint structure: /api/users, /api/trips, etc.",
        ],
      },
      4: {
        title: "Backend: Express Middleware (90 min)",
        topics: [
          "Middleware concept: request processing pipeline",
          "Built-in middleware: express.json(), express.urlencoded()",
          "Custom middleware: creating your own middleware",
          "Middleware order: understanding execution order",
          "Error handling middleware: centralized error handling",
          "Request logging: morgan middleware",
          "CORS: enabling cross-origin requests",
          "Authentication middleware: protecting routes",
          "Validation middleware: validating request data",
        ],
      },
      5: {
        title: "Backend: Route Organization & Structure (90 min)",
        topics: [
          "Express Router: organizing routes",
          "Route modules: separating routes into files",
          "Route organization: /api/auth, /api/users, /api/trips",
          "Middleware: applying to specific routes",
          "Route versioning: /api/v1, /api/v2",
          "API documentation: documenting endpoints",
          "Route testing: testing API endpoints",
        ],
      },
      6: {
        title: "Backend: Week 1 Review & API Building (90 min)",
        topics: [
          "Review Node.js and Express concepts",
          "Review route organization and middleware",
          "Practice building complete API endpoints",
          "Review API endpoint creation",
          "Build API endpoints that support frontend features",
          "API testing: testing endpoints with Postman/Thunder Client",
        ],
      },
    };
    return week1Content[dayIndex] || week1Content[0];
  }

  // Week 2: Database & Authentication
  if (weekNum === 2) {
    const week2Content = {
      0: {
        title: "Backend: Database Setup & Connection (90 min)",
        topics: [
          "Database concepts: SQL vs NoSQL",
          "PostgreSQL setup: installing and configuring",
          "Database connection: connection pooling",
          "Environment variables: database credentials",
          "Database clients: pg (PostgreSQL) or Mongoose (MongoDB)",
          "Connection strings: format and security",
          "Database schemas: planning table structure",
          "Migrations: version controlling database changes",
          "Database tools: pgAdmin, MongoDB Compass",
          "Testing database connection: verifying setup",
        ],
      },
      1: {
        title: "Backend: SQL Fundamentals (90 min)",
        topics: [
          "SQL basics: SELECT, INSERT, UPDATE, DELETE",
          "WHERE clause: filtering data",
          "JOINs: INNER, LEFT, RIGHT, FULL OUTER joins",
          "Aggregate functions: COUNT, SUM, AVG, MAX, MIN",
          "GROUP BY: grouping data",
          "ORDER BY: sorting results",
          "LIMIT and OFFSET: pagination",
          "Subqueries: nested queries",
          "Indexes: improving query performance",
        ],
      },
      2: {
        title: "Backend: Database Queries in Node.js (90 min)",
        topics: [
          "Querying database: executing SQL queries",
          "Parameterized queries: preventing SQL injection",
          "Connection pooling: managing database connections",
          "Query results: handling query responses",
          "Error handling: database error handling",
          "Transactions: ensuring data consistency",
          "Prepared statements: optimizing repeated queries",
          "Query optimization: improving query performance",
        ],
      },
      3: {
        title: "Backend: Authentication & JWT (90 min)",
        topics: [
          "Authentication concepts: login, registration",
          "JWT (JSON Web Tokens): token-based auth",
          "Password hashing: bcrypt basics",
          "User registration endpoint: POST /api/auth/register",
          "User login endpoint: POST /api/auth/login",
          "Token generation: creating JWTs",
          "Token verification: middleware for protected routes",
          "Protected routes: requiring authentication",
          "User sessions: managing authenticated users",
          "Security best practices: password requirements, token expiration",
        ],
      },
      4: {
        title: "Backend: Data Validation & File Uploads (90 min)",
        topics: [
          "Input validation: validating request data",
          "Validation libraries: express-validator basics",
          "Validation rules: required, email, min, max",
          "Error responses: detailed validation errors",
          "File uploads: multer middleware",
          "File storage: saving uploaded files",
          "File validation: checking file types, sizes",
          "Sanitization: cleaning user input",
          "Validation middleware: reusable validation",
          "Error handling: comprehensive error responses",
        ],
      },
      5: {
        title: "Backend: API Design & Documentation (90 min)",
        topics: [
          "RESTful API design: REST principles",
          "API versioning: strategies, backward compatibility",
          "Response formatting: consistent JSON responses",
          "Error handling: consistent error format",
          "Status codes: proper HTTP status codes",
          "API documentation: OpenAPI, Swagger",
          "API testing: Postman collections, automated testing",
          "Rate limiting: protecting APIs from abuse",
        ],
      },
      6: {
        title: "Backend: Week 2 Review - Database Integration (90 min)",
        topics: [
          "Review database concepts and queries",
          "Review authentication and JWT",
          "Review API design and validation",
          "Practice building complete API with database",
          "Practice building authenticated endpoints",
          "Build API endpoints that support Transport App",
        ],
      },
    };
    return week2Content[dayIndex] || week2Content[0];
  }

  // Week 3-4: Advanced Backend
  if (weekNum >= 3 && weekNum <= 4) {
    const advancedContent = {
      0: {
        title: `Backend: Advanced Database - Week ${weekNum} (90 min)`,
        topics: [
          "Database relationships: one-to-one, one-to-many, many-to-many",
          "Complex queries: advanced SQL queries",
          "Database indexes: optimizing queries",
          "Database transactions: ACID properties",
          "Database migrations: managing schema changes",
          "ORM basics: Object-Relational Mapping concepts",
          "Query optimization: analyzing and improving queries",
        ],
      },
      1: {
        title: `Backend: API Architecture - Week ${weekNum} (90 min)`,
        topics: [
          "API architecture: layered architecture",
          "Service layer: separating business logic",
          "Repository pattern: data access abstraction",
          "Dependency injection: managing dependencies",
          "Error handling: centralized error handling",
          "Logging: structured logging",
          "API security: authentication, authorization, rate limiting",
        ],
      },
      2: {
        title: `Backend: WebSockets & Real-time - Week ${weekNum} (90 min)`,
        topics: [
          "WebSockets: real-time bidirectional communication",
          "Socket.io: WebSocket library for Node.js",
          "WebSocket vs REST: when to use each",
          "Real-time events: emitting and listening to events",
          "Room management: organizing WebSocket connections",
          "Authentication: securing WebSocket connections",
          "Real-time use cases: chat, notifications, live updates",
        ],
      },
      3: {
        title: `Backend: Caching & Performance - Week ${weekNum} (90 min)`,
        topics: [
          "Caching strategies: when and what to cache",
          "Redis: in-memory data store",
          "Cache invalidation: keeping cache fresh",
          "Response caching: caching API responses",
          "Database query caching: caching query results",
          "Performance optimization: improving API response times",
          "Load balancing: distributing requests",
        ],
      },
      4: {
        title: `Backend: Testing Backend APIs - Week ${weekNum} (90 min)`,
        topics: [
          "Unit testing: testing individual functions",
          "Integration testing: testing API endpoints",
          "Test frameworks: Jest, Mocha, Chai",
          "Mocking: mocking database, external services",
          "API testing: testing HTTP endpoints",
          "Test coverage: achieving good test coverage",
          "E2E testing: testing complete API flows",
        ],
      },
      5: {
        title: `Backend: Security Best Practices - Week ${weekNum} (90 min)`,
        topics: [
          "Security threats: common vulnerabilities",
          "SQL injection: preventing SQL injection attacks",
          "XSS: Cross-Site Scripting prevention",
          "CSRF: Cross-Site Request Forgery protection",
          "Input sanitization: cleaning user input",
          "HTTPS: securing API communication",
          "Security headers: setting security headers",
          "OAuth: third-party authentication",
        ],
      },
      6: {
        title: `Backend: Week ${weekNum} Review & Transport App API (90 min)`,
        topics: [
          `Review Week ${weekNum} concepts`,
          "Transport App API: building complete API",
          "API integration: integrating with frontend and mobile",
          "Performance optimization: API performance tuning",
          "Code review: comprehensive code review",
          "Documentation: API documentation",
          "Real-life practice: Production-ready Transport App API",
        ],
      },
    };
    return advancedContent[dayIndex] || advancedContent[0];
  }

  // Week 5-13: Production Ready Backend
  if (weekNum >= 5) {
    const productionContent = {
      0: {
        title: `Backend: Production Architecture - Week ${weekNum} (90 min)`,
        topics: [
          "Microservices: microservices architecture",
          "API Gateway: managing multiple services",
          "Message queues: RabbitMQ, Kafka",
          "Service communication: inter-service communication",
          "Containerization: Docker basics",
          "Orchestration: Kubernetes basics",
          "Cloud deployment: AWS, Azure, GCP",
        ],
      },
      1: {
        title: `Backend: Advanced Database - Week ${weekNum} (90 min)`,
        topics: [
          "Database scaling: horizontal vs vertical scaling",
          "Read replicas: improving read performance",
          "Database sharding: partitioning data",
          "NoSQL databases: MongoDB, Redis use cases",
          "Database design: advanced schema design",
          "Data modeling: modeling complex relationships",
        ],
      },
      2: {
        title: `Backend: Monitoring & Observability - Week ${weekNum} (90 min)`,
        topics: [
          "Logging: structured logging, log aggregation",
          "Monitoring: application performance monitoring",
          "Error tracking: Sentry, error tracking tools",
          "Metrics: collecting and analyzing metrics",
          "Alerting: setting up alerts",
          "Distributed tracing: tracing requests across services",
        ],
      },
      3: {
        title: `Backend: DevOps & CI/CD - Week ${weekNum} (90 min)`,
        topics: [
          "CI/CD: continuous integration and deployment",
          "GitHub Actions: automated workflows",
          "Docker: containerizing applications",
          "Deployment: deploying to production",
          "Environment management: managing environments",
          "Infrastructure as Code: Terraform, CloudFormation",
        ],
      },
      4: {
        title: `Backend: Advanced Security - Week ${weekNum} (90 min)`,
        topics: [
          "Authentication strategies: JWT, OAuth, session-based",
          "Authorization: role-based access control (RBAC)",
          "API security: API keys, rate limiting",
          "Data encryption: encrypting sensitive data",
          "Security auditing: security best practices",
          "Compliance: GDPR, data protection",
        ],
      },
      5: {
        title: `Backend: Performance & Scalability - Week ${weekNum} (90 min)`,
        topics: [
          "Performance optimization: optimizing API performance",
          "Scalability: horizontal and vertical scaling",
          "Load testing: testing under load",
          "Database optimization: query optimization",
          "Caching strategies: advanced caching",
          "CDN: content delivery networks",
        ],
      },
      6: {
        title: `Backend: Week ${weekNum} Review & Transport App API Polish (90 min)`,
        topics: [
          `Review Week ${weekNum} concepts`,
          "Transport App API polish: final API improvements",
          "Performance audit: comprehensive performance review",
          "Security audit: security review",
          "Code review: final code review",
          "Documentation: complete API documentation",
          "Real-life practice: Production-ready Transport App API",
        ],
      },
    };
    return productionContent[dayIndex] || productionContent[0];
  }

  // Fallback
  return {
    title: `Backend: Node.js/Express Learning - Week ${weekNum}, Day ${
      dayIndex + 1
    } (90 min)`,
    topics: [
      `Continue Backend learning for Week ${weekNum}`,
      "Review previous concepts",
      "Practice building APIs",
      "Work on Transport App project",
    ],
  };
}

// Helper function to generate WordPress learning content based on week and day
// Covers WordPress development progressively, sized for variable time blocks
function getWordPressLearningContent(weekNum, dayIndex) {
  const dayNumber = (weekNum - 1) * 7 + dayIndex + 1;

  // Week 1-2: WordPress Fundamentals
  if (weekNum <= 2) {
    const fundamentalsContent = {
      0: {
        title: "Systems Engineering: Introduction & Setup (150 min)",
        topics: [
          "WordPress: content management system (CMS)",
          "WordPress.com vs WordPress.org: differences",
          "Local development: XAMPP, Local by Flywheel, MAMP",
          "WordPress installation: installing WordPress locally",
          "WordPress dashboard: navigating WordPress admin",
          "WordPress file structure: understanding WordPress files",
          "Themes vs Plugins: understanding the difference",
          "WordPress database: understanding WordPress database structure",
          "WordPress loop: how WordPress displays content",
        ],
      },
      1: {
        title: "Systems Engineering: Theme Development Basics (150 min)",
        topics: [
          "Theme structure: understanding theme files",
          "Template hierarchy: how WordPress chooses templates",
          "Header, Footer, Sidebar: theme template files",
          "The Loop: displaying posts",
          "Template tags: WordPress template functions",
          "WordPress functions: wp_head(), wp_footer(), etc.",
          "Enqueue scripts and styles: properly loading assets",
          "Theme activation: theme setup functions",
        ],
      },
      2: {
        title: "Systems Engineering: Custom Post Types (150 min)",
        topics: [
          "Custom Post Types: creating custom content types",
          "Registering post types: register_post_type()",
          "Post type arguments: labels, supports, capabilities",
          "Custom taxonomies: organizing custom post types",
          "Meta boxes: adding custom fields",
          "Custom fields: storing additional data",
          "Displaying custom post types: querying and displaying",
          "Use case: Transport App service listings as custom post type",
        ],
      },
      3: {
        title: "Systems Engineering: Plugin Development Basics (150 min)",
        topics: [
          "Plugin structure: understanding plugin files",
          "Plugin header: plugin information",
          "Activation/Deactivation hooks: plugin lifecycle",
          "WordPress hooks: actions and filters",
          "add_action(): hooking into WordPress actions",
          "add_filter(): modifying WordPress data",
          "Plugin best practices: coding standards, security",
          "Use case: Transport App booking plugin",
        ],
      },
      4: {
        title: "Systems Engineering: User Roles & Permissions (150 min)",
        topics: [
          "WordPress user roles: Administrator, Editor, Author, etc.",
          "Capabilities: what users can do",
          "Custom user roles: creating custom roles",
          "User permissions: managing access",
          "Current user: checking user capabilities",
          "User meta: storing user data",
          "Use case: Transport App admin vs customer roles",
        ],
      },
      5: {
        title: "Systems Engineering: REST API (150 min)",
        topics: [
          "WordPress REST API: accessing WordPress via API",
          "REST API endpoints: /wp-json/wp/v2/",
          "Custom endpoints: creating custom REST endpoints",
          "Authentication: API authentication",
          "API requests: making requests to WordPress API",
          "Use case: Transport App consuming WordPress API for content",
        ],
      },
      6: {
        title: "Systems Engineering: Week 1-2 Review (150 min)",
        topics: [
          "Review WordPress fundamentals",
          "Review theme and plugin development",
          "Practice building custom theme",
          "Practice building custom plugin",
          "WordPress best practices review",
        ],
      },
    };
    return fundamentalsContent[dayIndex] || fundamentalsContent[0];
  }

  // Week 3-6: Advanced WordPress
  if (weekNum >= 3 && weekNum <= 6) {
    const advancedContent = {
      0: {
        title: `WordPress: Advanced Theme Development - Week ${weekNum} (150 min)`,
        topics: [
          "Child themes: extending parent themes",
          "Template parts: reusable template components",
          "Customizer API: theme customization options",
          "Widget areas: creating widget-ready areas",
          "Menu locations: registering menu locations",
          "Theme options: creating theme settings page",
          "Responsive themes: mobile-first theme development",
        ],
      },
      1: {
        title: `WordPress: Gutenberg Block Development - Week ${weekNum} (150 min)`,
        topics: [
          "Gutenberg: WordPress block editor",
          "Block development: creating custom blocks",
          "Block registration: registering custom blocks",
          "Block attributes: block data structure",
          "Block editor: React components in WordPress",
          "Block patterns: reusable block layouts",
          "Use case: Transport App booking block",
        ],
      },
      2: {
        title: `WordPress: Advanced Plugin Development - Week ${weekNum} (150 min)`,
        topics: [
          "Plugin architecture: organizing plugin code",
          "Database operations: custom database tables",
          "Cron jobs: scheduled tasks in WordPress",
          "AJAX: handling AJAX requests",
          "Admin pages: creating admin interface",
          "Settings API: WordPress settings framework",
          "Use case: Transport App admin dashboard plugin",
        ],
      },
      3: {
        title: `WordPress: Security & Performance - Week ${weekNum} (150 min)`,
        topics: [
          "WordPress security: common vulnerabilities",
          "Data sanitization: cleaning user input",
          "Nonces: preventing CSRF attacks",
          "Capability checks: checking user permissions",
          "Performance: optimizing WordPress",
          "Caching: WordPress caching strategies",
          "Database optimization: optimizing queries",
        ],
      },
      4: {
        title: `WordPress: Custom Fields & Meta Boxes - Week ${weekNum} (150 min)`,
        topics: [
          "Advanced Custom Fields (ACF): popular plugin",
          "Custom meta boxes: creating meta boxes",
          "Meta box API: WordPress meta box functions",
          "Saving meta data: storing custom fields",
          "Displaying meta data: showing custom fields",
          "Use case: Transport App service details as custom fields",
        ],
      },
      5: {
        title: `WordPress: API Integration - Week ${weekNum} (150 min)`,
        topics: [
          "WordPress REST API: advanced usage",
          "Custom endpoints: creating custom REST endpoints",
          "API authentication: securing API endpoints",
          "External APIs: consuming external APIs",
          "Webhooks: receiving webhook data",
          "Use case: Transport App syncing with WordPress CMS",
        ],
      },
      6: {
        title: `WordPress: Week ${weekNum} Review & Transport App CMS (150 min)`,
        topics: [
          `Review Week ${weekNum} concepts`,
          "Transport App CMS: building admin interface",
          "Content management: managing Transport App content",
          "Code review: WordPress code review",
          "Documentation: WordPress documentation",
          "Real-life practice: Complete Transport App WordPress admin",
        ],
      },
    };
    return advancedContent[dayIndex] || advancedContent[0];
  }

  // Week 7-13: Production WordPress
  if (weekNum >= 7) {
    const productionContent = {
      0: {
        title: `WordPress: Production Deployment - Week ${weekNum} (150 min)`,
        topics: [
          "WordPress hosting: choosing hosting provider",
          "Domain setup: configuring domain",
          "SSL certificates: securing WordPress site",
          "Database migration: moving WordPress database",
          "File migration: moving WordPress files",
          "WordPress multisite: managing multiple sites",
        ],
      },
      1: {
        title: `WordPress: Advanced Customization - Week ${weekNum} (150 min)`,
        topics: [
          "Custom post type UI: improving admin interface",
          "Custom admin pages: creating admin dashboards",
          "Dashboard widgets: customizing WordPress dashboard",
          "Admin columns: customizing list views",
          "Bulk actions: custom bulk operations",
          "Use case: Transport App admin dashboard customization",
        ],
      },
      2: {
        title: `WordPress: E-commerce Integration - Week ${weekNum} (150 min)`,
        topics: [
          "WooCommerce: WordPress e-commerce plugin",
          "WooCommerce hooks: customizing WooCommerce",
          "Payment gateways: integrating payment methods",
          "Product management: managing products",
          "Order management: handling orders",
          "Use case: Transport App payment integration via WordPress",
        ],
      },
      3: {
        title: `WordPress: Performance Optimization - Week ${weekNum} (150 min)`,
        topics: [
          "Caching plugins: WP Super Cache, W3 Total Cache",
          "CDN integration: Cloudflare, MaxCDN",
          "Image optimization: optimizing images",
          "Database optimization: optimizing WordPress database",
          "Query optimization: optimizing WordPress queries",
          "Performance monitoring: monitoring WordPress performance",
        ],
      },
      4: {
        title: `WordPress: Security Hardening - Week ${weekNum} (150 min)`,
        topics: [
          "Security plugins: Wordfence, Sucuri",
          "Firewall: protecting WordPress",
          "Malware scanning: scanning for malware",
          "Backup strategies: backing up WordPress",
          "Update management: keeping WordPress updated",
          "Security best practices: WordPress security checklist",
        ],
      },
      5: {
        title: `WordPress: Monetization & Marketplace - Week ${weekNum} (150 min)`,
        topics: [
          "Theme marketplace: selling themes",
          "Plugin marketplace: selling plugins",
          "Freelancing: WordPress freelancing",
          "Client management: managing WordPress clients",
          "Pricing strategies: pricing WordPress work",
          "Portfolio: building WordPress portfolio",
        ],
      },
      6: {
        title: `WordPress: Week ${weekNum} Review & Transport App CMS Polish (150 min)`,
        topics: [
          `Review Week ${weekNum} concepts`,
          "Transport App CMS polish: final CMS improvements",
          "Performance audit: WordPress performance review",
          "Security audit: WordPress security review",
          "Code review: final WordPress code review",
          "Documentation: complete WordPress documentation",
          "Real-life practice: Production-ready Transport App WordPress CMS",
        ],
      },
    };
    return productionContent[dayIndex] || productionContent[0];
  }

  // Fallback
  return {
    title: `Systems Engineering: Systems Engineering Learning - Week ${weekNum}, Day ${
      dayIndex + 1
    } (150 min)`,
    topics: [
      `Continue Systems Engineering learning for Week ${weekNum}`,
      "Review previous concepts",
      "Practice building WordPress themes/plugins",
      "Work on Transport App CMS project",
    ],
  };
}

// Helper function to generate Mobile learning content based on week and day
// Covers all README concepts progressively, sized for 120 minutes per day
function getMobileLearningContent(weekNum, dayIndex) {
  const dayNumber = (weekNum - 1) * 7 + dayIndex + 1;
  const isMonday = dayIndex === 0;
  const isSaturday = dayIndex === 5;

  // Helper function to get duration based on day
  // Monday: 90 min, Tuesday-Friday: 120 min, Saturday: 90 min (revision)
  const getDuration = () => {
    if (isMonday) return 90;
    if (isSaturday) return 90;
    return 120; // Tuesday-Friday
  };
  const duration = getDuration();

  // Week 1: React Native Fundamentals (Ground Up)
  if (weekNum === 1) {
    const week1Content = {
      0: {
        title: `Mobile: React Native Introduction & Setup (${duration} min)`,
        topics: [
          "What is React Native: cross-platform mobile development",
          "React Native vs native apps: when to use each",
          "React Native architecture: JavaScript bridge, native modules",
          "Development environment setup: Node.js, React Native CLI, Xcode (iOS), Android Studio",
          "Expo vs React Native CLI: choosing the right approach",
          "Creating your first React Native app: npx create-expo-app or npx react-native init",
          "Project structure: understanding folders (src, components, screens, navigation)",
          "Running on iOS simulator: xcode-select, simulator setup",
          "Running on Android emulator: Android Studio, AVD setup",
          "Hot reloading: Fast Refresh, live reloading",
          "Platform differences: iOS vs Android considerations",
          "React Native basics: View, Text, StyleSheet components",
          "Styling in React Native: StyleSheet.create(), inline styles, Flexbox",
          "Real-life analogy: Like learning to drive - understanding the car (React Native) before the road (complex features)",
        ],
      },
      1: {
        title: `Mobile: React Native Core Components & Styling (${duration} min)`,
        topics: [
          "React Native Core Components: View, Text, Image, ScrollView, TextInput, Button",
          "View component: container component (like div in web)",
          "Text component: displaying text (must wrap text in <Text>, not directly in <View>)",
          "StyleSheet API: StyleSheet.create() for performance optimization",
          "Flexbox in React Native: same as web but default flexDirection is column (not row)",
          "Layout basics: justifyContent, alignItems, alignSelf, flex",
          "Styling differences: no CSS classes, no CSS selectors, StyleSheet only",
          "Platform-specific styles: Platform.select() for iOS vs Android differences",
          "Dimensions API: getting screen width/height, responsive design",
          "SafeAreaView: handling notches and status bars",
          "TouchableOpacity, TouchableHighlight, Pressable: handling user interactions",
          "Image component: local images (require()) vs network images (uri)",
          "ScrollView: making content scrollable",
          "Real-life analogy: Like learning HTML/CSS but for mobile - same concepts, different implementation",
        ],
      },
      2: {
        title: `Mobile: React Native State Management & User Input (${duration} min)`,
        topics: [
          "useState hook: managing component state in React Native",
          "State updates: setState patterns, functional updates",
          "TextInput component: handling user text input",
          "Controlled components: TextInput with state",
          "Keyboard handling: KeyboardAvoidingView, keyboard dismissal",
          "Form handling: collecting user input, validation basics",
          "Button component: TouchableOpacity vs Button vs Pressable",
          "Event handling: onPress, onChange, onSubmit",
          "State patterns: lifting state up, sharing state between components",
          "Loading states: ActivityIndicator component",
          "Error states: displaying errors to users",
          "Platform-specific input: iOS vs Android keyboard differences",
          "Real-life analogy: Like a form in a restaurant - collecting orders (input) and showing status (state)",
        ],
      },
      3: {
        title: `Mobile: Lists, Images & Performance (${duration} min)`,
        topics: [
          "FlatList component: rendering lists efficiently (like restaurant menu)",
          "FlatList vs ScrollView: when to use each",
          "List performance: keyExtractor, getItemLayout, removeClippedSubviews",
          "Image optimization: caching, lazy loading, placeholder images",
          "Image component: local vs network images, resizeMode",
          "SectionList: grouped lists with headers",
          "VirtualizedList: understanding virtualization for performance",
          "List patterns: pull-to-refresh, infinite scroll basics",
          "Memory management: avoiding memory leaks in lists",
          "Performance tips: avoiding unnecessary re-renders",
          "Real-life analogy: Like a restaurant menu - efficiently showing many items (FlatList) vs showing everything at once (ScrollView)",
        ],
      },
      4: {
        title: `Mobile: Navigation Architecture (${duration} min)`,
        topics: [
          "React Navigation: industry-standard navigation library",
          "Navigation types: Stack, Tab, Drawer navigators",
          "Stack Navigator: screen navigation (like pages in a book)",
          "Tab Navigator: bottom tabs, top tabs",
          "Navigation setup: installing @react-navigation/native, @react-navigation/stack",
          "Screen components: creating multiple screens",
          "Navigation props: navigation.navigate(), navigation.goBack()",
          "Route parameters: passing data between screens",
          "Navigation options: headers, titles, buttons",
          "Deep linking basics: URL-based navigation",
          "Navigation state: understanding navigation state structure",
          "Real-life analogy: Like a restaurant with multiple rooms (screens) - navigation helps customers move between them",
        ],
      },
      5: {
        title: `Mobile: Project Structure & Architecture (${duration} min)`,
        topics: [
          "Mobile app architecture: UI Layer, Service Layer, Storage Layer (from README)",
          "Project structure: organizing code for scale (screens/, components/, services/, store/, utils/)",
          "Folder organization: feature-based vs type-based structure",
          "Component organization: reusable vs screen-specific components",
          "Service layer: separating business logic from UI",
          "Storage layer: AsyncStorage vs Secure Storage (Keychain)",
          "Platform differences: iOS vs Android, Platform.select()",
          "Native modules: when to use native code",
          "Error boundaries: catching crashes gracefully",
          "Code organization best practices: single responsibility, separation of concerns",
          "Real-life analogy: Like a restaurant - dining room (UI), kitchen (services), pantry (storage)",
        ],
      },
      6: {
        title: `Mobile: Week 1 Review & Building First Screen (${duration} min)`,
        topics: [
          "Review React Native fundamentals: components, state, styling",
          "Review navigation basics: Stack Navigator, screen navigation",
          "Review project structure: organizing mobile apps",
          "Build your first complete screen: Home screen with navigation",
          "Practice: Create a screen with TextInput, Button, and state",
          "Practice: Add navigation between two screens",
          "Identify knowledge gaps: what needs more practice?",
          "Code review: review your Week 1 code, identify improvements",
          'Real-life practice: Build a simple "Welcome" screen for Transport App',
        ],
      },
    };
    return week1Content[dayIndex] || week1Content[0];
  }

  // Week 2: API Integration & State Management
  if (weekNum === 2) {
    const week2Content = {
      0: {
        title: `Mobile: API Integration & Fetch (${duration} min)`,
        topics: [
          "Fetch API in React Native: making HTTP requests",
          "async/await: handling asynchronous operations",
          "API service layer: creating centralized API client",
          "REST API basics: GET, POST, PUT, DELETE requests",
          "Request headers: Content-Type, Authorization",
          "Response handling: parsing JSON, error handling",
          "Loading states: showing ActivityIndicator during API calls",
          "Error handling: try-catch, displaying errors to users",
          "API endpoint structure: understanding backend API structure",
          "Network debugging: using React Native Debugger, Flipper",
          "Real-life analogy: Like ordering food - sending request (fetch), waiting for response (async), getting food (data)",
        ],
      },
      1: {
        title: `Mobile: Secure Storage & Authentication (${duration} min)`,
        topics: [
          "Secure Storage: react-native-keychain for JWT tokens (from README)",
          "Keychain vs AsyncStorage: when to use each (security vs convenience)",
          "JWT tokens: understanding token-based authentication",
          "Token storage: storing tokens securely in Keychain",
          "Token retrieval: getting tokens from secure storage",
          "Authentication flow: login, token storage, authenticated requests",
          "Protected API calls: adding Authorization header with Bearer token",
          "Token expiration: handling expired tokens, refresh tokens basics",
          "AsyncStorage: for non-sensitive data (cached data, preferences)",
          "Security best practices: never store sensitive data in AsyncStorage",
          "Real-life analogy: Keychain = bank vault (secure), AsyncStorage = drawer (convenient but not secure)",
        ],
      },
      2: {
        title: `Mobile: State Management with Zustand/Redux (${duration} min)`,
        topics: [
          "State management: local state vs global state (from README)",
          "Zustand: lightweight state management library",
          "Zustand store: creating stores, actions, selectors",
          "Redux basics: store, actions, reducers (alternative to Zustand)",
          "When to use global state: sharing data across screens",
          "State patterns: trip state, user state, app state",
          "Offline queue: Redux Persist / AsyncStorage for offline support",
          "State persistence: saving state to AsyncStorage",
          "Real-time state: managing trip status, driver location",
          "State management best practices: keeping state normalized",
          "Real-life analogy: Like a whiteboard (Zustand/Redux) showing current order status that everyone can see and update",
        ],
      },
      3: {
        title: `Mobile: WebSockets vs REST API (${duration} min)`,
        topics: [
          "WebSockets vs REST: when to use each (from README)",
          "REST API: like sending letters (request-response pattern)",
          "WebSocket: like phone call (instant, two-way communication)",
          "Socket.io client: installing and connecting to WebSocket server",
          "WebSocket connection: establishing connection, authentication",
          "Real-time updates: receiving trip.accepted, driver.location events",
          "WebSocket events: socket.on(), socket.emit()",
          "Connection management: reconnection logic, connection state",
          "Battery optimization: WebSocket vs polling (REST every 5 seconds)",
          "Use cases: trip status updates, driver location, notifications",
          "Real-life analogy: REST = sending letters (slow), WebSocket = phone call (instant)",
        ],
      },
      4: {
        title: `Mobile: Error Handling & Validation (${duration} min)`,
        topics: [
          "Error boundaries: catching crashes gracefully (from README)",
          "Try-catch blocks: handling errors in async operations",
          "Error UI: displaying user-friendly error messages",
          "Network errors: handling offline, timeout, server errors",
          "Validation: client-side validation with Zod (from README)",
          "Zod schemas: defining data validation rules",
          "Form validation: validating user input before submission",
          "Error recovery: retry logic, fallback strategies",
          "Error logging: tracking errors for debugging",
          "Defensive programming: checking data before using it",
          "Real-life analogy: Like a safety net - catching errors before they crash the app",
        ],
      },
      5: {
        title: `Mobile: Offline-First Strategy (${duration} min)`,
        topics: [
          "Offline-first: app works without internet (from README)",
          "NetInfo: detecting network connectivity",
          "Offline queue: saving actions when offline, sending when online",
          "AsyncStorage: caching data for offline use",
          "Last known location: saving location when offline",
          "Request queue: queuing API requests when offline",
          "Sync mechanism: syncing queued requests when back online",
          "Offline indicators: showing user when offline",
          "Optimistic updates: updating UI before API response",
          "Conflict resolution: handling data conflicts when syncing",
          "Real-life analogy: Like writing a letter in a tunnel (offline), then mailing it when you reach a post office (online)",
        ],
      },
      6: {
        title: `Mobile: Week 2 Review & API Integration Practice (${duration} min)`,
        topics: [
          "Review API integration: fetch, authentication, secure storage",
          "Review state management: Zustand/Redux patterns",
          "Review WebSockets: real-time communication",
          "Practice: Build login screen with Keychain token storage",
          "Practice: Create API service layer with error handling",
          "Practice: Implement offline queue with AsyncStorage",
          "Code review: review Week 2 code, identify improvements",
          "Real-life practice: Build authentication flow for Transport App",
        ],
      },
    };
    return week2Content[dayIndex] || week2Content[0];
  }

  // Week 3-4: Location Services & Maps
  if (weekNum >= 3 && weekNum <= 4) {
    const locationContent = {
      0: {
        title: `Mobile: Location Services Introduction (${duration} min)`,
        topics: [
          "Location services: getting user location (from README)",
          "expo-location: installing and setting up location services",
          "Location permissions: requesting location access",
          "Permission flow: handling permission requests, denials",
          "getCurrentPosition: getting one-time location",
          "watchPosition: tracking location continuously",
          "Location accuracy: GPS vs network location",
          "Location data: latitude, longitude, accuracy, timestamp",
          "Error handling: handling location errors, permission denials",
          "Platform differences: iOS vs Android location APIs",
          "Real-life analogy: Like GPS in your car - works even when app is closed (background location)",
        ],
      },
      1: {
        title: `Mobile: Battery Optimization for Location (${duration} min)`,
        topics: [
          "Battery drain: location tracking uses GPS (from README)",
          "Distance filter: only update when moved significant distance",
          "Significant location changes: iOS/Android optimization",
          "Update frequency: balancing accuracy vs battery life",
          "Background location: when and how to use",
          "Location accuracy tradeoffs: high accuracy vs battery",
          "Battery monitoring: tracking battery usage",
          "Optimization strategies: reduce update frequency, use significant changes",
          "Real-life fix: Only update when moved 50+ meters, not every second",
          "Performance monitoring: using React Native Performance Monitor",
          "Real-life analogy: Like a car GPS that updates less when stationary - saves battery",
        ],
      },
      2: {
        title: `Mobile: React Native Maps Setup (${duration} min)`,
        topics: [
          "react-native-maps: installing and configuring maps",
          "MapView component: displaying maps in React Native",
          "Map providers: Google Maps, Apple Maps, Mapbox",
          "API keys: setting up Google Maps API key",
          "Map configuration: initial region, map type",
          "Map markers: displaying points on map",
          "Map interactions: onPress, onRegionChange",
          "Map styling: custom map styles, themes",
          "Platform setup: iOS and Android configuration",
          "Map performance: optimizing map rendering",
          "Real-life analogy: Like a restaurant map showing nearby locations",
        ],
      },
      3: {
        title: `Mobile: Map Markers & User Location (${duration} min)`,
        topics: [
          "Map markers: displaying vehicles, pickup/dropoff points",
          "Custom markers: custom marker images, colors",
          "Marker clustering: grouping nearby markers",
          "User location: showing current user position on map",
          "Location marker: custom marker for user location",
          "Map camera: following user location",
          "Map bounds: setting map boundaries",
          "Marker interactions: onPress, showing info windows",
          "Map animations: smooth camera movements",
          "Real-life practice: Add user location and nearby vehicles to Transport App map",
        ],
      },
      4: {
        title: `Mobile: Route Display & Polylines (${duration} min)`,
        topics: [
          "Route display: showing routes on map (from README)",
          "Polyline component: drawing routes on map",
          "Route coordinates: converting route data to coordinates",
          "Polyline styling: colors, width, patterns",
          "Route optimization: simplifying polylines for performance",
          "Multiple routes: displaying alternative routes",
          "Route selection: allowing user to choose route",
          "Map camera: following route, zoom levels",
          "Route animation: animating route display",
          "Performance: optimizing polyline rendering",
          "Real-life practice: Display route from pickup to dropoff on Transport App map",
        ],
      },
      5: {
        title: `Mobile: Background Location & Permissions (${duration} min)`,
        topics: [
          "Background location: tracking location when app closed",
          'Permission types: "While Using App" vs "Always"',
          "Apple requirements: clear justification for background location",
          "Info.plist: configuring location permission descriptions",
          "Permission requests: smart permission flow",
          "User-facing explanations: why location is needed",
          "Permission handling: checking, requesting, handling denials",
          "Background tasks: setting up background location updates",
          "Battery considerations: background location impact",
          "Real-life scenario: Handling Apple rejection for background location (from README)",
        ],
      },
      6: {
        title: `Mobile: Location Services Review & Practice (${duration} min)`,
        topics: [
          "Review location services: permissions, tracking, optimization",
          "Review maps: MapView, markers, polylines",
          "Review battery optimization: distance filters, significant changes",
          "Practice: Build location tracking with battery optimization",
          "Practice: Create map with user location and nearby vehicles",
          "Practice: Display route with polyline on map",
          "Code review: review location and map code",
          "Real-life practice: Complete location and map features for Transport App",
        ],
      },
    };
    return locationContent[dayIndex] || locationContent[0];
  }

  // Week 5-6: Advanced Features
  if (weekNum >= 5 && weekNum <= 6) {
    const advancedContent = {
      0: {
        title: `Mobile: Push Notifications (${duration} min)`,
        topics: [
          "Push notifications: FCM (Android) and APNS (iOS)",
          "Notification setup: configuring push notification services",
          "Notification permissions: requesting notification access",
          "Notification handling: receiving and displaying notifications",
          "Notification types: local vs remote notifications",
          "Notification actions: handling notification taps",
          "Background notifications: handling notifications when app closed",
          "Notification payload: understanding notification data",
          'Real-life use: "Driver accepted your trip" notifications',
        ],
      },
      1: {
        title: `Mobile: CodePush for OTA Updates (${duration} min)`,
        topics: [
          "CodePush: Over-The-Air updates (from README)",
          "CodePush vs App Store: instant updates vs app store approval",
          "CodePush setup: installing and configuring CodePush",
          "Deploying updates: pushing updates to users",
          "Update strategies: immediate, on next restart, on next resume",
          "Rollback: handling failed updates",
          "Use cases: fixing critical bugs, updating business logic",
          "Limitations: what can and cannot be updated via CodePush",
          "Real-life scenario: Emergency permission change via CodePush (from README)",
        ],
      },
      2: {
        title: `Mobile: Performance Optimization (${duration} min)`,
        topics: [
          "Performance monitoring: React Native Performance Monitor",
          "List optimization: FlatList best practices",
          "Image optimization: caching, lazy loading",
          "Bundle size: reducing app bundle size",
          "Memory management: avoiding memory leaks",
          "Re-render optimization: React.memo, useMemo, useCallback",
          "Network optimization: request batching, caching",
          "Animation performance: using native driver",
          "Profiling: identifying performance bottlenecks",
        ],
      },
      3: {
        title: `Mobile: Testing Basics (${duration} min)`,
        topics: [
          "Testing: unit tests, integration tests, E2E tests (from README)",
          "Jest: React Native testing framework",
          "Unit tests: testing functions, components",
          "Component testing: testing React Native components",
          "Mocking: mocking API calls, native modules",
          "Snapshot testing: testing component output",
          "E2E testing: Detox for end-to-end testing",
          "Test structure: organizing tests, test files",
          "Real-life practice: Write tests for trip request validation",
        ],
      },
      4: {
        title: `Mobile: Validation with Zod (${duration} min)`,
        topics: [
          "Zod: schema validation library (from README)",
          "Zod schemas: defining validation rules",
          "Trip request validation: validating pickup/dropoff locations",
          "Form validation: validating user input",
          "API response validation: validating API responses",
          "Error messages: displaying validation errors",
          "Custom validation: business rules (e.g., inter_city trips need 3+ min lead time)",
          "Type safety: TypeScript integration with Zod",
          "Real-life practice: Implement trip request validation from README code challenge",
        ],
      },
      5: {
        title: `Mobile: Error Boundaries & Crash Handling (${duration} min)`,
        topics: [
          "Error boundaries: catching component errors (from README)",
          "Error boundary component: creating error boundary",
          "Crash reporting: Sentry, Crashlytics",
          "Error logging: tracking errors for debugging",
          "User-friendly errors: displaying errors to users",
          "Error recovery: allowing users to recover from errors",
          "Defensive programming: validating data before use",
          "WebSocket payload validation: handling unexpected payloads (from README)",
          "Real-life scenario: Handling WebSocket payload changes causing crashes",
        ],
      },
      6: {
        title: `Mobile: Week 5-6 Review & Advanced Features Practice (${duration} min)`,
        topics: [
          "Review push notifications, CodePush, performance optimization",
          "Review testing and validation",
          "Practice: Implement push notifications for trip updates",
          "Practice: Set up CodePush for OTA updates",
          "Practice: Write tests for key features",
          "Code review: review advanced features code",
          "Real-life practice: Complete advanced features for Transport App",
        ],
      },
    };
    return advancedContent[dayIndex] || advancedContent[0];
  }

  // Week 7-13: Production Readiness & Advanced Topics
  if (weekNum >= 7) {
    const productionContent = {
      0: {
        title: `Mobile: Production Readiness - Week ${weekNum} (${duration} min)`,
        topics: [
          "App store preparation: preparing for iOS App Store and Google Play",
          "App icons and splash screens: creating app assets",
          "App signing: iOS certificates, Android keystores",
          "Version management: semantic versioning",
          "Release notes: writing user-friendly release notes",
          "Beta testing: TestFlight (iOS), Internal Testing (Android)",
          "App store optimization: keywords, descriptions, screenshots",
        ],
      },
      1: {
        title: `Mobile: Advanced State Management - Week ${weekNum} (${duration} min)`,
        topics: [
          "Advanced Zustand patterns: middleware, persistence",
          "State normalization: organizing complex state",
          "State selectors: optimizing re-renders",
          "State debugging: Redux DevTools integration",
          "State migration: handling state schema changes",
          "Real-time state sync: syncing state across devices",
        ],
      },
      2: {
        title: `Mobile: Advanced Navigation - Week ${weekNum} (${duration} min)`,
        topics: [
          "Deep linking: handling URLs, universal links",
          "Navigation state persistence: saving navigation state",
          "Custom transitions: custom screen transitions",
          "Navigation guards: authentication guards, permission checks",
          "Nested navigators: complex navigation structures",
          "Navigation analytics: tracking user navigation",
        ],
      },
      3: {
        title: `Mobile: Advanced API Patterns - Week ${weekNum} (${duration} min)`,
        topics: [
          "API client architecture: request/response interceptors",
          "Request retry logic: exponential backoff",
          "Request cancellation: canceling in-flight requests",
          "Response caching: caching API responses",
          "Request queuing: managing request queue",
          "API versioning: handling API version changes",
        ],
      },
      4: {
        title: `Mobile: Advanced Performance - Week ${weekNum} (${duration} min)`,
        topics: [
          "Memory profiling: identifying memory leaks",
          "Network profiling: optimizing network requests",
          "Image optimization: advanced image caching strategies",
          "Code splitting: lazy loading screens",
          "Bundle analysis: analyzing bundle size",
          "Performance budgets: setting performance targets",
        ],
      },
      5: {
        title: `Mobile: Advanced Testing - Week ${weekNum} (${duration} min)`,
        topics: [
          "Integration testing: testing feature integration",
          "E2E testing: complete user flows with Detox",
          "Mock strategies: mocking external dependencies",
          "Test coverage: achieving good test coverage",
          "CI/CD integration: automated testing in CI/CD",
          "Performance testing: testing app performance",
        ],
      },
      6: {
        title: `Mobile: Week ${weekNum} Review & Transport App Integration (${duration} min)`,
        topics: [
          `Review Week ${weekNum} concepts`,
          "Transport App integration: integrating all features",
          "End-to-end testing: testing complete user flows",
          "Performance optimization: final performance tuning",
          "Code review: comprehensive code review",
          "Documentation: documenting architecture and decisions",
          "Real-life practice: Complete Transport App with all features",
        ],
      },
    };
    return productionContent[dayIndex] || productionContent[0];
  }

  // Fallback
  return {
    title: `Mobile: React Native Learning - Week ${weekNum}, Day ${
      dayIndex + 1
    } (${duration} min)`,
    topics: [
      `Continue React Native learning for Week ${weekNum}`,
      "Review previous concepts",
      "Practice building mobile features",
      "Work on Transport App project",
    ],
  };
}

function getDisciplineContent(
  content,
  discipline,
  weekNum,
  type,
  dayIndex = 0,
  dayNumber = null
) {
  const weekTheme = getSoftwareEngineeringTheme(weekNum);

  // Handle discipline-specific content using helper functions
  const dayIdx = content?.dayIndex !== undefined ? content.dayIndex : dayIndex;
  
  // Calculate dayNumber if not provided (weekNum * 7 - 7 + dayIndex + 1)
  const calculatedDayNumber = dayNumber || ((weekNum - 1) * 7 + dayIndex + 1);

  if (discipline === "Mobile") {
    const mobileContent = getMobileLearningContent(weekNum, dayIdx);
    return {
      title: mobileContent.title,
      topics: mobileContent.topics || [],
      type: "study",
      discipline: "Mobile",
      resources: getDisciplineResources("Mobile", weekNum, null, calculatedDayNumber, dayIdx),
      roadmap: getDisciplineRoadmap("Mobile"),
      syncedWith: "Backend",
      syncedContent: null,
    };
  }

  if (discipline === "Frontend") {
    // Check if content has frontend property (from synced structure), otherwise use helper
    if (
      content?.frontend &&
      content.frontend.topics &&
      content.frontend.topics.length > 0
    ) {
      return {
        title:
          content.frontend.title || content.title || `${discipline} Learning`,
        topics: content.frontend.topics || [],
        type: "study",
        discipline: discipline,
        resources: getDisciplineResources(discipline, weekNum, null, calculatedDayNumber, dayIdx),
        roadmap: getDisciplineRoadmap(discipline),
        syncedWith: "Backend",
        syncedContent: content.backend || null,
      };
    }
    // Use helper function for comprehensive Frontend content
    const frontendContent = getFrontendLearningContent(weekNum, dayIdx);
    return {
      title: frontendContent.title,
      topics: frontendContent.topics || [],
      type: "study",
      discipline: "Frontend",
      resources: getDisciplineResources("Frontend", weekNum, null, calculatedDayNumber, dayIdx),
      roadmap: getDisciplineRoadmap("Frontend"),
      syncedWith: "Backend",
      syncedContent: null,
    };
  }

  if (discipline === "Backend") {
    // Check if content has backend property (from synced structure), otherwise use helper
    if (
      content?.backend &&
      content.backend.topics &&
      content.backend.topics.length > 0
    ) {
      return {
        title:
          content.backend.title || content.title || `${discipline} Learning`,
        topics: content.backend.topics || [],
        type: "study",
        discipline: discipline,
        resources: getDisciplineResources(discipline, weekNum, null, calculatedDayNumber, dayIdx),
        roadmap: getDisciplineRoadmap(discipline),
        syncedWith: "Frontend",
        syncedContent: content.frontend || null,
      };
    }
    // Use helper function for comprehensive Backend content
    const backendContent = getBackendLearningContent(weekNum, dayIdx);
    return {
      title: backendContent.title,
      topics: backendContent.topics || [],
      type: "study",
      discipline: "Backend",
      resources: getDisciplineResources("Backend", weekNum, null, calculatedDayNumber, dayIdx),
      roadmap: getDisciplineRoadmap("Backend"),
      syncedWith: "Frontend",
      syncedContent: null,
    };
  }

  if (discipline === "Systems Engineering") {
    // Use helper function for comprehensive Systems Engineering content
    const systemsEngineeringContent = getWordPressLearningContent(
      weekNum,
      dayIdx
    );
    return {
      title: systemsEngineeringContent.title,
      topics: systemsEngineeringContent.topics || [],
      type: "study",
      discipline: "Systems Engineering",
      resources: getDisciplineResources("Systems Engineering", weekNum, null, calculatedDayNumber, dayIdx),
      roadmap: getDisciplineRoadmap("Systems Engineering"),
      syncedWith: "Frontend",
      syncedContent: null,
    };
  }

  // NEW: Handle synced frontend/backend structure (legacy support)
  if (content.frontend && content.backend) {
    // Content has synced frontend/backend structure
    if (discipline === "Frontend" && content.frontend) {
      return {
        title:
          content.frontend.title || content.title || `${discipline} Learning`,
        topics: content.frontend.topics || [],
        type: "study",
        discipline: discipline,
        resources: getDisciplineResources(discipline, weekNum, null, calculatedDayNumber, dayIdx),
        roadmap: getDisciplineRoadmap(discipline),
        syncedWith: "Backend",
        syncedContent: content.backend,
      };
    }
    if (discipline === "Backend" && content.backend) {
      return {
        title:
          content.backend.title || content.title || `${discipline} Learning`,
        topics: content.backend.topics || [],
        type: "study",
        discipline: discipline,
        resources: getDisciplineResources(discipline, weekNum, null, calculatedDayNumber, dayIdx),
        roadmap: getDisciplineRoadmap(discipline),
        syncedWith: "Frontend",
        syncedContent: content.frontend,
      };
    }
  }

  // Legacy: Handle old structure with topics array
  const contentTitle = content.title || "";
  const contentLower = (contentTitle + " " + weekTheme).toLowerCase();

  // Determine if content matches discipline
  const frontendMatch = [
    "html",
    "css",
    "tailwind",
    "react",
    "next.js",
    "frontend",
    "dom",
  ].some((k) => contentLower.includes(k));
  const backendMatch = [
    "node.js",
    "express",
    "database",
    "backend",
    "api",
    "server",
  ].some((k) => contentLower.includes(k));
  const mobileMatch = ["react native", "mobile", "expo", "ios", "android"].some(
    (k) => contentLower.includes(k)
  );
  const wordpressMatch = ["wordpress", "theme", "plugin", "cms"].some((k) =>
    contentLower.includes(k)
  );

  let matchesDiscipline = false;
  if (discipline === "Frontend" && frontendMatch) matchesDiscipline = true;
  if (discipline === "Backend" && backendMatch) matchesDiscipline = true;
  if (discipline === "Mobile" && mobileMatch) matchesDiscipline = true;
  if (discipline === "WordPress" && wordpressMatch) matchesDiscipline = true;

  // Calculate dayNumber for resources (weekNum * 7 - 7 + dayIndex + 1)
  const resourceDayNumber = (weekNum - 1) * 7 + dayIndex + 1;
  
  // Get discipline-specific resources (day-specific)
  const resources = getDisciplineResources(discipline, weekNum, null, resourceDayNumber, dayIndex);
  const roadmap = getDisciplineRoadmap(discipline);

  // If content matches discipline, return it
  if (matchesDiscipline && content.topics) {
    return {
      title: content.title || `${discipline} Learning - ${weekTheme}`,
      topics: content.topics || [],
      type: "study",
      discipline: discipline,
      resources: resources,
      roadmap: roadmap,
    };
  }

  // If content doesn't match discipline, create discipline-appropriate placeholder
  if (!matchesDiscipline) {
    if (type === "study") {
      return {
        title: `${discipline} Learning - ${weekTheme}`,
        topics: [`Continue ${discipline} studies from existing curriculum`],
        type: "study",
        discipline: discipline,
        resources: resources,
        roadmap: roadmap,
        note: "Content mapped from existing curriculum",
      };
    } else {
      return {
        title: `${discipline} Project - ${weekTheme}`,
        description: `Build ${discipline.toLowerCase()} project based on current week's theme`,
        requirements: [`Apply ${discipline} concepts from existing curriculum`],
        type: "build",
        discipline: discipline,
        resources: resources,
        roadmap: roadmap,
        note: "Project mapped from existing curriculum",
      };
    }
  }

  // Return original content if it matches, enhanced with resources and roadmap
  return {
    ...content,
    type: type,
    discipline: discipline,
    resources: resources,
    roadmap: roadmap,
  };
}

// Scheduling and Discipline Rotation Helpers
// Updated schedule (February 2026) - Final Schedule
// Schedule Structure:
// - Software Engineering: Mobile (Mon-Wed, 9:30pm-11:00pm), Frontend (Thu 9:30pm-11:30pm, Fri 8:30pm-10:00pm)
// - Body Transformation: Mon-Fri, 5:00 AM - 5:30 AM
// - Dual Branding: Mon-Fri, 6:30 AM - 7:30 AM; Sunday, 3:00 AM - 4:00 AM
// - Reading: Bible (Mon-Fri, 6:00-6:30 AM; Sun, 6:00-6:30 AM; Sat, 7:30-8:00 AM), E-Book (Mon-Wed, 5:00-6:00 PM; Sat, 5:00-6:00 PM), Physical (Thu-Fri, 5:00-6:00 PM; Sun, 3:00-4:00 PM)
// - Writing: Mon-Fri, 4:00 PM - 5:00 PM; Sat, 4:00 PM - 5:00 PM
function getTimeBlocks(dayIndex) {
  const isSaturday = dayIndex === 5;
  const isSunday = dayIndex === 6;
  const isMonday = dayIndex === 0; // Monday (0=Monday)
  const isTuesday = dayIndex === 1; // Tuesday
  const isWednesday = dayIndex === 2; // Wednesday
  const isThursday = dayIndex === 3; // Thursday
  const isFriday = dayIndex === 4; // Friday
  const isMondayToWednesday = dayIndex >= 0 && dayIndex <= 2; // Monday-Wednesday

  // Saturday and Sunday: No Software Engineering sessions
  if (isSaturday || isSunday) {
    return {
      deepLearning: [],
      focusedImplementation: [],
    };
  }

  if (isMondayToWednesday) {
    // Monday-Wednesday: Mobile Engineering (9:30 PM - 11:00 PM)
    return {
      deepLearning: [
        {
          time: "9:30 PM - 11:00 PM",
          discipline: "Mobile",
          type: "study",
          duration: "90 min",
          isRevision: false,
        },
      ],
      focusedImplementation: [],
    };
  }

  if (isThursday) {
    // Thursday: Frontend Engineering (9:30 PM - 11:30 PM)
    return {
      deepLearning: [
        {
          time: "9:30 PM - 11:30 PM",
          discipline: "Frontend",
          type: "study",
          duration: "120 min",
          isRevision: false,
        },
      ],
      focusedImplementation: [],
    };
  }

  if (isFriday) {
    // Friday: Frontend Engineering (8:30 PM - 10:00 PM)
    return {
      deepLearning: [
        {
          time: "8:30 PM - 10:00 PM",
          discipline: "Frontend",
          type: "study",
          duration: "90 min",
          isRevision: false,
        },
      ],
      focusedImplementation: [],
    };
  }

  // Fallback (should not reach here)
  return {
    deepLearning: [],
    focusedImplementation: [],
  };
}

// Helper functions for other journeys - Time Blocks
function getBodyTransformationTimeBlocks(dayIndex) {
  const isWeekday = dayIndex >= 0 && dayIndex <= 4; // Monday-Friday
  const isSaturday = dayIndex === 5;
  const isSunday = dayIndex === 6;
  
  if (isWeekday) {
    // Monday-Friday: 5:00-5:30 AM
    return {
      deepLearning: [{
        time: "5:00 AM - 5:30 AM",
        type: "workout",
        duration: "30 min",
        isRevision: false,
      }],
      focusedImplementation: [],
    };
  }
  
  // Weekend: Rest/Recovery
  return {
    deepLearning: [],
    focusedImplementation: [],
  };
}

function getReadingTimeBlocks(dayIndex) {
  const isWeekday = dayIndex >= 0 && dayIndex <= 4; // Monday-Friday
  const isSaturday = dayIndex === 5;
  const isSunday = dayIndex === 6;
  const isMondayToWednesday = dayIndex >= 0 && dayIndex <= 2; // Monday-Wednesday
  const isThursdayToFriday = dayIndex >= 3 && dayIndex <= 4; // Thursday-Friday
  
  const blocks = {
    deepLearning: [],
    focusedImplementation: [],
  };
  
  // Bible: 6:00-6:30 AM (Mon-Fri), 7:30-8:00 AM (Sat), 6:00-6:30 AM (Sun)
  if (isWeekday || isSunday) {
    blocks.deepLearning.push({
      time: "6:00 AM - 6:30 AM",
      type: "bible",
      duration: "30 min",
      isRevision: false,
    });
  } else if (isSaturday) {
    blocks.deepLearning.push({
      time: "7:30 AM - 8:00 AM",
      type: "bible",
      duration: "30 min",
      isRevision: false,
    });
  }
  
  // E-Book: 5:00-6:00 PM (Mon-Wed, Sat)
  if (isMondayToWednesday || isSaturday) {
    blocks.focusedImplementation.push({
      time: "5:00 PM - 6:00 PM",
      type: "ebook",
      duration: "60 min",
      isRevision: false,
    });
  }
  
  // Physical Book: 5:00-6:00 PM (Thu-Fri), 3:00-4:00 PM (Sun)
  if (isThursdayToFriday) {
    blocks.focusedImplementation.push({
      time: "5:00 PM - 6:00 PM",
      type: "physical",
      duration: "60 min",
      isRevision: false,
    });
  } else if (isSunday) {
    blocks.focusedImplementation.push({
      time: "3:00 PM - 4:00 PM",
      type: "physical",
      duration: "60 min",
      isRevision: false,
    });
  }
  
  return blocks;
}

function getDualBrandTimeBlocks(dayIndex) {
  const isWeekday = dayIndex >= 0 && dayIndex <= 4; // Monday-Friday
  const isSunday = dayIndex === 6;
  
  if (isWeekday) {
    // Mon-Fri: 6:30-7:30 AM
    return {
      deepLearning: [{
        time: "6:30 AM - 7:30 AM",
        type: "brand-building",
        duration: "60 min",
        isRevision: false,
      }],
      focusedImplementation: [],
    };
  } else if (isSunday) {
    // Sunday: 3:00-4:00 AM (Planning & Automation)
    return {
      deepLearning: [{
        time: "3:00 AM - 4:00 AM",
        type: "brand-building",
        duration: "60 min",
        isRevision: false,
      }],
      focusedImplementation: [],
    };
  }
  
  // Saturday: Rest
  return {
    deepLearning: [],
    focusedImplementation: [],
  };
}

function getWritersTimeBlocks(dayIndex) {
  const isWeekday = dayIndex >= 0 && dayIndex <= 4; // Monday-Friday
  const isSaturday = dayIndex === 5;
  
  if (isWeekday || isSaturday) {
    // Mon-Fri: 4:00-5:00 PM, Sat: 4:00-5:00 PM
    return {
      deepLearning: [{
        time: "4:00 PM - 5:00 PM",
        type: "writing",
        duration: "60 min",
        isRevision: false,
      }],
      focusedImplementation: [],
    };
  }
  
  // Sunday: Rest
  return {
    deepLearning: [],
    focusedImplementation: [],
  };
}

// Helper functions to organize content by schedule for each journey
function organizeBodyTransformationSchedule(learningData, projectData, dayIndex, timeBlocks, dayNumber) {
  if (!timeBlocks || !timeBlocks.deepLearning || timeBlocks.deepLearning.length === 0) {
    return null;
  }
  
  return {
    deepLearning: timeBlocks.deepLearning.map(block => ({
      ...block,
      content: {
        title: learningData?.title || "Workout Session",
        description: learningData?.description || "Complete your workout routine",
        type: "workout",
      },
    })),
    focusedImplementation: [],
  };
}

function organizeReadingSchedule(readingSessions, dayIndex, timeBlocks, dayNumber) {
  if (!timeBlocks || (!timeBlocks.deepLearning && !timeBlocks.focusedImplementation)) {
    return null;
  }
  
  const scheduled = {
    deepLearning: [],
    focusedImplementation: [],
  };
  
  // Map reading sessions to time blocks
  if (timeBlocks.deepLearning && timeBlocks.deepLearning.length > 0) {
    timeBlocks.deepLearning.forEach((block, idx) => {
      const session = readingSessions && readingSessions[idx] ? readingSessions[idx] : null;
      scheduled.deepLearning.push({
        ...block,
        content: session ? {
          type: session.type,
          material: session.material,
          duration: block.duration,
        } : null,
      });
    });
  }
  
  if (timeBlocks.focusedImplementation && timeBlocks.focusedImplementation.length > 0) {
    timeBlocks.focusedImplementation.forEach((block, idx) => {
      const session = readingSessions && readingSessions[timeBlocks.deepLearning.length + idx] ? readingSessions[timeBlocks.deepLearning.length + idx] : null;
      scheduled.focusedImplementation.push({
        ...block,
        content: session ? {
          type: session.type,
          material: session.material,
          duration: block.duration,
        } : null,
      });
    });
  }
  
  return scheduled;
}

function organizeDualBrandSchedule(learningData, projectData, dayIndex, timeBlocks, dayNumber) {
  if (!timeBlocks || !timeBlocks.deepLearning || timeBlocks.deepLearning.length === 0) {
    return null;
  }
  
  return {
    deepLearning: timeBlocks.deepLearning.map(block => ({
      ...block,
      content: {
        title: learningData?.title || "Brand Building",
        description: learningData?.description || "Work on brand tasks",
        type: "brand-building",
      },
    })),
    focusedImplementation: [],
  };
}

function organizeWritersSchedule(learningData, projectData, dayIndex, timeBlocks, dayNumber) {
  if (!timeBlocks || !timeBlocks.deepLearning || timeBlocks.deepLearning.length === 0) {
    return null;
  }
  
  return {
    deepLearning: timeBlocks.deepLearning.map(block => ({
      ...block,
      content: {
        title: learningData?.title || "Writing Session",
        description: learningData?.description || "Complete writing tasks",
        type: "writing",
      },
    })),
    focusedImplementation: [],
  };
}

function getDisciplineRotation(weekNum, dayIndex) {
  const isSaturday = dayIndex === 5;
  const isSunday = dayIndex === 6;
  const isMonday = dayIndex === 0;
  const isTuesday = dayIndex === 1;
  const isWednesday = dayIndex === 2;
  const isThursday = dayIndex === 3;
  const isFriday = dayIndex === 4;
  const isMondayToWednesday = dayIndex >= 0 && dayIndex <= 2; // Monday-Wednesday
  const isWeekday = dayIndex >= 0 && dayIndex <= 4; // Monday-Friday

  // Saturday: No Software Engineering sessions
  if (isSaturday) {
    return {
      primary: null,
      secondary: null,
      tertiary: null,
      quaternary: null,
      allDisciplines: [],
      priorityOrder: [],
      rotationOrder: [],
      earlyMorningDiscipline: null,
    };
  }

  // Sunday: No Software Engineering sessions
  if (isSunday) {
    return {
      primary: null,
      secondary: null,
      tertiary: null,
      quaternary: null,
      allDisciplines: [],
      priorityOrder: [],
      rotationOrder: [],
      earlyMorningDiscipline: null,
    };
  }

  // Monday-Wednesday: Mobile only (9:30 PM - 11:00 PM)
  if (isMondayToWednesday) {
    return {
      primary: "Mobile",
      secondary: null,
      tertiary: null,
      quaternary: null,
      allDisciplines: ["Mobile"],
      priorityOrder: ["Mobile"],
      rotationOrder: ["Mobile"],
      earlyMorningDiscipline: null,
    };
  }

  // Thursday: Frontend only (9:30 PM - 11:30 PM)
  if (isThursday) {
    return {
      primary: "Frontend",
      secondary: null,
      tertiary: null,
      quaternary: null,
      allDisciplines: ["Frontend"],
      priorityOrder: ["Frontend"],
      rotationOrder: ["Frontend"],
      earlyMorningDiscipline: null,
    };
  }

  // Friday: Frontend only (8:30 PM - 10:00 PM)
  if (isFriday) {
    return {
      primary: "Frontend",
      secondary: null,
      tertiary: null,
      quaternary: null,
      allDisciplines: ["Frontend"],
      priorityOrder: ["Frontend"],
      rotationOrder: ["Frontend"],
      earlyMorningDiscipline: null,
    };
  }

  // Fallback (should not reach here)
  return {
    primary: "Mobile",
    secondary: null,
    tertiary: null,
    quaternary: null,
    allDisciplines: ["Mobile"],
    priorityOrder: ["Mobile"],
    rotationOrder: ["Mobile"],
    earlyMorningDiscipline: null,
  };
}

function mapContentToDiscipline(content, discipline, weekNum, dayIndex) {
  // Map existing curriculum content to disciplines based on week theme
  const weekTheme = getSoftwareEngineeringTheme(weekNum);

  // Determine which discipline this content belongs to
  const frontendKeywords = [
    "HTML",
    "CSS",
    "Tailwind",
    "React",
    "Next.js",
    "Frontend",
    "DOM",
  ];
  const backendKeywords = [
    "Node.js",
    "Express",
    "Database",
    "Backend",
    "API",
    "Server",
  ];
  const mobileKeywords = [
    "React Native",
    "Mobile",
    "Expo",
    "iOS",
    "Android",
    "Native",
    "Mobile App",
  ];
  const wordpressKeywords = ["WordPress", "Theme", "Plugin", "CMS"];

  const contentLower =
    (content.title || "").toLowerCase() + " " + weekTheme.toLowerCase();

  if (wordpressKeywords.some((k) => contentLower.includes(k.toLowerCase()))) {
    return "WordPress";
  }
  if (mobileKeywords.some((k) => contentLower.includes(k.toLowerCase()))) {
    return "Mobile";
  }
  if (backendKeywords.some((k) => contentLower.includes(k.toLowerCase()))) {
    return "Backend";
  }
  if (frontendKeywords.some((k) => contentLower.includes(k.toLowerCase()))) {
    return "Frontend";
  }

  // Default based on week number
  if (weekNum <= 3) return "Frontend";
  if (weekNum <= 7) return "Frontend"; // React/Next.js
  if (weekNum === 8 || weekNum === 9) return "Backend";
  if (weekNum === 10) return "Mobile";
  if (weekNum === 11) return "WordPress";
  if (weekNum >= 12) return "Frontend"; // Full-stack/capstone

  return discipline || "Frontend";
}

// Crash course functions are defined above. This is the legacy getSoftwareEngineeringTheme function.
function getSoftwareEngineeringTheme(weekNum) {
  const themes = [
    "JavaScript Core + ES6+ Mastery (Foundation)",
    "React.js Fundamentals (Web Foundation)",
    "Node.js + Express + Backend APIs",
    "React Native Core - Mobile Development",
    "React Native Advanced - Navigation & State",
    "React Native - Maps, Location & Real-time",
    "React Native - Payments & MoMo Integration",
    "Comfort App - Passenger App MVP",
    "Comfort App - Driver App MVP",
    "Comfort App - Admin Dashboard (ReactJS)",
    "Comfort App - Backend APIs & Infrastructure",
    "Comfort App - Testing, Deployment & Launch",
    "Comfort App - Final Polish & Production Ready",
  ];
  return themes[weekNum - 1] || "Software Engineering Theme";
}

// REMOVED: Duplicate crash course functions - they are already defined above before softwareEngineeringWeeks
// All crash course functions (getCrashCourseLearning, getCrashCourseWorkflow, etc.) are defined starting at line 855
// getSoftwareEngineeringTheme is defined later in the file (around line 2538)

// React Native & Comfort App Focused Curriculum
// Week 1: JavaScript Core + ES6+ (Foundation)
// Week 2: React.js Fundamentals (Web Foundation for Admin Dashboard) + Backend APIs
// Week 3: Node.js + Express + Backend APIs (Synced with Frontend)
// Week 4-6: React Native Core & Advanced (Mobile Development) + Backend APIs
// Week 7-9: Comfort App Features (Maps, Location, Payments, Real-time) + Backend
// Week 10-12: Comfort App MVP Development (Passenger App, Driver App, Admin Dashboard) + Backend
// Week 13: Testing, Deployment & Production Launch
//
// SYNCED STRUCTURE: Each day includes both Frontend and Backend topics
// Frontend concepts are paired with their corresponding backend implementations
// NOTE: getSoftwareEngineeringLearning is defined later in the file (around line 2907) for the full 13-week curriculum
// The crash course uses getSoftwareEngineeringCrashCourseLearning instead
// getSoftwareEngineeringTheme is defined later in the file (around line 2538)

// React Native & Comfort App Focused Curriculum
// Week 1: JavaScript Core + ES6+ (Foundation)
// Week 2: React.js Fundamentals (Web Foundation for Admin Dashboard) + Backend APIs
// Week 3: Node.js + Express + Backend APIs (Synced with Frontend)
// Week 4-6: React Native Core & Advanced (Mobile Development) + Backend APIs
// Week 7-9: Comfort App Features (Maps, Location, Payments, Real-time) + Backend
// Week 10-12: Comfort App MVP Development (Passenger App, Driver App, Admin Dashboard) + Backend
// Week 13: Testing, Deployment & Production Launch
//
// SYNCED STRUCTURE: Each day includes both Frontend and Backend topics
// Frontend concepts are paired with their corresponding backend implementations
// dayNumber (1-90) ensures content is unique per day and progressive
function getSoftwareEngineeringLearning(weekNum, dayIndex, dayNumber = null) {
  // Calculate dayNumber if not provided
  const calculatedDayNumber = dayNumber || ((weekNum - 1) * 7 + dayIndex + 1);
  
  const learningData = {
    1: {
      0: {
        title:
          "JavaScript Fundamentals - Variables, Data Types, Operators (90 min)",
        frontend: {
          title: "Frontend: JavaScript Fundamentals",
          topics: [
            "JavaScript basics: history, role in modern development",
            "Variables: var, let, const (ES6+) - differences and best practices",
            "Data Types: Primitives (number, string, boolean, undefined, null, symbol, bigint) and Objects",
            "Type checking: typeof, instanceof",
            "Type coercion and conversion",
            "Operators: Arithmetic, Assignment, Comparison, Logical, Ternary",
            "Template literals (ES6): backticks, interpolation, multi-line strings",
            "Destructuring: arrays and objects",
            "Spread and Rest operators",
            "Arrow functions vs regular functions",
          ],
        },
        backend: {
          title: "Backend: Node.js Fundamentals (Synced)",
          topics: [
            "Node.js basics: JavaScript runtime environment",
            "Node.js vs Browser JavaScript: differences and similarities",
            "Node.js modules: CommonJS (require/module.exports) vs ES6 modules",
            "Global objects in Node.js: process, global, __dirname, __filename",
            "File system operations: fs module basics",
            "Path operations: path module for file paths",
            "Environment variables: process.env",
            "NPM basics: package.json, installing packages",
            "Running Node.js scripts: node command",
            "Node.js REPL: interactive JavaScript environment",
          ],
        },
        mobile: {
          title: "Mobile: React Native Introduction & Setup (120 min)",
          topics: [
            "What is React Native: cross-platform mobile development",
            "React Native vs native apps: when to use each",
            "React Native architecture: JavaScript bridge, native modules",
            "Development environment setup: Node.js, React Native CLI, Xcode (iOS), Android Studio",
            "Expo vs React Native CLI: choosing the right approach",
            "Creating your first React Native app: npx create-expo-app or npx react-native init",
            "Project structure: understanding folders (src, components, screens, navigation)",
            "Running on iOS simulator: xcode-select, simulator setup",
            "Running on Android emulator: Android Studio, AVD setup",
            "Hot reloading: Fast Refresh, live reloading",
            "Platform differences: iOS vs Android considerations",
            "React Native basics: View, Text, StyleSheet components",
            "Styling in React Native: StyleSheet.create(), inline styles, Flexbox",
            "Real-life analogy: Like learning to drive - understanding the car (React Native) before the road (complex features)",
          ],
        },
        topics: [], // Legacy support - will be populated from frontend.topics
      },
      1: {
        title:
          "CSS Core Concepts (60 min) + CSS Selectors & Specificity (30 min)",
        frontend: {
          title: "Frontend: CSS Core Concepts",
          topics: [
            "Box Model Deep Dive: content-box vs border-box, calculating total dimensions",
            "Display types: block, inline, inline-block, none",
            "Positioning: static, relative, absolute, fixed, sticky",
            "Z-index and stacking context",
            "CSS Units: px, em, rem, %, vh, vw, fr",
            "Typography: font-family, font-size, font-weight, line-height, text-transform",
            "Colors: hex, rgb, rgba, hsl, hsla, named colors",
            "Backgrounds: background-color, background-image, background-size, background-position",
            "Borders and shadows: border, border-radius, box-shadow",
            "Spacing: margin, padding (shorthand and longhand)",
            "Advanced selectors: descendant, child (>), adjacent sibling (+), general sibling (~)",
            'Attribute selectors: [attr], [attr="value"], [attr^="value"], [attr$="value"], [attr*="value"]',
            "Pseudo-classes: :hover, :focus, :active, :first-child, :last-child, :nth-child()",
            "Pseudo-elements: ::before, ::after, ::first-line, ::first-letter",
            "Specificity calculation: inline styles (1000), IDs (100), classes (10), elements (1)",
          ],
        },
        mobile: {
          title: "Mobile: React Native Core Components & Styling (120 min)",
          topics: [
            "React Native Core Components: View, Text, Image, ScrollView, TextInput, Button",
            "View component: container component (like div in web)",
            "Text component: displaying text (must wrap text in <Text>, not directly in <View>)",
            "StyleSheet API: StyleSheet.create() for performance optimization",
            "Flexbox in React Native: same as web but default flexDirection is column (not row)",
            "Layout basics: justifyContent, alignItems, alignSelf, flex",
            "Styling differences: no CSS classes, no CSS selectors, StyleSheet only",
            "Platform-specific styles: Platform.select() for iOS vs Android differences",
            "Dimensions API: getting screen width/height, responsive design",
            "SafeAreaView: handling notches and status bars",
            "TouchableOpacity, TouchableHighlight, Pressable: handling user interactions",
            "Image component: local images (require()) vs network images (uri)",
            "ScrollView: making content scrollable",
            "Real-life analogy: Like learning HTML/CSS but for mobile - same concepts, different implementation",
          ],
        },
        topics: [],
      },
      2: {
        title: "Flexbox Fundamentals (60 min) + Flexbox Patterns (30 min)",
        frontend: {
          title: "Frontend: Flexbox Fundamentals",
          topics: [
            "Flex container properties: display: flex, flex-direction, flex-wrap, justify-content, align-items, align-content, gap",
            "Flex item properties: flex-grow, flex-shrink, flex-basis, flex (shorthand), align-self, order",
            "Centering content (horizontal and vertical)",
            "Navigation bars",
            "Card grids",
            "Holy Grail layout",
            "Sticky footer",
            "Equal height columns",
            "Responsive image galleries",
          ],
        },
        mobile: {
          title: "Mobile: React Native State Management & User Input (120 min)",
          topics: [
            "useState hook: managing component state in React Native",
            "State updates: setState patterns, functional updates",
            "TextInput component: handling user text input",
            "Controlled components: TextInput with state",
            "Keyboard handling: KeyboardAvoidingView, keyboard dismissal",
            "Form handling: collecting user input, validation basics",
            "Button component: TouchableOpacity vs Button vs Pressable",
            "Event handling: onPress, onChange, onSubmit",
            "State patterns: lifting state up, sharing state between components",
            "Loading states: ActivityIndicator component",
            "Error states: displaying errors to users",
            "Platform-specific input: iOS vs Android keyboard differences",
            "Real-life analogy: Like a form in a restaurant - collecting orders (input) and showing status (state)",
          ],
        },
        topics: [],
      },
      3: {
        title: "CSS Grid Fundamentals (60 min) + Grid Patterns (30 min)",
        frontend: {
          title: "Frontend: CSS Grid Fundamentals",
          topics: [
            "Grid container properties: display: grid, grid-template-columns, grid-template-rows, grid-template-areas, gap",
            "Grid item properties: grid-column, grid-row, grid-area, justify-self, align-self",
            "Grid lines and tracks",
            "Implicit vs explicit grid",
            "Auto-placement",
            "Responsive grid without media queries (auto-fit, auto-fill)",
            "Magazine-style layouts",
            "Overlapping grid items",
            "Grid + Flexbox combination",
          ],
        },
        mobile: {
          title: "Mobile: Lists, Images & Performance (120 min)",
          topics: [
            "FlatList component: rendering lists efficiently (like restaurant menu)",
            "FlatList vs ScrollView: when to use each",
            "List performance: keyExtractor, getItemLayout, removeClippedSubviews",
            "Image optimization: caching, lazy loading, placeholder images",
            "Image component: local vs network images, resizeMode",
            "SectionList: grouped lists with headers",
            "VirtualizedList: understanding virtualization for performance",
            "List patterns: pull-to-refresh, infinite scroll basics",
            "Memory management: avoiding memory leaks in lists",
            "Performance tips: avoiding unnecessary re-renders",
            "Real-life analogy: Like a restaurant menu - efficiently showing many items (FlatList) vs showing everything at once (ScrollView)",
          ],
        },
        topics: [],
      },
      4: {
        title:
          "Responsive Design Principles (60 min) + Advanced Responsive Techniques (30 min)",
        frontend: {
          title: "Frontend: Responsive Design Principles",
          topics: [
            "Mobile-first vs desktop-first approaches",
            "Breakpoints: common sizes (320px, 768px, 1024px, 1440px)",
            "Viewport meta tag",
            "Media queries syntax",
            "Responsive typography: fluid typography with clamp()",
            "Responsive images: srcset, sizes, <picture> element",
            "Container queries (modern approach)",
            "CSS clamp() for fluid typography",
            "Aspect ratio: aspect-ratio property",
            "Touch-friendly targets (min 44x44px)",
          ],
        },
        mobile: {
          title: "Mobile: Navigation Architecture (120 min)",
          topics: [
            "React Navigation: industry-standard navigation library",
            "Navigation types: Stack, Tab, Drawer navigators",
            "Stack Navigator: screen navigation (like pages in a book)",
            "Tab Navigator: bottom tabs, top tabs",
            "Navigation setup: installing @react-navigation/native, @react-navigation/stack",
            "Screen components: creating multiple screens",
            "Navigation props: navigation.navigate(), navigation.goBack()",
            "Route parameters: passing data between screens",
            "Navigation options: headers, titles, buttons",
            "Deep linking basics: URL-based navigation",
            "Navigation state: understanding navigation state structure",
            "Real-life analogy: Like a restaurant with multiple rooms (screens) - navigation helps customers move between them",
          ],
        },
        topics: [],
      },
      5: {
        title:
          "Tailwind CSS Fundamentals (60 min) + Tailwind Advanced Features (30 min)",
        frontend: {
          title: "Frontend: Tailwind CSS Fundamentals",
          topics: [
            "Utility-first CSS philosophy",
            "Installation: CDN, npm, CLI",
            "Configuration: tailwind.config.js",
            "Core concepts: utility classes vs component classes",
            "Responsive prefixes: sm:, md:, lg:, xl:, 2xl:",
            "State variants: hover:, focus:, active:, disabled:",
            "Dark mode: dark:",
            "Spacing, typography, colors, layout utilities",
            "Flexbox and Grid utilities",
            "Custom configuration: colors, fonts, spacing",
            "Extending default theme",
            "Custom utilities with @apply",
            "JIT (Just-In-Time) mode",
          ],
        },
        mobile: {
          title: "Mobile: Project Structure & Architecture (120 min)",
          topics: [
            "Mobile app architecture: UI Layer, Service Layer, Storage Layer (from README)",
            "Project structure: organizing code for scale (screens/, components/, services/, store/, utils/)",
            "Folder organization: feature-based vs type-based structure",
            "Component organization: reusable vs screen-specific components",
            "Service layer: separating business logic from UI",
            "Storage layer: AsyncStorage vs Secure Storage (Keychain)",
            "Platform differences: iOS vs Android, Platform.select()",
            "Native modules: when to use native code",
            "Error boundaries: catching crashes gracefully",
            "Code organization best practices: single responsibility, separation of concerns",
            "Real-life analogy: Like a restaurant - dining room (UI), kitchen (services), pantry (storage)",
          ],
        },
        topics: [],
      },
      6: {
        title:
          "Week 1 Review & Consolidation (60 min) + Advanced Topics Preview (30 min)",
        frontend: {
          title: "Frontend: Week 1 Review",
          topics: [
            "Review all Week 1 concepts",
            "Identify knowledge gaps",
            "Deep dive into any unclear topics",
            "Practice with interactive resources",
            "CSS animations and keyframes",
            "CSS transforms and transitions",
            "Advanced Tailwind patterns",
            "Performance optimization",
            "Accessibility best practices",
          ],
        },
        mobile: {
          title: "Mobile: Week 1 Review & Building First Screen (120 min)",
          topics: [
            "Review React Native fundamentals: components, state, styling",
            "Review navigation basics: Stack Navigator, screen navigation",
            "Review project structure: organizing mobile apps",
            "Build your first complete screen: Home screen with navigation",
            "Practice: Create a screen with TextInput, Button, and state",
            "Practice: Add navigation between two screens",
            "Identify knowledge gaps: what needs more practice?",
            "Code review: review your Week 1 code, identify improvements",
            'Real-life practice: Build a simple "Welcome" screen for Transport App',
          ],
        },
        topics: [],
      },
    },
    2: {
      0: {
        title: "React Components + Express API Endpoints (Synced)",
        frontend: {
          title: "Frontend: React Components Fundamentals",
          topics: [
            "React Components: functional vs class components",
            "JSX syntax: writing HTML-like code in JavaScript",
            "Component structure: import, component function, export",
            "Props: passing data to components",
            "Props destructuring and default props",
            "Component composition: building complex UIs from simple components",
            "Rendering lists: map() function, keys",
            "Conditional rendering: ternary operators, && operator",
            "Event handling: onClick, onChange, onSubmit",
            "Component state: useState hook basics",
          ],
        },
        backend: {
          title: "Backend: Express API Endpoints (Synced with React)",
          topics: [
            "Express.js setup: npm init, installing express",
            "Creating Express server: app.listen(), basic server setup",
            "API Routes: app.get(), app.post(), app.put(), app.delete()",
            "Route parameters: req.params",
            "Query parameters: req.query",
            "Request body: req.body, body-parser middleware",
            "Response methods: res.json(), res.send(), res.status()",
            "Creating RESTful endpoints: GET, POST, PUT, DELETE",
            "API endpoint structure: /api/users, /api/trips, etc.",
            "Testing endpoints: Postman/Thunder Client basics",
          ],
        },
        mobile: {
          title: "Mobile: API Integration & Fetch (120 min)",
          topics: [
            "Fetch API in React Native: making HTTP requests",
            "async/await: handling asynchronous operations",
            "API service layer: creating centralized API client",
            "REST API basics: GET, POST, PUT, DELETE requests",
            "Request headers: Content-Type, Authorization",
            "Response handling: parsing JSON, error handling",
            "Loading states: showing ActivityIndicator during API calls",
            "Error handling: try-catch, displaying errors to users",
            "API endpoint structure: understanding backend API structure",
            "Network debugging: using React Native Debugger, Flipper",
            "Real-life analogy: Like ordering food - sending request (fetch), waiting for response (async), getting food (data)",
          ],
        },
        topics: [],
      },
      1: {
        title: "React State & Forms + Backend POST Endpoints (Synced)",
        frontend: {
          title: "Frontend: React State Management & Forms",
          topics: [
            "useState hook: managing component state",
            "State updates: setState patterns, functional updates",
            "Controlled components: form inputs with state",
            "Form handling: onSubmit, preventDefault",
            "Input types: text, email, password, number, date",
            "Form validation: client-side validation basics",
            "Multiple inputs: managing multiple form fields",
            "Form submission: handling form data",
            "Loading states: showing loading indicators",
            "Error handling in forms: displaying errors",
          ],
        },
        backend: {
          title: "Backend: POST Endpoints & Data Handling (Synced)",
          topics: [
            "POST endpoints: handling form submissions",
            "req.body: accessing form data",
            "Body parsing: express.json(), express.urlencoded()",
            "Data validation: validating incoming data",
            "Error handling: try-catch, error responses",
            "Status codes: 200, 201, 400, 404, 500",
            "Response formatting: consistent JSON responses",
            "CORS: enabling cross-origin requests",
            "Middleware: understanding middleware concept",
            "Request validation: checking required fields",
          ],
        },
        mobile: {
          title: "Mobile: Secure Storage & Authentication (120 min)",
          topics: [
            "Secure Storage: react-native-keychain for JWT tokens (from README)",
            "Keychain vs AsyncStorage: when to use each (security vs convenience)",
            "JWT tokens: understanding token-based authentication",
            "Token storage: storing tokens securely in Keychain",
            "Token retrieval: getting tokens from secure storage",
            "Authentication flow: login, token storage, authenticated requests",
            "Protected API calls: adding Authorization header with Bearer token",
            "Token expiration: handling expired tokens, refresh tokens basics",
            "AsyncStorage: for non-sensitive data (cached data, preferences)",
            "Security best practices: never store sensitive data in AsyncStorage",
            "Real-life analogy: Keychain = bank vault (secure), AsyncStorage = drawer (convenient but not secure)",
          ],
        },
        topics: [],
      },
      2: {
        title: "React Hooks & API Calls + Backend GET Endpoints (Synced)",
        frontend: {
          title: "Frontend: React Hooks & Fetching Data",
          topics: [
            "useEffect hook: side effects in React",
            "Dependency array: when effects run",
            "Fetch API: making HTTP requests",
            "async/await: handling asynchronous operations",
            "Loading states: useState for loading",
            "Error states: handling API errors",
            "Displaying data: rendering API responses",
            "useEffect cleanup: preventing memory leaks",
            "Custom hooks: extracting reusable logic",
            "Data fetching patterns: best practices",
          ],
        },
        backend: {
          title: "Backend: GET Endpoints & Data Retrieval (Synced)",
          topics: [
            "GET endpoints: retrieving data",
            "Route parameters: /api/users/:id",
            "Query parameters: filtering and pagination",
            "Database queries: preparing for database integration",
            "Data formatting: structuring API responses",
            "Error handling: 404 for not found, 500 for server errors",
            "Response headers: setting appropriate headers",
            "Data transformation: formatting data before sending",
            "Multiple endpoints: organizing routes",
            "API documentation: documenting endpoints",
          ],
        },
        mobile: {
          title: "Mobile: State Management with Zustand/Redux (120 min)",
          topics: [
            "State management: local state vs global state (from README)",
            "Zustand: lightweight state management library",
            "Zustand store: creating stores, actions, selectors",
            "Redux basics: store, actions, reducers (alternative to Zustand)",
            "When to use global state: sharing data across screens",
            "State patterns: trip state, user state, app state",
            "Offline queue: Redux Persist / AsyncStorage for offline support",
            "State persistence: saving state to AsyncStorage",
            "Real-time state: managing trip status, driver location",
            "State management best practices: keeping state normalized",
            "Real-life analogy: Like a whiteboard (Zustand/Redux) showing current order status that everyone can see and update",
          ],
        },
        topics: [],
      },
      3: {
        title: "React Context API + Backend Authentication (Synced)",
        frontend: {
          title: "Frontend: Context API for Global State",
          topics: [
            "Context API: sharing state across components",
            "createContext: creating a context",
            "Provider component: wrapping components",
            "useContext hook: consuming context",
            "Context patterns: authentication context, theme context",
            "Combining contexts: multiple contexts",
            "Context vs Props: when to use each",
            "Context performance: optimization tips",
            "Custom context hooks: cleaner API",
            "Context with TypeScript: type safety",
          ],
        },
        backend: {
          title: "Backend: Authentication & JWT (Synced)",
          topics: [
            "Authentication concepts: login, registration",
            "JWT (JSON Web Tokens): token-based auth",
            "Password hashing: bcrypt basics",
            "User registration endpoint: POST /api/auth/register",
            "User login endpoint: POST /api/auth/login",
            "Token generation: creating JWTs",
            "Token verification: middleware for protected routes",
            "Protected routes: requiring authentication",
            "User sessions: managing authenticated users",
            "Security best practices: password requirements, token expiration",
          ],
        },
        mobile: {
          title: "Mobile: WebSockets vs REST API (120 min)",
          topics: [
            "WebSockets vs REST: when to use each (from README)",
            "REST API: like sending letters (request-response pattern)",
            "WebSocket: like phone call (instant, two-way communication)",
            "Socket.io client: installing and connecting to WebSocket server",
            "WebSocket connection: establishing connection, authentication",
            "Real-time updates: receiving trip.accepted, driver.location events",
            "WebSocket events: socket.on(), socket.emit()",
            "Connection management: reconnection logic, connection state",
            "Battery optimization: WebSocket vs polling (REST every 5 seconds)",
            "Use cases: trip status updates, driver location, notifications",
            "Real-life analogy: REST = sending letters (slow), WebSocket = phone call (instant)",
          ],
        },
        topics: [],
      },
      4: {
        title: "React Router + Backend Route Organization (Synced)",
        frontend: {
          title: "Frontend: React Router Navigation",
          topics: [
            "React Router: client-side routing",
            "BrowserRouter: setting up router",
            "Routes and Route: defining routes",
            "Link component: navigation links",
            "useNavigate hook: programmatic navigation",
            "URL parameters: useParams hook",
            "Nested routes: organizing route structure",
            "Protected routes: authentication guards",
            "404 pages: handling unknown routes",
            "Route transitions: smooth navigation",
          ],
        },
        backend: {
          title: "Backend: Route Organization & Middleware (Synced)",
          topics: [
            "Express Router: organizing routes",
            "Route modules: separating routes into files",
            "Middleware: authentication, logging, error handling",
            "Route middleware: applying to specific routes",
            "Error handling middleware: centralized error handling",
            "Request logging: morgan middleware",
            "Route organization: /api/auth, /api/users, /api/trips",
            "Middleware order: understanding execution order",
            "Custom middleware: creating reusable middleware",
            "Route versioning: /api/v1, /api/v2",
          ],
        },
        topics: [],
      },
      5: {
        title: "React Forms Advanced + Backend Validation (Synced)",
        frontend: {
          title: "Frontend: Advanced Form Handling",
          topics: [
            "Form libraries: React Hook Form basics",
            "Form validation: client-side validation rules",
            "Error messages: displaying validation errors",
            "Form submission: handling async submissions",
            "File uploads: handling file inputs",
            "Multi-step forms: wizard patterns",
            "Form state management: complex form state",
            "Form reset: clearing form after submission",
            "Form accessibility: ARIA labels, error announcements",
            "Form testing: testing form interactions",
          ],
        },
        backend: {
          title: "Backend: Data Validation & File Uploads (Synced)",
          topics: [
            "Input validation: validating request data",
            "Validation libraries: express-validator basics",
            "Validation rules: required, email, min, max",
            "Error responses: detailed validation errors",
            "File uploads: multer middleware",
            "File storage: saving uploaded files",
            "File validation: checking file types, sizes",
            "Sanitization: cleaning user input",
            "Validation middleware: reusable validation",
            "Error handling: comprehensive error responses",
          ],
        },
        topics: [],
      },
      6: {
        title: "Week 2 Review: Full-Stack Integration",
        frontend: {
          title: "Frontend: Week 2 Review",
          topics: [
            "Review React components, hooks, and state",
            "Review form handling and API calls",
            "Practice building components that consume APIs",
            "Review Context API patterns",
            "Review React Router navigation",
            "Build a complete feature: component + API integration",
          ],
        },
        backend: {
          title: "Backend: Week 2 Review",
          topics: [
            "Review Express routes and middleware",
            "Review API endpoint creation",
            "Review authentication basics",
            "Practice building complete API endpoints",
            "Review route organization",
            "Build API endpoints that support frontend features",
          ],
        },
        topics: [],
      },
    },
    3: {
      0: {
        title: "Node.js Advanced + Database Setup (Synced)",
        frontend: {
          title: "Frontend: Preparing for Database Integration",
          topics: [
            "Understanding data flow: Frontend → API → Database",
            "API response structures: consistent data formats",
            "Error handling: displaying database errors to users",
            "Loading states: handling async database operations",
            "Data caching: client-side caching strategies",
            "Optimistic updates: updating UI before API response",
            "Error boundaries: catching API errors",
            "Data normalization: organizing API responses",
            "Pagination UI: displaying paginated data",
            "Search and filter UI: client-side filtering",
          ],
        },
        backend: {
          title: "Backend: Database Setup & Connection",
          topics: [
            "Database concepts: SQL vs NoSQL",
            "PostgreSQL setup: installing and configuring",
            "Database connection: connection pooling",
            "Environment variables: database credentials",
            "Database clients: pg (PostgreSQL) or Mongoose (MongoDB)",
            "Connection strings: format and security",
            "Database schemas: planning table structure",
            "Migrations: version controlling database changes",
            "Database tools: pgAdmin, MongoDB Compass",
            "Testing database connection: verifying setup",
          ],
        },
        topics: [],
      },
    },
  };

  const dayData = learningData[weekNum]?.[dayIndex];
  if (dayData) {
    // Ensure backward compatibility: populate topics from frontend if not present
    if (!dayData.topics && dayData.frontend?.topics) {
      dayData.topics = dayData.frontend.topics;
    }
    // If no frontend/backend structure, create it from existing topics
    if (!dayData.frontend && dayData.topics) {
      dayData.frontend = {
        title: dayData.title || "Frontend Learning",
        topics: dayData.topics,
      };
      // Add basic backend sync if week is 2+
      if (weekNum >= 2) {
        dayData.backend = {
          title: "Backend: Synced Learning",
          topics: [`Backend concepts synced with: ${dayData.title}`],
        };
      }
    }
    return dayData;
  }

  return {
    title: `${getSoftwareEngineeringTheme(weekNum)} Learning`,
    frontend: {
      title: "Frontend Learning",
      topics: [
        `Day ${dayIndex + 1} frontend content for ${getSoftwareEngineeringTheme(
          weekNum
        )}`,
      ],
    },
    backend: {
      title: "Backend Learning",
      topics: [
        `Day ${dayIndex + 1} backend content for ${getSoftwareEngineeringTheme(
          weekNum
        )}`,
      ],
    },
    topics: [
      `Day ${dayIndex + 1} learning content for ${getSoftwareEngineeringTheme(
        weekNum
      )}`,
    ],
  };
  
  // Enhance with day-specific content to make it unique per day (1-90)
  const baseData = learningData[weekNum]?.[dayIndex] || fallbackData;
  const enhancedData = enhanceLearningWithDaySpecificContent(baseData, calculatedDayNumber, weekNum, dayIndex);
  
  return enhancedData;
}

// Enhance learning content with day-specific details to make each day unique and meaningful
function enhanceLearningWithDaySpecificContent(baseData, dayNumber, weekNum, dayIndex) {
  const phase = Math.ceil(dayNumber / 15); // 15-day phases
  const dayInPhase = ((dayNumber - 1) % 15) + 1;
  
  // Add day-specific context to title
  const enhancedTitle = baseData.title 
    ? `${baseData.title} - Day ${dayNumber} Focus`
    : `Day ${dayNumber} Learning - ${getSoftwareEngineeringTheme(weekNum)}`;
  
  // Add day-specific learning objectives
  const daySpecificObjectives = [
    `Today (Day ${dayNumber}) you're building on ${dayNumber > 1 ? `Day ${dayNumber - 1}'s` : 'yesterday\'s'} foundation`,
    `This is day ${dayInPhase} of Phase ${phase} - ${phase === 1 ? 'Fundamentals' : phase === 2 ? 'Intermediate' : 'Advanced'} learning`,
    `By the end of today, you'll have completed ${((dayNumber / 90) * 100).toFixed(1)}% of your journey`,
    `Focus on mastery: Review Day ${Math.max(1, dayNumber - 7)} to Day ${dayNumber - 1} concepts before starting`,
  ];
  
  // Enhance topics with day-specific context
  const enhancedTopics = baseData.topics ? [...baseData.topics] : [];
  if (dayNumber > 1) {
    enhancedTopics.unshift(`📚 Review: Connect today's learning with Day ${dayNumber - 1}'s concepts`);
  }
  if (dayNumber % 7 === 0) {
    enhancedTopics.push(`🎯 Week Review: Consolidate Week ${weekNum} learnings`);
  }
  
  return {
    ...baseData,
    title: enhancedTitle,
    topics: enhancedTopics,
    daySpecificObjectives,
    dayNumber,
    phase,
    dayInPhase,
  };
}

function getSoftwareEngineeringCursorWorkflow(weekNum, dayIndex) {
  const workflows = {
    1: {
      0: {
        setupCommands: [
          "mkdir week-01-day-01",
          "cd week-01-day-01",
          "mkdir css js images",
          "touch index.html css/style.css",
        ],
        prompts: [
          "Generate a semantic HTML5 document structure with header, nav, main, and footer sections",
          "Create an accessible navigation menu with proper ARIA labels",
          "Add meta tags for SEO including Open Graph tags",
          "Generate a contact form with proper input types and labels",
          "Refactor this HTML to use semantic elements instead of divs",
        ],
        refactoringTasks: [
          "Convert div-based layouts to semantic HTML5",
          "Add proper alt text to all images",
          "Ensure all interactive elements have proper labels",
          "Validate HTML using Cursor's built-in validation",
        ],
      },
    },
  };

  const workflow = workflows[weekNum]?.[dayIndex];
  if (workflow) {
    return workflow;
  }

  return {
    setupCommands: [`Setup for Week ${weekNum}, Day ${dayIndex + 1}`],
    prompts: [`Cursor prompts for ${getSoftwareEngineeringTheme(weekNum)}`],
    refactoringTasks: [
      `Refactoring tasks for Week ${weekNum}, Day ${dayIndex + 1}`,
    ],
  };
}

// Helper function to enrich project data with project-driven information
function enrichProjectWithProjectInfo(projectData, dayNumber, discipline) {
  const projectComponent = getProjectComponentForDay(dayNumber, discipline);

  return {
    ...projectData,
    // Project-driven metadata
    projectComponent: projectComponent.component,
    projectPart: projectComponent.part,
    projectName: TRANSPORT_APP_PROJECT.name,
    // Enhanced description that connects to project
    description:
      projectData.description ||
      `Build ${projectComponent.component} for the ${TRANSPORT_APP_PROJECT.name}`,
    // Add what you're building today
    buildingToday: {
      component: projectComponent.component,
      part: projectComponent.part,
      connectsTo: `This ${projectComponent.component} is part of the ${projectComponent.part} in the ${TRANSPORT_APP_PROJECT.name}`,
      expectedOutput:
        projectData.expectedOutput ||
        `A working ${projectComponent.component} that integrates with the ${TRANSPORT_APP_PROJECT.name}`,
    },
  };
}

function getSoftwareEngineeringProject(weekNum, dayIndex, dayNumber = null) {
  // Calculate dayNumber if not provided
  const calculatedDayNumber = dayNumber || ((weekNum - 1) * 7 + dayIndex + 1);
  const projects = {
    1: {
      0: {
        // Frontend project
        frontend: {
          title: "Personal Introduction Page",
          description:
            "Build a single-page HTML document that introduces yourself.",
          skills: ["HTML5", "Semantic HTML", "Forms"],
          requirements: [
            "Semantic HTML5 structure",
            "Header with your name and title",
            "Navigation menu (even if single page)",
            "About section with text content",
            "Skills/interests section using lists",
            "Contact form (styling comes later)",
            "Footer with copyright",
          ],
          mustHave: [
            "Valid HTML5",
            "All images have alt text",
            "Proper heading hierarchy (h1 → h2 → h3)",
            "Accessible form labels",
            "Semantic elements only (no div soup)",
          ],
        },
        // Mobile project
        mobile: {
          title: "React Native App Setup & Welcome Screen",
          description:
            "Create your first React Native app with a welcome screen that introduces yourself.",
          skills: ["React Native", "Components", "Styling", "Navigation Setup"],
          requirements: [
            "Set up React Native project (Expo or CLI)",
            "Create Welcome screen component",
            "Display your name and title in a header",
            "Add About section with text content",
            "Create Skills/Interests section using FlatList",
            "Add a Contact button (navigation comes later)",
            "Style with React Native StyleSheet",
            "Test on iOS simulator or Android emulator",
          ],
          mustHave: [
            "Valid React Native component structure",
            "Proper component organization",
            "Responsive layout using Flexbox",
            "Accessible text components",
            "Clean code structure",
          ],
        },
        // Backend project
        backend: {
          title: "Node.js Server Setup & API Introduction",
          description:
            "Set up a Node.js server with Express and create an introduction API endpoint.",
          skills: ["Node.js", "Express", "REST API", "JSON"],
          requirements: [
            "Initialize Node.js project with package.json",
            "Set up Express server",
            "Create GET /api/introduction endpoint",
            "Return JSON with your name, title, and bio",
            "Add /api/skills endpoint returning array of skills",
            "Add /api/interests endpoint returning array of interests",
            "Create /api/contact endpoint (POST method, validation comes later)",
            "Test endpoints with Postman or curl",
          ],
          mustHave: [
            "Valid Express server setup",
            "Proper route organization",
            "JSON response format",
            "Error handling basics",
            "Clean code structure",
          ],
        },
        // Systems Engineering project
        "systems-engineering": {
          title: "WordPress Site Setup & About Page",
          description:
            "Set up a WordPress site and create an About page that introduces yourself.",
          skills: ["WordPress", "Pages", "Content Management", "Themes"],
          requirements: [
            "Install and configure WordPress",
            "Create About page with your name and title",
            "Add navigation menu structure",
            "Add About section with text content",
            "Create Skills/Interests section using lists",
            "Add Contact form (plugins come later)",
            "Set up footer with copyright",
          ],
          mustHave: [
            "Valid WordPress installation",
            "Proper page structure",
            "Semantic HTML output",
            "Accessible content",
            "Clean theme structure",
          ],
        },
      },
      1: {
        title: "Styled Card Component Library",
        description:
          "Create a collection of 3 different card components. Build on Day 1's HTML structure and add CSS styling.",
        skills: ["HTML5", "CSS3", "Flexbox"],
        requirements: [
          "Profile Card: Image, name, title, bio, social links",
          "Product Card: Image, title, price, description, CTA button",
          "Article Card: Featured image, title, excerpt, author, date, read more link",
          "Use Day 1's HTML structure as a base",
          "Add CSS styling to make cards visually appealing",
          "Responsive design (cards stack on mobile)",
        ],
        buildsOn: [1], // References Day 1
      },
      2: {
        title: "Responsive Dashboard Layout",
        description:
          "Build a dashboard-style layout with Flexbox. Enhance your Day 2 card library into a full dashboard.",
        skills: ["HTML5", "CSS3", "Flexbox", "Responsive Design"],
        requirements: [
          "Header with logo and navigation (horizontal flex)",
          "Sidebar navigation (vertical flex)",
          "Main content area (flex container for cards)",
          "Card grid (3 columns desktop, 2 tablet, 1 mobile)",
          "Footer (centered content)",
          "Integrate Day 2's card components into the dashboard",
          "Ensure all previous features still work",
        ],
        buildsOn: [1, 2], // References Day 1 and Day 2
      },
      3: {
        title: "Magazine-Style Blog Layout",
        description:
          "Create a blog layout with CSS Grid. Transform your dashboard into a blog using Grid.",
        skills: ["HTML5", "CSS3", "CSS Grid", "Responsive Design"],
        requirements: [
          "Header spanning full width",
          "Featured article (large grid area)",
          "Sidebar with recent posts",
          "Article grid (3 columns, responsive)",
          "Footer with multiple columns",
          "Use Day 3's dashboard structure as a base",
          "Convert flexbox layouts to CSS Grid where appropriate",
        ],
        buildsOn: [1, 2, 3],
      },
      4: {
        title: "Fully Responsive Landing Page",
        description:
          "Build a complete landing page that works on all devices. Combine all previous layouts into one polished page.",
        skills: [
          "HTML5",
          "CSS3",
          "Flexbox",
          "CSS Grid",
          "Responsive Design",
          "Mobile-First",
        ],
        requirements: [
          "Works perfectly on mobile (320px+)",
          "Adapts to tablet (768px+)",
          "Optimized for desktop (1024px+)",
          "Includes responsive navigation (hamburger menu on mobile)",
          "Uses fluid typography",
          "Responsive images",
          "Touch-friendly interactive elements",
          "Integrate components from Days 1-4",
          "Ensure all previous features are responsive",
        ],
        buildsOn: [1, 2, 3, 4],
      },
      5: {
        title: "Tailwind-Powered Portfolio Landing Page",
        description:
          "Rebuild your Day 5 landing page using Tailwind CSS. Refactor previous work with Tailwind utilities.",
        skills: [
          "HTML5",
          "TailwindCSS",
          "Responsive Design",
          "Utility-First CSS",
        ],
        requirements: [
          "Use utility classes exclusively",
          "Responsive design with Tailwind breakpoints",
          "Custom color scheme in config",
          "Hover and focus states",
          "Smooth transitions",
          "Modern, polished design",
          "Refactor Day 5's landing page to use Tailwind",
          "Maintain all functionality from previous days",
        ],
        buildsOn: [1, 2, 3, 4, 5],
      },
      6: {
        title: "Professional Portfolio Website",
        description:
          "Build a complete, production-ready portfolio website. Combine everything from Days 1-6 into a professional portfolio.",
        skills: [
          "HTML5",
          "CSS3",
          "TailwindCSS",
          "Responsive Design",
          "Accessibility",
          "SEO",
        ],
        requirements: [
          "Semantic HTML5 structure",
          "Fully responsive (mobile-first)",
          "Built with Tailwind CSS",
          "Multiple sections: Hero, About, Skills, Projects, Contact, Footer",
          "Smooth scrolling navigation",
          "Hover effects and transitions",
          "Accessible (WCAG 2.1 AA)",
          "Performance optimized",
          "SEO optimized",
          "Integrate all components and layouts from previous days",
          "Showcase all projects built so far",
        ],
        buildsOn: [1, 2, 3, 4, 5, 6],
      },
    },
  };

  const project = projects[weekNum]?.[dayIndex];
  
  // If project already has discipline-specific structure, enhance and return it
  if (project && (project.frontend || project.mobile || project.backend || project['systems-engineering'])) {
    return enhanceProjectWithDaySpecificContent(project, calculatedDayNumber, weekNum, dayIndex);
  }
  
  // If project exists but is not discipline-specific, convert it to discipline-specific and enhance
  if (project) {
    const convertedProject = {
      frontend: {
        ...project,
        description: project.description || `Frontend: ${project.title}`,
      },
      mobile: {
        title: project.title
          .replace(/HTML document|HTML page|HTML/gi, 'React Native App')
          .replace(/CSS/gi, 'React Native')
          .replace(/Web|Website/gi, 'Mobile App')
          .replace(/Page/gi, 'Screen')
          .replace(/Component Library/gi, 'Component Library')
          .replace(/Dashboard Layout/gi, 'App Dashboard')
          .replace(/Blog Layout/gi, 'Blog Screen')
          .replace(/Landing Page/gi, 'Welcome Screen')
          .replace(/Portfolio Website/gi, 'Portfolio App'),
        description: `Mobile: ${(project.description || project.title)
          .replace(/HTML document|web page|website|HTML page/gi, 'React Native app')
          .replace(/HTML|CSS/gi, 'React Native')
          .replace(/components/gi, 'React Native components')
          .replace(/styling/gi, 'React Native StyleSheet')}`,
        skills: project.skills ? project.skills.map(s => 
          s.replace(/HTML5|HTML/gi, 'React Native')
           .replace(/CSS3|CSS/gi, 'React Native StyleSheet')
           .replace(/Flexbox/gi, 'Flexbox (React Native)')
           .replace(/CSS Grid/gi, 'Flexbox Layout')
        ) : ['React Native', 'Components', 'StyleSheet', 'Flexbox'],
        requirements: project.requirements ? project.requirements.map(req => 
          req.replace(/HTML document|web page|website|HTML page/gi, 'React Native app')
            .replace(/HTML|CSS/gi, 'React Native')
            .replace(/CSS styling|CSS styles/gi, 'React Native StyleSheet')
            .replace(/component library|components/gi, 'React Native components')
            .replace(/card components/gi, 'card screens')
            .replace(/dashboard/gi, 'mobile app dashboard')
            .replace(/layout/gi, 'screen layout')
            .replace(/landing page/gi, 'welcome screen')
            .replace(/portfolio website/gi, 'portfolio app')
        ) : project.requirements || [],
        mustHave: project.mustHave ? project.mustHave.map(req => 
          req.replace(/HTML|CSS|web page|website|document/gi, 'React Native app')
        ) : [
          'Valid React Native component structure',
          'Proper component organization',
          'Responsive layout using Flexbox',
          'Accessible components',
          'Clean code structure',
        ],
        buildsOn: project.buildsOn || [],
      },
      backend: {
        title: project.title
          .replace(/Page|Layout|Component|Website/gi, 'API')
          .replace(/Card Component Library/gi, 'Card Data API')
          .replace(/Dashboard Layout/gi, 'Dashboard API')
          .replace(/Blog Layout/gi, 'Blog API')
          .replace(/Landing Page/gi, 'Introduction API')
          .replace(/Portfolio Website/gi, 'Portfolio API'),
        description: `Backend: ${(project.description || project.title)
          .replace(/HTML document|web page|website|HTML page|page/gi, 'API endpoints')
          .replace(/HTML|CSS/gi, 'JSON responses')
          .replace(/components/gi, 'API endpoints')
          .replace(/styling/gi, 'response formatting')}`,
        skills: ['Node.js', 'Express', 'REST API', 'JSON'],
        requirements: project.requirements ? project.requirements.map(req => 
          req.replace(/HTML document|web page|website|HTML page|page/gi, 'API endpoints')
            .replace(/HTML|CSS/gi, 'JSON')
            .replace(/component library|components/gi, 'API endpoints')
            .replace(/card components/gi, 'card data endpoints')
            .replace(/dashboard/gi, 'dashboard API')
            .replace(/layout/gi, 'API structure')
            .replace(/landing page/gi, 'introduction API')
            .replace(/portfolio website/gi, 'portfolio API')
            .replace(/Create|Build|Design/gi, 'Implement')
            .replace(/styling|styles/gi, 'response format')
        ) : ['Create API endpoints', 'Return JSON responses', 'Handle requests'],
        mustHave: [
          'Valid Express routes',
          'JSON response format',
          'Error handling',
          'Clean code structure',
          'Proper API organization',
        ],
        buildsOn: project.buildsOn || [],
      },
      'systems-engineering': {
        title: project.title
          .replace(/HTML|CSS|Web|Page|Website/gi, 'WordPress')
          .replace(/Component Library/gi, 'Custom Post Types')
          .replace(/Dashboard Layout/gi, 'WordPress Dashboard')
          .replace(/Blog Layout/gi, 'WordPress Blog')
          .replace(/Landing Page/gi, 'WordPress Landing Page')
          .replace(/Portfolio Website/gi, 'WordPress Portfolio'),
        description: `Systems Engineering: ${(project.description || project.title)
          .replace(/HTML document|web page|website|HTML page/gi, 'WordPress site')
          .replace(/HTML|CSS/gi, 'WordPress')
          .replace(/components/gi, 'WordPress pages/posts')
          .replace(/styling/gi, 'WordPress theme')}`,
        skills: ['WordPress', 'Pages', 'Content Management', 'Themes'],
        requirements: project.requirements ? project.requirements.map(req => 
          req.replace(/HTML document|web page|website|HTML page/gi, 'WordPress site')
            .replace(/HTML|CSS/gi, 'WordPress')
            .replace(/component library|components/gi, 'WordPress pages/posts')
            .replace(/card components/gi, 'custom post types')
            .replace(/dashboard/gi, 'WordPress dashboard')
            .replace(/layout/gi, 'WordPress theme layout')
            .replace(/landing page/gi, 'WordPress landing page')
            .replace(/portfolio website/gi, 'WordPress portfolio site')
            .replace(/Create|Build/gi, 'Set up in WordPress')
            .replace(/CSS styling|CSS styles/gi, 'WordPress theme styles')
        ) : ['Set up WordPress pages', 'Configure content', 'Manage structure'],
        mustHave: [
          'Valid WordPress structure',
          'Proper page organization',
          'Semantic HTML output',
          'Clean theme structure',
          'Accessible content',
        ],
        buildsOn: project.buildsOn || [],
      },
    };
    return enhanceProjectWithDaySpecificContent(convertedProject, calculatedDayNumber, weekNum, dayIndex);
  }

  // Default fallback - return discipline-specific structure with day-specific enhancements
  const fallbackProject = {
    frontend: {
      title: `Frontend Project: ${getSoftwareEngineeringTheme(weekNum)}`,
      description: `Frontend project for Week ${weekNum}, Day ${dayIndex + 1}`,
      requirements: ["Complete frontend project requirements"],
    },
    mobile: {
      title: `Mobile Project: ${getSoftwareEngineeringTheme(weekNum)}`,
      description: `Mobile project for Week ${weekNum}, Day ${dayIndex + 1}`,
      requirements: ["Complete mobile project requirements"],
    },
    backend: {
      title: `Backend Project: ${getSoftwareEngineeringTheme(weekNum)}`,
      description: `Backend project for Week ${weekNum}, Day ${dayIndex + 1}`,
      requirements: ["Complete backend project requirements"],
    },
    'systems-engineering': {
      title: `Systems Engineering Project: ${getSoftwareEngineeringTheme(weekNum)}`,
      description: `Systems Engineering project for Week ${weekNum}, Day ${dayIndex + 1}`,
      requirements: ["Complete systems engineering project requirements"],
    },
  };
  return enhanceProjectWithDaySpecificContent(fallbackProject, calculatedDayNumber, weekNum, dayIndex);
}

// Enhance project content with day-specific details to make each day unique and meaningful
function enhanceProjectWithDaySpecificContent(project, dayNumber, weekNum, dayIndex) {
  const phase = Math.ceil(dayNumber / 15); // 15-day phases
  const dayInPhase = ((dayNumber - 1) % 15) + 1;
  const progressPercent = ((dayNumber / 90) * 100).toFixed(1);
  
  // Enhance each discipline's project with day-specific context
  const disciplines = ['frontend', 'mobile', 'backend', 'systems-engineering'];
  const enhancedProject = { ...project };
  
  disciplines.forEach(discipline => {
    if (enhancedProject[discipline]) {
      const discProject = enhancedProject[discipline];
      
      // Add day-specific context to description
      const dayContext = `\n\n📅 Day ${dayNumber} Focus: This project builds on your journey progress (${progressPercent}% complete). `;
      const phaseContext = `You're on Day ${dayInPhase} of Phase ${phase} (${phase === 1 ? 'Fundamentals' : phase === 2 ? 'Intermediate' : 'Advanced'} level).`;
      const reviewContext = dayNumber > 1 ? ` Review Day ${Math.max(1, dayNumber - 7)} to Day ${dayNumber - 1} before starting.` : '';
      
      enhancedProject[discipline] = {
        ...discProject,
        description: (discProject.description || '') + dayContext + phaseContext + reviewContext,
        dayNumber,
        phase,
        dayInPhase,
        progressPercent: parseFloat(progressPercent),
        // Add day-specific objectives
        daySpecificObjectives: [
          `Complete Day ${dayNumber} project requirements`,
          `Build on concepts from Day ${Math.max(1, dayNumber - 1)}`,
          `Apply ${phase === 1 ? 'fundamental' : phase === 2 ? 'intermediate' : 'advanced'} ${discipline} skills`,
          `Track progress: ${progressPercent}% of journey complete`,
        ],
      };
    }
  });
  
  // If project is not discipline-specific, add day-specific metadata
  if (!enhancedProject.frontend && !enhancedProject.mobile && !enhancedProject.backend && !enhancedProject['systems-engineering']) {
    enhancedProject.dayNumber = dayNumber;
    enhancedProject.phase = phase;
    enhancedProject.dayInPhase = dayInPhase;
    enhancedProject.progressPercent = parseFloat(progressPercent);
  }
  
  return enhancedProject;
}

function getSoftwareEngineeringResources(weekNum, dayIndex) {
  // Complete resource mapping from LEARNING-RESOURCES.md
  const resourceMap = {
    1: {
      0: [
        {
          title: "MDN HTML5 Elements",
          url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Element",
          time: "30 min",
        },
        {
          title: "MDN Semantic HTML Guide",
          url: "https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantic_elements",
          time: "20 min",
        },
        {
          title: "HTML5 Doctor",
          url: "http://html5doctor.com/",
          time: "20 min",
        },
        {
          title: "MDN CSS Basics",
          url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics",
          time: "30 min",
        },
      ],
      1: [
        {
          title: "MDN Box Model",
          url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model",
          time: "25 min",
        },
        {
          title: "MDN CSS Selectors",
          url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors",
          time: "20 min",
        },
        {
          title: "Specificity Calculator",
          url: "https://specificity.keegan.st/",
          time: "10 min",
        },
      ],
      2: [
        {
          title: "CSS-Tricks Flexbox Guide",
          url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
          time: "40 min",
        },
        {
          title: "Flexbox Froggy",
          url: "https://flexboxfroggy.com/",
          time: "30 min",
        },
        {
          title: "MDN Flexbox",
          url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout",
          time: "20 min",
        },
      ],
      3: [
        {
          title: "CSS-Tricks Grid Guide",
          url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
          time: "40 min",
        },
        {
          title: "Grid Garden",
          url: "https://cssgridgarden.com/",
          time: "30 min",
        },
        {
          title: "MDN CSS Grid",
          url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout",
          time: "20 min",
        },
      ],
      4: [
        {
          title: "MDN Responsive Design",
          url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design",
          time: "30 min",
        },
        {
          title: "MDN Media Queries",
          url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries",
          time: "20 min",
        },
        {
          title: "CSS-Tricks Container Queries",
          url: "https://css-tricks.com/a-complete-guide-to-css-container-queries/",
          time: "20 min",
        },
      ],
      5: [
        {
          title: "Tailwind CSS Documentation",
          url: "https://tailwindcss.com/docs",
          time: "40 min",
        },
        {
          title: "Tailwind Installation Guide",
          url: "https://tailwindcss.com/docs/installation",
          time: "20 min",
        },
        {
          title: "Tailwind Configuration",
          url: "https://tailwindcss.com/docs/configuration",
          time: "20 min",
        },
      ],
      6: [
        {
          title: "MDN CSS Animations",
          url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations",
          time: "30 min",
        },
        {
          title: "Web.dev Performance",
          url: "https://web.dev/learn-core-web-vitals/",
          time: "30 min",
        },
      ],
    },
    2: {
      0: [
        {
          title: "MDN JavaScript Guide",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
          time: "30 min",
        },
        {
          title: "MDN let/const",
          url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let",
          time: "20 min",
        },
        {
          title: "JavaScript.info",
          url: "https://javascript.info/",
          time: "40 min",
        },
      ],
    },
  };

  return resourceMap[weekNum]?.[dayIndex] || [];
}

function getSoftwareEngineeringQuizzes(weekNum, dayIndex) {
  const quizzes = {
    1: {
      0: [
        {
          category: "Foundation",
          question: "What is the purpose of the `<!DOCTYPE html>` declaration?",
          options: [
            "It tells the browser which version of HTML to use",
            "It's required for HTML5 validation",
            "It enables modern browser features",
            "All of the above",
          ],
          correctAnswer: 3,
          explanation:
            "The DOCTYPE declaration tells browsers which HTML version to use, is required for validation, and enables modern features.",
        },
        {
          category: "Structure",
          question:
            "Which HTML5 element should be used for the main content of a page?",
          options: ['<div class="main">', "<main>", "<section>", "<article>"],
          correctAnswer: 1,
          explanation:
            "The <main> element is the semantic HTML5 element specifically designed for the main content of a page.",
        },
        {
          category: "Advanced",
          question: "What is the difference between <article> and <section>?",
          options: [
            "<article> is for standalone content, <section> is for thematic grouping",
            "They are interchangeable",
            "<section> must always contain <article>",
            "<article> is only for blog posts",
          ],
          correctAnswer: 0,
          explanation:
            "<article> represents standalone, independently distributable content, while <section> is for thematic grouping of content.",
        },
        {
          category: "Integration",
          question:
            "How do you create an accessible link that opens in a new tab?",
          options: [
            '<a href="url" target="_blank">',
            '<a href="url" target="_blank" rel="noopener noreferrer">',
            '<a href="url" newtab>',
            '<a href="url" target="new">',
          ],
          correctAnswer: 1,
          explanation:
            'Using rel="noopener noreferrer" prevents security vulnerabilities and is the accessible way to open links in new tabs.',
        },
        {
          category: "Applied Reasoning",
          question: "Why is semantic HTML important for SEO and accessibility?",
          options: [
            "Search engines understand content structure better",
            "Screen readers can navigate pages more effectively",
            "It improves code maintainability",
            "All of the above",
          ],
          correctAnswer: 3,
          explanation:
            "Semantic HTML benefits SEO, accessibility, and code maintainability - making it essential for modern web development.",
        },
      ],
      1: [
        {
          category: "Foundation",
          question: "What is the default value of the `box-sizing` property?",
          options: ["border-box", "content-box", "padding-box", "margin-box"],
          correctAnswer: 1,
          explanation:
            "The default box-sizing is content-box, which means width/height only includes content, not padding or border.",
        },
        {
          category: "Structure",
          question:
            "Which CSS unit is relative to the root element's font size?",
          options: ["em", "rem", "px", "%"],
          correctAnswer: 1,
          explanation:
            "rem (root em) is relative to the root element's font size, making it more predictable than em.",
        },
        {
          category: "Advanced",
          question:
            "What is the specificity of the selector `.card .title:hover`?",
          options: ["21", "22", "30", "31"],
          correctAnswer: 1,
          explanation:
            "Two classes (10 each) + one pseudo-class (1) + one element (1) = 22 specificity points.",
        },
        {
          category: "Integration",
          question: "How do you center an element horizontally using CSS?",
          options: [
            "margin: 0 auto; (for block elements)",
            "text-align: center; (for inline elements)",
            "Both a and b depending on element type",
            "display: center;",
          ],
          correctAnswer: 2,
          explanation:
            "Block elements use margin: 0 auto, while inline elements use text-align: center.",
        },
        {
          category: "Applied Reasoning",
          question: "Why should you use `rem` instead of `px` for font sizes?",
          options: [
            "Better accessibility (respects user font size preferences)",
            "Easier to scale entire design",
            "More maintainable code",
            "All of the above",
          ],
          correctAnswer: 3,
          explanation:
            "rem units provide better accessibility, scalability, and maintainability compared to fixed px values.",
        },
      ],
      2: [
        {
          category: "Foundation",
          question: "What is the default `flex-direction` value?",
          options: ["column", "row", "row-reverse", "column-reverse"],
          correctAnswer: 1,
          explanation:
            "The default flex-direction is row, meaning items are laid out horizontally.",
        },
        {
          category: "Structure",
          question: "Which property centers items along the main axis?",
          options: [
            "align-items",
            "justify-content",
            "align-content",
            "align-self",
          ],
          correctAnswer: 1,
          explanation:
            "justify-content controls alignment along the main axis (horizontal by default).",
        },
        {
          category: "Advanced",
          question: "What does `flex: 1 1 0` mean?",
          options: [
            "Grow: 1, Shrink: 1, Basis: 0",
            "Grow: 0, Shrink: 1, Basis: 1",
            "All items equal size",
            "Both a and c",
          ],
          correctAnswer: 3,
          explanation:
            "flex: 1 1 0 means grow 1, shrink 1, basis 0, which makes all items equal size and flexible.",
        },
        {
          category: "Integration",
          question: "How do you create equal-height columns with Flexbox?",
          options: [
            "Set height: 100% on items",
            "Use align-items: stretch (default)",
            "Set fixed heights",
            "Use flex-basis: auto",
          ],
          correctAnswer: 1,
          explanation:
            "align-items: stretch is the default and automatically makes all flex items the same height.",
        },
        {
          category: "Applied Reasoning",
          question: "When should you use Flexbox over CSS Grid?",
          options: [
            "One-dimensional layouts (row OR column)",
            "Two-dimensional layouts (row AND column)",
            "Always use Flexbox",
            "Always use Grid",
          ],
          correctAnswer: 0,
          explanation:
            "Flexbox is ideal for one-dimensional layouts, while Grid is better for two-dimensional layouts.",
        },
      ],
      3: [
        {
          category: "Foundation",
          question: "What does `1fr` represent in CSS Grid?",
          options: [
            "1 pixel",
            "1 fraction of available space",
            "1 rem",
            "1 em",
          ],
          correctAnswer: 1,
          explanation:
            "1fr represents one fraction of the available space in the grid container.",
        },
        {
          category: "Structure",
          question: "How do you make a grid item span 3 columns?",
          options: [
            "grid-column: span 3;",
            "grid-column: 1 / 4;",
            "Both a and b",
            "grid-column: 3;",
          ],
          correctAnswer: 2,
          explanation:
            "Both grid-column: span 3 and grid-column: 1 / 4 will make an item span 3 columns.",
        },
        {
          category: "Advanced",
          question: "What's the difference between `auto-fit` and `auto-fill`?",
          options: [
            "auto-fit collapses empty tracks, auto-fill keeps them",
            "They're the same",
            "auto-fill is for rows, auto-fit for columns",
            "auto-fit is deprecated",
          ],
          correctAnswer: 0,
          explanation:
            "auto-fit collapses empty tracks when there aren't enough items, while auto-fill keeps them.",
        },
        {
          category: "Integration",
          question: "When should you use Grid over Flexbox?",
          options: [
            "Two-dimensional layouts",
            "Complex overlapping layouts",
            "When you need named areas",
            "All of the above",
          ],
          correctAnswer: 3,
          explanation:
            "Grid excels at two-dimensional layouts, overlapping items, and named grid areas.",
        },
        {
          category: "Applied Reasoning",
          question:
            "How do `minmax()` and `auto-fit` create responsive grids without media queries?",
          options: [
            "They automatically adjust based on container size",
            "They use JavaScript",
            "They require CSS variables",
            "They don't work without media queries",
          ],
          correctAnswer: 0,
          explanation:
            "minmax() and auto-fit work together to automatically create responsive grids based on container size.",
        },
      ],
      4: [
        {
          category: "Foundation",
          question: "What does the viewport meta tag do?",
          options: [
            "Sets the page width",
            "Tells mobile browsers to use device width",
            "Hides the address bar",
            "Enables responsive design",
          ],
          correctAnswer: 1,
          explanation:
            "The viewport meta tag tells mobile browsers to use the device width instead of a fixed desktop width.",
        },
        {
          category: "Structure",
          question: "What is the mobile-first approach?",
          options: [
            "Design for mobile, then enhance for larger screens",
            "Design for desktop, then shrink for mobile",
            "Design separately for each device",
            "Use only mobile styles",
          ],
          correctAnswer: 0,
          explanation:
            "Mobile-first means designing for mobile devices first, then adding enhancements for larger screens.",
        },
        {
          category: "Advanced",
          question: "What does `clamp(1rem, 2.5vw, 2rem)` do?",
          options: [
            "Sets font size between 1rem and 2rem based on viewport",
            "Clamps values to 1rem minimum",
            "Uses 2.5vw as preferred value",
            "All of the above",
          ],
          correctAnswer: 3,
          explanation:
            "clamp() sets a minimum (1rem), preferred (2.5vw), and maximum (2rem) value, creating fluid typography.",
        },
        {
          category: "Integration",
          question:
            "How do you create a responsive grid without media queries?",
          options: [
            "Use Flexbox with flex-wrap",
            "Use Grid with auto-fit/auto-fill",
            "Use JavaScript",
            "It's not possible",
          ],
          correctAnswer: 1,
          explanation:
            "CSS Grid with auto-fit/auto-fill and minmax() can create responsive layouts without media queries.",
        },
        {
          category: "Applied Reasoning",
          question: "Why is mobile-first better than desktop-first?",
          options: [
            "Most users are on mobile",
            "Easier to enhance than to reduce",
            "Better performance",
            "All of the above",
          ],
          correctAnswer: 3,
          explanation:
            "Mobile-first is better because most users are mobile, it's easier to enhance, and it performs better.",
        },
      ],
      5: [
        {
          category: "Foundation",
          question: "What is the utility-first approach?",
          options: [
            "Writing utility functions in JavaScript",
            "Using small, single-purpose CSS classes",
            "Creating reusable components",
            "Using CSS frameworks",
          ],
          correctAnswer: 1,
          explanation:
            "Utility-first means using small, single-purpose CSS classes instead of writing custom CSS.",
        },
        {
          category: "Structure",
          question:
            "How do you make a Tailwind class apply only on large screens?",
          options: [
            "lg:class-name",
            "@media (min-width: 1024px) { .class-name }",
            "class-name lg",
            "responsive:lg:class-name",
          ],
          correctAnswer: 0,
          explanation:
            "Tailwind uses responsive prefixes like lg: to apply classes only at certain breakpoints.",
        },
        {
          category: "Advanced",
          question: "What does `@apply` do in Tailwind?",
          options: [
            "Applies Tailwind utilities in CSS",
            "Imports Tailwind styles",
            "Extends Tailwind config",
            "Creates custom utilities",
          ],
          correctAnswer: 0,
          explanation:
            "@apply allows you to use Tailwind utility classes within your CSS files.",
        },
        {
          category: "Integration",
          question: "How do you customize Tailwind's default theme?",
          options: [
            "Edit node_modules",
            "Use tailwind.config.js with extend or theme",
            "Override CSS variables",
            "Use !important",
          ],
          correctAnswer: 1,
          explanation:
            "Tailwind is customized through tailwind.config.js using the extend or theme properties.",
        },
        {
          category: "Applied Reasoning",
          question:
            "When should you extract Tailwind classes into a component?",
          options: [
            "When classes are repeated 3+ times",
            "Never, always use utilities",
            "When creating complex patterns",
            "Both a and c",
          ],
          correctAnswer: 3,
          explanation:
            "Extract repeated or complex patterns into components for better maintainability.",
        },
      ],
    },
    2: {
      0: [
        {
          category: "Foundation",
          question: "What is the difference between `let` and `const`?",
          options: [
            "let is for numbers, const for strings",
            "const cannot be reassigned, let can",
            "They're the same",
            "let is deprecated",
          ],
          correctAnswer: 1,
          explanation:
            "const cannot be reassigned after declaration, while let can be reassigned.",
        },
        {
          category: "Structure",
          question: 'What is the result of `"5" + 3` in JavaScript?',
          options: ["8", '"53"', "Error", "undefined"],
          correctAnswer: 1,
          explanation:
            'JavaScript performs type coercion, converting the number to a string and concatenating: "53".',
        },
        {
          category: "Advanced",
          question: "What is hoisting in JavaScript?",
          options: [
            "Moving variables to top of scope",
            "Variable declarations are processed before code execution",
            "Only works with var",
            "Both b and c",
          ],
          correctAnswer: 3,
          explanation:
            "Hoisting means declarations are processed before execution, and it works differently with var vs let/const.",
        },
        {
          category: "Integration",
          question: "Why should you use `===` instead of `==`?",
          options: [
            "=== checks value and type, == only value",
            "=== is faster",
            "== is deprecated",
            "They're the same",
          ],
          correctAnswer: 0,
          explanation:
            "=== (strict equality) checks both value and type, preventing unexpected type coercion bugs.",
        },
        {
          category: "Applied Reasoning",
          question: "When should you use `const` vs `let`?",
          options: [
            "Always use const unless you need to reassign",
            "Always use let",
            "Use const for objects, let for primitives",
            "It doesn't matter",
          ],
          correctAnswer: 0,
          explanation:
            "Best practice is to use const by default, and only use let when you need to reassign the variable.",
        },
      ],
    },
  };

  return quizzes[weekNum]?.[dayIndex] || [];
}

function getSoftwareEngineeringMonetization(weekNum, dayIndex) {
  const monetizationTasks = {
    1: {
      0: {
        task: "Create a simple HTML template that could be sold on ThemeForest or similar marketplace.",
        actionItems: [
          "Build a clean, professional single-page template",
          "Document it with comments",
          "Create a README explaining the structure",
          "Take screenshots for portfolio",
          "List it on GitHub with proper description",
        ],
      },
      1: {
        task: "Package your card components as a reusable CSS component library.",
        actionItems: [
          "Create a component showcase page",
          "Document each component with usage examples",
          "Create a GitHub repository for the component library",
          "Write a blog post or social media thread explaining the components",
          "Consider creating a CodePen collection",
        ],
      },
    },
  };

  const task = monetizationTasks[weekNum]?.[dayIndex];
  if (task) {
    return task;
  }

  return {
    task: `Monetization task for ${getSoftwareEngineeringTheme(weekNum)}`,
    actionItems: ["Complete monetization action items"],
  };
}

function getSoftwareEngineeringSocialPosting(weekNum, dayIndex) {
  const posts = {
    1: {
      0: {
        text: "Day 1 of my 90-day software engineering journey complete! 🚀 Just built my first semantic HTML5 page from scratch. Learning the foundations that will power everything else. #WebDev #HTML5 #90DayChallenge #CodeNewbie",
        platforms: ["Twitter/X", "LinkedIn", "Dev.to", "GitHub"],
        include: [
          "Screenshot of your HTML page in browser",
          "Code snippet showing semantic structure",
          "Link to GitHub repository",
        ],
      },
      1: {
        text: "Day 2: CSS mastery in progress! 🎨 Built a component library with 3 card variations. Understanding the box model and specificity is game-changing. Every pixel matters! #CSS #WebDesign #90DayChallenge",
        platforms: ["Twitter/X", "LinkedIn", "Dev.to", "GitHub"],
      },
      2: {
        text: "Day 3: Flexbox unlocked! 💪 Built a responsive dashboard layout. No more float hacks - Flexbox makes layouts intuitive. Playing Flexbox Froggy helped a lot! #Flexbox #CSS #WebDev",
        platforms: ["Twitter/X", "LinkedIn", "Dev.to", "GitHub"],
      },
    },
  };

  const post = posts[weekNum]?.[dayIndex];
  if (post) {
    return post;
  }

  return {
    text: `Day ${
      dayIndex + 1
    } of my 90-day software engineering journey! Progress update coming soon. #WebDev #90DayChallenge`,
    platforms: ["Twitter/X", "LinkedIn", "GitHub"],
  };
}

// Generate daily cumulative quiz combining all skills learned that day
function getDailyCumulativeQuiz(weekNum, dayIndex, dayNumber) {
  // Get all disciplines covered today
  const disciplineRotation = getDisciplineRotation(weekNum, dayIndex);
  const disciplines = disciplineRotation.allDisciplines || [];

  // Collect quizzes from all skills learned today
  const allQuizzes = [];

  // Get quizzes for each discipline's skills
  disciplines.forEach((discipline) => {
    const disciplineRoadmap = getDisciplineRoadmap(discipline);
    disciplineRoadmap.forEach((skill) => {
      // Get skill-specific quiz
      const skillQuiz = getSkillQuiz(skill.skill);
      if (skillQuiz && skillQuiz.length > 0) {
        allQuizzes.push(
          ...skillQuiz.map((q) => ({
            ...q,
            skill: skill.skill,
            discipline: discipline,
          }))
        );
      }
    });
  });

  // Also include the existing daily quiz if available
  const existingQuiz = getSoftwareEngineeringQuizzes(weekNum, dayIndex);
  if (existingQuiz && existingQuiz.length > 0) {
    allQuizzes.push(
      ...existingQuiz.map((q) => ({
        ...q,
        skill: "Daily Review",
        discipline: "General",
      }))
    );
  }

  // If no quizzes found, create a default review quiz
  if (allQuizzes.length === 0) {
    allQuizzes.push({
      category: "Review",
      question: `What did you learn today in ${disciplines.join(", ")}?`,
      options: [
        "Review your notes and reflect on today's learning",
        "Practice the concepts you learned",
        "Build a small project using today's skills",
        "All of the above",
      ],
      correctAnswer: 3,
      explanation:
        "The best way to reinforce learning is to review, practice, and build!",
      skill: "Daily Reflection",
      discipline: "General",
    });
  }

  // Shuffle and select 8-10 questions for daily quiz
  const shuffled = allQuizzes.sort(() => Math.random() - 0.5);
  const dailyQuiz = shuffled.slice(0, Math.min(10, shuffled.length));

  return {
    title: `Day ${dayNumber} Cumulative Quiz`,
    description: `Test your understanding of all concepts learned today across ${disciplines.join(
      ", "
    )}. This quiz combines knowledge from all disciplines you studied today.`,
    questions: dailyQuiz,
    totalQuestions: dailyQuiz.length,
    passingScore: Math.ceil(dailyQuiz.length * 0.7), // 70% to pass
    timeLimit: 15, // minutes
    cumulative: true,
    disciplines: disciplines,
  };
}

// Generate daily practical assessment that builds on previous days
function getDailyPracticalAssessment(weekNum, dayIndex, dayNumber) {
  // Get today's project
  let todayProject = getSoftwareEngineeringProject(weekNum, dayIndex);

  // If no project exists for this day, create a default one
  if (!todayProject || !todayProject.title) {
    const disciplineRotation = getDisciplineRotation(weekNum, dayIndex);
    const disciplines = disciplineRotation.allDisciplines || [];

    todayProject = {
      title: `Day ${dayNumber} Practice Project`,
      description: `Apply today's learning by building a practical project. This project will build on your previous work.`,
      skills: disciplines,
      requirements: [
        "Use all concepts learned today",
        "Build something practical and useful",
        "Apply best practices",
        "Write clean, readable code",
      ],
      mustHave: ["Working code", "Clean structure", "Proper comments"],
    };
  }

  // Get previous days' projects to build upon
  const previousProjects = [];

  // If today's project has buildsOn, use those specific days
  if (todayProject?.buildsOn && todayProject.buildsOn.length > 0) {
    todayProject.buildsOn.forEach((prevDay) => {
      const prevWeek = Math.ceil(prevDay / 7);
      const prevDayIndex = (prevDay - 1) % 7;
      const prevProject = getSoftwareEngineeringProject(prevWeek, prevDayIndex);
      if (prevProject && prevProject.title) {
        previousProjects.push({
          day: prevDay,
          title: prevProject.title,
          skills: prevProject.skills || [],
        });
      }
    });
  } else if (dayNumber > 1) {
    // Otherwise, get the most recent previous days (last 3-5 days)
    const daysToInclude = Math.min(5, dayNumber - 1);
    for (let i = daysToInclude; i >= 1; i--) {
      const prevDay = dayNumber - i;
      const prevWeek = Math.ceil(prevDay / 7);
      const prevDayIndex = (prevDay - 1) % 7;
      const prevProject = getSoftwareEngineeringProject(prevWeek, prevDayIndex);
      if (prevProject && prevProject.title) {
        previousProjects.push({
          day: prevDay,
          title: prevProject.title,
          skills: prevProject.skills || [],
        });
      }
    }
  }

  // Determine what skills were learned today
  const disciplineRotation = getDisciplineRotation(weekNum, dayIndex);
  const disciplines = disciplineRotation.allDisciplines || [];
  const todaySkills = [];

  disciplines.forEach((discipline) => {
    const roadmap = getDisciplineRoadmap(discipline);
    roadmap.forEach((skill) => {
      todaySkills.push({
        skill: skill.skill,
        discipline: discipline,
        description: skill.description,
      });
    });
  });

  // Create cumulative assessment
  const assessment = {
    title: `Day ${dayNumber} Practical Assessment`,
    description:
      dayNumber === 1
        ? `Build your first project using today's learning. This will be the foundation for future projects!`
        : `Build a project that combines today's learning with previous days' work. Each day builds on the last!`,
    dayNumber: dayNumber,
    todayProject: todayProject,
    previousProjects: previousProjects,
    todaySkills: todaySkills,
    cumulative: dayNumber > 1, // Only cumulative if not day 1
    requirements: [
      ...(todayProject?.requirements || []),
      ...(previousProjects.length > 0
        ? [
            ...previousProjects
              .slice(0, 3)
              .map((p) => `Integrate features from Day ${p.day}: ${p.title}`),
            `Ensure all previous projects' features still work`,
            `Use concepts learned in previous days where applicable`,
            `Build incrementally - add to what you've already created`,
          ]
        : []),
    ],
    mustHave: [
      ...(todayProject?.mustHave || []),
      ...(dayNumber > 1
        ? [
            "Code builds on previous days' work",
            "All previous features still work",
            "Incremental improvement from previous days",
          ]
        : []),
      "Clean, maintainable code structure",
      "Working, functional project",
    ],
    stretchGoals: [
      ...(dayNumber > 1
        ? [
            "Add a new feature that combines multiple previous concepts",
            "Refactor previous code to use today's new skills",
            "Create reusable components/functions from previous work",
          ]
        : [
            "Add extra features beyond requirements",
            "Make it visually appealing",
            "Add interactive elements",
          ]),
    ],
    submission: {
      checklist: [
        "All requirements met",
        ...(dayNumber > 1 ? ["Previous day's features still functional"] : []),
        "Code is clean and commented",
        "Project runs without errors",
        "README.md with setup instructions",
        "Git repository with commit history",
      ],
      deliverables: [
        "Working project",
        "Source code (GitHub repo)",
        "Screenshots/demo video",
        "Brief reflection on what you learned",
        ...(dayNumber > 1 ? ["Comparison with previous days' projects"] : []),
      ],
    },
    buildingOn:
      previousProjects.length > 0
        ? {
            message: `This project builds on ${
              previousProjects.length
            } previous ${
              previousProjects.length === 1 ? "project" : "projects"
            }`,
            projects: previousProjects,
          }
        : null,
  };

  return assessment;
}

// Get platform-specific sessions for dual brand journey
function getPlatformSessions(weekNum, dayIndex) {
  // Platform sessions are most relevant during content creation weeks (Weeks 2-5, 8-10)
  if ((weekNum >= 2 && weekNum <= 5) || (weekNum >= 8 && weekNum <= 10)) {
    const platforms = [
      "instagram",
      "tiktok",
      "x",
      "threads",
      "facebook",
      "linkedin",
      "youtube",
    ];

    // Rotate platforms throughout the week
    const dayPlatforms = [];
    if (dayIndex === 0) dayPlatforms.push("instagram", "linkedin");
    if (dayIndex === 1) dayPlatforms.push("x", "threads");
    if (dayIndex === 2) dayPlatforms.push("tiktok", "youtube");
    if (dayIndex === 3) dayPlatforms.push("facebook", "linkedin");
    if (dayIndex === 4) dayPlatforms.push("instagram", "x");
    if (dayIndex === 5) dayPlatforms.push("youtube", "tiktok");
    if (dayIndex === 6) dayPlatforms.push("threads", "facebook");

    return {
      platforms: dayPlatforms,
      focus: weekNum <= 5 ? "Content Creation" : "Content Optimization",
      brands: ["_ryxen.oo7", "_richman.oo7"],
      notes: `Plan and create content for ${dayPlatforms
        .join(", ")
        .toUpperCase()} for both _ryxen.oo7 and _richman.oo7 brands.`,
    };
  }

  return null;
}

// Get discipline-specific reflection questions based on day number and component being built
function getSoftwareEngineeringReflection(weekNum, dayIndex, dayNumber = null, discipline = null) {
  // Calculate dayNumber if not provided
  const calculatedDayNumber = dayNumber || ((weekNum - 1) * 7 + dayIndex + 1);
  
  // Get the component being built today for this discipline
  const component = discipline ? getProjectComponentForDay(calculatedDayNumber, discipline) : null;
  const componentName = component?.component || "";
  const partName = component?.part || "";
  
  // Calculate day-specific context
  const phase = Math.ceil(calculatedDayNumber / 15);
  const dayInPhase = ((calculatedDayNumber - 1) % 15) + 1;
  const progressPercent = ((calculatedDayNumber / 90) * 100).toFixed(1);
  
  // Helper function to enhance reflection with day-specific context
  const enhanceReflection = (reflection) => ({
    ...reflection,
    questions: [
      ...reflection.questions,
      calculatedDayNumber > 1 ? `How does Day ${calculatedDayNumber}'s work build on Day ${calculatedDayNumber - 1}?` : null,
      `You're ${progressPercent}% through your journey. How does today's progress feel?`,
      calculatedDayNumber % 7 === 0 ? `Week ${weekNum} milestone! What's your biggest win?` : null,
    ].filter(Boolean),
    dayNumber: calculatedDayNumber,
    phase,
    dayInPhase,
    progressPercent: parseFloat(progressPercent),
  });
  
  // Frontend-specific reflections
  if (discipline === "Frontend") {
    if (componentName.includes("Setup") || componentName.includes("Foundation")) {
      return enhanceReflection({
        questions: [
          "What specific React patterns did you implement today that you'll reuse in future components?",
          "How does your project structure compare to production React applications you've seen?",
          "What JavaScript concepts did you apply that made the setup smoother?",
          "What's one thing you'll do differently in your next React project based on today's experience?",
          "How confident do you feel about building the next component? What would increase that confidence?"
        ],
        documentation: [
          "Document your project structure and why you chose it",
          "Note any setup challenges and how you solved them",
          "List React patterns you want to master"
        ],
      });
    }
    if (componentName.includes("Layout") || partName.includes("Layout")) {
      return enhanceReflection({
        questions: [
          "How did you decide between CSS Grid and Flexbox for different layout sections?",
          "What responsive design challenges did you face, and how did you solve them?",
          "How does your component composition approach compare to real-world React apps?",
          "What accessibility considerations did you implement in your layout?",
          "If you were to refactor this layout tomorrow, what would you improve and why?"
        ],
        documentation: [
          "Document your layout decisions and trade-offs",
          "Note responsive breakpoints and why you chose them",
          "List layout patterns you want to explore further"
        ],
      });
    }
    if (componentName.includes("Auth") || partName.includes("Auth")) {
      return enhanceReflection({
        questions: [
          "What security considerations did you implement in your authentication flow?",
          "How does your form validation approach handle edge cases users might encounter?",
          "What would happen if a user tried to submit invalid data? How did you handle that?",
          "How does your auth implementation compare to production authentication systems?",
          "What's one security vulnerability you're aware of and how would you prevent it?"
        ],
        documentation: [
          "Document your authentication flow and security measures",
          "Note validation rules and error handling strategies",
          "List security best practices you want to implement"
        ],
      });
    }
    if (componentName.includes("Dashboard") || componentName.includes("List") || componentName.includes("Detail")) {
      return enhanceReflection({
        questions: [
          "How did you manage state complexity as your component grew? What patterns helped?",
          "What data fetching strategies did you use, and why did you choose them?",
          "How does your component handle loading and error states? Is it user-friendly?",
          "If this component had to handle 10x more data, what would you need to change?",
          "What performance optimizations did you implement, and what's the measurable impact?"
        ],
        documentation: [
          "Document your state management decisions",
          "Note data fetching patterns and error handling",
          "List performance optimizations to explore"
        ],
      });
    }
    if (componentName.includes("Form") || componentName.includes("Modal")) {
      return enhanceReflection({
        questions: [
          "How did you ensure your form provides clear feedback to users at every step?",
          "What edge cases did you consider in your form validation?",
          "How does your modal implementation handle accessibility (keyboard navigation, focus management)?",
          "If a user had a slow connection, how would your form/modal behave?",
          "What user experience improvements could you make to reduce friction?"
        ],
        documentation: [
          "Document form validation rules and user feedback mechanisms",
          "Note accessibility features implemented",
          "List UX improvements to test with real users"
        ],
      });
    }
    // Default Frontend reflection
    return enhanceReflection({
      questions: [
        "What React patterns did you use today that you want to master?",
        "How does your code structure compare to production React applications?",
        "What performance considerations did you implement, and why?",
        "If you were to code review your work, what would you improve?",
        "What's one thing you learned today that will make you a better frontend developer?"
      ],
      documentation: [
        "Document key React patterns and concepts learned",
        "Note code quality improvements to make",
        "List frontend skills to develop further"
      ],
    });
  }
  
  // Mobile-specific reflections
  if (discipline === "Mobile") {
    if (componentName.includes("Setup") || componentName.includes("Foundation")) {
      return enhanceReflection({
        questions: [
          "What differences did you notice between React Native and React web development?",
          "How did you handle platform-specific considerations (iOS vs Android) in your setup?",
          "What challenges did you face with the development environment, and how did you solve them?",
          "How does your mobile app structure compare to production React Native apps?",
          "What's one thing about mobile development that surprised you today?"
        ],
        documentation: [
          "Document platform differences you encountered",
          "Note setup challenges and solutions",
          "List React Native concepts to master"
        ],
      });
    }
    if (componentName.includes("Navigation")) {
      return {
        questions: [
          "How did you design your navigation structure to match user expectations?",
          "What navigation patterns did you implement, and why did you choose them?",
          "How does your navigation handle deep linking and back button behavior?",
          "If a user navigated through your app quickly, would they get lost? How did you prevent that?",
          "What navigation UX improvements would make your app feel more native?"
        ],
        documentation: [
          "Document navigation structure and user flow",
          "Note navigation patterns and their use cases",
          "List mobile navigation best practices to implement"
        ],
      };
    }
    if (componentName.includes("Auth") || componentName.includes("Login")) {
      return {
        questions: [
          "How did you handle secure storage of authentication tokens on mobile devices?",
          "What mobile-specific security considerations did you implement?",
          "How does your mobile auth flow compare to apps you use daily?",
          "What happens if a user loses their device? How is their data protected?",
          "What biometric authentication options could you add to improve UX?"
        ],
        documentation: [
          "Document mobile authentication and security measures",
          "Note token storage and session management",
          "List mobile security best practices to implement"
        ],
      };
    }
    if (componentName.includes("Offline")) {
      return {
        questions: [
          "How does your app behave when connectivity is poor or unavailable?",
          "What data synchronization strategy did you implement, and why?",
          "How do you handle conflicts when data changes both locally and on the server?",
          "What's the user experience when they go offline mid-action?",
          "How would you test offline functionality in a real-world scenario?"
        ],
        documentation: [
          "Document offline architecture and sync strategy",
          "Note data persistence and conflict resolution",
          "List offline-first patterns to explore"
        ],
      };
    }
    // Default Mobile reflection
    return enhanceReflection({
      questions: [
        "What mobile-specific challenges did you encounter today?",
        "How does your mobile implementation compare to native app performance?",
        "What platform differences (iOS/Android) did you need to account for?",
        "If you were to optimize your app for performance, what would you focus on?",
        "What's one mobile development skill you want to master based on today's work?"
      ],
      documentation: [
        "Document mobile-specific learnings and challenges",
        "Note platform differences and solutions",
        "List mobile development skills to develop"
      ],
    });
  }
  
  // Backend-specific reflections
  if (discipline === "Backend") {
    if (componentName.includes("Setup") || componentName.includes("Foundation")) {
      return {
        questions: [
          "What architectural decisions did you make today that will impact your entire API?",
          "How does your project structure support scalability and maintainability?",
          "What middleware did you set up, and why is each one necessary?",
          "How does your backend setup compare to production Node.js applications?",
          "What's one thing you'd change about your setup if you were starting over?"
        ],
        documentation: [
          "Document architectural decisions and their rationale",
          "Note middleware setup and configuration",
          "List backend architecture patterns to explore"
        ],
      };
    }
    if (componentName.includes("Auth") || componentName.includes("Authentication")) {
      return {
        questions: [
          "What security measures did you implement to protect user authentication?",
          "How does your JWT implementation handle token expiration and refresh?",
          "What would happen if someone tried to brute force your login endpoint?",
          "How does your authentication compare to industry standards (OAuth, JWT best practices)?",
          "What additional security layers would you add before deploying to production?"
        ],
        documentation: [
          "Document authentication flow and security measures",
          "Note token management and security considerations",
          "List security best practices to implement"
        ],
      };
    }
    if (componentName.includes("Database") || componentName.includes("CRUD")) {
      return {
        questions: [
          "How did you design your database schema to support future features?",
          "What indexing strategies did you consider for query performance?",
          "How does your CRUD implementation handle concurrent requests?",
          "What would happen if your database had 1 million records? Would your queries still be fast?",
          "What data validation and sanitization did you implement to prevent injection attacks?"
        ],
        documentation: [
          "Document database design decisions and schema",
          "Note query optimization and indexing strategies",
          "List database best practices to implement"
        ],
      };
    }
    if (componentName.includes("API") || componentName.includes("Endpoint")) {
      return {
        questions: [
          "How did you design your API endpoints to be intuitive and RESTful?",
          "What error handling did you implement, and how does it help API consumers?",
          "How does your API handle rate limiting and prevent abuse?",
          "If your API received 1000 requests per second, what would break first?",
          "What API documentation would help other developers use your endpoints effectively?"
        ],
        documentation: [
          "Document API design decisions and endpoint structure",
          "Note error handling and response formats",
          "List API best practices and documentation needs"
        ],
      };
    }
    if (componentName.includes("Security") || componentName.includes("Error")) {
      return {
        questions: [
          "What security vulnerabilities did you identify and how did you address them?",
          "How does your error handling prevent information leakage to potential attackers?",
          "What logging and monitoring would you implement to detect security issues?",
          "How does your security implementation compare to OWASP recommendations?",
          "What's one security risk you're aware of that you haven't addressed yet?"
        ],
        documentation: [
          "Document security measures and vulnerability assessments",
          "Note error handling and logging strategies",
          "List security improvements to implement"
        ],
      };
    }
    // Default Backend reflection
    return enhanceReflection({
      questions: [
        "What backend patterns did you implement today that you'll reuse?",
        "How does your API design compare to production backend systems?",
        "What security considerations did you implement, and why are they critical?",
        "If your API had to handle 10x more traffic, what would you need to change?",
        "What's one backend skill you want to master based on today's challenges?"
      ],
      documentation: [
        "Document backend patterns and architectural decisions",
        "Note security and performance considerations",
        "List backend skills to develop further"
      ],
    });
  }
  
  // Systems Engineering (WordPress) specific reflections
  if (discipline === "Systems Engineering") {
    if (componentName.includes("Setup") || componentName.includes("Foundation")) {
      return {
        questions: [
          "How does your WordPress development environment compare to production setups?",
          "What WordPress development practices did you implement that will save time later?",
          "How did you structure your theme/plugin to be maintainable and scalable?",
          "What WordPress hooks and filters did you use, and why were they the right choice?",
          "If a client needed to update content without breaking your code, how did you ensure that?"
        ],
        documentation: [
          "Document WordPress development environment and structure",
          "Note hooks, filters, and WordPress patterns used",
          "List WordPress development best practices to master"
        ],
      };
    }
    if (componentName.includes("Post Types") || componentName.includes("Custom")) {
      return {
        questions: [
          "How did you design your custom post types to be intuitive for content editors?",
          "What taxonomies did you create, and how do they improve content organization?",
          "How does your custom post type implementation compare to production WordPress sites?",
          "If a client needed to add a new field type, how easy would it be to extend your code?",
          "What WordPress admin UI improvements did you make to enhance the editing experience?"
        ],
        documentation: [
          "Document custom post type and taxonomy design",
          "Note admin UI customizations and user experience",
          "List WordPress customization patterns to explore"
        ],
      };
    }
    if (componentName.includes("Theme") || componentName.includes("Template")) {
      return {
        questions: [
          "How did you structure your theme templates to be maintainable and reusable?",
          "What WordPress template hierarchy patterns did you follow, and why?",
          "How does your theme handle different content types and page layouts?",
          "If a client wanted to change the design, how easy would it be to modify your theme?",
          "What performance optimizations did you implement in your theme?"
        ],
        documentation: [
          "Document theme structure and template hierarchy",
          "Note design patterns and customization options",
          "List theme optimization strategies to implement"
        ],
      };
    }
    if (componentName.includes("Plugin")) {
      return {
        questions: [
          "How did you ensure your plugin doesn't conflict with other plugins or themes?",
          "What WordPress hooks did you use, and why were they the right choice?",
          "How does your plugin handle updates without breaking existing functionality?",
          "If a client deactivated your plugin, would their site still function? How did you ensure that?",
          "What security measures did you implement to protect against common WordPress vulnerabilities?"
        ],
        documentation: [
          "Document plugin architecture and hook usage",
          "Note conflict prevention and update strategies",
          "List WordPress security best practices to implement"
        ],
      };
    }
    if (componentName.includes("User") || componentName.includes("Role")) {
      return {
        questions: [
          "How did you design user roles to balance security and usability?",
          "What capabilities did you assign, and why are they appropriate for each role?",
          "How does your role system prevent unauthorized access to sensitive areas?",
          "If a client needed to add a new user role, how easy would it be to extend your system?",
          "What security considerations did you implement to protect against privilege escalation?"
        ],
        documentation: [
          "Document user role and capability design",
          "Note security measures and access control",
          "List WordPress security patterns to implement"
        ],
      };
    }
    // Default Systems Engineering reflection
    return enhanceReflection({
      questions: [
        "What WordPress development patterns did you use today that you'll reuse?",
        "How does your WordPress implementation compare to production CMS systems?",
        "What security considerations did you implement specific to WordPress?",
        "If a client needed to modify your code, how maintainable is your implementation?",
        "What's one WordPress development skill you want to master based on today's work?"
      ],
      documentation: [
        "Document WordPress patterns and development decisions",
        "Note security and maintainability considerations",
        "List WordPress development skills to develop"
      ],
    });
  }
  
  // Fallback for when discipline is not specified - enhance with day-specific context
  // Note: phase, dayInPhase, and progressPercent are already declared at the top of this function (lines 12217-12219)
  
  return {
    questions: [
      `Day ${calculatedDayNumber} Reflection: What did you learn today that will make you a better developer?`,
      `You're ${progressPercent}% through your journey. How does today's progress compare to Day ${Math.max(1, calculatedDayNumber - 7)}?`,
      `This is Day ${dayInPhase} of Phase ${phase} (${phase === 1 ? 'Fundamentals' : phase === 2 ? 'Intermediate' : 'Advanced'}). What ${phase === 1 ? 'foundational' : phase === 2 ? 'intermediate' : 'advanced'} skills did you practice?`,
      "What was the most challenging aspect, and how did you overcome it?",
      "How does your implementation compare to production code?",
      calculatedDayNumber > 1 ? `How does today's work build on Day ${calculatedDayNumber - 1}'s foundation?` : "What foundation did you establish today?",
      "What would you improve if you had more time?",
      "What's one skill you want to develop further based on today's work?",
      calculatedDayNumber % 7 === 0 ? `Week ${weekNum} Complete! What were your biggest wins this week?` : null,
    ].filter(Boolean), // Remove null questions
    documentation: [
      `Document Day ${calculatedDayNumber} key learnings and challenges`,
      `Note progress: ${progressPercent}% complete, Phase ${phase}`,
      calculatedDayNumber > 1 ? `Compare with Day ${calculatedDayNumber - 1} progress` : "Establish baseline for future comparisons",
      "List skills to develop",
      "Note improvements to make"
    ],
    dayNumber: calculatedDayNumber,
    phase,
    dayInPhase,
    progressPercent: parseFloat(progressPercent),
  };
}

// Export reflection and project component functions
export { getSoftwareEngineeringReflection, getProjectComponentForDay, getDisciplineResources };

// Export function to get journey data
export function getJourneyData(journeyId) {
  switch (journeyId) {
    case "body-transformation":
      return { weeks: bodyTransformationWeeks, journey: journeys[0] };
    case "dual-brand":
      return { weeks: dualBrandWeeks, journey: journeys[1] };
    case "reading":
      return { weeks: readingWeeks, journey: journeys[2] };
    case "writers":
      return { weeks: writersWeeks, journey: journeys[3] };
    case "software-engineering":
      return { weeks: softwareEngineeringWeeks, journey: journeys[4] };
    default:
      return { weeks: [], journey: null };
  }
}

// ==================== QUIZ GENERATOR FUNCTIONS ====================

// Body Transformation Quiz Generator
function getBodyTransformationQuiz(weekNum, dayIndex, dayNumber) {
  const workoutTypes = [
    "Rest & Recovery",
    "Upper Body Strength",
    "Lower Body Strength",
    "Core + Cardio",
    "Functional Full-Body",
    "Mobility & Flexibility",
    "Active Recovery & Basketball",
  ];
  const currentWorkout = workoutTypes[dayIndex] || "General Fitness";

  const questions = [
    {
      category: "Workout Knowledge",
      question: `What is the primary focus of ${currentWorkout}?`,
      options: [
        "Building muscle mass",
        "Improving cardiovascular health",
        "Enhancing flexibility and mobility",
        "Depends on the workout type",
      ],
      correctAnswer: 3,
      explanation: `Each workout type has a specific focus. ${currentWorkout} targets specific fitness goals.`,
    },
    {
      category: "Nutrition",
      question: "What is the recommended protein intake for muscle recovery?",
      options: [
        "0.5g per kg body weight",
        "1.0-1.2g per kg body weight",
        "2.0g per kg body weight",
        "No protein needed",
      ],
      correctAnswer: 1,
      explanation: "1.0-1.2g per kg body weight is optimal for muscle recovery and growth.",
    },
    {
      category: "Form & Safety",
      question: "What is the most important aspect of any exercise?",
      options: [
        "Speed of execution",
        "Weight lifted",
        "Proper form and technique",
        "Number of reps",
      ],
      correctAnswer: 2,
      explanation: "Proper form prevents injury and ensures maximum effectiveness.",
    },
    {
      category: "Recovery",
      question: "How many rest days per week are recommended for optimal recovery?",
      options: [
        "0-1 days",
        "1-2 days",
        "2-3 days",
        "Every day",
      ],
      correctAnswer: 1,
      explanation: "1-2 rest days per week allow muscles to recover and prevent overtraining.",
    },
    {
      category: "Progression",
      question: "What is progressive overload?",
      options: [
        "Increasing weight only",
        "Gradually increasing training stress over time",
        "Doing the same workout every day",
        "Only training when you feel like it",
      ],
      correctAnswer: 1,
      explanation: "Progressive overload means gradually increasing training stress (weight, reps, sets, or intensity) to continue making progress.",
    },
  ];

  return {
    title: `Day ${dayNumber} Fitness Quiz`,
    description: `Test your understanding of ${currentWorkout} and fitness fundamentals.`,
    questions: questions,
    totalQuestions: questions.length,
    passingScore: Math.ceil(questions.length * 0.7), // 70% to pass
    timeLimit: 10, // minutes
  };
}

// Reading Journey Quiz Generator
function getReadingQuiz(weekNum, dayIndex, dayNumber) {
  const questions = [
    {
      category: "Comprehension",
      question: "What is the main benefit of active reading?",
      options: [
        "Reading faster",
        "Better retention and understanding",
        "Finishing books quicker",
        "Impressing others",
      ],
      correctAnswer: 1,
      explanation: "Active reading improves retention and understanding by engaging with the material.",
    },
    {
      category: "Application",
      question: "How should you apply what you read?",
      options: [
        "Memorize everything",
        "Take notes and implement key concepts",
        "Read multiple times",
        "Share on social media only",
      ],
      correctAnswer: 1,
      explanation: "Taking notes and implementing key concepts helps turn knowledge into action.",
    },
    {
      category: "Reflection",
      question: "Why is reflection important after reading?",
      options: [
        "It's not necessary",
        "It helps internalize and connect ideas",
        "It takes too much time",
        "Only for academic reading",
      ],
      correctAnswer: 1,
      explanation: "Reflection helps internalize concepts and connect them to your life and goals.",
    },
    {
      category: "Consistency",
      question: "What is the best reading strategy?",
      options: [
        "Reading only when motivated",
        "Consistent daily reading, even if short",
        "Reading entire books in one sitting",
        "Only reading summaries",
      ],
      correctAnswer: 1,
      explanation: "Consistent daily reading, even in small amounts, builds habits and knowledge over time.",
    },
  ];

  return {
    title: `Day ${dayNumber} Reading Quiz`,
    description: `Test your understanding of today's reading material and reading strategies.`,
    questions: questions,
    totalQuestions: questions.length,
    passingScore: Math.ceil(questions.length * 0.7),
    timeLimit: 8, // minutes
  };
}

// Dual Brand Quiz Generator
function getDualBrandQuiz(weekNum, dayIndex, dayNumber) {
  const questions = [
    {
      category: "Brand Strategy",
      question: "What is the key to building a personal brand?",
      options: [
        "Posting every day",
        "Consistency and value delivery",
        "Having many followers",
        "Using trending hashtags only",
      ],
      correctAnswer: 1,
      explanation: "Consistency and delivering value are the foundations of a strong personal brand.",
    },
    {
      category: "Content Creation",
      question: "What makes content engaging?",
      options: [
        "Length of posts",
        "Value, authenticity, and relevance",
        "Number of hashtags",
        "Posting at peak times only",
      ],
      correctAnswer: 1,
      explanation: "Value, authenticity, and relevance create engaging content that resonates with your audience.",
    },
    {
      category: "Growth",
      question: "How do you grow a brand effectively?",
      options: [
        "Buying followers",
        "Engaging authentically and providing consistent value",
        "Posting only viral content",
        "Following everyone back",
      ],
      correctAnswer: 1,
      explanation: "Authentic engagement and consistent value delivery build genuine, lasting growth.",
    },
    {
      category: "Monetization",
      question: "When should you introduce monetization?",
      options: [
        "Immediately",
        "After building trust and providing value",
        "Never",
        "Only when you have 100k followers",
      ],
      correctAnswer: 1,
      explanation: "Monetization works best after establishing trust and consistently providing value to your audience.",
    },
  ];

  return {
    title: `Day ${dayNumber} Dual Brand Quiz`,
    description: `Test your understanding of brand building, content strategy, and growth principles.`,
    questions: questions,
    totalQuestions: questions.length,
    passingScore: Math.ceil(questions.length * 0.7),
    timeLimit: 8, // minutes
  };
}

// Writers Journey Quiz Generator
function getWriterQuiz(weekNum, dayIndex, dayNumber) {
  const questions = [
    {
      category: "Writing Fundamentals",
      question: "What is the most important element of good writing?",
      options: [
        "Complex vocabulary",
        "Clarity and purpose",
        "Length of content",
        "Using many adjectives",
      ],
      correctAnswer: 1,
      explanation: "Clarity and purpose make writing effective and engaging, regardless of complexity.",
    },
    {
      category: "Voice & Style",
      question: "How do you develop your writing voice?",
      options: [
        "Copying successful writers",
        "Writing consistently and authentically",
        "Using complex sentences",
        "Only writing when inspired",
      ],
      correctAnswer: 1,
      explanation: "Consistent, authentic writing practice helps develop your unique voice.",
    },
    {
      category: "Client Work",
      question: "What is essential for freelance writing success?",
      options: [
        "Lowest prices",
        "Understanding client needs and delivering quality",
        "Fastest turnaround",
        "Most clients",
      ],
      correctAnswer: 1,
      explanation: "Understanding client needs and delivering quality work builds reputation and repeat business.",
    },
    {
      category: "Portfolio",
      question: "What makes a strong writing portfolio?",
      options: [
        "Many samples",
        "Quality samples that showcase range and expertise",
        "Only published work",
        "Personal writing only",
      ],
      correctAnswer: 1,
      explanation: "Quality samples that showcase your range and expertise demonstrate your value to clients.",
    },
  ];

  return {
    title: `Day ${dayNumber} Writing Quiz`,
    description: `Test your understanding of writing fundamentals, voice development, and client work.`,
    questions: questions,
    totalQuestions: questions.length,
    passingScore: Math.ceil(questions.length * 0.7),
    timeLimit: 8, // minutes
  };
}
