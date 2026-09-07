# L-04 · Rent due board

Source: UI/UX Specification v1.0, Part B.

## Meta

| | |
|---|---|
| **Route** | `/rent` · `/rent?month=2026-02&status=overdue` |
| **Access** | Signed in |
| **Purpose** | See who has paid, and act on who has not, without leaving the screen. |
| **Leads to** | `L-05` detail panel · `S-01` composer · `S-02` payment sheet · `P-01` receipt |

## Layout

Page header with month selector · summary strip · filter row · data table.
On mobile the table becomes stacked cards.

## Components

| ID | Type | Content and behaviour |
|---|---|---|
| `L04-SEL-MONTH` | Month stepper | Back arrow · "February 2026" · forward arrow. Forward is disabled beyond the current month. |
| `L04-STRIP-SUMMARY` | Summary strip | Three figures: expected, collected, outstanding. Updates with the filter. |
| `L04-SEG-FILTER` | Segmented choice | All · Pending · Overdue · Paid. Default All. Reflected in the URL. |
| `L04-SEL-PROPERTY` | Dropdown | Hidden when the landlord has one property. |
| `L04-TBL-RENT` | Data table | Columns: Unit · Tenant · Rent · Due date · Status · Actions |
| `L04-CHP-STATUS` | Status chip | Paid (success) · Due (neutral) · n days late (warning at 1–9, danger at 10+) |
| `L04-BTN-REMIND` | Quiet button | "Remind" — shown only when unpaid |
| `L04-BTN-MARKPAID` | Quiet button | "Mark paid" — shown only when unpaid |
| `L04-BTN-RECEIPT` | Icon button | Print icon — shown only when paid |
| `L04-BTN-EXPORT` | Secondary button | "Export" in the page header |

## Interactions

| Trigger | Result |
|---|---|
| `L04-ROW` | Opens `L-05` detail panel for that rent entry |
| `L04-BTN-REMIND` | Opens `S-01` pre-loaded with the escalation level matching days overdue. Stops row-click propagation. |
| `L04-BTN-MARKPAID` | Opens a small inline form in the row: amount received (pre-filled with rent due), date received (defaults today), payment reference (optional). Confirm → row flips to Paid → receipt number is generated → toast "Payment recorded. Receipt RR-0847 created." with an Undo that reverses it for 10 seconds. |
| `L04-BTN-RECEIPT` | Opens `P-01` in a new tab |
| `L04-BTN-EXPORT` | Downloads a CSV of the current filtered view. File named `rent-2026-02.csv`. Toast confirms. |
| `L04-SEG-FILTER` | Filters the table without a page reload and updates the URL so the view can be shared or bookmarked |

## Rules and edge cases

- **Part payment.** If the amount received is less than the rent due, the
  row shows "Part paid — ₹4,000 pending" and remains in the Pending
  filter. A receipt is issued for the amount actually received.
- **Vacant units** do not appear at all for months in which they had no
  tenant.
- **Mid-month move-in.** The first month's row is created with the
  pro-rata amount, and the row shows a small "pro-rata" note. The landlord
  can edit the amount before marking paid.
- **Rent rows are created on the 1st.** If that job did not run, the board
  shows a banner: "This month's rent rows have not been created" with a
  button to create them now.
- Marking paid twice is impossible — the button is replaced the moment the
  state changes.
