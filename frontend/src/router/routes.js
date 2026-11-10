/**
 * Pantallas internas de la app (las que llevan menú lateral).
 *
 * El menú lateral se construye con ESTA lista, en este orden, mostrando solo
 * las rutas cuyo `meta.roles` incluye el rol del usuario.
 *
 * ¿Vas a hacer una pantalla?
 *   1. Crea tu vista en src/views/<modulo>/<Nombre>View.vue
 *   2. Cambia su `component` aquí abajo por:  () => import('@/views/<modulo>/<Nombre>View.vue')
 */
import {
  Calendar,
  ChartColumn,
  Cloud,
  Download,
  LayoutGrid,
  Lightbulb,
  List,
  SlidersVertical,
  Target,
  Trash,
  Users,
  Zap,
} from '@lucide/vue'

import { ROLES, TODOS_LOS_ROLES } from '@/constants/roles'

const { ADMIN, CAPTURISTA, DIRECTIVO } = ROLES

// Pantalla temporal para lo que todavía no existe
const EnConstruccion = () => import('@/views/EnConstruccionView.vue')

export const appRoutes = [
  {
    path: 'panel',
    name: 'panel',
    component: EnConstruccion,
    meta: { title: 'Panel general', icon: LayoutGrid, roles: TODOS_LOS_ROLES },
  },
  {
    path: 'registrar-consumo',
    name: 'registrar-consumo',
    component: EnConstruccion,
    meta: { title: 'Registrar consumo', icon: Zap, roles: [CAPTURISTA] },
  },
  {
    path: 'registrar-residuos',
    name: 'registrar-residuos',
    component: EnConstruccion,
    meta: { title: 'Registrar residuos', icon: Trash, roles: [CAPTURISTA] },
  },
  {
    path: 'mis-registros',
    name: 'mis-registros',
    component: EnConstruccion,
    meta: { title: 'Mis registros', icon: List, roles: [CAPTURISTA] },
  },
  {
    // ✅ EJEMPLO 2: pantalla terminada
    path: 'registros',
    name: 'registros',
    component: () => import('@/views/registros/ConsultarRegistrosView.vue'),
    meta: { title: 'Consultar registros', icon: List, roles: [ADMIN] },
  },
  {
    path: 'huella',
    name: 'huella',
    component: EnConstruccion,
    meta: { title: 'Huella de carbono', icon: Cloud, roles: [ADMIN, DIRECTIVO] },
  },
  {
    path: 'comparar',
    name: 'comparar',
    component: EnConstruccion,
    meta: { title: 'Comparar periodos', icon: ChartColumn, roles: [ADMIN, DIRECTIVO] },
  },
  {
    path: 'metas',
    name: 'metas',
    component: EnConstruccion,
    meta: { title: 'Metas de reducción', icon: Target, roles: [DIRECTIVO] },
  },
  {
    path: 'usuarios',
    name: 'usuarios',
    component: EnConstruccion,
    meta: { title: 'Usuarios y roles', icon: Users, roles: [ADMIN] },
  },
  {
    path: 'periodos',
    name: 'periodos',
    component: EnConstruccion,
    meta: { title: 'Periodos de registro', icon: Calendar, roles: [ADMIN] },
  },
  {
    path: 'factores',
    name: 'factores',
    component: EnConstruccion,
    meta: { title: 'Factores de emisión', icon: SlidersVertical, roles: [ADMIN] },
  },
  {
    path: 'reportes',
    name: 'reportes',
    component: EnConstruccion,
    meta: { title: 'Reportes y exportación', icon: Download, roles: [ADMIN, DIRECTIVO] },
  },
  {
    path: 'buenas-practicas',
    name: 'buenas-practicas',
    component: EnConstruccion,
    meta: { title: 'Buenas prácticas', icon: Lightbulb, roles: TODOS_LOS_ROLES },
  },
]
