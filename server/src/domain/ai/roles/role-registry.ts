import { AIRoleKind } from '../value-objects/enums';

/** Composable roles — no inheritance (Master AI Architecture §2). */

export interface AIRoleDescriptor {
  readonly kind: AIRoleKind;
  readonly masterRef: string;
  readonly mayApproveSessionComplete: false;
  readonly mayGrantMastery: false;
}

export const ROLE_REGISTRY: Record<AIRoleKind, AIRoleDescriptor> = {
  [AIRoleKind.EvidenceMemorySteward]: {
    kind: AIRoleKind.EvidenceMemorySteward,
    masterRef: 'Master AI Architecture §2',
    mayApproveSessionComplete: false,
    mayGrantMastery: false,
  },
  [AIRoleKind.SeasonAlignmentCoach]: {
    kind: AIRoleKind.SeasonAlignmentCoach,
    masterRef: 'Master AI Architecture §2',
    mayApproveSessionComplete: false,
    mayGrantMastery: false,
  },
  [AIRoleKind.SystemAdapter]: {
    kind: AIRoleKind.SystemAdapter,
    masterRef: 'Master AI Architecture §2',
    mayApproveSessionComplete: false,
    mayGrantMastery: false,
  },
  [AIRoleKind.InterconnectionGuardian]: {
    kind: AIRoleKind.InterconnectionGuardian,
    masterRef: 'Master AI Architecture §2',
    mayApproveSessionComplete: false,
    mayGrantMastery: false,
  },
  [AIRoleKind.ReflectionFacilitator]: {
    kind: AIRoleKind.ReflectionFacilitator,
    masterRef: 'Master AI Architecture §2',
    mayApproveSessionComplete: false,
    mayGrantMastery: false,
  },
  [AIRoleKind.ClarityEnforcer]: {
    kind: AIRoleKind.ClarityEnforcer,
    masterRef: 'Master AI Architecture §2',
    mayApproveSessionComplete: false,
    mayGrantMastery: false,
  },
  [AIRoleKind.IntegritySentinel]: {
    kind: AIRoleKind.IntegritySentinel,
    masterRef: 'Master AI Architecture §2',
    mayApproveSessionComplete: false,
    mayGrantMastery: false,
  },
  [AIRoleKind.PlanningCounsel]: {
    kind: AIRoleKind.PlanningCounsel,
    masterRef: 'Master AI Architecture §2',
    mayApproveSessionComplete: false,
    mayGrantMastery: false,
  },
  [AIRoleKind.PatternAnalyst]: {
    kind: AIRoleKind.PatternAnalyst,
    masterRef: 'Master AI Architecture §2',
    mayApproveSessionComplete: false,
    mayGrantMastery: false,
  },
  [AIRoleKind.LegacyHistorian]: {
    kind: AIRoleKind.LegacyHistorian,
    masterRef: 'Master AI Architecture §2',
    mayApproveSessionComplete: false,
    mayGrantMastery: false,
  },
  [AIRoleKind.PersonaCalibrator]: {
    kind: AIRoleKind.PersonaCalibrator,
    masterRef: 'Master AI Architecture §2',
    mayApproveSessionComplete: false,
    mayGrantMastery: false,
  },
};

export interface RoleComposition {
  readonly dominant: AIRoleKind;
  readonly supporting: readonly AIRoleKind[];
}

export function composeRoles(dominant: AIRoleKind, supporting: readonly AIRoleKind[] = []): RoleComposition {
  return { dominant, supporting: [...new Set(supporting.filter((r) => r !== dominant))] };
}
