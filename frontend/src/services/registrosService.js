import { api, ApiError, USE_MOCKS, respuestaMock } from './api'
import { REGISTROS_MOCK } from '@/mocks/registros'

// Copia local para que "eliminar" en modo mocks persista mientras no recargues la página
let registrosMock = structuredClone(REGISTROS_MOCK)

/**
 * Lista registros de consumo con filtros.
 *
 *   GET /api/registros?tipo=agua&periodicidad=mensual&desde=2026-08&hasta=2026-10&capturistaId=2
 *   (todos los parámetros son opcionales; los meses van como "AAAA-MM")
 *   200 → [{ "id", "folio", "tipo", "periodo", "periodoAbierto", "area", "cantidad",
 *            "kgCO2e", "validacion", "capturistaId", "capturista", "evidenciaUrl" }]
 */
export async function listarRegistros(filtros = {}) {
  if (USE_MOCKS) {
    // Nota: en mocks se ignora `periodicidad` (el backend se encargará de agrupar)
    const { tipo, desde, hasta, capturistaId } = filtros
    const resultado = registrosMock.filter(
      (r) =>
        (!tipo || r.tipo === tipo) &&
        (!desde || r.periodo >= desde) && // "AAAA-MM" se puede comparar como texto
        (!hasta || r.periodo <= hasta) &&
        (!capturistaId || r.capturistaId === Number(capturistaId)),
    )
    return respuestaMock(resultado)
  }

  return api.get('/registros', { params: filtros })
}

/**
 * Elimina un registro (solo si su periodo sigue abierto).
 *
 *   DELETE /api/registros/:id
 *   204 → sin contenido
 *   409 → { "mensaje": "El periodo ya está cerrado." }
 */
export async function eliminarRegistro(id) {
  if (USE_MOCKS) {
    const registro = registrosMock.find((r) => r.id === id)
    if (!registro?.periodoAbierto) {
      return respuestaMock(null, { error: new ApiError('El periodo ya está cerrado.', 409) })
    }
    registrosMock = registrosMock.filter((r) => r.id !== id)
    return respuestaMock(null)
  }

  return api.delete(`/registros/${id}`)
}
