import { createClient } from "@/server/shared/supabase/server";
import { RequestResetForm } from "./request-reset-form";
import { NewPasswordForm } from "./new-password-form";

// L-01 · Reset password — spec/screens/landlord/L-01-sign-in.md (route
// "also /reset"). Handles both steps on the one documented route: no
// session -> request an email; arriving via /auth/callback with a
// recovery session -> set a new password. (Not redirected away when
// already signed in, unlike /signin and /signup -- the recovery flow
// necessarily authenticates the visitor.)
export default async function ResetPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h2 className="mb-4 text-h2 font-semibold text-ink">
        {user ? "Set a new password" : "Reset password"}
      </h2>
      {user ? <NewPasswordForm /> : <RequestResetForm />}
    </div>
  );
}
