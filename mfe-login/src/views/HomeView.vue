<template>
  <div>
    <p class="mfe__title">Login</p>
    <p class="mfe__hint">MFE single-spa + Module Federation</p>

    <!-- Loading -->
    <section v-if="loading" class="mfe__loading">
      <p>⏳ Carregando Module Federation...</p>
      <p class="mfe__loading-hint">Aguardando mfe-style-guide na porta 6284</p>
    </section>

    <!-- Error -->
    <section v-else-if="error" class="mfe__error">
      <p>❌ Erro ao carregar mfeStyleGuide</p>
      <p class="mfe__error-msg">{{ error }}</p>
      <button class="mfe__btn" @click="retry">Tentar novamente</button>
    </section>

    <!-- Content -->
    <template v-else-if="shellReady">
      <section class="mfe__shell" aria-label="Estado local e shell">
        <p class="mfe__shell-title">✅ Sessão Shell (compartilhada)</p>
        <p class="mfe__shell-desc">
          Esta store vem de <code>mfeStyleGuide/shell</code> via Module Federation.
          Valores aqui são visíveis no Admin e Student em tempo real!
        </p>
        <label class="mfe__label">
          Nome do usuário
          <input v-model="name" type="text" class="mfe__input" autocomplete="off" placeholder="Digite seu nome..." />
        </label>
        <button type="button" class="mfe__btn" @click="publish">📤 Publicar na sessão shell</button>
        <p v-if="shellStore.displayName" class="mfe__preview">
          📝 Atual: <strong>{{ shellStore.displayName }}</strong>
          <span class="mfe__meta">(última origem: {{ shellStore.lastUpdatedByMfe || "—" }})</span>
        </p>
      </section>

      <section v-if="loginStore" class="mfe__local" aria-label="Store local do login">
        <p class="mfe__local-title">🏠 Store Local (useLoginStore)</p>
        <p class="mfe__local-desc">
          Esta store é registrada no <strong>registro global</strong> e pode ser acessada
          por outros MFEs via <code>getStore('useLoginStore')</code>.
        </p>
        <div class="mfe__status">
          <span class="mfe__badge" :class="{ 'mfe__badge--active': loginStore.isAuthenticated }">
            {{ loginStore.isAuthenticated ? "✅ Autenticado" : "❌ Não autenticado" }}
          </span>
        </div>
        <div class="mfe__actions">
          <button type="button" class="mfe__btn mfe__btn--secondary" @click="simulateLogin">
            🔑 Simular Login
          </button>
          <button v-if="loginStore.isAuthenticated" type="button" class="mfe__btn mfe__btn--danger" @click="logout">
            🚪 Logout
          </button>
        </div>
        <p v-if="loginStore.user" class="mfe__preview">
          👤 Usuário: <strong>{{ loginStore.user.name }}</strong> ({{ loginStore.user.email }})
        </p>
        <p class="mfe__tip">
          💡 <strong>Dica:</strong> Abra o Admin em outra aba e veja estes dados aparecerem lá automaticamente!
        </p>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { StoreDefinition } from "pinia";

type ShellModule = {
  useShellSessionStore: StoreDefinition;
  registerStore: (name: string, factory: StoreDefinition) => void;
  getStore: (name: string) => StoreDefinition | undefined;
  listStores: () => string[];
};

const loading = ref(true);
const error = ref<string | null>(null);
const shellReady = ref(false);
const shellStore = ref<any>({});
const loginStore = ref<any>(null);
const name = ref("");

async function init() {
  loading.value = true;
  error.value = null;

  try {
    console.log("[mfe-login] 🔄 Carregando mfeStyleGuide...");

    // Import via Module Federation com timeout
    const shellModule = await Promise.race([
      import("mfeStyleGuide/shell") as Promise<ShellModule>,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout: mfeStyleGuide não respondeu em 5s")), 5000)
      ),
    ]);

    console.log("[mfe-login] ✅ mfeStyleGuide carregado!");

    const store = shellModule.useShellSessionStore();
    shellStore.value = store;
    name.value = store.displayName || "";

    // Registra as stores deste MFE
    const { useLoginStore } = await import("../stores/login");
    shellModule.registerStore("useLoginStore", useLoginStore);

    // Inicializa store local
    loginStore.value = useLoginStore();

    shellReady.value = true;
    console.log("[mfe-login] 📋 Stores registradas:", shellModule.listStores());
  } catch (err: any) {
    console.error("[mfe-login] ❌ Falha ao carregar mfeStyleGuide:", err);
    error.value = err.message || "Erro desconhecido";
  } finally {
    loading.value = false;
  }
}

function retry() {
  init();
}

onMounted(init);

function publish() {
  shellStore.value?.setDisplayName?.(name.value || "(vazio)", "mfe-login");
  console.log("[mfe-login] 📤 Publicado:", name.value);
}

function simulateLogin() {
  loginStore.value?.login?.({
    id: "user-123",
    name: "João Silva",
    email: "joao.silva@example.com",
  });
  shellStore.value?.setDisplayName?.("João Silva", "mfe-login");
  console.log("[mfe-login] 🔑 Login simulado");
}

function logout() {
  loginStore.value?.logout?.();
  console.log("[mfe-login] 🚪 Logout");
}
</script>

<style scoped lang="scss">
.mfe__title {
  margin: 0 0 0.5rem;
  font-weight: 700;
  font-size: 1.35rem;
  color: #0d47a1;
}

.mfe__hint {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: #37474f;
}

.mfe__loading,
.mfe__error {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.mfe__loading {
  background: rgba(255, 193, 7, 0.2);
  border: 1px solid rgba(255, 193, 7, 0.5);

  p {
    margin: 0;
    color: #f57c00;
    font-weight: 500;
  }
}

.mfe__loading-hint {
  margin-top: 0.5rem !important;
  font-size: 0.8rem;
  color: #666 !important;
}

.mfe__error {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);

  p:first-child {
    margin: 0;
    color: #c62828;
    font-weight: 600;
  }
}

.mfe__error-msg {
  margin: 0.5rem 0;
  font-size: 0.85rem;
  color: #666;
  font-family: monospace;
}

.mfe__shell,
.mfe__local {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
}

.mfe__shell {
  background: rgba(232, 245, 233, 0.6);
  border: 2px solid rgba(46, 125, 50, 0.3);
}

.mfe__local {
  background: rgba(227, 242, 253, 0.6);
  border: 2px solid rgba(21, 101, 192, 0.3);
}

.mfe__shell-title,
.mfe__local-title {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.mfe__shell-title {
  color: #2e7d32;
}

.mfe__local-title {
  color: #1565c0;
}

.mfe__shell-desc,
.mfe__local-desc {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #455a64;

  code {
    font-size: 0.8rem;
    padding: 0.15em 0.4em;
    border-radius: 4px;
    background: rgba(0, 0, 0, 0.06);
  }

  strong {
    color: #1565c0;
  }
}

.mfe__label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #37474f;
  margin-bottom: 0.75rem;
}

.mfe__input {
  padding: 0.5rem 0.75rem;
  border: 2px solid rgba(21, 101, 192, 0.3);
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #1565c0;
  }
}

.mfe__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.mfe__btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  background: #1565c0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #0d47a1;
  }

  &--secondary {
    background: #546e7a;

    &:hover {
      background: #37474f;
    }
  }

  &--danger {
    background: #c62828;

    &:hover {
      background: #b71c1c;
    }
  }
}

.mfe__preview {
  margin: 1rem 0 0;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 6px;
  font-size: 0.95rem;
  color: #37474f;
}

.mfe__meta {
  display: block;
  margin-top: 0.35rem;
  font-size: 0.8rem;
  font-weight: 400;
  color: #666;
}

.mfe__status {
  margin-bottom: 1rem;
}

.mfe__badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  background: #78909c;
  border-radius: 999px;

  &--active {
    background: #2e7d32;
  }
}

.mfe__tip {
  margin: 1rem 0 0;
  padding: 0.75rem;
  background: rgba(255, 193, 7, 0.15);
  border-left: 4px solid #ffc107;
  border-radius: 0 6px 6px 0;
  font-size: 0.85rem;
  color: #666;

  strong {
    color: #f57c00;
  }
}
</style>
