import type { User } from "@supabase/supabase-js";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

const RESEND_EMAILS_ENDPOINT = "https://api.resend.com/emails";

const subject = "Welcome to rewrito - your writing and study workspace";

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rewrito.ai").replace(/\/$/, "");
}

function reviewUrl() {
  return (process.env.REWRITO_REVIEW_URL ?? siteUrl()).replace(/\/$/, "");
}

function buildWelcomeEmailHtml() {
  const appUrl = siteUrl();
  const ratingUrl = reviewUrl();

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f6f8fc;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <div style="display:none;max-height:0;overflow:hidden;color:transparent;">
      Explore rewrito's five tools for writing, reviewing, and studying with more clarity.
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f8fc;padding:28px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:22px;overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 12px;">
                <div style="font-size:22px;font-weight:700;letter-spacing:-0.02em;color:#111827;">rewrito</div>
                <h1 style="margin:24px 0 12px;font-size:28px;line-height:1.2;letter-spacing:-0.03em;color:#111827;">
                  Welcome to your clearer writing workspace.
                </h1>
                <p style="margin:0;font-size:15px;line-height:1.7;color:#6b7280;">
                  rewrito helps you turn rough drafts, AI-written text, emails, LinkedIn posts, and study material into work that is easier to read, review, and trust.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 28px 6px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  ${toolRow("AI Humanizer", "Make AI-generated text sound natural, specific, and professional.")}
                  ${toolRow("AI Detector Score", "Check detector-style confidence and understand what makes writing feel AI-written.")}
                  ${toolRow("LinkedIn Post Rewriter", "Turn rough notes into polished LinkedIn posts with stronger hooks and cleaner flow.")}
                  ${toolRow("Professional Email Rewriter", "Rewrite emails so they feel concise, polite, and confident.")}
                  ${toolRow("Rewrito Study", "Explain concepts, create quizzes, build flashcards, organize notes, and prepare study plans.")}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 8px;">
                <p style="margin:0;font-size:15px;line-height:1.7;color:#6b7280;">
                  rewrito is also built to teach. As you use it, you will see clearer patterns in your own writing, so each next draft gets easier.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 28px 8px;">
                <a href="${appUrl}/try" style="display:inline-block;background:linear-gradient(90deg,#7c3aed,#06b6d4);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 20px;border-radius:14px;">
                  Start using rewrito
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 28px;">
                <div style="border-top:1px solid #e5e7eb;padding-top:18px;">
                  <p style="margin:0 0 10px;font-size:14px;line-height:1.7;color:#6b7280;">
                    If rewrito helps you write or study better, a 5-star rating would mean a lot. It helps other writers, students, and professionals discover a clearer way to work.
                  </p>
                  <a href="${ratingUrl}" style="color:#7c3aed;text-decoration:none;font-size:14px;font-weight:700;">Leave a 5-star rating</a>
                </div>
              </td>
            </tr>
          </table>
          <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">
            You are receiving this because you created or signed in to a rewrito account.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function toolRow(title: string, body: string) {
  return `<tr>
    <td style="padding:10px 0;">
      <div style="border:1px solid #e5e7eb;border-radius:16px;padding:14px 16px;background:#fbfcff;">
        <div style="font-size:14px;font-weight:700;color:#111827;">${title}</div>
        <div style="margin-top:5px;font-size:13px;line-height:1.6;color:#6b7280;">${body}</div>
      </div>
    </td>
  </tr>`;
}

function buildWelcomeEmailText() {
  return `Welcome to rewrito.

rewrito helps you turn rough drafts, AI-written text, emails, LinkedIn posts, and study material into work that is easier to read, review, and trust.

Inside rewrito:

AI Humanizer - Make AI-generated text sound natural, specific, and professional.
AI Detector Score - Check detector-style confidence and understand what makes writing feel AI-written.
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
