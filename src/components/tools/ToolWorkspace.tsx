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
  const [scores, setScores] = useState<ScorePair | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
  const wordCount = useMemo(() => countWords(input), [input]);
  const charCount = input.length;
  const outputWords = useMemo(() => countWords(output), [output]);
  const usageText = user
    ? remaining > 0
      ? "Signed in"
      : "Rewrite limit reached"
    : `${remaining} of ${limit} free trials left`;

  function resetResult() {
    setOutput("");
    setScores(null);
    setError(null);
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
    setScores(null);
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
                <StudyOutput output={output} />
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
        headline="You've used your 3 free trials"
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

function StudyOutput({ output }: { output: string }) {
  const sections = parseStudySections(output);
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
          open={index < 3}
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
