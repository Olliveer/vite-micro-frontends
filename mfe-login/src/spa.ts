import type { Pinia } from "pinia";
import { createApp, h } from "vue";
import singleSpaVue from "single-spa-vue";
import { cssLifecycleFactory } from "vite-plugin-single-spa/ex";
import App from "./App.vue";
import { BASE, createMfeRouter } from "./router";

let router: ReturnType<typeof createMfeRouter>;
let sharedPinia: Pinia | null = null;

// Carrega o remote do style-guide e inicializa
async function initSharedPinia() {
  if (sharedPinia) return sharedPinia;

  try {
    // Import via Module Federation
    const styleGuide = await import("mfeStyleGuide/shell");
    sharedPinia = styleGuide.getSharedPinia();

    // Registra as stores deste MFE no registro global
    const { useLoginStore } = await import("./stores/login");
    styleGuide.registerStore("useLoginStore", useLoginStore);

    console.log("[mfe-login] Shared Pinia initialized and stores registered");
    return sharedPinia;
  } catch (err) {
    console.error("[mfe-login] Failed to load mfeStyleGuide:", err);
    // Fallback: cria uma Pinia local (isolated mode)
    const { createPinia } = await import("pinia");
    sharedPinia = createPinia();
    return sharedPinia;
  }
}

const lifecycles = singleSpaVue({
  createApp,
  appOptions: {
    el: "#single-spa-root",
    render() {
      return h(App);
    },
  },
  async handleInstance(app) {
    // Carrega Pinia compartilhada antes de montar
    const pinia = await initSharedPinia();
    app.use(pinia);

    router = createMfeRouter();

    router.afterEach((to) => {
      const full = BASE + (to.fullPath === "/" ? "" : to.fullPath);
      if (window.location.pathname !== full) {
        window.history.replaceState(window.history.state, "", full);
      }
    });

    app.use(router);
  },
});

const cssLc = cssLifecycleFactory("spa");

export const bootstrap = [cssLc.bootstrap, lifecycles.bootstrap];
export const mount = [
  cssLc.mount,
  lifecycles.mount,
  async () => {
    const sub = window.location.pathname.slice(BASE.length) || "/";
    await router.replace(sub);
  },
];
export const unmount = [cssLc.unmount, lifecycles.unmount];
