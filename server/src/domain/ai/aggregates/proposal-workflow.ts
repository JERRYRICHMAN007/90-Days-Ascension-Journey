import type { AIProposal, AdaptationApplication } from '../entities/ai-proposal';
import { AIProposalStatus } from '../value-objects/enums';
import { ProposalValidationService } from '../validation/insight-and-proposal-validation';
import { asAdaptationApplicationId, type LifeId, type UserId } from '../value-objects/ids';
import { randomUUID } from 'crypto';

/**
 * Proposal workflow aggregate logic (Master AI Architecture §0.3).
 * AIProposal → Human Acceptance → AdaptationApplication
 * No engine may bypass human accept.
 */
export class ProposalWorkflowService {
  constructor(private readonly proposalValidator = new ProposalValidationService()) {}

  accept(params: {
    proposal: AIProposal;
    userId: UserId;
    systemVersionBefore?: string;
    systemVersionAfter?: string;
    notes?: string;
  }): { proposal: AIProposal; application: AdaptationApplication } {
    this.proposalValidator.assertAcceptable(params.proposal);

    const decision = {
      decidedAt: new Date(),
      decidedByUserId: params.userId as string,
      status: AIProposalStatus.Accepted as const,
    };

    const proposal: AIProposal = {
      ...params.proposal,
      status: AIProposalStatus.Accepted,
      decision,
    };

    const application: AdaptationApplication = {
      id: asAdaptationApplicationId(randomUUID()),
      lifeId: params.proposal.lifeId,
      proposalId: params.proposal.id,
      sourceInsightId: params.proposal.insightId,
      appliedAt: new Date(),
      systemVersionBefore: params.systemVersionBefore,
      systemVersionAfter: params.systemVersionAfter,
      notes: params.notes,
    };

    return { proposal, application };
  }

  reject(proposal: AIProposal, userId: UserId, reason?: string): AIProposal {
    if (proposal.status !== AIProposalStatus.Proposed) {
      throw new Error('Only proposed proposals may be rejected');
    }
    return {
      ...proposal,
      status: AIProposalStatus.Rejected,
      decision: {
        decidedAt: new Date(),
        decidedByUserId: userId as string,
        status: AIProposalStatus.Rejected,
        reason,
      },
    };
  }
}
