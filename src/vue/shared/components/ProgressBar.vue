<template>
  <div class="progress-bar" :class="{ 'progress-bar--striped': striped, 'progress-bar--animated': animated }" role="progressbar" :aria-valuenow="modelValue" :aria-valuemin="0" :aria-valuemax="100">
    <div class="progress-bar__fill" :style="{ width: `${modelValue}%` }"></div>
    <div v-if="showLabel" class="progress-bar__label">{{ modelValue }}%</div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: number
  striped?: boolean
  animated?: boolean
  showLabel?: boolean
}>(), {
  striped: false,
  animated: false,
  showLabel: false
})
</script>

<style scoped>
.progress-bar {
  position: relative;
  height: 8px;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background: #ff6b35;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

.progress-bar--striped .progress-bar__fill {
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.15) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.15) 75%,
    transparent 75%,
    transparent
  );
  background-size: 1rem 1rem;
}

.progress-bar--animated.progress-bar--striped .progress-bar__fill {
  animation: progress-bar-stripes 1s linear infinite;
}

@keyframes progress-bar-stripes {
  from {
    background-position: 1rem 0;
  }
  to {
    background-position: 0 0;
  }
}

.progress-bar__label {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
  margin-right: 0.5rem;
}
</style>
