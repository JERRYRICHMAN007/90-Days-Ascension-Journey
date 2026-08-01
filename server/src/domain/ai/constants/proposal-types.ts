/** AI Proposal Catalog — legal types (docs/aether-os-v2/AETHER-OS-V2-AI-PROPOSAL-CATALOG.md) */

export enum AIProposalType {
  SystemProtocolAmend = 'system.protocol_amend',
  SystemShrinkTierAdd = 'system.shrink_tier_add',
  SystemPause = 'system.pause',
  SystemRetire = 'system.retire',
  OperateSelectShrinkTier = 'operate.select_shrink_tier',
  OperateMinimumFaithfulSet = 'operate.minimum_faithful_set',
  JourneyActivate = 'journey.activate',
  JourneyPhaseAdvance = 'journey.phase_advance',
  JourneyCompleteOrAbandon = 'journey.complete_or_abandon',
  SeasonAmend = 'season.amend',
  SeasonVictoryConditionWaive = 'season.victory_condition_waive',
  ProjectFinishOrDrop = 'project.finish_or_drop',
  GoalRetire = 'goal.retire',
  ReviewWeeklyDue = 'review.weekly_due',
  ReviewSeasonCloseStart = 'review.season_close_start',
  KnowledgeResourceFinishOrDrop = 'knowledge.resource_finish_or_drop',
  KnowledgeTransferToProject = 'knowledge.transfer_to_project',
  DomainActivateInSeason = 'domain.activate_in_season',
  DomainPauseInSeason = 'domain.pause_in_season',
  LegacyCurationSessionSchedule = 'legacy.curation_session_schedule',
  LegacyPrincipleAccept = 'legacy.principle_accept',
  LegacyHistorianNarrativeDraft = 'legacy.historian_narrative_draft',
}

/** Master AI Architecture §13 + Proposal Catalog §11 */
export enum IllegalAIProposalType {
  MasteryGrant = 'mastery.grant',
  LifeScoreSet = 'lifescore.set',
  SessionComplete = 'session.complete',
  SessionBackfill = 'session.backfill',
  EvidenceDelete = 'evidence.delete',
  AchievementGrant = 'achievement.grant',
  NotificationEngagementBait = 'notification.engagement_bait',
  DomainActivateSilent = 'domain.activate_silent',
  ReflectionAutocomplete = 'reflection.autocomplete',
  FinanceExecuteTrade = 'finance.execute_trade',
  RelationshipOptimizePartner = 'relationship.optimize_partner',
}

export type AnyProposalTypeKey = AIProposalType | IllegalAIProposalType;

export function isIllegalProposalType(type: string): type is IllegalAIProposalType {
  return Object.values(IllegalAIProposalType).includes(type as IllegalAIProposalType);
}

export function isLegalProposalType(type: string): type is AIProposalType {
  return Object.values(AIProposalType).includes(type as AIProposalType);
}
