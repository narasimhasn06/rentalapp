# L-06 · Maintenance board

Source: UI/UX Specification v1.0, Part B.

## Meta

| | |
|---|---|
| **Route** | `/maintenance` |
| **Purpose** | See every reported problem, in order of urgency, and move it along. |
| **Leads to** | `L-07` detail panel |

## Layout

Four status columns on desktop — New · Assigned · In progress · Done — as
a board of cards. On mobile it becomes a single list with a status filter,
because horizontal scrolling boards are unusable on a phone.

## Components

| ID | Type | Content and behaviour |
|---|---|---|
| `L06-COL-NEW` | Board column | Header shows the count. Highest priority column, always leftmost. |
| `L06-CRD-REQUEST` | Card | Unit number · category · first line of the description · urgency chip · photo thumbnail if present · age in days |
| `L06-CHP-URGENCY` | Status chip | Urgent (danger) · Normal (neutral) · Low (muted) |
| `L06-SEG-FILTER` | Segmented choice | All · Urgent · Unassigned · This property |
| `L06-BTN-NEW` | Primary button | "Log a request" — for problems reported by phone or in person |

## Interactions

| Trigger | Result |
|---|---|
| `L06-CRD-REQUEST` | Opens `L-07` |
| Drag a card between columns | Changes the status, writes a timeline entry, and shows a toast offering to notify the tenant. Declining the toast leaves the tenant uninformed, and this is allowed. |
| `L06-BTN-NEW` | Opens the same form as `T-01`, with an added unit selector and a "reported by" field defaulting to "phone call" |

## Rules

- Cards in New older than 48 hours gain a subtle left border in warning
  colour. Older than 7 days, danger colour. No notification, just a
  visual.
- Moving a card to Done requires either a cost figure or an explicit "no
  cost" — this is what keeps the per-unit spend meaningful.
- A request can be reopened from Done; doing so writes a timeline entry
  rather than creating a new request.
