<script setup>
/**
 * ✅ EJEMPLO 2 · Consultar registros  (Ilustración 67 del diseño)
 *
 * Qué puedes copiar de aquí para tu pantalla:
 *  1. Pantalla interna: va dentro de AppLayout y empieza con <PageHeader>
 *  2. Filtros que, al cambiar, vuelven a pedir los datos al servicio (watch)
 *  3. Los 4 estados de una lista: cargando / error / vacía / con datos
 *  4. Formato de números y meses con utils/format.js
 *  5. Constantes compartidas (TIPOS_REGISTRO, VALIDACIONES) en vez de textos sueltos
 *  6. Confirmar antes de una acción destructiva con <ConfirmDialog>
 *  7. Reglas de negocio en la UI: solo se edita/elimina si el periodo está abierto
 */
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { CircleExclamationPoint, Paperclip, Pencil, Trash } from '@lucide/vue'

import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import PageHeader from '@/components/ui/PageHeader.vue'
import { PERIODICIDADES, TIPOS_REGISTRO, VALIDACIONES } from '@/constants/registros'
import { ROLES } from '@/constants/roles'
import { eliminarRegistro, listarRegistros } from '@/services/registrosService'
import { listarUsuarios } from '@/services/usuariosService'
import { formatearMesCorto, formatearMesLargo, formatearNumero, mesRelativo } from '@/utils/format'

const POR_PAGINA = 10

// ---------- 1. Filtros ----------
const filtros = reactive({
  tipo: '', // '' = Todos
  periodicidad: 'mensual',
  desde: mesRelativo(-3), // por defecto: los últimos 3 meses cerrados
  hasta: mesRelativo(-1),
  capturistaId: '', // '' = Todos
})

const rangoInvalido = computed(
  () => Boolean(filtros.desde && filtros.hasta) && filtros.desde > filtros.hasta,
)

// ---------- 2. Datos y estados ----------
const registros = ref([])
const capturistas = ref([])
const cargando = ref(false)
const error = ref('')
const aviso = ref(null) // { tipo: 'success' | 'danger' | 'info', texto }
const pagina = ref(1)

let ultimaPeticion = 0

async function cargarRegistros() {
  if (rangoInvalido.value) return

  // Si el usuario cambia filtros rápido, solo nos importa la ÚLTIMA respuesta
  const peticion = ++ultimaPeticion
  cargando.value = true
  error.value = ''

  try {
    const datos = await listarRegistros({ ...filtros })
    if (peticion !== ultimaPeticion) return
    registros.value = datos
    pagina.value = 1
  } catch (e) {
    if (peticion === ultimaPeticion) error.value = e.message
  } finally {
    if (peticion === ultimaPeticion) cargando.value = false
  }
}

onMounted(async () => {
  cargarRegistros()
  capturistas.value = await listarUsuarios({ rol: ROLES.CAPTURISTA }).catch(() => [])
})

// `filtros` es reactive → el watch detecta cambios en cualquiera de sus campos
watch(filtros, () => {
  aviso.value = null
  cargarRegistros()
})

// ---------- 3. Paginación (en el cliente) ----------
const totalPaginas = computed(() => Math.max(1, Math.ceil(registros.value.length / POR_PAGINA)))
const registrosPagina = computed(() =>
  registros.value.slice((pagina.value - 1) * POR_PAGINA, pagina.value * POR_PAGINA),
)
const resumen = computed(() => {
  const n = registros.value.length
  return `${n} ${n === 1 ? 'registro' : 'registros'} de ${formatearMesLargo(filtros.desde)} a ${formatearMesLargo(filtros.hasta)}`
})

// ---------- 4. Acciones ----------
const dialogoEliminar = ref(false)
const porEliminar = ref(null)
const eliminando = ref(false)

function pedirConfirmacion(registro) {
  porEliminar.value = registro
  dialogoEliminar.value = true
}

async function confirmarEliminacion() {
  const { id, folio } = porEliminar.value
  eliminando.value = true
  try {
    await eliminarRegistro(id)
    registros.value = registros.value.filter((r) => r.id !== id)
    pagina.value = Math.min(pagina.value, totalPaginas.value)
    aviso.value = { tipo: 'success', texto: `Se eliminó el registro ${folio}.` }
  } catch (e) {
    aviso.value = { tipo: 'danger', texto: e.message }
  } finally {
    eliminando.value = false
    dialogoEliminar.value = false
  }
}

// TODO(equipo): abrir el formulario de edición (puede reutilizar la vista de captura)
function editar(registro) {
  aviso.value = { tipo: 'info', texto: `La edición de ${registro.folio} aún no está implementada.` }
}

// Atajo para no repetir TIPOS_REGISTRO[registro.tipo] en la tabla
const tipoDe = (registro) => TIPOS_REGISTRO[registro.tipo]
</script>

<template>
  <div class="page">
    <PageHeader
      titulo="Consultar registros"
      subtitulo="Filtra por tipo y periodicidad. Puedes corregir o eliminar registros de periodos abiertos."
    />

    <!-- Filtros -->
    <section class="card card-body filtros" aria-label="Filtros">
      <div class="chips" role="group" aria-label="Tipo de registro">
        <button
          type="button"
          class="chip"
          :aria-pressed="filtros.tipo === ''"
          @click="filtros.tipo = ''"
        >
          Todos
        </button>
        <button
          v-for="(tipo, clave) in TIPOS_REGISTRO"
          :key="clave"
          type="button"
          class="chip"
          :aria-pressed="filtros.tipo === clave"
          @click="filtros.tipo = clave"
        >
          {{ tipo.etiqueta }}
        </button>
      </div>

      <div class="filtros-grid">
        <div class="field">
          <label class="label" for="f-periodicidad">Periodicidad</label>
          <select id="f-periodicidad" v-model="filtros.periodicidad" class="select">
            <option v-for="(etiqueta, valor) in PERIODICIDADES" :key="valor" :value="valor">
              {{ etiqueta }}
            </option>
          </select>
        </div>

        <div class="field">
          <label class="label" for="f-desde">Desde</label>
          <input id="f-desde" v-model="filtros.desde" class="input" type="month" />
        </div>

        <div class="field">
          <label class="label" for="f-hasta">Hasta</label>
          <input
            id="f-hasta"
            v-model="filtros.hasta"
            class="input"
            type="month"
            :aria-invalid="rangoInvalido"
            :aria-describedby="rangoInvalido ? 'f-hasta-error' : undefined"
          />
          <p v-if="rangoInvalido" id="f-hasta-error" class="field-error">
            Debe ser igual o posterior a «Desde».
          </p>
        </div>

        <div class="field">
          <label class="label" for="f-capturista">Capturista</label>
          <select id="f-capturista" v-model="filtros.capturistaId" class="select">
            <option value="">Todos</option>
            <option v-for="c in capturistas" :key="c.id" :value="c.id">{{ c.nombre }}</option>
          </select>
        </div>
      </div>
    </section>

    <div v-if="aviso" class="alert" :class="`alert-${aviso.tipo}`" role="status">
      {{ aviso.texto }}
    </div>

    <!-- Tabla con sus estados -->
    <section class="card" aria-label="Registros">
      <div v-if="error" class="estado">
        <div class="alert alert-danger" role="alert">
          <CircleExclamationPoint :size="18" aria-hidden="true" />
          {{ error }}
        </div>
        <button type="button" class="btn btn-secondary btn-sm" @click="cargarRegistros">
          Reintentar
        </button>
      </div>

      <p v-else-if="cargando && !registros.length" class="estado text-muted">Cargando registros…</p>

      <p v-else-if="!registros.length" class="estado text-muted">
        No hay registros con estos filtros.
      </p>

      <template v-else>
        <div class="table-wrapper" :class="{ 'is-loading': cargando }" :aria-busy="cargando">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Folio</th>
                <th scope="col">Tipo</th>
                <th scope="col">Periodo</th>
                <th scope="col">Área o medidor</th>
                <th scope="col" class="num">Cantidad</th>
                <th scope="col" class="num">kg CO₂e</th>
                <th scope="col">Validación</th>
                <th scope="col">Capturó</th>
                <th scope="col" class="num">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="registro in registrosPagina" :key="registro.id">
                <td class="text-muted">{{ registro.folio }}</td>
                <td class="tipo">{{ tipoDe(registro).etiqueta }}</td>
                <td>{{ formatearMesCorto(registro.periodo) }}</td>
                <td>{{ registro.area }}</td>
                <td class="num">
                  {{ formatearNumero(registro.cantidad, tipoDe(registro).decimales) }}
                  {{ tipoDe(registro).unidad }}
                </td>
                <td class="num">{{ formatearNumero(registro.kgCO2e) }}</td>
                <td>
                  <span :class="VALIDACIONES[registro.validacion].clase">
                    {{ VALIDACIONES[registro.validacion].etiqueta }}
                  </span>
                </td>
                <td>{{ registro.capturista }}</td>
                <td>
                  <div class="acciones">
                    <a
                      v-if="registro.evidenciaUrl"
                      class="btn-icon"
                      :href="registro.evidenciaUrl"
                      target="_blank"
                      rel="noopener"
                      title="Ver evidencia"
                      :aria-label="`Ver evidencia de ${registro.folio}`"
                    >
                      <Paperclip :size="16" />
                    </a>
                    <button
                      v-else
                      type="button"
                      class="btn-icon"
                      disabled
                      title="Sin evidencia"
                      :aria-label="`${registro.folio} no tiene evidencia`"
                    >
                      <Paperclip :size="16" />
                    </button>

                    <button
                      type="button"
                      class="btn-icon"
                      :disabled="!registro.periodoAbierto"
                      :title="registro.periodoAbierto ? 'Editar' : 'El periodo ya está cerrado'"
                      :aria-label="`Editar ${registro.folio}`"
                      @click="editar(registro)"
                    >
                      <Pencil :size="16" />
                    </button>

                    <button
                      type="button"
                      class="btn-icon is-danger"
                      :disabled="!registro.periodoAbierto"
                      :title="registro.periodoAbierto ? 'Eliminar' : 'El periodo ya está cerrado'"
                      :aria-label="`Eliminar ${registro.folio}`"
                      @click="pedirConfirmacion(registro)"
                    >
                      <Trash :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer class="tabla-footer">
          <p class="text-muted">{{ resumen }}</p>
          <div class="paginacion">
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              :disabled="pagina === 1"
              @click="pagina--"
            >
              Anterior
            </button>
            <button
              type="button"
              class="btn btn-secondary btn-sm"
              :disabled="pagina === totalPaginas"
              @click="pagina++"
            >
              Siguiente
            </button>
          </div>
        </footer>
      </template>
    </section>

    <ConfirmDialog
      v-model:open="dialogoEliminar"
      titulo="¿Eliminar registro?"
      texto-confirmar="Eliminar"
      peligro
      :cargando="eliminando"
      @confirmar="confirmarEliminacion"
    >
      <template #icono>
        <Trash :size="20" />
      </template>
      <template v-if="porEliminar">
        Se eliminará <strong>{{ porEliminar.folio }}</strong> ({{ tipoDe(porEliminar).etiqueta }},
        {{ formatearMesLargo(porEliminar.periodo) }}). Esta acción no se puede deshacer.
      </template>
    </ConfirmDialog>
  </div>
</template>

<style scoped>
.filtros {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.filtros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
}

.tipo {
  font-weight: 600;
}

.acciones {
  display: flex;
  justify-content: flex-end;
  gap: 2px;
}

.table-wrapper.is-loading {
  opacity: 0.6;
  transition: opacity 0.15s;
}

.tabla-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-xs);
}

.paginacion {
  display: flex;
  gap: var(--space-2);
}

.estado {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-8) var(--space-5);
}
</style>
