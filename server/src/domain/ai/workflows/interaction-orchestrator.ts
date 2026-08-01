import type { LifeId } from '../value-objects/ids';
import type { AITriggerKey } from '../value-objects/ids';
import { AIInteractionPoint } from '../value-objects/enums';
import type { EngineInputContract } from '../engines/engine-contract';
import { InsightDeliveryGate } from '../validation/insight-and-proposal-validation';
import { ProposalValidationService } from '../validation/insight-and-proposal-validation';
import { ALL_ENGINE_MODULES } from '../engines/engine-modules';
import { AIEngineKind } from '../value-objects/enums';

/**
 * Interaction flow orchestrator (architecture shell).
 * Wires: Trigger → Context → Memory → Engines → Validation → Trust events
 * Does NOT call LLMs.
 */
export class AIInteractionOrchestrator {
  constructor(
    private readonly insightGate = new InsightDeliveryGate(),
    private readonly proposalValidator = new ProposalValidationService(),
  ) {}

  async run(params: {
    lifeId: LifeId;
    triggerKey: AITriggerKey;
    interactionPoint: AIInteractionPoint;
    input: EngineInputContract;
  }): Promise<{ deliverableInsights: ReturnType<InsightDeliveryGate['pass']>[]; errors: string[] }> {
    const coaching = ALL_ENGINE_MODULES.find((e) => e.kind === AIEngineKind.Coaching)!;
    const output = await coaching.execute(params.input);
    const deliverable: ReturnType<InsightDeliveryGate['pass']>[] = [];
    const errors: string[] = [];

    for (const draft of output.insightDrafts) {
      try {
        deliverable.push(this.insightGate.pass(draft));
      } catch (e) {
        errors.push(e instanceof Error ? e.message : String(e));
      }
    }

    for (const p of output.proposalDrafts) {
      try {
        this.proposalValidator.validate(p);
      } catch (e) {
        errors.push(e instanceof Error ? e.message : String(e));
      }
    }

    return { deliverableInsights: deliverable, errors };
  }
}
