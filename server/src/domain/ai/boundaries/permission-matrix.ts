/**
 * Architectural constraints — Master AI Architecture §13 Deny list.
 */

export enum ForbiddenWriteTarget {
  MasteryState = 'MasteryState',
  MasteryDelta = 'MasteryDelta',
  LifeScore = 'LifeScore',
  SessionState = 'SessionState',
  SessionEvidence = 'SessionEvidence',
  LegacyRecordEvidenceSection = 'LegacyRecordEvidenceSection',
  SeasonActivateDomain = 'SeasonActivateDomain',
  Achievement = 'Achievement',
}

export enum AllowedAIWriteTarget {
  AIInsight = 'AIInsight',
  AIProposal = 'AIProposal',
  AITrustEvent = 'AITrustEvent',
  AIEngineInvocation = 'AIEngineInvocation',
  AIInteraction = 'AIInteraction',
  InterconnectionSignal = 'InterconnectionSignal',
}

export interface EnginePermissionContract {
  readonly engine: import('../value-objects/enums').AIEngineKind;
  readonly allowedWrites: readonly AllowedAIWriteTarget[];
  readonly forbiddenWrites: readonly ForbiddenWriteTarget[];
  readonly maySpawnProposal: boolean;
  readonly mayAcceptProposal: false;
  readonly mayExplainLifeScore: boolean;
  readonly mayWriteLifeScore: false;
  readonly mayCompleteSession: false;
}

export const GLOBAL_AI_FORBIDDEN_WRITES: readonly ForbiddenWriteTarget[] = [
  ForbiddenWriteTarget.MasteryState,
  ForbiddenWriteTarget.MasteryDelta,
  ForbiddenWriteTarget.LifeScore,
  ForbiddenWriteTarget.SessionState,
  ForbiddenWriteTarget.SessionEvidence,
  ForbiddenWriteTarget.LegacyRecordEvidenceSection,
  ForbiddenWriteTarget.SeasonActivateDomain,
  ForbiddenWriteTarget.Achievement,
];

export class AIBoundaryViolationError extends Error {
  readonly code = 'AI_BOUNDARY_VIOLATION';
  constructor(message: string) {
    super(message);
    this.name = 'AIBoundaryViolationError';
  }
}
