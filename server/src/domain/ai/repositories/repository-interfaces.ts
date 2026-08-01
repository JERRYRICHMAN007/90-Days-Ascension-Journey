import type { AIInsight } from '../entities/ai-insight';
import type { AIProposal } from '../entities/ai-proposal';
import type { AITrustEvent, AIRetraction } from '../entities/ai-trust-and-invocation';
import type { AdaptationApplication } from '../entities/ai-proposal';
import type { AIInsightId, LifeId, AIProposalId } from '../value-objects/ids';
import { AIInsightStatus } from '../value-objects/enums';

export interface AIInsightRepository {
  save(insight: AIInsight): Promise<void>;
  findById(id: AIInsightId): Promise<AIInsight | null>;
  listByLife(lifeId: LifeId, filter?: { status?: AIInsightStatus }): Promise<readonly AIInsight[]>;
}

export interface AIProposalRepository {
  save(proposal: AIProposal): Promise<void>;
  findById(id: AIProposalId): Promise<AIProposal | null>;
}

export interface AdaptationApplicationRepository {
  save(application: AdaptationApplication): Promise<void>;
}

export interface AITrustEventRepository {
  append(event: AITrustEvent): Promise<void>;
  listBySubject(subjectType: string, subjectId: string): Promise<readonly AITrustEvent[]>;
}

export interface EvidenceExistencePort {
  /** Infrastructure adapter: verify cited entities exist */
  exists(ref: import('../value-objects/evidence-reference').AIEvidenceReference): Promise<boolean>;
}

export interface RetractionPort {
  markRetracted(retraction: AIRetraction): Promise<void>;
  voidProposalIds(proposalIds: readonly string[]): Promise<void>;
}
