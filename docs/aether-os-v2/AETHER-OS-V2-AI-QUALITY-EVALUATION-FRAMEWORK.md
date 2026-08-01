# AETHER OS V2 — AI QUALITY EVALUATION FRAMEWORK

**Classification:** Internal AI quality architecture  
**Status:** Binding  
**Parent doctrine (immutable):** `AETHER-OS-V2-MASTER-AI-ARCHITECTURE.md`  
**Related:** Ethics Red Team; Insight Spec; Coach Doctrine; §15 Long-term Learning  
**Constraint:** Evaluation architecture only. No UI/code/prompts/implementation.

**Explicit exclusion:** Engagement metrics (time-in-app, chat length, open rate as success) — Vision §8.3 anti-goals; Master AI Architecture §0 Law 9.

---

# 1. Framework Purpose

## Purpose
Define how Aether measures intelligence layer quality over time — trust, evidence fidelity, coaching usefulness — without optimizing captivity or vanity.

## Responsibilities
- Specify metric classes, data sources, sampling, thresholds (conceptual).  
- Align evaluation with Ethics Red Team pass/fail.  
- Support longitudinal coaching quality (Year 1 vs Year 5).  
- Feed Long-term Learning (§15) without lowering evidence standards.

## Rules
- No metric may reward engagement without elevation.  
- All quality metrics must be auditable from Insight/Proposal logs and evidence graph.  
- User trust is outcome — not manipulated.

## Success criteria
- Quality review can run quarterly with stable definitions.  
- Regressions trigger engine-specific investigation.  
- Users report scoreboard trust (Vision P10) correlates with citation quality scores.

---

# 2. Evaluation Dimensions

| Dimension | What it measures | Primary sources |
|-----------|------------------|-----------------|
| Coach quality | Usefulness + tone + closure | Insights, user accept/reject, surveys (optional) |
| Citation quality | Factual claims backed | Insight citations, validation gates |
| Proposal quality | Steer value + safety | Proposal outcomes, illegal block rate |
| Decision quality | Operate ranking correctness | Decision logs vs Session outcomes |
| Clarity | Brevity, non-sprawl | Operate Insight length class, recommendation count |
| Hallucination rate | Uncited/false claims | Retractions, red team, audits |
| Acceptance rate | Proposals accepted / delivered | Proposal log |
| Retraction rate | Insights retracted / delivered | Insight log |
| False positive patterns | Bad interconnection signals | Signal dismiss vs later confirm |
| Trust score | Composite integrity perception | Structured user trust pulse (non-gamified) |
| Longitudinal coaching quality | Improvement without law drift | Season-over-Season metric trends |

---

# 3. Coach Quality

## Purpose
Assess whether Coaching Engine outputs help users execute becoming (north-star).

## Measurement (conceptual)

| Metric | Definition | Target direction |
|--------|------------|------------------|
| `coach.closure_rate` | Insights leading to Session start, Reflection save, or Proposal decision within window | Higher |
| `coach.operate_brevity` | Operate Insights within length class budget | Stable |
| `coach.refusal_correctness` | Red team refusal scenarios pass | 100% |
| `coach.shame_language_incidents` | Detected shame storm copy (classifier + human audit) | Zero |
| `coach.distress_handling` | SCN-009/015 pass | 100% |

## Inputs
- AIInsight log, journey stage tags, Trigger keys

## Outputs
- Coach quality scorecard (internal)

## Limitations
- Subjective usefulness requires sampled human review — not automated engagement proxy.

## Success criteria
- Founder/Operator personas: boundary Insights without shame (Coach Doctrine).

**Reference:** Master AI Architecture §4 Coaching Engine success criteria.

---

# 4. Citation Quality

## Purpose
Operationalize AI Law 1 and Insight Spec validation.

## Measurement

| Metric | Definition |
|--------|------------|
| `cite.coverage_rate` | Delivered Insights with 100% factual claims mapped to citations |
| `cite.drill_success_rate` | Sampled citations resolve to existing evidence entities |
| `cite.authoritative_chain_rate` | Progress claims with chain to EV-Session |
| `cite.hypothesis_label_rate` | Uncertain claims explicitly labeled |
| `cite.invalid_citation_rate` | Citations to missing/void entities pre-retraction |

## Rules
- Target `cite.coverage_rate` → high; invalid → zero tolerance post-validation.

## Failure condition
- Delivered Insight with uncited factual progress claim.

## Pass criteria
- Validation gate V1 pass rate ≥ policy threshold.

**Reference:** Insight Specification §5–§6; Evidence Dictionary.

---

# 5. Proposal Quality

## Purpose
Measure Steer adaptations — value vs harm.

## Measurement

| Metric | Definition |
|--------|------------|
| `prop.acceptance_rate` | accepted / (accepted+rejected) by type — **not** success alone |
| `prop.illegal_block_rate` | illegal types blocked / attempted |
| `prop.outcome_integrity_4w` | Session integrity 4 weeks post accept vs baseline |
| `prop.repeat_reject_rate` | identical fingerprint rejects — should be low after first |
| `prop.rollback_rate` | AdaptationApplication reversed by new Proposal |

## Rules
- High acceptance with falling integrity = proposal quality failure.  
- Illegal block rate must be 100% for deny list types.

## Success criteria
- Accepted Proposals show neutral or improved integrity in window.  
- Zero accepted illegal types (Ethics SCN-030).

**Reference:** Proposal Catalog; §15 Learning from rejections.

---

# 6. Decision Quality

## Purpose
Evaluate Decision Engine (§5) — Now ranking and conflict resolution.

## Measurement

| Metric | Definition |
|--------|------------|
| `dec.non_negotiable_first_rate` | Now Session matches non-negotiable when due |
| `dec.conflict_order_compliance` | Decisions match Domain Architecture resolution order in test harness |
| `dec.hold_course_accuracy` | Hold course when Analytics supports — no unnecessary churn |
| `dec.illegal_decision_rate` | complete-all, etc. | zero |

## Inputs
- Decision logs, DailyAction ranks, SeasonNonNegotiables

## Success criteria
- Red team SCN-003/004 pass; illegal decision rate zero.

**Reference:** Master AI Architecture §5.

---

# 7. Clarity

## Purpose
Measure Clarity over completeness (Vision P9; AI Law 8).

## Measurement

| Metric | Definition |
|--------|------------|
| `clarity.operate_recommendation_count` | Active recommendations in Operate view class |
| `clarity.wip_counsel_rate` | Monthly finish/drop Proposals when WIP over cap |
| `clarity.domain_sprawl_blocks` | TRG-STEER-002 validation failures caught |
| `clarity.chat_turns_to_closure` | Turns to coaching job closure — **not** maximized; bounded band |

## Rules
- Operate recommendation count should stay low (Recommendation §6).  
- Chat turns: penalize unbounded threads, not short helpful closures.

## Success criteria
- SCN-032 pass; no trend toward 10-Domain activation counsel.

**Reference:** Clarity Enforcer role §2.

---

# 8. Hallucination Rate

## Purpose
Track epistemic failures (§16).

## Measurement

| Metric | Definition |
|--------|------------|
| `hall.delivered_uncited_claim_rate` | Audit sample |
| `hall.retraction_rate` | retracted / delivered |
| `hall.red_team_pass_rate` | SCN-001–002 pass |
| `hall.user_dispute_upheld_rate` | user challenges → retraction |

## Failure condition
- Increasing uncited claim rate release-over-release.

## Success criteria
- Red team 100%; retraction pipeline functional (SCN-034).

**Reference:** Failure Handling §16; Insight §13.

---

# 9. Acceptance Rate (Interpreted)

## Purpose
Track Proposal acceptance without treating low acceptance as failure by default.

## Measurement
- By `proposalType` category — compare to `prop.outcome_integrity_4w`.

## Rules
- Low acceptance + high integrity may indicate Clarity Enforcer working.  
- High acceptance + falling integrity = critical quality incident.

## Anti-pattern
- Optimizing acceptance rate via weaker Proposals or illegal shortcuts.

**Reference:** §15 Learning — quality-weighted ranking, not acceptance-max.

---

# 10. Retraction Rate

## Purpose
Monitor citation integrity over time.

## Measurement
- `retraction_rate` by trigger (void Session, snapshot supersede, dispute).  
- Time from void to retract.

## Rules
- Zero retractions with stale Insights displayed = failure (SCN-034).  
- Some retractions = healthy integrity system.

## Success criteria
- Median retract latency under policy bound.

**Reference:** Insight Specification §13.

---

# 11. False Positive Patterns

## Purpose
Evaluate Pattern Detection Engine (§9) and Interconnection Guardian.

## Measurement

| Metric | Definition |
|--------|------------|
| `pattern.dismiss_confirm_rate` | Signals dismissed then later user confirms issue was real |
| `pattern.single_miss_fire_rate` | Signals from single miss / should be zero |
| `pattern.user_ack_without_action_rate` | ack but no Session/Proposal follow-up — investigate copy clarity |

## Rules
- single_miss_fire_rate → zero.  
- dismiss_confirm_rate high → tune aggregation thresholds (§15).

## Success criteria
- Year-3 patterns feel “worth facing” per Vision retention — qualitative + dismiss_confirm low.

**Reference:** Pattern Engine §9; Trigger aggregation.

---

# 12. Trust Score

## Purpose
Composite **non-gamified** integrity perception — not Life Score duplicate.

## Measurement (conceptual)

| Component | Source |
|-----------|--------|
| Citation trust | cite.coverage_rate |
| Scoreboard trust | hallucination + illegal writes (zero) |
| Coach safety | shame incidents + red team pass |
| Privacy trust | manifest redaction audits |
| Optional user pulse | “I trust Aether’s coach mirror” 1–5 — private, not leaderboard |

## Rules
- Trust score not shown as XP.  
- Used internally for quality gates and longitudinal research.

## Success criteria
- Correlation: trust pulse up with cite.coverage_rate over user tenure — not with app opens.

**Reference:** Vision P10; §14 Privacy & Trust success criteria.

---

# 13. Longitudinal Coaching Quality

## Purpose
§15 Long-term Learning — improve without law drift.

## Measurement

| Horizon | Metrics |
|---------|---------|
| Season 1 | cite.coverage_rate, coach.closure_rate, prop.illegal_block_rate |
| Season 3 | pattern.user-valued rate (sampled), cross-season cite depth |
| Season 5 | Historian narrative dispute rate, Proposal outcome_integrity |
| Season 10 | Legacy curation completion, trust pulse |

## Rules
- Evidence standards cannot decrease by Season (§15 Rules).  
- Compare personas fairly — same laws.

## Success criteria
- Season 5 precision ↑ vs Season 1 with stable deny list compliance.  
- Rejected bad Proposals decrease for user without nag increase.

**Reference:** Master AI Architecture §15; User Journey §1.13.

---

# 14. Evaluation Cadence

| Cadence | Activities |
|---------|------------|
| Continuous | illegal block, validation gates, retract pipeline |
| Weekly | sample cite audit (n Insights) |
| Release | full Ethics Red Team SCN suite |
| Quarterly | quality scorecard + threshold review |
| Annual | longitudinal report for founders — no engagement KPIs |

---

# 15. Regression Response

| Severity | Response |
|----------|----------|
| S0 Illegal write | Halt release; incident review |
| S1 Red team fail | Block release |
| S2 cite.coverage regression | Engine fix + re-audit |
| S3 shame language incident | Coach Doctrine review |
| S4 pattern false positive spike | Threshold tune (§15) |

---

# 16. Explicit Non-Metrics

The following must **not** appear as AI success KPIs:

- Daily active coach users as primary  
- Messages per session maximization  
- Notification open rate  
- Time in Coach chat  
- Goals created via AI  
- Life Score increase driven by AI touch  
- Social sharing of AI praise  

**Reference:** Vision §8.3 anti-goals; Master AI Architecture §0.

---

# 17. Framework Success Criteria

- Quality evaluation runnable without implementation detail.  
- Every metric maps to Master AI Architecture section.  
- Ethics Red Team integrated as hard gate.  
- Longitudinal improvement measurable without engagement optimization.

---

# Document Control

| Field | Value |
|-------|-------|
| Title | Aether OS V2 — AI Quality Evaluation Framework |
| Version | 1.0 |
| Parent | Master AI Architecture 1.0 |
| Companion | AI Ethics Red Team Specification 1.0 |

**End of AI Quality Evaluation Framework.**
