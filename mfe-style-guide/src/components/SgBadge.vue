<template>
  <span class="sg-badge" :data-variant="variant">
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Tom visual do token (design system). */
    variant?: "neutral" | "accent" | "success";
  }>(),
  { variant: "neutral" },
);
</script>

<style scoped lang="scss">
.sg-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.2em 0.55em;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.2;
  border-radius: 999px;
  letter-spacing: 0.02em;

  &[data-variant="neutral"] {
    color: #37474f;
    background: rgba(55, 71, 79, 0.12);
    border: 1px solid rgba(55, 71, 79, 0.2);
  }

  &[data-variant="accent"] {
    color: #6a1b9a;
    background: rgba(106, 27, 154, 0.12);
    border: 1px solid rgba(106, 27, 154, 0.25);
  }

  &[data-variant="success"] {
    color: #2e7d32;
    background: rgba(46, 125, 50, 0.12);
    border: 1px solid rgba(46, 125, 50, 0.28);
  }
}
</style>
