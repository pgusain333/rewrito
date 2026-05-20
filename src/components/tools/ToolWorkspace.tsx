"use client";

import { useMemo, useState } from "react";
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
import { LoginModal } from "@/components/modals/LoginModal";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import { Listbox } from "@/components/ui/Listbox";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ScoreCard } from "@/components/tools/ScoreCard";
import {
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  LinkedinIcon,
  MailIcon,
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

function countWords(s: string): number {
  const trimmed = s.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function ToolWorkspace({ initialTool = "humanizer", lockTool = false }: Props) {
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
  const [error, setError] = useState<string | null>(null);
  const [testletError, setTestletError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const {
    user,
    anonId,
    used,
    limit,
    remaining,
    incrementAnon,
    setUsageFromServer,
  } = useAuthAndUsage();

  const isStudy = tool === "study";
  const isPaidUser = user?.plan === "pro";
  const wordCount = useMemo(() => countWords(input), [input]);
  const charCount = input.length;
  const outputWords = useMemo(() => countWords(output), [output]);
  const usageText = user
    ? remaining > 0
      ? "Signed in"
      : "Limit reached"
    : "Free workspace";

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
    if (!user && used >= limit) {
      setShowLogin(true);
      return;
    }
    if (user && used >= limit) {
      setShowUpgrade(true);
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
    if (!user && used >= limit) {
      setShowLogin(true);
      return;
    }
    if (user && used >= limit) {
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

  const toolMeta = TOOLS[tool];
  const ToolIcon =
    tool === "humanizer"
      ? SparkleIcon
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

      <div className="grid gap-0 md:grid-cols-2">
        <div className="border-b border-line p-5 md:border-b-0 md:border-r md:p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <label htmlFor="rw-input" className="field-label !mb-0">
              {isStudy ? "Study material" : "Your text"}
            </label>
            <div className="flex items-center gap-2">
              {isStudy && (
                <button
                  type="button"
                  disabled
                  title="PDF upload placeholder"
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-ink-subtle"
                >
                  <UploadIcon size={13} />
                  Upload PDF
                </button>
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

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary mt-5 w-full"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                {isStudy ? "Building study guide..." : "Rewriting..."}
              </>
            ) : (
              <>
                <WandIcon size={16} />
                {isStudy ? "Create study guide" : "Rewrite with rewrito"}
              </>
            )}
          </button>

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
              {isStudy ? "Study guide" : "Rewritten"}
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
                output
              )
            ) : (
              <span className="text-ink-subtle">
                {isStudy
                  ? "Your structured study guide will appear here."
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
        </div>
      </div>

      {scores && tool !== "study" && (
        <div className="border-t border-line bg-bg-soft p-5 sm:p-6 animate-fade-up">
          <ScoreCard scores={scores} />
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
    case "study":
      return "Paste a textbook paragraph, assignment question, accounting problem, lecture notes, exam question, or confusing concept...";
    case "humanizer":
      return "Paste the AI-generated text you want to humanize...";
  }
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
  return (
    <div className="mt-5 space-y-5">
      <div>
        <label className="field-label">Study mode</label>
        <div className="grid gap-2 sm:grid-cols-2">
          {STUDY_MODES.map((mode) => {
            const active = studyMode === mode.value;
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => setStudyMode(mode.value)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  active
                    ? "border-brand bg-brand-softPurple text-brand shadow-soft"
                    : "border-line bg-white text-ink hover:border-ink-subtle"
                }`}
              >
                <span className="block text-sm font-semibold">{mode.label}</span>
                <span className={`mt-1 block text-[11px] ${active ? "text-brand" : "text-ink-muted"}`}>
                  {mode.hint}
                </span>
              </button>
            );
          })}
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
  const sections = STUDY_SECTION_TITLES.map((title) => ({ title, content: "" }));
  let currentIndex = 0;
  const heading = /^(?:#{1,3}\s*)?(?:\d+\.\s*)?(Simple Explanation|Key Concept|Step-by-Step Breakdown|Example|Common Mistake|Practice Question)\s*:?\s*$/i;

  for (const line of output.split(/\r?\n/)) {
    const match = line.trim().match(heading);
    if (match) {
      const nextIndex = STUDY_SECTION_TITLES.findIndex(
        (title) => title.toLowerCase() === match[1].toLowerCase()
      );
      if (nextIndex >= 0) currentIndex = nextIndex;
      continue;
    }
    sections[currentIndex].content += `${line}\n`;
  }

  const cleaned = sections.map((section) => ({
    ...section,
    content: section.content.trim(),
  }));

  return cleaned.some((section) => section.content)
    ? cleaned
    : [{ title: "Simple Explanation", content: output.trim() }];
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
  const practice = sections.find((section) => section.title === "Practice Question")?.content ?? "";
  const supportingSections = sections.filter((section) => section.title !== "Practice Question");

  if (studyMode === "quiz") {
    const testlets = [practice || output, ...extraTestlets];
    return (
      <div className="space-y-4">
        <StudySectionList sections={supportingSections} defaultOpenCount={2} />
        <TestletBuilder
          isPaidUser={isPaidUser}
          createdCount={extraTestlets.length}
          creating={creatingTestlet}
          error={testletError}
          onCreate={onCreateTestlet}
        />
        {testlets.map((testlet, index) => (
          <QuizTestlet
            key={`${index}-${testlet}`}
            title={`Testlet ${index + 1}`}
            questions={parseQuizQuestions(testlet)}
            fallback={testlet}
          />
        ))}
      </div>
    );
  }

  if (studyMode === "flashcards") {
    const cards = parseFlashcards(practice || output);
    return (
      <div className="space-y-4">
        <StudySectionList sections={supportingSections} defaultOpenCount={2} />
        <FlashcardDeck key={output} cards={cards} fallback={practice || output} />
      </div>
    );
  }

  return <StudySectionList sections={sections} defaultOpenCount={3} />;
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
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {section.content || "No content returned for this section."}
            </div>
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
  return line
    .replace(/\*\*/g, "")
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
    const answerMatch = line.match(/^(?:correct\s*)?answer\s*[:\-]\s*([A-D])(?:[\).:\s-]*(.*))?$/i);
    const explanationMatch = line.match(/^explanation\s*[:\-]\s*(.+)$/i);

    if (questionMatch && !/^(answer|explanation)\b/i.test(questionMatch[2])) {
      pushCurrent();
      current = {
        prompt: questionMatch[2].trim(),
        options: [],
        answerKey: "",
        explanation: "",
      };
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
