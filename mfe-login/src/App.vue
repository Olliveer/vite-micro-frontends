<template>
  <div class="mfe mfe--login">
    <p class="mfe__title">Login</p>
    <p class="mfe__hint">MFE single-spa (espelho login-frontend)</p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.mfe {
  padding: 1.25rem 1.5rem;
  border: 2px dashed #1565c0;
  border-radius: 10px;
  background: rgba(21, 101, 192, 0.08);
  max-width: 36rem;

  &__title {
    margin: 0 0 0.5rem;
    font-weight: 700;
    font-size: 1.35rem;
    color: #0d47a1;
  }

  &__hint {
    margin: 0;
    font-size: 0.9rem;
    color: #37474f;
  }
}
</style>
