"use client";

// The mobile "More" sheet — spec/foundations.md A3 "Bottom bar (mobile)":
// '"More" opens a sheet with the rest.' Holds every nav item not pinned to
// the bottom bar itself.
import Link from "next/link";
import { useEffect } from "react";
import { MORE_SHEET_ITEMS, isNavItemActive } from "./nav-items";
import { CloseIcon } from "./icons";

interface MoreSheetProps {
  pathname: string;
  onClose: () => void;
}

export function MoreSheet({ pathname, onClose }: MoreSheetProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-30 sm:hidden" role="dialog" aria-modal="true" aria-label="More">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
      />
      <div className="absolute inset-x-0 bottom-0 rounded-t-md border-t border-line bg-surface p-2 pb-[max(env(safe-area-inset-bottom),8px)] shadow-[0_8px_24px_rgba(20,32,43,0.12)]">
        <div className="flex items-center justify-between px-2 py-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.6px] text-muted">
            More
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-sm p-1.5 text-muted hover:bg-canvas hover:text-ink"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {MORE_SHEET_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isNavItemActive(pathname, item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex items-center gap-3 rounded-sm px-3 py-3 text-[14px] font-medium",
                  active ? "bg-primary-soft text-primary" : "text-body hover:bg-canvas",
                ].join(" ")}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
