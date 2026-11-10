<script setup>
defineProps({
  size: { type: Number, default: 40 },
})
</script>

<template>
  <div class="logo">
    <svg :width="size" :height="size" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 4C18 16 10 28 10 40a22 22 0 0 0 44 0C54 28 46 16 32 4Z" fill="currentColor" />
      <path
        d="M32 18v42M32 30l-9-7M32 30l9-7M32 42l-12-9M32 42l12-9M32 53l-14-10M32 53l14-10"
        stroke="#fff"
        stroke-width="2.6"
        stroke-linecap="round"
        fill="none"
      />
    </svg>
    <span class="logo-text">ECO<br />CAMPUS</span>
  </div>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-primary);
}

.logo-text {
  padding-bottom: 3px;
  border-bottom: 2px solid currentColor;
  font-family: var(--font-heading);
  font-size: var(--text-sm);
  font-weight: 700;
  line-height: 1.05;
  color: var(--color-primary-dark);
}
</style>
