import { defineStore } from "pinia";

/**
 * Store de administração.
 */
export const useAdminStore = defineStore("admin", {
  state: () => ({
    users: [] as Array<{ id: string; name: string; role: string }>,
    selectedUserId: null as string | null,
    isLoading: false,
  }),

  getters: {
    selectedUser: (state) =>
      state.users.find((u) => u.id === state.selectedUserId),
    userCount: (state) => state.users.length,
  },

  actions: {
    setUsers(users: Array<{ id: string; name: string; role: string }>) {
      this.users = users;
    },

    selectUser(id: string | null) {
      this.selectedUserId = id;
    },

    addUser(user: { id: string; name: string; role: string }) {
      this.users.push(user);
    },

    removeUser(id: string) {
      const index = this.users.findIndex((u) => u.id === id);
      if (index > -1) {
        this.users.splice(index, 1);
      }
      if (this.selectedUserId === id) {
        this.selectedUserId = null;
      }
    },
  },
});
