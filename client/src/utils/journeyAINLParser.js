/**
 * Natural-language helpers for the journey planning assistant.
 * Parses flexible phrasing without requiring exact keyword matches.
 */

const WEEKDAY_MAP = {
  monday: 1, mon: 1, tuesday: 2, tue: 2, tues: 2, wednesday: 3, wed: 3,
  thursday: 4, thu: 4, thur: 4, thurs: 4, friday: 5, fri: 5,
  saturday: 6, sat: 6, sunday: 0, sun: 0,
};

const WORD_NUMBERS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  twice: 2, thrice: 3,
};

/** Normalize user input for matching */
export function normalizePrompt(text) {
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"');
}

export function toLower(text) {
  return normalizePrompt(text).toLowerCase();
}

/** Detect requests outside assistant capabilities */
export function detectUnsupportedRequest(lower, ctx) {
  const checks = [
    {
      test: () =>
        /\b(delete|remove|archive|uninstall)\b.*\b(journey|program)\b/.test(lower) &&
        !isTimeRemovalRequest(lower),
      message:
        "I can't delete journeys or wipe progress from here. Use Settings → Journey management for resets, or edit this journey's schedule individually.",
    },
    {
      test: () => /\bdelete all (my )?progress\b/.test(lower),
      message:
        "I can't wipe progress from here. Use Settings → Journey management → Reset all journeys if you need a global reset.",
    },
    {
      test: () => /\b(other|another|different|all)\s+journeys?\b/.test(lower) || /\bevery journey\b/.test(lower),
      message: `I can only update "${ctx.journeyTitle}" in this assistant. Switch to another journey's overview to change it separately.`,
    },
    {
      test: () => /\b(day \d+|week \d+|session \d+|workout \d+)\b.*\b(change|modify|replace|edit)\b/.test(lower) ||
        /\b(change|modify|replace)\b.*\b(day \d+|week \d+|specific workout|exercise list)\b/.test(lower),
      message:
        "I can't edit individual program days or exercise lists. I can adjust your weekly rhythm, session times, goals, and reminders for this journey.",
    },
    {
      test: () => /\b(meal plan|calorie|macro|diet plan|recipe|nutrition plan)\b/.test(lower),
      message:
        "I can't build meal or nutrition plans. I can update your fitness goals (e.g. muscle gain or weight loss) and your weekly workout schedule.",
    },
    {
      test: () => /\b(doctor|medical|diagnose|injury treatment|prescription|medicine)\b/.test(lower),
      message:
        "I'm not able to give medical advice. I can help adjust your journey schedule or goals — consult a professional for health concerns.",
    },
    {
      test: () => /\b(email|text me|notification to phone|sms|call me)\b/.test(lower),
      message:
        "I can't send emails or texts. I can enable in-app reminders and update when your sessions are scheduled.",
    },
    {
      test: () => /\b(export|download|backup|import)\b.*\b(data|json|file)\b/.test(lower),
      message: "Data export is available in Settings → Data & backup. I can't run exports from this assistant.",
    },
    {
      test: () => /\b(create|add|new)\s+journey\b/.test(lower),
      message: "To create a new journey, use the Create Journey flow from your dashboard. This assistant only edits the current journey.",
    },
  ];

  return checks.find((c) => c.test())?.message ?? null;
}

/** Detect general chat / questions that aren't actionable edits */
export function detectOffTopicOrQuestion(lower) {
  if (/^(hi|hello|hey|thanks|thank you|ok|okay|cool|great)\b/.test(lower) && lower.length < 40) {
    return {
      type: 'chat',
      message:
        "Hi — I'm your planning assistant for this journey. Tell me what you'd like to change in your schedule, goals, or session times.",
    };
  }

  if (/^(what|how|why|when|where|who|which|can you explain|tell me about|what is|what are)\b/.test(lower) &&
    !/\b(move|change|set|schedule|add|remove|reduce|switch|update|make)\b/.test(lower)) {
    return {
      type: 'question',
      message:
        "I can help you update this journey's weekly schedule, session times, goals, and reminders. Try describing a change — for example, when you want to work out or what you want to focus on.",
    };
  }

  if (/\b(joke|weather|news|stock|crypto|politics|who are you|what model)\b/.test(lower)) {
    return {
      type: 'offtopic',
      message:
        "I'm focused on planning this journey only — schedules, goals, and reminders. I can't help with general questions outside that.",
    };
  }

  return null;
}

export function parseDaysFromText(text) {
  const lower = toLower(text);

  if (isTimeRemovalRequest(lower)) return [];

  if (/every day|daily|7 days|all week|seven days a week/.test(lower)) return [0, 1, 2, 3, 4, 5, 6];
  if (/weekdays|week days|mon–fri|mon-fri|monday through friday|monday to friday|during the week/.test(lower)) {
    return [1, 2, 3, 4, 5];
  }
  if (/weekends?|weekend only|sat.*sun|saturday.*sunday/.test(lower) && /only|just|rest|recovery/.test(lower)) {
    return [0, 6];
  }
  if (/monday.*wednesday.*friday|mon.*wed.*fri|m\/w\/f|mon wed fri/.test(lower)) return [1, 3, 5];
  if (/tuesday.*thursday|tue.*thu|t\/th/.test(lower) && /only|just/.test(lower)) return [2, 4];

  const offDays = [];
  Object.entries(WEEKDAY_MAP).forEach(([name, idx]) => {
    if (new RegExp(`\\b(no|skip|off|remove|drop|without|except)\\s+${name}\\b`).test(lower)) offDays.push(idx);
  });

  const days = [];
  Object.entries(WEEKDAY_MAP).forEach(([name, idx]) => {
    if (lower.includes(name) && !offDays.includes(idx)) days.push(idx);
  });

  if (days.length) return [...new Set(days)].sort((a, b) => a - b);

  if (/weekends?.*recovery|recovery.*weekends?|rest.*weekends?|weekends?.*rest/.test(lower)) return [0, 6];
  return [];
}

export function parseFrequency(text, sessionTerm = 'session') {
  const lower = toLower(text);
  const numeric = lower.match(new RegExp(`(\\d)\\s*(?:days?|times?|x|${sessionTerm}s?)\\s*(?:a|per|each|\\/)?\\s*week`, 'i'));
  if (numeric) return Number(numeric[1]);

  for (const [word, n] of Object.entries(WORD_NUMBERS)) {
    if (new RegExp(`${word}\\s*(?:days?|times?|${sessionTerm}s?)\\s*(?:a|per|each)?\\s*week`, 'i').test(lower)) {
      return n;
    }
  }

  if (/three days|3 days|3x|3 times/.test(lower)) return 3;
  if (/four days|4 days|4x|4 times/.test(lower)) return 4;
  if (/five days|5 days|5x|5 times/.test(lower)) return 5;
  if (/two days|2 days|2x|twice/.test(lower)) return 2;
  if (/once a week|one day|1 day/.test(lower)) return 1;
  if (/less often|fewer days|cut back|reduce.*days/.test(lower)) return 3;
  return null;
}

export function parseTime(text) {
  const lower = toLower(text);
  if (/noon/.test(lower)) return '12:00';
  if (/midnight/.test(lower)) return '00:00';

  const wordTime = lower.match(/\b(at\s+)?(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s*(am|pm|o'clock)?/i);
  if (wordTime) {
    const words = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
    let h = words[wordTime[2]?.toLowerCase()] ?? 0;
    const ampm = wordTime[3]?.toLowerCase();
    if (ampm === 'pm' && h < 12) h += 12;
    if (ampm === 'am' && h === 12) h = 0;
    if (!ampm && /morning/.test(lower) && h <= 11) { /* keep */ }
    if (!ampm && /evening|night|afternoon/.test(lower) && h < 12) h += 12;
    return `${String(h).padStart(2, '0')}:00`;
  }

  const m = text.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm|a\.m\.|p\.m\.)?/i);
  if (!m) return null;
  let h = Number(m[1]);
  const min = m[2] || '00';
  const ampm = m[3]?.toLowerCase()?.replace(/\./g, '');
  if (ampm === 'pm' && h < 12) h += 12;
  if (ampm === 'am' && h === 12) h = 0;
  if (!ampm && /evening|night|pm/.test(lower) && h < 12) h += 12;
  return `${String(h).padStart(2, '0')}:${min}`;
}

export function detectTimeOfDay(lower) {
  if (/evening|night|after work|after dinner|pm\b|at night/.test(lower)) return 'evening';
  if (/morning|before work|early|am\b|at dawn|first thing/.test(lower) && !/night shift/.test(lower)) return 'morning';
  if (/afternoon|midday|lunch/.test(lower)) return 'afternoon';
  return null;
}

/** User wants to clear session times (keep days/activities). */
export function isTimeRemovalRequest(lower) {
  return (
    /\b(remove|clear|drop|delete|unset)\b.*\b(time|times)\b/.test(lower) ||
    /\b(no|without|don't|dont)\b[^.]{0,40}\b(specific )?(set )?time\b/.test(lower) ||
    /\b(flexible|anytime|no set time)\b/.test(lower)
  );
}

/** Parse which weekdays a time edit targets (removal or change). */
export function parseTargetDaysForTimeEdit(text) {
  const lower = toLower(text);
  const targets = [];

  if (/weekends?/.test(lower) || (/\bsat(?:urday)?\b/.test(lower) && /\bsun(?:day)?\b/.test(lower))) {
    return [0, 6];
  }

  Object.entries(WEEKDAY_MAP).forEach(([name, idx]) => {
    if (new RegExp(`\\b${name}\\b`).test(lower)) targets.push(idx);
  });

  if (/weekdays?/.test(lower) && !/weekends?/.test(lower)) {
    return [1, 2, 3, 4, 5];
  }

  return [...new Set(targets)].sort((a, b) => a - b);
}

/** True when day names appear in a scheduling context (not just time removal). */
export function isScheduleDayRewriteRequest(lower) {
  if (isTimeRemovalRequest(lower)) return false;
  return /\b(move|schedule|switch|only|add|remove|drop|skip|reduce|workout|session|every)\b/.test(lower);
}

/** Extract free-form goal intent from conversational phrasing */
export function extractGoalIntent(text, lower, profile, ctx) {
  const triggers = [
    /(?:my )?(?:main |primary )?goal is (?:to )?(.+)/i,
    /(?:i'm |i am )?(?:trying|working|looking) to (.+)/i,
    /(?:i want|i'd like|i would like|i need) to (.+)/i,
    /(?:focus on|prioritize|concentrate on) (.+)/i,
    /(?:help me) (.+)/i,
    /(?:change|update|set|switch) (?:my )?goal(?:s)? (?:to )?(.+)/i,
  ];

  for (const re of triggers) {
    const m = text.match(re);
    if (!m?.[1]) continue;
    let goalText = m[1].trim().replace(/[.!?]+$/, '');
    if (goalText.length < 4 || goalText.length > 120) continue;

    const goalLower = goalText.toLowerCase();
    if (/\b(move|shift|schedule|reminder|reschedule|time|monday|tuesday|wednesday|thursday|friday|saturday|sunday|every day|morning|evening|afternoon|weekday|weekend)\b/.test(goalLower)) {
      continue;
    }

    return goalText;
  }

  if (ctx.category === 'fitness') {
    if (/\b(build muscle|muscle gain|get stronger|strength training|bulk)\b/.test(lower)) return 'Build muscle & strength';
    if (/\b(lose weight|weight loss|fat loss|cut down|slim down|burn fat)\b/.test(lower)) return 'Lose weight / body fat';
    if (/\b(get fit|improve fitness|be more active|stay consistent)\b/.test(lower)) return 'Build consistency and improve fitness';
  }

  if (ctx.category === 'reading' && /\b(read more|more books|finish books)\b/.test(lower)) {
    return 'Read more books and build consistency';
  }

  return null;
}

/** Score how well we understood the request (0–1) */
export function computeUnderstandingScore(changes, lower) {
  if (changes.length >= 2) return 0.95;
  if (changes.length === 1) return 0.85;
  if (/\b(schedule|goal|workout|time|day|week|reminder|move|change|reduce|add)\b/.test(lower)) return 0.35;
  return 0.1;
}

export { WEEKDAY_MAP };
