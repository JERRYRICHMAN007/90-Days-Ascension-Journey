import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Plus, LayoutTemplate, Sparkles, Wand2 } from 'lucide-react';
import { createJourney, getJourneyTemplates } from '../utils/journeyRegistry.js';
import { BUILTIN_TEMPLATE_CATEGORIES, getCustomTemplates, saveCustomTemplate } from '../utils/journeyTemplates.js';
import { saveJourneySetup } from '../utils/journeySetup.js';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

const FROM_SCRATCH = '__from-scratch__';

export function CreateJourneyPage() {
  const navigate = useNavigate();
  const builtinTemplates = getJourneyTemplates();
  const customTemplates = useMemo(() => getCustomTemplates(), []);
  const allTemplates = useMemo(
    () => [
      {
        templateId: FROM_SCRATCH,
        label: 'Something else',
        icon: '✨',
        color: '#6ee7b7',
        isScratch: true,
        description: 'Build a new journey from scratch — your name, days, times, and tasks.',
      },
      ...customTemplates.map((t) => ({
        templateId: t.id,
        label: t.name,
        icon: t.icon,
        color: t.color,
        isCustom: true,
        description: t.description || 'A plan you saved earlier.',
      })),
      ...builtinTemplates.map((t) => ({ ...t, isCustom: false })),
    ],
    [customTemplates, builtinTemplates]
  );

  const [title, setTitle] = useState('');
  const [templateId, setTemplateId] = useState(FROM_SCRATCH);
  const [planSource, setPlanSource] = useState('custom');
  const [category, setCategory] = useState('learning');

  const selected = allTemplates.find((t) => t.templateId === templateId);
  const isScratch = templateId === FROM_SCRATCH;
  const resolvedTitle = title.trim() || (isScratch ? '' : selected?.label || '');
  const canCreate = Boolean(templateId && resolvedTitle);

  const handleSelect = (id) => {
    setTemplateId(id);
    if (id === FROM_SCRATCH) setPlanSource('custom');
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
      entry = createJourney({
        title: resolvedTitle,
        templateId,
        icon: selected?.icon,
        color: selected?.color,
      });
    }
    saveJourneySetup(entry.id, {
      planSource: isScratch ? 'custom' : planSource,
      mode: isScratch || planSource === 'custom' ? 'manual' : 'smart',
    });
    navigate(`/journey/${entry.id}?setup=1`);
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
          Use a ready-made path, or create something entirely your own.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">1. What kind?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allTemplates.map((t) => {
            const isSelected = templateId === t.templateId;
            return (
              <motion.button
                key={t.templateId}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelect(t.templateId)}
                className={cn(
                  'relative rounded-xl border p-4 text-left transition-all min-h-[108px]',
                  isSelected
                    ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/8 shadow-sm'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-card)] hover:border-[var(--border-muted)]'
                )}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-[var(--neon-green)] text-[#003d1f]">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
                <span className="text-2xl">{t.icon}</span>
                <p className="font-semibold text-[var(--text-primary)] mt-2">{t.label}</p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                  {t.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {isScratch && (
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
            What is this journey about?
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
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">2. Ready-made or customize?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPlanSource('default')}
              className={cn(
                'rounded-2xl border p-4 text-left',
                planSource === 'default'
                  ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/8'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)]'
              )}
            >
              <LayoutTemplate className="size-5 mb-2 text-[var(--neon-green)]" />
              <p className="font-bold text-[var(--text-primary)]">Use the default plan</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                Start with Aether&apos;s schedule. You can still change days and times later.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setPlanSource('custom')}
              className={cn(
                'rounded-2xl border p-4 text-left',
                planSource === 'custom'
                  ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/8'
                  : 'border-[var(--border-subtle)] bg-[var(--bg-card)]'
              )}
            >
              <Wand2 className="size-5 mb-2 text-[var(--neon-green)]" />
              <p className="font-bold text-[var(--text-primary)]">Customize it</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                Pick your own books, workouts, days, and times. Prefills from the default so it&apos;s quick.
              </p>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="journey-title" className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
          {isScratch ? '2. Name it' : '3. Name it'}{' '}
          <span className="font-normal normal-case">{isScratch ? '(required)' : '(optional)'}</span>
        </label>
        <input
          id="journey-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={isScratch ? 'e.g. Morning prayer, Spanish, Piano' : selected?.label || 'My journey'}
          className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)]"
        />
      </div>

      <Button
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
        {isScratch ? 'Build this journey' : 'Create journey'}
      </Button>
    </div>
  );
}
