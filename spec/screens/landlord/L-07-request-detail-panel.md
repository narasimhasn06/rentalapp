# L-07 · Request detail panel

Source: UI/UX Specification v1.0, Part B.

## Meta

| | |
|---|---|
| **Route** | `/maintenance/:requestId` |
| **Purpose** | Everything about one reported problem, and every action needed to close it. |

## Components

| ID | Type | Content and behaviour |
|---|---|---|
| `L07-HDR` | Panel header | Request number · unit · urgency chip · status dropdown |
| `L07-SEC-REPORT` | Content block | What the tenant wrote, verbatim, with the date and their name. Never edited. |
| `L07-GAL-PHOTOS` | Photo strip | Before photos from the tenant; after photos added by the landlord. Tap to enlarge. |
| `L07-SEL-CATEGORY` | Dropdown | Pre-filled by the assistant, editable. Options: Plumbing · Electrical · Appliance · Structural · Pest · Cleaning · Other |
| `L07-FLD-VENDOR` | Text field | Vendor name and phone. Remembers previously used vendors as suggestions. |
| `L07-FLD-COST` | Money field | What it cost. Required to close. |
| `L07-CHK-TENANTLIABLE` | Checkbox | "Tenant is liable for this cost" — when ticked, offers a payment link instead of absorbing the cost |
| `L07-BTN-DISPATCH` | Primary button | "Send job to vendor" |
| `L07-BTN-UPDATETENANT` | Secondary button | "Update the tenant" |
| `L07-TML-HISTORY` | Timeline | Every status change, message sent and note added |

## Interactions

| Trigger | Result |
|---|---|
| `L07-BTN-DISPATCH` | Opens `S-01` with a vendor-flavoured draft containing: the problem, the unit's address, the tenant's phone and a Maps link. Recipient defaults to the vendor's number, not the tenant's. |
| `L07-BTN-UPDATETENANT` | Opens `S-01` with a status-update draft addressed to the tenant. The draft never mentions cost or vendor rates. |
| `L07-CHK-TENANTLIABLE` | Reveals a "Send payment request" button that opens `S-02` with the cost pre-filled |
| Status set to Done | Validates that a cost or "no cost" is present · prompts to add an after photo · offers to notify the tenant |

## Rules

> **Never expose to the tenant:** the vendor's rate, the cost recorded,
> internal notes, or any other unit. The tenant update draft is built from
> status and category only. This is a direct application of the
> cross-cutting rule that no tenant-facing screen may display rent
> amounts, repair costs, other units, or other tenants — see
> `spec/cross-cutting.md`.
