<template>
  <div class="mfe mfe--admin">
    <p class="mfe__title">Admin</p>
    <p class="mfe__hint">MFE single-spa (espelho admin-frontend)</p>
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

  &__title {
    margin: 0 0 0.5rem;
    font-weight: 700;
    font-size: 1.35rem;
    color: #1b5e20;
  }

  &__hint {
    margin: 0;
    font-size: 0.9rem;
    color: #37474f;
  }
}
</style>
