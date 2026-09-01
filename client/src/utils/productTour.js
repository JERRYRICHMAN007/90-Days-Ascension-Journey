import { STORAGE_KEYS } from './storageKeys.js';

const EVENT = 'product-tour-updated';

/** @typedef {{ status: 'idle'|'active'|'done'|'skipped', step: number }} ProductTourState */

export const TOUR_STEPS = [
  {
    id: 'welcome',
    match: (path) => path === '/dashboard',
    target: null,
    title: 'Welcome to Aether',
    body: 'A journey is a daily practice you stick with — like learning Spanish. We’ll point at each tap. Skip anytime; you can replay this from Settings.',
    primary: 'Show me around',
  },
  {
    id: 'create',
    match: (path) => path === '/dashboard',
    target: '[data-tour="create-journey"]',
    title: 'Start here',
    body: 'Tap New Journey to add your own path, or to pick a ready-made one.',
    primary: 'Next',
    navigateTo: '/dashboard/create-journey',
  },
  {
    id: 'name',
    match: (path) => path === '/dashboard/create-journey',
    target: '[data-tour="journey-name"]',
    title: 'Name it',
    body: 'Give it a real name — “Learning Spanish”, “Morning piano”, whatever you are actually doing.',
    primary: 'Next',
  },
  {
    id: 'kind',
    match: (path) => path === '/dashboard/create-journey',
    target: '[data-tour="journey-kind"]',
    title: 'Your own, or a template',
    body: 'Choose Build my own for something like Spanish. Ready-made paths (fitness, reading, code) already have a plan you can still edit later.',
    primary: 'Next',
  },
  {
    id: 'create-btn',
    match: (path) => path === '/dashboard/create-journey',
    target: '[data-tour="create-submit"]',
    title: 'Create it',
    body: 'When the name looks right, tap this. We’ll take you to the journey so you can set days and times.',
    primary: 'Got it',
  },
  {
    id: 'rhythm',
    match: (path) => path.startsWith('/journey/'),
    target: '[data-tour="days-times"]',
    title: 'Days & times',
    body: 'Tap the days this happens. Name the sessions (they should match this journey, not someone else’s plan) and set a time. You can change all of this later.',
    primary: 'Next',
  },
  {
    id: 'start',
    match: (path) => path.startsWith('/journey/'),
    target: '[data-tour="start-journey"]',
    title: 'Start when you’re ready',
    body: 'Pick a start date, then press Start Journey. Progress only begins after you start.',
    primary: 'Next',
  },
  {
    id: 'customize',
    match: (path) => path.startsWith('/journey/'),
    target: '[data-tour="customize-journey"]',
    title: 'Customize anytime',
    body: 'After it’s created — even after you start — tap Customize to change days, times, tasks, and goals.',
    primary: 'Finish',
  },
];

function readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCT_TOUR);
    if (!raw) return { status: 'idle', step: 0 };
    const parsed = JSON.parse(raw);
    return {
      status: parsed.status || 'idle',
      step: Number.isFinite(parsed.step) ? parsed.step : 0,
    };
  } catch {
    return { status: 'idle', step: 0 };
  }
}

function writeState(next) {
  localStorage.setItem(STORAGE_KEYS.PRODUCT_TOUR, JSON.stringify(next));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
  }
  return next;
}

export function getProductTourState() {
  return readState();
}

export function startProductTour() {
  return writeState({ status: 'active', step: 0 });
}

export function skipProductTour() {
  return writeState({ status: 'skipped', step: 0 });
}

export function completeProductTour() {
  return writeState({ status: 'done', step: TOUR_STEPS.length - 1 });
}

export function setProductTourStep(step) {
  const max = TOUR_STEPS.length - 1;
  const next = Math.max(0, Math.min(max, step));
  return writeState({ status: 'active', step: next });
}

export function advanceProductTour() {
  const { step } = readState();
  if (step >= TOUR_STEPS.length - 1) return completeProductTour();
  return setProductTourStep(step + 1);
}

export function restartProductTour() {
  return startProductTour();
}

export function shouldAutoStartTour() {
  const { status } = readState();
  return status === 'idle';
}

export function subscribeProductTour(callback) {
  const handler = () => callback(readState());
  window.addEventListener(EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export function stepForPath(stepIndex, pathname) {
  const step = TOUR_STEPS[stepIndex];
  if (!step) return null;
  if (step.match(pathname)) return step;
  return null;
}

export function findStepIndexForPath(pathname, fromIndex = 0) {
  for (let i = fromIndex; i < TOUR_STEPS.length; i += 1) {
    if (TOUR_STEPS[i].match(pathname)) return i;
  }
  for (let i = 0; i < fromIndex; i += 1) {
    if (TOUR_STEPS[i].match(pathname)) return i;
  }
  return -1;
}
