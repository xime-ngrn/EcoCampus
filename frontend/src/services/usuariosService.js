import { api, USE_MOCKS, respuestaMock } from './api'
import { USUARIOS_MOCK } from '@/mocks/usuarios'

/**
 * Lista usuarios, opcionalmente filtrados por rol.
 *
 *   GET /api/usuarios?rol=capturista
 *   200 → [{ "id", "nombre", "correo", "rol", "area" }]
 */
export async function listarUsuarios({ rol } = {}) {
  if (USE_MOCKS) {
    return respuestaMock(USUARIOS_MOCK.filter((u) => !rol || u.rol === rol))
  }
  return api.get('/usuarios', { params: { rol } })
}
