# ADR-003: Citation Delivery Gate

**Status:** Accepted  
**Spec:** AI Insight Specification; Master AI Architecture §0.1

## Decision

User-visible insights must pass `InsightDeliveryGate.pass()` which returns `DeliverableAIInsight<T>` — a branded type only producible after `InsightValidationService` validates citations and factual claims.

Chat turns are excluded via `EVIDENCE_CLASS_KEYS.ChatTurn` tier `Invalid`.

## Consequences

Integration layers must not persist `AIInsight` as `Delivered` without passing the gate.
