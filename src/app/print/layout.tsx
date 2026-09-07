import type { ReactNode } from "react";

// Print views (spec/screens/print/**) are standalone pages, not the app
// shell with a print stylesheet bolted on: no navigation, no buttons,
// white background, one page per view. See P-01's "Print view rules"
// (spec/screens/print/P-01-rent-receipt.md), which apply to every view
// under this route group.
export default function PrintLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-surface text-ink">
      <style>{`@page { margin: 0; }`}</style>
      {children}
    </div>
  );
}
