/**
 * Sistema de stores compartilhadas via Module Federation.
 *
 * Qualquer MFE pode:
 * 1. Registrar suas stores: `registerStore('useLoginStore', useLoginStore)`
 * 2. Acessar stores de outros MFEs: `getStore('useLoginStore')`
 * 3. Usar a store shell padrão: `useShellSessionStore`
 */

export { useShellSessionStore } from "./session";
export {
  registerStore,
  getStore,
  hasStore,
  listStores,
  getAllStores,
  type RegisteredStores,
  type StoreFactory,
} from "./registry";
