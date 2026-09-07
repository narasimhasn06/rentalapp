import { assertDevOnly } from "@/lib/dev-only";

// Development-only route convention: every page under src/app/dev/** must
// call assertDevOnly() first. This route exists locally as a place to
// preview shared UI components (spec/foundations.md A2 "Component
// library") without shipping in the production build — see
// src/lib/dev-only.ts.
export default function DevComponentsPage() {
  assertDevOnly();

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-h1 font-semibold text-ink">Component playground</h1>
      <p className="mt-2 text-body">
        Local-only route (see <code>src/lib/dev-only.ts</code>). Not
        reachable in a production build. Use this page to preview shared
        components from <code>spec/foundations.md</code> A2 as they are
        built.
      </p>
    </main>
  );
}
