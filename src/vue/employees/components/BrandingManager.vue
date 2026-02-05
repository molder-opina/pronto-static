<template>
  <div v-if="!config" class="loading-placeholder">
    <div class="spinner"></div>
    <p>Cargando configuración de branding...</p>
  </div>
  <div v-else class="branding-manager">
    <div class="branding-grid">
      <AssetCard
        type="logo"
        title="Logo Principal"
        size="512x512px"
        :base-url="config.branding_url"
        :exists="config.files.logo"
        @upload="handleUpload"
        @generate="generateAsset"
      />
      <AssetCard
        type="icon"
        title="Icono / Favicon"
        size="128x128px"
        :base-url="config.branding_url"
        :exists="config.files.icon"
        extra-class="small"
        @upload="handleUpload"
        @generate="generateAsset"
      />
      <AssetCard
        type="banner"
        title="Banner"
        size="1200x400px"
        :base-url="config.branding_url"
        :exists="config.files.banner"
        extra-class="banner wide"
        @upload="handleUpload"
        @generate="generateAsset"
      />
      <AssetCard
        type="placeholder"
        title="Placeholder Productos"
        size="256x256px"
        :base-url="config.placeholder_icon_url"
        :exists="config.files.placeholder"
        @upload="handleUpload"
        @generate="generateAsset"
      />
    </div>

    <div class="branding-section">
      <h3>Generación con IA</h3>
      <div class="generation-options">
        <div class="option-group">
          <label for="api-select">API de Generación</label>
          <select id="api-select" v-model="selectedApi" class="form-select">
            <option value="pollinations">Pollinations (Gratis, sin API key)</option>
            <option value="stability">Stability AI (Requiere API Key)</option>
            <option value="replicate">Replicate (Requiere API Key)</option>
          </select>
        </div>
        <div class="option-group">
          <label for="style-select">Estilo Visual</label>
          <select id="style-select" v-model="selectedStyle" class="form-select">
            <option value="modern">Moderno</option>
            <option value="classic">Clásico / Elegante</option>
            <option value="minimal">Minimalista</option>
            <option value="playful">Divertido / Colorido</option>
          </select>
        </div>
        <button class="btn btn-lg btn-primary" @click="generateAsset('all')">
          Generar Todo el Branding
        </button>
      </div>
    </div>

    <div class="branding-section">
      <h3>Imágenes de Productos</h3>
      <p class="text-muted">Genera automáticamente imágenes para los productos del menú usando IA.</p>
      <p>Imágenes generadas: <strong>{{ config.product_images_count }}</strong></p>
      <div class="product-generation">
        <div class="option-group">
          <label for="product-category">Categoría (dejar vacío para todas)</label>
          <input id="product-category" v-model="productCategory" type="text" class="form-input" placeholder="Ej: Entradas">
        </div>
        <div class="option-group">
          <label for="product-limit">Cantidad máxima</label>
          <input id="product-limit" v-model.number="productLimit" type="number" class="form-input" min="1" max="100" @blur="validateLimit">
        </div>
        <button class="btn btn-lg btn-secondary" @click="validateAndGenerateProducts">
          Generar Imágenes de Productos
        </button>
      </div>
    </div>

    <div v-if="statusMessage" :class="['branding-status', statusType]">
      <span>{{ statusIcon }}</span> <span>{{ statusMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import AssetCard from './AssetCard.vue'; // Assuming AssetCard is a separate component

// State
const config = ref<any>(null);
const selectedApi = ref('pollinations');
const selectedStyle = ref('modern');
const productCategory = ref('');
const productLimit = ref(10);
const statusMessage = ref('');
const statusType = ref<'loading' | 'success' | 'error' | ''>('');

// Computed
const statusIcon = computed(() => {
  const icons = { loading: '⏳', success: '✅', error: '❌', '': '' };
  return icons[statusType.value];
});

// Methods
const loadConfig = async () => {
  try {
    const response = await fetch('/api/branding/config');
    const data = await response.json();
    if (data.success) {
      config.value = data.data;
    }
  } catch (error) {
    console.error('Error cargando configuración:', error);
    showStatus('error', 'Error cargando configuración');
  }
};

const showStatus = (type: 'loading' | 'success' | 'error', message: string) => {
  statusType.value = type;
  statusMessage.value = message;
  if (type !== 'loading') {
    setTimeout(() => {
      statusMessage.value = '';
      statusType.value = '';
    }, 5000);
  }
};

const handleUpload = async (type: string, input: HTMLInputElement) => {
  const file = input.files?.[0];
  if (!file) return;

  showStatus('loading', `Subiendo ${type}...`);
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Note: The upload endpoint needs to handle different types if necessary
    const uploadType = (type === 'icon' || type === 'logo') ? 'logo' : type;
    const response = await fetch(`/api/branding/upload/${uploadType}`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    if (data.success) {
      showStatus('success', `${type} actualizado correctamente`);
      await loadConfig();
    } else {
      showStatus('error', data.error || 'Error al subir');
    }
  } catch (error) {
    showStatus('error', 'Error de conexión');
  }
};

const generateAsset = async (type: string) => {
  showStatus('loading', `Generando ${type} con IA... (puede tardar 10-30 segundos)`);
  try {
    const response = await fetch(`/api/branding/generate/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api: selectedApi.value, style: selectedStyle.value }),
    });
    const data = await response.json();
    if (data.success) {
      showStatus('success', 'Generación completada');
      await loadConfig();
    } else {
      showStatus('error', 'Error en la generación');
    }
  } catch (error) {
    showStatus('error', 'Error de conexión');
  }
};

const validateLimit = () => {
  const min = 1;
  const max = 100;
  if (isNaN(productLimit.value) || productLimit.value < min) {
    productLimit.value = min;
  } else if (productLimit.value > max) {
    productLimit.value = max;
  }
};

const validateAndGenerateProducts = () => {
  validateLimit();
  generateProductImages();
};

const generateProductImages = async () => {
  showStatus('loading', 'Iniciando generación de imágenes...');
  try {
    const response = await fetch('/api/branding/generate-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: productCategory.value,
        limit: productLimit.value,
        api: selectedApi.value,
      }),
    });
    const data = await response.json();
    if (data.success) {
      showStatus('success', `Generación iniciada en background. Procesando hasta ${productLimit.value} productos.`);
    } else {
      showStatus('error', data.error || 'Error desconocido');
    }
  } catch (error) {
    showStatus('error', 'Error de conexión');
  }
};

// Lifecycle
onMounted(() => {
  loadConfig();
});
</script>

<style scoped>
/* Scoped styles for the branding manager component */
.branding-manager {
  /* Add component-specific styles here */
}
.branding-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.branding-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e8ec;
}
.generation-options, .product-generation {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 1rem;
}
.option-group {
  flex: 1;
  min-width: 200px;
}
.branding-status {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.branding-status.loading {
  background-color: #eef2ff;
  color: #4338ca;
}
.branding-status.success {
  background-color: #f0fdf4;
  color: #166534;
}
.branding-status.error {
  background-color: #fef2f2;
  color: #991b1b;
}
</style>
