import { redirect } from "next/navigation";
import { createClient } from "@/server/shared/supabase/server";
import { SignUpForm } from "./signup-form";

// L-01 · Sign up — spec/screens/landlord/L-01-sign-in.md (route "also
// /signup")
export default async function SignUpPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div>
      <h2 className="mb-4 text-h2 font-semibold text-ink">Create an account</h2>
      <SignUpForm />
    </div>
  );
}
