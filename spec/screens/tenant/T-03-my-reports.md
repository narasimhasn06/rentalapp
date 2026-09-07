# T-03 · My reports and status

Source: UI/UX Specification v1.0, Part C.

## Meta

| | |
|---|---|
| **Route** | OPEN: not documented in source. Reached via `T01-LNK-MYREPORTS` and `T02-BTN-TRACK`. See `spec/index.md`. |
| **Purpose** | Let the tenant see every problem they've reported and its current status. |

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `T03-LST-REPORTS` | List | Every request from this unit's current tenancy: number, category, date, status chip, and the landlord's latest update if any |
| `T03-CHP-STATUS` | Status chip | Received · Assigned · In progress · Done. Plain words, no internal jargon. |
| `T03-TML-ITEM` | Timeline | Expanding a report shows its history — reported, assigned, updated, completed — with tenant-safe wording only |

## Empty state

"You have not reported anything yet." with a "Report a problem" action —
see `spec/cross-cutting.md` E2.
