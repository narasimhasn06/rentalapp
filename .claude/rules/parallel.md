# Rule: parallel development ownership

RentRoll is built in lanes — separate tickets, often separate branches,
sometimes separate agents, working at the same time. This rule exists so
lanes don't corrupt each other's work. It applies to every session
working in this repo, whether or not a specific ticket restates it.

## One lane owns its files

A lane's ticket states what it owns — either explicitly ("YOU OWN:
`spec/**`") or implicitly by the paths it's asked to create/change
(e.g. a ticket scoped to `scripts/seed/**` owns `scripts/seed/**`, not
the rest of the repo). Treat that scope as a hard boundary:

- Only create or edit files inside your own lane's ownership.
- Files another lane owns are read-only to you, even if editing one
  would be trivial or "obviously" correct.
- If your ticket doesn't state an ownership scope, infer it narrowly
  from the paths it explicitly asks you to touch — never widen it on
  your own judgement.

## Never casually edit another lane's files

Seeing something that looks wrong, outdated, or inconsistent in a file
you don't own is not authorization to fix it. Two lanes editing the same
file concurrently is how merge conflicts, silently reverted fixes, and
contradictory product decisions happen — this repo has already paid for
that once (see `spec/decisions.md` for the cost of unresolved conflicts
in spec files that predate this rule).

## Report integration requirements instead of editing around them

If your lane's work depends on something outside its ownership — a
shared component that doesn't exist yet, a route another lane owns, a
change to `CLAUDE.md` or a spec file — do not implement it yourself
"to unblock." Instead:

1. Finish what you can within your own ownership.
2. State the integration requirement explicitly (in your report to the
   user, in the PR description, or as a comment marker in code — see
   `// PROMOTE:` below for the shared-component case specifically) so a
   human or the owning lane can act on it.
3. Do not guess at the other lane's intent to fill the gap yourself.

## Shared components: use `// PROMOTE:`, never edit `src/components/ui` directly

Per `CLAUDE.md` §4: the shared component library
(`src/components/ui`, per `spec/foundations.md` A2) is itself a lane
boundary. If your screen needs a shared component that isn't built yet:

1. Build the minimum version you need **inside your own lane's tree**
   (e.g. co-located with the screen that needs it), not inside
   `src/components/ui`.
2. Mark it:

   ```
   // PROMOTE: <what this should become in src/components/ui, and why>
   ```

3. Report it as an integration requirement (see above) rather than
   merging it into the shared library yourself — promoting a local
   component to shared is a decision the component's owner (or whoever
   is coordinating lanes) makes deliberately, not a side effect of one
   lane's feature work.

## The tenant/landlord split is a lane boundary too

`src/app/(tenant)/**` and `src/server/landlord/**` are owned by
different concerns even when the same person or session is working
across both in one sitting — see `.claude/rules/tenant-routes.md` and
`CLAUDE.md` §6. The same "don't casually edit, report instead" logic
applies at that boundary, enforced additionally by
`npm run check:boundaries`.
