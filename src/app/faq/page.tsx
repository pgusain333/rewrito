import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRightIcon } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "rewrito FAQ - AI Humanizer, Detector, Plagiarism, and Study Questions",
  description:
    "Answers to common questions about rewrito, free access, saved history, AI humanizing, detector scores, plagiarism checking, Rewrito Study, privacy, and mobile support.",
  path: "/faq",
  keywords: ["rewrito FAQ", "AI humanizer questions", "AI detector score questions", "plagiarism checker questions", "AI study assistant questions"],
});

const faqs = [
  {
    q: "Is rewrito free to try?",
    a: "Yes. You can start without signing up. Sign in with Google or email when you want longer inputs, saved history, and a personalized dashboard.",
  },
  {
    q: "Will my writing sound like me?",
    a: "rewrito is built to preserve your meaning, your specific points, and your voice. Light refinement keeps your voice closest to the original, while Medium and Strong rebalance for flow.",
  },
  {
    q: "Do you store what I paste in?",
    a: "Anonymous sessions are not saved. For signed-in users, recent rewrites are saved to your dashboard so you can revisit useful drafts.",
  },
  {
    q: "Which tools are included?",
    a: "rewrito includes an AI Humanizer, AI Detector Score, Plagiarism Checker, LinkedIn Post Rewriter, Professional Email Rewriter, and Rewrito Study.",
  },
  {
    q: "Does the Plagiarism Checker scan databases?",
    a: "No. It provides an originality-risk review with underlined copied-sounding phrases and citation-needed guidance. It is not an official university database match report.",
  },
  {
    q: "What does Rewrito Study do?",
    a: "Rewrito Study helps students understand concepts, organize notes, generate quizzes, create flashcards, and build study plans for exam preparation.",
  },
  {
    q: "Does rewrito detect AI-generated writing?",
    a: "rewrito shows an AI-generated confidence score alongside quality scoring. The score is a helpful signal, not a guarantee, because AI detection is inherently imperfect.",
  },
  {
    q: "Can I use this on mobile?",
    a: "Yes. rewrito is built mobile-first with stacked layouts, large tap targets, and responsive controls.",
  },
  {
    q: "What is the input limit?",
    a: "Anonymous users can paste shorter drafts. Signed-in users can work with up to 1,200 words per input, and premium-ready limits are designed for longer workflows.",
  },
];

export default function FAQPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-bg">
          <div className="mx-auto max-w-4xl px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
            <span className="chip mb-5">FAQ</span>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Common questions about rewrito.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
              Quick answers about free access, saved rewrites, AI scoring, plagiarism review, privacy, writing tools, and Rewrito Study.
            </p>
          </div>
        </section>

        <section className="bg-bg-section/60">
          <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
            <div className="divide-y divide-line rounded-2xl border border-line bg-white">
              {faqs.map((faq) => (
                <details key={faq.q} className="group p-5 sm:p-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-base font-medium text-ink">
                    {faq.q}
                    <span
                      aria-hidden
                      className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-bg-section text-ink-muted transition-transform group-open:rotate-45"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-bg">
          <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-16">
            <div className="card flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
              <div>
                <h2 className="text-xl font-semibold text-ink">Ready to try it?</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Open the toolkit and try your first rewrite or study session.
                </p>
              </div>
              <Link href="/tools" className="btn-primary">
                Explore tools <ArrowRightIcon size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
