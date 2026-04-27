<template>
  <div class="mfe mfe--student">
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
  border: 2px dashed #6a1b9a;
  border-radius: 10px;
  background: rgba(106, 27, 154, 0.08);
  max-width: 36rem;

  &__nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.25rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(106, 27, 154, 0.28);
  }

  &__link {
    font-size: 0.9rem;
    color: #6a1b9a;
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
