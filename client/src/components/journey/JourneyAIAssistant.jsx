import { useMemo, useState, useEffect } from 'react';
import { Wand2, Check, Sparkles, Shield, Undo2, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { GoalChangeConfirmDialog } from './GoalChangeConfirmDialog.jsx';
import {
  interpretJourneyPrompt,
  formatPatchPreview,
  resolveJourneyAIContext,
} from '../../utils/journeyAIAssistant.js';
import { AI_ASSISTANT_LIMITS } from '../../utils/journeyAIContext.js';
import {
  applyJourneyPatches,
  wouldIncurGoalPenalty,
  GOAL_CHANGE_XP_PENALTY,
  getJourneySetup,
  captureJourneyStateForUndo,
  restoreJourneyStateFromUndo,
} from '../../utils/journeySetup.js';
import { useGamification } from '../../hooks/useGamification.js';

/**
 * Natural-language journey plan editor — scoped to a single journey instance.
 */
export function JourneyAIAssistant({ journeyId, profile: profileProp, accentColor = '#6ee7b7', onApplied }) {
  const [prompt, setPrompt] = useState('');
  const [suggestion, setSuggestion] = useState(null);
  const [lastInterpretedPrompt, setLastInterpretedPrompt] = useState('');
  const [goalConfirmOpen, setGoalConfirmOpen] = useState(false);
  const [appliedMsg, setAppliedMsg] = useState(false);
  const [undoSnapshot, setUndoSnapshot] = useState(null);
  const [undoMsg, setUndoMsg] = useState(false);
  const [tick, setTick] = useState(0);
  const { addXP } = useGamification();

  const context = useMemo(() => resolveJourneyAIContext(journeyId), [journeyId]);
  const profile = useMemo(
    () => getJourneySetup(journeyId) || profileProp || {},
    [journeyId, profileProp, tick]
  );

  useEffect(() => {
    const refresh = (e) => {
      if (!e.detail?.journeyId || e.detail.journeyId === journeyId) setTick((t) => t + 1);
    };
    window.addEventListener('journey-setup-updated', refresh);
    return () => window.removeEventListener('journey-setup-updated', refresh);
  }, [journeyId]);

  useEffect(() => {
    if (!appliedMsg) return;
    const t = window.setTimeout(() => setAppliedMsg(false), 2500);
    return () => clearTimeout(t);
  }, [appliedMsg]);

  useEffect(() => {
    if (!undoMsg) return;
    const t = window.setTimeout(() => setUndoMsg(false), 2500);
    return () => clearTimeout(t);
  }, [undoMsg]);

  const interpretCurrentPrompt = () => {
    const trimmed = prompt.trim();
    if (!trimmed) return null;
    const result = interpretJourneyPrompt(trimmed, journeyId, profile);
    setSuggestion(result);
    setLastInterpretedPrompt(trimmed);
    return result;
  };

  const ensureSuggestion = () => {
    if (suggestion && lastInterpretedPrompt === prompt.trim()) return suggestion;
    return interpretCurrentPrompt();
  };

  const applyPatches = (snapshot) => {
    if (!suggestion?.patches || Object.keys(suggestion.patches).length === 0) return;
    if (wouldIncurGoalPenalty(journeyId, suggestion.patches)) {
      addXP?.(-GOAL_CHANGE_XP_PENALTY, journeyId);
    }
    applyJourneyPatches(journeyId, suggestion.patches);
    setUndoSnapshot(snapshot);
    setSuggestion(null);
    setPrompt('');
    setLastInterpretedPrompt('');
    setAppliedMsg(true);
    setTick((t) => t + 1);
    onApplied?.();
  };

  const handleApply = () => {
    const current = ensureSuggestion();
    if (!current || current.status !== 'ready') return;
    if (!current.patches || Object.keys(current.patches).length === 0) return;
    if (wouldIncurGoalPenalty(journeyId, current.patches)) {
      setGoalConfirmOpen(true);
      return;
    }
    applyPatches(captureJourneyStateForUndo(journeyId));
  };

  const handleUndo = () => {
    if (!undoSnapshot) return;
    const restored = restoreJourneyStateFromUndo(journeyId, undoSnapshot);
    if (restored) {
      setUndoSnapshot(null);
      setUndoMsg(true);
      setTick((t) => t + 1);
      onApplied?.();
    }
  };

  const previewLines = suggestion?.patches ? formatPatchPreview(suggestion.patches, journeyId) : [];
  const canApply = suggestion?.status === 'ready' && suggestion?.patches && Object.keys(suggestion.patches).length > 0;
  const responseStatus = suggestion?.status || 'ready';

  return (
    <>
      <GoalChangeConfirmDialog
        open={goalConfirmOpen}
        onConfirm={() => {
          setGoalConfirmOpen(false);
          applyPatches(captureJourneyStateForUndo(journeyId));
        }}
        onCancel={() => setGoalConfirmOpen(false)}
        accentColor={accentColor}
      />
      <div className="rounded-xl border border-dashed border-[var(--border-subtle)] p-3 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Wand2 className="size-3.5 shrink-0" style={{ color: accentColor }} />
            <div className="min-w-0">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                AI planning assistant
              </h3>
              <p className="text-[10px] font-medium truncate" style={{ color: accentColor }}>
                {context.coachLabel} · {context.journeyTitle}
              </p>
            </div>
          </div>
          <span
            className="flex items-center gap-0.5 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full shrink-0"
            style={{ background: 'rgba(110,231,183,0.1)', color: accentColor }}
          >
            <Shield className="size-2.5" />
            Scoped
          </span>
        </div>
        <p className="text-[11px] text-[var(--text-secondary)] leading-snug">{context.description}</p>

        <details className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)]/30 text-[10px] group">
          <summary className="cursor-pointer px-2.5 py-1.5 font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] list-none flex items-center justify-between gap-2">
            <span>What I can & can&apos;t do</span>
            <span className="text-[9px] opacity-60 group-open:rotate-180 transition-transform">▾</span>
          </summary>
          <div className="px-2.5 pb-2.5 space-y-2 border-t border-[var(--border-subtle)] pt-2">
            <div>
              <p className="font-semibold text-[var(--text-secondary)] mb-1">I can help with</p>
              <ul className="space-y-0.5 text-[var(--text-muted)]">
                {AI_ASSISTANT_LIMITS.can.map((item) => (
                  <li key={item} className="flex gap-1.5">
                    <span style={{ color: accentColor }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[var(--text-secondary)] mb-1">Not yet supported</p>
              <ul className="space-y-0.5 text-[var(--text-muted)]">
                {AI_ASSISTANT_LIMITS.cannot.map((item) => (
                  <li key={item} className="flex gap-1.5">
                    <span className="text-[var(--text-muted)]">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[var(--text-muted)] italic leading-snug pt-0.5">{AI_ASSISTANT_LIMITS.evolving}</p>
          </div>
        </details>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={context.placeholder}
          rows={2}
          className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-2.5 py-1.5 text-sm text-[var(--text-primary)] resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleApply();
          }}
        />
        <div className="flex flex-wrap gap-1">
          {context.examplePrompts.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setPrompt(ex)}
              className="text-[9px] px-1.5 py-0.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              {ex}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            size="sm"
            className="rounded-full text-[10px] h-7"
            style={{ background: accentColor, color: '#0a0a0a' }}
            onClick={handleApply}
            disabled={!prompt.trim()}
          >
            <Check className="size-3 mr-1" /> Apply changes
          </Button>
          {undoSnapshot && (
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full text-[10px] h-7 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              onClick={handleUndo}
            >
              <Undo2 className="size-3 mr-1" /> Undo last change
            </Button>
          )}
        </div>

        {appliedMsg && (
          <p className="text-[11px] font-medium flex items-center gap-1" style={{ color: accentColor }}>
            <Check className="size-3.5" /> Changes applied successfully
          </p>
        )}

        {undoMsg && (
          <p className="text-[11px] font-medium flex items-center gap-1 text-[var(--text-secondary)]">
            <Undo2 className="size-3.5" /> Last change reverted
          </p>
        )}

        {suggestion && (
          <div
            className="rounded-lg p-2.5 space-y-2 border"
            style={{
              background:
                responseStatus === 'ready'
                  ? 'rgba(110,231,183,0.05)'
                  : responseStatus === 'info'
                    ? 'rgba(148,163,184,0.06)'
                    : 'rgba(251,191,36,0.06)',
              borderColor:
                responseStatus === 'ready'
                  ? 'rgba(110,231,183,0.18)'
                  : responseStatus === 'info'
                    ? 'rgba(148,163,184,0.2)'
                    : 'rgba(251,191,36,0.25)',
            }}
          >
            <div className="flex items-start gap-2">
              {responseStatus === 'ready' ? (
                <Sparkles className="size-3.5 shrink-0 mt-0.5" style={{ color: accentColor }} />
              ) : responseStatus === 'info' ? (
                <HelpCircle className="size-3.5 shrink-0 mt-0.5 text-[var(--text-muted)]" />
              ) : (
                <AlertCircle className="size-3.5 shrink-0 mt-0.5 text-amber-400/90" />
              )}
              <p className="text-xs text-[var(--text-primary)] leading-relaxed">{suggestion.summary}</p>
            </div>
            {previewLines.length > 0 && (
              <ul className="text-[10px] text-[var(--text-secondary)] space-y-0.5 pl-3.5 list-disc">
                {previewLines.slice(0, 4).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}
            {suggestion.suggestions?.length > 0 && responseStatus !== 'ready' && (
              <div className="space-y-1">
                <p className="text-[10px] font-medium text-[var(--text-muted)]">Try something like:</p>
                <div className="flex flex-wrap gap-1">
                  {suggestion.suggestions.map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => setPrompt(ex)}
                      className="text-[9px] px-1.5 py-0.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {!canApply && responseStatus === 'ready' && (
              <p className="text-[10px] text-[var(--text-muted)] italic">No changes to apply — try rephrasing.</p>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full text-[10px] h-7"
              onClick={() => {
                setSuggestion(null);
                setLastInterpretedPrompt('');
              }}
            >
              Dismiss
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
