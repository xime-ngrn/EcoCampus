/** Roles del sistema. Usa estas constantes en lugar de escribir el texto a mano. */
export const ROLES = Object.freeze({
  ADMIN: 'administrador',
  CAPTURISTA: 'capturista',
  DIRECTIVO: 'directivo',
})

export const ROL_ETIQUETAS = Object.freeze({
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.CAPTURISTA]: 'Capturista',
  [ROLES.DIRECTIVO]: 'Directivo',
})

export const TODOS_LOS_ROLES = Object.values(ROLES)
