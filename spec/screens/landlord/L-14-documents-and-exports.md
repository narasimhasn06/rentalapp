# L-14 · Documents and exports

Source: UI/UX Specification v1.0, Part B.

## Meta

| | |
|---|---|
| **Route** | `/documents` — OPEN: not stated explicitly in source; inferred from the sidebar nav label "Documents" (`spec/foundations.md` A3) and the screen name. See `spec/index.md`. |
| **Purpose** | Central store of every uploaded file, plus the export functions used to get data out of the product. |

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `L14-TBL-DOCS` | Data table | Every uploaded file: type, what it belongs to, uploaded on. Download, share, delete. |
| `L14-BTN-EXPORT-*` | Buttons | Four exports: rent ledger · maintenance spend · tenant list · deposit register. Each with a date range picker. |
| `L14-BTN-EMAILCA` | Secondary button | Opens the email composer addressed to the saved accountant email, subject "Rental records — FY 2025-26", body listing what is attached. Helper text reminds the landlord to attach the downloaded file. |
