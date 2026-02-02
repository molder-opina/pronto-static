<template>
  <div class="select-field" :class="[`select-field--${size}`, { 'select-field--error': error, 'select-field--disabled': disabled }]">
    <label v-if="label" :for="selectId" class="select-field__label">
      {{ label }}
      <span v-if="required" class="select-field__required">*</span>
    </label>
    
    <div class="select-field__wrapper">
      <select
        :id="selectId"
        ref="selectRef"
        :value="modelValue"
        :disabled="disabled"
        :name="name"
        :multiple="multiple"
        class="select-field__select"
        :class="{ 'select-field__select--placeholder': placeholder && !modelValue }"
        @change="handleChange"
        @blur="handleBlur"
        @focus="handleFocus"
      >
        <option v-if="placeholder && !multiple" value="" disabled>
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
      
      <div class="select-field__arrow">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>
    </div>
    
    <p v-if="error" class="select-field__error-text">{{ error }}</p>
    <p v-else-if="hint" class="select-field__hint">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  modelValue: string | number | string[] | number[]
  options: SelectOption[]
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  name?: string
  id?: string
  disabled?: boolean
  required?: boolean
  size?: 'small' | 'medium' | 'large'
  multiple?: boolean
}>(), {
  size: 'medium',
  disabled: false,
  required: false,
  multiple: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | string[] | number[]): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'change', value: string | number | string[] | number[]): void
}>()

const selectRef = ref<HTMLSelectElement | null>(null)
const selectId = computed(() => props.id || `select-${Math.random().toString(36).slice(2)}`)

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  if (props.multiple) {
    const selectedValues = Array.from(target.selectedOptions).map(opt => opt.value)
    emit('update:modelValue', selectedValues)
    emit('change', selectedValues)
  } else {
    emit('update:modelValue', target.value)
    emit('change', target.value)
  }
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function focus() {
  selectRef.value?.focus()
}

defineExpose({ focus, select: selectRef })
</script>

<style scoped>
.select-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
}

.select-field__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.select-field__required {
  color: #ef4444;
  margin-left: 0.25rem;
}

.select-field__wrapper {
  position: relative;
}

.select-field__select {
  width: 100%;
  appearance: none;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1f2937;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.select-field__select:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.select-field__select:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
  color: #9ca3af;
}

.select-field__select--placeholder {
  color: #9ca3af;
}

.select-field__arrow {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #94a3b8;
  display: flex;
  align-items: center;
}

.select-field__select[multiple] + .select-field__arrow {
  display: none;
}

.select-field--error .select-field__select {
  border-color: #ef4444;
}

.select-field--error .select-field__select:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.select-field--disabled .select-field__select {
  background: #f3f4f6;
  cursor: not-allowed;
}

.select-field__error-text {
  font-size: 0.8125rem;
  color: #ef4444;
  margin: 0;
}

.select-field__hint {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
}

.select-field--small .select-field__select {
  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
  font-size: 0.8125rem;
}

.select-field--medium .select-field__select {
  padding: 0.625rem 2.5rem 0.625rem 0.875rem;
  font-size: 0.875rem;
}

.select-field--large .select-field__select {
  padding: 0.75rem 3rem 0.75rem 1rem;
  font-size: 1rem;
}

.select-field__select[multiple] {
  padding: 0.5rem;
  min-height: 100px;
}
</style>
