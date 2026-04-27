import { createApp, h } from "vue";
import singleSpaVue from "single-spa-vue";
import { cssLifecycleFactory } from "vite-plugin-single-spa/ex";
import App from "./App.vue";

const lifecycles = singleSpaVue({
  createApp,
  appOptions: {
    el: "#single-spa-root",
    render() {
      return h(App);
    },
  },
});

const cssLc = cssLifecycleFactory("spa");

export const bootstrap = [cssLc.bootstrap, lifecycles.bootstrap];
export const mount = [cssLc.mount, lifecycles.mount];
export const unmount = [cssLc.unmount, lifecycles.unmount];
