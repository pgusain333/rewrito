export type ToolType = "humanizer" | "linkedin" | "email" | "study";
export type Tone =
  | "professional"
  | "natural"
  | "executive"
  | "friendly"
  | "persuasive"
  | "academic";
export type Refinement = "light" | "medium" | "strong";
export type StudyMode =
  | "explain"
  | "steps"
  | "quiz"
  | "flashcards"
  | "notes"
  | "studyplan";
export type EducationLevel = "school" | "college" | "university" | "professional";

export type StudyPlanDetails = {
  examDate?: string;
  hoursPerDay?: string;
  subject?: string;
  prepLevel?: string;
};

export type QuizQuestionCount = 5 | 20;

export const TOOLS: Record<
  ToolType,
  { slug: string; name: string; tagline: string; description: string }
> = {
  humanizer: {
    slug: "ai-humanizer",
    name: "AI Humanizer",
    tagline: "Make AI text read like a person wrote it",
    description:
      "Rewrite AI-generated text into natural, human, professional writing while preserving the original meaning.",
  },
  linkedin: {
    slug: "linkedin-rewriter",
    name: "LinkedIn Post Rewriter",
    tagline: "Turn rough notes into a post worth reading",
    description:
      "Polish a rough draft into a clear, professional LinkedIn post - strong hook, real voice, no fake hype.",
  },
  email: {
    slug: "email-rewriter",
    name: "Professional Email Rewriter",
    tagline: "Clear, polite, confident emails - fast",
    description:
      "Rewrite rough email text into a concise, professional message that keeps your intent.",
  },
  study: {
    slug: "study-assistant",
    name: "Rewrito Study",
    tagline: "Understand concepts clearly. Learn faster.",
    description:
      "Turn confusing study material into clear explanations, organized notes, quizzes, flashcards, and study plans.",
  },
};

export const TONES: { value: Tone; label: string; hint: string }[] = [
  { value: "professional", label: "Professional", hint: "Clear, neutral, polished" },
  { value: "natural", label: "Natural", hint: "Conversational and human" },
  { value: "executive", label: "Executive", hint: "Direct, decisive, senior" },
  { value: "friendly", label: "Friendly", hint: "Warm and approachable" },
  { value: "persuasive", label: "Persuasive", hint: "Confident, action-oriented" },
  { value: "academic", label: "Academic", hint: "Precise and formal" },
];

export const REFINEMENTS: { value: Refinement; label: string; hint: string }[] = [
  { value: "light", label: "Light", hint: "Small edits, keep voice" },
  { value: "medium", label: "Medium", hint: "Balanced rewrite" },
  { value: "strong", label: "Strong", hint: "Substantial rewrite" },
];

export const STUDY_MODES: { value: StudyMode; label: string; hint: string }[] = [
  { value: "explain", label: "Explain Simply", hint: "Clear beginner-friendly explanation" },
  { value: "steps", label: "Step-by-Step", hint: "Guided reasoning and formulas" },
  { value: "quiz", label: "Quiz Me", hint: "MCQs, short answers, answer key" },
  { value: "flashcards", label: "Flashcards", hint: "Q/A cards for revision" },
  { value: "notes", label: "Organize Notes", hint: "Headings, bullets, definitions" },
  { value: "studyplan", label: "Study Plan", hint: "Schedule, revision, practice" },
];

export const EDUCATION_LEVELS: {
  value: EducationLevel;
  label: string;
  hint: string;
}[] = [
  { value: "school", label: "School", hint: "Simple and foundational" },
  { value: "college", label: "College", hint: "Practical and exam-focused" },
  { value: "university", label: "University", hint: "Detailed and rigorous" },
  {
    value: "professional",
    label: "Professional Certification",
    hint: "Concise, applied, certification-ready",
  },
];

function refinementInstruction(level: Refinement): string {
  switch (level) {
    case "light":
      return "Make minimal changes. Preserve the original voice. Fix only awkward phrasing, robotic patterns, and obvious grammar issues.";
    case "medium":
      return "Rewrite for clarity and flow. Vary sentence structure. Replace generic phrasing. Keep all original facts and intent.";
    case "strong":
      return "Rewrite substantially for clarity, rhythm, and impact while strictly preserving every factual claim and the original intent.";
  }
}

function toneInstruction(tone: Tone): string {
  const map: Record<Tone, string> = {
    professional: "Use a clear, neutral, professional tone.",
    natural: "Use a natural, conversational tone - like a thoughtful human wrote it.",
    executive: "Use a senior, executive tone: direct, confident, decisive.",
    friendly: "Use a warm, friendly tone without being casual or unprofessional.",
    persuasive: "Use a persuasive, confident tone with a clear call to action where appropriate.",
    academic: "Use a precise, formal, academic tone.",
  };
  return map[tone];
}

const SHARED_GUARDRAILS = [
  "Return ONLY the rewritten text. No preamble, no explanations, no quotation marks around the result, no markdown fences.",
  "Do not invent facts, names, numbers, or claims that are not present in the input.",
  "Preserve the user's original meaning and intent.",
  "Avoid cliches and filler phrases such as 'in today's world', 'delve into', 'navigate the landscape', 'unlock', 'leverage', 'in conclusion'.",
  "Vary sentence length. Avoid robotic parallel structures.",
  "Make the final draft clearly better than the original in clarity, naturalness, conciseness, and overall quality.",
  "Reduce AI-written signals aggressively: remove generic transitions, over-polished symmetry, vague claims, repetitive sentence shape, and padded explanations.",
  "Prefer concrete nouns, specific verbs, human rhythm, and direct wording.",
].join("\n- ");

export function buildSystemPrompt(
  tool: ToolType,
  tone: Tone,
  refinement: Refinement
): string {
  const baseTone = toneInstruction(tone);
  const baseRefine = refinementInstruction(refinement);

  const toolSpecific: Record<Exclude<ToolType, "study">, string> = {
    humanizer: `You are an expert editor specializing in making AI-generated writing sound natural and human.
Goals:
- Reduce robotic wording and AI patterns (e.g. "It is important to note", "Furthermore").
- Improve flow and rhythm with varied sentence structure.
- Keep the writing professional and grounded.
- Preserve all facts and meaning exactly.
- Make the rewritten version feel like a thoughtful person edited it, not like an AI paraphrased it.
- Remove boilerplate openings, predictable transitions, generic summaries, and over-explaining.`,
    linkedin: `You are a senior content editor for LinkedIn posts.
Goals:
- Open with a real, grounded hook (no clickbait, no "Here's what nobody tells you").
- Use short paragraphs (1-3 lines) and plenty of white space.
- Keep it human. No motivational fluff, no fake humility, no emoji spam.
- Preserve the author's specific points and examples.
- End with a quiet, genuine thought or question - not a generic CTA.
- Make the post substantially more scannable, specific, and credible than the original.`,
    email: `You are an executive communication editor.
Goals:
- Keep it concise. Remove filler and hedging.
- Keep it polite and confident.
- Preserve the original request, intent, and all key details (names, dates, numbers).
- If a subject line is not provided, do not invent one unless the user asked.
- Maintain a standard email structure (greeting, body, sign-off) only if appropriate to the input.
- Make the final email easier to act on, with cleaner ask, clearer context, and less friction.`,
  };

  if (tool === "study") {
    return buildStudySystemPrompt({
      studyMode: "explain",
      tone,
      educationLevel: "college",
    });
  }

  return `${toolSpecific[tool]}

Tone: ${baseTone}
Refinement level: ${baseRefine}

Strict rules:
- ${SHARED_GUARDRAILS}

Presentation:
- Use clear paragraphs with blank lines where helpful.
- If the input naturally contains comparisons, schedules, options, formulas, lists, or before/after items, use a simple markdown table.
- For emails, keep a readable email shape. For LinkedIn, keep short scannable paragraphs. For humanizer, preserve the user's intended format.`;
}

export function buildUserPrompt(input: string): string {
  return `Rewrite the following text according to the rules above. Return only the rewritten version.\n\nText begins:\n${input}\nText ends.`;
}

export function buildStudySystemPrompt({
  studyMode,
  tone,
  educationLevel,
  quizQuestionCount = 5,
}: {
  studyMode: StudyMode;
  tone: Tone;
  educationLevel: EducationLevel;
  quizQuestionCount?: QuizQuestionCount;
}): string {
  const modeInstructions: Record<StudyMode, string> = {
    explain:
      "Explain the material in easy language. Avoid unnecessary jargon. Use analogies only when they make the idea clearer. Focus on understanding, not answer dumping.",
    steps:
      "Break the material or problem into a clear step-by-step table. Explain the reasoning, formulas, and why each step matters. Check arithmetic and logic before answering.",
    quiz:
      `Create an exam-quality testlet with exactly ${quizQuestionCount} multiple-choice questions. Each question must have four plausible options labeled A, B, C, and D, one correct answer, and a brief explanation that teaches the concept.`,
    flashcards:
      "Create memory-friendly flashcards using strict Q: and A: pairs. Focus on definitions, formulas, distinctions, and exam-ready recall.",
    notes:
      "Organize messy material into clean study notes with headings, bullet points, definitions, formulas, summaries, and important concepts.",
    studyplan:
      "Create a realistic study plan with a daily schedule, revision blocks, practice tasks, weak area focus, and balanced workload. If dates or hours are missing, state practical assumptions.",
  };

  const level = EDUCATION_LEVELS.find((item) => item.value === educationLevel);
  const outputContract: Record<StudyMode, string> = {
    explain: `Return only these markdown sections:
## Simple Explanation
## Key Concept
## Example
## Common Mistake
## Quick Check`,
    steps: `Return only these markdown sections:
## Problem Map
Create a markdown table with columns: Item, Details.
## Step-by-Step Table
Create a markdown table with columns: Step, Action, Why It Matters, Result.
## Why It Works
## Common Mistake
## Practice Question`,
    quiz: `Return only a quiz testlet. Do not include Simple Explanation, Key Concept, Step-by-Step Breakdown, Example, or Common Mistake sections.

Use this exact format:
## Quiz Testlet
1. Question text
A) Option text
B) Option text
C) Option text
D) Option text
Answer: A
Explanation: One brief teaching reason

Create exactly ${quizQuestionCount} MCQs. Make questions cover the breadth of the material, avoid repeated stems, and vary correct answer positions.`,
    flashcards: `Return only a flashcard deck. Do not include Simple Explanation, Key Concept, Step-by-Step Breakdown, Example, or Common Mistake sections.

Use this exact format:
## Flashcards
Q: Clear question
A: Concise answer

Create 8 to 12 flashcards using Q: and A: pairs only.`,
    notes: `Return organized notes only. Do not answer like a general explanation.

Use this structure:
## Clean Study Notes
## Key Definitions
## Formulas and Rules
## Important Points
## Summary Table
## Quick Revision Checklist

Use markdown tables wherever they help compare terms, formulas, categories, dates, steps, or pros and cons.`,
    studyplan: `Return a proper study plan only. Do not include generic explanation sections.

Use this structure:
## Study Plan Overview
## Daily Schedule Chart
Create a markdown table with columns: Day, Focus Area, Tasks, Practice, Revision Check, Time.
## Weekly Revision Map
Create a markdown table with columns: Week, Main Goal, Weak Area Focus, Practice Target.
## Practice Plan
## Final Review Checklist

Make the chart practical, balanced, and easy to follow. If exact dates are missing, create a clear Day 1, Day 2 schedule.`,
  };

  return `You are Rewrito Study, an excellent tutor and study coach.

Purpose:
- Help students understand clearly.
- Teach concepts instead of just giving answers.
- Support learning, exam preparation, revision, and study organization.
- Never frame the response as cheating, copying homework, or bypassing learning.

Mode: ${STUDY_MODES.find((item) => item.value === studyMode)?.label ?? "Explain Simply"}
Mode behavior: ${modeInstructions[studyMode]}
Education level: ${level?.label ?? "College"} - ${level?.hint ?? "Practical and exam-focused"}
Tone: ${toneInstruction(tone)}

Strict teaching rules:
- Behave like a patient, trustworthy tutor.
- Prioritize understanding over short answers.
- If the input is a question, explain how to think through it.
- If information is missing, state the assumption briefly instead of inventing facts.
- For math, accounting, finance, economics, statistics, and law material, verify each step carefully and keep definitions precise.
- Separate what is given, what is being asked, and how to solve it when the material is a problem.
- Do not fabricate citations, textbooks, legal authorities, page numbers, or sources.
- Avoid unnecessary complexity.
- Keep the response organized and beginner friendly.
- Use formulas only when useful, and explain each symbol.
- Do not wrap words in markdown bold markers.
- Do not include a section named "Final Takeaway".

Output format for this mode:
${outputContract[studyMode]}`;
}

export function buildStudyUserPrompt({
  input,
  studyMode,
  educationLevel,
  details,
}: {
  input: string;
  studyMode: StudyMode;
  educationLevel: EducationLevel;
  details?: StudyPlanDetails;
}): string {
  const planDetails =
    studyMode === "studyplan"
      ? `\nStudy plan details:
- Subject: ${details?.subject?.trim() || "Not specified"}
- Exam date: ${details?.examDate?.trim() || "Not specified"}
- Hours available per day: ${details?.hoursPerDay?.trim() || "Not specified"}
- Current preparation level: ${details?.prepLevel?.trim() || "Not specified"}`
      : "";

  return `Create a study-focused educational response for this material.

Study mode: ${studyMode}
Education level: ${educationLevel}${planDetails}

Material begins:
${input}
Material ends.`;
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

export type ScoreBreakdown = {
  clarity: number;
  naturalness: number;
  conciseness: number;
  aiGenerated: number;
  overall: number;
};

export type ScorePair = {
  before: ScoreBreakdown;
  after: ScoreBreakdown;
};

export function buildScoringSystemPrompt(tool: ToolType): string {
  const lens: Record<ToolType, string> = {
    humanizer:
      "Score with a focus on how human and natural the writing feels (no AI tells).",
    linkedin:
      "Score with a focus on hook quality, scannability, and authenticity for LinkedIn.",
    email:
      "Score with a focus on professional clarity, politeness, and conciseness.",
    study:
      "Score with a focus on educational clarity, structure, usefulness, and beginner-friendly explanation.",
  };

  return `You are an impartial writing-quality evaluator.

Given an ORIGINAL piece of text and a REWRITTEN version, score each one on three dimensions from 0 to 100:
- clarity: how easy it is to understand
- naturalness: how human and unforced the writing reads
- conciseness: how efficient the wording is (no filler, no padding)

Also score "aiGenerated" from 0 to 100:
- 0 means very likely human-written
- 100 means very likely AI-generated

Also produce an "overall" score from 0 to 100 that reflects the writing's overall quality on a professional bar.

${lens[tool]}

Be honest. Do not give every text 80+. Mediocre or robotic writing should score in the 40-65 range. Excellent writing scores 85+.
The rewritten text was produced by a quality-improvement system, so if it follows the instructions, quality metrics should improve and AI-generated confidence should decrease.
Never score the rewritten version worse than the original unless the rewrite clearly loses facts or meaning.

Return ONLY a single JSON object, no prose, no markdown fences, in this exact shape:
{
  "before": { "clarity": <int>, "naturalness": <int>, "conciseness": <int>, "aiGenerated": <int>, "overall": <int> },
  "after":  { "clarity": <int>, "naturalness": <int>, "conciseness": <int>, "aiGenerated": <int>, "overall": <int> }
}`;
}

export function buildScoringUserPrompt(original: string, rewritten: string): string {
  return `ORIGINAL:
"""
${original}
"""

REWRITTEN:
"""
${rewritten}
"""

Return the JSON object only.`;
}
