import { describe, expect, it } from "vitest";
import {
  BOTTOM_BAR_ITEMS,
  MORE_SHEET_ITEMS,
  NAV_ITEMS,
  SETTINGS_ITEM,
  isNavItemActive,
} from "./nav-items";

describe("isNavItemActive", () => {
  it("matches the dashboard only on an exact root path", () => {
    expect(isNavItemActive("/", "/")).toBe(true);
    expect(isNavItemActive("/rent", "/")).toBe(false);
  });

  it("matches a section root and its sub-routes, not other sections", () => {
    expect(isNavItemActive("/rent", "/rent")).toBe(true);
    expect(isNavItemActive("/rent/entry-1", "/rent")).toBe(true);
    expect(isNavItemActive("/rent-review", "/rent")).toBe(false);
    expect(isNavItemActive("/maintenance", "/rent")).toBe(false);
  });
});

describe("nav item layout", () => {
  it("has the eight sidebar sections in spec order, Settings pinned separately", () => {
    expect(NAV_ITEMS.map((item) => item.id)).toEqual([
      "dashboard",
      "rent",
      "maintenance",
      "units",
      "tenants",
      "agreements",
      "deposits",
      "documents",
    ]);
    expect(SETTINGS_ITEM.id).toBe("settings");
  });

  it("puts exactly five items on the bottom bar (four sections + More)", () => {
    expect(BOTTOM_BAR_ITEMS).toHaveLength(4);
    expect(BOTTOM_BAR_ITEMS.map((item) => item.id)).toEqual([
      "dashboard",
      "rent",
      "maintenance",
      "units",
    ]);
  });

  it("puts every remaining section plus Settings in the More sheet", () => {
    expect(MORE_SHEET_ITEMS.map((item) => item.id)).toEqual([
      "tenants",
      "agreements",
      "deposits",
      "documents",
      "settings",
    ]);
  });

  it("never duplicates or drops a nav item across bottom bar + More", () => {
    const combined = [...BOTTOM_BAR_ITEMS, ...MORE_SHEET_ITEMS].map((item) => item.id);
    const expected = [...NAV_ITEMS.map((item) => item.id), "settings"];
    expect(new Set(combined)).toEqual(new Set(expected));
    expect(combined).toHaveLength(expected.length);
  });
});
