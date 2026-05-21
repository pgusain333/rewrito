import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Logo } from "@/components/ui/Logo";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import {
  EDUCATION_LEVELS,
  STUDY_MODES,
  TOOLS,
  type EducationLevel,
  type StudyMode,
  type ToolType,
} from "@/lib/prompts";
import { FREE_HISTORY_LIMIT, PRO_WORD_LIMIT, USER_WORD_LIMIT } from "@/lib/usage/limits";
import {
  ArrowRightIcon,
  LinkedinIcon,
  MailIcon,
  ShieldCheckIcon,
  SparkleIcon,
  StudyIcon,
  UserIcon,
  WandIcon,
} from "@/components/ui/icons";
import { HistoryCopyButton } from "@/components/tools/HistoryCopyButton";
import { HistoryReopenButton } from "@/components/tools/HistoryReopenButton";

export const dynamic = "force-dynamic";

type HistoryRow = {
  id: string;
  tool_type: ToolType;
  input_text: string;
  output_text: string;
  tone: string;
  refinement_level: string;
  study_mode: StudyMode | null;
  education_level: EducationLevel | null;
  created_at: string;
  scores: {
    before: {
      clarity: number;
      naturalness: number;
      conciseness: number;
      aiGenerated?: number;
      overall: number;
    };
    after: {
      clarity: number;
      naturalness: number;
      conciseness: number;
      aiGenerated?: number;
      overall: number;
    };
  } | null;
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/?login=1");
  }

  const svc = createSupabaseServiceClient();
  const [{ data: usage }, { data: history }] = await Promise.all([
    svc
      .from("usage_limits")
      .select("request_count")
      .eq("user_id", user.id)
      .maybeSingle(),
    svc
      .from("rewrite_history")
      .select(
        "id, tool_type, input_text, output_text, tone, refinement_level, study_mode, education_level, created_at, scores"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(FREE_HISTORY_LIMIT),
  ]);

  const used = usage?.request_count ?? 0;
  const rows = (history ?? []) as HistoryRow[];
  const rawPlan = user.app_metadata?.plan ?? user.user_metadata?.plan;
  const isPro = rawPlan === "pro";
  const hasReachedHistoryWindow = !isPro && rows.length >= FREE_HISTORY_LIMIT;
  const hasLinkedInHistory = rows.some((row) => row.tool_type === "linkedin");
  const hasQuizHistory = rows.some((row) => row.tool_type === "study" && row.study_mode === "quiz");
  const hasFlashcardHistory = rows.some(
    (row) => row.tool_type === "study" && row.study_mode === "flashcards"
  );
  const scored = rows.filter((row) => row.scores);
  const avgImprovement = scored.length
    ? Math.round(
        scored.reduce(
          (sum, row) => sum + (row.scores!.after.overall - row.scores!.before.overall),
          0
        ) / scored.length
      )
    : null;
  const avgAfter = scored.length
    ? Math.round(scored.reduce((sum, row) => sum + row.scores!.after.overall, 0) / scored.length)
    : null;
  const displayName = getDisplayName(user);

  return (
    <>
      <Navbar />
      <main className="bg-bg-soft min-h-[60vh]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 sm:py-14 lg:flex-row lg:items-start">
          <DashboardSidebar email={user.email ?? ""} name={displayName} used={used} />
          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-ink-muted">{user.email}</p>
            </div>
            <Link href="/try" className="btn-primary">
              New session <ArrowRightIcon size={16} />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="card p-6 md:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium uppercase tracking-wide text-ink-muted">
                  Sessions used
                </h2>
                <span className="text-xs text-ink-muted">{used}</span>
              </div>
              <p className="mt-3 text-sm text-ink-muted">
                Your signed-in rewrites and study sessions are saved here so you can revisit useful work.
              </p>

              {avgImprovement !== null && (
                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-ink-muted">
                      Avg. improvement
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span
                        className={`text-2xl font-semibold tracking-tight ${
                          avgImprovement > 0
                            ? "text-success"
                            : avgImprovement < 0
                            ? "text-error"
                            : "text-ink"
                        }`}
                      >
                        {avgImprovement > 0 ? "+" : ""}
                        {avgImprovement}
                      </span>
                      <span className="text-xs text-ink-subtle">pts</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-ink-muted">
                      Avg. rewritten score
                    </div>
                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-2xl font-semibold tracking-tight text-ink">
                        {avgAfter}
                      </span>
                      <span className="text-xs text-ink-subtle">/ 100</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="card relative overflow-hidden p-6">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-brand-gradient" />
              <h2 className="text-sm font-medium uppercase tracking-wide text-ink-muted">
                Your workspace
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                Signed-in sessions support drafts up to {USER_WORD_LIMIT.toLocaleString()} words and keep your latest {FREE_HISTORY_LIMIT} sessions close by.
              </p>
              <Link href="/pricing" className="btn-secondary mt-4 w-full">
                Compare plans
              </Link>
            </div>
          </div>

          <PremiumGuidance
            isPro={isPro}
            hasLinkedInHistory={hasLinkedInHistory}
            hasQuizHistory={hasQuizHistory}
            hasFlashcardHistory={hasFlashcardHistory}
          />

          <section className="mt-10">
            <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-lg font-semibold text-ink">Recent sessions</h2>
                <p className="mt-1 text-sm text-ink-muted">
                  Reopen saved work in the editor or copy the final output.
                </p>
              </div>
              {hasReachedHistoryWindow && (
                <span className="chip w-fit">Showing latest {FREE_HISTORY_LIMIT}</span>
              )}
            </div>
            {rows.length === 0 ? (
              <div className="card p-8 text-center text-sm text-ink-muted">
                Your rewrites and study sessions will show up here.
              </div>
            ) : (
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-[980px] divide-y divide-line text-left text-sm">
                    <thead className="bg-bg-section text-xs uppercase tracking-wide text-ink-muted">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Tool</th>
                        <th className="px-4 py-3 font-semibold">Mode</th>
                        <th className="px-4 py-3 font-semibold">Input</th>
                        <th className="px-4 py-3 font-semibold">Output</th>
                        <th className="px-4 py-3 font-semibold">Score</th>
                        <th className="px-4 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line bg-white">
                      {rows.map((row) => {
                        const isStudy = row.tool_type === "study";
                        const delta = row.scores
                          ? row.scores.after.overall - row.scores.before.overall
                          : null;
                        const aiConfidence = row.scores?.after.aiGenerated;
                        const riskLabel =
                          row.tool_type === "plagiarism" ? "Similarity risk" : "AI confidence";
                        const modeLabel = row.study_mode
                          ? STUDY_MODES.find((mode) => mode.value === row.study_mode)?.label ??
                            row.study_mode
                          : null;
                        const educationLabel = row.education_level
                          ? EDUCATION_LEVELS.find((level) => level.value === row.education_level)
                              ?.label ?? row.education_level
                          : null;
                        const meta = isStudy
                          ? [modeLabel, educationLabel].filter(Boolean).join(" - ")
                          : `${row.tone} - ${row.refinement_level}`;

                        return (
                          <tr key={row.id} className="align-top">
                            <td className="px-4 py-4">
                              <span className="chip !text-[11px]">
                                {TOOLS[row.tool_type]?.name ?? row.tool_type}
                              </span>
                              <p className="mt-2 text-xs text-ink-subtle">
                                {new Date(row.created_at).toLocaleDateString()}
                              </p>
                            </td>
                            <td className="px-4 py-4 text-xs leading-relaxed text-ink-muted">
                              {meta || "Default"}
                            </td>
                            <td className="max-w-[230px] px-4 py-4">
                              <p className="line-clamp-3 text-xs leading-relaxed text-ink-muted">
                                {row.input_text}
                              </p>
                            </td>
                            <td className="max-w-[260px] px-4 py-4">
                              <p className="line-clamp-3 text-xs leading-relaxed text-ink">
                                {row.output_text}
                              </p>
                            </td>
                            <td className="px-4 py-4">
                              {row.scores ? (
                                <div className="space-y-1.5 text-xs">
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-section px-2.5 py-1 font-medium text-ink">
                                    {row.scores.before.overall} to {row.scores.after.overall}
                                    {delta !== null && delta !== 0 && (
                                      <span className={delta > 0 ? "text-success" : "text-error"}>
                                        {delta > 0 ? "+" : ""}
                                        {delta}
                                      </span>
                                    )}
                                  </span>
                                  {typeof aiConfidence === "number" && (
                                    <span className="block text-ink-muted">
                                      {riskLabel} {aiConfidence}%
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-ink-subtle">Study session</span>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex flex-wrap gap-2">
                                <HistoryCopyButton text={row.output_text} />
                                <HistoryReopenButton
                                  session={{
                                    tool: row.tool_type,
                                    input: row.input_text,
                                    output: row.output_text,
                                    tone: row.tone,
                                    refinement: row.refinement_level,
                                    studyMode: row.study_mode,
                                    educationLevel: row.education_level,
                                  }}
                                />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {hasReachedHistoryWindow && (
                  <div className="border-t border-line bg-bg-soft px-4 py-3 text-sm text-ink-muted">
                    Premium history will keep more sessions, versions, and smart next-step guidance.
                  </div>
                )}
              </div>
            )}
          </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function getDisplayName(user: { email?: string | null; user_metadata?: Record<string, unknown> }) {
  const rawName =
    user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.user_metadata?.display_name;
  if (typeof rawName === "string" && rawName.trim()) return rawName.trim().split(/\s+/)[0];
  if (user.email) return user.email.split("@")[0];
  return "there";
}

function PremiumGuidance({
  isPro,
  hasLinkedInHistory,
  hasQuizHistory,
  hasFlashcardHistory,
}: {
  isPro: boolean;
  hasLinkedInHistory: boolean;
  hasQuizHistory: boolean;
  hasFlashcardHistory: boolean;
}) {
  const tips = [
    hasLinkedInHistory
      ? "Next LinkedIn post: turn your strongest recent idea into a short follow-up with one concrete example."
      : "Generate a LinkedIn post, then premium guidance can suggest the next angle from your history.",
    hasQuizHistory
      ? "Next quiz testlet: retest the lowest scoring area first, then mix it back into a general practice set."
      : "Save a quiz score to unlock smarter weak-area practice guidance.",
    hasFlashcardHistory
      ? "Next flashcards: convert missed quiz concepts into a compact recall deck."
      : "Create flashcards from study material so rewrito can recommend the next recall set.",
  ];

  return (
    <section
      className={`mt-6 overflow-hidden rounded-2xl border p-6 ${
        isPro
          ? "border-brand/25 bg-white shadow-soft"
          : "border-line bg-white/70 text-ink-muted"
      }`}
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            Premium guidance
          </p>
          <h2 className="mt-1 text-lg font-semibold text-ink">
            Next best action from your history
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">
            Premium will connect your saved work to smarter next posts, quiz testlets, and flashcard reviews. Longer sessions support drafts up to {PRO_WORD_LIMIT.toLocaleString()} words.
          </p>
        </div>
        {!isPro && (
          <span className="w-fit rounded-full bg-bg-section px-3 py-1 text-xs font-semibold text-ink-muted">
            Preview
          </span>
        )}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {tips.map((tip, index) => (
          <div
            key={tip}
            className={`rounded-xl border p-4 ${
              isPro ? "border-line bg-bg-soft" : "border-line bg-bg-soft opacity-60"
            }`}
          >
            <span className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-softPurple text-xs font-semibold text-brand">
              {index + 1}
            </span>
            <p className="text-sm leading-relaxed text-ink">{tip}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardSidebar({
  email,
  name,
  used,
}: {
  email: string;
  name: string;
  used: number;
}) {
  const navItems = [
    { href: "/try", label: "New session", Icon: WandIcon, active: true },
    { href: "/ai-humanizer", label: "AI Humanizer", Icon: SparkleIcon },
    { href: "/ai-detector", label: "AI Detector", Icon: ShieldCheckIcon },
    { href: "/plagiarism-checker", label: "Plagiarism Checker", Icon: ShieldCheckIcon },
    { href: "/linkedin-rewriter", label: "LinkedIn Rewriter", Icon: LinkedinIcon },
    { href: "/email-rewriter", label: "Email Rewriter", Icon: MailIcon },
    { href: "/study-assistant", label: "Rewrito Study", Icon: StudyIcon, badge: "New" },
    { href: "/dashboard", label: "Dashboard", Icon: UserIcon },
  ];

  return (
    <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-72">
      <div className="card overflow-hidden p-4">
        <div className="mb-5 flex items-center justify-between">
          <Logo size={38} />
        </div>
        <div className="rounded-2xl bg-bg-section p-4">
          <p className="text-sm font-semibold text-ink">Hi, {name}</p>
          <p className="mt-1 truncate text-xs text-ink-muted">{email}</p>
        </div>
        <nav aria-label="Dashboard tools" className="mt-5 space-y-1.5">
          {navItems.map(({ href, label, Icon, active, badge }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-brand-softPurple text-brand"
                  : "text-ink-muted hover:bg-bg-section hover:text-ink"
              }`}
            >
              <Icon size={17} />
              <span className="min-w-0 flex-1 truncate">{label}</span>
              {badge && (
                <span className="rounded-full bg-brand-softPurple px-2 py-0.5 text-[10px] font-bold text-brand">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-5 rounded-2xl border border-line bg-bg-soft p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-muted">
            <span>Saved workspace</span>
            <span>{USER_WORD_LIMIT.toLocaleString()} words</span>
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-ink">
            {used}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-ink-muted">
            Sessions created. Your latest {FREE_HISTORY_LIMIT} are kept here on the free plan.
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand"
          >
            Upgrade for more
            <ArrowRightIcon size={12} />
          </Link>
        </div>
      </div>
    </aside>
  );
}
