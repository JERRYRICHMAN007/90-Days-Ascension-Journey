import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import { Button } from '../ui/button';
import {
  TOUR_STEPS,
  advanceProductTour,
  completeProductTour,
  findStepIndexForPath,
  getProductTourState,
  setProductTourStep,
  shouldAutoStartTour,
  skipProductTour,
  startProductTour,
  subscribeProductTour,
} from '../../utils/productTour.js';

const PAD = 10;

function measureTarget(selector) {
  if (!selector || typeof document === 'undefined') return null;
  const el = document.querySelector(selector);
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  if (rect.width < 2 && rect.height < 2) return null;
  return {
    top: Math.max(0, rect.top - PAD),
    left: Math.max(0, rect.left - PAD),
    width: rect.width + PAD * 2,
    height: rect.height + PAD * 2,
    bottom: rect.bottom + PAD,
    prefersAbove: rect.top > window.innerHeight * 0.55,
  };
}

function focusTarget(selector) {
  if (!selector || typeof document === 'undefined') return;
  const root = document.querySelector(selector);
  if (!root) return;
  const focusable = root.matches('input, textarea, select, button, a, [tabindex]:not([tabindex="-1"])')
    ? root
    : root.querySelector('input, textarea, select, button, a, [tabindex]:not([tabindex="-1"])');
  if (typeof focusable?.focus === 'function') {
    focusable.focus({ preventScroll: true });
  }
}

export function ProductTour() {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState(getProductTourState);
  const [spot, setSpot] = useState(null);

  useEffect(() => subscribeProductTour(setState), []);

  useEffect(() => {
    if (shouldAutoStartTour() && location.pathname === '/dashboard') {
      startProductTour();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (state.status !== 'active') return;
    const current = TOUR_STEPS[state.step];
    if (current?.match(location.pathname)) return;
    const aligned = findStepIndexForPath(location.pathname, state.step);
    if (aligned >= 0 && aligned !== state.step) setProductTourStep(aligned);
  }, [location.pathname, state.status, state.step]);

  const stepDef = TOUR_STEPS[state.step] || null;
  const onMatchingRoute = Boolean(stepDef?.match(location.pathname));
  const active = state.status === 'active' && onMatchingRoute && stepDef;

  const refreshSpot = useCallback(() => {
    if (!active) {
      setSpot(null);
      return;
    }
    setSpot(measureTarget(stepDef.target));
  }, [active, stepDef]);

  useLayoutEffect(() => {
    refreshSpot();
    if (!active || !stepDef?.target) return undefined;
    const el = document.querySelector(stepDef.target);
    el?.scrollIntoView({ block: 'center', behavior: 'smooth', inline: 'nearest' });
    const t = window.setTimeout(() => {
      refreshSpot();
      focusTarget(stepDef.target);
    }, 280);
    window.addEventListener('resize', refreshSpot);
    window.addEventListener('scroll', refreshSpot, true);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', refreshSpot);
      window.removeEventListener('scroll', refreshSpot, true);
    };
  }, [active, stepDef, refreshSpot, location.pathname]);

  const goNext = () => {
    const current = getProductTourState();
    if (current.step >= TOUR_STEPS.length - 1) {
      completeProductTour();
      return;
    }
    const nextIndex = current.step + 1;
    const fromStep = TOUR_STEPS[current.step];
    if (fromStep?.navigateTo) {
      setProductTourStep(nextIndex);
      navigate(fromStep.navigateTo);
      return;
    }
    advanceProductTour();
  };

  if (!active || typeof document === 'undefined') return null;

  const isLast = state.step >= TOUR_STEPS.length - 1;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 400;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const tooltipStyle = spot
    ? {
        top: spot.prefersAbove ? undefined : Math.min(spot.bottom + 12, vh - 200),
        bottom: spot.prefersAbove ? vh - spot.top + 12 : undefined,
        left: Math.min(Math.max(16, spot.left), vw - 340),
      }
    : {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };

  const dim = 'pointer-events-auto bg-black/60';

  return createPortal(
    <div
      className="fixed inset-0 z-[220] pointer-events-none"
      role="region"
      aria-label="Product tour"
    >
      {spot ? (
        <>
          <div className={`absolute left-0 right-0 top-0 ${dim}`} style={{ height: spot.top }} />
          <div
            className={`absolute left-0 ${dim}`}
            style={{ top: spot.top, height: spot.height, width: spot.left }}
          />
          <div
            className={`absolute ${dim}`}
            style={{
              top: spot.top,
              left: spot.left + spot.width,
              height: spot.height,
              right: 0,
            }}
          />
          <div
            className={`absolute left-0 right-0 bottom-0 ${dim}`}
            style={{ top: spot.top + spot.height }}
          />
          <div
            className="absolute rounded-xl ring-2 ring-[var(--neon-green)] pointer-events-none"
            style={{
              top: spot.top,
              left: spot.left,
              width: spot.width,
              height: spot.height,
              boxShadow: '0 0 0 4px rgba(110,231,183,0.25)',
            }}
          />
        </>
      ) : (
        <div className={`absolute inset-0 ${dim}`} />
      )}

      <div
        className="absolute pointer-events-auto w-[min(100%-2rem,22rem)] rounded-2xl border p-4 shadow-2xl z-10"
        style={{
          ...tooltipStyle,
          background: 'var(--bg-card)',
          borderColor: 'rgba(110,231,183,0.35)',
        }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--neon-green)] flex items-center gap-1">
            <Sparkles className="size-3" />
            Step {state.step + 1} of {TOUR_STEPS.length}
          </p>
          <button
            type="button"
            onClick={skipProductTour}
            className="p-1 rounded-full hover:bg-[var(--surface-hover)]"
            aria-label="Skip tour"
          >
            <X className="size-4 text-[var(--text-secondary)]" />
          </button>
        </div>
        <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">{stepDef.title}</h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">{stepDef.body}</p>
        <div className="flex items-center gap-2 mt-4">
          <button
            type="button"
            onClick={skipProductTour}
            className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Skip guide
          </button>
          <div className="flex-1" />
          <Button
            size="sm"
            className="rounded-full font-bold"
            style={{ background: 'var(--neon-green)', color: '#0a0a0a' }}
            onClick={goNext}
          >
            {isLast ? 'Finish' : stepDef.primary || 'Next'}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
