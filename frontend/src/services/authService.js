import { api, ApiError, USE_MOCKS, respuestaMock } from './api'
import { MOCK_PASSWORD, USUARIOS_MOCK } from '@/mocks/usuarios'

/**
 * Inicia sesión.
 *
 * Contrato con el backend:
 *   POST /api/auth/login
 *   Body:          { "correo": "...", "password": "..." }
 *   200 →          { "token": "...", "usuario": { "id", "nombre", "correo", "rol", "area" } }
 *   401 →          { "mensaje": "Correo o contraseña incorrectos." }
 */
export async function login(correo, password) {
  if (USE_MOCKS) {
    const usuario = USUARIOS_MOCK.find((u) => u.correo === correo)
    if (!usuario || password !== MOCK_PASSWORD) {
      return respuestaMock(null, {
        error: new ApiError('Correo o contraseña incorrectos.', 401),
      })
    }
    return respuestaMock({ token: `mock-token-${usuario.id}`, usuario })
  }

  return api.post('/auth/login', { correo, password })
}
