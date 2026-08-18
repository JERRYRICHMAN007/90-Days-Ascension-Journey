import { BookOpen, ExternalLink, Clock } from 'lucide-react';

function resourceKey(resource) {
  return `${resource?.title || resource || ''}_${resource?.url || ''}`.toLowerCase();
}

/** Flatten nested resource arrays and dedupe */
export function normalizeResourceList(input, max = 4) {
  const out = [];
  const seen = new Set();

  const push = (resource) => {
    if (!resource) return;
    if (typeof resource === 'string') {
      const key = resource.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ title: resource });
      return;
    }
    if (!resource.title && !resource.url) return;
    const key = resourceKey(resource);
    if (seen.has(key)) return;
    seen.add(key);
    out.push(resource);
  };

  const walk = (node) => {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    push(node);
  };

  walk(input);
  return out.slice(0, max);
}

/**
 * Collect only resources tied to today's work (not the full curated dump).
 */
export function collectDayRelevantResources({
  journeyId,
  day,
  disciplineContent = null,
  max = 4,
}) {
  if (!day) return [];

  // Software engineering — only from today's scheduled sessions
  if (journeyId === 'software-engineering' && disciplineContent) {
    const fromSessions = [];
    [...(disciplineContent.deepLearning || []), ...(disciplineContent.implementation || [])].forEach(
      (session) => {
        if (Array.isArray(session.content?.resources)) {
          fromSessions.push(...session.content.resources);
        }
      }
    );
    const sessionList = normalizeResourceList(fromSessions, max);
    if (sessionList.length) return sessionList;
    return normalizeResourceList(day.resources || [], max);
  }

  if (journeyId === 'dual-brand') {
    return normalizeResourceList(day.learningResources || day.resources || [], max);
  }

  if (journeyId === 'body-transformation') {
    // Prefer form guides / day-specific over channel dumps
    const list = normalizeResourceList(day.resources || [], 12);
    const guides = list.filter(
      (r) =>
        /form guide|recovery|stretch/i.test(r.title || '') ||
        r.category === 'Form' ||
        r.type === 'youtube' && /watch\?v=/i.test(r.url || '')
    );
    if (guides.length) return guides.slice(0, max);
    return list.slice(0, Math.min(max, 3));
  }

  if (journeyId === 'reading') {
    return normalizeResourceList(day.resources || [], max);
  }

  // writers + default
  return normalizeResourceList(day.resources || [], max);
}

export function DayResourcesPanel({
  title = 'Today’s resources',
  subtitle = 'Only materials for today’s task',
  resources = [],
  accentColor = 'var(--neon-green)',
}) {
  return (
    <div
      className="rounded-xl border overflow-hidden min-w-0"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <div
        className="px-3.5 sm:px-4 py-3 border-b flex items-center gap-2.5"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <span
          className="flex size-7 items-center justify-center rounded-lg shrink-0"
          style={{
            color: accentColor,
            background: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
          }}
        >
          <BookOpen className="size-3.5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">{title}</h3>
          <p className="text-[9px] font-bold uppercase tracking-[0.14em] mt-0.5" style={{ color: accentColor }}>
            {subtitle}
          </p>
        </div>
      </div>

      {resources.length === 0 ? (
        <p className="p-4 text-sm text-[var(--text-muted)]">No resources for today’s task.</p>
      ) : (
        <ul className="p-2.5 sm:p-3 space-y-1.5">
          {resources.map((resource, idx) => {
            const label = resource.title || String(resource);
            const href = resource.url || null;
            return (
              <li key={`${label}-${idx}`}>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 rounded-lg border px-3 py-2.5 transition-opacity hover:opacity-90"
                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
                        {label}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                        {resource.time && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                            <Clock className="size-2.5" />
                            {resource.time}
                          </span>
                        )}
                        {(resource.category || resource.type) && (
                          <span className="text-[10px] text-[var(--text-muted)] capitalize">
                            {resource.category || resource.type}
                          </span>
                        )}
                      </div>
                      {resource.description && resource.description !== label && (
                        <p className="text-[11px] text-[var(--text-secondary)] mt-1 line-clamp-2 leading-relaxed">
                          {resource.description}
                        </p>
                      )}
                    </div>
                    <ExternalLink className="size-3.5 shrink-0 mt-1" style={{ color: accentColor }} />
                  </a>
                ) : (
                  <div
                    className="rounded-lg border px-3 py-2.5"
                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
                  >
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{label}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
