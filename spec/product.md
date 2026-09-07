# Product — vision, workflows, architecture

Source: RentRoll Product Scope Document v1.0 (Future Agents), §1–§13. See
`spec/index.md` for the note on missing §14–§18.

## Executive summary

RentRoll is a web app that keeps a rental business in one place. The
landlord signs in and sees everything — who has paid, what is broken,
which agreement is about to expire. The tenant does not sign in at all.
They open one link, saved once, and use it to report a problem or check
its status.

Most small landlords in India run their properties on a diary, a
spreadsheet and a WhatsApp group. That works until it doesn't. Rent goes
uncollected because nobody is certain who has paid. An agreement expires
without anyone noticing and months pass at the old rent. A deposit
argument at move-out is settled by whoever remembers more confidently,
because nobody has a photo.

None of these are dramatic failures. They are quiet leaks, and they repeat
every month.

RentRoll fixes them with four ideas:

- **One record for every unit.** Rent history, photos, repairs and
  documents live together, for years.
- **Dates that watch themselves.** Rent due dates and agreement expiry are
  tracked by the app, not by memory.
- **A link for the tenant.** No account, no password, no app to install.
  One page they can use in two minutes.
- **Everything ready to send.** Reminders, receipts and notices are
  drafted for the landlord to review and send in one tap.

The result: the landlord feels the rental business is simple, and stops
carrying it in their head.

**Product:** A web app for landlords and tenants.
**Purpose:** Make renting organised, transparent and tension-free.
**Built for:** Landlords with 5 to 50 units; PG and co-living operators.
**Users:** Landlord (signs in) and tenant (opens a link).

## The problem being solved

### What the landlord lives with today

- **Uncertainty about money.** Rent arrives by UPI to a personal number.
  The notification is buried. On the 12th, they are not sure who has paid.
- **Avoiding the awkward message.** They do not chase on day three because
  it feels rude, so they wait until day twenty-five and then send something
  sharper than they meant to.
- **Dates that slip past.** Nothing announces an expiry. An agreement that
  lapsed in November is discovered in March, and four months of escalation
  are gone.
- **Interruptions.** Maintenance arrives as phone calls at inconvenient
  hours, and half are forgotten by the next morning.
- **Arguments without evidence.** At move-out, nobody has a photo of how
  the flat looked at move-in. The deposit is returned in full because
  arguing is not worth it.
- **March panic.** The accountant reconstructs a year of rental income from
  bank statements, because no receipts were ever issued.

### What the tenant lives with today

- No receipt, which becomes a problem when they need proof of rent paid.
- No idea whether their repair request was noted, or when someone is
  coming.
- Uncertainty about the exact amount and where to send it.
- At move-out, a deposit deduction with no explanation attached.

**The insight:** both sides want the same thing — a clear record. The
landlord wants to know what is owed. The tenant wants proof of what they
paid and what they reported. One shared record solves both, and removes
most of the tension between them.

## Product vision and design principles

A rental business should feel like a tidy folder, not a memory test.

| Principle | What it means in the product |
|---|---|
| **The tenant never signs up** | A tenant who must create an account to report a leaking tap will instead call. One saved link, no password, works on any phone. |
| **Nothing sends by itself** | Every message is drafted by the app and sent by the landlord. A firm reminder sent automatically to someone who paid yesterday damages a relationship permanently. |
| **Money stays private** | The tenant's pages never show rent figures, repair costs, or anything about other units. |
| **Dates are the product** | Rent due and agreement expiry are the two things the app watches so the landlord does not have to. |
| **Evidence, always** | Photos at move-in, photos on every repair, a written reason on every deduction. This is what makes settlement calm. |
| **One tap to act** | Wherever the app shows a problem, the action to fix it is on the same screen. |

> OPEN: see `spec/index.md` §5 — "one tap to act" is a stated principle,
> not a hard constraint verified against every screen in the source; some
> flows route through a detail panel (`L-05`, `L-07`) before an action is
> available, even though inline row actions also exist on the parent
> board. Treat this principle as a design bar for new screens, and flag
> any screen that requires more than one navigation to act on a shown
> problem.

## Who uses the product

| | Landlord | Tenant |
|---|---|---|
| **How they get in** | Signs in with email and password | Opens a saved link. No account. |
| **How often** | A few times a week; more around the 1st to 10th | A few times a year, when something breaks |
| **On what** | Laptop mostly, phone sometimes | Phone, almost always |
| **What they see** | Everything — all units, all money, all history | Only their own unit, and no money |
| **What they want** | To know nothing is slipping | To be heard, and to have proof |

One landlord has many properties. Each property has many units. Each unit
has one current tenant and a history of past tenants. Every tenant gets
their own unit link.

## User journey map (Diagram 1)

Six stages of the landlord-tenant relationship, showing what each side
does, what the app quietly handles, and what changes as a result. Read
left to right.

| Stage | Landlord does | Tenant does | The app does | Result |
|---|---|---|---|---|
| **1 · Setting up** | Adds properties and units. Enters rent, deposit and photos of his UPI ID. | *Not involved yet* | Creates a link and a printable QR for every unit. | Everything is in one place. |
| **2 · Move-in** | Adds the tenant, agreement dates, and photos of the flat's condition. | Gets a welcome message with their unit link. Saves it. Sees the QR too. | Stores the photos. Starts counting down to agreement expiry. | Both sides agree on the starting point. |
| **3 · Every month** | Glances at dues. Sends the drafted reminder. Marks payment received. | Taps the pay link. Amount already filled in. Receives a numbered receipt. | Creates the month's rent rows, drafts reminders, files the receipt. | No chasing and no guessing. |
| **4 · Something breaks** | Assigns him the vendor, sends him the address, records what it cost. | Opens the link, reports the problem with a photo. Checks status later. | Sorts the request, keeps its status, files the cost against the unit. | No late-night calls. Nothing forgotten. |
| **5 · Renewal** | Reviews what is expiring. Sends the renewal notice. Records the new rent with new date. | Confirms renewal, or gives notice. Knows the new rent in advance. | Warns at 90, 60 and 30 days. Works out the escalated rent. | No agreement ever lapses again. |
| **6 · Move-out** | Notes deductions with a reason and a photo for each one. | Receives a written settlement showing every deduction and its photo. | Builds the settlement statement from the deposit ledger and the repair history. | A calm settlement instead of a row. |

## What the product does — the eight modules

Eight modules. The first four are what the landlord uses most weeks; the
last four are the ones that prevent the expensive mistakes.

| Module | What it shows | What the landlord can do from it |
|---|---|---|
| **Portfolio dashboard** | Occupied against vacant, collected this month, dues outstanding, agreements expiring soon, income over time | Jump straight to whatever is red. This is the "is anything wrong" screen. |
| **Rent due board** | A grid of month against unit — paid, pending, or overdue by so many days | Send the drafted reminder, share a payment link, mark payment received, issue and send the receipt |
| **Tenant request portal** *(the tenant's page)* | To the tenant: a simple form and the status of what they reported | Nothing — this page belongs to the tenant. No rent, no costs, no other units. |
| **Maintenance board** | Every request by status, with photos, the vendor assigned and what it cost | Assign a vendor with the address, update the tenant, record the cost against the unit |
| **Unit register** | Every unit, its rent, its deposit, its condition photos and its full repair history | Add units, print the door QR, review what a unit has cost over the years |
| **Tenant record** | Contact details, agreement dates, rent paid to date, deposit held, documents | Call, message, share the unit link, attach agreement |
| **Agreement tracker** | Everything expiring in 90, 60 and 30 days, with the renewal value calculated | Send a renewal notice, add the date to a calendar, record a notice served |
| **Deposit and settlement** | Deposit held, each deduction with its reason and photo, the balance due back | Build the settlement statement, print it, send it to the tenant |

> **Deliberately not in the product:** listing vacant flats, tenant
> background checks, accounting software integration, and anything that
> sends a message without the landlord reading it first. Each of these
> either belongs to someone else's product or breaks a principle above.

Screen-level mapping of these modules to the UI/UX Specification: Portfolio
dashboard → `L-03`; Rent due board → `L-04`/`L-05`; Tenant request portal →
`T-01`–`T-05`; Maintenance board → `L-06`/`L-07`; Unit register → `L-08`/
`L-09`; Tenant record → `L-10`/`L-11`; Agreement tracker → `L-12`; Deposit
and settlement → `L-13`.

## Information architecture (Diagram 5)

Two separate worlds sharing one set of records. Everything on the landlord
side needs a sign-in; everything on the tenant side needs only a link.

- **Landlord workspace** (requires sign-in): Portfolio dashboard, Rent due
  board, Maintenance board, Agreement tracker, Unit register, Tenant
  records, Deposit & settlement, Documents & exports.
- **Tenant link** (one link per unit, no sign-in): Report a problem, Track
  what I reported, My unit and contact details, My receipts.
- **Both sides read and write the same shared records underneath.** The
  tenant side has no path to any money screen.

## User flow diagram (Diagram 2)

**Tenant · no sign-in.** Three screens deep, no account needed:
Opens the saved unit link → Reports a problem (category · description ·
photo · urgency) → Sees a confirmation (with a request number) → Returns to
the same link later, to check status or find a receipt. The tenant also
arrives at these same screens by message: a rent reminder with a payment
link, a receipt, and status updates.

**Landlord · signs in.** Always starts at the dashboard, which routes to
whichever board holds today's problem; every board carries its own
actions:

- Signs in → Portfolio dashboard ("what needs attention today")
- Dashboard → **Rent due board** → Send reminder / Share payment link /
  Mark paid → receipt / Print or export
- Dashboard → **Maintenance board** → Assign a vendor / Send him the
  address / Record the cost / Update the tenant
- Dashboard → **Agreement tracker** → Send renewal notice / Add date to
  calendar / Settle a deposit / Print the statement
- Dashboard → **Units & tenants** → Add a unit or tenant / Upload
  condition photos / Share the unit link / Print the door QR

## Rent lifecycle (Diagram 3)

The one rule set worth writing down precisely: what happens to a month's
rent from the day it is due. **Every reminder is drafted by the app and
sent by the landlord — the app never sends on its own.**

1. **1st of the month** — a rent row is created per unit.
2. **Paid by the due date?**
   - Yes → landlord marks it paid; receipt is numbered, printed or sent.
   - No → **Day 3 — gentle nudge** (drafted, landlord reviews and sends).
3. **Paid now?**
   - Yes → marked paid, receipt issued; reminder history is kept on the
     record.
   - No → **Day 10 — direct reminder** (states the amount and the date).
4. **Paid now?**
   - Yes → marked paid, receipt issued; the month closes on the board.
   - No → **Day 20 — formal notice** (quotes the agreement clause).
5. **Landlord calls the tenant.** The call is logged on the record.

Three escalation steps at day 3, 10 and 20, each with a different tone.
The landlord approves every message. Whatever happens is written to the
record, so the history is complete either way.

> OPEN: see `spec/index.md` §4 — the UI/UX Specification's Settings screen
> (`L-15`, `L15-TBL-LADDER`) states these day thresholds (3/10/20) are
> editable per landlord, while the count of escalation levels (three) is
> fixed. This spec treats 3/10/20 as the **default** ladder, not an
> immutable rule, following the UI/UX Specification as the stated source
> of truth for v1.

## Where the assistant helps

The app has an assistant built in. It is used in three places only, and
**never to send anything**:

| Where | What it does | Why it matters |
|---|---|---|
| **Rent reminders** | Writes the message at the right tone for how late the payment is — warm at day three, direct at day ten, formal at day twenty | This is the feature that changes behaviour. Landlords avoid chasing early because the words feel rude. Having the right words ready removes that hesitation. |
| **Maintenance requests** | Reads what the tenant typed and suggests a category and an urgency | Consistent sorting is what makes the "what keeps breaking" view possible later. |
| **Deposit settlement** | Turns the deposit amount, the deductions and their reasons into a written statement | A clear statement that explains each deduction turns an argument into a signature. |

> **Firm rule:** the assistant drafts, the landlord decides. Nothing
> written by the assistant reaches a tenant without the landlord reading
> it first. This is a product rule, not a preference. (Enforced in the UI
> by `S-01`, the message composer — see `spec/screens/shared/S-01-message-composer.md`.)

## The twelve connections

All twelve are available from day one. None of them is a screen of its
own — each one appears inside the workflow where it is needed, often in
several different places. The design decision behind this list: connections
were chosen that open apps the landlord and tenant already use, rather than
asking them to adopt anything new. Nothing to install, nothing to
configure, nothing that can stop working or start charging.

| # | Connection | Where it is used in the product |
|---|---|---|
| 1 | **Pay by UPI** | Opens the tenant's payment app with the exact amount already filled in. Used for: monthly rent from a reminder · deposit at move-in · a repair the tenant is liable for · a late fee |
| 2 | **Payment QR** | The same payment, as a scannable code. Used for: printed on every receipt · shown on the rent screen so the landlord can hold up his laptop · shared with a tenant whose phone will not open links |
| 3 | **Send on WhatsApp** | Opens WhatsApp with the message already typed, for the landlord to review and send. Used for: rent reminders · receipts · maintenance updates · sending a vendor the job and address · welcoming a new tenant with their link · renewal notices |
| 4 | **Send by email** | Opens the email app with subject and body ready. Used for: the year's rent records to the accountant in March · a copy of the agreement to a tenant who needs it for their office · a monthly statement to a property owner |
| 5 | **Tap to call** | Dials without copying the number, then offers to log the call. Used for: calling a tenant from an overdue rent row · calling from a maintenance request · calling a vendor · and on the tenant's own page, so they can reach the landlord without saving his number |
| 6 | **Open in Maps** | Turns an address into directions. Used for: the vendor being sent to a flat · a prospective tenant coming to view a vacant unit · the location shown on the property record |
| 7 | **Copy in one tap** | Puts text on the clipboard. Used for: any drafted message · a unit's link · the landlord's UPI ID · a receipt number |
| 8 | **Share** | Opens the phone's own share menu. Used for: sending a new tenant their unit link · passing a receipt to someone · sharing vacancy details with a broker |
| 9 | **Add to calendar** | Creates a calendar entry in whatever calendar the landlord already uses. Used for: agreement expiry · the notice period ending · a scheduled vendor visit · a rent due date |
| 10 | **Print or save as PDF** | A clean printable page. Used for: rent receipts · the monthly statement · the deposit settlement · a one-page summary of an agreement |
| 11 | **Unit QR code** | A printable code that opens that unit's reporting page. Used for: a sticker inside the flat door · the welcome sheet handed over at move-in · a notice board in the building |
| 12 | **Export to a spreadsheet** | Downloads the data as a file. Used for: the rent ledger for the accountant · maintenance spend per unit · the current tenant list · the deposit register |

Screen-level mapping: connections 1/2 → `S-02` Payment sheet; connection 3
→ `S-01` Message composer (WhatsApp send); connection 4 → `S-01` (email
send) and `L-14`/`L11-BTN-SENDAGREEMENT`; connection 5 → call buttons
across `L-05`, `L-07`, `L-10`/`L-11`, `T-01`, `T-04`; connection 6 → `L-09`
(`L09-BTN-MAP`), `L-07` (dispatch); connection 7 → `S-03`; connection 8 →
`S-03`, `L-09` (`L09-BTN-SHARELINK`), `T-02` (`T02-BTN-SAVE`); connection 9
→ `L-12` (`L12-BTN-CALENDAR`); connection 10 → `P-01`, `P-02`, `P-03`;
connection 11 → `L-08`/`L-09` (`L08-BTN-PRINTQR`, `L09-BTN-QR`), `P-03`;
connection 12 → `L-04` (`L04-BTN-EXPORT`), `L-14` (`L14-BTN-EXPORT-*`).

## System architecture (Diagram 6)

Two ways in, one product core, and twelve connections that hand off to
apps the landlord and tenant already have on their phones. Described in
plain terms (this is a product-level description, not a technical
architecture — no schema or stack decisions are implied here; see
`spec/index.md` for the note on the missing data flow diagram and entity
relationship diagram):

- **Who uses it:** Landlord workspace (signed in, sees everything) and
  Tenant link (no sign-in, one unit only).
- **The product core, three parts:**
  - **The records** — units, tenants, rent, requests, documents and
    photos.
  - **The rules and dates** — monthly rent rows, due dates, expiry
    countdowns, escalation.
  - **The assistant** — drafts reminders, sorts requests, writes
    settlement statements.
- **How people act:** through the twelve connections (pay · QR · WhatsApp
  · email · call · maps · copy · share · calendar · print · unit QR ·
  export).
- **Apps they already have:** Payment apps (on the tenant's phone),
  WhatsApp & phone (messages and calls), Email & calendar (whichever they
  use), Printer & files (receipts, exports, QR).
- Nothing new to install · nothing to configure · no third-party account
  required by either user.
