import { defineStore } from "pinia";

/**
 * Store de login - exemplo de store que pode ser compartilhada.
 *
 * Registrada automaticamente no shell ao inicializar.
 */
export const useLoginStore = defineStore("login", {
  state: () => ({
    user: null as { id: string; name: string; email: string } | null,
    isAuthenticated: false,
    lastLoginAt: null as string | null,
  }),

  getters: {
    userName: (state) => state.user?.name ?? "Guest",
    isLoggedIn: (state) => state.isAuthenticated && state.user !== null,
  },

  actions: {
    login(user: { id: string; name: string; email: string }) {
      this.user = user;
      this.isAuthenticated = true;
      this.lastLoginAt = new Date().toISOString();
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.lastLoginAt = null;
    },

    updateProfile(updates: Partial<{ name: string; email: string }>) {
      if (this.user) {
        this.user = { ...this.user, ...updates };
      }
    },
  },
});
