import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { Reveal } from "@/components/ui/Reveal";
import {
  ArrowRightIcon,
  LinkedinIcon,
  MailIcon,
  ShieldCheckIcon,
  SparkleIcon,
  StudyIcon,
} from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "rewrito - AI-powered professional communication",
  description:
    "Humanize AI text, check AI detection scores, rewrite LinkedIn posts, improve professional emails, and study concepts clearly with rewrito.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ToolCards />
        <SuitableFor />
        <WriteEverywhere />
        <LiveTool />
        <WhyUs />
        <BeforeAfter />
        <LearningCoach />
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
            <span className="block bg-brand-gradient bg-clip-text text-transparent sm:inline">
              Refined <span className="block sm:inline">communication</span>
            </span>{" "}
            out.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
            Humanize AI text, improve LinkedIn posts, rewrite professional emails,
            check AI detector confidence, and turn confusing study material into clear understanding.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/try" className="btn-primary">
              Try rewrito free
              <ArrowRightIcon size={16} />
            </Link>
            <Link href="/tools" className="btn-secondary">
              See tools
            </Link>
          </div>
          <p className="mt-4 text-xs text-ink-subtle">Start free. No card needed.</p>
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
        <span className="signal-chip signal-bright hidden sm:inline-flex">Human voice</span>
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
    icon: ShieldCheckIcon,
    name: "AI Detector Score",
    href: "/ai-detector",
    desc: "Check detector-style confidence before and after humanizing your draft.",
    accent: "bg-warning/10 text-warning",
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
  {
    icon: StudyIcon,
    name: "Rewrito Study",
    href: "/study-assistant",
    desc: "Explain concepts, organize notes, create quizzes, and build calm study plans.",
    accent: "bg-success/10 text-success",
  },
];

function ToolCards() {
  return (
    <section id="tools" className="bg-bg-section/60">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Five tools. One toolkit.
          </h2>
          <p className="mt-3 text-base text-ink-muted">
            Built for people who care how their writing lands and how clearly they learn.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {TOOL_CARDS.map((t, idx) => (
            <Reveal key={t.name} delay={idx * 90}>
              <Link
                href={t.href}
                className="card group flex h-full flex-col overflow-hidden p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
              >
                <ToolChatMockup tool={t.name} accent={t.accent} Icon={t.icon} delay={idx * 1.05} />
                <div className="mb-2 mt-5">
                  <h3 className="text-base font-semibold leading-snug text-ink">{t.name}</h3>
                </div>
                <p className="text-sm leading-relaxed text-ink-muted">{t.desc}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-brand">
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

function ToolChatMockup({
  tool,
  accent,
  Icon,
  delay = 0,
}: {
  tool: string;
  accent: string;
  Icon: (props: { size?: number; className?: string }) => ReactNode;
  delay?: number;
}) {
  const copy = toolMockupCopy(tool);
  const isLinkedIn = tool === "LinkedIn Post Rewriter";

  return (
    <div className="relative h-60 overflow-hidden [perspective:1000px]" aria-hidden>
      <div className="h-full rounded-2xl border border-line bg-white p-3 shadow-card transition-transform duration-300 [transform:rotateX(4deg)_rotateY(-5deg)] group-hover:[transform:rotateX(2deg)_rotateY(-2deg)_translateY(-3px)]">
        <span className="mock-cursor" style={{ animationDelay: `${delay}s` }} />
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="flex min-w-0 items-center gap-2">
            {isLinkedIn ? (
              <LinkedInBrandMark />
            ) : (
              <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accent}`}>
                <Icon size={16} />
              </span>
            )}
            <span className="truncate text-[11px] font-semibold text-ink">{tool}</span>
          </span>
          <span className="h-2 w-10 shrink-0 rounded-full bg-line" />
        </div>
        <div className="space-y-2">
          <div className="ml-auto max-w-[86%] rounded-2xl rounded-tr-md bg-brand-softPurple px-3 py-2 text-[11px] font-medium leading-relaxed text-brand">
            <span className="typing-reveal" style={{ animationDelay: `${delay + 0.4}s` }}>
              {copy.prompt}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-bg-soft px-3 py-2 text-ink-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-typing-dot" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-typing-dot [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-typing-dot [animation-delay:240ms]" />
            <span className="ml-1 text-[10px] font-medium">rewrito is writing</span>
          </div>
          <div className="rounded-2xl rounded-tl-md border border-line bg-bg-soft px-3 py-2">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold text-ink">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-white text-brand">r</span>
              rewrito output
            </div>
            <p className="text-[11px] font-medium leading-relaxed text-ink-muted">
              {copy.output}
            </p>
            <div className="mt-2 space-y-1.5">
              {copy.lines.map((line, index) => (
                <div key={line} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  <span className="text-[10px] font-medium text-ink-muted">{line}</span>
                  <span
                    className="ml-auto h-1.5 rounded-full bg-brand-softBlue"
                    style={{ width: `${30 + index * 13}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function toolMockupCopy(tool: string) {
  if (tool === "Rewrito Study") {
    return {
      prompt: "Explain this accounting concept simply.",
      output: "Simple explanation, key idea, example, and practice question.",
      lines: ["Concept", "Steps", "Quiz"],
    };
  }
  if (tool === "LinkedIn Post Rewriter") {
    return {
      prompt: "Turn these rough notes into a LinkedIn post.",
      output: "Strong hook, short paragraphs, and a grounded closing line.",
      lines: ["Hook", "Story", "CTA"],
    };
  }
  if (tool === "AI Detector Score") {
    return {
      prompt: "Check if this draft sounds AI-written.",
      output: "Detector-style score lowered with clearer human rhythm.",
      lines: ["Before", "After", "Coach"],
    };
  }
  if (tool === "Professional Email Rewriter") {
    return {
      prompt: "Make this follow-up polite and concise.",
      output: "Clear subject, confident body, and friendly close.",
      lines: ["Subject", "Body", "Close"],
    };
  }
  return {
    prompt: "Make this AI draft sound natural.",
    output: "More specific, human, and easier to read.",
    lines: ["AI draft", "Human voice", "Score"],
  };
}

function LinkedInBrandMark() {
  return (
    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0A66C2] text-[13px] font-bold leading-none text-white">
      in
    </span>
  );
}

function SuitableFor() {
  const audiences = [
    {
      title: "Students",
      body: "Understand concepts, create flashcards, prepare quizzes, and organize revision.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Professionals",
      body: "Rewrite emails, sharpen reports, and keep workplace communication clear.",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Academics",
      body: "Clarify dense notes, study legal or finance material, and review AI-written drafts.",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Creators",
      body: "Turn rough ideas into readable posts without losing your own voice.",
      image:
        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-10 max-w-2xl">
          <span className="chip mb-5">Suitable for</span>
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Built for people who write, learn, and review every day.
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((audience, index) => (
            <Reveal key={audience.title} delay={index * 80}>
              <div className="card h-full overflow-hidden">
                <img
                  src={audience.image}
                  alt=""
                  className="h-36 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <h3 className="text-base font-semibold text-ink">{audience.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{audience.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WriteEverywhere() {
  const apps = [
    { name: "Gmail", icon: "https://cdn.simpleicons.org/gmail/EA4335" },
    { name: "LinkedIn", icon: "https://cdn.simpleicons.org/linkedin/0A66C2" },
    { name: "Slack", icon: "https://cdn.simpleicons.org/slack/611F69" },
    { name: "WhatsApp", icon: "https://cdn.simpleicons.org/whatsapp/25D366" },
    { name: "Notion", icon: "https://cdn.simpleicons.org/notion/000000" },
    { name: "Outlook", icon: "https://cdn.simpleicons.org/microsoftoutlook/0078D4" },
    { name: "Docs", icon: "https://cdn.simpleicons.org/googledocs/4285F4" },
    { name: "Word", icon: "https://cdn.simpleicons.org/microsoftword/185ABD" },
    { name: "Discord", icon: "https://cdn.simpleicons.org/discord/5865F2" },
    { name: "X", icon: "https://cdn.simpleicons.org/x/000000" },
  ];

  return (
    <section className="bg-[#ecffe8]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <span className="chip mb-5">Write where work already happens</span>
          <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Use rewrito across the places you already draft.
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink-muted">
            Emails, posts, study notes, reports, and messages all start in different places.
            rewrito gives you one clear workspace to refine them before they go out.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 sm:max-w-md sm:grid-cols-5 sm:gap-4">
            {apps.map((app) => (
              <div key={app.name} className="group text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-lg font-bold shadow-soft transition-transform duration-300 group-hover:-translate-y-1">
                  <img src={app.icon} alt={`${app.name} logo`} className="h-7 w-7 object-contain" loading="lazy" />
                </span>
                <span className="mt-2 block text-[10px] font-semibold text-ink-muted">{app.name}</span>
              </div>
            ))}
          </div>
        </div>
        <LargeChatMockup />
      </div>
    </section>
  );
}

function LargeChatMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl" aria-hidden>
      <div className="card relative overflow-hidden p-5 shadow-card">
        <span className="mock-cursor mock-cursor-large" />
        <div className="mb-5 flex items-center justify-end gap-2">
          {["AI draft", "LinkedIn", "DOCX"].map((item, index) => (
            <span
              key={item}
              className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                index === 1 ? "bg-[#0A66C2] text-white" : "bg-bg-section text-ink-muted"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="space-y-4">
          <div className="ml-auto max-w-[74%] rounded-2xl rounded-tr-md bg-bg-section px-4 py-3 text-sm font-medium text-ink">
            Can you make this report summary clearer?
          </div>
          <div className="max-w-[86%] rounded-2xl rounded-tl-md bg-white px-4 py-3 text-sm leading-relaxed text-ink-muted shadow-soft">
            Rewrito can tighten the message, preserve your facts, and show what changed so the next draft is easier to write yourself.
          </div>
          <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-md bg-bg-section px-4 py-3 text-sm font-medium text-ink">
            Create a concise version for a leadership update.
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-soft">
          <span className="text-xl text-brand">+</span>
          <span className="flex-1 text-sm text-ink-subtle">Type your message...</span>
          <span className="h-8 w-8 rounded-full bg-bg-section" />
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-white">
            <ArrowRightIcon size={16} className="-rotate-45" />
          </span>
        </div>
      </div>
    </div>
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
            No sign-up. Paste writing or study material, pick a mode, and see the difference.
          </p>
        </div>
        <ToolWorkspace />
      </div>
    </section>
  );
}

/* ---------- Why trust rewrito ---------- */

function WhyUs() {
  const reasons = [
    {
      title: "Structured by purpose",
      body: "Each workspace is tuned for a real job: humanizing, detecting, posting, emailing, or studying.",
    },
    {
      title: "Keeps meaning intact",
      body: "The prompts prioritize preserving facts, names, dates, numbers, and intent.",
    },
    {
      title: "Built for review",
      body: "Scores, copy controls, saved sessions, quiz testlets, and flashcards keep work easy to check.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-bg-section/60">
      <div aria-hidden className="hero-abstract opacity-60">
        <div className="grid-overlay" />
        <div className="blob-mid" />
      </div>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1fr] lg:items-center">
          <div>
            <span className="chip mb-5">Why people trust rewrito</span>
            <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Why choose rewrito?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              rewrito is designed around focused workflows, not a blank chatbot box. The result is
              easier to scan, easier to trust, and easier to act on.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {reasons.map((reason, index) => (
              <Reveal key={reason.title} delay={index * 110}>
                <div className="card relative h-full overflow-hidden p-5">
                  <ReasonMiniMockup index={index} />
                  <h3 className="text-base font-semibold text-ink">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{reason.body}</p>
                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-bg-section">
                    <div
                      className="h-full rounded-full bg-brand-gradient"
                      style={{ width: `${64 + index * 12}%` }}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReasonMiniMockup({ index }: { index: number }) {
  const labelSets = [
    ["Mode", "Purpose", "Output"],
    ["Facts", "Meaning", "Voice"],
    ["Score", "Copy", "Review"],
  ];
  const labels = labelSets[index] ?? labelSets[0];

  return (
    <div className="mb-5 rounded-xl border border-line bg-bg-soft p-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-softPurple text-xs font-semibold text-brand">
          {index + 1}
        </span>
        <span className="h-2 w-12 rounded-full bg-line" />
      </div>
      <div className="space-y-2">
        {labels.map((label, itemIndex) => (
          <div key={label} className="flex items-center gap-2 rounded-lg bg-white px-2 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <span className="text-[10px] font-medium text-ink-muted">{label}</span>
            <span
              className="ml-auto h-1.5 rounded-full bg-brand-softBlue"
              style={{ width: `${32 + itemIndex * 16}%` }}
            />
          </div>
        ))}
      </div>
    </div>
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

function LearningCoach() {
  return (
    <section className="bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="chip mb-5">Built to teach</span>
            <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              Over time, you write better without the tool.
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-muted">
              rewrito does more than rewrite. It shows what changed, why the draft improved,
              and which habits to carry into your next message, post, paper, or study note.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Pattern", "Replace generic AI phrasing with a concrete subject."],
              ["Rhythm", "Break long sentences and vary sentence shape."],
              ["Habit", "Keep names, numbers, and examples while cutting filler."],
            ].map(([title, body], index) => (
              <Reveal key={title} delay={index * 90}>
                <div className="card h-full p-5">
                  <span className="mb-4 inline-flex rounded-full bg-brand-softPurple px-3 py-1 text-xs font-semibold text-brand">
                    {title}
                  </span>
                  <p className="text-sm leading-relaxed text-ink-muted">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- How it works ---------- */

function HowItWorks() {
  const steps = [
    { n: "1", title: "Paste your text", body: "Drop in AI copy, rough notes, an email draft, or study material." },
    { n: "2", title: "Choose the right mode", body: "Pick a tone, refinement level, or Study mode for clear learning." },
    { n: "3", title: "Get structured output", body: "Copy, download, revise, or save useful sessions in your dashboard." },
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
                <StepMiniMockup index={idx} />
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

function StepMiniMockup({ index }: { index: number }) {
  const steps =
    [
      {
        prompt: "Paste rough text here...",
        output: "rewrito reads the goal and context.",
        chips: ["Draft", "Intent"],
      },
      {
        prompt: "Choose LinkedIn, email, study, or detector.",
        output: "The workspace adjusts prompts and scoring.",
        chips: ["Mode", "Tone"],
      },
      {
        prompt: "Generate a cleaner version.",
        output: "Get output, scores, and writing lessons.",
        chips: ["Output", "Coach"],
      },
    ][index] ?? {
      prompt: "Paste rough text here...",
      output: "rewrito reads the goal and context.",
      chips: ["Draft", "Intent"],
    };

  return (
    <div className="mb-5 rounded-xl border border-line bg-bg-soft p-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-ink-muted">rewrito chat</span>
        <span className="h-2 w-8 rounded-full bg-line" />
      </div>
      <div className="space-y-2">
        <div className="ml-auto max-w-[88%] rounded-xl rounded-tr-sm bg-brand-softPurple px-3 py-2 text-[10px] font-medium leading-relaxed text-brand">
          <span className="typing-reveal">{steps.prompt}</span>
        </div>
        <div className="rounded-xl rounded-tl-sm border border-line bg-white px-3 py-2">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-ink">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded bg-brand-softPurple text-brand">r</span>
            rewrito
          </div>
          <p className="text-[10px] leading-relaxed text-ink-muted">{steps.output}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {steps.chips.map((chip) => (
              <span key={chip} className="rounded-full bg-bg-section px-2 py-0.5 text-[9px] font-semibold text-ink-muted">
                {chip}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-1 text-ink-subtle">
          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-typing-dot" />
          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-typing-dot [animation-delay:120ms]" />
          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-typing-dot [animation-delay:240ms]" />
          <span className="ml-1 text-[9px] font-medium">live guidance</span>
        </div>
      </div>
    </div>
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
              Start without friction
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Try the toolkit without creating an account. We'll remember your usage
              on this device and ask you to log in when it is time to continue.
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
    a: "Yes. You can start without signing up. Sign in with Google or email when you want to continue using the toolkit.",
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
    q: "Can Rewrito Study help with exam preparation?",
    a: "Yes. Rewrito Study can explain concepts simply, break problems into steps, generate quizzes, create flashcards, organize notes, and build study plans.",
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
            Ready to refine your writing and study smarter?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-ink-muted">
            Start free. No card. No friction.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Link href="/try" className="btn-primary">
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
