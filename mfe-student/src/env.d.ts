/// <reference types="vite/client" />

/**
 * Declarações de tipo para Module Federation - mfeStyleGuide
 */
declare module "mfeStyleGuide/shell" {
  export { getSharedPinia } from "mfe-style-guide/src/shell";
  export {
    useShellSessionStore,
    registerStore,
    getStore,
    hasStore,
    listStores,
    getAllStores,
    type RegisteredStores,
    type StoreFactory,
  } from "mfe-style-guide/src/shell/stores";
}

declare module "mfeStyleGuide/components" {
  export { SgBadge } from "mfe-style-guide/src/components";
}

declare module "mfeStyleGuide/stores" {
  export * from "mfe-style-guide/src/shell/stores";
}
