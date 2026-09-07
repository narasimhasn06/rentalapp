import { NextResponse } from "next/server";
import { createClient } from "@/server/shared/supabase/server";

// PKCE code exchange -- required for L-01's password-reset email link to
// actually establish a (temporary, recovery-scoped) session; also covers
// sign-up email confirmation if that's ever turned on for this project.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
