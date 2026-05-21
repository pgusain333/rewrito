import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StudyQuizWorkspace } from "@/components/study/StudyQuizWorkspace";
import { ArrowRightIcon, StudyIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "AI Quiz Testlet Creator - Rewrito Study",
  description:
    "Create AI quiz testlets from study material, answer MCQs, see a scorecard, identify weak areas, and generate targeted practice with Rewrito Study.",
  alternates: { canonical: "/rewrito-study/quiz" },
  openGraph: {
    title: "AI Quiz Testlet Creator - Rewrito Study",
    description:
      "Create quiz testlets, save scores when logged in, and practice weak areas with Rewrito Study.",
    url: "/rewrito-study/quiz",
  },
};

export default function RewritoStudyQuizPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-bg">
          <div aria-hidden className="hero-abstract opacity-70">
            <div className="grid-overlay" />
            <div className="blob-mid" />
          </div>
          <div className="mx-auto max-w-6xl px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
            <nav className="mb-5 text-sm text-ink-muted">
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
              <span className="mx-2 text-ink-subtle">/</span>
              <Link href="/study-assistant" className="hover:text-ink">
                Rewrito Study
              </Link>
              <span className="mx-2 text-ink-subtle">/</span>
              <span className="text-ink">Quiz</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-center">
              <div>
                <span className="chip mb-5">
                  <StudyIcon size={14} />
                  Quiz testlets
                </span>
                <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                  Turn study material into focused testlets.
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
                  Create MCQs, submit answers, review your scorecard, save scores when logged in, and generate a new quiz for weak areas only.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="#quiz-workspace" className="btn-primary">
                    Create a testlet
                    <ArrowRightIcon size={16} />
                  </Link>
                  <Link href="/rewrito-study/flashcards" className="btn-secondary">
                    Open flashcards
                  </Link>
                </div>
              </div>
              <QuizHeroMockup />
            </div>
          </div>
        </section>

        <section id="quiz-workspace" className="bg-bg">
          <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
            <StudyQuizWorkspace />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function QuizHeroMockup() {
  return (
    <div className="card relative overflow-hidden p-5 shadow-card" aria-hidden>
      <div className="absolute inset-x-0 top-0 h-[3px] bg-brand-gradient" />
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">Scorecard preview</span>
        <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          82%
        </span>
      </div>
      <div className="space-y-3">
        {[
          ["Strong area", "Definitions and formulas", "92%"],
          ["Important area", "Application questions", "67%"],
          ["Weak area", "Exception rules", "33%"],
        ].map(([label, area, score]) => (
          <div key={label} className="rounded-xl border border-line bg-bg-soft p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
                <p className="mt-1 text-sm font-semibold text-ink">{area}</p>
              </div>
              <span className="text-sm font-semibold text-brand">{score}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-brand-softPurple px-4 py-3 text-sm font-semibold text-brand">
        Create weak-area testlet
      </div>
    </div>
  );
}
