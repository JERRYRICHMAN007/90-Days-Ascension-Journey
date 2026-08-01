# AETHER OS V2 — AI TRIGGER DICTIONARY

**Classification:** Internal trigger catalogue (intelligence layer)  
**Status:** Binding  
**Parent doctrine (immutable):** `AETHER-OS-V2-MASTER-AI-ARCHITECTURE.md`  
**Related:** Insight Specification, Proposal Catalog, Coach Doctrine, IA interaction points  
**Constraint:** Architecture only. No UI/code/prompts/implementation.

Each **trigger** is a named condition that may invoke Context Management (§11), activate roles (§2), run engines (§4–§10), emit `AIInsight`, optional `AIProposal`, and optional `Notification`.

---

# 1. Dictionary Conventions

| Field | Meaning |
|-------|---------|
| **triggerKey** | Stable identifier |
| **interactionPoint** | IA / Coach surface |
| **iaMode** | Operate / Steer / Understand / Remember / Configure |
| **requiredEvidence** | Minimum evidence classes (Evidence Dictionary keys) |
| **minimumConfidence** | Insight confidence floor to deliver |
| **rolesActivated[]** | Role catalog §2 |
| **enginesActivated[]** | Engines §4–§10 |
| **priority** | `critical_integrity` \| `operate` \| `steer` \| `informational` |
| **notificationEligible** | bool + lane |
| **dismissBehavior** | What happens on user dismiss |
| **retryBehavior** | Regeneration rules |
| **retractionBehavior** | Citation void handling |

**Master AI Architecture:** §19 Journey × Engine; §9 Pattern aggregation; §16 Failure; Notifications IA.

---

# 2. Interaction Point Index

| Point | iaMode | Primary triggers |
|-------|--------|------------------|
| Home | Operate | TRG-HOME-* |
| Operate | Operate | TRG-OP-* |
| Session Ready | Operate | TRG-SR-* |
| Session Complete | Operate | TRG-SC-* |
| Reflection | Operate/Steer | TRG-REF-* |
| Weekly Review | Steer | TRG-WR-* |
| Monthly Review | Steer/Understand | TRG-MR-* |
| Season Review | Steer/Remember | TRG-SRvw-* |
| Analytics | Understand | TRG-AN-* |
| Legacy | Remember | TRG-LEG-* |
| Remember | Remember | TRG-MEM-* |
| Coach | Mixed | TRG-COACH-* |
| Steer | Steer | TRG-STEER-* |
| Understand | Understand | TRG-UND-* |

---

# 3. Home

## TRG-HOME-001 `home.daily_open`

| Field | Value |
|-------|-------|
| **Trigger** | User enters Home with active Season |
| **Required evidence** | Today DailyActions; Season identity; non-negotiables |
| **Minimum confidence** | `low`–`medium` for ranking claims |
| **Roles** | Decision, Season Alignment Coach, Persona Calibrator |
| **Engines** | Decision, Coaching, Context Management |
| **Priority** | operate |
| **Notification eligible** | No |
| **Dismiss** | N/A (ephemeral Operate counsel) |
| **Retry** | On DailyAction materialization change same day |
| **Retraction** | If Session void affects ranking |

## TRG-HOME-002 `home.interconnection_caution`

| Field | Value |
|-------|-------|
| **Trigger** | Open InterconnectionSignal severity ≥ threshold |
| **Required evidence** | Signal.evidenceRefs[] |
| **Minimum confidence** | `medium` |
| **Roles** | Interconnection Guardian |
| **Engines** | Pattern, Coaching |
| **Priority** | operate |
| **Notification eligible** | Yes — operate lane if critical |
| **Dismiss** | Signal → dismissed; no regen until new pattern window |
| **Retry** | Aggregated only — not single miss |
| **Retraction** | Signal void → retract linked Insight |

**Source:** §9 Pattern rules; Coach Doctrine §8.

---

# 4. Operate

## TRG-OP-001 `operate.now_session_unselected`

| Field | Value |
|-------|-------|
| **Trigger** | DailyActions exist; no Active/Ready Now |
| **Required evidence** | DailyAction list |
| **Minimum confidence** | none for suggestion |
| **Roles** | Decision |
| **Engines** | Decision, Coaching |
| **Priority** | operate |
| **Notification** | No |
| **Dismiss** | Archive Insight EOD |
| **Retry** | On queue change |
| **Retraction** | Standard |

## TRG-OP-002 `operate.overload_detected`

| Field | Value |
|-------|-------|
| **Trigger** | Miss cluster + calendar hint or user annotation |
| **Required evidence** | 2+ misses 48h OR user friction annotation |
| **Minimum confidence** | `medium` for pattern wording |
| **Roles** | System Adapter, Clarity Enforcer |
| **Engines** | Decision, Pattern, Coaching |
| **Priority** | operate |
| **Notification** | Optional operate |
| **Dismiss** | Offer minimum faithful set once |
| **Retry** | 24h min |
| **Retraction** | If misses reversed by void fraud detection |

**Source:** User Journey overload; §16 System overload.

---

# 5. Session Ready

## TRG-SR-001 `session.ready.done_definition_clarify`

| Field | Value |
|-------|-------|
| **Trigger** | Session enters Ready |
| **Required evidence** | Session.doneDefinition, ShrinkTier list |
| **Minimum confidence** | high for done-definition text (manifest) |
| **Roles** | Season Alignment (intent), System Adapter |
| **Engines** | Coaching, Context |
| **Priority** | operate |
| **Notification** | No |
| **Dismiss** | User starts Session |
| **Retry** | Per Session id once |
| **Retraction** | If System version changes mid-Ready |

## TRG-SR-002 `session.ready.shrink_recommend`

| Field | Value |
|-------|-------|
| **Trigger** | Overload signal + non-negotiable Session Ready |
| **Required evidence** | ShrinkTier on System; overload evidence |
| **Minimum confidence** | medium |
| **Roles** | System Adapter |
| **Engines** | Decision, Coaching |
| **Priority** | operate |
| **Notification** | No |
| **Dismiss** | User picks tier |
| **Retry** | Same Session once |
| **Retraction** | Standard |

**Proposal link:** `operate.select_shrink_tier` (Catalog B1).

---

# 6. Session Complete

## TRG-SC-001 `session.complete.annotation_prompt`

| Field | Value |
|-------|-------|
| **Trigger** | Session → completed |
| **Required evidence** | SessionEvidence exists |
| **Minimum confidence** | high |
| **Roles** | Integrity Sentinel (light), Reflection Facilitator |
| **Engines** | Coaching |
| **Priority** | informational |
| **Notification** | No |
| **Dismiss** | Skip annotation |
| **Retry** | No |
| **Retraction** | If Session voided |

## TRG-SC-002 `session.complete.micro_reflection_offer`

| Field | Value |
|-------|-------|
| **Trigger** | Complete + System requires micro-reflection |
| **Required evidence** | System protocol flag |
| **Minimum confidence** | high |
| **Roles** | Reflection Facilitator |
| **Engines** | Reflection, Coaching |
| **Priority** | informational |
| **Notification** | No |
| **Dismiss** | User declines |
| **Retry** | No |
| **Retraction** | Standard |

**Source:** Coach §4; forbidden auto-complete inverse.

---

# 7. Reflection

## TRG-REF-001 `reflection.facilitate`

| Field | Value |
|-------|-------|
| **Trigger** | User opens Reflection altitude |
| **Required evidence** | Sessions in scope per altitude |
| **Minimum confidence** | medium for pattern prompts |
| **Roles** | Reflection Facilitator, Pattern Analyst |
| **Engines** | Reflection, Coaching |
| **Priority** | steer |
| **Notification** | No |
| **Dismiss** | Save draft |
| **Retry** | On scope change |
| **Retraction** | Citation void |

## TRG-REF-002 `reflection.feel_behind_check`

| Field | Value |
|-------|-------|
| **Trigger** | User text indicates global negative self-assessment |
| **Required evidence** | Period Analytics or Session counts |
| **Minimum confidence** | medium to compare feeling vs rate |
| **Roles** | Reflection Facilitator, Evidence Memory Steward |
| **Engines** | Reflection |
| **Priority** | steer |
| **Notification** | No |
| **Dismiss** | Acknowledge |
| **Retry** | Weekly max |
| **Retraction** | Standard |

**Source:** Vision P5; Reflection Engine §7.

---

# 8. Weekly Review

## TRG-WR-001 `review.weekly_due`

| Field | Value |
|-------|-------|
| **Trigger** | Weekly Reflection not completed by anchor |
| **Required evidence** | Cadence policy; incomplete Reflection |
| **Minimum confidence** | high for due fact |
| **Roles** | Reflection Facilitator, Planning Counsel |
| **Engines** | Reflection, Planning, Coaching |
| **Priority** | steer |
| **Notification** | Yes — steer lane |
| **Dismiss** | Snooze 24h once |
| **Retry** | Daily until complete |
| **Retraction** | When Reflection completed |

## TRG-WR-002 `review.weekly_system_tune`

| Field | Value |
|-------|-------|
| **Trigger** | Weekly Reflection submitted |
| **Required evidence** | Week Sessions + Reflection body |
| **Minimum confidence** | medium for Proposal |
| **Roles** | System Adapter, Pattern Analyst |
| **Engines** | Recommendation, Reflection |
| **Priority** | steer |
| **Notification** | No |
| **Dismiss** | Reject Proposal |
| **Retry** | Next week |
| **Retraction** | Proposal chain |

**Proposal link:** Catalog A1, D3.

---

# 9. Monthly Review

## TRG-MR-001 `review.monthly_wip_audit`

| Field | Value |
|-------|-------|
| **Trigger** | Monthly block window |
| **Required evidence** | Projects active count; Analytics WIP |
| **Minimum confidence** | medium |
| **Roles** | Clarity Enforcer, Planning Counsel |
| **Engines** | Planning, Pattern, Recommendation |
| **Priority** | steer |
| **Notification** | Optional steer |
| **Dismiss** | Defer to next week |
| **Retry** | Monthly |
| **Retraction** | Standard |

## TRG-MR-002 `review.monthly_organism_coupling`

| Field | Value |
|-------|-------|
| **Trigger** | Monthly + ≥2 primary Domains |
| **Required evidence** | InterconnectionSignals or correlation snapshot |
| **Minimum confidence** | medium (probabilistic copy) |
| **Roles** | Interconnection Guardian |
| **Engines** | Pattern, Coaching |
| **Priority** | steer |
| **Notification** | No |
| **Dismiss** | Signal ack |
| **Retry** | Monthly |
| **Retraction** | Signal void |

**Source:** Domain Architecture organism review.

---

# 10. Season Review

## TRG-SRvw-001 `season.close.initiate`

| Field | Value |
|-------|-------|
| **Trigger** | Season end date or user initiate close |
| **Required evidence** | Season active/closing |
| **Minimum confidence** | high |
| **Roles** | Legacy Historian, Season Alignment, Reflection Facilitator |
| **Engines** | Planning, Reflection, Coaching |
| **Priority** | critical_integrity |
| **Notification** | Yes — critical |
| **Dismiss** | Cannot dismiss past hard end without amend |
| **Retry** | Until close pipeline complete |
| **Retraction** | N/A until sealed |

## TRG-SRvw-002 `season.victory_evaluate`

| Field | Value |
|-------|-------|
| **Trigger** | Season Reflection complete |
| **Required evidence** | SeasonVictoryConditions + evidence refs |
| **Minimum confidence** | high per condition |
| **Roles** | Season Alignment, Historian |
| **Engines** | Planning, Life Score Intelligence (explain) |
| **Priority** | critical_integrity |
| **Notification** | Informational |
| **Dismiss** | N/A |
| **Retry** | Once per close |
| **Retraction** | If evidence void before seal |

**Proposal link:** D2 waive; E2 close start.

---

# 11. Analytics (Understand)

## TRG-AN-001 `analytics.metric_explain_request`

| Field | Value |
|-------|-------|
| **Trigger** | User requests explain on metric |
| **Required evidence** | MetricObservation.citationRefs |
| **Minimum confidence** | medium |
| **Roles** | Evidence Memory Steward |
| **Engines** | Coaching, Life Score Intelligence |
| **Priority** | informational |
| **Notification** | No |
| **Dismiss** | Close explain |
| **Retry** | On new snapshot |
| **Retraction** | Snapshot superseded |

## TRG-AN-002 `analytics.integrity_divergence`

| Field | Value |
|-------|-------|
| **Trigger** | LifeScore component divergence rule fires |
| **Required evidence** | LifeScore + component citations |
| **Minimum confidence** | medium |
| **Roles** | Pattern Analyst, Life Score Intelligence |
| **Engines** | Pattern, Coaching |
| **Priority** | steer |
| **Notification** | Optional integrity lane |
| **Dismiss** | Acknowledge |
| **Retry** | Weekly max |
| **Retraction** | Standard |

**Source:** §10 Life Score Intelligence.

---

# 12. Legacy / Remember

## TRG-LEG-001 `legacy.curation_due`

| Field | Value |
|-------|-------|
| **Trigger** | LegacyRecord sealed; no CurationRecord |
| **Required evidence** | LegacyRecord id |
| **Minimum confidence** | high |
| **Roles** | Legacy Historian |
| **Engines** | Coaching, Reflection |
| **Priority** | steer |
| **Notification** | Informational |
| **Dismiss** | Snooze until rest ends |
| **Retry** | Weekly |
| **Retraction** | N/A |

## TRG-MEM-001 `remember.archive_browse`

| Field | Value |
|-------|-------|
| **Trigger** | User enters Remember mode on Archive |
| **Required evidence** | LegacyRecord read-only |
| **Minimum confidence** | high for quotes |
| **Roles** | Legacy Historian, Evidence Memory Steward |
| **Engines** | Coaching, Context |
| **Priority** | informational |
| **Notification** | No |
| **Dismiss** | Exit Remember |
| **Retry** | Per browse session |
| **Retraction** | Never mutate archive |

**Proposal link:** H1, H3.

---

# 13. Coach (Global Entry)

## TRG-COACH-001 `coach.user_query`

| Field | Value |
|-------|-------|
| **Trigger** | User message in Coach with active Season |
| **Required evidence** | Context manifest minimum Season + recent Sessions window |
| **Minimum confidence** | per claim |
| **Roles** | Role inferred from intent |
| **Engines** | Coaching, Decision, Recommendation as needed |
| **Priority** | operate default |
| **Notification** | No |
| **Dismiss** | End thread with closure step |
| **Retry** | User follow-up |
| **Retraction** | Standard |

## TRG-COACH-002 `coach.boundary_violation_request`

| Field | Value |
|-------|-------|
| **Trigger** | User request matches deny list |
| **Required evidence** | Request text classification |
| **Minimum confidence** | high for refusal |
| **Roles** | Refusal Doctrine |
| **Engines** | Coaching (refusal Insight) |
| **Priority** | critical_integrity |
| **Notification** | No |
| **Dismiss** | N/A |
| **Retry** | No repeat refusal loop |
| **Retraction** | N/A |

**Source:** §13; Coach Doctrine §12.

---

# 14. Steer

## TRG-STEER-001 `steer.system_edit_context`

| Field | Value |
|-------|-------|
| **Trigger** | User opens System Steer |
| **Required evidence** | System + recent Session outcomes |
| **Minimum confidence** | medium for Proposal |
| **Roles** | System Adapter, Planning Counsel |
| **Engines** | Recommendation, Planning |
| **Priority** | steer |
| **Notification** | No |
| **Dismiss** | Leave Steer |
| **Retry** | On edit attempt |
| **Retraction** | Standard |

## TRG-STEER-002 `steer.season_plan_validate`

| Field | Value |
|-------|-------|
| **Trigger** | Season commission/amend submit |
| **Required evidence** | Season draft fields |
| **Minimum confidence** | high for validation errors |
| **Roles** | Clarity Enforcer, Planning Counsel |
| **Engines** | Planning |
| **Priority** | critical_integrity |
| **Notification** | No |
| **Dismiss** | Fix errors |
| **Retry** | On resubmit |
| **Retraction** | N/A |

**Source:** Planning Engine §8 success criteria.

---

# 15. Understand

## TRG-UND-001 `understand.dashboard_open`

| Field | Value |
|-------|-------|
| **Trigger** | User enters Understand/Dashboard altitude |
| **Required evidence** | AnalyticsSnapshot scope |
| **Minimum confidence** | medium |
| **Roles** | Pattern Analyst, Evidence Memory Steward |
| **Engines** | Pattern, Coaching |
| **Priority** | informational |
| **Notification** | No |
| **Dismiss** | Leave |
| **Retry** | On snapshot refresh |
| **Retraction** | Snapshot superseded |

---

# 16. Edge Triggers (User Journey)

## TRG-EDGE-001 `edge.absence_30d`

| Field | Value |
|-------|-------|
| **Trigger** | No Session complete 30 days |
| **Required evidence** | Session stream absence |
| **Minimum confidence** | high for absence fact |
| **Roles** | Clarity Enforcer, System Adapter, Coaching |
| **Engines** | Decision, Coaching |
| **Priority** | operate |
| **Notification** | One operate — not bait |
| **Dismiss** | Start return integrity |
| **Retry** | 7d min |
| **Retraction** | If user completes Session |

## TRG-EDGE-002 `edge.injury_declared`

| Field | Value |
|-------|-------|
| **Trigger** | User Reflection or System flag injury/rehab |
| **Required evidence** | Reflection or Body System amend context |
| **Minimum confidence** | medium |
| **Roles** | System Adapter, Interconnection Guardian |
| **Engines** | Recommendation, Coaching |
| **Priority** | steer |
| **Notification** | Optional |
| **Dismiss** | Accept rehab Proposal |
| **Retry** | On amend |
| **Retraction** | Standard |

## TRG-EDGE-003 `edge.motivation_low`

| Field | Value |
|-------|-------|
| **Trigger** | User language + miss streak without fraud |
| **Required evidence** | SessionAnnotation or Reflection |
| **Minimum confidence** | low for tone; none for one-Session ask |
| **Roles** | Coaching, Persona Calibrator |
| **Engines** | Decision |
| **Priority** | operate |
| **Notification** | No |
| **Dismiss** | Complete one shrink Session |
| **Retry** | 24h |
| **Retraction** | N/A |

**Source:** Master AI Architecture §19 edge rows.

---

# 17. Global Behaviors

## Dismiss behaviour taxonomy

| Code | Meaning |
|------|---------|
| `suppress_until_window` | No regen until aggregation window |
| `snooze` | Retry after duration |
| `ack_only` | Mark seen; keep Insight archived |
| `reject_proposal` | Proposal rejected; no identical retry (§16) |

## Retry behaviour rules

- Operate triggers: max 1–2 per day per key unless state change  
- Pattern triggers: aggregation window enforced (§9)  
- Notification coupled triggers: respect quiet hours (Settings)

## Retraction behaviour

- Void authoritative citation → retract dependent Insights  
- Invalidate open Proposals from retracted Insight unless revalidated  
- Coach must not reference retracted ids in new deliveries

---

# Document Control

| Field | Value |
|-------|-------|
| Title | Aether OS V2 — AI Trigger Dictionary |
| Version | 1.0 |
| Parent | Master AI Architecture 1.0 |

**End of AI Trigger Dictionary.**
