/** Registros de consumo de prueba (los mismos de la pantalla "Consultar registros" del diseño). */
// En mocks, evidenciaUrl apunta a un archivo cualquiera de /public; el backend dará la URL real.
// prettier-ignore
export const REGISTROS_MOCK = [
  { id: 412, folio: 'R-0412', tipo: 'electricidad', periodo: '2026-10', periodoAbierto: true, area: 'CFE · Campus', cantidad: 41200, kgCO2e: 18293, validacion: 'fuera_de_rango_justificado', capturistaId: 2, capturista: 'L. Ramírez', evidenciaUrl: '/favicon.svg' },
  { id: 411, folio: 'R-0411', tipo: 'agua', periodo: '2026-10', periodoAbierto: true, area: 'M-01 · Edificio principal', cantidad: 366, kgCO2e: 126, validacion: 'valido', capturistaId: 4, capturista: 'M. Cruz', evidenciaUrl: '/favicon.svg' },
  { id: 410, folio: 'R-0410', tipo: 'residuos', periodo: '2026-10', periodoAbierto: true, area: 'Patio norte', cantidad: 412, kgCO2e: 60, validacion: 'valido', capturistaId: 5, capturista: 'J. Salinas', evidenciaUrl: null },
  { id: 398, folio: 'R-0398', tipo: 'papel', periodo: '2026-09', periodoAbierto: false, area: 'Control escolar', cantidad: 52, kgCO2e: 48, validacion: 'valido', capturistaId: 2, capturista: 'L. Ramírez', evidenciaUrl: '/favicon.svg' },
  { id: 397, folio: 'R-0397', tipo: 'electricidad', periodo: '2026-09', periodoAbierto: false, area: 'CFE · Campus', cantidad: 33860, kgCO2e: 15034, validacion: 'valido', capturistaId: 2, capturista: 'L. Ramírez', evidenciaUrl: '/favicon.svg' },
  { id: 396, folio: 'R-0396', tipo: 'agua', periodo: '2026-09', periodoAbierto: false, area: 'M-01 · Edificio principal', cantidad: 402, kgCO2e: 138, validacion: 'valido', capturistaId: 4, capturista: 'M. Cruz', evidenciaUrl: '/favicon.svg' },
  { id: 395, folio: 'R-0395', tipo: 'residuos', periodo: '2026-09', periodoAbierto: false, area: 'Patio norte', cantidad: 455, kgCO2e: 71, validacion: 'valido', capturistaId: 5, capturista: 'J. Salinas', evidenciaUrl: '/favicon.svg' },
  { id: 380, folio: 'R-0380', tipo: 'papel', periodo: '2026-08', periodoAbierto: false, area: 'Biblioteca', cantidad: 18.1, kgCO2e: 17, validacion: 'valido', capturistaId: 5, capturista: 'J. Salinas', evidenciaUrl: '/favicon.svg' },
  { id: 379, folio: 'R-0379', tipo: 'electricidad', periodo: '2026-08', periodoAbierto: false, area: 'CFE · Campus', cantidad: 21450, kgCO2e: 9524, validacion: 'valido', capturistaId: 2, capturista: 'L. Ramírez', evidenciaUrl: '/favicon.svg' },
]
