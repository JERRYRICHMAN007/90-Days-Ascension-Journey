import {
  JOURNEY_START_DATE,
  JOURNEY_TOTAL_DAYS,
  generateWeeks,
  getDateStringForDayNumber,
  getCalendarWeekDayNumbers,
  getCalendarWeekCount,
} from './shared.js';
import {
  getWritersTimeBlocks,
  organizeWritersSchedule,
  getWriterQuiz,
} from './softwareEngineering.js';
import { WRITER_CURATED_RESOURCES, normalizeResource } from './journeyCuratedResources.js';

function getWriterContentDayIndex(dayIndex) {
  if (dayIndex === 4) return null; // Friday rest
  if (dayIndex === 5) return 3; // Saturday → Thursday content slot
  if (dayIndex === 6) return 0; // Sunday → Monday content slot
  return dayIndex;
}

// Writing Journey — full 184-day arc
export const writersWeeks = generateWeeks(
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
    
    const contentWeekNum = idx + 1; // Week 1, 2, 3, etc.

    const isRestDay = dayIndex === 4; // Friday only
    const contentDayIndex = getWriterContentDayIndex(dayIndex);
    const writerResources = contentDayIndex === null ? [] : getWriterResources(contentWeekNum, contentDayIndex);
    const learning = isRestDay ? "Rest Day" : getWriterLearning(contentWeekNum, contentDayIndex);
    const execution = isRestDay ? "No writing tasks - Rest day" : getWriterExecution(contentWeekNum, contentDayIndex);
    
    // Get time blocks and organize schedule (same format as software engineering)
    const timeBlocks = getWritersTimeBlocks(dayIndex);
    const learningData = {
      title: learning,
      description: isRestDay ? "Friday rest — no writing session today." : `Learn about ${learning}`,
    };
    const projectData = {
      title: execution,
      description: isRestDay ? "No writing tasks today — enjoy your rest!" : `Execute: ${execution}`,
      requirements: isRestDay ? [] : [execution],
    };
    const scheduledContent = organizeWritersSchedule(learningData, projectData, dayIndex, timeBlocks, dayNumber);

    days.push({
      dayNumber: dayNumber,
      date: dayDateString,
      dayName: actualDayName,
      learning: learning,
      execution: execution,
      reflection: isRestDay ? { questions: ["How did the week go?", "What will you focus on next week?"] } : getWriterReflection(contentWeekNum, contentDayIndex),
      theme: isRestDay ? "Rest Day" : getWriterTheme(contentWeekNum),
      resources: writerResources,
      // Add missing fields for Learning, Project tabs (map from existing fields)
      dailyLearning: learningData,
      project: projectData,
      dailyQuiz: isRestDay ? null : getWriterQuiz(contentWeekNum, contentDayIndex, dayNumber),
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
}).filter((week) => week.days.length > 0);

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
  const list = WRITER_CURATED_RESOURCES;
  if (!list.length) return [];
  // Two focused resources for this day — not the whole library
  const start = ((weekNum - 1) * 3 + (dayIndex || 0)) % list.length;
  return [list[start], list[(start + 1) % list.length]];
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
      { title: "Final Review", url: "https://roadmap.sh/react", time: "30 min", type: "tool", description: "React roadmap review and next steps" },
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
export const DISCIPLINE_PROJECTS = {
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

export const TRANSPORT_APP_PROJECT = {
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
export function getBuildPhaseForWeek(weekNum) {
  if (weekNum <= 2) return TRANSPORT_APP_PROJECT.buildPhases.weeks1_2;
  if (weekNum <= 4) return TRANSPORT_APP_PROJECT.buildPhases.weeks3_4;
  if (weekNum <= 6) return TRANSPORT_APP_PROJECT.buildPhases.weeks5_6;
  if (weekNum <= 8) return TRANSPORT_APP_PROJECT.buildPhases.weeks7_8;
  if (weekNum <= 10) return TRANSPORT_APP_PROJECT.buildPhases.weeks9_10;
  if (weekNum <= 12) return TRANSPORT_APP_PROJECT.buildPhases.weeks11_12;
  return TRANSPORT_APP_PROJECT.buildPhases.week13;
}

// Map day number to project component being built
export function getProjectComponentForDay(dayNumber, discipline) {
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

