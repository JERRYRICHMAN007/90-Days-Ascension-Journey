# AETHER OS V2 — AI PROPOSAL CATALOG

**Classification:** Internal proposal-type specification  
**Status:** Binding  
**Parent doctrine (immutable):** `AETHER-OS-V2-MASTER-AI-ARCHITECTURE.md`  
**Related:** Data Model §5.5 AIProposal, §5.6 AdaptationApplication; Coach Doctrine; Insight Specification  
**Constraint:** Architecture only. No direct data mutation by AI. No UI/code/prompts.

**Invariant (AI Law 3):** AI never mutates authoritative data directly. All Steer effects require `AIProposal` → human **accept** → `AdaptationApplication` (Data Model).

---

# 1. Catalog Purpose

Define every **legal** `proposalType` in Aether OS, with triggers, evidence, approval, rollback, risk, examples, and **illegal variants** blocked by §13 Deny list.

---

# 2. Global Proposal Rules

| Rule | Source |
|------|--------|
| G1 Human accept required | §13 Deny: accept own Proposal |
| G2 No Mastery/LifeScore/Session complete Proposals | §13 Deny |
| G3 Citations required on Proposal.rationale | Insight Spec §6 |
| G4 Future-only effect | Changes apply to future DailyActions/Sessions; past immutable |
| G5 Rollback via new Proposal or manual Steer restoring `systemVersionBefore` | Data Model AdaptationApplication |
| G6 Rejected Proposal: no identical re-offer within nag window | §16 Failure |
| G7 Domain-add Proposals require Season amend class | §13 Deny activate Domain |
| G8 Expiry optional `expiresAt` — expired Proposals cannot be accepted | Insight Spec §15 |

## Proposal status lifecycle (Data Model)

```text
proposed → accepted | rejected | expired | withdrawn
accepted → AdaptationApplication (immutable)
```

---

# 3. Category A — System Changes

## A1 `system.protocol_amend`

| Field | Value |
|-------|-------|
| **Purpose** | Tune repeatable protocol (schedule, duration, done-definition) |
| **Trigger** | Weekly Review evidence of miss pattern; Reflection adaptation; Pattern Engine system failure |
| **Required evidence** | ≥1 week Session outcomes for target System; Reflection optional |
| **Affected entities** | `System` (new version), future `DailyAction`, `ShrinkTier` if changed |
| **Approval** | User accept in Steer |
| **Rollback** | Proposal to restore `systemVersionBefore` from AdaptationApplication |
| **Risk** | Medium — wrong tune causes zombie consistency |
| **Example** | “Move reading Session from 9pm to 6am based on 4/7 misses after 8pm (session_ids…)” |
| **Illegal variants** | `system.delete_non_negotiable`; retroactive done-definition change for past Sessions |

**Master AI Architecture:** System Adapter §2; Recommendation §6; Planning §8.

## A2 `system.shrink_tier_add`

| Field | Value |
|-------|-------|
| **Purpose** | Add predefined shrink tier to System |
| **Trigger** | Injury, overload, 30-day miss recovery, Founder self-erasure pattern |
| **Required evidence** | Miss pattern OR user-declared constraint in Reflection; non-negotiable flag |
| **Affected entities** | `System`, `ShrinkTier` |
| **Approval** | User accept |
| **Rollback** | Retire tier via amend Proposal (cannot invalidate past shrink completes) |
| **Risk** | Low if tier honest; high if tier invented post-hoc to farm score |
| **Example** | “Add 10-min minimum faithful Body tier when Career week >50h (cite Career Sessions)” |
| **Illegal variants** | Retroactive shrink tier applied to completed Sessions |

**Source:** AI Law 6; User Journey injury/miss.

## A3 `system.pause`

| Field | Value |
|-------|-------|
| **Purpose** | Pause System without deleting history |
| **Trigger** | Season amend, injury, Domain pause |
| **Required evidence** | Reflection or Season amend context |
| **Affected entities** | `System.status` → paused |
| **Approval** | User accept; non-negotiable pause requires Season acknowledgment |
| **Rollback** | `system.resume` Proposal |
| **Risk** | High if non-negotiable paused without shrink replacement — violates shrink-don’t-skip |
| **Example** | Pause hypertrophy System during rehab Journey activation |
| **Illegal variants** | Pause all Systems with no minimum faithful set |

## A4 `system.retire`

| Field | Value |
|-------|-------|
| **Purpose** | End System intentionally |
| **Trigger** | Zombie consistency detected; Journey complete |
| **Required evidence** | Reflection + Analytics on wrong target |
| **Affected entities** | `System` retired |
| **Approval** | User accept |
| **Rollback** | Reactivate as new System id (no history rewrite) |
| **Risk** | Medium |
| **Example** | Retire vanity metric tracking System |
| **Illegal variants** | Retire to erase miss history |

---

# 4. Category B — Shrink Recommendations

## B1 `operate.select_shrink_tier`

| Field | Value |
|-------|-------|
| **Purpose** | Recommend tier for imminent Session — not a Steer amend |
| **Trigger** | Session Ready; overload signal; Home Decision |
| **Required evidence** | Existing ShrinkTier on System; optional miss pattern |
| **Affected entities** | None until user starts Session — operational counsel only |
| **Approval** | User selects tier at Session start (human execution) |
| **Rollback** | N/A |
| **Risk** | Low |
| **Example** | “Use minimum_faithful tier today; 3 Career Sessions already complete” |
| **Illegal variants** | Auto-apply tier without user; tier not on System |

**Note:** May emit Insight only without Proposal record — optional lightweight Proposal for audit.

**Source:** Decision Engine §5; Coach recovery §9.

## B2 `operate.minimum_faithful_set`

| Field | Value |
|-------|-------|
| **Purpose** | Define today’s reduced Session set under chaos |
| **Trigger** | L2 escalation overload; user request |
| **Required evidence** | Season non-negotiables list |
| **Affected entities** | Operate ranking only |
| **Approval** | User acknowledges |
| **Rollback** | Daily expiry |
| **Risk** | Medium if set empty |
| **Example** | “Today: Body shrink + Mind shutdown + one Projects shrink only” |
| **Illegal variants** | Empty set when non-negotiables exist |

---

# 5. Category C — Journey Recommendations

## C1 `journey.activate`

| Field | Value |
|-------|-------|
| **Purpose** | Start planned Journey |
| **Trigger** | Season planning; prior Journey complete |
| **Required evidence** | Season active; Domain activation; WIP cap headroom |
| **Affected entities** | `Journey.status` |
| **Approval** | User accept Steer |
| **Rollback** | `journey.abandon` with Reflection |
| **Risk** | Medium WIP |
| **Example** | Activate “Ship Comfort” Journey in Projects Domain |
| **Illegal variants** | Activate without Season context |

## C2 `journey.phase_advance`

| Field | Value |
|-------|-------|
| **Purpose** | Move curriculum phase |
| **Trigger** | Milestone hit; Monthly review |
| **Required evidence** | Milestone/Project evidence Sessions |
| **Affected entities** | `Journey.phase` |
| **Approval** | User accept |
| **Rollback** | Phase revert Proposal with audit |
| **Risk** | Low |
| **Illegal variants** | Advance without milestone evidence |

## C3 `journey.complete_or_abandon`

| Field | Value |
|-------|-------|
| **Purpose** | Close Journey arc honestly |
| **Trigger** | Monthly/Season review |
| **Required evidence** | Journey Session stream |
| **Affected entities** | `Journey` terminal status |
| **Approval** | User accept |
| **Rollback** | Cannot un-complete; abandon archived |
| **Risk** | Low |
| **Example** | Abandon tutorial Journey with Reflection note |
| **Illegal variants** | Delete Journey to hide misses |

---

# 6. Category D — Planning Changes

## D1 `season.amend`

| Field | Value |
|-------|-------|
| **Purpose** | Change Domains in play, victory conditions, horizon |
| **Trigger** | Career change, injury, goal change edge cases |
| **Required evidence** | Reflection + Analytics; explicit amend reason |
| **Affected entities** | `Season`, `SeasonDomainActivation`, `SeasonVictoryCondition` |
| **Approval** | User confirm amend (high-friction) |
| **Rollback** | New amend restoring prior config (logged) |
| **Risk** | High — clarity budget |
| **Example** | Pause Brand primary → supporting during ship crunch |
| **Illegal variants** | Auto-amend without user; >5 primary Domains |

**Source:** Planning Engine §8; User Journey §3.

## D2 `season.victory_condition_waive`

| Field | Value |
|-------|-------|
| **Purpose** | Waive condition at close with integrity |
| **Trigger** | Season close |
| **Required evidence** | Season Reflection |
| **Affected entities** | `SeasonVictoryCondition.status` |
| **Approval** | User + Reflection completed |
| **Rollback** | Not applicable at seal |
| **Risk** | Medium integrity if abused |
| **Illegal variants** | Waive without Reflection |

## D3 `project.finish_or_drop`

| Field | Value |
|-------|-------|
| **Purpose** | Reduce WIP |
| **Trigger** | Monthly review; Clarity Enforcer |
| **Required evidence** | Project age, Session integrity, ship evidence |
| **Affected entities** | `Project` completed/abandoned |
| **Approval** | User accept |
| **Rollback** | Reactivate only as new Project |
| **Risk** | Medium |
| **Example** | Drop stale side Project to protect flagship ship |
| **Illegal variants** | Mark complete without Artifact/Session evidence |

## D4 `goal.retire`

| Field | Value |
|-------|-------|
| **Purpose** | Retire misaligned Goal |
| **Trigger** | Identity/Season review |
| **Required evidence** | Reflection |
| **Affected entities** | `Goal` |
| **Approval** | User accept |
| **Rollback** | New Goal create Proposal separate |
| **Risk** | Low |
| **Illegal variants** | Goals that outrank Season identity silently |

---

# 7. Category E — Review Recommendations

## E1 `review.weekly_due`

| Field | Value |
|-------|-------|
| **Purpose** | Signal Weekly Reflection due |
| **Trigger** | Cadence missed |
| **Required evidence** | Calendar cadence; incomplete Reflection entity |
| **Affected entities** | Notification optional |
| **Approval** | User completes Reflection |
| **Rollback** | N/A |
| **Risk** | Low; spam if repeated |
| **Illegal variants** | Auto-complete Reflection |

## E2 `review.season_close_start`

| Field | Value |
|-------|-------|
| **Purpose** | Begin Season close pipeline |
| **Trigger** | Season end date; victory evaluation ready |
| **Required evidence** | Season status active/closing |
| **Affected entities** | Season lifecycle |
| **Approval** | User confirms close |
| **Rollback** | Cannot unseal Legacy evidence section |
| **Risk** | High if skipped Reflection |
| **Illegal variants** | Auto-archive without Reflection |

---

# 8. Category F — Knowledge Recommendations

## F1 `knowledge.resource_finish_or_drop`

| Field | Value |
|-------|-------|
| **Purpose** | Anti-hoard counsel |
| **Trigger** | Anti-hoard KPI; many queued books |
| **Required evidence** | LearningResource statuses; ReadingSessions |
| **Affected entities** | Book/LearningResource |
| **Approval** | User accept |
| **Rollback** | Re-queue resource |
| **Risk** | Low |
| **Example** | Drop 3 queued books; finish active one |
| **Illegal variants** | Mark finished without ReadingSession evidence |

## F2 `knowledge.transfer_to_project`

| Field | Value |
|-------|-------|
| **Purpose** | Pipeline transfer counsel |
| **Trigger** | Knowledge complete; Projects stall |
| **Required evidence** | Finished intake + open Project |
| **Affected entities** | Cross-link only |
| **Approval** | User schedules Projects Session |
| **Rollback** | N/A |
| **Risk** | Low |
| **Illegal variants** | Auto-create Project content |

---

# 9. Category G — Domain Recommendations

## G1 `domain.activate_in_season`

| Field | Value |
|-------|-------|
| **Purpose** | Add Domain to Season (expensive) |
| **Trigger** | Season amend; user request |
| **Required evidence** | Season amend Reflection; clarity budget |
| **Affected entities** | `SeasonDomainActivation`, seed Systems |
| **Approval** | High-friction user confirm + expense warning |
| **Rollback** | `domain.pause_in_season` |
| **Risk** | High — Law of Minimum Domains |
| **Illegal variants** | Silent activation; all ten primary |

**Source:** Domain Architecture §5.1; §13 Deny.

## G2 `domain.pause_in_season`

| Field | Value |
|-------|-------|
| **Purpose** | Pause Domain Operate pressure |
| **Trigger** | Overload Season amend |
| **Required evidence** | Analytics + Reflection |
| **Affected entities** | Activation pause |
| **Approval** | User accept |
| **Rollback** | Reactivate Proposal |
| **Risk** | Medium |
| **Illegal variants** | Delete Domain history |

---

# 10. Category H — Legacy Recommendations

## H1 `legacy.curation_session_schedule`

| Field | Value |
|-------|-------|
| **Purpose** | Prompt Legacy Domain curation after Season close |
| **Trigger** | LegacyRecord sealed |
| **Required evidence** | Season archived |
| **Affected entities** | Curation Session schedule |
| **Approval** | User executes Session |
| **Rollback** | N/A |
| **Risk** | Low |
| **Illegal variants** | Auto-write narrative to LegacyRecord evidence section |

## H2 `legacy.principle_accept`

| Field | Value |
|-------|-------|
| **Purpose** | Promote Principle candidate |
| **Trigger** | Season/Journey Reflection |
| **Required evidence** | originReflectionId |
| **Affected entities** | `Principle.status` |
| **Approval** | User accept |
| **Rollback** | Retire Principle |
| **Risk** | Low |
| **Illegal variants** | AI-created Principle without Reflection |

## H3 `legacy.historian_narrative_draft`

| Field | Value |
|-------|-------|
| **Purpose** | Suggest curated narrative text for user edit |
| **Trigger** | Legacy curation |
| **Required evidence** | LegacyRecord + Artifact/Session citations |
| **Affected entities** | Narrative overlay only — not evidence mutation |
| **Approval** | User edits and seals via CurationRecord |
| **Rollback** | Discard draft |
| **Risk** | High if fiction |
| **Illegal variants** | Fabricated events (§13 Deny) |

---

# 11. Illegal Proposal Types (Global Deny)

These **must never** exist as accept-able proposal types:

| Illegal type | Deny reason |
|--------------|-------------|
| `mastery.grant` | §13 |
| `lifescore.set` | §13 |
| `session.complete` | §13 |
| `session.backfill` | §13 |
| `evidence.delete` | §13 |
| `achievement.grant` | §13 |
| `notification.engagement_bait` | §13 |
| `domain.activate_silent` | §13 |
| `reflection.autocomplete` | Reflection Engine §7 |
| `finance.execute_trade` | Authority boundary |
| `relationship.optimize_partner` | Ethics; Coach Doctrine §12 |

Engines must filter before `status=proposed`.

---

# 12. Approval Requirements Matrix

| Category | Confirm friction | Reflection required |
|----------|------------------|---------------------|
| Operate shrink counsel | Low | No |
| System amend | Medium | Weekly preferred |
| Season amend | High | Yes |
| Domain activate | High | Yes |
| Project drop | Medium | Monthly preferred |
| Legacy narrative | Medium | Curation Session |
| Illegal | Blocked | — |

---

# 13. Rollback Architecture

- Every accepted System-affecting Proposal creates `AdaptationApplication` with version before/after (Data Model).  
- Rollback = new Proposal referencing prior AdaptationApplication — not silent revert.  
- Session evidence never rolled back — compensating Sessions only.

---

# 14. Success Criteria

- Catalog exhausts all Recommendation/Planning/Coach Steer outputs.  
- Zero accepted illegal types in audit.  
- 100% accepted Proposals have citations.  
- User trust: Proposals readable without jargon (Coach Language Standards).

---

# Document Control

| Field | Value |
|-------|-------|
| Title | Aether OS V2 — AI Proposal Catalog |
| Version | 1.0 |
| Parent | Master AI Architecture 1.0 |

**End of AI Proposal Catalog.**
