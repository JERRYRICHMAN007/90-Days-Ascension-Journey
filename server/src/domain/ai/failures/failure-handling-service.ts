import type { AIFailure } from '../entities/ai-trust-and-invocation';
import { AIFailureKind } from '../value-objects/enums';

export interface FailureHandlingResult {
  readonly failure: AIFailure;
  readonly userMessageClass: 'GAP' | 'REFUSAL' | 'SOFT_TONE' | 'SHRINK_COUNSEL';
  readonly legalNextStep?: string;
}

export class FailureHandlingService {
  handle(kind: AIFailureKind, detail?: string): FailureHandlingResult {
    switch (kind) {
      case AIFailureKind.InsufficientEvidence:
        return {
          failure: this.fail(kind, detail, true, 'Complete one minimum faithful Session or Weekly Review.'),
          userMessageClass: 'GAP',
          legalNextStep: 'OPERATE_MINIMUM_SESSION',
        };
      case AIFailureKind.BoundaryViolation:
      case AIFailureKind.PromptInjection:
      case AIFailureKind.IllegalProposalType:
        return {
          failure: this.fail(kind, detail, true, 'Request denied by OS boundaries.'),
          userMessageClass: 'REFUSAL',
        };
      case AIFailureKind.UserDistress:
        return {
          failure: this.fail(kind, detail, true),
          userMessageClass: 'SOFT_TONE',
          legalNextStep: 'OPTIONAL_REFLECTION',
        };
      case AIFailureKind.SystemOverload:
        return {
          failure: this.fail(kind, detail, true, 'Shrink tier on non-negotiables.'),
          userMessageClass: 'SHRINK_COUNSEL',
          legalNextStep: 'SHRINK_SESSION',
        };
      default:
        return {
          failure: this.fail(kind, detail, true),
          userMessageClass: 'GAP',
        };
    }
  }

  private fail(kind: AIFailureKind, detail: string | undefined, recoverable: boolean, suggested?: string): AIFailure {
    return {
      failureKind: kind,
      message: detail ?? kind,
      recoverable,
      suggestedNextStep: suggested,
      occurredAt: new Date(),
    };
  }
}
