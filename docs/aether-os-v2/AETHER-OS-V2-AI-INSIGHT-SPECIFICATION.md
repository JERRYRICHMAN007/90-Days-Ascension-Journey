# AETHER OS V2 — AI INSIGHT SPECIFICATION

**Classification:** Internal entity specification (intelligence layer)  
**Status:** Binding  
**Parent doctrine (immutable):** `AETHER-OS-V2-MASTER-AI-ARCHITECTURE.md`  
**Related:** Data Model §5.4 AIInsight; Coach Doctrine; Evidence Dictionary; Trigger Dictionary  
**Constraint:** Logical specification only. No UI. No code. No prompts. No implementation.

`AIInsight` is the **durable unit of coach observation** with citation edges to evidence. Chat turns are not the system of record (Master AI Architecture §3 Rules).

---

# 1. Purpose

## Purpose
Define the complete logical specification for `AIInsight` so all engines (Coaching §4, Decision §5, Recommendation §6, Reflection §7, Planning §8, Pattern §9, Life Score §10) emit auditable, retract-able, evidence-bound observations.

## Responsibilities
- Carry factual claims with citations or explicit uncertainty.  
- Attach context manifest for Privacy & Trust audit (§14).  
- Spawn optional `AIProposal` (Data Model §5.5) — never mutate entities directly.  
- Support Insight graph in Memory Model (§3 Outputs).

## Master AI Architecture references
§3 Memory (Insight graph), §4 Coaching Outputs, §11 Context manifest, §14 Privacy, §16 Retraction, Data Model §5.4.

---

# 2. Description

`AIInsight` is a read-first intelligence artifact owned by the OS Coach subsystem (`owner: OS`), scoped to `lifeId`, optionally `seasonId` and `domainKeys[]`.

It contains:
- Human-readable `summary` (coaching utterance class — not a prompt template)  
- Structured `citations[]` to evidence graph nodes  
- `contextManifest` snapshot  
- `metadata` (roles, interaction point, confidence, status)  
- Optional link to spawned `AIProposal`(s)

It is **not** a Reflection, Session, Analytics snapshot, or Notification — though it may reference them and trigger Notifications.

---

# 3. Lifecycle

## States

| Status | Meaning |
|--------|---------|
| `generated` | Created by engine pipeline; citations validated or downgraded |
| `delivered` | Surfaced to user/coach channel (logical) |
| `seen` | User acknowledged view (optional tracking) |
| `archived` | No longer active surface; retained for audit |
| `retracted` | Invalidated; must not inform new Proposals without regeneration |

## State diagram

```text
generated → delivered → seen → archived
generated → retracted (terminal for truth use)
delivered → retracted
seen → retracted
```

## Lifecycle rules (Master AI Architecture §16)
- Retraction required when any **authoritative** citation voided (Session voided_with_audit).  
- Retracted Insights remain in audit log; UI/logical surfaces must not treat as current truth.  
- Regeneration creates **new** Insight id — no silent overwrite of summary while keeping id.

---

# 4. Creation

## Who may create
- Coaching Engine (primary)  
- Decision Engine (decision explanation Insights)  
- Recommendation Engine (recommendation rationale Insights)  
- Reflection Engine (facilitation Insights)  
- Planning Engine (validation/gap Insights)  
- Pattern Detection Engine (pattern attachment Insights)  
- Life Score Intelligence (explain-only Insights)

## Creation pipeline (logical)

1. **Trigger** fires (see Trigger Dictionary)  
2. **Context Management** assembles bundle + manifest (§11)  
3. **Evidence retrieval** per Evidence Dictionary classes  
4. **Generation** with post-check: strip uncited factual claims (§16 Hallucination risk)  
5. **Validation** (§5 below)  
6. **Persist** `AIInsight` status=`generated`  
7. **Deliver** per visibility rules; optional Notification  
8. Optional: spawn `AIProposal` linked via `insightId`

## Forbidden at creation
- Direct writes to Mastery, LifeScore, Session state (§13 Deny)  
- Citations to raw chat as authoritative  
- Fabricated LegacyRecord content

---

# 5. Validation

## Validation gates

| Gate | Rule | On fail |
|------|------|---------|
| V1 Citation coverage | Every factual claim maps to ≥1 citation OR summary rewritten as uncertain | Block deliver or downgrade to `hypothesis` flag |
| V2 Citation existence | Referenced entity ids exist and user-authorized | Retract or block |
| V3 Altitude | `interactionPoint` matches context manifest mode | Regenerate with correct manifest |
| V4 Deny list | Content scan for illegal coaching actions | Refusal Insight class instead |
| V5 Privacy | No prohibited RelationshipBond fields in summary | Redact or block |
| V6 Pattern window | Pattern claims meet minimum window (§9) | Soften to hypothesis |
| V7 Role mix | `roleMix` declared when multiple roles | Metadata fix |

## Validation outputs
- `validationResult`: `pass` | `pass_with_hypothesis` | `blocked` | `refusal`  
- `validationNotes[]` for audit

---

# 6. Citation Requirements

## Normative (AI Law 1; §4 Rules)

### Must cite (authoritative preferred)
- Completion rates, miss counts, streak integrity  
- Project/Journey status claims  
- Pattern/correlation claims  
- Season victory progress  
- LifeScore/Mastery **interpretations** (derived citations must chain to Sessions)  
- Interconnection risk statements

### May omit citation
- Pure process instructions (“Start Now Session”) when no factual claim  
- Emotional acknowledgment without factual progress claim  
- Explicit uncertainty blocks (“I don’t have evidence yet”)

### Citation record shape (logical)

```text
Citation {
  evidenceClassKey     // Evidence Dictionary
  entityType
  entityId
  fieldRefs[]          // optional
  timeScope            // e.g. week_start, season_to_date
  confidence           // inherited from evidence class
  drillLabel           // human-readable pointer
}
```

### Minimum counts by Insight class

| Insight class | Min authoritative citations |
|---------------|----------------------------|
| Operate priority | 0–1 (today queue may be manifest-only) |
| Pattern / interconnection | 2+ Sessions or 1 Analytics snapshot with embedded session refs |
| Steer adaptation rationale | 1+ week evidence + target System id |
| Life Score explain | 1+ MetricObservation with citationRefs |
| Legacy Historian | 1+ LegacyRecord/Artifact/Session in sealed archive |

---

# 7. Status Transitions

| From | To | Actor | Condition |
|------|-----|-------|-----------|
| generated | delivered | System | validation pass |
| generated | retracted | System | validation fail uncorrectable |
| delivered | seen | User | optional |
| delivered | retracted | System/User | citation void, user dispute upheld, ethics review |
| seen | archived | System | TTL or superseded by newer Insight same trigger key |
| * | retracted | System | authoritative evidence void |

User cannot set status to `archived` to hide shame — archive is not delete.

---

# 8. Confidence

## Purpose
Epistemic confidence for **interpretation**, not user worth (§16).

## Levels (logical)

| Level | Meaning | Coach language class |
|-------|---------|----------------------|
| `high` | Multiple authoritative citations, stable window | Declarative with cites |
| `medium` | Derived metrics with drill path | Declarative + drill |
| `low` | Sparse data, early Season | Probabilistic / hedge |
| `none` | Insufficient evidence | Gap statement only |

## Rules
- Confidence cannot override deny list.  
- High confidence does not permit Mastery writes.  
- Pattern Engine sets floor: single-miss cannot yield `high` interconnection (§9).

## Metadata field
- `confidence`: level  
- `confidenceRationale`: short audit string

---

# 9. Metadata

## Required metadata

| Field | Description |
|-------|-------------|
| `id` | Stable identifier |
| `lifeId` | Tenancy |
| `createdAt` | Creation time |
| `status` | Lifecycle state |
| `interactionPoint` | Trigger Dictionary key |
| `dominantRole` | From role catalog §2 |
| `roleMix[]` | Optional secondary roles |
| `engines[]` | Emitting engines |
| `triggerKey` | Trigger Dictionary id |
| `confidence` | §8 |
| `validationResult` | §5 |

## Optional metadata

| Field | Description |
|-------|-------------|
| `seasonId` | Active Season |
| `domainKeys[]` | Domains touched |
| `personaCalibratorApplied` | bool |
| `toneContext` | emotional calibration note (non-scoring) |
| `proposalIds[]` | spawned proposals |
| `supersedesInsightId` | replacement chain |
| `notificationId` | if surfaced via Notification |

---

# 10. Context Manifest

## Purpose
Master AI Architecture §11 — audit what intelligence saw.

## Manifest contents (logical)

```text
ContextManifest {
  manifestVersion
  assembledAt
  interactionPoint
  iaMode                    // Operate | Steer | Understand | Remember | Configure
  seasonId
  domainScope[]
  timeWindow
  entityInventory[] { type, id, label, scaffoldingFlag }
  redactions[] { field, reason }
  excludedDomains[]         // clarity enforcement
  evidenceBudgetUsed
  settingsSnapshot { aiProactivityBound, personaDefault }
}
```

## Rules
- Every delivered Insight **must** include manifest.  
- RelationshipBond: redact displayLabel if privacyLock unless user scoped bond in trigger.  
- Finance: amount fields redacted in Notification-derived summaries (§14).

---

# 11. Evidence Graph

## Purpose
Link Insight to Memory Model Insight graph (§3).

## Graph structure

```text
AIInsight --cites--> EvidenceNode*
EvidenceNode {
  classKey       // Evidence Dictionary
  entityType
  entityId
  authoritative | derived | temporary
}
EvidenceNode --supports--> Claim in summary (internal map)
```

## Traversal rules
- Drill-down must reach authoritative Session for progress claims.  
- Derived nodes must include `citationRefs` to authoritative (Data Model MetricObservation).  
- Temporary nodes (draft Reflection, in-flight Session) labeled not for high-confidence pattern claims.

---

# 12. Auditability

## Audit events (logical log)

| Event | Payload |
|-------|---------|
| insight.created | id, triggerKey, manifest hash |
| insight.validated | result, notes |
| insight.delivered | channel class |
| insight.retracted | reason, voidedCitationIds |
| insight.proposal_spawned | proposalId |

## Retention
- Align with Life evidence retention; retracted Insights kept.  
- Supports Ethics Red Team and Quality Framework.

## Master AI Architecture §14 Trust events log alignment.

---

# 13. Retraction

## Triggers
- Session `voided_with_audit`  
- Analytics snapshot superseded with material metric correction affecting claim  
- User integrity dispute upheld (process-defined)  
- Ethics review mandate  
- Citation entity deleted under exceptional integrity purge (tombstone reference retained)

## Retraction behavior
- Set `status=retracted`, `retractedAt`, `retractionReason`  
- Spawn optional replacement Insight if trigger still active and evidence refreshed  
- Downstream: invalidate open Proposals spawned solely from retracted Insight unless revalidated  
- Notifications: mark stale if linked

## Coach behavior
- Coach Doctrine: do not treat retracted Insight as current truth (§4 Evidence-first)

---

# 14. Visibility

## Visibility classes (logical, not UI)

| Class | Who sees | Examples |
|-------|----------|----------|
| `operate_surface` | Home, Session contexts | Now priority, shrink |
| `steer_surface` | Review, System Steer | WIP, Proposal rationale |
| `understand_surface` | Analytics explain | Life Score explain |
| `remember_surface` | Legacy curation | Historian |
| `audit_only` | Integrity/ethics | Sentinel internal |
| `notification_payload` | Notification body excerpt | cited summary only |

## Rules
- `audit_only` Insights never celebrate or shame in user-facing copy.  
- Minimize `notification_payload` PII (§14).

---

# 15. Expiry

## Purpose
Clarity — stale Insights should not compete with Now (IA Clarity).

## Expiry policies (by class)

| Insight class | Expiry |
|---------------|--------|
| Operate Now priority | End of calendar day or Session state change |
| Interconnection open signal attachment | When Signal resolved/expired |
| Weekly review due | When Weekly Reflection completed |
| Planning validation | When Season commission completes |
| Historian narrative draft | When CurationRecord seals or user archives |

## Fields
- `expiresAt` optional  
- `expiryPolicyKey`

## Post-expiry
- Auto `archived` — not deleted.  
- Regeneration on trigger retry allowed.

---

# 16. Relationship to AIProposal

- Insight may spawn 0–N Proposals (Recommendation §6: max alternatives 2).  
- Proposal **must** duplicate `citations[]` superset ⊆ Insight citations or add Steer-specific targets.  
- Proposal without Insight allowed when trigger is pure Steer validation (Planning Engine) — still requires citations on Proposal entity (Catalog).

---

# 17. Success Criteria

- 100% delivered Insights have context manifest.  
- 100% factual progress/pattern claims have citations or `hypothesis` flag.  
- Retraction pipeline tested when Session voided.  
- Zero Insights grant Mastery/LifeScore writes.  
- Year-3 drill from Insight to Session ids in < logical hops (product quality goal).

---

# Document Control

| Field | Value |
|-------|-------|
| Title | Aether OS V2 — AI Insight Specification |
| Version | 1.0 |
| Parent | Master AI Architecture 1.0 |

**End of AI Insight Specification.**
