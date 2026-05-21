import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StudyFlashcardsWorkspace } from "@/components/study/StudyFlashcardsWorkspace";
import { ArrowRightIcon, StudyIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "AI Flashcard Generator - Rewrito Study",
  description:
    "Create interactive flip flashcards from notes, formulas, definitions, and exam material with Rewrito Study.",
  alternates: { canonical: "/rewrito-study/flashcards" },
  openGraph: {
    title: "AI Flashcard Generator - Rewrito Study",
    description:
      "Turn study notes into flip-ready Q/A cards for active recall and exam revision.",
    url: "/rewrito-study/flashcards",
  },
};

export default function RewritoStudyFlashcardsPage() {
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
              <span className="text-ink">Flashcards</span>
            </nav>

            <div className="grid gap-10 lg:grid-cols-[1fr_0.75fr] lg:items-center">
              <div>
                <span className="chip mb-5">
                  <StudyIcon size={14} />
                  Flashcards
                </span>
                <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                  Create flip-ready flashcards from your notes.
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-ink-muted sm:text-lg">
                  Convert definitions, formulas, concepts, and messy notes into active recall cards that are easy to revise from.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link href="#flashcard-workspace" className="btn-primary">
                    Create flashcards
                    <ArrowRightIcon size={16} />
                  </Link>
                  <Link href="/rewrito-study/quiz" className="btn-secondary">
                    Open quiz testlets
                  </Link>
                </div>
              </div>
              <FlashcardHeroMockup />
            </div>
          </div>
        </section>

        <section id="flashcard-workspace" className="bg-bg">
          <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
            <StudyFlashcardsWorkspace />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function FlashcardHeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-md [perspective:1200px]" aria-hidden>
      <div className="relative min-h-72 rounded-2xl border border-line bg-white p-5 shadow-card [transform:rotateX(4deg)_rotateY(-6deg)]">
        <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl bg-brand-gradient" />
        <span className="mb-4 inline-flex rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          Flip card
        </span>
        <h3 className="text-lg font-semibold text-ink">Q: What is working capital?</h3>
        <div className="mt-5 rounded-2xl border border-success bg-success/10 p-4 text-success">
          <p className="text-xs font-semibold uppercase tracking-wide">Answer</p>
          <p className="mt-2 text-sm font-semibold leading-relaxed">
            Current assets minus current liabilities, showing short-term financial flexibility.
          </p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <span className="h-2 rounded-full bg-brand" />
          <span className="h-2 rounded-full bg-brand-accent" />
          <span className="h-2 rounded-full bg-success" />
        </div>
      </div>
    </div>
  );
}
