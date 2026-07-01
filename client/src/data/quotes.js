/**
 * Domain-Specific Motivational Quotes
 * Quotes are organized by journey domain — one unique quote per journey day
 */

import { getCurrentDayNumber, getDateForDay } from '../utils/dates';

export const domainQuotes = {
  'body-transformation': [
    { quote: "The only bad workout is the one that didn't happen.", author: "Unknown", icon: "💪" },
    { quote: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn", icon: "🏋️" },
    { quote: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.", author: "Rikki Rogers", icon: "💪" },
    { quote: "The body achieves what the mind believes.", author: "Unknown", icon: "🧠" },
    { quote: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Unknown", icon: "💭" },
    { quote: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown", icon: "🔥" },
    { quote: "Don't stop when you're tired. Stop when you're done.", author: "Unknown", icon: "⏱️" },
    { quote: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn", icon: "🏠" },
    { quote: "The difference between try and triumph is just a little umph!", author: "Marvin Phillips", icon: "🚀" },
    { quote: "You are one workout away from a good mood.", author: "Unknown", icon: "😊" },
    { quote: "Sweat is fat crying.", author: "Unknown", icon: "💧" },
    { quote: "The only workout you'll regret is the one you didn't do.", author: "Unknown", icon: "✅" },
    { quote: "Your body can do it. It's your mind you need to convince.", author: "Unknown", icon: "🧘" },
    { quote: "Fitness is not about being better than someone else. It's about being better than you used to be.", author: "Unknown", icon: "📈" },
    { quote: "The best project you'll ever work on is you.", author: "Unknown", icon: "🎯" },
  ],

  'software-engineering': [
    { quote: "First, solve the problem. Then, write the code.", author: "John Johnson", icon: "💻" },
    { quote: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House", icon: "😄" },
    { quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler", icon: "👥" },
    { quote: "The best way to get a project done faster is to start sooner.", author: "Jim Highsmith", icon: "⏰" },
    { quote: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson", icon: "📖" },
    { quote: "The most disastrous thing that you can ever learn is your first programming language.", author: "Alan Kay", icon: "🌱" },
    { quote: "Debugging is twice as hard as writing the code in the first place.", author: "Brian Kernighan", icon: "🐛" },
    { quote: "The best error message is the one that never shows up.", author: "Thomas Fuchs", icon: "✅" },
    { quote: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", icon: "✨" },
    { quote: "Make it work, make it right, make it fast.", author: "Kent Beck", icon: "⚡" },
    { quote: "The computer is incredibly fast, accurate, and stupid. Man is unbelievably slow, inaccurate, and brilliant.", author: "William Schockley", icon: "🤖" },
    { quote: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine", icon: "🧩" },
    { quote: "The best code is no code at all.", author: "Jeff Atwood", icon: "🎯" },
    { quote: "Code never lies, comments sometimes do.", author: "Ron Jeffries", icon: "💬" },
    { quote: "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it.", author: "Patrick McKenzie", icon: "🚀" },
  ],

  'writers': [
    { quote: "The first draft is just you telling yourself the story.", author: "Terry Pratchett", icon: "✍️" },
    { quote: "You can't edit a blank page.", author: "Jodi Picoult", icon: "📄" },
    { quote: "Write. Rewrite. When not writing or rewriting, read. I know of no shortcuts.", author: "Larry L. King", icon: "📚" },
    { quote: "The scariest moment is always just before you start.", author: "Stephen King", icon: "😰" },
    { quote: "Start writing, no matter what. The water does not flow until the faucet is turned on.", author: "Louis L'Amour", icon: "💧" },
    { quote: "You don't start out writing good stuff. You start out writing crap and thinking it's good stuff, and then gradually you get better at it.", author: "Octavia E. Butler", icon: "📝" },
    { quote: "Writing is thinking on paper.", author: "William Zinsser", icon: "🧠" },
    { quote: "The difference between the right word and the almost right word is the difference between lightning and a lightning bug.", author: "Mark Twain", icon: "⚡" },
    { quote: "Fill your paper with the breathings of your heart.", author: "William Wordsworth", icon: "❤️" },
    { quote: "If there's a book that you want to read, but it hasn't been written yet, then you must write it.", author: "Toni Morrison", icon: "📖" },
    { quote: "Writing is easy. All you have to do is cross out the wrong words.", author: "Mark Twain", icon: "✂️" },
    { quote: "The purpose of a writer is to keep civilization from destroying itself.", author: "Albert Camus", icon: "🌍" },
    { quote: "Write what should not be forgotten.", author: "Isabel Allende", icon: "💭" },
    { quote: "A writer is someone for whom writing is more difficult than it is for other people.", author: "Thomas Mann", icon: "🎯" },
    { quote: "You can make anything by writing.", author: "C.S. Lewis", icon: "✨" },
  ],

  'reading': [
    { quote: "A reader lives a thousand lives before he dies. The man who never reads lives only one.", author: "George R.R. Martin", icon: "📚" },
    { quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss", icon: "🌍" },
    { quote: "Reading is to the mind what exercise is to the body.", author: "Joseph Addison", icon: "💪" },
    { quote: "Books are a uniquely portable magic.", author: "Stephen King", icon: "✨" },
    { quote: "Today a reader, tomorrow a leader.", author: "Margaret Fuller", icon: "👑" },
    { quote: "Reading is essential for those who seek to rise above the ordinary.", author: "Jim Rohn", icon: "📈" },
    { quote: "The reading of all good books is like conversation with the finest men of past centuries.", author: "René Descartes", icon: "💬" },
    { quote: "A book is a dream that you hold in your hand.", author: "Neil Gaiman", icon: "🌙" },
    { quote: "Reading is a discount ticket to everywhere.", author: "Mary Schmich", icon: "🎫" },
    { quote: "Books are the quietest and most constant of friends.", author: "Charles W. Eliot", icon: "🤝" },
    { quote: "The person who does not read has no advantage over the person who cannot read.", author: "Mark Twain", icon: "📖" },
    { quote: "Reading is escape, and the opposite of escape; it's a way to make contact with reality after a day of making things up.", author: "Nora Ephron", icon: "🚪" },
    { quote: "I find television very educating. Every time somebody turns on the set, I go into the other room and read a book.", author: "Groucho Marx", icon: "📺" },
    { quote: "Reading is a conversation. All books talk. But a good book listens as well.", author: "Mark Haddon", icon: "👂" },
    { quote: "Books are the plane, and the train, and the road. They are the destination and the journey.", author: "Anna Quindlen", icon: "✈️" },
  ],

  'dual-brand': [
    { quote: "Your brand is what people say about you when you're not in the room.", author: "Jeff Bezos", icon: "🎯" },
    { quote: "A brand is a story that is always being told.", author: "Scott Bedbury", icon: "📖" },
    { quote: "Brand is the promise, the big idea, the expectations that reside in each customer's mind about a product, service or company.", author: "Marty Neumeier", icon: "💎" },
    { quote: "Your brand is your reputation.", author: "Richard Branson", icon: "⭐" },
    { quote: "A brand for a company is like a reputation for a person. You earn reputation by trying to do hard things well.", author: "Jeff Bezos", icon: "🏆" },
    { quote: "The best brands are built on great stories.", author: "Ike Pigott", icon: "📚" },
    { quote: "Your brand is what other people say about you when you're not in the room.", author: "Unknown", icon: "💬" },
    { quote: "Branding is about making an emotional connection with your audience.", author: "Unknown", icon: "❤️" },
    { quote: "A brand is not what you say it is. It's what they say it is.", author: "Marty Neumeier", icon: "🗣️" },
    { quote: "The strongest brands are built on great products.", author: "Phil Knight", icon: "🚀" },
    { quote: "Your brand is the single most important investment you can make in your business.", author: "Steve Forbes", icon: "💰" },
    { quote: "Branding is the art of differentiation.", author: "David Brier", icon: "🎨" },
    { quote: "A brand is the set of expectations, memories, stories and relationships that, taken together, account for a consumer's decision to choose one product or service over another.", author: "Seth Godin", icon: "🧠" },
    { quote: "The best brands are built on authenticity.", author: "Unknown", icon: "✨" },
    { quote: "Your brand is a story unfolding across all customer touchpoints.", author: "Jonah Sachs", icon: "📱" },
  ],
};

/**
 * General quotes for dashboard/home page
 */
const generalQuotes = [
  { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier", icon: "🌟" },
  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar", icon: "🚀" },
  { quote: "The future depends on what you do today.", author: "Mahatma Gandhi", icon: "✨" },
  { quote: "Consistency is the mother of mastery.", author: "Robin Sharma", icon: "🎯" },
  { quote: "Every expert was once a beginner.", author: "Helen Hayes", icon: "📚" },
  { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney", icon: "⚡" },
  { quote: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", icon: "🐢" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", icon: "❤️" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", icon: "💫" },
  { quote: "Your limitation—it's only your imagination.", author: "Unknown", icon: "🌈" },
  { quote: "Push yourself, because no one else is going to do it for you.", author: "Unknown", icon: "🔥" },
  { quote: "Great things never come from comfort zones.", author: "Unknown", icon: "🌊" },
  { quote: "Dream it. Wish it. Do it.", author: "Unknown", icon: "⭐" },
  { quote: "Success doesn't just find you. You have to go out and get it.", author: "Unknown", icon: "🎯" },
];

/**
 * Whether a journey day's quote is unlocked (that calendar date has arrived)
 * Day 0 never unlocks; Day 1+ unlocks on or after their scheduled date
 */
export function isDayQuoteUnlocked(dayNumber) {
  if (!dayNumber || dayNumber < 1) return false;
  const dayDate = getDateForDay(dayNumber);
  if (!dayDate) return false;
  const today = new Date();
  const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dayLocal = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());
  return dayLocal <= todayLocal;
}

/**
 * Get the quote assigned to a specific journey day (Day 1 = first quote, etc.)
 */
export function getQuoteForJourneyDay(domain, dayNumber) {
  if (!dayNumber || dayNumber < 1) return null;

  if (domain === 'all' || !domain || !domainQuotes[domain]) {
    const index = (dayNumber - 1) % generalQuotes.length;
    return generalQuotes[index];
  }

  const quotes = domainQuotes[domain];
  const index = (dayNumber - 1) % quotes.length;
  return quotes[index];
}

/**
 * Get today's quote for dashboard/home — only if the current journey day has arrived
 */
export function getQuoteOfTheDay(domain, _completedDays = 0) {
  const currentDay = getCurrentDayNumber();
  if (!currentDay || currentDay < 1 || !isDayQuoteUnlocked(currentDay)) {
    return null;
  }
  return getQuoteForJourneyDay(domain, currentDay);
}

/**
 * Get encouraging message based on progress
 */
export function getEncouragingMessage(completedDays) {
  if (completedDays === 0) {
    return { message: "Ready to begin your transformation?", emoji: "🎬" };
  } else if (completedDays < 7) {
    return { message: "You're building momentum! Keep going!", emoji: "🌱" };
  } else if (completedDays < 30) {
    return { message: "You're forming powerful habits!", emoji: "💪" };
  } else if (completedDays < 60) {
    return { message: "You're halfway there! Amazing progress!", emoji: "🎉" };
  } else {
    return { message: "You're in the final stretch! Finish strong!", emoji: "🏆" };
  }
}

