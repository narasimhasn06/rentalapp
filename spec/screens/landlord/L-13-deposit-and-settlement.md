# L-13 · Deposit and settlement

Source: UI/UX Specification v1.0, Part B.

## Meta

| | |
|---|---|
| **Route** | `/deposits` · `/deposits/:tenantId` |
| **Purpose** | Turn a potential argument into a document. This screen exists to be printed. |

## Components

| ID | Type | Content and behaviour |
|---|---|---|
| `L13-TBL-HELD` | Data table | Every deposit currently held: unit, tenant, amount, since when. Total at the top. |
| `L13-SEC-DEPOSIT` | Key-value block | On the settlement page: amount held, date received, agreement reference |
| `L13-TBL-DEDUCTIONS` | Editable table | Each row: description · reason · amount · photo. Add and remove rows. |
| `L13-BTN-FROMREQUESTS` | Secondary button | "Pull from repair history" — lists this tenancy's requests with costs and lets the landlord tick the ones to deduct, carrying their photos across |
| `L13-SEC-BALANCE` | Calculation block | Deposit held − total deductions = refund due. Large, unmissable. |
| `L13-BTN-GENERATE` | Primary button | "Prepare settlement statement" |
| `L13-BTN-PRINT` | Secondary button | Opens `P-02` |
| `L13-BTN-SEND` | Secondary button | Opens `S-01` with the settlement summary |
| `L13-BTN-CLOSE` | Primary button | "Mark settled" → confirm → tenancy closes, unit becomes vacant, statement is filed under documents |

## Rules

- A deduction without a written reason cannot be saved. A deduction
  without a photo shows a warning but is allowed, since not everything is
  photographable.
- If deductions exceed the deposit, the balance shows as an amount owed by
  the tenant, in danger colour, and the statement wording changes
  accordingly.
- Once marked settled, the statement becomes read-only. Corrections
  require a new statement that references the first.
