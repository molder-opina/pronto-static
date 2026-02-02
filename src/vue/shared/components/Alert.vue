<template>
  <div class="alert" :class="[`alert--${variant}`, { 'alert--dismissible': dismissible }]" role="alert">
    <div class="alert__icon">
      <svg v-if="variant === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <svg v-else-if="variant === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
      <svg v-else-if="variant === 'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
      <svg v-else-if="variant === 'info'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
      <slot v-else name="icon" />
    </div>
    
    <div class="alert__content">
      <strong v-if="title" class="alert__title">{{ title }}</strong>
      <div class="alert__message">
        <slot>{{ message }}</slot>
      </div>
    </div>
    
    <button v-if="dismissible" class="alert__close" @click="handleDismiss">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message?: string
  dismissible?: boolean
}>(), {
  variant: 'info',
  dismissible: false
})

const emit = defineEmits<{
  (e: 'dismiss'): void
}>()

function handleDismiss() {
  emit('dismiss')
}
</script>

<style scoped>
.alert {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.alert--success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.alert--error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alert--warning {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.alert--info {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.alert__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert__content {
  flex: 1;
  min-width: 0;
}

.alert__title {
  display: block;
  margin-bottom: 0.25rem;
}

.alert__message {
  line-height: 1.5;
}

.alert__close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0.25rem;
  cursor: pointer;
  border-radius: 0.25rem;
  opacity: 0.6;
  transition: opacity 0.15s;
}

.alert__close:hover {
  opacity: 1;
}
</style>
