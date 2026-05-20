import { redirect } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import { TOOLS, type ToolType } from "@/lib/prompts";
import { ArrowRightIcon } from "@/components/ui/icons";

export const dynamic = "force-dynamic";

type HistoryRow = {
  id: string;
  tool_type: ToolType;
  input_text: string;
  output_text: string;
  tone: string;
  refinement_level: string;
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
      .select("id, tool_type, input_text, output_text, tone, refinement_level, created_at, scores")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const used = usage?.request_count ?? 0;
  const rows = (history ?? []) as HistoryRow[];

  // Average score improvement across history.
  const scored = rows.filter((r) => r.scores);
  const avgImprovement = scored.length
    ? Math.round(
        scored.reduce((sum, r) => sum + (r.scores!.after.overall - r.scores!.before.overall), 0) /
          scored.length
      )
    : null;
  const avgAfter = scored.length
    ? Math.round(scored.reduce((sum, r) => sum + r.scores!.after.overall, 0) / scored.length)
    : null;

  return (
    <>
      <Navbar />
      <main className="bg-bg-soft min-h-[60vh]">
        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-ink-muted">{user.email}</p>
            </div>
            <Link href="/#try" className="btn-primary">
              New rewrite <ArrowRightIcon size={16} />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="card p-6 md:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium uppercase tracking-wide text-ink-muted">
                  Rewrites used
                </h2>
                <span className="text-xs text-ink-muted">{used}</span>
              </div>
              <p className="mt-3 text-sm text-ink-muted">
                Your signed-in rewrites are saved here so you can revisit useful drafts.
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
            <h2 className="mb-4 text-lg font-semibold text-ink">Recent rewrites</h2>
            {rows.length === 0 ? (
              <div className="card p-8 text-center text-sm text-ink-muted">
                Your rewrites will show up here.
              </div>
            ) : (
              <ul className="space-y-3">
                {rows.map((r) => {
                  const delta = r.scores
                    ? r.scores.after.overall - r.scores.before.overall
                    : null;
                  const aiConfidence = r.scores?.after.aiGenerated;
                  return (
                    <li key={r.id} className="card p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="chip !text-[11px]">{TOOLS[r.tool_type]?.name ?? r.tool_type}</span>
                          <span className="text-xs text-ink-subtle">·</span>
                          <span className="text-xs text-ink-muted">{r.tone} · {r.refinement_level}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {r.scores && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-bg-section px-2.5 py-0.5 text-[11px] font-medium text-ink">
                              <span className="text-ink-subtle">{r.scores.before.overall}</span>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="text-ink-subtle"><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></svg>
                              <span className="text-ink">{r.scores.after.overall}</span>
                              {delta !== null && delta !== 0 && (
                                <span className={delta > 0 ? "text-success" : "text-error"}>
                                  {delta > 0 ? "+" : ""}{delta}
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
                            {new Date(r.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                          <div className="field-label">Input</div>
                          <p className="line-clamp-3 text-sm text-ink-muted">{r.input_text}</p>
                        </div>
                        <div>
                          <div className="field-label">Output</div>
                          <p className="line-clamp-3 text-sm text-ink">{r.output_text}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
