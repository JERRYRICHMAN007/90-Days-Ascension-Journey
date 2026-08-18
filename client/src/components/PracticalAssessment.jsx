import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Code,
  GitBranch,
  FileText,
  Camera,
  Lightbulb,
  Lock,
  Trophy,
} from 'lucide-react';
import {
  getAssessmentResult,
  saveAssessmentResult,
} from '../utils/quizResults.js';

function ChecklistItem({ done, locked, label, onToggle }) {
  return (
    <button
      type="button"
      disabled={locked}
      onClick={onToggle}
      className="w-full flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors disabled:opacity-80"
      style={{
        background: done
          ? 'color-mix(in srgb, var(--neon-green) 10%, var(--bg-elevated))'
          : 'var(--bg-elevated)',
        borderColor: done
          ? 'color-mix(in srgb, var(--neon-green) 35%, var(--border-subtle))'
          : 'var(--border-subtle)',
      }}
    >
      {done ? (
        <CheckCircle2 className="size-4 mt-0.5 shrink-0 text-[var(--neon-green)]" />
      ) : (
        <Circle className="size-4 mt-0.5 shrink-0 text-[var(--text-muted)]" />
      )}
      <span
        className={`text-sm flex-1 ${done ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}
      >
        {label}
      </span>
    </button>
  );
}

export default function PracticalAssessment({
  assessment,
  journeyId,
  dayNumber,
  onComplete,
  accentColor = 'var(--neon-green)',
}) {
  const saved = useMemo(() => {
    if (journeyId == null || dayNumber == null) return null;
    return getAssessmentResult(journeyId, dayNumber);
  }, [journeyId, dayNumber]);

  const [completedItems, setCompletedItems] = useState([]);
  const [submissionItems, setSubmissionItems] = useState([]);
  const [locked, setLocked] = useState(Boolean(saved));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const refresh = () => setTick((t) => t + 1);
    window.addEventListener('assessment-results-updated', refresh);
    return () => window.removeEventListener('assessment-results-updated', refresh);
  }, []);

  useEffect(() => {
    void tick;
    if (journeyId == null || dayNumber == null) return;
    if (getAssessmentResult(journeyId, dayNumber)) setLocked(true);
  }, [journeyId, dayNumber, tick]);

  if (!assessment) {
    return (
      <div
        className="rounded-xl border p-8 text-center text-sm text-[var(--text-muted)]"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        No practical assessment available for today
      </div>
    );
  }

  const reqCount = assessment.requirements?.length || 0;
  const subCount = assessment.submission?.checklist?.length || 0;
  const allRequirementsMet = completedItems.length === reqCount && reqCount > 0;
  const allSubmissionReady = subCount === 0 || submissionItems.length === subCount;
  const canSubmit = !locked && allRequirementsMet && allSubmissionReady;

  const toggleRequirement = (index) => {
    if (locked) return;
    setCompletedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleSubmission = (index) => {
    if (locked) return;
    setSubmissionItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const payload = {
      dayNumber: assessment.dayNumber ?? dayNumber,
      requirementsCompleted: completedItems.length,
      submissionReady: submissionItems.length,
      completedAt: new Date().toISOString(),
    };
    if (journeyId != null && dayNumber != null) {
      saveAssessmentResult(journeyId, dayNumber, payload);
    }
    setLocked(true);
    onComplete?.(payload);
  };

  if (locked) {
    return (
      <div
        className="rounded-xl border p-5 sm:p-6 text-center"
        style={{
          background: 'var(--bg-card)',
          borderColor: `color-mix(in srgb, ${accentColor} 40%, var(--border-subtle))`,
        }}
      >
        <Trophy className="size-12 mx-auto mb-3" style={{ color: accentColor }} />
        <h2 className="text-xl font-bold mb-1" style={{ color: accentColor }}>
          Assessment complete
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mb-3">
          Recorded for Day {dayNumber ?? assessment.dayNumber}. This assessment is locked.
        </p>
        <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
          <Lock className="size-3" />
          No retake
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
      >
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">{assessment.title}</h3>
          {assessment.description && (
            <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-relaxed">
              {assessment.description}
            </p>
          )}
        </div>

        <div className="p-3 sm:p-4 space-y-3">
          {assessment.cumulative && assessment.buildingOn && (
            <div
              className="flex items-start gap-2 rounded-lg border px-3 py-2 text-xs"
              style={{
                borderColor: 'color-mix(in srgb, #a78bfa 35%, var(--border-subtle))',
                background: 'color-mix(in srgb, #a78bfa 8%, transparent)',
                color: '#c4b5fd',
              }}
            >
              <GitBranch className="size-3.5 mt-0.5 shrink-0" />
              <span>{assessment.buildingOn.message}</span>
            </div>
          )}

          {assessment.todaySkills?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
                <Lightbulb className="size-3" style={{ color: accentColor }} />
                Skills today
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {assessment.todaySkills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border px-3 py-2"
                    style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}
                  >
                    <p className="text-[10px] font-bold" style={{ color: accentColor }}>
                      {skill.discipline}
                    </p>
                    <p className="text-xs font-semibold text-[var(--text-primary)]">{skill.skill}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {assessment.todayProject && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
                <Code className="size-3" style={{ color: accentColor }} />
                {assessment.todayProject.title}
              </p>
              {assessment.todayProject.description && (
                <p className="text-[11px] text-[var(--text-secondary)] mb-2 leading-relaxed">
                  {assessment.todayProject.description}
                </p>
              )}
              <div className="space-y-1.5">
                {assessment.requirements?.map((req, idx) => (
                  <ChecklistItem
                    key={idx}
                    done={completedItems.includes(idx)}
                    locked={locked}
                    label={req}
                    onToggle={() => toggleRequirement(idx)}
                  />
                ))}
              </div>
            </div>
          )}

          {assessment.submission?.checklist?.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
                <FileText className="size-3" style={{ color: accentColor }} />
                Submission checklist
              </p>
              <div className="space-y-1.5">
                {assessment.submission.checklist.map((item, idx) => (
                  <ChecklistItem
                    key={idx}
                    done={submissionItems.includes(idx)}
                    locked={locked}
                    label={item}
                    onToggle={() => toggleSubmission(idx)}
                  />
                ))}
              </div>
              {assessment.submission.deliverables?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {assessment.submission.deliverables.map((d, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-md border text-[var(--text-secondary)]"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      {d.includes('GitHub') && <GitBranch className="size-3" />}
                      {d.includes('Screenshot') && <Camera className="size-3" />}
                      {d.includes('README') && <FileText className="size-3" />}
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="w-full rounded-xl py-3 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: canSubmit ? accentColor : 'var(--bg-elevated)',
          color: canSubmit ? '#000' : 'var(--text-muted)',
        }}
      >
        {canSubmit
          ? 'Mark assessment complete'
          : `Complete ${Math.max(0, reqCount - completedItems.length)} more requirement(s)`}
      </button>
    </div>
  );
}
