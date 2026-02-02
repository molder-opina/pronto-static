# Pronto Static Assets

Container nginx que sirve assets estáticos (CSS, JS, imágenes) compilados desde Vue.

## Estructura

```
src/
├── static_content/           # Archivos estáticos (servidos por nginx)
│   ├── Dockerfile            # Build: compila Vue → nginx
│   ├── nginx.conf            # Configuración nginx
│   ├── index.html
│   ├── styles.css
│   └── assets/               # Assets compilados y recursos
│       ├── css/
│       │   ├── shared/       # ✅ CSS compartido (base, components, utilities)
│       │   │   ├── base.css
│       │   │   ├── components.css
│       │   │   └── utilities.css
│       │   ├── employees/    # CSS específico de employees
│       │   └── clients/      # CSS específico de clients
│       ├── js/               # JavaScript compilado (output de Vite)
│       │   ├── employees/     # Output de vite build --target employees
│       │   └── clients/      # Output de vite build --target clients
│       ├── pronto/            # ✅ Branding y assets del sistema
│       │   ├── branding/     # Branding por restaurante
│       │   ├── menu/         # Assets de menú
│       │   ├── products/     # Assets de productos
│       │   └── avatars/      # Avatares
│       ├── images/           # Imágenes generales
│       ├── audio/            # Audio
│       └── lib/              # Librerías estáticas (UMD/min)
│
└── vue/                      # Fuentes TypeScript/Vue
    ├── shared/               # ✅ Código compartido (TypeScript)
    │   ├── lib/              # Utilidades (formatting, constants)
    │   ├── domain/           # Lógica de dominio (table-code)
    │   ├── types/            # TypeScript types compartidos
    │   ├── utils/            # Composables/ayudantes (useToggle, useFetch, etc.)
    │   └── components/       # Componentes Vue compartidos
    ├── employees/            # App Vue Employees
    │   ├── components/
    │   ├── core/
    │   ├── modules/
    │   └── entrypoints/
    └── clients/              # App Vue Clients
        ├── components/
        ├── core/
        ├── modules/
        ├── entrypoints/
        ├── store/
        └── types/
```

## Código Compartido

### TypeScript/Vue Shared (`src/vue/shared/`)

Utilidades y lógica compartida entre employees y clients:

```typescript
// Importar en cualquier app
import { formatCurrency, formatDateTime } from '@shared/lib';
import { buildTableCode, parseTableCode } from '@shared/domain';
import { OrderStatus, TableType } from '@shared/types';
```

**Contenido:**
- `lib/` - Utilidades generales (formatCurrency, constants)
- `domain/` - Lógica de dominio (table-code)
- `types/` - TypeScript types compartidos

### CSS Shared (`assets/css/shared/`)

Estilos CSS compartidos y reutilizables:

```html
<!-- Importar en tu HTML -->
<link rel="stylesheet" href="/assets/css/shared/base.css">
<link rel="stylesheet" href="/assets/css/shared/components.css">
<link rel="stylesheet" href="/assets/css/shared/utilities.css">
```

**Contenido:**
- `base.css` - Variables globales, reset, estilos base
- `components.css` - Componentes reutilizables (botones, cards, modales)
- `utilities.css` - Clases de utilidad (flexbox, spacing, colors)

Para más información, ver [CSS Shared README](./src/static_content/assets/css/shared/README.md).

## Desarrollo

```bash
# Instalar dependencias
pnpm install

# Compilar ambos targets
pnpm build

# Compilar solo empleados
PRONTO_TARGET=employees pnpm build

# Compilar solo clientes
PRONTO_TARGET=clients pnpm build

# Modo desarrollo (con hot reload)
PRONTO_TARGET=employees pnpm dev:employees
PRONTO_TARGET=clients pnpm dev:clients
```

## Producción

```bash
# Build Docker
docker build -t pronto-static ./src/static_content

# O con docker-compose
docker-compose up -d static
```

## Notas

- `node_modules/` **no** está excluido por defecto (la regla está comentada en `.gitignore`).
- Si quieres excluirlo, descomenta la línea `node_modules/` en `.gitignore`.

- Docker usa caché de capas, así que las dependencias se cachean automáticamente hasta que `package.json` cambie
