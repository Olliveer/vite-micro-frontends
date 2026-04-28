import vue from "@vitejs/plugin-vue";
import federation from "@originjs/vite-plugin-federation";
import vitePluginSingleSpa from "vite-plugin-single-spa";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 6283,
    origin: "http://localhost:6283",
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
    port: 6283,
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
      name: "mfeStudent",
      filename: "remoteEntry.js",
      remotes: {
        mfeStyleGuide: "http://localhost:6284/remoteEntry.js",
        mfeLogin: "http://localhost:6281/remoteEntry.js",
        mfeAdmin: "http://localhost:6282/remoteEntry.js",
      },
      exposes: {
        "./stores": "./src/stores/index.ts",
      },
      shared: ["vue", "pinia", "vue-router"],
    }),
    vitePluginSingleSpa({
      type: "mife",
      serverPort: 6283,
      projectId: "mfe-student",
    }),
  ],
});
