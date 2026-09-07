# src/server — server-only implementation

This tree holds server-only code, split by who it's allowed to serve:

- `landlord/` — logic that may only run on behalf of a signed-in landlord
  (e.g. privileged queries across a landlord's own units, anything using
  the service-role Supabase client). **Nothing under
  `src/app/(tenant)/**` may import from here.** This is enforced two ways:
  - `eslint.config.mjs` restricts imports matching `@/server/landlord/*`
    from any file under `src/app/(tenant)/**` (fast, editor-time signal).
  - `npm run check:boundaries` (`scripts/check-boundaries.mjs`) statically
    scans the tenant route tree for any import path that resolves into
    `src/server/landlord/**` or `src/app/(landlord)/**`, and fails with a
    non-zero exit code if it finds one. This is the authoritative check,
    run as part of `npm run verify`.
- `tenant/` — logic specific to the public tenant-link surface (e.g.
  validating a unit token). Safe for the tenant route group to import.
- `shared/` — server-only code safe for both sides, currently the
  Supabase server and admin client factories
  (`shared/supabase/server.ts`, `shared/supabase/admin.ts`).

Every file in this tree should start with `import "server-only";` so an
accidental import from a Client Component fails the build with a clear
error, in addition to the structural checks above.

See `spec/index.md` and `spec/cross-cutting.md` for the product reason
this boundary exists: tenant-facing screens must never be able to reach
rent amounts, repair costs, or other tenants' data (see spec's E4
"Permissions — the boundary tests").
