import type { AIEvidenceReference } from '../value-objects/evidence-reference';
import { EVIDENCE_CLASS_REGISTRY } from '../constants/evidence-classes';
import { AIEvidenceEpistemicTier } from '../value-objects/enums';

/** A factual claim that must be backed by citations before delivery (Insight Spec §6). */
export interface FactualClaim {
  readonly claimId: string;
  readonly statement: string;
  readonly requiresCitation: boolean;
  readonly citationIds: readonly string[];
}

export interface CitationValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly uncitedClaimIds: readonly string[];
  readonly invalidEvidenceRefs: readonly string[];
}

export function validateEvidenceReferences(refs: readonly AIEvidenceReference[]): CitationValidationResult {
  const errors: string[] = [];
  const invalidEvidenceRefs: string[] = [];

  for (const ref of refs) {
    const def = EVIDENCE_CLASS_REGISTRY[ref.classKey];
    if (!def) {
      errors.push(`Unknown evidence class: ${ref.classKey}`);
      invalidEvidenceRefs.push(ref.entityId);
      continue;
    }
    if (def.tier === AIEvidenceEpistemicTier.Invalid) {
      errors.push(`Invalid evidence class for citation: ${ref.classKey}`);
      invalidEvidenceRefs.push(ref.entityId);
    }
    if (ref.tier !== def.tier) {
      errors.push(`Tier mismatch for ${ref.classKey}: expected ${def.tier}, got ${ref.tier}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    uncitedClaimIds: [],
    invalidEvidenceRefs,
  };
}

export function validateFactualClaims(
  claims: readonly FactualClaim[],
  refs: readonly AIEvidenceReference[],
): CitationValidationResult {
  const refValidation = validateEvidenceReferences(refs);
  const uncited: string[] = [];
  const refIds = new Set(refs.map((_, i) => `cite-${i}`));

  for (const claim of claims) {
    if (!claim.requiresCitation) continue;
    if (claim.citationIds.length === 0) {
      uncited.push(claim.claimId);
    }
    for (const cid of claim.citationIds) {
      if (!refIds.has(cid) && !refs.some((r) => r.entityId === cid)) {
        uncited.push(claim.claimId);
      }
    }
  }

  const errors = [
    ...refValidation.errors,
    ...uncited.map((id) => `Uncited factual claim: ${id}`),
  ];

  return {
    valid: errors.length === 0,
    errors,
    uncitedClaimIds: uncited,
    invalidEvidenceRefs: refValidation.invalidEvidenceRefs,
  };
}

/**
 * Branded deliverable insight — only construct via InsightDeliveryGate.pass().
 * Makes "deliver without citations" a type error at integration boundary.
 */
export declare const DeliverableInsightBrand: unique symbol;
export type DeliverableAIInsight<T> = T & { readonly [DeliverableInsightBrand]: true };
