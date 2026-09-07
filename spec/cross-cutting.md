# Cross-cutting rules

Source: RentRoll UI/UX Specification v1.0, "How to read this document" and
Part E ("Cross-cutting behaviour"). These rules apply across every screen
in the product and take precedence over any screen-local decision that
would conflict with them.

## The two firm rules

Stated on the UI/UX Specification's own opening page as applying to every
screen in the document:

1. **No message ever leaves the system without the landlord pressing
   send.** The assistant drafts into an editable field and never
   dispatches on its own. (Enforced by `S-01`, the message composer — see
   `spec/screens/shared/S-01-message-composer.md` — which has a mandatory
   "Did you send it?" confirmation step before anything is recorded as
   sent.)
2. **No tenant-facing screen ever queries or displays rent amounts, repair
   costs, other units, or other tenants.** The one documented exception is
   `T-05` "My receipts", which shows amounts because they are the
   tenant's *own* payments and the receipt is the point of the screen —
   see `spec/screens/tenant/T-05-my-receipts.md`.

> Any ticket that appears to require breaking either rule should be
> escalated to product, not implemented as written.

This restates, and is consistent with, the Product Scope Document's
principles "Nothing sends by itself" and "Money stays private" (see
`spec/product.md`).

## E1 · Every message the system shows

| Situation | Message | Type |
|---|---|---|
| Payment recorded | "Payment recorded. Receipt RR-0847 created." | Toast with Undo |
| Reminder logged | "Reminder recorded on the tenant's history." | Toast |
| Copied | "Copied." | Toast, 2 seconds |
| Export ready | "Downloaded rent-2026-02.csv." | Toast |
| Calendar file | "Added — open the file to save it to your calendar." | Toast |
| Request submitted (tenant) | "Reported. Your request number is R-0412." | Full screen — `T-02` |
| Save failed | "Could not save. Your changes are still here — try again." | Inline, above the form |
| Network lost | "You are offline. We will save this when you reconnect." | Banner |
| Assistant unavailable | "Wrote this from a template — edit as needed." | Quiet note inside `S-01` |
| Invalid tenant link | "This link is not valid. Please ask your landlord for your unit link." | Full screen |
| Rent rows missing | "This month's rent rows have not been created." | Banner with action |

**Wording rules.** Never blame the user. Never show a code or an internal
identifier. Never use the words *error*, *invalid*, *failed*, or
*unauthorised* in tenant-facing text. Always say what happens next.

> Note the tension this creates with the row above it: the system message
> for an invalid tenant link is itself specified using the word "not
> valid" — this is the one documented exception, applied to the single
> screen (`T-01`) where a link genuinely doesn't resolve to anything, and
> is worded as a statement of fact rather than blame ("please ask your
> landlord"), not as an error code. Follow the exact wording given rather
> than generalising the "never say invalid" rule to override it.

## E2 · Empty states

| Screen | Message | Action offered |
|---|---|---|
| `L-04` Rent, no units | "Add a unit and this month's rent will appear here." | Add unit |
| `L-04` Rent, all paid | "Everything is paid for February. Nice." | None |
| `L-06` Maintenance | "No open requests. Tenants report problems through their unit link." | Print door QR codes |
| `L-08` Units | "Your properties and units live here." | Add your first unit |
| `L-12` Agreements | "Nothing expiring in the next 90 days." | Switch to All |
| `L-13` Deposits | "Deposits appear here once you add tenants." | Add tenant |
| `T-03` Tenant reports | "You have not reported anything yet." | Report a problem |
| `T-05` Tenant receipts | "Receipts appear here once your landlord records a payment." | None |

Per the shared component library (`spec/foundations.md`, "Display
components" → Empty state): every empty state states what would appear
here and, where relevant, gives the button that creates the first one —
never just "No data."

## E3 · Loading

- **Page load** — skeleton shapes matching the real layout. Never a
  centred spinner on a blank page.
- **Row action** — spinner inside the button only; the rest of the screen
  stays usable.
- **Assistant draft** — skeleton lines inside the text area, with a
  4-second ceiling before falling back to a template.
- **Photo upload** — thumbnail appears instantly from the local file, with
  a progress ring over it.
- **Anything expected to take over 10 seconds does not exist in version
  one.** If a feature needs that long, it is scoped wrong.

## E4 · Permissions — the boundary tests

QA should treat these as the highest-severity test cases in the product.

| Test | Expected |
|---|---|
| Open a unit link belonging to another landlord's unit | Invalid link message |
| Open a former tenant's link after the tenancy ended | Invalid link message |
| Alter the token in a valid tenant URL | Invalid link message |
| Inspect the data behind any tenant page | Contains no rent amount, no cost, no other unit, no other tenant |
| Request another landlord's rent, unit, tenant or request record while signed in | Not found |
| Reach any landlord route while signed out | Redirect to `L-01`, then return to the intended screen after signing in |

> OPEN: see `spec/index.md` — the source PDF is cut off immediately after
> this last row. The UI/UX Specification's own page-footer numbering
> implies at least two more pages of content existed (footer reads up to
> "22" while the supplied file has 20 physical pages) that were not
> included in the file provided for this conversion. Any additional
> boundary tests, and anything in a possible closing section of the
> document, are unknown and must be sourced separately — do not assume
> the table above is exhaustive when writing the security/permissions
> test suite; treat it as a floor, not a ceiling.

## Additional derived rules worth stating explicitly

These are not separately labelled sections in the source but are stated
more than once across screens, and are collected here because they are
cross-cutting in effect:

- **Rate limiting on the public tenant surface.** `T-01` allows 5
  submissions per token per hour, with a plain non-technical message if
  exceeded (see `spec/screens/tenant/T-01-report-a-problem.md`). No
  general API rate-limit policy beyond this is documented in the source.
- **An invisible bot check runs on tenant submission.** A tenant should
  never see a puzzle or CAPTCHA (`T-01`).
- **Photo compression happens on-device before upload**, and photo counts
  are capped: 3 on tenant screens, 10 on landlord screens (`S-04`).
- **Print views are isolated pages**: no navigation, no buttons, white
  background, opened in a new tab, with the browser print dialog
  triggered on load. The app's own interface is never hidden with print
  stylesheets — the print view is a genuinely separate, minimal page (see
  `spec/screens/print/`).
