import type { AIProposalId, LifeId, SeasonId } from '../value-objects/ids';
import type { AIEvidenceReference } from '../value-objects/evidence-reference';
import type { AIProposalType } from '../constants/proposal-types';
import { AIProposalStatus } from '../value-objects/enums';

export interface AIProposalTarget {
  readonly targetType: string;
  readonly targetId: string;
  readonly domainKey?: string;
}

export interface AIProposalDecision {
  readonly decidedAt: Date;
  readonly decidedByUserId: string;
  readonly status: AIProposalStatus.Accepted | AIProposalStatus.Rejected | AIProposalStatus.Withdrawn;
  readonly reason?: string;
}

export interface AIProposal {
  readonly id: AIProposalId;
  readonly lifeId: LifeId;
  readonly seasonId?: SeasonId;
  readonly proposalType: AIProposalType;
  readonly target: AIProposalTarget;
  readonly rationale: string;
  readonly citations: readonly AIEvidenceReference[];
  readonly status: AIProposalStatus;
  readonly insightId?: string;
  readonly diffSummary?: string;
  readonly expiresAt?: Date;
  readonly createdAt: Date;
  readonly decision?: AIProposalDecision;
}

/** Data Model §5.6 — immutable after accept */
export interface AdaptationApplication {
  readonly id: import('../value-objects/ids').AdaptationApplicationId;
  readonly lifeId: LifeId;
  readonly proposalId: AIProposalId;
  readonly sourceInsightId?: string;
  readonly appliedAt: Date;
  readonly systemVersionBefore?: string;
  readonly systemVersionAfter?: string;
  readonly notes?: string;
}
