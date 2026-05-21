"use client";

import { useMemo, useState } from "react";
import type { ScoreBreakdown, ScorePair } from "@/lib/prompts";
import { LoginModal } from "@/components/modals/LoginModal";
import { UpgradeModal } from "@/components/modals/UpgradeModal";
import { ScoreCard } from "@/components/tools/ScoreCard";
import { WritingCoachCard } from "@/components/tools/WritingCoachCard";
import { AiSignalInsights, AiSignalTextBox } from "@/components/tools/AiSignalInsights";
import { CheckIcon, CopyIcon, ShieldCheckIcon, WandIcon } from "@/components/ui/icons";
import { useAuthAndUsage } from "@/lib/usage/useAuthAndUsage";

type DetectorEstimate = {
  name: string;
  before: number;
  after: number;
  note: string;
};

export function AiDetectorTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [scores, setScores] = useState<ScorePair | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { user, anonId, used, limit, remaining, incrementAnon, setUsageFromServer } =
    useAuthAndUsage();

  const wordCount = useMemo(() => countWords(input), [input]);
  const displayScores = scores ?? estimatePair(input, output);
  const estimates = detectorEstimates(displayScores);
  const readiness = Math.max(
    0,
    Math.round(100 - estimates.reduce((sum, item) => sum + item.after, 0) / estimates.length)
  );

  async function handleAnalyze() {
    setError(null);
    if (input.trim().length < 20) {
      setError("Paste at least a few sentences for a useful detector score.");
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
          tool: "humanizer",
          text: input,
          tone: "natural",
          refinement: "medium",
          anonymousId: anonId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.requiresAuth) setShowLogin(true);
        if (data?.requiresUpgrade) setShowUpgrade(true);
        setError(data?.error ?? "Could not analyze this text.");
        if (typeof data?.used === "number") setUsageFromServer(data.used);
        return;
      }

      setOutput(data.output ?? "");
      setScores(data.scores ?? estimatePair(input, data.output ?? ""));
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
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-line bg-bg-soft p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-softPurple text-brand">
              <ShieldCheckIcon size={22} />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-ink">AI detection score</h2>
              <p className="text-sm text-ink-muted">
                Check detector-style confidence, humanize the draft, and learn what changed.
              </p>
            </div>
          </div>
          <span className="chip w-fit">{remaining} uses left</span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-line p-5 lg:border-b-0 lg:border-r lg:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <label htmlFor="detector-input" className="field-label !mb-0">
              Text to check
            </label>
            <span className="text-xs text-ink-subtle">
              {wordCount} word{wordCount === 1 ? "" : "s"}
            </span>
          </div>
          <textarea
            id="detector-input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setScores(null);
              setOutput("");
              setError(null);
            }}
            placeholder="Paste AI-generated text, a draft from ChatGPT, or a humanized version you want to check..."
            rows={14}
            className="input-base resize-y leading-relaxed"
          />
          {input.trim() && (
            <AiSignalTextBox
              text={input}
              mode="risk"
              title="AI-sounding text"
              description="Amber underlines show wording that may raise detector-style confidence."
            />
          )}
          <button onClick={handleAnalyze} disabled={loading} className="btn-primary mt-4 w-full">
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Analyzing...
              </>
            ) : (
              <>
                <WandIcon size={16} />
                Analyze and humanize
              </>
            )}
          </button>
          {error && (
            <div className="mt-3 rounded-xl border border-error/30 bg-error/5 px-3.5 py-2.5 text-sm text-error">
              {error}
            </div>
          )}
          <p className="mt-3 text-xs leading-relaxed text-ink-subtle">
            Scores are detector-style estimates for writing review, not official reports from third-party tools.
          </p>
        </div>

        <div className="space-y-4 bg-bg-soft p-5 lg:p-6">
          <DetectorGrid estimates={estimates} readiness={readiness} hasResult={!!scores} />
          {output ? (
            <div className="rounded-xl border border-line bg-white p-4">
              <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-sm font-semibold text-ink">Humanized draft</h3>
                  <p className="text-xs text-ink-muted">
                    Review it, add your own specifics, then check again if needed.
                  </p>
                </div>
                <button onClick={handleCopy} className="btn-ghost !px-3 !py-1.5 text-xs">
                  {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <AiSignalTextBox
                text={output}
                compareText={input}
                mode="changed"
                title="Humanized changes"
                description="Green underlines show wording rewrito changed in the output."
              />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-line bg-white p-5 text-sm leading-relaxed text-ink-muted">
              Your before and after detector-style scores will appear here after analysis.
            </div>
          )}
        </div>
      </div>

      {scores && (
        <div className="space-y-4 border-t border-line bg-bg-soft p-5 sm:p-6">
          <ScoreCard scores={scores} />
          <AiSignalInsights original={input} rewritten={output} />
          <WritingCoachCard original={input} rewritten={output} />
        </div>
      )}

      <LoginModal
        open={showLogin}
        onClose={() => setShowLogin(false)}
        headline="Log in to continue checking"
        subline="Log in to keep analyzing and improving your drafts."
      />
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}

function DetectorGrid({
  estimates,
  readiness,
  hasResult,
}: {
  estimates: DetectorEstimate[];
  readiness: number;
  hasResult: boolean;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-semibold text-ink">Detector-style score panel</h3>
          <p className="mt-1 text-xs text-ink-muted">
            Before and after confidence estimates update when the rewrite is generated.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          Readiness {hasResult ? readiness : 0}%
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {estimates.map((item) => (
          <div key={item.name} className="rounded-xl border border-line bg-bg-soft p-3">
            <p className="text-xs font-semibold text-ink">{item.name}</p>
            <div className="mt-3 space-y-2">
              <DetectorBar label="Before" value={hasResult ? item.before : 0} tone="before" />
              <DetectorBar label="After" value={hasResult ? item.after : 0} tone="after" />
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">{item.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DetectorBar({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "before" | "after";
}) {
  const color = tone === "before" ? "#EF4444" : value <= 30 ? "#10B981" : "#F59E0B";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-ink-muted">{label}</span>
        <span className="font-semibold text-ink">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

function detectorEstimates(scores: ScorePair): DetectorEstimate[] {
  const before = scores.before;
  const after = scores.after;
  return [
    {
      name: "GPTZero-style",
      before: detectorScore(before, 4),
      after: detectorScore(after, -6),
      note: "Sensitive to sentence rhythm, burstiness, and generic AI phrasing.",
    },
    {
      name: "Originality.ai-style",
      before: detectorScore(before, 8),
      after: detectorScore(after, -3),
      note: "Weights naturalness, repetition, and confident but vague wording.",
    },
    {
      name: "Turnitin-style",
      before: detectorScore(before, 2),
      after: detectorScore(after, -7),
      note: "Education-focused estimate for polished academic-looking drafts.",
    },
  ];
}

function detectorScore(score: ScoreBreakdown, offset: number): number {
  const tooPolished = Math.max(0, score.conciseness - 78) * 0.18;
  const naturalnessRelief = Math.max(0, score.naturalness - 72) * 0.2;
  return clamp(Math.round(score.aiGenerated + tooPolished - naturalnessRelief + offset));
}

function estimatePair(original: string, rewritten: string): ScorePair {
  return {
    before: estimateBreakdown(original),
    after: estimateBreakdown(rewritten || original, rewritten ? -22 : 0),
  };
}

function estimateBreakdown(text: string, aiOffset = 0): ScoreBreakdown {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const unique = new Set(words.map((word) => word.toLowerCase().replace(/[^a-z0-9]/g, "")));
  const diversity = words.length ? unique.size / words.length : 0;
  const avgSentence = averageSentenceLength(text);
  const aiPhrases = [
    "in today's world",
    "it is important to note",
    "rapidly evolving",
    "delve into",
    "leverage",
    "unlock",
    "furthermore",
  ].filter((phrase) => text.toLowerCase().includes(phrase)).length;
  const aiGenerated = clamp(
    48 +
      aiPhrases * 10 +
      (avgSentence > 24 ? 12 : 0) +
      (diversity < 0.42 && words.length > 80 ? 12 : 0) +
      aiOffset
  );
  const naturalness = clamp(82 - aiGenerated * 0.45 + diversity * 28);
  const clarity = clamp(58 + Math.min(words.length, 220) * 0.08 - (avgSentence > 30 ? 8 : 0));
  const conciseness = clamp(72 - (avgSentence > 26 ? 8 : 0) - aiPhrases * 2);
  return {
    clarity,
    naturalness,
    conciseness,
    aiGenerated,
    overall: clamp(Math.round((clarity + naturalness + conciseness) / 3)),
  };
}

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function averageSentenceLength(text: string): number {
  const sentences = text
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  if (!sentences.length) return 0;
  const words = sentences.reduce((sum, sentence) => sum + countWords(sentence), 0);
  return words / sentences.length;
}

function clamp(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}
