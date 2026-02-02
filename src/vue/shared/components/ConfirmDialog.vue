<template>
  <Teleport to="body">
    <Transition name="confirm">
      <div v-if="modelValue" class="confirm-dialog-backdrop" @click="handleBackdropClick">
        <div class="confirm-dialog" role="dialog" :aria-labelledby="titleId">
          <div v-if="icon" class="confirm-dialog__icon" :class="[`confirm-dialog__icon--${type}`]">
            <svg v-if="icon === 'danger'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <svg v-else-if="icon === 'warning'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>

          <h3 :id="titleId" class="confirm-dialog__title">{{ title }}</h3>
          
          <p v-if="message" class="confirm-dialog__message">{{ message }}</p>
          <div v-else class="confirm-dialog__message">
            <slot />
          </div>

          <div class="confirm-dialog__actions">
            <button
              v-if="cancelText"
              class="confirm-dialog__btn confirm-dialog__btn--cancel"
              @click="handleCancel"
            >
              {{ cancelText }}
            </button>
            <button
              class="confirm-dialog__btn confirm-dialog__btn--confirm"
              :class="[`confirm-dialog__btn--${type}`]"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  message?: string
  type?: 'danger' | 'warning' | 'info'
  icon?: 'danger' | 'warning' | 'info' | 'none'
  confirmText?: string
  cancelText?: string
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
}>(), {
  type: 'danger',
  icon: 'danger',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  closeOnBackdrop: true,
  closeOnEscape: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const titleId = ref(`confirm-dialog-title-${crypto.randomUUID()}`)

function handleBackdropClick(event: MouseEvent) {
  if (!props.closeOnBackdrop) return
  if (event.target === event.currentTarget) {
    handleCancel()
  }
}

function handleConfirm() {
  emit('update:modelValue', false)
  emit('confirm')
}

function handleCancel() {
  emit('update:modelValue', false)
  emit('cancel')
}

function handleKeydown(event: KeyboardEvent) {
  if (!props.closeOnEscape) return
  if (event.key === 'Escape' && props.modelValue) {
    handleCancel()
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}
</script>

<style scoped>
.confirm-dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.confirm-dialog {
  background: white;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 400px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.confirm-dialog__icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.confirm-dialog__icon--danger {
  background: #fee;
  color: #dc2626;
}

.confirm-dialog__icon--warning {
  background: #fef3c7;
  color: #d97706;
}

.confirm-dialog__icon--info {
  background: #dbeafe;
  color: #2563eb;
}

.confirm-dialog__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.confirm-dialog__message {
  color: #475569;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.confirm-dialog__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.confirm-dialog__btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-dialog__btn--cancel {
  background: #f1f5f9;
  color: #475569;
}

.confirm-dialog__btn--cancel:hover {
  background: #e2e8f0;
}

.confirm-dialog__btn--confirm {
  background: #ff6b35;
  color: white;
}

.confirm-dialog__btn--confirm:hover {
  background: #e85a2b;
}

.confirm-dialog__btn--confirm.danger {
  background: #ef4444;
}

.confirm-dialog__btn--confirm.danger:hover {
  background: #dc2626;
}

.confirm-dialog__btn--confirm.warning {
  background: #f59e0b;
}

.confirm-dialog__btn--confirm.warning:hover {
  background: #d97706;
}

/* Transitions */
.confirm-enter-active,
.confirm-leave-active {
  transition: opacity 0.2s ease;
}

.confirm-enter-active .confirm-dialog,
.confirm-leave-active .confirm-dialog {
  transition: transform 0.2s ease;
}

.confirm-enter-from,
.confirm-leave-to {
  opacity: 0;
}

.confirm-enter-from .confirm-dialog,
.confirm-leave-to .confirm-dialog {
  transform: scale(0.95);
}
</style>
