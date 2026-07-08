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
    description: 'Design assets for Ryxen and HavenX brands',
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

export const READING_BOOKS_BY_MONTH = [
  {
    month: 1,
    title: 'Successful Habits',
    purpose: 'Reinforcing structure',
    readingTime: '9:15 PM - 10:00 PM daily (except Friday)',
    type: 'book',
    description: 'Daily habit reinforcement and structured routines',
  },
  {
    month: 2,
    title: 'System Building',
    purpose: 'Thinking in scalable systems',
    readingTime: '9:15 PM - 10:00 PM daily (except Friday)',
    type: 'book',
    description: 'Building repeatable systems for growth',
  },
  {
    month: 3,
    title: 'The 15 Invaluable Laws of Growth',
    author: 'John C. Maxwell',
    purpose: 'Personal growth mindset',
    readingTime: '9:15 PM - 10:00 PM daily (except Friday)',
    url: 'https://www.goodreads.com/book/show/17633039-the-15-invaluable-laws-of-growth',
    type: 'book',
    description: 'Personal growth mindset and leadership development',
  },
  {
    month: 4,
    title: 'Meditations',
    author: 'Marcus Aurelius',
    purpose: 'Emotional control & discipline',
    readingTime: '9:15 PM - 10:00 PM daily (except Friday)',
    url: 'https://www.goodreads.com/book/show/30659.Meditations',
    type: 'book',
    description: 'Stoic discipline and emotional control',
  },
  {
    month: 5,
    title: 'Cashflow Quadrant',
    author: 'Robert T. Kiyosaki',
    purpose: 'Understanding money & leverage',
    readingTime: '9:15 PM - 10:00 PM daily (except Friday)',
    url: 'https://www.goodreads.com/book/show/81922.Rich_Dad_s_Cashflow_Quadrant',
    type: 'book',
    description: 'Money, leverage, and financial mindset',
  },
  {
    month: 6,
    title: 'Be Obsessed or Be Average',
    author: 'Grant Cardone',
    purpose: 'Aggression, ambition & execution',
    readingTime: '9:15 PM - 10:00 PM daily (except Friday)',
    url: 'https://www.goodreads.com/book/show/28820101-be-obsessed-or-be-average',
    type: 'book',
    description: 'Aggression, ambition, and relentless execution',
  },
  {
    month: 7,
    title: 'Atomic Habits',
    author: 'James Clear',
    purpose: 'Build consistency & systems',
    readingTime: '9:15 PM - 10:00 PM daily (except Friday)',
    url: 'https://www.goodreads.com/book/show/40121378-atomic-habits',
    type: 'book',
    description: 'Build consistency through habit systems',
  },
];

export const READING_SUPPLEMENTARY_BOOKS = [
  {
    title: "Can't Hurt Me",
    author: 'David Goggins',
    url: 'https://www.goodreads.com/book/show/41721428-can-t-hurt-me',
    type: 'book',
    description: 'Mental toughness and pushing past limits',
  },
  {
    title: 'The War of Art',
    author: 'Steven Pressfield',
    url: 'https://www.goodreads.com/book/show/1319.The_War_of_Art',
    type: 'book',
    description: 'Overcoming resistance and creative blocks',
  },
  {
    title: '48 Laws of Power',
    author: 'Robert Greene',
    url: 'https://www.goodreads.com/book/show/1303.The_48_Laws_of_Power',
    type: 'book',
    description: 'Strategy, influence, and power dynamics',
  },
  {
    title: 'The Way of the Superior Man',
    author: 'David Deida',
    url: 'https://www.goodreads.com/book/show/79424.The_Way_of_the_Superior_Man',
    type: 'book',
    description: 'Masculine identity and purposeful living',
  },
].map(normalizeResource);

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

/** Map day number (1–184) to the active monthly book for the 6-month arc. */
export function getBookForDayNumber(dayNumber) {
  if (dayNumber <= 31) return READING_BOOKS_BY_MONTH[0];
  if (dayNumber <= 62) return READING_BOOKS_BY_MONTH[1];
  if (dayNumber <= 92) return READING_BOOKS_BY_MONTH[2];
  if (dayNumber <= 123) return READING_BOOKS_BY_MONTH[3];
  if (dayNumber <= 154) return READING_BOOKS_BY_MONTH[4];
  return READING_BOOKS_BY_MONTH[5];
}

export function getBookDisplayTitle(book) {
  return book.author ? `${book.title} — ${book.author}` : book.title;
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
