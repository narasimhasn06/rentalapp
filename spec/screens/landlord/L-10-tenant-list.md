# L-10 · Tenant list

Source: UI/UX Specification v1.0, Part B. Documented on the same source
page as `L-11` — see `spec/screens/landlord/L-11-tenant-detail.md` for the
detail screen it opens into.

## Meta

| | |
|---|---|
| **Route** | `/tenants` |
| **Purpose** | Contact, agreement and payment history for a person, past or present. |

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `L10-TBL-TENANTS` | Data table | Name · Unit · Phone · Agreement ends · Status. Row click → `L-11`. |
| `L10-SEG-FILTER` | Segmented choice | Current · On notice · Past |
