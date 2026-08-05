import {
  JOURNEY_START_DATE,
  JOURNEY_TOTAL_DAYS,
  generateWeeks,
  getDateStringForDayNumber,
  getCalendarWeekDayNumbers,
  getCalendarWeekCount,
} from './shared.js';
import {
  getBodyTransformationTimeBlocks,
  organizeBodyTransformationSchedule,
  getBodyTransformationQuiz,
} from './softwareEngineering.js';
import { BODY_CURATED_RESOURCES, normalizeResource } from './journeyCuratedResources.js';

// Calendar dayIndex: 0=Monday … 5=Saturday, 6=Sunday
const EXERCISE_FORM_GUIDES = {
  plankSideRight: {
    title: "Side Plank (Right) — Form Guide",
    url: "https://www.youtube.com/watch?v=K2VljzY1v4A",
    time: "3 min",
  },
  plankSideLeft: {
    title: "Side Plank (Left) — Form Guide",
    url: "https://www.youtube.com/watch?v=K2VljzY1v4A",
    time: "3 min",
  },
  plankCenter: {
    title: "Front Plank — Form Guide",
    url: "https://www.youtube.com/watch?v=ASdvN_XEl_c",
    time: "3 min",
  },
  pushUps: {
    title: "Push-Ups — Form Guide",
    url: "https://www.youtube.com/watch?v=IODxDxX7oi4",
    time: "4 min",
  },
  crunches: {
    title: "Crunches — Form Guide",
    url: "https://www.youtube.com/watch?v=Xyd_fa5Tlk0",
    time: "3 min",
  },
  burpees: {
    title: "Burpees — Form Guide",
    url: "https://www.youtube.com/watch?v=auBL9oZSMh4",
    time: "4 min",
  },
  lunges: {
    title: "Lunges — Form Guide",
    url: "https://www.youtube.com/watch?v=QO_oBT4v_bM",
    time: "4 min",
  },
  bicycles: {
    title: "Bicycle Crunches — Form Guide",
    url: "https://www.youtube.com/watch?v=9FGilx_CbdI",
    time: "3 min",
  },
};

/** Muscles targeted per exercise (react-body-highlighter slugs) */
export const EXERCISE_MUSCLES = {
  plankSideRight: ['abs', 'obliques'],
  plankSideLeft: ['abs', 'obliques'],
  plankCenter: ['abs'],
  pushUps: ['chest', 'triceps', 'front-deltoids'],
  crunches: ['abs'],
  burpees: ['chest', 'quadriceps', 'abs', 'gluteal'],
  lunges: ['quadriceps', 'gluteal', 'hamstring'],
  bicycles: ['abs', 'obliques'],
};

const BODY_WEEKLY_ROUTINES = {
  0: {
    focus: "Plank & Core Circuit",
    name: "Monday — Plank & Core Circuit",
    rounds: 3,
    link: "https://www.youtube.com/watch?v=pSHjTR5xN4s",
    exercises: [
      { name: "30 sec Plank (Right)", guideKey: "plankSideRight" },
      { name: "30 sec Plank (Left)", guideKey: "plankSideLeft" },
      { name: "30 sec Plank (Center)", guideKey: "plankCenter" },
      { name: "10 Lunges (each side)", guideKey: "lunges" },
      { name: "10 Burpees", guideKey: "burpees" },
    ],
  },
  1: {
    focus: "Push & Core",
    name: "Tuesday — Push & Core",
    rounds: 2,
    link: "https://www.youtube.com/watch?v=ml6cT4AZdqI",
    exercises: [
      { name: "10 Push-Ups", guideKey: "pushUps" },
      { name: "30 Crunches", guideKey: "crunches" },
      { name: "10 Burpees", guideKey: "burpees" },
      { name: "30 sec Plank", guideKey: "plankCenter" },
      { name: "10 Lunges (each side)", guideKey: "lunges" },
    ],
  },
  2: {
    focus: "Legs & Core",
    name: "Wednesday — Legs & Core",
    rounds: 2,
    link: "https://www.youtube.com/watch?v=2pLT-olgUJs",
    exercises: [
      { name: "10 Lunges (each side)", guideKey: "lunges" },
      { name: "60 sec Plank", guideKey: "plankCenter" },
      { name: "30 Crunches", guideKey: "crunches" },
      { name: "10 Push-Ups", guideKey: "pushUps" },
      { name: "30 Bicycle Crunches", guideKey: "bicycles" },
    ],
  },
  3: {
    focus: "Full Body Circuit",
    name: "Thursday — Full Body Circuit",
    rounds: 3,
    link: "https://www.youtube.com/watch?v=ml0Ho6Ybq58",
    exercises: [
      { name: "10 Push-Ups", guideKey: "pushUps" },
      { name: "30 Bicycle Crunches", guideKey: "bicycles" },
      { name: "10 Burpees", guideKey: "burpees" },
      { name: "60 sec Plank", guideKey: "plankCenter" },
      { name: "10 Lunges (each side)", guideKey: "lunges" },
    ],
  },
  4: {
    focus: "HIIT Burn",
    name: "Friday — HIIT Burn",
    rounds: 2,
    link: "https://www.youtube.com/watch?v=cbKkBnfPwno",
    exercises: [
      { name: "20 Burpees", guideKey: "burpees" },
      { name: "10 Push-Ups", guideKey: "pushUps" },
      { name: "10 Lunges (each side)", guideKey: "lunges" },
      { name: "30 Bicycle Crunches", guideKey: "bicycles" },
      { name: "60 sec Plank", guideKey: "plankCenter" },
    ],
  },
  5: {
    focus: "Rest & Recovery",
    name: "Rest Day — Light stretching and active recovery",
    rounds: 0,
    link: null,
    exercises: [],
  },
  6: {
    focus: "Rest & Recovery",
    name: "Rest Day (Recovery from Sunday basketball)",
    rounds: 0,
    link: null,
    exercises: [],
  },
};

const BODY_DAY_FOCUS = [
  BODY_WEEKLY_ROUTINES[0].focus,
  BODY_WEEKLY_ROUTINES[1].focus,
  BODY_WEEKLY_ROUTINES[2].focus,
  BODY_WEEKLY_ROUTINES[3].focus,
  BODY_WEEKLY_ROUTINES[4].focus,
  BODY_WEEKLY_ROUTINES[5].focus,
  BODY_WEEKLY_ROUTINES[6].focus,
];

/** Maps calendar dayIndex → content index used by learning/reflection/quiz helpers */
function getBodyContentIndex(dayIndex) {
  const map = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 0, 6: 6 };
  return map[dayIndex] ?? 1;
}

// Helper functions for Body Transformation content
function getBodyTransformationLearning(weekNum, dayIndex) {
  const workoutTypes = [
    "Rest & Recovery",
    "Plank & Core Circuit",
    "Push & Core",
    "Legs & Core",
    "Full Body Circuit",
    "HIIT Burn",
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
      "Plank variations and core bracing",
      "Side plank alignment and stability",
      "Building core endurance",
      "Combining planks with metabolic work",
    ],
    2: [
      "Push-up form and scaling options",
      "Core activation during push movements",
      "Burpee mechanics and pacing",
      "Circuit training structure",
    ],
    3: [
      "Lunge form and knee tracking",
      "Extended plank holds for endurance",
      "Bicycle crunch technique",
      "Balancing lower body and core work",
    ],
    4: [
      "Full-body circuit pacing",
      "Managing fatigue across rounds",
      "Breathing during high-rep sets",
      "Form under fatigue",
    ],
    5: [
      "HIIT intensity and recovery intervals",
      "Burpee volume progression",
      "Friday finisher mindset",
      "Weekly training load balance",
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

function getBodyTransformationProject(weekNum, contentIndex, calendarDayIndex) {
  const workoutTypes = [
    "Rest & Recovery",
    "Plank & Core Circuit",
    "Push & Core",
    "Legs & Core",
    "Full Body Circuit",
    "HIIT Burn",
    "Active Recovery & Basketball",
  ];
  const focus = workoutTypes[contentIndex] || "Workout Session";
  const workoutData = getWorkoutForDay(weekNum, calendarDayIndex);

  const requirements =
    workoutData.exercises?.length > 0
      ? [
          `Complete ${workoutData.name}`,
          `Repeat the circuit ${workoutData.rounds} time${workoutData.rounds > 1 ? "s" : ""}`,
          ...workoutData.exercises.map((ex) => ex.name),
          workoutData.link
            ? "Optional: watch the guided workout link in your Workout Plan"
            : "Light stretching and mobility only",
          "Focus on proper form — check form guides in Resources",
        ]
      : [
          workoutData.name,
          "Light stretching and mobility",
          "Hydrate and prioritize sleep",
        ];

  return {
    title: `${focus} Workout Session`,
    description: `Complete today's ${focus.toLowerCase()} workout following your weekly routine`,
    requirements,
  };
}

function getBodyTransformationReflection(weekNum, dayIndex) {
  const reflections = [
    "How did my body feel during rest? What recovery strategies worked best?",
    "How stable were my planks? Which side felt weaker?",
    "How was my push-up form? Did I maintain pace through both rounds?",
    "How did my legs feel on lunges? Could I hold the 60 sec plank?",
    "Which exercise was hardest in the full-body circuit? How was my pacing?",
    "How did I handle the HIIT volume? Am I ready to add reps next week?",
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
      `Personal brand: How did today's tasks go? ${personalTasksText}`,
      `Company brand: How did today's tasks go? ${companyTasksText}`,
      `Did I achieve the expected outcome: ${outcome}?`,
      "What challenges did I face?",
      "What will I focus on improving tomorrow?",
      "How are both brands progressing toward their goals?",
    ],
  };
}

// Body Transformation Journey - Complete 13 weeks
export const bodyTransformationWeeks = generateWeeks(
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
      // to dayIndex format used by schedule (0=Monday, 1=Tuesday, ..., 5=Saturday, 6=Sunday)
      const jsDayOfWeek = dayDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
      const dayIndex = jsDayOfWeek === 0 ? 6 : jsDayOfWeek - 1;

      const contentWeekNum = idx + 1;
      const contentIndex = getBodyContentIndex(dayIndex);
      const focus = BODY_DAY_FOCUS[dayIndex];

      const workoutData = getWorkoutForDay(contentWeekNum, dayIndex);
      const workoutResources = getWorkoutResources(contentWeekNum, dayIndex);
      
      const timeBlocks = getBodyTransformationTimeBlocks(dayIndex);
      const learningData = getBodyTransformationLearning(contentWeekNum, contentIndex);
      const projectData = getBodyTransformationProject(contentWeekNum, contentIndex, dayIndex);
      const scheduledContent = organizeBodyTransformationSchedule(learningData, projectData, dayIndex, timeBlocks, dayNumber);

      days.push({
        dayNumber: dayNumber,
        date: dayDateString,
        dayName: actualDayName,
        focus,
        workout: workoutData,
        workoutLink: workoutData.link || null,
        nutrition: getNutritionForWeek(contentWeekNum, dayIndex),
        mindset: getMindsetAffirmation(contentIndex),
        resources: workoutResources,
        dailyLearning: learningData,
        project: projectData,
        reflection: getBodyTransformationReflection(contentWeekNum, contentIndex),
        dailyQuiz: getBodyTransformationQuiz(contentWeekNum, contentIndex, dayNumber),
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
  })
  .filter((week) => week.days.length > 0);

function getWorkoutForDay(weekNum, dayIndex) {
  const routine = BODY_WEEKLY_ROUTINES[dayIndex];
  if (!routine) {
    return { name: "Workout Session", link: null, rounds: 0, exercises: [] };
  }
  return {
    name: routine.name,
    focus: routine.focus,
    link: routine.link,
    rounds: routine.rounds,
    exercises: routine.exercises.map((ex) => ({
      ...ex,
      formGuide: EXERCISE_FORM_GUIDES[ex.guideKey] ?? null,
      muscles: EXERCISE_MUSCLES[ex.guideKey] ?? [],
    })),
  };
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
  const routine = BODY_WEEKLY_ROUTINES[dayIndex];
  const curated = BODY_CURATED_RESOURCES.map(normalizeResource);

  if (!routine) return curated;

  if (dayIndex === 5 || dayIndex === 6) {
    return [
      ...curated,
      normalizeResource({
        title: "Recovery & Rest Guide",
        url: "https://www.youtube.com/watch?v=4pKly2JojMw",
        type: "youtube",
        description: "Active recovery and rest day guidance",
        time: "10 min",
      }),
      normalizeResource({
        title: "Stretching for Recovery",
        url: "https://www.youtube.com/watch?v=v7AYKMP6rOE",
        type: "youtube",
        description: "Post-workout stretching for mobility and recovery",
        time: "15 min",
      }),
    ];
  }

  // Form guides for today's circuit + male-focused training channels
  const resources = [...curated];
  const seenGuides = new Set();
  routine.exercises.forEach((exercise) => {
    const guide = EXERCISE_FORM_GUIDES[exercise.guideKey];
    if (guide && !seenGuides.has(exercise.guideKey)) {
      seenGuides.add(exercise.guideKey);
      resources.push(
        normalizeResource({
          ...guide,
          title: `${exercise.name} — Form Guide`,
          type: "youtube",
          description: `Proper form and technique for ${exercise.name}`,
        })
      );
    }
  });

  return resources;
}

