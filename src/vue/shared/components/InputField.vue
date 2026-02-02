<template>
  <div class="input-field" :class="[`input-field--${size}`, { 'input-field--error': error, 'input-field--disabled': disabled }]">
    <label v-if="label" :for="inputId" class="input-field__label">
      {{ label }}
      <span v-if="required" class="input-field__required">*</span>
    </label>
    
    <div class="input-field__wrapper">
      <div v-if="$slots.prefix" class="input-field__prefix">
        <slot name="prefix" />
      </div>
      
      <input
        :id="inputId"
        ref="inputRef"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :name="name"
        :autocomplete="autocomplete"
        :maxlength="maxlength"
        :minlength="minlength"
        :pattern="pattern"
        class="input-field__input"
        :class="{ 'input-field__input--with-prefix': $slots.prefix, 'input-field__input--with-suffix': $slots.suffix }"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="$emit('keydown', $event)"
      />
      
      <div v-if="$slots.suffix" class="input-field__suffix">
        <slot name="suffix" />
      </div>
      
      <div v-if="loading" class="input-field__loading">
        <div class="input-field__spinner"></div>
      </div>
      
      <div v-if="showClear && modelValue" class="input-field__clear" @click="clear">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
    </div>
    
    <p v-if="error" class="input-field__error-text">{{ error }}</p>
    <p v-else-if="hint" class="input-field__hint">{{ hint }}</p>
    <p v-else-if="maxlength && modelValue" class="input-field__counter">
      {{ (modelValue || '').length }}/{{ maxlength }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  name?: string
  id?: string
  autocomplete?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  size?: 'small' | 'medium' | 'large'
  maxlength?: number
  minlength?: number
  pattern?: string
  loading?: boolean
  showClear?: boolean
}>(), {
  type: 'text',
  size: 'medium',
  disabled: false,
  readonly: false,
  required: false,
  loading: false,
  showClear: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'clear'): void
  (e: 'keydown', event: KeyboardEvent): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const inputId = computed(() => props.id || `input-${Math.random().toString(36).slice(2)}`)

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function clear() {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

function focus() {
  inputRef.value?.focus()
}

defineExpose({ focus, input: inputRef })

onMounted(() => {
  if (props.autofocus && inputRef.value) {
    inputRef.value.focus()
  }
})
</script>

<style scoped>
.input-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
}

.input-field__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.input-field__required {
  color: #ef4444;
  margin-left: 0.25rem;
}

.input-field__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-field__prefix,
.input-field__suffix {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.input-field__prefix {
  padding-left: 0.75rem;
}

.input-field__suffix {
  padding-right: 0.75rem;
}

.input-field__input {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1f2937;
  background: white;
  transition: all 0.2s;
}

.input-field__input:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.input-field__input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
  color: #9ca3af;
}

.input-field__input::placeholder {
  color: #9ca3af;
}

.input-field__input--with-prefix {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.input-field__input--with-suffix {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.input-field__loading,
.input-field__clear {
  position: absolute;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.15s;
}

.input-field__clear:hover {
  color: #64748b;
}

.input-field__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top-color: #ff6b35;
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.input-field--error .input-field__input {
  border-color: #ef4444;
}

.input-field--error .input-field__input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input-field--disabled .input-field__input {
  background: #f3f4f6;
  cursor: not-allowed;
}

.input-field__error-text {
  font-size: 0.8125rem;
  color: #ef4444;
  margin: 0;
}

.input-field__hint {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
}

.input-field__counter {
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
  text-align: right;
}

.input-field--small .input-field__input {
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
}

.input-field--medium .input-field__input {
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
}

.input-field--large .input-field__input {
  padding: 0.75rem 1rem;
  font-size: 1rem;
}
</style>
