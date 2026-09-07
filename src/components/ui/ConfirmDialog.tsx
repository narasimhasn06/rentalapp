"use client";

import { useEffect, useId, useRef } from "react";
import { Button, type ButtonVariant } from "./Button";

export interface ConfirmDialogProps {
  open: boolean;
  /** Phrased as a question, e.g. "Delete this unit?" */
  title: string;
  /** One line describing the consequence. */
  consequence: string;
  /** Names the action — never "OK" (spec/foundations.md A2 "Confirm dialog"). */
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmVariant?: Extract<ButtonVariant, "primary" | "danger">;
  loading?: boolean;
}

/** A2 "Confirm dialog": question title, one consequence line, a named action button. */
export function ConfirmDialog({
  open,
  title,
  consequence,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  confirmVariant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="w-full max-w-sm rounded-md bg-surface p-5 shadow-2 outline-none"
      >
        <h2 id={titleId} className="text-h2 text-ink">
          {title}
        </h2>
        <p className="mt-2 text-body">{consequence}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
