import vue from "@vitejs/plugin-vue";
import vitePluginSingleSpa from "vite-plugin-single-spa";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 6281,
    origin: "http://localhost:6281",
    strictPort: true,
  },
  plugins: [
    vue(),
    vitePluginSingleSpa({
      type: "mife",
      serverPort: 6281,
      projectId: "mfe-login",
    }),
  ],
});
