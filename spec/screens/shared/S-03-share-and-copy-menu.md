# S-03 · Share and copy menu

Source: UI/UX Specification v1.0, Part D.

## Components

| ID | Type | Content · what happens |
|---|---|---|
| `S03-BTN-SHARE` | Icon button | Uses the device share sheet where available; falls back to copy with a toast on desktop. Never shows a broken share icon. |
| `S03-BTN-COPY` | Icon button | Copies, then the icon changes to a tick for 2 seconds. Must be called directly from the click — never after an `await`. |
