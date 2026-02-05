Estas reglas complementan `AGENTS.md` raíz; no lo reemplazan.

## Reglas UI: normalización /api

Normalización UI (en este orden):
Reemplazar interpolaciones JS: ${...} → {var}
Convertir placeholders URL-encoded: %7B...%7D (case-insensitive) → {var}
Remover querystring: cortar en ?
Normalizar slashes: //+ → /
Asegurar leading /
Remover trailing / (salvo root /)

---

## Employees Frontend: HTTP

1. API canonica: `"/api/*"` solamente (prohibido `"/{scope}/api/*"`).
2. Prohibido rewrite de `"/api/*"` hacia `"/{scope}/api/*"`.
3. Wrapper oficial: `pronto-static/src/vue/employees/core/http.ts`.
4. Mutaciones (`POST|PUT|PATCH|DELETE`) a `"/api/*"`:
   - Deben usar wrapper (ej: `requestJSON`/`csrfFetch`).
   - Prohibido `fetch`/`axios` mutador directo fuera del wrapper.
5. Credenciales:
   - Canon: `credentials: 'include'`.
   - Prohibido: `credentials: 'same-origin'`.

## Employees Frontend: CSRF

1. Token canonico: `<meta name="csrf-token" ...>`.
2. Header canonico: `X-CSRFToken`.
3. Regla dura: TODA mutacion incluye `X-CSRFToken` (incluye `FormData` upload).
4. `FormData` upload no debe setear `Content-Type` manualmente.

## Gates (anti-regresion)

1. Prohibir `credentials: 'same-origin'`:
   - `rg -n "credentials:\\s*['\\\"]same-origin['\\\"]" pronto-static/src/vue/employees`
2. Detectar `fetch` mutador directo (debe ser 0 fuera del wrapper):
   - `rg -n "fetch\\(.*?/api/.*method:\\s*['\\\"](POST|PUT|PATCH|DELETE)['\\\"]" pronto-static/src/vue/employees -g'*.{ts,vue,html}'`
3. Detectar `axios` mutador directo (debe ser 0 fuera del wrapper):
   - `rg -n "axios\\.(post|put|patch|delete)\\(" pronto-static/src/vue/employees`
