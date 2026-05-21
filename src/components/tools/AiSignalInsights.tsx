"use client";

type SignalMatch = {
  phrase: string;
  label: string;
  count: number;
  severity: "high" | "medium" | "low";
};

type SignalFactor = {
  title: string;
  body: string;
  severity: "high" | "medium" | "low";
};

type SignalReport = {
  matches: SignalMatch[];
  factors: SignalFactor[];
  avgSentenceLength: number;
};

type HighlightTone = "risk" | "clean" | "changed";

const AI_SIGNAL_PATTERNS: Array<{
  phrase: string;
  label: string;
  severity: SignalMatch["severity"];
}> = [
  { phrase: "it is important to note", label: "Over-explaining setup", severity: "high" },
  { phrase: "in today's world", label: "Generic opener", severity: "high" },
  { phrase: "rapidly evolving", label: "AI-style context phrase", severity: "high" },
  { phrase: "digital landscape", label: "Vague landscape phrasing", severity: "high" },
  { phrase: "navigate the complexities", label: "Generic complexity phrase", severity: "high" },
  { phrase: "delve into", label: "Common AI verb", severity: "high" },
  { phrase: "leverage", label: "Corporate AI verb", severity: "medium" },
  { phrase: "utilize", label: "Inflated verb", severity: "medium" },
  { phrase: "unlock", label: "Generic benefit verb", severity: "medium" },
  { phrase: "harness the power", label: "Hype phrase", severity: "high" },
  { phrase: "cutting-edge", label: "Generic hype word", severity: "medium" },
  { phrase: "seamless", label: "Vague product adjective", severity: "medium" },
  { phrase: "robust", label: "Vague product adjective", severity: "medium" },
  { phrase: "comprehensive", label: "Over-broad adjective", severity: "low" },
  { phrase: "furthermore", label: "Predictable transition", severity: "medium" },
  { phrase: "moreover", label: "Predictable transition", severity: "medium" },
  { phrase: "in conclusion", label: "Formulaic ending", severity: "high" },
  { phrase: "critical imperative", label: "Inflated conclusion", severity: "high" },
  { phrase: "transformative", label: "Vague impact word", severity: "medium" },
  { phrase: "revolutionized", label: "Copied-sounding broad claim", severity: "medium" },
  { phrase: "competitive advantage", label: "Source-dependent claim", severity: "medium" },
  { phrase: "streamline processes", label: "Generic business phrase", severity: "medium" },
  { phrase: "transformational outcomes", label: "Broad uncited outcome claim", severity: "high" },
  { phrase: "across departments", label: "Broad scope claim", severity: "low" },
  { phrase: "according to research", label: "Citation needed", severity: "high" },
  { phrase: "studies show", label: "Citation needed", severity: "high" },
  { phrase: "experts agree", label: "Citation needed", severity: "high" },
  { phrase: "game-changing", label: "Generic hype word", severity: "medium" },
  { phrase: "elevate", label: "Generic improvement verb", severity: "low" },
  { phrase: "enhance", label: "Generic improvement verb", severity: "low" },
  { phrase: "optimize", label: "Generic improvement verb", severity: "low" },
  { phrase: "unlock your potential", label: "Cliche benefit phrase", severity: "high" },
];

const ABSTRACT_WORDS = [
  "solutions",
  "innovation",
  "efficiency",
  "productivity",
  "potential",
  "capabilities",
  "opportunities",
  "outcomes",
  "strategies",
  "ecosystem",
  "framework",
  "paradigm",
  "synergy",
  "impact",
  "transformation",
];

const GENERIC_TRANSITIONS = [
  "furthermore",
  "moreover",
  "additionally",
  "in conclusion",
  "therefore",
  "as a result",
];

export function AiSignalInsights({
  original,
  rewritten,
  compact = false,
}: {
  original: string;
  rewritten?: string;
  compact?: boolean;
}) {
  const before = analyzeAiSignals(original);
  const after = rewritten ? analyzeAiSignals(rewritten) : null;
  const terms = before.matches.map((match) => match.phrase);
  const afterTerms = after?.matches.map((match) => match.phrase) ?? [];
  const factors = before.factors.slice(0, 5);

  return (
    <section className="rounded-2xl border border-line bg-white p-4 shadow-soft sm:p-5">
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            AI signal review
          </p>
          <h4 className="mt-1 text-base font-semibold text-ink">
            Words and patterns that sound AI-written
          </h4>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">
            Highlighted phrases are the strongest visible signals. The rewrite should reduce these while keeping the meaning intact.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          Review aid
        </span>
      </div>

      <div className={`grid gap-3 ${compact ? "" : "lg:grid-cols-2"}`}>
        <SignalTextCard
          title="Original signals"
          description="Phrases that can raise detector-style confidence"
          text={excerptForSignals(original, terms)}
          terms={terms}
          tone="risk"
        />
        {rewritten && (
          <SignalTextCard
            title="After rewrite"
            description="Residual signals to review before publishing"
            text={excerptForSignals(rewritten, afterTerms)}
            terms={afterTerms}
            tone="clean"
          />
        )}
      </div>

      <div className="mt-4 rounded-xl border border-line bg-bg-soft p-3">
        <div className="mb-3 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
          <h5 className="text-sm font-semibold text-ink">Major factors</h5>
          <span className="text-xs text-ink-muted">
            Average sentence length: {before.avgSentenceLength || 0} words
          </span>
        </div>
        {factors.length ? (
          <div className="grid gap-2 md:grid-cols-2">
            {factors.map((factor) => (
              <div key={`${factor.title}-${factor.body}`} className="rounded-xl border border-line bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-ink">{factor.title}</p>
                  <span className={severityClass(factor.severity)}>
                    {factor.severity}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted">{factor.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-ink-muted">
            No obvious phrase triggers were found. For best results, add personal examples, concrete numbers, and varied sentence rhythm.
          </p>
        )}
      </div>
    </section>
  );
}

export function AiSignalTextBox({
  text,
  compareText = "",
  mode = "risk",
  title,
  description,
}: {
  text: string;
  compareText?: string;
  mode?: "risk" | "changed";
  title?: string;
  description?: string;
}) {
  if (!text.trim()) return null;
  const terms =
    mode === "changed"
      ? buildChangedTerms(compareText, text)
      : analyzeAiSignals(text).matches.map((match) => match.phrase);
  const hasTerms = terms.length > 0;

  return (
    <div className="mt-3 rounded-xl border border-line bg-white p-3 shadow-soft">
      <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
            {title ?? (mode === "changed" ? "Changed wording" : "AI-sounding wording")}
          </p>
          <p className="text-xs leading-relaxed text-ink-muted">
            {description ??
              (mode === "changed"
                ? "Green underlines show wording that changed in the humanized output."
                : "Amber underlines show phrases that can make writing sound AI-generated.")}
          </p>
        </div>
        <span
          className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            mode === "changed"
              ? "bg-success/10 text-success"
              : hasTerms
              ? "bg-warning/10 text-warning"
              : "bg-success/10 text-success"
          }`}
        >
          {mode === "changed" ? `${terms.length} changes` : hasTerms ? `${terms.length} signals` : "Clean"}
        </span>
      </div>
      <div className="max-h-56 overflow-y-auto rounded-lg bg-bg-soft p-3 text-sm leading-relaxed text-ink whitespace-pre-wrap">
        {hasTerms ? (
          <HighlightedText text={text} terms={terms} tone={mode === "changed" ? "changed" : "risk"} />
        ) : (
          text
        )}
      </div>
    </div>
  );
}

function SignalTextCard({
  title,
  description,
  text,
  terms,
  tone,
}: {
  title: string;
  description: string;
  text: string;
  terms: string[];
  tone: HighlightTone;
}) {
  const hasTerms = terms.length > 0;
  return (
    <div className="rounded-xl border border-line bg-bg-soft p-3">
      <div className="mb-2 flex flex-col gap-1">
        <h5 className="text-sm font-semibold text-ink">{title}</h5>
        <p className="text-xs text-ink-muted">{description}</p>
      </div>
      <div className="max-h-56 overflow-y-auto rounded-lg border border-line bg-white p-3 text-sm leading-relaxed text-ink">
        {hasTerms ? (
          <HighlightedText text={text} terms={terms} tone={tone} />
        ) : (
          <span>{text || "No text available."}</span>
        )}
      </div>
      {!hasTerms && (
        <p className="mt-2 text-xs text-success">
          No obvious AI-signal phrases detected in this excerpt.
        </p>
      )}
    </div>
  );
}

function HighlightedText({
  text,
  terms,
  tone,
}: {
  text: string;
  terms: string[];
  tone: HighlightTone;
}) {
  const parts = buildHighlightedParts(text, terms);
  return (
    <>
      {parts.map((part, index) =>
        part.highlight ? (
          <mark
            key={`${part.text}-${index}`}
            className={`rounded px-1 py-0.5 ${
              tone === "risk"
                ? "bg-warning/20 text-ink underline decoration-warning decoration-2 underline-offset-4 ring-1 ring-warning/30"
                : tone === "changed"
                ? "bg-success/15 text-ink underline decoration-success decoration-2 underline-offset-4 ring-1 ring-success/25"
                : "bg-success/15 text-ink underline decoration-success decoration-2 underline-offset-4 ring-1 ring-success/25"
            }`}
          >
            {part.text}
          </mark>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        )
      )}
    </>
  );
}

function buildChangedTerms(original: string, rewritten: string) {
  if (!original.trim() || !rewritten.trim()) return [];
  const originalWords = new Set(tokenize(original));
  const terms: string[] = [];
  const seen = new Set<string>();
  for (const rawWord of rewritten.match(/\b[A-Za-z][A-Za-z'-]{3,}\b/g) ?? []) {
    const normalized = normalizeToken(rawWord);
    if (
      !normalized ||
      originalWords.has(normalized) ||
      seen.has(normalized) ||
      COMMON_WORDS.has(normalized)
    ) {
      continue;
    }
    seen.add(normalized);
    terms.push(rawWord);
    if (terms.length >= 28) break;
  }
  return terms;
}

function tokenize(text: string) {
  return (text.match(/\b[A-Za-z][A-Za-z'-]{3,}\b/g) ?? [])
    .map(normalizeToken)
    .filter(Boolean);
}

function normalizeToken(word: string) {
  return word.toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g, "");
}

const COMMON_WORDS = new Set([
  "about",
  "after",
  "also",
  "because",
  "been",
  "before",
  "being",
  "between",
  "could",
  "does",
  "from",
  "have",
  "into",
  "more",
  "that",
  "their",
  "there",
  "these",
  "this",
  "through",
  "with",
  "would",
  "your",
]);

function analyzeAiSignals(text: string): SignalReport {
  const lower = text.toLowerCase();
  const matches = AI_SIGNAL_PATTERNS.map((pattern) => {
    const count = countOccurrences(lower, pattern.phrase.toLowerCase());
    return count
      ? {
          phrase: pattern.phrase,
          label: pattern.label,
          count,
          severity: pattern.severity,
        }
      : null;
  }).filter(Boolean) as SignalMatch[];

  const words = getWords(text);
  const avgSentenceLength = Math.round(averageSentenceLength(text));
  const transitionCount = GENERIC_TRANSITIONS.reduce(
    (sum, phrase) => sum + countOccurrences(lower, phrase),
    0
  );
  const abstractCount = words.filter((word) =>
    ABSTRACT_WORDS.includes(word.toLowerCase().replace(/[^a-z]/g, ""))
  ).length;
  const repeatedStarterCount = repeatedSentenceStarters(text);

  const factors: SignalFactor[] = [];
  if (matches.length) {
    factors.push({
      title: "Generic AI phrases",
      body: `${matches.length} phrase group${matches.length === 1 ? "" : "s"} found, including ${matches
        .slice(0, 3)
        .map((match) => `"${match.phrase}"`)
        .join(", ")}.`,
      severity: matches.some((match) => match.severity === "high") ? "high" : "medium",
    });
  }
  if (avgSentenceLength >= 24) {
    factors.push({
      title: "Long polished sentences",
      body: "The average sentence is long, which can make the draft feel generated or over-smoothed.",
      severity: avgSentenceLength >= 30 ? "high" : "medium",
    });
  }
  if (transitionCount >= 2) {
    factors.push({
      title: "Predictable transitions",
      body: "Repeated connectors make the structure feel template-like instead of naturally edited.",
      severity: transitionCount >= 4 ? "high" : "medium",
    });
  }
  if (abstractCount >= Math.max(4, words.length * 0.035)) {
    factors.push({
      title: "Abstract wording",
      body: "The draft leans on broad nouns instead of concrete people, actions, examples, or numbers.",
      severity: abstractCount >= Math.max(7, words.length * 0.055) ? "high" : "medium",
    });
  }
  if (repeatedStarterCount >= 2) {
    factors.push({
      title: "Repeated sentence shape",
      body: "Several sentences start in a similar way, which can make the rhythm feel machine-made.",
      severity: repeatedStarterCount >= 4 ? "high" : "medium",
    });
  }

  return {
    matches: matches.sort((a, b) => severityRank(b.severity) - severityRank(a.severity) || b.count - a.count),
    factors,
    avgSentenceLength,
  };
}

function buildHighlightedParts(text: string, terms: string[]) {
  if (!text || !terms.length) return [{ text, highlight: false }];
  const intervals: Array<{ start: number; end: number }> = [];
  const sortedTerms = [...new Set(terms)].sort((a, b) => b.length - a.length);
  const lower = text.toLowerCase();

  for (const term of sortedTerms) {
    let searchFrom = 0;
    const needle = term.toLowerCase();
    while (searchFrom < lower.length) {
      const index = lower.indexOf(needle, searchFrom);
      if (index === -1) break;
      const end = index + needle.length;
      if (!intervals.some((item) => index < item.end && end > item.start)) {
        intervals.push({ start: index, end });
      }
      searchFrom = end;
    }
  }

  intervals.sort((a, b) => a.start - b.start);
  const parts: Array<{ text: string; highlight: boolean }> = [];
  let cursor = 0;
  for (const interval of intervals) {
    if (interval.start > cursor) {
      parts.push({ text: text.slice(cursor, interval.start), highlight: false });
    }
    parts.push({ text: text.slice(interval.start, interval.end), highlight: true });
    cursor = interval.end;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), highlight: false });
  return parts;
}

function excerptForSignals(text: string, terms: string[]) {
  const trimmed = text.trim();
  if (trimmed.length <= 1100) return trimmed;
  const lower = trimmed.toLowerCase();
  const firstIndex = terms
    .map((term) => lower.indexOf(term.toLowerCase()))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  if (typeof firstIndex !== "number") return `${trimmed.slice(0, 1100)}...`;
  const start = Math.max(0, firstIndex - 220);
  const end = Math.min(trimmed.length, start + 1100);
  return `${start > 0 ? "..." : ""}${trimmed.slice(start, end)}${end < trimmed.length ? "..." : ""}`;
}

function countOccurrences(text: string, phrase: string) {
  if (!phrase) return 0;
  let count = 0;
  let index = 0;
  while (index < text.length) {
    const found = text.indexOf(phrase, index);
    if (found === -1) break;
    count += 1;
    index = found + phrase.length;
  }
  return count;
}

function getWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean);
}

function averageSentenceLength(text: string) {
  const sentences = text
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  if (!sentences.length) return 0;
  const totalWords = sentences.reduce((sum, sentence) => sum + getWords(sentence).length, 0);
  return totalWords / sentences.length;
}

function repeatedSentenceStarters(text: string) {
  const starters = text
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim().split(/\s+/).slice(0, 2).join(" ").toLowerCase())
    .filter((starter) => starter.length > 4);
  const counts = new Map<string, number>();
  for (const starter of starters) counts.set(starter, (counts.get(starter) ?? 0) + 1);
  return [...counts.values()].filter((count) => count > 1).reduce((sum, count) => sum + count, 0);
}

function severityRank(severity: SignalMatch["severity"]) {
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

function severityClass(severity: SignalFactor["severity"]) {
  if (severity === "high") {
    return "rounded-full bg-error/10 px-2 py-0.5 text-[11px] font-semibold capitalize text-error";
  }
  if (severity === "medium") {
    return "rounded-full bg-warning/10 px-2 py-0.5 text-[11px] font-semibold capitalize text-warning";
  }
  return "rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold capitalize text-success";
}
