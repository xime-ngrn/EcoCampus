/**
 * Guarda la sesión (token + usuario) en localStorage para que sobreviva a un F5.
 * Solo la usan el store de auth y el cliente de la API; en las vistas usa `useAuthStore()`.
 */
const CLAVE = 'ecocampus.sesion'

export function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) ?? null
  } catch {
    return null
  }
}

export function guardarSesion(sesion) {
  localStorage.setItem(CLAVE, JSON.stringify(sesion))
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE)
}
