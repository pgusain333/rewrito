import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AudienceShowcase } from "@/components/marketing/AudienceShowcase";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ArrowRightIcon, CheckIcon, StudyIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "AI Study Assistant - Understand Concepts Clearly | rewrito",
  description:
    "Rewrito Study helps students understand concepts, organize notes, generate flashcards, create quizzes, and learn more effectively.",
  alternates: { canonical: "/study-assistant" },
  openGraph: {
    title: "AI Study Assistant - Understand Concepts Clearly | rewrito",
    description:
      "Turn confusing study material into clear explanations, notes, quizzes, flashcards, and study plans.",
    url: "/study-assistant",
  },
};

const modes = [
  {
    name: "Explain Simply",
    body: "Turn difficult paragraphs into clear, beginner-friendly explanations with useful examples.",
  },
  {
    name: "Step-by-Step",
    body: "Break accounting, finance, math, law, economics, and statistics problems into guided steps.",
  },
  {
    name: "Quiz Me",
    body: "Generate MCQs, short-answer questions, answer keys, and brief explanations for practice.",
  },
  {
    name: "Flashcards",
    body: "Create concise Q/A cards for definitions, formulas, and exam-focused revision.",
  },
  {
    name: "Organize Notes",
    body: "Clean up lecture notes into headings, bullets, definitions, formulas, and summaries.",
  },
  {
    name: "Study Plan",
    body: "Build a balanced schedule around your exam date, subject, daily hours, and preparation level.",
  },
];

const learningBlocks = [
  "Textbook paragraphs",
  "Assignment questions",
  "Accounting and finance problems",
  "Math and statistics questions",
  "Law and economics notes",
  "Exam revision material",
];

const faq = [
  {
    q: "Is Rewrito Study for copying homework answers?",
    a: "No. Rewrito Study is designed to explain concepts, show reasoning, organize notes, and help students prepare. It focuses on understanding rather than shortcuts.",
  },
  {
    q: "Can it create flashcards and quizzes?",
    a: "Yes. Quiz Me creates MCQs, short-answer questions, answer keys, and brief explanations. Flashcards creates concise Q/A cards for revision.",
  },
  {
    q: "Does it work for exam preparation?",
    a: "Yes. Study Plan mode can create a daily schedule, revision plan, practice plan, weak area focus, and balanced workload.",
  },
];

export default function StudyAssistantPage() {
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Rewrito Study",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description:
      "AI study assistant for clear explanations, organized notes, quizzes, flashcards, and study plans.",
    url: "/study-assistant",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-bg">
          <div aria-hidden className="hero-abstract">
            <div className="grid-overlay" />
            <div className="blob-mid" />
          </div>
          <div className="mx-auto max-w-6xl px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
            <nav className="mb-5 text-sm text-ink-muted">
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
              <span className="mx-2 text-ink-subtle">/</span>
              <span className="text-ink">Rewrito Study</span>
            </nav>
            <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <span className="chip mb-5">
                  <StudyIcon size={14} />
                  AI study assistant
                </span>
                <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                  Rewrito Study helps you understand concepts clearly.
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
                  Turn confusing study material into simple explanations, step-by-step
                  breakdowns, quizzes, flashcards, organized notes, and practical study plans.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="#study-tool" className="btn-primary">
                    Start studying
                    <ArrowRightIcon size={16} />
                  </Link>
                  <Link href="/tools" className="btn-secondary">
                    See all tools
                  </Link>
                </div>
              </div>
              <StudyHeroMockup />
            </div>
          </div>
        </section>

        <section id="study-tool" className="bg-bg">
          <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
            <ToolWorkspace initialTool="study" lockTool />
          </div>
        </section>

        <section className="bg-bg-section/60">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <div className="mb-10 max-w-2xl">
              <span className="chip mb-5">Dedicated practice</span>
              <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Quiz and flashcards now have their own workspace.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">
                Use the main Study assistant for explanations, notes, steps, and plans. Open practice tools when you want active recall, scoring, and revision.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <PracticeLinkCard
                href="/study-assistant/quiz"
                title="Quiz testlets"
                body="Create MCQs, answer in a focused test view, save scores when logged in, and build weak-area testlets from your results."
                label="Open quiz workspace"
              />
              <PracticeLinkCard
                href="/study-assistant/flashcards"
                title="Flashcards"
                body="Turn notes, formulas, definitions, and concepts into flip-ready Q/A cards for active recall."
                label="Open flashcards"
              />
            </div>
          </div>
        </section>

        <section className="bg-bg-section/60">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <div className="mb-10 max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                Choose how you want to learn.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">
                Rewrito Study adapts the output to the kind of help you need, from a simple
                explanation to a full revision plan.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modes.map((mode, index) => (
                <InfoCard key={mode.name} index={index + 1} title={mode.name}>
                  {mode.body}
                </InfoCard>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-bg">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-start">
              <div>
                <span className="chip mb-5">Built for understanding</span>
                <h2 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  Study support for messy, real material.
                </h2>
                <p className="mt-3 text-base leading-relaxed text-ink-muted">
                  Paste the material you already have. Rewrito Study turns it into a format
                  that is easier to read, revise, and practice from.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {learningBlocks.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-line bg-white p-4">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-softPurple text-brand">
                      <CheckIcon size={12} />
                    </span>
                    <span className="text-sm font-medium text-ink">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <AudienceShowcase
          className="bg-bg-section/60"
          title="Built for learners who want understanding, not shortcuts."
          lead="Rewrito Study helps different learners turn confusing material into clear revision, practice, and planning."
          audiences={[
            {
              title: "School students",
              body: "Explain textbook paragraphs, revise exam topics, and practice with quizzes and flashcards.",
              image:
                "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80",
            },
            {
              title: "College learners",
              body: "Break down finance, law, economics, accounting, statistics, and technical notes.",
              image:
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
            },
            {
              title: "University students",
              body: "Organize dense lectures, formulas, readings, and revision checklists.",
              image:
                "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
            },
            {
              title: "Certification candidates",
              body: "Build study plans, weak-area tests, and recall decks around exam goals.",
              image:
                "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80",
            },
            {
              title: "Working professionals",
              body: "Turn new concepts, training material, and policy notes into practical learning.",
              image:
                "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
            },
          ]}
        />

        <section className="bg-bg-section/60">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="mb-8 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Frequently asked
            </h2>
            <div className="divide-y divide-line rounded-2xl border border-line bg-white">
              {faq.map((item) => (
                <details key={item.q} className="group p-5 sm:p-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-medium text-ink">
                    {item.q}
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bg-section text-ink-muted transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}

function StudyHeroMockup() {
  const sections = [
    ["Simple Explanation", "Working capital is the money a business has available for day-to-day needs."],
    ["Key Concept", "Current assets minus current liabilities shows short-term financial flexibility."],
    ["Practice Question", "If assets are 80,000 and liabilities are 52,000, what is working capital?"],
  ];

  return (
    <div className="relative mx-auto w-full max-w-lg [perspective:1100px]" aria-hidden>
      <div className="card relative overflow-hidden p-5 shadow-card [transform:rotateX(4deg)_rotateY(-6deg)]">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-brand-gradient" />
        <span className="mock-cursor mock-cursor-large" />
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
              <StudyIcon size={20} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">Premium AI Study Workspace</span>
              <span className="block text-xs text-ink-muted">Structured, calm, and exam-ready.</span>
            </span>
          </span>
          <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            Tutor mode
          </span>
        </div>
        <div className="space-y-3">
          <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-md bg-brand-softPurple px-4 py-3 text-sm font-medium text-brand">
            <span className="typing-reveal">Explain working capital simply.</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-bg-soft px-3 py-2 text-ink-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-typing-dot" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-typing-dot [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-typing-dot [animation-delay:240ms]" />
            <span className="ml-1 text-[10px] font-medium">rewrito is building a study guide</span>
          </div>
          {sections.map(([title, body], index) => (
            <div key={title} className="rounded-2xl border border-line bg-bg-soft p-3">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white text-xs text-brand">
                  {index + 1}
                </span>
                {title}
              </div>
              <p className="text-xs leading-relaxed text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="card h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card">
      <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-softPurple text-sm font-semibold text-brand">
        {index}
      </span>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{children}</p>
    </article>
  );
}

function PracticeLinkCard({
  href,
  title,
  body,
  label,
}: {
  href: string;
  title: string;
  body: string;
  label: string;
}) {
  return (
    <Link href={href} className="group card block h-full p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card">
      <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-softPurple text-brand transition-transform duration-300 group-hover:-translate-y-0.5">
        <StudyIcon size={21} />
      </span>
      <h3 className="text-xl font-semibold text-ink">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{body}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
        {label}
        <ArrowRightIcon size={16} />
      </span>
    </Link>
  );
}
