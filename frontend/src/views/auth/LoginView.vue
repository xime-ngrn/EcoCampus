<script setup>
/**
 * ✅ EJEMPLO 1 · Iniciar sesión  (Ilustración 60 del diseño)
 *
 * Qué puedes copiar de aquí para tu pantalla:
 *  1. Formulario con v-model + validación antes de enviar
 *  2. Mensajes de error por campo, accesibles (aria-invalid / aria-describedby)
 *  3. Estado "cargando" que deshabilita el botón mientras se espera al servidor
 *  4. La vista habla con el STORE (Pinia) / los SERVICIOS, nunca con fetch directo
 *  5. Al terminar, navega con el router
 *  6. Estilos: clases globales (.btn, .input, .field...) + <style scoped> solo para el layout propio
 */
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check, CircleExclamationPoint, Eye, EyeOff } from '@lucide/vue'

import AppLogo from '@/components/ui/AppLogo.vue'
import { ROL_ETIQUETAS } from '@/constants/roles'
import { MOCK_PASSWORD, USUARIOS_MOCK } from '@/mocks/usuarios'
import { USE_MOCKS } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

// Datos fijos de la pantalla (fuera de la lógica, en MAYÚSCULAS)
const BENEFICIOS = [
  'Registra el consumo de agua, electricidad, papel y la generación de residuos.',
  'Calcula la huella de carbono por periodo y por fuente de emisión.',
  'Da seguimiento a las metas de reducción con un semáforo.',
]
const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CUENTAS_DEMO = USUARIOS_MOCK.slice(0, 3) // una por rol

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

// ---------- 1. Estado ----------
const form = reactive({ correo: '', password: '' })
const errores = reactive({ correo: '', password: '' })
const mostrarPassword = ref(false)
const cargando = ref(false)
const errorServidor = ref('')

// ---------- 2. Validación ----------
function validar() {
  const correo = form.correo.trim()

  if (!correo) errores.correo = 'Escribe tu correo institucional.'
  else if (!FORMATO_CORREO.test(correo)) errores.correo = 'Revisa el formato del correo.'
  else errores.correo = ''

  errores.password = form.password ? '' : 'Escribe tu contraseña.'

  return !errores.correo && !errores.password
}

// ---------- 3. Envío ----------
async function iniciarSesion() {
  errorServidor.value = ''
  if (!validar()) return

  cargando.value = true
  try {
    await auth.login(form.correo.trim().toLowerCase(), form.password)
    // Si venía de una ruta protegida (?redirect=/registros), lo regresamos ahí
    router.replace(destinoSeguro(route.query.redirect))
  } catch (error) {
    errorServidor.value = error.message
  } finally {
    cargando.value = false
  }
}

// Solo acepta rutas internas ("/registros"), nunca otro sitio ("//sitio-falso.com")
function destinoSeguro(redirect) {
  const esInterna =
    typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
  return esInterna ? redirect : { name: 'panel' }
}

// Solo modo demo: llena el formulario con una cuenta de prueba
function usarCuenta(usuario) {
  form.correo = usuario.correo
  form.password = MOCK_PASSWORD
  errores.correo = errores.password = ''
}
</script>

<template>
  <div class="login">
    <!-- Panel izquierdo: presentación -->
    <section class="login-hero">
      <AppLogo :size="44" />

      <div class="hero-content">
        <p class="hero-title">Mide, controla y reduce el impacto ambiental de tu escuela.</p>
        <ul role="list" class="hero-list">
          <li v-for="beneficio in BENEFICIOS" :key="beneficio">
            <Check :size="18" aria-hidden="true" />
            {{ beneficio }}
          </li>
        </ul>
      </div>

      <p class="hero-footer">ESCOM · IPN</p>
    </section>

    <!-- Panel derecho: formulario -->
    <main class="login-main">
      <form class="login-form" novalidate @submit.prevent="iniciarSesion">
        <header>
          <h1>Iniciar sesión</h1>
          <p class="text-muted">
            Ingresa con tu cuenta institucional. Verás las funciones que corresponden a tu rol.
          </p>
        </header>

        <div v-if="errorServidor" class="alert alert-danger" role="alert">
          <CircleExclamationPoint :size="18" aria-hidden="true" />
          {{ errorServidor }}
        </div>

        <div class="field">
          <label class="label" for="correo">Correo institucional</label>
          <input
            id="correo"
            v-model="form.correo"
            class="input"
            type="email"
            autocomplete="username"
            placeholder="nombre@escuela.edu.mx"
            :aria-invalid="Boolean(errores.correo)"
            :aria-describedby="errores.correo ? 'correo-error' : undefined"
            @input="errores.correo = ''"
          />
          <p v-if="errores.correo" id="correo-error" class="field-error">{{ errores.correo }}</p>
        </div>

        <div class="field">
          <div class="label-row">
            <label class="label" for="password">Contraseña</label>
            <RouterLink :to="{ name: 'recuperar' }" class="link-sm">
              ¿Olvidaste tu contraseña?
            </RouterLink>
          </div>
          <div class="input-group">
            <input
              id="password"
              v-model="form.password"
              class="input"
              :type="mostrarPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              :aria-invalid="Boolean(errores.password)"
              :aria-describedby="errores.password ? 'password-error' : undefined"
              @input="errores.password = ''"
            />
            <button
              type="button"
              class="btn-icon"
              :aria-label="mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              :aria-pressed="mostrarPassword"
              @click="mostrarPassword = !mostrarPassword"
            >
              <component :is="mostrarPassword ? EyeOff : Eye" :size="18" />
            </button>
          </div>
          <p v-if="errores.password" id="password-error" class="field-error">
            {{ errores.password }}
          </p>
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="cargando">
          {{ cargando ? 'Entrando…' : 'Iniciar sesión' }}
        </button>

        <!-- Ayuda solo para desarrollo (VITE_USE_MOCKS=true). No aparece con el backend real. -->
        <aside v-if="USE_MOCKS" class="demo">
          <p>
            <strong>Modo demo.</strong> Elige una cuenta (contraseña <code>{{ MOCK_PASSWORD }}</code
            >):
          </p>
          <ul role="list">
            <li v-for="cuenta in CUENTAS_DEMO" :key="cuenta.id">
              <button type="button" class="demo-cuenta" @click="usarCuenta(cuenta)">
                {{ cuenta.correo }}
              </button>
              · {{ ROL_ETIQUETAS[cuenta.rol] }}
            </li>
          </ul>
        </aside>
      </form>
    </main>
  </div>
</template>

<style scoped>
.login {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  min-height: 100vh;
  background: var(--color-surface);
}

/* ---- Panel izquierdo ---- */
.login-hero {
  display: flex;
  flex-direction: column;
  padding: var(--space-10) 56px;
  background: var(--color-primary-softer);
}

.hero-content {
  max-width: 470px;
  margin: auto 0;
}

.hero-title {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-primary-dark);
}

.hero-list {
  display: grid;
  gap: var(--space-3);
  margin-top: var(--space-6);
  color: var(--color-text-muted);
}

.hero-list li {
  display: flex;
  gap: var(--space-3);
}

.hero-list svg {
  margin-top: 2px;
  color: var(--color-primary);
}

.hero-footer {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

/* ---- Panel derecho ---- */
.login-main {
  display: grid;
  place-items: center;
  padding: var(--space-10) var(--space-6);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  width: 100%;
  max-width: 380px;
}

.login-form h1 {
  margin-bottom: var(--space-2);
  font-size: var(--text-xl);
}

.label-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2);
}

.link-sm {
  font-size: var(--text-xs);
}

.demo {
  padding: var(--space-3) var(--space-4);
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.demo ul {
  display: grid;
  gap: var(--space-1);
  margin-top: var(--space-2);
}

.demo-cuenta {
  padding: 0;
  border: none;
  background: none;
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: underline;
}

/* ---- Pantallas chicas: el panel verde se vuelve encabezado ---- */
@media (max-width: 860px) {
  .login {
    grid-template-columns: minmax(0, 1fr);
  }

  .login-hero {
    padding: var(--space-6) var(--space-4);
  }

  .hero-content {
    margin-top: var(--space-5);
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .hero-list,
  .hero-footer {
    display: none;
  }

  .login-main {
    padding: var(--space-8) var(--space-4);
  }
}
</style>
