export interface RequestOptions<TBody = unknown> {
  method?: string;
  body?: TBody;
  headers?: Record<string, string>;
}

/**
 * Verifica si la respuesta indica una sesión inválida (401/403) y redirige al login.
 * Esta función puede ser llamada desde cualquier lugar que use fetch directamente.
 * @param response - La respuesta de fetch a verificar
 * @returns true si la sesión es válida, false si fue redirigido al login
 */
export function checkAuthAndRedirect(response: Response): boolean {
  if (response.status === 401) {
    if (typeof window.showToast === 'function') {
      window.showToast('Tu sesión ha expirado. Por favor inicia sesión nuevamente.', 'warning');
    }
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
    return false;
  }

  if (response.status === 403) {
    // Redirigir a pantalla de error de autorización
    const reason = 'El usuario firmado no tiene permiso para acceder a este recurso.';
    window.location.href = `/authorization-error?code=403&message=${encodeURIComponent(reason)}&from=${encodeURIComponent(window.location.pathname)}`;
    return false;
  }

  return true;
}

/**
 * Wrapper de fetch que automáticamente verifica la autenticación.
 * Usar esta función en lugar de fetch() para tener verificación automática de sesión.
 */
export async function authenticatedFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const finalInit: RequestInit = { credentials: 'include', ...(init || {}) };
  const response = await fetch(input, finalInit);
  checkAuthAndRedirect(response);
  return response;
}

export async function requestJSON<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  { method = 'GET', body, headers = {} }: RequestOptions<TBody> = {}
): Promise<TResponse> {
  const finalEndpoint = endpoint;

  // Add CSRF token for non-GET requests
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  const upperMethod = method.toUpperCase();
  const isMutating = !['GET', 'HEAD', 'OPTIONS'].includes(upperMethod);
  if (isMutating && !csrfToken) {
    throw new Error('CSRF token missing (meta[name="csrf-token"])');
  }

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const isStringBody = typeof body === 'string';

  const requestHeaders: Record<string, string> =
    body && !isFormData ? { 'Content-Type': 'application/json', ...headers } : { ...headers };

  if (csrfToken && isMutating) {
    requestHeaders['X-CSRFToken'] = csrfToken;
  }

  const response = await fetch(finalEndpoint, {
    method,
    headers: requestHeaders,
    body: body
      ? isFormData
        ? (body as unknown as BodyInit)
        : isStringBody
          ? (body as unknown as BodyInit)
          : JSON.stringify(body)
      : undefined,
    credentials: 'include',
  });

  let data: unknown = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    // Detectar sesión inválida y redirigir al login
    if (!checkAuthAndRedirect(response)) {
      throw new Error('Sesión expirada');
    }

    const message =
      (data as { error?: string }).error || `Error ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  // Canon: pronto_shared.serializers.success_response wraps payload in {status,data,error}.
  // Back-compat: some callers expect `response.data.*`, others expect payload flattened at top-level.
  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, unknown>;
    if (obj.status === 'success' && 'data' in obj) {
      const payload = obj.data as unknown;
      if (typeof payload === 'object' && payload !== null && !Array.isArray(payload)) {
        return { ...(payload as Record<string, unknown>), status: 'success', data: payload } as TResponse;
      }
      return payload as TResponse;
    }
  }

  return data as TResponse;
}
