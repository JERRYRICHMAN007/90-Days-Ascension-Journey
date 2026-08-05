/**
 * Journey-scoped AI assistant — interprets natural language per journey type.
 * All patches are applied only to the journeyId passed in.
 */

import { getJourneySetup } from './journeySetup.js';
import { getWeeklyPlan } from './journeyWeeklyPlan.js';
import {
  resolveJourneyAIContext,
  loadJourneyAIScope,
  detectCrossJourneyIntent,
  getDefaultWeeklyPlanForCategory,
  AI_PERSONAS,
} from './journeyAIContext.js';
import {
  normalizePrompt,
  toLower,
  detectUnsupportedRequest,
  detectOffTopicOrQuestion,
  parseDaysFromText,
  parseFrequency,
  parseTime,
  detectTimeOfDay,
  extractGoalIntent,
  computeUnderstandingScore,
  isTimeRemovalRequest,
  parseTargetDaysForTimeEdit,
  isScheduleDayRewriteRequest,
} from './journeyAINLParser.js';

const WEEKDAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** @typedef {'ready'|'unsupported'|'unclear'|'info'} AIResponseStatus */

/** @typedef {{ summary: string, patches: Record<string, unknown>, confidence: 'high'|'medium'|'low', status: AIResponseStatus, requiresGoalConfirm?: boolean, scopedTo?: string, suggestions?: string[] }} AIPlanSuggestion */

function swapWeekdays(plan, a, b) {
  const next = { ...plan };
  const tmp = next[a];
  next[a] = next[b];
  next[b] = tmp;
  return next;
}

function applyTimeToAll(plan, time) {
  const next = { ...plan };
  Object.keys(next).forEach((d) => {
    next[d] = { ...next[d], time };
  });
  return next;
}

function buildPlanWithActiveDays(basePlan, activeDays, activeLabel, restLabel, time = '06:00', restTime = '08:00') {
  const plan = {};
  activeDays.forEach((d) => {
    plan[d] = { ...(basePlan[d] || {}), type: basePlan[d]?.type || 'custom', label: activeLabel, time: basePlan[d]?.time || time };
  });
  [0, 6].forEach((d) => {
    if (!activeDays.includes(d)) {
      plan[d] = { type: 'recovery', label: restLabel, time: restTime };
    }
  });
  return { ...basePlan, ...plan };
}

function interpretUniversalGoals(text, lower, profile, ctx) {
  const patches = {};
  const changes = [];
  let requiresGoalConfirm = false;

  const goalText = extractGoalIntent(text, lower, profile, ctx);
  if (goalText) {
    patches.goal = [profile.goal, goalText].filter(Boolean).join('\n');
    requiresGoalConfirm = true;
    changes.push(`Update focus: ${goalText}`);
  }

  if (/success|looks like|when i'm done|end result/.test(lower)) {
    const m = text.match(/(?:success looks like|when i'm done|end result)[:\s]+(.+)/i);
    if (m?.[1]?.trim()) {
      patches.successLooksLike = m[1].trim().replace(/[.!?]+$/, '');
      requiresGoalConfirm = true;
      changes.push('Update success criteria');
    }
  }

  if (/why (is this|does this) matter|why important|motivation is/.test(lower)) {
    const m = text.match(/(?:why (?:is this|does this) matter|why important|motivation is)[:\s]+(.+)/i);
    if (m?.[1]?.trim()) {
      patches.whyImportant = m[1].trim().replace(/[.!?]+$/, '');
      requiresGoalConfirm = true;
      changes.push('Update why this matters');
    }
  }

  return { patches, changes, requiresGoalConfirm };
}

function applyRemoveTimesFromDays(basePlan, targetDays) {
  const next = { ...basePlan };
  targetDays.forEach((d) => {
    if (next[d]) {
      next[d] = { ...next[d] };
      delete next[d].time;
    }
  });
  return next;
}

function interpretRemoveSessionTime(text, lower, basePlan) {
  if (!isTimeRemovalRequest(lower)) {
    return { patches: {}, changes: [] };
  }

  const targetDays = parseTargetDaysForTimeEdit(text);
  if (!targetDays.length) {
    return { patches: {}, changes: [] };
  }

  const next = applyRemoveTimesFromDays(basePlan, targetDays);
  const dayLabels = targetDays.map((d) => WEEKDAY_FULL[d]).join(', ');

  return {
    patches: { weeklyPlan: next },
    changes: [`Clear scheduled times on ${dayLabels} — those days stay on your plan, just flexible timing`],
  };
}

function interpretCommonSchedule(text, lower, profile, ctx, basePlan) {
  const patches = {};
  const changes = [];
  const { sessionTerm, restTerm, category } = ctx;

  if (isTimeRemovalRequest(lower)) {
    const timeRemoval = interpretRemoveSessionTime(text, lower, basePlan);
    if (timeRemoval.changes.length) {
      return timeRemoval;
    }
    return {
      patches: {},
      changes: [],
      _needsTimeTarget: true,
    };
  }

  const freq = parseFrequency(text, sessionTerm.split(' ')[0]);
  if (freq && category === 'fitness') {
    const slots = [1, 3, 5, 2, 4, 1, 2].filter((d, i, arr) => arr.indexOf(d) === i).slice(0, freq);
    patches.availableDays = [...slots, 6, 0];
    patches.weeklyPlan = buildPlanWithActiveDays(
      basePlan,
      slots,
      'Workout',
      'Rest & Recovery'
    );
    changes.push(`Schedule ${freq} workout day${freq === 1 ? '' : 's'} per week with weekend recovery`);
  } else if (freq) {
    const slots = [1, 2, 3, 4, 5, 6, 0].slice(0, freq);
    patches.availableDays = slots;
    changes.push(`Schedule ${freq} ${sessionTerm}${freq === 1 ? '' : 's'} per week`);
  }

  const days = parseDaysFromText(text);
  if (days.length && !freq && isScheduleDayRewriteRequest(lower) && !/recovery.*weekend|weekend.*recovery/.test(lower)) {
    if (category === 'fitness' && days.some((d) => d >= 1 && d <= 5)) {
      patches.availableDays = [...new Set([...days, 6, 0])].sort((a, b) => a - b);
      patches.weeklyPlan = buildPlanWithActiveDays(
        basePlan,
        days.filter((d) => d >= 1 && d <= 5),
        category === 'fitness' ? 'Workout' : sessionTerm,
        'Rest & Recovery'
      );
    } else {
      patches.availableDays = days;
    }
    changes.push(`Update schedule to ${days.map((d) => WEEKDAY_FULL[d]).join(', ')}`);
  }

  const timeOfDay = detectTimeOfDay(lower);
  const parsedTime = parseTime(text);

  if (timeOfDay === 'evening' || /evening|night|after work|night shift/.test(lower)) {
    patches.preferredTimes = ['evening'];
    const t = parsedTime || '19:00';
    patches.weeklyPlan = applyTimeToAll(basePlan, t);
    changes.push(`Move ${sessionTerm}s to evenings (${t})`);
  } else if ((timeOfDay === 'morning' || /morning|before work|early/.test(lower)) && !/night shift/.test(lower)) {
    patches.preferredTimes = ['morning'];
    const t = parsedTime || '07:00';
    patches.weeklyPlan = applyTimeToAll(basePlan, t);
    changes.push(`Move ${sessionTerm}s to mornings (${t})`);
  } else if (timeOfDay === 'afternoon') {
    const t = parsedTime || '14:00';
    patches.weeklyPlan = applyTimeToAll(basePlan, t);
    changes.push(`Move ${sessionTerm}s to afternoons (${t})`);
  } else if (parsedTime && /\b(at|@|to)\b/.test(lower) && !isTimeRemovalRequest(lower)) {
    patches.weeklyPlan = applyTimeToAll(basePlan, parsedTime);
    changes.push(`Set session time to ${parsedTime}`);
  }

  const minutes = text.match(/(\d+)\s*min/i);
  if (minutes || /half an hour|30 min|only have 30/.test(lower)) {
    const mins = minutes ? minutes[1] : '30';
    patches.timeAvailable = `${mins} minutes daily`;
    changes.push(`Cap daily time at ${mins} minutes`);
  }

  if (/reminder|move.*reminder/.test(lower)) {
    const t = parseTime(text) || '19:00';
    patches.weeklyPlan = applyTimeToAll(basePlan, t);
    patches.remindersEnabled = true;
    changes.push(`Set reminders for ${t}`);
  }

  if (/reflection.*sunday|weekly reflection/.test(lower)) {
    patches.motivation = [profile.motivation, 'Weekly reflection every Sunday'].filter(Boolean).join('\n');
    changes.push('Add weekly Sunday reflection');
  }

  if (/swap.*tuesday.*thursday|swap tue.*thu|switch tuesday and thursday/.test(lower)) {
    patches.weeklyPlan = swapWeekdays({ ...basePlan }, 2, 4);
    changes.push('Swap Tuesday and Thursday');
  }

  if (/remove wednesday|drop wednesday|no wednesday|skip wednesday/.test(lower)) {
    const next = { ...basePlan };
    delete next[3];
    patches.weeklyPlan = next;
    patches.availableDays = (profile.availableDays || Object.keys(basePlan).map(Number)).filter((d) => d !== 3);
    changes.push(`Remove Wednesday ${sessionTerm}`);
  }

  if (/only.*weekday|weekdays only/.test(lower) && category !== 'fitness') {
    patches.availableDays = [1, 2, 3, 4, 5];
    changes.push(`${sessionTerm}s on weekdays only`);
  }

  return { patches, changes };
}

function interpretFitness(text, lower, profile, basePlan) {
  const patches = {};
  const changes = [];
  let requiresGoalConfirm = false;

  if (/recovery.*weekend|weekend.*recovery|rest.*weekend|move recovery/.test(lower)) {
    patches.weeklyPlan = getDefaultWeeklyPlanForCategory('fitness');
    patches.availableDays = [0, 1, 2, 3, 4, 5, 6];
    changes.push('Mon–Fri workouts, Sat–Sun Rest & Recovery');
  }

  if (/add.*workout.*friday|another workout.*friday/.test(lower)) {
    const next = { ...basePlan };
    next[5] = { type: 'workout', label: 'Workout', time: next[5]?.time || '06:00' };
    patches.weeklyPlan = next;
    patches.availableDays = [0, 1, 2, 3, 4, 5, 6];
    changes.push('Add a workout on Friday');
  }

  if (/more stretch|add stretch|stretching/.test(lower)) {
    patches.goal = [profile.goal, 'Include more stretching & mobility'].filter(Boolean).join('\n');
    requiresGoalConfirm = true;
    changes.push('Add stretching emphasis');
  }

  if (/muscle gain|build muscle|strength|get stronger|bulk/.test(lower)) {
    patches.goal = 'Build muscle & strength';
    patches.successLooksLike = profile.successLooksLike || 'Visible strength gains and consistent training';
    requiresGoalConfirm = true;
    changes.push('Update goal to muscle gain');
  }

  if (/weight loss|lose weight|fat loss|cut down|slim down|burn fat/.test(lower)) {
    patches.goal = 'Lose weight / body fat';
    requiresGoalConfirm = true;
    changes.push('Update goal to weight loss');
  }

  if (/replace running|cycling instead|swap running/.test(lower)) {
    patches.goal = [profile.goal, 'Replace running with cycling'].filter(Boolean).join('\n');
    requiresGoalConfirm = true;
    changes.push('Swap running for cycling');
  }

  if (/more cardio|add cardio/.test(lower)) {
    patches.goal = [profile.goal, 'Include more cardio sessions'].filter(Boolean).join('\n');
    requiresGoalConfirm = true;
    changes.push('Add cardio emphasis');
  }

  if (/deload|every fourth week|every 4th week/.test(lower)) {
    patches.motivation = [profile.motivation, 'Deload week every fourth week'].filter(Boolean).join('\n');
    changes.push('Schedule a deload week every fourth week');
  }

  if (/increase intensity|harder|after week 4|week 4/.test(lower)) {
    patches.motivation = [profile.motivation, 'Progressive intensity increase after Week 4'].filter(Boolean).join('\n');
    changes.push('Progressive intensity after Week 4');
  }

  if (/reduce workout|fewer workout|less workout|five days to three|5 days to 3/.test(lower)) {
    patches.availableDays = [1, 3, 5, 6, 0];
    patches.weeklyPlan = buildPlanWithActiveDays(basePlan, [1, 3, 5], 'Workout', 'Rest & Recovery');
    changes.push('Reduce workouts to Mon / Wed / Fri with weekend recovery');
  }

  if (/move my workouts to monday.*wednesday.*friday|workout.*mon.*wed.*fri/.test(lower)) {
    patches.availableDays = [1, 3, 5, 6, 0];
    patches.weeklyPlan = buildPlanWithActiveDays(basePlan, [1, 3, 5], 'Workout', 'Rest & Recovery');
    changes.push('Workouts on Monday, Wednesday, and Friday');
  }

  return { patches, changes, requiresGoalConfirm };
}

function interpretReading(text, lower, profile, basePlan) {
  const patches = {};
  const changes = [];
  let requiresGoalConfirm = false;

  if (/(\d+)\s*pages/.test(lower)) {
    const pages = lower.match(/(\d+)\s*pages/)?.[1];
    patches.goal = [profile.goal, `Read ${pages} pages daily`].filter(Boolean).join('\n');
    requiresGoalConfirm = true;
    changes.push(`Set reading target to ${pages} pages per day`);
  }

  if (/increase.*reading|more reading|read more/.test(lower)) {
    patches.goal = [profile.goal, 'Increase daily reading volume'].filter(Boolean).join('\n');
    requiresGoalConfirm = true;
    changes.push('Increase reading target');
  }

  if (/reading.*evening|read.*night|move.*reading|evening reading/.test(lower)) {
    patches.preferredTimes = ['evening'];
    patches.weeklyPlan = applyTimeToAll(basePlan, parseTime(text) || '19:00');
    changes.push('Move reading sessions to evenings');
  }

  if (/morning reading|read in the morning/.test(lower)) {
    patches.preferredTimes = ['morning'];
    patches.weeklyPlan = applyTimeToAll(basePlan, parseTime(text) || '07:00');
    changes.push('Move reading sessions to mornings');
  }

  if (/(\d+)\s*books?|finish.*books?/.test(lower)) {
    const n = lower.match(/(\d+)\s*books?/)?.[1];
    if (n) {
      patches.goal = [profile.goal, `Finish ${n} books this journey`].filter(Boolean).join('\n');
      requiresGoalConfirm = true;
      changes.push(`Target: ${n} books`);
    }
  }

  if (/genre|nonfiction|fiction/.test(lower)) {
    patches.motivation = [profile.motivation, text].filter(Boolean).join('\n');
    changes.push('Update reading focus');
  }

  return { patches, changes, requiresGoalConfirm };
}

function interpretFaith(text, lower, profile, basePlan) {
  const patches = {};
  const changes = [];
  let requiresGoalConfirm = false;

  if (/daily devotional|devotional every|morning devotional/.test(lower)) {
    patches.weeklyPlan = applyTimeToAll(
      getDefaultWeeklyPlanForCategory('faith'),
      parseTime(text) || '07:00'
    );
    patches.availableDays = [0, 1, 2, 3, 4, 5, 6];
    changes.push('Daily devotional schedule');
  }

  if (/sunday.*prayer|prayer.*sunday|prayer and reflection/.test(lower)) {
    const next = { ...basePlan };
    next[0] = { type: 'recovery', label: 'Prayer & Reflection', time: parseTime(text) || '09:00' };
    patches.weeklyPlan = next;
    changes.push('Sunday prayer and reflection');
  }

  if (/memorize|memory verse|verse per week/.test(lower)) {
    patches.goal = [profile.goal, 'Memorize one verse per week'].filter(Boolean).join('\n');
    requiresGoalConfirm = true;
    changes.push('Add weekly verse memorization');
  }

  if (/scripture|bible reading|read.*chapter/.test(lower)) {
    patches.goal = [profile.goal, 'Consistent daily scripture reading'].filter(Boolean).join('\n');
    requiresGoalConfirm = true;
    changes.push('Emphasize daily scripture reading');
  }

  if (/evening study|study.*evening|move.*devotional/.test(lower)) {
    patches.preferredTimes = ['evening'];
    patches.weeklyPlan = applyTimeToAll(basePlan, parseTime(text) || '19:00');
    changes.push('Move study sessions to evenings');
  }

  return { patches, changes, requiresGoalConfirm };
}

function interpretLearning(text, lower, profile, basePlan) {
  const patches = {};
  const changes = [];
  let requiresGoalConfirm = false;

  if (/saturday project|project.*saturday|weekend project/.test(lower)) {
    const next = { ...getDefaultWeeklyPlanForCategory('learning') };
    next[6] = { type: 'learning', label: 'Project work', time: parseTime(text) || '10:00' };
    patches.weeklyPlan = next;
    changes.push('Saturday project sessions');
  }

  if (/weekday.*evening|study.*evening|evening study/.test(lower)) {
    patches.preferredTimes = ['evening'];
    patches.weeklyPlan = applyTimeToAll(basePlan, parseTime(text) || '18:00');
    changes.push('Weekday evening study sessions');
  }

  if (/weekly revision|revision.*sunday|review on sunday/.test(lower)) {
    const next = { ...basePlan };
    next[0] = { type: 'recovery', label: 'Weekly revision', time: parseTime(text) || '11:00' };
    patches.weeklyPlan = next;
    changes.push('Sunday weekly revision');
  }

  if (/practice|drill|exercise/.test(lower)) {
    patches.goal = [profile.goal, 'Include daily practice sessions'].filter(Boolean).join('\n');
    requiresGoalConfirm = true;
    changes.push('Add daily practice');
  }

  if (/deadline|milestone|week \d/.test(lower)) {
    patches.motivation = [profile.motivation, text].filter(Boolean).join('\n');
    changes.push('Update learning milestones');
  }

  return { patches, changes, requiresGoalConfirm };
}

function interpretBusiness(text, lower, profile, basePlan) {
  const patches = {};
  const changes = [];
  let requiresGoalConfirm = false;

  if (/monday planning|planning.*monday|weekly planning/.test(lower)) {
    const next = { ...getDefaultWeeklyPlanForCategory('business') };
    next[1] = { type: 'custom', label: 'Planning', time: parseTime(text) || '09:00' };
    patches.weeklyPlan = next;
    changes.push('Monday planning sessions');
  }

  if (/execution|deliverable|tue.*fri|weekday execution/.test(lower)) {
    const next = { ...basePlan };
    [2, 3, 4, 5].forEach((d) => {
      next[d] = { type: 'custom', label: 'Execution', time: parseTime(text) || '09:00' };
    });
    patches.weeklyPlan = next;
    changes.push('Execution blocks Tue–Fri');
  }

  if (/weekly review|review.*sunday|sunday review/.test(lower)) {
    const next = { ...basePlan };
    next[0] = { type: 'recovery', label: 'Weekly review', time: parseTime(text) || '18:00' };
    patches.weeklyPlan = next;
    changes.push('Sunday weekly review');
  }

  if (/meeting|networking|client/.test(lower)) {
    patches.goal = [profile.goal, text].filter(Boolean).join('\n');
    requiresGoalConfirm = true;
    changes.push('Update business goals');
  }

  if (/milestone|launch|revenue target/.test(lower)) {
    patches.successLooksLike = [profile.successLooksLike, text].filter(Boolean).join('\n');
    requiresGoalConfirm = true;
    changes.push('Update business milestones');
  }

  return { patches, changes, requiresGoalConfirm };
}

function interpretMeditation(text, lower, profile, basePlan) {
  const patches = {};
  const changes = [];
  let requiresGoalConfirm = false;

  if (/morning meditation|meditate.*morning|daily meditation/.test(lower)) {
    patches.weeklyPlan = applyTimeToAll(
      getDefaultWeeklyPlanForCategory('meditation'),
      parseTime(text) || '07:00'
    );
    patches.availableDays = [0, 1, 2, 3, 4, 5, 6];
    changes.push('Daily morning meditation');
  }

  if (/breathing|breath work|breathwork/.test(lower)) {
    patches.goal = [profile.goal, 'Include daily breathing exercises'].filter(Boolean).join('\n');
    requiresGoalConfirm = true;
    changes.push('Add breathing exercises');
  }

  if (/evening.*meditat|meditat.*evening|mindfulness.*evening/.test(lower)) {
    patches.preferredTimes = ['evening'];
    patches.weeklyPlan = applyTimeToAll(basePlan, parseTime(text) || '20:00');
    changes.push('Evening mindfulness sessions');
  }

  if (/(\d+)\s*min/.test(lower)) {
    const mins = lower.match(/(\d+)\s*min/)?.[1];
    patches.timeAvailable = `${mins} minutes daily`;
    changes.push(`Meditate for ${mins} minutes daily`);
  }

  return { patches, changes, requiresGoalConfirm };
}

function interpretWriting(text, lower, profile, basePlan) {
  const patches = {};
  const changes = [];
  let requiresGoalConfirm = false;

  if (/(\d+)\s*words|word target|words per day/.test(lower)) {
    const words = lower.match(/(\d+)\s*words?/)?.[1];
    if (words) {
      patches.goal = [profile.goal, `Write ${words} words daily`].filter(Boolean).join('\n');
      requiresGoalConfirm = true;
      changes.push(`Daily word target: ${words}`);
    }
  }

  if (/writing.*evening|write.*evening|evening writing/.test(lower)) {
    patches.preferredTimes = ['evening'];
    patches.weeklyPlan = applyTimeToAll(basePlan, parseTime(text) || '19:00');
    changes.push('Evening writing sessions');
  }

  if (/weekend edit|editing.*weekend|sat.*edit/.test(lower)) {
    const next = { ...getDefaultWeeklyPlanForCategory('writing') };
    patches.weeklyPlan = next;
    changes.push('Weekend editing blocks');
  }

  if (/journal|journaling/.test(lower)) {
    patches.motivation = [profile.motivation, 'Weekly journaling on Sundays'].filter(Boolean).join('\n');
    changes.push('Add Sunday journaling');
  }

  return { patches, changes, requiresGoalConfirm };
}

const CATEGORY_INTERPRETERS = {
  fitness: interpretFitness,
  reading: interpretReading,
  faith: interpretFaith,
  learning: interpretLearning,
  business: interpretBusiness,
  meditation: interpretMeditation,
  writing: interpretWriting,
};

function mergeResults(...results) {
  const patches = {};
  const changes = [];
  let requiresGoalConfirm = false;
  let _needsTimeTarget = false;
  results.forEach((r) => {
    Object.assign(patches, r.patches);
    changes.push(...(r.changes || []));
    if (r.requiresGoalConfirm) requiresGoalConfirm = true;
    if (r._needsTimeTarget) _needsTimeTarget = true;
  });
  return { patches, changes, requiresGoalConfirm, _needsTimeTarget };
}

/**
 * Interpret a prompt scoped to a single journey instance.
 * @param {string} prompt
 * @param {string} journeyId — required; patches apply ONLY to this journey
 * @param {import('./journeySetup.js').JourneySetupProfile} [profileOverride]
 * @returns {AIPlanSuggestion|null}
 */
export function interpretJourneyPrompt(prompt, journeyId, profileOverride = null) {
  if (!journeyId) {
    throw new Error('interpretJourneyPrompt requires a journeyId for scoped editing');
  }

  const text = normalizePrompt(prompt);
  if (!text) return null;

  const ctx = resolveJourneyAIContext(journeyId);
  const profile = profileOverride ?? getJourneySetup(journeyId);
  const basePlan = getWeeklyPlan(journeyId);
  const lower = toLower(text);

  const unsupportedMsg = detectUnsupportedRequest(lower, ctx);
  if (unsupportedMsg) {
    return {
      summary: unsupportedMsg,
      patches: {},
      confidence: 'low',
      status: 'unsupported',
      scopedTo: journeyId,
      suggestions: ctx.fallbackHints.slice(0, 3),
    };
  }

  const offTopic = detectOffTopicOrQuestion(lower);
  if (offTopic) {
    return {
      summary: offTopic.message,
      patches: {},
      confidence: 'low',
      status: offTopic.type === 'chat' ? 'info' : 'unclear',
      scopedTo: journeyId,
      suggestions: ctx.examplePrompts.slice(0, 3),
    };
  }

  const foreign = detectCrossJourneyIntent(text, ctx.category);
  if (foreign && foreign !== ctx.category) {
    const foreignLabel = AI_PERSONAS[foreign]?.coachLabel || foreign;
    return {
      summary: `That sounds like something for a ${foreignLabel.toLowerCase()}, not "${ctx.journeyTitle}". I'm scoped to this journey only — rephrase for your ${ctx.coachLabel.toLowerCase()} here, or open the other journey to edit it.`,
      patches: {},
      confidence: 'low',
      status: 'unsupported',
      scopedTo: journeyId,
      suggestions: ctx.fallbackHints.slice(0, 3),
    };
  }

  const common = interpretCommonSchedule(text, lower, profile, ctx, basePlan);
  const universalGoals = interpretUniversalGoals(text, lower, profile, ctx);
  const specificFn = CATEGORY_INTERPRETERS[ctx.category];
  const specific = specificFn ? specificFn(text, lower, profile, basePlan) : { patches: {}, changes: [], requiresGoalConfirm: false };

  const { patches, changes, requiresGoalConfirm, _needsTimeTarget } = mergeResults(common, universalGoals, specific);

  const meaningfulPatchKeys = Object.keys(patches).filter((k) => k !== 'smartNotes');
  const hasActionablePatches = meaningfulPatchKeys.length > 0;

  if (_needsTimeTarget) {
    return {
      summary: 'I can clear times for specific days — which days should be flexible? For example: "Remove times on Saturday and Sunday".',
      patches: {},
      confidence: 'low',
      status: 'unclear',
      scopedTo: journeyId,
      suggestions: ['Remove times on Saturday and Sunday', 'Clear recovery day times', 'Move workouts to 6 AM'],
    };
  }

  if (!hasActionablePatches) {
    const score = computeUnderstandingScore(changes, lower);
    const hints = ctx.fallbackHints.slice(0, 3);

    if (score >= 0.3) {
      return {
        summary: `I understand you want to adjust something in "${ctx.journeyTitle}", but I need a bit more detail. What specifically should change — which days, what time, or which goal?`,
        patches: {},
        confidence: 'low',
        status: 'unclear',
        scopedTo: journeyId,
        suggestions: hints,
      };
    }

    return {
      summary: `I'm not able to apply that request directly. I can help with your weekly schedule, session times, goals, and reminders for "${ctx.journeyTitle}" only.`,
      patches: {},
      confidence: 'low',
      status: 'unsupported',
      scopedTo: journeyId,
      suggestions: hints,
    };
  }

  return {
    summary: changes.length > 0
      ? `Here's what I'll update for "${ctx.journeyTitle}": ${changes.join('. ')}.`
      : `Ready to apply your changes to "${ctx.journeyTitle}".`,
    patches,
    confidence: changes.length > 1 ? 'high' : 'medium',
    status: 'ready',
    requiresGoalConfirm,
    scopedTo: journeyId,
  };
}

export function formatPatchPreview(patches, journeyId) {
  const ctx = journeyId ? resolveJourneyAIContext(journeyId) : null;
  const lines = [];
  if (patches.availableDays) {
    lines.push(`Days: ${patches.availableDays.map((d) => WEEKDAY_FULL[d]).join(', ')}`);
  }
  if (patches.weeklyPlan) {
    Object.entries(patches.weeklyPlan).forEach(([d, act]) => {
      const timeLabel = act.time ? ` @ ${act.time}` : ' (flexible)';
      lines.push(`${WEEKDAY_FULL[Number(d)]}: ${act.label}${timeLabel}`);
    });
  }
  if (patches.goal) lines.push(`Goal: ${String(patches.goal).split('\n')[0]}`);
  if (patches.timeAvailable) lines.push(`Time: ${patches.timeAvailable}`);
  if (ctx) lines.push(`Scope: ${ctx.journeyTitle} only`);
  return lines;
}

function formatDays(days) {
  if (!days?.length) return '—';
  return days.map((d) => WEEKDAY_FULL[d]).join(', ');
}

function formatWeeklyPlan(plan) {
  if (!plan || !Object.keys(plan).length) return '—';
  return Object.entries(plan)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([d, act]) => `${WEEKDAY_FULL[Number(d)]}: ${act.label}${act.time ? ` @ ${act.time}` : ''}`)
    .join('\n');
}

/**
 * Build before/after diff items for the review modal.
 */
export function buildChangeDiff(before, patches, journeyId) {
  const items = [];
  const currentPlan = getWeeklyPlan(journeyId);

  const textFields = [
    ['goal', 'Goals'],
    ['whyImportant', 'Why this matters'],
    ['successLooksLike', 'Success looks like'],
    ['motivation', 'Motivation'],
    ['timeAvailable', 'Daily time'],
  ];

  textFields.forEach(([key, label]) => {
    if (patches[key] !== undefined && patches[key] !== before[key]) {
      items.push({
        label,
        before: before[key]?.trim() || '—',
        after: String(patches[key]).trim() || '—',
      });
    }
  });

  if (patches.availableDays) {
    items.push({
      label: 'Active days',
      before: formatDays(before.availableDays),
      after: formatDays(patches.availableDays),
    });
  }

  if (patches.preferredTimes) {
    items.push({
      label: 'Preferred times',
      before: (before.preferredTimes || []).join(', ') || '—',
      after: patches.preferredTimes.join(', '),
    });
  }

  if (patches.weeklyPlan) {
    items.push({
      label: 'Weekly schedule',
      before: formatWeeklyPlan(currentPlan),
      after: formatWeeklyPlan(patches.weeklyPlan),
    });
  }

  if (patches.remindersEnabled !== undefined && patches.remindersEnabled !== before.remindersEnabled) {
    items.push({
      label: 'Reminders',
      before: before.remindersEnabled ? 'Enabled' : 'Disabled',
      after: patches.remindersEnabled ? 'Enabled' : 'Disabled',
    });
  }

  return items;
}

export { resolveJourneyAIContext, loadJourneyAIScope };
