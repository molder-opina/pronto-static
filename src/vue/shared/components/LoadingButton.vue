<template>
  <button
    :type="type"
    class="loading-button"
    :class="[
      `loading-button--${variant}`,
      `loading-button--${size}`,
      { 'loading-button--full': fullWidth },
      { 'loading-button--disabled': loading || disabled }
    ]"
    :disabled="loading || disabled"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="loading-button__spinner"></span>
    <span v-if="loading" class="loading-button__loading-text">{{ loadingText }}</span>
    <span v-else class="loading-button__content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  loading?: boolean
  disabled?: boolean
  loadingText?: string
}>(), {
  type: 'button',
  variant: 'primary',
  size: 'medium',
  fullWidth: false,
  loading: false,
  disabled: false,
  loadingText: 'Cargando...'
})

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<style scoped>
.loading-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.loading-button--full {
  width: 100%;
}

.loading-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Sizes */
.loading-button--small {
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
}

.loading-button--medium {
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
}

.loading-button--large {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

/* Variants */
.loading-button--primary {
  background: #ff6b35;
  color: white;
}

.loading-button--primary:hover:not(.loading-button--disabled) {
  background: #e85a2b;
}

.loading-button--secondary {
  background: #f1f5f9;
  color: #475569;
}

.loading-button--secondary:hover:not(.loading-button--disabled) {
  background: #e2e8f0;
}

.loading-button--outline {
  background: transparent;
  color: #ff6b35;
  border: 1px solid #ff6b35;
}

.loading-button--outline:hover:not(.loading-button--disabled) {
  background: #fff7ed;
}

.loading-button--danger {
  background: #ef4444;
  color: white;
}

.loading-button--danger:hover:not(.loading-button--disabled) {
  background: #dc2626;
}

.loading-button--ghost {
  background: transparent;
  color: #64748b;
}

.loading-button--ghost:hover:not(.loading-button--disabled) {
  background: #f1f5f9;
  color: #0f172a;
}

/* Spinner */
.loading-button__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

.loading-button__loading-text {
  display: inline-flex;
  align-items: center;
}

.loading-button__content {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
