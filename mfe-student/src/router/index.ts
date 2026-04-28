import { createRouter, createMemoryHistory } from "vue-router";
import AboutView from "../views/AboutView.vue";
import HomeView from "../views/HomeView.vue";

export const BASE = "/student";

export function createMfeRouter() {
  return createRouter({
    history: createMemoryHistory(BASE),
    routes: [
      { path: "/", name: "home", component: HomeView },
      { path: "/about", name: "about", component: AboutView },
    ],
  });
}
