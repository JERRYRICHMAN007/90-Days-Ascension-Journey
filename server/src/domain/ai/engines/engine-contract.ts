import type { AIContextPackage } from '../entities/ai-context-manifest';
import type { LifeId } from '../value-objects/ids';
import type { AITriggerKey } from '../value-objects/ids';
import { AIContextScope, AIEngineKind, AIInteractionPoint } from '../value-objects/enums';
import type { EnginePermissionContract } from '../boundaries/permission-matrix';
import type { AIMemoryModel } from '../memory/memory-model';
import type { CreateAIInsightDraft } from '../entities/ai-insight';
import type { AIProposal } from '../entities/ai-proposal';
import type { AIRecommendation } from '../entities/ai-recommendation';
import type { AIFailure } from '../entities/ai-trust-and-invocation';

/** Shared engine contract (Master AI Architecture §4–§11). */

export interface EngineInputContract {
  readonly lifeId: LifeId;
  readonly triggerKey: AITriggerKey;
  readonly interactionPoint: AIInteractionPoint;
  readonly context: AIContextPackage;
  readonly memory: AIMemoryModel;
}

export interface EngineOutputContract {
  readonly insightDrafts: readonly CreateAIInsightDraft[];
  readonly proposalDrafts: readonly Omit<AIProposal, 'id' | 'createdAt' | 'status' | 'decision'>[];
  readonly recommendations: readonly AIRecommendation[];
  readonly failures: readonly AIFailure[];
}

export interface EngineDependencyContract {
  readonly dependsOn: readonly AIEngineKind[];
  readonly optionalDependsOn?: readonly AIEngineKind[];
}

export interface AIEngineModule {
  readonly kind: AIEngineKind;
  readonly purpose: string;
  readonly masterArchitectureSection: string;
  readonly permissions: EnginePermissionContract;
  readonly dependencies: EngineDependencyContract;
  /** Future implementations plug in here — not LLM. */
  execute(input: EngineInputContract): Promise<EngineOutputContract>;
}

export interface ContextManagementEngineContract extends AIEngineModule {
  readonly kind: AIEngineKind.ContextManagement;
  buildPackage(params: {
    lifeId: LifeId;
    scope: AIContextScope;
    interactionPoint: AIInteractionPoint;
    triggerKey: AITriggerKey;
    citationBudget: number;
  }): Promise<AIContextPackage>;
}

export interface MemoryEngineContract extends AIEngineModule {
  readonly kind: AIEngineKind.Memory;
  loadMemory(lifeId: LifeId, scope: AIContextScope): Promise<AIMemoryModel>;
}

export interface PatternDetectionOutput extends EngineOutputContract {
  readonly signalEmissionRequests: readonly InterconnectionSignalEmissionRequest[];
}

export interface InterconnectionSignalEmissionRequest {
  readonly fromDomainKey: string;
  readonly toDomainKey: string;
  readonly signalType: string;
  readonly severity: string;
  readonly evidenceRefs: readonly import('../value-objects/evidence-reference').AIEvidenceReference[];
  readonly patternKind: import('../value-objects/enums').PatternSignalKind;
  readonly windowLabel: string;
}

export interface PatternDetectionEngineContract extends AIEngineModule {
  readonly kind: AIEngineKind.PatternDetection;
  execute(input: EngineInputContract): Promise<PatternDetectionOutput>;
}
