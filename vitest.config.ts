import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import path from "node:path";

export default defineConfig(({ mode }) => ({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "scripts/**/*.test.mjs"],
    // Loads .env/.env.local into process.env for tests (no VITE_ prefix
    // required) -- needed by src/lib/db/__tests__/e4-boundary.test.ts to
    // pick up the local Supabase connection details `supabase start`
    // prints, without adding a dotenv dependency.
    env: loadEnv(mode, process.cwd(), ""),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
