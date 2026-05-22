import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { AudienceShowcase, type AudienceCard } from "@/components/marketing/AudienceShowcase";
import { ArrowRightIcon } from "@/components/ui/icons";
import { TOOLS, type ToolType } from "@/lib/prompts";
import { breadcrumbJsonLd, softwareAppJsonLd, TOOL_KEYWORDS } from "@/lib/seo";

type Props = {
  tool: ToolType;
  intro: { h1: string; lead: string };
  faq: { q: string; a: string }[];
  whatItDoes: string[];
  audiences?: AudienceCard[];
};

export function ToolPage({ tool, intro, faq, whatItDoes, audiences = [] }: Props) {
  const meta = TOOLS[tool];
  const toolKeywordMap: Record<ToolType, readonly string[]> = {
    humanizer: TOOL_KEYWORDS.humanizer,
    detector: TOOL_KEYWORDS.detector,
    grammar: TOOL_KEYWORDS.grammar,
    linkedin: TOOL_KEYWORDS.linkedin,
    email: TOOL_KEYWORDS.email,
    plagiarism: TOOL_KEYWORDS.plagiarism,
    study: TOOL_KEYWORDS.study,
  };
  const pagePath = `/${meta.slug}`;
  const appJsonLd = withoutContext(
    softwareAppJsonLd({
      name: `rewrito ${meta.name}`,
      description: meta.description,
      path: pagePath,
      category: tool === "study" ? "EducationalApplication" : "WritingApplication",
      keywords: toolKeywordMap[tool],
    })
  );
  const breadcrumb = withoutContext(
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Tools", path: "/tools" },
      { name: meta.name, path: pagePath },
    ])
  );
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      appJsonLd,
      breadcrumb,
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-bg">
          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
            <ToolWorkspace initialTool={tool} lockTool />
          </div>
        </section>

        <section className="bg-bg">
          <div className="mx-auto max-w-5xl px-5 pb-10 pt-4 sm:px-8 sm:pb-14 sm:pt-8">
            <nav className="mb-5 text-sm text-ink-muted">
              <Link href="/" prefetch={false} className="hover:text-ink">Home</Link>
              <span className="mx-2 text-ink-subtle">/</span>
              <span className="text-ink">{meta.name}</span>
            </nav>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl md:text-5xl">
              {intro.h1}
            </h1>
            <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
              {intro.lead}
            </p>
          </div>
        </section>

        <section className="bg-bg-section/60">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              What the {meta.name} does
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {whatItDoes.map((item, i) => (
                <li key={i} className="card flex items-start gap-3 p-4">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-softPurple text-brand">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  <span className="text-sm text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-bg">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <span className="chip mb-5">{meta.name} guide</span>
                <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  A focused workspace for clearer, more useful output.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  rewrito combines AI intelligence with practical review habits, so every session helps you improve the result and understand why it improved.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <SeoSignalCard
                  title="Built for the job"
                  body={seoIntentCopy(tool)}
                />
                <SeoSignalCard
                  title="Built for learning"
                  body="The output is paired with structure, scores, or coaching so users build human judgment instead of only receiving a finished answer."
                />
              </div>
            </div>
          </div>
        </section>

        {audiences.length > 0 && (
          <AudienceShowcase
            title="Built for people who need this specific workflow."
            lead="Each rewrito tool is focused around a real job, so the output is easier to review, reuse, and learn from."
            audiences={audiences}
          />
        )}

        <section className="bg-bg">
          <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="mb-8 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Frequently asked
            </h2>
            <div className="divide-y divide-line rounded-2xl border border-line bg-white">
              {faq.map((f, i) => (
                <details key={i} className="group p-5 sm:p-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-medium text-ink">
                    {f.q}
                    <span aria-hidden className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bg-section text-ink-muted transition-transform group-open:rotate-45">
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

        <section className="bg-bg-section/60">
          <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-16">
            <div className="card flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
              <div>
                <h2 className="text-xl font-semibold text-ink">
                  Explore the other tools
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  One toolkit for the writing that matters.
                </p>
              </div>
              <Link href="/tools" prefetch={false} className="btn-primary">
                See all tools <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
    </>
  );
}

function withoutContext<T extends Record<string, unknown>>(value: T) {
  const { ["@context"]: _context, ...rest } = value;
  return rest;
}

function SeoSignalCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-line bg-white p-5 shadow-soft">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
    </article>
  );
}

function seoIntentCopy(tool: ToolType) {
  if (tool === "humanizer") {
    return "Use it when you need to humanize AI text, reduce robotic phrasing, keep meaning intact, and make a draft sound natural before publishing.";
  }
  if (tool === "detector") {
    return "Use it when you need detector-style AI confidence scoring, humanized improvements, and clearer writing lessons before publishing.";
  }
  if (tool === "grammar") {
    return "Use it when you need a grammar checker that fixes mistakes, improves clarity, preserves your meaning, and explains the main writing patterns.";
  }
  if (tool === "linkedin") {
    return "Use it when you need a LinkedIn post rewriter that creates a clear hook, short paragraphs, stronger structure, and a professional voice.";
  }
  if (tool === "email") {
    return "Use it when you need a professional email rewriter for polite follow-ups, concise workplace replies, client emails, and confident business communication.";
  }
  if (tool === "plagiarism") {
    return "Use it when you need a plagiarism checker for originality risk, underlined similarity signals, citation-needed review, and safer wording.";
  }
  return "Use it when you need an AI study assistant to explain concepts, organize notes, create quizzes and flashcards, or build a study plan.";
}
