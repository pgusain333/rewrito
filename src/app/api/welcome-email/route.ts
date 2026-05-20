import { NextResponse } from "next/server";
import { sendWelcomeEmailForUser } from "@/lib/email/welcome";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const result = await sendWelcomeEmailForUser(user);
    return NextResponse.json(result);
  } catch (welcomeError) {
    console.error("Welcome email API failed", welcomeError);
    return NextResponse.json(
      { error: welcomeError instanceof Error ? welcomeError.message : "Welcome email failed" },
      { status: 500 }
    );
  }
}
