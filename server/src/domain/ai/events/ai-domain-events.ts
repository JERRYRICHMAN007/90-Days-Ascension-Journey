import type { AIInsightId, AIProposalId, LifeId } from '../value-objects/ids';

export type AIDomainEvent =
  | { type: 'AIInsightGenerated'; lifeId: LifeId; insightId: AIInsightId }
  | { type: 'AIInsightDelivered'; lifeId: LifeId; insightId: AIInsightId }
  | { type: 'AIInsightRetracted'; lifeId: LifeId; insightId: AIInsightId; reason: string }
  | { type: 'AIProposalProposed'; lifeId: LifeId; proposalId: AIProposalId }
  | { type: 'AIProposalAccepted'; lifeId: LifeId; proposalId: AIProposalId }
  | { type: 'AIProposalRejected'; lifeId: LifeId; proposalId: AIProposalId }
  | { type: 'AdaptationApplied'; lifeId: LifeId; proposalId: AIProposalId; applicationId: string }
  | { type: 'AIBoundaryDenied'; lifeId: LifeId; reason: string }
  | { type: 'InterconnectionSignalRequested'; lifeId: LifeId; signalKey: string };
