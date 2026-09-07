import "server-only";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server Supabase client for Server Components, Server Actions and Route
 * Handlers. Carries the caller's session via cookies and is subject to
 * row-level security — this is the client both the landlord and tenant
 * server-side code should reach for by default. It is marked
 * `server-only` so any accidental import from a Client Component fails
 * the build rather than leaking credentials into the browser bundle.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[],
        ) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component with no request context to
            // write to — safe to ignore when session refresh is handled
            // in middleware.
          }
        },
      },
    },
  );
}
