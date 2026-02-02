interface FetchOptions extends RequestInit {
  showLoading?: boolean
}

export async function fetchJSON<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  if (options.showLoading !== false) {
    (window as typeof window & { GlobalLoading?: { start(): void; stop(): void } }).GlobalLoading?.start()
  }

  try {
    const response = await fetch(url.startsWith('http') ? url : url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    return result as T
  } finally {
    if (options.showLoading !== false) {
      (window as typeof window & { GlobalLoading?: { start(): void; stop(): void } }).GlobalLoading?.stop()
    }
  }
}

export function useApi() {
  return {
    get: <T = unknown>(url: string, options?: FetchOptions) =>
      fetchJSON<T>(url, { ...options, method: 'GET' }),
    post: <T = unknown>(url: string, body: unknown, options?: FetchOptions) =>
      fetchJSON<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
    put: <T = unknown>(url: string, body: unknown, options?: FetchOptions) =>
      fetchJSON<T>(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
    delete: <T = unknown>(url: string, options?: FetchOptions) =>
      fetchJSON<T>(url, { ...options, method: 'DELETE' })
  }
}
