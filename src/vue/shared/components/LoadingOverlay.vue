<template>
  <Teleport to="body">
    <Transition name="loading">
      <div
        v-if="visible"
        id="global-loading"
        class="loading-overlay"
        :class="{ visible: visible }"
      >
        <div class="loading-spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p v-if="message" class="loading-message">{{ message }}</p>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface LoadingOptions {
  message?: string
}

const visible = ref(false)
const pending = ref(0)
let initialized = false

const show = (options?: LoadingOptions) => {
  pending.value++
  if (options?.message) {
    // Could store message in a ref if needed
  }
  visible.value = true
}

const hide = () => {
  pending.value = Math.max(0, pending.value - 1)
  if (pending.value === 0) {
    visible.value = false
  }
}

const start = () => show()
const stop = () => hide()

// Expose to window for legacy compatibility
onMounted(() => {
  ;(window as any).EmployeeLoading = {
    start,
    stop,
    show,
    hide
  }
  
  if (!(window as any).GlobalLoading) {
    ;(window as any).GlobalLoading = (window as any).EmployeeLoading
  }
  
  initialized = true
})

onUnmounted(() => {
  // Cleanup if needed
})

defineExpose({
  start,
  stop,
  show,
  hide,
  visible
})
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.loading-overlay.visible {
  opacity: 1;
  visibility: visible;
}

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #ff6b35;
  animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(2) {
  inset: 6px;
  border-top-color: #ff8c5a;
  animation-duration: 0.85s;
  animation-direction: reverse;
}

.spinner-ring:nth-child(3) {
  inset: 12px;
  border-top-color: #ffad8a;
  animation-duration: 0.7s;
}

.loading-message {
  margin-top: 1rem;
  color: white;
  font-size: 0.875rem;
  font-family: 'DM Sans', sans-serif;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Transitions */
.loading-enter-active,
.loading-leave-active {
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.loading-enter-from,
.loading-leave-to {
  opacity: 0;
  visibility: hidden;
}
</style>
