#!/usr/bin/env node
// Boundary verification for the landlord/tenant split described in
// spec/index.md and src/server/README.md.
//
// Fails (exit 1) if any file under src/app/(tenant)/** imports, directly
// or transitively via a relative path, anything that resolves into
// src/server/landlord/** or src/app/(landlord)/**. Those trees hold
// server-only landlord implementation; the tenant surface is a public,
// unauthenticated link and must never be able to reach it.

import { readdirSync, statSync, readFileSync } from "node:fs";
import { join, dirname, resolve, relative, sep } from "node:path";

// Resolved against the current working directory (i.e. the project root
// this script is run from via `npm run check:boundaries`), not against
// this script's own file location, so it can also be pointed at a
// fixture project root in tests (see check-boundaries.test.mjs).
const rootDir = process.cwd();
const tenantDir = join(rootDir, "src", "app", "(tenant)");
const forbiddenDirs = [
  join(rootDir, "src", "server", "landlord"),
  join(rootDir, "src", "app", "(landlord)"),
];

const IMPORT_RE = /(?:from|import|require)\s*\(?\s*["']([^"']+)["']/g;
const SOURCE_EXT = new Set([".ts", ".tsx", ".js", ".jsx"]);

/** @param {string} dir @returns {string[]} */
function walk(dir) {
  let out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out = out.concat(walk(full));
    } else if (SOURCE_EXT.has(entry.slice(entry.lastIndexOf(".")))) {
      out.push(full);
    }
  }
  return out;
}

/** @param {string} specifier @param {string} fromFile @returns {string | null} */
function resolveSpecifier(specifier, fromFile) {
  if (specifier.startsWith("@/")) {
    return join(rootDir, "src", specifier.slice(2));
  }
  if (specifier.startsWith(".")) {
    return resolve(dirname(fromFile), specifier);
  }
  return null; // external package — not our concern here
}

function isUnderAny(candidatePath, dirs) {
  return dirs.some((dir) => {
    const rel = relative(dir, candidatePath);
    return rel === "" || (!rel.startsWith("..") && !rel.startsWith(`.${sep}..`));
  });
}

let hadTenantDir = false;
try {
  statSync(tenantDir);
  hadTenantDir = true;
} catch {
  hadTenantDir = false;
}

if (!hadTenantDir) {
  console.log(
    "check:boundaries — src/app/(tenant) does not exist, nothing to check.",
  );
  process.exit(0);
}

const files = walk(tenantDir);
/** @type {{ file: string, specifier: string, resolved: string }[]} */
const violations = [];

for (const file of files) {
  const contents = readFileSync(file, "utf8");
  for (const match of contents.matchAll(IMPORT_RE)) {
    const specifier = match[1];
    const resolved = resolveSpecifier(specifier, file);
    if (resolved && isUnderAny(resolved, forbiddenDirs)) {
      violations.push({ file: relative(rootDir, file), specifier, resolved });
    }
  }
}

if (violations.length > 0) {
  console.error(
    "check:boundaries FAILED — tenant route code importing landlord-only server modules:\n",
  );
  for (const v of violations) {
    console.error(`  ${v.file}\n    imports "${v.specifier}"`);
  }
  console.error(
    "\nSee src/server/README.md — nothing under src/app/(tenant) may import src/server/landlord or src/app/(landlord).",
  );
  process.exit(1);
}

console.log(
  `check:boundaries passed — scanned ${files.length} file(s) under src/app/(tenant), no landlord-only imports found.`,
);
