# ADR-001: AI Bounded Context Location

**Status:** Accepted  
**Date:** 2026-07-21  
**Spec:** Master AI Architecture (immutable)

## Context

Aether needs an intelligence layer that future engines plug into without coupling to Express routes, Prisma, or LLM vendors.

## Decision

Place the AI bounded context at `server/src/domain/ai/` as pure TypeScript domain logic (entities, contracts, validation, workflows). Persistence and LLM adapters live outside this folder in future `application/` and `infrastructure/` layers.

## Consequences

- No HTTP or DB imports inside `domain/ai`.
- Engine `execute()` methods throw `ArchitectureOnlyEngineError` until application wiring.
- Aligns with Data Model entity names (`AIInsight`, `AIProposal`, `AdaptationApplication`).

## Governing law

Master AI Architecture §0 — Proposals not decrees.
