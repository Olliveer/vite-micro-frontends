import vue from "@vitejs/plugin-vue";
import vitePluginSingleSpa from "vite-plugin-single-spa";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 6282,
    origin: "http://localhost:6282",
    strictPort: true,
  },
  plugins: [
    vue(),
    vitePluginSingleSpa({
      type: "mife",
      serverPort: 6282,
      projectId: "mfe-admin",
    }),
  ],
});
