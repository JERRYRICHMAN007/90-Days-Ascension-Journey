import type { AIRecommendationPriority } from '../value-objects/enums';
import type { AIEvidenceReference } from '../value-objects/evidence-reference';
import type { AIProposalType } from '../constants/proposal-types';

export enum AIRecommendationReason {
  NonNegotiableDue = 'NON_NEGOTIABLE_DUE',
  OverloadShrink = 'OVERLOAD_SHRINK',
  PatternDetected = 'PATTERN_DETECTED',
  WipCapExceeded = 'WIP_CAP_EXCEEDED',
  ReviewDue = 'REVIEW_DUE',
  SeasonCloseDue = 'SEASON_CLOSE_DUE',
  InterconnectionRisk = 'INTERCONNECTION_RISK',
  HoldCourse = 'HOLD_COURSE',
  EvidenceGap = 'EVIDENCE_GAP',
  UserRequest = 'USER_REQUEST',
}

export interface AIRecommendation {
  readonly recommendationId: string;
  readonly priority: AIRecommendationPriority;
  readonly reason: AIRecommendationReason;
  readonly summary: string;
  readonly domainKey?: string;
  readonly citations: readonly AIEvidenceReference[];
  readonly proposalType?: AIProposalType;
  readonly legalCommandKey?: string;
}
