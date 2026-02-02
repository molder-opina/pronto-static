import { ref, watch, type Ref } from 'vue'

interface StorageRef<T> extends Ref<T> {
  remove: () => void
}

export function useStorage<T>(key: string, defaultValue: T): StorageRef<T> {
  const storedValue = ref(defaultValue) as Ref<T>

  function getStoredValue(): T {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        return JSON.parse(item)
      }
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e)
    }
    return defaultValue
  }

  function setStoredValue(value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.warn(`Error setting localStorage key "${key}":`, e)
    }
  }

  storedValue.value = getStoredValue()

  watch(storedValue, (newValue) => {
    setStoredValue(newValue)
  }, { deep: true })

  function remove(): void {
    try {
      localStorage.removeItem(key)
      storedValue.value = defaultValue
    } catch (e) {
      console.warn(`Error removing localStorage key "${key}":`, e)
    }
  }

  const storageRef = storedValue as StorageRef<T>
  storageRef.remove = remove
  return storageRef
}

export function useSessionStorage<T>(key: string, defaultValue: T): StorageRef<T> {
  const storedValue = ref(defaultValue) as Ref<T>

  function getStoredValue(): T {
    try {
      const item = sessionStorage.getItem(key)
      if (item) {
        return JSON.parse(item)
      }
    } catch (e) {
      console.warn(`Error reading sessionStorage key "${key}":`, e)
    }
    return defaultValue
  }

  function setStoredValue(value: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.warn(`Error setting sessionStorage key "${key}":`, e)
    }
  }

  storedValue.value = getStoredValue()

  watch(storedValue, (newValue) => {
    setStoredValue(newValue)
  }, { deep: true })

  function remove(): void {
    try {
      sessionStorage.removeItem(key)
      storedValue.value = defaultValue
    } catch (e) {
      console.warn(`Error removing sessionStorage key "${key}":`, e)
    }
  }

  const storageRef = storedValue as StorageRef<T>
  storageRef.remove = remove
  return storageRef
}
