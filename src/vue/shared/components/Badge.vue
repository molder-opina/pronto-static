<template>
  <span class="badge" :class="[`badge--${variant}`, `badge--${size}`, { 'badge--dot': showDot }]">
    <span v-if="showDot" class="badge__dot" :class="[`badge__dot--${dotColor}`]"></span>
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'small' | 'medium' | 'large'
  showDot?: boolean
  dotColor?: 'green' | 'red' | 'yellow' | 'blue' | 'gray'
}>(), {
  variant: 'default',
  size: 'medium',
  showDot: false,
  dotColor: 'green'
})
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 500;
  border-radius: 9999px;
  white-space: nowrap;
}

.badge--small {
  padding: 0.125rem 0.5rem;
  font-size: 0.6875rem;
}

.badge--medium {
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
}

.badge--large {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
}

.badge--default {
  background: #f1f5f9;
  color: #475569;
}

.badge--primary {
  background: #ff6b35;
  color: white;
}

.badge--success {
  background: #dcfce7;
  color: #166534;
}

.badge--warning {
  background: #fef3c7;
  color: #92400e;
}

.badge--danger {
  background: #fee2e2;
  color: #dc2626;
}

.badge--info {
  background: #dbeafe;
  color: #1e40af;
}

.badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.badge__dot--green {
  background: #22c55e;
}

.badge__dot--red {
  background: #ef4444;
}

.badge__dot--yellow {
  background: #eab308;
}

.badge__dot--blue {
  background: #3b82f6;
}

.badge__dot--gray {
  background: #94a3b8;
}
</style>
