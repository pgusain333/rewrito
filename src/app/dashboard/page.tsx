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
import { USER_LIMIT } from "@/lib/usage/limits";
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
      .limit(10),
  ]);

  const used = usage?.request_count ?? 0;
  const rows = (history ?? []) as HistoryRow[];
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
                Upgrade
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                Premium plans with higher limits, saved history, and longer inputs are coming soon.
              </p>
              <Link href="/pricing" className="btn-secondary mt-4 w-full">
                Join waitlist
              </Link>
            </div>
          </div>

          <section className="mt-10">
            <h2 className="mb-4 text-lg font-semibold text-ink">Recent sessions</h2>
            {rows.length === 0 ? (
              <div className="card p-8 text-center text-sm text-ink-muted">
                Your rewrites and study sessions will show up here.
              </div>
            ) : (
              <ul className="space-y-3">
                {rows.map((row) => {
                  const isStudy = row.tool_type === "study";
                  const delta = row.scores
                    ? row.scores.after.overall - row.scores.before.overall
                    : null;
                  const aiConfidence = row.scores?.after.aiGenerated;
                  const modeLabel = row.study_mode
                    ? STUDY_MODES.find((mode) => mode.value === row.study_mode)?.label ?? row.study_mode
                    : null;
                  const educationLabel = row.education_level
                    ? EDUCATION_LEVELS.find((level) => level.value === row.education_level)?.label ??
                      row.education_level
                    : null;
                  const meta = isStudy
                    ? [modeLabel, educationLabel].filter(Boolean).join(" - ")
                    : `${row.tone} - ${row.refinement_level}`;

                  return (
                    <li key={row.id} className="card p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="chip !text-[11px]">
                            {TOOLS[row.tool_type]?.name ?? row.tool_type}
                          </span>
                          <span className="text-xs text-ink-subtle">-</span>
                          <span className="text-xs text-ink-muted">{meta}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <HistoryCopyButton text={row.output_text} />
                          {row.scores && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-section px-2.5 py-0.5 text-[11px] font-medium text-ink">
                              <span className="text-ink-subtle">{row.scores.before.overall}</span>
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden
                                className="text-ink-subtle"
                              >
                                <path d="M5 12h14" />
                                <path d="m13 5 7 7-7 7" />
                              </svg>
                              <span className="text-ink">{row.scores.after.overall}</span>
                              {delta !== null && delta !== 0 && (
                                <span className={delta > 0 ? "text-success" : "text-error"}>
                                  {delta > 0 ? "+" : ""}
                                  {delta}
                                </span>
                              )}
                            </span>
                          )}
                          {typeof aiConfidence === "number" && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-section px-2.5 py-0.5 text-[11px] font-medium text-ink-muted">
                              AI {aiConfidence}%
                            </span>
                          )}
                          <span className="text-xs text-ink-subtle">
                            {new Date(row.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                          <div className="field-label">
                            {isStudy ? "Study material" : "Input"}
                          </div>
                          <p className="line-clamp-3 text-sm text-ink-muted">{row.input_text}</p>
                        </div>
                        <div>
                          <div className="field-label">
                            {isStudy ? "Study response" : "Output"}
                          </div>
                          <p className="line-clamp-3 text-sm text-ink">{row.output_text}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
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

function DashboardSidebar({
  email,
  name,
  used,
}: {
  email: string;
  name: string;
  used: number;
}) {
  const remaining = Math.max(0, USER_LIMIT - used);
  const progress = Math.min(100, Math.round((used / USER_LIMIT) * 100));
  const navItems = [
    { href: "/try", label: "New session", Icon: WandIcon, active: true },
    { href: "/ai-humanizer", label: "AI Humanizer", Icon: SparkleIcon },
    { href: "/ai-detector", label: "AI Detector", Icon: ShieldCheckIcon },
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
            <span>Sessions remaining</span>
            <span>{remaining}</span>
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-ink">
            {used} / {USER_LIMIT}
          </div>
          <div className="mt-3 h-2 rounded-full bg-line">
            <div
              className="h-full rounded-full bg-brand-gradient"
              style={{ width: `${progress}%` }}
            />
          </div>
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
