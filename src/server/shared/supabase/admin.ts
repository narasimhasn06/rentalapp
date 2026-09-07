import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. Bypasses row-level security entirely.
 *
 * This is the most privileged client in the app — reserve it for
 * landlord-side server logic that must legitimately act across a
 * landlord's own records (e.g. generating a receipt number, sending an
 * assistant draft). It must never be imported by anything reachable from
 * the tenant route group; see src/server/README.md and
 * scripts/check-boundaries.mjs.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
