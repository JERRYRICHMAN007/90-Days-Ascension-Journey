/** Master AI Architecture + operational docs — domain enums (no persistence). */

export enum AIEngineKind {
  Coaching = 'COACHING',
  Decision = 'DECISION',
  Recommendation = 'RECOMMENDATION',
  Reflection = 'REFLECTION',
  Planning = 'PLANNING',
  PatternDetection = 'PATTERN_DETECTION',
  ContextManagement = 'CONTEXT_MANAGEMENT',
  Personalization = 'PERSONALIZATION',
  LifeScoreIntelligence = 'LIFE_SCORE_INTELLIGENCE',
  Memory = 'MEMORY',
}

export enum AIRoleKind {
  EvidenceMemorySteward = 'EVIDENCE_MEMORY_STEWARD',
  SeasonAlignmentCoach = 'SEASON_ALIGNMENT_COACH',
  SystemAdapter = 'SYSTEM_ADAPTER',
  InterconnectionGuardian = 'INTERCONNECTION_GUARDIAN',
  ReflectionFacilitator = 'REFLECTION_FACILITATOR',
  ClarityEnforcer = 'CLARITY_ENFORCER',
  IntegritySentinel = 'INTEGRITY_SENTINEL',
  PlanningCounsel = 'PLANNING_COUNSEL',
  PatternAnalyst = 'PATTERN_ANALYST',
  LegacyHistorian = 'LEGACY_HISTORIAN',
  PersonaCalibrator = 'PERSONA_CALIBRATOR',
}

export enum AIInteractionPoint {
  Home = 'HOME',
  Operate = 'OPERATE',
  SessionReady = 'SESSION_READY',
  SessionComplete = 'SESSION_COMPLETE',
  Reflection = 'REFLECTION',
  WeeklyReview = 'WEEKLY_REVIEW',
  MonthlyReview = 'MONTHLY_REVIEW',
  SeasonReview = 'SEASON_REVIEW',
  Analytics = 'ANALYTICS',
  Legacy = 'LEGACY',
  Remember = 'REMEMBER',
  Coach = 'COACH',
  Steer = 'STEER',
  Understand = 'UNDERSTAND',
}

export enum AIContextScope {
  Operate = 'OPERATE',
  Steer = 'STEER',
  Understand = 'UNDERSTAND',
  Remember = 'REMEMBER',
  Legacy = 'LEGACY',
  Configure = 'CONFIGURE',
}

export enum AIInsightStatus {
  Generated = 'GENERATED',
  Delivered = 'DELIVERED',
  Seen = 'SEEN',
  Archived = 'ARCHIVED',
  Retracted = 'RETRACTED',
}

export enum AIProposalStatus {
  Proposed = 'PROPOSED',
  Accepted = 'ACCEPTED',
  Rejected = 'REJECTED',
  Expired = 'EXPIRED',
  Withdrawn = 'WITHDRAWN',
}

export enum AIRecommendationPriority {
  CriticalIntegrity = 'CRITICAL_INTEGRITY',
  Operate = 'OPERATE',
  Steer = 'STEER',
  Informational = 'INFORMATIONAL',
}

export enum AIEvidenceEpistemicTier {
  Authoritative = 'AUTHORITATIVE',
  Derived = 'DERIVED',
  Temporary = 'TEMPORARY',
  Invalid = 'INVALID', // e.g. chat — must never cite for progress
}

export enum AIPrivacyLevel {
  Standard = 'STANDARD',
  Elevated = 'ELEVATED',
  Restricted = 'RESTRICTED',
}

export enum AIInsightConfidence {
  High = 'HIGH',
  Medium = 'MEDIUM',
  Low = 'LOW',
  None = 'NONE',
}

export enum AIValidationResult {
  Pass = 'PASS',
  PassWithHypothesis = 'PASS_WITH_HYPOTHESIS',
  Blocked = 'BLOCKED',
  Refusal = 'REFUSAL',
}

export enum AIFailureKind {
  InsufficientEvidence = 'INSUFFICIENT_EVIDENCE',
  StaleContext = 'STALE_CONTEXT',
  BoundaryViolation = 'BOUNDARY_VIOLATION',
  HallucinationRisk = 'HALLUCINATION_RISK',
  UserDistress = 'USER_DISTRESS',
  SystemOverload = 'SYSTEM_OVERLOAD',
  ProposalRejected = 'PROPOSAL_REJECTED',
  PromptInjection = 'PROMPT_INJECTION',
  IllegalProposalType = 'ILLEGAL_PROPOSAL_TYPE',
}

export enum AITrustEventKind {
  InsightCreated = 'INSIGHT_CREATED',
  InsightValidated = 'INSIGHT_VALIDATED',
  InsightDelivered = 'INSIGHT_DELIVERED',
  InsightRetracted = 'INSIGHT_RETRACTED',
  ProposalCreated = 'PROPOSAL_CREATED',
  ProposalAccepted = 'PROPOSAL_ACCEPTED',
  ProposalRejected = 'PROPOSAL_REJECTED',
  AdaptationApplied = 'ADAPTATION_APPLIED',
  EngineInvocation = 'ENGINE_INVOCATION',
  BoundaryDenied = 'BOUNDARY_DENIED',
}

export enum MemorySliceKind {
  Working = 'WORKING',
  Episodic = 'EPISODIC',
  Semantic = 'SEMANTIC',
  Archive = 'ARCHIVE',
  InsightGraph = 'INSIGHT_GRAPH',
}

export enum PatternSignalKind {
  Correlation = 'CORRELATION',
  SystemCollapse = 'SYSTEM_COLLAPSE',
  ZombieConsistency = 'ZOMBIE_CONSISTENCY',
  Overload = 'OVERLOAD',
  DomainCoupling = 'DOMAIN_COUPLING',
  ConsistencyTrend = 'CONSISTENCY_TREND',
}
