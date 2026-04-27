import { navigateToUrl, registerApplication, start } from "single-spa";

import "./shell.css";

/** Em dev, o Vite não resolve bare specifiers do import map no pré-bundle; URLs explícitas + @vite-ignore.
 * URLs podem ser sobrescritas via variáveis de ambiente VITE_MFE_*_URL
 */
const entries = {
  login: import.meta.env.VITE_MFE_LOGIN_URL || "http://localhost:6281/src/spa.ts",
  admin: import.meta.env.VITE_MFE_ADMIN_URL || "http://localhost:6282/src/spa.ts",
  student: import.meta.env.VITE_MFE_STUDENT_URL || "http://localhost:6283/src/spa.ts",
  styleGuide: import.meta.env.VITE_MFE_STYLE_GUIDE_URL || "http://localhost:6284/src/spa.ts",
} as const;

function loadSpa(url: string) {
  return import(/* @vite-ignore */ url);
}

registerApplication({
  name: "@editora-single/login",
  app: () => loadSpa(entries.login),
  activeWhen: (location) =>
    location.pathname === "/login" || location.pathname.startsWith("/login/"),
});

registerApplication({
  name: "@editora-single/admin",
  app: () => loadSpa(entries.admin),
  activeWhen: (location) =>
    location.pathname === "/admin" || location.pathname.startsWith("/admin/"),
});

registerApplication({
  name: "@editora-single/student",
  app: () => loadSpa(entries.student),
  activeWhen: (location) =>
    location.pathname === "/student" ||
    location.pathname.startsWith("/student/"),
});

registerApplication({
  name: "@editora-single/style-guide",
  app: () => loadSpa(entries.styleGuide),
  activeWhen: (location) =>
    location.pathname === "/style-guide" ||
    location.pathname.startsWith("/style-guide/"),
});

start();

document.querySelectorAll<HTMLAnchorElement>("[data-spa-link]").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    navigateToUrl(a.getAttribute("href") ?? "/");
  });
});

if (window.location.pathname === "/") {
  navigateToUrl("/login");
}
