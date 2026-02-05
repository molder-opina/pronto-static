<template>
  <div :class="['branding-card', { wide: extraClass.includes('wide') }]">
    <div :class="['branding-preview', extraClass.replace('wide', ''), { 'has-image': exists }]">
      <template v-if="exists">
        <img :src="imageUrl" :alt="title">
      </template>
      <div v-else class="placeholder-icon">🖼</div>
    </div>
    <div class="branding-info">
      <h4>{{ title }}</h4>
      <p>{{ size }} recomendado</p>
      <div class="branding-actions">
        <input :id="`upload-${type}`" type="file" accept="image/*" hidden @change="onFileChange">
        <button class="btn btn-sm btn-outline" @click="triggerUpload">
          ↑ Subir
        </button>
        <button class="btn btn-sm btn-primary" @click="$emit('generate', type)">
          ✨ Generar IA
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  type: string;
  title: string;
  size: string;
  baseUrl: string;
  exists: boolean;
  extraClass?: string;
}>();

const emit = defineEmits(['upload', 'generate']);

const imageUrl = computed(() => {
  const t = Date.now();
  if ((props.type === 'logo' || props.type === 'icon') && props.exists) {
    return `/api/branding/logo?t=${t}`;
  }
  // Fallback for other types or if not exists (though it won't be shown)
  return `${props.baseUrl}/${props.type}.png?t=${t}`;
});

const triggerUpload = () => {
  document.getElementById(`upload-${props.type}`)?.click();
};

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    emit('upload', props.type, input);
  }
};
</script>

<style scoped>
.branding-card {
  /* styles for the asset card */
}
.branding-preview {
  /* styles for the preview area */
}
.branding-info {
  /* styles for the info area */
}
/* Add other necessary styles from the original branding.html if they were specific */
</style>
