import {
  JOURNEY_START_DATE,
  JOURNEY_TOTAL_DAYS,
  generateWeeks,
  getDateStringForDayNumber,
  getCalendarWeekDayNumbers,
  getCalendarWeekCount,
} from './shared.js';
import {
  getReadingTimeBlocks,
  organizeReadingSchedule,
  getReadingQuiz,
} from './softwareEngineering.js';
import {
  getBookForDayNumber,
  getBookDisplayTitle,
  READING_BOOKS_BY_MONTH,
  READING_SUPPLEMENTARY_BOOKS,
  READING_TOOL_RESOURCES,
  normalizeResource,
} from './journeyCuratedResources.js';

// Helper functions for Reading content
function getReadingLearning(weekNum, dayIndex, dayNumber) {
  const isWeekend = dayIndex >= 5;
  const readingSessions = isWeekend
    ? getWeekendReading(weekNum, dayIndex, dayNumber)
    : getWeekdayReading(weekNum, dayIndex, dayNumber);
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
    } else if (session.type === "Book") {
      topics.push(
        `Evening Reading: ${session.material}`,
        session.focus || "Daily book progress",
        "Applying insights to personal growth"
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

function getReadingProject(weekNum, dayIndex, dayNumber) {
  // dayIndex is now the actual day of week (0-6, where 0=Sunday, 1=Monday, etc.)
  const isWeekend = dayIndex === 0 || dayIndex === 6; // Sunday or Saturday
  const readingSessions = isWeekend
    ? getWeekendReading(weekNum, dayIndex, dayNumber)
    : getWeekdayReading(weekNum, dayIndex, dayNumber);

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

function getReadingReflection(weekNum, dayIndex, dayNumber) {
  // dayIndex is now the actual day of week (0-6, where 0=Sunday, 1=Monday, etc.)
  const isWeekend = dayIndex === 0 || dayIndex === 6; // Sunday or Saturday
  const readingSessions = isWeekend
    ? getWeekendReading(weekNum, dayIndex, dayNumber)
    : getWeekdayReading(weekNum, dayIndex, dayNumber);

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

// Reading Journey - Complete 13 weeks
export const readingWeeks = generateWeeks(
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
    const dayOfWeek = dayDate.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
    
    // Convert JavaScript getDay() (0=Sunday, 1=Monday, ..., 6=Saturday) 
    // to dayIndex format used by getTimeBlocks (0=Monday, 1=Tuesday, ..., 5=Saturday, 6=Sunday)
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to: 0=Monday, 1=Tuesday, ..., 5=Saturday, 6=Sunday

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
    
    // Week 1 starts from Day 1 (Wednesday, July 1, 2026) - actual content execution begins
    // Content week numbering: Day 1 = Week 1 content, Days 1-7 = Week 1 content, Days 8-14 = Week 2 content, etc.
    // Week numbering: idx 0 = Week 1, idx 1 = Week 2, etc.
    const contentWeekNum = idx + 1; // Week 1, 2, 3, etc.

    // Use actual content for all days (no test run)
    // Pass dayOfWeek to getReadingResources so it can determine what resources to show
    const readingResources = getReadingResources(contentWeekNum, dayOfWeek, dayNumber);

    // Map dayOfWeek to the correct index for reading functions
    // For weekdays: Monday(1)->0, Tuesday(2)->1, Wednesday(3)->2, Thursday(4)->3, Friday(5)->4
    // For weekends: Saturday(6)->5, Sunday(0)->0
    const readingDayIndex = isWeekend ? dayOfWeek : dayOfWeek - 1;
    
    // Get time blocks and organize schedule (same format as software engineering)
    const timeBlocks = getReadingTimeBlocks(dayIndex);
    const readingSessionsData = isWeekend 
      ? getWeekendReading(contentWeekNum, readingDayIndex, dayNumber) 
      : getWeekdayReading(contentWeekNum, readingDayIndex, dayNumber);
    const scheduledContent = organizeReadingSchedule(readingSessionsData, dayIndex, timeBlocks, dayNumber);

    days.push({
      dayNumber: dayNumber,
      date: dayDateString,
      dayName: actualDayName,
      readingSessions: readingSessionsData,
      theme: getReadingTheme(contentWeekNum),
      resources: readingResources,
      // Add missing fields for Learning, Project, Reflection tabs
      dailyLearning: getReadingLearning(contentWeekNum, dayIndex, dayNumber),
      project: getReadingProject(contentWeekNum, dayIndex, dayNumber),
      reflection: getReadingReflection(contentWeekNum, dayIndex, dayNumber),
      dailyQuiz: getReadingQuiz(contentWeekNum, dayIndex, dayNumber),
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
}).filter((week) => week.days.length > 0);

function getWeekdayReading(weekNum, dayIndex, dayNumber) {
  if (dayIndex === 4) return []; // Friday off

  const book = getBookForDayNumber(dayNumber);
  return [{
    time: "9:15 PM - 10:00 PM",
    type: "Book",
    material: getBookDisplayTitle(book),
    focus: book.purpose,
  }];
}

function getWeekendReading(weekNum, dayIndex, dayNumber) {
  const book = getBookForDayNumber(dayNumber);
  return [{
    time: "9:15 PM - 10:00 PM",
    type: "Book",
    material: getBookDisplayTitle(book),
    focus: book.purpose,
  }];
}

function getEBookForWeek(weekNum, dayNumber) {
  const dn = dayNumber ?? (weekNum - 1) * 7 + 1;
  return getBookDisplayTitle(getBookForDayNumber(dn));
}

function getPhysicalBookForWeek(weekNum, dayNumber) {
  const dn = dayNumber ?? (weekNum - 1) * 7 + 4;
  return getBookDisplayTitle(getBookForDayNumber(dn));
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
  
  // Map reading descriptions to Bible book names for the link (Bible Gateway needs "Proverbs 2", not "Proverbs - Chapters 1-10 2")
  const bibleBooks = ["Proverbs", "Proverbs", "Proverbs", "Proverbs", "Proverbs", "Ecclesiastes", "Ecclesiastes", "Isaiah", "Isaiah", "Isaiah", "Isaiah", "Isaiah", "Isaiah"];
  const bookForLink = bibleBooks[weekNum - 1] || "Proverbs";
  
  // Bible Gateway link - search format: "Proverbs 2" or "Isaiah 5"
  const searchQuery = encodeURIComponent(`${bookForLink} ${chapter}`);
  const bibleLink = `https://www.biblegateway.com/passage/?search=${searchQuery}&version=NIV`;
  
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

function getReadingResources(weekNum, dayOfWeek, dayNumber = 1) {
  const resources = [];
  const isFriday = dayOfWeek === 5;
  const book = getBookForDayNumber(dayNumber);

  if (!isFriday) {
    resources.push(
      normalizeResource({
        title: getBookDisplayTitle(book),
        url: book.url || 'https://www.goodreads.com',
        type: 'book',
        description: book.purpose,
        time: '9:15 PM - 10:00 PM',
      })
    );
  }

  // Full 7-book curriculum
  READING_BOOKS_BY_MONTH.forEach((b) => {
    resources.push(
      normalizeResource({
        title: b.author ? `${b.title} — ${b.author}` : b.title,
        url: b.url || 'https://www.goodreads.com',
        type: 'book',
        description: b.purpose,
        time: b.readingTime,
      })
    );
  });

  // Supplementary + tools
  resources.push(...READING_SUPPLEMENTARY_BOOKS, ...READING_TOOL_RESOURCES);

  return resources;
}

