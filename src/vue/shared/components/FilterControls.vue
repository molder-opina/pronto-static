<template>
  <div class="filter-controls">
    <div v-for="group in filterGroups" :key="group.key" class="filter-group">
      <h4 v-if="group.label" class="filter-group-title">{{ group.label }}</h4>
      <div class="filter-options">
        <label
          v-for="option in group.options"
          :key="option.value"
          class="filter-option"
          :class="{ 'filter-option--checkbox': group.type === 'checkbox', 'filter-option--radio': group.type === 'radio' }"
        >
          <input
            type="checkbox"
            v-if="group.type === 'checkbox'"
            :value="option.value"
            v-model="selectedValues[group.key]"
            @change="emitChange"
          />
          <input
            type="radio"
            v-else
            :name="group.key"
            :value="option.value"
            v-model="selectedValues[group.key]"
            @change="emitChange"
          />
          <span class="filter-option-label">
            <span v-if="option.icon" class="filter-option-icon">{{ option.icon }}</span>
            {{ option.label }}
          </span>
          <span v-if="option.count !== undefined" class="filter-option-count">{{ option.count }}</span>
        </label>
      </div>
    </div>
    <div v-if="hasActiveFilters" class="filter-actions">
      <button class="filter-clear-btn" @click="clearAll">
        Limpiar filtros
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from 'vue'

export interface FilterOption {
  value: string | number
  label: string
  icon?: string
  count?: number
}

export interface FilterGroup {
  key: string
  label?: string
  type: 'checkbox' | 'radio'
  options: FilterOption[]
}

const props = withDefaults(defineProps<{
  groups: FilterGroup[]
  modelValue?: Record<string, any>
}>(), {
  modelValue: () => ({})
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
  (e: 'change', value: Record<string, any>): void
}>()

const selectedValues = reactive<Record<string, any>>({})

function initializeValues() {
  props.groups.forEach(group => {
    if (group.type === 'checkbox') {
      selectedValues[group.key] = props.modelValue[group.key] || []
    } else {
      selectedValues[group.key] = props.modelValue[group.key] || 'all'
    }
  })
}

function emitChange() {
  emit('update:modelValue', { ...selectedValues })
  emit('change', { ...selectedValues })
}

function clearAll() {
  props.groups.forEach(group => {
    if (group.type === 'checkbox') {
      selectedValues[group.key] = []
    } else {
      selectedValues[group.key] = 'all'
    }
  })
  emit('update:modelValue', { ...selectedValues })
  emit('change', { ...selectedValues })
}

const hasActiveFilters = computed(() => {
  return props.groups.some(group => {
    if (group.type === 'checkbox') {
      return selectedValues[group.key]?.length > 0
    }
    return selectedValues[group.key] !== 'all'
  })
})

const filterGroups = computed(() => props.groups)

watch(() => props.modelValue, (newValue) => {
  initializeValues()
}, { immediate: true, deep: true })
</script>

<style scoped>
.filter-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group-title {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  margin: 0;
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 0.875rem;
  color: #475569;
}

.filter-option:hover {
  background: #f1f5f9;
}

.filter-option input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #ff6b35;
}

.filter-option-label {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.filter-option-icon {
  font-size: 1rem;
}

.filter-option-count {
  font-size: 0.75rem;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
}

.filter-actions {
  padding-top: 0.5rem;
  border-top: 1px solid #e2e8f0;
}

.filter-clear-btn {
  background: none;
  border: none;
  color: #ff6b35;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.25rem 0;
  transition: color 0.15s;
}

.filter-clear-btn:hover {
  color: #e85a2b;
  text-decoration: underline;
}
</style>
