# T-01 · Report a problem

Source: UI/UX Specification v1.0, Part C.

> **Design brief for the whole tenant section (Part C):** The tenant is on
> a phone, possibly annoyed, has never seen this before, and will not read
> instructions. There is no sign-in, no menu and no way to reach anything
> that is not theirs. If any screen here takes more than two minutes, they
> will phone the landlord instead and the product has failed.

## Meta

| | |
|---|---|
| **Route** | `/u/:unitToken` — one unguessable token per unit, not the unit number |
| **Access** | Anyone holding the link. No sign-in. |
| **Purpose** | Capture a problem with enough detail to act on, in under two minutes. |
| **Leads to** | `T-02` |

## Layout

Single column, one screen scroll. Header identifying the unit so the
tenant knows they have the right link. Form. Submit. Below the fold, a
link to their earlier reports.

## Components

| ID | Type | Content and behaviour |
|---|---|---|
| `T01-HDR` | Header | Landlord's name or logo · "Flat 2A, Kulkarni Apartments" · nothing else |
| `T01-SEL-CATEGORY` | Dropdown | "What is the problem?" — Plumbing · Electrical · Appliance · Structural · Pest · Cleaning · Something else. Required. |
| `T01-FLD-DESC` | Text area | "Describe it" — placeholder: "Geyser is leaking from the bottom since yesterday." Required, minimum 10 characters. |
| `T01-UPL-PHOTO` | Photo uploader | "Add a photo" — up to 3. Optional but visually encouraged. See `S-04`. |
| `T01-SEG-URGENCY` | Segmented choice | "How urgent?" — Low · Normal · Urgent. Defaults to Normal. |
| `T01-FLD-NAME` | Text field | Pre-filled from the tenant record, editable in case a family member is reporting |
| `T01-FLD-PHONE` | Phone field | Pre-filled, editable |
| `T01-BTN-SUBMIT` | Primary button | "Submit" — full width, 48px tall, sticky at the bottom of the viewport on mobile |
| `T01-LNK-MYREPORTS` | Link | "My earlier reports (2)" → `T-03`. Hidden when there are none. |
| `T01-BTN-CALL` | Quiet button | "Call the landlord" — always visible, below the form. Some things need a phone call. |

## Interactions

| Trigger | Result |
|---|---|
| `T01-BTN-SUBMIT` | Validate → button shows spinner → request is created → assistant assigns a suggested category and urgency in the background → route to `T-02`. If the assistant is slow or unavailable, the request is still created with the tenant's own choices; nothing waits on it. |
| Validation failure | Scroll to the first invalid field, show the error under it. Never a summary at the top, never a popup. |
| `T01-BTN-CALL` | Dials the landlord's number |

## States and rules

| State | Display |
|---|---|
| Invalid or unknown token | "This link is not valid. Please ask your landlord for your unit link." Nothing else — no hints about what a valid link looks like. |
| Unit is vacant | Same message as above. A former tenant's link stops working when the tenancy ends. |
| Submitting | Button spinner, form fields disabled, no full-screen overlay |
| Submission failed | Inline error above the button: "Could not submit. Please try again." The form keeps everything typed, including the photo. |
| Offline | A banner appears: "You are offline. Your report will be sent when you reconnect." The form remains usable. |

- The token is long and random. Unit numbers are never used in the URL,
  because `/u/2A` would let anyone guess `/u/2B`.
- Rate limit: 5 submissions per token per hour, with a plain message if
  exceeded.
- A bot check runs invisibly. A tenant should never see a puzzle.
