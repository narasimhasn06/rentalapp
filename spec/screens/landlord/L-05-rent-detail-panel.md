# L-05 · Rent detail panel

Source: UI/UX Specification v1.0, Part B.

## Meta

| | |
|---|---|
| **Route** | `/rent/:entryId` — opens as a panel over `L-04` |
| **Purpose** | Everything about one month's rent for one unit, including the full reminder history. |

## Components

| ID | Type | Content and behaviour |
|---|---|---|
| `L05-HDR` | Panel header | "Flat 2A · February 2026" · status chip · close button |
| `L05-SEC-AMOUNT` | Key-value block | Rent due · amount paid · due date · date paid · payment reference · receipt number |
| `L05-SEC-TENANT` | Contact block | Tenant name, phone, with call, message and copy icon buttons |
| `L05-TML-REMINDERS` | Timeline | Every reminder sent, its level, when, by which method; plus any logged calls |
| `L05-BTN-REMIND` | Primary button | "Send reminder" |
| `L05-BTN-PAYLINK` | Secondary button | "Payment link" |
| `L05-BTN-MARKPAID` | Secondary button | "Mark paid" |
| `L05-BTN-LOGCALL` | Quiet button | "Log a call" |
| `L05-BTN-EDIT` | Quiet button | "Edit amount" — for pro-rata or agreed adjustments. Any edit is recorded on the timeline with the old and new value. |

## Interactions

| Trigger | Result |
|---|---|
| `L05-BTN-REMIND` | Opens `S-01` at the correct escalation level |
| `L05-BTN-PAYLINK` | Opens `S-02` with the outstanding amount pre-filled |
| `L05-BTN-LOGCALL` | Opens a two-field form: outcome (dropdown: promised to pay / no answer / disputed / other) and a note. Saves to the timeline as a reminder record with method "call". |
| Call icon in `L05-SEC-TENANT` | Dials. On return to the tab, a prompt appears: "Log this call?" — accepting opens the same form as above. |
