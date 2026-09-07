# L-15 · Settings

Source: UI/UX Specification v1.0, Part B.

## Meta

| | |
|---|---|
| **Route** | `/settings` — OPEN: not stated explicitly in source; inferred from the sidebar nav label "Settings" (`spec/foundations.md` A3). See `spec/index.md`. |
| **Purpose** | Account-wide defaults used elsewhere in the product: payment identity, receipt branding, the rent escalation default, and the reminder ladder. |

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `L15-FLD-UPI` | Text field | UPI ID used in every payment link and QR |
| `L15-FLD-RECEIPTNAME` | Text field | Name printed on receipts and statements |
| `L15-UPL-LOGO` | Photo uploader | Optional logo for print views. See `S-04`. |
| `L15-FLD-ESCDEFAULT` | Text field | Default rent escalation percentage, used to pre-fill `L12-FLD-ESCALATION` |
| `L15-TBL-LADDER` | Editable table | The reminder ladder: day 3 gentle, day 10 direct, day 20 formal. **Days are editable; the three levels are fixed.** |
| `L15-FLD-CAEMAIL` | Text field | Accountant's email, used by `L14-BTN-EMAILCA` |

> OPEN: see `spec/index.md` and `spec/product.md` §"Rent lifecycle" — this
> screen states the reminder ladder's day thresholds are editable, while
> the Product Scope Document's rent lifecycle flowchart describes days 3,
> 10 and 20 as if fixed. Treated here as: three levels fixed, day
> thresholds configurable, defaulting to 3/10/20.
