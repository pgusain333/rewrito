import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckIcon, ArrowRightIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Pricing - rewrito",
  description: "Simple pricing for rewrito. Free to try, premium plans coming soon.",
  alternates: { canonical: "/pricing" },
};

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
            <div className="grid gap-5 md:grid-cols-2">
              <div className="card flex flex-col p-7">
                <h2 className="text-xl font-semibold text-ink">Free</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Try every tool, no card required.
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-ink">$0</span>
                  <span className="text-sm text-ink-muted">/ forever</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-ink">
                  <Feat>Start without sign-up</Feat>
                  <Feat>Sign in to keep rewriting</Feat>
                  <Feat>All 4 tools (Humanizer, LinkedIn, Email, Study)</Feat>
                  <Feat>6 tone presets</Feat>
                  <Feat>Copy and download output</Feat>
                </ul>
                <Link href="/try" className="btn-secondary mt-7 w-full">
                  Start free
                </Link>
              </div>

              <div className="card relative flex flex-col overflow-hidden p-7">
                <div className="absolute inset-x-0 top-0 h-[3px] bg-brand-gradient" />
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
                  <Feat>Higher rewrite volume</Feat>
                  <Feat>Saved history & versions</Feat>
                  <Feat>Advanced tone & style controls</Feat>
                  <Feat>Longer input length</Feat>
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
