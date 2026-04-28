# Micro-frontends com Module Federation

Este projeto usa **single-spa** + **Vite** + **Module Federation** para orquestrar múltiplos micro-frontends com estado compartilhado via Pinia.

## Arquitetura

```
VITE_SINGLE/                    # Organização local (repos independentes)
├── root-config/                # Orquestrador single-spa (porta 6280)
├── mfe-login/                  # MFE Login (porta 6281) ─┐
├── mfe-admin/                  # MFE Admin (porta 6282) ├─ Module Federation
├── mfe-student/                # MFE Student (porta 6283) ┘
└── mfe-style-guide/            # Host MF (porta 6284) ──── shared state
```

---

## Module Federation vs Pacote NPM (Editora hoje)

### Como está na Editora hoje (`@futura/style-guide-frontend`)

```typescript
// Pacote publicado no npm, instalado via "file:../" ou registry
import { Store, I18n, Vuetify } from "@futura/style-guide-frontend";

// Cada MFE tem sua própria cópia do pacote
// O "singleton" só funciona se o módulo vier da MESMA URL
```

| Aspecto | Pacote NPM linkado |
|---------|-------------------|
| **Instalação** | `"style-guide": "file:../style-guide"` em cada MFE |
| **Copies** | Cada `node_modules` tem cópia física separada |
| **Singleton** | ❌ Quebra em dev - cada MFE carrega sua própria instância |
| **Build** | Precisa buildar o style-guide antes de usar |
| **Hot reload** | ❌ Não funciona bem entre repos separados |
| **Versão** | Tem que versionar e reinstalar em cada change |

**O problema:** O `let sharedPinia` no style-guide só é singleton se o módulo vier da mesma URL. Com `file:../`, cada Vite dev server carrega uma cópia diferente → estado NÃO é compartilhado entre MFEs.

---

### Nova abordagem: Module Federation

```typescript
// Import dinâmico do remote entry
const shell = await import("mfeStyleGuide/shell");
const store = shell.useShellSessionStore(); // Mesma instância global!
```

| Aspecto | Module Federation |
|---------|-------------------|
| **Runtime** | Módulos carregados via HTTP do `remoteEntry.js` |
| **Copies** | **Uma única instância** de cada shared dep (vue, pinia) |
| **Singleton** | ✅ Funciona - `shared: ["vue", "pinia"]` garante uma cópia |
| **Build dev** | ✅ Dev server expõe remotos dinamicamente |
| **Hot reload** | ✅ Funciona em todos os MFEs simultaneamente |
| **Versão** | Sem versionamento, sempre usa a versão do remote |

**Como funciona:**
1. `mfe-style-guide` expõe três pontos (`./shell`, `./components`, `./stores`)
2. Todos os outros MFEs configuram `remotes: { mfeStyleGuide: "http://localhost:6284/..." }`
3. Module Federation gerencia **uma única instância** de Vue/Pinia no runtime

---

## Exemplos de Uso

### 1. Usar a Store Shell (compartilhada entre todos)

```typescript
// Em qualquer MFE (login, admin, student)
// HomeView.vue ou qualquer componente

<script setup lang="ts">
import { ref, onMounted } from "vue";

const shellStore = ref<any>(null);
const userName = ref("");

onMounted(async () => {
  // Import do remote
  const shell = await import("mfeStyleGuide/shell");
  shellStore.value = shell.useShellSessionStore();
});

function saveUser() {
  // Define um valor visível em TODOS os MFEs
  shellStore.value?.setDisplayName(userName.value, "mfe-login");
}
</script>
```

**Resultado:** O nome salvo em `/login` aparece automaticamente em `/admin` e `/student`.

---

### 2. Registrar uma Store Local para Acesso Global

```typescript
// mfe-login/src/stores/login.ts
import { defineStore } from "pinia";

export const useLoginStore = defineStore("login", {
  state: () => ({
    user: null as { id: string; name: string } | null,
    isAuthenticated: false,
  }),
  actions: {
    login(user: { id: string; name: string }) {
      this.user = user;
      this.isAuthenticated = true;
    },
    logout() {
      this.user = null;
      this.isAuthenticated = false;
    },
  },
});
```

```typescript
// mfe-login/src/spa.ts ou HomeView.vue
import { useLoginStore } from "./stores/login";

onMounted(async () => {
  const shell = await import("mfeStyleGuide/shell");
  
  // Registra para outros MFEs acessarem
  shell.registerStore("useLoginStore", useLoginStore);
});
```

---

### 3. Acessar Store de Outro MFE

```typescript
// mfe-admin/src/views/HomeView.vue

<script setup lang="ts">
import { ref, onMounted } from "vue";

const loginStore = ref<any>(null);

onMounted(async () => {
  const shell = await import("mfeStyleGuide/shell");
  
  // Obtém a factory da store registrada pelo login
  const useLoginStore = shell.getStore("useLoginStore");
  
  if (useLoginStore) {
    // Instancia a store (mesma Pinia global)
    loginStore.value = useLoginStore();
    
    // Agora pode acessar o estado do login!
    console.log(loginStore.value.user?.name); // "João Silva"
    console.log(loginStore.value.isAuthenticated); // true
  }
});
</script>

<template>
  <div v-if="loginStore">
    <span v-if="loginStore.isAuthenticated">
      Logado como: {{ loginStore.user?.name }}
    </span>
    <span v-else>Usuário não autenticado</span>
  </div>
</template>
```

**Casos de uso:**
- Admin mostrar dados do usuário logado (vindos do login)
- Student verificar permissões baseadas no perfil do login
- Header global mostrar avatar/nome do usuário em qualquer rota

---

### 4. Usar Componentes do Style-Guide

```vue
<!-- mfe-admin/src/views/HomeView.vue -->
<script setup lang="ts">
import { defineAsyncComponent } from "vue";

// Componente carregado dinamicamente do style-guide
const SgBadge = defineAsyncComponent(() =>
  import("mfeStyleGuide/components").then(m => m.SgBadge)
);
</script>

<template>
  <p class="mfe__title">
    Admin
    <SgBadge variant="accent">mfe-style-guide</SgBadge>
  </p>
</template>
```

**Variantes disponíveis:** `neutral`, `accent`, `success`

---

### 5. Listar Todas as Stores Disponíveis

```typescript
const shell = await import("mfeStyleGuide/shell");

// Útil para debugging
console.log("Stores registradas:", shell.listStores());
// ["useLoginStore", "useAdminStore", "useStudentStore", "useShellSessionStore"]

// Verificar se uma store existe
if (shell.hasStore("useLoginStore")) {
  // Safe to use
}
```

---

## Começando

### 1. Instalar dependências

```bash
cd root-config && yarn install
cd ../mfe-style-guide && yarn install
cd ../mfe-login && yarn install
cd ../mfe-admin && yarn install
cd ../mfe-student && yarn install
```

### 2. Iniciar em desenvolvimento (com Module Federation)

**Ordem importa:** style-guide deve iniciar primeiro (ele é o host).

```bash
# Terminal 1 - style-guide (porta 6284)
cd mfe-style-guide
yarn dev

# Terminal 2 - login (porta 6281)
cd mfe-login
yarn dev

# Terminal 3 - admin (porta 6282)
cd mfe-admin
yarn dev

# Terminal 4 - student (porta 6283)
cd mfe-student
yarn dev

# Terminal 5 - root-config (porta 6280)
cd root-config
yarn dev
```

Acesse: **http://localhost:6280**

---

## Configuração de Dev Mode (sem build!)

Module Federation com `@originjs/vite-plugin-federation` funciona em **dev mode** sem precisar buildar! O plugin automaticamente:

1. Gera o `remoteEntry.js` em memória no dev server
2. Expõe os módulos na URL configurada em `remotes`
3. Hot reload funciona em todos os MFEs

**Não é necessário** `yarn build` durante o desenvolvimento. O dev server do Vite já serve os remotos dinamicamente.

---

## Portas

| Projeto | Porta | URL de Dev | URL do Remote Entry |
|---------|-------|------------|---------------------|
| root-config | 6280 | http://localhost:6280 | — |
| mfe-login | 6281 | http://localhost:6281 | — |
| mfe-admin | 6282 | http://localhost:6282 | — |
| mfe-student | 6283 | http://localhost:6283 | — |
| mfe-style-guide | 6284 | http://localhost:6284 | http://localhost:6284/dist/assets/remoteEntry.js |

---

## Build para Produção

```bash
# Build em ordem: style-guide primeiro (os outros dependem dele)
cd mfe-style-guide && yarn build
cd ../mfe-login && yarn build
cd ../mfe-admin && yarn build
cd ../mfe-student && yarn build
```

Os arquivos `remoteEntry.js` e os chunks ficam em `dist/assets/`.

---

## API das Stores

### `useShellSessionStore()`
Store padrão para estado cross-MFE.

```typescript
const store = useShellSessionStore();

// State
store.displayName: string
store.lastUpdatedByMfe: string

// Actions
store.setDisplayName(name: string, fromMfe: string): void
```

### `registerStore(name, factory)`
Registra uma store para acesso global.

```typescript
registerStore("useMeuStore", useMeuStore);
```

### `getStore(name)`
Obtém uma store registrada.

```typescript
const useMeuStore = getStore("useMeuStore");
if (useMeuStore) {
  const store = useMeuStore();
}
```

### `hasStore(name)` / `listStores()` / `getAllStores()`
Utilitários para debugging e introspecção.

---

## Troubleshooting

### "Cannot find module 'mfeStyleGuide/shell'"
Verifique se o `mfe-style-guide` está rodando na porta 6284.

### Stores não compartilham estado
Verifique no console se as stores aparecem em `listStores()`. Se o MFE que registrou a store não estiver montado, ela não estará disponível.

### Hot reload não funciona entre MFEs
Module Federation deve funcionar com HMR. Se parar, reinicie o dev server do style-guide.

---

## Diferença Resumida: Editora vs Novo

| | Editora (pacote npm) | Novo (Module Federation) |
|---|---|---|
| **Instalação** | `yarn install` no pacote | Sem instalação, runtime via HTTP |
| **Estado compartilhado** | ❌ Cada MFE isolado | ✅ Uma Pinia global |
| **Hot reload** | ❌ Rebuild + reinstalação | ✅ Automático em todos MFEs |
| **Acesso a store de outro MFE** | ❌ Impossível | ✅ `getStore("useLoginStore")` |
| **Componentes compartilhados** | ⚠️ Build necessário | ✅ Import dinâmico |
| **Complexidade** | Baixa | Média (config MF) |

---

## Comandos Úteis

```bash
# Verificar todos os MFEs
for dir in mfe-style-guide mfe-login mfe-admin mfe-student root-config; do
  echo "=== $dir ==="
  (cd "$dir" && git status -s)
done

# Typecheck em todos
for dir in mfe-style-guide mfe-login mfe-admin mfe-student; do
  echo "=== $dir ==="
  (cd "$dir" && yarn typecheck)
done
```
