# L-11 · Tenant detail

Source: UI/UX Specification v1.0, Part B.

## Meta

| | |
|---|---|
| **Route** | `/tenants/:tenantId` |
| **Purpose** | Contact, agreement and payment history for a person, past or present. |

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `L11-SEC-CONTACT` | Contact block | Phone with call, message and copy buttons; email with a mail button if present |
| `L11-SEC-AGREEMENT` | Key-value block | Start, end, rent, deposit paid, notice status, with a countdown when within 90 days |
| `L11-SEC-PAYMENTS` | Table | Every rent entry for this tenant, with a paid-on-time percentage at the top |
| `L11-SEC-DOCS` | File list | Agreement, ID proof, anything else uploaded. Each with download and share. |
| `L11-BTN-ENDTENANCY` | Danger button | "End tenancy" → confirm dialog → routes to `L-13` with this tenant selected |
| `L11-BTN-SENDAGREEMENT` | Quiet button | Opens the email composer with the agreement referenced. Helper text: "Attach the file after your email app opens." |
