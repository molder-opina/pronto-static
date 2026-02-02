import { onMounted, onUnmounted, type Ref } from 'vue'

export interface KeybindOptions {
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean
  preventDefault?: boolean
}

export interface KeybindHandler {
  key: string
  options?: KeybindOptions
  callback: (event: KeyboardEvent) => void
}

export function useKeybind(
  elementRef: Ref<HTMLElement | null | undefined>,
  keybinds: KeybindHandler[]
) {
  const element = elementRef.value

  function handleKeydown(event: KeyboardEvent) {
    if (element && !element.contains(event.target as Node)) {
      return
    }

    for (const bind of keybinds) {
      if (event.key.toLowerCase() === bind.key.toLowerCase()) {
        const opts = bind.options || {}

        if ((opts.ctrl && !event.ctrlKey && !event.metaKey) ||
            (!opts.ctrl && (event.ctrlKey || event.metaKey))) {
          continue
        }

        if ((opts.alt && !event.altKey) || (!opts.alt && event.altKey)) {
          continue
        }

        if ((opts.shift && !event.shiftKey) || (!opts.shift && event.shiftKey)) {
          continue
        }

        if ((opts.meta && !event.metaKey) || (!opts.meta && event.metaKey)) {
          continue
        }

        if (opts.preventDefault) {
          event.preventDefault()
        }

        bind.callback(event)
        return
      }
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
}

export function useGlobalKeybind(keybinds: KeybindHandler[]) {
  function handleKeydown(event: KeyboardEvent) {
    for (const bind of keybinds) {
      if (event.key.toLowerCase() === bind.key.toLowerCase()) {
        const opts = bind.options || {}

        if ((opts.ctrl && !event.ctrlKey && !event.metaKey) ||
            (!opts.ctrl && (event.ctrlKey || event.metaKey))) {
          continue
        }

        if ((opts.alt && !event.altKey) || (!opts.alt && event.altKey)) {
          continue
        }

        if ((opts.shift && !event.shiftKey) || (!opts.shift && event.shiftKey)) {
          continue
        }

        if ((opts.meta && !event.metaKey) || (!opts.meta && event.metaKey)) {
          continue
        }

        if (opts.preventDefault) {
          event.preventDefault()
        }

        bind.callback(event)
        return
      }
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
}
