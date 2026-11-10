/** Funciones para mostrar datos con formato de México (es-MX). */

const LOCALE = 'es-MX'

/** 41200 → "41,200"   |   formatearNumero(52, 1) → "52.0" */
export function formatearNumero(valor, decimales = 0) {
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valor)
}

/** "2026-10" → "Oct 2026" */
export function formatearMesCorto(anioMes) {
  const texto = new Intl.DateTimeFormat(LOCALE, { month: 'short', year: 'numeric' })
    .format(aFecha(anioMes))
    .replace('.', '')
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

/** "2026-10" → "octubre de 2026" */
export function formatearMesLargo(anioMes) {
  return new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' }).format(aFecha(anioMes))
}

/** Mes relativo a hoy en formato "AAAA-MM" (el que usa <input type="month">). mesRelativo(-1) → mes pasado */
export function mesRelativo(desplazamiento = 0) {
  const hoy = new Date()
  const fecha = new Date(hoy.getFullYear(), hoy.getMonth() + desplazamiento, 1)
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
}

/** "Dra. Patricia Vega" → "PV" (ignora títulos como Dra., Ing., Lic.) */
export function obtenerIniciales(nombre = '') {
  return nombre
    .split(/\s+/)
    .filter((palabra) => palabra && !palabra.endsWith('.'))
    .slice(0, 2)
    .map((palabra) => palabra[0].toUpperCase())
    .join('')
}

// "2026-10" → Date del día 1 de ese mes (en hora local, para no brincar de mes por zona horaria)
function aFecha(anioMes) {
  const [anio, mes] = anioMes.split('-').map(Number)
  return new Date(anio, mes - 1, 1)
}
