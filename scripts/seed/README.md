# RentRoll demo seed

Ticket: **C2 — Demo seed design**. This directory designs and generates a
realistic demo dataset for RentRoll — see `SPEC.md` for the full design
(who's in the dataset, why, and which spec screen/rule each demo
situation exercises).

## What exists today

- **`SPEC.md`** — the design: two properties, fourteen units, twelve
  tenants (plus two past tenants), and the specific rent/maintenance/
  agreement/settlement/document situations the ticket asked for, each
  traced back to a `spec/screens/**` file.
- **`data/reference-data.mjs`** — the static demo content (names,
  addresses, amounts, categories, and every date expressed as a day
  *offset*, never a literal date).
- **`generate.mjs`** — resolves those offsets against the current date
  and prints the full demo dataset as JSON.
- **`sample-output.json`** — one illustrative run of `generate.mjs`,
  committed only so a reviewer can see the shape and correctness of the
  output without running Node. **Do not treat this file as the seed
  data to load anywhere** — its dates are already stale by the time you
  read this. Regenerate it (see below) for current dates.

## What does not exist yet, and why

There is no database schema in this repository (`spec/index.md` explains
why — the entity relationship diagram was missing from the source
material). Because of that:

- **Nothing in this directory writes to a database.** `generate.mjs`
  stops at producing JSON in memory/stdout.
- **Nothing in this directory defines a table, column, or type.** Every
  field used here is drawn from vocabulary the UI/UX Specification
  already uses on its own screens (see `SPEC.md`'s intro).
- Every place a real schema would be needed to go further is marked
  `TODO(schema)` in `SPEC.md` and inline in `generate.mjs`.

**When the schema exists**, the follow-up ticket should:

1. Map `generate.mjs`'s output shape onto the real tables (property →
   `properties`, unit → `units`, etc. — whatever the schema ticket
   settles on).
2. Replace the placeholder IDs (`unit-4c`, `mr-12`, …) and placeholder
   receipt/request numbers with however the real schema generates them.
3. Add the actual insert/upsert calls, almost certainly using
   `src/server/shared/supabase/admin.ts` (the service-role client — see
   `src/server/README.md`) since seeding needs to write across every
   landlord's data, which a normal RLS-scoped session client can't do.
4. Decide what to do about binary assets (move-in/repair photos, the
   agreement PDFs) — this generator only produces photo/document
   *metadata* placeholders (a caption and a date), not files.

None of that exists here on purpose — inventing it would mean guessing at
a schema, which this ticket explicitly rules out.

## Running the generator

No dependencies beyond Node itself (this repo's `package.json` scripts
are untouched by this ticket — see "Do not touch app feature code").

```sh
node scripts/seed/generate.mjs
# or, to a file:
node scripts/seed/generate.mjs > /tmp/rentroll-demo.json
```

Run it again next week, next month, or next year and the *shape* of the
demo is identical — same properties, same units, same named situations —
but every date-sensitive fact (which rent row is 18 days overdue, which
agreement expired 14 days ago, ...) is recalculated relative to whatever
day you ran it. See `SPEC.md` → "Date handling" for why it works this way
and what real-product behaviour it deliberately simplifies (the real rent
lifecycle anchors rows to the 1st of the calendar month; this generator
anchors every scenario to an exact day-count offset from "now" instead,
so the demo stays valid regardless of what day of the month it's run).

## Verifying it

There's no schema to seed into yet, so "does it work" currently means
"does it produce the dataset `SPEC.md` describes." A quick manual check:

```sh
node -e "
const { generate } = await import('./scripts/seed/generate.mjs');
const d = generate();
console.log(d.units.length, 'units —', d.units.filter(u => u.status === 'occupied').length, 'occupied,', d.units.filter(u => u.status === 'vacant').length, 'vacant');
console.log(d.rentEntries.filter(e => /late\$/.test(e.status)).map(e => [e.unitId, e.status]));
console.log(d.rentEntries.filter(e => /Part paid/.test(e.status)).map(e => [e.unitId, e.status]));
"
```

should print `14 units — 12 occupied, 2 vacant`, the two overdue rows
(`unit-2a`/`5d late`, `unit-4c`/`18d late`), and the one part-paid row
(`unit-3b`/`Part paid — ₹4,000 pending`) — regardless of what day it's
run.
