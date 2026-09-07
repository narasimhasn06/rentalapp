import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, expect, it } from "vitest";

// CLAUDE.md §3: "No raw hex values inside components." A1 tokens live as
// CSS custom properties in src/app/globals.css and are wired into
// tailwind.config.ts — every component should reach colour through a
// Tailwind utility (`bg-primary`, `text-danger`, ...) or `formatRupees`,
// never a literal hex value.
const COMPONENT_ROOT = __dirname;
const HEX_PATTERN = /#[0-9a-fA-F]{3,8}\b/g;

function collectFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) return collectFiles(fullPath);
    if (![".ts", ".tsx"].includes(extname(fullPath))) return [];
    if (fullPath.endsWith(".test.ts") || fullPath.endsWith(".test.tsx")) return [];
    return [fullPath];
  });
}

describe("A2 component library has no raw hex colour literals", () => {
  const files = collectFiles(COMPONENT_ROOT);

  it("found component files to check", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)("%s", (filePath) => {
    const contents = readFileSync(filePath, "utf8");
    const matches = contents.match(HEX_PATTERN) ?? [];
    expect(matches, `Found raw hex value(s) ${matches.join(", ")} — use an A1 token instead.`).toEqual([]);
  });
});
