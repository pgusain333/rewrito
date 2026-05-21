import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { ArrowRightIcon } from "@/components/ui/icons";
import { TOOLS, type ToolType } from "@/lib/prompts";

type Props = {
  tool: ToolType;
  intro: { h1: string; lead: string };
  faq: { q: string; a: string }[];
  whatItDoes: string[];
  audiences?: { title: string; body: string }[];
};

export function ToolPage({ tool, intro, faq, whatItDoes, audiences = [] }: Props) {
  const meta = TOOLS[tool];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-bg">
          <div className="mx-auto max-w-5xl px-5 pb-10 pt-12 sm:px-8 sm:pb-14 sm:pt-16">
            <nav className="mb-5 text-sm text-ink-muted">
              <Link href="/" className="hover:text-ink">Home</Link>
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

        <section className="bg-bg">
          <div className="mx-auto max-w-5xl px-5 pb-16 sm:px-8 sm:pb-24">
            <ToolWorkspace initialTool={tool} lockTool />
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

        {audiences.length > 0 && (
          <section className="bg-bg">
            <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
              <div className="mb-8 max-w-2xl">
                <span className="chip mb-5">Who this is for</span>
                <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  Built for people who need this specific workflow.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  Each rewrito tool is focused around a real job, so the output is easier to review and act on.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {audiences.map((audience, index) => (
                  <article key={audience.title} className="card h-full p-5">
                    <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-softPurple text-sm font-semibold text-brand">
                      {index + 1}
                    </span>
                    <h3 className="text-base font-semibold text-ink">{audience.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">{audience.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
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
              <Link href="/tools" className="btn-primary">
                See all tools <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
