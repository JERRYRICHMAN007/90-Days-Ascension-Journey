import type { AIInsight } from '../entities/ai-insight';
import type { AIRetraction } from '../entities/ai-trust-and-invocation';
import { AIInsightStatus } from '../value-objects/enums';

export class RetractionService {
  buildRetraction(params: {
    insight: AIInsight;
    reason: string;
    voidedCitationEntityIds: readonly string[];
    invalidatedProposalIds: readonly string[];
  }): { insight: AIInsight; retraction: AIRetraction } {
    const insight: AIInsight = {
      ...params.insight,
      status: AIInsightStatus.Retracted,
      retractedAt: new Date(),
      retractionReason: params.reason,
    };
    const retraction: AIRetraction = {
      insightId: params.insight.id as string,
      retractedAt: new Date(),
      reason: params.reason,
      voidedCitationEntityIds: params.voidedCitationEntityIds,
      invalidatedProposalIds: params.invalidatedProposalIds,
    };
    return { insight, retraction };
  }
}
