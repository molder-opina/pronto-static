# Pronto Static Assets

Container nginx que sirve assets estáticos (CSS, JS, imágenes) compilados desde Vue.

## Estructura

```
src/
├── static_content/
│   ├── Dockerfile          # Build: compila Vue → nginx
│   ├── nginx.conf          # Configuración nginx
│   ├── index.html
│   ├── styles.css
│   └── assets/             # Assets compilados
│       ├── css/
│       │   ├── employees/
│       │   └── clients/
│       └── js/
│           ├── employees/
│           └── clients/
└── vue/                    # Fuentes Vue
    ├── employees/
    └── clients/
```

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

- `node_modules/` está excluido del git por defecto
- Para builds offline o más rápidos, puedes incluirlo:

  ```bash
  # Comentar en .gitignore:
  # node_modules/

  # Luego commitearlos si lo deseas
  git add node_modules && git commit -m "Add node_modules for offline builds"
  ```

- Docker usa caché de capas, así que las dependencias se cachean automáticamente hasta que `package.json` cambie
