"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  TOOLS,
  TONES,
  REFINEMENTS,
  STUDY_MODES,
  EDUCATION_LEVELS,
  type ScorePair,
  type ToolType,
  type Tone,
  type Refinement,
  type StudyMode,
  type EducationLevel,
  type QuizQuestionCount,
} from "@/lib/prompts";
import { SAMPLES } from "@/lib/prompts/samples";
import { useAuthAndUsage } from "@/lib/usage/useAuthAndUsage";
import { ANON_WORD_LIMIT, PRO_WORD_LIMIT, USER_WORD_LIMIT } from "@/lib/usage/limits";
import { LoginModal } from "@/components/modals/LoginModal";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import { Listbox } from "@/components/ui/Listbox";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ScoreCard } from "@/components/tools/ScoreCard";
import { WritingCoachCard } from "@/components/tools/WritingCoachCard";
import { AiSignalInsights, AiSignalTextBox } from "@/components/tools/AiSignalInsights";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  LinkedinIcon,
  MailIcon,
  ShieldCheckIcon,
  SparkleIcon,
  StudyIcon,
  TrashIcon,
  UploadIcon,
  WandIcon,
} from "@/components/ui/icons";

type Props = {
  initialTool?: ToolType;
  /** When true, the tool tab row is hidden - used on dedicated tool pages. */
  lockTool?: boolean;
};

const REOPEN_SESSION_KEY = "rewrito.reopenSession";
const ANONYMOUS_TONES: Tone[] = ["professional", "natural"];

function countWords(s: string): number {
  const trimmed = s.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function ToolWorkspace({ initialTool = "humanizer", lockTool = false }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tool, setTool] = useState<ToolType>(initialTool);
  const [tone, setTone] = useState<Tone>("professional");
  const [refinement, setRefinement] = useState<Refinement>("medium");
  const [studyMode, setStudyMode] = useState<StudyMode>("explain");
  const [educationLevel, setEducationLevel] = useState<EducationLevel>("college");
  const [studySubject, setStudySubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState("");
  const [prepLevel, setPrepLevel] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [extraTestlets, setExtraTestlets] = useState<string[]>([]);
  const [scores, setScores] = useState<ScorePair | null>(null);
  const [loading, setLoading] = useState(false);
  const [creatingTestlet, setCreatingTestlet] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testletError, setTestletError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const {
    user,
    anonId,
    incrementAnon,
    setUsageFromServer,
  } = useAuthAndUsage();

  const isStudy = tool === "study";
  const isPaidUser = user?.plan === "pro";
  const useWideOutput = isStudy;
  const wordCount = useMemo(() => countWords(input), [input]);
  const wordLimit = isPaidUser ? PRO_WORD_LIMIT : user ? USER_WORD_LIMIT : ANON_WORD_LIMIT;
  const wordLimitLabel = wordLimit.toLocaleString();
  const wordLimitExceeded = wordCount > wordLimit;
  const wordUsagePercent = Math.min(100, Math.round((wordCount / Math.max(wordLimit, 1)) * 100));
  const anonymousAdvancedControl =
    !user && (!ANONYMOUS_TONES.includes(tone) || refinement === "strong");
  const studyActionLabel =
    studyMode === "quiz"
      ? "Create quiz testlet"
      : studyMode === "flashcards"
      ? "Create flashcards"
      : studyMode === "notes"
      ? "Organize notes"
      : studyMode === "studyplan"
      ? "Build study plan"
      : "Create study guide";
  const primaryActionLabel =
    tool === "plagiarism"
      ? "Check originality"
      : tool === "detector"
      ? "Analyze and humanize"
      : "Rewrite with rewrito";
  const charCount = input.length;
  const outputWords = useMemo(() => countWords(output), [output]);
  const usageText = `${wordLimitLabel} word input limit`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(REOPEN_SESSION_KEY);
    if (!raw) return;

    try {
      const saved = JSON.parse(raw) as Partial<{
        tool: ToolType;
        input: string;
        output: string;
        tone: Tone;
        refinement: Refinement;
        studyMode: StudyMode;
        educationLevel: EducationLevel;
      }>;

      if (!lockTool && saved.tool && saved.tool in TOOLS) setTool(saved.tool);
      if (typeof saved.input === "string") setInput(saved.input);
      if (typeof saved.output === "string") setOutput(saved.output);
      if (saved.tone && TONES.some((item) => item.value === saved.tone)) setTone(saved.tone);
      if (saved.refinement && REFINEMENTS.some((item) => item.value === saved.refinement)) {
        setRefinement(saved.refinement);
      }
      if (saved.studyMode && STUDY_MODES.some((item) => item.value === saved.studyMode)) {
        setStudyMode(saved.studyMode);
      }
      if (
        saved.educationLevel &&
        EDUCATION_LEVELS.some((item) => item.value === saved.educationLevel)
      ) {
        setEducationLevel(saved.educationLevel);
      }
    } catch {
      // Ignore malformed saved sessions and let the workspace start cleanly.
    } finally {
      window.localStorage.removeItem(REOPEN_SESSION_KEY);
    }
  }, [lockTool]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mode = new URLSearchParams(window.location.search).get("mode");
    if (!mode || initialTool !== "study") return;
    if (STUDY_MODES.some((item) => item.value === mode)) {
      setStudyMode(mode as StudyMode);
    }
  }, [initialTool]);

  function resetResult() {
    setOutput("");
    setExtraTestlets([]);
    setScores(null);
    setError(null);
    setTestletError(null);
  }

  function handleToolChange(nextTool: ToolType) {
    setTool(nextTool);
    resetResult();
  }

  async function handleSubmit() {
    setError(null);
    if (input.trim().length < 5) {
      setError(
        isStudy
          ? "Paste a concept, question, notes, or study material first."
          : "Add a few more words so we have something to work with."
      );
      return;
    }
    if (wordLimitExceeded) {
      if (!user) {
        setError(`Log in to continue with drafts over ${wordLimitLabel} words.`);
        setShowLogin(true);
      } else if (!isPaidUser) {
        setError(`Upgrade to continue with drafts over ${wordLimitLabel} words.`);
        setShowUpgrade(true);
      } else {
        setError(`Draft is too long. Keep it under ${wordLimitLabel} words.`);
      }
      return;
    }
    if (anonymousAdvancedControl) {
      setError("Log in to unlock every tone and Strong refinement.");
      setShowLogin(true);
      return;
    }
    setLoading(true);
    setOutput("");
    setExtraTestlets([]);
    setScores(null);
    setTestletError(null);
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool,
          text: input,
          tone,
          refinement,
          anonymousId: anonId,
          studyMode,
          educationLevel,
          studyPlan: {
            subject: studySubject,
            examDate,
            hoursPerDay,
            prepLevel,
          },
          quizQuestionCount: 5,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.requiresAuth) {
          setShowLogin(true);
        } else if (data?.requiresUpgrade) {
          setShowUpgrade(true);
        }
        setError(data?.error ?? "Something went wrong.");
        if (typeof data?.used === "number") setUsageFromServer(data.used);
        return;
      }

      setOutput(data.output);
      if (data.scores) setScores(data.scores);
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

  async function handleCreateTestlet(questionCount: QuizQuestionCount) {
    setTestletError(null);
    if (!input.trim()) {
      setTestletError("Paste study material first.");
      return;
    }
    if (!isPaidUser && extraTestlets.length >= 1) {
      setShowUpgrade(true);
      return;
    }
    setCreatingTestlet(true);
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "study",
          text: `${input}\n\nCreate a fresh quiz testlet. Do not repeat the same wording or same answer order from earlier questions.`,
          tone,
          refinement,
          anonymousId: anonId,
          studyMode: "quiz",
          educationLevel,
          studyPlan: {
            subject: studySubject,
            examDate,
            hoursPerDay,
            prepLevel,
          },
          quizQuestionCount: questionCount,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.requiresAuth) {
          setShowLogin(true);
        } else if (data?.requiresUpgrade) {
          setShowUpgrade(true);
        }
        setTestletError(data?.error ?? "Could not create another testlet.");
        if (typeof data?.used === "number") setUsageFromServer(data.used);
        return;
      }

      setExtraTestlets((prev) => [...prev, data.output]);
      if (typeof data.used === "number") {
        setUsageFromServer(data.used);
      } else if (!user) {
        incrementAnon();
      }
    } catch {
      setTestletError("Network error. Please try again.");
    } finally {
      setCreatingTestlet(false);
    }
  }

  function handleCopy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rewrito-${tool}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClear() {
    setInput("");
    resetResult();
  }

  function handleSample() {
    setInput(SAMPLES[tool]);
    resetResult();
  }

  async function handleStudyFileUpload(file: File | null) {
    if (!file) return;
    setError(null);
    resetResult();

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isText =
      file.type.startsWith("text/") ||
      [".txt", ".md", ".csv"].some((ext) => file.name.toLowerCase().endsWith(ext));

    try {
      if (isPdf) {
        setUploadingPdf(true);
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/extract-pdf", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data?.error ?? "Could not read this PDF.");
          return;
        }
        setInput(data.text);
        return;
      }

      if (isText) {
        const text = await file.text();
        setInput(text.trim());
        return;
      }

      setError("Upload a PDF or text file.");
    } catch {
      setError("Could not read this file. Please try again.");
    } finally {
      setUploadingPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const toolMeta = TOOLS[tool];
  const ToolIcon =
    tool === "humanizer"
      ? SparkleIcon
      : tool === "detector" || tool === "plagiarism"
      ? ShieldCheckIcon
      : tool === "linkedin"
      ? LinkedinIcon
      : tool === "email"
      ? MailIcon
      : StudyIcon;

  return (
    <div className="card overflow-visible">
      <div className="flex flex-col gap-3 border-b border-line bg-bg-soft p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand shadow-soft">
            <ToolIcon size={20} />
          </span>
          <div>
            <h3 className="text-base font-semibold text-ink">{toolMeta.name}</h3>
            <p className="text-xs text-ink-muted">{toolMeta.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <span className="chip">
            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
            {usageText}
          </span>
        </div>
      </div>

      {!lockTool && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-line px-5 py-3 sm:px-6">
          {(Object.keys(TOOLS) as ToolType[]).map((key) => {
            const meta = TOOLS[key];
            const active = tool === key;
            return (
              <button
                key={key}
                onClick={() => handleToolChange(key)}
                className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-brand bg-brand-softPurple text-brand"
                    : "border-line bg-white text-ink-muted hover:text-ink"
                }`}
              >
                {meta.name}
              </button>
            );
          })}
        </div>
      )}

      <div className={`grid gap-0 ${useWideOutput ? "" : "md:grid-cols-2"}`}>
        <div
          className={`border-b border-line p-5 md:p-6 ${
            useWideOutput ? "" : "md:border-b-0 md:border-r"
          }`}
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="rw-input" className="field-label !mb-0">
              {isStudy ? "Study material" : "Your text"}
            </label>
            <div className="flex items-center gap-2">
              {isStudy && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.md,.csv,application/pdf,text/*"
                    className="sr-only"
                    onChange={(e) => handleStudyFileUpload(e.target.files?.[0] ?? null)}
                  />
                  <button
                    type="button"
                    disabled={uploadingPdf}
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload PDF or text file"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink-muted transition-colors hover:border-ink-subtle hover:text-ink disabled:opacity-60"
                  >
                    {uploadingPdf ? (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-ink-subtle/30 border-t-brand" />
                    ) : (
                      <UploadIcon size={13} />
                    )}
                    {uploadingPdf ? "Reading PDF" : "Upload PDF"}
                  </button>
                </>
              )}
              <button
                onClick={handleSample}
                className="text-xs font-medium text-brand hover:underline"
              >
                Try a sample
              </button>
            </div>
          </div>

          <textarea
            id="rw-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholderFor(tool)}
            rows={isStudy ? 13 : 11}
            className="input-base resize-y leading-relaxed"
          />

          {(tool === "humanizer" || tool === "detector" || tool === "plagiarism") && input.trim() && (
            <AiSignalTextBox
              text={input}
              mode="risk"
              title={tool === "plagiarism" ? "Originality-risk text" : "AI-sounding text"}
              description={
                tool === "plagiarism"
                  ? "Amber underlines mark phrases that may need original wording, specificity, or citation."
                  : "Amber underlines mark phrases to humanize first."
              }
            />
          )}

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-subtle">
            <span>
              {wordCount} word{wordCount === 1 ? "" : "s"} - {charCount} characters
            </span>
            {input && (
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink"
              >
                <TrashIcon size={14} />
                Clear
              </button>
            )}
          </div>

          <div
            className={`mt-3 rounded-xl border px-3.5 py-3 ${
              wordLimitExceeded
                ? "border-error/30 bg-error/5"
                : "border-line bg-white"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-ink">Word limit</span>
              <span className={wordLimitExceeded ? "font-semibold text-error" : "text-ink-muted"}>
                {wordCount}/{wordLimitLabel} words
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-section">
              <div
                className={`h-full rounded-full ${
                  wordLimitExceeded ? "bg-error" : "bg-brand-gradient"
                }`}
                style={{ width: `${wordUsagePercent}%` }}
              />
            </div>
            {wordLimitExceeded && (
              <p className="mt-2 text-xs leading-relaxed text-error">
                {!user
                  ? "Log in to continue with longer drafts and save your sessions."
                  : isPaidUser
                  ? "Shorten this draft slightly, then try again."
                  : "Premium unlocks longer drafts for heavier writing sessions."}
              </p>
            )}
          </div>

          {isStudy ? (
            <StudyControls
              studyMode={studyMode}
              setStudyMode={(mode) => {
                setStudyMode(mode);
                resetResult();
              }}
              tone={tone}
              setTone={setTone}
              educationLevel={educationLevel}
              setEducationLevel={setEducationLevel}
              subject={studySubject}
              setSubject={setStudySubject}
              examDate={examDate}
              setExamDate={setExamDate}
              hoursPerDay={hoursPerDay}
              setHoursPerDay={setHoursPerDay}
              prepLevel={prepLevel}
              setPrepLevel={setPrepLevel}
            />
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">Tone</label>
                <Listbox<Tone>
                  value={tone}
                  onChange={setTone}
                  options={TONES.map((t) => ({
                    value: t.value,
                    label: t.label,
                    hint: t.hint,
                  }))}
                  ariaLabel="Tone"
                />
              </div>
              <div>
                <label className="field-label">Refinement</label>
                <SegmentedControl<Refinement>
                  value={refinement}
                  onChange={setRefinement}
                  options={REFINEMENTS.map((r) => ({
                    value: r.value,
                    label: r.label,
                    hint: r.hint,
                  }))}
                  ariaLabel="Refinement level"
                />
              </div>
            </div>
          )}

          {!user && !isStudy && (
            <div className="mt-4 rounded-xl border border-line bg-bg-soft p-4 text-sm leading-relaxed text-ink-muted">
              <span className="font-semibold text-ink">Build human intelligence with AI intelligence.</span>{" "}
              Log in to unlock longer drafts, all tone controls, saved history, and more personalized coaching.
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary mt-5 w-full"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                {isStudy ? "Building study output..." : "Rewriting..."}
              </>
            ) : (
              <>
                <WandIcon size={16} />
                {isStudy ? studyActionLabel : primaryActionLabel}
              </>
            )}
          </button>
          <p className="mt-3 text-center text-xs leading-relaxed text-ink-subtle">
            By using rewrito, you agree to our{" "}
            <Link href="/terms" className="font-medium text-brand hover:underline">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-brand hover:underline">
              Privacy Policy
            </Link>.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-3 rounded-xl border border-error/30 bg-error/5 px-3.5 py-2.5 text-sm text-error"
            >
              {error}
            </div>
          )}
        </div>

        <div className="bg-bg-soft p-5 md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <label className="field-label !mb-0">
              {isStudy
                ? studyMode === "quiz"
                  ? "Quiz testlet"
                  : studyMode === "flashcards"
                  ? "Flashcards"
                  : "Study guide"
                : tool === "plagiarism"
                ? "Originality report"
                : tool === "detector"
                ? "Humanized output"
                : "Rewritten"}
            </label>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                disabled={!output}
                className="btn-ghost !px-2.5 !py-1.5 text-xs disabled:opacity-50"
                title="Copy output"
              >
                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                disabled={!output}
                className="btn-ghost !px-2.5 !py-1.5 text-xs disabled:opacity-50"
                title="Download as .txt"
              >
                <DownloadIcon size={14} />
                Download
              </button>
            </div>
          </div>

          <div
            aria-live="polite"
            className={`min-h-[280px] rounded-xl border border-line bg-white p-4 text-sm leading-relaxed text-ink ${
              isStudy ? "" : "whitespace-pre-wrap"
            }`}
          >
            {loading ? (
              <SkeletonLines />
            ) : output ? (
              isStudy ? (
                <StudyOutput
                  output={output}
                  studyMode={studyMode}
                  extraTestlets={extraTestlets}
                  isPaidUser={isPaidUser}
                  creatingTestlet={creatingTestlet}
                  testletError={testletError}
                  onCreateTestlet={handleCreateTestlet}
                />
              ) : (
                tool === "humanizer" || tool === "detector" ? (
                  <AiSignalTextBox
                    text={output}
                    compareText={input}
                    mode="changed"
                    title="Humanized changes"
                    description="Green underlines mark wording rewrito changed to make the draft sound more human."
                  />
                ) : tool === "plagiarism" ? (
                  <FormattedText text={output} />
                ) : (
                  <FormattedText text={output} />
                )
              )
            ) : (
              <span className="text-ink-subtle">
                {isStudy
                  ? studyMode === "quiz"
                    ? "Your interactive quiz testlet will appear here."
                    : studyMode === "flashcards"
                    ? "Your flip-ready flashcards will appear here."
                  : "Your structured study guide will appear here."
                  : tool === "plagiarism"
                  ? "Your originality score, underlined-risk review, and revised draft will appear here."
                  : "Your refined version will appear here."}
              </span>
            )}
          </div>

          <div className="mt-2 text-xs text-ink-subtle">
            {output && (
              <>
                {outputWords} word{outputWords === 1 ? "" : "s"} - {output.length} characters
              </>
            )}
          </div>
          {output && !user && (
            <div className="mt-4 rounded-xl border border-line bg-white p-4 shadow-soft">
              <p className="text-sm font-semibold text-ink">Save this session for later</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                Log in to keep history, reopen useful outputs, and get coaching that learns from your drafts.
              </p>
              <button
                type="button"
                onClick={() => setShowLogin(true)}
                className="btn-secondary mt-3 w-full"
              >
                Log in to save
              </button>
            </div>
          )}
        </div>
      </div>

      {scores && tool !== "study" && (
        <div className="space-y-4 border-t border-line bg-bg-soft p-5 sm:p-6 animate-fade-up">
          <ScoreCard scores={scores} variant={tool === "plagiarism" ? "plagiarism" : tool === "detector" ? "detector" : "ai"} />
          {(tool === "humanizer" || tool === "detector") && (
            <AiSignalInsights original={input} rewritten={output} />
          )}
          {tool === "plagiarism" && (
            <AiSignalTextBox
              text={input}
              mode="risk"
              title="Underlined originality risks"
              description="Amber underlines show phrases that may need more original wording, more specificity, or a citation check."
            />
          )}
          <WritingCoachCard original={input} rewritten={output} />
        </div>
      )}

      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        headline="Log in to continue working"
        subline="Log in to keep rewriting."
      />
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}

function placeholderFor(tool: ToolType): string {
  switch (tool) {
    case "email":
      return "Paste a rough email draft...";
    case "linkedin":
      return "Paste rough notes for your LinkedIn post...";
    case "detector":
      return "Paste text you want to check for detector-style AI confidence...";
    case "plagiarism":
      return "Paste a paragraph, essay section, report, or draft you want checked for originality risk and citation needs...";
    case "study":
      return "Paste a textbook paragraph, assignment question, accounting problem, lecture notes, exam question, or confusing concept...";
    case "humanizer":
      return "Paste the AI-generated text you want to humanize...";
  }
}

function cleanStudyMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\s+\n/g, "\n")
    .trim();
}

function StudyControls({
  studyMode,
  setStudyMode,
  tone,
  setTone,
  educationLevel,
  setEducationLevel,
  subject,
  setSubject,
  examDate,
  setExamDate,
  hoursPerDay,
  setHoursPerDay,
  prepLevel,
  setPrepLevel,
}: {
  studyMode: StudyMode;
  setStudyMode: (mode: StudyMode) => void;
  tone: Tone;
  setTone: (tone: Tone) => void;
  educationLevel: EducationLevel;
  setEducationLevel: (level: EducationLevel) => void;
  subject: string;
  setSubject: (value: string) => void;
  examDate: string;
  setExamDate: (value: string) => void;
  hoursPerDay: string;
  setHoursPerDay: (value: string) => void;
  prepLevel: string;
  setPrepLevel: (value: string) => void;
}) {
  const learningModes = STUDY_MODES.filter(
    (mode) => mode.value !== "quiz" && mode.value !== "flashcards"
  );
  const practiceModes = STUDY_MODES.filter(
    (mode) => mode.value === "quiz" || mode.value === "flashcards"
  );
  const modeButton = (mode: (typeof STUDY_MODES)[number], featured = false) => {
    const active = studyMode === mode.value;
    const outputType: Record<StudyMode, string> = {
      explain: "Tutor",
      steps: "Table",
      quiz: "Testlet",
      flashcards: "Deck",
      notes: "Notes",
      studyplan: "Plan",
    };
    const className = `group relative min-h-[92px] rounded-xl border p-3.5 text-left transition-all ${
          active
            ? "border-brand bg-white text-ink shadow-card ring-2 ring-brand/10"
            : featured
            ? "border-brand-softPurple bg-white text-ink hover:border-brand/60 hover:shadow-soft"
            : "border-line bg-white text-ink hover:border-brand/40 hover:shadow-soft"
        }`;
    const content = (
      <>
        <span
          className={`mb-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            active
              ? "bg-brand-softPurple text-brand"
              : featured
              ? "bg-brand-softPurple/70 text-brand"
              : "bg-bg-section text-ink-muted"
          }`}
        >
          {outputType[mode.value]}
        </span>
        <span className="flex items-start justify-between gap-3">
          <span>
            <span className="block text-sm font-semibold leading-snug">{mode.label}</span>
            <span className="mt-1.5 block text-xs leading-relaxed text-ink-muted">
              {mode.hint}
            </span>
          </span>
          <span
            aria-hidden
            className={`mt-0.5 h-2.5 w-2.5 rounded-full transition-colors ${
              active ? "bg-brand" : "bg-line group-hover:bg-brand/50"
            }`}
          />
        </span>
        {featured && (
          <span className="mt-3 inline-flex rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
            Interactive
          </span>
        )}
        {active && (
          <span className="pointer-events-none absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand-gradient" />
        )}
      </>
    );

    if (featured) {
      return (
        <Link
          key={mode.value}
          href={mode.value === "quiz" ? "/study-assistant/quiz" : "/study-assistant/flashcards"}
          className={className}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={mode.value}
        type="button"
        onClick={() => setStudyMode(mode.value)}
        className={className}
      >
        {content}
      </button>
    );
  };

  return (
    <div className="mt-5 space-y-5">
      <div className="rounded-2xl border border-line bg-white p-4 shadow-soft">
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <label className="field-label !mb-1">Study workspace</label>
            <h4 className="text-base font-semibold text-ink">Choose the output you want</h4>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">
              Learning modes explain and organize. Practice modes create interactive study formats.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-bg-section px-3 py-1 text-xs font-semibold text-ink-muted">
            {STUDY_MODES.find((mode) => mode.value === studyMode)?.label}
          </span>
        </div>

        <div className="grid gap-4">
          <div className="rounded-xl border border-line bg-bg-soft/70 p-3">
            <div className="mb-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Learn and organize
              </div>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                Best for concepts, notes, worked examples, and revision structure.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {learningModes.map((mode) => modeButton(mode))}
            </div>
          </div>

          <div className="rounded-xl border border-brand-softPurple bg-gradient-to-br from-white via-brand-softPurple/35 to-brand-softBlue/40 p-3">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-brand">
                  Practice tools
                </div>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                  Use these when you want active recall instead of a written explanation.
                </p>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-brand shadow-soft">
                Active recall
              </span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {practiceModes.map((mode) => modeButton(mode, true))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label">Tone</label>
          <Listbox<Tone>
            value={tone}
            onChange={setTone}
            options={TONES.map((t) => ({
              value: t.value,
              label: t.label,
              hint: t.hint,
            }))}
            ariaLabel="Tone"
          />
        </div>
        <div>
          <label className="field-label">Education level</label>
          <Listbox<EducationLevel>
            value={educationLevel}
            onChange={setEducationLevel}
            options={EDUCATION_LEVELS.map((level) => ({
              value: level.value,
              label: level.label,
              hint: level.hint,
            }))}
            ariaLabel="Education level"
          />
        </div>
      </div>

      {studyMode === "studyplan" && (
        <div className="rounded-xl border border-line bg-white p-4">
          <div className="mb-3">
            <div className="text-sm font-semibold text-ink">Study plan details</div>
            <p className="mt-1 text-xs text-ink-muted">
              Optional, but these make the schedule more useful.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">Subject</span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Accounting, economics, law..."
                className="input-base"
              />
            </label>
            <label className="block">
              <span className="field-label">Exam date</span>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="input-base"
              />
            </label>
            <label className="block">
              <span className="field-label">Hours per day</span>
              <input
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                placeholder="2 hours"
                className="input-base"
              />
            </label>
            <label className="block">
              <span className="field-label">Current level</span>
              <input
                value={prepLevel}
                onChange={(e) => setPrepLevel(e.target.value)}
                placeholder="Beginner, halfway, revision..."
                className="input-base"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

const STUDY_SECTION_TITLES = [
  "Simple Explanation",
  "Key Concept",
  "Step-by-Step Breakdown",
  "Example",
  "Common Mistake",
  "Practice Question",
] as const;

function parseStudySections(output: string) {
  const normalized = cleanStudyMarkdown(output);
  const sections: { title: string; content: string }[] = [];
  let current: { title: string; content: string } | null = null;
  const knownHeading = /^(?:\d+\.\s*)?(Simple Explanation|Key Concept|Step-by-Step Breakdown|Example|Common Mistake|Practice Question)\s*:?\s*$/i;

  for (const line of normalized.split(/\r?\n/)) {
    const trimmed = line.trim();
    const markdownHeading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    const knownMatch = cleanStudyMarkdown(trimmed).match(knownHeading);

    if (markdownHeading || knownMatch) {
      if (current) sections.push(current);
      current = {
        title: cleanStudyLine(markdownHeading ? markdownHeading[2] : knownMatch?.[1] ?? "Output"),
        content: "",
      };
      continue;
    }

    if (!current) current = { title: "Output", content: "" };
    current.content += `${line}\n`;
  }

  if (current) sections.push(current);

  const cleaned = sections
    .map((section) => ({
      ...section,
      content: cleanStudyMarkdown(section.content),
    }))
    .filter((section) => section.title || section.content);

  return cleaned.length
    ? cleaned
    : [{ title: "Output", content: cleanStudyMarkdown(output) }];
}

type RichBlock =
  | { type: "heading"; text: string; level: number }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

function parseTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cleanStudyMarkdown(cell.trim()));
}

function isTableSeparator(line: string) {
  return /^\s*\|?[\s:-]+\|[\s|:-]*$/.test(line);
}

function parseRichBlocks(text: string): RichBlock[] {
  const lines = cleanStudyMarkdown(text).split(/\r?\n/);
  const blocks: RichBlock[] = [];
  let paragraph: string[] = [];

  function flushParagraph() {
    const value = paragraph.join(" ").trim();
    if (value) blocks.push({ type: "paragraph", text: value });
    paragraph = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: cleanStudyLine(headingMatch[2]),
      });
      continue;
    }

    if (line.includes("|") && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      flushParagraph();
      const headers = parseTableRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) {
        rows.push(parseTableRow(lines[i]));
        i++;
      }
      i--;
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    const bulletItems: string[] = [];
    const orderedItems: string[] = [];
    while (i < lines.length) {
      const candidate = cleanStudyMarkdown(lines[i].trim());
      const bullet = candidate.match(/^[-*]\s+(.+)$/);
      const ordered = candidate.match(/^\d+[.)]\s+(.+)$/);
      if (bullet) {
        bulletItems.push(bullet[1]);
        i++;
        continue;
      }
      if (ordered) {
        orderedItems.push(ordered[1]);
        i++;
        continue;
      }
      break;
    }
    if (bulletItems.length || orderedItems.length) {
      flushParagraph();
      blocks.push({
        type: "list",
        ordered: orderedItems.length > 0,
        items: orderedItems.length ? orderedItems : bulletItems,
      });
      i--;
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  return blocks;
}

function FormattedText({ text }: { text: string }) {
  const blocks = parseRichBlocks(text);
  if (!blocks.length) return null;

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h4
              key={index}
              className={`font-semibold text-ink ${
                block.level <= 2 ? "text-base" : "text-sm"
              }`}
            >
              {block.text}
            </h4>
          );
        }

        if (block.type === "list") {
          const Tag = block.ordered ? "ol" : "ul";
          return (
            <Tag
              key={index}
              className={`space-y-1 pl-5 text-sm leading-relaxed text-ink ${
                block.ordered ? "list-decimal" : "list-disc"
              }`}
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </Tag>
          );
        }

        if (block.type === "table") {
          return (
            <div key={index} className="overflow-x-auto rounded-xl border border-line bg-white">
              <table className="min-w-full divide-y divide-line text-left text-xs">
                <thead className="bg-bg-section text-ink">
                  <tr>
                    {block.headers.map((header, headerIndex) => (
                      <th key={headerIndex} className="px-3 py-2 font-semibold">
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
        }

        return (
          <p key={index} className="text-sm leading-relaxed text-ink">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}

function StudyPlanOutput({ output }: { output: string }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-brand-softPurple bg-brand-softPurple/40 p-4">
        <h4 className="text-sm font-semibold text-brand">Study plan chart</h4>
        <p className="mt-1 text-xs leading-relaxed text-ink-muted">
          Follow the schedule below as a working plan and adjust daily blocks when your available time changes.
        </p>
      </div>
      <StudySectionList sections={parseStudySections(output)} defaultOpenCount={4} />
    </div>
  );
}

function StudyOutput({
  output,
  studyMode,
  extraTestlets,
  isPaidUser,
  creatingTestlet,
  testletError,
  onCreateTestlet,
}: {
  output: string;
  studyMode: StudyMode;
  extraTestlets: string[];
  isPaidUser: boolean;
  creatingTestlet: boolean;
  testletError: string | null;
  onCreateTestlet: (questionCount: QuizQuestionCount) => void;
}) {
  const sections = parseStudySections(output);
  const quizContent =
    sections.find((section) => section.title.toLowerCase().includes("quiz"))?.content || output;
  const flashcardContent =
    sections.find((section) => section.title.toLowerCase().includes("flashcard"))?.content || output;
  const supportingSections = sections.filter(
    (section) =>
      !section.title.toLowerCase().includes("practice") &&
      !section.title.toLowerCase().includes("quiz") &&
      !section.title.toLowerCase().includes("flashcard")
  );
  const quizTestlets = [quizContent, ...extraTestlets];
  const [activeTestletIndex, setActiveTestletIndex] = useState(0);

  useEffect(() => {
    setActiveTestletIndex(Math.max(0, quizTestlets.length - 1));
  }, [output, quizTestlets.length]);

  if (studyMode === "quiz") {
    const activeIndex = Math.min(activeTestletIndex, quizTestlets.length - 1);
    const activeTestlet = quizTestlets[activeIndex] ?? "";
    return (
      <div className="space-y-4">
        {supportingSections.length > 0 && (
          <StudySectionList sections={supportingSections} defaultOpenCount={1} />
        )}
        <TestletBuilder
          isPaidUser={isPaidUser}
          createdCount={extraTestlets.length}
          creating={creatingTestlet}
          error={testletError}
          onCreate={onCreateTestlet}
        />
        <TestletSwitcher
          count={quizTestlets.length}
          activeIndex={activeIndex}
          onChange={setActiveTestletIndex}
        />
        <QuizTestlet
          key={`${activeIndex}-${activeTestlet}`}
          title={`Testlet ${activeIndex + 1}`}
          questions={parseQuizQuestions(activeTestlet)}
          fallback={activeTestlet}
        />
      </div>
    );
  }

  if (studyMode === "flashcards") {
    const cards = parseFlashcards(flashcardContent);
    return (
      <div className="space-y-4">
        {supportingSections.length > 0 && (
          <StudySectionList sections={supportingSections} defaultOpenCount={1} />
        )}
        <FlashcardDeck key={output} cards={cards} fallback={flashcardContent} />
      </div>
    );
  }

  if (studyMode === "studyplan") {
    return <StudyPlanOutput output={output} />;
  }

  return <StudySectionList sections={sections} defaultOpenCount={3} />;
}

function TestletSwitcher({
  count,
  activeIndex,
  onChange,
}: {
  count: number;
  activeIndex: number;
  onChange: (index: number) => void;
}) {
  if (count <= 1) return null;

  return (
    <div className="rounded-xl border border-line bg-white p-3">
      <label className="field-label !mb-2" htmlFor="testlet-select">
        Testlet menu
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <select
          id="testlet-select"
          value={activeIndex}
          onChange={(e) => onChange(Number(e.target.value))}
          className="input-base sm:max-w-xs"
        >
          {Array.from({ length: count }, (_, index) => (
            <option key={index} value={index}>
              Testlet {index + 1}
              {index === count - 1 ? " - latest" : ""}
            </option>
          ))}
        </select>
        <p className="text-xs leading-relaxed text-ink-muted">
          Previous testlets stay tucked away here. The selected practice set opens full width.
        </p>
      </div>
    </div>
  );
}

function StudySectionList({
  sections,
  defaultOpenCount,
}: {
  sections: { title: string; content: string }[];
  defaultOpenCount: number;
}) {
  const accents = [
    "bg-brand-softPurple text-brand",
    "bg-brand-softBlue text-brand-accent",
    "bg-bg-section text-ink",
    "bg-success/10 text-success",
    "bg-warning/10 text-warning",
    "bg-brand-softPurple text-brand",
  ];

  return (
    <div className="space-y-3">
      {sections.map((section, index) => (
        <details
          key={section.title}
          open={index < defaultOpenCount}
          className="group overflow-hidden rounded-xl border border-line bg-white"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3">
            <span className="flex items-center gap-2">
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold ${
                  accents[index % accents.length]
                }`}
              >
                {index + 1}
              </span>
              <span className="text-sm font-semibold text-ink">{section.title}</span>
            </span>
            <span className="text-lg leading-none text-ink-subtle transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="border-t border-line bg-bg-soft/40 px-4 py-3">
            {section.content ? (
              <FormattedText text={section.content} />
            ) : (
              <p className="text-sm leading-relaxed text-ink-muted">
                No content returned for this section.
              </p>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

type QuizQuestion = {
  prompt: string;
  options: { key: string; text: string }[];
  answerKey: string;
  explanation: string;
};

function cleanStudyLine(line: string): string {
  return cleanStudyMarkdown(line)
    .replace(/^#+\s*/, "")
    .replace(/^[-*]\s+/, "")
    .trim();
}

function parseQuizQuestions(text: string): QuizQuestion[] {
  const lines = text.split(/\r?\n/).map(cleanStudyLine).filter(Boolean);
  const questions: QuizQuestion[] = [];
  const answerKeyLines: string[] = [];
  let current: QuizQuestion | null = null;
  let inAnswerKey = false;

  function pushCurrent() {
    if (current?.prompt && current.options.length >= 2) {
      questions.push(current);
    }
    current = null;
  }

  for (const line of lines) {
    if (/^answer\s*key\b/i.test(line)) {
      inAnswerKey = true;
      pushCurrent();
      continue;
    }

    if (inAnswerKey) {
      answerKeyLines.push(line);
      continue;
    }

    const questionMatch = line.match(/^(?:Q(?:uestion)?\s*)?(\d+)[.)]\s+(.+)$/i);
    const optionMatch = line.match(/^([A-D])[\).:-]\s+(.+)$/i);
    const topicMatch = line.match(/^(?:topic|area|concept)\s*[:\-]\s*(.+)$/i);
    const answerMatch = line.match(/^(?:correct\s*)?answer\s*[:\-]\s*([A-D])(?:[\).:\s-]*(.*))?$/i);
    const explanationMatch = line.match(/^explanation\s*[:\-]\s*(.+)$/i);

    if (questionMatch && !/^(answer|explanation|topic|area|concept)\b/i.test(questionMatch[2])) {
      pushCurrent();
      current = {
        prompt: questionMatch[2].trim(),
        options: [],
        answerKey: "",
        explanation: "",
      };
      continue;
    }

    if (current && topicMatch) {
      continue;
    }

    if (current && optionMatch) {
      current.options.push({
        key: optionMatch[1].toUpperCase(),
        text: optionMatch[2].trim(),
      });
      continue;
    }

    if (current && answerMatch) {
      current.answerKey = answerMatch[1].toUpperCase();
      if (answerMatch[2]) current.explanation = answerMatch[2].trim();
      continue;
    }

    if (current && explanationMatch) {
      current.explanation = explanationMatch[1].trim();
      continue;
    }

    if (current && current.options.length === 0) {
      current.prompt = `${current.prompt} ${line}`.trim();
    } else if (current && current.answerKey && !current.explanation) {
      current.explanation = line;
    }
  }

  pushCurrent();

  for (const line of answerKeyLines) {
    const keyMatch = line.match(/^(\d+)[.)]\s*([A-D])(?:[\).:\s-]*(.*))?$/i);
    if (!keyMatch) continue;
    const index = Number(keyMatch[1]) - 1;
    const question = questions[index];
    if (!question) continue;
    question.answerKey = keyMatch[2].toUpperCase();
    if (keyMatch[3] && !question.explanation) question.explanation = keyMatch[3].trim();
  }

  return questions.filter((question) => question.answerKey);
}

function TestletBuilder({
  isPaidUser,
  createdCount,
  creating,
  error,
  onCreate,
}: {
  isPaidUser: boolean;
  createdCount: number;
  creating: boolean;
  error: string | null;
  onCreate: (questionCount: QuizQuestionCount) => void;
}) {
  const freeExtraAvailable = !isPaidUser && createdCount === 0;
  const questionCount: QuizQuestionCount = isPaidUser ? 20 : 5;
  const canCreate = isPaidUser || freeExtraAvailable;

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-white">
      <div className="border-b border-line bg-bg-soft px-4 py-3">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h4 className="text-sm font-semibold text-ink">Testlet builder</h4>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">
              Generate a fresh practice set from the same study material with new wording and answer order.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-brand-softPurple px-3 py-1 text-xs font-semibold text-brand">
            {isPaidUser ? "Pro mastery" : "Practice booster"}
          </span>
        </div>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-line bg-bg-soft p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Next set
            </div>
            <div className="mt-1 text-sm font-semibold text-ink">
              {questionCount} questions
            </div>
          </div>
          <div className="rounded-xl border border-line bg-bg-soft p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Style
            </div>
            <div className="mt-1 text-sm font-semibold text-ink">MCQ testlet</div>
          </div>
        </div>
        <button
          type="button"
          disabled={!canCreate || creating}
          onClick={() => onCreate(questionCount)}
          className="btn-primary w-full sm:w-auto"
        >
          {creating
            ? "Creating..."
            : isPaidUser
            ? "Create mastery testlet"
            : freeExtraAvailable
            ? "Create another testlet"
            : "Extra testlet used"}
        </button>
      </div>
      {!isPaidUser && !freeExtraAvailable && (
        <p className="border-t border-line px-4 py-3 text-xs text-ink-muted">
          Upgrade to create multiple mastery testlets with 20 questions each.
        </p>
      )}
      {error && (
        <div className="border-t border-error/20 bg-error/5 px-4 py-3 text-xs text-error">
          {error}
        </div>
      )}
    </div>
  );
}

function QuizTestlet({
  title,
  questions,
  fallback,
}: {
  title: string;
  questions: QuizQuestion[];
  fallback: string;
}) {
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const answeredCount = Object.keys(selected).length;
  const score = questions.reduce(
    (sum, question, index) => sum + (selected[index] === question.answerKey ? 1 : 0),
    0
  );

  if (!questions.length) {
    return (
      <StudySectionList
        sections={[{ title: "Practice Question", content: fallback }]}
        defaultOpenCount={1}
      />
    );
  }

  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h4 className="text-sm font-semibold text-ink">{title}</h4>
          <p className="mt-1 text-xs text-ink-muted">
            Select one answer for each question, then check your score.
          </p>
        </div>
        {submitted && (
          <span className="inline-flex w-fit rounded-full bg-brand-softPurple px-3 py-1 text-xs font-semibold text-brand">
            Score: {score}/{questions.length}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={`${question.prompt}-${index}`} className="rounded-xl border border-line bg-bg-soft p-4">
            <p className="text-sm font-semibold leading-relaxed text-ink">
              {index + 1}. {question.prompt}
            </p>
            <div className="mt-3 grid gap-2">
              {question.options.map((option) => {
                const chosen = selected[index] === option.key;
                const correct = submitted && option.key === question.answerKey;
                const wrong = submitted && chosen && option.key !== question.answerKey;
                return (
                  <button
                    key={option.key}
                    type="button"
                    disabled={submitted}
                    onClick={() => setSelected((prev) => ({ ...prev, [index]: option.key }))}
                    className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
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
                {question.explanation || "Review the key concept above to see why this option fits best."}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          disabled={submitted || answeredCount < questions.length}
          onClick={() => setSubmitted(true)}
          className="btn-primary w-full sm:w-auto"
        >
          {submitted ? "Answers shown" : "Show answers"}
        </button>
        <button
          type="button"
          onClick={() => {
            setSelected({});
            setSubmitted(false);
          }}
          className="btn-secondary w-full sm:w-auto"
        >
          Reset quiz
        </button>
      </div>
    </div>
  );
}

type Flashcard = {
  question: string;
  answer: string;
};

function parseFlashcards(text: string): Flashcard[] {
  const lines = text.split(/\r?\n/).map(cleanStudyLine);
  const cards: Flashcard[] = [];
  let current: Flashcard | null = null;
  let side: "question" | "answer" | null = null;

  function pushCurrent() {
    if (current?.question && current.answer) cards.push(current);
    current = null;
    side = null;
  }

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    const questionMatch = line.match(/^(?:\d+[.)]\s*)?Q(?:uestion)?\s*\d*\s*[:\-]\s*(.+)$/i);
    const answerMatch = line.match(/^(?:\d+[.)]\s*)?A(?:nswer)?\s*\d*\s*[:\-]\s*(.+)$/i);

    if (questionMatch) {
      pushCurrent();
      current = { question: questionMatch[1].trim(), answer: "" };
      side = "question";
      continue;
    }

    if (answerMatch) {
      if (!current) current = { question: "", answer: "" };
      current.answer = answerMatch[1].trim();
      side = "answer";
      continue;
    }

    if (current && side) {
      current[side] = `${current[side]} ${line}`.trim();
    }
  }

  pushCurrent();
  return cards;
}

function FlashcardDeck({
  cards,
  fallback,
}: {
  cards: Flashcard[];
  fallback: string;
}) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  if (!cards.length) {
    return (
      <StudySectionList
        sections={[{ title: "Practice Question", content: fallback }]}
        defaultOpenCount={1}
      />
    );
  }

  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-ink">Interactive flashcards</h4>
        <p className="mt-1 text-xs text-ink-muted">
          Flip a card to reveal the answer.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card, index) => {
          const isFlipped = flipped[index];
          return (
            <button
              key={`${card.question}-${index}`}
              type="button"
              onClick={() => setFlipped((prev) => ({ ...prev, [index]: !prev[index] }))}
              className="min-h-44 text-left [perspective:1200px]"
            >
              <span
                className={`relative block min-h-44 rounded-xl transition-transform duration-500 [transform-style:preserve-3d] ${
                  isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                <span className="absolute inset-0 rounded-xl border border-line bg-bg-soft p-4 text-ink shadow-soft [backface-visibility:hidden]">
                  <span className="mb-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-muted">
                    Question {index + 1}
                  </span>
                  <span className="block text-sm font-semibold leading-relaxed">
                    {card.question}
                  </span>
                  <span className="mt-4 block text-xs text-ink-subtle">Flip for answer</span>
                </span>
                <span className="absolute inset-0 rounded-xl border border-brand bg-brand-softPurple p-4 text-brand shadow-soft [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span className="mb-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-muted">
                    Answer {index + 1}
                  </span>
                  <span className="block text-sm font-semibold leading-relaxed">
                    {card.answer}
                  </span>
                  <span className="mt-4 block text-xs text-ink-subtle">Flip back</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SkeletonLines() {
  return (
    <div className="space-y-2.5">
      <div className="shimmer h-3 w-[92%] rounded" />
      <div className="shimmer h-3 w-[88%] rounded" />
      <div className="shimmer h-3 w-[95%] rounded" />
      <div className="shimmer h-3 w-[60%] rounded" />
      <div className="shimmer mt-4 h-3 w-[80%] rounded" />
      <div className="shimmer h-3 w-[70%] rounded" />
    </div>
  );
}
