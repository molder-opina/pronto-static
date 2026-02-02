<template>
  <div class="config-container">
    <section class="section" id="business-info">
      <header class="section__header">
        <h2>Información del Negocio</h2>
        <p>Administra los datos básicos, logo y configuración regional.</p>
      </header>

      <form @submit.prevent="save" class="config-form">
        <div class="form-section">
          <h3>Información Básica</h3>
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="business_name">Nombre del Negocio *</label>
              <input
                type="text"
                id="business_name"
                v-model="form.business_name"
                required
                readonly
              />
              <small>Este valor se obtiene del ambiente del contenedor y no se puede modificar.</small>
            </div>

            <div class="form-group full-width">
              <label for="description">Descripción</label>
              <textarea id="description" v-model="form.description" rows="3"></textarea>
            </div>

            <div class="form-group">
              <label for="phone">Teléfono</label>
              <input type="tel" id="phone" v-model="form.phone" />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="form.email" />
            </div>

            <div class="form-group full-width">
              <label for="website">Sitio Web</label>
              <input type="url" id="website" v-model="form.website" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Dirección</h3>
          <div class="form-grid">
            <div class="form-group full-width">
              <label for="address">Dirección</label>
              <input type="text" id="address" v-model="form.address" />
            </div>

            <div class="form-group">
              <label for="city">Ciudad</label>
              <input type="text" id="city" v-model="form.city" />
            </div>

            <div class="form-group">
              <label for="state">Estado</label>
              <input type="text" id="state" v-model="form.state" />
            </div>

            <div class="form-group">
              <label for="postal_code">Código Postal</label>
              <input type="text" id="postal_code" v-model="form.postal_code" />
            </div>

            <div class="form-group">
              <label for="country">País</label>
              <input type="text" id="country" v-model="form.country" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Logo e Imagen</h3>

          <div v-if="form.logo_url" class="logo-preview-container" id="logo-preview-container">
            <label>Vista Previa del Logo</label>
            <div class="logo-preview-box">
              <img
                id="logo-preview-img"
                :src="form.logo_url"
                alt="Logo preview"
                class="logo-preview-img"
              />
            </div>
          </div>

          <div class="form-grid">
            <div class="form-group full-width">
              <label>Fuente del Logo</label>
              <div class="logo-source-selector">
                <label class="radio-option">
                  <input type="radio" name="logo_source" value="url" v-model="logoSource" />
                  <span>URL Externa</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="logo_source" value="upload" v-model="logoSource" />
                  <span>Subir Archivo Local</span>
                </label>
                <label class="radio-option">
                  <input type="radio" name="logo_source" value="server" v-model="logoSource" />
                  <span>Ruta del Servidor</span>
                </label>
              </div>
            </div>

            <div v-if="logoSource === 'url'" class="form-group full-width" id="logo-url-input">
              <label for="logo_url">URL del Logo</label>
              <input
                type="url"
                id="logo_url"
                v-model="form.logo_url"
                placeholder="https://ejemplo.com/logo.png"
              />
              <small>Ingresa la URL completa de tu logo (debe ser accesible públicamente)</small>
            </div>

            <div v-if="logoSource === 'upload'" class="form-group full-width" id="logo-upload-input">
              <label for="logo_file">Archivo de Logo</label>
              <input
                type="file"
                id="logo_file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                @change="handleLogoUpload"
              />
              <small>Formatos aceptados: PNG, JPG, SVG, WebP (máx. 2MB)</small>
              <div v-if="uploadProgress > 0" id="upload-progress" class="upload-progress">
                <div class="upload-progress-bar" :style="{ width: uploadProgress + '%' }"></div>
                <small id="upload-status">{{ uploadStatus }}</small>
              </div>
            </div>

            <div v-if="logoSource === 'server'" class="form-group full-width" id="logo-server-input">
              <label for="logo_server_path">Ruta del Servidor</label>
              <input
                type="text"
                id="logo_server_path"
                v-model="logoServerPath"
                placeholder="branding/logo.png"
              />
              <small>Ruta relativa desde la raíz del servidor de contenido estático</small>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h3>Configuración Regional</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="currency">Moneda</label>
              <select id="currency" v-model="form.currency">
                <option value="MXN">MXN - Peso Mexicano</option>
                <option value="USD">USD - Dólar</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="timezone">Zona Horaria</label>
              <select id="timezone" v-model="form.timezone">
                <option value="America/Mexico_City">Ciudad de México (UTC-6)</option>
                <option value="America/Tijuana">Tijuana (UTC-8)</option>
                <option value="America/Cancún">Cancún (UTC-5)</option>
              </select>
            </div>

            <div class="form-group">
              <label for="tax_rate">Tarifa de Impuesto (%)</label>
              <input type="number" id="tax_rate" v-model.number="form.tax_rate" min="0" max="100" step="0.01" />
            </div>

            <div class="form-group">
              <label for="table_count">Número de Mesas</label>
              <input type="number" id="table_count" v-model.number="form.table_count" min="1" />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn--primary" :disabled="saving">
            {{ saving ? 'Guardando...' : '💾 Guardar Cambios' }}
          </button>
          <div v-if="message" :class="['message', messageType]">
            {{ message }}
          </div>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface BusinessInfo {
  business_name: string
  description: string
  phone: string
  email: string
  website: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  logo_url: string
  currency: string
  timezone: string
  tax_rate: number
  table_count: number
}

const form = ref<BusinessInfo>({
  business_name: '',
  description: '',
  phone: '',
  email: '',
  website: '',
  address: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  logo_url: '',
  currency: 'MXN',
  timezone: 'America/Mexico_City',
  tax_rate: 16,
  table_count: 1
})

const logoSource = ref('url')
const logoServerPath = ref('')
const uploadProgress = ref(0)
const uploadStatus = ref('')
const loading = ref(false)
const saving = ref(false)
const message = ref('')
const messageType = ref('success')

const loadData = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/business-info')
    const result = await response.json()

    if (result.success && result.data) {
      form.value = { ...form.value, ...result.data }
      
      if (result.data.logo_url) {
        form.value.logo_url = result.data.logo_url
      }
    }
  } catch (error) {
    console.error('Error loading business info:', error)
    showMessage('Error al cargar información del negocio', 'error')
  } finally {
    loading.value = false
  }
}

const validate = (): { valid: boolean; message?: string; data?: BusinessInfo } => {
  const data = { ...form.value }
  
  const phone = data.phone || ''
  if (phone && !/^[0-9+()\-\s]+$/.test(phone)) {
    return { valid: false, message: 'El teléfono solo puede contener números y caracteres + ( ) -.' }
  }

  const email = data.email || ''
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, message: 'El email no tiene un formato válido.' }
  }

  const website = data.website || ''
  if (website) {
    try {
      new URL(website)
    } catch {
      return { valid: false, message: 'El sitio web debe ser una URL válida.' }
    }
  }

  const postalCode = data.postal_code || ''
  if (postalCode) {
    if (postalCode.startsWith('-')) {
      return { valid: false, message: 'El código postal no puede ser negativo.' }
    }
    if (!/^[0-9]+$/.test(postalCode)) {
      return { valid: false, message: 'El código postal debe contener solo números.' }
    }
  }

  return { valid: true, data }
}

const save = async () => {
  const validation = validate()
  
  if (!validation.valid) {
    showMessage(validation.message || 'Datos inválidos', 'error')
    return
  }

  saving.value = true
  
  try {
    const response = await fetch('/api/business-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validation.data)
    })

    const result = await response.json()

    if (result.success) {
      showMessage('Información guardada correctamente', 'success')
    } else {
      showMessage(result.message || 'Error al guardar', 'error')
    }
  } catch (error) {
    console.error('Error saving business info:', error)
    showMessage('Error al guardar información', 'error')
  } finally {
    saving.value = false
  }
}

const handleLogoUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    showMessage('El archivo debe ser menor a 2MB', 'error')
    return
  }

  uploadProgress.value = 0
  uploadStatus.value = 'Subiendo archivo...'

  try {
    const formData = new FormData()
    formData.append('logo', file)

    const xhr = new XMLHttpRequest()
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        uploadProgress.value = Math.round((e.loaded / e.total) * 100)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText)
        if (result.success) {
          form.value.logo_url = result.url
          uploadStatus.value = 'Archivo subido correctamente'
          showMessage('Logo actualizado correctamente', 'success')
        } else {
          uploadStatus.value = result.message || 'Error al subir archivo'
          showMessage(uploadStatus.value, 'error')
        }
      } else {
        uploadStatus.value = 'Error en la subida'
        showMessage('Error al subir archivo', 'error')
      }
    })

    xhr.addEventListener('error', () => {
      uploadStatus.value = 'Error de conexión'
      showMessage('Error al subir archivo', 'error')
    })

    xhr.open('POST', '/api/business-info/upload-logo')
    xhr.send(formData)
  } catch (error) {
    console.error('Error uploading logo:', error)
    showMessage('Error al subir archivo', 'error')
  }
}

const showMessage = (msg: string, type: string) => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

onMounted(() => {
  loadData()
})

defineExpose({
  loadData,
  refresh: loadData
})
</script>

<style scoped>
.config-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

.section {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.section__header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.section__header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.section__header p {
  color: #64748b;
  margin: 0;
}

.config-form {
  padding: 1.5rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.625rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.form-group input[readonly] {
  background: #f3f4f6;
  cursor: not-allowed;
}

.form-group small {
  font-size: 0.75rem;
  color: #6b7280;
}

.logo-preview-container {
  margin-bottom: 1.5rem;
}

.logo-preview-container > label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  display: block;
  margin-bottom: 0.5rem;
}

.logo-preview-box {
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
}

.logo-preview-img {
  max-width: 200px;
  max-height: 120px;
  object-fit: contain;
}

.logo-source-selector {
  display: flex;
  gap: 1rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.radio-option input {
  width: auto;
}

.upload-progress {
  margin-top: 0.5rem;
}

.upload-progress-bar {
  background: var(--primary-orange, #ff6b35);
  height: 8px;
  border-radius: 4px;
  transition: width 0.3s;
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn--primary {
  background: #ff6b35;
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background: #e85a2b;
}

.btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.message.success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.message.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}
</style>
