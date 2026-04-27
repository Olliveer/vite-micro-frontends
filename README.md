# Workflow de Desenvolvimento - EDITORA Micro-frontends

Este documento descreve como trabalhar com os micro-frontends (MFEs), que são **repositórios Git independentes** organizados na pasta `VITE_SINGLE` apenas para conveniência de desenvolvimento.

## Arquitetura

```
VITE_SINGLE/                    # Apenas organização local (não é monorepo!)
├── root-config/                # Orquestrador single-spa (porta 6280) — repo Git independente
├── mfe-login/                  # Micro-frontend de login (porta 6281) — repo Git independente
├── mfe-admin/                  # Micro-frontend admin (porta 6282) — repo Git independente
├── mfe-student/                # Micro-frontend estudante (porta 6283) — repo Git independente
├── mfe-style-guide/            # Micro-frontend style-guide (porta 6284) — repo Git independente
└── start-dev.sh                # Script para iniciar todos
```

Cada pasta é um **repositório Git independente**.

## Começando do Zero

### 1. Clonar todos os repositórios

Se cada MFE estiver em um remote diferente (ex: GitHub):

```bash
mkdir VITE_SINGLE
cd VITE_SINGLE

# Clonar cada repositório
git clone https://github.com/editora/root-config.git
git clone https://github.com/editora/mfe-login.git
git clone https://github.com/editora/mfe-admin.git
git clone https://github.com/editora/mfe-student.git
git clone https://github.com/editora/mfe-style-guide.git
```

### 2. Instalar dependências

Cada projeto gerencia suas próprias dependências:

```bash
cd root-config && yarn install
cd ../mfe-login && yarn install
cd ../mfe-admin && yarn install
cd ../mfe-student && yarn install
cd ../mfe-style-guide && yarn install
```

### 3. Iniciar o ambiente de desenvolvimento

#### Opção 1: Script integrado (recomendado)

```bash
cd ../..  # Voltar para VITE_SINGLE/
./start-dev.sh

# Ou com liberação de portas (se estiverem ocupadas)
./start-dev.sh --fresh
```

#### Opção 2: Iniciar manualmente

Em terminais separados:

```bash
# Terminal 1 - root-config
cd root-config && yarn dev

# Terminal 2 - mfe-login
cd mfe-login && yarn dev

# Terminal 3 - mfe-admin
cd mfe-admin && yarn dev

# Terminal 4 - mfe-student
cd mfe-student && yarn dev

# Terminal 5 - mfe-style-guide
cd mfe-style-guide && yarn dev
```

Acesse: **http://localhost:6280**

## Desenvolvimento de um MFE isolado

Se você está trabalhando apenas em um MFE específico:

```bash
cd mfe-login

# Instalar dependências (se ainda não feito)
yarn install

# Desenvolver isoladamente
yarn dev
```

O MFE será servido na sua porta (ex: 6281) e pode ser testado isoladamente.

Para integrar com o root-config, certifique-se de que o root-config está rodando e apontando para o MFE correto (verifique as URLs em `root-config/.env`).

## Portas

| Projeto         | Porta | URL de Dev                       |
| --------------- | ----- | -------------------------------- |
| root-config     | 6280  | http://localhost:6280            |
| mfe-login       | 6281  | http://localhost:6281/src/spa.ts |
| mfe-admin       | 6282  | http://localhost:6282/src/spa.ts |
| mfe-student     | 6283  | http://localhost:6283/src/spa.ts |
| mfe-style-guide | 6284  | http://localhost:6284/src/spa.ts |

## Configuração de URLs

Se os MFEs estiverem rodando em URLs diferentes (ex: em outra máquina ou porta), configure o root-config:

```bash
cd root-config
cp .env.example .env
```

Edite `.env`:

```bash
VITE_MFE_LOGIN_URL=http://localhost:6281/src/spa.ts
VITE_MFE_ADMIN_URL=http://localhost:6282/src/spa.ts
VITE_MFE_STUDENT_URL=http://localhost:6283/src/spa.ts
VITE_MFE_STYLE_GUIDE_URL=http://localhost:6284/src/spa.ts
```

## Commits e Push

Cada MFE é independente. Faça commits e push separadamente:

```bash
cd mfe-login

# Verificar status
git status

# Adicionar e commitar
git add .
git commit -m "feat: adicionar formulário de login"

# Push para remote (quando configurado)
git push origin master
```

## Adicionando um Novo MFE

1. Criar novo repositório (ex: `mfe-reports`)
2. Copiar a estrutura base de um MFE existente (ex: `mfe-login`)
3. Modificar `package.json` (nome, porta)
4. Modificar `vite.config.ts` (porta, projectId)
5. Registrar no `root-config/src/main.ts`
6. Adicionar URL ao `.env.example` do root-config

### Exemplo: Registrando novo MFE no root-config

Editar `root-config/src/main.ts`:

```typescript
const entries = {
  // ... entradas existentes
  reports:
    import.meta.env.VITE_MFE_REPORTS_URL || "http://localhost:6285/src/spa.ts",
} as const;

// Registrar aplicação
registerApplication({
  name: "@editora-single/reports",
  app: () => loadSpa(entries.reports),
  activeWhen: (location) =>
    location.pathname === "/reports" ||
    location.pathname.startsWith("/reports/"),
});
```

## Build e Deploy

Cada MFE é buildado e deployado independentemente:

```bash
# Build de um MFE específico
cd mfe-login
yarn build

# O resultado estará em dist/
```

Em produção, o `importMap.json` do root-config aponta para as URLs de deploy de cada MFE (CDN ou servidor estático).

## Comandos Úteis

```bash
# Limpar node_modules de todos os projetos
find . -maxdepth 2 -name "node_modules" -type d -prune -exec rm -rf '{}' +

# Verificar status git de todos os projetos
for dir in root-config/ mfe-login/ mfe-admin/ mfe-student/ mfe-style-guide/; do
  echo "=== $dir ==="
  (cd "$dir" && git status -s)
done
```

## Dicas

1. **Independência**: Cada MFE pode usar versões diferentes de Vue, Vite, etc.
2. **TypeScript**: Cada projeto tem seu próprio `tsconfig.json` independente.
3. **Dependências compartilhadas**: Em produção, considere compartilhar Vue via import map para reduzir bundle size.
4. **Testes**: Cada MFE pode ter sua própria estratégia de testes (Vitest, Jest, etc.).

## Troubleshooting

### Portas ocupadas

```bash
./start-dev.sh --fresh
```

Ou manualmente:

```bash
lsof -ti tcp:6280 | xargs kill -9
lsof -ti tcp:6281 | xargs kill -9
# etc.
```

### MFE não carrega

1. Verifique se o MFE está rodando (`yarn dev` na pasta correta)
2. Verifique a URL no `.env` do root-config
3. Verifique o console do navegador por erros de CORS ou importação

### Dependências desatualizadas

```bash
cd <mfe>
yarn upgrade-interactive
```
