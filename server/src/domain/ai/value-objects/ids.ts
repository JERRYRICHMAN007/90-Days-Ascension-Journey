/** Branded IDs for AI bounded context (logical identity). */

declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };

export type LifeId = Brand<string, 'LifeId'>;
export type UserId = Brand<string, 'UserId'>;
export type SeasonId = Brand<string, 'SeasonId'>;
export type AIInsightId = Brand<string, 'AIInsightId'>;
export type AIProposalId = Brand<string, 'AIProposalId'>;
export type AIInteractionId = Brand<string, 'AIInteractionId'>;
export type AITrustEventId = Brand<string, 'AITrustEventId'>;
export type AdaptationApplicationId = Brand<string, 'AdaptationApplicationId'>;
export type AIEngineInvocationId = Brand<string, 'AIEngineInvocationId'>;
export type AITriggerKey = Brand<string, 'AITriggerKey'>;

export function asLifeId(id: string): LifeId {
  return id as LifeId;
}
export function asAIInsightId(id: string): AIInsightId {
  return id as AIInsightId;
}
export function asAIProposalId(id: string): AIProposalId {
  return id as AIProposalId;
}
export function asAdaptationApplicationId(id: string): AdaptationApplicationId {
  return id as AdaptationApplicationId;
}
export function asUserId(id: string): UserId {
  return id as UserId;
}
