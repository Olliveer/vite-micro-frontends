<template>
  <div class="mfe mfe--style">
    <p class="mfe__title">Style Guide</p>
    <p class="mfe__hint">MFE single-spa (espelho style-guide-frontend)</p>
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

  &__title {
    margin: 0 0 0.5rem;
    font-weight: 700;
    font-size: 1.35rem;
    color: #e65100;
  }

  &__hint {
    margin: 0;
    font-size: 0.9rem;
    color: #37474f;
  }
}
</style>
