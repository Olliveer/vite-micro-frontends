import type { StoreDefinition, StateTree } from "pinia";

/** Factory function que cria uma store (aceita Pinia genérica) */
export type StoreFactory<T extends StateTree = StateTree> = () => StoreDefinition<string, T>;

/** Registro de stores compartilhadas entre MFEs */
export type RegisteredStores = Record<string, StoreFactory>;

/**
 * Registro global de stores.
 * Usa window para garantir que seja verdadeiramente global
 * entre todos os MFEs no runtime.
 */
declare global {
  interface Window {
    __MFE_STORES__?: RegisteredStores;
  }
}

/** Obtém ou cria o registro global */
function getRegistry(): RegisteredStores {
  if (!window.__MFE_STORES__) {
    window.__MFE_STORES__ = {};
  }
  return window.__MFE_STORES__;
}

/**
 * Registra uma store para ser acessada por outros MFEs.
 *
 * @example
 * // No mfe-login
 * import { defineStore } from "pinia";
 * import { registerStore } from "mfeStyleGuide/shell";
 *
 * const useLoginStore = defineStore("login", {
 *   state: () => ({ user: null }),
 *   actions: { login(user) { this.user = user; } }
 * });
 *
 * registerStore("useLoginStore", useLoginStore);
 *
 * @param name - Nome único da store (convenção: useXxxStore)
 * @param factory - StoreDefinition retornada pelo defineStore
 */
export function registerStore<T extends StateTree>(name: string, factory: StoreFactory<T>): void {
  const registry = getRegistry();
  registry[name] = factory as StoreFactory;
  console.log(`[MFE Stores] Registered: ${name}`);
}

/**
 * Obtém uma store registrada por outro MFE.
 *
 * @example
 * // No mfe-admin
 * import { getStore } from "mfeStyleGuide/shell";
 *
 * const useLoginStore = getStore("useLoginStore");
 * const loginStore = useLoginStore?.(); // chama a factory se existir
 *
 * @param name - Nome da store registrada
 * @returns A factory da store ou undefined se não existir
 */
export function getStore<T extends StateTree>(name: string): StoreFactory<T> | undefined {
  return getRegistry()[name] as StoreFactory<T> | undefined;
}

/**
 * Verifica se uma store está registrada.
 */
export function hasStore(name: string): boolean {
  return name in getRegistry();
}

/**
 * Lista todas as stores registradas.
 */
export function listStores(): string[] {
  return Object.keys(getRegistry());
}

/**
 * Obtém o registro completo (útil para debugging).
 */
export function getAllStores(): RegisteredStores {
  return { ...getRegistry() };
}
