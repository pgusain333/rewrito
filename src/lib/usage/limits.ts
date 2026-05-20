export const ANON_LIMIT = 10;
export const USER_LIMIT = 30;

export const LS_KEYS = {
  anonId: "rewrito.anonId",
  anonCount: "rewrito.anonCount",
  useCasePrefix: "rewrito.useCase",
} as const;

export type UsageState = {
  isAuthenticated: boolean;
  used: number;
  limit: number;
  remaining: number;
};
