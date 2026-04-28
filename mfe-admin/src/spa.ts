import { createApp, h } from "vue";
import singleSpaVue from "single-spa-vue";
import { cssLifecycleFactory } from "vite-plugin-single-spa/ex";
import App from "./App.vue";
import { BASE, createMfeRouter } from "./router";

let router: ReturnType<typeof createMfeRouter>;

const lifecycles = singleSpaVue({
  createApp,
  appOptions: {
    el: "#single-spa-root",
    render() {
      return h(App);
    },
  },
  handleInstance(app) {
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
