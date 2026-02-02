import { ref, computed } from 'vue'

export function useToggle(initialValue: boolean = false) {
  const state = ref(initialValue)

  const value = computed({
    get: () => state.value,
    set: (val: boolean) => {
      state.value = val
    }
  })

  function toggle() {
    state.value = !state.value
  }

  function set(value: boolean) {
    state.value = value
  }

  function on() {
    state.value = true
  }

  function off() {
    state.value = false
  }

  return {
    state,
    value,
    toggle,
    set,
    on,
    off
  }
}
