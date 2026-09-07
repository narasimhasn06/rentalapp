import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Result of resolving a `/u/:token` URL. See
 * supabase/migrations/*_initial_schema.sql's `resolve_tenant_token`
 * function -- this is a typed mirror of its output, nothing more. The
 * function's own column list is the enforcement point for
 * spec/cross-cutting.md's rule that no tenant-facing data ever includes
 * rent, cost, or another unit/tenant's data: this type can't express
 * those fields because the SQL function never selects them.
 *
 * `door` per spec/decisions.md D1: unit-scoped, grants T-01/T-02 only,
 * blank prefill. `tenant` per D1/D2: grants T-01 through T-05, prefilled
 * with that tenant's identity. `none` covers every invalid case
 * uniformly -- unknown token, altered token, or a former tenant's token
 * after move-out -- spec/cross-cutting.md E1 requires the same "not
 * valid" wording for all of them, never a distinct "wrong kind" message.
 */
export type TenantTokenResolution =
  | {
      tokenType: "door";
      unitId: string;
      tenancyId: null;
      prefillName: null;
      prefillPhone: null;
    }
  | {
      tokenType: "tenant";
      unitId: string;
      tenancyId: string;
      prefillName: string | null;
      prefillPhone: string | null;
    }
  | {
      tokenType: "none";
      unitId: null;
      tenancyId: null;
      prefillName: null;
      prefillPhone: null;
    };

const INVALID: TenantTokenResolution = {
  tokenType: "none",
  unitId: null,
  tenancyId: null,
  prefillName: null,
  prefillPhone: null,
};

interface ResolveTenantTokenRow {
  token_type: "door" | "tenant" | "none";
  unit_id: string | null;
  tenancy_id: string | null;
  prefill_name: string | null;
  prefill_phone: string | null;
}

/**
 * Resolves a tenant-link token via the `resolve_tenant_token` Postgres
 * function -- the only path the public tenant surface has to any data
 * (see the migration's own comments and .claude/rules/tenant-routes.md).
 * Takes a caller-supplied client rather than constructing one, so this
 * works from either the anon-key server client (real requests) or a
 * test client (E4 boundary tests) without change.
 */
export async function resolveTenantToken(
  supabase: SupabaseClient,
  token: string,
): Promise<TenantTokenResolution> {
  const { data, error } = await supabase.rpc("resolve_tenant_token", {
    p_token: token,
  });

  if (error || !data) {
    return INVALID;
  }

  const row = data as ResolveTenantTokenRow;

  if (row.token_type === "door" && row.unit_id) {
    return {
      tokenType: "door",
      unitId: row.unit_id,
      tenancyId: null,
      prefillName: null,
      prefillPhone: null,
    };
  }

  if (row.token_type === "tenant" && row.unit_id && row.tenancy_id) {
    return {
      tokenType: "tenant",
      unitId: row.unit_id,
      tenancyId: row.tenancy_id,
      prefillName: row.prefill_name,
      prefillPhone: row.prefill_phone,
    };
  }

  return INVALID;
}
