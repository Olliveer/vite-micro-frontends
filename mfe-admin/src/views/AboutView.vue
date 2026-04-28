<template>
  <div>
    <p class="mfe__title">Sobre o Admin</p>
    <p class="mfe__hint">Rota de exemplo: <code>/admin/about</code></p>

    {{ route.params.id }}
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<style scoped lang="scss">
.mfe__title {
  margin: 0 0 0.5rem;
  font-weight: 700;
  font-size: 1.35rem;
  color: #1b5e20;
}

.mfe__hint {
  margin: 0;
  font-size: 0.9rem;
  color: #37474f;
}

code {
  font-size: 0.85em;
}
</style>
