"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  analyzeQuizAttempt,
  parseQuizQuestions,
  type QuizAnalysis,
  type StudyQuizQuestion,
} from "@/lib/study/practice";
import { EDUCATION_LEVELS, type EducationLevel, type QuizQuestionCount } from "@/lib/prompts";
import { useAuthAndUsage } from "@/lib/usage/useAuthAndUsage";
import { ANON_WORD_LIMIT, PRO_WORD_LIMIT, USER_WORD_LIMIT } from "@/lib/usage/limits";
import { STUDY_SUBJECTS } from "@/lib/study/subjects";
import { LoginModal } from "@/components/modals/LoginModal";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import {
  ArrowRightIcon,
  CheckIcon,
  StudyIcon,
  TrashIcon,
  WandIcon,
} from "@/components/ui/icons";

type SavedQuizAttempt = {
  id: string;
  createdAt: string;
  subject: string;
  title: string;
  score: number;
  total: number;
  percent: number;
  strongAreas: string[];
  importantAreas: string[];
  weakAreas: string[];
};

type TestletKind = "standard" | "weak";

function countWords(text: string) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function savedKey(userId: string) {
  return `rewrito.study.quizScores.${userId}`;
}

export function StudyQuizWorkspace() {
  const [material, setMaterial] = useState("");
  const [subject, setSubject] = useState("General study");
  const [educationLevel, setEducationLevel] = useState<EducationLevel>("college");
  const [rawTestlet, setRawTestlet] = useState("");
  const [questions, setQuestions] = useState<StudyQuizQuestion[]>([]);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testletKind, setTestletKind] = useState<TestletKind>("standard");
  const [savedAttempts, setSavedAttempts] = useState<SavedQuizAttempt[]>([]);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [actionPlan, setActionPlan] = useState("");
  const [actionPlanLoading, setActionPlanLoading] = useState(false);
  const [actionPlanError, setActionPlanError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [loginCopy, setLoginCopy] = useState({
    headline: "Log in to save quiz scores",
    subline: "Log in to keep your quiz scores and continue practicing.",
  });

  const { user, anonId, incrementAnon, setUsageFromServer } =
    useAuthAndUsage();
  const isPaidUser = user?.plan === "pro";
  const questionCount: QuizQuestionCount = isPaidUser ? 20 : 5;
  const wordCount = useMemo(() => countWords(material), [material]);
  const wordLimit = isPaidUser ? PRO_WORD_LIMIT : user ? USER_WORD_LIMIT : ANON_WORD_LIMIT;
  const wordLimitExceeded = wordCount > wordLimit;
  const answeredCount = Object.keys(selected).length;
  const analysis = useMemo<QuizAnalysis | null>(
    () => (submitted ? analyzeQuizAttempt(questions, selected) : null),
    [questions, selected, submitted]
  );

  useEffect(() => {
    if (!user || typeof window === "undefined") {
      setSavedAttempts([]);
      return;
    }
    try {
      const parsed = JSON.parse(window.localStorage.getItem(savedKey(user.id)) ?? "[]");
      setSavedAttempts(Array.isArray(parsed) ? parsed : []);
    } catch {
      setSavedAttempts([]);
    }
  }, [user]);

  async function createTestlet(kind: TestletKind = "standard") {
    setError(null);
    setSavedNotice(null);

    if (material.trim().length < 20) {
      setError("Paste study material first so rewrito can create useful questions.");
      return;
    }
    if (wordLimitExceeded) {
      if (!user) {
        setError(`Log in to continue with study material over ${wordLimit.toLocaleString()} words.`);
        setLoginCopy({
          headline: "This is a premium feature",
          subline:
            "Longer quiz testlets are a premium feature. Sign up or log in to unlock longer study material and saved scorecards.",
        });
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
    setSubmitted(false);
    setSelected({});
    setActionPlan("");
    setActionPlanError(null);
    setRawTestlet("");
    setQuestions([]);
    setTestletKind(kind);

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "study",
          text: buildQuizPrompt(kind),
          tone: "professional",
          refinement: "medium",
          anonymousId: anonId,
          studyMode: "quiz",
          educationLevel,
          studyPlan: {
            subject,
          },
          quizQuestionCount: questionCount,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.requiresAuth) {
          setLoginCopy({
            headline: "This is a premium feature",
            subline:
              "This quiz workflow is a premium feature. Sign up or log in to continue with longer study material.",
          });
          setShowLogin(true);
        }
        if (data?.requiresUpgrade) setShowUpgrade(true);
        setError(data?.error ?? "Could not create this quiz testlet.");
        if (typeof data?.used === "number") setUsageFromServer(data.used);
        return;
      }

      const output = data.output ?? "";
      const parsed = parseQuizQuestions(output);
      setRawTestlet(output);
      setQuestions(parsed);
      if (!parsed.length) {
        setError("The quiz was generated, but the questions could not be read. Try again with clearer material.");
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

  function buildQuizPrompt(kind: TestletKind) {
    if (kind !== "weak" || !analysis?.weakAreas.length) return material;
    const weakTopics = analysis.weakAreas.map((area) => area.topic).join(", ");
    const missedQuestions = questions
      .filter((question, index) => selected[index] !== question.answerKey)
      .map((question, index) => `${index + 1}. ${question.prompt}`)
      .join("\n");
    return `${material}

Create this quiz only from these weak areas: ${weakTopics}

Use the missed questions below to understand what to test next. Do not repeat the same wording.
${missedQuestions}`;
  }

  function submitQuiz() {
    if (answeredCount < questions.length) return;
    setSubmitted(true);
    setSavedNotice(null);
    setActionPlan("");
    setActionPlanError(null);
  }

  function resetQuiz() {
    setSelected({});
    setSubmitted(false);
    setSavedNotice(null);
    setActionPlan("");
    setActionPlanError(null);
  }

  function saveScore() {
    if (!user) {
      setLoginCopy({
        headline: "This is a premium feature",
        subline:
          "Saving quiz scores is a premium feature. Sign up or log in to keep scorecards, weak areas, and study progress.",
      });
      setShowLogin(true);
      return;
    }
    if (!analysis) return;

    const attempt: SavedQuizAttempt = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      subject: subject.trim() || "General study",
      title: testletKind === "weak" ? "Weak-area testlet" : "Quiz testlet",
      score: analysis.correct,
      total: analysis.total,
      percent: analysis.percent,
      strongAreas: analysis.strongAreas.map((area) => area.topic),
      importantAreas: analysis.importantAreas.map((area) => area.topic),
      weakAreas: analysis.weakAreas.map((area) => area.topic),
    };
    const next = [attempt, ...savedAttempts].slice(0, 20);
    setSavedAttempts(next);
    window.localStorage.setItem(savedKey(user.id), JSON.stringify(next));
    setSavedNotice("Score saved.");
  }

  async function createActionPlan() {
    if (!analysis) return;
    setActionPlanLoading(true);
    setActionPlanError(null);
    setActionPlan("");

    try {
      const res = await fetch("/api/study/action-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material,
          subject,
          educationLevel,
          score: {
            correct: analysis.correct,
            total: analysis.total,
            percent: analysis.percent,
          },
          rows: analysis.rows,
          strongAreas: analysis.strongAreas,
          importantAreas: analysis.importantAreas,
          weakAreas: analysis.weakAreas,
          questions: questions.map((question, index) => ({
            prompt: question.prompt,
            topic: question.topic,
            selected: selected[index],
            answerKey: question.answerKey,
            explanation: question.explanation,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.requiresAuth) {
          setLoginCopy({
            headline: "This is a premium feature",
            subline:
              "Action plans for longer study material are a premium feature. Sign up or log in to continue.",
          });
          setShowLogin(true);
        }
        if (data?.requiresUpgrade) setShowUpgrade(true);
        setActionPlanError(data?.error ?? "Could not create your action plan.");
        return;
      }
      setActionPlan(data.output ?? "");
    } catch {
      setActionPlanError("Network error. Please try again.");
    } finally {
      setActionPlanLoading(false);
    }
  }

  function deleteSavedAttempt(id: string) {
    const ok = window.confirm("Delete this saved quiz score?");
    if (!ok || !user) return;
    const next = savedAttempts.filter((attempt) => attempt.id !== id);
    setSavedAttempts(next);
    window.localStorage.setItem(savedKey(user.id), JSON.stringify(next));
  }

  return (
    <div className="space-y-6">
      <section className="card overflow-hidden">
        <div className="border-b border-line bg-bg-soft p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-softPurple text-brand">
                <StudyIcon size={22} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                  Rewrito Study practice
                </p>
                <h2 className="mt-1 text-xl font-semibold text-ink">Quiz testlet creator</h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">
                  Create exam-style MCQs, submit answers, see a scorecard, then generate a new testlet for weak areas only.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center sm:flex sm:text-left">
              <StatPill label="Questions" value={`${questionCount}`} />
              <StatPill label="Word limit" value={wordLimit.toLocaleString()} />
            </div>
          </div>
        </div>

        <div className="grid gap-0 2xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="border-b border-line p-5 2xl:border-b-0 2xl:border-r 2xl:p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <label htmlFor="quiz-material" className="field-label !mb-0">
                Study material
              </label>
              <span className="text-xs text-ink-subtle">
                {wordCount}/{wordLimit.toLocaleString()} word{wordCount === 1 ? "" : "s"}
              </span>
            </div>
            <textarea
              id="quiz-material"
              value={material}
              onChange={(event) => {
                setMaterial(event.target.value);
                setError(null);
              }}
              rows={13}
              className="input-base resize-y leading-relaxed"
              placeholder="Paste lecture notes, a textbook section, accounting problem, finance concept, law paragraph, or exam revision material..."
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
              <button
                type="button"
                disabled={loading}
                onClick={() => createTestlet("standard")}
                className="btn-primary w-full sm:w-auto"
              >
                {loading && testletKind === "standard" ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <WandIcon size={16} />
                )}
                {loading && testletKind === "standard" ? "Creating testlet..." : "Create quiz testlet"}
              </button>
              <button
                type="button"
                disabled={loading || !analysis?.weakAreas.length}
                onClick={() => createTestlet("weak")}
                className="btn-secondary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-50"
              >
                Test weak areas only
                <ArrowRightIcon size={16} />
              </button>
            </div>
            <p className="mt-3 text-center text-xs leading-relaxed text-ink-subtle sm:text-left">
              By using rewrito, you agree to our{" "}
              <Link href="/terms" prefetch={false} className="font-medium text-brand hover:underline">
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link href="/privacy" prefetch={false} className="font-medium text-brand hover:underline">
                Privacy Policy
              </Link>.
            </p>

            {error && (
              <div className="mt-4 rounded-xl border border-error/30 bg-error/5 px-3.5 py-2.5 text-sm text-error">
                {error}
              </div>
            )}
          </div>

          <SavedAttemptsPanel
            userName={user?.name ?? user?.email ?? null}
            attempts={savedAttempts}
            onDelete={deleteSavedAttempt}
            onLogin={() => {
              setLoginCopy({
                headline: "This is a premium feature",
                subline:
                  "Saved quiz history is a premium feature. Sign up or log in to keep scorecards and weak-area practice.",
              });
              setShowLogin(true);
            }}
          />
        </div>
      </section>

      {questions.length > 0 ? (
        <section className="space-y-6">
          <QuizTestletPanel
            kind={testletKind}
            questions={questions}
            selected={selected}
            submitted={submitted}
            onSelect={(index, key) => setSelected((prev) => ({ ...prev, [index]: key }))}
            onSubmit={submitQuiz}
            onReset={resetQuiz}
          />
          <ScoreReport
            analysis={analysis}
            canSubmit={answeredCount === questions.length}
            savedNotice={savedNotice}
            isLoggedIn={!!user}
            onSubmit={submitQuiz}
            onSave={saveScore}
            onCreateWeak={() => createTestlet("weak")}
            onActionPlan={createActionPlan}
            actionPlan={actionPlan}
            actionPlanLoading={actionPlanLoading}
            actionPlanError={actionPlanError}
          />
        </section>
      ) : (
        <EmptyPracticeState loading={loading} rawTestlet={rawTestlet} />
      )}

      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        headline={loginCopy.headline}
        subline={loginCopy.subline}
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

function SavedAttemptsPanel({
  userName,
  attempts,
  onDelete,
  onLogin,
}: {
  userName: string | null;
  attempts: SavedQuizAttempt[];
  onDelete: (id: string) => void;
  onLogin: () => void;
}) {
  return (
        <aside className="bg-bg-soft p-5 2xl:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">Saved quiz scores</h3>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Logged-in users can save scores and remove attempts they no longer need.
          </p>
        </div>
      </div>

      {!userName ? (
        <div className="rounded-xl border border-dashed border-line bg-white p-4">
          <p className="text-sm leading-relaxed text-ink-muted">
            Log in after a quiz to save your score history.
          </p>
          <button type="button" onClick={onLogin} className="btn-secondary mt-3 w-full">
            Log in to save
          </button>
        </div>
      ) : attempts.length ? (
        <div className="space-y-3">
          {attempts.map((attempt) => (
            <div key={attempt.id} className="rounded-xl border border-line bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{attempt.subject}</p>
                  <p className="mt-1 text-xs text-ink-muted">
                    {new Date(attempt.createdAt).toLocaleDateString()} - {attempt.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(attempt.id)}
                  className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-error/10 hover:text-error"
                  title="Delete saved score"
                >
                  <TrashIcon size={15} />
                </button>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <MiniMetric label="Score" value={`${attempt.score}/${attempt.total}`} />
                <MiniMetric label="Percent" value={`${attempt.percent}%`} />
                <MiniMetric label="Weak" value={`${attempt.weakAreas.length}`} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-white p-4 text-sm leading-relaxed text-ink-muted">
          No saved quiz scores yet. Finish a testlet, then save the result here.
        </div>
      )}
    </aside>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-bg-section px-2 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function QuizTestletPanel({
  kind,
  questions,
  selected,
  submitted,
  onSelect,
  onSubmit,
  onReset,
}: {
  kind: TestletKind;
  questions: StudyQuizQuestion[];
  selected: Record<number, string>;
  submitted: boolean;
  onSelect: (index: number, key: string) => void;
  onSubmit: () => void;
  onReset: () => void;
}) {
  const answeredCount = Object.keys(selected).length;
  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            {kind === "weak" ? "Weak-area testlet" : "Quiz testlet"}
          </p>
          <h3 className="mt-1 text-xl font-semibold text-ink">
            Answer each question, then review your scorecard.
          </h3>
        </div>
        <span className="inline-flex w-fit rounded-full bg-bg-section px-3 py-1 text-xs font-semibold text-ink-muted">
          {answeredCount}/{questions.length} answered
        </span>
      </div>

      <div className="space-y-7">
        {questions.map((question, index) => (
          <article
            key={`${question.prompt}-${index}`}
            className="rounded-2xl border border-line bg-bg-soft p-5 shadow-soft"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <p className="text-sm font-semibold leading-relaxed text-ink">
                {index + 1}. {question.prompt}
              </p>
              <span className="w-fit rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-brand shadow-soft">
                {question.topic}
              </span>
            </div>

            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {question.options.map((option) => {
                const chosen = selected[index] === option.key;
                const correct = submitted && option.key === question.answerKey;
                const wrong = submitted && chosen && option.key !== question.answerKey;
                return (
                  <button
                    key={option.key}
                    type="button"
                    disabled={submitted}
                    onClick={() => onSelect(index, option.key)}
                    className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                      correct
                        ? "border-success bg-success/10 text-success"
                        : wrong
                        ? "border-error bg-error/10 text-error"
                        : chosen
                        ? "border-brand bg-brand-softPurple text-brand"
                        : "border-line bg-white text-ink hover:border-ink-subtle"
                    }`}
                  >
                    <span className="font-semibold">{option.key})</span>
                    <span>{option.text}</span>
                  </button>
                );
              })}
            </div>

            {submitted && (
              <div className="mt-3 rounded-xl border border-line bg-white p-3 text-xs leading-relaxed text-ink-muted">
                <span className="font-semibold text-ink">Answer: {question.answerKey}.</span>{" "}
                {question.explanation || "Review the tested concept, then try a weak-area testlet."}
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={submitted || answeredCount < questions.length}
          onClick={onSubmit}
          className="btn-primary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitted ? "Score shown" : "Submit quiz"}
        </button>
        <button type="button" onClick={onReset} className="btn-secondary w-full sm:w-auto">
          Reset answers
        </button>
      </div>
    </section>
  );
}

function ScoreReport({
  analysis,
  canSubmit,
  savedNotice,
  isLoggedIn,
  actionPlan,
  actionPlanLoading,
  actionPlanError,
  onSubmit,
  onSave,
  onCreateWeak,
  onActionPlan,
}: {
  analysis: QuizAnalysis | null;
  canSubmit: boolean;
  savedNotice: string | null;
  isLoggedIn: boolean;
  actionPlan: string;
  actionPlanLoading: boolean;
  actionPlanError: string | null;
  onSubmit: () => void;
  onSave: () => void;
  onCreateWeak: () => void;
  onActionPlan: () => void;
}) {
  if (!analysis) {
    return (
      <aside className="card p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-ink">Scorecard</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Answer every question to unlock your scorecard, strong areas, important areas, and weak-area retest.
        </p>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={onSubmit}
          className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit quiz
        </button>
      </aside>
    );
  }

  return (
    <aside className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
      <div className="card p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">Scorecard</p>
        <div className="mt-3 flex items-end gap-3">
          <span className="text-5xl font-semibold tracking-tight text-ink">{analysis.percent}%</span>
          <span className="pb-2 text-sm text-ink-muted">
            {analysis.correct}/{analysis.total} correct
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-bg-section">
          <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${analysis.percent}%` }} />
        </div>
        <div className="mt-4 rounded-xl border border-line bg-bg-soft p-3 text-sm leading-relaxed text-ink">
          {quizMotivation(analysis.percent)}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <MiniMetric label="Strong" value={`${analysis.strongAreas.length}`} />
          <MiniMetric label="Important" value={`${analysis.importantAreas.length}`} />
          <MiniMetric label="Weak" value={`${analysis.weakAreas.length}`} />
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <button type="button" onClick={onSave} className="btn-secondary w-full">
            {isLoggedIn ? "Save score" : "Log in to save score"}
          </button>
          {savedNotice && <p className="text-xs font-semibold text-success">{savedNotice}</p>}
          <button
            type="button"
            disabled={!analysis.weakAreas.length}
            onClick={onCreateWeak}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            Create weak-area testlet
          </button>
          <button
            type="button"
            disabled={actionPlanLoading}
            onClick={onActionPlan}
            className="btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {actionPlanLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-muted/30 border-t-brand" />
            ) : (
              <WandIcon size={16} />
            )}
            {actionPlanLoading ? "Creating action plan..." : "Action plan"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-1">
        <AreaCard title="Strong areas" tone="success" areas={analysis.strongAreas} empty="No strong areas yet. Review the explanations and try again." />
        <AreaCard title="Important areas" tone="warning" areas={analysis.importantAreas} empty="The testlet did not return clear topic labels. Try generating again with clearer material." />
        <AreaCard title="Weak areas" tone="error" areas={analysis.weakAreas} empty="No weak areas found. Create another testlet to confirm retention." />
      </div>
      <div className="xl:col-span-2">
        <AreasTable rows={analysis.rows} />
      </div>
      <div className="xl:col-span-2">
        <BriefStudyPlan analysis={analysis} />
      </div>
      {(actionPlan || actionPlanLoading || actionPlanError) && (
        <div className="xl:col-span-2">
          <ActionPlanPanel
            output={actionPlan}
            loading={actionPlanLoading}
            error={actionPlanError}
          />
        </div>
      )}
    </aside>
  );
}

function quizMotivation(percent: number) {
  if (percent >= 85) {
    return "Strong work. Now protect that score by testing edge cases and one harder mixed testlet.";
  }
  if (percent >= 60) {
    return "Good progress. You have a real base here, and the weak-area testlet will make the next review much sharper.";
  }
  return "This is useful feedback, not a bad result. You just found the exact topics that deserve the next focused round.";
}

function AreaCard({
  title,
  tone,
  areas,
  empty,
}: {
  title: string;
  tone: "success" | "warning" | "error";
  areas: QuizAnalysis["rows"];
  empty: string;
}) {
  const toneClass =
    tone === "success"
      ? "bg-success/10 text-success"
      : tone === "warning"
      ? "bg-warning/10 text-warning"
      : "bg-error/10 text-error";
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
      <h4 className="text-sm font-semibold text-ink">{title}</h4>
      {areas.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {areas.map((area) => (
            <span key={`${title}-${area.topic}`} className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClass}`}>
              {title === "Important areas"
                ? area.topic
                : `${area.topic} - ${area.accuracy}%`}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs leading-relaxed text-ink-muted">{empty}</p>
      )}
    </div>
  );
}

function BriefStudyPlan({ analysis }: { analysis: QuizAnalysis }) {
  const rows = buildStudyPlanRows(analysis);

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
      <div className="flex flex-col justify-between gap-3 border-b border-line bg-bg-soft px-4 py-3 sm:flex-row sm:items-center">
        <div>
          <h4 className="text-sm font-semibold text-ink">Brief study plan</h4>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            Use this as a quick next step, then open the full Study Plan tool for a complete schedule.
          </p>
        </div>
        <Link href="/study-assistant?mode=studyplan#study-tool" prefetch={false} className="btn-secondary !px-3 !py-1.5 text-xs">
          Open Study Plan
          <ArrowRightIcon size={13} />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-left text-xs">
          <thead className="bg-white text-ink">
            <tr>
              <th className="px-3 py-2 font-semibold">Priority</th>
              <th className="px-3 py-2 font-semibold">Area</th>
              <th className="px-3 py-2 font-semibold">What to do next</th>
              <th className="px-3 py-2 font-semibold">Practice task</th>
              <th className="px-3 py-2 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink-muted">
            {rows.map((row) => (
              <tr key={`${row.priority}-${row.area}`}>
                <td className="px-3 py-2 font-medium text-ink">{row.priority}</td>
                <td className="px-3 py-2 font-medium text-ink">{row.area}</td>
                <td className="px-3 py-2">{row.next}</td>
                <td className="px-3 py-2">{row.practice}</td>
                <td className="px-3 py-2">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type ActionBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

function cleanPlanText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/[–—]/g, " - ")
    .replace(/--+/g, "-")
    .trim();
}

function planTableRow(line: string) {
  return cleanPlanText(line)
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isPlanTableSeparator(line: string) {
  return /^\s*\|?[\s:-]+\|[\s|:-]*$/.test(line);
}

function parseActionPlanBlocks(text: string): ActionBlock[] {
  const lines = cleanPlanText(text).split(/\r?\n/);
  const blocks: ActionBlock[] = [];
  let paragraph: string[] = [];

  function flushParagraph() {
    const value = paragraph.join(" ").trim();
    if (value) blocks.push({ type: "paragraph", text: value });
    paragraph = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = cleanPlanText(lines[i] ?? "");
    if (!line) {
      flushParagraph();
      continue;
    }

    const heading = line.match(/^#{1,3}\s+(.+)$/);
    if (heading) {
      flushParagraph();
      blocks.push({ type: "heading", text: heading[1].trim() });
      continue;
    }

    if (line.includes("|") && i + 1 < lines.length && isPlanTableSeparator(lines[i + 1])) {
      flushParagraph();
      const headers = planTableRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i]?.includes("|") && lines[i]?.trim()) {
        rows.push(planTableRow(lines[i]));
        i++;
      }
      i--;
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    const bullets: string[] = [];
    while (i < lines.length) {
      const bullet = cleanPlanText(lines[i] ?? "").match(/^[-*]\s+(.+)$/);
      if (!bullet) break;
      bullets.push(bullet[1].trim());
      i++;
    }
    if (bullets.length) {
      flushParagraph();
      blocks.push({ type: "list", items: bullets });
      i--;
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  return blocks;
}

function ActionPlanPanel({
  output,
  loading,
  error,
}: {
  output: string;
  loading: boolean;
  error: string | null;
}) {
  const blocks = output ? parseActionPlanBlocks(output) : [];

  return (
    <section className="overflow-hidden rounded-2xl border border-brand/20 bg-white shadow-card">
      <div className="border-b border-line bg-ink px-5 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent">
          Rewrito Study coach
        </p>
        <h4 className="mt-1 text-base font-semibold">Action plan to ace the topic</h4>
        <p className="mt-1 text-xs leading-relaxed text-white/70">
          A focused next step based on your quiz result, weak areas, and important concepts.
        </p>
      </div>
      <div className="space-y-4 p-5">
        {loading && (
          <div className="rounded-xl border border-line bg-bg-soft p-4">
            <span className="block h-3 w-2/3 rounded-full shimmer" />
            <span className="mt-3 block h-3 w-full rounded-full shimmer" />
            <span className="mt-2 block h-3 w-5/6 rounded-full shimmer" />
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}
        {!loading &&
          blocks.map((block, index) => {
            if (block.type === "heading") {
              return (
                <h5 key={index} className="pt-1 text-sm font-semibold text-ink">
                  {block.text}
                </h5>
              );
            }
            if (block.type === "paragraph") {
              return (
                <p key={index} className="text-sm leading-relaxed text-ink-muted">
                  {block.text}
                </p>
              );
            }
            if (block.type === "list") {
              return (
                <ul key={index} className="space-y-2 text-sm leading-relaxed text-ink-muted">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <div key={index} className="overflow-x-auto rounded-xl border border-line">
                <table className="min-w-full divide-y divide-line text-left text-xs">
                  <thead className="bg-bg-section text-ink">
                    <tr>
                      {block.headers.map((header) => (
                        <th key={header} className="px-3 py-2 font-semibold">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-ink-muted">
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {block.headers.map((_, cellIndex) => (
                          <td key={cellIndex} className="px-3 py-2 align-top">
                            {row[cellIndex] ?? ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
      </div>
    </section>
  );
}

function buildStudyPlanRows(analysis: QuizAnalysis) {
  const weakRows = analysis.weakAreas.slice(0, 3).map((area) => ({
    priority: "Focus first",
    area: area.topic,
    next: "Review the core explanation and write the rule in your own words.",
    practice: "Create a weak-area testlet and redo missed question types.",
    time: "25 min",
  }));
  const importantRows = analysis.importantAreas
    .filter((area) => !analysis.weakAreas.some((weak) => weak.topic === area.topic))
    .slice(0, 3)
    .map((area) => ({
      priority: area.accuracy >= 80 ? "Maintain" : "Review next",
      area: area.topic,
      next: area.accuracy >= 80 ? "Keep this fresh with quick recall." : "Review examples and clarify the main distinction.",
      practice: area.accuracy >= 80 ? "Answer one mixed question later today." : "Make two flashcards and one practice question.",
      time: area.accuracy >= 80 ? "10 min" : "15 min",
    }));

  const rows = [...weakRows, ...importantRows].slice(0, 5);
  return rows.length
    ? rows
    : [
        {
          priority: "Maintain",
          area: "Core concepts",
          next: "Review the answer explanations and keep practicing mixed questions.",
          practice: "Create a fresh quiz testlet to confirm retention.",
          time: "15 min",
        },
      ];
}

function AreasTable({ rows }: { rows: QuizAnalysis["rows"] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
      <div className="border-b border-line bg-bg-soft px-4 py-3">
        <h4 className="text-sm font-semibold text-ink">Area breakdown</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-line text-left text-xs">
          <thead className="bg-white text-ink">
            <tr>
              <th className="px-3 py-2 font-semibold">Area</th>
              <th className="px-3 py-2 font-semibold">Correct</th>
              <th className="px-3 py-2 font-semibold">Accuracy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink-muted">
            {rows.map((row) => (
              <tr key={row.topic}>
                <td className="px-3 py-2 font-medium text-ink">{row.topic}</td>
                <td className="px-3 py-2">
                  {row.correct}/{row.total}
                </td>
                <td className="px-3 py-2">{row.accuracy}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmptyPracticeState({ loading, rawTestlet }: { loading: boolean; rawTestlet: string }) {
  return (
    <section className="rounded-2xl border border-dashed border-line bg-white p-8 text-center shadow-soft">
      {loading ? (
        <>
          <span className="mx-auto block h-8 w-8 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />
          <h3 className="mt-4 text-lg font-semibold text-ink">Building your testlet</h3>
          <p className="mt-2 text-sm text-ink-muted">
            Rewrito is turning your material into focused practice questions.
          </p>
        </>
      ) : rawTestlet ? (
        <p className="text-sm text-ink-muted">Try generating again with clearer source material.</p>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-ink">Your quiz will appear here</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">
            Paste study material above, create a testlet, answer the questions, and use the scorecard to decide what to review next.
          </p>
          <Link href="/study-assistant/flashcards" prefetch={false} className="btn-secondary mt-5">
            Open flashcards
            <ArrowRightIcon size={16} />
          </Link>
        </>
      )}
    </section>
  );
}
