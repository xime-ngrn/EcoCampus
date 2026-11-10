/**
 * Store de sesión (Pinia). Úsalo en cualquier componente:
 *
 *   import { useAuthStore } from '@/stores/auth'
 *   const auth = useAuthStore()
 *   auth.usuario?.nombre   auth.rol   auth.isAuthenticated   auth.logout()
 */
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import * as authService from '@/services/authService'
import { borrarSesion, guardarSesion, leerSesion } from '@/utils/session'

export const useAuthStore = defineStore('auth', () => {
  const sesionGuardada = leerSesion()
  const token = ref(sesionGuardada?.token ?? null)
  const usuario = ref(sesionGuardada?.usuario ?? null)

  const isAuthenticated = computed(() => Boolean(token.value))
  const rol = computed(() => usuario.value?.rol ?? null)

  async function login(correo, password) {
    const datos = await authService.login(correo, password)
    token.value = datos.token
    usuario.value = datos.usuario
    guardarSesion(datos)
  }

  function logout() {
    token.value = null
    usuario.value = null
    borrarSesion()
  }

  return { token, usuario, isAuthenticated, rol, login, logout }
})
