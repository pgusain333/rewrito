"use client";

type Props = {
  original: string;
  rewritten?: string;
};

type Lesson = {
  label: string;
  title: string;
  body: string;
  practice: string;
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
      <div className="grid gap-4 p-4 lg:grid-cols-[1fr_280px]">
        <div className="grid gap-3 sm:grid-cols-3">
          {lessons.map((lesson) => (
            <div key={lesson.title} className="rounded-xl border border-line bg-white p-4">
              <span className="mb-3 inline-flex rounded-full bg-brand-softPurple px-2.5 py-1 text-[11px] font-semibold text-brand">
                {lesson.label}
              </span>
              <h5 className="text-sm font-semibold text-ink">{lesson.title}</h5>
              <p className="mt-2 text-xs leading-relaxed text-ink-muted">{lesson.body}</p>
              <p className="mt-3 rounded-lg bg-bg-soft px-3 py-2 text-xs leading-relaxed text-ink">
                {lesson.practice}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-line bg-ink p-4 text-white">
          <span className="mb-3 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white">
            Coach note
          </span>
          <h5 className="text-sm font-semibold">Use the rewrite as a lesson, not just an answer.</h5>
          <p className="mt-2 text-xs leading-relaxed text-white/70">
            Before sending your next draft, ask: what is the real point, which details prove it, and where did the wording sound too polished? That small review loop is how rewrito builds your writing instincts.
          </p>
        </div>
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
      practice: "Next time: write the first sentence using a person, action, or result.",
    });
  } else {
    lessons.push({
      label: "Pattern",
      title: "Lead with the real point",
      body: "A strong draft names the subject quickly, then adds context only where it helps.",
      practice: "Next time: underline the sentence that contains the actual point and move it earlier.",
    });
  }

  if (originalAvg > 24 || (revisedAvg > 0 && originalAvg - revisedAvg > 4)) {
    lessons.push({
      label: "Rhythm",
      title: "Break long sentences",
      body: "One idea per sentence makes the writing easier to scan and lowers the robotic feel.",
      practice: "Next time: split any sentence that carries two actions, reasons, or outcomes.",
    });
  } else {
    lessons.push({
      label: "Rhythm",
      title: "Vary sentence shape",
      body: "Mix short direct lines with fuller explanations so the writing feels more natural.",
      practice: "Next time: follow one longer explanation with one short plain sentence.",
    });
  }

  if (trimmedPercent > 8) {
    lessons.push({
      label: "Habit",
      title: "Cut before polishing",
      body: `This rewrite trimmed about ${trimmedPercent}% of the draft. Remove filler first, then improve tone.`,
      practice: "Next time: remove one sentence that repeats the same idea before editing style.",
    });
  } else {
    lessons.push({
      label: "Habit",
      title: "Keep useful specifics",
      body: "Names, numbers, examples, and constraints make writing feel credible. Preserve them while smoothing the sentence.",
      practice: "Next time: add one concrete example before asking AI to improve flow.",
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
