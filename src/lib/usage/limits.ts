export const ANON_LIMIT = 3;
export const USER_LIMIT = 30;

export const LS_KEYS = {
  anonId: "rewrito.anonId",
  anonCount: "rewrito.anonCount",
} as const;

export type UsageState = {
  isAuthenticated: boolean;
  used: number;
  limit: number;
  remaining: number;
};
