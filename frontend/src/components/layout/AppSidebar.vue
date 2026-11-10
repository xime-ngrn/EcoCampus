<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LogOut, Menu, X } from '@lucide/vue'

import AppLogo from '@/components/ui/AppLogo.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { ROL_ETIQUETAS } from '@/constants/roles'
import { appRoutes } from '@/router/routes'
import { useAuthStore } from '@/stores/auth'
import { obtenerIniciales } from '@/utils/format'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

// Solo las opciones que le tocan al rol del usuario (definidas en router/routes.js)
const opciones = computed(() => appRoutes.filter((r) => r.meta.roles.includes(auth.rol)))

const menuAbierto = ref(false) // solo se usa en pantallas chicas
const confirmarSalida = ref(false)

// En móvil, cerrar el menú al navegar
watch(
  () => route.fullPath,
  () => (menuAbierto.value = false),
)

function cerrarSesion() {
  confirmarSalida.value = false
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-top">
      <RouterLink :to="{ name: 'panel' }" aria-label="EcoCampus, ir al panel general">
        <AppLogo />
      </RouterLink>
      <button
        type="button"
        class="btn-icon sidebar-toggle"
        aria-controls="menu-principal"
        :aria-expanded="menuAbierto"
        :aria-label="menuAbierto ? 'Cerrar menú' : 'Abrir menú'"
        @click="menuAbierto = !menuAbierto"
      >
        <component :is="menuAbierto ? X : Menu" :size="22" />
      </button>
    </div>

    <div id="menu-principal" class="sidebar-menu" :class="{ 'is-open': menuAbierto }">
      <div class="user-card">
        <span class="avatar" aria-hidden="true">{{ obtenerIniciales(auth.usuario?.nombre) }}</span>
        <div class="user-info">
          <p class="user-name">{{ auth.usuario?.nombre }}</p>
          <p class="user-role">{{ ROL_ETIQUETAS[auth.rol] }}</p>
        </div>
      </div>

      <nav aria-label="Menú principal">
        <ul role="list" class="nav-list">
          <li v-for="opcion in opciones" :key="opcion.name">
            <RouterLink :to="{ name: opcion.name }" class="nav-link" active-class="is-active">
              <component :is="opcion.meta.icon" :size="18" aria-hidden="true" />
              {{ opcion.meta.title }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <hr class="sidebar-divider" />

      <button type="button" class="nav-link logout" @click="confirmarSalida = true">
        <LogOut :size="18" aria-hidden="true" />
        Cerrar sesión
      </button>
    </div>

    <ConfirmDialog
      v-model:open="confirmarSalida"
      titulo="¿Cerrar sesión?"
      texto-confirmar="Cerrar sesión"
      peligro
      @confirmar="cerrarSesion"
    >
      <template #icono>
        <LogOut :size="20" />
      </template>
      Tendrás que volver a ingresar con tu correo institucional.
    </ConfirmDialog>
  </aside>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  height: 100vh;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4);
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
}

.sidebar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-2);
}

.sidebar-top a {
  text-decoration: none;
}

.sidebar-toggle {
  display: none;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.avatar {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  font-size: var(--text-xs);
  font-weight: 700;
}

.user-info {
  min-width: 0;
}

.user-name {
  overflow: hidden;
  font-size: var(--text-sm);
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.nav-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px var(--space-3);
  border: none;
  border-radius: var(--radius-md);
  background: none;
  color: var(--color-text);
  font-size: var(--text-sm);
  font-weight: 500;
  text-align: left;
  text-decoration: none;
}

.nav-link:hover {
  background: var(--color-bg);
}

.nav-link svg {
  color: var(--color-text-muted);
}

.nav-link.is-active {
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  font-weight: 600;
}

.nav-link.is-active svg {
  color: var(--color-primary);
}

.sidebar-divider {
  border: none;
  border-top: 1px solid var(--color-border);
}

.logout,
.logout svg {
  color: var(--color-danger);
}

@media (max-width: 900px) {
  .sidebar {
    position: static;
    gap: 0;
    height: auto;
    padding: var(--space-3) var(--space-4);
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }

  .sidebar-toggle {
    display: inline-grid;
  }

  .sidebar-menu {
    display: none;
    padding-top: var(--space-4);
  }

  .sidebar-menu.is-open {
    display: flex;
  }
}
</style>
