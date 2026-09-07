# RentRoll — product decisions record

This document resolves the OPEN decisions in `spec/**` that would
otherwise block schema design — the seven mandatory schema corrections
from this ticket, plus every other genuinely blocking conflict found by
re-reading the complete spec against eight lenses: **database schema,
security/privacy, tenant vs landlord behaviour, navigation, payment/rent
logic, maintenance behaviour, receipts, tokens, documents.**

**Scope discipline.** Every decision below resolves an actual conflict —
two (or more) source requirements that cannot both be implemented
literally as written. Where the spec is merely *silent* on something
(no stated conflict, just an unstated detail), this document does not
invent an answer — see "Genuinely non-blocking items intentionally left
open" at the end. This file does not modify `spec/screens/**` or any
other spec file; it is a record layered on top of them. A future spec
pass may fold these decisions back into the affected screen files.

**Format per decision:** conflicting source requirements → why they
can't both be implemented literally → the chosen decision → its
consequences. Decisions are numbered `D1`–`D17` and tagged with the
category lenses they affect. `D1`, `D3`, `D4`, `D5`, `D7`, `D9`, `D10` are
this ticket's seven mandatory schema corrections; the rest are additional
blocking conflicts found during the same review.

---

## Quick reference — the seven mandatory schema corrections

A 200-word-or-fewer capsule of each mandatory correction, in this exact
shape: what the source said → why it can't be right as written → what we
chose → what it costs. Full detail, including every consequence, lives in
the numbered entry linked from each heading — read this section for the
fast version, the numbered section below for the complete record.

### [D1](#d1--two-separate-tokens-unitdoor_token-and-tenancytenant_token) — two tokens, not one

**Source said:** the spec uses one phrase, "unit link," for two things: a
durable link printed as a door sticker (works across tenant turnover, on
a vacant unit) and a per-tenant link that "stops working when the tenancy
ends" and pre-fills the tenant's name and phone.
**Why it can't be right:** a single field can't be both permanent-and-
tenant-agnostic and expiring-with-one-tenancy. Pre-fill by identity also
requires the token to already encode which tenant is visiting — a
door-level token can't do that by design.
**What we chose:** two tokens. `unit.door_token` (created with the unit,
never rotated, grants T-01/T-02 only, fields blank). `tenancy.tenant_token`
(created at move-in, invalidated the instant the tenancy ends, pre-filled,
plus T-03–T-05).
**What it costs:** two token columns on two tables instead of one; an
invalidation hook wired to tenancy end; T-01's pre-fill logic becomes
conditional on which token resolved the request; the route table and
T-01's own spec need a later edit to reflect two token families instead
of one `:unitToken` param.

### [D3](#d3--agreement-is-its-own-entity-a-tenancy-can-have-more-than-one-over-time) — agreement is its own entity

**Source said:** L-12's renewal button reads as an in-place edit — "new
start date, new end date, new rent... the agreement dates update" —
implying one agreement row whose fields change.
**Why it can't be right:** the same file says rent changes take effect
only from the new start date and past rent rows "are not altered," and
the product's "Evidence, always" principle plus its own history-
everywhere pattern (rent, maintenance, deposits) argues against
overwriting a term's true past values. Overwriting also makes "what was
this agreement before the last renewal" unanswerable, something L-13
settlement work may need.
**What we chose:** `agreement` is its own entity, foreign-keyed to
`tenancy`, not to `tenant` or `unit`. A tenancy has one active agreement
at a time but potentially many over its life; renewing creates a new
agreement row rather than mutating the old one. L-12's "dates update" is
read as the visible UI effect, not the storage model.
**What it costs:** a new table plus a way to flag which agreement is
currently active; every past term stays queryable; `rent_entry` already
snapshots its own `rentDue` independently, so this protects agreement-
term history only, not billed-amount history.

### [D4](#d4--agreement-owns-rent_due_day) — `agreement` owns `rent_due_day`

**Source said:** `product.md` states rent rows are created "1st of the
month," flatly. But L-04 also describes a "mid-month move-in" where "the
first month's row is created with the pro-rata amount" — which only
makes sense if a tenancy's due day isn't always the 1st.
**Why it can't be right:** "every rent row is created on the 1st" and "a
tenancy can be due on a day that isn't the 1st" can't both be system-wide
rules; one has to be a per-tenancy value, not a constant.
**What we chose:** `rent_due_day` (integer 1–28, valid in every month)
lives on `agreement`, defaulting to 1 unless the landlord sets it
otherwise at move-in. "Created on the 1st" describes the default case and
the batch job's default schedule, not a hard constraint.
**What it costs:** rent-row generation must read `rent_due_day` per
active agreement instead of assuming one system date; because D3 makes
`agreement` versioned, a due-day change at renewal is just a new
agreement row's property; the pro-rata formula itself stays undecided
(see "intentionally left open").

### [D5](#d5--notice-fields-and-state-belong-on-tenancy-not-agreement) — notice fields live on `tenancy`

**Source said:** L-11 visually nests "notice status" inside the
agreement block on the tenant detail screen, implying notice is a
property of the agreement.
**Why it can't be right:** D3 already establishes a tenancy can span
several agreements over time, and giving notice ends the tenancy, not
one specific agreement term. If notice fields lived on `agreement`,
"notice given" would have to be copied forward at every renewal
(redundant, error-prone) or would silently vanish when a new agreement
row is created — neither works for something that must persist until
move-out regardless of agreement churn.
**What we chose:** `notice_given`, `notice_given_date`, and
`move_out_date` live on `tenancy`. L-11 can keep displaying them inside
the agreement-looking visual block — that's layout, not data modelling.
**What it costs:** ending a tenancy becomes one state transition on one
entity, independent of which agreement is active; L-12's "stays there...
until renewed or the tenancy is ended" now reads correctly, since
agreement expiry and tenancy end are two separately-tracked events; this
is also where D1's `tenant_token` invalidation hooks in.

### [D7](#d7--payment-is-a-child-of-rent_entry-scoped-to-rent-payments) — `payment` is a child of `rent_entry`

**Source said:** L-04 describes each rent entry as if it holds one flat
"amount paid" value, but its own part-payment rule says: "the row shows
'Part paid — ₹4,000 pending'... A receipt is issued for the amount
actually received."
**Why it can't be right:** a tenant who part-pays today and tops up next
week creates two separate receivable events against the same rent entry
— a single `amountPaid` field can't hold two receipts with their own
dates, references and receipt numbers.
**What we chose:** `payment` is its own entity, a child of `rent_entry`
(one entry, many payments). Each payment carries its own amount, date,
reference and receipt number. `rent_entry.amountPaid` and its status
("Paid"/"Part paid"/"Nd late") are derived by summing child payments
against `rentDue`, not stored independently.
**What it costs:** "mark paid" now creates a `payment` row rather than
setting a field on `rent_entry`; receipt printing keys off individual
payment rows, so a twice-part-paid entry has two receipts; this entity is
deliberately scoped to rent only — deposit and repair-cost-recovery money
(D8) are handled elsewhere, on purpose.

### [D9](#d9--audit_event-is-its-own-unified-entity) — `audit_event` is one unified entity

**Source said:** the spec separately describes three "this happened,
then this happened" histories with near-identical shape but no shared
name — L-05's reminder timeline, L-07's request timeline, and T-03's
tenant-safe status timeline — each written as if its own bespoke
mechanism.
**Why it can't be right:** building three separately-shaped tables
duplicates the same who/what/when/on-which-record pattern three times,
and makes it hard to guarantee T-03's tenant-safe view actually stays in
sync with L-07's landlord view of the same facts — two independently
maintained tables can silently drift apart.
**What we chose:** one `audit_event` entity (entity type, entity id,
event type, timestamp, actor, payload) underlies every timeline in the
product. Each screen's timeline is a filtered view over it — the
tenant's view additionally strips anything protected (D10) or
landlord-only (vendor, cost, internal notes) before rendering.
**What it costs:** new timelines in future features are a query shape
against an existing table, not a new table; T-03's "plain words, no
jargon" rule becomes a rendering-layer concern rather than a separately-
maintained data source that could fall out of sync with the
landlord-facing version.

### [D10](#d10--documentis_protected-with-a-safe-default-and-concrete-category-assignments) — `document.is_protected`, safe by default

**Source said:** cross-cutting rules forbid tenant screens from showing
repair costs, vendor rates, or other units' data, and L-07 explicitly
lists what must never reach a tenant. But other documents — move-in
condition photos, a tenant's own submitted maintenance photos — are
tenant-relevant by design, per the "Evidence, always" principle.
**Why it can't be right:** neither a blanket "tenants never see
documents" rule nor a blanket "documents are fine to expose" default
fits — one is too broad, the other is actively unsafe the moment a cost
document or ID proof is fetched by mistake.
**What we chose:** `document.is_protected`, defaulting to `true` (hidden
unless explicitly marked otherwise). Only two categories default to
`false`: a tenant's own move-in condition photos, and their own
submitted maintenance photos (plus the landlord's "after" photos on that
same request). Everything else — agreement PDFs, ID proofs, vendor
invoices, deposit-deduction photos — stays protected always; a tenant
sees deductions only via the compiled P-02 statement, never raw photo
access.
**What it costs:** every tenant-facing document query is one filter
(`is_protected = false`) plus an ownership check, rather than bespoke
per-screen logic; any new document category must explicitly justify
opting out of protection.

---

## D1 — Two separate tokens: `unit.door_token` and `tenancy.tenant_token`

**Tags:** tokens, security/privacy, navigation, tenant vs landlord
behaviour, database schema · **Mandatory correction 1**

**Conflicting source requirements.**

The spec uses a single phrase — "unit link" / "unit token" — for two
things that behave differently:

1. A **durable, unit-level** code, unrelated to who currently lives
   there: `spec/screens/landlord/L-09-unit-detail.md` calls it "the
   unit's reporting link"; `spec/screens/landlord/L-08-unit-register.md`
   prints it as a **door QR** (`P-03`) meant to be "a sticker inside the
   flat door" (`spec/product.md`, connection 11) — i.e. physical,
   reprinted rarely, and expected to keep working across tenant turnover
   so a new tenant or a visitor can still report a problem.
2. A **per-tenancy personal link**, issued to one specific tenant:
   `spec/product.md`'s journey map says the tenant "Gets a welcome
   message with their unit link. Saves it." at move-in (stage 2), and
   `spec/screens/tenant/T-01-report-a-problem.md` states as a rule: **"A
   former tenant's link stops working when the tenancy ends."**

A single token cannot satisfy both: if the same token is durable and
printed on the door, it cannot also expire the moment a tenancy ends
(the physical sticker would go dead mid-tenancy-turnover, before a new
tenant exists to receive a replacement). If it expires with the tenancy,
it cannot be the thing permanently glued to a door.

There's a second, independent tell in the same screen: `T-01`'s own
fields `T01-FLD-NAME` and `T01-FLD-PHONE` are documented as **"Pre-filled
from the tenant record, editable."** That pre-fill is only possible if
the token used to reach the page already identifies *which tenant* is
visiting — which a door-level token, by design, cannot do.

**Why they cannot both be implemented literally.** A token is either
durable and unit-scoped (works for anyone, forever, regardless of
tenancy) or ephemeral and tenancy-scoped (identifies one tenant, dies
with their tenancy) — a single field can't carry both lifetimes.

**Decision.** Two tokens, both routing to the same tenant-facing surface
but with different lifetimes and different grants:

- **`unit.door_token`** — one per unit, created when the unit is added,
  never rotated by a tenancy change. Printed on `P-03` and shown from
  `L09-BTN-QR`/`L09-BTN-COPYLINK`. Grants access to `T-01` (report a
  problem) and `T-02` (confirmation) only, with `T01-FLD-NAME` /
  `T01-FLD-PHONE` left blank for the visitor to fill in. Works even when
  the unit is vacant (someone still needs to be able to report a leak in
  an empty flat).
- **`tenancy.tenant_token`** — one per tenancy, created at move-in,
  permanently invalidated the moment that tenancy ends (settlement
  closed / unit marked vacant again — see `D5`). This is the link handed
  to the tenant in the move-in welcome message. It grants everything
  `door_token` grants, **pre-filled** with that tenant's name and phone,
  plus the tenant's own history pages (`T-03`, `T-04`, `T-05` — see
  `D2`).

**Consequences.**

- Schema needs two distinct token columns, in two different places
  (`unit`, `tenancy`), each independently unique and looked up on
  request — not one token column shared or duplicated between them.
- `unit.door_token` never needs rotation logic tied to tenant lifecycle.
  `tenancy.tenant_token` needs an invalidation step wired into
  end-of-tenancy (see `D5`) — a former tenant's link genuinely stops
  resolving, not just stops being useful.
- `spec/cross-cutting.md`'s boundary test "Open a former tenant's link
  after the tenancy ended → Invalid link message" now applies only to
  `tenant_token`; `door_token` deliberately has no such expiry.
- The T-01 form's pre-fill behaviour becomes conditional on which token
  type resolved the request, not a blanket "always pre-filled" or
  "never pre-filled" rule.
- `spec/index.md`'s route table (`T-01` = `/u/:unitToken`) and
  `spec/screens/tenant/T-01-report-a-problem.md`'s route row need
  updating to reflect two token families the next time those files are
  revised — not done in this pass (see "Scope discipline" above).

---

## D2 — Tenant navigation and route scheme (resolves the undocumented T-02..T-05 routes)

**Tags:** navigation, tokens

**Conflicting source requirements.** `spec/index.md` already flagged
this as OPEN: the UI/UX Specification gives an explicit `ROUTE` for
`T-01` only; `T-02`–`T-05` are described as reachable via named
buttons/links (`T01-LNK-MYREPORTS`, `T02-BTN-TRACK`, …) with no route of
their own. This was left unresolved pending the token question — which
`D1` now answers, so it can be closed.

**Why it was blocking.** Without a route scheme, there's no way to say
which pages a given token may reach, which is a prerequisite for
enforcing `D1`'s different grants for `door_token` vs `tenant_token`.

**Decision.** Both token families resolve through the same path shape,
`/u/:token`; the token's own type (looked up server-side) determines
what's reachable, not the URL shape itself:

| Screen | Route | Reachable via |
|---|---|---|
| T-01 Report a problem | `/u/:token` | `door_token` or `tenant_token` |
| T-02 Submitted confirmation | (post-submit state of T-01, no distinct route — unchanged) | either |
| T-03 My reports and status | `/u/:token/reports` | `tenant_token` only |
| T-04 My unit and landlord contact | `/u/:token/unit` | `tenant_token` only |
| T-05 My receipts | `/u/:token/receipts` | `tenant_token` only |

A `door_token` used at `/u/:token/reports` (etc.) behaves exactly like
an unrecognised token per `spec/cross-cutting.md`'s wording rules — the
same "this link is not valid" message, never a distinct "wrong kind of
link" error (per `spec/cross-cutting.md` E1: "Never show a code or an
internal identifier … Never use the words error, invalid, failed, or
unauthorised" — beyond what's already permitted for a genuinely unknown
link).

**Consequences.**

- Closes the `spec/index.md` OPEN item on tenant routes.
- Gives `spec/cross-cutting.md`'s E4 boundary tests a concrete new case
  to include later: "open `/u/:doorToken/reports`" should behave
  identically to an invalid link, not reveal that the token is merely
  "the wrong kind."
- The route param name changes from `:unitToken` to the token-type-
  agnostic `:token` — a naming detail for whoever next edits `T-01`'s
  spec file.

---

## D3 — `agreement` is its own entity; a tenancy can have more than one over time

**Tags:** database schema, payment/rent logic · **Mandatory correction 3**

**Conflicting source requirements.**

- `spec/screens/landlord/L-12-agreement-tracker.md`'s renewal
  interaction (`L12-BTN-RENEW`) reads as an in-place mutation: "Inline
  form: new start date, new end date, new rent. On save **the agreement
  dates update**, the row leaves the list…" — implying one agreement
  record whose fields change.
- But the same file's own rule says: **"Rent changes take effect from
  the new start date. Rows already generated for earlier months are not
  altered."** And `spec/product.md`'s design principle "Evidence,
  always" — plus the general shape of every other historical record in
  the product (rent history, maintenance history, deposit history) —
  argues for an immutable trail of what terms applied when, not a single
  row whose past values are overwritten and lost.
- `spec/product.md`'s "Who uses the product" section states a unit "has
  one current tenant and a history of past tenants," establishing that
  the durable relationship the product tracks (a tenancy) already
  outlives any single term of it.

**Why they cannot both be implemented literally.** If "renewal" mutates
one agreement row, the previous term's exact rent/dates/escalation
become unrecoverable the moment they're overwritten — contradicting the
product's own evidence-first stance and making it impossible to answer
"what was this tenant's agreement before the last renewal," which
`L-09`'s "every month, every tenant, ever" rent history and `L-13`'s
settlement statements may need to reference.

**Decision.** `agreement` is a first-class entity, separate from both
`tenancy` and `tenant`. A `tenancy` (the durable tenant+unit
relationship, from move-in to move-out) has **one active agreement at a
time but potentially many over its life** — each renewal *creates a new
agreement row* rather than mutating the previous one. `L-12`'s "the
agreement dates update" is a UI description of the visible effect (the
tracker now shows the new agreement's dates), not a literal in-place
update.

**Consequences.**

- Schema needs `agreement` as its own table, foreign-keyed to `tenancy`
  (not to `tenant` or `unit` directly), with a way to mark which
  agreement is currently active for a tenancy.
- Every past agreement term stays queryable in full — satisfying the
  "rows already generated for earlier months are not altered" rule at
  the agreement level, not just the `rent_entry` level.
- `rent_entry` rows still carry their own `rentDue` snapshot
  independently (already true per every rent screen's own field list),
  so historical rent entries were never at risk from this decision —
  this decision protects the agreement's own historical terms, a
  different fact than what was actually billed.

---

## D4 — `agreement` owns `rent_due_day`

**Tags:** database schema, payment/rent logic · **Mandatory correction 4**

**Conflicting source requirements.**

- `spec/product.md`'s "Rent lifecycle" section states rent rows are
  created **"1st of the month"**, uniformly.
- But the same document's own rent-due-board rule
  (`spec/screens/landlord/L-04-rent-due-board.md`) describes a
  **"mid-month move-in"** case where "the first month's row is created
  with the pro-rata amount" — which only makes sense if a tenancy's
  billing cycle can start on a day other than the 1st. Real Pune rental
  practice (which the product is explicitly styled on) commonly sets the
  recurring due day to the tenant's actual move-in day, not a
  building-wide fixed date.

**Why they cannot both be implemented literally.** "Every rent row is
created on the 1st" and "a tenancy's rent can be due on a day that isn't
the 1st" can't both be true as blanket rules — one is a system-wide
constant, the other requires a per-tenancy value.

**Decision.** `rent_due_day` (an integer 1–28, to stay valid across
every calendar month) lives on `agreement`, defaulting to **1** unless
the landlord sets otherwise at move-in. The "rent row created on the
1st" language in `spec/product.md` describes the default case (and
remains the batch job's default schedule), not a hard constraint.

**Consequences.**

- Rent-row generation logic must read `rent_due_day` per active
  agreement rather than assuming a single system-wide date.
- Because `D3` makes `agreement` its own versioned entity, a change to
  `rent_due_day` at renewal is just a property of the new agreement row
  — no separate migration mechanism needed.
- The pro-rata first month remains a one-off adjustment on that tenancy's
  first `rent_entry`, independent of this field (see "Genuinely
  non-blocking items" for what's deliberately left undecided about the
  pro-rata formula itself).

---

## D5 — Notice fields and state belong on `tenancy`, not `agreement`

**Tags:** database schema, tenant vs landlord behaviour · **Mandatory correction 5**

**Conflicting source requirements.** `spec/screens/landlord/L-11-tenant-detail.md`
visually nests notice information inside the agreement block
(`L11-SEC-AGREEMENT`: "Start, end, rent, deposit paid, **notice
status**…"), implying notice is a property of the agreement. But `D3`
establishes that a tenancy can span multiple agreements over time, and
giving notice is unambiguously an act that **ends the tenancy**, not an
act that ends one specific agreement term among several — a tenant who
gives notice during their second renewal isn't declaring anything about
their first agreement.

**Why they cannot both be implemented literally.** If notice fields live
on `agreement` (an entity that, per `D3`, gets superseded at every
renewal), "notice given" would either need to be copied forward at every
renewal (redundant and error-prone) or would silently vanish the moment
a new agreement row is created — neither is workable for something that
must persist until move-out regardless of agreement churn.

**Decision.** `notice_given`, `notice_given_date`, and `move_out_date`
live on `tenancy`. `L-11`'s screen can still *display* notice status
inside the same visual block as agreement details — that's a UI layout
choice, not a data-modelling one, and this decision doesn't require
changing that screen's layout.

**Consequences.**

- Ending a tenancy (closing out via `L-13`, per `D1`'s note on
  `tenant_token` invalidation) is one state transition on one entity
  (`tenancy`), independent of which agreement happens to be active.
- `spec/screens/landlord/L-12-agreement-tracker.md`'s rule "an agreement
  that has already expired… stays there until renewed **or the tenancy
  is ended**" now reads correctly against the schema: agreement expiry
  and tenancy end are two different, independently-tracked events.
- This is also where `tenant_token` invalidation (`D1`) should hook in:
  tenancy end is the single trigger point, not agreement end.

---

## D6 — Deposit amount belongs on `tenancy`; a unit's listed deposit is only a default

**Tags:** database schema, payment/rent logic

**Conflicting source requirements.** Deposit appears in the spec in two
different roles that get conflated under one word:

1. As a **unit-level default/asking figure**, entered when the unit is
   created — `spec/screens/landlord/L-02-first-run-setup.md`'s
   `L02-TBL-UNITS` and `spec/screens/landlord/L-08-unit-register.md`'s
   `L08-BTN-ADDUNIT` both collect "deposit" as a plain attribute of a
   unit, before any tenant exists.
2. As the **actual amount held for a specific tenancy** —
   `spec/screens/landlord/L-13-deposit-and-settlement.md`'s
   `L13-TBL-HELD` ("unit, tenant, amount, since when") and
   `L13-SEC-BALANCE` treat deposit as something tied to one tenancy's
   settlement, which may have been negotiated to differ from the unit's
   listed figure.

**Why they cannot both be implemented literally.** A single `deposit`
field can't simultaneously be "the unit's standard asking deposit"
(which shouldn't change just because a particular tenant negotiated a
different number) and "the amount actually held for tenant X" (which
must be exact and immutable once collected, per `L-13`'s reliance on it
for settlement math).

**Decision.** `unit.default_deposit` is the asking figure shown when
adding a unit and pre-filled when starting a new tenancy. The deposit
actually collected and held is `tenancy.deposit_amount`, set once at
move-in and **not** re-derived from the unit or changed by agreement
renewal (nothing in `L-12`'s renewal form — "new start date, new end
date, new rent" — mentions deposit, so silence there is read as "deposit
does not change at renewal").

**Consequences.**

- `L13-TBL-HELD` and `L13-SEC-BALANCE` read from `tenancy.deposit_amount`
  directly, never from the unit.
- Because deposit doesn't change at renewal, it correctly lives on
  `tenancy` (parallel to `D5`'s notice fields) rather than on the
  per-term `agreement`.
- A future "deposit top-up at renewal" feature, if ever requested, would
  need its own explicit design — this decision deliberately does not
  invent that behaviour now.

---

## D7 — `payment` is a child of `rent_entry` (scoped to rent payments)

**Tags:** database schema, payment/rent logic, receipts · **Mandatory correction 2**

**Conflicting source requirements.** `spec/screens/landlord/L-04-rent-due-board.md`
describes each rent entry as if it holds one flat "amount paid" value —
but its own part-payment rule immediately complicates that: **"If the
amount received is less than the rent due, the row shows 'Part paid —
₹4,000 pending' and remains in the Pending filter. A receipt is issued
for the amount actually received."** A tenant who part-pays today and
tops up the balance next week generates *two* separate receivable
events against the *same* rent entry — which a single `amountPaid`
field on `rent_entry` cannot represent without losing the first
receipt's own date/reference/receipt-number.

**Why they cannot both be implemented literally.** "One rent entry, one
amount-paid value" and "each partial payment gets its own receipt with
its own date and reference" are incompatible the moment a rent entry
receives more than one payment.

**Decision.** `payment` is its own entity, a child of `rent_entry`
(one `rent_entry` → many `payment` rows). Each `payment` carries its own
amount, date received, payment reference, and receipt number.
`rent_entry.amountPaid` and its displayed status ("Paid" / "Part paid —
₹n pending" / "Nd late") are **derived** — the sum of its child
payments compared against `rentDue` — not stored as an independent
field that could drift out of sync.

**Consequences.**

- `L04-BTN-MARKPAID`'s "amount received … payment reference (optional)"
  form is what creates one `payment` row, not what sets a field on
  `rent_entry` directly.
- `L05-TML-REMINDERS`-style history and receipt printing (`P-01`) key off
  individual `payment` rows, not the rent entry as a whole — a rent entry
  that was part-paid twice has two receipts, and `P-01` needs to know
  which one it's printing.
- This decision is deliberately scoped to **rent** payments only — see
  `D8` for why deposit and repair-cost-recovery payments are *not*
  folded into the same `payment`/`rent_entry` relationship.

---

## D8 — Deposit and repair-cost-recovery payments are not `rent_entry`-child payments

**Tags:** database schema, maintenance behaviour, payment/rent logic

**Conflicting source requirements.** `D7` scopes `payment` to be a child
of `rent_entry`. But the product has at least two other places money
changes hands that are **not** rent: `spec/screens/shared/S-02-payment-sheet.md`
(the generic payment sheet) is explicitly reused, per
`spec/product.md`'s twelve-connections table, for "deposit at move-in"
and "a repair the tenant is liable for" — neither of which has, or
should have, an associated `rent_entry`.

**Why this needed its own decision.** Applying `D7` broadly — "all
money the tenant sends is a `payment` row under some `rent_entry`" —
would force a fake or nullable `rent_entry` link onto deposit and repair
payments, which is exactly the kind of unrequested schema complexity
this ticket warns against inventing.

**Decision.** `payment` (child of `rent_entry`) models **rent payments
only**. A tenant-liable repair cost recovered via `S-02`
(`L07-CHK-TENANTLIABLE` → "Send payment request") is tracked directly on
the `maintenance_request` it belongs to (its existing `cost` field, plus
whatever "recovered" marker a later schema ticket adds) — it does not
create a `payment` row. Deposit collected at move-in is tracked on
`tenancy.deposit_amount` (`D6`) — again, no `payment` row, since nothing
in the spec shows a deposit-receipt flow analogous to `P-01`.

**Consequences.**

- Keeps `D7`'s new entity narrowly scoped to what the spec actually
  describes (rent, with receipts, with part-payment history) instead of
  generalising into a cross-cutting ledger the spec never asked for.
- A future schema ticket designing "how is a tenant-liable repair cost
  actually confirmed as received" starts from a clean slate on
  `maintenance_request`, not from bolting onto `rent_entry`/`payment`.

---

## D9 — `audit_event` is its own, unified entity

**Tags:** database schema, security/privacy · **Mandatory correction 6**

**Conflicting source requirements.** The spec independently describes
several "this happened, then this happened" histories with near-identical
shape but no shared name: `L05-TML-REMINDERS` ("every reminder sent, its
level, when, by which method; plus any logged calls"),
`L07-TML-HISTORY` ("every status change, message sent and note added"),
and `T03-TML-ITEM` (a tenant-safe view of "reported, assigned, updated,
completed"). Read literally, each screen spec implies its own bespoke
history mechanism.

**Why this needed resolving before schema.** Building each of these as a
separate, differently-shaped table would duplicate the same
"who/what/when/on which record" pattern three-plus times, and would make
`T03-TML-ITEM`'s requirement to be a *filtered, tenant-safe* view of the
*same underlying facts* as `L07-TML-HISTORY` awkward to guarantee (two
independently-maintained tables can drift out of sync).

**Decision.** One `audit_event` entity underlies every timeline in the
product: a generic (entity type, entity id, event type, timestamp,
actor, payload) record. `L05-TML-REMINDERS`, `L07-TML-HISTORY`, and
`T03-TML-ITEM` are each a filtered *view* over `audit_event` rows — the
reminder timeline filters to rent-entry-scoped events, the maintenance
history to one request's events, and the tenant's own view additionally
strips anything `is_protected` (see `D10`) or otherwise landlord-only
(vendor, cost, internal notes — per `L-07`'s own "never expose to the
tenant" rule) before rendering.

**Consequences.**

- Every place the spec currently describes an ad hoc "history" or
  "timeline" component is, structurally, the same query shape against
  one table — new timelines (e.g. a future agreement-renewal history)
  don't need new tables.
- `T03-TML-ITEM`'s tenant-safe wording rule ("Plain words, no internal
  jargon") becomes a rendering-layer concern (which `audit_event` rows
  and fields are eligible to reach a tenant view), not a
  separately-maintained data source that could fall out of sync with the
  landlord-facing timeline.
- This is the natural place a future schema ticket would also record
  agreement renewals, notice-given events, and document uploads, without
  this document mandating that it must.

---

## D10 — `document.is_protected`, with a safe default and concrete category assignments

**Tags:** database schema, security/privacy, documents, tenant vs landlord behaviour · **Mandatory correction 7**

**Conflicting source requirements.** `spec/cross-cutting.md`'s firm rule
states no tenant-facing screen may show "rent amounts, repair costs,
other units, or other tenants," and `spec/screens/landlord/L-07-request-detail-panel.md`
adds explicitly: **"Never expose to the tenant: the vendor's rate, the
cost recorded, internal notes, or any other unit."** But other documents
in the product are tenant-relevant by design — move-in condition photos
exist specifically as shared evidence for *both* sides (`spec/product.md`'s
"Evidence, always" principle), and a tenant's own submitted maintenance
photos are plainly theirs to see again on `T-03`. A single, product-wide
"tenant never sees documents" rule would be too broad; a single
"documents are fine to expose" default would be actively unsafe.

**Why this needed resolving before schema.** Without a per-document
flag, either every document query needs bespoke, screen-specific
filtering logic scattered across the codebase (easy to get wrong once,
catastrophic if wrong on the cost/vendor side), or nothing is protected
by default (unsafe).

**Decision.** `document` (and the same-shaped photo/attachment records)
gets a boolean `is_protected`, **defaulting to `true`** — i.e. hidden
from every tenant-reachable code path unless explicitly marked
otherwise. Only two categories are set `is_protected = false`:

- Move-in condition photos of the tenant's **own** unit (not cost data,
  not another unit, not another tenant — compliant with the general
  rule, and directly serves "Evidence, always").
- A tenant's **own** submitted maintenance-request photos and any
  "after" photos the landlord adds to that same request (already the
  substance of `T-03`).

Everything else — agreement PDFs, ID proofs, vendor invoices/cost
documents, internal notes attachments, and deposit-deduction photos —
stays `is_protected = true` always. Deposit-deduction photos in
particular are never exposed via a raw per-document endpoint; what a
tenant eventually sees is the **compiled, landlord-sent settlement
statement** (`P-02`, delivered through `S-01`'s "nothing sends by itself"
gate), not document-level access to the underlying photo. This keeps
`is_protected` a simple static flag rather than a settlement-status-
dependent one — avoiding inventing a more complex conditional-visibility
mechanism the spec never asked for.

**Consequences.**

- Every tenant-facing document query can apply one filter
  (`is_protected = false`) plus an ownership check, rather than
  per-screen bespoke logic.
- `L11-BTN-SENDAGREEMENT`'s existing behaviour (emailing the agreement
  out, rather than the tenant browsing it in-app) is preserved and now
  has a structural reason: agreement documents are `is_protected = true`
  by category, so out-of-band email is the only path, not an oversight.
- New document categories added later must explicitly justify setting
  `is_protected = false` — the safe default does the work of preventing
  accidental leaks.

---

## D11 — Reminder ladder: three levels fixed, day-thresholds configurable

**Tags:** payment/rent logic

**Conflicting source requirements.** `spec/product.md`'s "Rent
lifecycle" flowchart describes escalation at fixed days 3, 10 and 20.
`spec/screens/landlord/L-15-settings.md`'s `L15-TBL-LADDER` states: "The
reminder ladder: day 3 gentle, day 10 direct, day 20 formal. **Days are
editable; the three levels are fixed.**"

**Why they cannot both be implemented literally.** "Escalation always
happens at day 3/10/20" and "the landlord can edit which day each tier
fires on" conflict the moment any landlord changes a threshold — the
flowchart's fixed days would then be wrong for that landlord.

**Decision.** Per-landlord configurable day-thresholds (three values,
one per tier), defaulting to 3/10/20; the count of tiers (three: gentle,
direct, formal) is fixed and not configurable. This follows the UI/UX
Specification, which states on its own cover page that it should be
"treated as the source of truth for version one."

**Consequences.**

- `escalation_level` / reminder-due calculations read the active
  landlord's configured thresholds, not hardcoded constants.
- `spec/product.md`'s flowchart remains accurate as the *default*
  landlord configuration, not a system-wide invariant.
- This was already noted as an OPEN item in `spec/index.md` and
  `spec/product.md`; this entry is its formal resolution record.

---

## D12 — "Outstanding" spans all unpaid months, not just the current one

**Tags:** payment/rent logic, database schema

**Conflicting source requirements.** `spec/screens/landlord/L-03-portfolio-dashboard.md`'s
`L03-CRD-DUES` stat card is titled "Outstanding" with no stated time
window, while `spec/screens/landlord/L-04-rent-due-board.md`'s board is
explicitly scoped to one month at a time (`L04-SEL-MONTH`). Read
literally against `L-04`'s month-scoping, "Outstanding" could mean
either "unpaid this month" or "unpaid ever" — and the two give visibly
different numbers the moment any rent entry is more than one month
overdue.

**Why this needed resolving before schema.** This is a dashboard
aggregate query, not just a display label — schema/implementation can't
proceed on `L03-CRD-DUES` without knowing whether it's a single-month
`WHERE` clause or an all-time one.

**Decision.** "Outstanding" sums every unpaid or part-paid `rent_entry`
for the landlord's portfolio, across all months, not just the current
one — consistent with the product's own framing of overdue rent as a
"quiet leak" that "repeats every month" (`spec/product.md`'s problem
statement) rather than something that resets monthly. Each month's
`rent_entry` remains an independent row (per `L-04`'s per-unit-per-month
model) — there is no automatic merging or carry-forward of an unpaid
balance into the next month's row.

**Consequences.**

- `L03-CRD-DUES` is an aggregate across all `rent_entry` rows with
  `amountPaid < rentDue`, not scoped to the current month.
- A tenant who has been overdue for three consecutive months shows up as
  three separate `rent_entry` rows (each individually visible in
  `L-04`'s history), all counted in the dashboard total — old debt is
  never silently hidden by a new month's row.

---

## D13 — Receipts (`P-01`, `RR-nnnn`) are a rent-only concept

**Tags:** receipts, payment/rent logic

**Conflicting source requirements.** `spec/screens/print/P-01-rent-receipt.md`
and `spec/cross-cutting.md`'s E1 message table both tie receipt issuance
specifically to rent payment (`L04-BTN-MARKPAID` → "Receipt RR-0847
created"). But the product also collects money via the same generic
`S-02` payment sheet for deposits and tenant-liable repair costs (see
`D8`), and nothing in the source ever shows a receipt being generated
for either of those.

**Why this needed resolving before schema.** Leaving this unstated risks
a schema/implementation ticket "filling the gap" by inventing a
deposit-receipt or repair-cost-receipt flow the spec never asked for —
exactly the kind of unrequested behaviour this ticket says not to add.

**Decision.** Receipts are a rent-only concept in v1. Deposit collection
is reflected in `L-13`'s ledger (`L13-TBL-HELD`) and eventual settlement
statement (`P-02`); a recovered tenant-liable repair cost is reflected
on the `maintenance_request` itself (`D8`). Neither generates a `P-01`-
style numbered receipt.

**Consequences.**

- `payment` rows (`D7`) are the only thing that ever produces a
  receipt number — deposit and repair-cost tracking don't need a
  receipt-numbering scheme of their own.
- If a future ticket decides deposits or repair payments should get
  receipts too, that's a new product decision to make explicitly, not an
  inferred consequence of this schema work.

---

## D14 — Receipt and request numbers are scoped per landlord, not global

**Tags:** receipts, database schema, security/privacy

**Conflicting source requirements.** `spec/cross-cutting.md`'s E1 table
shows friendly, low, sequential-looking numbers — `RR-0847`, `R-0412` —
the kind produced by a counter that starts near zero. RentRoll is
explicitly multi-landlord (`spec/cross-cutting.md`'s E4 boundary tests
exist precisely because multiple landlords share the system). A single
global counter shared by every landlord would (a) make each landlord's
numbers jump unpredictably based on *other landlords'* activity, and
(b) leak a rough signal of total platform-wide transaction volume
through any one landlord's own receipt numbers.

**Why this needed resolving before schema.** Sequence/uniqueness scope
is a schema-level decision (a single global sequence vs. a per-landlord
one) that has to be made before the numbering column can be defined.

**Decision.** Receipt numbers (`RR-nnnn`) and request numbers (`R-nnnn`)
are sequential **per landlord**, not globally. Two different landlords
can both have an `RR-0001`.

**Consequences.**

- Uniqueness constraints on receipt/request numbers must be composite
  (scoped by landlord), not a bare global unique column.
- Numbers stay low and friendly for every landlord regardless of the
  platform's overall size — consistent with the product's small-landlord
  framing ("Landlords with 5 to 50 units").
- This is independent of `D1`'s tokens, which — unlike receipt numbers —
  **are** globally unique (see `D15`).

---

## D15 — Tokens (`door_token`, `tenant_token`) are globally unique

**Tags:** tokens, database schema, security/privacy

**Conflicting source requirements.** None directly conflicting, but this
needed to be stated explicitly once `D1` split the token into two: the
tenant-facing route (`D2`) is `/u/:token` with no landlord or property
segment in the URL at all — `spec/screens/tenant/T-01-report-a-problem.md`
is explicit that "unit numbers are never used in the URL." A lookup by
token alone can only resolve unambiguously if the token space is global.

**Decision.** Both `unit.door_token` and `tenancy.tenant_token` are
unique across the entire system, not merely within one landlord's data
(unlike `D14`'s receipt numbers, which are intentionally *not* globally
unique).

**Consequences.**

- Token generation must check for collisions platform-wide (in practice,
  a sufficiently long random token per `T-01`'s "long and random" rule
  makes this a non-issue in practice, but the constraint itself must be
  global-unique, not landlord-scoped-unique).
- This is the one place in the schema where "unique per landlord" is the
  wrong default to reach for — worth stating explicitly given `D14`
  makes the opposite call for receipt numbers right next to it.

---

## D16 — Reopening a Done maintenance request reuses "In progress"; no new status value

**Tags:** maintenance behaviour, database schema

**Conflicting source requirements.** `spec/screens/landlord/L-06-maintenance-board.md`
states "a request can be reopened from Done; doing so writes a timeline
entry rather than creating a new request" — but never says what status
the reopened request moves *to*. The landlord-facing status set
(`L-06`'s board columns) and the tenant-facing status set
(`T03-CHP-STATUS`) are each explicitly enumerated as exactly four values
— New/Assigned/In progress/Done, and Received/Assigned/In
progress/Done respectively — with no fifth "Reopened" value anywhere in
either enumeration.

**Why this needed resolving before schema.** A status column needs a
defined, closed set of valid values; "reopened" needs to map to one of
the existing four rather than silently requiring a fifth.

**Decision.** Reopening moves the request's status to **"In progress"**
(landlord side) / **"In progress"** (tenant side, same word already in
`T03-CHP-STATUS`'s vocabulary) — reusing the existing enum rather than
adding a "Reopened" value, and consistent with "in progress" already
being the natural landlord-side state for "not finished, being worked
on again."

**Consequences.**

- `maintenance_request.status` stays a 4-value enum on both the landlord
  and tenant projections — no schema or vocabulary change needed to
  support reopening.
- The `audit_event` (`D9`) record of the reopen action is what
  distinguishes "was In progress, then reopened from Done" from
  "has been In progress the whole time" — the status column alone
  doesn't need to carry that distinction.

---

## D17 — Vendor stays as inline fields on `maintenance_request`, not a normalized entity

**Tags:** maintenance behaviour, database schema

**Conflicting source requirements.** `spec/screens/landlord/L-07-request-detail-panel.md`'s
`L07-FLD-VENDOR` is described as a free-text field that "remembers
previously used vendors as suggestions" — implying *some* persisted list
of vendor names/phones exists to suggest from. But no screen anywhere in
the fifteen landlord screens manages vendors directly (no vendor list,
no vendor detail page, no vendor edit/delete flow) — the spec never
treats a vendor as an entity with its own identity beyond "a name and
phone number that's been typed before."

**Why this needed resolving before schema.** Left unresolved, a schema
ticket could reasonably go either way — a normalized `vendor` table (with
its own primary key, referenced by many requests) or a plain text field
— and the two have materially different schema shapes. Building the
former would be inventing product surface area (vendor management) the
spec never asked for.

**Decision.** Vendor stays as two plain fields (`vendor_name`,
`vendor_phone`) directly on `maintenance_request`. "Remembers previously
used vendors as suggestions" is a `SELECT DISTINCT`-style query over a
landlord's own past requests, not a foreign key into a dedicated vendor
table.

**Consequences.**

- No vendor management screens or vendor entity are implied or required
  by this decision — matches the spec's actual scope exactly.
- If a future ticket introduces real vendor management (vendor-level
  history, ratings, a vendor detail screen), that's a new product
  decision requiring its own spec work, not something this schema
  silently already supports.

---

## Decisions resolved in this pass

D1–D17 above. Seven are this ticket's mandatory schema corrections
(`D1`, `D3`, `D4`, `D5`, `D7`, `D9`, `D10`); the remaining ten
(`D2`, `D6`, `D8`, `D11`–`D17`) are additional genuinely-blocking
conflicts found across the same eight-lens review (schema,
security/privacy, tenant vs landlord behaviour, navigation, payment/rent
logic, maintenance behaviour, receipts, tokens, documents).

## Genuinely non-blocking items intentionally left open

These were considered and deliberately **not** turned into decisions,
because resolving them now would mean inventing product behaviour the
spec doesn't ask for, or because they don't actually block schema work:

- **Missing source material** (`spec/index.md`'s existing note) — the
  Product Scope Document's §14–§18 (including the entity relationship
  diagram) and part of the UI/UX Specification's §E4 were never in the
  files supplied for the original conversion. This isn't a decision to
  make; it's unavailable information. It's the reason this document
  exists instead of a schema.
- **`L-14`/`L-15` route paths** (`/documents`, `/settings`) — already
  resolved by inference in `spec/index.md`; low-stakes enough that it
  doesn't block schema (routes, not data shape).
- **"One tap to act" vs. detail-panel navigation** — a soft UX tension
  already noted in `spec/index.md`, not a data-modelling conflict.
- **Exact pro-rata rent formula** for a mid-month move-in — `L-04`'s own
  rule already says "the landlord can edit the amount before marking
  paid," meaning the system only needs a suggested default, not a
  precisely specified formula; inventing a specific rounding rule here
  would be exactly the "unnecessary product behaviour" this ticket warns
  against. Left to whichever ticket implements the suggestion.
- **Binary asset storage** (where photo/document files actually live —
  which bucket, which CDN) — an infrastructure choice, not a product
  decision, and out of scope for a decisions record.
- **Multi-user landlord accounts** (can more than one person sign in for
  one landlord's business?) — the spec is silent, not contradictory;
  nothing forces an answer now, and inventing one would be scope creep.

## What would still block schema development

Everything structurally required to start schema work is now decided.
The one real dependency schema work still has is on **source material,
not decisions**: without the original Product Scope Document's missing
entity-relationship diagram (§15) and data-flow diagram (§14), a schema
ticket is starting from this document's decisions plus the screen specs
alone, with no independent second source to cross-check against. That is
a known, already-documented gap (`spec/index.md`), not a new blocker
introduced here — and this document's D1–D17 are written to be
sufficient to start schema design without it.
