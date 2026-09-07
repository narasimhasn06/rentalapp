// Page header — spec/foundations.md A3 "Page header": title on the left,
// primary action on the right, filters on the row beneath, persists while
// the table below it scrolls.
//
// PROMOTE: this only supplies the sticky layout region. The primary-action
// button and filter controls it hosts should come from src/components/ui
// once that library exists — this component takes them as slots rather
// than building its own button/filter styling.
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  action?: ReactNode;
  filters?: ReactNode;
}

export function PageHeader({ title, action, filters }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-line bg-canvas/95 px-4 py-4 backdrop-blur sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="truncate text-[20px] font-semibold leading-tight text-ink">{title}</h1>
        {action}
      </div>
      {filters ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">{filters}</div>
      ) : null}
    </div>
  );
}
