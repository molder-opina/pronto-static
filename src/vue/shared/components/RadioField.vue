<template>
  <label class="radio-field" :class="{ 'radio-field--disabled': disabled }">
    <input
      type="radio"
      :checked="modelValue === value"
      :disabled="disabled"
      :name="name"
      :value="value"
      class="radio-field__input"
      @change="handleChange"
    />
    <span class="radio-field__circle">
      <span v-if="modelValue === value" class="radio-field__dot"></span>
    </span>
    <span v-if="label || $slots.default" class="radio-field__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: string | number | boolean
  value: string | number | boolean
  label?: string
  name?: string
  disabled?: boolean
}>(), {
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number | boolean): void
  (e: 'change', value: string | number | boolean): void
}>()

function handleChange() {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped>
.radio-field {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
  user-select: none;
}

.radio-field--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.radio-field__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.radio-field__circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  background: white;
  transition: all 0.2s;
  flex-shrink: 0;
}

.radio-field__dot {
  width: 10px;
  height: 10px;
  background: #ff6b35;
  border-radius: 50%;
}

.radio-field__input:checked + .radio-field__circle {
  border-color: #ff6b35;
}

.radio-field__input:focus-visible + .radio-field__circle {
  outline: 2px solid #ff6b35;
  outline-offset: 2px;
}

.radio-field--disabled .radio-field__circle {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.radio-field--disabled .radio-field__input:checked + .radio-field__circle {
  border-color: #9ca3af;
}

.radio-field--disabled .radio-field__input:checked + .radio-field__circle .radio-field__dot {
  background: #9ca3af;
}

.radio-field__label {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.4;
}
</style>
