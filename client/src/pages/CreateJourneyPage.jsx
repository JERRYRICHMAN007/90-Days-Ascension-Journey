import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Plus, Sparkles } from 'lucide-react';
import { createJourney, getJourneyTemplates } from '../utils/journeyRegistry.js';
import { BUILTIN_TEMPLATE_CATEGORIES, getCustomTemplates, saveCustomTemplate } from '../utils/journeyTemplates.js';
import { saveJourneySetup } from '../utils/journeySetup.js';
import { seedJourneyPlan } from '../utils/journeyCustomPlan.js';
import { getWeeklyPlan } from '../utils/journeyWeeklyPlan.js';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

const FROM_SCRATCH = '__from-scratch__';

export function CreateJourneyPage() {
  const navigate = useNavigate();
  const builtinTemplates = getJourneyTemplates();
  const customTemplates = useMemo(() => getCustomTemplates(), []);

  const [title, setTitle] = useState('');
  const [mode, setMode] = useState('own');
  const [templateId, setTemplateId] = useState(FROM_SCRATCH);
  const [category, setCategory] = useState('learning');

  const selected = builtinTemplates.find((t) => t.templateId === templateId)
    || customTemplates.find((t) => t.id === templateId);
  const isScratch = mode === 'own';
  const resolvedTitle = title.trim() || (isScratch ? '' : selected?.label || selected?.name || '');
  const canCreate = Boolean(resolvedTitle && (isScratch || (templateId && templateId !== FROM_SCRATCH)));

  const handleMode = (next) => {
    setMode(next);
    if (next === 'own') setTemplateId(FROM_SCRATCH);
  };

  const handleCreate = () => {
    if (!canCreate) return;
    const cat = BUILTIN_TEMPLATE_CATEGORIES.find((c) => c.id === category);
    let entry;
    if (isScratch) {
      const tmpl = saveCustomTemplate({
        name: resolvedTitle,
        description: 'Built from scratch',
        icon: cat?.icon || '✨',
        color: '#6ee7b7',
        category,
        fromScratch: true,
      });
      entry = createJourney({
        title: resolvedTitle,
        templateId: tmpl.id,
        icon: tmpl.icon,
        color: tmpl.color,
      });
    } else {
      const custom = customTemplates.find((t) => t.id === templateId);
      entry = createJourney({
        title: resolvedTitle,
        templateId,
        icon: selected?.icon || custom?.icon,
        color: selected?.color || custom?.color,
      });
    }
    const planSource = isScratch ? 'custom' : 'default';
    seedJourneyPlan(entry.id, { planSource });
    const days = Object.keys(getWeeklyPlan(entry.id))
      .map(Number)
      .sort((a, b) => a - b);
    saveJourneySetup(entry.id, {
      planSource,
      mode: isScratch ? 'manual' : 'smart',
      availableDays: days,
    });
    navigate(`/journey/${entry.id}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-8 min-h-[calc(100vh-8rem)]">
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="size-4" /> Back
      </button>

      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
          Add a journey
        </h1>
        <p className="text-base text-[var(--text-secondary)] mt-2 max-w-xl leading-relaxed">
          Name what you&apos;re working on, pick your own plan or a template, then set days and times. You can change everything later.
        </p>
      </div>

      <div className="space-y-2" data-tour="journey-name">
        <label htmlFor="journey-title" className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          1. Name it
        </label>
        <input
          id="journey-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Learning Spanish, Morning prayer, Piano"
          className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)]"
        />
      </div>

      <div className="space-y-3" data-tour="journey-kind">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">2. How do you want to build it?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleMode('own')}
            className={cn(
              'rounded-2xl border p-4 text-left transition-all',
              isScratch
                ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/8'
                : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-muted)]'
            )}
          >
            <span className="text-2xl">✨</span>
            <p className="font-semibold text-[var(--text-primary)] mt-2">Build my own</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
              Best for Spanish, music, prayer, or anything without a built-in curriculum. Sessions use this name.
            </p>
          </button>
          <button
            type="button"
            onClick={() => handleMode('template')}
            className={cn(
              'rounded-2xl border p-4 text-left transition-all',
              !isScratch
                ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/8'
                : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-muted)]'
            )}
          >
            <span className="text-2xl">📋</span>
            <p className="font-semibold text-[var(--text-primary)] mt-2">Use a ready-made path</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
              Fitness, reading, writing, brand, or software engineering. You can still change days and times after.
            </p>
          </button>
        </div>
      </div>

      {isScratch && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            What is this about?
          </p>
          <div className="flex flex-wrap gap-2">
            {BUILTIN_TEMPLATE_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-semibold',
                  category === c.id
                    ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/15 text-[var(--text-primary)]'
                    : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                )}
              >
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {!isScratch && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Pick a path</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {customTemplates.map((t) => {
              const isSelected = templateId === t.id;
              return (
                <motion.button
                  key={t.id}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTemplateId(t.id);
                    if (!title.trim()) setTitle(t.name);
                  }}
                  className={cn(
                    'relative rounded-xl border p-4 text-left min-h-[96px]',
                    isSelected
                      ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/8'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-card)]'
                  )}
                >
                  {isSelected && (
                    <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-[var(--neon-green)] text-[#003d1f]">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  )}
                  <span className="text-2xl">{t.icon}</span>
                  <p className="font-semibold text-[var(--text-primary)] mt-2">{t.name}</p>
                </motion.button>
              );
            })}
            {builtinTemplates.map((t) => {
              const isSelected = templateId === t.templateId;
              return (
                <motion.button
                  key={t.templateId}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setTemplateId(t.templateId);
                    if (!title.trim()) setTitle(t.label);
                  }}
                  className={cn(
                    'relative rounded-xl border p-4 text-left min-h-[96px]',
                    isSelected
                      ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/8'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-card)]'
                  )}
                >
                  {isSelected && (
                    <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-[var(--neon-green)] text-[#003d1f]">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  )}
                  <span className="text-2xl">{t.icon}</span>
                  <p className="font-semibold text-[var(--text-primary)] mt-2">{t.label}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{t.description}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      <Button
        data-tour="create-submit"
        onClick={handleCreate}
        disabled={!canCreate}
        className={cn(
          'w-full sm:w-auto rounded-xl px-8 py-6 font-bold',
          canCreate
            ? 'bg-[var(--neon-green)] text-[#003d1f] hover:opacity-90'
            : 'bg-[var(--bg-badge)] text-[var(--text-muted)] cursor-not-allowed'
        )}
      >
        {isScratch ? <Sparkles className="size-4 mr-2" /> : <Plus className="size-4 mr-2" />}
        {isScratch ? 'Create my journey' : 'Create journey'}
      </Button>
      <p className="text-xs text-[var(--text-muted)] -mt-4">
        Next you&apos;ll set days and times. You can customize again after it&apos;s created.
      </p>
    </div>
  );
}
