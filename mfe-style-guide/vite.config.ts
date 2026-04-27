import vue from "@vitejs/plugin-vue";
import vitePluginSingleSpa from "vite-plugin-single-spa";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 6284,
    origin: "http://localhost:6284",
    strictPort: true,
  },
  plugins: [
    vue(),
    vitePluginSingleSpa({
      type: "mife",
      serverPort: 6284,
      projectId: "mfe-style",
    }),
  ],
});
