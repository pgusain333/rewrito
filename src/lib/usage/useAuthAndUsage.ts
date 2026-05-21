"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { USAGE_COUNT_TRACKING_LIMIT, LS_KEYS } from "@/lib/usage/limits";

export type SessionUser = {
  id: string;
  email: string | null;
  name: string | null;
  plan?: "free" | "pro";
};

function generateAnonId(): string {
  // Lightweight, no extra deps.
  return (
    "anon_" +
    Math.random().toString(36).slice(2, 10) +
    Date.now().toString(36)
  );
}

export function useAuthAndUsage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [anonId, setAnonId] = useState<string | null>(null);
  const [anonUsed, setAnonUsed] = useState<number>(0);
  const [userUsed, setUserUsed] = useState<number>(0);

  // Init anon identity + count from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    let id = window.localStorage.getItem(LS_KEYS.anonId);
    if (!id) {
      id = generateAnonId();
      window.localStorage.setItem(LS_KEYS.anonId, id);
    }
    setAnonId(id);
    const c = Number(window.localStorage.getItem(LS_KEYS.anonCount) ?? "0");
    setAnonUsed(Number.isFinite(c) ? c : 0);
  }, []);

  // Subscribe to auth + fetch usage for logged-in users
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let mounted = true;

    async function loadUsage(uid: string) {
      const { data } = await supabase
        .from("usage_limits")
        .select("request_count")
        .eq("user_id", uid)
        .maybeSingle();
      if (!mounted) return;
      setUserUsed(data?.request_count ?? 0);
    }

    function toSessionUser(u: User): SessionUser {
      const rawPlan = u.app_metadata?.plan ?? u.user_metadata?.plan;
      const rawName =
        u.user_metadata?.full_name ??
        u.user_metadata?.name ??
        u.user_metadata?.display_name;
      return {
        id: u.id,
        email: u.email ?? null,
        name: typeof rawName === "string" && rawName.trim() ? rawName.trim() : null,
        plan: rawPlan === "pro" ? "pro" : "free",
      };
    }

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const u = data.user;
      if (u) {
        setUser(toSessionUser(u));
        loadUsage(u.id);
      }
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      const u = session?.user;
      if (u) {
        setUser(toSessionUser(u));
        loadUsage(u.id);
      } else {
        setUser(null);
        setUserUsed(0);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const incrementAnon = useCallback(() => {
    setAnonUsed((prev) => {
      const next = prev + 1;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(LS_KEYS.anonCount, String(next));
      }
      return next;
    });
  }, []);

  const setUsageFromServer = useCallback(
    (used: number) => {
      if (user) setUserUsed(used);
      else {
        setAnonUsed(used);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(LS_KEYS.anonCount, String(used));
        }
      }
    },
    [user]
  );

  const signOut = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
    setUserUsed(0);
  }, []);

  const limit = USAGE_COUNT_TRACKING_LIMIT;
  const used = user ? userUsed : anonUsed;
  const remaining = Math.max(0, limit - used);

  return {
    user,
    loading,
    anonId,
    used,
    limit,
    remaining,
    incrementAnon,
    setUsageFromServer,
    signOut,
  };
}
