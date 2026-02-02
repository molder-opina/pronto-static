<template>
  <label class="toggle-switch" :class="[`toggle-switch--${size}`, { 'toggle-switch--disabled': disabled }]">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="toggle-switch__input"
      @change="handleChange"
    />
    <span class="toggle-switch__slider">
      <span v-if="modelValue" class="toggle-switch__icon toggle-switch__icon--on">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
      <span v-else class="toggle-switch__icon toggle-switch__icon--off">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </span>
    </span>
    <span v-if="label" class="toggle-switch__label">{{ label }}</span>
  </label>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  modelValue: boolean
  label?: string
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}>(), {
  size: 'medium',
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
.toggle-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
}

.toggle-switch--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.toggle-switch__input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.toggle-switch__slider {
  position: relative;
  display: flex;
  align-items: center;
  background: #d1d5db;
  border-radius: 9999px;
  transition: all 0.2s;
}

.toggle-switch__input:checked + .toggle-switch__slider {
  background: #ff6b35;
}

.toggle-switch__input:focus-visible + .toggle-switch__slider {
  outline: 2px solid #ff6b35;
  outline-offset: 2px;
}

.toggle-switch__icon {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s;
}

.toggle-switch__icon--on {
  left: 4px;
  opacity: 1;
}

.toggle-switch__icon--off {
  right: 4px;
  opacity: 1;
}

.toggle-switch__input:checked + .toggle-switch__slider .toggle-switch__icon--on {
  opacity: 1;
  transform: scale(1);
}

.toggle-switch__input:checked + .toggle-switch__slider .toggle-switch__icon--off {
  opacity: 0;
  transform: scale(0.5);
}

.toggle-switch__input:not(:checked) + .toggle-switch__slider .toggle-switch__icon--on {
  opacity: 0;
  transform: scale(0.5);
}

.toggle-switch__input:not(:checked) + .toggle-switch__slider .toggle-switch__icon--off {
  opacity: 1;
  transform: scale(1);
}

.toggle-switch__label {
  font-size: 0.875rem;
  color: #374151;
}

.toggle-switch--small .toggle-switch__slider {
  width: 36px;
  height: 20px;
}

.toggle-switch--small .toggle-switch__slider::before {
  content: '';
  position: absolute;
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
}

.toggle-switch--small .toggle-switch__input:checked + .toggle-switch__slider::before {
  transform: translateX(16px);
}

.toggle-switch--small .toggle-switch__icon svg {
  width: 10px;
  height: 10px;
}

.toggle-switch--medium .toggle-switch__slider {
  width: 44px;
  height: 24px;
}

.toggle-switch--medium .toggle-switch__slider::before {
  content: '';
  position: absolute;
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
}

.toggle-switch--medium .toggle-switch__input:checked + .toggle-switch__slider::before {
  transform: translateX(20px);
}

.toggle-switch--large .toggle-switch__slider {
  width: 52px;
  height: 28px;
}

.toggle-switch--large .toggle-switch__slider::before {
  content: '';
  position: absolute;
  height: 24px;
  width: 24px;
  left: 2px;
  bottom: 2px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s;
}

.toggle-switch--large .toggle-switch__input:checked + .toggle-switch__slider::before {
  transform: translateX(24px);
}

.toggle-switch--large .toggle-switch__icon svg {
  width: 14px;
  height: 14px;
}

.toggle-switch--disabled .toggle-switch__slider {
  background: #e5e7eb;
}
</style>
