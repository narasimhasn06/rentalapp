# RentRoll — application notes for agents

This is a Next.js (App Router) + TypeScript + Tailwind + Supabase
scaffold. No product features are implemented yet — see `spec/index.md`
for the full implementation specification and screen IDs (`L-nn`,
`T-nn`, `S-nn`, `P-nn`) to build against.

## Structure

- `src/app/(landlord)/**` — landlord workspace, sign-in required. Maps to
  `spec/screens/landlord/*.md` (`L-01`…`L-15`).
- `src/app/(tenant)/u/[token]/**` — public tenant link surface, no
  sign-in. Maps to `spec/screens/tenant/*.md` (`T-01`…`T-05`).
- `src/app/dev/**` — local-only routes. Every page must call
  `assertDevOnly()` from `src/lib/dev-only.ts` first; see that file.
- `src/server/landlord/**` — server-only, landlord-only implementation.
  **Never** imported from `src/app/(tenant)/**` — see `src/server/README.md`.
- `src/server/tenant/**` — server-only, tenant-surface implementation.
- `src/server/shared/supabase/**` — Supabase server/admin client
  factories (server-only).
- `src/lib/supabase/client.ts` — Supabase browser client (safe for
  Client Components on either side).

## The landlord/tenant boundary

This is the one hard structural rule in the scaffold: code reachable from
the tenant route group must never be able to import landlord-only
server implementation. It's enforced two ways — `eslint.config.mjs`
(editor-time) and `npm run check:boundaries` (`scripts/check-boundaries.mjs`,
authoritative, part of `npm run verify`). See `spec/cross-cutting.md`
("E4 · Permissions — the boundary tests") for the product reason this
matters: a tenant page must never be able to reach rent amounts, repair
costs, or another tenant's data.

## Commands

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — ESLint
- `npm run test` — Vitest
- `npm run check:boundaries` — the landlord/tenant import boundary check
- `npm run verify` — typecheck + lint + check:boundaries + test

## Explicitly out of scope for this scaffold

No database schema exists yet and none should be invented here — the
source product documents' entity relationship diagram and data flow
diagram were not present in the material this spec was converted from
(see `spec/index.md`). Schema work needs its own ticket, informed by
either the missing source pages or a fresh data model.
