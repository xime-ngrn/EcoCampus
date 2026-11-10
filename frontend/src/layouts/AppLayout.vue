<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'
</script>

<template>
  <div class="app-layout">
    <AppSidebar />
    <main class="app-main">
      <!-- Aquí se pinta la pantalla de la ruta hija (ver router/routes.js) -->
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  min-height: 100vh;
}

.app-main {
  min-width: 0;
  padding: var(--space-8) var(--space-10);
}

@media (max-width: 900px) {
  .app-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .app-main {
    padding: var(--space-5) var(--space-4);
  }
}
</style>
