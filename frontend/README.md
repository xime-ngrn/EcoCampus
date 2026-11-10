# EcoCampus · Frontend

Guía rápida para que todo el equipo construya pantallas de la misma forma.
Las instrucciones de instalación están en el [README principal](../README.md).

## 🧭 Los 2 ejemplos (empieza por aquí)

| Ejemplo | Archivo | Úsalo como base para… |
| ------- | ------- | --------------------- |
| **1. Iniciar sesión** | [`src/views/auth/LoginView.vue`](src/views/auth/LoginView.vue) | Formularios: v-model, validación, errores por campo, estado "cargando", enviar y navegar. |
| **2. Consultar registros** | [`src/views/registros/ConsultarRegistrosView.vue`](src/views/registros/ConsultarRegistrosView.vue) | Pantallas internas con tabla: filtros, carga de datos, estados (cargando / error / vacío), paginación, confirmar antes de eliminar. |

Ambos archivos explican al inicio qué patrones muestran. Pruébalos con `npm run dev`:
entra con `a.torres@escuela.edu.mx` (Administrador) y ve a **Consultar registros**.

## 📁 Estructura

```
src/
├── assets/styles/
│   ├── tokens.css        ← colores, tipografía y espacios del diseño (variables CSS)
│   ├── base.css          ← reset y estilos de etiquetas HTML
│   └── components.css    ← clases reutilizables: .btn, .card, .input, .table, .badge...
├── components/
│   ├── layout/           ← piezas del layout (menú lateral)
│   └── ui/               ← componentes reutilizables (PageHeader, ConfirmDialog, AppLogo)
├── constants/            ← roles, tipos de registro, etc. (nada de textos "mágicos")
├── layouts/AppLayout.vue ← menú lateral + contenido de las pantallas internas
├── mocks/                ← datos falsos para trabajar sin backend
├── router/
│   ├── index.js          ← rutas públicas + protección por sesión y rol
│   └── routes.js         ← pantallas internas (también arma el menú lateral)
├── services/             ← ÚNICO lugar que habla con el backend (api.js + un archivo por recurso)
├── stores/               ← estado global con Pinia (sesión del usuario)
├── utils/                ← funciones de ayuda (formato de números y fechas)
└── views/                ← una carpeta por módulo, un archivo *View.vue por pantalla
```

## ➕ Cómo agregar una pantalla nueva

Ejemplo: **Usuarios y roles**.

1. **Crea la vista** `src/views/usuarios/UsuariosView.vue`. Copia la estructura de
   `ConsultarRegistrosView.vue`:
   ```vue
   <template>
     <div class="page">
       <PageHeader titulo="Usuarios y roles" subtitulo="Registra, consulta, modifica..." />
       <section class="card card-body">…</section>
     </div>
   </template>
   ```
2. **Conéctala a la ruta** en `src/router/routes.js` (ya existe, solo cambia `component`):
   ```js
   component: () => import('@/views/usuarios/UsuariosView.vue'),
   ```
   El menú lateral y los permisos por rol salen de ahí mismo (`meta.roles`).
3. **Datos**: crea o amplía un servicio en `src/services/` (p. ej. `usuariosService.js`).
   Documenta arriba de cada función el endpoint y la forma de la respuesta, y agrega datos
   de prueba en `src/mocks/` para la rama `if (USE_MOCKS)`.
4. Corre `npm run lint` y `npm run format` antes de subir.

## ✅ Reglas

- **`<script setup>`** en todos los componentes (Composition API).
- **Las vistas no usan `fetch`**: llaman a funciones de `src/services/` (o al store).
- **Nada de colores ni tamaños "a mano"**: usa las variables de `tokens.css`
  (`var(--color-primary)`, `var(--space-4)`…) y las clases de `components.css`.
  Tu `<style scoped>` es solo para el acomodo propio de tu pantalla.
- **Importa con `@/`** (`@/services/api`) en lugar de rutas relativas largas.
- **Íconos** de [Lucide](https://lucide.dev/icons): `import { Pencil } from '@lucide/vue'`.
- **Accesibilidad**: cada input con su `<label for>`, botones de solo ícono con `aria-label`.
- **Nombres**: componentes en `PascalCase.vue`, vistas terminan en `View.vue`; variables y
  funciones en español y `camelCase` (`cargarRegistros`, `filtrosActivos`).

## 🎨 Clases disponibles (components.css)

| Clase | Uso |
| ----- | --- |
| `.page` | Contenedor raíz de cada pantalla interna |
| `.card` `.card-body` | Tarjeta blanca con borde |
| `.btn` + `.btn-primary` / `.btn-secondary` / `.btn-danger` | Botones (`.btn-sm`, `.btn-block`) |
| `.btn-icon` (`.is-danger`) | Botón solo ícono (acciones de tabla) |
| `.field` `.label` `.input` `.select` `.field-error` | Formularios |
| `.input-group` | Input con botón adentro (ver contraseña) |
| `.badge` + `.badge-success` / `-warning` / `-danger` / `-info` / `-neutral` | Estados |
| `.chips` `.chip` (`aria-pressed="true"` = activo) | Filtros tipo píldora |
| `.table-wrapper` `.table` (`.num` = columna numérica) | Tablas |
| `.alert` + `.alert-info` / `-warning` / `-danger` / `-success` | Avisos |
| `.text-muted` `.text-success` `.sr-only` | Utilidades de texto |

## 🔌 Modo demo vs. backend real

`.env.development` trae `VITE_USE_MOCKS=true`: los servicios responden con datos de
`src/mocks/`. Cuando el endpoint exista en Flask, crea `.env.development.local` (no se sube) con:

```
VITE_USE_MOCKS=false
```

Vite redirige todo lo que empiece con `/api` a `http://127.0.0.1:5000` (ver `vite.config.js`).

| Cuenta demo | Rol |
| ----------- | --- |
| `a.torres@escuela.edu.mx` | Administrador |
| `l.ramirez@escuela.edu.mx` | Capturista |
| `p.vega@escuela.edu.mx` | Directivo |

Contraseña de todas: `EcoCampus1`.
