import { RotateCcw, User, Building2 } from 'lucide-react';
import { FlipCard3D } from '../ui/FlipCard3D';
import { FlowCircuit } from '../ui/FlowCircuit';

function BrandTaskCard({ step, icon: Icon, label, subtitle, task, emoji }) {
  const preview = task.length > 70 ? `${task.slice(0, 70)}…` : task;

  return (
    <FlipCard3D
      size="wide"
      ariaLabel={`${label}: ${task}`}
      front={
        <div className="w-full h-full rounded-xl p-5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--neon-cyan)] transition-all duration-200 flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold tracking-widest uppercase text-[#00e5ff]">{label}</span>
            {emoji ? (
              <span className="text-lg ml-auto" aria-hidden>{emoji}</span>
            ) : (
              <Icon className="w-4 h-4 text-[var(--text-secondary)] ml-auto shrink-0" />
            )}
          </div>
          <p className="text-white font-semibold text-sm leading-snug line-clamp-4 flex-1">{preview}</p>
          <p className="text-xs font-semibold text-[#00e5ff] mt-4 flex items-center gap-1 hover:text-white transition-colors">
            Tap for full task →
          </p>
        </div>
      }
      back={
        <div className="w-full h-full rounded-xl p-5 bg-[var(--bg-elevated)] border border-[var(--neon-cyan)] flex flex-col justify-center gap-2 overflow-y-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#00e5ff]">{label}</p>
          {subtitle && <p className="text-[10px] text-[var(--text-secondary)]">{subtitle}</p>}
          <p className="text-xs text-white leading-relaxed text-left">{task}</p>
          <p className="text-[10px] text-[var(--text-muted)] shrink-0 flex items-center gap-1">
            <RotateCcw className="w-3 h-3" />
            Tap to flip back
          </p>
        </div>
      }
    />
  );
}

export function DualBrandFlowHero({
  focus,
  theme,
  personalBrandTasks,
  companyBrandTasks,
  ryxenTasks,
  havenXTasks,
  outcome,
  focusLabel = "Today's Focus",
}) {
  const personal = personalBrandTasks || ryxenTasks;
  const company = companyBrandTasks || havenXTasks;
  const tasks = [];

  if (personal) {
    tasks.push({
      key: 'personal',
      step: 1,
      icon: User,
      emoji: '👤',
      label: 'Personal Brand',
      subtitle: 'Personal journey, growth, thoughts, and general content',
      task: personal,
    });
  }
  if (company) {
    tasks.push({
      key: 'company',
      step: tasks.length + 1,
      icon: Building2,
      emoji: '🏢',
      label: 'Company Brand',
      subtitle: 'Company-building journey, products, systems, and business updates',
      task: company,
    });
  }

  if (!focus && !tasks.length) return null;

  return (
    <div className="rounded-2xl border p-5 space-y-4 bg-[var(--bg-card)] overflow-hidden min-w-0" style={{ borderColor: 'var(--border-subtle)' }}>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-[var(--neon-cyan)] shadow-[var(--neon-glow-cyan)]" />
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--text-secondary)]">
            {focusLabel}
          </p>
        </div>
        {focus && (
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{focus}</h1>
        )}
        {theme && (
          <p className="text-sm text-[var(--text-secondary)] mt-1">Theme: {theme}</p>
        )}
      </div>

      {tasks.length > 0 && (
        <FlowCircuit label="Brand tasks · complete both streams" accentColor="#00e5ff">
          {tasks.map((t) => (
            <BrandTaskCard
              key={t.key}
              step={t.step}
              icon={t.icon}
              emoji={t.emoji}
              label={t.label}
              subtitle={t.subtitle}
              task={t.task}
            />
          ))}
        </FlowCircuit>
      )}

      {outcome && (
        <div className="pt-4 border-t rounded-xl p-4 bg-[var(--bg-elevated)]" style={{ borderColor: 'var(--border-subtle)' }}>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1 text-[#00e5ff]">Expected Outcome</p>
          <p className="text-sm text-white">{outcome}</p>
        </div>
      )}
    </div>
  );
}
