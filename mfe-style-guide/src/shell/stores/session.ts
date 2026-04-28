import { defineStore } from "pinia";

/** Exemplo de store de sessão shell consumível por qualquer MFE que use `getSharedPinia()`. */
export const useShellSessionStore = defineStore("shell-session", {
  state: () => ({
    displayName: "",
    lastUpdatedByMfe: "",
  }),
  actions: {
    setDisplayName(name: string, fromMfe: string) {
      this.displayName = name.trim();
      this.lastUpdatedByMfe = fromMfe;
    },
  },
});
