import { AIContextScope, AIPrivacyLevel } from '../value-objects/enums';
import type { LifeId, SeasonId } from '../value-objects/ids';

export interface ContextEntityInventoryItem {
  readonly type: string;
  readonly id: string;
  readonly label: string;
  readonly scaffoldingFlag: boolean;
}

export interface ContextRedaction {
  readonly field: string;
  readonly reason: string;
}

export interface AIContextManifest {
  readonly manifestVersion: string;
  readonly assembledAt: Date;
  readonly interactionPoint: string;
  readonly scope: AIContextScope;
  readonly lifeId: LifeId;
  readonly seasonId?: SeasonId;
  readonly domainScope: readonly string[];
  readonly timeWindow: { readonly start?: Date; readonly end?: Date; readonly label?: string };
  readonly entityInventory: readonly ContextEntityInventoryItem[];
  readonly redactions: readonly ContextRedaction[];
  readonly excludedDomains: readonly string[];
  readonly evidenceBudgetUsed: number;
  readonly privacyLevel: AIPrivacyLevel;
  readonly settingsSnapshot?: {
    readonly aiProactivityBound?: string;
    readonly personaDefault?: string;
  };
}

export interface AIContextPackage {
  readonly manifest: AIContextManifest;
  /** Resolved evidence refs selected for this invocation (not chat). */
  readonly evidenceRefs: readonly import('../value-objects/evidence-reference').AIEvidenceReference[];
  readonly citationBudget: number;
  readonly scope: AIContextScope;
}
