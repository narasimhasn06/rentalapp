# L-02 · First-run setup

Source: UI/UX Specification v1.0, Part B.

## Meta

| | |
|---|---|
| **Route** | `/setup` |
| **Access** | Signed in, and only while the account has no property. Cannot be revisited afterwards. |
| **Purpose** | Get one property, one unit and the landlord's payment details in, so the dashboard is not empty on first sight. |
| **Leads to** | `L-03` |

## Layout

Three steps on one scrolling page, not a wizard with hidden steps. A
progress line at the top shows all three at once. Every step can be
skipped except the first.

## Components

| ID | Type | Content and behaviour |
|---|---|---|
| `L02-FLD-PROPNAME` | Text field | "Property name" — e.g. Kulkarni Apartments. Required. |
| `L02-FLD-PROPADDR` | Text area | "Address". Required. Used later by the Maps link. |
| `L02-FLD-UNITCOUNT` | Text field | "How many units?" Numeric. Generates that many blank unit rows to fill in. |
| `L02-TBL-UNITS` | Editable table | Columns: unit number, type, monthly rent, deposit. Add row and remove row available. |
| `L02-FLD-UPI` | Text field | "Your UPI ID" — helper text: "This appears on payment links and QR codes sent to tenants." |
| `L02-FLD-BIZNAME` | Text field | "Name to show on receipts". Defaults to the account name. |
| `L02-BTN-FINISH` | Primary button | "Go to my dashboard" |

## Rules

- Unit numbers must be unique within a property. Duplicates show an inline
  error on the offending row only.
- UPI ID is validated for shape (`name@handle`) but not verified. Helper
  text says it can be added later.
- Skipping the UPI step is allowed; the payment features then show a
  prompt to add it, rather than being hidden.

> Note: `L-15` Settings also exposes UPI ID (`L15-FLD-UPI`) and receipt
> name (`L15-FLD-RECEIPTNAME`) fields. Although this screen "cannot be
> revisited afterwards," the same values remain editable later via
> Settings — this is not a contradiction, just two entry points to the
> same underlying fields (one first-run, one ongoing).
