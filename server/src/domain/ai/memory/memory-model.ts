import type { LifeId } from '../value-objects/ids';
import type { AIEvidenceReference } from '../value-objects/evidence-reference';
import type { AIInsightId } from '../value-objects/ids';
import { MemorySliceKind } from '../value-objects/enums';

/** Master AI Architecture §3 Memory Model */

export interface WorkingMemorySlice {
  readonly kind: MemorySliceKind.Working;
  readonly lifeId: LifeId;
  readonly seasonId?: string;
  readonly openSignalIds: readonly string[];
  readonly todayDailyActionIds: readonly string[];
  readonly recentSessionIds: readonly string[];
  readonly evidenceRefs: readonly AIEvidenceReference[];
}

export interface EpisodicMemorySlice {
  readonly kind: MemorySliceKind.Episodic;
  readonly lifeId: LifeId;
  readonly sessionIdsByDomain: Readonly<Record<string, readonly string[]>>;
  readonly reflectionIds: readonly string[];
  readonly evidenceRefs: readonly AIEvidenceReference[];
}

export interface SemanticMemorySlice {
  readonly kind: MemorySliceKind.Semantic;
  readonly lifeId: LifeId;
  readonly principleIds: readonly string[];
  readonly systemVersionRefs: readonly string[];
  readonly couplingDeclarations: readonly string[];
  readonly personaCalibration?: Readonly<Record<string, unknown>>;
}

export interface ArchiveMemorySlice {
  readonly kind: MemorySliceKind.Archive;
  readonly lifeId: LifeId;
  readonly legacyRecordIds: readonly string[];
  readonly evidenceRefs: readonly AIEvidenceReference[];
}

export interface InsightGraphEdge {
  readonly insightId: AIInsightId;
  readonly evidenceRef: AIEvidenceReference;
  readonly claimId?: string;
}

export interface InsightGraphSlice {
  readonly kind: MemorySliceKind.InsightGraph;
  readonly lifeId: LifeId;
  readonly edges: readonly InsightGraphEdge[];
}

export type MemorySlice =
  | WorkingMemorySlice
  | EpisodicMemorySlice
  | SemanticMemorySlice
  | ArchiveMemorySlice
  | InsightGraphSlice;

export interface AIMemoryModel {
  readonly lifeId: LifeId;
  readonly working: WorkingMemorySlice;
  readonly episodic: EpisodicMemorySlice;
  readonly semantic: SemanticMemorySlice;
  readonly archive: ArchiveMemorySlice;
  readonly insightGraph: InsightGraphSlice;
}

/** Chat transcripts are explicitly excluded from memory slices (§3 Rules). */
export const CHAT_NOT_MEMORY = 'CHAT_TURNS_ARE_TRANSPORT_ONLY' as const;
