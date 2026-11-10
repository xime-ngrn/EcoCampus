<script setup>
import AppLogo from '@/components/ui/AppLogo.vue'
</script>

<template>
  <main class="no-encontrada">
    <AppLogo :size="44" />
    <h1>Página no encontrada</h1>
    <p class="text-muted">La dirección que buscas no existe o cambió de lugar.</p>
    <RouterLink to="/" class="btn btn-primary">Ir al inicio</RouterLink>
  </main>
</template>

<style scoped>
.no-encontrada {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  min-height: 100vh;
  padding: var(--space-6);
  text-align: center;
}

.no-encontrada h1 {
  margin-top: var(--space-4);
  font-size: var(--text-xl);
}
</style>
