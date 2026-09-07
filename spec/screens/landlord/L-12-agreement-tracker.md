# L-12 · Agreement tracker

Source: UI/UX Specification v1.0, Part B.

## Meta

| | |
|---|---|
| **Route** | `/agreements` |
| **Purpose** | Make sure nothing expires unnoticed. This is the highest-value screen in the product and it is almost entirely a sorted list. |

## Components

| ID | Type | Content and behaviour |
|---|---|---|
| `L12-STRIP-TOTAL` | Summary strip | "3 agreements ending in the next 90 days · ₹54,000 monthly rent at stake" |
| `L12-SEG-WINDOW` | Segmented choice | 30 days · 60 days · 90 days · All. Default 90. |
| `L12-TBL-AGREEMENTS` | Data table | Unit · Tenant · Ends on · Days remaining · Current rent · Suggested new rent · Actions. Sorted by days remaining, ascending. |
| `L12-CHP-COUNTDOWN` | Status chip | Under 30 days danger · 30–60 warning · 60–90 neutral |
| `L12-FLD-ESCALATION` | Inline field | Percentage, defaults to the value in settings. Changing it recalculates the suggested rent in the same row. |
| `L12-BTN-NOTICE` | Quiet button | "Send renewal notice" |
| `L12-BTN-CALENDAR` | Icon button | "Add to calendar" |
| `L12-BTN-RENEW` | Quiet button | "Record renewal" |

## Interactions

| Trigger | Result |
|---|---|
| `L12-BTN-NOTICE` | Opens `S-01` with a renewal draft containing the current rent, the new rent, and the effective date |
| `L12-BTN-CALENDAR` | Downloads a calendar file containing the expiry date with a reminder 30 days before. Toast: "Added — open the file to save it to your calendar." |
| `L12-BTN-RENEW` | Inline form: new start date, new end date, new rent. On save the agreement dates update, the row leaves the list, and future rent rows use the new amount. |

## Rules

- An agreement that has already expired appears at the top in danger
  colour with "Expired 14 days ago" and stays there until renewed or the
  tenancy is ended. It is never hidden.
- Rent changes take effect from the new start date. Rows already generated
  for earlier months are not altered.
