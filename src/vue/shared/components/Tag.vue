<template>
  <span class="tag" :class="[`tag--${variant}`, { 'tag--removable': removable }]" @click="$emit('click', $event)">
    <slot />
    <button v-if="removable" class="tag__remove" @click.stop="$emit('remove')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'outline'
  removable?: boolean
}>(), {
  variant: 'default',
  removable: false
})

defineEmits<{
  (e: 'click', event: MouseEvent): void
  (e: 'remove'): void
}>()
</script>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: default;
  transition: all 0.15s;
}

.tag--removable {
  cursor: pointer;
  padding-right: 0.375rem;
}

.tag--default {
  background: #f1f5f9;
  color: #475569;
}

.tag--primary {
  background: #ff6b35;
  color: white;
}

.tag--success {
  background: #dcfce7;
  color: #166534;
}

.tag--warning {
  background: #fef3c7;
  color: #92400e;
}

.tag--danger {
  background: #fee2e2;
  color: #dc2626;
}

.tag--info {
  background: #dbeafe;
  color: #1e40af;
}

.tag--outline {
  background: transparent;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.tag--removable:hover {
  opacity: 0.9;
}

.tag__remove {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: inherit;
  opacity: 0.6;
  transition: opacity 0.15s;
}

.tag__remove:hover {
  opacity: 1;
}
</style>
