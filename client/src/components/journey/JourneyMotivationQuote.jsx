import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Bookmark, ChevronLeft, ChevronRight, Share2, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { generalQuotes, getQuoteForJourneyDay } from '../../data/quotes.js';
import { STORAGE_KEYS } from '../../utils/storageKeys.js';
import { isJourneyStarted, getCurrentDayNumber } from '../../utils/journeyPlanning.js';

function readFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITE_QUOTES) || '[]');
  } catch {
    return [];
  }
}

function writeFavorites(ids) {
  localStorage.setItem(STORAGE_KEYS.FAVORITE_QUOTES, JSON.stringify(ids));
}

function quoteId(q) {
  return `${q.author}-${q.quote.slice(0, 32)}`;
}

/** Stable daily index from calendar date + journey */
function getDailyQuoteIndex(pool, journeyId, dayNumber) {
  const seed = `${journeyId}-${dayNumber}-${new Date().toDateString()}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(hash) % pool.length;
}

/**
 * Compact swipeable quote — rotates daily, manual browse optional.
 */
export function JourneyMotivationQuote({
  journeyId,
  domain,
  dayNumber,
  accentColor = '#6ee7b7',
  accentRgb = '110,231,183',
  className,
}) {
  const started = isJourneyStarted(journeyId);
  const currentDay = started ? getCurrentDayNumber(journeyId) : null;
  const calendarDay = dayNumber ?? currentDay ?? 1;

  const pool = useMemo(() => {
    const collected = [];
    for (let d = 1; d <= 30; d += 1) {
      const q = getQuoteForJourneyDay(domain || journeyId, d);
      if (q && !collected.some((x) => x.quote === q.quote)) collected.push(q);
    }
    return collected.length ? collected : generalQuotes;
  }, [domain, journeyId]);

  const dailyIndex = useMemo(
    () => getDailyQuoteIndex(pool, journeyId, calendarDay),
    [pool, journeyId, calendarDay]
  );

  const [browseOffset, setBrowseOffset] = useState(0);
  const [favorites, setFavorites] = useState(readFavorites);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    setBrowseOffset(0);
  }, [dailyIndex, journeyId]);

  const index = (dailyIndex + browseOffset + pool.length * 100) % pool.length;
  const quote = pool[index] || pool[0];
  const id = quote ? quoteId(quote) : '';
  const isFavorite = favorites.includes(id);
  const isDailyQuote = browseOffset === 0;

  const go = useCallback(
    (delta) => {
      setDirection(delta);
      setBrowseOffset((o) => o + delta);
    },
    []
  );

  const resetToDaily = () => {
    setDirection(-browseOffset);
    setBrowseOffset(0);
  };

  const toggleFavorite = () => {
    const next = isFavorite ? favorites.filter((f) => f !== id) : [...favorites, id];
    setFavorites(next);
    writeFavorites(next);
  };

  const handleShare = async () => {
    if (!quote) return;
    const text = `"${quote.quote}" — ${quote.author}`;
    try {
      if (navigator.share) await navigator.share({ title: 'Daily inspiration', text });
      else await navigator.clipboard.writeText(text);
    } catch {
      /* cancelled */
    }
  };

  const dragX = useMotionValue(0);
  const opacity = useTransform(dragX, [-80, 0, 80], [0.75, 1, 0.75]);

  const onDragEnd = (_e, info) => {
    if (info.offset.x < -50) go(1);
    else if (info.offset.x > 50) go(-1);
    dragX.set(0);
  };

  if (!started) {
    return (
      <div
        className={cn('rounded-xl border border-dashed px-4 py-5 text-center', className)}
        style={{ borderColor: `rgba(${accentRgb},0.2)` }}
      >
        <Sparkles className="size-5 mx-auto mb-2" style={{ color: accentColor }} />
        <p className="text-sm font-medium text-[var(--text-primary)]">Inspiration awaits</p>
        <p className="text-xs text-[var(--text-secondary)] mt-1">Unlocks when your journey begins.</p>
      </div>
    );
  }

  if (!quote) return null;

  const dotCount = Math.min(5, pool.length);

  return (
    <div
      className={cn('rounded-xl border px-4 py-3.5 sm:px-5 sm:py-4', className)}
      style={{
        background: `linear-gradient(90deg, rgba(${accentRgb},0.06) 0%, var(--bg-card) 40%)`,
        borderColor: `rgba(${accentRgb},0.15)`,
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accentColor }}>
          Daily inspiration
        </span>
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={toggleFavorite} className="p-1.5 rounded-full hover:bg-[var(--surface-hover)]" aria-label="Save">
            <Bookmark className={cn('size-3.5', isFavorite && 'fill-current')} style={{ color: isFavorite ? accentColor : 'var(--text-muted)' }} />
          </button>
          <button type="button" onClick={handleShare} className="p-1.5 rounded-full hover:bg-[var(--surface-hover)] text-[var(--text-muted)]" aria-label="Share">
            <Share2 className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="relative flex items-center gap-2 min-h-[3.5rem]">
        <button type="button" onClick={() => go(-1)} className="hidden sm:flex p-1 rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-hover)] shrink-0" aria-label="Previous">
          <ChevronLeft className="size-4" />
        </button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${index}-${browseOffset}`}
            custom={direction}
            style={{ x: dragX, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={onDragEnd}
            initial={{ opacity: 0, x: direction >= 0 ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction >= 0 ? -20 : 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex-1 flex items-center gap-3 min-w-0 cursor-grab active:cursor-grabbing"
          >
            <span className="text-xl shrink-0 select-none">{quote.icon}</span>
            <div className="min-w-0">
              <p className="text-sm sm:text-base font-medium leading-snug text-[var(--text-primary)] line-clamp-3">
                &ldquo;{quote.quote}&rdquo;
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">— {quote.author}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <button type="button" onClick={() => go(1)} className="hidden sm:flex p-1 rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-hover)] shrink-0" aria-label="Next">
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-1 mt-2.5">
        {Array.from({ length: dotCount }).map((_, i) => {
          const active = isDailyQuote ? i === 0 : i === (Math.abs(browseOffset) % dotCount);
          return (
            <span
              key={i}
              className={cn('h-1 rounded-full transition-all', active ? 'w-4' : 'w-1 opacity-35')}
              style={{ background: active ? accentColor : 'var(--text-muted)' }}
            />
          );
        })}
        {!isDailyQuote && (
          <button type="button" onClick={resetToDaily} className="ml-2 text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)]">
            Today&apos;s quote
          </button>
        )}
      </div>
    </div>
  );
}
