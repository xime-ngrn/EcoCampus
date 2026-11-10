/**
 * Tipos de registro de consumo. La clave (`electricidad`, `agua`...) es la que
 * viaja al backend; `etiqueta`, `unidad` y `decimales` son solo para mostrar.
 */
export const TIPOS_REGISTRO = Object.freeze({
  agua: { etiqueta: 'Agua', unidad: 'm³', decimales: 0 },
  electricidad: { etiqueta: 'Electricidad', unidad: 'kWh', decimales: 0 },
  papel: { etiqueta: 'Papel', unidad: 'kg', decimales: 1 },
  residuos: { etiqueta: 'Residuos', unidad: 'kg', decimales: 0 },
})

/** Resultado de la validación de rangos de un registro. */
export const VALIDACIONES = Object.freeze({
  valido: { etiqueta: 'Válido', clase: 'text-success' },
  fuera_de_rango_justificado: {
    etiqueta: 'Fuera de rango · justificado',
    clase: 'badge badge-warning',
  },
  fuera_de_rango: { etiqueta: 'Fuera de rango', clase: 'badge badge-danger' },
})

export const PERIODICIDADES = Object.freeze({
  mensual: 'Mensual',
  bimestral: 'Bimestral',
  anual: 'Anual',
})
