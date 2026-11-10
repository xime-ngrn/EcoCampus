<script setup>
/**
 * Diálogo de confirmación reutilizable. Usa <dialog> nativo: bloquea el fondo,
 * atrapa el foco y se cierra con Esc.
 *
 * El diálogo NO se cierra solo al confirmar: ciérralo tú (abierto = false) cuando termine la acción.
 */
import { onMounted, ref, useId, watch } from 'vue'

const abierto = defineModel('open', { type: Boolean, default: false })

const props = defineProps({
  titulo: { type: String, required: true },
  textoConfirmar: { type: String, default: 'Confirmar' },
  peligro: { type: Boolean, default: false },
  cargando: { type: Boolean, default: false },
})

const emit = defineEmits(['confirmar'])

const dialogo = ref(null)
const idTitulo = useId()

function sincronizar(valor) {
  const el = dialogo.value
  if (!el) return
  if (valor && !el.open) el.showModal()
  if (!valor && el.open) el.close()
}

watch(abierto, sincronizar)
onMounted(() => sincronizar(abierto.value))

// Esc dispara "cancel": no dejamos cerrar mientras se procesa la acción
function alCancelar(evento) {
  if (props.cargando) evento.preventDefault()
}
</script>

<template>
  <dialog
    ref="dialogo"
    class="dialog"
    :aria-labelledby="idTitulo"
    @cancel="alCancelar"
    @close="abierto = false"
  >
    <div v-if="$slots.icono" class="dialog-icon" :class="{ 'is-danger': peligro }">
      <slot name="icono" />
    </div>

    <h2 :id="idTitulo" class="dialog-title">{{ titulo }}</h2>
    <div class="dialog-body">
      <slot />
    </div>

    <div class="dialog-actions">
      <button type="button" class="btn btn-secondary" :disabled="cargando" @click="abierto = false">
        Cancelar
      </button>
      <button
        type="button"
        class="btn"
        :class="peligro ? 'btn-danger' : 'btn-primary'"
        :disabled="cargando"
        @click="emit('confirmar')"
      >
        {{ cargando ? 'Procesando…' : textoConfirmar }}
      </button>
    </div>
  </dialog>
</template>

<style scoped>
.dialog {
  margin: auto;
  width: min(420px, calc(100vw - 32px));
  padding: var(--space-6);
  border: none;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  color: var(--color-text);
}

.dialog::backdrop {
  background: rgb(16 41 27 / 0.45);
}

.dialog-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-bottom: var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.dialog-icon.is-danger {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.dialog-title {
  font-size: var(--text-lg);
}

.dialog-body {
  margin-top: var(--space-2);
  color: var(--color-text-muted);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-6);
}
</style>
