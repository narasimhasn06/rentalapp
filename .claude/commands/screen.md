---
description: Look up the spec for a stable screen/component ID (L-04, T-01, S-01, P-01, ...) or an element ID (L04-BTN-REMIND).
argument-hint: <ID, e.g. L-04, T-01, or L04-BTN-REMIND>
allowed-tools: Read, Grep, Glob
---

Look up the spec for ID: $ARGUMENTS

1. Normalize the ID to a screen ID. If it's already a screen ID
   (`L-04`, `T-01`, `S-01`, `P-01`), use it as-is. If it's an element ID
   (`L04-BTN-REMIND`), take the leading letter+digits (`L04`) and insert
   the hyphen (`L-04`).
2. Map the ID's leading letter to its directory and find the matching
   file with Glob (filenames are `<ID>-<slug>.md`):
   - `L-nn` → `spec/screens/landlord/`
   - `T-nn` → `spec/screens/tenant/`
   - `S-nn` → `spec/screens/shared/`
   - `P-nn` → `spec/screens/print/`
3. Read that file and print it in full.
4. Grep `spec/decisions.md` for the screen ID and, if given, the
   original element ID. If either appears, list which decision(s)
   (`D1`…`D17`) reference it, with a one-line summary of why — the
   caller needs to know if a decision has already overridden or
   clarified something on this screen.
5. If no matching file exists, say so plainly and stop — don't guess
   which screen was meant.

This is a lookup only. Do not edit any file.
