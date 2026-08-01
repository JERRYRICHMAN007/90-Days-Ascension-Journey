import type { EvidenceClassKey } from '../constants/evidence-classes';
import { AIEvidenceEpistemicTier } from '../value-objects/enums';

export interface AIEvidenceReference {
  readonly classKey: EvidenceClassKey;
  readonly entityType: string;
  readonly entityId: string;
  readonly fieldRefs?: readonly string[];
  readonly timeScope?: string;
  readonly drillLabel: string;
  readonly tier: AIEvidenceEpistemicTier;
}

export interface EvidenceUriParts {
  classKey: EvidenceClassKey;
  entityType: string;
  entityId: string;
  field?: string;
  scope?: string;
}

/** Canonical URI: evidence://{classKey}/{entityType}/{entityId} */
export function formatEvidenceUri(ref: Pick<AIEvidenceReference, 'classKey' | 'entityType' | 'entityId'>): string {
  return `evidence://${ref.classKey}/${ref.entityType}/${ref.entityId}`;
}

export function parseEvidenceUri(uri: string): EvidenceUriParts | null {
  const match = /^evidence:\/\/([^/]+)\/([^/]+)\/([^/?]+)(?:\?field=([^&]+))?(?:&scope=([^&]+))?/.exec(uri);
  if (!match) return null;
  return {
    classKey: match[1] as EvidenceClassKey,
    entityType: match[2],
    entityId: match[3],
    field: match[4],
    scope: match[5],
  };
}
