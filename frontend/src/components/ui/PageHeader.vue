<script setup>
/**
 * Encabezado estándar de cada pantalla interna.
 *
 *   <PageHeader titulo="Usuarios y roles" subtitulo="Registra, consulta...">
 *     <template #acciones>
 *       <button class="btn btn-primary">+ Nuevo usuario</button>
 *     </template>
 *   </PageHeader>
 */
defineProps({
  titulo: { type: String, required: true },
  subtitulo: { type: String, default: '' },
})
</script>

<template>
  <header class="page-header">
    <div>
      <h1 class="page-title">{{ titulo }}</h1>
      <p v-if="subtitulo" class="page-subtitle">{{ subtitulo }}</p>
    </div>
    <div v-if="$slots.acciones" class="page-actions">
      <slot name="acciones" />
    </div>
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
}

.page-title {
  font-size: var(--text-xl);
}

.page-subtitle {
  margin-top: var(--space-1);
  color: var(--color-text-muted);
}

.page-actions {
  display: flex;
  gap: var(--space-2);
}
</style>
