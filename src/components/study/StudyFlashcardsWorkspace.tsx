"use client";

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import Link from "next/link";
import { parseFlashcards, type StudyFlashcard } from "@/lib/study/practice";
import { EDUCATION_LEVELS, type EducationLevel } from "@/lib/prompts";
import { useAuthAndUsage } from "@/lib/usage/useAuthAndUsage";
import { ANON_WORD_LIMIT, PRO_WORD_LIMIT, USER_WORD_LIMIT } from "@/lib/usage/limits";
import { STUDY_SUBJECTS } from "@/lib/study/subjects";
import { LoginModal } from "@/components/modals/LoginModal";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import { ArrowRightIcon, StudyIcon, WandIcon } from "@/components/ui/icons";

function countWords(text: string) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function StudyFlashcardsWorkspace() {
  const [material, setMaterial] = useState("");
  const [subject, setSubject] = useState("General study");
  const [educationLevel, setEducationLevel] = useState<EducationLevel>("college");
  const [cards, setCards] = useState<StudyFlashcard[]>([]);
  const [rawDeck, setRawDeck] = useState("");
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const { user, anonId, used, limit, remaining, incrementAnon, setUsageFromServer } =
    useAuthAndUsage();
  const isPaidUser = user?.plan === "pro";
  const wordCount = useMemo(() => countWords(material), [material]);
  const wordLimit = isPaidUser ? PRO_WORD_LIMIT : user ? USER_WORD_LIMIT : ANON_WORD_LIMIT;
  const wordLimitExceeded = wordCount > wordLimit;
  const studiedCount = Object.values(flipped).filter(Boolean).length;

  async function createDeck() {
    setError(null);
    if (material.trim().length < 20) {
      setError("Paste study material first so rewrito can create useful flashcards.");
      return;
    }
    if (!user && used >= limit) {
      setShowLogin(true);
      return;
    }
    if (user && used >= limit) {
      setShowUpgrade(true);
      return;
    }
    if (wordLimitExceeded) {
      if (!user) {
        setError(`Log in to continue with study material over ${wordLimit.toLocaleString()} words.`);
        setShowLogin(true);
      } else if (!isPaidUser) {
        setError(`Upgrade to continue with study material over ${wordLimit.toLocaleString()} words.`);
        setShowUpgrade(true);
      } else {
        setError(`Study material is too long. Keep it under ${wordLimit.toLocaleString()} words.`);
      }
      return;
    }
    if (!anonId && !user) {
      setError("Preparing your session. Please try again in a moment.");
      return;
    }

    setLoading(true);
    setCards([]);
    setRawDeck("");
    setFlipped({});

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "study",
          text: subject.trim()
            ? `${material}\n\nSubject focus: ${subject.trim()}`
            : material,
          tone: "professional",
          refinement: "medium",
          anonymousId: anonId,
          studyMode: "flashcards",
          educationLevel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.requiresAuth) setShowLogin(true);
        if (data?.requiresUpgrade) setShowUpgrade(true);
        setError(data?.error ?? "Could not create flashcards.");
        if (typeof data?.used === "number") setUsageFromServer(data.used);
        return;
      }

      const output = data.output ?? "";
      const parsed = parseFlashcards(output);
      setRawDeck(output);
      setCards(parsed);
      if (!parsed.length) {
        setError("The deck was generated, but the flashcards could not be read. Try again with clearer material.");
      }
      if (typeof data.used === "number") {
        setUsageFromServer(data.used);
      } else if (!user) {
        incrementAnon();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="card overflow-hidden">
        <div className="border-b border-line bg-bg-soft p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                <StudyIcon size={22} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-success">
                  Rewrito Study practice
                </p>
                <h2 className="mt-1 text-xl font-semibold text-ink">Flashcard deck creator</h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">
                  Turn notes into flip-ready Q/A cards for definitions, formulas, distinctions, and exam recall.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center sm:flex sm:text-left">
              <StatPill label="Cards" value={cards.length ? `${cards.length}` : "8-12"} />
              <StatPill label="Uses left" value={`${remaining}`} />
            </div>
          </div>
        </div>

        <div>
          <div className="border-b border-line p-5 xl:p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <label htmlFor="flashcard-material" className="field-label !mb-0">
                Study material
              </label>
              <span className="text-xs text-ink-subtle">
                {wordCount}/{wordLimit.toLocaleString()} word{wordCount === 1 ? "" : "s"}
              </span>
            </div>
            <textarea
              id="flashcard-material"
              value={material}
              onChange={(event) => {
                setMaterial(event.target.value);
                setError(null);
              }}
              rows={13}
              className="input-base resize-y leading-relaxed"
              placeholder="Paste notes, definitions, formulas, or exam material you want to revise with flashcards..."
            />

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="field-label">Subject</span>
                <select
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="input-base"
                >
                  {STUDY_SUBJECTS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="field-label">Education level</span>
                <select
                  value={educationLevel}
                  onChange={(event) => setEducationLevel(event.target.value as EducationLevel)}
                  className="input-base"
                >
                  {EDUCATION_LEVELS.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button type="button" disabled={loading} onClick={createDeck} className="btn-primary w-full sm:w-auto">
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <WandIcon size={16} />
                )}
                {loading ? "Creating deck..." : "Create flashcards"}
              </button>
              <Link href="/study-assistant/quiz" className="btn-secondary w-full sm:w-auto">
                Open quiz testlets
                <ArrowRightIcon size={16} />
              </Link>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-error/30 bg-error/5 px-3.5 py-2.5 text-sm text-error">
                {error}
              </div>
            )}
          </div>

          <div className="bg-bg-soft p-5 xl:p-6">
            <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-sm font-semibold text-ink">Interactive deck</h3>
                <p className="mt-1 text-xs text-ink-muted">
                  Flip each card to reveal the answer.
                </p>
              </div>
              <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink-muted shadow-soft">
                {studiedCount}/{cards.length} flipped
              </span>
            </div>
            {cards.length ? (
              <FlashcardDeck cards={cards} flipped={flipped} setFlipped={setFlipped} />
            ) : (
              <EmptyDeckState loading={loading} rawDeck={rawDeck} />
            )}
          </div>
        </div>
      </section>

      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        headline="Log in to continue studying"
        subline="Log in to keep creating practice material."
      />
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-white px-4 py-3 shadow-soft">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}

function FlashcardDeck({
  cards,
  flipped,
  setFlipped,
}: {
  cards: StudyFlashcard[];
  flipped: Record<number, boolean>;
  setFlipped: Dispatch<SetStateAction<Record<number, boolean>>>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card, index) => {
        const isFlipped = !!flipped[index];
        return (
          <button
            key={`${card.question}-${index}`}
            type="button"
            onClick={() => setFlipped((prev) => ({ ...prev, [index]: !prev[index] }))}
            className="min-h-52 text-left [perspective:1200px]"
          >
            <span
              className={`relative block min-h-52 rounded-2xl transition-transform duration-500 [transform-style:preserve-3d] ${
                isFlipped ? "[transform:rotateY(180deg)]" : ""
              }`}
            >
              <span className="absolute inset-0 rounded-2xl border border-line bg-white p-4 text-ink shadow-soft [backface-visibility:hidden]">
                <span className="mb-3 inline-flex rounded-full bg-bg-section px-2.5 py-1 text-[11px] font-semibold text-ink-muted">
                  Question {index + 1}
                </span>
                <span className="block text-sm font-semibold leading-relaxed">{card.question}</span>
                <span className="absolute bottom-4 left-4 text-xs text-ink-subtle">Click to flip</span>
              </span>
              <span className="absolute inset-0 rounded-2xl border border-success bg-success/10 p-4 text-success shadow-soft [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <span className="mb-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-muted">
                  Answer
                </span>
                <span className="block text-sm font-semibold leading-relaxed">{card.answer}</span>
                <span className="absolute bottom-4 left-4 text-xs text-success/70">Click to return</span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function EmptyDeckState({ loading, rawDeck }: { loading: boolean; rawDeck: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-white p-8 text-center shadow-soft">
      {loading ? (
        <>
          <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-success/20 border-t-success" />
          <h3 className="mt-4 text-lg font-semibold text-ink">Building your deck</h3>
          <p className="mt-2 text-sm text-ink-muted">
            Rewrito is turning your notes into memory-friendly cards.
          </p>
        </>
      ) : rawDeck ? (
        <p className="text-sm text-ink-muted">Try generating again with clearer source material.</p>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-ink">Your flashcards will appear here</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
            Paste study material, generate a deck, then click each card to reveal the answer.
          </p>
        </>
      )}
    </div>
  );
}
