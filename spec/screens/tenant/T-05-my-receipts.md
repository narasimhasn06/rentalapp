# T-05 · My receipts

Source: UI/UX Specification v1.0, Part C.

## Meta

| | |
|---|---|
| **Route** | OPEN: not documented in source. See `spec/index.md`. |
| **Purpose** | Let the tenant see and print proof of what they've paid. |

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `T05-LST-RECEIPTS` | List | Month · amount · receipt number · a print button each |
| `T05-BTN-PRINT` | Icon button | Opens `P-01` for that receipt |

## Rule — the one documented exception to "no money on tenant screens"

Receipts on this screen do show amounts, because those are the tenant's
own payments and the receipt is the point of the screen. See
`spec/cross-cutting.md` for how this is reconciled with the general rule
that tenant screens never display money.

## Empty state

"Receipts appear here once your landlord records a payment." — see
`spec/cross-cutting.md` E2.
