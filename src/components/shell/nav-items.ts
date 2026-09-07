// Single source of truth for landlord nav structure — spec/foundations.md
// A3 "Global navigation". Sidebar, the mobile bottom bar and its "More"
// sheet all read from this list so they can never drift out of sync with
// each other or with the spec order.
import type { ComponentType, SVGProps } from "react";
import {
  DashboardIcon,
  RentIcon,
  MaintenanceIcon,
  UnitsIcon,
  TenantsIcon,
  AgreementsIcon,
  DepositsIcon,
  DocumentsIcon,
  SettingsIcon,
} from "./icons";

export type NavIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: NavIcon;
}

// The eight sidebar sections, in the exact order A3 specifies. Settings is
// deliberately not in this list — it's pinned separately at the bottom of
// the sidebar (see SETTINGS_ITEM) and surfaced last in the mobile "More"
// sheet, never mixed into the main scrollable nav.
export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/", icon: DashboardIcon },
  { id: "rent", label: "Rent", href: "/rent", icon: RentIcon },
  {
    id: "maintenance",
    label: "Maintenance",
    href: "/maintenance",
    icon: MaintenanceIcon,
  },
  { id: "units", label: "Units", href: "/units", icon: UnitsIcon },
  { id: "tenants", label: "Tenants", href: "/tenants", icon: TenantsIcon },
  {
    id: "agreements",
    label: "Agreements",
    href: "/agreements",
    icon: AgreementsIcon,
  },
  { id: "deposits", label: "Deposits", href: "/deposits", icon: DepositsIcon },
  {
    id: "documents",
    label: "Documents",
    href: "/documents",
    icon: DocumentsIcon,
  },
];

// spec/index.md flags L-14/L-15 routes as OPEN (inferred from nav labels,
// not stated in source) — used here as the best available inference, not
// a resolved decision.
export const SETTINGS_ITEM: NavItem = {
  id: "settings",
  label: "Settings",
  href: "/settings",
  icon: SettingsIcon,
};

// Mobile bottom bar (<640px, A4) — five items only: the first four sidebar
// sections plus "More".
export const BOTTOM_BAR_ITEMS: NavItem[] = NAV_ITEMS.slice(0, 4);

// Everything not pinned to the bottom bar itself, shown in the "More"
// sheet — the remaining four sections plus Settings.
export const MORE_SHEET_ITEMS: NavItem[] = [...NAV_ITEMS.slice(4), SETTINGS_ITEM];

/**
 * Whether `href` should be shown as the active nav item for the current
 * `pathname`. "/" only matches the dashboard exactly (every other route
 * starts with "/" too); every other item also matches its own sub-routes
 * (e.g. "/rent/entry-1" keeps "Rent" active).
 */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
