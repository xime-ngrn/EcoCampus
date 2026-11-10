<script setup>
/**
 * Pantalla temporal para las rutas que aún no tienen vista.
 * Cuando hagas la tuya, cambia el `component` de la ruta en src/router/routes.js.
 */
import { useRoute } from 'vue-router'
import { Construction } from '@lucide/vue'

import PageHeader from '@/components/ui/PageHeader.vue'

const route = useRoute()
</script>

<template>
  <div class="page" :class="{ 'page-publica': route.meta.public }">
    <PageHeader :titulo="route.meta.title ?? 'En construcción'" />

    <section class="card card-body vacio">
      <Construction :size="32" aria-hidden="true" />
      <div>
        <h2>Esta pantalla todavía está en construcción</h2>
        <p class="text-muted">
          Para empezarla, crea tu vista en <code>src/views/</code> y cámbiala en
          <code>src/router/routes.js</code>. Guíate con <code>LoginView.vue</code> y
          <code>ConsultarRegistrosView.vue</code>.
        </p>
      </div>
      <RouterLink v-if="route.meta.public" :to="{ name: 'login' }" class="btn btn-secondary">
        Volver a iniciar sesión
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.page-publica {
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-10) var(--space-4);
}

.vacio {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
  color: var(--color-primary);
}

.vacio h2 {
  margin-bottom: var(--space-1);
  font-size: var(--text-md);
}
</style>
