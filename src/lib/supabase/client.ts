import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client. Safe to import from Client Components on
 * either the landlord or tenant side — it only ever carries the public
 * anon key and is subject to the database's row-level security. Never
 * add a service-role key here.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
