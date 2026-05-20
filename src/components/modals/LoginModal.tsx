"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Headline override - different for the trial-limit case. */
  headline?: string;
  subline?: string;
};

export function LoginModal({
  open,
  onClose,
  headline = "Welcome to rewrito",
  subline = "Sign in to keep rewriting.",
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const redirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    });
    if (error) {
      setError(error.message);
      setStatus("error");
    }
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const emailRedirectTo =
      typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo },
    });
    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="login-headline">
      <div className="mb-5 text-center">
        <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-softPurple text-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 2 L15 9 L22 10 L17 15 L18 22 L12 18 L6 22 L7 15 L2 10 L9 9 Z" />
          </svg>
        </div>
        <h2 id="login-headline" className="text-xl font-semibold text-ink">
          {headline}
        </h2>
        <p className="mt-1.5 text-sm text-ink-muted">{subline}</p>
      </div>

      <button onClick={handleGoogle} className="btn-secondary w-full">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.12s.13-1.46.35-2.12V7.04H2.18C1.43 8.53 1 10.22 1 12s.43 3.47 1.18 4.96l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
        </svg>
        Continue with Google
      </button>

      <div className="my-4 flex items-center gap-3 text-xs text-ink-subtle">
        <div className="h-px flex-1 bg-line" />
        <span>or</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      {status === "sent" ? (
        <div className="rounded-xl bg-bg-section p-4 text-center text-sm text-ink">
          <p className="font-medium">Check your inbox.</p>
          <p className="mt-1 text-ink-muted">
            We sent a magic sign-in link to <span className="font-medium text-ink">{email}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleEmail} className="space-y-3">
          <label className="block">
            <span className="field-label">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="input-base"
            />
          </label>
          <button type="submit" disabled={status === "sending"} className="btn-primary w-full">
            {status === "sending" ? "Sending link…" : "Continue with email"}
          </button>
          {error && <p className="text-xs text-error">{error}</p>}
        </form>
      )}

      <button
        onClick={onClose}
        className="mt-4 block w-full text-center text-sm text-ink-muted hover:text-ink"
      >
        Maybe later
      </button>

      <p className="mt-4 text-center text-xs text-ink-subtle">
        By continuing, you agree to our terms and privacy policy.
      </p>
    </Modal>
  );
}
