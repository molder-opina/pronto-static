import { ref, watch, type Ref } from 'vue'

export function useDebounce<T>(value: Ref<T>, delay: number = 300) {
  const debouncedValue = ref(value.value) as Ref<T>
  let timeout: number | null = null

  watch(value, (newValue) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = window.setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return debouncedValue
}

export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeout: number | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = window.setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export function useDebouncePromise<T, R>(
  fn: (value: T) => Promise<R>,
  delay: number = 300
): (value: T) => Promise<R> {
  let timeout: number | null = null
  let latestValue: T | null = null

  return async function (value: T): Promise<R> {
    latestValue = value

    if (timeout) {
      clearTimeout(timeout)
    }

    return new Promise((resolve) => {
      timeout = window.setTimeout(async () => {
        const valueToProcess = latestValue
        if (valueToProcess !== null) {
          try {
            const result = await fn(valueToProcess)
            resolve(result)
          } catch (error) {
            console.error('Debounced function error:', error)
            throw error
          }
        }
      }, delay)
    })
  }
}
