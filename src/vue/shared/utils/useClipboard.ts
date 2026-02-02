import { ref } from 'vue'

export function useClipboard() {
  const copied = ref(false)
  const error = ref<string | null>(null)
  const text = ref('')

  async function copy(content: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(content)
      text.value = content
      copied.value = true
      error.value = null

      setTimeout(() => {
        copied.value = false
      }, 2000)

      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error al copiar'
      copied.value = false
      return false
    }
  }

  async function copyElement(elementId: string): Promise<boolean> {
    const element = document.getElementById(elementId)
    if (!element) {
      error.value = 'Elemento no encontrado'
      return false
    }

    const textToCopy = element.innerText || element.textContent
    return copy(textToCopy)
  }

  function reset() {
    copied.value = false
    error.value = null
    text.value = ''
  }

  return {
    copied: readonly(copied),
    error: readonly(error),
    text: readonly(text),
    copy,
    copyElement,
    reset
  }
}

function readonly<T>(ref: { value: T }): { value: T } {
  return ref
}
