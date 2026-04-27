import { createRouter, createWebHistory } from "vue-router";
import AboutView from "../views/AboutView.vue";
import HomeView from "../views/HomeView.vue";

const BASE = "/admin";

export function createMfeRouter() {
  return createRouter({
    history: createWebHistory(BASE),
    routes: [
      { path: "/", name: "home", component: HomeView },
      { path: "/about", name: "about", component: AboutView },
    ],
  });
}
