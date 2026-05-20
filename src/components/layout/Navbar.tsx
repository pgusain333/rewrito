"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { LoginModal } from "@/components/modals/LoginModal";
import { UseCaseModal } from "@/components/modals/UseCaseModal";
import { useAuthAndUsage } from "@/lib/usage/useAuthAndUsage";
import { LS_KEYS } from "@/lib/usage/limits";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function displayName(user: { name: string | null; email: string | null }) {
  if (user.name) return user.name.split(/\s+/)[0];
  if (user.email) return user.email.split("@")[0];
  return "Account";
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showUseCase, setShowUseCase] = useState(false);
  const { user, signOut } = useAuthAndUsage();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "1") setShowLogin(true);
  }, []);

  useEffect(() => {
    if (!user) {
      setShowUseCase(false);
      return;
    }
    if (typeof window === "undefined") return;
    const key = `${LS_KEYS.useCasePrefix}.${user.id}`;
    if (!window.localStorage.getItem(key)) {
      setShowUseCase(true);
    }
  }, [user]);

  useEffect(() => {
    if (!user || user.name || typeof window === "undefined") return;
    const pendingName = window.localStorage.getItem(LS_KEYS.pendingName)?.trim();
    if (!pendingName) return;
    window.localStorage.removeItem(LS_KEYS.pendingName);
    createSupabaseBrowserClient().auth.updateUser({
      data: { full_name: pendingName, name: pendingName },
    });
  }, [user]);

  function handleUseCaseClose(useCase?: string) {
    if (user && typeof window !== "undefined") {
      const key = `${LS_KEYS.useCasePrefix}.${user.id}`;
      window.localStorage.setItem(key, useCase ?? "Skipped");
    }
    setShowUseCase(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8"
      >
        <Link href="/" aria-label="rewrito home" className="-ml-1 rounded-lg p-1">
          <Logo size={44} />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink href="/tools">Tools</NavLink>
          <NavLink href="/ai-detector">AI Detector</NavLink>
          <NavLink href="/study-assistant">Study</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/faq">FAQ</NavLink>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <span className="max-w-[140px] truncate rounded-full bg-bg-soft px-3 py-2 text-sm font-semibold text-ink">
                {displayName(user)}
              </span>
              <Link href="/dashboard" className="btn-ghost">
                Dashboard
              </Link>
              <button onClick={signOut} className="btn-secondary !py-2 !px-4">
                Sign out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setShowLogin(true)} className="btn-ghost">
                Log in
              </button>
              <Link href="/try" className="btn-primary !py-2 !px-4">
                Try free
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-ink-muted md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {open ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-white md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
            <MobileLink href="/tools" onClick={() => setOpen(false)}>Tools</MobileLink>
            <MobileLink href="/ai-detector" onClick={() => setOpen(false)}>AI Detector</MobileLink>
            <MobileLink href="/study-assistant" onClick={() => setOpen(false)}>Study</MobileLink>
            <MobileLink href="/pricing" onClick={() => setOpen(false)}>Pricing</MobileLink>
            <MobileLink href="/faq" onClick={() => setOpen(false)}>FAQ</MobileLink>
            <div className="mt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="rounded-xl bg-bg-soft px-3 py-2 text-sm font-semibold text-ink">
                    {displayName(user)}
                  </div>
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="btn-secondary w-full">
                    Dashboard
                  </Link>
                  <button onClick={() => { signOut(); setOpen(false); }} className="btn-ghost w-full">
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { setShowLogin(true); setOpen(false); }} className="btn-secondary w-full">
                    Log in
                  </button>
                  <Link href="/try" onClick={() => setOpen(false)} className="btn-primary w-full">
                    Try free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      <UseCaseModal open={showUseCase} onClose={handleUseCaseClose} />
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-bg-soft hover:text-ink"
    >
      {children}
    </Link>
  );
}

function MobileLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="rounded-lg px-3 py-3 text-base font-medium text-ink hover:bg-bg-soft"
    >
      {children}
    </Link>
  );
}
