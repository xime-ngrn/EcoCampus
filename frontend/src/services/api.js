/**
 * Cliente HTTP único para hablar con el backend Flask.
 * Los servicios (authService, registrosService...) lo usan; las vistas NO llaman a fetch directo.
 *
 *   api.get('/registros', { params: { tipo: 'agua' } })
 *   api.post('/auth/login', { correo, password })
 */
import { leerSesion } from '@/utils/session'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

/** true = los servicios devuelven datos de src/mocks en lugar de llamar al backend. */
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

/** Error con el código HTTP y el cuerpo que mandó el backend. */
export class ApiError extends Error {
  constructor(mensaje, status = 0, datos = null) {
    super(mensaje)
    this.name = 'ApiError'
    this.status = status
    this.datos = datos
  }
}

async function request(method, ruta, { params, body } = {}) {
  const url = new URL(BASE_URL + ruta, window.location.origin)
  Object.entries(params ?? {}).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== '') url.searchParams.set(clave, valor)
  })

  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = leerSesion()?.token
  if (token) headers.Authorization = `Bearer ${token}`

  let respuesta
  try {
    respuesta = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. Revisa que el backend esté corriendo.')
  }

  const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null)
  if (!respuesta.ok) {
    // Convención con el backend: los errores responden { "mensaje": "..." }
    throw new ApiError(datos?.mensaje ?? `Error ${respuesta.status}`, respuesta.status, datos)
  }
  return datos
}

export const api = {
  get: (ruta, opciones) => request('GET', ruta, opciones),
  post: (ruta, body) => request('POST', ruta, { body }),
  put: (ruta, body) => request('PUT', ruta, { body }),
  patch: (ruta, body) => request('PATCH', ruta, { body }),
  delete: (ruta) => request('DELETE', ruta),
}

/**
 * Simula una respuesta del backend con un pequeño retraso (solo para modo mocks).
 * Si pasas `error`, la promesa se rechaza con él.
 */
export function respuestaMock(datos, { error, retraso = 400 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => (error ? reject(error) : resolve(structuredClone(datos))), retraso)
  })
}
