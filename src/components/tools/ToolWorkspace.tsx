"use client";

import { useMemo, useState } from "react";
import {
  TOOLS,
  TONES,
  REFINEMENTS,
  type ScorePair,
  type ToolType,
  type Tone,
  type Refinement,
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
  TrashIcon,
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

  const wordCount = useMemo(() => countWords(input), [input]);
  const charCount = input.length;
  const outputWords = useMemo(() => countWords(output), [output]);
  const usageText = user
    ? remaining > 0
      ? "Signed in"
      : "Rewrite limit reached"
    : `${remaining} of ${limit} free trials left`;

  async function handleSubmit() {
    setError(null);
    if (input.trim().length < 5) {
      setError("Add a few more words so we have something to work with.");
      return;
    }
    // Pre-flight client-side limit check.
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
    setOutput("");
    setScores(null);
    setError(null);
  }

  function handleSample() {
    setInput(SAMPLES[tool]);
    setOutput("");
    setScores(null);
    setError(null);
  }

  const toolMeta = TOOLS[tool];
  const ToolIcon =
    tool === "humanizer" ? SparkleIcon : tool === "linkedin" ? LinkedinIcon : MailIcon;

  return (
    <div className="card overflow-visible">
      {/* Header */}
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

      {/* Tool tabs */}
      {!lockTool && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-line px-5 py-3 sm:px-6">
          {(Object.keys(TOOLS) as ToolType[]).map((key) => {
            const m = TOOLS[key];
            const active = tool === key;
            return (
              <button
                key={key}
                onClick={() => setTool(key)}
                className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "border-brand bg-brand-softPurple text-brand"
                    : "border-line bg-white text-ink-muted hover:text-ink"
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid gap-0 md:grid-cols-2">
        {/* INPUT */}
        <div className="border-b border-line p-5 md:border-b-0 md:border-r md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <label htmlFor="rw-input" className="field-label !mb-0">
              Your text
            </label>
            <button
              onClick={handleSample}
              className="text-xs font-medium text-brand hover:underline"
            >
              Try a sample
            </button>
          </div>
          <textarea
            id="rw-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              tool === "email"
                ? "Paste a rough email draft…"
                : tool === "linkedin"
                ? "Paste rough notes for your LinkedIn post…"
                : "Paste the AI-generated text you want to humanize…"
            }
            rows={11}
            className="input-base resize-y leading-relaxed"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-subtle">
            <span>
              {wordCount} word{wordCount === 1 ? "" : "s"} · {charCount} characters
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

          {/* Controls */}
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

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary mt-5 w-full"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Rewriting…
              </>
            ) : (
              <>
                <WandIcon size={16} />
                Rewrite with rewrito
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

        {/* OUTPUT */}
        <div className="bg-bg-soft p-5 md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <label className="field-label !mb-0">Rewritten</label>
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
            className="min-h-[280px] whitespace-pre-wrap rounded-xl border border-line bg-white p-4 text-sm leading-relaxed text-ink"
          >
            {loading ? (
              <SkeletonLines />
            ) : output ? (
              output
            ) : (
              <span className="text-ink-subtle">
                Your refined version will appear here.
              </span>
            )}
          </div>

          <div className="mt-2 text-xs text-ink-subtle">
            {output && (
              <>
                {outputWords} word{outputWords === 1 ? "" : "s"} · {output.length} characters
              </>
            )}
          </div>
        </div>
      </div>

      {/* AI Quality Score */}
      {scores && (
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
