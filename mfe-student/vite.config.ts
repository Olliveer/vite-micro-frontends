import vue from "@vitejs/plugin-vue";
import vitePluginSingleSpa from "vite-plugin-single-spa";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 6283,
    origin: "http://localhost:6283",
    strictPort: true,
  },
  plugins: [
    vue(),
    vitePluginSingleSpa({
      type: "mife",
      serverPort: 6283,
      projectId: "mfe-student",
    }),
  ],
});
