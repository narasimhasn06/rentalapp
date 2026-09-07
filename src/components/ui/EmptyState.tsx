import type { ReactNode } from "react";
import { Button } from "./Button";

export interface EmptyStateProps {
  /** What would appear here — never just "No data." (spec/foundations.md A2). */
  message: string;
  actionLabel: string;
  onAction: () => void;
  icon?: ReactNode;
}

/** A2 "Empty state": one explanatory line plus the button that creates the first record. */
export function EmptyState({ message, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      {icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas text-muted">
          {icon}
        </div>
      )}
      <p className="max-w-sm text-muted">{message}</p>
      <Button onClick={onAction}>{actionLabel}</Button>
    </div>
  );
}
