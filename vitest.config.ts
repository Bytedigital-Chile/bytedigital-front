import { defineConfig, type Plugin } from "vitest/config";
import { resolve } from "path";

// Nuxt replaces import.meta.server / import.meta.client at build time.
// We replicate that with a simple transform plugin since Vite's `define`
// does not apply to import.meta.* properties.
function nuxtImportMetaPlugin(): Plugin {
  return {
    name: "nuxt-import-meta",
    enforce: "pre",
    transform(code, id) {
      if (id.includes("node_modules")) return;
      const transformed = code
        .replace(/import\.meta\.server/g, "false")
        .replace(/import\.meta\.client/g, "true");
      if (transformed !== code) return { code: transformed, map: null };
    },
  };
}

export default defineConfig({
  plugins: [nuxtImportMetaPlugin()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      include: ["composables/**", "lib/**", "utils/**"],
    },
  },
  resolve: {
    alias: {
      "~": resolve(__dirname, "."),
      "#imports": resolve(__dirname, "./tests/mocks/nuxt-imports.ts"),
    },
  },
});
