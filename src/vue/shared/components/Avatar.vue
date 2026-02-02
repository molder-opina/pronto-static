<template>
  <div class="avatar" :class="[`avatar--${size}`, { 'avatar--rounded': rounded }]">
    <img v-if="src" :src="src" :alt="alt" class="avatar__image" @error="handleError" />
    <span v-else-if="initials" class="avatar__initials">{{ initials }}</span>
    <div v-else class="avatar__placeholder">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </div>
    <span v-if="status" class="avatar__status" :class="[`avatar__status--${status}`]"></span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'small' | 'medium' | 'large' | 'xl'
  rounded?: boolean
  status?: 'online' | 'offline' | 'busy' | 'away'
}>(), {
  size: 'medium',
  rounded: true
})

const imageError = ref(false)

const initials = computed(() => {
  if (!props.name) return ''
  const parts = props.name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return props.name.slice(0, 2).toUpperCase()
})

function handleError() {
  imageError.value = true
}
</script>

<style scoped>
.avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  color: #64748b;
  font-weight: 500;
  overflow: hidden;
}

.avatar--xs {
  width: 24px;
  height: 24px;
  font-size: 0.625rem;
}

.avatar--small {
  width: 32px;
  height: 32px;
  font-size: 0.75rem;
}

.avatar--medium {
  width: 40px;
  height: 40px;
  font-size: 0.875rem;
}

.avatar--large {
  width: 48px;
  height: 48px;
  font-size: 1rem;
}

.avatar--xl {
  width: 64px;
  height: 64px;
  font-size: 1.25rem;
}

.avatar--rounded {
  border-radius: 50%;
}

.avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar__initials {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.avatar__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.avatar__placeholder svg {
  width: 50%;
  height: 50%;
  opacity: 0.5;
}

.avatar__status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 25%;
  height: 25%;
  min-width: 8px;
  min-height: 8px;
  border-radius: 50%;
  border: 2px solid white;
}

.avatar__status--online {
  background: #22c55e;
}

.avatar__status--offline {
  background: #9ca3af;
}

.avatar__status--busy {
  background: #ef4444;
}

.avatar__status--away {
  background: #f59e0b;
}
</style>
