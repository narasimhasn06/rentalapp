import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

// Exercises scripts/check-boundaries.mjs against a throwaway fixture repo
// so the boundary check itself is proven to fail closed, not just to
// pass on the real (currently clean) src tree.
describe("check-boundaries", () => {
  it("exits 0 when no forbidden import exists", () => {
    const dir = makeFixture((root) => {
      writeFileSync(
        join(root, "src", "app", "(tenant)", "u", "page.tsx"),
        `export default function Page() { return null; }\n`,
      );
    });

    expect(() => run(dir)).not.toThrow();
  });

  it("exits non-zero when tenant code imports a landlord-only module by alias", () => {
    const dir = makeFixture((root) => {
      writeFileSync(
        join(root, "src", "app", "(tenant)", "u", "page.tsx"),
        `import { landlordOnlyPlaceholder } from "@/server/landlord/example";\nexport default function Page() { return landlordOnlyPlaceholder(); }\n`,
      );
    });

    expect(() => run(dir)).toThrow();
  });

  it("exits non-zero when tenant code imports a landlord-only module by relative path", () => {
    const dir = makeFixture((root) => {
      writeFileSync(
        join(root, "src", "app", "(tenant)", "u", "page.tsx"),
        `import { landlordOnlyPlaceholder } from "../../../server/landlord/example";\nexport default function Page() { return landlordOnlyPlaceholder(); }\n`,
      );
    });

    expect(() => run(dir)).toThrow();
  });
});

function makeFixture(write) {
  const root = mkdtempSync(join(tmpdir(), "boundary-fixture-"));
  mkdirSync(join(root, "src", "app", "(tenant)", "u"), { recursive: true });
  mkdirSync(join(root, "src", "server", "landlord"), { recursive: true });
  mkdirSync(join(root, "scripts"), { recursive: true });
  writeFileSync(
    join(root, "src", "server", "landlord", "example.ts"),
    `export function landlordOnlyPlaceholder() { return "landlord-only"; }\n`,
  );
  write(root);
  return root;
}

function run(root) {
  const scriptPath = join(process.cwd(), "scripts", "check-boundaries.mjs");
  try {
    execFileSync("node", [scriptPath], { cwd: root, stdio: "pipe" });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
