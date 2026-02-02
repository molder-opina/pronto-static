<template>
  <div class="empty-state" :class="{ 'empty-state--compact': compact }">
    <div class="empty-state__icon" v-if="icon">
      <component :is="iconComponent" v-if="iconComponent" />
      <svg v-else-if="icon === 'search'" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <svg v-else-if="icon === 'inbox'" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
      </svg>
      <svg v-else-if="icon === 'users'" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
      <svg v-else-if="icon === 'alert'" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <svg v-else width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
    </div>

    <h3 class="empty-state__title">{{ title }}</h3>
    <p class="empty-state__description" v-if="description">{{ description }}</p>

    <div class="empty-state__actions" v-if="$slots.actions">
      <slot name="actions" />
    </div>

    <div class="empty-state__search" v-if="showSearch && !$slots.actions">
      <input
        type="search"
        :placeholder="searchPlaceholder"
        v-model="searchQuery"
        @input="$emit('search', searchQuery)"
        class="empty-state__search-input"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  icon?: string
  title: string
  description?: string
  showSearch?: boolean
  searchPlaceholder?: string
  compact?: boolean
}>(), {
  icon: 'default',
  showSearch: false,
  searchPlaceholder: 'Buscar...',
  compact: false
})

const emit = defineEmits<{
  (e: 'search', query: string): void
}>()

const searchQuery = ref('')
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1.5rem;
  color: #64748b;
}

.empty-state--compact {
  padding: 1.5rem 1rem;
}

.empty-state--compact .empty-state__icon {
  width: 48px;
  height: 48px;
}

.empty-state--compact .empty-state__icon svg {
  width: 24px;
  height: 24px;
}

.empty-state--compact .empty-state__title {
  font-size: 1rem;
}

.empty-state--compact .empty-state__description {
  font-size: 0.875rem;
}

.empty-state__icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 50%;
  color: #94a3b8;
}

.empty-state__icon svg {
  width: 40px;
  height: 40px;
}

.empty-state__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.empty-state__description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1.25rem 0;
  max-width: 400px;
  line-height: 1.5;
}

.empty-state__actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.empty-state__search {
  margin-top: 1rem;
  width: 100%;
  max-width: 320px;
}

.empty-state__search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  transition: all 0.2s;
}

.empty-state__search-input:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.empty-state__search-input::placeholder {
  color: #94a3b8;
}
</style>
