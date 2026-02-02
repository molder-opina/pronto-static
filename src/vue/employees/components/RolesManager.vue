<template>
  <div class="roles-container">
    <div class="roles-header">
      <div>
        <h1>Gestión de Roles Personalizados</h1>
        <p>Crea y administra roles con permisos granulares</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Crear Nuevo Rol
      </button>
    </div>

    <div class="roles-grid" v-if="roles.length > 0">
      <div
        v-for="role in roles"
        :key="role.id"
        class="role-card"
        :class="{ inactive: !role.is_active }"
        :style="{ borderLeftColor: role.color || '#4F46E5' }"
      >
        <div class="role-card-header">
          <div class="role-info">
            <h3>{{ role.role_name }}</h3>
            <span class="role-code">{{ role.role_code }}</span>
          </div>
          <div class="role-actions">
            <button class="icon-btn" @click="editRole(role)" title="Editar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="icon-btn delete" @click="deleteRole(role.id, role.role_name)" title="Eliminar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
        <p class="role-description">{{ role.description || 'Sin descripción' }}</p>
        <div class="role-stats">
          <div class="stat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            {{ role.permissions_count || 0 }} permisos
          </div>
          <div class="stat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            {{ role.is_active ? 'Activo' : 'Inactivo' }}
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      <p>No hay roles personalizados</p>
      <p>Crea tu primer rol personalizado para empezar</p>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal active" @click.self="closeModal">
        <div class="modal-content modal-large">
          <div class="modal-header">
            <h2>{{ isEditing ? 'Editar Rol' : 'Crear Nuevo Rol' }}</h2>
            <button class="modal-close" @click="closeModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <form @submit.prevent="save">
            <div class="modal-body">
              <div class="modal-tabs">
                <button type="button" class="modal-tab" :class="{ active: activeTab === 'info' }" @click="activeTab = 'info'">
                  Información
                </button>
                <button type="button" class="modal-tab" :class="{ active: activeTab === 'permissions' }" @click="activeTab = 'permissions'">
                  Permisos
                </button>
              </div>

              <div v-if="activeTab === 'info'" class="modal-tab-panel active">
                <div class="form-section">
                  <h3>Información del Rol</h3>
                  <div class="form-grid">
                    <div class="form-group">
                      <label for="role_code">Código del Rol *</label>
                      <input
                        type="text"
                        id="role_code"
                        v-model="form.role_code"
                        required
                        pattern="^[a-z_][a-z0-9_]*$"
                        placeholder="ej: shift_manager"
                        :disabled="isEditing"
                      />
                      <small>Solo minúsculas, números y guiones bajos. Empieza con letra.</small>
                    </div>

                    <div class="form-group">
                      <label for="role_name">Nombre del Rol *</label>
                      <input
                        type="text"
                        id="role_name"
                        v-model="form.role_name"
                        required
                        placeholder="ej: Gerente de Turno"
                      />
                    </div>

                    <div class="form-group">
                      <label for="color">Color</label>
                      <input type="color" id="color" v-model="form.color" />
                    </div>

                    <div class="form-group">
                      <label for="icon">Ícono (opcional)</label>
                      <input type="text" id="icon" v-model="form.icon" placeholder="ej: user-shield" />
                    </div>

                    <div class="form-group full-width">
                      <label for="description">Descripción</label>
                      <textarea
                        id="description"
                        v-model="form.description"
                        rows="2"
                        placeholder="Descripción del rol y sus responsabilidades"
                      ></textarea>
                    </div>

                    <div class="form-group full-width">
                      <label class="checkbox-label">
                        <input type="checkbox" id="is_active" v-model="form.is_active" />
                        <span>Rol activo</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="activeTab === 'permissions'" class="modal-tab-panel active">
                <div class="form-section">
                  <h3>Permisos</h3>
                  <p class="help-text">Selecciona los permisos que tendrá este rol</p>

                  <div class="permissions-grid">
                    <div v-for="group in permissionGroups" :key="group.resource" class="permission-group">
                      <h4>{{ group.icon }} {{ group.name }}</h4>
                      <div class="permission-checks">
                        <label v-for="action in group.actions" :key="action.value">
                          <input
                            type="checkbox"
                            :data-resource="group.resource"
                            :data-action="action.value"
                            v-model="selectedPermissions[group.resource]"
                            :value="action.value"
                          />
                          {{ action.label }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="submit" class="btn btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {{ isEditing ? 'Actualizar Rol' : 'Crear Rol' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

interface Role {
  id: number
  role_code: string
  role_name: string
  description: string
  color: string
  icon: string
  is_active: boolean
  permissions_count?: number
  permissions?: Array<{ resource_type: string; action: string; allowed: boolean }>
}

interface PermissionGroup {
  resource: string
  name: string
  icon: string
  actions: Array<{ value: string; label: string }>
}

const roles = ref<Role[]>([])
const showModal = ref(false)
const isEditing = ref(false)
const activeTab = ref('info')
const currentRoleId = ref<number | null>(null)
const loading = ref(false)

const form = reactive({
  role_code: '',
  role_name: '',
  description: '',
  color: '#4F46E5',
  icon: '',
  is_active: true
})

const selectedPermissions = ref<Record<string, string[]>>({
  orders: [],
  menu: [],
  customers: [],
  sessions: [],
  employees: [],
  reports: [],
  tables: [],
  settings: []
})

const permissionGroups: PermissionGroup[] = [
  { resource: 'orders', name: 'Pedidos', icon: '📦', actions: [
    { value: 'read', label: 'Ver' },
    { value: 'create', label: 'Crear' },
    { value: 'update', label: 'Modificar' },
    { value: 'delete', label: 'Eliminar' },
    { value: 'approve', label: 'Aprobar' }
  ]},
  { resource: 'menu', name: 'Menú', icon: '🍽️', actions: [
    { value: 'read', label: 'Ver' },
    { value: 'create', label: 'Crear' },
    { value: 'update', label: 'Modificar' },
    { value: 'delete', label: 'Eliminar' }
  ]},
  { resource: 'customers', name: 'Clientes', icon: '👥', actions: [
    { value: 'read', label: 'Ver' },
    { value: 'create', label: 'Crear' },
    { value: 'update', label: 'Modificar' },
    { value: 'delete', label: 'Eliminar' }
  ]},
  { resource: 'sessions', name: 'Sesiones', icon: '🪑', actions: [
    { value: 'read', label: 'Ver' },
    { value: 'create', label: 'Crear' },
    { value: 'update', label: 'Modificar' },
    { value: 'close', label: 'Cerrar' }
  ]},
  { resource: 'employees', name: 'Empleados', icon: '👨‍💼', actions: [
    { value: 'read', label: 'Ver' },
    { value: 'create', label: 'Crear' },
    { value: 'update', label: 'Modificar' },
    { value: 'delete', label: 'Eliminar' }
  ]},
  { resource: 'reports', name: 'Reportes', icon: '📊', actions: [
    { value: 'read', label: 'Ver' },
    { value: 'export', label: 'Exportar' }
  ]},
  { resource: 'tables', name: 'Mesas', icon: '🪑', actions: [
    { value: 'read', label: 'Ver' },
    { value: 'update', label: 'Modificar' }
  ]},
  { resource: 'settings', name: 'Configuración', icon: '⚙️', actions: [
    { value: 'read', label: 'Ver' },
    { value: 'update', label: 'Modificar' }
  ]}
]

const loadRoles = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/roles?include_inactive=true')
    const result = await response.json()
    const payload = result.data || result
    if (Array.isArray(payload)) {
      roles.value = payload
    } else if (payload.roles && Array.isArray(payload.roles)) {
      roles.value = payload.roles
    }
  } catch (error) {
    console.error('Error loading roles:', error)
  } finally {
    loading.value = false
  }
}

const openCreate = () => {
  isEditing.value = false
  currentRoleId.value = null
  form.role_code = ''
  form.role_name = ''
  form.description = ''
  form.color = '#4F46E5'
  form.icon = ''
  form.is_active = true
  Object.keys(selectedPermissions.value).forEach(key => {
    selectedPermissions.value[key] = []
  })
  activeTab.value = 'info'
  showModal.value = true
}

const editRole = async (role: Role) => {
  isEditing.value = true
  currentRoleId.value = role.id
  form.role_code = role.role_code
  form.role_name = role.role_name
  form.description = role.description || ''
  form.color = role.color || '#4F46E5'
  form.icon = role.icon || ''
  form.is_active = role.is_active

  Object.keys(selectedPermissions.value).forEach(key => {
    selectedPermissions.value[key] = []
  })

  if (role.permissions) {
    role.permissions.forEach(perm => {
      if (perm.allowed) {
        if (!selectedPermissions.value[perm.resource_type]) {
          selectedPermissions.value[perm.resource_type] = []
        }
        selectedPermissions.value[perm.resource_type].push(perm.action)
      }
    })
  }

  activeTab.value = 'info'
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const deleteRole = async (roleId: number, roleName: string) => {
  if (!confirm(`¿Estás seguro de eliminar el rol "${roleName}"?\n\nEsta acción desactivará el rol.`)) {
    return
  }

  try {
    const response = await fetch(`/api/roles/${roleId}`, { method: 'DELETE' })
    const result = await response.json()

    if (result.success) {
      await loadRoles()
    } else {
      alert(result.message || 'Error al eliminar rol')
    }
  } catch (error) {
    console.error('Error deleting role:', error)
    alert('Error al eliminar rol')
  }
}

const save = async () => {
  const permissions: Array<{ resource_type: string; action: string; allowed: boolean }> = []

  Object.entries(selectedPermissions.value).forEach(([resource, actions]) => {
    actions.forEach(action => {
      permissions.push({ resource_type: resource, action, allowed: true })
    })
  })

  try {
    if (isEditing.value && currentRoleId.value) {
      const response = await fetch(`/api/roles/${currentRoleId.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const result = await response.json()

      if (!result.success) {
        alert(result.message || 'Error al actualizar rol')
        return
      }

      const permResponse = await fetch(`/api/roles/${currentRoleId.value}/permissions/bulk`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions })
      })

      const permResult = await permResponse.json()

      if (permResult.success) {
        closeModal()
        await loadRoles()
      } else {
        alert('Rol actualizado pero hubo un error con los permisos')
      }
    } else {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, permissions })
      })

      const result = await response.json()

      if (result.success) {
        closeModal()
        await loadRoles()
      } else {
        alert(result.message || 'Error al crear rol')
      }
    }
  } catch (error) {
    console.error('Error saving role:', error)
    alert('Error al guardar rol')
  }
}

onMounted(() => {
  loadRoles()
})
</script>

<style scoped>
.roles-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.roles-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.roles-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.roles-header p {
  color: #64748b;
  margin: 0;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.role-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #4f46e5;
  transition: all 0.2s;
}

.role-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.role-card.inactive {
  opacity: 0.6;
}

.role-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.role-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
}

.role-code {
  font-size: 0.875rem;
  color: #64748b;
  font-family: 'Courier New', monospace;
  background: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.role-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f1f5f9;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: #e2e8f0;
}

.icon-btn.delete:hover {
  background: #fee;
  color: #dc2626;
}

.role-description {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.role-stats {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
}

.stat svg {
  color: #94a3b8;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

.empty-state svg {
  margin: 0 auto 1rem;
}

.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal.active {
  display: flex;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.modal-body {
  padding: 1.5rem;
}

.modal-tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.modal-tab {
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.modal-tab.active {
  color: #0f172a;
  border-bottom-color: #ff6b35;
}

.modal-tab-panel {
  display: none;
}

.modal-tab-panel.active {
  display: block;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 1rem 0;
}

.help-text {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.form-group input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.form-group small {
  font-size: 0.8125rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type='checkbox'] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.permission-group {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.permission-group h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.75rem 0;
}

.permission-checks {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.permission-checks label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #475569;
  cursor: pointer;
}

.permission-checks input[type='checkbox'] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #ff6b35;
  color: white;
}

.btn-primary:hover {
  background: #e85a2b;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover {
  background: #e2e8f0;
}
</style>
