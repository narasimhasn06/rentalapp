// Tenant link surface. Public, unauthenticated, one unguessable token per
// unit — no sign-in, no navigation to anything else (see
// spec/foundations.md A3 and spec/screens/tenant/T-01-report-a-problem.md
// "Design brief for the whole tenant section").
//
// STRUCTURAL BOUNDARY: nothing under this route group may import from
// src/server/landlord/** (enforced by eslint.config.mjs and
// scripts/check-boundaries.mjs, run via `npm run check:boundaries`). See
// src/server/README.md.
export default function TenantLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen bg-canvas text-body">{children}</div>;
}
