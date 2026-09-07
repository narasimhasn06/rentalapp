# T-04 · My unit and landlord contact

Source: UI/UX Specification v1.0, Part C.

## Meta

| | |
|---|---|
| **Route** | OPEN: not documented in source. See `spec/index.md`. |
| **Purpose** | Give the tenant their agreement dates and a way to reach the landlord, with no financial information. |

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `T04-SEC-UNIT` | Info block | Unit, property, landlord's name. Agreement start and end dates. **No rent figure.** |
| `T04-BTN-CALL` | Primary button | Calls the landlord |
| `T04-BTN-MESSAGE` | Secondary button | Opens WhatsApp to the landlord with a blank message |

> **T-04 shows agreement dates but not rent.** The tenant knows their own
> rent; the app does not need to state it, and any screen that displays a
> money figure is one refactor away from displaying the wrong one. This is
> a direct, screen-level application of the cross-cutting rule that no
> tenant-facing screen may display rent amounts — see
> `spec/cross-cutting.md`.
