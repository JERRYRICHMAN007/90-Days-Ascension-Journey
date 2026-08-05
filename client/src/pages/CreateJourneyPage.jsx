import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Plus, Sparkles, Wand2 } from 'lucide-react';
import { createJourney, getJourneyTemplates } from '../utils/journeyRegistry.js';
import {
  getCustomTemplates,
  saveCustomTemplate,
  BUILTIN_TEMPLATE_CATEGORIES,
} from '../utils/journeyTemplates.js';
import { saveJourneySetup } from '../utils/journeySetup.js';
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

  const [mode, setMode] = useState('template');
  const [title, setTitle] = useState('');
  const [templateId, setTemplateId] = useState(allTemplates[0]?.templateId || '');
  const [customName, setCustomName] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customGoals, setCustomGoals] = useState('');
  const [customIcon, setCustomIcon] = useState('✨');
  const [customCategory, setCustomCategory] = useState('learning');

  const selected = allTemplates.find((t) => t.templateId === templateId);
  const resolvedTitle =
    mode === 'custom'
      ? customName.trim()
      : title.trim() || selected?.label || '';
  const canCreate = mode === 'custom' ? Boolean(customName.trim()) : Boolean(templateId && resolvedTitle);

  const handleCreate = () => {
    if (!canCreate) return;

    let entry;
    if (mode === 'custom') {
      const custom = saveCustomTemplate({
        name: customName.trim(),
        description: customDesc.trim(),
        icon: customIcon,
        category: customCategory,
        goals: customGoals.split('\n').map((g) => g.trim()).filter(Boolean),
        color: '#6ee7b7',
      });
      entry = createJourney({
        title: customName.trim(),
        templateId: custom.id,
        icon: custom.icon,
        color: custom.color,
      });
      saveJourneySetup(entry.id, {
        goal: customGoals,
        mode: 'manual',
      });
    } else {
      entry = createJourney({
        title: resolvedTitle,
        templateId,
        icon: selected?.icon,
        color: selected?.color,
      });
    }
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
              Choose a proven template or build your own. Each journey runs on an independent schedule with its own progress.
            </p>
          </div>

          <div className="flex gap-2 p-1 rounded-xl bg-[var(--bg-badge)] w-fit">
            <ModeTab active={mode === 'template'} onClick={() => setMode('template')} label="Use a template" />
            <ModeTab active={mode === 'custom'} onClick={() => setMode('custom')} label="Create your own" icon={Wand2} />
          </div>

          {mode === 'template' ? (
            <>
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Templates</p>
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
                          <p className="text-[10px] text-[var(--text-muted)] mt-1">Custom template</p>
                        )}
                      </motion.button>
                    );
                  })}
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
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
              <Field label="Template name" value={customName} onChange={setCustomName} placeholder="e.g. Bible Study, Marathon Prep" />
              <Field label="Icon (emoji)" value={customIcon} onChange={setCustomIcon} placeholder="✨" />
              <div className="sm:col-span-2">
                <Field label="Description" value={customDesc} onChange={setCustomDesc} placeholder="What is this journey about?" multiline />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1.5">Category</label>
                <div className="flex flex-wrap gap-2">
                  {BUILTIN_TEMPLATE_CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setCustomCategory(c.id);
                        setCustomIcon(c.icon);
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs border',
                        customCategory === c.id
                          ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/10 text-[var(--text-primary)]'
                          : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                      )}
                    >
                      {c.icon} {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="Goals (one per line)"
                  value={customGoals}
                  onChange={setCustomGoals}
                  placeholder={'Lose 10 kg\nExercise 4x per week\nBuild consistency'}
                  multiline
                />
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-[var(--neon-green)]">
            <Sparkles className="size-5" />
            <h2 className="font-display font-bold text-[var(--text-primary)]">What happens next</h2>
          </div>
          <ol className="space-y-3 text-sm text-[var(--text-secondary)] list-decimal list-inside">
            <li>Personalize schedule &amp; goals</li>
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

function ModeTab({ active, onClick, label, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
        active ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm' : 'text-[var(--text-secondary)]'
      )}
    >
      {Icon && <Icon className="size-3.5" />}
      {label}
    </button>
  );
}

function Field({ label, value, onChange, placeholder, multiline }) {
  const cls =
    'w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500/15';
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </label>
  );
}
