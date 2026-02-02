# Estructura Recomendada para Contenido Estático

## 📁 Estructura Propuesta

```
pronto-static/
├── src/
│   ├── vue/                          # Código fuente TypeScript/Vue
│   │   ├── shared/                   # ✅ TypeScript compartido
│   │   │   ├── lib/                  # Biblioteca de utilidades
│   │   │   │   ├── formatting.ts     # formatCurrency, formatDateTime
│   │   │   │   └── constants.ts      # constantes globales
│   │   │   ├── domain/               # Lógica de dominio compartida
│   │   │   │   └── table-code.ts     # códigos de mesa (AREA-MNN)
│   │   │   ├── types/                # TypeScript types compartidos
│   │   │   │   └── index.ts
│   │   │   ├── utils/                # Composables/ayudantes
│   │   │   └── components/           # Componentes Vue compartidos
│   │   ├── clients/                  # App Vue Client
│   │   │   ├── components/           # Componentes específicos
│   │   │   ├── core/                 # Núcleo de la app
│   │   │   ├── modules/              # Módulos de lógica
│   │   │   ├── entrypoints/          # Puntos de entrada
│   │   │   ├── store/                # Estado
│   │   │   └── types/                # Tipos
│   │   └── employees/                # App Vue Employees
│   │       ├── components/           # Componentes específicos
│   │       ├── core/                 # Núcleo de la app
│   │       ├── modules/              # Módulos de lógica
│   │       └── entrypoints/          # Puntos de entrada
│   │
│   └── static_content/               # Archivos estáticos (servidos por nginx)
│       ├── assets/                   # Todos los assets
│       │   ├── css/                   # Hojas de estilo
│       │   │   ├── shared/            # ✅ CSS compartido
│       │   │   │   ├── base.css       # Reset, variables, utilities
│       │   │   │   ├── components.css  # Componentes reutilizables (botones, cards)
│       │   │   │   ├── utilities.css   # Utility classes
│       │   │   │   ├── README.md
│       │   │   │   └── components/
│       │   │   │       └── empty-state.css
│       │   │   ├── clients/           # CSS específico de clientes
│       │   │   │   ├── menu.css
│       │   │   │   ├── checkout.css
│       │   │   │   └── components/
│       │   │   └── employees/         # CSS específico de empleados
│       │   │       ├── dashboard.css
│       │   │       ├── tables.css
│       │   │       └── components/
│       │   │
│       │   ├── js/                    # JavaScript compilado (output de Vite)
│       │   │   ├── shared/            # ✅ JS compartido (vanilla)
│       │   │   │   ├── loading.js
│       │   │   │   ├── pagination.js
│       │   │   │   ├── keyboard-shortcuts.js
│       │   │   │   └── notifications.js
│       │   │   ├── clients/           # JS compilado de clients
│       │   │   │   └── chunks/        # Code splitting
│       │   │   └── employees/         # JS compilado de employees
│       │   │       └── chunks/
│       │   │
│       │   ├── pronto/                # ✅ Branding y assets del sistema
│       │   │   ├── branding/          # Branding por restaurante
│       │   │   ├── menu/              # Assets de menú
│       │   │   ├── products/          # Assets de productos
│       │   │   └── avatars/           # Avatares
│       │   │
│       │   ├── images/               # Imágenes generales
│       │   ├── audio/                # Audio
│       │   └── lib/                  # Librerías estáticas (UMD/min)
│       │
│       └── branding/                 # Carpeta vacía (legacy)
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── nginx.conf
```

## 🎯 Organización por Capas

### Capa 1: TypeScript/Vue Source (`src/vue/`)

Propósito: Código fuente que se compila a JS

```
src/vue/
├── shared/           # Código compartido entre apps
│   ├── lib/         # Utilidades generales (reutilizables)
│   ├── domain/      # Lógica de negocio compartida
│   ├── types/       # TypeScript types compartidos
│   ├── utils/       # Composables/ayudantes
│   └── components/  # Componentes Vue compartidos
├── clients/         # App específica de clientes
└── employees/       # App específica de empleados
```

### Capa 2: Compiled Output (`src/static_content/assets/js/`)

Propósito: Output de compilación (no editar manualmente)

```
assets/js/
├── clients/         # Output de vite build --target clients
└── employees/       # Output de vite build --target employees
```

### Capa 3: Static Assets (`src/static_content/assets/`)

Propósito: Archivos servidos directamente por nginx

```
assets/
├── css/             # Hojas de estilo (pueden ser editadas)
├── pronto/          # Branding e imágenes del sistema
├── images/          # Imágenes generales
├── audio/           # Audio
├── lib/             # Librerías estáticas
└── js/              # Output de compilación + JS compartido
```

## 📦 ¿Crear una librería de contenido estático?

### ✅ **SÍ RECOMENDADO** para TypeScript/Vue shared

**Qué incluir en la librería:**

```typescript
// @pronto/frontend-shared (ejemplo de nombre de paquete)
src/vue/shared/
├── lib/
│   ├── formatting.ts      # ✅ Reutilizable
│   └── constants.ts       # ✅ Reutilizable
├── domain/
│   └── table-code.ts      # ✅ Dominio compartido
├── types/
│   └── index.ts           # ✅ Types compartidos
├── utils/                 # ✅ Composables/ayudantes
└── components/            # ✅ Componentes Vue compartidos
```

**Opciones de implementación:**

#### Opción A: Monorepo con Workspaces (Recomendado)
```json
// package.json (raíz)
{
  "name": "pronto-monorepo",
  "workspaces": [
    "packages/*"
  ],
  "private": true
}

// packages/frontend-shared/package.json
{
  "name": "@pronto/frontend-shared",
  "version": "1.0.0",
  "main": "./dist/index.ts",
  "types": "./dist/index.d.ts"
}
```

**Ventajas:**
- ✅ Versionamiento unificado
- ✅ Desarrollo en paralelo
- ✅ Shared linking automático
- ✅ Facilita testing

#### Opción B: Paquete NPM Separado
```json
// @pronto/frontend-shared (public or private registry)
{
  "name": "@pronto/frontend-shared",
  "version": "1.0.0",
  "publishConfig": {
    "registry": "https://npm.your-registry.com"
  }
}
```

**Ventajas:**
- ✅ Reutilizable en otros proyectos
- ✅ Versionamiento semántico
- ✅ Publicación controlada

#### Opción C: Estructura Actual (Simple)
```typescript
// Mantener src/vue/shared/ como carpeta compartida
// Usar alias en vite.config.ts:
resolve: {
  alias: {
    '@shared': path.resolve(__dirname, 'src/vue/shared')
  }
}
```

**Ventajas:**
- ✅ Más simple de implementar
- ✅ Sin overhead de workspaces
- ✅ Funciona bien actualmente

**Cuándo usar cada opción:**

| Opción | Usar cuando... |
|--------|---------------|
| **Opción A (Workspaces)** | Proyecto crece, múltiples apps frontend |
| **Opción B (NPM Separado)** | Reutilización en múltiples proyectos |
| **Opción C (Actual)** | Proyecto actual, simple y directo |

### ❌ **NO RECOMENDADO** para Assets estáticos

**Assets estáticos (imágenes, CSS, fuentes) NO deberían ser una librería separada:**

```
assets/
├── pronto/branding/       # ❌ NO separar en librería
├── pronto/menu/           # ❌ NO separar en librería
├── pronto/products/       # ❌ NO separar en librería
├── pronto/avatars/        # ❌ NO separar en librería
├── css/shared/            # ❌ NO separar en librería
├── images/                # ❌ NO separar en librería
├── audio/                 # ❌ NO separar en librería
└── lib/                   # ❌ NO separar en librería
```

**Razones:**

1. **Archivos binarios** - Difícil de versionar como código
2. **Tamaño** - Imágenes son pesadas para librerías
3. **Branding específico** - Cada restaurante tiene su branding
4. **Nginx directo** - Mejor servir archivos estáticos directamente

**Mejor enfoque:**
- Mantener en `src/static_content/assets/`
- Usar rutas relativas en código
- Sincronizar con scripts si es necesario

## 🔧 Implementación Recomendada (Actual)

### 1. Reorganizar `src/vue/shared/`

```typescript
src/vue/shared/
├── lib/
│   ├── formatting.ts     # Utilidades de formato
│   └── constants.ts      # Constantes globales
├── domain/
│   └── table-code.ts     # Códigos de mesa
├── types/
│   └── index.ts          # Tipos compartidos
├── utils/                # Composables/ayudantes
└── components/           # Componentes Vue compartidos
```

### 2. Crear barrel exports

```typescript
// src/vue/shared/lib/index.ts
export * from './formatting';
export * from './constants';

// src/vue/shared/domain/index.ts
export * from './table-code';

// src/vue/shared/types/index.ts
// Tipos definidos en este mismo archivo.

// src/vue/shared/index.ts
export * from './lib';
export * from './domain';
export * from './types';
```

### 3. Configurar alias en Vite

```typescript
// vite.config.ts
resolve: {
  alias: {
    '@shared': path.resolve(__dirname, 'src/vue/shared'),
    '@clients': path.resolve(__dirname, 'src/vue/clients'),
    '@employees': path.resolve(__dirname, 'src/vue/employees'),
  },
}
```

### 4. Usar en código

```typescript
// Import desde cualquier app
import { formatCurrency, validateTableCode } from '@shared';
import { OrderStatus } from '@shared/types';
import { parseTableCode } from '@shared/domain';
```

## 🎨 Estructura de CSS Compartido

```css
/* assets/css/shared/base.css */
:root {
  /* Colores base */
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  --color-success: #22c55e;
  --color-error: #ef4444;
  --color-warning: #f59e0b;

  /* Espaciado */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Tipografía */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;

  /* Bordes */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}

/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-sans);
  line-height: 1.6;
  color: var(--color-primary);
}

/* assets/css/shared/base.css */
h1, h2, h3, h4, h5, h6 {
  line-height: 1.2;
  margin-bottom: var(--spacing-md);
}

.text-sm { font-size: 0.875rem; }
.text-md { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }

/* assets/css/shared/components.css */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-secondary {
  background-color: var(--color-secondary);
  color: white;
}

.card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: var(--spacing-lg);
}

/* assets/css/shared/utilities.css */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-sm { gap: var(--spacing-sm); }
.gap-md { gap: var(--spacing-md); }

.text-center { text-align: center; }
.text-right { text-align: right; }

.hidden { display: none; }
```

## 📊 Comparación de Enfoques

| Aspecto | Carpeta Compartida (Actual) | Librería NPM | Workspaces |
|---------|---------------------------|--------------|------------|
| **Complejidad** | ✅ Baja | ⚠️ Media | ⚠️ Alta |
| **Versionamiento** | ⚠️ Manual | ✅ Semántico | ✅ Unificado |
| **Reutilización** | ❌ Solo en repo | ✅ Multi-proyecto | ✅ Multi-app |
| **Testing** | ⚠️ Parcial | ✅ Independiente | ✅ Integrado |
| **Build time** | ✅ Rápido | ⚠️ Publicación | ⚠️ Linking |
| **Mantenimiento** | ✅ Simple | ✅ Semántico | ✅ Coordinado |

## 🚀 Recomendación Final

### Para el proyecto actual:

1. **Mantener estructura actual** `src/vue/shared/`
2. **Reorganizar** en `lib/`, `domain/`, `types/`
3. **Agregar** barrel exports
4. **Configurar** alias en Vite
5. **Crear** CSS compartido en `assets/css/shared/`

### Para futuro (cuando crezca):

1. **Migrar a workspaces** si se agregan más apps frontend
2. **Extraer** a paquete NPM si se usa en otros proyectos
3. **Mantener** assets estáticos en `src/static_content/assets/`

## 📝 Acciones Inmediatas

```bash
# 1. Crear estructura de shared
mkdir -p src/vue/shared/{lib,domain,types}

# 2. Mover archivos existentes
mv src/vue/shared/formatting.ts src/vue/shared/lib/
mv src/vue/shared/table-code.ts src/vue/shared/domain/

# 3. Crear barrel exports
# (ver ejemplo arriba)

# 4. Configurar alias en vite.config.ts
# (ver ejemplo arriba)

# 5. Crear CSS compartido
mkdir -p src/static_content/assets/css/shared
# (crear archivos base.css, components.css, utilities.css, etc.)

# 6. Eliminar directorio redundante
rm -rf src/vue/clients/shared/
```

## 🔗 Referencias

- [Vite Path Aliases](https://vitejs.dev/config/shared-options.html#resolve-alias)
- [TypeScript Barrel Exports](https://basarat.gitbook.io/typescript/main-1/barrel)
- [NPM Workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces)
- [Monorepo Patterns](https://monorepo.tools/)
