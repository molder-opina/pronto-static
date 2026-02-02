<template>
  <div class="spinner" :class="[`spinner--${size}`, `spinner--${color}`]" role="status">
    <svg class="spinner__svg" viewBox="0 0 50 50">
      <circle class="spinner__path" cx="25" cy="25" r="20" fill="none" stroke-width="4" />
    </svg>
    <span v-if="label" class="sr-only">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'white' | 'gray'
  label?: string
}>(), {
  size: 'medium',
  color: 'primary'
})
</script>

<style scoped>
.spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.spinner__svg {
  animation: rotate 2s linear infinite;
}

.spinner__path {
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.spinner--small .spinner__svg {
  width: 20px;
  height: 20px;
}

.spinner--medium .spinner__svg {
  width: 40px;
  height: 40px;
}

.spinner--large .spinner__svg {
  width: 60px;
  height: 60px;
}

.spinner--primary .spinner__path {
  stroke: #ff6b35;
}

.spinner--white .spinner__path {
  stroke: white;
}

.spinner--gray .spinner__path {
  stroke: #9ca3af;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
