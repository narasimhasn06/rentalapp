"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/server/shared/supabase/server";
import { createAdminClient } from "@/server/shared/supabase/admin";

// L-01 rule: "After five failed attempts, add a 30-second delay and say
// so plainly." (spec/screens/landlord/L-01-sign-in.md)
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_SECONDS = 30;

const GENERIC_SIGNIN_ERROR = "Email or password is incorrect.";

export interface AuthActionState {
  error?: string;
}

export interface ResetActionState {
  submitted: boolean;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// landlord_signin_attempt has zero RLS policies (see the migration) --
// reached only through the admin client, which is fine here: this tree
// is app/(auth)/**, not the tenant route group admin.ts's own docstring
// forbids.
async function checkLockout(email: string): Promise<string | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("landlord_signin_attempt")
    .select("locked_until")
    .eq("email", email)
    .maybeSingle();

  if (data?.locked_until && new Date(data.locked_until).getTime() > Date.now()) {
    return `Too many attempts. Please wait ${LOCKOUT_SECONDS} seconds and try again.`;
  }
  return null;
}

async function recordFailure(email: string): Promise<void> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("landlord_signin_attempt")
    .select("failed_count")
    .eq("email", email)
    .maybeSingle();

  const failedCount = (data?.failed_count ?? 0) + 1;
  const lockedUntil =
    failedCount >= LOCKOUT_THRESHOLD
      ? new Date(Date.now() + LOCKOUT_SECONDS * 1000).toISOString()
      : null;

  await admin.from("landlord_signin_attempt").upsert({
    email,
    failed_count: failedCount,
    locked_until: lockedUntil,
    updated_at: new Date().toISOString(),
  });
}

async function clearFailures(email: string): Promise<void> {
  const admin = createAdminClient();
  await admin.from("landlord_signin_attempt").delete().eq("email", email);
}

export async function signIn(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/");

  if (!email || !password) {
    return { error: GENERIC_SIGNIN_ERROR };
  }

  const lockoutMessage = await checkLockout(email);
  if (lockoutMessage) {
    return { error: lockoutMessage };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    await recordFailure(email);
    // L-01 rule: "Never say which one is wrong."
    return { error: GENERIC_SIGNIN_ERROR };
  }

  await clearFailures(email);
  redirect(next.startsWith("/") ? next : "/");
}

export async function signUp(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");

  if (!email) {
    return { error: "Email is required." };
  }

  // L-01 rule: "Password minimum 8 characters on sign-up."
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}

export async function requestReset(
  _prevState: ResetActionState,
  formData: FormData,
): Promise<ResetActionState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));

  if (email) {
    const supabase = await createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://127.0.0.1:3000";
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/reset`,
    });
  }

  // L-01 rule: "Sending a reset always shows the same confirmation
  // whether or not the email exists" -- so this always reports success,
  // never leaking whether the address has an account.
  return { submitted: true };
}

export async function updatePassword(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/");
}
