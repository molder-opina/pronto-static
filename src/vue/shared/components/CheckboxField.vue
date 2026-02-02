<template>
  <label class="checkbox-field" :class="{ 'checkbox-field--disabled': disabled }">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :name="name"
      :value="value"
      class="checkbox-field__input"
      @change="handleChange"
    />
    <span class="checkbox-field__box">
      <svg v-if="modelValue" class="checkbox-field__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>
    <span v-if="label || $slots.default" class="checkbox-field__label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: boolean
  label?: string
  name?: string
  value?: string | number
  disabled?: boolean
}>(), {
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const checked = target.checked
  emit('update:modelValue', checked)
  emit('change', checked)
}
</script>

<style scoped>
.checkbox-field {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-field--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.checkbox-field__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.checkbox-field__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  transition: all 0.2s;
  flex-shrink: 0;
}

.checkbox-field__check {
  width: 14px;
  height: 14px;
  color: white;
}

.checkbox-field__input:checked + .checkbox-field__box {
  background: #ff6b35;
  border-color: #ff6b35;
}

.checkbox-field__input:focus-visible + .checkbox-field__box {
  outline: 2px solid #ff6b35;
  outline-offset: 2px;
}

.checkbox-field--disabled .checkbox-field__box {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.checkbox-field--disabled .checkbox-field__input:checked + .checkbox-field__box {
  background: #9ca3af;
  border-color: #9ca3af;
}

.checkbox-field__label {
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.4;
}
</style>
