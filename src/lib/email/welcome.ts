import type { User } from "@supabase/supabase-js";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

const RESEND_EMAILS_ENDPOINT = "https://api.resend.com/emails";
const LOGO_URL = "https://www.rewrito.ai/rewrito-logo.png";

const subject = "Welcome to rewrito - your writing and study workspace";

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rewrito.ai")
    .replace(/\/$/, "")
    .replace(/^https:\/\/www\.rewrito\.ai$/i, "https://rewrito.ai");
}

function reviewUrl() {
  return (process.env.REWRITO_REVIEW_URL ?? siteUrl()).replace(/\/$/, "");
}

function buildWelcomeEmailHtml() {
  const appUrl = siteUrl();
  const ratingUrl = reviewUrl();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <style>
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { border-collapse: collapse; }
      img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
      @media screen and (max-width: 640px) {
        .email-bg { padding: 18px 10px !important; }
        .email-shell { border-radius: 18px !important; }
        .section-pad { padding-left: 18px !important; padding-right: 18px !important; }
        .hero-title { font-size: 30px !important; line-height: 1.12 !important; }
        .tool-cell { display: block !important; width: 100% !important; padding-right: 0 !important; }
        .tool-cell + .tool-cell { padding-top: 10px !important; }
        .metric-cell { display: block !important; width: 100% !important; padding-right: 0 !important; padding-bottom: 10px !important; }
        .cta-button { display: block !important; text-align: center !important; }
      }
      @media (prefers-color-scheme: dark) {
        body, .email-bg { background: #070b16 !important; }
        .email-shell, .card, .tool-card, .rating-card { background: #111827 !important; border-color: #273244 !important; }
        .hero-panel { background: #0f172a !important; }
        .logo-holder { background: transparent !important; border-color: #273244 !important; }
        .logo-img { filter: invert(1) brightness(1.7) contrast(1.05) !important; }
        .text-main { color: #f8fafc !important; }
        .text-muted { color: #cbd5e1 !important; }
        .text-subtle { color: #94a3b8 !important; }
      }
      [data-ogsc] body, [data-ogsc] .email-bg { background: #070b16 !important; }
      [data-ogsc] .email-shell, [data-ogsc] .card, [data-ogsc] .tool-card, [data-ogsc] .rating-card { background: #111827 !important; border-color: #273244 !important; }
      [data-ogsc] .logo-holder { background: transparent !important; border-color: #273244 !important; }
      [data-ogsc] .logo-img { filter: invert(1) brightness(1.7) contrast(1.05) !important; }
      [data-ogsc] .text-main { color: #f8fafc !important; }
      [data-ogsc] .text-muted { color: #cbd5e1 !important; }
      [data-ogsc] .text-subtle { color: #94a3b8 !important; }
    </style>
  </head>
  <body style="margin:0;background:#f6f8fc;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <div style="display:none;max-height:0;overflow:hidden;color:transparent;opacity:0;">
      Explore rewrito's seven tools for writing, reviewing, originality checking, grammar, and studying with more clarity.
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-bg" style="background:#f6f8fc;padding:34px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-shell" style="max-width:680px;background:#ffffff;border:1px solid #e5e7eb;border-radius:26px;overflow:hidden;box-shadow:0 24px 80px rgba(17,24,39,0.10);">
            <tr>
              <td class="hero-panel" style="background:#f8fbff;background-image:linear-gradient(135deg,rgba(124,58,237,0.12),rgba(6,182,212,0.12));padding:26px 28px 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-bottom:26px;">
                      <span class="logo-holder" style="display:inline-block;background:#ffffff;border:1px solid rgba(229,231,235,0.95);border-radius:16px;padding:10px 14px;box-shadow:0 10px 30px rgba(17,24,39,0.08);">
                        <img class="logo-img" src="${LOGO_URL}" width="154" alt="rewrito" style="display:block;width:154px;max-width:154px;">
                      </span>
                    </td>
                    <td align="right" style="padding-bottom:26px;">
                      <span style="display:inline-block;background:#ffffff;border:1px solid #e5e7eb;border-radius:999px;padding:8px 12px;color:#7c3aed;font-size:12px;font-weight:700;">
                        New workspace ready
                      </span>
                    </td>
                  </tr>
                </table>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td class="section-pad" style="padding:0 0 28px;">
                      <h1 class="hero-title text-main" style="margin:0;font-size:38px;line-height:1.08;letter-spacing:-0.04em;color:#111827;">
                        Welcome to clearer writing, smarter review, and calmer study.
                      </h1>
                      <p class="text-muted" style="margin:16px 0 0;font-size:16px;line-height:1.7;color:#64748b;">
                        rewrito helps you turn rough drafts, AI-written text, emails, LinkedIn posts, and study material into work that is easier to read, review, and trust.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="section-pad" style="padding:26px 28px 8px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="card" style="background:#fbfcff;border:1px solid #e5e7eb;border-radius:20px;">
                  <tr>
                    <td style="padding:18px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          ${metricBlock("7", "focused tools", "#7c3aed")}
                          ${metricBlock("1", "clean workspace", "#06b6d4")}
                          ${metricBlock("AI", "writing guidance", "#10b981")}
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="section-pad" style="padding:14px 28px 0;">
                <h2 class="text-main" style="margin:0 0 12px;font-size:20px;line-height:1.3;color:#111827;">Your toolkit is ready</h2>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    ${toolCard("AI Humanizer", "Make AI-generated text sound natural, specific, and professional.", "#f3e8ff", "#7c3aed")}
                    ${toolCard("AI Detector Score", "Check detector-style confidence before sharing your writing.", "#fff7ed", "#f59e0b")}
                  </tr>
                  <tr>
                    ${toolCard("Grammar Checker", "Fix grammar, punctuation, clarity, and flow without losing your voice.", "#f3e8ff", "#7c3aed")}
                    ${toolCard("Plagiarism Checker", "Review originality risk, copied-sounding wording, and citation needs.", "#ecfdf5", "#10b981")}
                  </tr>
                  <tr>
                    ${toolCard("LinkedIn Rewriter", "Turn rough notes into polished posts with stronger hooks.", "#e0f7ff", "#06b6d4")}
                    ${toolCard("Email Rewriter", "Rewrite emails so they feel concise, polite, and confident.", "#f8fafc", "#111827")}
                  </tr>
                  <tr>
                    <td class="tool-cell" style="padding:6px 0 0;padding-left:6px;">
                      <div class="tool-card" style="border:1px solid #e5e7eb;border-radius:18px;background:#ffffff;padding:16px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="width:42px;vertical-align:top;">
                              <span style="display:inline-block;width:34px;height:34px;border-radius:12px;background:#ecfdf5;color:#10b981;text-align:center;line-height:34px;font-size:17px;font-weight:800;">S</span>
                            </td>
                            <td>
                              <div class="text-main" style="font-size:15px;font-weight:800;color:#111827;">Rewrito Study</div>
                              <div class="text-muted" style="margin-top:5px;font-size:13px;line-height:1.6;color:#64748b;">Explain concepts, create quizzes, build flashcards, organize notes, and prepare study plans.</div>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="section-pad" style="padding:22px 28px 6px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="card" style="background:#fbfcff;border:1px solid #e5e7eb;border-radius:20px;">
                  <tr>
                    <td style="padding:18px;">
                      <div class="text-main" style="font-size:16px;font-weight:800;color:#111827;">Built to help you improve over time</div>
                      <p class="text-muted" style="margin:8px 0 0;font-size:14px;line-height:1.7;color:#64748b;">
                        rewrito does more than rewrite. It shows cleaner structure, stronger wording, and better review patterns, so each next draft gets easier.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="section-pad" style="padding:22px 28px 8px;">
                <a class="cta-button" href="${appUrl}/try" style="display:inline-block;background:#7c3aed;background-image:linear-gradient(90deg,#7c3aed,#06b6d4);color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;padding:15px 22px;border-radius:15px;box-shadow:0 12px 24px rgba(124,58,237,0.24);">
                  Start using rewrito
                </a>
              </td>
            </tr>
            <tr>
              <td class="section-pad" style="padding:20px 28px 30px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="rating-card" style="border:1px solid #e5e7eb;border-radius:20px;background:#ffffff;">
                  <tr>
                    <td style="padding:18px;">
                      <div style="font-size:26px;letter-spacing:2px;color:#f59e0b;line-height:1;">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                      <p class="text-muted" style="margin:12px 0 12px;font-size:14px;line-height:1.7;color:#64748b;">
                        If rewrito helps you write or study better, a 5-star rating would mean a lot. It helps other writers, students, and professionals discover a clearer way to work.
                      </p>
                      <a href="${ratingUrl}" style="color:#7c3aed;text-decoration:none;font-size:14px;font-weight:800;">Leave a 5-star rating</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <p class="text-subtle" style="margin:16px 0 0;font-size:12px;color:#9ca3af;">
            You are receiving this because you created or signed in to a rewrito account.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function metricBlock(value: string, label: string, color: string) {
  return `<td class="metric-cell" width="33.33%" style="padding-right:10px;vertical-align:top;">
    <div class="card" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:14px;text-align:center;">
      <div style="font-size:24px;font-weight:900;color:${color};line-height:1;">${value}</div>
      <div class="text-muted" style="margin-top:6px;font-size:12px;font-weight:700;color:#64748b;">${label}</div>
    </div>
  </td>`;
}

function toolCard(title: string, body: string, iconBg: string, iconColor: string) {
  return `<td class="tool-cell" width="50%" style="padding:6px 6px 6px 0;vertical-align:top;">
    <div class="tool-card" style="border:1px solid #e5e7eb;border-radius:18px;background:#ffffff;padding:16px;min-height:112px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td style="width:42px;vertical-align:top;">
            <span style="display:inline-block;width:34px;height:34px;border-radius:12px;background:${iconBg};color:${iconColor};text-align:center;line-height:34px;font-size:16px;font-weight:900;">${title.slice(0, 1)}</span>
          </td>
          <td>
            <div class="text-main" style="font-size:15px;font-weight:800;color:#111827;">${title}</div>
            <div class="text-muted" style="margin-top:5px;font-size:13px;line-height:1.6;color:#64748b;">${body}</div>
          </td>
        </tr>
      </table>
    </div>
  </td>`;
}

function buildWelcomeEmailText() {
  return `Welcome to rewrito.

rewrito helps you turn rough drafts, AI-written text, emails, LinkedIn posts, and study material into work that is easier to read, review, and trust.

Inside rewrito:

AI Humanizer - Make AI-generated text sound natural, specific, and professional.
AI Detector Score - Check detector-style confidence and understand what makes writing feel AI-written.
Grammar Checker - Fix grammar, punctuation, clarity, and flow without losing your voice.
Plagiarism Checker - Review originality risk, copied-sounding wording, and citation needs.
LinkedIn Post Rewriter - Turn rough notes into polished LinkedIn posts with stronger hooks and cleaner flow.
Professional Email Rewriter - Rewrite emails so they feel concise, polite, and confident.
Rewrito Study - Explain concepts, create quizzes, build flashcards, organize notes, and prepare study plans.

rewrito is also built to teach. As you use it, you will see clearer patterns in your own writing, so each next draft gets easier.

Start using rewrito:
${siteUrl()}/try

If rewrito helps you write or study better, a 5-star rating would mean a lot:
${reviewUrl()}
`;
}

export async function sendWelcomeEmail({
  to,
  idempotencyKey,
}: {
  to: string;
  idempotencyKey: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { skipped: true, reason: "RESEND_API_KEY is not configured" };
  }

  const from = process.env.RESEND_FROM ?? "rewrito <hello@rewrito.ai>";
  const response = await fetch(RESEND_EMAILS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
      "User-Agent": "rewrito/1.0",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html: buildWelcomeEmailHtml(),
      text: buildWelcomeEmailText(),
      tags: [{ name: "email_type", value: "welcome" }],
    }),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const details =
      payload && typeof payload === "object" ? JSON.stringify(payload) : response.statusText;
    throw new Error(`Resend welcome email failed (${response.status}): ${details}`);
  }

  return { skipped: false, id: payload?.id as string | undefined };
}

export async function sendWelcomeEmailForUser(user: User) {
  if (!user.email) {
    return { sent: false, reason: "Authenticated user has no email address" };
  }

  const service = createSupabaseServiceClient();
  const { data: profile, error: profileError } = await service
    .from("profiles")
    .select("welcome_email_sent_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(`Could not read welcome email status: ${profileError.message}`);
  }

  if (profile?.welcome_email_sent_at) {
    return { sent: false, reason: "Welcome email already sent" };
  }

  const result = await sendWelcomeEmail({
    to: user.email,
    idempotencyKey: `welcome-user/${user.id}`,
  });

  if (result.skipped) {
    return { sent: false, reason: result.reason };
  }

  const { error: updateError } = await service.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      welcome_email_sent_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (updateError) {
    throw new Error(`Could not mark welcome email as sent: ${updateError.message}`);
  }

  return { sent: true, id: result.id };
}
