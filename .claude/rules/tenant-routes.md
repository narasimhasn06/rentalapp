# Rule: what tenant routes may and may not do

Applies to everything under `src/app/(tenant)/**` and any code it calls
(shared components, server functions, queries). Source: `spec/cross-cutting.md`
(the two firm rules), `spec/decisions.md` `D1`/`D2`/`D10`, and
`CLAUDE.md` §2/§6. If a change here would need an exception to this
file, escalate — don't implement the exception unilaterally.

## The two token types (`spec/decisions.md` D1)

Tenant routes are reached by one of two tokens, and **what's reachable
depends on which one**:

| Token | Lives on | Lifetime | Grants |
|---|---|---|---|
| `door_token` | `unit` | durable, survives tenant turnover | `T-01` (report a problem) and `T-02` (confirmation) only. Name/phone fields are blank — the visitor fills them in. |
| `tenant_token` | `tenancy` | ends when the tenancy ends | Everything `door_token` grants, **pre-filled** with that tenant's identity, plus `T-03`, `T-04`, `T-05`. |

A route handler must check *which* token type resolved before deciding
what to render — "the token is valid" is not, by itself, permission to
show `T-03`/`T-04`/`T-05`. A `door_token` hitting one of those three
routes gets the same "this link is not valid" treatment as an unknown
token (`spec/decisions.md` D2) — never a more specific error that hints
at the token being "the wrong kind."

## Routes (`spec/decisions.md` D2)

| Screen | Route | Token |
|---|---|---|
| T-01 Report a problem | `/u/:token` | either |
| T-02 Submitted confirmation | (post-submit state of T-01, no route of its own) | either |
| T-03 My reports and status | `/u/:token/reports` | `tenant_token` only |
| T-04 My unit and landlord contact | `/u/:token/unit` | `tenant_token` only |
| T-05 My receipts | `/u/:token/receipts` | `tenant_token` only |

## May render

- The tenant's own unit, their own maintenance requests, their own
  agreement **dates** (not rent — see below), their own receipts
  (`T-05`, and only `T-05`).
- Their own move-in condition photos and their own submitted
  maintenance-request photos (`spec/decisions.md` D10 — these are the
  only `document` categories with `is_protected = false`).
- A drafted, editable report form (`T-01`) and its confirmation (`T-02`).

## Must never render or query

- **Rent amounts**, anywhere, for any unit — with exactly one exception:
  `T-05`'s own receipts, because those are the tenant's own payments.
  `T-04` shows agreement *dates* but never rent, on purpose.
- Repair/maintenance **costs**, vendor names, vendor rates, or internal
  notes on a maintenance request (`spec/screens/landlord/L-07-request-detail-panel.md`'s
  "never expose to the tenant" list).
- Any other unit's or any other tenant's data — this includes data
  belonging to a *different* landlord entirely (`spec/cross-cutting.md`
  E4's boundary tests).
- Any `document`/photo with `is_protected = true` (`spec/decisions.md`
  D10) — agreement PDFs, ID proofs, vendor invoices, deposit-deduction
  photos. A tenant only ever sees a *compiled, landlord-sent* settlement
  statement (`P-02`, via `S-01`), never raw access to a deduction photo.
- Any UI for composing or sending a message. `S-01` (the message
  composer) is landlord-only — the "nothing sends by itself" rule means
  there is no tenant-facing send path to protect in the first place, so
  don't build one.

## Structural boundary (code, not just data)

- `src/app/(tenant)/**` must never import from `src/server/landlord/**`.
  This is enforced by `eslint.config.mjs` (editor-time) and
  `scripts/check-boundaries.mjs` (authoritative — `npm run
  check:boundaries`, part of `npm run verify`). A failure here is a bug
  to fix by removing the import, not a check to route around.
- Shared code a tenant route calls into (`src/server/shared/**`,
  `src/server/tenant/**`) must itself respect every rule above — the
  boundary check only catches the import, not what a shared function
  does internally.

If a task looks like it needs to break any rule in this file, stop and
escalate rather than implement it — see `CLAUDE.md` §2.
