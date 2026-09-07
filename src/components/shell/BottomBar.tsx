"use client";

// Mobile bottom bar — spec/foundations.md A3 "Bottom bar (mobile)" and A4
// (<640px). Five items only: the first four sidebar sections plus "More".
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BOTTOM_BAR_ITEMS, MORE_SHEET_ITEMS, isNavItemActive, type NavItem } from "./nav-items";
import { MoreIcon } from "./icons";
import { MoreSheet } from "./MoreSheet";

export function BottomBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreActive = MORE_SHEET_ITEMS.some((item) => isNavItemActive(pathname, item.href));

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] sm:hidden"
      >
        {BOTTOM_BAR_ITEMS.map((item) => (
          <BottomBarLink key={item.id} item={item} active={isNavItemActive(pathname, item.href)} />
        ))}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={moreOpen}
          className={[
            "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium",
            moreActive ? "text-primary" : "text-muted",
          ].join(" ")}
        >
          <MoreIcon className="h-5 w-5" />
          More
        </button>
      </nav>

      {moreOpen ? <MoreSheet pathname={pathname} onClose={() => setMoreOpen(false)} /> : null}
    </>
  );
}

function BottomBarLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={[
        "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium",
        active ? "text-primary" : "text-muted",
      ].join(" ")}
    >
      <Icon className="h-5 w-5" />
      {item.label}
    </Link>
  );
}
