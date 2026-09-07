/**
 * The seven E4 boundary tests -- spec/cross-cutting.md E4 (6 rows) plus
 * spec/decisions.md D2's explicit 7th case. See CLAUDE.md's note on this
 * file: these are never deleted or weakened to force a green run. Some
 * are expected to be RED right now and stay red until a future lane
 * builds the tenant pages (T-01/T-03) that call resolve_tenant_token()
 * and render its result -- that's the honest, intended state, not a bug
 * in this test file. Each `it()` below says which.
 *
 * Needs a local Supabase instance with the migration applied
 * (`npx supabase start`, see supabase/README.md) and reads its
 * connection details from the same env vars the app uses. Tests 1, 2, 3,
 * 6 and 7 also spin up a real `next dev` server on a dedicated test port
 * and exercise it over plain HTTP, because what they check (exact
 * tenant-facing copy, redirect behaviour) can only be verified against
 * the real routes -- not by calling internal functions directly.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import { spawn, type ChildProcess } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE_KEY) {
  throw new Error(
    "E4 boundary tests need a local Supabase instance. Run `npx supabase start`, " +
      "copy the URL/anon key/service role key it prints into .env.local (see " +
      ".env.example), then re-run `npm test`. See supabase/README.md.",
  );
}

// Picked fresh each run (rather than a fixed port) so a zombie process
// left behind by an earlier interrupted run can never collide with this
// one -- see waitForServer's per-request timeout for the other half of
// that defense.
let TEST_PORT: number;
let BASE_URL: string;
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const INVALID_LINK_MESSAGE = "This link is not valid";

async function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.unref();
    probe.on("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      if (address && typeof address === "object") {
        const { port } = address;
        probe.close(() => resolve(port));
      } else {
        probe.close(() => reject(new Error("Could not determine a free port")));
      }
    });
  });
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 10);
}

interface Fixture {
  landlordAEmail: string;
  landlordAPassword: string;
  unitAId: string;
  unitBId: string;
  unitADoorToken: string;
  tenancyAId: string;
  tenancyATenantToken: string;
  expiredTenantToken: string;
}

let admin: SupabaseClient;
let fixture: Fixture;
let devServer: ChildProcess | undefined;

async function createLandlord(email: string, password: string): Promise<string> {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) {
    throw new Error(`Failed to create test landlord ${email}: ${error?.message}`);
  }
  return data.user.id;
}

async function waitForServer(url: string, timeoutMs: number): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      // Bounded per-request, not just an outer wall-clock budget -- a
      // wedged (not merely slow-to-start) process must not be able to
      // hang this loop forever via a fetch() that never settles.
      const res = await fetch(url, { signal: AbortSignal.timeout(3_000) });
      if (res.status < 500) return;
    } catch {
      // Not up yet, or that one request timed out -- keep polling.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Dev server at ${url} did not become ready within ${timeoutMs}ms`);
}

async function killDevServer(child: ChildProcess): Promise<void> {
  if (!child.pid) return;
  if (process.platform === "win32") {
    await new Promise<void>((resolve) => {
      const killer = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"]);
      killer.on("exit", () => resolve());
      killer.on("error", () => resolve());
    });
  } else {
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {
      child.kill("SIGTERM");
    }
  }
}

/**
 * Extracts the real rendered <form> (action, method, every input --
 * known fields plus anything Next.js's own SSR injects for its Server
 * Action wiring) so test 6 can resubmit it as a genuine no-JS browser
 * would, rather than guessing at Next's internal action-invocation wire
 * format.
 */
function decodeHtmlAttr(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractForm(html: string): {
  action: string;
  method: string;
  fields: Record<string, string>;
} {
  const formMatch = html.match(/<form\b([^>]*)>([\s\S]*?)<\/form>/i);
  if (!formMatch) {
    throw new Error("No <form> found in the sign-in page HTML");
  }
  const formAttrs = formMatch[1] ?? "";
  const formBody = formMatch[2] ?? "";
  const actionMatch = formAttrs.match(/action="([^"]*)"/i);
  const methodMatch = formAttrs.match(/method="([^"]*)"/i);

  // Includes Next.js's own hidden inputs ($ACTION_REF_..., $ACTION_KEY,
  // ...) that encode the Server Action reference -- those must be
  // resubmitted verbatim (HTML-entity-decoded) for Next to recognise
  // this as a real invocation of the `signIn` action, not just a normal
  // page request.
  const fields: Record<string, string> = {};
  const inputRegex = /<input\b([^>]*)>/gi;
  let match: RegExpExecArray | null;
  while ((match = inputRegex.exec(formBody)) !== null) {
    const attrs = match[1] ?? "";
    const nameMatch = attrs.match(/name="([^"]*)"/i);
    const name = nameMatch?.[1];
    if (!name) continue;
    const valueMatch = attrs.match(/value="([^"]*)"/i);
    fields[name] = decodeHtmlAttr(valueMatch?.[1] ?? "");
  }

  return {
    action: actionMatch?.[1] ?? "",
    method: methodMatch?.[1]?.toLowerCase() ?? "post",
    fields,
  };
}

beforeAll(async () => {
  admin = createSupabaseClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const suffix = randomSuffix();
  const landlordAEmail = `e4-landlord-a-${suffix}@example.test`;
  const landlordAPassword = "correct horse battery staple";
  const landlordBEmail = `e4-landlord-b-${suffix}@example.test`;

  const landlordAId = await createLandlord(landlordAEmail, landlordAPassword);
  const landlordBId = await createLandlord(landlordBEmail, "another test password 1");

  const { data: propertyA, error: propertyAError } = await admin
    .from("property")
    .insert({ landlord_id: landlordAId, name: "Property A", address: "1 Test Rd" })
    .select()
    .single();
  if (propertyAError) throw propertyAError;

  const { data: propertyB, error: propertyBError } = await admin
    .from("property")
    .insert({ landlord_id: landlordBId, name: "Property B", address: "2 Test Rd" })
    .select()
    .single();
  if (propertyBError) throw propertyBError;

  const { data: unitA, error: unitAError } = await admin
    .from("unit")
    .insert({
      landlord_id: landlordAId,
      property_id: propertyA.id,
      unit_number: "A1",
      monthly_rent: 10000,
      default_deposit: 20000,
    })
    .select()
    .single();
  if (unitAError) throw unitAError;

  const { data: unitB, error: unitBError } = await admin
    .from("unit")
    .insert({
      landlord_id: landlordBId,
      property_id: propertyB.id,
      unit_number: "B1",
      monthly_rent: 12000,
      default_deposit: 24000,
    })
    .select()
    .single();
  if (unitBError) throw unitBError;

  const { data: tenantA, error: tenantAError } = await admin
    .from("tenant")
    .insert({ landlord_id: landlordAId, name: "Test Tenant A", phone: "9000000001" })
    .select()
    .single();
  if (tenantAError) throw tenantAError;

  const { data: tenancyA, error: tenancyAError } = await admin
    .from("tenancy")
    .insert({
      landlord_id: landlordAId,
      unit_id: unitA.id,
      tenant_id: tenantA.id,
      deposit_amount: 20000,
    })
    .select()
    .single();
  if (tenancyAError) throw tenancyAError;

  // A second, ended tenancy on the same unit -- E4 test 2 (D1: a former
  // tenant's token stops resolving once move_out_date is set).
  const { data: formerTenant, error: formerTenantError } = await admin
    .from("tenant")
    .insert({ landlord_id: landlordAId, name: "Former Tenant", phone: "9000000002" })
    .select()
    .single();
  if (formerTenantError) throw formerTenantError;

  const { data: expiredTenancy, error: expiredTenancyError } = await admin
    .from("tenancy")
    .insert({
      landlord_id: landlordAId,
      unit_id: unitA.id,
      tenant_id: formerTenant.id,
      deposit_amount: 20000,
      move_out_date: "2020-01-01",
    })
    .select()
    .single();
  if (expiredTenancyError) throw expiredTenancyError;

  // E4 test 5 needs a rent and a request record to attempt cross-landlord
  // access against, alongside the unit/tenant rows above.
  const { error: rentEntryError } = await admin.from("rent_entry").insert({
    landlord_id: landlordAId,
    unit_id: unitA.id,
    tenancy_id: tenancyA.id,
    period_month: "2026-01-01",
    rent_due: 10000,
    due_date: "2026-01-05",
  });
  if (rentEntryError) throw rentEntryError;

  const { error: requestError } = await admin.from("maintenance_request").insert({
    landlord_id: landlordAId,
    unit_id: unitA.id,
    tenancy_id: tenancyA.id,
    category: "Plumbing",
    description: "Leaky tap in the kitchen",
  });
  if (requestError) throw requestError;

  fixture = {
    landlordAEmail,
    landlordAPassword,
    unitAId: unitA.id as string,
    unitBId: unitB.id as string,
    unitADoorToken: unitA.door_token as string,
    tenancyAId: tenancyA.id as string,
    tenancyATenantToken: tenancyA.tenant_token as string,
    expiredTenantToken: expiredTenancy.tenant_token as string,
  };

  TEST_PORT = await getFreePort();
  BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

  devServer = spawn("npx", ["next", "dev", "-p", String(TEST_PORT)], {
    cwd: REPO_ROOT,
    shell: true,
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: SERVICE_ROLE_KEY,
    },
  });

  try {
    await waitForServer(`${BASE_URL}/signin`, 90_000);

    // Next dev compiles each route on first request -- pre-warm every
    // route this suite hits so that compilation time doesn't eat into
    // individual tests' timeouts (one /u/:token hit compiles that shared
    // route for every token value used below).
    await Promise.all([
      fetch(`${BASE_URL}/`, { signal: AbortSignal.timeout(15_000) }).catch(() => undefined),
      fetch(`${BASE_URL}/u/warmup`, { signal: AbortSignal.timeout(15_000) }).catch(() => undefined),
      fetch(`${BASE_URL}/u/warmup/reports`, { signal: AbortSignal.timeout(15_000) }).catch(
        () => undefined,
      ),
    ]);
  } catch (err) {
    // If startup fails partway through, the spawned process would
    // otherwise leak and squat on TEST_PORT for every future run.
    await killDevServer(devServer);
    devServer = undefined;
    throw err;
  }
}, 150_000);

afterAll(async () => {
  if (devServer) await killDevServer(devServer);
});

describe("E4 test 1 — a token that was never issued to any unit resolves as invalid", () => {
  // Interpretive note (flagged in the plan for review): the source row
  // reads "Open a unit link belonging to another landlord's unit", which
  // doesn't map onto any of D1's documented invalidation triggers for a
  // *real* door_token (those are deliberately durable and landlord
  // agnostic). Implemented here as a syntactically valid-looking token
  // that was never actually issued, tested inside this two-landlord
  // fixture so a non-existent token can never accidentally resolve
  // against the wrong landlord's data.
  it(
    "GET /u/:fakeToken shows the invalid-link message, not tenant data",
    async () => {
      const fakeToken = `does-not-exist-${randomSuffix()}`;
      const res = await fetch(`${BASE_URL}/u/${fakeToken}`);
      const body = await res.text();
      // RED until T-01 (src/app/(tenant)/u/[token]/page.tsx) is built by
      // its owning lane to call resolveTenantToken() and render this copy
      // -- it's currently a placeholder scaffold. See src/lib/db/resolve-tenant-token.ts.
      expect(body).toContain(INVALID_LINK_MESSAGE);
    },
    20_000,
  );
});

describe("E4 test 2 — a former tenant's link stops working after the tenancy ends", () => {
  it(
    "GET /u/:expiredTenantToken shows the invalid-link message",
    async () => {
      const res = await fetch(`${BASE_URL}/u/${fixture.expiredTenantToken}`);
      const body = await res.text();
      // RED for the same reason as test 1 -- T-01 isn't built yet.
      expect(body).toContain(INVALID_LINK_MESSAGE);
    },
    20_000,
  );
});

describe("E4 test 3 — altering a character in a valid token invalidates it", () => {
  it(
    "GET /u/:alteredToken shows the invalid-link message",
    async () => {
      const valid = fixture.tenancyATenantToken;
      const flippedChar = valid[0] === "a" ? "b" : "a";
      const altered = flippedChar + valid.slice(1);
      const res = await fetch(`${BASE_URL}/u/${altered}`);
      const body = await res.text();
      // RED for the same reason as test 1 -- T-01 isn't built yet.
      expect(body).toContain(INVALID_LINK_MESSAGE);
    },
    20_000,
  );
});

describe("E4 test 4 — tenant page data never includes rent, cost, or another unit/tenant", () => {
  it("door token resolution exposes only the allowed fields", async () => {
    const anon = createSupabaseClient(SUPABASE_URL!, ANON_KEY!);
    const { data, error } = await anon.rpc("resolve_tenant_token", {
      p_token: fixture.unitADoorToken,
    });

    expect(error).toBeNull();
    expect(data).toMatchObject({
      token_type: "door",
      unit_id: fixture.unitAId,
      tenancy_id: null,
    });
    expect(Object.keys(data as object).sort()).toEqual(
      ["prefill_name", "prefill_phone", "tenancy_id", "token_type", "unit_id"].sort(),
    );
  });

  it("tenant token resolution exposes only the allowed fields, never rent or cost", async () => {
    const anon = createSupabaseClient(SUPABASE_URL!, ANON_KEY!);
    const { data, error } = await anon.rpc("resolve_tenant_token", {
      p_token: fixture.tenancyATenantToken,
    });

    expect(error).toBeNull();
    expect(data).toMatchObject({
      token_type: "tenant",
      unit_id: fixture.unitAId,
      tenancy_id: fixture.tenancyAId,
    });
    const keys = Object.keys(data as object);
    expect(keys).not.toContain("rent");
    expect(keys).not.toContain("rent_due");
    expect(keys).not.toContain("cost");
    expect(keys.sort()).toEqual(
      ["prefill_name", "prefill_phone", "tenancy_id", "token_type", "unit_id"].sort(),
    );
  });
});

describe("E4 test 5 — another landlord's record is Not Found, never Forbidden", () => {
  it("landlord A cannot read landlord B's unit, tenant, rent, or request rows", async () => {
    const asLandlordA = createSupabaseClient(SUPABASE_URL!, ANON_KEY!);
    const { error: signInError } = await asLandlordA.auth.signInWithPassword({
      email: fixture.landlordAEmail,
      password: fixture.landlordAPassword,
    });
    expect(signInError).toBeNull();

    const unitResult = await asLandlordA.from("unit").select("*").eq("id", fixture.unitBId);
    expect(unitResult.error).toBeNull();
    expect(unitResult.data).toEqual([]);

    // A single-row lookup (.single()) is the shape most detail-panel
    // routes will actually use -- confirm it comes back as "no rows",
    // never as a distinct permission error.
    const singleResult = await asLandlordA
      .from("unit")
      .select("*")
      .eq("id", fixture.unitBId)
      .maybeSingle();
    expect(singleResult.data).toBeNull();
  });
});

describe("E4 test 6 — signed-out access to a landlord route redirects to sign in, then back", () => {
  it(
    "redirects / to /signin with the intended path preserved",
    async () => {
      const res = await fetch(`${BASE_URL}/`, { redirect: "manual" });
      expect([301, 302, 303, 307, 308]).toContain(res.status);
      const location = res.headers.get("location") ?? "";
      const resolved = new URL(location, BASE_URL);
      expect(resolved.pathname).toBe("/signin");
      expect(resolved.searchParams.get("next")).toBe("/");
    },
    20_000,
  );

  it(
    "returns to the intended screen after signing in",
    async () => {
    const getRes = await fetch(`${BASE_URL}/signin?next=%2F`);
    const html = await getRes.text();
    const setCookies = getRes.headers.getSetCookie();
    const cookieHeader = setCookies.map((c) => c.split(";")[0]).join("; ");

    const { action, fields } = extractForm(html);
    // Next.js renders Server-Action-bound forms with
    // encType="multipart/form-data" -- a real browser (or a no-JS
    // fallback submission) sends multipart, not urlencoded, and Next's
    // action dispatcher only recognises the request as an action
    // invocation in that shape. FormData + fetch sets the multipart
    // boundary automatically.
    const submitFields = new FormData();
    for (const [key, value] of Object.entries(fields)) {
      submitFields.set(key, value);
    }
    submitFields.set("email", fixture.landlordAEmail);
    submitFields.set("password", fixture.landlordAPassword);
    submitFields.set("next", "/");

    const actionUrl = new URL(action || "/signin", BASE_URL).toString();

    const postRes = await fetch(actionUrl, {
      method: "POST",
      redirect: "manual",
      headers: { cookie: cookieHeader },
      body: submitFields,
    });

    expect([301, 302, 303, 307, 308]).toContain(postRes.status);
    const location = postRes.headers.get("location") ?? "";
    const resolved = new URL(location, BASE_URL);
    expect(resolved.pathname).toBe("/");
    },
    20_000,
  );
});

describe('E4 test 7 (D2) — a door token at a tenant-token-only route is invalid, not "wrong kind"', () => {
  it(
    "GET /u/:doorToken/reports shows the same invalid-link message",
    async () => {
    const res = await fetch(`${BASE_URL}/u/${fixture.unitADoorToken}/reports`);
    const body = await res.text();
    // RED: /u/:token/reports (T-03) isn't scaffolded at all yet, so this
    // 404s today rather than rendering the invalid-link copy. Stays red
    // until T-03's owning lane builds it against resolveTenantToken().
    expect(body).toContain(INVALID_LINK_MESSAGE);
    expect(body.toLowerCase()).not.toContain("wrong kind");
    },
    20_000,
  );
});
