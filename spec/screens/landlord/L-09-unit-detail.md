# L-09 · Unit detail

Source: UI/UX Specification v1.0, Part B.

## Meta

| | |
|---|---|
| **Route** | `/units/:unitId` — a full page, not a panel, because it holds a lot |
| **Purpose** | The unit's whole life: who lives there, what it earns, what it has cost, what it looked like at move-in. |

## Layout

Header with unit identity and status · four tabs: Overview · Rent history
· Maintenance history · Photos & documents.

## Components

| ID | Type | Content and behaviour |
|---|---|---|
| `L09-TAB-OVERVIEW` | Tab | Rent, deposit, current tenant card, the unit's reporting link with copy and share buttons, lifetime figures: total rent collected, total maintenance spend, net |
| `L09-TAB-RENT` | Tab | Every month, every tenant, ever. Paid or not, and how much. |
| `L09-TAB-MAINT` | Tab | Every request against this unit, with cost. A repeated category shows a quiet note: "Plumbing reported 4 times in 12 months." |
| `L09-TAB-PHOTOS` | Tab | Move-in condition photos grouped by tenancy, plus repair photos, plus documents |
| `L09-BTN-COPYLINK` | Icon button | Copies the unit's tenant link to the clipboard |
| `L09-BTN-SHARELINK` | Icon button | Opens the device share sheet; on desktop falls back to copy |
| `L09-BTN-QR` | Icon button | Shows the unit QR in a modal with a print option |
| `L09-BTN-MAP` | Icon button | Opens the property address in Maps in a new tab |
| `L09-BTN-ADDTENANT` | Primary button | Visible only when vacant. Opens the tenant form. |

> **The lifetime figures on the Overview tab are the quiet insight in this
> product.** "This unit earned ₹2.1 lakh and cost ₹34,000 last year" is a
> fact most landlords have never seen for a single flat. Give it space.
