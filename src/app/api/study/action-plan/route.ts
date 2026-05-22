import { NextResponse } from "next/server";
import { generateCompletion } from "@/lib/ai/provider";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EDUCATION_LEVELS, type EducationLevel } from "@/lib/prompts";
import { ANON_WORD_LIMIT, PRO_WORD_LIMIT, USER_WORD_LIMIT } from "@/lib/usage/limits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type QuizArea = {
  topic: string;
  total?: number;
  correct?: number;
  accuracy?: number;
};

type QuizQuestionSummary = {
  prompt: string;
  topic?: string;
  selected?: string;
  answerKey?: string;
  explanation?: string;
};

type Body = {
  material?: string;
  subject?: string;
  educationLevel?: EducationLevel;
  score?: {
    correct: number;
    total: number;
    percent: number;
  };
  rows?: QuizArea[];
  strongAreas?: QuizArea[];
  importantAreas?: QuizArea[];
  weakAreas?: QuizArea[];
  questions?: QuizQuestionSummary[];
};

function countWords(value: string): number {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function isEducationLevel(value: unknown): value is EducationLevel {
  return typeof value === "string" && EDUCATION_LEVELS.some((level) => level.value === value);
}

function cleanOutput(value: string): string {
  return value
    .replace(/[–—]/g, " - ")
    .replace(/--+/g, "-")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function areaList(label: string, areas: QuizArea[] = []) {
  if (!areas.length) return `${label}: None listed`;
  return `${label}:\n${areas
    .slice(0, 8)
    .map((area) => `- ${area.topic} (${area.accuracy ?? 0}% accuracy, ${area.correct ?? 0}/${area.total ?? 0})`)
    .join("\n")}`;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const material = typeof body.material === "string" ? body.material.trim() : "";
  if (material.length < 20) {
    return NextResponse.json(
      { error: "Paste study material and complete a quiz before creating an action plan." },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rawPlan = user?.app_metadata?.plan ?? user?.user_metadata?.plan;
  const isPaidUser = rawPlan === "pro";
  const wordLimit = isPaidUser ? PRO_WORD_LIMIT : user ? USER_WORD_LIMIT : ANON_WORD_LIMIT;
  const wordCount = countWords(material);

  if (wordCount > wordLimit) {
    return NextResponse.json(
      {
        error: !user
          ? `Log in to continue with study material over ${wordLimit.toLocaleString()} words.`
          : !isPaidUser
          ? `Upgrade to continue with study material over ${wordLimit.toLocaleString()} words.`
          : `Study material is too long. Keep it under ${wordLimit.toLocaleString()} words.`,
        requiresAuth: !user,
        requiresUpgrade: !!user && !isPaidUser,
      },
      { status: 413 }
    );
  }

  const educationLevel = isEducationLevel(body.educationLevel) ? body.educationLevel : "college";
  const level = EDUCATION_LEVELS.find((item) => item.value === educationLevel);
  const subject = body.subject?.trim() || "General study";
  const score = body.score;
  const questions = Array.isArray(body.questions) ? body.questions.slice(0, 20) : [];

  try {
    const output = await generateCompletion({
      temperature: 0.25,
      maxTokens: 1200,
      messages: [
        {
          role: "system",
          content: `You are Rewrito Study, a calm expert tutor.

Create a brief action plan after a quiz attempt. Be accurate, encouraging, and practical.

Rules:
- Use only the quiz result and material provided. Do not invent facts, citations, textbooks, or scores.
- Do not make the student feel disappointed. Frame weaknesses as the next useful focus.
- Prioritize understanding, active recall, and exam preparation.
- Use single hyphens only. Never use double hyphens, en dashes, or em dashes.
- Do not use markdown bold markers.
- Keep it brief enough to act on today.

Output exactly these sections:
## Action Plan
Create a markdown table with columns: Priority, Topic, What to do, Practice task, Time.
## Strong Areas
2 to 3 short bullets.
## Important Areas
2 to 3 short bullets about topics that matter for this subject, even if the student scored well.
## Weak Areas
2 to 3 supportive bullets focused on what to review next.
## How to Ace This Topic
3 to 5 practical steps.
## Next Testlet Focus
2 bullets describing what the next quiz should test.`,
        },
        {
          role: "user",
          content: `Subject: ${subject}
Education level: ${level?.label ?? "College"} - ${level?.hint ?? "Practical and exam-focused"}
Score: ${score ? `${score.correct}/${score.total} (${score.percent}%)` : "Not provided"}

${areaList("Strong areas", body.strongAreas)}

${areaList("Important areas", body.importantAreas)}

${areaList("Weak areas", body.weakAreas)}

Area breakdown:
${(body.rows ?? [])
  .slice(0, 12)
  .map((area) => `- ${area.topic}: ${area.correct ?? 0}/${area.total ?? 0}, ${area.accuracy ?? 0}%`)
  .join("\n")}

Questions summary:
${questions
  .map(
    (question, index) =>
      `${index + 1}. ${question.prompt}
Topic: ${question.topic || "Core concept"}
Selected: ${question.selected || "Not selected"}
Correct: ${question.answerKey || "Not provided"}
Explanation: ${question.explanation || "Not provided"}`
  )
  .join("\n\n")}

Study material:
${material}`,
        },
      ],
    });

    return NextResponse.json({ output: cleanOutput(output) });
  } catch (error) {
    console.error("Study action plan error:", error);
    return NextResponse.json(
      { error: "Could not create the action plan. Please try again." },
      { status: 502 }
    );
  }
}
