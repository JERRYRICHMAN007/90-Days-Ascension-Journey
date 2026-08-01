# AETHER OS V2 — AI EVIDENCE DICTIONARY

**Classification:** Internal evidence-class specification  
**Status:** Binding  
**Parent doctrine (immutable):** `AETHER-OS-V2-MASTER-AI-ARCHITECTURE.md`  
**Related:** Data Model; Insight Specification §6; Memory Model §3  
**Constraint:** Architecture only. No UI/code/prompts/implementation.

Defines every **evidence class** intelligence may consume, with epistemic tier, confidence, expiry, citation format, priority for retrieval, and privacy level.

**Memory Model alignment (§3):** authoritative vs derived vs temporary.

---

# 1. Global Evidence Rules

| Rule | Source |
|------|--------|
| E1 Progress claims must chain to authoritative Session or Artifact completion | AI Law 1; Data Model |
| E2 Derived classes must carry `citationRefs` to authoritative | Data Model MetricObservation |
| E3 Temporary classes cannot support `high` confidence pattern claims alone | Insight Spec §8 |
| E4 Emotional annotations never authoritative for progress | Vision P5 |
| E5 Mastery/LifeScore read-only to AI — derived only | §13 Deny |
| E6 Chat transcripts not an evidence class | §3 Rules |

## Epistemic tiers

| Tier | Definition |
|------|------------|
| **authoritative** | Ground truth of execution or sealed archive |
| **derived** | Computed from authoritative with lineage |
| **temporary** | Draft, in-flight, or scaffolding |

---

# 2. Citation Format Standard

```text
evidence://{classKey}/{entityType}/{entityId}[?field=...&scope=...]
```

**drillLabel:** Human-readable pointer for Coach (Evidence-first communication).

**priority:** Retrieval order when context budget limited (1=highest).

---

# 3. Core Execution Evidence

## EV-Session

| Attribute | Value |
|-----------|-------|
| **Purpose** | Primary execution truth |
| **Tier** | authoritative |
| **Entity** | Session, SessionEvidence, specialized payloads |
| **Confidence** | high when terminal state + evidence payload |
| **Expiry** | permanent; voiding triggers retraction |
| **Citation format** | `evidence://EV-Session/Session/{id}` |
| **Priority** | 1 |
| **Privacy** | standard |

**Includes:** Workout, ReadingSession, PresenceSessionEvidence, MindProtocolEvidence, PracticeSessionEvidence, CurationRecord (as Session-linked).

**Rules:** Master AI Architecture §0 Law 1; Data Model Session laws.

## EV-Reflection

| Attribute | Value |
|-----------|-------|
| **Purpose** | Structured sense-making |
| **Tier** | authoritative when `status=completed` |
| **Entity** | Reflection |
| **Confidence** | high for completed; low for draft |
| **Expiry** | permanent |
| **Citation** | `evidence://EV-Reflection/Reflection/{id}` |
| **Priority** | 2 |
| **Privacy** | standard; Relationship altitude → elevated |

**Rules:** Cannot mark Sessions complete; Reflection Engine §7.

## EV-Artifact

| Attribute | Value |
|-----------|-------|
| **Purpose** | Externalized proof |
| **Tier** | authoritative when completed with Session linkage |
| **Entity** | Artifact, Content, CareerDeliverable, BrandAsset (when proof-linked) |
| **Confidence** | high with `definitionOfDoneMetAt` |
| **Expiry** | permanent |
| **Citation** | `evidence://EV-Artifact/Artifact/{id}` |
| **Priority** | 2 |
| **Privacy** | standard |

---

# 4. Derived Analytics Evidence

## EV-Analytics

| Attribute | Value |
|-----------|-------|
| **Purpose** | Evidence surfaces |
| **Tier** | derived |
| **Entity** | AnalyticsSnapshot, MetricObservation |
| **Confidence** | medium; high only if all metrics cite Sessions |
| **Expiry** | snapshot superseded; retain in Archive |
| **Citation** | `evidence://EV-Analytics/AnalyticsSnapshot/{id}` + drill refs |
| **Priority** | 3 |
| **Privacy** | standard |

**Rules:** §9 Pattern Engine; not user-editable.

## EV-Signal

| Attribute | Value |
|-----------|-------|
| **Purpose** | Interconnection coupling |
| **Tier** | derived |
| **Entity** | InterconnectionSignal |
| **Confidence** | medium (probabilistic language) |
| **Expiry** | resolved/dismissed/expired |
| **Citation** | `evidence://EV-Signal/InterconnectionSignal/{id}` |
| **Priority** | 2 when open |
| **Privacy** | standard |

**Rules:** Must cite evidenceRefs; §9 aggregation.

## EV-LifeScore

| Attribute | Value |
|-----------|-------|
| **Purpose** | Organism integrity pulse explain |
| **Tier** | derived |
| **Entity** | LifeScore |
| **Confidence** | medium interpretive |
| **Expiry** | ephemeral snapshot |
| **Citation** | `evidence://EV-LifeScore/LifeScore/{id}` + components drill |
| **Priority** | 4 |
| **Privacy** | standard |

**Rules:** §10 explain-only; AI cannot write.

## EV-Mastery

| Attribute | Value |
|-----------|-------|
| **Purpose** | Long-horizon trajectory read |
| **Tier** | derived |
| **Entity** | MasteryState, MasteryDelta |
| **Confidence** | medium-high with delta evidenceRefs |
| **Expiry** | deltas permanent |
| **Citation** | `evidence://EV-Mastery/MasteryDelta/{id}` |
| **Priority** | 4 |
| **Privacy** | standard |

**Rules:** Read-only; §13 Deny grant.

---

# 5. Season & Planning Evidence

## EV-Season

| Attribute | Value |
|-----------|-------|
| **Purpose** | Chapter contract |
| **Tier** | authoritative for identity statement, victory conditions, activations |
| **Entity** | Season, SeasonDomainActivation, SeasonVictoryCondition, SeasonNonNegotiable |
| **Confidence** | high |
| **Expiry** | archived Season immutable |
| **Citation** | `evidence://EV-Season/Season/{id}` |
| **Priority** | 2 |
| **Privacy** | standard |

## EV-Journey

| Attribute | Value |
|-----------|-------|
| **Purpose** | Finite arc context |
| **Tier** | authoritative status; narrative thesis scaffolding |
| **Entity** | Journey |
| **Confidence** | high for status; medium for thesis |
| **Expiry** | archived when ended |
| **Citation** | `evidence://EV-Journey/Journey/{id}` |
| **Priority** | 3 |
| **Privacy** | standard |

## EV-Project

| Attribute | Value |
|-----------|-------|
| **Purpose** | WIP and ship truth |
| **Tier** | authoritative |
| **Entity** | Project, Milestone, Goal |
| **Confidence** | high for status with Session/Artifact refs |
| **Expiry** | archived |
| **Citation** | `evidence://EV-Project/Project/{id}` |
| **Priority** | 3 |
| **Privacy** | standard |

## EV-System

| Attribute | Value |
|-----------|-------|
| **Purpose** | Protocol definition |
| **Tier** | authoritative current version; historical via AdaptationApplication |
| **Entity** | System, ShrinkTier, Habit |
| **Confidence** | high |
| **Expiry** | versioned |
| **Citation** | `evidence://EV-System/System/{id}?version=` |
| **Priority** | 2 in Steer; 3 in Operate |
| **Privacy** | standard |

---

# 6. Domain-Specific Evidence Classes

## EV-Knowledge

| Attribute | Value |
|-----------|-------|
| **Purpose** | Intake and transfer |
| **Tier** | authoritative: ReadingSession, finished Book/Resource; derived: transfer KPI |
| **Entities** | Book, LearningResource, ReadingSession, Skill |
| **Confidence** | high on ReadingSession complete |
| **Expiry** | permanent |
| **Citation** | `evidence://EV-Knowledge/ReadingSession/{id}` |
| **Priority** | 3 |
| **Privacy** | standard |

**Rules:** Domain Architecture Knowledge; notes not Mastery.

## EV-Body

| Attribute | Value |
|-----------|-------|
| **Purpose** | Training/recovery truth |
| **Tier** | authoritative: Workout, WorkoutExercise; supporting: BodyMetrics |
| **Entities** | Workout, BodyMetrics |
| **Confidence** | high with SessionEvidence |
| **Expiry** | permanent |
| **Citation** | `evidence://EV-Body/Workout/{id}` |
| **Priority** | 2 for readiness signals |
| **Privacy** | elevated for health metrics |

## EV-Brand

| Attribute | Value |
|-----------|-------|
| **Purpose** | Distribution proof |
| **Tier** | authoritative: Content published via Session; derived: proofMetrics (non_scoreboard) |
| **Entities** | Content, BrandAsset |
| **Confidence** | high on publish Session |
| **Expiry** | permanent |
| **Citation** | `evidence://EV-Brand/Content/{id}` |
| **Priority** | 3 |
| **Privacy** | standard |

**Rules:** Vanity metrics flagged non_scoreboard (Data Model Content).

## EV-Career

| Attribute | Value |
|-----------|-------|
| **Purpose** | Vocational deliverables |
| **Tier** | authoritative deliverable + Session |
| **Entities** | CareerDeliverable, Career Sessions |
| **Confidence** | high |
| **Expiry** | permanent |
| **Citation** | `evidence://EV-Career/CareerDeliverable/{id}` |
| **Priority** | 3 |
| **Privacy** | standard |

## EV-Spirit

| Attribute | Value |
|-----------|-------|
| **Purpose** | Practice integrity |
| **Tier** | authoritative PracticeSessionEvidence |
| **Entities** | PracticeSessionEvidence |
| **Confidence** | high |
| **Expiry** | permanent |
| **Citation** | `evidence://EV-Spirit/PracticeSessionEvidence/{id}` |
| **Priority** | 3 |
| **Privacy** | elevated (user-defined sacred) |

## EV-Finance

| Attribute | Value |
|-----------|-------|
| **Purpose** | Stewardship events |
| **Tier** | authoritative FinanceRecord; derived runway aggregates |
| **Entities** | FinanceRecord |
| **Confidence** | high when tied to Wealth review Session |
| **Expiry** | permanent with compensating corrections |
| **Citation** | `evidence://EV-Finance/FinanceRecord/{id}` |
| **Priority** | 3 |
| **Privacy** | **restricted** — minimum necessary in manifest |

**Rules:** Domain Architecture Wealth; no guru hype (§6 Recommendation).

## EV-Relationships

| Attribute | Value |
|-----------|-------|
| **Purpose** | Presence integrity |
| **Tier** | authoritative PresenceSessionEvidence |
| **Entities** | RelationshipBond (metadata minimal), PresenceSessionEvidence |
| **Confidence** | high on Session |
| **Expiry** | permanent |
| **Citation** | `evidence://EV-Relationships/PresenceSessionEvidence/{id}` |
| **Priority** | 3 |
| **Privacy** | **restricted** — bond redaction default |

**Rules:** No scoring other humans; §14 Privacy.

## EV-Mind

| Attribute | Value |
|-----------|-------|
| **Purpose** | Focus/regulation protocols |
| **Tier** | authoritative MindProtocolEvidence; temporary SessionAnnotation |
| **Entities** | MindProtocolEvidence, SessionAnnotation |
| **Confidence** | high protocol; annotation non-scoring |
| **Expiry** | annotation grace then append-only |
| **Citation** | `evidence://EV-Mind/MindProtocolEvidence/{id}` |
| **Priority** | 3 |
| **Privacy** | standard |

## EV-Projects (Domain organ)

| Attribute | Value |
|-----------|-------|
| **Purpose** | Portfolio ship evidence |
| **Tier** | same as EV-Project + cross-links |
| **Note** | Organ-level patterns use EV-Project + EV-Artifact + EV-Session from Projects Domain |
| **Priority** | 2 during ship Seasons |

## EV-Legacy (Archive)

| Attribute | Value |
|-----------|-------|
| **Purpose** | Sealed history |
| **Tier** | authoritative evidence sections; interpretive curated narrative labeled |
| **Entities** | LegacyRecord, LegacyVault, Principle, CurationRecord |
| **Confidence** | high for evidence section quotes |
| **Expiry** | permanent |
| **Citation** | `evidence://EV-Legacy/LegacyRecord/{id}?section=evidence` |
| **Priority** | 3 Remember mode |
| **Privacy** | standard; narrative may redact Relationship |

**Rules:** §13 no fabricate; Historian role.

---

# 7. Temporary & Scaffolding Evidence

## EV-DailyAction

| Tier | temporary / scaffolding  
| Use | Operate queue only — not Mastery  
| Confidence | none for progress claims  
| Priority | 1 for Now ranking context only  

## EV-Proposal

| Tier | temporary until accepted  
| Use | rationale citations only  
| Confidence | per Proposal validation  

## EV-Insight

| Tier | interpretive output — not input for progress claims without underlying citations  

## EV-ChatTurn

| Tier | **not valid evidence** — excluded  

---

# 8. Retrieval Priority Matrix (Context Budget)

When context budget constrained, drop in reverse order:

1. Keep: EV-Session (today + window), EV-Season, EV-System (active), EV-DailyAction  
2. Then: EV-Signal open, EV-Reflection recent  
3. Then: EV-Analytics latest scope  
4. Then: EV-Project/Journey active  
5. Last: EV-Mastery, EV-LifeScore, EV-Legacy (unless Remember mode)

**Source:** §11 Context Management.

---

# 9. Privacy Levels

| Level | Handling |
|-------|----------|
| **standard** | Full entity in manifest |
| **elevated** | Redact free-text notes in Notification summaries |
| **restricted** | Finance amounts, Relationship bond details — ids only in manifest |

---

# 10. Success Criteria

- Every Insight citation maps to a dictionary classKey.  
- Drill from derived to authoritative always defined.  
- Privacy restrictions enforced in Context manifest redactions.  
- Zero progress claims cite EV-ChatTurn or draft-only classes.

---

# Document Control

| Field | Value |
|-------|-------|
| Title | Aether OS V2 — AI Evidence Dictionary |
| Version | 1.0 |
| Parent | Master AI Architecture 1.0 |

**End of AI Evidence Dictionary.**
