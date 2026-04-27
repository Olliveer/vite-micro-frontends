import vitePluginSingleSpa from "vite-plugin-single-spa";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 6280,
    origin: "http://localhost:6280",
  },
  plugins: [
    vitePluginSingleSpa({
      type: "root",
      imo: false,
      importMaps: {
        dev: ["src/importMap.dev.json"],
        build: ["src/importMap.json"],
      },
    }),
  ],
});
