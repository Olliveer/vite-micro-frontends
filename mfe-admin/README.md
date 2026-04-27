# mfe-admin

Micro-frontend de administração para o sistema EDITORA, implementado com Vue 3 + Vite + single-spa.

## Tecnologias

- Vue 3 (Composition API)
- TypeScript
- Vite 6
- single-spa-vue
- SCSS

## Scripts

```bash
# Instalar dependências
yarn install

# Desenvolvimento (porta 6282)
yarn dev

# Build para produção
yarn build

# Preview da build
yarn preview

# Type checking
yarn typecheck
```

## Integração com single-spa

Este MFE é carregado dinamicamente pelo root-config via import map. Em desenvolvimento,
é servido em `http://localhost:6282/src/spa.ts`.

## Estrutura

```
src/
├── spa.ts      # Entry point para single-spa (exporta bootstrap, mount, unmount)
├── App.vue     # Componente principal
└── env.d.ts    # Declarações de ambiente
```

## Porta

- Desenvolvimento: **6282**
