"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Logo } from "@/components/ui/Logo";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { LS_KEYS } from "@/lib/usage/limits";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Headline override - different for the trial-limit case. */
  headline?: string;
  subline?: string;
};

type AuthMode = "login" | "signup";
type Status = "idle" | "sending" | "sent" | "success" | "error";

export function LoginModal({
  open,
  onClose,
  headline = "Welcome to rewrito",
  subline = "Sign in to keep rewriting.",
}: Props) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (!open || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("authError") ?? params.get("error_description") ?? params.get("error");
    if (authError) {
      setStatus("error");
      setError(authError);
    }
  }, [open]);

  function resetFeedback() {
    setStatus("idle");
    setError(null);
    setNotice(null);
  }

  async function sendWelcomeEmail() {
    try {
      const response = await fetch("/api/welcome-email", { method: "POST" });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        console.warn("Welcome email could not be sent", payload);
      }
    } catch (err) {
      console.warn("Welcome email request failed", err);
    }
  }

  async function handleGoogle() {
    resetFeedback();
    setGoogleLoading(true);
    try {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in could not start.");
      setStatus("error");
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handlePasswordAuth(e: React.FormEvent) {
    e.preventDefault();
    const normalizedEmail = email.trim();
    const normalizedName = name.trim();
    if (!normalizedEmail || !password) return;

    resetFeedback();
    setStatus("sending");

    try {
      const supabase = createSupabaseBrowserClient();
      const emailRedirectTo =
        typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;

      if (mode === "signup") {
        if (normalizedName && typeof window !== "undefined") {
          window.localStorage.setItem(LS_KEYS.pendingName, normalizedName);
        }

        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            emailRedirectTo,
            data: normalizedName ? { full_name: normalizedName, name: normalizedName } : undefined,
          },
        });

        if (error) {
          setError(error.message);
          setStatus("error");
          return;
        }

        if (data.session) {
          await sendWelcomeEmail();
          setStatus("success");
          setNotice("Your account is ready. You are signed in.");
          onClose();
          return;
        }

        setStatus("sent");
        setNotice(`We sent a confirmation link to ${normalizedEmail}. Confirm your email once, then log in with your password.`);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        setError(error.message);
        setStatus("error");
        return;
      }

      await sendWelcomeEmail();
      setStatus("success");
      setNotice("You are signed in.");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in could not be completed.");
      setStatus("error");
    }
  }

  async function handleMagicLink() {
    const normalizedEmail = email.trim();
    const normalizedName = name.trim();
    if (!normalizedEmail) {
      setError("Enter your email first.");
      setStatus("error");
      return;
    }

    resetFeedback();
    setStatus("sending");

    try {
      const supabase = createSupabaseBrowserClient();
      if (normalizedName && typeof window !== "undefined") {
        window.localStorage.setItem(LS_KEYS.pendingName, normalizedName);
      }
      const emailRedirectTo =
        typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;
      const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          emailRedirectTo,
          shouldCreateUser: true,
          data: normalizedName ? { full_name: normalizedName, name: normalizedName } : undefined,
        },
      });
      if (error) {
        setError(error.message);
        setStatus("error");
      } else {
        setStatus("sent");
        setNotice(`We sent a sign-in link to ${normalizedEmail}.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Magic link could not be sent.");
      setStatus("error");
    }
  }

  return (
    <Modal open={open} onClose={onClose} labelledBy="login-headline">
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close login dialog"
          className="absolute right-0 top-0 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-subtle transition-colors hover:bg-bg-section hover:text-ink"
        >
          x
        </button>

        <div className="mb-5 pr-10 text-center">
          <div className="mx-auto mb-4 flex justify-center">
            <Logo size={54} />
          </div>
          <h2 id="login-headline" className="text-xl font-semibold text-ink">
            {headline}
          </h2>
          <p className="mt-1.5 text-sm text-ink-muted">{subline}</p>
        </div>

        <div className="mb-4 grid grid-cols-2 rounded-xl border border-line bg-bg-section p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              resetFeedback();
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === "login" ? "bg-white text-ink shadow-soft" : "text-ink-muted hover:text-ink"
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              resetFeedback();
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
              mode === "signup" ? "bg-white text-ink shadow-soft" : "text-ink-muted hover:text-ink"
            }`}
          >
            Create account
          </button>
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="btn-secondary w-full"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.12s.13-1.46.35-2.12V7.04H2.18C1.43 8.53 1 10.22 1 12s.43 3.47 1.18 4.96l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
          </svg>
          {googleLoading ? "Opening Google..." : "Continue with Google"}
        </button>

        <div className="my-4 flex items-center gap-3 text-xs text-ink-subtle">
          <div className="h-px flex-1 bg-line" />
          <span>or</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        {notice && (
          <div className="mb-3 rounded-xl bg-bg-section p-4 text-center text-sm leading-relaxed text-ink">
            {notice}
          </div>
        )}

        <form onSubmit={handlePasswordAuth} className="space-y-3">
          {mode === "signup" && (
            <label className="block">
              <span className="field-label">Name</span>
              <input
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="input-base"
              />
            </label>
          )}
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
          <label className="block">
            <span className="field-label">Password</span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "Create a password" : "Your password"}
              className="input-base"
            />
          </label>
          <button type="submit" disabled={status === "sending"} className="btn-primary w-full">
            {status === "sending"
              ? mode === "signup"
                ? "Creating account..."
                : "Signing in..."
              : mode === "signup"
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleMagicLink}
          disabled={status === "sending"}
          className="mt-3 block w-full text-center text-sm font-medium text-brand hover:text-ink"
        >
          Send me a magic link instead
        </button>

        {error && (
          <div className="mt-3 rounded-xl border border-error/30 bg-error/5 px-3.5 py-2.5 text-sm leading-relaxed text-error">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-4 block w-full text-center text-sm text-ink-muted hover:text-ink"
        >
          Maybe later
        </button>

        <p className="mt-4 text-center text-xs text-ink-subtle">
          By continuing, you agree to our terms and privacy policy.
        </p>
      </div>
    </Modal>
  );
}
