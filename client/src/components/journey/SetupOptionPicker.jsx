import { cn } from '../../lib/utils';

/**
 * Curated chip/card selector with optional multi-select and "Other" text field.
 */
export function SetupOptionPicker({
  label,
  options,
  selectedIds = [],
  onChange,
  otherText = '',
  onOtherChange,
  multiple = true,
  accentColor = '#6ee7b7',
  accentRgb = '110,231,183',
}) {
  const toggle = (id) => {
    if (id === 'other') {
      if (multiple) {
        const has = selectedIds.includes('other');
        onChange(has ? selectedIds.filter((x) => x !== 'other') : [...selectedIds, 'other']);
      } else {
        onChange(['other']);
      }
      return;
    }
    if (multiple) {
      onChange(
        selectedIds.includes(id)
          ? selectedIds.filter((x) => x !== id)
          : [...selectedIds.filter((x) => x !== 'other'), id]
      );
    } else {
      onChange([id]);
    }
  };

  const showOther = multiple ? selectedIds.includes('other') : selectedIds[0] === 'other';

  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-medium text-[var(--text-secondary)]">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selectedIds.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                active
                  ? 'text-[#0a0a0a] border-transparent shadow-sm'
                  : 'border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-muted)]'
              )}
              style={active ? { background: accentColor } : undefined}
            >
              {opt.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => toggle('other')}
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
            showOther
              ? 'text-[#0a0a0a] border-transparent'
              : 'border-dashed border-[var(--border-subtle)] text-[var(--text-muted)]'
          )}
          style={showOther ? { background: accentColor } : undefined}
        >
          Other
        </button>
      </div>
      {showOther && (
        <input
          type="text"
          value={otherText}
          onChange={(e) => onOtherChange?.(e.target.value)}
          placeholder="Specify…"
          className="w-full rounded-xl border px-3 py-2 text-sm bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-primary)] focus:outline-none focus:ring-2"
          style={{ focusRingColor: `rgba(${accentRgb},0.3)` }}
        />
      )}
    </fieldset>
  );
}
