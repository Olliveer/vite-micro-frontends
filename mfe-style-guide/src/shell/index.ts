/**
 * Shell utilities para micro-frontends.
 *
 * Exporta:
 * - getSharedPinia(): Instância Pinia compartilhada via Module Federation
 * - useShellSessionStore: Store padrão para estado cross-MFE
 * - Funções de registro de stores (registerStore, getStore, etc.)
 */

export { getSharedPinia } from "./shared-pinia";
export {
  useShellSessionStore,
  registerStore,
  getStore,
  hasStore,
  listStores,
  getAllStores,
  type RegisteredStores,
  type StoreFactory,
} from "./stores";
