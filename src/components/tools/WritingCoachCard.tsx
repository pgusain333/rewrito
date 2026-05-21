"use client";

type Props = {
  original: string;
  rewritten?: string;
};

type Lesson = {
  label: string;
  title: string;
  body: string;
};

export function WritingCoachCard({ original, rewritten = "" }: Props) {
  const lessons = buildLessons(original, rewritten);

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-line bg-bg-soft px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          Writing coach
        </p>
        <h4 className="mt-1 text-base font-semibold text-ink">
          Build human intelligence with AI intelligence
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
          rewrito points out what changed so your next draft gets stronger before you need the tool.
        </p>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-3">
        {lessons.map((lesson) => (
          <div key={lesson.title} className="rounded-xl border border-line bg-white p-4">
            <span className="mb-3 inline-flex rounded-full bg-brand-softPurple px-2.5 py-1 text-[11px] font-semibold text-brand">
              {lesson.label}
            </span>
            <h5 className="text-sm font-semibold text-ink">{lesson.title}</h5>
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">{lesson.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function buildLessons(original: string, rewritten: string): Lesson[] {
  const source = original.trim();
  const revised = rewritten.trim();
  const originalAvg = averageSentenceLength(source);
  const revisedAvg = averageSentenceLength(revised);
  const genericPhrases = [
    "in today's world",
    "it is important to note",
    "rapidly evolving",
    "delve into",
    "unlock",
    "leverage",
    "furthermore",
    "moreover",
  ];
  const genericFound = genericPhrases.some((phrase) =>
    source.toLowerCase().includes(phrase)
  );
  const trimmedPercent = revised
    ? Math.max(0, Math.round(((source.length - revised.length) / Math.max(source.length, 1)) * 100))
    : 0;

  const lessons: Lesson[] = [];

  if (genericFound) {
    lessons.push({
      label: "Pattern",
      title: "Replace generic openers",
      body: "Start with the concrete person, action, or outcome instead of broad setup phrases.",
    });
  } else {
    lessons.push({
      label: "Pattern",
      title: "Lead with the real point",
      body: "A strong draft names the subject quickly, then adds context only where it helps.",
    });
  }

  if (originalAvg > 24 || (revisedAvg > 0 && originalAvg - revisedAvg > 4)) {
    lessons.push({
      label: "Rhythm",
      title: "Break long sentences",
      body: "One idea per sentence makes the writing easier to scan and lowers the robotic feel.",
    });
  } else {
    lessons.push({
      label: "Rhythm",
      title: "Vary sentence shape",
      body: "Mix short direct lines with fuller explanations so the writing feels more natural.",
    });
  }

  if (trimmedPercent > 8) {
    lessons.push({
      label: "Habit",
      title: "Cut before polishing",
      body: `This rewrite trimmed about ${trimmedPercent}% of the draft. Remove filler first, then improve tone.`,
    });
  } else {
    lessons.push({
      label: "Habit",
      title: "Keep useful specifics",
      body: "Names, numbers, examples, and constraints make writing feel credible. Preserve them while smoothing the sentence.",
    });
  }

  return lessons.slice(0, 3);
}

function averageSentenceLength(text: string): number {
  const sentences = text
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  if (!sentences.length) return 0;
  const wordTotal = sentences.reduce((sum, sentence) => {
    return sum + sentence.split(/\s+/).filter(Boolean).length;
  }, 0);
  return wordTotal / sentences.length;
}
