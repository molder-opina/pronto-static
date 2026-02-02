<template>
  <div class="shortcuts-manager">
    <div class="shortcuts-toolbar">
      <input
        type="search"
        id="shortcuts-filter"
        class="shortcuts-filter"
        placeholder="Buscar atajos..."
        v-model="searchQuery"
        @input="filterShortcuts"
      />
      <button class="btn btn-primary" @click="openCreateModal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Nuevo Atajo
      </button>
    </div>

    <div v-if="loading" class="shortcuts-loading">
      <div class="loading-spinner"></div>
      <p>Cargando atajos...</p>
    </div>

    <EmptyState
      v-else-if="filteredShortcuts.length === 0"
      icon="keyboard"
      title="No se encontraron atajos"
      description="Crea un nuevo atajo de teclado para comenzar"
    >
      <template #actions>
        <button class="btn btn-primary" @click="openCreateModal">Crear Atajo</button>
      </template>
    </EmptyState>

    <div v-else class="shortcuts-grid">
      <div
        v-for="shortcut in filteredShortcuts"
        :key="shortcut.id"
        class="shortcut-card"
        :data-category="shortcut.category"
      >
        <div class="shortcut-card-header">
          <span class="shortcut-combo">{{ formatCombo(shortcut.combo) }}</span>
          <label class="toggle-switch small">
            <input
              type="checkbox"
              :checked="shortcut.is_enabled"
              @change="toggleShortcut(shortcut.id, $event.target.checked)"
            />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="shortcut-card-body">
          <p class="shortcut-description">{{ shortcut.description }}</p>
          <span class="shortcut-category">{{ shortcut.category }}</span>
        </div>
        <div class="shortcut-card-actions">
          <button class="btn-icon" @click="editShortcut(shortcut)" title="Editar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="btn-icon danger" @click="deleteShortcut(shortcut.id)" title="Eliminar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <ModalDialog v-model="showModal" :title="modalTitle" size="medium">
      <form @submit.prevent="saveShortcut">
        <div class="form-group">
          <label for="shortcut-combo">Combinación de teclas</label>
          <input
            type="text"
            id="shortcut-combo"
            v-model="form.combo"
            placeholder="ctrl+shift+p"
            required
          />
          <small>Usa + para combinar teclas. Ej: ctrl+shift+p</small>
        </div>

        <div class="form-group">
          <label for="shortcut-description">Descripción</label>
          <input
            type="text"
            id="shortcut-description"
            v-model="form.description"
            placeholder="Abre el panel de pedidos"
            required
          />
        </div>

        <div class="form-group">
          <label for="shortcut-category">Categoría</label>
          <select id="shortcut-category" v-model="form.category" required>
            <option value="general">General</option>
            <option value="orders">Pedidos</option>
            <option value="menu">Menú</option>
            <option value="tables">Mesas</option>
            <option value="reports">Reportes</option>
            <option value="admin">Administración</option>
          </select>
        </div>

        <div class="form-group">
          <label for="shortcut-callback">Acción</label>
          <select id="shortcut-callback" v-model="form.callback_function">
            <option value="goToHome">Ir al inicio</option>
            <option value="goToOrders">Ir a pedidos</option>
            <option value="goToMenu">Ir al menú</option>
            <option value="goToTables">Ir a mesas</option>
            <option value="goToReports">Ir a reportes</option>
            <option value="openSearch">Buscar</option>
            <option value="togglePanel">Alternar panel</option>
          </select>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.prevent_default" />
            <span>Prevenir acción por defecto del navegador</span>
          </label>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            {{ saving ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import EmptyState from '../../shared/components/EmptyState.vue'
import ModalDialog from '../../shared/components/ModalDialog.vue'

interface Shortcut {
  id: number
  combo: string
  description: string
  category: string
  callback_function: string
  prevent_default: boolean
  is_enabled: boolean
}

const shortcuts = ref<Shortcut[]>([])
const filteredShortcuts = ref<Shortcut[]>([])
const searchQuery = ref('')
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const editingId = ref<number | null>(null)

const form = reactive({
  combo: '',
  description: '',
  category: 'general',
  callback_function: 'goToHome',
  prevent_default: true
})

const modalTitle = computed(() => editingId.value ? 'Editar Atajo de Teclado' : 'Nuevo Atajo de Teclado')

const keyMap: Record<string, string> = {
  'ctrl': 'Ctrl',
  'alt': 'Alt',
  'shift': 'Shift',
  'enter': 'Enter',
  'escape': 'Esc',
  'backspace': 'Back',
  'tab': 'Tab',
  'arrowup': '↑',
  'arrowdown': '↓',
  'arrowleft': '←',
  'arrowright': '→',
  ' ': 'Espacio'
}

function formatCombo(combo: string): string {
  return combo.split('+').map(key => {
    const lower = key.toLowerCase()
    return keyMap[lower] || key.toUpperCase()
  }).join('+')
}

async function loadShortcuts() {
  loading.value = true
  try {
    const response = await fetch('/api/admin/shortcuts')
    const result = await response.json()
    if (result.shortcuts) {
      shortcuts.value = result.shortcuts
      filterShortcuts()
    }
  } catch (error) {
    console.error('Error loading shortcuts:', error)
  } finally {
    loading.value = false
  }
}

function filterShortcuts() {
  const query = searchQuery.value.toLowerCase()
  filteredShortcuts.value = shortcuts.value.filter(shortcut => {
    const searchText = `${shortcut.combo} ${shortcut.description} ${shortcut.category}`.toLowerCase()
    return searchText.includes(query)
  })
}

async function toggleShortcut(id: number, enabled: boolean) {
  try {
    const response = await fetch(`/api/admin/shortcuts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_enabled: enabled })
    })

    const result = await response.json()
    if (result.success) {
      const index = shortcuts.value.findIndex(s => s.id === id)
      if (index >= 0) {
        shortcuts.value[index].is_enabled = enabled
        filterShortcuts()
      }
    } else {
      alert(result.error || 'Error al actualizar')
      loadShortcuts()
    }
  } catch (error) {
    console.error('Error toggling shortcut:', error)
    alert('Error al actualizar')
    loadShortcuts()
  }
}

function openCreateModal() {
  editingId.value = null
  form.combo = ''
  form.description = ''
  form.category = 'general'
  form.callback_function = 'goToHome'
  form.prevent_default = true
  showModal.value = true
}

function editShortcut(shortcut: Shortcut) {
  editingId.value = shortcut.id
  form.combo = shortcut.combo
  form.description = shortcut.description
  form.category = shortcut.category
  form.callback_function = shortcut.callback_function || 'goToHome'
  form.prevent_default = shortcut.prevent_default !== false
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingId.value = null
}

async function saveShortcut() {
  saving.value = true
  try {
    const data = {
      combo: form.combo.trim(),
      description: form.description.trim(),
      category: form.category,
      callback_function: form.callback_function,
      prevent_default: form.prevent_default
    }

    const url = editingId.value ? `/api/admin/shortcuts/${editingId.value}` : '/api/admin/shortcuts'
    const method = editingId.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const result = await response.json()
    if (result.success) {
      closeModal()
      await loadShortcuts()
    } else {
      alert(result.error || 'Error al guardar')
    }
  } catch (error) {
    console.error('Error saving shortcut:', error)
    alert('Error al guardar')
  } finally {
    saving.value = false
  }
}

async function deleteShortcut(id: number) {
  if (!confirm('¿Estás seguro de eliminar este atajo?')) return

  try {
    const response = await fetch(`/api/admin/shortcuts/${id}`, { method: 'DELETE' })
    const result = await response.json()
    if (result.success) {
      await loadShortcuts()
    } else {
      alert(result.error || 'Error al eliminar')
    }
  } catch (error) {
    console.error('Error deleting shortcut:', error)
    alert('Error al eliminar')
  }
}

onMounted(() => {
  loadShortcuts()
})
</script>

<style scoped>
.shortcuts-manager {
  padding: 1rem;
}

.shortcuts-toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.shortcuts-filter {
  flex: 1;
  min-width: 200px;
  max-width: 320px;
  padding: 0.625rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.shortcuts-filter:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.shortcuts-loading {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #ff6b35;
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.shortcut-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.shortcut-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.shortcut-combo {
  font-family: monospace;
  font-size: 0.875rem;
  font-weight: 600;
  background: #f1f5f9;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  color: #0f172a;
}

.toggle-switch.small {
  transform: scale(0.85);
}

.shortcut-card-body {
  margin-bottom: 0.75rem;
}

.shortcut-description {
  font-size: 0.875rem;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.shortcut-category {
  display: inline-block;
  font-size: 0.75rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  text-transform: capitalize;
}

.shortcut-card-actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  background: #f1f5f9;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.15s;
}

.btn-icon:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.btn-icon.danger:hover {
  background: #fee;
  color: #dc2626;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: #ff6b35;
  color: white;
}

.btn-primary:hover {
  background: #e85a2b;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #ff6b35;
}

.form-group small {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input {
  width: auto;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #cbd5e1;
  border-radius: 24px;
  transition: 0.3s;
}

.toggle-slider::before {
  position: absolute;
  content: '';
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle-switch input:checked + .toggle-slider {
  background: #ff6b35;
}

.toggle-switch input:checked + .toggle-slider::before {
  transform: translateX(20px);
}
</style>
