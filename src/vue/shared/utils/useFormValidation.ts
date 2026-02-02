import { reactive } from 'vue'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  email?: boolean
  custom?: (value: any) => string | null
}

export interface ValidationErrors {
  [key: string]: string | null
}

export interface FormField {
  value: any
  rules: ValidationRule
  label?: string
}

export function useFormValidation(fields: Record<string, FormField>) {
  const errors = reactive<ValidationErrors>({})
  const touched = reactive<Record<string, boolean>>({})
  const dirty = reactive<Record<string, boolean>>({})

  for (const key in fields) {
    errors[key] = null
    touched[key] = false
    dirty[key] = false
  }

  const validators = {
    required: (value: any): string | null => {
      if (Array.isArray(value)) return value.length > 0 ? null : 'Este campo es requerido'
      if (typeof value === 'boolean') return value ? null : 'Este campo es requerido'
      return (value !== null && value !== undefined && value !== '') ? null : 'Este campo es requerido'
    },

    email: (value: string): string | null => {
      if (!value) return null
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) ? null : 'Ingresa un correo válido'
    },

    minLength: (min: number) => (value: string): string | null => {
      if (!value) return null
      return value.length >= min ? null : `Mínimo ${min} caracteres`
    },

    maxLength: (max: number) => (value: string): string | null => {
      if (!value) return null
      return value.length <= max ? null : `Máximo ${max} caracteres`
    },

    min: (min: number) => (value: number): string | null => {
      if (value === null || value === undefined) return null
      return value >= min ? null : `El valor debe ser mayor a ${min}`
    },

    max: (max: number) => (value: number): string | null => {
      if (value === null || value === undefined) return null
      return value <= max ? null : `El valor debe ser menor a ${max}`
    },

    pattern: (regex: RegExp, message?: string) => (value: string): string | null => {
      if (!value) return null
      return regex.test(value) ? null : (message || 'Formato inválido')
    },

    custom: (fn: (value: any) => string | null) => (value: any): string | null => fn(value)
  }

  function validateField(fieldName: string): boolean {
    const field = fields[fieldName]
    if (!field) return true

    const value = field.value
    const rules = field.rules
    let error: string | null = null

    if (rules.required) {
      error = validators.required(value)
    }

    if (!error && value) {
      if (rules.email) {
        error = validators.email(value)
      }

      if (!error && rules.minLength) {
        error = validators.minLength(rules.minLength)(value)
      }

      if (!error && rules.maxLength) {
        error = validators.maxLength(rules.maxLength)(value)
      }

      if (!error && rules.min !== undefined) {
        error = validators.min(rules.min)(value)
      }

      if (!error && rules.max !== undefined) {
        error = validators.max(rules.max)(value)
      }

      if (!error && rules.pattern) {
        error = validators.pattern(rules.pattern)(value)
      }

      if (!error && rules.custom) {
        error = rules.custom(value)
      }
    }

    errors[fieldName] = error
    return !error
  }

  function validateAll(): boolean {
    let isValid = true
    for (const key in fields) {
      if (!validateField(key)) {
        isValid = false
      }
    }
    return isValid
  }

  function getError(fieldName: string): string | null {
    return errors[fieldName]
  }

  function setError(fieldName: string, error: string) {
    errors[fieldName] = error
  }

  function clearError(fieldName: string) {
    errors[fieldName] = null
  }

  function clearAllErrors() {
    for (const key in errors) {
      errors[key] = null
    }
  }

  function touch(fieldName: string) {
    touched[fieldName] = true
  }

  function markDirty(fieldName: string) {
    dirty[fieldName] = true
  }

  function isTouched(fieldName: string): boolean {
    return touched[fieldName]
  }

  function isDirty(fieldName: string): boolean {
    return dirty[fieldName]
  }

  function hasError(fieldName: string): boolean {
    return !!errors[fieldName]
  }

  function isValid(fieldName: string): boolean {
    return !errors[fieldName]
  }

  function isFormValid(): boolean {
    for (const key in errors) {
      if (errors[key]) return false
    }
    return true
  }

  function reset() {
    for (const key in fields) {
      errors[key] = null
      touched[key] = false
      dirty[key] = false
    }
  }

  function onBlur(fieldName: string) {
    touch(fieldName)
    validateField(fieldName)
  }

  function onInput(fieldName: string) {
    markDirty(fieldName)
    if (touched[fieldName]) {
      validateField(fieldName)
    }
  }

  return {
    errors: readonly(errors),
    touched: readonly(touched),
    dirty: readonly(dirty),
    validators,
    validateField,
    validateAll,
    getError,
    setError,
    clearError,
    clearAllErrors,
    touch,
    markDirty,
    isTouched,
    isDirty,
    hasError,
    isValid,
    isFormValid,
    reset,
    onBlur,
    onInput
  }
}

function readonly<T extends object>(obj: T): Readonly<T> {
  return obj as Readonly<T>
}
