import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Reveal } from "@/components/ui/Reveal";
import {
  ArrowRightIcon,
  LinkedinIcon,
  MailIcon,
  SparkleIcon,
} from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "rewrito - AI-powered professional communication",
  description:
    "Humanize AI text, rewrite LinkedIn posts, and improve professional emails with rewrito.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ToolCards />
        <LiveTool />
        <BeforeAfter />
        <HowItWorks />
        <UsageLimits />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Light abstract background - behind hero section only */}
      <div aria-hidden className="hero-abstract">
        <div className="grid-overlay" />
        <div className="blob-mid" />
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <span className="chip mb-5 !text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gradient" />
            AI-powered professional communication
          </span>
          <h1 className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl md:text-6xl">
            Rough text in.{" "}
            <span className="bg-brand-gradient bg-clip-text text-transparent">
              Refined communication
            </span>{" "}
            out.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
            Humanize AI text, improve LinkedIn posts, and rewrite professional emails
            with a simple AI writing toolkit built for clear communication.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="#try" className="btn-primary">
              Try rewrito free
              <ArrowRightIcon size={16} />
            </Link>
            <Link href="#tools" className="btn-secondary">
              See tools
            </Link>
          </div>
          <p className="mt-4 text-xs text-ink-subtle">
            3 free trials. No sign-up needed.
          </p>
          <HeroSignal />
        </div>
      </div>
    </section>
  );
}

function HeroSignal() {
  return (
    <div className="hero-signal mx-auto mt-10 max-w-2xl" aria-hidden>
      <div className="signal-row">
        <span className="signal-chip signal-muted">AI draft</span>
        <span className="signal-track">
          <span />
        </span>
        <span className="signal-chip signal-bright">Human voice</span>
      </div>
      <div className="signal-bars">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

/* ---------- Tool preview cards ---------- */

const TOOL_CARDS = [
  {
    icon: SparkleIcon,
    name: "AI Humanizer",
    href: "/ai-humanizer",
    desc: "Make AI-generated text read like a person wrote it - natural, professional, grounded.",
    accent: "bg-brand-softPurple text-brand",
  },
  {
    icon: LinkedinIcon,
    name: "LinkedIn Post Rewriter",
    href: "/linkedin-rewriter",
    desc: "Turn rough notes into a clear LinkedIn post with a real hook and no fake hype.",
    accent: "bg-brand-softBlue text-brand-accent",
  },
  {
    icon: MailIcon,
    name: "Professional Email Rewriter",
    href: "/email-rewriter",
    desc: "Rewrite drafts into concise, polite, confident emails in seconds.",
    accent: "bg-bg-section text-ink",
  },
];

function ToolCards() {
  return (
    <section id="tools" className="bg-bg-section/60">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Three tools. One toolkit.
          </h2>
          <p className="mt-3 text-base text-ink-muted">
            Built for people who care how their writing lands.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {TOOL_CARDS.map((t, idx) => (
            <Reveal key={t.name} delay={idx * 90}>
              <Link
                href={t.href}
                className="card group block p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
              >
                <span
                  className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${t.accent}`}
                >
                  <t.icon size={22} />
                </span>
                <h3 className="mb-2 text-lg font-semibold text-ink">{t.name}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{t.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand">
                  Open tool
                  <ArrowRightIcon size={14} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Live tool ---------- */

function LiveTool() {
  return (
    <section id="try" className="bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Try it right here.
          </h2>
          <p className="mt-3 text-base text-ink-muted">
            No sign-up. Paste something, pick a tone, and see the difference.
          </p>
        </div>
        <ToolWorkspace />
      </div>
    </section>
  );
}

/* ---------- Before & After ---------- */

function BeforeAfter() {
  return (
    <section className="bg-bg-section/60">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            From robotic to readable.
          </h2>
          <p className="mt-3 text-base text-ink-muted">
            A real before-and-after from the AI Humanizer.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <div className="card p-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-error/70" />
                <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Before
                </span>
              </div>
              <p className="text-sm leading-relaxed text-ink/90">
                In today's rapidly evolving digital landscape, it is important to note
                that leveraging artificial intelligence has become essential for
                businesses seeking to navigate the complexities of modern operations.
                Furthermore, organizations must delve into innovative solutions to
                unlock their full potential.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="card relative overflow-hidden p-6">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-brand-gradient" />
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                  After
                </span>
              </div>
              <p className="text-sm leading-relaxed text-ink">
                Most businesses already use AI somewhere - in support, in analytics,
                in writing. The question now is less <em>whether</em> to use it and
                more <em>where it actually helps</em>. The teams that figure that out
                early move faster than the ones still debating it.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- How it works ---------- */

function HowItWorks() {
  const steps = [
    { n: "1", title: "Paste your text", body: "Drop in AI-generated copy, rough notes, or a draft email." },
    { n: "2", title: "Choose tone", body: "Professional, natural, executive, friendly, persuasive, or academic." },
    { n: "3", title: "Get refined output", body: "Copy, download, or keep refining. Your meaning stays intact." },
  ];
  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-base text-ink-muted">Three steps. Under a minute.</p>
        </div>
        <ol className="grid gap-5 md:grid-cols-3">
          {steps.map((s, idx) => (
            <Reveal key={s.n} delay={idx * 100} as="li">
              <div className="card h-full p-6">
                <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-softPurple text-sm font-semibold text-brand">
                  {s.n}
                </span>
                <h3 className="mb-1.5 text-base font-semibold text-ink">{s.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Usage limits ---------- */

function UsageLimits() {
  return (
    <section className="bg-bg-section/60">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="card p-7">
            <span className="chip">Free, no sign-up</span>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
              3 free trials
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Try every tool without creating an account. We'll remember your usage
              on this device.
            </p>
          </div>
          <div className="card relative overflow-hidden p-7">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-brand-gradient" />
            <span className="chip">After sign-in</span>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
              Keep rewriting
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Sign in with Google or email to continue your work. Premium plans
              for higher-volume use are coming soon.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */

const FAQS = [
  {
    q: "Is rewrito free to try?",
    a: "Yes. You get 3 free trials without signing up. Sign in with Google or email to continue using the toolkit.",
  },
  {
    q: "Will my writing sound like me?",
    a: "rewrito is built to preserve your meaning, your specific points, and your voice. The Light refinement level keeps your voice intact; Medium and Strong rebalance for flow.",
  },
  {
    q: "Do you store what I paste in?",
    a: "Anonymous trials are not saved. For signed-in users, recent rewrites are saved to your dashboard so you can revisit them. You can delete history at any time.",
  },
  {
    q: "Which AI model powers rewrito?",
    a: "We use a small, cost-efficient large language model by default. The architecture supports swapping providers, so we can use the best model for each tool over time.",
  },
  {
    q: "Can I use this on mobile?",
    a: "Yes. rewrito is built mobile-first - large tap targets, stacked layouts, and fast loading.",
  },
];

function FAQ() {
  return (
    <section id="faq" className="bg-bg">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Frequently asked
          </h2>
        </div>
        <div className="divide-y divide-line rounded-2xl border border-line bg-white">
          {FAQS.map((f, i) => (
            <details key={i} className="group p-5 sm:p-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-medium text-ink">
                {f.q}
                <span
                  aria-hidden
                  className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bg-section text-ink-muted transition-transform group-open:rotate-45"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */

function FinalCTA() {
  return (
    <section className="bg-bg-section/60">
      <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="card relative overflow-hidden p-8 text-center sm:p-12">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 opacity-50"
            style={{
              background:
                "radial-gradient(60% 60% at 50% 0%, rgba(124,58,237,0.10) 0%, rgba(255,255,255,0) 60%)",
            }}
          />
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Ready to refine your communication?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-ink-muted">
            Three free trials. No card. No friction.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Link href="#try" className="btn-primary">
              Start rewriting
              <ArrowRightIcon size={16} />
            </Link>
            <Link href="/pricing" className="btn-secondary">
              See pricing
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
