# RentRoll demo seed — design specification

Ticket: C2 — Demo seed design. Source: `spec/index.md`, `spec/product.md`,
`spec/foundations.md`, `spec/cross-cutting.md` and the individual screen
files under `spec/screens/**` — no other source material was used.

## Why this document exists, and its one hard constraint

> **No database schema exists yet** (see `spec/index.md` — the entity
> relationship diagram was not present in the source material the spec was
> converted from). This document designs a **realistic demo dataset** —
> the people, properties, units, tenancies, rent history, maintenance
> requests, deposits and documents a demo of RentRoll needs — using only
> the vocabulary the UI/UX Specification already uses on its own screens
> (e.g. `L04-TBL-RENT`'s columns "Unit · Tenant · Rent · Due date ·
> Status", `L13-TBL-DEDUCTIONS`'s "description · reason · amount ·
> photo"). **It does not define any database table, column, type, or
> constraint.** Every place an actual schema would be required to turn
> this into real seeded rows is marked `TODO(schema)` and left undone.

This spec is deliberately two layers:

1. **The demo content itself** — concrete, realistic Pune rental data,
   fully specified below, stable enough to hand to a schema/implementation
   ticket as-is.
2. **A schema-agnostic generator** (`scripts/seed/generate.mjs` +
   `scripts/seed/data/reference-data.mjs`) that produces this content as
   plain JSON, with every date-sensitive field computed relative to the
   moment it's run — see "Date handling" below. This is as far as seeding
   can go without a schema to insert into; the actual persistence step is
   `TODO(schema)`, see `scripts/seed/README.md`.

## Cast of characters

One landlord, two properties, fourteen units, twelve occupied, two
vacant — matching the ticket's target exactly.

**Landlord:** Rohan Kulkarni. Receipt name "Kulkarni Properties". UPI ID
`rohankulkarni@okhdfcbank` (see `L02-FLD-UPI` / `L15-FLD-UPI`). Accountant
email `ca.deshpande.associates@example.com` (see `L15-FLD-CAEMAIL` /
`L14-BTN-EMAILCA`). Reminder ladder and rent-escalation default are left
at the spec's stated defaults — day 3 / day 10 / day 20
(`L15-TBL-LADDER`), 8% default escalation (`L15-FLD-ESCDEFAULT`).

**Properties**

| ID | Name | Address | Units |
|---|---|---|---|
| `prop-kulkarni-apts` | Kulkarni Apartments | Survey No. 24, Karve Road, Kothrud, Pune 411038 | 8 |
| `prop-om-sai` | Om Sai Residency | Baner–Pashan Link Road, Baner, Pune 411045 | 6 |

Property names/addresses are invented for the demo but styled on real
Pune localities, matching the style of the source document's own example
("Kulkarni Apartments" is literally the example property name used in
`spec/screens/landlord/L-02-first-run-setup.md`).

## Units, tenants and the situations they demonstrate

Every named person, phone number, and rupee amount below is fictitious
demo data. Two literal examples from the UI/UX Specification are
deliberately reused verbatim so the demo lines up with the spec's own
illustrations: the 18-days-overdue tenant "Suresh Khan · Flat 4C" from
`spec/screens/shared/S-01-message-composer.md`, and the "Part paid —
₹4,000 pending" figure from `spec/screens/landlord/L-04-rent-due-board.md`.

### Kulkarni Apartments (`prop-kulkarni-apts`)

| Unit | Type | Rent | Deposit | Tenant | Status | Demo situation |
|---|---|---|---|---|---|---|
| 1A | 1BHK | ₹16,000 | ₹32,000 | Rohit Sharma | Occupied | Normal — paid on time |
| 1B | 1BHK | ₹16,000 | ₹32,000 | Ananya Iyer | Occupied | Normal — paid on time; has a fresh maintenance request |
| 2A | 2BHK | ₹18,000 | ₹36,000 | Meera Desai | Occupied | **Rent ~5 days overdue** (warning tier); aged maintenance request |
| 2B | 2BHK | ₹18,500 | ₹37,000 | Prakash Joshi | Occupied | Normal — paid on time; urgent maintenance request; **move-in photos missing** |
| 3A | 1BHK | ₹15,500 | ₹31,000 | — | **Vacant** | Past tenant Aarti Bhosale, settled cleanly, full deposit refund |
| 3B | 2BHK | ₹16,000 | ₹32,000 | Neha Kulkarni | Occupied | **Rent part-paid** — ₹12,000 of ₹16,000, ₹4,000 pending |
| 4A | 2BHK | ₹20,000 | ₹40,000 | Ganesh Pawar | Occupied, **on notice** | Notice given, move-out in progress, deposit settlement drafted |
| 4C | 1BHK | ₹18,000 | ₹36,000 | Suresh Khan | Occupied | **Rent ~18 days overdue**, level 3 of 3 (matches `S-01`'s own example); repeat plumbing tenant; agreement in the 60–90 day expiry window |

### Om Sai Residency (`prop-om-sai`)

| Unit | Type | Rent | Deposit | Tenant | Status | Demo situation |
|---|---|---|---|---|---|---|
| G1 | 1RK | ₹11,000 | ₹22,000 | Farhan Shaikh | Occupied | Normal — paid on time; a "no cost" closed maintenance request |
| G2 | 1RK | ₹11,500 | ₹23,000 | — | **Vacant** | Past tenant Imran Sheikh, settled with one deduction |
| 1C | 1BHK | ₹14,000 | ₹28,000 | Priya Nair | Occupied | Normal, paid; **agreement expiring in ~18 days** (danger tier, <30 days) |
| 1D | 1BHK | ₹14,500 | ₹29,000 | Vikram Rao | Occupied | Normal, paid; **agreement expiring in ~45 days** (warning tier, 30–60); aged maintenance request |
| 2C | 2BHK | ₹21,000 | ₹42,000 | Sneha Bhat | Occupied | Normal, paid; **agreement expired ~14 days ago**, not yet renewed (matches `L-12`'s own "Expired 14 days ago" example) |
| 2D | 2BHK | ₹21,500 | ₹43,000 | Abhijit Kulkarni | Occupied | Normal, paid; **agreement expiring in ~75 days** (neutral tier, 60–90); one closed, paid maintenance request |

12 occupied + 2 vacant = 14 units, 2 properties — matches the ticket's
target exactly.

## Deterministic demo situations, mapped to the ticket's checklist

| Requested situation | Where it lives |
|---|---|
| Multiple properties | `prop-kulkarni-apts`, `prop-om-sai` |
| Occupied and vacant units | 12 occupied, 3A and G2 vacant |
| Normal rent | 1A, 1B, G1 and every tenant not listed below, paid on time this month |
| Overdue rent (~18 days) | 4C · Suresh Khan — see "Rent lifecycle demo data" |
| Overdue rent (~5 days) | 2A · Meera Desai — see "Rent lifecycle demo data" |
| Part-paid rent with balance | 3B · Neha Kulkarni — ₹12,000 of ₹16,000 paid, ₹4,000 pending |
| Maintenance requests, multiple states | 12 requests spanning New (fresh/aging-warning/aging-danger), Assigned, In progress, Done (with cost / "no cost" / tenant-liable) — see "Maintenance demo data" |
| Agreement expiry cases | 1C (18d), 1D (45d), 2D (75d), 2C (expired 14d ago) — one per `L-12` window |
| Notice / move-out / settlement | 4A · Ganesh Pawar — notice given, settlement drafted with a photographed and a non-photographed deduction |
| Document/photo scenarios | Move-in photo sets present for 11 of 12 current tenancies; agreement + ID proof documents; **2B deliberately has no move-in photos on file** |
| Missing move-in-photo case | 2B · Prakash Joshi |

## Rent lifecycle demo data

Per `spec/product.md` "Rent lifecycle" and `spec/screens/landlord/L-04-rent-due-board.md`:

| Unit · Tenant | Rent due | Amount paid | Due date | Status shown | Reminder history |
|---|---|---|---|---|---|
| 2A · Meera Desai | ₹18,000 | ₹0 | 5 days before run date | "5d late" (warning) | 1 reminder — gentle (day 3 tier), sent 2 days ago via WhatsApp |
| 4C · Suresh Khan | ₹18,000 | ₹0 | 18 days before run date | "18d late" (danger), context "Level 3 of 3" | 2 reminders — gentle (day 3 tier) sent 15 days ago, direct (day 10 tier) sent 8 days ago; the formal (day 20 tier) message is the one `S-01` would draft next |
| 3B · Neha Kulkarni | ₹16,000 | ₹12,000 | 6 days before run date | "Part paid — ₹4,000 pending" | none yet |
| All other occupied units | as listed | = rent due | 3–10 days before run date | "Paid" | receipt issued |

Every current tenant also carries two prior months of clean, on-time
payment history, so `L11-SEC-PAYMENTS`'s "paid-on-time percentage" has
something real to compute against (the current month's overdue/part-paid
rows read as the anomaly they're meant to be, not the norm).

`TODO(schema)`: receipt numbers (`RR-nnnn` per `L04-BTN-MARKPAID`) are
sequential and would come from a real receipts table/sequence; the
generator assigns illustrative placeholder numbers only (see
`scripts/seed/data/reference-data.mjs`).

## Maintenance demo data

Twelve requests, chosen to exercise every state and aging rule in
`spec/screens/landlord/L-06-maintenance-board.md` and
`L-07-request-detail-panel.md`:

| ID | Unit | Category | Urgency | Status | Age / timing | Notes |
|---|---|---|---|---|---|---|
| MR-1 | 1B | Plumbing | Normal | New | reported today | fresh, no aging border |
| MR-2 | 2B | Electrical | **Urgent** | New | reported today | surfaces on `L-03` Needs Attention (priority 1) |
| MR-3 | 4C | Plumbing | Urgent | Assigned | reported 3 days ago | vendor "Om Plumbing Services" dispatched; 4th plumbing request on this unit in 12 months |
| MR-4 | 2A | Structural | Low | New | reported 9 days ago | **>7 days old — danger left border** |
| MR-5 | 1D | Pest | Normal | New | reported 5 days ago | **48h–7d old — warning left border** |
| MR-6 | 2C | Electrical | Normal | In progress | reported 6 days ago | vendor "Deshmukh Electricals" |
| MR-7 | 2D | Plumbing | Normal | Done | reported 15 days ago, closed 10 days ago | cost ₹600 |
| MR-8 | G1 | Appliance | Low | Done | reported 20 days ago, closed 18 days ago | **"no cost" close** (AMC covered) |
| MR-9 | 4C | Plumbing | Normal | Done | ~70 days ago | cost ₹350 — repeat-category history |
| MR-10 | 4C | Plumbing | Normal | Done | ~150 days ago | cost ₹450 — repeat-category history |
| MR-11 | 4C | Plumbing | Normal | Done | ~260 days ago | cost ₹300 — repeat-category history |
| MR-12 | 4A | Structural | Normal | Done | reported 20 days ago, closed 19 days ago | cost ₹1,200, **tenant-liable ticked**; feeds `L13-BTN-FROMREQUESTS` |

MR-3, MR-9, MR-10 and MR-11 together are the four plumbing requests on
unit 4C within twelve months that `L-09`'s quiet note ("Plumbing reported
4 times in 12 months") is describing.

## Agreement tracker demo data

One tenant per `L-12` window, plus the spec's own "expired" example
reproduced exactly, plus a second, incidental occupant of the 60–90 day
window (Suresh Khan, 4C) so the board shows more than one row in a tier:

| Unit · Tenant | Ends | Window |
|---|---|---|
| 1C · Priya Nair | 18 days from run date | <30 days — danger |
| 1D · Vikram Rao | 45 days from run date | 30–60 days — warning |
| 4C · Suresh Khan | ~65 days from run date | 60–90 days — neutral |
| 2D · Abhijit Kulkarni | 75 days from run date | 60–90 days — neutral |
| 2C · Sneha Bhat | 14 days **before** run date | **expired, unrenewed** — stays pinned at the top per the spec rule |
| everyone else | 150–300 days from run date | outside the default 90-day view; visible under "All" |

## Notice and settlement demo data

Three `L-13` records, in three different states:

| Tenant | Unit | Deposit held | Deductions | Balance | Status |
|---|---|---|---|---|---|
| Ganesh Pawar | 4A | ₹40,000 | "Cracked bathroom tile repair" ₹1,200 (photo, pulled from MR-12) · "Deep cleaning before next tenant" ₹800 (**no photo — allowed with a warning**) | ₹38,000 refundable | **Draft** — notice given 20 days ago, move-out in 10 days |
| Aarti Bhosale (past, 3A) | 3A | ₹31,000 | none | ₹31,000 refundable | Settled, ~55 days ago |
| Imran Sheikh (past, G2) | G2 | ₹23,000 | "Wall repainting after long tenancy" ₹2,500 (photo) | ₹20,500 refundable | Settled, ~115 days ago |

Ganesh Pawar's case exercises `L13-BTN-FROMREQUESTS` (pulling MR-12's cost
and photo into a deduction) and the "deduction without a photo is allowed
but warned" rule in the same statement, without deductions exceeding the
deposit (that edge case is real but not requested by this ticket, and
isn't invented here beyond noting it as a good candidate for a future
seed variant).

## Document and photo demo data

- **Move-in condition photos:** every current tenancy has a placeholder
  photo set (3–5 illustrative captions with a `takenAt` date) **except
  2B · Prakash Joshi, deliberately left with none** — the ticket's
  requested "missing move-in-photo" case.
- **Agreement + ID proof documents:** every current tenant has a
  placeholder "agreement" and "ID proof" document entry
  (`L11-SEC-DOCS`); past tenants keep their archived agreement.
- These are metadata placeholders only (a label and a date) — no binary
  image/PDF assets are generated. `TODO(schema)`: once file storage and a
  documents table exist, this generator should be extended to also
  produce or reference real placeholder files.

## Date handling — "relative to the run date"

Per the ticket: *"Date-sensitive demo states should be calculated
relative to the run date so the demo remains stable later."* Concretely,
`scripts/seed/generate.mjs` never hardcodes a calendar date. Every
date-sensitive fact above (5 days overdue, 18 days overdue, expires in 18
days, expired 14 days ago, notice given 20 days ago, etc.) is computed as
an **offset in days from `new Date()` at the moment the script runs**,
using two helpers:

- `daysAgo(n)` — midnight `n` days before today
- `daysFromNow(n)` — midnight `n` days after today

This is a deliberate simplification of the real product rule that "a
rent row is created per unit on the 1st of the month"
(`spec/product.md` "Rent lifecycle") — anchoring to day-of-month would
make several of the requested scenarios (e.g. "18 days overdue") invalid
or impossible depending on what day the demo happens to be generated on.
Computing every offset directly from the run date instead means the
demo produces the exact same *relative* picture — a tenant 18 days
overdue, an agreement expiring in 18 days, and so on — no matter when
it's generated, today or a year from now. `scripts/seed/README.md`
documents this trade-off for whoever wires the generator to a real
seeding step later.

## Assumptions made for realism (not schema, not product decisions)

These are demo-data choices, not gaps in the product spec — flagged here
for transparency, not as `OPEN:` items in the product sense:

- **Deposit = 2× monthly rent** for every unit. The spec never states a
  deposit convention; 2× is a common Pune-market convention and is used
  purely to make demo numbers realistic.
- **Rent escalation on renewal** uses the spec's own stated default
  (`L15-FLD-ESCDEFAULT`), not a per-tenant override.
- Phone numbers, UPI IDs, vendor names and every person's name are
  invented for this demo and do not correspond to real people or
  businesses.

## What is explicitly `TODO(schema)`

This ticket forbids inventing tables or fields, so the following are
named but not built:

1. **Persistence.** There is no code anywhere in this repo that writes
   this data into a database, because there is no schema/table to write
   it into. `generate.mjs` stops at producing JSON in memory.
2. **IDs.** All IDs in the generated output (`prop-kulkarni-apts`,
   `unit-4c`, `mr-12`, …) are human-readable slugs chosen for this
   generator's own internal cross-referencing, not primary keys of any
   real table — a real implementation will very likely replace them with
   database-generated IDs (UUIDs or serials).
3. **Receipt numbers, request numbers.** `RR-nnnn` / `R-nnnn` style
   identifiers (per `spec/cross-cutting.md` E1) are illustrative
   placeholders, not drawn from a real sequence.
4. **Binary assets.** Photo and document entries are metadata
   placeholders (caption + date), not real files.
5. **Landlord authentication.** No password/auth record is generated —
   `L-01`'s sign-in flow needs an actual auth provider (Supabase Auth is
   the presumed choice per `CLAUDE.md`, but wiring it up is out of scope
   here).

See `scripts/seed/README.md` for how to run what does exist today, and
what a future schema/seeding ticket should pick up.
