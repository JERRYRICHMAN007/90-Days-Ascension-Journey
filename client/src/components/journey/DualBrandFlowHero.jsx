import { motion } from 'framer-motion';
import { RotateCcw, User, Building2 } from 'lucide-react';
import { FlipCard3D } from '../ui/FlipCard3D';
import { SessionCompletionButton } from '../SessionCompletionButton';
import { BrandTomorrowPreview } from './BrandTomorrowPreview';
import { isTomorrow } from '../../utils/dates';

const BRAND_ACCENT = '#00e5ff';
const BRAND_GLOW = 'var(--neon-glow-cyan)';

function BrandStreamCard({ label, subtitle, task, icon: Icon, streamTag }) {
  const preview = task.length > 90 ? `${task.slice(0, 90)}…` : task;

  return (
    <div className="flex flex-col min-w-0 h-full">
      <div className="mb-3">
        <p className="forge-label" style={{ color: BRAND_ACCENT }}>
          {streamTag}
        </p>
        <p className="text-sm font-bold text-[var(--text-primary)] mt-1 tracking-tight">{label}</p>
        {subtitle && (
          <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">{subtitle}</p>
        )}
      </div>

      <FlipCard3D
        size="wide"
        className="flex-1"
        ariaLabel={`${label}: ${task}`}
        front={
          <div
            className="w-full h-full rounded-xl p-5 flex flex-col justify-between min-h-[200px] border transition-all duration-200"
            style={{
              background: 'var(--bg-elevated)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <Icon className="w-4 h-4 shrink-0" style={{ color: BRAND_ACCENT }} />
              <span
                className="text-[10px] font-bold uppercase tracking-[1.2px] px-2 py-0.5 rounded"
                style={{
                  color: BRAND_ACCENT,
                  background: 'rgba(0,229,255,0.08)',
                  border: '1px solid rgba(0,229,255,0.25)',
                }}
              >
                Task
              </span>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)] leading-snug line-clamp-6 flex-1">
              {preview}
            </p>
            <p
              className="text-[10px] font-bold uppercase tracking-[1px] mt-4 flex items-center gap-1"
              style={{ color: BRAND_ACCENT }}
            >
              <RotateCcw className="w-3 h-3" />
              Tap for full task
            </p>
          </div>
        }
        back={
          <div
            className="w-full h-full rounded-xl p-5 flex flex-col justify-center gap-2 overflow-y-auto border min-h-[200px]"
            style={{
              background: 'var(--bg-elevated)',
              borderColor: BRAND_ACCENT,
              boxShadow: BRAND_GLOW,
            }}
          >
            <p className="forge-label" style={{ color: BRAND_ACCENT }}>
              {streamTag}
            </p>
            <p className="text-xs text-[var(--text-primary)] leading-relaxed text-left">{task}</p>
            <p className="text-[10px] text-[var(--text-secondary)] shrink-0 flex items-center gap-1 mt-2">
              <RotateCcw className="w-3 h-3" />
              Tap to flip back
            </p>
          </div>
        }
      />
    </div>
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
  journeyId = 'dual-brand',
  dayNumber,
  nextDay = null,
  onPreviewDay = null,
}) {
  const personal = personalBrandTasks || ryxenTasks;
  const company = companyBrandTasks || havenXTasks;
  const previewingTomorrow = dayNumber != null && isTomorrow(dayNumber);
  const showTomorrowPreview =
    nextDay && dayNumber != null && !previewingTomorrow && isTomorrow(nextDay.dayNumber);
  const hasTasks = personal || company;

  if (!focus && !hasTasks) return null;

  return (
    <div className="space-y-4 min-w-0">
      <div
        className="rounded-[12px] border overflow-hidden min-w-0"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        {/* Header — Figma Frame 4 */}
        <div className="p-5 sm:p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: BRAND_ACCENT, boxShadow: BRAND_GLOW }}
            />
            <p className="forge-label">{focusLabel}</p>
          </div>
          {focus && (
            <h2 className="text-2xl sm:text-[32px] font-extrabold text-[var(--text-primary)] tracking-[-0.64px] leading-tight">
              {focus}
            </h2>
          )}
          {theme && (
            <span
              className="inline-flex items-center mt-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[1.2px]"
              style={{
                color: BRAND_ACCENT,
                border: '1px solid rgba(0,229,255,0.35)',
                background: 'rgba(0,229,255,0.08)',
              }}
            >
              Theme · {theme}
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {hasTasks && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {personal && (
                <BrandStreamCard
                  streamTag="Stream 01"
                  label="Personal Brand"
                  subtitle="Personal journey, growth, thoughts, and general content"
                  task={personal}
                  icon={User}
                />
              )}
              {company && (
                <BrandStreamCard
                  streamTag={personal ? 'Stream 02' : 'Stream 01'}
                  label="Company Brand"
                  subtitle="Company-building journey, products, systems, and business updates"
                  task={company}
                  icon={Building2}
                />
              )}
            </div>
          )}

          {outcome && (
            <div
              className="rounded-xl border p-4 sm:p-5"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
            >
              <p className="forge-label mb-2" style={{ color: BRAND_ACCENT }}>
                Expected Outcome
              </p>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">{outcome}</p>
            </div>
          )}

          {dayNumber !== undefined && hasTasks && !previewingTomorrow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="pt-5 border-t"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              <SessionCompletionButton
                journeyId={journeyId}
                dayNumber={dayNumber}
                sessionType="daily"
                sessionIndex={0}
                accentColor={BRAND_ACCENT}
                accentGlow={BRAND_GLOW}
                onComplete={() => {
                  window.dispatchEvent(
                    new CustomEvent('session-completed', {
                      detail: { journeyId, dayNumber },
                    })
                  );
                }}
              />
            </motion.div>
          )}
        </div>
      </div>

      {showTomorrowPreview && (
        <BrandTomorrowPreview nextDay={nextDay} onPreview={onPreviewDay} />
      )}
    </div>
  );
}
