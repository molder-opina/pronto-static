<template>
  <component :is="tag" class="card" :class="[`card--${variant}`, { 'card--hoverable': hoverable }]">
    <div v-if="$slots.header || title" class="card__header">
      <slot name="header">
        <div class="card__header-content">
          <h3 v-if="title" class="card__title">{{ title }}</h3>
          <p v-if="subtitle" class="card__subtitle">{{ subtitle }}</p>
        </div>
        <div class="card__header-actions">
          <slot name="actions" />
        </div>
      </slot>
    </div>
    <div class="card__body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </div>
  </component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  tag?: string
  variant?: 'default' | 'bordered' | 'elevated'
  title?: string
  subtitle?: string
  hoverable?: boolean
}>(), {
  tag: 'div',
  variant: 'default',
  hoverable: false
})
</script>

<style scoped>
.card {
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
}

.card--default {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card--bordered {
  border: 1px solid #e2e8f0;
  box-shadow: none;
}

.card--elevated {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card--hoverable {
  transition: all 0.2s;
}

.card--hoverable:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.card__header-content {
  flex: 1;
}

.card__title {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
}

.card__subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.card__header-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
}

.card__body {
  padding: 1.5rem;
}

.card__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
}
</style>
