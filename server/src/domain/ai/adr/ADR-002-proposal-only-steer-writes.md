# ADR-002: Proposal-Only Steer Writes

**Status:** Accepted  
**Spec:** Master AI Architecture §0.3, §13

## Decision

All AI-initiated Steer mutations must flow:

`AIProposal` → human accept (`AIProposalDecision`) → `AdaptationApplication` → (application layer applies System version change).

`ProposalWorkflowService` is the sole domain accept/reject authority. Engines have `mayAcceptProposal: false` in `EnginePermissionContract`.

## Forbidden

Direct Session, Mastery, LifeScore, Legacy evidence writes from any engine.
