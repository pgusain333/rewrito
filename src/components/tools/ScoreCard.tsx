"use client";

import { useEffect, useState } from "react";
import type { ScorePair } from "@/lib/prompts";

type Props = { scores: ScorePair };

function qualityBand(score: number): { label: string; color: string } {
  if (score >= 85) return { label: "Excellent", color: "var(--brand)" };
  if (score >= 70) return { label: "Strong", color: "#06B6D4" };
  if (score >= 55) return { label: "Decent", color: "#F59E0B" };
  return { label: "Weak", color: "#EF4444" };
}

function aiBand(score: number): { label: string; color: string } {
  if (score <= 25) return { label: "Low", color: "#10B981" };
  if (score <= 55) return { label: "Mixed", color: "#F59E0B" };
  return { label: "High", color: "#EF4444" };
}

function useCountUp(target: number, durationMs = 900): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();

    function tick(now: number) {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

export function ScoreCard({ scores }: Props) {
  const beforeOverall = useCountUp(scores.before.overall);
  const afterOverall = useCountUp(scores.after.overall);
  const delta = scores.after.overall - scores.before.overall;
  const beforeBand = qualityBand(scores.before.overall);
  const afterBand = qualityBand(scores.after.overall);
  const beforeAi = scores.before.aiGenerated ?? 0;
  const afterAi = scores.after.aiGenerated ?? 0;
  const aiDrop = Math.max(0, beforeAi - afterAi);

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-line bg-bg-soft px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-brand-softPurple text-brand">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M3 3v18h18" />
              <path d="m7 14 4-4 4 4 5-5" />
            </svg>
          </span>
          <h4 className="text-sm font-semibold text-ink">Quality and AI-confidence proof</h4>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {delta !== 0 && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                delta > 0 ? "bg-success/10 text-success" : "bg-error/10 text-error"
              }`}
            >
              {delta > 0 ? "+" : ""}
              {delta} quality
            </span>
          )}
          {aiDrop > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
              -{aiDrop}% AI confidence
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <ScoreColumn
          title="Before"
          overall={beforeOverall}
          targetOverall={scores.before.overall}
          breakdown={scores.before}
          accent={beforeBand.color}
          bandLabel={beforeBand.label}
        />
        <ScoreColumn
          title="After"
          overall={afterOverall}
          targetOverall={scores.after.overall}
          breakdown={scores.after}
          accent={afterBand.color}
          bandLabel={afterBand.label}
          highlight
        />
      </div>
    </div>
  );
}

function ScoreColumn({
  title,
  overall,
  targetOverall,
  breakdown,
  accent,
  bandLabel,
  highlight = false,
}: {
  title: string;
  overall: number;
  targetOverall: number;
  breakdown: {
    clarity: number;
    naturalness: number;
    conciseness: number;
    aiGenerated?: number;
  };
  accent: string;
  bandLabel: string;
  highlight?: boolean;
}) {
  const aiScore = breakdown.aiGenerated ?? 0;
  const ai = aiBand(aiScore);

  return (
    <div className={`p-5 ${highlight ? "bg-white" : "bg-bg-soft/40"}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          {title}
        </span>
        <span
          className="text-[10px] font-medium uppercase tracking-wide"
          style={{ color: accent }}
        >
          {bandLabel}
        </span>
      </div>

      <div className="flex items-end gap-3">
        <Ring score={overall} target={targetOverall} accent={accent} />
        <div className="mb-1">
          <div className="text-3xl font-semibold leading-none tracking-tight text-ink">
            {overall}
            <span className="text-base font-normal text-ink-subtle">/100</span>
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-2.5">
        <Bar label="Clarity" value={breakdown.clarity} accent={accent} />
        <Bar label="Naturalness" value={breakdown.naturalness} accent={accent} />
        <Bar label="Conciseness" value={breakdown.conciseness} accent={accent} />
      </ul>

      <div className="mt-4 border-t border-line pt-4">
        <div className="mb-1 flex items-center justify-between text-[11px]">
          <span className="text-ink-muted">AI-generated confidence</span>
          <span className="font-medium" style={{ color: ai.color }}>
            {aiScore}% {ai.label}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-section">
          <div
            className="h-full rounded-full"
            style={{
              width: `${aiScore}%`,
              background: ai.color,
              transition: "width 0.7s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Ring({
  score,
  target,
  accent,
}: {
  score: number;
  target: number;
  accent: string;
}) {
  const size = 56;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;

  return (
    <svg width={size} height={size} aria-hidden>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#E5E7EB"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={accent}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.16,1,0.3,1)" }}
      />
    </svg>
  );
}

function Bar({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <li>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-ink-muted">{label}</span>
        <span className="font-medium text-ink">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-section">
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            background: accent,
            transition: "width 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      </div>
    </li>
  );
}
