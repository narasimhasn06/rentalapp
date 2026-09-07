# supabase/ — local development

This is the first schema this repo has (see `spec/index.md` and
`spec/decisions.md` for why). One migration,
`migrations/*_initial_schema.sql`, creates every table, RLS policy, and
the `resolve_tenant_token` function in a single file — RLS ships with the
tables, not as a follow-up.

## Running it locally

Requires Docker.

```sh
npx supabase start   # first run pulls images, can take a few minutes
```

This applies every migration in `migrations/` to a fresh local Postgres
and prints the local API URL, anon key, and service-role key — copy
those into `.env.local` (see `.env.example`).

To re-apply migrations from scratch (drops and recreates the local
database):

```sh
npx supabase db reset
```

To stop the stack:

```sh
npx supabase stop
```

## Tests

`src/lib/db/__tests__/e4-boundary.test.ts` (the seven boundary tests from
`spec/cross-cutting.md` E4 + `spec/decisions.md` D2) needs the local stack
running and reads its connection details from the same env vars as the
app (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`). Some of the seven are expected to stay red
until later feature lanes land — see the comments at the top of that
file, and CLAUDE.md's note that these tests are never deleted or weakened
to force a green run.
