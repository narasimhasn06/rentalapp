import { redirect } from "next/navigation";
import { createClient } from "@/server/shared/supabase/server";
import { SignInForm } from "./signin-form";

// L-01 · Sign in — spec/screens/landlord/L-01-sign-in.md
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Meta: "A signed-in user hitting this route is redirected to L-03."
  if (user) {
    redirect("/");
  }

  const { next } = await searchParams;

  return (
    <div>
      <h2 className="mb-4 text-h2 font-semibold text-ink">Sign in</h2>
      <SignInForm next={next ?? "/"} />
    </div>
  );
}
