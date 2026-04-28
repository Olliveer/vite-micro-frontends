import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";
import vitePluginSingleSpa from "vite-plugin-single-spa";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 6284,
    origin: "http://localhost:6284",
    strictPort: true,
    cors: {
      origin: true,
      credentials: true,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  preview: {
    port: 6284,
    strictPort: true,
    cors: true,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        format: "esm",
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },
  plugins: [
    vue(),
    federation({
      name: "mfeStyleGuide",
      filename: "remoteEntry.js",
      exposes: {
        "./shell": "./src/shell/index.ts",
        "./components": "./src/components/index.ts",
        "./stores": "./src/shell/stores/index.ts",
      },
      shared: ["vue", "pinia", "vue-router"],
    }),
    vitePluginSingleSpa({
      type: "mife",
      serverPort: 6284,
      projectId: "mfe-style",
    }),
  ],
});
