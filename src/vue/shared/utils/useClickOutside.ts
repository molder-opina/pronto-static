import { onMounted, onUnmounted, type Ref } from 'vue'

export function useClickOutside(
  elementRef: Ref<HTMLElement | null | undefined>,
  callback: (event: MouseEvent | TouchEvent) => void,
  options?: {
    ignoreRefs?: Ref<HTMLElement | null | undefined>[]
  }
) {
  function handleClickOutside(event: MouseEvent | TouchEvent) {
    const target = event.target as Node
    
    if (!elementRef.value) return
    
    if (elementRef.value.contains(target)) return
    
    if (options?.ignoreRefs) {
      for (const ref of options.ignoreRefs) {
        if (ref.value?.contains(target)) return
      }
    }
    
    callback(event)
  }

  onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside)
    document.removeEventListener('touchstart', handleClickOutside)
  })
}
