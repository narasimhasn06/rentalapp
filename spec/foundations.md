# Foundations — design system

Source: RentRoll UI/UX Specification v1.0 (Future Agents), Part A ("How to
read this document" + Foundations) and Part D component entries referenced
from Part A. Every component below is described at the design-system
level; screen-specific usage lives in the relevant `spec/screens/**` file.

## Identifier scheme

See `spec/index.md` for the full table. Every screen, component and
interaction has a stable ID so a bug or task can be traced to an exact line
in this spec. Screen files use these ID prefixes: `L-nn` (landlord,
sign-in required), `T-nn` (tenant, public link, no sign-in), `S-nn`
(shared component used on several screens), `P-nn` (print view).

Each screen specification in `spec/screens/**` follows this structure,
carried over verbatim from the source document's own convention:

- **Meta** — route, who can reach it, why it exists, where users arrive
  from and leave to.
- **Layout** — the regions of the screen, top to bottom.
- **Components** — every element with its ID and content.
- **Interactions** — what happens on every click, in order.
- **States** — loading, empty, error, and any state-specific display.
- **Rules** — validation, permissions, edge cases.

### Two rules that apply to every screen

These are repeated in full in `spec/cross-cutting.md` because they govern
every screen in the product, but they are foundational enough to restate
here:

1. No message ever leaves the system without the landlord pressing send —
   the assistant drafts into an editable field and never dispatches.
2. No tenant-facing screen ever queries or displays rent amounts, repair
   costs, other units, or other tenants.

> Any ticket or implementation that appears to require breaking either
> rule should be escalated, not implemented.

## A1 · Design tokens

### Colour

| Token | Value | Used for |
|---|---|---|
| `ink` | `#14202B` | Headings, primary text, numbers on cards |
| `body` | `#3C4A57` | Body copy, table cells |
| `muted` | `#7C8B99` | Labels, helper text, placeholders, timestamps |
| `line` | `#E2E8ED` | Borders, dividers, table rules |
| `canvas` | `#F6F8FA` | Page background |
| `surface` | `#FFFFFF` | Cards, panels, table background |
| `primary` | `#1B3A5C` | Primary buttons, active nav, links |
| `primary-soft` | `#DCE7F0` | Selected rows, active tab background |
| `success` | `#1E7A4D` | Paid status, confirmations |
| `warning` | `#B4761A` | Due soon, expiring, 1–9 days late |
| `danger` | `#B3352C` | Overdue 10+ days, urgent requests, destructive actions |
| `neutral` | `#8A9BA5` | Vacant, closed, archived |

**Status colour is never the only signal.** Every status chip carries a
text label as well as a colour, so the board is readable in print, in
greyscale, and by anyone with colour vision deficiency.

### Type scale

| Token | Size / weight | Used for |
|---|---|---|
| `display` | 28px / 600 | Dashboard headline numbers only |
| `h1` | 20px / 600 | Page title |
| `h2` | 16px / 600 | Card and panel titles |
| `body` | 14px / 400 | Default text, table cells, form values |
| `small` | 13px / 400 | Helper text, secondary detail |
| `label` | 11px / 600, uppercase, 0.6px tracking | Field labels, column headers, stat captions |

One typeface throughout. Numbers in tables and money columns use tabular
figures so digits align vertically.

### Spacing, radius, elevation

| Token | Value | Rule |
|---|---|---|
| `space-1 … 6` | 4, 8, 12, 16, 24, 32px | Nothing outside this scale. Card padding is 16px on mobile, 24px on desktop. |
| `radius-sm` | 6px | Buttons, inputs, chips |
| `radius-md` | 10px | Cards, panels, modals |
| `shadow-1` | `0 1px 2px rgba(20,32,43,.06)` | Cards at rest |
| `shadow-2` | `0 8px 24px rgba(20,32,43,.12)` | Modals, drawers, dropdown menus |

## A2 · Component library

Build these once. Every screen refers to them by name/ID.

### Buttons

| Variant | Appearance | Use for | Notes |
|---|---|---|---|
| **Primary** | Solid primary, white text | The one main action on a screen | Maximum one per screen region |
| **Secondary** | White, primary border and text | Supporting actions | Any number |
| **Quiet** | No border, body text, hover fill | Row-level actions, cancel | Used inside tables |
| **Danger** | White, danger border and text | Delete, remove, end tenancy | Always behind a confirm dialog |
| **Icon** | 32×32, icon only | Call, copy, share, print | Must carry a tooltip and an accessible label |

Heights: 40px default, 32px compact in table rows, 48px on tenant screens
(touch targets). Disabled buttons show a tooltip explaining why. A button
that triggers a network call shows an inline spinner and becomes
non-interactive until it resolves — **never a full-page block.**

### Form fields

| Component | Behaviour |
|---|---|
| **Text field** | Label above, helper text below, error replaces helper text in danger colour. Validates on blur, not on keystroke. |
| **Money field** | Prefixed ₹, digits only, thousands separators shown as the user types, no decimals. |
| **Phone field** | Prefixed +91, accepts 10 digits, strips spaces and dashes on save. |
| **Date field** | Native date picker. Displays as `DD MMM YYYY` everywhere in the product. |
| **Dropdown** | Native select on mobile. Always has a placeholder that is not a valid choice. |
| **Segmented choice** | 2–4 options shown as adjacent buttons. Used for urgency and status filters. |
| **Photo uploader** | See `S-04` (`spec/screens/shared/S-04-photo-uploader.md`). |
| **Text area** | Auto-grows to 8 lines then scrolls. Character counter appears past 400 characters. |

### Display components

| Component | Definition |
|---|---|
| **Stat card** | Uppercase label, display-size number, optional comparison line. Clickable when it has a destination — the whole card is the target, not just the number. |
| **Status chip** | Rounded pill, coloured background at 12% opacity, text in the full colour. Always includes a word. |
| **Data table** | Sticky header, sortable columns marked with an arrow, hover fill, 48px rows. Row click opens the detail panel; buttons inside the row stop the click from propagating. |
| **Detail panel** | Slides in from the right, 480px wide on desktop, full screen on mobile. Closes on Escape, on backdrop click, and on the close button. Warns before closing if a field has unsaved edits. |
| **Timeline** | Vertical list of events, newest first, each with an icon, a line of text and a timestamp. Used for request history and reminder history. |
| **Empty state** | One line explaining what would appear here, and the button that creates the first one. Never just "No data." |
| **Toast** | Bottom-centre, 4 seconds, one optional Undo. Never used for errors that need a decision. |
| **Confirm dialog** | Title as a question, one line of consequence, cancel plus a labelled action button. The action button says what it does — "Delete unit", never "OK". |

## A3 · Global navigation

| Region | Contents and behaviour |
|---|---|
| **Sidebar** (desktop) | Fixed 220px. Logo, then: Dashboard, Rent, Maintenance, Units, Tenants, Agreements, Deposits, Documents. Settings and account sit at the bottom. Active item has `primary-soft` background and a 3px left bar. |
| **Bottom bar** (mobile) | Five items only: Dashboard, Rent, Maintenance, Units, More. "More" opens a sheet with the rest. |
| **Page header** | Title on the left, primary action on the right, filters on the row beneath. Persists while the table scrolls. |
| **Global search** | **Not in version one.** Filters on each board cover the need. |

Tenant screens have **no navigation at all** — no sidebar, no menu, no
links to anything except the tenant's own pages (`T-01` through `T-05`).

## A4 · Responsive rules

| Breakpoint | Behaviour |
|---|---|
| **Under 640px** | Data tables become stacked cards — one card per row, key fields only, tap to open the detail panel full-screen. Bottom navigation bar. Stat cards go two per row. |
| **640–1024px** | Sidebar collapses to icons. Tables keep three columns plus actions. |
| **Over 1024px** | Full sidebar, full tables, detail panel opens alongside rather than over content. |

**Tenant screens are designed mobile-first and are never tested on desktop
only.** Minimum touch target on tenant screens is 48×48px.
