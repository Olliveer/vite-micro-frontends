import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";
import vitePluginSingleSpa from "vite-plugin-single-spa";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 6281,
    origin: "http://localhost:6281",
    strictPort: true,
    cors: {
      origin: true,
      credentials: true,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    hmr: {
      timeout: 5000,
    },
  },
  preview: {
    port: 6281,
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
      name: "mfeLogin",
      filename: "remoteEntry.js",
      remotes: {
        // Em dev mode, o remoteEntry.js é servido pelo Vite dev server na raiz
        mfeStyleGuide: "http://localhost:6284/remoteEntry.js",
      },
      exposes: {
        "./stores": "./src/stores/index.ts",
      },
      shared: ["vue", "pinia", "vue-router"],
    }),
    vitePluginSingleSpa({
      type: "mife",
      serverPort: 6281,
      projectId: "mfe-login",
    }),
  ],
});
