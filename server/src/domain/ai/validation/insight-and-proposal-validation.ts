import type { CreateAIInsightDraft, AIInsight } from '../entities/ai-insight';
import type { AIProposal } from '../entities/ai-proposal';
import { isIllegalProposalType } from '../constants/proposal-types';
import { validateFactualClaims } from '../citations/citation-framework';
import {
  AIInsightStatus,
  AIProposalStatus,
  AIValidationResult,
} from '../value-objects/enums';
import type { DeliverableAIInsight } from '../citations/citation-framework';
import { asAIInsightId } from '../value-objects/ids';
import { randomUUID } from 'crypto';

export class InsightValidationService {
  validateDraft(draft: CreateAIInsightDraft): {
    result: AIValidationResult;
    errors: string[];
  } {
    const citationCheck = validateFactualClaims(draft.factualClaims, draft.citations);
    if (draft.summary.match(/\b(completed|mastery|score increased)\b/i) && draft.citations.length === 0) {
      return { result: AIValidationResult.Blocked, errors: ['Progress language requires citations'] };
    }
    if (!citationCheck.valid) {
      const hasUncited = citationCheck.uncitedClaimIds.length > 0;
      return {
        result: hasUncited ? AIValidationResult.Blocked : AIValidationResult.Refusal,
        errors: [...citationCheck.errors],
      };
    }
    if (draft.factualClaims.some((c) => c.requiresCitation && c.citationIds.length === 0)) {
      return { result: AIValidationResult.PassWithHypothesis, errors: [] };
    }
    return { result: AIValidationResult.Pass, errors: [] };
  }

  materialize(draft: CreateAIInsightDraft, validation: AIValidationResult): AIInsight {
    return {
      id: asAIInsightId(randomUUID()),
      ...draft,
      status: AIInsightStatus.Generated,
      roleMix: draft.roleMix ?? [draft.dominantRole],
      domainKeys: draft.domainKeys ?? [],
      proposalIds: [],
      validationResult: validation,
      createdAt: new Date(),
    };
  }
}

/** Delivery gate — only path to DeliverableAIInsight */
export class InsightDeliveryGate {
  constructor(private readonly validator = new InsightValidationService()) {}

  pass(draft: CreateAIInsightDraft): DeliverableAIInsight<AIInsight> {
    const { result, errors } = this.validator.validateDraft(draft);
    if (result === AIValidationResult.Blocked || result === AIValidationResult.Refusal) {
      throw new InsightNotDeliverableError(errors);
    }
    const insight = this.validator.materialize(draft, result);
    return insight as DeliverableAIInsight<AIInsight>;
  }
}

export class InsightNotDeliverableError extends Error {
  readonly code = 'INSIGHT_NOT_DELIVERABLE';
  constructor(public readonly validationErrors: readonly string[]) {
    super(validationErrors.join('; '));
  }
}

export class ProposalValidationService {
  validate(proposal: Pick<AIProposal, 'proposalType' | 'citations' | 'rationale'>): void {
    if (isIllegalProposalType(proposal.proposalType)) {
      throw new IllegalProposalError(proposal.proposalType);
    }
    if (proposal.citations.length === 0 && proposal.proposalType.startsWith('system.')) {
      throw new ProposalValidationError('System proposals require citations');
    }
  }

  assertAcceptable(proposal: AIProposal): void {
    this.validate(proposal);
    if (proposal.status !== AIProposalStatus.Proposed) {
      throw new ProposalValidationError(`Cannot accept proposal in status ${proposal.status}`);
    }
    if (proposal.expiresAt && proposal.expiresAt < new Date()) {
      throw new ProposalValidationError('Proposal expired');
    }
  }
}

export class IllegalProposalError extends Error {
  readonly code = 'ILLEGAL_PROPOSAL_TYPE';
  constructor(public readonly proposalType: string) {
    super(`Illegal proposal type: ${proposalType}`);
  }
}

export class ProposalValidationError extends Error {
  readonly code = 'PROPOSAL_VALIDATION_FAILED';
  constructor(message?: string) {
    super(message ?? 'Proposal validation failed');
  }
}
