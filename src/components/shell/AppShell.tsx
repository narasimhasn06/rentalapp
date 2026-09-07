// The landlord workspace chrome — spec/foundations.md A3/A4. Wired only
// into src/app/(landlord)/layout.tsx.
//
// This is what makes "no navigation on tenant screens" (A3, and
// spec/cross-cutting.md's permission boundary) structural rather than a
// convention someone has to remember: src/app/(tenant)/layout.tsx has its
// own, separate layout.tsx and does not import AppShell. Next.js route
// groups don't nest across groups, so a future tenant screen would have to
// explicitly reach into components/shell to grow a sidebar — nothing in
// its own tree does that today.
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { BottomBar } from "./BottomBar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-canvas text-body">
      <Sidebar />
      <BottomBar />
      {/*
        Main content column, offset for the sidebar from 640px up (A4:
        640-1024px collapses to a 64px icon rail; over 1024px is the full
        220px sidebar) and padded above the bottom bar below 640px.
        Content itself decides whether a detail panel opens alongside it
        (over 1024px, A4) or as a full-screen overlay (below that) — that
        behaviour belongs to the Detail Panel component (A2), not this
        shell, since the shell never renders a panel itself.
      */}
      <div className="flex min-h-screen flex-col pb-16 sm:ml-16 sm:pb-0 lg:ml-[220px]">
        {children}
      </div>
    </div>
  );
}
