export const ANON_LIMIT = 10;
export const USER_LIMIT = 30;
export const ANON_WORD_LIMIT = 500;
export const USER_WORD_LIMIT = 1200;
export const PRO_WORD_LIMIT = 4000;
export const FREE_HISTORY_LIMIT = 12;
export const PRO_HISTORY_LIMIT = 200;

export const LS_KEYS = {
  anonId: "rewrito.anonId",
  anonCount: "rewrito.anonCount",
  useCasePrefix: "rewrito.useCase",
  pendingName: "rewrito.pendingName",
} as const;

export type UsageState = {
  isAuthenticated: boolean;
  used: number;
  limit: number;
  remaining: number;
};
