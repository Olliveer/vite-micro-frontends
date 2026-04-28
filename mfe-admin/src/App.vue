<template>
  <div class="mfe mfe--admin">
    <nav class="mfe__nav">
      <RouterLink class="mfe__link" to="/">Início</RouterLink>
      <RouterLink class="mfe__link" :to="{ name: 'about', params: { id: '1' } }">Sobre</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.mfe {
  padding: 1.25rem 1.5rem;
  border: 2px dashed #2e7d32;
  border-radius: 10px;
  background: rgba(46, 125, 50, 0.08);
  max-width: 36rem;

  &__nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.25rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(46, 125, 50, 0.28);
  }

  &__link {
    font-size: 0.9rem;
    color: #2e7d32;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    &.router-link-active {
      font-weight: 700;
      text-decoration: underline;
    }
  }
}
</style>
