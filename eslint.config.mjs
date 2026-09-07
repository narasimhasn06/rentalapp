import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __dirname = dirname(fileURLToPath(import.meta.url));

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Structural boundary: the tenant route group is public, unauthenticated
    // surface (see spec/index.md and spec/cross-cutting.md — tenant screens
    // must never reach landlord-only data or server logic). This is a
    // fast, editor-time signal; `npm run check:boundaries` (see
    // scripts/check-boundaries.mjs) is the authoritative check run in
    // `npm run verify`.
    files: ["src/app/(tenant)/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/server/landlord/*", "@/server/landlord", "**/(landlord)/*"],
              message:
                "Tenant routes may not import landlord-only server modules. See spec/index.md and src/server/README.md.",
            },
          ],
        },
      ],
    },
  },
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
