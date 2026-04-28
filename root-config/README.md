# root-config

Orquestrador single-spa para micro-frontends. Responsável por carregar e gerenciar
todos os micro-frontends (MFEs).

## Tecnologias

- TypeScript
- Vite 6
- single-spa
- vite-plugin-single-spa

## Scripts

```bash
# Instalar dependências
yarn install

# Desenvolvimento (porta 6280)
yarn dev

# Build para produção
yarn build

# Preview da build
yarn preview

# Type checking
yarn typecheck
```

## Configuração

### URLs dos MFEs

Por padrão, o root-config espera os MFEs nas seguintes URLs:

| MFE | URL Padrão |
|-----|------------|
| login | http://localhost:6281/src/spa.ts |
| admin | http://localhost:6282/src/spa.ts |
| student | http://localhost:6283/src/spa.ts |
| style-guide | http://localhost:6284/src/spa.ts |

Para sobrescrever, crie um arquivo `.env` na raiz do projeto:

```bash
VITE_MFE_LOGIN_URL=http://localhost:6281/src/spa.ts
VITE_MFE_ADMIN_URL=http://localhost:6282/src/spa.ts
VITE_MFE_STUDENT_URL=http://localhost:6283/src/spa.ts
VITE_MFE_STYLE_GUIDE_URL=http://localhost:6284/src/spa.ts
```

Veja `.env.example` para o template.

## Integração com MFEs

O root-config carrega os MFEs via import maps e single-spa. Cada MFE deve exportar
as funções `bootstrap`, `mount` e `unmount` no seu entry point (`spa.ts`).

## Rotas

- `/login` - Carrega mfe-login
- `/admin` - Carrega mfe-admin
- `/student` - Carrega mfe-student
- `/style-guide` - Carrega mfe-style-guide
- `/` - Redireciona para `/login`

## Porta

- Desenvolvimento: **6280**

## Estrutura

```
src/
├── main.ts              # Orquestrador single-spa
├── importMap.dev.json   # Import map para desenvolvimento
├── importMap.json       # Import map para produção
├── shell.css            # Estilos do shell
└── vite-env.d.ts        # Declarações de ambiente
```
