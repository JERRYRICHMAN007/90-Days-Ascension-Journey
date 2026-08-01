import type { AIInsightId, LifeId, SeasonId } from '../value-objects/ids';
import type { AIEvidenceReference } from '../value-objects/evidence-reference';
import type { AIContextManifest } from './ai-context-manifest';
import {
  AIEngineKind,
  AIInsightConfidence,
  AIInsightStatus,
  AIInteractionPoint,
  AIRoleKind,
  AIValidationResult,
} from '../value-objects/enums';

export interface AIInsight {
  readonly id: AIInsightId;
  readonly lifeId: LifeId;
  readonly seasonId?: SeasonId;
  readonly summary: string;
  readonly status: AIInsightStatus;
  readonly citations: readonly AIEvidenceReference[];
  readonly factualClaims: readonly { claimId: string; statement: string; requiresCitation: boolean; citationIds: readonly string[] }[];
  readonly contextManifest: AIContextManifest;
  readonly interactionPoint: AIInteractionPoint;
  readonly triggerKey: string;
  readonly dominantRole: AIRoleKind;
  readonly roleMix: readonly AIRoleKind[];
  readonly engines: readonly AIEngineKind[];
  readonly confidence: AIInsightConfidence;
  readonly validationResult: AIValidationResult;
  readonly domainKeys: readonly string[];
  readonly proposalIds: readonly string[];
  readonly createdAt: Date;
  readonly deliveredAt?: Date;
  readonly retractedAt?: Date;
  readonly retractionReason?: string;
  readonly expiresAt?: Date;
}

export interface CreateAIInsightDraft {
  lifeId: LifeId;
  seasonId?: SeasonId;
  summary: string;
  citations: readonly AIEvidenceReference[];
  factualClaims: AIInsight['factualClaims'];
  contextManifest: AIContextManifest;
  interactionPoint: AIInteractionPoint;
  triggerKey: string;
  dominantRole: AIRoleKind;
  roleMix?: readonly AIRoleKind[];
  engines: readonly AIEngineKind[];
  confidence: AIInsightConfidence;
  domainKeys?: readonly string[];
  expiresAt?: Date;
}
