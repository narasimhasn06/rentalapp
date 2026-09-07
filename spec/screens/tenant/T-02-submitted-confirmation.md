# T-02 · Submitted confirmation

Source: UI/UX Specification v1.0, Part C.

## Meta

| | |
|---|---|
| **Route** | OPEN: no distinct route documented in source. This is reached as the post-submit state of `T-01` (`spec/index.md`). |
| **Purpose** | Confirm the report was captured, and get the tenant to save their link before they navigate away. |

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `T02-SEC-CONFIRM` | Confirmation block | Tick icon · "Reported. Your request number is **R-0412**." · "Your landlord has been notified." |
| `T02-SEC-SUMMARY` | Summary block | What they reported, so they can see it was captured correctly |
| `T02-BTN-TRACK` | Primary button | "Check the status" → `T-03` |
| `T02-BTN-SAVE` | Secondary button | "Save this link" → opens the device share sheet so they can bookmark or message it to themselves. On desktop, copies to clipboard with a toast. |
| `T02-BTN-ANOTHER` | Quiet button | "Report something else" → back to `T-01`, blank |

> **`T02-BTN-SAVE` is more important than it looks.** A tenant who loses
> the link phones the landlord instead. This is the one moment they are
> guaranteed to be looking at the screen, so this is where the product
> asks them to keep it.
