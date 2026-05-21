import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckIcon, ArrowRightIcon } from "@/components/ui/icons";
import { ANON_WORD_LIMIT, FREE_HISTORY_LIMIT, PRO_WORD_LIMIT, USER_WORD_LIMIT } from "@/lib/usage/limits";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "rewrito Pricing - Free AI Writing and Study Tools",
  description:
    "Compare rewrito free, signed-in, and premium-ready limits for AI humanizing, detector scores, plagiarism checking, LinkedIn rewriting, email rewriting, quizzes, flashcards, and study plans.",
  path: "/pricing",
  keywords: ["rewrito pricing", "free AI humanizer", "free AI writing tools", "AI study tool pricing", "plagiarism checker pricing"],
});

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-bg">
          <div className="mx-auto max-w-5xl px-5 pb-8 pt-14 sm:px-8 sm:pb-12 sm:pt-20">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                Simple, honest pricing.
              </h1>
              <p className="mt-4 text-base text-ink-muted sm:text-lg">
                Start free. Upgrade only if you need more.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-bg">
          <div className="mx-auto max-w-5xl px-5 pb-20 sm:px-8 sm:pb-28">
            <div className="grid gap-5 lg:grid-cols-3">
              <div className="card flex flex-col p-7">
                <h2 className="text-xl font-semibold text-ink">Free</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Try every tool, no card required.
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-ink">$0</span>
                  <span className="text-sm text-ink-muted">/ start</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-ink">
                  <Feat>Start without sign-up</Feat>
                  <Feat>All 6 tools</Feat>
                  <Feat>{ANON_WORD_LIMIT} words per input</Feat>
                  <Feat>Core tones and Medium refinement</Feat>
                  <Feat>Copy and download output</Feat>
                  <Locked>Saved history and personalization</Locked>
                </ul>
                <Link href="/try" className="btn-secondary mt-7 w-full">
                  Start free
                </Link>
              </div>

              <div className="card relative flex flex-col overflow-hidden p-7">
                <div className="absolute inset-x-0 top-0 h-[3px] bg-brand-gradient" />
                <h2 className="text-xl font-semibold text-ink">Signed in</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  For longer drafts and saved work.
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-ink">$0</span>
                  <span className="text-sm text-ink-muted">/ account</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-ink">
                  <Feat>{USER_WORD_LIMIT.toLocaleString()} words per input</Feat>
                  <Feat>Saved history up to latest {FREE_HISTORY_LIMIT} sessions</Feat>
                  <Feat>Reopen previous outputs in the editor</Feat>
                  <Feat>All tones and refinement controls</Feat>
                  <Locked>Premium next-step guidance</Locked>
                </ul>
                <Link href="/try?login=1" className="btn-primary mt-7 w-full">
                  Log in free <ArrowRightIcon size={16} />
                </Link>
              </div>

              <div className="card relative flex flex-col overflow-hidden p-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-ink">Pro</h2>
                  <span className="chip !border-brand/30 !bg-brand-softPurple !text-brand">
                    Coming soon
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-muted">For people who write daily.</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-ink">-</span>
                  <span className="text-sm text-ink-muted">launching soon</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-ink">
                  <Feat>Drafts up to {PRO_WORD_LIMIT.toLocaleString()} words</Feat>
                  <Feat>Deeper saved history and versions</Feat>
                  <Feat>Next best LinkedIn post guidance</Feat>
                  <Feat>Weak-area quiz and flashcard recommendations</Feat>
                  <Feat>Priority performance</Feat>
                </ul>
                <Link href="/try" className="btn-primary mt-7 w-full">
                  Join the waitlist <ArrowRightIcon size={16} />
                </Link>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-ink-subtle">
              No hidden fees. Cancel anytime. Pricing will be announced before launch.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Feat({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-softPurple text-brand">
        <CheckIcon size={12} />
      </span>
      <span>{children}</span>
    </li>
  );
}

function Locked({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5 text-ink-subtle">
      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bg-section text-ink-subtle">
        <CheckIcon size={12} />
      </span>
      <span>{children}</span>
    </li>
  );
}
