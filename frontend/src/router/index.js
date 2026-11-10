import { createRouter, createWebHistory } from 'vue-router'

import AppLayout from '@/layouts/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { appRoutes } from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ---- Públicas (sin sesión) ----
    {
      // ✅ EJEMPLO 1: pantalla terminada
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { title: 'Iniciar sesión', public: true },
    },
    {
      path: '/recuperar',
      name: 'recuperar',
      component: () => import('@/views/EnConstruccionView.vue'),
      meta: { title: 'Recuperar acceso', public: true },
    },

    // ---- Privadas: todas comparten el layout con menú lateral ----
    {
      path: '/',
      component: AppLayout,
      redirect: { name: 'panel' },
      children: appRoutes,
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'no-encontrada',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Página no encontrada', public: true },
    },
  ],
})

// Protege las rutas: sin sesión → login; sin permiso para el rol → panel
router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.public) {
    if (to.name === 'login' && auth.isAuthenticated) return { name: 'panel' }
    return true
  }

  if (!auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.rol)) {
    return { name: 'panel' }
  }

  return true
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · EcoCampus` : 'EcoCampus'
})

export default router
