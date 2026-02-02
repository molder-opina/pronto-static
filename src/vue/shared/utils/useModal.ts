import { ref, computed, type Ref } from 'vue'

export interface ModalState {
  isOpen: boolean
  data: any
}

export function useModal<T = any>(initialData: T | null = null) {
  const state = ref<ModalState>({
    isOpen: false,
    data: initialData
  }) as Ref<ModalState>

  const isOpen = computed(() => state.value.isOpen)
  const data = computed(() => state.value.data)

  function open(modalData?: T) {
    state.value.isOpen = true
    if (modalData !== undefined) {
      state.value.data = modalData
    }
  }

  function close() {
    state.value.isOpen = false
    state.value.data = null
  }

  function toggle() {
    if (state.value.isOpen) {
      close()
    } else {
      open()
    }
  }

  function setData(modalData: T) {
    state.value.data = modalData
  }

  function reset() {
    state.value.isOpen = false
    state.value.data = null
  }

  return {
    state,
    isOpen,
    data,
    open,
    close,
    toggle,
    setData,
    reset
  }
}
