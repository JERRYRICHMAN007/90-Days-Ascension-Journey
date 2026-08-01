import { ChevronRight, Palette } from 'lucide-react';
import { isTomorrow } from '../../utils/dates';

const BRAND_ACCENT = '#00e5ff';

export function BrandTomorrowPreview({ nextDay, onPreview }) {
  if (!nextDay?.dayNumber || !isTomorrow(nextDay.dayNumber)) return null;

  const personal = nextDay.personalBrandTasks || nextDay.ryxenTasks;
  const company = nextDay.companyBrandTasks || nextDay.havenXTasks;

  return (
    <button
      type="button"
      onClick={() => onPreview?.(nextDay.dayNumber)}
      className="w-full text-left rounded-xl border p-4 transition-all duration-200 group hover:border-[var(--neon-cyan)]"
      style={{
        background: 'var(--bg-elevated)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: BRAND_ACCENT, boxShadow: 'var(--neon-glow-cyan)' }}
            />
            <p className="aether-label">Tomorrow&apos;s Preview</p>
          </div>
          <p className="text-lg font-bold text-[var(--text-primary)] tracking-tight truncate">
            {nextDay.focus || 'Dual Brand'}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
            {personal && company
              ? 'Personal + Company brand tasks'
              : personal
              ? 'Personal brand task'
              : company
              ? 'Company brand task'
              : nextDay.theme
              ? `Theme: ${nextDay.theme}`
              : 'Preview tomorrow\'s brand work'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-1">
          <div
            className="size-9 rounded-lg flex items-center justify-center border"
            style={{
              background: 'rgba(0,229,255,0.08)',
              borderColor: 'rgba(0,229,255,0.25)',
            }}
          >
            <Palette className="w-4 h-4" style={{ color: BRAND_ACCENT }} />
          </div>
          <ChevronRight
            className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--neon-cyan)] transition-colors"
          />
        </div>
      </div>
    </button>
  );
}
