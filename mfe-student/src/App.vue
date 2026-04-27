<template>
  <div class="mfe mfe--student">
    <p class="mfe__title">Student</p>
    <p class="mfe__hint">MFE single-spa (espelho student-frontend)</p>
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

  &__title {
    margin: 0 0 0.5rem;
    font-weight: 700;
    font-size: 1.35rem;
    color: #4a148c;
  }

  &__hint {
    margin: 0;
    font-size: 0.9rem;
    color: #37474f;
  }
}
</style>
