import { motion } from 'framer-motion';
import { RotateCcw, User, Building2, Layers } from 'lucide-react';
import { FlipCard3D } from '../ui/FlipCard3D';
import { SessionCompletionButton } from '../SessionCompletionButton';
import { BrandTomorrowPreview } from './BrandTomorrowPreview';
import { JourneyDailyFlow, FlowCardFace, FlowCardBack } from './JourneyDailyFlow';
import { isTomorrow } from '../../utils/dates';

const BRAND_ACCENT = '#00e5ff';
const BRAND_GLOW = 'var(--neon-glow-cyan)';

function BrandStreamCard({ label, task, icon: Icon, streamTag }) {
  const preview = task.length > 85 ? `${task.slice(0, 85)}…` : task;

  return (
    <FlipCard3D
      size="flow"
      className="w-full max-w-none"
      ariaLabel={`${label}: ${task}`}
      front={
        <FlowCardFace
          icon={Icon}
          badge={streamTag}
          accentColor={BRAND_ACCENT}
          eyebrow={label}
          title={preview}
          hint={
            <>
              <RotateCcw className="size-2.5" /> Tap for full task
            </>
          }
        />
      }
      back={
        <FlowCardBack eyebrow={label} accentColor={BRAND_ACCENT}>
          <p>{task}</p>
        </FlowCardBack>
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

  const title = focus || focusLabel;
  const labelParts = [focusLabel !== title ? focusLabel : null, theme ? `Theme · ${theme}` : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="space-y-3 min-w-0">
      <JourneyDailyFlow
        icon={Layers}
        title={title}
        label={labelParts || 'Brand flow · personal + company'}
        accentColor={BRAND_ACCENT}
        columns={personal && company ? 2 : 1}
        footer={
          dayNumber !== undefined && hasTasks && !previewingTomorrow ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
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
          ) : null
        }
      >
        {personal && (
          <BrandStreamCard
            streamTag="01"
            label="Personal Brand"
            task={personal}
            icon={User}
          />
        )}
        {company && (
          <BrandStreamCard
            streamTag={personal ? '02' : '01'}
            label="Company Brand"
            task={company}
            icon={Building2}
          />
        )}
      </JourneyDailyFlow>

      {outcome && (
        <div
          className="rounded-xl border px-3.5 py-2.5"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: BRAND_ACCENT }}>
            Expected outcome
          </p>
          <p className="text-xs text-[var(--text-primary)] leading-relaxed">{outcome}</p>
        </div>
      )}

      {showTomorrowPreview && (
        <BrandTomorrowPreview nextDay={nextDay} onPreview={onPreviewDay} />
      )}
    </div>
  );
}
