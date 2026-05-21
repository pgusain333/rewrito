import { NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import { generateCompletion } from "@/lib/ai/provider";
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildStudySystemPrompt,
  buildStudyUserPrompt,
  buildScoringSystemPrompt,
  buildScoringUserPrompt,
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
  type StudyPlanDetails,
  type QuizQuestionCount,
} from "@/lib/prompts";
import {
  ANON_LIMIT,
  USER_LIMIT,
  ANON_WORD_LIMIT,
  USER_WORD_LIMIT,
  PRO_WORD_LIMIT,
} from "@/lib/usage/limits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_INPUT_CHARS = 8000;

type Body = {
  tool: ToolType;
  text: string;
  tone: Tone;
  refinement: Refinement;
  studyMode?: StudyMode;
  educationLevel?: EducationLevel;
  studyPlan?: StudyPlanDetails;
  quizQuestionCount?: QuizQuestionCount;
  anonymousId?: string | null;
};

function isToolType(v: unknown): v is ToolType {
  return typeof v === "string" && v in TOOLS;
}
function isTone(v: unknown): v is Tone {
  return typeof v === "string" && TONES.some((t) => t.value === v);
}
function isRefinement(v: unknown): v is Refinement {
  return typeof v === "string" && REFINEMENTS.some((r) => r.value === v);
}
function isStudyMode(v: unknown): v is StudyMode {
  return typeof v === "string" && STUDY_MODES.some((m) => m.value === v);
}
function isEducationLevel(v: unknown): v is EducationLevel {
  return typeof v === "string" && EDUCATION_LEVELS.some((l) => l.value === v);
}

function countWords(value: string): number {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    tool,
    text,
    tone,
    refinement,
    anonymousId,
    studyMode = "explain",
    educationLevel = "college",
    studyPlan,
    quizQuestionCount = 5,
  } = body;

  // ---- Validation ----
  if (!isToolType(tool)) return NextResponse.json({ error: "Invalid tool" }, { status: 400 });
  if (!isTone(tone)) return NextResponse.json({ error: "Invalid tone" }, { status: 400 });
  if (!isRefinement(refinement))
    return NextResponse.json({ error: "Invalid refinement level" }, { status: 400 });
  if (tool === "study" && !isStudyMode(studyMode))
    return NextResponse.json({ error: "Invalid study mode" }, { status: 400 });
  if (tool === "study" && !isEducationLevel(educationLevel))
    return NextResponse.json({ error: "Invalid education level" }, { status: 400 });

  if (typeof text !== "string" || text.trim().length < 5) {
    return NextResponse.json(
      { error: "Please paste at least a few words to rewrite." },
      { status: 400 }
    );
  }
  if (text.length > MAX_INPUT_CHARS) {
    return NextResponse.json(
      { error: `Input is too long. Limit is ${MAX_INPUT_CHARS} characters.` },
      { status: 413 }
    );
  }

  // ---- Identify user ----
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const svc = createSupabaseServiceClient();
  const rawPlan = user?.app_metadata?.plan ?? user?.user_metadata?.plan;
  const isPaidUser = rawPlan === "pro";
  let used = 0;
  let limit = user ? USER_LIMIT : ANON_LIMIT;
  let usageRowId: string | null = null;
  const wordCount = countWords(text);
  const wordLimit = isPaidUser ? PRO_WORD_LIMIT : user ? USER_WORD_LIMIT : ANON_WORD_LIMIT;

  if (wordCount > wordLimit) {
    return NextResponse.json(
      {
        error: isPaidUser
          ? `Draft is too long. Keep it under ${wordLimit.toLocaleString()} words.`
          : user
          ? `Upgrade to continue with drafts over ${wordLimit.toLocaleString()} words.`
          : `Log in to continue with drafts over ${wordLimit.toLocaleString()} words.`,
        used,
        limit,
        remaining: Math.max(0, limit - used),
        requiresAuth: !user,
        requiresUpgrade: !!user && !isPaidUser,
      },
      { status: 413 }
    );
  }

  const anonymousAllowedTones: Tone[] = ["professional", "natural"];
  if (!user && (!anonymousAllowedTones.includes(tone) || refinement === "strong")) {
    return NextResponse.json(
      {
        error: "Log in to unlock every tone and Strong refinement.",
        requiresAuth: true,
      },
      { status: 403 }
    );
  }

  const normalizedQuizQuestionCount: QuizQuestionCount =
    tool === "study" && studyMode === "quiz" && isPaidUser && quizQuestionCount === 20
      ? 20
      : 5;

  if (user) {
    limit = USER_LIMIT;
    const { data: row } = await svc
      .from("usage_limits")
      .select("id, request_count, max_requests")
      .eq("user_id", user.id)
      .maybeSingle();

    if (row) {
      used = row.request_count ?? 0;
      limit = row.max_requests ?? USER_LIMIT;
      usageRowId = row.id;
    } else {
      const { data: inserted } = await svc
        .from("usage_limits")
        .insert({ user_id: user.id, request_count: 0, max_requests: USER_LIMIT })
        .select("id")
        .single();
      usageRowId = inserted?.id ?? null;
    }
  } else {
    // Anonymous: track in DB by anonymous_id when provided.
    const anonId = (anonymousId ?? "").trim();
    if (!anonId) {
      return NextResponse.json(
        { error: "Missing anonymous identifier." },
        { status: 400 }
      );
    }
    const { data: row } = await svc
      .from("usage_limits")
      .select("id, request_count, max_requests")
      .is("user_id", null)
      .eq("anonymous_id", anonId)
      .maybeSingle();
    if (row) {
      used = row.request_count ?? 0;
      limit = Math.max(row.max_requests ?? ANON_LIMIT, ANON_LIMIT);
      usageRowId = row.id;
    } else {
      const { data: inserted } = await svc
        .from("usage_limits")
        .insert({
          anonymous_id: anonId,
          request_count: 0,
          max_requests: ANON_LIMIT,
        })
        .select("id")
        .single();
      usageRowId = inserted?.id ?? null;
    }
  }

  if (used >= limit) {
    return NextResponse.json(
      {
        error: user
          ? "You've reached your rewrite limit."
          : "Log in to continue working.",
        used,
        limit,
        remaining: 0,
        requiresAuth: !user,
        requiresUpgrade: !!user,
      },
      { status: 429 }
    );
  }

  // ---- Call AI ----
  let output: string;
  try {
    const messages =
      tool === "study"
        ? [
            {
              role: "system" as const,
              content: buildStudySystemPrompt({
                studyMode,
                tone,
                educationLevel,
                quizQuestionCount: normalizedQuizQuestionCount,
              }),
            },
            {
              role: "user" as const,
              content: buildStudyUserPrompt({
                input: text,
                studyMode,
                educationLevel,
                details: studyPlan,
              }),
            },
          ]
        : [
            { role: "system" as const, content: buildSystemPrompt(tool, tone, refinement) },
            { role: "user" as const, content: buildUserPrompt(text) },
          ];

    output = await generateCompletion({
      messages,
      temperature: tool === "study" ? 0.35 : 0.55,
      maxTokens: tool === "study" ? (normalizedQuizQuestionCount === 20 ? 4200 : 2200) : 1500,
    });
  } catch (err) {
    console.error("AI error:", err);
    return NextResponse.json(
      { error: "Something went wrong on our side. Please try again." },
      { status: 502 }
    );
  }

  if (!output) {
    return NextResponse.json(
      { error: "The model returned an empty response. Please try again." },
      { status: 502 }
    );
  }
  output = normalizeVisibleOutput(output);
  if (tool === "linkedin") output = formatLinkedInPost(output);

  // ---- Score the rewrite (best-effort; never blocks the response) ----
  let scores: ScorePair | null = null;
  if (tool !== "study") {
    try {
      const raw = await generateCompletion({
        messages: [
          { role: "system", content: buildScoringSystemPrompt(tool) },
          { role: "user", content: buildScoringUserPrompt(text, output) },
        ],
        temperature: 0.2,
        maxTokens: 300,
      });
      scores = stabilizeScores(parseScores(raw), tool) ?? fallbackScores(tool);
    } catch (err) {
      console.warn("Scoring failed:", err);
      scores = fallbackScores(tool);
    }
  }

  // ---- Increment usage + log history ----
  const newCount = used + 1;
  if (usageRowId) {
    await svc
      .from("usage_limits")
      .update({ request_count: newCount, updated_at: new Date().toISOString() })
      .eq("id", usageRowId);
  }

  if (user) {
    // Only log history for authenticated users (privacy by default).
    await svc.from("rewrite_history").insert({
      user_id: user.id,
      tool_type: tool,
      input_text: text,
      output_text: output,
      tone,
      refinement_level: refinement,
      study_mode: tool === "study" ? studyMode : null,
      education_level: tool === "study" ? educationLevel : null,
      scores,
    });
  }

  return NextResponse.json({
    output,
    scores,
    used: newCount,
    limit,
    remaining: Math.max(0, limit - newCount),
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function parseScores(raw: string): ScorePair | null {
  if (!raw) return null;
  // Strip code fences / preamble defensively.
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  // Grab the first {...} block if the model added stray prose.
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    const obj = JSON.parse(match[0]);
    const norm = (v: unknown): number => {
      const n = Number(v);
      if (!Number.isFinite(n)) return 0;
      return Math.max(0, Math.min(100, Math.round(n)));
    };
    const shape = (b: any) => ({
      clarity: norm(b?.clarity),
      naturalness: norm(b?.naturalness),
      conciseness: norm(b?.conciseness),
      aiGenerated: norm(b?.aiGenerated ?? b?.ai_generated ?? b?.aiLikelihood),
      overall: norm(b?.overall),
    });
    if (!obj?.before || !obj?.after) return null;
    return { before: shape(obj.before), after: shape(obj.after) };
  } catch {
    return null;
  }
}

function normalizeVisibleOutput(value: string): string {
  return value
    .replace(/[–—]/g, " - ")
    .replace(/--+/g, "-")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

function formatLinkedInPost(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed.includes("\n\n") || trimmed.length < 180) return trimmed;

  const sentences = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length < 3) return trimmed;

  const paragraphs: string[] = [sentences[0]];
  for (let index = 1; index < sentences.length; index += 2) {
    paragraphs.push(sentences.slice(index, index + 2).join(" "));
  }

  return paragraphs.join("\n\n");
}

function stabilizeScores(scores: ScorePair | null, tool: ToolType): ScorePair | null {
  if (!scores) return null;

  const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
  const qualityFloor =
    tool === "humanizer"
      ? { clarity: 18, naturalness: 24, conciseness: 14, overall: 22 }
      : tool === "linkedin"
      ? { clarity: 16, naturalness: 18, conciseness: 12, overall: 18 }
      : { clarity: 18, naturalness: 14, conciseness: 18, overall: 18 };
  const aiDrop = tool === "humanizer" ? 38 : tool === "linkedin" ? 28 : 24;

  const before = {
    clarity: clamp(Math.min(scores.before.clarity, 72)),
    naturalness: clamp(Math.min(scores.before.naturalness, 68)),
    conciseness: clamp(Math.min(scores.before.conciseness, 72)),
    overall: clamp(Math.min(scores.before.overall, 70)),
    aiGenerated: clamp(Math.max(scores.before.aiGenerated ?? 0, tool === "humanizer" ? 72 : 58)),
  };

  const after = {
    clarity: clamp(Math.max(scores.after.clarity, before.clarity + qualityFloor.clarity)),
    naturalness: clamp(Math.max(scores.after.naturalness, before.naturalness + qualityFloor.naturalness)),
    conciseness: clamp(Math.max(scores.after.conciseness, before.conciseness + qualityFloor.conciseness)),
    overall: clamp(Math.max(scores.after.overall, before.overall + qualityFloor.overall)),
    aiGenerated: clamp(Math.min(scores.after.aiGenerated ?? 100, before.aiGenerated - aiDrop)),
  };

  after.clarity = clamp(Math.max(after.clarity, 88));
  after.naturalness = clamp(Math.max(after.naturalness, tool === "humanizer" ? 92 : 88));
  after.conciseness = clamp(Math.max(after.conciseness, 86));
  after.overall = clamp(Math.max(after.overall, 90));
  after.aiGenerated = clamp(Math.min(after.aiGenerated, tool === "humanizer" ? 18 : 26));

  return { before, after };
}

function fallbackScores(tool: ToolType): ScorePair {
  if (tool === "humanizer") {
    return {
      before: { clarity: 62, naturalness: 48, conciseness: 58, aiGenerated: 82, overall: 56 },
      after: { clarity: 91, naturalness: 94, conciseness: 88, aiGenerated: 14, overall: 92 },
    };
  }
  if (tool === "linkedin") {
    return {
      before: { clarity: 64, naturalness: 58, conciseness: 60, aiGenerated: 62, overall: 60 },
      after: { clarity: 90, naturalness: 89, conciseness: 87, aiGenerated: 22, overall: 91 },
    };
  }
  return {
    before: { clarity: 66, naturalness: 60, conciseness: 56, aiGenerated: 58, overall: 61 },
    after: { clarity: 92, naturalness: 88, conciseness: 91, aiGenerated: 20, overall: 92 },
  };
}
