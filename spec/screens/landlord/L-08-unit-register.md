# L-08 · Unit register

Source: UI/UX Specification v1.0, Part B.

## Meta

| | |
|---|---|
| **Route** | `/units` |
| **Purpose** | The list of everything owned, and the way in to a unit's full history. |

## Components and interactions

| ID | Type | Content · what happens |
|---|---|---|
| `L08-TBL-UNITS` | Data table | Columns: Unit · Property · Type · Rent · Current tenant · Status. Row click → `L-09`. |
| `L08-CHP-STATUS` | Status chip | Occupied (success) · Vacant (neutral) · Notice period (warning) |
| `L08-BTN-ADDUNIT` | Primary button | "Add unit" → inline form: property, unit number, type, rent, deposit |
| `L08-BTN-PRINTQR` | Secondary button | "Print door QR codes" → `P-03`, one card per selected unit |
| `L08-CHK-SELECT` | Checkbox | Row selection, enables bulk QR printing and bulk export |
