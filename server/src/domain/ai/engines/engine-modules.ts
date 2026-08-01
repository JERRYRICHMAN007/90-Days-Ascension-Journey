import { AIEngineKind } from '../value-objects/enums';
import { defaultPermissionContract } from '../boundaries/engine-permissions';
import type {
  AIEngineModule,
  EngineDependencyContract,
  EngineInputContract,
  EngineOutputContract,
} from './engine-contract';

export class ArchitectureOnlyEngineError extends Error {
  readonly code = 'AI_ENGINE_NOT_IMPLEMENTED';
  constructor(kind: AIEngineKind) {
    super(`Engine ${kind} is architecture-only; plug implementation at application layer.`);
  }
}

function defineEngine(
  kind: AIEngineKind,
  purpose: string,
  section: string,
  dependencies: EngineDependencyContract,
): AIEngineModule {
  return {
    kind,
    purpose,
    masterArchitectureSection: section,
    permissions: defaultPermissionContract(kind),
    dependencies,
    async execute(_input: EngineInputContract): Promise<EngineOutputContract> {
      throw new ArchitectureOnlyEngineError(kind);
    },
  };
}

export const CoachingEngineModule = defineEngine(
  AIEngineKind.Coaching,
  'Orchestrate roles; emit AIInsight and optional AIProposal.',
  'Master AI Architecture §4',
  { dependsOn: [AIEngineKind.ContextManagement, AIEngineKind.Memory, AIEngineKind.Personalization] },
);

export const DecisionEngineModule = defineEngine(
  AIEngineKind.Decision,
  'Rank legal next actions; single Now recommendation.',
  'Master AI Architecture §5',
  { dependsOn: [AIEngineKind.ContextManagement, AIEngineKind.Memory] },
);

export const RecommendationEngineModule = defineEngine(
  AIEngineKind.Recommendation,
  'Bounded recommendations tied to evidence triggers.',
  'Master AI Architecture §6',
  { dependsOn: [AIEngineKind.PatternDetection, AIEngineKind.Memory] },
);

export const ReflectionEngineModule = defineEngine(
  AIEngineKind.Reflection,
  'Evidence-grounded reflection facilitation.',
  'Master AI Architecture §7',
  { dependsOn: [AIEngineKind.Memory] },
);

export const PlanningEngineModule = defineEngine(
  AIEngineKind.Planning,
  'Season/daily Steer validation and planning counsel.',
  'Master AI Architecture §8',
  { dependsOn: [AIEngineKind.Memory] },
);

export const PatternDetectionEngineModule = defineEngine(
  AIEngineKind.PatternDetection,
  'Emit InterconnectionSignal requests from evidence windows.',
  'Master AI Architecture §9',
  { dependsOn: [AIEngineKind.Memory] },
);

export const ContextManagementEngineModule = defineEngine(
  AIEngineKind.ContextManagement,
  'Assemble AIContextPackage + manifest per scope.',
  'Master AI Architecture §11',
  { dependsOn: [] },
);

export const PersonalizationEngineModule = defineEngine(
  AIEngineKind.Personalization,
  'Tone and emphasis calibration without truth fork.',
  'Master AI Architecture §12',
  { dependsOn: [] },
);

export const LifeScoreIntelligenceModule = defineEngine(
  AIEngineKind.LifeScoreIntelligence,
  'Explain LifeScore components with drill citations only.',
  'Master AI Architecture §10',
  { dependsOn: [AIEngineKind.Memory] },
);

export const MemoryEngineModule = defineEngine(
  AIEngineKind.Memory,
  'Load memory slices; never chat-as-truth.',
  'Master AI Architecture §3',
  { dependsOn: [] },
);

export const ALL_ENGINE_MODULES: readonly AIEngineModule[] = [
  ContextManagementEngineModule,
  MemoryEngineModule,
  PersonalizationEngineModule,
  PatternDetectionEngineModule,
  DecisionEngineModule,
  RecommendationEngineModule,
  ReflectionEngineModule,
  PlanningEngineModule,
  LifeScoreIntelligenceModule,
  CoachingEngineModule,
];
