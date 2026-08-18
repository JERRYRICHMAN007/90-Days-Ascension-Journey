import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Plus, Sparkles, LayoutTemplate, Wand2 } from 'lucide-react';
import { createJourney, getJourneyTemplates } from '../utils/journeyRegistry.js';
import { getCustomTemplates } from '../utils/journeyTemplates.js';
import { saveJourneySetup } from '../utils/journeySetup.js';
import { DEFAULT_PLAN_BLURBS } from '../utils/journeyCustomPlan.js';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';

export function CreateJourneyPage() {
  const navigate = useNavigate();
  const builtinTemplates = getJourneyTemplates();
  const customTemplates = useMemo(() => getCustomTemplates(), []);
  const allTemplates = useMemo(
    () => [
      ...customTemplates.map((t) => ({
        templateId: t.id,
        label: t.name,
        icon: t.icon,
        color: t.color,
        isCustom: true,
        description: t.description,
      })),
      ...builtinTemplates.map((t) => ({ ...t, isCustom: false })),
    ],
    [customTemplates, builtinTemplates]
  );

  const [title, setTitle] = useState('');
  const [templateId, setTemplateId] = useState(allTemplates[0]?.templateId || '');
  const [planSource, setPlanSource] = useState('default');

  const selected = allTemplates.find((t) => t.templateId === templateId);
  const resolvedTitle = title.trim() || selected?.label || '';
  const canCreate = Boolean(templateId && resolvedTitle);
  const defaultBlurb = DEFAULT_PLAN_BLURBS[templateId] || 'Aether 6-month default plan for this journey.';

  const handleCreate = () => {
    if (!canCreate) return;
    const entry = createJourney({
      title: resolvedTitle,
      templateId,
      icon: selected?.icon,
      color: selected?.color,
    });
    saveJourneySetup(entry.id, {
      planSource,
      mode: planSource === 'custom' ? 'manual' : 'smart',
    });
    navigate(`/journey/${entry.id}?setup=1`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 space-y-8 min-h-[calc(100vh-8rem)]">
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="size-4" /> Back to dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-12 items-start">
        <div className="space-y-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--neon-green)] mb-2">
              Journey setup
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
              Create your transformation
            </h1>
            <p className="text-base text-[var(--text-secondary)] mt-3 max-w-xl leading-relaxed">
              Pick a journey type, then use the Aether default plan or build your own books, workouts, days, and times.
            </p>
          </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Journey type</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {allTemplates.map((t) => {
                    const isSelected = templateId === t.templateId;
                    return (
                      <motion.button
                        key={t.templateId}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTemplateId(t.templateId)}
                        className={cn(
                          'relative rounded-xl border p-4 text-left transition-all min-h-[120px]',
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
                        {t.isCustom && (
                          <p className="text-[10px] text-[var(--text-muted)] mt-1">Saved template</p>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">How will you plan it?</p>
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
                    <p className="font-bold text-[var(--text-primary)]">Use default plan</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{defaultBlurb}</p>
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
                    <p className="font-bold text-[var(--text-primary)]">Build custom plan</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                      Choose your own books, workouts, days, and times. Starts from the default so you can edit.
                    </p>
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <label htmlFor="journey-title" className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Journey name <span className="font-normal normal-case">(optional)</span>
                </label>
                <input
                  id="journey-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={selected ? `Defaults to “${selected.label}”` : 'Name your journey'}
                  className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 text-[var(--text-primary)]"
                />
              </div>
        </div>

        <aside className="lg:sticky lg:top-24 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--neon-green)]">
            <Sparkles className="size-5" />
            <h2 className="font-display font-bold text-[var(--text-primary)]">What happens next</h2>
          </div>
          <ol className="space-y-3 text-sm text-[var(--text-secondary)] list-decimal list-inside">
            <li>{planSource === 'custom' ? 'Build your content and schedule' : 'Confirm start date on the default plan'}</li>
            <li>Review your full plan</li>
            <li>Confirm to officially start</li>
          </ol>
          {resolvedTitle && (
            <div className="rounded-xl bg-[var(--bg-primary)] p-4 border border-[var(--border-subtle)]">
              <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Preview</p>
              <p className="font-semibold text-[var(--text-primary)] mt-1">{resolvedTitle}</p>
            </div>
          )}
          <Button
            onClick={handleCreate}
            disabled={!canCreate}
            className={cn(
              'w-full rounded-xl py-6 font-bold',
              canCreate
                ? 'bg-[var(--neon-green)] text-[#003d1f] hover:opacity-90'
                : 'bg-[var(--bg-badge)] text-[var(--text-muted)] cursor-not-allowed'
            )}
          >
            <Plus className="size-4 mr-2" />
            Continue to setup
          </Button>
        </aside>
      </div>
    </div>
  );
}

