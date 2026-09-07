"use client";

// Desktop/tablet sidebar — spec/foundations.md A3 "Sidebar (desktop)" and
// A4's 640-1024px / over-1024px rows. Fixed 220px with labels above
// 1024px; collapses to a 64px icon rail between 640 and 1024px; hidden
// entirely below 640px in favour of BottomBar.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, SETTINGS_ITEM, isNavItemActive, type NavItem } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Primary"
      className="fixed inset-y-0 left-0 z-20 hidden w-16 flex-col border-r border-line bg-surface sm:flex lg:w-[220px]"
    >
      <div className="flex h-16 shrink-0 items-center justify-center border-b border-line lg:justify-start lg:px-5">
        <span className="text-[16px] font-semibold text-ink lg:hidden">RR</span>
        <span className="hidden text-[16px] font-semibold text-ink lg:inline">RentRoll</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {NAV_ITEMS.map((item) => (
          <SidebarLink key={item.id} item={item} active={isNavItemActive(pathname, item.href)} />
        ))}
      </nav>

      <div className="shrink-0 border-t border-line p-2">
        <SidebarLink
          item={SETTINGS_ITEM}
          active={isNavItemActive(pathname, SETTINGS_ITEM.href)}
        />
      </div>
    </aside>
  );
}

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      title={item.label}
      className={[
        "relative flex items-center gap-3 rounded-sm px-3 py-2 text-[14px] font-medium transition-colors",
        "justify-center lg:justify-start",
        active ? "bg-primary-soft text-primary" : "text-body hover:bg-canvas hover:text-ink",
      ].join(" ")}
    >
      {active ? (
        <span
          aria-hidden="true"
          className="absolute inset-y-1 left-0 w-[3px] rounded-full bg-primary"
        />
      ) : null}
      <Icon className="h-5 w-5 shrink-0" />
      <span className="hidden lg:inline">{item.label}</span>
    </Link>
  );
}
