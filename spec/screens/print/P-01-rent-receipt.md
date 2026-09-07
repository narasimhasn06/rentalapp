# P-01 · Rent receipt

Source: UI/UX Specification v1.0, Part D.

## Meta

| | |
|---|---|
| **Opened from** | `L04-BTN-RECEIPT`, `L05` (receipt reference), `T05-BTN-PRINT` |

## Contents

Landlord name and logo · receipt number · tenant · unit · month · amount
in figures and words · date received · payment reference · payment QR · a
signature line.

## Print view rules (apply to all of P-01 / P-02 / P-03)

Each print view is a separate page with no navigation, no buttons and a
white background, opened in a new tab with the print dialog triggered on
load. Do not attempt to hide the app's own interface with print styles —
this is a genuinely separate, minimal page/route, not the normal app shell
with a print stylesheet applied.
