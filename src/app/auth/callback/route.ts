import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { sendWelcomeEmail } from "@/lib/email/welcome";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";
  const authError = searchParams.get("error_description") ?? searchParams.get("error");

  if (authError) {
    return NextResponse.redirect(
      `${origin}/?login=1&authError=${encodeURIComponent(authError)}`
    );
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        `${origin}/?login=1&authError=${encodeURIComponent(error.message)}`
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("Could not load authenticated user for welcome email", userError);
    } else if (user) {
      await sendWelcomeEmailIfNeeded(user);
    }
  }
  return NextResponse.redirect(`${origin}${next}`);
}

async function sendWelcomeEmailIfNeeded(user: User) {
  if (!user.email) return;

  try {
    const service = createSupabaseServiceClient();
    const { data: profile, error: profileError } = await service
      .from("profiles")
      .select("welcome_email_sent_at")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Could not read welcome email status", profileError);
      return;
    }

    if (profile?.welcome_email_sent_at) return;

    const result = await sendWelcomeEmail({
      to: user.email,
      idempotencyKey: `welcome-user/${user.id}`,
    });

    if (result.skipped) {
      console.warn(result.reason);
      return;
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
      console.error("Could not mark welcome email as sent", updateError);
    }
  } catch (error) {
    console.error("Welcome email failed", error);
  }
}
