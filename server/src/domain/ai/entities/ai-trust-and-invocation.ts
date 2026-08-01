import type { AITrustEventId, LifeId } from '../value-objects/ids';
import { AITrustEventKind } from '../value-objects/enums';

export interface AITrustEvent {
  readonly id: AITrustEventId;
  readonly lifeId: LifeId;
  readonly kind: AITrustEventKind;
  readonly occurredAt: Date;
  readonly subjectType: string;
  readonly subjectId: string;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly manifestHash?: string;
}

export interface AIRetraction {
  readonly insightId: string;
  readonly retractedAt: Date;
  readonly reason: string;
  readonly voidedCitationEntityIds: readonly string[];
  readonly invalidatedProposalIds: readonly string[];
}

export interface AIFailure {
  readonly failureKind: import('../value-objects/enums').AIFailureKind;
  readonly message: string;
  readonly interactionPoint?: string;
  readonly recoverable: boolean;
  readonly suggestedNextStep?: string;
  readonly occurredAt: Date;
}

export interface AIEngineInvocation {
  readonly id: import('../value-objects/ids').AIEngineInvocationId;
  readonly engine: import('../value-objects/enums').AIEngineKind;
  readonly triggerKey: string;
  readonly lifeId: LifeId;
  readonly startedAt: Date;
  readonly completedAt?: Date;
  readonly insightIds: readonly string[];
  readonly proposalIds: readonly string[];
  readonly failure?: AIFailure;
}

export interface AITriggerDefinition {
  readonly triggerKey: import('../value-objects/ids').AITriggerKey;
  readonly interactionPoint: import('../value-objects/enums').AIInteractionPoint;
  readonly scope: import('../value-objects/enums').AIContextScope;
  readonly minimumConfidence: import('../value-objects/enums').AIInsightConfidence;
  readonly roles: readonly import('../value-objects/enums').AIRoleKind[];
  readonly engines: readonly import('../value-objects/enums').AIEngineKind[];
  readonly priority: import('../value-objects/enums').AIRecommendationPriority;
  readonly notificationEligible: boolean;
}
