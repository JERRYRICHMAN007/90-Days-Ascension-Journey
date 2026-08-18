/** Curated, verified resources shared across journey data files. */

export function normalizeResource(entry) {
  const type = entry.type || inferType(entry.url);
  return {
    title: entry.title,
    url: entry.url || '',
    type,
    description: entry.description || entry.title,
    ...(entry.time ? { time: entry.time } : {}),
    ...(entry.category ? { category: entry.category } : {}),
  };
}

function inferType(url) {
  if (!url) return 'article';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('goodreads.com')) return 'book';
  return 'tool';
}

export const BODY_CURATED_RESOURCES = [
  {
    title: 'Jeff Nippard',
    url: 'https://www.youtube.com/@JeffNippard',
    type: 'youtube',
    description: 'Science-based hypertrophy and strength training',
  },
  {
    title: 'Renaissance Periodization',
    url: 'https://www.youtube.com/@RenaissancePeriodization',
    type: 'youtube',
    description: 'Muscle building and periodization from Dr. Mike Israetel',
  },
  {
    title: 'Alan Thrall',
    url: 'https://www.youtube.com/@AlanThrall',
    type: 'youtube',
    description: 'Strength and powerlifting fundamentals',
  },
  {
    title: 'AthleanX',
    url: 'https://www.youtube.com/@athleanx',
    type: 'youtube',
    description: 'Athletic performance and muscle development',
  },
  {
    title: 'Greg Doucette',
    url: 'https://www.youtube.com/@GregDoucette',
    type: 'youtube',
    description: 'Training and nutrition for physique goals',
  },
  {
    title: 'Examine.com',
    url: 'https://examine.com',
    type: 'tool',
    description: 'Evidence-based supplement and diet research',
  },
  {
    title: 'Stronger By Science',
    url: 'https://www.strongerbyscience.com',
    type: 'article',
    description: 'Peer-reviewed training science and programming',
  },
  {
    title: 'MyFitnessPal',
    url: 'https://www.myfitnesspal.com',
    type: 'tool',
    description: 'Macro and calorie tracking',
  },
].map(normalizeResource);

export const DUAL_BRAND_CURATED_RESOURCES = [
  {
    title: 'Alex Hormozi',
    url: 'https://www.youtube.com/@AlexHormozi',
    type: 'youtube',
    description: 'Business growth and offer building',
  },
  {
    title: 'Iman Gadzhi',
    url: 'https://www.youtube.com/@imangadzhi',
    type: 'youtube',
    description: 'Agency building and personal brand',
  },
  {
    title: 'Dan Koe',
    url: 'https://www.youtube.com/@DanKoe',
    type: 'youtube',
    description: 'Solopreneurship, writing, and brand building',
  },
  {
    title: 'Nick Bare',
    url: 'https://www.youtube.com/@NickBare',
    type: 'youtube',
    description: 'Dual brand — fitness and business execution',
  },
  {
    title: 'Canva',
    url: 'https://www.canva.com',
    type: 'tool',
    description: 'Design assets for personal and company brands',
  },
  {
    title: 'Figma',
    url: 'https://www.figma.com',
    type: 'tool',
    description: 'UI/UX design and brand systems',
  },
  {
    title: 'Buffer',
    url: 'https://buffer.com',
    type: 'tool',
    description: 'Social content scheduling and publishing',
  },
].map(normalizeResource);

/**
 * Full ordered reading queue (user-defined).
 * Core 6-month plan = first 6 titles (one book per ~month).
 * Remaining titles are stretch goals if you finish early or continue after Day 184.
 */
export const READING_LIBRARY_QUEUE = [
  {
    title: 'Successful Habits',
    purpose: 'Build the foundation of daily structure and consistency',
    description: 'Daily habit reinforcement and structured routines',
    url: 'https://www.goodreads.com',
  },
  {
    title: 'System Building',
    purpose: 'Think in scalable, repeatable systems',
    description: 'Building systems that compound effort',
    url: 'https://www.goodreads.com',
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    purpose: 'Turn identity into tiny, compounding behaviors',
    description: 'Build consistency through habit systems',
    url: 'https://www.goodreads.com/book/show/40121378-atomic-habits',
  },
  {
    title: 'Be Obsessed or Be Average',
    author: 'Grant Cardone',
    purpose: 'Raise ambition and execution intensity',
    description: 'Aggression, ambition, and relentless execution',
    url: 'https://www.goodreads.com/book/show/28820101-be-obsessed-or-be-average',
  },
  {
    title: 'Meditations',
    author: 'Marcus Aurelius',
    purpose: 'Emotional control, discipline, and clarity',
    description: 'Stoic discipline and emotional control',
    url: 'https://www.goodreads.com/book/show/30659.Meditations',
  },
  {
    title: 'Cash Flow Quadrant',
    author: 'Robert T. Kiyosaki',
    purpose: 'Understand money, leverage, and ownership',
    description: 'Money, leverage, and financial mindset',
    url: 'https://www.goodreads.com/book/show/81922.Rich_Dad_s_Cashflow_Quadrant',
  },
  {
    title: 'The 15 Invaluable Laws of Growth',
    author: 'John C. Maxwell',
    purpose: 'Personal growth mindset and leadership',
    description: 'Laws that accelerate intentional growth',
    url: 'https://www.goodreads.com/book/show/17633039-the-15-invaluable-laws-of-growth',
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    purpose: 'Understand judgment, bias, and decision-making',
    description: 'How the mind makes decisions under uncertainty',
    url: 'https://www.goodreads.com/book/show/11468377-thinking-fast-and-slow',
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    purpose: 'Master behavior around wealth and risk',
    description: 'Timeless lessons on wealth, greed, and happiness',
    url: 'https://www.goodreads.com/book/show/41881472-the-psychology-of-money',
  },
  {
    title: 'How to Win Friends and Influence People',
    author: 'Dale Carnegie',
    purpose: 'Strengthen people skills and influence',
    description: 'Practical principles for relationships and persuasion',
    url: 'https://www.goodreads.com/book/show/4865.How_to_Win_Friends_and_Influence_People',
  },
  {
    title: 'Talk Like TED',
    author: 'Carmine Gallo',
    purpose: 'Communicate ideas with clarity and presence',
    description: 'Public speaking patterns from great TED talks',
    url: 'https://www.goodreads.com/book/show/18812646-talk-like-ted',
  },
  {
    title: 'The Art of Impossible',
    author: 'Steven Kotler',
    purpose: 'Peak performance and chasing hard goals',
    description: 'A playbook for extraordinary achievement',
    url: 'https://www.goodreads.com/book/show/54816858-the-art-of-impossible',
  },
  {
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    purpose: 'Presence, awareness, and mental quiet',
    description: 'Living fully in the present moment',
    url: 'https://www.goodreads.com/book/show/6708.The_Power_of_Now',
  },
  {
    title: 'The Courage to Be Disliked',
    author: 'Ichiro Kishimi & Fumitake Koga',
    purpose: 'Freedom from approval and past stories',
    description: 'Adlerian psychology on happiness and courage',
    url: 'https://www.goodreads.com/book/show/43306206-the-courage-to-be-disliked',
  },
].map((book, index) => ({
  ...book,
  type: 'book',
  readingTime: '9:15 PM - 10:00 PM daily (except Friday)',
  queueOrder: index + 1,
  url: book.url || 'https://www.goodreads.com',
  description: book.description || book.title,
}));

/** Required 6-month core: first 6 books in queue order (1 book ≈ 1 month). */
export const READING_BOOKS_BY_MONTH = READING_LIBRARY_QUEUE.slice(0, 6).map((book, index) => ({
  ...book,
  month: index + 1,
}));

/** Stretch titles (7–14) — read if you finish a month early or after the core six. */
export const READING_STRETCH_BOOKS = READING_LIBRARY_QUEUE.slice(6);

export const READING_SUPPLEMENTARY_BOOKS = READING_STRETCH_BOOKS;

export const READING_TOOL_RESOURCES = [
  {
    title: 'Goodreads',
    url: 'https://www.goodreads.com',
    type: 'tool',
    description: 'Track books read and reading progress',
  },
  {
    title: 'Blinkist',
    url: 'https://www.blinkist.com',
    type: 'tool',
    description: 'Book summaries for review and retention',
  },
  {
    title: 'Readwise',
    url: 'https://readwise.io',
    type: 'tool',
    description: 'Highlight retention and spaced review',
  },
].map(normalizeResource);

/** Approx day ranges for each core book across the 184-day arc. */
export const READING_MONTH_DAY_RANGES = [
  { month: 1, start: 1, end: 31 },
  { month: 2, start: 32, end: 62 },
  { month: 3, start: 63, end: 92 },
  { month: 4, start: 93, end: 123 },
  { month: 5, start: 124, end: 154 },
  { month: 6, start: 155, end: 184 },
];

const TOTAL_DAYS = 184;

function rangesForQueue(queue) {
  const core = (queue?.length ? queue : READING_BOOKS_BY_MONTH).slice(0, 6);
  const n = Math.max(1, core.length);
  const size = Math.floor(TOTAL_DAYS / n);
  return core.map((book, i) => ({
    month: i + 1,
    start: i * size + 1,
    end: i === n - 1 ? TOTAL_DAYS : (i + 1) * size,
    book: { ...book, month: i + 1 },
  }));
}

/** Map day number (1–184) to the active monthly book. Pass a queue to override the default 6. */
export function getBookForDayNumber(dayNumber, queue) {
  const day = Math.max(1, Number(dayNumber) || 1);
  const ranges = rangesForQueue(Array.isArray(queue) && queue.length ? queue : READING_BOOKS_BY_MONTH);
  const hit = ranges.find((r) => day >= r.start && day <= r.end);
  if (hit?.book) return hit.book;
  const range = READING_MONTH_DAY_RANGES.find((r) => day >= r.start && day <= r.end);
  const monthIndex = (range?.month || 6) - 1;
  return READING_BOOKS_BY_MONTH[monthIndex] || READING_BOOKS_BY_MONTH[0];
}

export function getBookMonthMeta(dayNumber, queue) {
  const book = getBookForDayNumber(dayNumber, queue);
  const ranges = rangesForQueue(Array.isArray(queue) && queue.length ? queue : READING_BOOKS_BY_MONTH);
  const range = ranges.find((r) => r.month === book.month) || ranges[0];
  return { book, start: range?.start ?? 1, end: range?.end ?? TOTAL_DAYS, month: book.month };
}

export function getBookDisplayTitle(book) {
  return book?.author ? `${book.title} — ${book.author}` : book?.title || 'Reading';
}

export const WRITER_CURATED_RESOURCES = [
  {
    title: 'David Perell',
    url: 'https://perell.com',
    type: 'article',
    description: 'Writing online and building a personal monopoly',
  },
  {
    title: 'Nicolas Cole',
    url: 'https://nicolascole.medium.com',
    type: 'article',
    description: 'Digital writing and audience building',
  },
  {
    title: 'Ship 30 for 30',
    url: 'https://www.ship30for30.com',
    type: 'course',
    description: 'Writing consistency and atomic essay practice',
  },
  {
    title: 'Hemingway App',
    url: 'https://hemingwayapp.com',
    type: 'tool',
    description: 'Clarity editing and readability improvements',
  },
  {
    title: 'Typefully',
    url: 'https://typefully.com',
    type: 'tool',
    description: 'Twitter/X thread writing and scheduling',
  },
].map(normalizeResource);

export const SE_CORE_RESOURCES = [
  {
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    type: 'article',
    description: 'Authoritative web development documentation',
  },
  {
    title: 'The Odin Project',
    url: 'https://www.theodinproject.com',
    type: 'course',
    description: 'Full-stack curriculum with projects',
  },
  {
    title: 'roadmap.sh',
    url: 'https://roadmap.sh',
    type: 'tool',
    description: 'Developer roadmaps and learning paths',
  },
  {
    title: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org',
    type: 'course',
    description: 'Free coding courses and certifications',
  },
].map(normalizeResource);
