import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // The real "server-only" package throws unconditionally unless resolved
      // through webpack's "react-server" export condition, which Vitest
      // doesn't set up. Point it at the package's own no-op stub (what that
      // condition resolves to in Next.js) so server-only modules are testable.
      "server-only": path.resolve(__dirname, "node_modules/server-only/empty.js"),
    },
  },
});
