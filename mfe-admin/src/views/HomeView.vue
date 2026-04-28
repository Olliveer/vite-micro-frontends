<template>
  <div>
    <p class="mfe__title">
      Admin
      <SgBadge v-if="componentsReady" variant="accent" class="mfe__badge">mfe-style-guide</SgBadge>
      <span v-else-if="loading" class="mfe__title-badge">⏳</span>
    </p>
    <p class="mfe__hint">MFE single-spa + Module Federation — Acessando stores de outros MFEs!</p>

    <!-- Loading -->
    <section v-if="loading" class="mfe__loading">
      <p>⏳ Conectando ao mfeStyleGuide...</p>
      <p class="mfe__loading-hint">Verifique se o style-guide está rodando na porta 6284</p>
    </section>

    <!-- Error -->
    <section v-else-if="error" class="mfe__error">
      <p>❌ Erro ao carregar mfeStyleGuide</p>
      <p class="mfe__error-msg">{{ error }}</p>
      <button class="mfe__btn" @click="retry">Tentar novamente</button>
    </section>

    <!-- Content -->
    <template v-else-if="shellReady">
      <section class="mfe__shell" aria-label="Sessão shell">
        <p class="mfe__shell-title">🌐 Sessão Shell (compartilhada globalmente)</p>
        <p class="mfe__shell-desc">
          Esta é a <strong>mesma store</strong> usada pelo Login. O valor é sincronizado
          automaticamente entre todos os MFEs via Module Federation!
        </p>
        <dl class="mfe__dl">
          <div>
            <dt>👤 Nome na sessão</dt>
            <dd>{{ shellStore.displayName || "— (não definido)" }}</dd>
          </div>
          <div>
            <dt>📍 Última origem</dt>
            <dd>{{ shellStore.lastUpdatedByMfe || "—" }}</dd>
          </div>
        </dl>
        <button type="button" class="mfe__btn" @click="reply">📤 Responder do Admin</button>
      </section>

      <section class="mfe__cross" aria-label="Acesso a stores de outros MFEs">
        <p class="mfe__cross-title">🔗 Stores de Outros MFEs (Cross-MFE)</p>
        <p class="mfe__cross-desc">
          O Admin acessa stores registradas por outros MFEs via
          <code>getStore('nome')</code> do registro global do style-guide.
        </p>

        <!-- Login Store -->
        <div class="mfe__stores">
          <h4 class="mfe__stores-title">🔐 useLoginStore (do mfe-login)</h4>
          <div v-if="loginStore" class="mfe__store-card mfe__store-card--success">
            <div class="mfe__store-header">
              <span class="mfe__badge" :class="{ 'mfe__badge--active': loginStore.isAuthenticated }">
                {{ loginStore.isAuthenticated ? "✅ Autenticado" : "❌ Não autenticado" }}
              </span>
              <span class="mfe__store-tag">Cross-MFE ✓</span>
            </div>
            <div v-if="loginStore.user" class="mfe__store-data">
              <p><strong>👤 Nome:</strong> {{ loginStore.user.name }}</p>
              <p><strong>📧 Email:</strong> {{ loginStore.user.email }}</p>
              <p><strong>🆔 ID:</strong> {{ loginStore.user.id }}</p>
            </div>
            <p v-else class="mfe__store-hint">
              💡 Vá até o <strong>/login</strong> e clique em "Simular Login" para ver os dados aparecerem aqui!
            </p>
          </div>
          <div v-else class="mfe__store-card mfe__store-card--warning">
            <p class="mfe__store-missing">
              ⚠️ Store não disponível. O mfe-login precisa estar carregado primeiro.
            </p>
            <p class="mfe__store-hint">
              Navegue para <strong>/login</strong> e volte para cá.
            </p>
          </div>
        </div>

        <!-- Admin Store -->
        <div class="mfe__stores">
          <h4 class="mfe__stores-title">🏠 useAdminStore (local)</h4>
          <div class="mfe__store-card">
            <p class="mfe__store-hint">
              👥 <strong>Usuários:</strong> {{ adminStore?.userCount || 0 }}
              <span v-if="adminStore?.selectedUser">| 🎯 Selecionado: <strong>{{ adminStore.selectedUser.name }}</strong></span>
            </p>
            <button type="button" class="mfe__btn mfe__btn--secondary" @click="addSampleUser">
              ➕ Adicionar usuário de teste
            </button>
          </div>
        </div>

        <!-- Debug -->
        <div class="mfe__debug">
          <p class="mfe__debug-title">🐛 Debug: Stores registradas no registro global</p>
          <code class="mfe__debug-code">{{ availableStores.join(", ") || "Nenhuma" }}</code>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { StoreDefinition } from "pinia";
import { ref, onMounted, defineAsyncComponent } from "vue";

type ShellModule = {
  useShellSessionStore: StoreDefinition;
  getStore: (name: string) => StoreDefinition | undefined;
  listStores: () => string[];
};

// Componente assíncrono do style-guide
const SgBadge = defineAsyncComponent(() =>
  import("mfeStyleGuide/components").then(m => m.SgBadge).catch(err => {
    console.error("[mfe-admin] Falha ao carregar SgBadge:", err);
    throw err;
  })
);

const loading = ref(true);
const error = ref<string | null>(null);
const shellReady = ref(false);
const componentsReady = ref(false);
const shellStore = ref<any>({});
const loginStore = ref<any>(null);
const adminStore = ref<any>(null);
const availableStores = ref<string[]>([]);

async function init() {
  loading.value = true;
  error.value = null;

  try {
    console.log("[mfe-admin] 🔄 Conectando ao mfeStyleGuide...");

    // Import componentes primeiro
    componentsReady.value = true;

    // Import shell com timeout
    const shellModule = await Promise.race([
      import("mfeStyleGuide/shell") as Promise<ShellModule>,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout: mfeStyleGuide não respondeu em 5s")), 5000)
      ),
    ]);

    console.log("[mfe-admin] ✅ mfeStyleGuide conectado!");

    shellStore.value = shellModule.useShellSessionStore();
    availableStores.value = shellModule.listStores();

    // Tenta obter a store do login
    const useLoginStore = shellModule.getStore("useLoginStore");
    if (useLoginStore) {
      loginStore.value = useLoginStore();
      console.log("[mfe-admin] ✅ useLoginStore carregada do mfe-login!");
    } else {
      console.log("[mfe-admin] ⚠️ useLoginStore ainda não registrada (mfe-login não carregou)");
    }

    // Store local do admin
    const useAdminStore = shellModule.getStore("useAdminStore");
    if (useAdminStore) {
      adminStore.value = useAdminStore();
      if (adminStore.value.userCount === 0) {
        adminStore.value.setUsers([
          { id: "u1", name: "Alice", role: "admin" },
          { id: "u2", name: "Bob", role: "student" },
        ]);
      }
    }

    shellReady.value = true;
    console.log("[mfe-admin] 📋 Stores disponíveis:", availableStores.value);
  } catch (err: any) {
    console.error("[mfe-admin] ❌ Erro:", err);
    error.value = err.message || "Erro desconhecido";
  } finally {
    loading.value = false;
  }
}

function retry() {
  init();
}

onMounted(init);

function reply() {
  shellStore.value?.setDisplayName?.("Olá do mfe-admin", "mfe-admin");
  console.log("[mfe-admin] 📤 Resposta enviada");
}

function addSampleUser() {
  if (!adminStore.value) return;
  const id = `user-${Date.now()}`;
  adminStore.value.addUser({
    id,
    name: `Usuário ${adminStore.value.userCount + 1}`,
    role: "student",
  });
  adminStore.value.selectUser(id);
}
</script>

<style scoped lang="scss">
.mfe__title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  margin: 0 0 0.5rem;
  font-weight: 700;
  font-size: 1.35rem;
  color: #1b5e20;
}

.mfe__title-badge {
  font-size: 1rem;
}

.mfe__badge {
  vertical-align: middle;
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
.mfe__cross {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
}

.mfe__shell {
  background: rgba(232, 245, 233, 0.8);
  border: 2px solid rgba(46, 125, 50, 0.4);
}

.mfe__cross {
  background: rgba(255, 243, 224, 0.8);
  border: 2px solid rgba(255, 152, 0, 0.3);
}

.mfe__shell-title,
.mfe__cross-title {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.mfe__shell-title {
  color: #2e7d32;
}

.mfe__cross-title {
  color: #ef6c00;
}

.mfe__shell-desc,
.mfe__cross-desc {
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

.mfe__dl {
  margin: 0 0 1rem;
  display: grid;
  gap: 0.75rem;

  div {
    display: grid;
    gap: 0.25rem;
  }

  dt {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #558b2f;
  }

  dd {
    margin: 0;
    font-size: 1rem;
    color: #1b5e20;
    font-weight: 500;
  }
}

.mfe__btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  background: #2e7d32;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1b5e20;
  }

  &--secondary {
    background: #546e7a;

    &:hover {
      background: #37474f;
    }
  }
}

.mfe__stores {
  margin-top: 1rem;
}

.mfe__stores-title {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #33691e;
}

.mfe__store-card {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);

  &--success {
    border-left: 4px solid #4caf50;
  }

  &--warning {
    border-left: 4px solid #ff9800;
    background: rgba(255, 243, 224, 0.5);
  }
}

.mfe__store-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.mfe__store-tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  background: rgba(76, 175, 80, 0.15);
  color: #2e7d32;
  border-radius: 4px;
  font-weight: 600;
}

.mfe__badge {
  display: inline-flex;
  align-items: center;
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

.mfe__store-data {
  margin: 0;

  p {
    margin: 0.35rem 0;
    font-size: 0.9rem;
    color: #37474f;
  }
}

.mfe__store-hint {
  margin: 0.75rem 0 0;
  font-size: 0.85rem;
  font-style: italic;
  color: #607d8b;

  strong {
    color: #1565c0;
  }
}

.mfe__store-missing {
  margin: 0;
  font-size: 0.9rem;
  color: #e65100;
}

.mfe__debug {
  margin-top: 1.5rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
}

.mfe__debug-title {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #666;
}

.mfe__debug-code {
  display: block;
  font-family: monospace;
  font-size: 0.8rem;
  color: #444;
  word-break: break-all;
}
</style>
