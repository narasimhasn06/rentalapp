# RentRoll — five-slice demo script

Five short slices, each landable in under two minutes, each proving one
promise from `spec/product.md`. Run them in order — they build on the
same unit and the same tenant. Every screen, button and message quoted
below is a real element ID from `spec/screens/**`; if a click sequence
here ever drifts from what's actually built, the spec file named in each
slice's heading is the source of truth, not this script.

Two devices on screen for the whole demo: a phone (the tenant) and a
laptop (the landlord), side by side or mirrored. That's the whole trick
— nobody has to imagine the other side.

---

## Slice 1 — "A tenant reports a leak on their phone, and I see it on mine"

**Screens:** `T-01`, `T-02` (phone) → `L-06`, `L-07` (laptop)

1. **Phone:** open the tenant's saved unit link (`/u/:token`) — already
   on the home screen, no typing. Lands on `T-01`.
2. Pick `T01-SEL-CATEGORY` → **Plumbing**. Type into `T01-FLD-DESC`:
   *"Geyser is leaking from the bottom since yesterday."*
3. Tap `T01-UPL-PHOTO`, attach one photo. Set `T01-SEG-URGENCY` →
   **Urgent**. Name and phone are already filled in — this tenant's
   token knows who they are.
4. Tap `T01-BTN-SUBMIT`. Lands on `T-02`: *"Reported. Your request
   number is R-0412."*
5. **Laptop, already open on `L-06` Maintenance board:** a new card
   lands in the **New** column in real time — unit number, "Plumbing",
   the description's first line, an **Urgent** chip, the photo
   thumbnail.
6. Click `L06-CRD-REQUEST` to open `L-07`. Show `L07-SEC-REPORT` — the
   tenant's own words, verbatim, with their name and the timestamp — and
   `L07-GAL-PHOTOS` with their photo already there.

**The sentence:** *No app to install, no call to answer — the tenant
typed it once, from their sofa, and it's already sitting on my desk with
a photo attached.*

---

## Slice 2 — "The reminder writes itself, but I'm the one who hits send"

**Screens:** `L-03` → `L-04` → `S-01` → `L-04` → `P-01`

1. **Laptop, `L-03` dashboard:** click `L03-CRD-DUES` (outstanding,
   shown in danger colour). Lands on `L-04` with the Overdue filter
   already applied.
2. Pick a row several days overdue. Click `L04-BTN-REMIND`.
3. `S-01` opens: `S01-CHP-CONTEXT` reads *"Rent · 18 days overdue ·
   Level 3 of 3"*, `S01-SEG-TONE` is pre-set to **Formal**, and
   `S01-FLD-MESSAGE` already holds a drafted, editable message —
   `S01-CHK-PAYLINK` is ticked. Point out it's a real text field: edit a
   line to prove it isn't a locked preview.
4. Click `S01-BTN-WHATSAPP`. WhatsApp opens in a new tab with the text
   pre-filled. Back in the app, the modal now asks: *"Did you send
   it?"* Click **Yes** — only now does it write to the record.
5. Back on `L-04`, click `L04-BTN-MARKPAID` on the same row. Inline
   form: amount received (pre-filled with rent due), date, reference.
   Confirm. The row flips to **Paid**; toast: *"Payment recorded.
   Receipt RR-0847 created."*
6. Click `L04-BTN-RECEIPT` → `P-01` opens in a new tab: a clean,
   numbered receipt, nothing else on the page.

**The sentence:** *The app writes the reminder and hands it to WhatsApp
already open — but nothing is ever recorded as sent until I actually
press send, and the moment it's paid, a numbered receipt exists that
nobody has to reconstruct from a bank statement in March.*

---

## Slice 3 — "Nothing expires without ninety days' warning"

**Screens:** `L-03` → `L-12` → `S-01`

1. **Laptop, `L-03`:** click `L03-CRD-EXPIRING`. Lands on `L-12` with
   the 90-day window applied. `L12-STRIP-TOTAL` reads something like
   *"3 agreements ending in the next 90 days · ₹54,000 monthly rent at
   stake."*
2. Point at the top row: `L12-CHP-COUNTDOWN` in danger colour, sorted
   soonest-first — this list is never allowed to hide an overdue
   renewal.
3. Click `L12-BTN-NOTICE` on that row. `S-01` opens with a renewal draft
   already containing the current rent, the new rent (from
   `L12-FLD-ESCALATION`'s default percentage), and the effective date.
   Send it the same way as slice 2 — WhatsApp, then **"Did you send
   it?" → Yes**.
4. Click `L12-BTN-RENEW`. Inline form: new start date, new end date, new
   rent. Save — the row leaves the list.

**The sentence:** *The renewal notice goes out ninety days early instead
of the landlord finding out in March that November's rent never went
up — and recording it here is what next month's rent row will actually
bill.*

---

## Slice 4 — "The settlement is a document to sign, not an argument to have"

**Screens:** `L-13` → `P-02` → `S-01`

1. **Laptop:** open `L-13` for a tenant who's moving out
   (`/deposits/:tenantId`). `L13-SEC-DEPOSIT` shows the amount held and
   since when.
2. Click `L13-BTN-FROMREQUESTS` — pull this tenancy's repair history.
   Tick one tenant-liable repair; its cost and photo carry straight into
   `L13-TBL-DEDUCTIONS` with no retyping.
3. Add one more deduction manually: description, a required reason,
   amount, photo. `L13-SEC-BALANCE` recalculates live — deposit held
   minus deductions, refund due, in large type.
4. Click `L13-BTN-GENERATE`, then `L13-BTN-PRINT` → `P-02` opens in a
   new tab: tenancy dates, deposit, every deduction with its reason and
   thumbnail, the balance, two signature lines.
5. Click `L13-BTN-SEND` → `S-01` opens with the settlement summary —
   send it the same reviewed, "did you send it" way as every other
   message in this product.
6. Click `L13-BTN-CLOSE`, confirm. The tenancy closes, the unit goes
   vacant, and the statement files itself under documents.

**The sentence:** *Every deduction already has a reason and a photo
sitting next to it, so move-out is a five-minute signature instead of a
argument about who remembers what.*

---

## Slice 5 — "The tenant sees everything that's theirs, and nothing that isn't"

**Screens:** `T-03`, `T-05` (phone) → `T-01` with a bad token (phone)

1. **Phone, same saved link:** tap `T01-LNK-MYREPORTS` (or, from a fresh
   `T-02`, `T02-BTN-TRACK`). Lands on `T-03` — the leak from slice 1 is
   there as **In progress**, plain words, no vendor name, no cost, no
   mention of any other unit.
2. Navigate to `T-05`, "My receipts." The rent payment from slice 2 is
   listed with its amount and receipt number — call out that this is
   the *one and only* tenant screen in the entire product allowed to
   show a rupee figure, and why: it's the tenant's own payment, and the
   receipt is the point of the screen.
3. Tap `T05-BTN-PRINT` → `P-01` opens again, this time from the
   tenant's own side.
4. Now edit the URL's token by one character, or reuse a link from a
   tenant who's already moved out, and reload. The result is the same
   plain sentence every time: *"This link is not valid. Please ask your
   landlord for your unit link."* No hint about what went wrong, no
   error code, nothing to probe.

**The sentence:** *A tenant can see every problem they've reported and
every rupee they've paid — and nothing that belongs to anyone else's
flat — because that boundary is enforced in the code they're touching
right now, not just promised in a privacy policy.*
