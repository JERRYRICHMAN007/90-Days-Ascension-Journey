/**
 * Aether OS V2 — AI Governing Laws (Master AI Architecture §0)
 * Binding constants for the AI bounded context.
 */

export const AI_GOVERNING_LAW_IDS = [
  'EVIDENCE_PRIMACY',
  'EXECUTION_OVER_INTENTION',
  'PROPOSALS_NOT_DECREES',
  'NO_MASTERY_GRANTS',
  'SCOREBOARD_INTEGRITY',
  'SHRINK_DONT_SKIP',
  'INTERCONNECTION_TRUTH',
  'CLARITY_OVER_COMPLETENESS',
  'LONG_TERM_IDENTITY',
  'ETHICAL_STANCE',
] as const;

export type AIGoverningLawId = (typeof AI_GOVERNING_LAW_IDS)[number];

export const AI_GOVERNING_LAWS: Record<
  AIGoverningLawId,
  { summary: string; masterRef: string }
> = {
  EVIDENCE_PRIMACY: {
    summary: 'Claims require citations or must not be stated as fact.',
    masterRef: 'Master AI Architecture §0.1',
  },
  EXECUTION_OVER_INTENTION: {
    summary: 'Optimize Sessions and Systems, not intention objects.',
    masterRef: 'Master AI Architecture §0.2',
  },
  PROPOSALS_NOT_DECREES: {
    summary: 'Steer changes via AIProposal → human accept → AdaptationApplication.',
    masterRef: 'Master AI Architecture §0.3',
  },
  NO_MASTERY_GRANTS: {
    summary: 'AI cannot write MasteryState, MasteryDelta, or LifeScore.',
    masterRef: 'Master AI Architecture §0.4',
  },
  SCOREBOARD_INTEGRITY: {
    summary: 'No inflation, clock-complete, or fake manual complete encouragement.',
    masterRef: 'Master AI Architecture §0.5',
  },
  SHRINK_DONT_SKIP: {
    summary: 'Recommend predefined shrink tiers under load.',
    masterRef: 'Master AI Architecture §0.6',
  },
  INTERCONNECTION_TRUTH: {
    summary: 'Cross-domain coupling with evidence; no isolated-app fiction.',
    masterRef: 'Master AI Architecture §0.7',
  },
  CLARITY_OVER_COMPLETENESS: {
    summary: 'Reduce WIP and sprawl; never expand for helpfulness.',
    masterRef: 'Master AI Architecture §0.8',
  },
  LONG_TERM_IDENTITY: {
    summary: 'Serve decades-long becoming, not engagement metrics.',
    masterRef: 'Master AI Architecture §0.9',
  },
  ETHICAL_STANCE: {
    summary: 'No captivity, guilt storms, or dark patterns.',
    masterRef: 'Master AI Architecture §0.10',
  },
};
