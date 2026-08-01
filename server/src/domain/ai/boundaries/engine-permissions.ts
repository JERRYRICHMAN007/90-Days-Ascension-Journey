import { AIEngineKind } from '../value-objects/enums';
import {
  AllowedAIWriteTarget,
  EnginePermissionContract,
  ForbiddenWriteTarget,
  GLOBAL_AI_FORBIDDEN_WRITES,
  AIBoundaryViolationError,
} from './permission-matrix';

export { AIBoundaryViolationError, ForbiddenWriteTarget, AllowedAIWriteTarget, GLOBAL_AI_FORBIDDEN_WRITES };

export function defaultPermissionContract(engine: AIEngineKind): EnginePermissionContract {
  const base: EnginePermissionContract = {
    engine,
    allowedWrites: [
      AllowedAIWriteTarget.AIInsight,
      AllowedAIWriteTarget.AITrustEvent,
      AllowedAIWriteTarget.AIEngineInvocation,
    ],
    forbiddenWrites: GLOBAL_AI_FORBIDDEN_WRITES,
    maySpawnProposal: false,
    mayAcceptProposal: false,
    mayExplainLifeScore: false,
    mayWriteLifeScore: false,
    mayCompleteSession: false,
  };

  switch (engine) {
    case AIEngineKind.Coaching:
      return { ...base, maySpawnProposal: true };
    case AIEngineKind.Recommendation:
    case AIEngineKind.Planning:
      return {
        ...base,
        allowedWrites: [...base.allowedWrites, AllowedAIWriteTarget.AIProposal],
        maySpawnProposal: true,
      };
    case AIEngineKind.PatternDetection:
      return {
        ...base,
        allowedWrites: [...base.allowedWrites, AllowedAIWriteTarget.InterconnectionSignal],
      };
    case AIEngineKind.LifeScoreIntelligence:
      return { ...base, mayExplainLifeScore: true };
    default:
      return base;
  }
}

export function assertWriteAllowed(
  contract: EnginePermissionContract,
  target: ForbiddenWriteTarget | AllowedAIWriteTarget,
): void {
  if (GLOBAL_AI_FORBIDDEN_WRITES.includes(target as ForbiddenWriteTarget)) {
    throw new AIBoundaryViolationError(`Write forbidden by architecture: ${target}`);
  }
  if (!contract.allowedWrites.includes(target as AllowedAIWriteTarget)) {
    throw new AIBoundaryViolationError(`Engine ${contract.engine} not permitted to write ${target}`);
  }
}
