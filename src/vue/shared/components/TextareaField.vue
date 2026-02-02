<template>
  <div class="textarea-field" :class="[`textarea-field--${size}`, { 'textarea-field--error': error, 'textarea-field--disabled': disabled }]">
    <label v-if="label" :for="textareaId" class="textarea-field__label">
      {{ label }}
      <span v-if="required" class="textarea-field__required">*</span>
    </label>
    
    <textarea
      :id="textareaId"
      ref="textareaRef"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :name="name"
      :rows="rows"
      :maxlength="maxlength"
      :minlength="minlength"
      :wrap="wrap"
      class="textarea-field__textarea"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
      @keydown="$emit('keydown', $event)"
    ></textarea>
    
    <div v-if="maxlength || showCounter" class="textarea-field__footer">
      <p v-if="error" class="textarea-field__error-text">{{ error }}</p>
      <p v-else-if="hint" class="textarea-field__hint">{{ hint }}</p>
      <span v-if="maxlength" class="textarea-field__counter">
        {{ (modelValue || '').length }}/{{ maxlength }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  name?: string
  id?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  size?: 'small' | 'medium' | 'large'
  rows?: number
  maxlength?: number
  minlength?: number
  wrap?: 'soft' | 'hard' | 'off'
  showCounter?: boolean
}>(), {
  size: 'medium',
  rows: 3,
  disabled: false,
  readonly: false,
  required: false,
  wrap: 'soft',
  showCounter: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
  (e: 'keydown', event: KeyboardEvent): void
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const textareaId = computed(() => props.id || `textarea-${Math.random().toString(36).slice(2)}`)

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function focus() {
  textareaRef.value?.focus()
}

function resize(direction: 'horizontal' | 'vertical' | 'both' | 'none') {
  if (!textareaRef.value) return
  
  if (direction === 'none') {
    textareaRef.value.style.resize = 'none'
  } else if (direction === 'horizontal') {
    textareaRef.value.style.resize = 'horizontal'
  } else if (direction === 'vertical') {
    textareaRef.value.style.resize = 'vertical'
  } else {
    textareaRef.value.style.resize = 'both'
  }
}

defineExpose({ focus, resize, textarea: textareaRef })
</script>

<style scoped>
.textarea-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
}

.textarea-field__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.textarea-field__required {
  color: #ef4444;
  margin-left: 0.25rem;
}

.textarea-field__textarea {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1f2937;
  background: white;
  resize: vertical;
  transition: all 0.2s;
  font-family: inherit;
}

.textarea-field__textarea:focus {
  outline: none;
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.textarea-field__textarea:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
  color: #9ca3af;
  resize: none;
}

.textarea-field__textarea::placeholder {
  color: #9ca3af;
}

.textarea-field__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.textarea-field--error .textarea-field__textarea {
  border-color: #ef4444;
}

.textarea-field--error .textarea-field__textarea:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.textarea-field--disabled .textarea-field__textarea {
  background: #f3f4f6;
  cursor: not-allowed;
}

.textarea-field__error-text {
  font-size: 0.8125rem;
  color: #ef4444;
  margin: 0;
}

.textarea-field__hint {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0;
}

.textarea-field__counter {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-left: auto;
}

.textarea-field--small .textarea-field__textarea {
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  min-height: 60px;
}

.textarea-field--medium .textarea-field__textarea {
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  min-height: 80px;
}

.textarea-field--large .textarea-field__textarea {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  min-height: 100px;
}
</style>
