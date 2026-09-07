"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { IconButton } from "./Button";
import { ConfirmDialog } from "./ConfirmDialog";

export interface DetailPanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** True while the panel has an unsaved edit — closing asks for confirmation first (spec/foundations.md A2). */
  hasUnsavedChanges?: boolean;
}

/**
 * A2 "Detail panel": slides in from the right, 480px on desktop, full
 * screen on mobile. Closes on Escape, backdrop click, and the close
 * button; warns before closing on unsaved edits; returns focus to
 * whatever triggered it.
 */
export function DetailPanel({
  open,
  onClose,
  title,
  children,
  hasUnsavedChanges = false,
}: DetailPanelProps) {
  const [confirmingClose, setConfirmingClose] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const requestClose = () => {
    if (hasUnsavedChanges) {
      setConfirmingClose(true);
      return;
    }
    onClose();
  };

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement as HTMLElement | null;
    } else {
      triggerRef.current?.focus?.();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") requestClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, hasUnsavedChanges]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-ink/40" onClick={requestClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed inset-y-0 right-0 z-40 flex w-full flex-col bg-surface shadow-2 sm:w-[480px]"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id={titleId} className="text-h2 text-ink">
            {title}
          </h2>
          <IconButton
            icon={<CloseIcon />}
            label="Close"
            onClick={requestClose}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
      <ConfirmDialog
        open={confirmingClose}
        title="Discard unsaved changes?"
        consequence="Edits you made in this panel have not been saved."
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        onConfirm={() => {
          setConfirmingClose(false);
          onClose();
        }}
        onCancel={() => setConfirmingClose(false)}
      />
    </>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
