# RentRoll — Implementation Specification

This is the structured implementation specification for RentRoll, converted
from two source documents so that independent engineering agents can build
against it without needing the original PDFs:

- `RentRoll — Product Scope Document` (v1.0) — the "why", the workflows, the
  product architecture.
- `RentRoll — UI/UX Specification` (v1.0) — the "what to build": every
  screen, component and interaction, with stable IDs. Its own cover page
  states it should be **treated as the source of truth for version one**.
  Where the two source documents differ on a detail, this spec follows the
  UI/UX Specification and notes the difference (see `product.md` and the
  relevant screen file) rather than silently picking one.

## How this spec is organized

| File | Contents |
|---|---|
| `spec/product.md` | Product vision, the problem being solved, design principles, users, the end-to-end user journey, the eight product modules, the "twelve connections", the rent lifecycle rule, the assistant rule, and what is deliberately out of scope. |
| `spec/foundations.md` | The design system: identifier scheme, design tokens (colour, type, spacing), the shared component library (buttons, form fields, display components), global navigation, and responsive rules. |
| `spec/cross-cutting.md` | Rules that apply across every screen: the two firm product rules, system messaging copy and tone rules, empty states, loading states, and the permission/security boundary tests. |
| `spec/screens/landlord/*.md` | One file per landlord screen, `L-01` through `L-15`. |
| `spec/screens/tenant/*.md` | One file per tenant screen, `T-01` through `T-05`. |
| `spec/screens/shared/*.md` | One file per shared component/pattern used across screens, `S-01` through `S-04`. |
| `spec/screens/print/*.md` | One file per print view, `P-01` through `P-03`. |

## Identifier scheme (from the UI/UX Specification)

Every screen, component and interaction has a stable ID. Use these IDs in
tickets, commit messages, and QA notes so a bug or task can be traced back
to an exact line in this spec.

| Pattern | Example | Meaning |
|---|---|---|
| `L-nn` | `L-03` | Landlord screen, requires sign-in |
| `T-nn` | `T-01` | Tenant screen, public link, no sign-in |
| `S-nn` | `S-02` | Shared component used on several screens |
| `P-nn` | `P-01` | Print view |
| `Lnn-TYPE-NAME` | `L04-BTN-REMIND` | A specific element on a specific screen |

Element type codes: `BTN` button · `LNK` link · `FLD` input field · `SEL`
dropdown · `CHK` checkbox · `TAB` tab · `ROW` table or list row · `CRD` card
· `MOD` modal · `TST` toast · `CHP` chip or badge · `SEG` segmented choice ·
`TBL` table · `TML` timeline · `LST` list · `HDR` header · `SEC` section/
key-value block · `SEL`/`STRIP` selector/summary strip · `SVG`/`IMG`/`GAL`/
`UPL`/`ZONE`/`THUMB` media and upload elements. These follow the source
document's own conventions per screen; treat any element ID present in a
screen file as stable and citable even if its two-letter type code isn't in
this list.

## Screen index

### Landlord workspace (sign-in required)

| ID | Screen | Route |
|---|---|---|
| L-01 | Sign in | `/signin`, `/signup`, `/reset` |
| L-02 | First-run setup | `/setup` |
| L-03 | Portfolio dashboard (the hub) | `/` |
| L-04 | Rent due board | `/rent` |
| L-05 | Rent detail panel | `/rent/:entryId` |
| L-06 | Maintenance board | `/maintenance` |
| L-07 | Request detail panel | `/maintenance/:requestId` |
| L-08 | Unit register | `/units` |
| L-09 | Unit detail | `/units/:unitId` |
| L-10 | Tenant list | `/tenants` |
| L-11 | Tenant detail | `/tenants/:tenantId` |
| L-12 | Agreement tracker | `/agreements` |
| L-13 | Deposit and settlement | `/deposits`, `/deposits/:tenantId` |
| L-14 | Documents and exports | `/documents` — OPEN: route not stated explicitly in source, inferred from screen name and nav label "Documents" |
| L-15 | Settings | `/settings` — OPEN: route not stated explicitly in source, inferred from nav label "Settings" |

### Tenant link (no sign-in, one link per unit)

| ID | Screen | Route |
|---|---|---|
| T-01 | Report a problem (entry point) | `/u/:unitToken` |
| T-02 | Submitted confirmation | (state of T-01, no distinct route documented) |
| T-03 | My reports and status | OPEN: route not stated in source |
| T-04 | My unit and landlord contact | OPEN: route not stated in source |
| T-05 | My receipts | OPEN: route not stated in source |

> OPEN: The UI/UX Specification gives an explicit `ROUTE` row for T-01
> only. T-02 through T-05 are described as reachable via buttons/links from
> T-01/T-02 (`T01-LNK-MYREPORTS` → T-03, `T02-BTN-TRACK` → T-03, etc.) but
> their own URLs are never stated. Since the whole tenant surface hangs off
> one unguessable token (see `T-01`), the natural implementation is
> sub-routes of the same token, e.g. `/u/:unitToken/reports`,
> `/u/:unitToken/unit`, `/u/:unitToken/receipts` — but this is an
> implementation inference, not a documented requirement. Flagged for
> product/engineering confirmation before building routing.

### Shared components (used across landlord screens)

| ID | Component |
|---|---|
| S-01 | Message composer |
| S-02 | Payment sheet |
| S-03 | Share and copy menu |
| S-04 | Photo uploader |

### Print views

| ID | View |
|---|---|
| P-01 | Rent receipt |
| P-02 | Settlement statement |
| P-03 | Door QR card |

## Source material completeness — OPEN items

This conversion is as complete as the two supplied source PDFs allow. Both
source files are **shorter than their own tables of contents claim**, which
this spec preserves rather than papering over:

> OPEN: The Product Scope Document's table of contents lists 18 sections,
> but the supplied PDF contains only 13 pages of content, ending partway
> through section 13 ("System architecture"). The following sections are
> referenced in the source's own contents page but their content was **not
> present in the file provided** and could not be converted:
> - §14 Data flow diagram (Diagram 7)
> - §15 Entity relationship diagram (Diagram 8)
> - §16 Scope — included, excluded, and later
> - §17 How this makes life easier
> - §18 How we will measure success
>
> This has a direct, deliberate consequence for engineering: **no entity
> relationship diagram or data flow diagram exists in the source material
> made available for this conversion.** Per the P0 scaffold ticket's own
> instruction not to invent schema, no schema is proposed anywhere in this
> spec. A future ticket must either obtain the missing pages of the source
> document or commission a fresh data model before persistence work begins.

> OPEN: The UI/UX Specification's own page footers count up to "22", but
> the supplied PDF contains only 20 pages. Content is cut off partway
> through Part E, section E4 ("Permissions — the boundary tests"), after
> the row "Reach any landlord route while signed out". Any further
> boundary-test rows, and anything in a possible closing section, were
> **not present in the file provided**. `spec/cross-cutting.md` reproduces
> everything that was visible and flags the cut-off explicitly.

## Traceability check

Every table, rule, callout, screen, component and interaction visible in
the supplied source pages has been carried into this spec (into
`product.md`, `foundations.md`, `cross-cutting.md`, or a `spec/screens/**`
file) under a stable ID or an explicit named section. Nothing in the
readable source material was knowingly dropped. The two gaps above are the
only known holes, and they are gaps in the *source files supplied*, not in
this conversion.

## Contradictions and open decisions — summary

Full detail lives next to the relevant content; this is the index of every
`> OPEN:` marker in this spec:

1. **Missing source sections** (above) — Product Scope §14–§18 and UI/UX
   Spec page 21–22 were not in the supplied files.
2. **Tenant screen routes** (above) — only T-01's route is documented.
3. **L-14 / L-15 routes** (above) — inferred from nav labels, not stated.
4. **Reminder ladder days: fixed vs configurable** — see `product.md`
   §"Rent lifecycle" — the Product Scope Document's rent lifecycle
   flowchart states escalation happens at fixed days 3, 10 and 20; the
   UI/UX Specification's Settings screen (`L15-TBL-LADDER`) states these
   day thresholds are editable while the *number* of levels (three) is
   fixed. This spec follows the UI/UX Specification as the stated source
   of truth for v1, but preserves the Product Scope Document's framing
   since it may reflect the intended default/common case.
5. **"One tap to act" vs. detail panels** — see `product.md` §"Design
   principles" — the stated principle is that the fix for any shown
   problem is on the same screen; several boards (e.g. `L-04`) do provide
   inline row actions consistent with this, but also route into a detail
   panel (`L-05`, `L-07`) for deeper history. Not treated as a true
   contradiction (inline actions exist), but noted since a future screen
   design could violate the principle by requiring panel navigation for a
   primary action.

Do not resolve these silently in downstream implementation work — reopen
them with product/design before making a load-bearing decision on any of
them.
