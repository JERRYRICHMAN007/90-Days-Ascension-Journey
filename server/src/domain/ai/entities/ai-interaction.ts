import type { AIInteractionId, LifeId } from '../value-objects/ids';
import { AIInteractionPoint } from '../value-objects/enums';

export interface AIInteraction {
  readonly id: AIInteractionId;
  readonly lifeId: LifeId;
  readonly interactionPoint: AIInteractionPoint;
  readonly triggerKey: string;
  readonly startedAt: Date;
  readonly closedAt?: Date;
  readonly insightIds: readonly string[];
  readonly proposalIds: readonly string[];
  /** Chat turns are transport-only; not stored as evidence (Master AI Architecture §3). */
  readonly transportTurnCount: number;
}
