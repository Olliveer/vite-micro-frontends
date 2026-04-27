<template>
  <div class="mfe mfe--style">
    <nav class="mfe__nav">
      <RouterLink class="mfe__link" to="/">Início</RouterLink>
      <RouterLink class="mfe__link" to="/about">Sobre</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.mfe {
  padding: 1.25rem 1.5rem;
  border: 2px dashed #ef6c00;
  border-radius: 10px;
  background: rgba(239, 108, 0, 0.1);
  max-width: 36rem;

  &__nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.25rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(239, 108, 0, 0.35);
  }

  &__link {
    font-size: 0.9rem;
    color: #e65100;
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
