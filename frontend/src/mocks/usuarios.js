/**
 * Usuarios de prueba (solo con VITE_USE_MOCKS=true).
 * Todos entran con la contraseña MOCK_PASSWORD.
 */
import { ROLES } from '@/constants/roles'

export const MOCK_PASSWORD = 'EcoCampus1'

export const USUARIOS_MOCK = [
  {
    id: 1,
    nombre: 'Ana Torres Ríos',
    correo: 'a.torres@escuela.edu.mx',
    rol: ROLES.ADMIN,
    area: 'Sistemas',
  },
  {
    id: 2,
    nombre: 'Luis Ramírez Ortega',
    correo: 'l.ramirez@escuela.edu.mx',
    rol: ROLES.CAPTURISTA,
    area: 'Mantenimiento',
  },
  {
    id: 3,
    nombre: 'Dra. Patricia Vega',
    correo: 'p.vega@escuela.edu.mx',
    rol: ROLES.DIRECTIVO,
    area: 'Dirección',
  },
  {
    id: 4,
    nombre: 'Mariana Cruz',
    correo: 'm.cruz@escuela.edu.mx',
    rol: ROLES.CAPTURISTA,
    area: 'Servicios generales',
  },
  {
    id: 5,
    nombre: 'Jorge Salinas',
    correo: 'j.salinas@escuela.edu.mx',
    rol: ROLES.CAPTURISTA,
    area: 'Biblioteca',
  },
]
