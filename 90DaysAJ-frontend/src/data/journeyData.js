// Complete journey data with all 13 weeks

export const journeys = [
  {
    id: 'body-transformation',
    title: 'Body Transformation',
    icon: '💪',
    timeBlock: 'Time: 5:30-6:30 AM',
    description: 'Upper Body → Lower Body → Core → Functional → Mobility',
    totalDays: 90,
    color: '#667eea'
  },
  {
    id: 'dual-brand',
    title: 'Dual Brand',
    icon: '🎨',
    timeBlock: 'Time: 8:30-9:30 PM',
    description: 'Ryxen + HavenX Brand Building',
    totalDays: 90,
    color: '#f093fb'
  },
  {
    id: 'reading',
    title: 'Reading',
    icon: '📚',
    timeBlock: 'Multiple Time Blocks',
    description: 'E-books → Physical Books → Bible',
    totalDays: 90,
    color: '#4facfe'
  },
  {
    id: 'writers',
    title: "Writer's Journey",
    icon: '✍️',
    timeBlock: 'Time: 3:30-4:30 PM',
    description: 'Learning → Execution → Reflection',
    totalDays: 60,
    color: '#43e97b'
  },
  {
    id: 'software-engineering',
    title: 'Software Engineering',
    icon: '💻',
    timeBlock: '5 Hours Daily',
    description: 'HTML → CSS → JavaScript → React → Next.js → Full-Stack',
    totalDays: 90,
    color: '#fa709a'
  }
]

// Helper function to check if a day is a test run day (December 8, 9, 10)
function isTestRunDay(dateString) {
  const testRunDates = ['2025-12-08', '2025-12-09', '2025-12-10']
  return testRunDates.includes(dateString)
}

// Helper function to shift day numbers: days 8,9,10 are test runs, so content shifts
// Day 8 content → Day 11, Day 9 → Day 12, Day 10 → Day 13, etc.
function getShiftedDayIndex(dayNumber) {
  // Days 1-7: no shift
  if (dayNumber <= 7) return dayNumber - 1;
  // Days 8-10: test run days, return null to indicate test day
  if (dayNumber >= 8 && dayNumber <= 10) return null;
  // Days 11+: shift back by 3 (day 11 gets day 8 content, day 12 gets day 9 content, etc.)
  return dayNumber - 4; // dayNumber - 1 (convert to 0-index) - 3 (shift) = dayNumber - 4
}

// Get original week and day index from shifted day number
function getOriginalWeekAndDayIndex(dayNumber) {
  const shiftedIndex = getShiftedDayIndex(dayNumber);
  if (shiftedIndex === null) return null; // Test run day
  const weekNum = Math.floor(shiftedIndex / 7) + 1;
  const dayIndex = shiftedIndex % 7;
  return { weekNum, dayIndex };
}

// Get test run content for familiarization days based on date
function getTestRunContent(dateString) {
  const testDays = {
    '2025-12-08': {
      focus: '🧪 Test Run Day 1 - App Familiarization (Dec 8)',
      testRunNote: '🧪 TEST RUN DAY 1 (December 8th): Explore the app interface, test all features, understand the journey structure. No real tasks today - just get comfortable with the system.',
      tasks: [
        'Navigate through all journey sections',
        'Test the progress tracking features',
        'Explore the dashboard and stats',
        'Review the achievement system',
        'Familiarize yourself with the daily structure',
        'Test the reflection/journal features',
        'Check all navigation and UI elements'
      ],
      resources: [
        { title: 'App Tour Guide', url: '#', time: '10 min' },
        { title: 'Feature Overview', url: '#', time: '5 min' }
      ]
    },
    '2025-12-09': {
      focus: '🧪 Test Run Day 2 - Feature Testing (Dec 9)',
      testRunNote: '🧪 TEST RUN DAY 2 (December 9th): Test all interactive features, practice using the app, identify any issues or improvements needed.',
      tasks: [
        'Test marking tasks as complete',
        'Practice using the reflection system',
        'Test the quiz/assessment features',
        'Explore learning resources section',
        'Test the progress visualization',
        'Practice navigation between days',
        'Test mobile responsiveness (if applicable)'
      ],
      resources: [
        { title: 'Feature Testing Checklist', url: '#', time: '15 min' },
        { title: 'User Guide', url: '#', time: '10 min' }
      ]
    },
    '2025-12-10': {
      focus: '🧪 Test Run Day 3 - Final Preparation (Dec 10)',
      testRunNote: '🧪 TEST RUN DAY 3 (December 10th): Final familiarization, correct any issues, prepare mentally for December 11th when the real journey begins. Lock in mode starts tomorrow!',
      tasks: [
        'Review all journey paths (Body, Dual Brand, Reading, Writing, Software)',
        'Set your intentions for the 90-day journey',
        'Plan your daily schedule and time blocks',
        'Test the reminder/notification system',
        'Prepare your workspace and environment',
        'Mental preparation and commitment check',
        'Final system check - everything ready?'
      ],
      resources: [
        { title: 'Journey Preparation Guide', url: '#', time: '20 min' },
        { title: 'Commitment Declaration', url: '#', time: '10 min' },
        { title: 'December 11th Preview - What to Expect', url: '#', time: '5 min' }
      ]
    }
  }
  return testDays[dateString] || null
}

// Helper function to generate all weeks
function generateWeeks(startDate, numWeeks) {
  const weeks = []
  const start = new Date(startDate)
  
  for (let i = 0; i < numWeeks; i++) {
    const weekStart = new Date(start)
    weekStart.setDate(start.getDate() + i * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    weeks.push({
      weekNumber: i + 1,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0],
      theme: getWeekTheme(i + 1)
    })
  }
  
  return weeks
}

function getWeekTheme(weekNum) {
  const themes = {
    1: 'Foundation Week - Establishing routines and systems',
    2: 'Building Momentum - Consistency and habit formation',
    3: 'Deepening Practice - Advanced techniques and refinement',
    4: 'Integration Phase - Combining all elements',
    5: 'Acceleration - Pushing boundaries and growth',
    6: 'Mastery Development - Refining skills and systems',
    7: 'Peak Performance - Maximum output and optimization',
    8: 'Scaling Phase - Expanding reach and impact',
    9: 'Innovation - New approaches and strategies',
    10: 'Excellence - Pursuing perfection in execution',
    11: 'Leadership - Guiding and inspiring others',
    12: 'Transformation - Complete evolution and change',
    13: 'Celebration - Reflecting on achievements and next steps'
  }
  return themes[weekNum] || 'Week Theme'
}

// Body Transformation Journey - Complete 13 weeks
export const bodyTransformationWeeks = generateWeeks('2025-12-08', 13).map((week, idx) => {
  const days = []
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const workoutTypes = [
    'Rest & Recovery',
    'Upper Body Strength',
    'Lower Body Strength',
    'Core + Cardio',
    'Functional Full-Body',
    'Mobility & Flexibility',
    'Active Recovery & Basketball'
  ]
  
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(week.startDate)
    dayDate.setDate(new Date(week.startDate).getDate() + i)
    
    const dayDateString = dayDate.toISOString().split('T')[0]
    const dayNumber = idx * 7 + i + 1
    const isTestDay = isTestRunDay(dayDateString)
    const testContent = isTestDay ? getTestRunContent(dayDateString) : null
    
    // Shift content: days 8,9,10 are test runs, so day 11 gets day 8 content, etc.
    let contentWeekNum = idx + 1
    let contentDayIndex = i
    if (!isTestDay && dayNumber >= 11) {
      const originalDayNumber = dayNumber - 3
      contentWeekNum = Math.floor((originalDayNumber - 1) / 7) + 1
      contentDayIndex = (originalDayNumber - 1) % 7
    }
    
    const workoutData = isTestDay ? null : getWorkoutForDay(contentWeekNum, contentDayIndex)
    const workoutResources = isTestDay ? [] : getWorkoutResources(contentWeekNum, contentDayIndex)
    
    days.push({
      dayNumber: dayNumber,
      date: dayDateString,
      dayName: dayNames[i],
      focus: isTestDay ? testContent.focus : workoutTypes[i],
      workout: isTestDay ? 'App Familiarization & Testing' : (workoutData.name || workoutData),
      workoutLink: isTestDay ? null : (workoutData.link || null),
      nutrition: isTestDay ? 'No specific nutrition plan - focus on app testing' : getNutritionForWeek(idx + 1, i),
      mindset: isTestDay ? 'I am preparing myself for the journey ahead. December 11th is when I lock in completely.' : getMindsetAffirmation(i),
      resources: isTestDay ? testContent.resources : workoutResources,
      isTestRun: isTestDay,
      testRunNote: isTestDay ? testContent.testRunNote : null,
      testRunTasks: isTestDay ? testContent.tasks : null
    })
  }
  
  // Override theme for week 1 to focus on preparing mind, body, and soul
  const weekTheme = idx === 0 
    ? 'Preparing Mind, Body, and Soul for the Journey Ahead'
    : week.theme
  
  return { ...week, theme: weekTheme, days }
})

function getWorkoutForDay(weekNum, dayIndex) {
  if (dayIndex === 0) return { name: 'Rest Day (Recovery from Sunday basketball)', link: null }
  if (dayIndex === 5) return { name: 'Yoga Flow for Flexibility', link: 'https://www.youtube.com/watch?v=v7AYKMP6rOE' }
  if (dayIndex === 6) return { name: 'Basketball + Gentle Stretching Routine', link: 'https://www.youtube.com/watch?v=4pKly2JojMw' }
  
  const workouts = {
    1: { name: 'Upper Body Push Pull Workout', link: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
    2: { name: 'Legs & Glutes Workout', link: 'https://www.youtube.com/watch?v=wPtyYp2VIYA' },
    3: { name: 'HIIT Core & Cardio', link: 'https://www.youtube.com/watch?v=ml0Ho6Ybq58' },
    4: { name: 'Full Body Functional Strength', link: 'https://www.youtube.com/watch?v=UBMk30rjy0o' }
  }
  return workouts[dayIndex] || { name: 'Workout Session', link: null }
}

function getNutritionForWeek(weekNum, dayIndex) {
  if (weekNum <= 4) {
    return 'No refined sugar, soda, or fried foods. Eat until 80% full.'
  } else if (weekNum <= 8) {
    return 'Increased protein. Extra healthy carbs post-workout. Hand-portion method.'
  } else {
    return 'Reduce carbs 20-25%. Lighter dinners. Green tea at night.'
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
    "Deep reflection and planning ahead."
  ]
  return affirmations[dayIndex] || "I am committed to my transformation."
}

function getWorkoutResources(weekNum, dayIndex) {
  if (dayIndex === 0) {
    return [
      { title: 'Recovery & Rest Guide', url: 'https://www.youtube.com/watch?v=4pKly2JojMw', time: '10 min' },
      { title: 'Stretching for Recovery', url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE', time: '15 min' }
    ]
  }
  if (dayIndex === 1) {
    return [
      { title: 'Upper Body Push Pull Workout', url: 'https://www.youtube.com/watch?v=IODxDxX7oi4', time: '45 min' },
      { title: 'Upper Body Form Guide', url: 'https://www.youtube.com/watch?v=IODxDxX7oi4', time: '10 min' },
      { title: 'Progressive Overload Principles', url: 'https://www.bodybuilding.com/content/progressive-overload.html', time: '5 min' }
    ]
  }
  if (dayIndex === 2) {
    return [
      { title: 'Legs & Glutes Workout', url: 'https://www.youtube.com/watch?v=wPtyYp2VIYA', time: '45 min' },
      { title: 'Leg Day Form Tips', url: 'https://www.youtube.com/watch?v=wPtyYp2VIYA', time: '10 min' },
      { title: 'Lower Body Mobility', url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE', time: '15 min' }
    ]
  }
  if (dayIndex === 3) {
    return [
      { title: 'HIIT Core & Cardio', url: 'https://www.youtube.com/watch?v=ml0Ho6Ybq58', time: '30 min' },
      { title: 'Core Strength Basics', url: 'https://www.youtube.com/watch?v=ml0Ho6Ybq58', time: '15 min' },
      { title: 'Cardio Training Guide', url: 'https://www.healthline.com/health/fitness-exercise/cardio-workouts', time: '10 min' }
    ]
  }
  if (dayIndex === 4) {
    return [
      { title: 'Full Body Functional Strength', url: 'https://www.youtube.com/watch?v=UBMk30rjy0o', time: '45 min' },
      { title: 'Functional Movement Patterns', url: 'https://www.youtube.com/watch?v=UBMk30rjy0o', time: '15 min' }
    ]
  }
  if (dayIndex === 5) {
    return [
      { title: 'Yoga Flow for Flexibility', url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE', time: '30 min' },
      { title: 'Mobility Routine', url: 'https://www.youtube.com/watch?v=4pKly2JojMw', time: '20 min' },
      { title: 'Flexibility Training Guide', url: 'https://www.verywellfit.com/flexibility-exercises-4158624', time: '10 min' }
    ]
  }
  if (dayIndex === 6) {
    return [
      { title: 'Basketball Warm-up', url: 'https://www.youtube.com/watch?v=4pKly2JojMw', time: '10 min' },
      { title: 'Post-Game Recovery', url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE', time: '15 min' }
    ]
  }
  return []
}

// Reading Journey - Complete 13 weeks
export const readingWeeks = generateWeeks('2025-12-08', 13).map((week, idx) => {
  const days = []
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(week.startDate)
    dayDate.setDate(new Date(week.startDate).getDate() + i)
    
    const dayDateString = dayDate.toISOString().split('T')[0]
    const dayNumber = idx * 7 + i + 1
    const isTestDay = isTestRunDay(dayDateString)
    const testContent = isTestDay ? getTestRunContent(dayDateString) : null
    
    // Shift content: days 8,9,10 are test runs, so day 11 gets day 8 content, etc.
    let contentWeekNum = idx + 1
    let contentDayIndex = i
    if (!isTestDay && dayNumber >= 11) {
      const originalDayNumber = dayNumber - 3
      contentWeekNum = Math.floor((originalDayNumber - 1) / 7) + 1
      contentDayIndex = (originalDayNumber - 1) % 7
    }
    
    const isWeekend = contentDayIndex >= 5
    const readingResources = isTestDay ? [] : getReadingResources(contentWeekNum, contentDayIndex)
    
    days.push({
      dayNumber: dayNumber,
      date: dayDateString,
      dayName: dayNames[i],
      readingSessions: isTestDay ? [{ time: 'App Testing', type: 'Familiarization', material: 'Explore app features', focus: 'Get comfortable with the system' }] : (isWeekend ? getWeekendReading(idx + 1, i) : getWeekdayReading(idx + 1, i)),
      theme: isTestDay ? testContent.focus : getReadingTheme(idx + 1),
      resources: isTestDay ? testContent.resources : readingResources,
      isTestRun: isTestDay,
      testRunNote: isTestDay ? testContent.testRunNote : null,
      testRunTasks: isTestDay ? testContent.tasks : null
    })
  }
  
  return { ...week, days }
})

function getWeekdayReading(weekNum, dayIndex) {
  return [
    {
      time: '8:00-9:00 AM',
      type: 'E-Reading',
      material: getEBookForWeek(weekNum),
      focus: 'Mindset, success, wealth, strategy'
    },
    {
      time: '2:30-3:30 PM',
      type: 'Physical Book',
      material: getPhysicalBookForWeek(weekNum),
      focus: 'Principles, systems, structure'
    },
    {
      time: '5:30-6:00 PM',
      type: 'Bible Reading',
      material: getBibleReading(weekNum, dayIndex),
      focus: 'Spiritual, financial, wisdom grounding'
    }
  ]
}

function getWeekendReading(weekNum, dayIndex) {
  if (dayIndex === 6) {
    return [
      {
        time: 'Rest Day',
        type: 'Reflection',
        material: 'Journal insights from week',
        focus: 'Gratitude, lessons learned, planning ahead'
      }
    ]
  }
  return [
    {
      time: '2:30-3:30 PM',
      type: 'Physical Book',
      material: getPhysicalBookForWeek(weekNum),
      focus: 'Deep reflection and consolidation'
    },
    {
      time: '5:30-6:00 PM',
      type: 'Bible Reading',
      material: getBibleReading(weekNum, dayIndex),
      focus: 'Wisdom and application'
    }
  ]
}

function getEBookForWeek(weekNum) {
  const books = [
    'Atomic Habits',
    'Atomic Habits',
    'Be Obsessed or Be Average',
    'Be Obsessed or Be Average',
    'Meditations',
    'Atomic Habits (Advanced)',
    'Be Obsessed or Be Average (Advanced)',
    'Meditations (Deep Dive)',
    'Integration - All books',
    'Successful Habits',
    'Advanced Strategies',
    'Wisdom Synthesis',
    'Final Review'
  ]
  return books[weekNum - 1] || 'Reading Material'
}

function getPhysicalBookForWeek(weekNum) {
  const books = [
    'System Building',
    'System Building',
    'Successful Habits',
    'Successful Habits',
    'System Building (Advanced)',
    'System Building (Advanced)',
    'Successful Habits (Advanced)',
    'Mistakes That Made Me a Millionaire',
    'Synthesis - All books',
    'System Building (Mastery)',
    'Advanced Concepts',
    'Comprehensive Review',
    'Final Review'
  ]
  return books[weekNum - 1] || 'Physical Book'
}

function getBibleReading(weekNum, dayIndex) {
  const readings = [
    'Proverbs',
    'Proverbs',
    'Proverbs',
    'Proverbs',
    'Proverbs',
    'Ecclesiastes',
    'Ecclesiastes',
    'Isaiah',
    'Isaiah',
    'Isaiah',
    'Isaiah',
    'Isaiah',
    'Isaiah'
  ]
  return `${readings[weekNum - 1] || 'Proverbs'} ${Math.min(dayIndex + 1, 31)}`
}

function getReadingTheme(weekNum) {
  const themes = [
    'Foundations of Habit & System Thinking',
    'Identity-Based Change & Structure',
    'Obsession & Ambition',
    'Systems for Wealth & Success',
    'Stoic Wisdom & Millionaire Mindset',
    'Advanced Habit Systems',
    'Peak Performance & Systems',
    'Philosophical Wealth Building',
    'Integration & Application',
    'Mastery & Implementation',
    'Advanced Strategies',
    'Wisdom Synthesis',
    'Reflection & Next Steps'
  ]
  return themes[weekNum - 1] || 'Reading Theme'
}

function getReadingResources(weekNum, dayIndex) {
  const resources = [
    { title: 'Atomic Habits - James Clear', url: 'https://jamesclear.com/atomic-habits', time: 'Book' },
    { title: 'Be Obsessed or Be Average - Grant Cardone', url: 'https://grantcardone.com/books/be-obsessed-or-be-average/', time: 'Book' },
    { title: 'Meditations - Marcus Aurelius', url: 'https://www.gutenberg.org/files/2680/2680-h/2680-h.htm', time: 'Free E-book' },
    { title: 'Bible Reading Plan', url: 'https://www.bible.com/reading-plans', time: 'Daily' },
    { title: 'Reading Comprehension Tips', url: 'https://www.oxfordlearning.com/improve-reading-comprehension/', time: 'Guide' },
    { title: 'Note-Taking Strategies', url: 'https://www.cornell.edu/academics/study-skills/note-taking.cfm', time: 'Guide' }
  ]
  
  if (weekNum <= 2) {
    return [
      resources[0],
      resources[4],
      resources[5]
    ]
  } else if (weekNum <= 4) {
    return [
      resources[1],
      resources[4],
      resources[5]
    ]
  } else if (weekNum <= 6) {
    return [
      resources[2],
      resources[4],
      resources[5]
    ]
  }
  return resources.slice(0, 4)
}

// Dual Brand Journey - Complete 13 weeks
export const dualBrandWeeks = generateWeeks('2025-12-08', 13).map((week, idx) => {
  const days = []
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(week.startDate)
    dayDate.setDate(new Date(week.startDate).getDate() + i)
    
    const dayDateString = dayDate.toISOString().split('T')[0]
    const dayNumber = idx * 7 + i + 1
    const isTestDay = isTestRunDay(dayDateString)
    const testContent = isTestDay ? getTestRunContent(dayDateString) : null
    
    // Shift content: days 8,9,10 are test runs, so day 11 gets day 8 content, etc.
    let contentWeekNum = idx + 1
    let contentDayIndex = i
    if (!isTestDay && dayNumber >= 11) {
      const originalDayNumber = dayNumber - 3
      contentWeekNum = Math.floor((originalDayNumber - 1) / 7) + 1
      contentDayIndex = (originalDayNumber - 1) % 7
    }
    
    days.push({
      dayNumber: dayNumber,
      date: dayDateString,
      dayName: dayNames[i],
      focus: isTestDay ? testContent.focus : getDualBrandFocus(contentWeekNum, contentDayIndex),
      ryxenTasks: isTestDay ? 'App familiarization and testing' : getRyxenTasks(contentWeekNum, contentDayIndex),
      havenXTasks: isTestDay ? 'App familiarization and testing' : getHavenXTasks(contentWeekNum, contentDayIndex),
      theme: isTestDay ? 'Test Run - App Familiarization' : getDualBrandTheme(idx + 1),
      learningResources: isTestDay ? testContent.resources : getDualBrandLearningResources(idx + 1, i),
      outcome: isTestDay ? 'App familiarity and system understanding' : getDualBrandOutcome(idx + 1, i),
      // Platform-specific sessions for content planning
      platformSessions: isTestDay ? [] : getPlatformSessions(idx + 1, i),
      isTestRun: isTestDay,
      testRunNote: isTestDay ? testContent.testRunNote : null,
      testRunTasks: isTestDay ? testContent.tasks : null
    })
  }
  
  return { ...week, days }
})

function getDualBrandFocus(weekNum, dayIndex) {
  const focuses = [
    ['Brand Identity', 'Visual Identity', 'Platform Setup - Social', 'Platform Setup - Video', 'Content Pillars', 'Bios & About Sections', 'Week Reflection'],
    ['Content Creation 1', 'Content Creation 2', 'Video Content', 'Content Creation 3', 'Scheduling Setup', 'Content Audit', 'Week Reflection'],
    ['Engagement Strategy', 'Analytics Setup', 'Growth Loops', 'Community Building', 'Collaboration Prep', 'Engagement Execution', 'Week Reflection'],
    ['Value Proposition', 'Authority Content', 'Lead Magnets', 'Email List Setup', 'Monetization Research', 'Website Planning', 'Week Reflection'],
    ['Content Performance', 'Content Iteration', 'Audience Research', 'Content Calendar', 'Platform Optimization', 'Hashtag Strategy', 'Week Reflection'],
    ['Product Ideation', 'Product Validation', 'Product Planning', 'MVP Development', 'Pricing Strategy', 'Launch Planning', 'Week Reflection'],
    ['Service Packages', 'Pricing Models', 'Sales Materials', 'Client Onboarding', 'Service Delivery', 'Testimonials', 'Week Reflection'],
    ['Digital Product Types', 'Product Creation', 'E-commerce Setup', 'Marketing Strategy', 'Distribution Channels', 'Product Completion', 'Week Reflection'],
    ['Automation Tools', 'Workflow Setup', 'Content Automation', 'Lead Automation', 'System Documentation', 'Team Planning', 'Week Reflection'],
    ['Platform Expansion', 'Collaboration Outreach', 'Cross-Promotion', 'Guest Content', 'Partnership Development', 'Network Building', 'Week Reflection'],
    ['Revenue Streams', 'Authority Content', 'Speaking/Media', 'Premium Offerings', 'Upsell Systems', 'Client Retention', 'Week Reflection'],
    ['Advanced Products', 'Scaling Revenue', 'Brand Evolution', 'Market Positioning', 'Strategic Planning', 'Systems Optimization', 'Week Reflection'],
    ['Performance Review', 'Metrics Analysis', 'Optimization Plan', 'Next Phase Strategy', 'System Refinement', 'Journey Complete', 'Celebration']
  ]
  return focuses[weekNum - 1]?.[dayIndex] || 'Brand Building'
}

function getDualBrandLearningResources(weekNum, dayIndex) {
  const allResources = [
    // Week 1 - Brand Foundation
    [
      [
        { title: 'Personal Branding Masterclass - Alex Hormozi', url: 'https://www.youtube.com/results?search_query=alex+hormozi+personal+branding', category: 'Video', platform: 'YouTube' },
        { title: 'Brand Identity Design Guide - Canva', url: 'https://www.canva.com/designschool/tutorials/brand-identity-design/', category: 'Tutorial', platform: 'Canva' },
        { title: 'Brand Strategy Framework - HubSpot', url: 'https://blog.hubspot.com/marketing/brand-strategy', category: 'Article', platform: 'HubSpot' }
      ],
      [
        { title: 'Logo Design Principles - 99designs', url: 'https://99designs.com/blog/tips/logo-design-basics/', category: 'Guide', platform: '99designs' },
        { title: 'Color Psychology in Branding', url: 'https://www.oberlo.com/blog/color-psychology-color-meanings', category: 'Article', platform: 'Oberlo' },
        { title: 'Typography for Brands - Adobe', url: 'https://www.adobe.com/creativecloud/design/discover/typography.html', category: 'Tutorial', platform: 'Adobe' }
      ],
      [
        { title: 'Instagram Profile Optimization 2024', url: 'https://blog.hootsuite.com/instagram-profile-optimization/', category: 'Guide', platform: 'Instagram' },
        { title: 'X (Twitter) Profile Setup Guide', url: 'https://help.twitter.com/en/managing-your-account/customizing-your-profile', category: 'Official', platform: 'X/Twitter' },
        { title: 'TikTok Profile Best Practices', url: 'https://www.tiktok.com/creators/creator-portal/en-us/getting-started-on-tiktok/optimize-your-profile/', category: 'Official', platform: 'TikTok' },
        { title: 'LinkedIn Profile Optimization', url: 'https://www.linkedin.com/help/linkedin/answer/a1339363', category: 'Official', platform: 'LinkedIn' },
        { title: 'Facebook Page Setup Guide', url: 'https://www.facebook.com/business/help/1746416099945119', category: 'Official', platform: 'Facebook' },
        { title: 'Threads Profile Setup', url: 'https://help.instagram.com/1631821640426723', category: 'Official', platform: 'Threads' }
      ],
      [
        { title: 'YouTube Channel Setup 2024', url: 'https://creatoracademy.youtube.com/page/course/getting-started', category: 'Official', platform: 'YouTube' },
        { title: 'YouTube Channel Art Guide', url: 'https://support.google.com/youtube/answer/2972003', category: 'Official', platform: 'YouTube' },
        { title: 'YouTube SEO Optimization', url: 'https://blog.hootsuite.com/youtube-seo/', category: 'Guide', platform: 'YouTube' }
      ],
      [
        { title: 'Content Pillars Strategy - Later', url: 'https://later.com/blog/content-pillars/', category: 'Guide', platform: 'All' },
        { title: 'Content Pillar Framework - Buffer', url: 'https://buffer.com/library/content-pillars/', category: 'Framework', platform: 'All' },
        { title: 'HavenX Content Pillars: Automation, Business Systems, Efficiency', category: 'Strategy', platform: 'HavenX' },
        { title: 'Ryxen Content Pillars: Wealth Mindset, Financial Freedom, Personal Growth', category: 'Strategy', platform: 'Ryxen' }
      ],
      [
        { title: 'Bio Writing Guide - Copyblogger', url: 'https://copyblogger.com/how-to-write-a-bio/', category: 'Guide', platform: 'All' },
        { title: 'LinkedIn Bio Examples', url: 'https://www.linkedin.com/help/linkedin/answer/a1339363', category: 'Examples', platform: 'LinkedIn' },
        { title: 'Instagram Bio Ideas', url: 'https://blog.hootsuite.com/instagram-bio-ideas/', category: 'Ideas', platform: 'Instagram' }
      ],
      [
        { title: 'Content Calendar Template - Notion', url: 'https://www.notion.so/templates/content-calendar', category: 'Template', platform: 'All' },
        { title: 'Social Media Calendar - Google Sheets', url: 'https://www.smartsheet.com/content/social-media-calendar-template', category: 'Template', platform: 'All' },
        { title: 'Content Planning Framework', url: 'https://buffer.com/library/content-calendar/', category: 'Framework', platform: 'All' }
      ]
    ],
    // Week 2
    [
      [{ title: 'Content Batching Guide', url: 'https://www.youtube.com/watch?v=KbZTPcNrFUk' }],
      [{ title: 'How to Write Viral Threads', url: 'https://www.youtube.com/watch?v=wvI8vn7gS3s' }],
      [{ title: 'YouTube Shorts Guide', url: 'https://www.youtube.com/watch?v=xPm5wtSxXLk' }],
      [{ title: 'TikTok Content Strategy', url: 'https://www.youtube.com/watch?v=7_lRV7gVHSs' }],
      [{ title: 'Social Media Scheduling', url: 'https://buffer.com/library/social-media-scheduling-tools/' }],
      [{ title: 'Content Audit Checklist', url: 'https://blog.hootsuite.com/content-audit/' }],
      [{ title: 'Content Performance Analysis', url: 'https://sproutsocial.com/insights/analyze-social-media/' }]
    ],
    // Week 3
    [
      [{ title: 'Engagement Strategies', url: 'https://www.youtube.com/watch?v=3nHh_0p4cBM' }],
      [{ title: 'Social Media Analytics Guide', url: 'https://blog.hootsuite.com/how-to-use-social-media-analytics/' }],
      [{ title: 'Growth Loop Strategy', url: 'https://www.youtube.com/watch?v=W1S8YOL2-GU' }],
      [{ title: 'Community Building Guide', url: 'https://www.youtube.com/watch?v=LrXrTLC8iRg' }],
      [{ title: 'Influencer Collaboration Guide', url: 'https://blog.hootsuite.com/how-to-reach-out-to-influencers/' }],
      [{ title: 'Engagement Best Practices', url: 'https://blog.hootsuite.com/instagram-engagement-tips/' }],
      [{ title: 'Metrics Dashboard Template', url: 'https://www.notion.so/' }]
    ],
    // Week 4
    [
      [{ title: 'Value Proposition Framework', url: 'https://www.youtube.com/watch?v=K3yQMg0FzLE' }],
      [{ title: 'Thought Leadership Guide', url: 'https://www.youtube.com/watch?v=G_HXjw9v1_M' }],
      [{ title: 'Lead Magnet Ideas', url: 'https://www.youtube.com/watch?v=3Z6gMqjNP2c' }],
      [{ title: 'Email Marketing Setup', url: 'https://www.youtube.com/watch?v=5-yEfXh1m8Y' }],
      [{ title: 'Monetization Strategies', url: 'https://www.youtube.com/watch?v=6hVjmrqPB2E' }],
      [{ title: 'Landing Page Guide', url: 'https://www.youtube.com/watch?v=YzpE7wz0Xqs' }],
      [{ title: 'Business Planning Template', url: 'https://www.notion.so/' }]
    ],
    // Week 5
    [
      [{ title: 'Content Performance Analysis', url: 'https://sproutsocial.com/insights/analyze-social-media/' }],
      [{ title: 'A/B Testing Content', url: 'https://www.youtube.com/watch?v=4NXp2Y8o1U0' }],
      [{ title: 'Audience Research Tools', url: 'https://blog.hootsuite.com/social-media-audience-research/' }],
      [{ title: 'Content Calendar Tools', url: 'https://coschedule.com/content-calendar-template' }],
      [{ title: 'Profile Optimization Guide', url: 'https://blog.hootsuite.com/how-to-optimize-social-media-profiles/' }],
      [{ title: 'Hashtag Research Guide', url: 'https://www.youtube.com/watch?v=7hHXO0a5JIU' }],
      [{ title: 'Optimization Checklist', url: 'https://www.notion.so/' }]
    ],
    // Week 6
    [
      [{ title: 'Digital Product Ideas', url: 'https://www.youtube.com/watch?v=zqG1xJ8v6L0' }],
      [{ title: 'Product Validation Guide', url: 'https://www.youtube.com/watch?v=1vzQ8VG5rRs' }],
      [{ title: 'Product Planning Framework', url: 'https://www.youtube.com/watch?v=Y5YjOHkq8bI' }],
      [{ title: 'MVP Development Guide', url: 'https://www.youtube.com/watch?v=QyQN0s8mWYU' }],
      [{ title: 'Pricing Strategy Guide', url: 'https://www.youtube.com/watch?v=4yNgv3DZ3c8' }],
      [{ title: 'Product Launch Checklist', url: 'https://www.youtube.com/watch?v=Xv7-VEL-0Fk' }],
      [{ title: 'Product Development Template', url: 'https://www.notion.so/' }]
    ],
    // Week 7
    [
      [{ title: 'Service Package Design', url: 'https://www.youtube.com/watch?v=3zQ4VY8R7Cc' }],
      [{ title: 'Service Pricing Guide', url: 'https://www.youtube.com/watch?v=6qR5XZ_j9G8' }],
      [{ title: 'Sales Deck Guide', url: 'https://www.youtube.com/watch?v=5NvQ9bY9gHI' }],
      [{ title: 'Client Onboarding Guide', url: 'https://www.youtube.com/watch?v=8JQl3X1bG1Y' }],
      [{ title: 'Service Delivery Framework', url: 'https://www.youtube.com/watch?v=KxVxZP7VHMc' }],
      [{ title: 'Testimonial Guide', url: 'https://www.youtube.com/watch?v=2qV5xX8Qh4Q' }],
      [{ title: 'Service Review Template', url: 'https://www.notion.so/' }]
    ],
    // Week 8
    [
      [{ title: 'Digital Product Types', url: 'https://www.youtube.com/watch?v=zqG1xJ8v6L0' }],
      [{ title: 'Digital Product Creation', url: 'https://www.youtube.com/watch?v=QyQN0s8mWYU' }],
      [{ title: 'E-commerce Setup Guide', url: 'https://www.youtube.com/watch?v=YzpE7wz0Xqs' }],
      [{ title: 'Product Marketing Guide', url: 'https://www.youtube.com/watch?v=Xv7-VEL-0Fk' }],
      [{ title: 'Distribution Strategy', url: 'https://www.youtube.com/watch?v=4NXp2Y8o1U0' }],
      [{ title: 'Product Finalization Checklist', url: 'https://www.notion.so/' }],
      [{ title: 'Monetization Review', url: 'https://www.notion.so/' }]
    ],
    // Week 9
    [
      [{ title: 'Automation Tools Guide', url: 'https://www.youtube.com/watch?v=3Z6gMqjNP2c' }],
      [{ title: 'Workflow Automation', url: 'https://www.youtube.com/watch?v=5-yEfXh1m8Y' }],
      [{ title: 'Content Automation Guide', url: 'https://buffer.com/library/social-media-scheduling-tools/' }],
      [{ title: 'Lead Automation Guide', url: 'https://www.youtube.com/watch?v=6hVjmrqPB2E' }],
      [{ title: 'System Documentation Guide', url: 'https://www.notion.so/' }],
      [{ title: 'Team Building Guide', url: 'https://www.youtube.com/watch?v=Y5YjOHkq8bI' }],
      [{ title: 'Scaling Review Template', url: 'https://www.notion.so/' }]
    ],
    // Week 10
    [
      [{ title: 'Platform Expansion Guide', url: 'https://blog.hootsuite.com/social-media-strategy/' }],
      [{ title: 'Collaboration Outreach', url: 'https://blog.hootsuite.com/how-to-reach-out-to-influencers/' }],
      [{ title: 'Cross-Promotion Guide', url: 'https://www.youtube.com/watch?v=7_lRV7gVHSs' }],
      [{ title: 'Guest Content Guide', url: 'https://www.youtube.com/watch?v=3nHh_0p4cBM' }],
      [{ title: 'Partnership Strategy', url: 'https://www.youtube.com/watch?v=LrXrTLC8iRg' }],
      [{ title: 'Networking Guide', url: 'https://www.youtube.com/watch?v=W1S8YOL2-GU' }],
      [{ title: 'Growth Review Template', url: 'https://www.notion.so/' }]
    ],
    // Week 11
    [
      [{ title: 'Revenue Diversification', url: 'https://www.youtube.com/watch?v=4yNgv3DZ3c8' }],
      [{ title: 'Authority Content Guide', url: 'https://www.youtube.com/watch?v=G_HXjw9v1_M' }],
      [{ title: 'Speaking Pitch Guide', url: 'https://www.youtube.com/watch?v=3zQ4VY8R7Cc' }],
      [{ title: 'Premium Offerings Guide', url: 'https://www.youtube.com/watch?v=6qR5XZ_j9G8' }],
      [{ title: 'Upsell Strategy', url: 'https://www.youtube.com/watch?v=5NvQ9bY9gHI' }],
      [{ title: 'Retention Strategy', url: 'https://www.youtube.com/watch?v=8JQl3X1bG1Y' }],
      [{ title: 'Revenue Review Template', url: 'https://www.notion.so/' }]
    ],
    // Week 12
    [
      [{ title: 'Product Launch Guide', url: 'https://www.youtube.com/watch?v=Xv7-VEL-0Fk' }],
      [{ title: 'Revenue Scaling Guide', url: 'https://www.youtube.com/watch?v=KxVxZP7VHMc' }],
      [{ title: 'Brand Evolution Guide', url: 'https://www.youtube.com/watch?v=K3yQMg0FzLE' }],
      [{ title: 'Market Positioning', url: 'https://www.youtube.com/watch?v=1vzQ8VG5rRs' }],
      [{ title: 'Strategic Planning Guide', url: 'https://www.notion.so/' }],
      [{ title: 'System Optimization', url: 'https://www.notion.so/' }],
      [{ title: 'Evolution Review Template', url: 'https://www.notion.so/' }]
    ],
    // Week 13
    [
      [{ title: 'Performance Review Template', url: 'https://www.notion.so/' }],
      [{ title: 'Metrics Analysis Guide', url: 'https://sproutsocial.com/insights/analyze-social-media/' }],
      [{ title: 'Optimization Framework', url: 'https://www.notion.so/' }],
      [{ title: 'Strategic Planning Template', url: 'https://www.notion.so/' }],
      [{ title: 'System Refinement Guide', url: 'https://www.notion.so/' }],
      [{ title: '90-Day Completion Review', url: '' }],
      [{ title: 'DUAL BRAND ASCENSION COMPLETE', url: '' }]
    ]
  ]
  return allResources[weekNum - 1]?.[dayIndex] || []
}

function getRyxenTasks(weekNum, dayIndex) {
  const tasks = [
    ['Define Ryxen mission, values, target persona', 'Design Ryxen logo concept, color palette', 'Create/optimize Ryxen Instagram, X, TikTok profiles', 'Create Ryxen YouTube channel', 'Define 5 Ryxen content pillars', 'Write compelling bios for all Ryxen platforms', 'Review week foundation work'],
    ['Create 3 Ryxen Instagram posts', 'Create 5 Ryxen X/Twitter threads', 'Script 2 Ryxen YouTube Shorts', 'Create 3 Ryxen TikTok videos', 'Schedule Week 3 content', 'Review all created content', 'Analyze what content resonated'],
    ['Define Ryxen engagement tactics', 'Set up Ryxen analytics tracking', 'Design Ryxen growth loop', 'Create Ryxen Discord server', 'Identify 5 Ryxen collaboration targets', 'Engage with 20 target accounts', 'Review growth metrics'],
    ['Refine Ryxen unique value proposition', 'Plan Ryxen thought leadership content', 'Create Ryxen freebie (wealth mindset PDF)', 'Set up Ryxen email list', 'Research Ryxen monetization paths', 'Plan Ryxen landing page structure', 'Review monetization foundation'],
    ['Analyze top-performing Ryxen content', 'Create improved versions of top formats', 'Deep dive into Ryxen audience insights', 'Build detailed Ryxen content calendar', 'Optimize Ryxen profiles for search', 'Research and test Ryxen hashtag sets', 'Review optimization results'],
    ['Brainstorm Ryxen digital product ideas', 'Validate Ryxen product with audience survey', 'Create Ryxen product outline/curriculum', 'Start building Ryxen MVP', 'Research Ryxen product pricing models', 'Plan Ryxen product launch sequence', 'Review product development progress'],
    ['Design Ryxen service packages', 'Set Ryxen service pricing', 'Create Ryxen service sales deck', 'Design Ryxen client onboarding process', 'Outline Ryxen service delivery framework', 'Collect/request Ryxen testimonials', 'Review service offerings'],
    ['Research Ryxen digital product options', 'Begin creating Ryxen first digital product', 'Set up Ryxen product sales page/shop', 'Create Ryxen product launch marketing plan', 'Identify Ryxen product distribution channels', 'Finalize Ryxen digital product', 'Review all monetization pathways'],
    ['Identify Ryxen automation needs', 'Set up Ryxen automated workflows', 'Automate Ryxen content posting schedule', 'Set up Ryxen lead capture automation', 'Document Ryxen brand systems & processes', 'Plan Ryxen team expansion', 'Review automation & scaling progress'],
    ['Expand Ryxen to additional platforms', 'Reach out to 5 Ryxen collaboration targets', 'Plan Ryxen cross-promotion campaigns', 'Create Ryxen guest content for partners', 'Develop Ryxen strategic partnerships', 'Build Ryxen professional network', 'Review growth & collaboration results'],
    ['Diversify Ryxen revenue streams', 'Create Ryxen high-authority content piece', 'Pitch Ryxen for speaking/media opportunities', 'Develop Ryxen premium tier offerings', 'Create Ryxen upsell/cross-sell systems', 'Design Ryxen client retention strategy', 'Review revenue expansion progress'],
    ['Launch Ryxen advanced product/service', 'Scale Ryxen revenue-generating activities', 'Evolve Ryxen brand positioning', 'Strengthen Ryxen market position', 'Plan Ryxen next 90 days', 'Optimize Ryxen all systems', 'Review brand evolution & monetization'],
    ['Comprehensive Ryxen 90-day review', 'Analyze all Ryxen key metrics', 'Create Ryxen optimization action plan', 'Develop Ryxen next 90-day strategy', 'Refine Ryxen all operational systems', 'Celebrate Ryxen achievements', 'DUAL BRAND ASCENSION COMPLETE']
  ]
  return tasks[weekNum - 1]?.[dayIndex] || 'Ryxen brand task'
}

function getHavenXTasks(weekNum, dayIndex) {
  const tasks = [
    ['Define HavenX mission, positioning, ideal client', 'Design HavenX logo concept, brand guidelines', 'Create/optimize HavenX LinkedIn, X, Instagram profiles', 'Create HavenX YouTube channel', 'Define 5 HavenX content pillars', 'Write compelling bios for all HavenX platforms', 'Review week foundation work'],
    ['Create 3 HavenX LinkedIn posts', 'Create 5 HavenX X/Twitter threads', 'Script 2 HavenX YouTube Shorts', 'Create 3 HavenX TikTok videos', 'Schedule Week 3 content', 'Review all created content', 'Analyze what content resonated'],
    ['Define HavenX engagement tactics', 'Set up HavenX analytics tracking', 'Design HavenX growth loop', 'Create HavenX Telegram group', 'Identify 5 HavenX collaboration targets', 'Engage with 20 target accounts', 'Review growth metrics'],
    ['Refine HavenX service packages', 'Plan HavenX case study content series', 'Create HavenX freebie (automation checklist)', 'Set up HavenX email list', 'Research HavenX monetization paths', 'Plan HavenX service page structure', 'Review monetization foundation'],
    ['Analyze top-performing HavenX content', 'Create improved versions of top formats', 'Deep dive into HavenX audience insights', 'Build detailed HavenX content calendar', 'Optimize HavenX profiles for search', 'Research and test HavenX hashtag sets', 'Review optimization results'],
    ['Brainstorm HavenX SaaS/software product ideas', 'Validate HavenX product with potential clients', 'Create HavenX product feature roadmap', 'Start building HavenX MVP', 'Research HavenX product pricing models', 'Plan HavenX product launch sequence', 'Review product development progress'],
    ['Design HavenX service packages', 'Set HavenX service pricing', 'Create HavenX service proposal template', 'Design HavenX client onboarding process', 'Outline HavenX service delivery framework', 'Collect/request HavenX testimonials', 'Review service offerings'],
    ['Research HavenX digital product options', 'Begin creating HavenX first digital product', 'Set up HavenX product sales page/shop', 'Create HavenX product launch marketing plan', 'Identify HavenX product distribution channels', 'Finalize HavenX digital product', 'Review all monetization pathways'],
    ['Identify HavenX automation needs', 'Set up HavenX automated workflows', 'Automate HavenX content posting schedule', 'Set up HavenX lead capture automation', 'Document HavenX brand systems & processes', 'Plan HavenX team expansion', 'Review automation & scaling progress'],
    ['Expand HavenX to additional platforms', 'Reach out to 5 HavenX collaboration targets', 'Plan HavenX cross-promotion campaigns', 'Create HavenX guest content for partners', 'Develop HavenX strategic partnerships', 'Build HavenX professional network', 'Review growth & collaboration results'],
    ['Diversify HavenX revenue streams', 'Create HavenX high-authority content piece', 'Pitch HavenX for speaking/media opportunities', 'Develop HavenX premium tier offerings', 'Create HavenX upsell/cross-sell systems', 'Design HavenX client retention strategy', 'Review revenue expansion progress'],
    ['Launch HavenX advanced product/service', 'Scale HavenX revenue-generating activities', 'Evolve HavenX brand positioning', 'Strengthen HavenX market position', 'Plan HavenX next 90 days', 'Optimize HavenX all systems', 'Review brand evolution & monetization'],
    ['Comprehensive HavenX 90-day review', 'Analyze all HavenX key metrics', 'Create HavenX optimization action plan', 'Develop HavenX next 90-day strategy', 'Refine HavenX all operational systems', 'Celebrate HavenX achievements', 'DUAL BRAND ASCENSION COMPLETE']
  ]
  return tasks[weekNum - 1]?.[dayIndex] || 'HavenX brand task'
}

function getDualBrandTheme(weekNum) {
  const themes = [
    'Brand Foundation, Voice, Visual Identity, Platform Setup',
    'Content Pillars, Batch Creation, Soft Posting',
    'Engagement, Growth, Analytics Setup',
    'Monetization Foundation, Authority Building',
    'Content Optimization, Audience Deep Dive',
    'Monetization Pathway 1: Product Development',
    'Monetization Pathway 2: Service Offerings',
    'Monetization Pathway 3: Digital Products',
    'Scaling Systems, Automation',
    'Cross-Platform Growth, Collaboration',
    'Revenue Expansion, Authority Positioning',
    'Advanced Monetization, Brand Evolution',
    'Optimization, Review, Next Phase Planning'
  ]
  return themes[weekNum - 1] || 'Brand Building Theme'
}

function getDualBrandOutcome(weekNum, dayIndex) {
  const outcomes = [
    ['Mission statements for both brands', 'Logo concepts + brand guidelines', '3 platforms set up per brand', 'YouTube channels live', 'Content pillar documents', 'Optimized bios across platforms', 'Week 1 foundation complete'],
    ['3 posts per brand ready', '5 threads per brand ready', '2 scripts per brand complete', '3 TikToks per brand ready', 'Content scheduled for Week 3', 'Brand voice consistency verified', 'Week 2 content batch complete'],
    ['Engagement plan per brand', 'Analytics dashboards configured', 'Growth loop systems designed', 'Community spaces launched', 'Collaboration list prepared', 'Daily engagement habit started', 'Week 3 growth strategy active'],
    ['Clear value props defined', 'Authority content calendar', 'Lead magnets designed', 'Email systems configured', 'Monetization roadmap draft', 'Website structure planned', 'Week 4 foundation complete'],
    ['Top content patterns identified', 'Iterated content created', 'Audience personas refined', '30-day calendars complete', 'Profiles fully optimized', 'Hashtag strategies implemented', 'Week 5 optimization complete'],
    ['Product ideas list created', 'Product validation complete', 'Product plans detailed', 'MVP development started', 'Pricing strategies defined', 'Launch plans drafted', 'Week 6 product foundation set'],
    ['Service packages defined', 'Pricing models established', 'Sales materials ready', 'Onboarding systems created', 'Delivery frameworks ready', 'Testimonial strategy in place', 'Week 7 service packages ready'],
    ['Product types selected', 'Products in development', 'Sales pages configured', 'Marketing plans ready', 'Distribution channels mapped', 'Products ready for launch', 'Week 8 digital products ready'],
    ['Automation tools selected', 'Workflows configured', 'Posting automated', 'Lead systems automated', 'Systems documented', 'Team plans prepared', 'Week 9 systems optimized'],
    ['New platforms active', 'Collaboration conversations started', 'Cross-promo plans ready', 'Guest content prepared', 'Partnerships initiated', 'Networks expanded', 'Week 10 growth accelerated'],
    ['Revenue streams mapped', 'Authority pieces published', 'Media pitches sent', 'Premium tiers designed', 'Upsell systems ready', 'Retention plans in place', 'Week 11 revenue expanded'],
    ['Advanced offerings live', 'Revenue scaling active', 'Brands evolved', 'Market positions solidified', 'Next phase planned', 'Systems optimized', 'Week 12 evolution complete'],
    ['Reviews completed', 'Metrics analyzed', 'Optimization plans ready', 'Next phase strategies set', 'Systems refined', 'DUAL BRAND ASCENSION COMPLETE', 'Celebration']
  ]
  return outcomes[weekNum - 1]?.[dayIndex] || 'Task outcome'
}

// Writer's Journey - Complete 12 weeks (60 days, Mon-Fri only)
export const writersWeeks = generateWeeks('2025-12-08', 12).map((week, idx) => {
  const days = []
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  
  for (let i = 0; i < 5; i++) {
    const dayDate = new Date(week.startDate)
    dayDate.setDate(new Date(week.startDate).getDate() + i)
    
    const dayDateString = dayDate.toISOString().split('T')[0]
    const dayNumber = idx * 5 + i + 1
    const isTestDay = isTestRunDay(dayDateString)
    const testContent = isTestDay ? getTestRunContent(dayDateString) : null
    
    // Shift content: days 8,9,10 are test runs, so day 11 gets day 8 content, etc.
    // For writers journey (5 days/week), day 8 = week 2 day 3, day 11 = week 3 day 1
    let contentWeekNum = idx + 1
    let contentDayIndex = i
    if (!isTestDay && dayNumber >= 11) {
      const originalDayNumber = dayNumber - 3
      contentWeekNum = Math.floor((originalDayNumber - 1) / 5) + 1
      contentDayIndex = (originalDayNumber - 1) % 5
    }
    
    const writerResources = isTestDay ? [] : getWriterResources(contentWeekNum, contentDayIndex)
    
    days.push({
      dayNumber: dayNumber,
      date: dayDateString,
      dayName: dayNames[i],
      learning: isTestDay ? 'App familiarization and testing' : getWriterLearning(contentWeekNum, contentDayIndex),
      execution: isTestDay ? 'Explore all app features' : getWriterExecution(contentWeekNum, contentDayIndex),
      reflection: isTestDay ? 'Prepare mentally for December 11th - the real journey begins' : getWriterReflection(idx + 1, i),
      theme: isTestDay ? testContent.focus : getWriterTheme(idx + 1),
      resources: isTestDay ? testContent.resources : writerResources,
      isTestRun: isTestDay,
      testRunNote: isTestDay ? testContent.testRunNote : null,
      testRunTasks: isTestDay ? testContent.tasks : null
    })
  }
  
  return { ...week, days }
})

function getWriterLearning(weekNum, dayIndex) {
  const learnings = [
    ['Discover your niche', 'Market research for niches', 'Monetization paths overview', 'Competitive analysis', 'Niche positioning'],
    ['Writing voice development', 'Personal brand for writers', 'Mission statement creation', 'Bio writing for writers', 'Brand consistency'],
    ['Writing process development', 'Research & planning systems', 'Drafting & editing systems', 'Productivity systems for writers', 'Quality assurance systems'],
    ['Portfolio development', 'Article writing fundamentals', 'Blog post writing', 'Social media content writing', 'Portfolio presentation'],
    ['Freelance platform setup', 'Client research & targeting', 'Pitch writing fundamentals', 'Pricing strategies', 'Contract & negotiation'],
    ['Content writing fundamentals', 'Copywriting principles', 'Storytelling for brands', 'Case study writing', 'Content portfolio'],
    ['Ghostwriting basics', 'Ghostwriting contracts', 'Maintaining client voice', 'Ghostwriting projects', 'Ghostwriting portfolio'],
    ['Platform strategy', 'Substack for writers', 'LinkedIn for writers', 'Portfolio website', 'Platform optimization'],
    ['Pitching systems', 'Outreach strategies', 'Cold pitch mastery', 'Warm pitch strategies', 'Pitch follow-up systems'],
    ['Brand content strategy', 'Newsletter writing', 'HavenX content strategy', 'Social media content', 'Content calendar'],
    ['Digital product types', 'E-book writing', 'Guide creation', 'Course content', 'Product packaging'],
    ['Rate improvement', 'Scaling freelance work', 'Publishing optimization', 'Passive income streams', 'Revenue diversification']
  ]
  return learnings[weekNum - 1]?.[dayIndex] || 'Writer learning topic'
}

function getWriterExecution(weekNum, dayIndex) {
  const executions = [
    ['Build Writer Income Map', 'Niche validation research', 'Monetization path selection', 'Analyze top 3 writers in niche', 'Finalize niche & positioning'],
    ['Define your writing voice', 'Build writer brand identity', 'Write writer mission statement', 'Write multiple bio versions', 'Create brand guidelines doc'],
    ['Map your current writing process', 'Create research system', 'Create drafting system', 'Build productivity system', 'Create complete writing system'],
    ['Plan portfolio structure', 'Write first portfolio article', 'Write second portfolio piece', 'Create social media samples', 'Compile & organize portfolio'],
    ['Set up freelance accounts', 'Build client prospect list', 'Create pitch templates', 'Set pricing structure', 'Prepare freelance toolkit'],
    ['Write brand content piece', 'Write sales copy', 'Write brand story', 'Write case study', 'Update portfolio with content samples'],
    ['Practice ghostwriting', 'Create ghostwriting contract template', 'Voice matching practice', 'Prepare ghostwriting service package', 'Build ghostwriting portfolio'],
    ['Choose & set up Medium account', 'Set up Substack newsletter', 'Optimize LinkedIn profile', 'Plan portfolio website', 'Optimize all platforms'],
    ['Create pitch templates library', 'Build outreach system', 'Write & send 5 cold pitches', 'Build warm pitch system', 'Create follow-up system'],
    ['Write R•ICH brand content', 'Write R•ICH newsletter', 'Write HavenX brand content', 'Create social content for both brands', 'Create content calendar for brands'],
    ['Plan first digital product', 'Start writing e-book', 'Create quick-start guide', 'Plan mini-course outline', 'Package digital products'],
    ['Analyze & improve rates', 'Create scaling plan', 'Optimize publishing workflow', 'Develop passive income plan', 'Create revenue roadmap']
  ]
  return executions[weekNum - 1]?.[dayIndex] || 'Writer execution task'
}

function getWriterReflection(weekNum, dayIndex) {
  const reflections = [
    ['Which topics excite me most and who pays for this writing?', 'What market signals validate my niche choice?', 'Which monetization paths align with my goals?', 'How can I differentiate while learning from the best?', 'Week 1 complete: What\'s my clear niche direction?'],
    ['What makes my writing voice unique?', 'How does my brand represent my writing?', 'What\'s my mission as a writer?', 'Which bio version best represents me?', 'Week 2 complete: Is my brand identity clear?'],
    ['What\'s my optimal writing workflow?', 'How can I research efficiently?', 'How do I draft most effectively?', 'What helps me write consistently?', 'Week 3 complete: Is my writing system repeatable?'],
    ['What samples showcase my skills best?', 'What makes this article strong?', 'How does this showcase my versatility?', 'How does social content demonstrate skill?', 'Week 4 complete: Is my portfolio compelling?'],
    ['How do I position myself competitively?', 'Which clients align with my niche?', 'What makes my pitch stand out?', 'What\'s my value-based pricing?', 'Week 5 complete: Am I ready to pitch?'],
    ['How did I capture the brand voice?', 'What makes copy persuasive?', 'How does storytelling connect with audiences?', 'What makes a compelling case study?', 'Week 6 complete: Is my content portfolio strong?'],
    ['How do I capture another\'s voice?', 'What protects me as a ghostwriter?', 'How do I maintain voice consistency?', 'What ghostwriting services can I offer?', 'Week 7 complete: Am I ready for ghostwriting projects?'],
    ['Why Medium for my platform?', 'What value does my newsletter provide?', 'How does LinkedIn support my writing career?', 'What pages does my portfolio site need?', 'Week 8 complete: Are my platforms optimized?'],
    ['What makes each pitch type effective?', 'How do I systematize outreach?', 'What did I learn from these pitches?', 'How do I warm up cold contacts?', 'Week 9 complete: Is my pitching system complete?'],
    ['How does this serve the R•ICH brand?', 'What value does this newsletter provide?', 'How does this serve the HavenX brand?', 'How does this content engage audiences?', 'Week 10 complete: Is my brand content strategy clear?'],
    ['What value will this product provide?', 'What\'s my e-book completion plan?', 'Is this guide valuable and actionable?', 'What\'s my course creation timeline?', 'Week 11 complete: Are my digital products ready?'],
    ['What\'s my value-based rate?', 'How can I scale without burning out?', 'How can I publish more efficiently?', 'What passive income can I create?', 'Week 12 complete: Is my revenue strategy diversified?']
  ]
  return reflections[weekNum - 1]?.[dayIndex] || 'Writer reflection prompt'
}

function getWriterTheme(weekNum) {
  const themes = [
    'Discover Your Niche & Market',
    'Build Brand Voice & Identity',
    'Signature Writing System',
    'Build Writing Samples & Portfolio',
    'Freelance Writing Foundations',
    'Content & Copywriting',
    'Ghostwriting',
    'Personal Platforms',
    'Pitching & Client Acquisition Systems',
    'Writing for R•ICH & HavenX',
    'Writing Digital Products',
    'Revenue Expansion & Scaling Systems'
  ]
  return themes[weekNum - 1] || 'Writer theme'
}

function getWriterResources(weekNum, dayIndex) {
  const baseResources = [
    { title: 'Writing Tips & Techniques', url: 'https://www.writersdigest.com/write-better-fiction', time: 'Guide' },
    { title: 'Freelance Writing Guide', url: 'https://www.makealivingwriting.com/', time: 'Resource' },
    { title: 'Copywriting Fundamentals', url: 'https://copyblogger.com/copywriting-101/', time: 'Course' },
    { title: 'Ghostwriting Guide', url: 'https://www.writersdigest.com/write-better-fiction/ghostwriting', time: 'Guide' },
    { title: 'Pitching Templates', url: 'https://www.makealivingwriting.com/pitch-templates/', time: 'Templates' },
    { title: 'Writer\'s Market', url: 'https://www.writersmarket.com/', time: 'Resource' }
  ]
  
  if (weekNum <= 2) {
    return [baseResources[0], baseResources[1]]
  } else if (weekNum <= 4) {
    return [baseResources[0], baseResources[2], baseResources[1]]
  } else if (weekNum <= 6) {
    return [baseResources[2], baseResources[3], baseResources[5]]
  } else if (weekNum <= 8) {
    return [baseResources[3], baseResources[4], baseResources[5]]
  } else {
    return baseResources
  }
}

// Software Engineering Journey - Complete 13 weeks
export const softwareEngineeringWeeks = generateWeeks('2025-12-08', 13).map((week, idx) => {
  const days = []
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(week.startDate)
    dayDate.setDate(new Date(week.startDate).getDate() + i)
    
    const dayDateString = dayDate.toISOString().split('T')[0]
    const dayNumber = idx * 7 + i + 1
    const isTestDay = isTestRunDay(dayDateString)
    const testContent = isTestDay ? getTestRunContent(dayDateString) : null
    
    // Shift content: days 8,9,10 are test runs, so day 11 gets day 8 content, etc.
    let contentWeekNum = idx + 1
    let contentDayIndex = i
    if (!isTestDay && dayNumber >= 11) {
      // Shift back: day 11 → day 8 content, day 12 → day 9, day 13 → day 10
      const originalDayNumber = dayNumber - 3
      contentWeekNum = Math.floor((originalDayNumber - 1) / 7) + 1
      contentDayIndex = (originalDayNumber - 1) % 7
    }
    
    const weekNum = idx + 1
    const learningData = isTestDay ? null : getSoftwareEngineeringLearning(contentWeekNum, contentDayIndex)
    const workflowData = isTestDay ? null : getSoftwareEngineeringCursorWorkflow(contentWeekNum, contentDayIndex)
    const projectData = isTestDay ? null : getSoftwareEngineeringProject(contentWeekNum, contentDayIndex)
    const monetizationData = isTestDay ? null : getSoftwareEngineeringMonetization(contentWeekNum, contentDayIndex)
    
    // Get scheduling and discipline rotation
    const timeBlocks = getTimeBlocks(i)
    const disciplineRotation = getDisciplineRotation(contentWeekNum, contentDayIndex)
    
    // Map existing content to disciplines and time blocks
    const scheduledContent = isTestDay ? [] : organizeContentBySchedule(
      learningData,
      projectData,
      workflowData,
      contentWeekNum,
      contentDayIndex,
      disciplineRotation,
      timeBlocks
    )
    
    days.push({
      dayNumber: dayNumber,
      date: dayDateString,
      dayName: dayNames[i],
      theme: isTestDay ? testContent.focus : getSoftwareEngineeringTheme(contentWeekNum),
      // Original content (preserved) - only if not test day
      dailyLearning: isTestDay ? 'App familiarization and testing' : learningData,
      cursorWorkflow: isTestDay ? 'Explore app features' : workflowData,
      miniProject: isTestDay ? 'Test all app functionality' : projectData,
      resources: isTestDay ? testContent.resources : getSoftwareEngineeringResources(weekNum, i),
      monetization: isTestDay ? 'No monetization tasks - app testing only' : monetizationData,
      quiz: isTestDay ? null : getSoftwareEngineeringQuizzes(contentWeekNum, contentDayIndex),
      socialPosting: isTestDay ? 'No posting - app testing' : getSoftwareEngineeringSocialPosting(contentWeekNum, contentDayIndex),
      reflection: isTestDay ? 'Prepare for December 11th - the real journey begins. No complaints, just lock in.' : getSoftwareEngineeringReflection(contentWeekNum, contentDayIndex),
      // Daily cumulative quiz and practical assessment
      dailyQuiz: isTestDay ? null : getDailyCumulativeQuiz(contentWeekNum, contentDayIndex, dayNumber),
      practicalAssessment: isTestDay ? null : getDailyPracticalAssessment(contentWeekNum, contentDayIndex, dayNumber),
      // New scheduling structure
      schedule: isTestDay ? { timeBlocks: [], disciplineRotation: [], scheduledContent: [] } : {
        timeBlocks: timeBlocks,
        disciplineRotation: disciplineRotation,
        scheduledContent: scheduledContent
      },
      isTestRun: isTestDay,
      testRunNote: isTestDay ? testContent.testRunNote : null,
      testRunTasks: isTestDay ? testContent.tasks : null
    })
  }
  
  return { ...week, days }
})

// Syncing logic: Connect Frontend → Backend → Mobile → WordPress
function getSyncedContent(discipline, weekNum, dayIndex, allDisciplinesContent) {
  // Ensure backend tasks relate to frontend material
  // Mobile tasks integrate APIs built in backend
  // WordPress tasks align with real-world patterns
  
  const syncMap = {
    Frontend: {
      connectsTo: ['Backend'], // Frontend prepares for backend integration
      prepares: 'API consumption, data fetching patterns'
    },
    Backend: {
      connectsTo: ['Frontend', 'Mobile'], // Backend serves frontend and mobile
      prepares: 'REST APIs, authentication, database queries'
    },
    Mobile: {
      connectsTo: ['Backend'], // Mobile consumes backend APIs
      prepares: 'API integration, state management with backend data'
    },
    WordPress: {
      connectsTo: ['Frontend'], // WordPress uses frontend skills
      prepares: 'Theme development, plugin UI, block development'
    }
  }
  
  const sync = syncMap[discipline] || {}
  const relatedDisciplines = sync.connectsTo || []
  
  // Find content from related disciplines to ensure coherence
  const relatedContent = relatedDisciplines.map(relDisc => {
    const relContent = allDisciplinesContent[relDisc]
    return relContent ? {
      discipline: relDisc,
      connection: sync.prepares,
      content: relContent
    } : null
  }).filter(Boolean)
  
  return {
    sync: sync,
    relatedContent: relatedContent,
    coherence: relatedContent.length > 0 ? 'Synced with related disciplines' : 'Standalone'
  }
}

// Organize existing content into scheduled time blocks by discipline
function organizeContentBySchedule(learningData, projectData, workflowData, weekNum, dayIndex, disciplineRotation, timeBlocks) {
  const scheduled = {
    deepLearning: [],
    focusedImplementation: []
  }
  
  const isSaturday = dayIndex === 5
  const isSunday = dayIndex === 6
  
  if (isSaturday) {
    // Saturday: WordPress only
    scheduled.deepLearning.push({
      ...timeBlocks.deepLearning[0],
      content: {
        title: learningData.title || 'WordPress Learning',
        topics: learningData.topics || [],
        type: 'study',
        discipline: 'WordPress'
      }
    })
    
    scheduled.focusedImplementation.push({
      ...timeBlocks.focusedImplementation[0],
      content: {
        title: projectData.title || 'WordPress Project',
        description: projectData.description || '',
        requirements: projectData.requirements || [],
        type: 'build',
        discipline: 'WordPress'
      }
    })
    
    return scheduled
  }
  
  // Sunday-Friday: All 4 disciplines must be covered
  const allDisciplines = disciplineRotation.allDisciplines // ['Frontend', 'Backend', 'Mobile', 'WordPress']
  
  // Collect all discipline content for syncing
  const allDisciplinesContent = {}
  allDisciplines.forEach(disc => {
    allDisciplinesContent[disc] = {
      learning: getDisciplineContent(learningData, disc, weekNum, 'study'),
      project: getDisciplineContent(projectData, disc, weekNum, 'build')
    }
  })
  
  // Map learning content to Deep Learning blocks with syncing
  timeBlocks.deepLearning.forEach((block) => {
    const discipline = block.discipline
    const disciplineContent = getDisciplineContent(learningData, discipline, weekNum, 'study')
    const syncInfo = getSyncedContent(discipline, weekNum, dayIndex, allDisciplinesContent)
    
    scheduled.deepLearning.push({
      ...block,
      content: {
        ...disciplineContent,
        sync: syncInfo
      }
    })
  })
  
  // Map project content to Focused Implementation blocks with syncing
  timeBlocks.focusedImplementation.forEach((block) => {
    const discipline = block.discipline
    const disciplineContent = getDisciplineContent(projectData, discipline, weekNum, 'build')
    const syncInfo = getSyncedContent(discipline, weekNum, dayIndex, allDisciplinesContent)
    
    scheduled.focusedImplementation.push({
      ...block,
      content: {
        ...disciplineContent,
        sync: syncInfo
      }
    })
  })
  
  // Ensure all 4 disciplines are covered (add missing ones)
  const coveredDisciplines = new Set([
    ...scheduled.deepLearning.map(b => b.discipline),
    ...scheduled.focusedImplementation.map(b => b.discipline)
  ])
  
  allDisciplines.forEach(discipline => {
    if (!coveredDisciplines.has(discipline)) {
      // Add missing discipline to appropriate time blocks
      if (timeBlocks.additional) {
        const studyBlock = timeBlocks.additional.deepLearning.find(b => b.discipline === discipline)
        const buildBlock = timeBlocks.additional.focusedImplementation.find(b => b.discipline === discipline)
        
        if (studyBlock) {
          scheduled.deepLearning.push({
            ...studyBlock,
            content: getDisciplineContent(learningData, discipline, weekNum, 'study')
          })
        }
        
        if (buildBlock) {
          scheduled.focusedImplementation.push({
            ...buildBlock,
            content: getDisciplineContent(projectData, discipline, weekNum, 'build')
          })
        }
      } else {
        // Fallback: add to flexible time
        scheduled.deepLearning.push({
          time: 'Flexible',
          discipline: discipline,
          type: 'study',
          duration: '30-60 min',
          content: getDisciplineContent(learningData, discipline, weekNum, 'study')
        })
        
        scheduled.focusedImplementation.push({
          time: 'Flexible',
          discipline: discipline,
          type: 'build',
          duration: '30-60 min',
          content: getDisciplineContent(projectData, discipline, weekNum, 'build')
        })
      }
    }
  })
  
  return scheduled
}

// Get discipline-specific content from existing curriculum
// Skill-specific resource mapping with videos, docs, and course materials
function getSkillResources(skillName) {
  const skillResources = {
    // Frontend Skills
    'HTML5': [
      { title: 'MDN HTML5 Elements Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element', category: 'Documentation', time: '30 min', type: 'deep-learning' },
      { title: 'HTML5 Crash Course - Traversy Media', url: 'https://www.youtube.com/watch?v=UB1O30fR-EE', category: 'Video', time: '60 min', type: 'deep-learning' },
      { title: 'HTML5 Semantic Elements', url: 'https://www.w3schools.com/html/html5_semantic_elements.asp', category: 'Tutorial', time: '20 min', type: 'deep-learning' },
      { title: 'HTML5 Accessibility Guide', url: 'https://developer.mozilla.org/en-US/docs/Learn/Accessibility/HTML', category: 'Documentation', time: '25 min', type: 'deep-learning' }
    ],
    'CSS3': [
      { title: 'MDN CSS Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics', category: 'Documentation', time: '30 min', type: 'deep-learning' },
      { title: 'CSS Crash Course - Traversy Media', url: 'https://www.youtube.com/watch?v=yfoY53QXEnI', category: 'Video', time: '90 min', type: 'deep-learning' },
      { title: 'CSS Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', category: 'Tutorial', time: '20 min', type: 'deep-learning' },
      { title: 'CSS Grid Guide', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/', category: 'Tutorial', time: '25 min', type: 'deep-learning' },
      { title: 'Responsive Design Tutorial', url: 'https://web.dev/learn/design/', category: 'Course', time: '45 min', type: 'deep-learning' }
    ],
    'TailwindCSS': [
      { title: 'Tailwind CSS Official Docs', url: 'https://tailwindcss.com/docs', category: 'Documentation', time: 'Reference', type: 'deep-learning' },
      { title: 'Tailwind CSS Crash Course', url: 'https://www.youtube.com/watch?v=UB1O30fR-EE', category: 'Video', time: '60 min', type: 'deep-learning' },
      { title: 'Tailwind CSS Components', url: 'https://tailwindui.com/components', category: 'Examples', time: '30 min', type: 'deep-learning' },
      { title: 'Tailwind Play', url: 'https://play.tailwindcss.com/', category: 'Practice', time: 'Interactive', type: 'deep-learning' }
    ],
    'JavaScript ES6': [
      { title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', category: 'Documentation', time: 'Reference', type: 'deep-learning' },
      { title: 'JavaScript Crash Course - Traversy', url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c', category: 'Video', time: '120 min', type: 'deep-learning' },
      { title: 'ES6+ Features Guide', url: 'https://www.freecodecamp.org/news/es6-features/', category: 'Tutorial', time: '40 min', type: 'deep-learning' },
      { title: 'JavaScript.info', url: 'https://javascript.info/', category: 'Course', time: 'Reference', type: 'deep-learning' },
      { title: 'DOM Manipulation Guide', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Manipulating_documents', category: 'Documentation', time: '30 min', type: 'deep-learning' }
    ],
    'React': [
      { title: 'React Official Tutorial', url: 'https://react.dev/learn', category: 'Course', time: '90 min', type: 'deep-learning' },
      { title: 'React Crash Course - Traversy', url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', category: 'Video', time: '120 min', type: 'deep-learning' },
      { title: 'React Hooks Guide', url: 'https://react.dev/reference/react', category: 'Documentation', time: '45 min', type: 'deep-learning' },
      { title: 'React Router Tutorial', url: 'https://reactrouter.com/en/main/start/tutorial', category: 'Tutorial', time: '30 min', type: 'deep-learning' }
    ],
    'Next.js': [
      { title: 'Next.js Official Docs', url: 'https://nextjs.org/docs', category: 'Documentation', time: 'Reference', type: 'deep-learning' },
      { title: 'Next.js Crash Course', url: 'https://www.youtube.com/watch?v=mTz0GXj8NN0', category: 'Video', time: '90 min', type: 'deep-learning' },
      { title: 'Next.js Learn Course', url: 'https://nextjs.org/learn', category: 'Course', time: '120 min', type: 'deep-learning' }
    ],
    // Backend Skills
    'Node.js': [
      { title: 'Node.js Official Docs', url: 'https://nodejs.org/en/docs', category: 'Documentation', time: 'Reference', type: 'deep-learning' },
      { title: 'Node.js Crash Course', url: 'https://www.youtube.com/watch?v=fBNz5xFKGxE', category: 'Video', time: '90 min', type: 'deep-learning' },
      { title: 'Node.js Tutorial - W3Schools', url: 'https://www.w3schools.com/nodejs/', category: 'Tutorial', time: '60 min', type: 'deep-learning' }
    ],
    'Express': [
      { title: 'Express.js Official Docs', url: 'https://expressjs.com', category: 'Documentation', time: 'Reference', type: 'deep-learning' },
      { title: 'Express.js Crash Course', url: 'https://www.youtube.com/watch?v=L72fhGm1tfE', category: 'Video', time: '60 min', type: 'deep-learning' },
      { title: 'Express Middleware Guide', url: 'https://expressjs.com/en/guide/using-middleware.html', category: 'Documentation', time: '25 min', type: 'deep-learning' }
    ],
    'REST APIs': [
      { title: 'REST API Tutorial', url: 'https://restfulapi.net/', category: 'Tutorial', time: '45 min', type: 'deep-learning' },
      { title: 'Building REST APIs - Traversy', url: 'https://www.youtube.com/watch?v=pKd0Rpw7Y48', category: 'Video', time: '90 min', type: 'deep-learning' },
      { title: 'API Design Best Practices', url: 'https://restfulapi.net/', category: 'Guide', time: '30 min', type: 'deep-learning' }
    ],
    'Authentication': [
      { title: 'JWT Authentication Guide', url: 'https://jwt.io/introduction', category: 'Documentation', time: '30 min', type: 'deep-learning' },
      { title: 'Node.js Auth Tutorial', url: 'https://www.youtube.com/watch?v=2jqok-WgelI', category: 'Video', time: '90 min', type: 'deep-learning' },
      { title: 'OAuth 2.0 Guide', url: 'https://oauth.net/2/', category: 'Documentation', time: '40 min', type: 'deep-learning' }
    ],
    'Databases': [
      { title: 'MongoDB University', url: 'https://university.mongodb.com/', category: 'Course', time: '120 min', type: 'deep-learning' },
      { title: 'PostgreSQL Tutorial', url: 'https://www.postgresqltutorial.com/', category: 'Tutorial', time: '90 min', type: 'deep-learning' },
      { title: 'SQL vs NoSQL Explained', url: 'https://www.youtube.com/watch?v=ZS_kXvOeQ5Y', category: 'Video', time: '20 min', type: 'deep-learning' }
    ],
    'ORMs': [
      { title: 'Prisma Documentation', url: 'https://www.prisma.io/docs', category: 'Documentation', time: 'Reference', type: 'deep-learning' },
      { title: 'Mongoose Guide', url: 'https://mongoosejs.com/docs/guide.html', category: 'Documentation', time: '45 min', type: 'deep-learning' },
      { title: 'Prisma Crash Course', url: 'https://www.youtube.com/watch?v=RebA5J-rlwg', category: 'Video', time: '60 min', type: 'deep-learning' }
    ],
    // Mobile Skills
    'Dart': [
      { title: 'Dart Language Tour', url: 'https://dart.dev/guides/language/language-tour', category: 'Documentation', time: '60 min', type: 'deep-learning' },
      { title: 'Dart Crash Course', url: 'https://www.youtube.com/watch?v=5xlVP04905w', category: 'Video', time: '90 min', type: 'deep-learning' }
    ],
    'Flutter Widgets': [
      { title: 'Flutter Widget Catalog', url: 'https://docs.flutter.dev/development/ui/widgets', category: 'Documentation', time: 'Reference', type: 'deep-learning' },
      { title: 'Flutter Crash Course', url: 'https://www.youtube.com/watch?v=1ukSR1GRtMU', category: 'Video', time: '120 min', type: 'deep-learning' },
      { title: 'Flutter Tutorial', url: 'https://docs.flutter.dev/get-started/codelab', category: 'Tutorial', time: '90 min', type: 'deep-learning' }
    ],
    'State Management': [
      { title: 'Flutter State Management', url: 'https://docs.flutter.dev/development/data-and-backend/state-mgmt', category: 'Documentation', time: '45 min', type: 'deep-learning' },
      { title: 'Provider Package Guide', url: 'https://pub.dev/packages/provider', category: 'Documentation', time: '30 min', type: 'deep-learning' }
    ],
    'React Native': [
      { title: 'React Native Docs', url: 'https://reactnative.dev/docs/getting-started', category: 'Documentation', time: 'Reference', type: 'deep-learning' },
      { title: 'React Native Tutorial', url: 'https://www.youtube.com/watch?v=0-S5a0eXPoc', category: 'Video', time: '120 min', type: 'deep-learning' }
    ],
    // WordPress Skills
    'WP Structure': [
      { title: 'WordPress File Structure', url: 'https://developer.wordpress.org/themes/basics/template-files/', category: 'Documentation', time: '30 min', type: 'deep-learning' },
      { title: 'WordPress Basics Course', url: 'https://wordpress.org/support/article/first-steps-with-wordpress/', category: 'Tutorial', time: '45 min', type: 'deep-learning' }
    ],
    'Custom Themes': [
      { title: 'Theme Development Handbook', url: 'https://developer.wordpress.org/themes/', category: 'Documentation', time: 'Reference', type: 'deep-learning' },
      { title: 'WordPress Theme Development', url: 'https://www.youtube.com/watch?v=8OBfr46Y0gc', category: 'Video', time: '120 min', type: 'deep-learning' }
    ],
    'Gutenberg Blocks': [
      { title: 'Gutenberg Handbook', url: 'https://developer.wordpress.org/block-editor/', category: 'Documentation', time: 'Reference', type: 'deep-learning' },
      { title: 'Block Development Tutorial', url: 'https://developer.wordpress.org/block-editor/getting-started/', category: 'Tutorial', time: '60 min', type: 'deep-learning' }
    ],
    'Plugin Development': [
      { title: 'Plugin Handbook', url: 'https://developer.wordpress.org/plugins/', category: 'Documentation', time: 'Reference', type: 'deep-learning' },
      { title: 'WordPress Plugin Development', url: 'https://www.youtube.com/watch?v=0g0rhjgz3KE', category: 'Video', time: '90 min', type: 'deep-learning' }
    ]
  }
  
  return skillResources[skillName] || []
}

// Get quiz data for each skill
function getSkillQuiz(skillName) {
  const quizzes = {
    'HTML5': [
      {
        question: 'What is the purpose of the <!DOCTYPE html> declaration?',
        options: [
          'It tells the browser which version of HTML to use',
          "It's required for HTML5 validation",
          'It enables modern browser features',
          'All of the above'
        ],
        correctAnswer: 3,
        explanation: 'The DOCTYPE declaration tells browsers which HTML version to use, is required for validation, and enables modern features.'
      },
      {
        question: 'Which HTML5 element should be used for the main content of a page?',
        options: ['<div class="main">', '<main>', '<section>', '<article>'],
        correctAnswer: 1,
        explanation: 'The <main> element is the semantic HTML5 element specifically designed for the main content of a page.'
      },
      {
        question: 'What is the difference between <article> and <section>?',
        options: [
          '<article> is for standalone content, <section> is for thematic grouping',
          'They are interchangeable',
          '<section> must always contain <article>',
          '<article> is only for blog posts'
        ],
        correctAnswer: 0,
        explanation: '<article> represents standalone, independently distributable content, while <section> is for thematic grouping of content.'
      }
    ],
    'CSS3': [
      {
        question: 'What does CSS stand for?',
        options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 1,
        explanation: 'CSS stands for Cascading Style Sheets, which is used to style HTML elements.'
      },
      {
        question: 'Which property is used to change the background color?',
        options: ['color', 'bgcolor', 'background-color', 'background'],
        correctAnswer: 2,
        explanation: 'The background-color property is used to set the background color of an element.'
      },
      {
        question: 'What is Flexbox used for?',
        options: ['Text formatting', 'Layout and alignment', 'Color schemes', 'Animations'],
        correctAnswer: 1,
        explanation: 'Flexbox is a layout method designed for one-dimensional layouts and alignment of items.'
      }
    ],
    'JavaScript ES6': [
      {
        question: 'What is the difference between let and var?',
        options: [
          'let has block scope, var has function scope',
          'They are identical',
          'var is newer than let',
          'let cannot be reassigned'
        ],
        correctAnswer: 0,
        explanation: 'let has block scope (limited to the block it is declared in), while var has function scope.'
      },
      {
        question: 'What does the arrow function syntax (=>) provide?',
        options: ['Shorter syntax', 'Lexical this binding', 'Both A and B', 'Neither'],
        correctAnswer: 2,
        explanation: 'Arrow functions provide shorter syntax and automatically bind this from the enclosing context.'
      }
    ],
    'React': [
      {
        question: 'What is a React component?',
        options: [
          'A JavaScript function that returns JSX',
          'A CSS class',
          'An HTML element',
          'A database table'
        ],
        correctAnswer: 0,
        explanation: 'A React component is a JavaScript function that returns JSX to describe what should appear on screen.'
      },
      {
        question: 'What is the purpose of useState hook?',
        options: [
          'To fetch data from an API',
          'To manage component state',
          'To style components',
          'To handle events'
        ],
        correctAnswer: 1,
        explanation: 'useState is a React hook used to add state management to functional components.'
      }
    ],
    'Node.js': [
      {
        question: 'What is Node.js?',
        options: [
          'A JavaScript framework',
          'A JavaScript runtime built on Chrome\'s V8 engine',
          'A database',
          'A text editor'
        ],
        correctAnswer: 1,
        explanation: 'Node.js is a JavaScript runtime that allows you to run JavaScript on the server side.'
      }
    ]
  }
  
  return quizzes[skillName] || []
}

// Discipline-specific resource mapping (enhanced with skill-based resources)
function getDisciplineResources(discipline, weekNum, skillName = null) {
  // If skillName is provided, return skill-specific resources
  if (skillName) {
    return getSkillResources(skillName)
  }
  
  // Otherwise return general discipline resources
  const resources = {
    Frontend: [
      { title: 'MDN Web Docs', url: 'https://developer.mozilla.org', category: 'Documentation', time: 'Reference', type: 'deep-learning' },
      { title: 'Tailwind CSS Docs', url: 'https://tailwindcss.com/docs', category: 'Framework', time: 'Reference', type: 'deep-learning' },
      { title: 'React Official Docs', url: 'https://react.dev/learn', category: 'Library', time: 'Reference', type: 'deep-learning' },
      { title: 'Next.js Official Docs', url: 'https://nextjs.org/docs', category: 'Framework', time: 'Reference', type: 'deep-learning' }
    ],
    Backend: [
      { title: 'Node.js Documentation', url: 'https://nodejs.org/en/docs', category: 'Runtime', time: 'Reference', type: 'deep-learning' },
      { title: 'Express.js Docs', url: 'https://expressjs.com', category: 'Framework', time: 'Reference', type: 'deep-learning' },
      { title: 'MongoDB Documentation', url: 'https://www.mongodb.com/docs', category: 'Database', time: 'Reference', type: 'deep-learning' },
      { title: 'PostgreSQL Docs', url: 'https://www.postgresql.org/docs', category: 'Database', time: 'Reference', type: 'deep-learning' },
      { title: 'Prisma Documentation', url: 'https://www.prisma.io/docs', category: 'ORM', time: 'Reference', type: 'deep-learning' }
    ],
    Mobile: [
      { title: 'Flutter Documentation', url: 'https://docs.flutter.dev', category: 'Framework', time: 'Reference', type: 'deep-learning' },
      { title: 'Dart Language Guide', url: 'https://dart.dev/guides', category: 'Language', time: 'Reference', type: 'deep-learning' },
      { title: 'React Native Docs', url: 'https://reactnative.dev', category: 'Framework', time: 'Reference', type: 'deep-learning' }
    ],
    WordPress: [
      { title: 'WordPress Developer Docs', url: 'https://developer.wordpress.org', category: 'CMS', time: 'Reference', type: 'deep-learning' },
      { title: 'Gutenberg Handbook', url: 'https://developer.wordpress.org/block-editor', category: 'Editor', time: 'Reference', type: 'deep-learning' }
    ]
  }
  
  return resources[discipline] || []
}

// Export functions for use in components
// Get topics for each skill
function getSkillTopics(skillName) {
  const skillTopics = {
    'HTML5': [
      'HTML document structure: <!DOCTYPE html>, <html>, <head>, <body>',
      'Semantic HTML5 elements: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>',
      'Text elements: headings (<h1>-<h6>), paragraphs (<p>), lists (<ul>, <ol>, <dl>)',
      'Links and navigation: <a>, href attributes, relative vs absolute paths',
      'Images: <img>, alt attributes, srcset for responsive images',
      'Forms: <form>, <input> types, <label>, <button>, <textarea>, <select>',
      'Metadata: <meta> tags, Open Graph, SEO basics',
      'Accessibility: ARIA labels, semantic structure, keyboard navigation'
    ],
    'CSS3': [
      'CSS syntax: selectors, properties, values',
      'Three ways to add CSS: inline, <style>, external stylesheet',
      'Basic selectors: element, class (.), ID (#)',
      'Box model: content, padding, border, margin',
      'Display types: block, inline, inline-block, none',
      'Positioning: static, relative, absolute, fixed, sticky',
      'Flexbox: container and item properties',
      'CSS Grid: grid-template-columns, grid-template-rows, gap',
      'Responsive Design: media queries, mobile-first approach'
    ],
    'TailwindCSS': [
      'Utility-first CSS philosophy',
      'Installation: CDN, npm, CLI',
      'Configuration: tailwind.config.js',
      'Core concepts: utility classes vs component classes',
      'Responsive prefixes: sm:, md:, lg:, xl:, 2xl:',
      'State variants: hover:, focus:, active:, disabled:',
      'Dark mode: dark:',
      'Spacing, typography, colors, layout utilities',
      'Custom configuration: colors, fonts, spacing'
    ],
    'JavaScript ES6': [
      'Variables: let, const, var',
      'Data types: string, number, boolean, object, array',
      'Functions: arrow functions, function declarations',
      'DOM manipulation: querySelector, addEventListener',
      'ES6 features: destructuring, spread operator, template literals',
      'Async JavaScript: promises, async/await',
      'Fetch API: making HTTP requests',
      'Event handling and callbacks'
    ],
    'React': [
      'React basics: components, JSX, props',
      'State management: useState hook',
      'Effects: useEffect hook',
      'Event handling in React',
      'Conditional rendering',
      'Lists and keys',
      'Component lifecycle',
      'React Router for navigation'
    ],
    'Next.js': [
      'File-based routing',
      'Pages and layouts',
      'API routes',
      'Server-side rendering (SSR)',
      'Static site generation (SSG)',
      'Data fetching: getServerSideProps, getStaticProps',
      'Image optimization',
      'Deployment'
    ],
    'Node.js': [
      'Node.js basics and runtime',
      'NPM and package management',
      'File system operations',
      'HTTP server creation',
      'Modules: require, module.exports',
      'Event loop and asynchronous programming',
      'Streams and buffers'
    ],
    'Express': [
      'Express setup and routing',
      'Middleware: built-in and custom',
      'Request and response objects',
      'Route parameters and query strings',
      'Error handling',
      'Template engines',
      'Static files serving'
    ],
    'REST APIs': [
      'REST principles',
      'HTTP methods: GET, POST, PUT, DELETE',
      'Request/response cycle',
      'API endpoints design',
      'Status codes',
      'JSON data format',
      'API documentation'
    ],
    'Authentication': [
      'Authentication vs authorization',
      'JWT tokens',
      'Password hashing',
      'Session management',
      'OAuth 2.0',
      'Security best practices',
      'Protected routes'
    ],
    'Databases': [
      'SQL vs NoSQL',
      'MongoDB basics',
      'PostgreSQL basics',
      'CRUD operations',
      'Database relationships',
      'Indexes and optimization',
      'Query optimization'
    ],
    'ORMs': [
      'ORM concepts',
      'Prisma setup and schema',
      'Mongoose for MongoDB',
      'Migrations',
      'Relationships in ORMs',
      'Query building',
      'Data validation'
    ],
    'Dart': [
      'Dart language basics',
      'Variables and data types',
      'Functions and classes',
      'Null safety',
      'Async programming',
      'Packages and imports'
    ],
    'Flutter Widgets': [
      'Widget tree concept',
      'Stateless vs Stateful widgets',
      'Common widgets: Container, Row, Column',
      'Material Design widgets',
      'Layout widgets',
      'Navigation'
    ],
    'State Management': [
      'State management concepts',
      'Provider package',
      'setState vs state management',
      'Global state vs local state',
      'State management patterns'
    ],
    'React Native': [
      'React Native basics',
      'Components and styling',
      'Navigation',
      'Platform-specific code',
      'Native modules',
      'Performance optimization'
    ],
    'WP Structure': [
      'WordPress file structure',
      'Theme hierarchy',
      'Template files',
      'The Loop',
      'Hooks and filters',
      'WordPress database'
    ],
    'Custom Themes': [
      'Theme development basics',
      'Creating a theme',
      'Template hierarchy',
      'Custom post types',
      'Widgets and menus',
      'Theme customization'
    ],
    'Gutenberg Blocks': [
      'Block editor basics',
      'Creating custom blocks',
      'Block attributes',
      'Block editor API',
      'Block patterns',
      'Reusable blocks'
    ],
    'Plugin Development': [
      'Plugin structure',
      'Creating a plugin',
      'Hooks and filters',
      'Database operations',
      'Admin pages',
      'Plugin security'
    ]
  };
  
  return skillTopics[skillName] || [];
}

export { getSkillResources, getSkillQuiz, getSkillTopics };

// Roadmap progression for each discipline (enhanced with resources and quizzes)
function getDisciplineRoadmap(discipline) {
  const roadmaps = {
    Frontend: [
      { 
        skill: 'HTML5', 
        status: 'foundation', 
        description: 'Semantic Structure → Accessibility',
        resources: getSkillResources('HTML5'),
        quiz: getSkillQuiz('HTML5'),
        deepLearningTime: '60 min'
      },
      { 
        skill: 'CSS3', 
        status: 'foundation', 
        description: 'Flexbox → Grid → Responsive Design',
        resources: getSkillResources('CSS3'),
        quiz: getSkillQuiz('CSS3'),
        deepLearningTime: '90 min'
      },
      { 
        skill: 'TailwindCSS', 
        status: 'intermediate', 
        description: 'Utilities → Components → Layouts',
        resources: getSkillResources('TailwindCSS'),
        quiz: [],
        deepLearningTime: '60 min'
      },
      { 
        skill: 'JavaScript ES6', 
        status: 'intermediate', 
        description: 'DOM → Async → Fetch → APIs',
        resources: getSkillResources('JavaScript ES6'),
        quiz: getSkillQuiz('JavaScript ES6'),
        deepLearningTime: '120 min'
      },
      { 
        skill: 'React', 
        status: 'advanced', 
        description: 'Basics → Hooks → State → Routing',
        resources: getSkillResources('React'),
        quiz: getSkillQuiz('React'),
        deepLearningTime: '120 min'
      },
      { 
        skill: 'Next.js', 
        status: 'advanced', 
        description: 'File-based routing → API routes → SSR/SSG',
        resources: getSkillResources('Next.js'),
        quiz: [],
        deepLearningTime: '90 min'
      }
    ],
    Backend: [
      { 
        skill: 'Node.js', 
        status: 'foundation', 
        description: 'Runtime basics',
        resources: getSkillResources('Node.js'),
        quiz: getSkillQuiz('Node.js'),
        deepLearningTime: '90 min'
      },
      { 
        skill: 'Express', 
        status: 'intermediate', 
        description: 'Routing & middleware',
        resources: getSkillResources('Express'),
        quiz: [],
        deepLearningTime: '60 min'
      },
      { 
        skill: 'REST APIs', 
        status: 'intermediate', 
        description: 'API design',
        resources: getSkillResources('REST APIs'),
        quiz: [],
        deepLearningTime: '90 min'
      },
      { 
        skill: 'Authentication', 
        status: 'advanced', 
        description: 'JWT, sessions',
        resources: getSkillResources('Authentication'),
        quiz: [],
        deepLearningTime: '90 min'
      },
      { 
        skill: 'Databases', 
        status: 'advanced', 
        description: 'MongoDB or PostgreSQL',
        resources: getSkillResources('Databases'),
        quiz: [],
        deepLearningTime: '120 min'
      },
      { 
        skill: 'ORMs', 
        status: 'advanced', 
        description: 'Prisma or Mongoose',
        resources: getSkillResources('ORMs'),
        quiz: [],
        deepLearningTime: '60 min'
      },
      { 
        skill: 'Deployment', 
        status: 'advanced', 
        description: 'Production fundamentals',
        resources: [],
        quiz: [],
        deepLearningTime: '90 min'
      }
    ],
    Mobile: [
      { 
        skill: 'Dart', 
        status: 'foundation', 
        description: 'Language essentials',
        resources: getSkillResources('Dart'),
        quiz: [],
        deepLearningTime: '90 min'
      },
      { 
        skill: 'Flutter Widgets', 
        status: 'intermediate', 
        description: 'UI components',
        resources: getSkillResources('Flutter Widgets'),
        quiz: [],
        deepLearningTime: '120 min'
      },
      { 
        skill: 'State Management', 
        status: 'intermediate', 
        description: 'Navigation & state',
        resources: getSkillResources('State Management'),
        quiz: [],
        deepLearningTime: '60 min'
      },
      { 
        skill: 'API Integration', 
        status: 'advanced', 
        description: 'Connecting to backend',
        resources: [],
        quiz: [],
        deepLearningTime: '90 min'
      },
      { 
        skill: 'Deployment', 
        status: 'advanced', 
        description: 'Mobile app deployment',
        resources: [],
        quiz: [],
        deepLearningTime: '90 min'
      },
      { 
        skill: 'React Native', 
        status: 'optional', 
        description: 'Cross-competency',
        resources: getSkillResources('React Native'),
        quiz: [],
        deepLearningTime: '120 min'
      }
    ],
    WordPress: [
      { 
        skill: 'WP Structure', 
        status: 'foundation', 
        description: 'File structure',
        resources: getSkillResources('WP Structure'),
        quiz: [],
        deepLearningTime: '45 min'
      },
      { 
        skill: 'Custom Themes', 
        status: 'intermediate', 
        description: 'Theme development',
        resources: getSkillResources('Custom Themes'),
        quiz: [],
        deepLearningTime: '120 min'
      },
      { 
        skill: 'Gutenberg Blocks', 
        status: 'intermediate', 
        description: 'Custom blocks',
        resources: getSkillResources('Gutenberg Blocks'),
        quiz: [],
        deepLearningTime: '60 min'
      },
      { 
        skill: 'Plugin Development', 
        status: 'advanced', 
        description: 'Plugin creation',
        resources: getSkillResources('Plugin Development'),
        quiz: [],
        deepLearningTime: '90 min'
      },
      { 
        skill: 'Security', 
        status: 'advanced', 
        description: 'Best practices',
        resources: [],
        quiz: [],
        deepLearningTime: '60 min'
      },
      { 
        skill: 'Monetization', 
        status: 'advanced', 
        description: 'Marketplace preparation',
        resources: [],
        quiz: [],
        deepLearningTime: '45 min'
      }
    ]
  }
  
  return roadmaps[discipline] || []
}

function getDisciplineContent(content, discipline, weekNum, type) {
  const weekTheme = getSoftwareEngineeringTheme(weekNum)
  const contentTitle = content.title || ''
  const contentLower = (contentTitle + ' ' + weekTheme).toLowerCase()
  
  // Determine if content matches discipline
  const frontendMatch = ['html', 'css', 'tailwind', 'react', 'next.js', 'frontend', 'dom'].some(k => contentLower.includes(k))
  const backendMatch = ['node.js', 'express', 'database', 'backend', 'api', 'server'].some(k => contentLower.includes(k))
  const mobileMatch = ['react native', 'mobile', 'flutter', 'ios', 'android'].some(k => contentLower.includes(k))
  const wordpressMatch = ['wordpress', 'theme', 'plugin', 'cms'].some(k => contentLower.includes(k))
  
  let matchesDiscipline = false
  if (discipline === 'Frontend' && frontendMatch) matchesDiscipline = true
  if (discipline === 'Backend' && backendMatch) matchesDiscipline = true
  if (discipline === 'Mobile' && mobileMatch) matchesDiscipline = true
  if (discipline === 'WordPress' && wordpressMatch) matchesDiscipline = true
  
  // Get discipline-specific resources
  const resources = getDisciplineResources(discipline, weekNum)
  const roadmap = getDisciplineRoadmap(discipline)
  
  // If content doesn't match discipline, create discipline-appropriate placeholder
  if (!matchesDiscipline) {
    if (type === 'study') {
      return {
        title: `${discipline} Learning - ${weekTheme}`,
        topics: [`Continue ${discipline} studies from existing curriculum`],
        type: 'study',
        discipline: discipline,
        resources: resources,
        roadmap: roadmap,
        note: 'Content mapped from existing curriculum'
      }
    } else {
      return {
        title: `${discipline} Project - ${weekTheme}`,
        description: `Build ${discipline.toLowerCase()} project based on current week's theme`,
        requirements: [`Apply ${discipline} concepts from existing curriculum`],
        type: 'build',
        discipline: discipline,
        resources: resources,
        roadmap: roadmap,
        note: 'Project mapped from existing curriculum'
      }
    }
  }
  
  // Return original content if it matches, enhanced with resources and roadmap
  return {
    ...content,
    type: type,
    discipline: discipline,
    resources: resources,
    roadmap: roadmap
  }
}

// Scheduling and Discipline Rotation Helpers
function getTimeBlocks(dayIndex) {
  const isSaturday = dayIndex === 5
  const isSunday = dayIndex === 6
  const isWeekday = dayIndex >= 0 && dayIndex <= 4 // Monday-Friday
  
  if (isSaturday) {
    // Saturday: WordPress only
    return {
      deepLearning: [
        { time: '2:00pm-3:30pm', discipline: 'WordPress', type: 'study', duration: '90 min' }
      ],
      focusedImplementation: [
        { time: '3:30pm-5:00pm', discipline: 'WordPress', type: 'build', duration: '90 min' }
      ]
    }
  }
  
  if (isSunday) {
    // Sunday: All 4 disciplines
    return {
      deepLearning: [
        { time: '3:00am-4:00am', discipline: 'Frontend', type: 'study', duration: '60 min' },
        { time: '2:00pm-3:00pm', discipline: 'Backend', type: 'study', duration: '60 min' }
      ],
      focusedImplementation: [
        { time: '4:00am-5:00am', discipline: 'Frontend', type: 'build', duration: '60 min' },
        { time: '3:00pm-4:00pm', discipline: 'Backend', type: 'build', duration: '60 min' }
      ],
      // Additional time blocks for Mobile and WordPress on Sunday
      additional: {
        deepLearning: [
          { time: 'Flexible', discipline: 'Mobile', type: 'study', duration: '60 min' },
          { time: 'Flexible', discipline: 'WordPress', type: 'study', duration: '60 min' }
        ],
        focusedImplementation: [
          { time: 'Flexible', discipline: 'Mobile', type: 'build', duration: '60 min' },
          { time: 'Flexible', discipline: 'WordPress', type: 'build', duration: '60 min' }
        ]
      }
    }
  }
  
  // Monday-Friday: All 4 disciplines
  return {
    deepLearning: [
      { time: '3:00am-4:00am', discipline: 'Frontend', type: 'study', duration: '60 min' },
      { time: '8:00am-10:00am', discipline: 'Backend', type: 'study', duration: '120 min' },
      { time: '2:30pm-3:30pm', discipline: 'Mobile', type: 'study', duration: '60 min' }
    ],
    focusedImplementation: [
      { time: '4:00am-5:00am', discipline: 'Frontend', type: 'build', duration: '60 min' },
      { time: '10:00am-12:00pm', discipline: 'Backend', type: 'build', duration: '120 min' },
      { time: '1:00pm-2:30pm', discipline: 'Mobile', type: 'build', duration: '90 min' }
    ],
    // WordPress gets integrated into available time slots
    additional: {
      deepLearning: [
        { time: 'Flexible (within study blocks)', discipline: 'WordPress', type: 'study', duration: '30-60 min' }
      ],
      focusedImplementation: [
        { time: 'Flexible (within build blocks)', discipline: 'WordPress', type: 'build', duration: '30-60 min' }
      ]
    }
  }
}

function getDisciplineRotation(weekNum, dayIndex) {
  const isSaturday = dayIndex === 5
  
  // Saturday is WordPress only
  if (isSaturday) {
    return {
      primary: 'WordPress',
      secondary: null,
      tertiary: null,
      quaternary: null,
      allDisciplines: ['WordPress'],
      priorityOrder: ['WordPress']
    }
  }
  
  // Sunday-Friday: All 4 disciplines in priority order
  // Priority: Frontend > Backend > Mobile > WordPress
  // This order determines which discipline gets the best time slots
  const priorityOrder = ['Frontend', 'Backend', 'Mobile', 'WordPress']
  
  // Rotate which discipline gets the early morning (3am) slot based on day
  // This ensures all disciplines get prime time slots throughout the week
  const rotationIndex = dayIndex === 6 ? 0 : dayIndex // Sunday uses Monday's rotation
  const earlyDiscipline = priorityOrder[rotationIndex % 4]
  
  // Reorder disciplines with rotated one first, then by priority
  const remaining = priorityOrder.filter(d => d !== earlyDiscipline)
  const rotatedOrder = [earlyDiscipline, ...remaining]
  
  return {
    primary: priorityOrder[0], // Frontend always highest priority
    secondary: priorityOrder[1], // Backend second
    tertiary: priorityOrder[2], // Mobile third
    quaternary: priorityOrder[3], // WordPress lowest priority
    allDisciplines: priorityOrder,
    priorityOrder: priorityOrder,
    rotationOrder: rotatedOrder, // Order for time slot assignment
    earlyMorningDiscipline: earlyDiscipline // Which discipline gets 3am slot today
  }
}

function mapContentToDiscipline(content, discipline, weekNum, dayIndex) {
  // Map existing curriculum content to disciplines based on week theme
  const weekTheme = getSoftwareEngineeringTheme(weekNum)
  
  // Determine which discipline this content belongs to
  const frontendKeywords = ['HTML', 'CSS', 'Tailwind', 'React', 'Next.js', 'Frontend', 'DOM']
  const backendKeywords = ['Node.js', 'Express', 'Database', 'Backend', 'API', 'Server']
  const mobileKeywords = ['React Native', 'Mobile', 'Flutter', 'iOS', 'Android']
  const wordpressKeywords = ['WordPress', 'Theme', 'Plugin', 'CMS']
  
  const contentLower = (content.title || '').toLowerCase() + ' ' + weekTheme.toLowerCase()
  
  if (wordpressKeywords.some(k => contentLower.includes(k.toLowerCase()))) {
    return 'WordPress'
  }
  if (mobileKeywords.some(k => contentLower.includes(k.toLowerCase()))) {
    return 'Mobile'
  }
  if (backendKeywords.some(k => contentLower.includes(k.toLowerCase()))) {
    return 'Backend'
  }
  if (frontendKeywords.some(k => contentLower.includes(k.toLowerCase()))) {
    return 'Frontend'
  }
  
  // Default based on week number
  if (weekNum <= 3) return 'Frontend'
  if (weekNum <= 7) return 'Frontend' // React/Next.js
  if (weekNum === 8 || weekNum === 9) return 'Backend'
  if (weekNum === 10) return 'Mobile'
  if (weekNum === 11) return 'WordPress'
  if (weekNum >= 12) return 'Frontend' // Full-stack/capstone
  
  return discipline || 'Frontend'
}

function getSoftwareEngineeringTheme(weekNum) {
  const themes = [
    'HTML, CSS, Tailwind, Web Foundations',
    'JavaScript Core + ES6+ Mastery',
    'Advanced JavaScript + DOM + API patterns',
    'React.js Core',
    'Advanced React',
    'Next.js Core + Routing + SSR/SSG',
    'Full Next.js Apps + API Integration',
    'Node.js + Express + Databases',
    'Full-Stack App 1',
    'React Native',
    'WordPress Themes + Plugins + Templates',
    'SaaS + Monetization Builds',
    'Final Capstone + Portfolio + Deployment'
  ]
  return themes[weekNum - 1] || 'Software Engineering Theme'
}

function getSoftwareEngineeringLearning(weekNum, dayIndex) {
  const learningData = {
    1: {
      0: {
        title: 'HTML5 Fundamentals (60 min) + CSS Basics (30 min)',
        topics: [
          'HTML document structure: <!DOCTYPE html>, <html>, <head>, <body>',
          'Semantic HTML5 elements: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>',
          'Text elements: headings (<h1>-<h6>), paragraphs (<p>), lists (<ul>, <ol>, <dl>)',
          'Links and navigation: <a>, href attributes, relative vs absolute paths',
          'Images: <img>, alt attributes, srcset for responsive images',
          'Forms: <form>, <input> types, <label>, <button>, <textarea>, <select>',
          'Metadata: <meta> tags, Open Graph, SEO basics',
          'Accessibility: ARIA labels, semantic structure, keyboard navigation',
          'CSS syntax: selectors, properties, values',
          'Three ways to add CSS: inline, <style>, external stylesheet',
          'Basic selectors: element, class (.), ID (#)',
          'Box model: content, padding, border, margin'
        ]
      },
      1: {
        title: 'CSS Core Concepts (60 min) + CSS Selectors & Specificity (30 min)',
        topics: [
          'Box Model Deep Dive: content-box vs border-box, calculating total dimensions',
          'Display types: block, inline, inline-block, none',
          'Positioning: static, relative, absolute, fixed, sticky',
          'Z-index and stacking context',
          'CSS Units: px, em, rem, %, vh, vw, fr',
          'Typography: font-family, font-size, font-weight, line-height, text-transform',
          'Colors: hex, rgb, rgba, hsl, hsla, named colors',
          'Backgrounds: background-color, background-image, background-size, background-position',
          'Borders and shadows: border, border-radius, box-shadow',
          'Spacing: margin, padding (shorthand and longhand)',
          'Advanced selectors: descendant, child (>), adjacent sibling (+), general sibling (~)',
          'Attribute selectors: [attr], [attr="value"], [attr^="value"], [attr$="value"], [attr*="value"]',
          'Pseudo-classes: :hover, :focus, :active, :first-child, :last-child, :nth-child()',
          'Pseudo-elements: ::before, ::after, ::first-line, ::first-letter',
          'Specificity calculation: inline styles (1000), IDs (100), classes (10), elements (1)'
        ]
      },
      2: {
        title: 'Flexbox Fundamentals (60 min) + Flexbox Patterns (30 min)',
        topics: [
          'Flex container properties: display: flex, flex-direction, flex-wrap, justify-content, align-items, align-content, gap',
          'Flex item properties: flex-grow, flex-shrink, flex-basis, flex (shorthand), align-self, order',
          'Centering content (horizontal and vertical)',
          'Navigation bars',
          'Card grids',
          'Holy Grail layout',
          'Sticky footer',
          'Equal height columns',
          'Responsive image galleries'
        ]
      },
      3: {
        title: 'CSS Grid Fundamentals (60 min) + Grid Patterns (30 min)',
        topics: [
          'Grid container properties: display: grid, grid-template-columns, grid-template-rows, grid-template-areas, gap',
          'Grid item properties: grid-column, grid-row, grid-area, justify-self, align-self',
          'Grid lines and tracks',
          'Implicit vs explicit grid',
          'Auto-placement',
          'Responsive grid without media queries (auto-fit, auto-fill)',
          'Magazine-style layouts',
          'Overlapping grid items',
          'Grid + Flexbox combination'
        ]
      },
      4: {
        title: 'Responsive Design Principles (60 min) + Advanced Responsive Techniques (30 min)',
        topics: [
          'Mobile-first vs desktop-first approaches',
          'Breakpoints: common sizes (320px, 768px, 1024px, 1440px)',
          'Viewport meta tag',
          'Media queries syntax',
          'Responsive typography: fluid typography with clamp()',
          'Responsive images: srcset, sizes, <picture> element',
          'Container queries (modern approach)',
          'CSS clamp() for fluid typography',
          'Aspect ratio: aspect-ratio property',
          'Touch-friendly targets (min 44x44px)'
        ]
      },
      5: {
        title: 'Tailwind CSS Fundamentals (60 min) + Tailwind Advanced Features (30 min)',
        topics: [
          'Utility-first CSS philosophy',
          'Installation: CDN, npm, CLI',
          'Configuration: tailwind.config.js',
          'Core concepts: utility classes vs component classes',
          'Responsive prefixes: sm:, md:, lg:, xl:, 2xl:',
          'State variants: hover:, focus:, active:, disabled:',
          'Dark mode: dark:',
          'Spacing, typography, colors, layout utilities',
          'Flexbox and Grid utilities',
          'Custom configuration: colors, fonts, spacing',
          'Extending default theme',
          'Custom utilities with @apply',
          'JIT (Just-In-Time) mode'
        ]
      },
      6: {
        title: 'Week 1 Review & Consolidation (60 min) + Advanced Topics Preview (30 min)',
        topics: [
          'Review all Week 1 concepts',
          'Identify knowledge gaps',
          'Deep dive into any unclear topics',
          'Practice with interactive resources',
          'CSS animations and keyframes',
          'CSS transforms and transitions',
          'Advanced Tailwind patterns',
          'Performance optimization',
          'Accessibility best practices'
        ]
      }
    },
    2: {
      0: {
        title: 'JavaScript Basics (60 min) + Control Flow Introduction (30 min)',
        topics: [
          'What is JavaScript: history, role in web development',
          'Running JavaScript: browser console, script tags, external files',
          'Variables: var, let, const (ES6+)',
          'Differences between var, let, const',
          'Hoisting behavior',
          'Block scope vs function scope',
          'Data Types: Primitives (number, string, boolean, undefined, null, symbol, bigint) and Objects',
          'Type checking: typeof, instanceof',
          'Type coercion and conversion',
          'Operators: Arithmetic, Assignment, Comparison, Logical, Ternary',
          'Conditional statements: if, else if, else',
          'Switch statements',
          'Truthy and falsy values'
        ]
      }
    }
  }
  
  const dayData = learningData[weekNum]?.[dayIndex]
  if (dayData) {
    return dayData
  }
  
  return {
    title: `${getSoftwareEngineeringTheme(weekNum)} Learning`,
    topics: [`Day ${dayIndex + 1} learning content for ${getSoftwareEngineeringTheme(weekNum)}`]
  }
}

function getSoftwareEngineeringCursorWorkflow(weekNum, dayIndex) {
  const workflows = {
    1: {
      0: {
        setupCommands: [
          'mkdir week-01-day-01',
          'cd week-01-day-01',
          'mkdir css js images',
          'touch index.html css/style.css'
        ],
        prompts: [
          'Generate a semantic HTML5 document structure with header, nav, main, and footer sections',
          'Create an accessible navigation menu with proper ARIA labels',
          'Add meta tags for SEO including Open Graph tags',
          'Generate a contact form with proper input types and labels',
          'Refactor this HTML to use semantic elements instead of divs'
        ],
        refactoringTasks: [
          'Convert div-based layouts to semantic HTML5',
          'Add proper alt text to all images',
          'Ensure all interactive elements have proper labels',
          'Validate HTML using Cursor\'s built-in validation'
        ]
      }
    }
  }
  
  const workflow = workflows[weekNum]?.[dayIndex]
  if (workflow) {
    return workflow
  }
  
  return {
    setupCommands: [`Setup for Week ${weekNum}, Day ${dayIndex + 1}`],
    prompts: [`Cursor prompts for ${getSoftwareEngineeringTheme(weekNum)}`],
    refactoringTasks: [`Refactoring tasks for Week ${weekNum}, Day ${dayIndex + 1}`]
  }
}

function getSoftwareEngineeringProject(weekNum, dayIndex) {
  const projects = {
    1: {
      0:       {
        title: 'Personal Introduction Page',
        description: 'Build a single-page HTML document that introduces yourself.',
        skills: ['HTML5', 'Semantic HTML', 'Forms'],
        requirements: [
          'Semantic HTML5 structure',
          'Header with your name and title',
          'Navigation menu (even if single page)',
          'About section with text content',
          'Skills/interests section using lists',
          'Contact form (styling comes later)',
          'Footer with copyright'
        ],
        mustHave: [
          'Valid HTML5',
          'All images have alt text',
          'Proper heading hierarchy (h1 → h2 → h3)',
          'Accessible form labels',
          'Semantic elements only (no div soup)'
        ]
      },
      1:       {
        title: 'Styled Card Component Library',
        description: 'Create a collection of 3 different card components. Build on Day 1\'s HTML structure and add CSS styling.',
        skills: ['HTML5', 'CSS3', 'Flexbox'],
        requirements: [
          'Profile Card: Image, name, title, bio, social links',
          'Product Card: Image, title, price, description, CTA button',
          'Article Card: Featured image, title, excerpt, author, date, read more link',
          'Use Day 1\'s HTML structure as a base',
          'Add CSS styling to make cards visually appealing',
          'Responsive design (cards stack on mobile)'
        ],
        buildsOn: [1] // References Day 1
      },
      2:       {
        title: 'Responsive Dashboard Layout',
        description: 'Build a dashboard-style layout with Flexbox. Enhance your Day 2 card library into a full dashboard.',
        skills: ['HTML5', 'CSS3', 'Flexbox', 'Responsive Design'],
        requirements: [
          'Header with logo and navigation (horizontal flex)',
          'Sidebar navigation (vertical flex)',
          'Main content area (flex container for cards)',
          'Card grid (3 columns desktop, 2 tablet, 1 mobile)',
          'Footer (centered content)',
          'Integrate Day 2\'s card components into the dashboard',
          'Ensure all previous features still work'
        ],
        buildsOn: [1, 2] // References Day 1 and Day 2
      },
      3:       {
        title: 'Magazine-Style Blog Layout',
        description: 'Create a blog layout with CSS Grid. Transform your dashboard into a blog using Grid.',
        skills: ['HTML5', 'CSS3', 'CSS Grid', 'Responsive Design'],
        requirements: [
          'Header spanning full width',
          'Featured article (large grid area)',
          'Sidebar with recent posts',
          'Article grid (3 columns, responsive)',
          'Footer with multiple columns',
          'Use Day 3\'s dashboard structure as a base',
          'Convert flexbox layouts to CSS Grid where appropriate'
        ],
        buildsOn: [1, 2, 3]
      },
      4:       {
        title: 'Fully Responsive Landing Page',
        description: 'Build a complete landing page that works on all devices. Combine all previous layouts into one polished page.',
        skills: ['HTML5', 'CSS3', 'Flexbox', 'CSS Grid', 'Responsive Design', 'Mobile-First'],
        requirements: [
          'Works perfectly on mobile (320px+)',
          'Adapts to tablet (768px+)',
          'Optimized for desktop (1024px+)',
          'Includes responsive navigation (hamburger menu on mobile)',
          'Uses fluid typography',
          'Responsive images',
          'Touch-friendly interactive elements',
          'Integrate components from Days 1-4',
          'Ensure all previous features are responsive'
        ],
        buildsOn: [1, 2, 3, 4]
      },
      5:       {
        title: 'Tailwind-Powered Portfolio Landing Page',
        description: 'Rebuild your Day 5 landing page using Tailwind CSS. Refactor previous work with Tailwind utilities.',
        skills: ['HTML5', 'TailwindCSS', 'Responsive Design', 'Utility-First CSS'],
        requirements: [
          'Use utility classes exclusively',
          'Responsive design with Tailwind breakpoints',
          'Custom color scheme in config',
          'Hover and focus states',
          'Smooth transitions',
          'Modern, polished design',
          'Refactor Day 5\'s landing page to use Tailwind',
          'Maintain all functionality from previous days'
        ],
        buildsOn: [1, 2, 3, 4, 5]
      },
      6:       {
        title: 'Professional Portfolio Website',
        description: 'Build a complete, production-ready portfolio website. Combine everything from Days 1-6 into a professional portfolio.',
        skills: ['HTML5', 'CSS3', 'TailwindCSS', 'Responsive Design', 'Accessibility', 'SEO'],
        requirements: [
          'Semantic HTML5 structure',
          'Fully responsive (mobile-first)',
          'Built with Tailwind CSS',
          'Multiple sections: Hero, About, Skills, Projects, Contact, Footer',
          'Smooth scrolling navigation',
          'Hover effects and transitions',
          'Accessible (WCAG 2.1 AA)',
          'Performance optimized',
          'SEO optimized',
          'Integrate all components and layouts from previous days',
          'Showcase all projects built so far'
        ],
        buildsOn: [1, 2, 3, 4, 5, 6]
      }
    }
  }
  
  const project = projects[weekNum]?.[dayIndex]
  if (project) {
    return project
  }
  
  return {
    title: `Daily Mini-Project: ${getSoftwareEngineeringTheme(weekNum)}`,
    description: `Project for Week ${weekNum}, Day ${dayIndex + 1}`,
    requirements: ['Complete project requirements']
  }
}

function getSoftwareEngineeringResources(weekNum, dayIndex) {
  // Complete resource mapping from LEARNING-RESOURCES.md
  const resourceMap = {
    1: {
      0: [
        { title: 'MDN HTML5 Elements', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element', time: '30 min' },
        { title: 'MDN Semantic HTML Guide', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantic_elements', time: '20 min' },
        { title: 'HTML5 Doctor', url: 'http://html5doctor.com/', time: '20 min' },
        { title: 'MDN CSS Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics', time: '30 min' }
      ],
      1: [
        { title: 'MDN Box Model', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model', time: '25 min' },
        { title: 'MDN CSS Selectors', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors', time: '20 min' },
        { title: 'Specificity Calculator', url: 'https://specificity.keegan.st/', time: '10 min' }
      ],
      2: [
        { title: 'CSS-Tricks Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/', time: '40 min' },
        { title: 'Flexbox Froggy', url: 'https://flexboxfroggy.com/', time: '30 min' },
        { title: 'MDN Flexbox', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout', time: '20 min' }
      ],
      3: [
        { title: 'CSS-Tricks Grid Guide', url: 'https://css-tricks.com/snippets/css/complete-guide-grid/', time: '40 min' },
        { title: 'Grid Garden', url: 'https://cssgridgarden.com/', time: '30 min' },
        { title: 'MDN CSS Grid', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout', time: '20 min' }
      ],
      4: [
        { title: 'MDN Responsive Design', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design', time: '30 min' },
        { title: 'MDN Media Queries', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries', time: '20 min' },
        { title: 'CSS-Tricks Container Queries', url: 'https://css-tricks.com/a-complete-guide-to-css-container-queries/', time: '20 min' }
      ],
      5: [
        { title: 'Tailwind CSS Documentation', url: 'https://tailwindcss.com/docs', time: '40 min' },
        { title: 'Tailwind Installation Guide', url: 'https://tailwindcss.com/docs/installation', time: '20 min' },
        { title: 'Tailwind Configuration', url: 'https://tailwindcss.com/docs/configuration', time: '20 min' }
      ],
      6: [
        { title: 'MDN CSS Animations', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations', time: '30 min' },
        { title: 'Web.dev Performance', url: 'https://web.dev/learn-core-web-vitals/', time: '30 min' }
      ]
    },
    2: {
      0: [
        { title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', time: '30 min' },
        { title: 'MDN let/const', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let', time: '20 min' },
        { title: 'JavaScript.info', url: 'https://javascript.info/', time: '40 min' }
      ]
    }
  }
  
  return resourceMap[weekNum]?.[dayIndex] || []
}

function getSoftwareEngineeringQuizzes(weekNum, dayIndex) {
  const quizzes = {
    1: {
      0: [
        {
          category: 'Foundation',
          question: 'What is the purpose of the `<!DOCTYPE html>` declaration?',
          options: [
            'It tells the browser which version of HTML to use',
            'It\'s required for HTML5 validation',
            'It enables modern browser features',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: 'The DOCTYPE declaration tells browsers which HTML version to use, is required for validation, and enables modern features.'
        },
        {
          category: 'Structure',
          question: 'Which HTML5 element should be used for the main content of a page?',
          options: [
            '<div class="main">',
            '<main>',
            '<section>',
            '<article>'
          ],
          correctAnswer: 1,
          explanation: 'The <main> element is the semantic HTML5 element specifically designed for the main content of a page.'
        },
        {
          category: 'Advanced',
          question: 'What is the difference between <article> and <section>?',
          options: [
            '<article> is for standalone content, <section> is for thematic grouping',
            'They are interchangeable',
            '<section> must always contain <article>',
            '<article> is only for blog posts'
          ],
          correctAnswer: 0,
          explanation: '<article> represents standalone, independently distributable content, while <section> is for thematic grouping of content.'
        },
        {
          category: 'Integration',
          question: 'How do you create an accessible link that opens in a new tab?',
          options: [
            '<a href="url" target="_blank">',
            '<a href="url" target="_blank" rel="noopener noreferrer">',
            '<a href="url" newtab>',
            '<a href="url" target="new">'
          ],
          correctAnswer: 1,
          explanation: 'Using rel="noopener noreferrer" prevents security vulnerabilities and is the accessible way to open links in new tabs.'
        },
        {
          category: 'Applied Reasoning',
          question: 'Why is semantic HTML important for SEO and accessibility?',
          options: [
            'Search engines understand content structure better',
            'Screen readers can navigate pages more effectively',
            'It improves code maintainability',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: 'Semantic HTML benefits SEO, accessibility, and code maintainability - making it essential for modern web development.'
        }
      ],
      1: [
        {
          category: 'Foundation',
          question: 'What is the default value of the `box-sizing` property?',
          options: ['border-box', 'content-box', 'padding-box', 'margin-box'],
          correctAnswer: 1,
          explanation: 'The default box-sizing is content-box, which means width/height only includes content, not padding or border.'
        },
        {
          category: 'Structure',
          question: 'Which CSS unit is relative to the root element\'s font size?',
          options: ['em', 'rem', 'px', '%'],
          correctAnswer: 1,
          explanation: 'rem (root em) is relative to the root element\'s font size, making it more predictable than em.'
        },
        {
          category: 'Advanced',
          question: 'What is the specificity of the selector `.card .title:hover`?',
          options: ['21', '22', '30', '31'],
          correctAnswer: 1,
          explanation: 'Two classes (10 each) + one pseudo-class (1) + one element (1) = 22 specificity points.'
        },
        {
          category: 'Integration',
          question: 'How do you center an element horizontally using CSS?',
          options: [
            'margin: 0 auto; (for block elements)',
            'text-align: center; (for inline elements)',
            'Both a and b depending on element type',
            'display: center;'
          ],
          correctAnswer: 2,
          explanation: 'Block elements use margin: 0 auto, while inline elements use text-align: center.'
        },
        {
          category: 'Applied Reasoning',
          question: 'Why should you use `rem` instead of `px` for font sizes?',
          options: [
            'Better accessibility (respects user font size preferences)',
            'Easier to scale entire design',
            'More maintainable code',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: 'rem units provide better accessibility, scalability, and maintainability compared to fixed px values.'
        }
      ],
      2: [
        {
          category: 'Foundation',
          question: 'What is the default `flex-direction` value?',
          options: ['column', 'row', 'row-reverse', 'column-reverse'],
          correctAnswer: 1,
          explanation: 'The default flex-direction is row, meaning items are laid out horizontally.'
        },
        {
          category: 'Structure',
          question: 'Which property centers items along the main axis?',
          options: ['align-items', 'justify-content', 'align-content', 'align-self'],
          correctAnswer: 1,
          explanation: 'justify-content controls alignment along the main axis (horizontal by default).'
        },
        {
          category: 'Advanced',
          question: 'What does `flex: 1 1 0` mean?',
          options: [
            'Grow: 1, Shrink: 1, Basis: 0',
            'Grow: 0, Shrink: 1, Basis: 1',
            'All items equal size',
            'Both a and c'
          ],
          correctAnswer: 3,
          explanation: 'flex: 1 1 0 means grow 1, shrink 1, basis 0, which makes all items equal size and flexible.'
        },
        {
          category: 'Integration',
          question: 'How do you create equal-height columns with Flexbox?',
          options: [
            'Set height: 100% on items',
            'Use align-items: stretch (default)',
            'Set fixed heights',
            'Use flex-basis: auto'
          ],
          correctAnswer: 1,
          explanation: 'align-items: stretch is the default and automatically makes all flex items the same height.'
        },
        {
          category: 'Applied Reasoning',
          question: 'When should you use Flexbox over CSS Grid?',
          options: [
            'One-dimensional layouts (row OR column)',
            'Two-dimensional layouts (row AND column)',
            'Always use Flexbox',
            'Always use Grid'
          ],
          correctAnswer: 0,
          explanation: 'Flexbox is ideal for one-dimensional layouts, while Grid is better for two-dimensional layouts.'
        }
      ],
      3: [
        {
          category: 'Foundation',
          question: 'What does `1fr` represent in CSS Grid?',
          options: ['1 pixel', '1 fraction of available space', '1 rem', '1 em'],
          correctAnswer: 1,
          explanation: '1fr represents one fraction of the available space in the grid container.'
        },
        {
          category: 'Structure',
          question: 'How do you make a grid item span 3 columns?',
          options: [
            'grid-column: span 3;',
            'grid-column: 1 / 4;',
            'Both a and b',
            'grid-column: 3;'
          ],
          correctAnswer: 2,
          explanation: 'Both grid-column: span 3 and grid-column: 1 / 4 will make an item span 3 columns.'
        },
        {
          category: 'Advanced',
          question: 'What\'s the difference between `auto-fit` and `auto-fill`?',
          options: [
            'auto-fit collapses empty tracks, auto-fill keeps them',
            'They\'re the same',
            'auto-fill is for rows, auto-fit for columns',
            'auto-fit is deprecated'
          ],
          correctAnswer: 0,
          explanation: 'auto-fit collapses empty tracks when there aren\'t enough items, while auto-fill keeps them.'
        },
        {
          category: 'Integration',
          question: 'When should you use Grid over Flexbox?',
          options: [
            'Two-dimensional layouts',
            'Complex overlapping layouts',
            'When you need named areas',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: 'Grid excels at two-dimensional layouts, overlapping items, and named grid areas.'
        },
        {
          category: 'Applied Reasoning',
          question: 'How do `minmax()` and `auto-fit` create responsive grids without media queries?',
          options: [
            'They automatically adjust based on container size',
            'They use JavaScript',
            'They require CSS variables',
            'They don\'t work without media queries'
          ],
          correctAnswer: 0,
          explanation: 'minmax() and auto-fit work together to automatically create responsive grids based on container size.'
        }
      ],
      4: [
        {
          category: 'Foundation',
          question: 'What does the viewport meta tag do?',
          options: [
            'Sets the page width',
            'Tells mobile browsers to use device width',
            'Hides the address bar',
            'Enables responsive design'
          ],
          correctAnswer: 1,
          explanation: 'The viewport meta tag tells mobile browsers to use the device width instead of a fixed desktop width.'
        },
        {
          category: 'Structure',
          question: 'What is the mobile-first approach?',
          options: [
            'Design for mobile, then enhance for larger screens',
            'Design for desktop, then shrink for mobile',
            'Design separately for each device',
            'Use only mobile styles'
          ],
          correctAnswer: 0,
          explanation: 'Mobile-first means designing for mobile devices first, then adding enhancements for larger screens.'
        },
        {
          category: 'Advanced',
          question: 'What does `clamp(1rem, 2.5vw, 2rem)` do?',
          options: [
            'Sets font size between 1rem and 2rem based on viewport',
            'Clamps values to 1rem minimum',
            'Uses 2.5vw as preferred value',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: 'clamp() sets a minimum (1rem), preferred (2.5vw), and maximum (2rem) value, creating fluid typography.'
        },
        {
          category: 'Integration',
          question: 'How do you create a responsive grid without media queries?',
          options: [
            'Use Flexbox with flex-wrap',
            'Use Grid with auto-fit/auto-fill',
            'Use JavaScript',
            'It\'s not possible'
          ],
          correctAnswer: 1,
          explanation: 'CSS Grid with auto-fit/auto-fill and minmax() can create responsive layouts without media queries.'
        },
        {
          category: 'Applied Reasoning',
          question: 'Why is mobile-first better than desktop-first?',
          options: [
            'Most users are on mobile',
            'Easier to enhance than to reduce',
            'Better performance',
            'All of the above'
          ],
          correctAnswer: 3,
          explanation: 'Mobile-first is better because most users are mobile, it\'s easier to enhance, and it performs better.'
        }
      ],
      5: [
        {
          category: 'Foundation',
          question: 'What is the utility-first approach?',
          options: [
            'Writing utility functions in JavaScript',
            'Using small, single-purpose CSS classes',
            'Creating reusable components',
            'Using CSS frameworks'
          ],
          correctAnswer: 1,
          explanation: 'Utility-first means using small, single-purpose CSS classes instead of writing custom CSS.'
        },
        {
          category: 'Structure',
          question: 'How do you make a Tailwind class apply only on large screens?',
          options: [
            'lg:class-name',
            '@media (min-width: 1024px) { .class-name }',
            'class-name lg',
            'responsive:lg:class-name'
          ],
          correctAnswer: 0,
          explanation: 'Tailwind uses responsive prefixes like lg: to apply classes only at certain breakpoints.'
        },
        {
          category: 'Advanced',
          question: 'What does `@apply` do in Tailwind?',
          options: [
            'Applies Tailwind utilities in CSS',
            'Imports Tailwind styles',
            'Extends Tailwind config',
            'Creates custom utilities'
          ],
          correctAnswer: 0,
          explanation: '@apply allows you to use Tailwind utility classes within your CSS files.'
        },
        {
          category: 'Integration',
          question: 'How do you customize Tailwind\'s default theme?',
          options: [
            'Edit node_modules',
            'Use tailwind.config.js with extend or theme',
            'Override CSS variables',
            'Use !important'
          ],
          correctAnswer: 1,
          explanation: 'Tailwind is customized through tailwind.config.js using the extend or theme properties.'
        },
        {
          category: 'Applied Reasoning',
          question: 'When should you extract Tailwind classes into a component?',
          options: [
            'When classes are repeated 3+ times',
            'Never, always use utilities',
            'When creating complex patterns',
            'Both a and c'
          ],
          correctAnswer: 3,
          explanation: 'Extract repeated or complex patterns into components for better maintainability.'
        }
      ]
    },
    2: {
      0: [
        {
          category: 'Foundation',
          question: 'What is the difference between `let` and `const`?',
          options: [
            'let is for numbers, const for strings',
            'const cannot be reassigned, let can',
            'They\'re the same',
            'let is deprecated'
          ],
          correctAnswer: 1,
          explanation: 'const cannot be reassigned after declaration, while let can be reassigned.'
        },
        {
          category: 'Structure',
          question: 'What is the result of `"5" + 3` in JavaScript?',
          options: ['8', '"53"', 'Error', 'undefined'],
          correctAnswer: 1,
          explanation: 'JavaScript performs type coercion, converting the number to a string and concatenating: "53".'
        },
        {
          category: 'Advanced',
          question: 'What is hoisting in JavaScript?',
          options: [
            'Moving variables to top of scope',
            'Variable declarations are processed before code execution',
            'Only works with var',
            'Both b and c'
          ],
          correctAnswer: 3,
          explanation: 'Hoisting means declarations are processed before execution, and it works differently with var vs let/const.'
        },
        {
          category: 'Integration',
          question: 'Why should you use `===` instead of `==`?',
          options: [
            '=== checks value and type, == only value',
            '=== is faster',
            '== is deprecated',
            'They\'re the same'
          ],
          correctAnswer: 0,
          explanation: '=== (strict equality) checks both value and type, preventing unexpected type coercion bugs.'
        },
        {
          category: 'Applied Reasoning',
          question: 'When should you use `const` vs `let`?',
          options: [
            'Always use const unless you need to reassign',
            'Always use let',
            'Use const for objects, let for primitives',
            'It doesn\'t matter'
          ],
          correctAnswer: 0,
          explanation: 'Best practice is to use const by default, and only use let when you need to reassign the variable.'
        }
      ]
    }
  }
  
  return quizzes[weekNum]?.[dayIndex] || []
}

function getSoftwareEngineeringMonetization(weekNum, dayIndex) {
  const monetizationTasks = {
    1: {
      0: {
        task: 'Create a simple HTML template that could be sold on ThemeForest or similar marketplace.',
        actionItems: [
          'Build a clean, professional single-page template',
          'Document it with comments',
          'Create a README explaining the structure',
          'Take screenshots for portfolio',
          'List it on GitHub with proper description'
        ]
      },
      1: {
        task: 'Package your card components as a reusable CSS component library.',
        actionItems: [
          'Create a component showcase page',
          'Document each component with usage examples',
          'Create a GitHub repository for the component library',
          'Write a blog post or social media thread explaining the components',
          'Consider creating a CodePen collection'
        ]
      }
    }
  }
  
  const task = monetizationTasks[weekNum]?.[dayIndex]
  if (task) {
    return task
  }
  
  return {
    task: `Monetization task for ${getSoftwareEngineeringTheme(weekNum)}`,
    actionItems: ['Complete monetization action items']
  }
}

function getSoftwareEngineeringSocialPosting(weekNum, dayIndex) {
  const posts = {
    1: {
      0: {
        text: 'Day 1 of my 90-day software engineering journey complete! 🚀 Just built my first semantic HTML5 page from scratch. Learning the foundations that will power everything else. #WebDev #HTML5 #90DayChallenge #CodeNewbie',
        platforms: ['Twitter/X', 'LinkedIn', 'Dev.to', 'GitHub'],
        include: [
          'Screenshot of your HTML page in browser',
          'Code snippet showing semantic structure',
          'Link to GitHub repository'
        ]
      },
      1: {
        text: 'Day 2: CSS mastery in progress! 🎨 Built a component library with 3 card variations. Understanding the box model and specificity is game-changing. Every pixel matters! #CSS #WebDesign #90DayChallenge',
        platforms: ['Twitter/X', 'LinkedIn', 'Dev.to', 'GitHub']
      },
      2: {
        text: 'Day 3: Flexbox unlocked! 💪 Built a responsive dashboard layout. No more float hacks - Flexbox makes layouts intuitive. Playing Flexbox Froggy helped a lot! #Flexbox #CSS #WebDev',
        platforms: ['Twitter/X', 'LinkedIn', 'Dev.to', 'GitHub']
      }
    }
  }
  
  const post = posts[weekNum]?.[dayIndex]
  if (post) {
    return post
  }
  
  return {
    text: `Day ${dayIndex + 1} of my 90-day software engineering journey! Progress update coming soon. #WebDev #90DayChallenge`,
    platforms: ['Twitter/X', 'LinkedIn', 'GitHub']
  }
}

// Generate daily cumulative quiz combining all skills learned that day
function getDailyCumulativeQuiz(weekNum, dayIndex, dayNumber) {
  // Get all disciplines covered today
  const disciplineRotation = getDisciplineRotation(weekNum, dayIndex);
  const disciplines = disciplineRotation.allDisciplines || [];
  
  // Collect quizzes from all skills learned today
  const allQuizzes = [];
  
  // Get quizzes for each discipline's skills
  disciplines.forEach(discipline => {
    const disciplineRoadmap = getDisciplineRoadmap(discipline);
    disciplineRoadmap.forEach(skill => {
      // Get skill-specific quiz
      const skillQuiz = getSkillQuiz(skill.skill);
      if (skillQuiz && skillQuiz.length > 0) {
        allQuizzes.push(...skillQuiz.map(q => ({
          ...q,
          skill: skill.skill,
          discipline: discipline
        })));
      }
    });
  });
  
  // Also include the existing daily quiz if available
  const existingQuiz = getSoftwareEngineeringQuizzes(weekNum, dayIndex);
  if (existingQuiz && existingQuiz.length > 0) {
    allQuizzes.push(...existingQuiz.map(q => ({
      ...q,
      skill: 'Daily Review',
      discipline: 'General'
    })));
  }
  
  // If no quizzes found, create a default review quiz
  if (allQuizzes.length === 0) {
    allQuizzes.push({
      category: 'Review',
      question: `What did you learn today in ${disciplines.join(', ')}?`,
      options: [
        'Review your notes and reflect on today\'s learning',
        'Practice the concepts you learned',
        'Build a small project using today\'s skills',
        'All of the above'
      ],
      correctAnswer: 3,
      explanation: 'The best way to reinforce learning is to review, practice, and build!',
      skill: 'Daily Reflection',
      discipline: 'General'
    });
  }
  
  // Shuffle and select 8-10 questions for daily quiz
  const shuffled = allQuizzes.sort(() => Math.random() - 0.5);
  const dailyQuiz = shuffled.slice(0, Math.min(10, shuffled.length));
  
  return {
    title: `Day ${dayNumber} Cumulative Quiz`,
    description: `Test your understanding of all concepts learned today across ${disciplines.join(', ')}. This quiz combines knowledge from all disciplines you studied today.`,
    questions: dailyQuiz,
    totalQuestions: dailyQuiz.length,
    passingScore: Math.ceil(dailyQuiz.length * 0.7), // 70% to pass
    timeLimit: 15, // minutes
    cumulative: true,
    disciplines: disciplines
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
        'Use all concepts learned today',
        'Build something practical and useful',
        'Apply best practices',
        'Write clean, readable code'
      ],
      mustHave: [
        'Working code',
        'Clean structure',
        'Proper comments'
      ]
    };
  }
  
  // Get previous days' projects to build upon
  const previousProjects = [];
  
  // If today's project has buildsOn, use those specific days
  if (todayProject?.buildsOn && todayProject.buildsOn.length > 0) {
    todayProject.buildsOn.forEach(prevDay => {
      const prevWeek = Math.ceil(prevDay / 7);
      const prevDayIndex = (prevDay - 1) % 7;
      const prevProject = getSoftwareEngineeringProject(prevWeek, prevDayIndex);
      if (prevProject && prevProject.title) {
        previousProjects.push({
          day: prevDay,
          title: prevProject.title,
          skills: prevProject.skills || []
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
          skills: prevProject.skills || []
        });
      }
    }
  }
  
  // Determine what skills were learned today
  const disciplineRotation = getDisciplineRotation(weekNum, dayIndex);
  const disciplines = disciplineRotation.allDisciplines || [];
  const todaySkills = [];
  
  disciplines.forEach(discipline => {
    const roadmap = getDisciplineRoadmap(discipline);
    roadmap.forEach(skill => {
      todaySkills.push({
        skill: skill.skill,
        discipline: discipline,
        description: skill.description
      });
    });
  });
  
  // Create cumulative assessment
  const assessment = {
    title: `Day ${dayNumber} Practical Assessment`,
    description: dayNumber === 1 
      ? `Build your first project using today's learning. This will be the foundation for future projects!`
      : `Build a project that combines today's learning with previous days' work. Each day builds on the last!`,
    dayNumber: dayNumber,
    todayProject: todayProject,
    previousProjects: previousProjects,
    todaySkills: todaySkills,
    cumulative: dayNumber > 1, // Only cumulative if not day 1
    requirements: [
      ...(todayProject?.requirements || []),
      ...(previousProjects.length > 0 ? [
        ...previousProjects.slice(0, 3).map(p => `Integrate features from Day ${p.day}: ${p.title}`),
        `Ensure all previous projects' features still work`,
        `Use concepts learned in previous days where applicable`,
        `Build incrementally - add to what you've already created`
      ] : [])
    ],
    mustHave: [
      ...(todayProject?.mustHave || []),
      ...(dayNumber > 1 ? [
        'Code builds on previous days\' work',
        'All previous features still work',
        'Incremental improvement from previous days'
      ] : []),
      'Clean, maintainable code structure',
      'Working, functional project'
    ],
    stretchGoals: [
      ...(dayNumber > 1 ? [
        'Add a new feature that combines multiple previous concepts',
        'Refactor previous code to use today\'s new skills',
        'Create reusable components/functions from previous work'
      ] : [
        'Add extra features beyond requirements',
        'Make it visually appealing',
        'Add interactive elements'
      ])
    ],
    submission: {
      checklist: [
        'All requirements met',
        ...(dayNumber > 1 ? ['Previous day\'s features still functional'] : []),
        'Code is clean and commented',
        'Project runs without errors',
        'README.md with setup instructions',
        'Git repository with commit history'
      ],
      deliverables: [
        'Working project',
        'Source code (GitHub repo)',
        'Screenshots/demo video',
        'Brief reflection on what you learned',
        ...(dayNumber > 1 ? ['Comparison with previous days\' projects'] : [])
      ]
    },
    buildingOn: previousProjects.length > 0 ? {
      message: `This project builds on ${previousProjects.length} previous ${previousProjects.length === 1 ? 'project' : 'projects'}`,
      projects: previousProjects
    } : null
  };
  
  return assessment;
}

// Get platform-specific sessions for dual brand journey
function getPlatformSessions(weekNum, dayIndex) {
  // Platform sessions are most relevant during content creation weeks (Weeks 2-5, 8-10)
  if (weekNum >= 2 && weekNum <= 5 || (weekNum >= 8 && weekNum <= 10)) {
    const platforms = ['instagram', 'tiktok', 'x', 'threads', 'facebook', 'linkedin', 'youtube'];
    
    // Rotate platforms throughout the week
    const dayPlatforms = [];
    if (dayIndex === 0) dayPlatforms.push('instagram', 'linkedin');
    if (dayIndex === 1) dayPlatforms.push('x', 'threads');
    if (dayIndex === 2) dayPlatforms.push('tiktok', 'youtube');
    if (dayIndex === 3) dayPlatforms.push('facebook', 'linkedin');
    if (dayIndex === 4) dayPlatforms.push('instagram', 'x');
    if (dayIndex === 5) dayPlatforms.push('youtube', 'tiktok');
    if (dayIndex === 6) dayPlatforms.push('threads', 'facebook');
    
    return {
      platforms: dayPlatforms,
      focus: weekNum <= 5 ? 'Content Creation' : 'Content Optimization',
      brands: ['HavenX', 'Ryxen'],
      notes: `Plan and create content for ${dayPlatforms.join(', ').toUpperCase()} for both HavenX and Ryxen brands.`
    };
  }
  
  return null;
}

function getSoftwareEngineeringReflection(weekNum, dayIndex) {
  const reflections = {
    1: {
      0: {
        questions: [
          'What was the most challenging concept today?',
          'How does semantic HTML differ from what you knew before?',
          'What questions do you still have?',
          'What are you most excited to learn next?'
        ],
        documentation: [
          'Save your reflection in a reflections/day-01.md file',
          'Note any resources you found helpful',
          'List concepts to review tomorrow'
        ]
      }
    }
  }
  
  const reflection = reflections[weekNum]?.[dayIndex]
  if (reflection) {
    return reflection
  }
  
  return {
    questions: [
      'What did I learn today?',
      'What was challenging?',
      'What will I focus on tomorrow?'
    ],
    documentation: ['Document your progress']
  }
}

// Export function to get journey data
export function getJourneyData(journeyId) {
  switch(journeyId) {
    case 'body-transformation':
      return { weeks: bodyTransformationWeeks, journey: journeys[0] }
    case 'dual-brand':
      return { weeks: dualBrandWeeks, journey: journeys[1] }
    case 'reading':
      return { weeks: readingWeeks, journey: journeys[2] }
    case 'writers':
      return { weeks: writersWeeks, journey: journeys[3] }
    case 'software-engineering':
      return { weeks: softwareEngineeringWeeks, journey: journeys[4] }
    default:
      return { weeks: [], journey: null }
  }
}

